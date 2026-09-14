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

// TestEmitStringEscaping exercises backslash, newline, carriage return and tab
// (not just the embedded quote covered elsewhere) across every target. A raw CR
// inside a single-line literal is a syntax error in Swift, so it must be escaped
// like the newline is.
func TestEmitStringEscaping(t *testing.T) {
	schema := []schemaField{{Name: "unit", Kind: protoreflect.StringKind}}
	entries := []entry{{
		MessageType: "meshtastic.M", TypePath: []string{"M"}, FieldName: "f", Tag: 1,
		Fields: []metaField{{Name: "unit", Value: "a\\b\nc\rd\te"}},
	}}
	for _, emit := range []emitter{emitC, emitPython, emitTypeScript, emitRust, emitSwift} {
		_, out := emit(schema, entries)
		mustContain(t, "escape", out, `a\\b\nc\rd\te`)
		if strings.ContainsAny(out, "\r") {
			t.Errorf("escape: raw carriage return leaked into output:\n%s", out)
		}
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

// TestSwiftCamelCase pins agreement with swift-protobuf's
// NamingUtils.toLowerCamelCase. The Swift target must name properties exactly as
// protoc-gen-swift does, and a naive snake_case -> camelCase silently disagrees
// wherever a digit meets a letter. Expected values below are copied from real
// generated .pb.swift output, not from this implementation.
func TestSwiftCamelCase(t *testing.T) {
	cases := map[string]string{
		// the three that actually differ in the Meshtastic schema
		"use_12h_clock":          "use12HClock",
		"sx126x_rx_boosted_gain": "sx126XRxBoostedGain",
		"use_i2s_as_buzzer":      "useI2SAsBuzzer",
		// ordinary names, where naive camelCasing happens to agree
		"hop_limit":         "hopLimit",
		"config_ok_to_mqtt": "configOkToMqtt",
		"region":            "region",
		// digit runs and abbreviations
		"ipv4_config": "ipv4Config",
		"device_id":   "deviceID",
	}
	for in, want := range cases {
		if got := swiftCamelCase(in); got != want {
			t.Errorf("swiftCamelCase(%q) = %q, want %q", in, got, want)
		}
	}
	// TypeScript keeps the naive rule; the two must not be conflated.
	if snakeToCamel("use_12h_clock") == swiftCamelCase("use_12h_clock") {
		t.Error("snakeToCamel and swiftCamelCase should differ on use_12h_clock")
	}
}

// TestEnumValueEntries covers enum-value metadata: a picker's options and a
// bitfield's flags are enum values, and they share the registry and key format
// with fields. Swift is the interesting target, because an enum value cannot get
// a static accessor - the enum case of that name is already a static member - so
// it gets one instance property per enum type, resolved by rawValue.
func TestEnumValueEntries(t *testing.T) {
	schema := []schemaField{{Name: "label", Kind: protoreflect.StringKind}}
	entries := []entry{
		{
			Kind: kindField, MessageType: "meshtastic.Config.LoRaConfig",
			TypePath: []string{"Config", "LoRaConfig"}, FieldName: "modem_preset", Tag: 2,
			Fields: []metaField{{Name: "label", Value: "Preset"}},
		},
		{
			Kind: kindEnumValue, MessageType: "meshtastic.Config.LoRaConfig.ModemPreset",
			TypePath: []string{"Config", "LoRaConfig", "ModemPreset"}, FieldName: "LONG_FAST", Tag: 0,
			Fields: []metaField{{Name: "label", Value: "Long Range - Fast"}},
		},
	}
	_, out := emitSwift(schema, entries)

	mustContain(t, "swift-enum", out,
		// one instance property for the enum type, keyed on rawValue
		"extension Config.LoRaConfig.ModemPreset {",
		`public var metadata: FieldMetadata? { FieldMetadataRegistry.get("meshtastic.Config.LoRaConfig.ModemPreset", tag: rawValue) }`,
		// the value itself is a normal registry row, localized like any string
		`"meshtastic.Config.LoRaConfig.ModemPreset#0": FieldMetadata(label: String(localized: `+
			`"meshtastic.Config.LoRaConfig.ModemPreset.LONG_FAST.label", `+
			`defaultValue: "Long Range - Fast", `+
			`comment: "label of meshtastic.Config.LoRaConfig.ModemPreset.LONG_FAST")`,
		// fields keep their static accessors
		"public static var modemPreset: FieldMetadata {",
	)

	// A static named for the value would collide with the enum case of that name.
	if strings.Contains(out, "public static var longFast") {
		t.Errorf("swift: enum values must not get static accessors (collides with the case):\n%s", out)
	}

	// Every other target still renders both kinds without erroring.
	for name, emit := range map[string]emitter{"c": emitC, "python": emitPython, "typescript": emitTypeScript, "rust": emitRust} {
		_, o := emit(schema, entries)
		mustContain(t, name, o, "meshtastic.Config.LoRaConfig.ModemPreset")
	}
}

// TestSwiftArgsFollowSchemaOrder pins the ordering the Swift target needs. Its
// FieldMetadata properties are emitted in schema order, and Swift's memberwise
// initializer demands arguments in property-declaration order - so a field
// carrying several attributes will not compile if the literal uses the
// name-sorted order the other targets use. entry.Fields arrives name-sorted
// (readMetadata sorts it), and here that is deliberately the reverse of the
// schema, so a regression cannot pass by coincidence.
func TestSwiftArgsFollowSchemaOrder(t *testing.T) {
	schema := []schemaField{
		{Name: "zzz_first", Kind: protoreflect.BoolKind},
		{Name: "aaa_second", Kind: protoreflect.BoolKind},
	}
	entries := []entry{{
		MessageType: "meshtastic.M", TypePath: []string{"M"}, FieldName: "f", Tag: 1,
		Fields: []metaField{
			{Name: "aaa_second", Value: true},
			{Name: "zzz_first", Value: false},
		},
	}}
	_, out := emitSwift(schema, entries)
	mustContain(t, "swift-order", out, "FieldMetadata(zzzFirst: false, aaaSecond: true)")
}

// TestSwiftLocalizesStringAttributes pins that string attributes - user-facing
// display text per field_metadata.proto - are emitted so Xcode's string-catalog
// extractor can see them, keyed by full proto field name rather than by the
// English (labels repeat across the schema). Other targets keep plain literals.
func TestSwiftLocalizesStringAttributes(t *testing.T) {
	schema := []schemaField{
		{Name: "label", Kind: protoreflect.StringKind},
		{Name: "min_value", Kind: protoreflect.DoubleKind},
	}
	entries := []entry{{
		MessageType: "meshtastic.Config.LoRaConfig", TypePath: []string{"Config", "LoRaConfig"},
		FieldName: "hop_limit", Tag: 8,
		Fields: []metaField{
			{Name: "label", Value: "Hop Limit"},
			{Name: "min_value", Value: 0.0},
		},
	}}

	_, swift := emitSwift(schema, entries)
	mustContain(t, "swift-localized", swift,
		`String(localized: "meshtastic.Config.LoRaConfig.hop_limit.label", `+
			`defaultValue: "Hop Limit", `+
			`comment: "label of meshtastic.Config.LoRaConfig.hop_limit")`,
		// numbers are untouched
		"minValue: 0.0",
	)

	// Localization is Swift-only; the other targets still emit a plain literal.
	for name, emit := range map[string]emitter{"c": emitC, "python": emitPython, "typescript": emitTypeScript, "rust": emitRust} {
		_, out := emit(schema, entries)
		if strings.Contains(out, "String(localized:") {
			t.Errorf("%s: localization must not leak into non-Swift targets:\n%s", name, out)
		}
		mustContain(t, name, out, `"Hop Limit"`)
	}
}

// TestDuplicateLabelsWithinATypeAreRejected pins the guard that catches a wrong
// annotation rather than a malformed one. A label lifted from the wrong control is
// present and syntactically valid, so nothing else notices - but two fields of one
// message sharing a display name are indistinguishable to a user, and that label
// becomes the source string every client translates.
func TestDuplicateLabelsWithinATypeAreRejected(t *testing.T) {
	dup := []entry{
		{Kind: kindField, MessageType: "meshtastic.M", FieldName: "a", Tag: 1,
			Fields: []metaField{{Name: "label", Value: "Enabled"}}},
		{Kind: kindField, MessageType: "meshtastic.M", FieldName: "b", Tag: 2,
			Fields: []metaField{{Name: "label", Value: "Enabled"}}},
	}
	err := checkDuplicateLabels(dup)
	if err == nil {
		t.Fatal("expected duplicate labels on one message to be rejected")
	}
	for _, want := range []string{"meshtastic.M", "a", "b", "Enabled"} {
		if !strings.Contains(err.Error(), want) {
			t.Errorf("error should name %q, got: %v", want, err)
		}
	}

	// The same label on DIFFERENT types is fine: the screen around it disambiguates.
	spread := []entry{
		{Kind: kindField, MessageType: "meshtastic.M", FieldName: "a", Tag: 1,
			Fields: []metaField{{Name: "label", Value: "Enabled"}}},
		{Kind: kindField, MessageType: "meshtastic.N", FieldName: "a", Tag: 1,
			Fields: []metaField{{Name: "label", Value: "Enabled"}}},
	}
	if err := checkDuplicateLabels(spread); err != nil {
		t.Errorf("same label on different types must be allowed, got: %v", err)
	}

	// Enum values are checked the same way - they share the entry shape.
	enumDup := []entry{
		{Kind: kindEnumValue, MessageType: "meshtastic.M.E", FieldName: "X", Tag: 0,
			Fields: []metaField{{Name: "label", Value: "Off"}}},
		{Kind: kindEnumValue, MessageType: "meshtastic.M.E", FieldName: "Y", Tag: 1,
			Fields: []metaField{{Name: "label", Value: "Off"}}},
	}
	if err := checkDuplicateLabels(enumDup); err == nil {
		t.Error("expected duplicate labels on one enum to be rejected")
	}

	// Entries with no label at all must not collide with each other.
	if err := checkDuplicateLabels([]entry{
		{Kind: kindField, MessageType: "meshtastic.M", FieldName: "a", Tag: 1,
			Fields: []metaField{{Name: "diy_only", Value: true}}},
		{Kind: kindField, MessageType: "meshtastic.M", FieldName: "b", Tag: 2,
			Fields: []metaField{{Name: "diy_only", Value: true}}},
	}); err != nil {
		t.Errorf("unlabelled entries must not collide, got: %v", err)
	}
}
