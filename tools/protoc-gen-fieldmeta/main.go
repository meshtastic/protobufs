// Command protoc-gen-fieldmeta is a protoc/buf plugin that reads the
// (meshtastic.field_metadata) custom field option from the schema and emits a
// static, reflection-free "field metadata registry" in a target language.
//
// It is the cross-language companion to the Kotlin/Wire SchemaHandler used by
// the KMP package: both turn the same proto option into a static table keyed by
// fully-qualified message name and field tag, so every consumer — including
// runtimes that strip options at runtime (nanopb/C, prost/Rust, Wire) — can
// query field metadata with no descriptor reflection and no runtime cost.
//
// The plugin reads the option DYNAMICALLY via protoreflect, so it needs no
// generated Go bindings and stays generic over the contents of the
// FieldMetadata message: adding a scalar attribute to field_metadata.proto
// requires no change here.
//
// Usage (buf.gen.yaml local plugin):
//
//   - local: protoc-gen-fieldmeta
//     out: <dir>
//     opt: target=c            # one of: c, python, typescript, rust, swift
package main

import (
	"fmt"
	"io"
	"os"
	"sort"
	"strings"

	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/reflect/protodesc"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/reflect/protoregistry"
	"google.golang.org/protobuf/types/descriptorpb"
	"google.golang.org/protobuf/types/dynamicpb"
	"google.golang.org/protobuf/types/pluginpb"
)

// fieldMetadataExtension is the fully-qualified name of the custom option that
// carries field metadata. Defined in meshtastic/field_metadata.proto.
const fieldMetadataExtension protoreflect.FullName = "meshtastic.field_metadata"

// deprecatedAttr is the FieldMetadata attribute mirrored from a field's standard
// (google.protobuf.FieldOptions) `deprecated` bit. It is generator-managed: we
// set it from that standard option rather than from the custom annotation, so
// existing `[deprecated = true]` fields flow into the registry with no per-field
// annotation. The FieldMetadata message declares a matching `deprecated` field
// so it shows up in every emitted/generated type (see field_metadata.proto).
const deprecatedAttr = "deprecated"

// schemaField describes one attribute of the FieldMetadata message (e.g.
// diy_only: bool). Read from the schema so typed-struct targets (C/Rust/Swift)
// stay in sync as attributes are added.
type schemaField struct {
	Name string
	Kind protoreflect.Kind
}

// metaField is one attribute value actually set on an annotated field.
type metaField struct {
	Name  string
	Value any // bool | float64 | int64 | string
}

// entry is one annotated proto field and its metadata.
type entry struct {
	MessageType string   // fully-qualified, e.g. "meshtastic.Config.PositionConfig"
	TypePath    []string // package-relative message path, e.g. ["Config", "PositionConfig"]
	FieldName   string   // proto field name, e.g. "rx_gpio"
	Tag         int32
	Fields      []metaField
}

// emitter renders the collected schema + entries into one generated file.
type emitter func(schema []schemaField, entries []entry) (filename, content string)

var emitters = map[string]emitter{
	"c":          emitC,
	"python":     emitPython,
	"typescript": emitTypeScript,
	"rust":       emitRust,
	"swift":      emitSwift,
}

func main() {
	in, err := io.ReadAll(os.Stdin)
	if err != nil {
		fail(fmt.Errorf("reading CodeGeneratorRequest: %w", err))
	}
	var req pluginpb.CodeGeneratorRequest
	if err := proto.Unmarshal(in, &req); err != nil {
		fail(fmt.Errorf("unmarshaling CodeGeneratorRequest: %w", err))
	}

	resp, err := generate(&req)
	if err != nil {
		resp = &pluginpb.CodeGeneratorResponse{Error: proto.String(err.Error())}
	}
	out, err := proto.Marshal(resp)
	if err != nil {
		fail(fmt.Errorf("marshaling CodeGeneratorResponse: %w", err))
	}
	if _, err := os.Stdout.Write(out); err != nil {
		fail(err)
	}
}

func fail(err error) {
	fmt.Fprintln(os.Stderr, "protoc-gen-fieldmeta:", err)
	os.Exit(1)
}

func generate(req *pluginpb.CodeGeneratorRequest) (*pluginpb.CodeGeneratorResponse, error) {
	params := parseParameter(req.GetParameter())
	target := params["target"]
	if target == "" {
		return nil, fmt.Errorf("missing required parameter 'target' (one of: c, python, typescript, rust, swift)")
	}
	emit, ok := emitters[target]
	if !ok {
		return nil, fmt.Errorf("unknown target %q (one of: c, python, typescript, rust, swift)", target)
	}

	files, err := protodesc.NewFiles(&descriptorpb.FileDescriptorSet{File: req.GetProtoFile()})
	if err != nil {
		return nil, fmt.Errorf("building descriptors: %w", err)
	}

	extType := findExtension(files, fieldMetadataExtension)
	if extType == nil {
		// This module doesn't define the field_metadata extension (e.g. buf
		// generates the option-free nanopb.proto as its own module), so there is
		// nothing to emit. Returning no files — rather than erroring — keeps the
		// plugin safe to run across a whole workspace.
		return &pluginpb.CodeGeneratorResponse{
			SupportedFeatures: proto.Uint64(uint64(pluginpb.CodeGeneratorResponse_FEATURE_PROTO3_OPTIONAL)),
		}, nil
	}

	// Resolver that knows our extension, used to re-decode each field's options
	// (built once; see readMetadata for why the round-trip is required).
	resolver := new(protoregistry.Types)
	if err := resolver.RegisterExtension(extType); err != nil {
		return nil, fmt.Errorf("registering %s extension: %w", fieldMetadataExtension, err)
	}

	// Only scan the files this invocation was asked to generate for, so we skip
	// google/protobuf/descriptor.proto, nanopb.proto, etc.
	toGen := make(map[string]bool, len(req.GetFileToGenerate()))
	for _, f := range req.GetFileToGenerate() {
		toGen[f] = true
	}

	var entries []entry
	var collectErr error
	files.RangeFiles(func(fd protoreflect.FileDescriptor) bool {
		if len(toGen) > 0 && !toGen[fd.Path()] {
			return true
		}
		if collectErr = collectMessages(fd.Messages(), extType, resolver, &entries); collectErr != nil {
			return false
		}
		return true
	})
	if collectErr != nil {
		return nil, collectErr
	}

	sort.Slice(entries, func(i, j int) bool {
		if entries[i].MessageType != entries[j].MessageType {
			return entries[i].MessageType < entries[j].MessageType
		}
		return entries[i].Tag < entries[j].Tag
	})

	schema, err := fieldMetadataSchema(extType)
	if err != nil {
		return nil, err
	}
	filename, content := emit(schema, entries)

	return &pluginpb.CodeGeneratorResponse{
		SupportedFeatures: proto.Uint64(uint64(pluginpb.CodeGeneratorResponse_FEATURE_PROTO3_OPTIONAL)),
		File: []*pluginpb.CodeGeneratorResponse_File{{
			Name:    proto.String(filename),
			Content: proto.String(content),
		}},
	}, nil
}

// findExtension resolves the field_metadata extension descriptor from the
// schema and wraps it as a dynamic ExtensionType (no generated bindings needed).
// Returns nil if the extension isn't defined in this invocation's schema.
func findExtension(files *protoregistry.Files, name protoreflect.FullName) protoreflect.ExtensionType {
	var found protoreflect.ExtensionDescriptor
	files.RangeFiles(func(fd protoreflect.FileDescriptor) bool {
		exts := fd.Extensions()
		for i := 0; i < exts.Len(); i++ {
			if e := exts.Get(i); e.FullName() == name {
				found = e
				return false
			}
		}
		return true
	})
	if found == nil {
		return nil
	}
	return dynamicpb.NewExtensionType(found)
}

// fieldMetadataSchema returns the FieldMetadata message's attributes in field
// order, read from the extension's message type. It enforces the scalar-only
// contract: a non-scalar attribute (message/enum/bytes/group, or a repeated/map
// field) is a hard error, since the emitters would otherwise render meaningless
// and non-deterministic values (e.g. pointer addresses) into checked-in output.
func fieldMetadataSchema(extType protoreflect.ExtensionType) ([]schemaField, error) {
	md := extType.TypeDescriptor().Message()
	if md == nil {
		return nil, nil
	}
	fields := md.Fields()
	out := make([]schemaField, 0, fields.Len())
	for i := 0; i < fields.Len(); i++ {
		f := fields.Get(i)
		if f.IsList() || f.IsMap() || !isScalarKind(f.Kind()) {
			return nil, fmt.Errorf(
				"%s.%s: field_metadata attributes must be scalar (bool/int/float/string); got %v (repeated=%t, map=%t)",
				md.FullName(), f.Name(), f.Kind(), f.IsList(), f.IsMap())
		}
		out = append(out, schemaField{Name: string(f.Name()), Kind: f.Kind()})
	}
	return out, nil
}

func isScalarKind(k protoreflect.Kind) bool {
	switch k {
	case protoreflect.BoolKind, protoreflect.StringKind, protoreflect.DoubleKind, protoreflect.FloatKind:
		return true
	}
	return isIntKind(k)
}

func collectMessages(msgs protoreflect.MessageDescriptors, extType protoreflect.ExtensionType, resolver *protoregistry.Types, out *[]entry) error {
	for i := 0; i < msgs.Len(); i++ {
		md := msgs.Get(i)
		// Package-relative path, e.g. meshtastic.Config.PositionConfig -> [Config, PositionConfig].
		rel := strings.TrimPrefix(string(md.FullName()), string(md.ParentFile().Package())+".")
		typePath := strings.Split(rel, ".")
		fields := md.Fields()
		for j := 0; j < fields.Len(); j++ {
			f := fields.Get(j)
			mf := readMetadata(f, extType, resolver)
			// `deprecated` is generator-managed: it mirrors the field's standard
			// option, and a hand-set value in the annotation is rejected rather
			// than merged — the generators would otherwise disagree about it (the
			// Swift plugin reads only the standard option), and the schema would
			// carry two sources of truth for the same fact.
			for _, a := range mf {
				if a.Name == deprecatedAttr {
					return fmt.Errorf(
						"%s.%s: the %q attribute is generator-managed and cannot be set in (meshtastic.field_metadata); mark the field `[deprecated = true]` instead and it is mirrored automatically",
						md.FullName(), f.Name(), deprecatedAttr)
				}
			}
			if fieldIsDeprecated(f) {
				mf = upsertBool(mf, deprecatedAttr, true)
			}
			if len(mf) == 0 {
				continue
			}
			*out = append(*out, entry{
				MessageType: string(md.FullName()),
				TypePath:    typePath,
				FieldName:   string(f.Name()),
				Tag:         int32(f.Number()),
				Fields:      mf,
			})
		}
		if err := collectMessages(md.Messages(), extType, resolver, out); err != nil { // nested message types
			return err
		}
	}
	return nil
}

// readMetadata returns the set attributes of the field_metadata option on a
// field, or nil if the field carries no such option.
//
// buf/protoc hand the plugin FieldOptions with our custom extension left as an
// UNKNOWN field — the standard descriptor types parsed from the request don't
// know it, so protodesc.NewFiles cannot resolve it. We therefore re-decode the
// options with a resolver that knows the extension before reading it. (The
// resolver is built once and passed in.)
func readMetadata(f protoreflect.FieldDescriptor, extType protoreflect.ExtensionType, resolver *protoregistry.Types) []metaField {
	opts := f.Options()
	if opts == nil {
		return nil
	}
	raw, err := proto.Marshal(opts)
	if err != nil {
		return nil
	}
	reopts := &descriptorpb.FieldOptions{}
	if err := (proto.UnmarshalOptions{Resolver: resolver}).Unmarshal(raw, reopts); err != nil {
		return nil
	}

	m := reopts.ProtoReflect()
	xtd := extType.TypeDescriptor()
	if !m.Has(xtd) {
		return nil
	}

	var fields []metaField
	m.Get(xtd).Message().Range(func(fd protoreflect.FieldDescriptor, v protoreflect.Value) bool {
		fields = append(fields, metaField{Name: string(fd.Name()), Value: goValue(fd, v)})
		return true
	})
	sort.Slice(fields, func(i, j int) bool { return fields[i].Name < fields[j].Name })
	return fields
}

// fieldIsDeprecated reports whether the field carries the standard
// `[deprecated = true]` option. This is a well-known FieldOptions field (not our
// custom extension), so it reads straight off the descriptor's options — no
// re-decode needed.
func fieldIsDeprecated(f protoreflect.FieldDescriptor) bool {
	if o, ok := f.Options().(*descriptorpb.FieldOptions); ok && o != nil {
		return o.GetDeprecated()
	}
	return false
}

// upsertBool sets attr to v (replacing any existing value) and keeps the
// attribute slice sorted by name, matching readMetadata's ordering so every
// target renders attributes deterministically.
func upsertBool(fields []metaField, attr string, v bool) []metaField {
	for i := range fields {
		if fields[i].Name == attr {
			fields[i].Value = v
			return fields
		}
	}
	fields = append(fields, metaField{Name: attr, Value: v})
	sort.Slice(fields, func(i, j int) bool { return fields[i].Name < fields[j].Name })
	return fields
}

func goValue(fd protoreflect.FieldDescriptor, v protoreflect.Value) any {
	switch fd.Kind() {
	case protoreflect.BoolKind:
		return v.Bool()
	case protoreflect.DoubleKind, protoreflect.FloatKind:
		return v.Float()
	case protoreflect.Int32Kind, protoreflect.Int64Kind, protoreflect.Sint32Kind,
		protoreflect.Sint64Kind, protoreflect.Sfixed32Kind, protoreflect.Sfixed64Kind:
		return v.Int()
	case protoreflect.Uint32Kind, protoreflect.Uint64Kind, protoreflect.Fixed32Kind,
		protoreflect.Fixed64Kind:
		return int64(v.Uint())
	default:
		return v.String()
	}
}

func parseParameter(param string) map[string]string {
	out := map[string]string{}
	for _, p := range strings.Split(param, ",") {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		if k, v, ok := strings.Cut(p, "="); ok {
			out[strings.TrimSpace(k)] = strings.TrimSpace(v)
		} else {
			out[p] = ""
		}
	}
	return out
}
