package main

import (
	"context"
	"sort"
	"strings"
	"testing"

	"github.com/bufbuild/protocompile"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/reflect/protodesc"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/types/descriptorpb"
	"google.golang.org/protobuf/types/pluginpb"
)

// compileRequest compiles proto sources in-memory and wraps them in a
// CodeGeneratorRequest, exactly as buf/protoc would hand it to the plugin: the
// proto_file is the full transitive closure (deps first) and file_to_generate
// is the named files. This lets the tests exercise the real
// findExtension -> collectMessages -> readMetadata pipeline.
func compileRequest(t *testing.T, sources map[string]string, target string, paths ...string) *pluginpb.CodeGeneratorRequest {
	t.Helper()
	compiler := protocompile.Compiler{
		Resolver: protocompile.WithStandardImports(&protocompile.SourceResolver{
			Accessor: protocompile.SourceAccessorFromMap(sources),
		}),
	}
	files, err := compiler.Compile(context.Background(), paths...)
	if err != nil {
		t.Fatalf("compile protos: %v", err)
	}
	var protos []*descriptorpb.FileDescriptorProto
	seen := map[string]bool{}
	var walk func(fd protoreflect.FileDescriptor)
	walk = func(fd protoreflect.FileDescriptor) {
		if seen[fd.Path()] {
			return
		}
		seen[fd.Path()] = true
		imports := fd.Imports()
		for i := 0; i < imports.Len(); i++ {
			walk(imports.Get(i).FileDescriptor)
		}
		protos = append(protos, protodesc.ToFileDescriptorProto(fd))
	}
	for _, f := range files {
		walk(f)
	}
	// Re-encode each descriptor through the STANDARD descriptor types so the
	// custom field_metadata option lands in unknown fields — exactly how
	// buf/protoc hand options to a plugin. (protocompile would otherwise leave
	// it pre-resolved, masking the re-decode readMetadata must perform.)
	for i, p := range protos {
		raw, err := proto.Marshal(p)
		if err != nil {
			t.Fatalf("marshal FileDescriptorProto: %v", err)
		}
		reparsed := &descriptorpb.FileDescriptorProto{}
		if err := proto.Unmarshal(raw, reparsed); err != nil {
			t.Fatalf("unmarshal FileDescriptorProto: %v", err)
		}
		protos[i] = reparsed
	}
	return &pluginpb.CodeGeneratorRequest{
		FileToGenerate: paths,
		Parameter:      proto.String("target=" + target),
		ProtoFile:      protos,
	}
}

const fieldMetadataProtoSrc = `
syntax = "proto2";
package meshtastic;
import "google/protobuf/descriptor.proto";
message FieldMetadata {
  optional bool diy_only = 1;
  optional bool admin_only = 2;
  optional double min_value = 3;
  optional double max_value = 4;
  optional string unit = 5;
  optional bool deprecated = 6;
}
extend google.protobuf.FieldOptions {
  optional FieldMetadata field_metadata = 51001;
}
`

// TestGenerateEndToEnd exercises the full option-reading path
// (findExtension -> collectMessages -> readMetadata) the way buf/protoc invoke
// the plugin. This is the part most likely to break on a Wire/proto change and
// is otherwise only verified by hand via `buf generate`.
func TestGenerateEndToEnd(t *testing.T) {
	req := compileRequest(t, map[string]string{
		"meshtastic/field_metadata.proto": fieldMetadataProtoSrc,
		"meshtastic/test.proto": `
syntax = "proto3";
package meshtastic;
import "meshtastic/field_metadata.proto";
message Outer {
  message Inner {
    uint32 pin = 3 [(meshtastic.field_metadata) = { diy_only: true, unit: "V" }];
    uint32 plain = 4;
  }
}
`,
	}, "python", "meshtastic/test.proto", "meshtastic/field_metadata.proto")

	resp, err := generate(req)
	if err != nil {
		t.Fatalf("generate: %v", err)
	}
	if resp.GetError() != "" {
		t.Fatalf("plugin returned error: %s", resp.GetError())
	}
	if len(resp.GetFile()) != 1 {
		t.Fatalf("want 1 generated file, got %d", len(resp.GetFile()))
	}
	out := resp.GetFile()[0].GetContent()

	mustContain(t, "e2e", out,
		// nested message walked, custom option decoded (bool + string), fields sorted
		`("meshtastic.Outer.Inner", 3): {"diy_only": True, "unit": "V"}`,
		"class Outer:",
		"class Inner:",
		`pin = {"diy_only": True, "unit": "V"}`,
	)
	// The un-annotated field (tag 4) must be skipped entirely.
	if strings.Contains(out, "plain") {
		t.Errorf("e2e: un-annotated field 'plain' must not appear:\n%s", out)
	}
}

// TestGenerateMirrorsDeprecated verifies that a field's standard
// `[deprecated = true]` option is mirrored into the registry as a
// `deprecated` attribute — with no (meshtastic.field_metadata) annotation
// required — and coexists with custom attributes on the same field.
func TestGenerateMirrorsDeprecated(t *testing.T) {
	sources := map[string]string{
		"meshtastic/field_metadata.proto": fieldMetadataProtoSrc,
		"meshtastic/test.proto": `
syntax = "proto3";
package meshtastic;
import "meshtastic/field_metadata.proto";
message M {
  uint32 old_pin = 1 [deprecated = true];
  uint32 rx_gpio = 2 [(meshtastic.field_metadata) = { diy_only: true }];
  uint32 both    = 3 [deprecated = true, (meshtastic.field_metadata) = { diy_only: true }];
  uint32 plain   = 4;
}
`,
	}

	// Python (dynamic table): deprecated-only field appears; attributes sort
	// alphabetically so "deprecated" precedes "diy_only" on the combined field.
	py := generateTo(t, sources, "python")
	mustContain(t, "deprecated-py", py,
		`("meshtastic.M", 1): {"deprecated": True}`,
		`("meshtastic.M", 2): {"diy_only": True}`,
		`("meshtastic.M", 3): {"deprecated": True, "diy_only": True}`,
	)
	if strings.Contains(py, `4): `) || strings.Contains(py, "plain") {
		t.Errorf("deprecated-py: un-annotated, non-deprecated field must be absent:\n%s", py)
	}

	// Rust (typed struct): the schema-declared `deprecated` field becomes a
	// struct member and is set on the mirrored entry.
	rust := generateTo(t, sources, "rust")
	mustContain(t, "deprecated-rust", rust,
		"pub deprecated: Option<bool>,",
		`("meshtastic.M", 1, FieldMetadata { diy_only: None, admin_only: None, min_value: None, max_value: None, unit: None, deprecated: Some(true) })`,
	)
}

// generateTo compiles the sources and runs the plugin for one target, returning
// the single generated file's content.
func generateTo(t *testing.T, sources map[string]string, target string) string {
	t.Helper()
	paths := make([]string, 0, len(sources))
	for p := range sources {
		paths = append(paths, p)
	}
	sort.Strings(paths)
	resp, err := generate(compileRequest(t, sources, target, paths...))
	if err != nil {
		t.Fatalf("generate(%s): %v", target, err)
	}
	if resp.GetError() != "" {
		t.Fatalf("plugin returned error for %s: %s", target, resp.GetError())
	}
	if len(resp.GetFile()) != 1 {
		t.Fatalf("want 1 generated file for %s, got %d", target, len(resp.GetFile()))
	}
	return resp.GetFile()[0].GetContent()
}

// TestGenerateNoExtensionEmitsNothing verifies that a module which does not
// define the field_metadata extension yields no output (rather than an error) —
// this keeps the plugin safe when buf splits, e.g., nanopb.proto into its own
// module.
func TestGenerateNoExtensionEmitsNothing(t *testing.T) {
	req := compileRequest(t, map[string]string{
		"plain.proto": `
syntax = "proto3";
package other;
message Thing { uint32 x = 1; }
`,
	}, "python", "plain.proto")

	resp, err := generate(req)
	if err != nil {
		t.Fatalf("generate: %v", err)
	}
	if resp.GetError() != "" {
		t.Fatalf("plugin returned error: %s", resp.GetError())
	}
	if len(resp.GetFile()) != 0 {
		t.Fatalf("want no generated files when the extension is absent, got %d", len(resp.GetFile()))
	}
}

// TestGenerateRejectsBadTarget covers the plugin's invocation contract: a
// missing or unknown `target` parameter must error. Target is validated before
// any descriptor work, so no proto is needed.
func TestGenerateRejectsBadTarget(t *testing.T) {
	for _, param := range []*string{nil, proto.String("target=java")} {
		if _, err := generate(&pluginpb.CodeGeneratorRequest{Parameter: param}); err == nil {
			t.Errorf("expected error for parameter %v, got nil", param)
		}
	}
}

// TestGenerateRejectsNonScalarAttribute verifies the scalar-only guard: a
// non-scalar FieldMetadata attribute (here a repeated field) must fail the build
// rather than emit meaningless, non-deterministic output.
func TestGenerateRejectsNonScalarAttribute(t *testing.T) {
	req := compileRequest(t, map[string]string{
		"meshtastic/field_metadata.proto": `
syntax = "proto2";
package meshtastic;
import "google/protobuf/descriptor.proto";
message FieldMetadata { repeated string tags = 1; }
extend google.protobuf.FieldOptions {
  optional FieldMetadata field_metadata = 51001;
}
`,
		"meshtastic/test.proto": `
syntax = "proto3";
package meshtastic;
import "meshtastic/field_metadata.proto";
message M { uint32 p = 1 [(meshtastic.field_metadata) = { tags: "a" }]; }
`,
	}, "python", "meshtastic/test.proto", "meshtastic/field_metadata.proto")

	if _, err := generate(req); err == nil {
		t.Fatal("expected error for non-scalar (repeated) FieldMetadata attribute, got nil")
	}
}
