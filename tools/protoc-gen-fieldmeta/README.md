# protoc-gen-fieldmeta

A `protoc`/`buf` plugin that turns the `(meshtastic.field_metadata)` custom field
option (see [`meshtastic/field_metadata.proto`](../../meshtastic/field_metadata.proto))
into a **static, reflection-free field-metadata registry** in a target language.

## Why a generator instead of runtime reflection

Field metadata (e.g. `diy_only`) is carried as a custom option, the same pattern
Google uses for [`google.api.field_behavior`](https://google.aip.dev/203). Custom
options can be read two ways: runtime descriptor reflection, or code generation.

Reflection (the [protovalidate](https://protovalidate.com/) model) only works on
runtimes that keep descriptors/options at runtime — Go, Python, C#, Java,
protobuf-es. It is **structurally impossible** on the runtimes Meshtastic cares
about most: nanopb (firmware) and Wire (KMP) strip options for size, and prost
(Rust) discards them. So the only mechanism that works for *every* consumer is
build-time code generation — which is also what Google's own SDK generators do
with `field_behavior`.

This plugin is the cross-language half of that. The KMP package generates the
same registry shape with a Wire `SchemaHandler` (Wire is not a `protoc` plugin
host); see [`packages/kmp/buildSrc`](../../packages/kmp/buildSrc).

## Output shape

Each target emits two layers, no reflection and no runtime cost:

1. **Typed accessors** for a known field — the everyday, autocomplete-friendly
   API (no magic strings or field tags).
2. A **dynamic lookup** keyed by fully-qualified message name + field tag — an
   escape hatch for generic field walking.

| Target (`opt: target=`) | File | Accessor (primary) | Mechanism | Dynamic lookup |
| --- | --- | --- | --- | --- |
| `swift` | `FieldMetadataRegistry.swift` | `Config.PositionConfig.rxGpio` | `extension` on the real message type | `FieldMetadataRegistry.get(type, tag)` |
| `rust` | `field_metadata_registry.rs` | `config::position_config::RX_GPIO` | standalone namespaced module | `get(type, tag)` |
| `typescript` | `meshtastic/field_metadata_registry.ts` | `Config.PositionConfig.rxGpio` | standalone namespace object | `get(type, tag)` |
| `python` | `meshtastic/field_metadata_registry.py` | `Config.PositionConfig.rx_gpio` | standalone nested classes | `get(type, tag)` |
| `c` (nanopb / firmware) | `meshtastic/field_metadata_registry.h` | — (no namespacing) | — | `meshtastic_field_metadata_get(type, tag)` |

Where the language supports extending the generated message type, the accessor
hangs directly off it: **Swift** uses an `extension` (which also avoids
colliding with the swift-protobuf `Config` type in the same module), and the
sibling **Kotlin/Wire** handler ([`packages/kmp/buildSrc`](../../packages/kmp/buildSrc))
generates companion extension properties named to match Wire's snake_case fields
(`Config.PositionConfig.rx_gpio`).
**Rust/TS/Python** use a self-contained namespace (their messages live in a
separate module, so there's no collision). Rust could instead use an inherent
`impl` on the prost types once the Rust generation pipeline is wired into this
repo; the standalone module is used until then.

The plugin reads the option **dynamically** (no generated Go bindings) and is
generic over the contents of the `FieldMetadata` message: adding a scalar
attribute to `field_metadata.proto` requires no change here. The `FieldMetadata`
shape (struct/interface) is read from the schema so it stays in sync
automatically. Attributes must be scalar (bool/int/float/string); a non-scalar
attribute (message/enum/bytes, or a repeated/map field) is a **hard error at
generation time** rather than producing meaningless, non-deterministic output.

If a module doesn't define the extension (e.g. buf generates the option-free
`nanopb.proto` as its own module), the plugin emits nothing rather than failing.

### The `deprecated` attribute (mirrored, not annotated)

`FieldMetadata` has one attribute the schema author never sets by hand:
`deprecated`. The plugin populates it from the field's **standard**
`[deprecated = true]` option — the deprecation info that protobuf runtimes strip
and apps therefore can't read at runtime. So any field already marked
`[deprecated = true]` shows up in the registry (`deprecated: true`) with no
`(meshtastic.field_metadata)` annotation, and a field carrying both a custom
attribute and `[deprecated = true]` gets both. The standard option is
authoritative. This is the one attribute that costs a generator change (the
sibling Kotlin/Wire and pure-Swift generators mirror it identically); every
other attribute remains a schema-only addition.

## Build & test

```bash
go -C tools/protoc-gen-fieldmeta build ./...
go -C tools/protoc-gen-fieldmeta test ./...
```

## Integration

### TypeScript (this repo) — already wired

[`buf.gen.yaml`](../../buf.gen.yaml) invokes the plugin via `go run` (so CI needs
Go on `PATH` — GitHub-hosted runners include it; the publish workflow pins it via
`actions/setup-go`). The generated `field_metadata_registry.ts` is flattened into
`packages/ts/lib/` by the publish workflow and re-exported from
[`packages/ts/mod.ts`](../../packages/ts/mod.ts) under the `FieldMeta` namespace,
so consumers use `FieldMeta.Config.PositionConfig.rxGpio` and `FieldMeta.get(...)`.
The `FieldMeta` namespace keeps the accessor's `Config` object from colliding with
the `Config` message module.

### Firmware (nanopb / C)

In `meshtastic/firmware`'s `bin/regen-protos.sh`, build the plugin and add a
`--fieldmeta_out`:

```bash
go -C protobufs/tools/protoc-gen-fieldmeta build -o "$PWD/protoc-gen-fieldmeta" .
../nanopb-0.4.9/generator-bin/protoc --experimental_allow_proto3_optional \
  --plugin=protoc-gen-fieldmeta="$PWD/protoc-gen-fieldmeta" \
  "--nanopb_out=-S.cpp -v:../src/mesh/generated/" \
  --fieldmeta_out=target=c:../src/mesh/generated/ \
  -I=../protobufs meshtastic/*.proto
```

### Apple (swift-protobuf)

> A pure-Swift implementation with byte-identical output also lives at
> [`tools/protoc-gen-fieldmeta-swift`](../protoc-gen-fieldmeta-swift) for
> consumers who prefer to keep their toolchain Go-free.

In `Meshtastic-Apple`'s `scripts/gen_protos.sh`:

```bash
go -C protobufs/tools/protoc-gen-fieldmeta build -o "$PWD/protoc-gen-fieldmeta" .
protoc --proto_path=./protobufs \
  --plugin=protoc-gen-fieldmeta="$PWD/protoc-gen-fieldmeta" \
  --swift_opt=Visibility=Public --swift_out=./MeshtasticProtobufs/Sources \
  --fieldmeta_out=target=swift:./MeshtasticProtobufs/Sources \
  ./protobufs/meshtastic/*.proto
```

### Python

In `meshtastic/python`'s `bin/regen-protobufs.sh`, alongside `--python_out`:

```bash
--fieldmeta_out=target=python:"${OUTDIR}"
```

(Build the plugin and pass `--plugin=protoc-gen-fieldmeta=...` as above.)

## Extension number / global registry

`field_metadata.proto` uses extension number **51001**, which is in the
[50000–99999 range protobuf reserves for in-house use](https://protobuf.dev/programming-guides/proto2/#customoptions)
— valid as-is. Because this schema is public, we may optionally reserve a number
in the [global extension registry](https://github.com/protocolbuffers/protobuf/blob/main/docs/options.md)
to rule out collisions for third parties who import our options. Draft entry
(pick the next free number when submitting the upstream PR):

```
NN. Meshtastic / https://meshtastic.org / Extension: <assigned>
```

If a registered number is obtained, change the single `= 51001` in
`field_metadata.proto`; nothing else depends on the literal value.
