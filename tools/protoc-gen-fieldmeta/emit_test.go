package main

import (
	"strings"
	"testing"

	"google.golang.org/protobuf/reflect/protoreflect"
)

// testSchema mirrors a FieldMetadata with one of each value kind we render.
var testSchema = []schemaField{
	{Name: "diy_only", Kind: protoreflect.BoolKind},
	{Name: "admin_only", Kind: protoreflect.BoolKind},
	{Name: "min_value", Kind: protoreflect.DoubleKind},
	{Name: "unit", Kind: protoreflect.StringKind},
}

var testEntries = []entry{
	// Single bool attribute.
	{MessageType: "meshtastic.Config.PositionConfig", TypePath: []string{"Config", "PositionConfig"}, FieldName: "rx_gpio", Tag: 8, Fields: []metaField{
		{Name: "diy_only", Value: true},
	}},
	// All attributes set (exercises float + string rendering and escaping).
	{MessageType: "meshtastic.Config.PositionConfig", TypePath: []string{"Config", "PositionConfig"}, FieldName: "tx_gpio", Tag: 9, Fields: []metaField{
		{Name: "admin_only", Value: true},
		{Name: "diy_only", Value: false},
		{Name: "min_value", Value: 1.5},
		{Name: "unit", Value: `m"s`}, // embedded quote -> exercises escaping
	}},
}

func mustContain(t *testing.T, lang, content string, subs ...string) {
	t.Helper()
	for _, s := range subs {
		if !strings.Contains(content, s) {
			t.Errorf("%s output missing %q\n---\n%s", lang, s, content)
		}
	}
}

func TestEmitC(t *testing.T) {
	_, out := emitC(testSchema, testEntries)
	mustContain(t, "c", out,
		"double min_value;",
		"const char * unit;",
		`.message_type = "meshtastic.Config.PositionConfig", .field_tag = 8, .diy_only = true`,
		".min_value = 1.5",
		`.unit = "m\"s"`,
		"#define MESHTASTIC_FIELD_METADATA_COUNT 2",
	)
}

func TestEmitPython(t *testing.T) {
	_, out := emitPython(testSchema, testEntries)
	mustContain(t, "python", out,
		// dynamic table
		`("meshtastic.Config.PositionConfig", 8): {"diy_only": True}`,
		`"min_value": 1.5`,
		`"unit": "m\"s"`,
		// namespaced accessors
		"class Config:",
		"class PositionConfig:",
		`rx_gpio = {"diy_only": True}`,
	)
}

func TestEmitTypeScript(t *testing.T) {
	_, out := emitTypeScript(testSchema, testEntries)
	mustContain(t, "ts", out,
		"minValue?: number;",
		"unit?: string;",
		// dynamic table
		`"meshtastic.Config.PositionConfig#8": { diyOnly: true },`,
		"minValue: 1.5",
		// namespaced accessors
		"export const Config = {",
		"PositionConfig: {",
		"rxGpio: { diyOnly: true } as FieldMetadata,",
	)
}

func TestEmitRust(t *testing.T) {
	_, out := emitRust(testSchema, testEntries)
	mustContain(t, "rust", out,
		"pub min_value: Option<f64>,",
		"pub unit: Option<&'static str>,",
		// Unset attributes are explicit None (a `static` needs a const expression,
		// so `..Default::default()` would not compile).
		"FieldMetadata { diy_only: Some(true), admin_only: None, min_value: None, unit: None }",
		"min_value: Some(1.5)",
		`unit: Some("m\"s")`,
	)
	if strings.Contains(out, "Default::default()") {
		t.Errorf("rust: statics require const exprs; Default::default() is not allowed:\n%s", out)
	}
	// namespaced accessors: nested modules, const reaches FieldMetadata via super::
	mustContain(t, "rust", out,
		"pub mod config {",
		"pub mod position_config {",
		"pub const RX_GPIO: super::super::FieldMetadata = super::super::FieldMetadata { diy_only: Some(true)",
	)
}

func TestEmitSwift(t *testing.T) {
	_, out := emitSwift(testSchema, testEntries)
	mustContain(t, "swift", out,
		"public var minValue: Double? = nil",
		// dynamic registry
		`FieldMetadata(diyOnly: true)`,
		"minValue: 1.5",
		// typed accessors as an extension on the real message type
		"extension Config.PositionConfig {",
		"public static var rxGpio: FieldMetadata { FieldMetadata(diyOnly: true) }",
	)
	// must NOT declare a parallel `Config` enum (that would collide with the
	// swift-protobuf-generated Config message in the same module).
	if strings.Contains(out, "public enum Config ") || strings.Contains(out, "public enum Config{") {
		t.Errorf("swift: must extend the real Config type, not declare a parallel enum:\n%s", out)
	}
}

func TestEmptyEntriesAreValid(t *testing.T) {
	// No annotated fields: every target must still emit syntactically valid output.
	for name, emit := range emitters {
		_, out := emit(testSchema, nil)
		if strings.TrimSpace(out) == "" {
			t.Errorf("%s: empty-entry output should not be blank", name)
		}
	}
	// C must not declare a zero-length array (non-standard); it falls back to COUNT 0.
	_, c := emitC(testSchema, nil)
	mustContain(t, "c-empty", c, "#define MESHTASTIC_FIELD_METADATA_COUNT 0", "return NULL;")
	// Rust empty struct literal must use the default tail.
	_, r := emitRust(testSchema, nil)
	if strings.Contains(r, "FIELD_METADATA: &[(&str, i32, FieldMetadata)] = &[\n];") == false {
		t.Errorf("rust empty slice not rendered as expected:\n%s", r)
	}
}

// TestEmitScalarValueRendering covers int values and an INTEGRAL float (2.0):
// only Rust/Swift must render the decimal point (decimalFloat's whole purpose);
// C/Python/TS render the bare number.
func TestEmitScalarValueRendering(t *testing.T) {
	schema := []schemaField{
		{Name: "min_value", Kind: protoreflect.DoubleKind},
		{Name: "weight", Kind: protoreflect.Int32Kind},
	}
	entries := []entry{{
		MessageType: "meshtastic.M", TypePath: []string{"M"}, FieldName: "f", Tag: 1,
		Fields: []metaField{
			{Name: "min_value", Value: 2.0}, // integral float
			{Name: "weight", Value: int64(7)},
		},
	}}

	_, c := emitC(schema, entries)
	mustContain(t, "c", c, "int64_t weight;", "double min_value;", ".min_value = 2", ".weight = 7")

	_, py := emitPython(schema, entries)
	mustContain(t, "python", py, `"min_value": 2`, `"weight": 7`)

	_, ts := emitTypeScript(schema, entries)
	mustContain(t, "ts", ts, "weight?: number;", "minValue: 2", "weight: 7")

	_, rust := emitRust(schema, entries)
	mustContain(t, "rust", rust, "pub weight: Option<i64>,", "min_value: Some(2.0)", "weight: Some(7)")

	_, swift := emitSwift(schema, entries)
	mustContain(t, "swift", swift, "public var weight: Int64? = nil", "minValue: 2.0", "weight: 7")
}

// TestEmitStringEscaping exercises backslash, newline and tab (not just the
// embedded quote covered elsewhere) across every target.
func TestEmitStringEscaping(t *testing.T) {
	schema := []schemaField{{Name: "unit", Kind: protoreflect.StringKind}}
	entries := []entry{{
		MessageType: "meshtastic.M", TypePath: []string{"M"}, FieldName: "f", Tag: 1,
		Fields: []metaField{{Name: "unit", Value: "a\\b\nc\td"}},
	}}
	for _, emit := range []emitter{emitC, emitPython, emitTypeScript, emitRust, emitSwift} {
		_, out := emit(schema, entries)
		mustContain(t, "escape", out, `a\\b\nc\td`)
	}
}

// TestEmitMultipleMessageTypes exercises cross-type namespacing and sorting
// (all other fixtures use a single message type).
func TestEmitMultipleMessageTypes(t *testing.T) {
	schema := []schemaField{{Name: "diy_only", Kind: protoreflect.BoolKind}}
	entries := []entry{
		{MessageType: "meshtastic.B", TypePath: []string{"B"}, FieldName: "y", Tag: 1, Fields: []metaField{{Name: "diy_only", Value: true}}},
		{MessageType: "meshtastic.A", TypePath: []string{"A"}, FieldName: "x", Tag: 1, Fields: []metaField{{Name: "diy_only", Value: true}}},
	}
	_, ts := emitTypeScript(schema, entries)
	mustContain(t, "ts-multi", ts, "export const A = {", "export const B = {")
	_, py := emitPython(schema, entries)
	mustContain(t, "py-multi", py, "class A:", "class B:")
	_, swift := emitSwift(schema, entries)
	mustContain(t, "swift-multi", swift, "extension A {", "extension B {")
}
