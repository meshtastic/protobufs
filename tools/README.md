# Schema tooling

## Bitfield accessors

Packed booleans live in the schema as an enum of hex masks beside a `uint32` field
(see the Bitfield Convention in `ARCHITECTURE.md`). That gets the bit meanings into
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
