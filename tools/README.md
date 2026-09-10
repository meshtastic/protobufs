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
meshtastic_NodeInfo_flags_view f(node->flags);
if (f.via_mqtt()) { ... }
f.set_is_muted();
```

### Discovery

A field is a bitfield when its own comment says `bitwise OR of <Enum> values`. That
marker is prose already written for human readers, so nothing extra is maintained,
and it naturally skips a `uint32` of bits that is *not* a set of named booleans -
`LoRaPresetGroup.legal_presets` indexes bits by `ModemPreset` ordinal, and
`HardwareMessage.gpio_mask` by GPIO pin. Neither says the phrase, so neither is
picked up.

The enum is resolved the way protoc resolves it: innermost scope outwards. That
covers the nested case, a file-scope enum like `ExcludedModules`, and a shared one
like `NodeFlags`, which `NodeInfo.flags` and `NodeInfoLite.bitfield` both point at so
the stored and client-facing words cannot drift.

### What it checks

The generator refuses to emit when a mask is not a single bit, when two values share
a bit, or when a value will not fit its field. protoc already rejects two enum values
with the same *number*; it does not know a mask must be one bit, which is the mistake
the old `#define` blocks allowed. The emitted header repeats both guarantees as
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

`schema_lint.py` checks four rules the schema reference states as invariants and that
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
| `signed` | a plain `int32`/`int64`. A negative one sign-extends to 64 bits and costs ten bytes whatever its magnitude — the largest single encoding mistake 2.x carried. |
| `float` | a `float`/`double`. Four fixed bytes on the wire where a scaled integer is one to three, and software floating point on an MCU without an FPU. |
| `packed` | a `repeated` scalar with no `max_count` in the matching `.options`. nanopb honours proto3 packing only for a bounded field; without the bound it emits a callback that writes a tag per element while the `.proto` still reads `repeated`. |
| `layering` | an air-layer file importing the client layer, which is what lets an MQTT bridge or a map backend compile the air layer alone. |

The first two read the descriptor; the last two read the `.proto` and `.options` files,
since nanopb options do not reach the descriptor buf emits.

Exemptions live in `ALLOWED` and carry their reason, so an entry is a decision on the
record rather than a way to quieten the rule. There are two: `Nau7802Config.calibrationFactor`
stays a `float` because quantising a calibration scale quantises every reading derived
from it, and `resend_chunks.chunks` stays a callback because a resend list has no natural
bound.

Wired into CI as the `Schema rules` job in `.github/workflows/pull_request.yml`, beside
the bitfield check and for the same reason: these are properties of the schema, not of
any one generated language, so a Kotlin or Swift consumer is broken by them exactly as
firmware is.

---

## Wire size

`wire_size.py` computes what the 3.0 encoding costs against the 2.x shape it replaced,
for the messages where the encoding actually changed.

```sh
python tools/wire_size.py            # the table below
python tools/wire_size.py --check    # self-check
```

It needs nothing installed: the sizes come from the protobuf wire rules in the script
rather than from an encoder or a device, so each row is exact for the scenario it names
and says nothing at all about how often that scenario occurs. Traffic mix is the thing
a table like this cannot tell you, and the only honest source for it is a capture.

<!-- generated by wire_size.py -->

| message | scenario | 2.x | 3.0 | saved |
|---|---|--:|--:|--:|
| `RouteDiscovery` | 8 hops each way, negative SNR throughout | 244 | **88** | 64% |
| `Position, basic` | lat, lon, altitude, time | 17 | **16** | 6% |
| `Position, negative altitude` | the same, 120 m below sea level | 26 | **16** | 38% |
| `DeviceMetrics` | battery, voltage, two utilisations, uptime | 21 | **15** | 29% |
| `Environment, live` | temperature, humidity, pressure, one sample | 15 | **14** | 7% |
| `Environment, batched` | the same three quantities, 16 samples in one packet | 240 | **77** | 68% |
| `NeighborInfo` | 10 edges | 114 | **67** | 41% |
| `DrawnShape` | 32 vertices, packed vs a nanopb callback | 192 | **132** | 31% |

Four things the table shows that are easy to miss:

- **The single largest correction is `int32` to `sint32`.** A negative `int32`
  sign-extends to 64 bits and costs ten bytes whatever its magnitude, which is most of
  the traceroute row and the whole difference between the two `Position` rows. The same
  altitude costs 2 bytes above sea level and 11 below it in 2.x.
- **A live single reading barely moves.** The 15-to-14 row is the honest version of the
  telemetry change: the win is in batching and in never sending a `float`, not in the
  layout, and a node that reports one sample at a time collects almost none of it.
- **Batching is where the layout pays**, and it pays against packets rather than bytes:
  the 2.x column is 16 packets, each with its own 16-byte header and its own contention
  for the channel, and the 3.0 column is one.
- **`DrawnShape` changed no field and no type.** Both columns are the same two
  `repeated sint32` fields; the difference is a nanopb `max_count` that turns a callback
  into a packed field. An option file can cost 60 bytes on the air.
