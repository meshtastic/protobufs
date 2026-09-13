# protoc-gen-fieldmeta-swift

A pure-Swift `protoc` plugin that generates `FieldMetadataRegistry.swift` from
`(meshtastic.field_metadata)` options - the Swift-native sibling of the Go
[`protoc-gen-fieldmeta`](../protoc-gen-fieldmeta) one directory over, for
consumers whose codegen toolchain is already swift-protobuf based
(e.g. Meshtastic-Apple). Its output is **byte-identical** to the Go plugin's
`target=swift` output, so the two are interchangeable; this one exists so a
Swift consumer doesn't need Go on contributor machines or CI.

## Why a separate Swift implementation

- Built on `SwiftProtobufPluginLibrary` - the same library `protoc-gen-swift`
  itself uses. Emitted type paths (`Config.PositionConfig`) and property names
  (`rxGpio`) come from swift-protobuf's own `SwiftProtobufNamer`/`NamingUtils`,
  so they match the consumer's real generated code **by construction** (fields
  like `pm10_standard` are exactly where independently-implemented
  snake_case→camelCase rules can drift).
- The `(meshtastic.field_metadata)` option is registered through the library's
  `customOptionExtensions` hook and arrives as a typed value on
  `field.options` - no descriptor byte-parsing.
- The emitted `FieldMetadata` struct's shape is schema-driven, and the
  scalar-only constraint is enforced with the same hard error as the Go plugin.
  Values are read generically by traversing the decoded option with a
  `SwiftProtobuf.Visitor` - the counterpart of the Go plugin's protoreflect
  `Range` - so adding a scalar attribute needs no change to this plugin's code.
  It does need the bundled `field_metadata.pb.swift` regenerated (below): that
  binding is how the option decodes as a typed value, and an attribute it
  predates would arrive in `unknownFields`. Generation stops with a pointed
  error in that case rather than dropping the attribute silently.
- **Enum values are annotated too**, via the `(meshtastic.enum_value_metadata)`
  extension, and share the registry and key format with fields. This is what
  gives a picker's options their display text, and what lets a bitfield field
  like `PositionConfig.position_flags` name the individual toggles that make it
  up - both are enum values.

  Swift emits **one instance property per enum type**, not one static per value:

  ```swift
  extension Config.LoRaConfig.ModemPreset {
      public var metadata: FieldMetadata? { FieldMetadataRegistry.get("meshtastic.Config.LoRaConfig.ModemPreset", tag: rawValue) }
  }
  ```

  A static named after the value would collide with the enum case of that name,
  since cases are already static members. Resolving by `rawValue` also avoids
  reimplementing swift-protobuf's enum-case naming, which is exactly where an
  independent implementation would drift.
- Attribute arguments are emitted in **schema declaration order**, not the
  name-sorted order the other targets use. Swift's memberwise initializer
  requires arguments in property-declaration order, and the struct's properties
  come from the same schema, so a field carrying more than one attribute would
  not compile otherwise.
- **String attributes are emitted for localization.** Per
  `meshtastic/field_metadata.proto`, string attributes are user-facing display
  text, so they render as
  `String(localized: <key>, defaultValue: <English>, comment: ...)` rather than
  as bare literals. Xcode's string-catalog extractor picks those up out of the
  generated file when it is compiled in a target with
  `SWIFT_EMIT_LOC_STRINGS = YES`, so the English in the schema becomes the
  source string and translations live in the consuming app's catalog - not in
  the wire schema. The key is the field's full proto name plus the attribute
  (`meshtastic.Config.LoRaConfig.hop_limit.label`), not the English text,
  because labels repeat across the schema and a shared key would force one
  translation on all of them.

  This places a requirement on the consumer: emit the registry into a target
  that has a string catalog. A SwiftPM package has neither the catalog nor the
  build setting, so a registry generated into one is never extracted.
- The `deprecated` attribute is mirrored from each field's **standard**
  `[deprecated = true]` option (read off `field.options.deprecated`), not from
  the custom annotation - so fields already marked deprecated surface as
  `FieldMetadata(deprecated: true)` and apps can read deprecation at runtime.
  Hand-setting `deprecated` inside the annotation is a hard error, same as the
  Go plugin. Entry/attribute ordering matches the Go plugin (entries by proto
  type then tag; accessors by type path then field name), keeping the output
  byte-identical even across many message types.

## Usage (Apple / swift-protobuf)

In `Meshtastic-Apple`'s `scripts/gen_protos.sh`, alongside the existing
`--swift_out`:

```bash
swift build -c release --package-path protobufs/tools/protoc-gen-fieldmeta-swift
protoc --proto_path=./protobufs \
  --plugin=protoc-gen-fieldmetaswift=protobufs/tools/protoc-gen-fieldmeta-swift/.build/release/protoc-gen-fieldmeta-swift \
  --fieldmetaswift_out=./Meshtastic/Model \
  ./protobufs/meshtastic/*.proto
```

Note the output directory is in the **app target**, not in the
`MeshtasticProtobufs` package alongside the `.pb.swift` files. String attributes
are emitted as `String(localized:)` and are only extracted into
`Localizable.xcstrings` if the file is compiled in a target that has the catalog
and `SWIFT_EMIT_LOC_STRINGS = YES`; a SwiftPM package has neither. The plugin
emits a bare filename with no package-path prefix, so point `--fieldmetaswift_out`
at the directory the file should land in.

Consumed as:

```swift
let hideOnRetail = Config.PositionConfig.rxGpio.diyOnly ?? false      // typed accessor
FieldMetadataRegistry.get("meshtastic.Config.PositionConfig", tag: 8) // dynamic lookup
```

## Regenerating the bundled `field_metadata.pb.swift`

`Sources/protoc-gen-fieldmeta-swift/meshtastic/field_metadata.pb.swift` is the
plugin's own generated binding for the option schema (it's what makes the
option decode as a typed value). After changing `meshtastic/field_metadata.proto`:

```bash
protoc --proto_path=. \
  --swift_opt=Visibility=Public \
  --swift_out=tools/protoc-gen-fieldmeta-swift/Sources/protoc-gen-fieldmeta-swift \
  meshtastic/field_metadata.proto
```

## Verification

- Byte-for-byte parity with `protoc-gen-fieldmeta`'s `target=swift` is enforced
  in CI (`.github/workflows/field-metadata.yml`) and reproducible locally:

  ```bash
  tools/protoc-gen-fieldmeta-swift/scripts/verify-parity.sh
  ```

  It builds this plugin, runs both generators over the schema, and diffs - so
  the "interchangeable" claim can't silently rot. Run it after touching either
  generator.
- Output diffed byte-for-byte identical to `protoc-gen-fieldmeta`'s
  `target=swift` over this repo's schema, on swift-protobuf 1.36.1 and 1.38.1.
- The generated registry compiles inside Meshtastic-Apple's real
  `MeshtasticProtobufs` package, and an external consumer typechecks the typed
  accessor, the dynamic lookup, and static/instance member coexistence
  (`config.rxGpio` field value vs `Config.PositionConfig.rxGpio` metadata).
