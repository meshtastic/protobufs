# protoc-gen-fieldmeta-swift

A pure-Swift `protoc` plugin that generates `FieldMetadataRegistry.swift` from
`(meshtastic.field_metadata)` options — the Swift-native sibling of the Go
[`protoc-gen-fieldmeta`](../protoc-gen-fieldmeta) one directory over, for
consumers whose codegen toolchain is already swift-protobuf based
(e.g. Meshtastic-Apple). Its output is **byte-identical** to the Go plugin's
`target=swift` output, so the two are interchangeable; this one exists so a
Swift consumer doesn't need Go on contributor machines or CI.

## Why a separate Swift implementation

- Built on `SwiftProtobufPluginLibrary` — the same library `protoc-gen-swift`
  itself uses. Emitted type paths (`Config.PositionConfig`) and property names
  (`rxGpio`) come from swift-protobuf's own `SwiftProtobufNamer`/`NamingUtils`,
  so they match the consumer's real generated code **by construction** (fields
  like `pm10_standard` are exactly where independently-implemented
  snake_case→camelCase rules can drift).
- The `(meshtastic.field_metadata)` option is registered through the library's
  `customOptionExtensions` hook and arrives as a typed value on
  `field.options` — no descriptor byte-parsing.
- The emitted `FieldMetadata` struct's shape is schema-driven, and the
  scalar-only constraint is enforced with the same hard error as the Go plugin.
  One deliberate difference: value emission uses an explicit per-attribute
  switch that **fails loudly** on an unhandled attribute (a one-line `case` to
  extend) rather than fully dynamic rendering — metadata is never silently
  dropped.
- The `deprecated` attribute is mirrored from each field's **standard**
  `[deprecated = true]` option (read off `field.options.deprecated`), not from
  the custom annotation — so fields already marked deprecated surface as
  `FieldMetadata(deprecated: true)` and apps can read deprecation at runtime.
  Entry/attribute ordering matches the Go plugin (entries by proto type then
  tag; accessors by type path then field name), keeping the output
  byte-identical even across many message types.

## Usage (Apple / swift-protobuf)

In `Meshtastic-Apple`'s `scripts/gen_protos.sh`, alongside the existing
`--swift_out`:

```bash
swift build -c release --package-path protobufs/tools/protoc-gen-fieldmeta-swift
protoc --proto_path=./protobufs \
  --plugin=protoc-gen-fieldmetaswift=protobufs/tools/protoc-gen-fieldmeta-swift/.build/release/protoc-gen-fieldmeta-swift \
  --fieldmetaswift_out=./MeshtasticProtobufs/Sources/meshtastic \
  ./protobufs/meshtastic/*.proto
```

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

  It builds this plugin, runs both generators over the schema, and diffs — so
  the "interchangeable" claim can't silently rot. Run it after touching either
  generator.
- Output diffed byte-for-byte identical to `protoc-gen-fieldmeta`'s
  `target=swift` over this repo's schema, on swift-protobuf 1.36.1 and 1.38.1.
- The generated registry compiles inside Meshtastic-Apple's real
  `MeshtasticProtobufs` package, and an external consumer typechecks the typed
  accessor, the dynamic lookup, and static/instance member coexistence
  (`config.rxGpio` field value vs `Config.PositionConfig.rxGpio` metadata).
