# Schema tooling

## Bitfield accessors

Packed booleans live in the schema as an enum of hex masks beside a `uint32` field
(see [Bitfields](../SCHEMA.md#3-bitfields) in the schema reference). That gets the bit meanings into
every generated language, but firmware still writes `n->flags & MASK` by hand, which
is where bit-assignment bugs come from.

`gen_bitfield_accessors.py` reads the descriptor set buf already emits and writes a
header-only C++ view over the plain integer nanopb generates. The generated struct
and the wire format are untouched, and at `-Os` the accessor compiles to the same
four instructions as the hand-written mask.

```sh
buf build -o descriptor.binpb
python tools/gen_bitfield_accessors.py descriptor.binpb -o meshtastic_bitfields.h
python tools/gen_bitfield_accessors.py descriptor.binpb --list   # what it found
```

Then in firmware:

```cpp
auto f = meshtastic_NodeInfo_flags_view(node->flags);
if (f.via_mqtt()) { ... }
f.set_is_muted();
```

A view is a class template over the field it wraps (`X_view_t<T>`), made by the function
`X_view(field)` so the type is deduced in C++11 without class template argument deduction,
because nanopb picks that integer's width from `int_size` in the `.options` files and the descriptor
does not carry it: `MeshPacket.flags` is a `uint8_t`, `NodeInfoLite.bitfield` a
`uint32_t`. A const field reads through the same view; only the setters need a mutable
one. Each view `static_assert`s that its masks fit the type it was instantiated with, and
the generator reads the `.options` files (`--options-dir`, default `../meshtastic`) so
`--check` rejects a mask wider than its `int_size` before any firmware compiles.
`any(m)`, `all(m)` and `set(m, on)` take enum masks for code that passes a flag around
as a value.

### Discovery

A field is a bitfield when its own comment says `bitwise OR of <Enum> values`. That
marker is prose already written for human readers, so nothing extra is maintained,
and it naturally skips a `uint32` of bits that is *not* a set of named booleans -
`LoRaPresetGroup.legal_presets` indexes bits by `ModemPreset` ordinal,
`DeviceMetadata.excluded_modules` by `ModuleConfigType` ordinal, and
`HardwareMessage.gpio_mask` by GPIO pin. None says the phrase, so none is picked up.

The enum is resolved the way protoc resolves it: innermost scope outwards. That
covers the nested case and a file-scope enum like `NodeFlags`, which `NodeInfo.flags`
and `NodeInfoLite.bitfield` both point at so the stored and client-facing words
cannot drift.

### What it checks

The generator refuses to emit when a mask is not a single bit, when two values share
a bit, or when a value will not fit its field. protoc already rejects two enum values
with the same *number*; it does not know a mask must be one bit, which is the mistake
a `#define` block cannot express. The emitted header repeats both guarantees as
`static_assert`s so they survive someone bypassing the generator.

### In CI

The protobufs repo runs the validation half on every pull request, as the `Bitfield
masks` job in `.github/workflows/pull_request.yml`:

```sh
buf build -o descriptor.binpb
python tools/gen_bitfield_accessors.py descriptor.binpb --check
```

It belongs here rather than downstream because the rule is a property of the schema,
not of C++: a bad mask breaks a Kotlin or Swift consumer exactly as it breaks
firmware, so it has to fail at PR time next to `buf lint` rather than days later in
someone else's build.

Emitting the header is the downstream half. Firmware already vendors this repo as a
submodule and `bin/regen-protos.sh` already does `cd protobufs`, so it can call the
same script with `-o` after the nanopb step and commit the header alongside the
`.pb.h` files. Keeping one copy of the script here matters because discovery depends
on the comment convention, so the tool and the schema have to move together.

### Self-check

```sh
buf build -o descriptor.binpb
python tools/test_bitfield_accessors.py descriptor.binpb
```

Proves the validator rejects multi-bit, duplicate and oversized masks; that every
bitfield currently in the schema passes; and that the emitted header compiles at
`-Os -Wall -Wextra -Werror` and reads and writes the right bits. Needs a C++
compiler; set `CXX` if it is not on `PATH`. Needs the `protobuf` Python runtime to
read the descriptor - nothing at firmware build time does.

---

## Schema rules

`schema_lint.py` checks six rules the schema reference states as invariants and that
nothing else enforces. Each has been broken at least once without anyone noticing,
because a violation of any of them builds and lints clean.

```sh
buf build -o descriptor.binpb
python tools/schema_lint.py descriptor.binpb
python tools/schema_lint.py descriptor.binpb --rule packed   # one rule
python tools/schema_lint.py --list-allowed                   # exemptions, with reasons
```

| rule | what it rejects |
|---|---|
| `signed` | a plain `int32`/`int64`. A negative one sign-extends to 64 bits and costs ten bytes whatever its magnitude, which is the single most expensive encoding error available. |
| `float` | a `float`/`double`. Four fixed bytes on the wire where a scaled integer is one to three, and software floating point on an MCU without an FPU. |
| `packed` | a `repeated` scalar with no `max_count` in the matching `.options`. nanopb honours proto3 packing only for a bounded field; without the bound it emits a callback that writes a tag per element while the `.proto` still reads `repeated`. |
| `layering` | an air-layer file importing the client layer, which is what lets an MQTT bridge or a map backend compile the air layer alone. |
| `indexed` | a cap or bitmask indexed by an enum that the enum has outgrown. `LoRaRegionPresetMap.region_groups` holds the highest `RegionCode` plus one, and the highest `ModemPreset` and `ModuleConfigType` must fit the bitmasks they index. |
| `sections` | config section lists that disagree. `AdminMessage.ConfigType` value N, `ConfigPayload` tag N + 1 and `LocalConfig` field N + 1 name one section, likewise for module config, and a stored file's other fields sit above every section tag. |

`signed`, `float` and `sections` read the descriptor; `packed` and `layering` read the
`.proto` and `.options` files, since nanopb options do not reach the descriptor buf
emits; `indexed` reads both.

Exemptions live in `ALLOWED` and carry their reason, so an entry is a decision on the
record rather than a way to quieten the rule. There is one: `Nau7802Config.calibrationFactor`
stays a `float` because quantising a calibration scale quantises every reading derived
from it.

Wired into CI as the `Schema rules` job in `.github/workflows/pull_request.yml`, beside
the bitfield check and for the same reason: these are properties of the schema, not of
any one generated language, so a Kotlin or Swift consumer is broken by them exactly as
firmware is.

---

## Registry data

Hardware vendors and devices, regulatory regions and modem presets are data, not
schema. Their source is YAML under `registry/`. `gen_registry.py` validates it and
writes the protobuf JSON mapping of the registry messages to `registry/generated/`,
which is committed, so firmware build scripts and clients read it without running
anything.

```sh
python tools/gen_registry.py                                 # regenerate registry/generated/
python tools/gen_registry.py --check                         # rules hold, generated files current
python tools/gen_registry.py --check --base origin/trident   # also: allocations kept, revisions raised
python tools/gen_registry.py --selftest                      # the rules reject what they should
buf convert . --type meshtastic.RegionRegistry --from registry/generated/regions.json#format=json --to regions.binpb
```

It needs PyYAML.

| source | message | generated |
|---|---|---|
| `registry/hardware/*.yaml` | `HwVendorRegistry`, `HwDeviceRegistry` | `hw_vendors.json`, `hw_devices.json` |
| `registry/regions.yaml` | `RegionRegistry` | `regions.json` |
| `registry/modem_presets.yaml` | `ModemPresetRegistry` | `modem_presets.json` |
| `registry/roles.yaml` | `RoleRegistry` | `roles.json` |

**Hardware** is one file per vendor, named after the vendor slug. `00-legacy.yaml` is
vendor `0x00`, the common pool for devices with no registered vendor, named from the board
variants' `custom_meshtastic_display_name`. A vendor file:

```yaml
vendor:
  id: 0x01
  slug: "acme"
  name: "Acme"
devices:
  - id: 0x01
    slug: "ACME_TRACKER"
    name: "Tracker"
```

Vendor ids are `0x00`-`0x3F` and device ids `0x01`-`0xFE`; `0x00` and `0xFF` are
reserved under every vendor (SCHEMA.md §6). Ids and slugs are unique across all files,
and vendor `0x00` appears only in `00-legacy.yaml`. An allocation is permanent: against
`--base`, an id may not disappear or change its slug, while its name may. A client displays the vendor name and the device name together; vendor `0x00` is not a brand, so its device names are complete.
Each hardware registry's `revision` is its entry count.

**Roles** has one `roles` entry per `Role` value and one row per named configuration. A
row's `device_flags` lists role switches only, each valid on one role (`SWITCH_ROLE`); no
two rows share a role, switches and TAK flags, and every role has a row without switches. Enum values are named, and the generator reads them from the
schema; flag lists become one word.

**Regions and presets** name their `RegionCode` or `ModemPreset` without the prefix.
The generator reads both enums from `common.proto`, so a name the schema lacks is
rejected.

`regions.yaml` holds four tables, as firmware does: a region refers to a profile, a
profile to a preset list, and a swap group lists regions a node moves between by preset. A fact is
stated once, and the generator rejects anything that would state one twice: two
identical preset lists or profiles, a list or profile nothing refers to, a padding stored
on a raster profile, which derives it. It checks the tables against each other as well: a
default preset belongs to its profile's list, every listed preset has an entry in
`modem_presets.yaml`, a wide LoRa region permits only presets with a wide bandwidth, and
the members of a swap group permit disjoint presets. Every region states
`edge_clearance`, and a raster profile's regions state it false. `sub_bands_hz` lists at
least two ascending, non-overlapping blocks from the first band edge to the last. `UNSET`
is a copy of `US` in every field but its code.

The generator computes the slot plan (`SCHEMA.md` section 6) for every preset a region
permits and every `bandwidth_codes` entry. A slot outside its block, a permitted preset
with no slot, or a change to the region and bandwidth pairs with none (`NO_PLAN_CELLS`)
is rejected. `bandwidth_codes` must agree with the codes the `LoRaConfig.bandwidth`
comment in `config.proto` documents.

Frequencies and bandwidths are exact hertz, duty cycles per mille. A band edge with no
exact value rounds inward: the lower edge up, the upper edge down. Both files are edited
in place, so each carries its own `revision`, and any change to the data must raise it.

CI runs all of it as the `Registry data` job in `.github/workflows/pull_request.yml`:
the self-test, `--check --base` against the pull request's target branch, and a
`buf convert` of each generated file to prove it decodes against the schema.

---

## Wire size

`wire_size.py` computes what each of this schema's encodings costs against the naive form of
the same data: a `float` where a scaled integer is used, an unpacked repeated field where a
packed one is, a submessage per record where columns are, an `int32` where a `sint32` is.

```sh
python tools/wire_size.py            # the table below
python tools/wire_size.py --check    # self-check
```

It needs nothing installed: the sizes come from the protobuf wire rules in the script
rather than from an encoder or a device, so each row is exact for the scenario it names
and says nothing at all about how often that scenario occurs. Traffic mix is the thing
a table like this cannot tell you, and the only honest source for it is a capture.

<!-- generated by wire_size.py -->

| message | scenario | naive | this schema | saved |
|---|---|--:|--:|--:|
| `Position, basic` | lat, lon, altitude, time | 17 | **16** | 6% |
| `Position, negative altitude` | the same, 120 m below sea level | 26 | **16** | 38% |
| `DeviceMetrics` | battery, voltage, two utilisations, uptime | 21 | **15** | 29% |
| `Environment, live` | temperature, humidity, pressure, one sample | 15 | **14** | 7% |
| `Environment, batched` | the same three quantities, 16 samples in one packet | 240 | **77** | 68% |
| `NeighborInfo` | 10 edges | 114 | **67** | 41% |
| `DrawnShape` | 32 vertices, packed vs a nanopb callback | 192 | **132** | 31% |

Four things the table shows that are easy to miss:

- **The single largest correction is `int32` to `sint32`.** A negative `int32`
  sign-extends to 64 bits and costs ten bytes whatever its magnitude, which is the whole
  difference between the two `Position` rows: the same altitude costs 2 bytes above sea level
  and 11 below it without it. `NeighborInfo` wins for a different reason - its naive form
  already zigzags the SNRs, so what the columns remove there is per-element framing.
- **A live single reading barely moves.** The 15-to-14 row is the honest version of the
  telemetry design: the win is in batching and in never sending a `float`, not in the
  layout, and a node that reports one sample at a time collects almost none of it.
- **Batching is where the layout pays**, and it pays against packets rather than bytes: the
  naive column is 16 packets, each with its own header and its own contention for the
  channel, against one.
- **`DrawnShape` differs in no field and no type.** Both columns are the same two
  `repeated sint32` fields; the difference is a nanopb `max_count` that turns a callback into
  a packed field. An option file can cost 60 bytes on the air.
