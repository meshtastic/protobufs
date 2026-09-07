# Meshtastic 3.0 Protobufs — What Changed and Why

Executive summary of the `trident` schema rework. The companion document,
[SCHEMA.md](SCHEMA.md), is the developer reference: conventions, encodings and the
rules a client has to follow.

3.0 is a deliberate break. Nothing here is backwards compatible, the sync word keeps
2.x traffic off the air, and no stored data is migrated. Field numbers, message shapes
and encodings were therefore chosen freely, without regard to what 2.x had.

Four changes carry almost all of the value.

---

## 1. The schema is arranged by function, not by history

`mesh.proto` had become a god file: 2,570 lines, seven imports, and every message
that had ever needed a home. It held over-the-air payloads, phone-API messages, flash
storage types, notification types and a 120-entry hardware enum, all in one
translation unit. Anything that needed one type pulled in the whole tree.

It is now split by what a file is *for*:

| group | files | who compiles it |
|---|---|---|
| foundation | `common`, `portnums`, `channel`, `telemetry`, `device_ui` | everyone |
| wire | `wire`, `packet` | anything touching the mesh |
| config | `config`, `module_config`, `localonly` | devices and configurators |
| admin | `admin` | devices and configurators |
| API | `api` | devices and client apps |
| storage | `deviceonly` | firmware only |
| registries | `hw_vendor`, `hw_device`, `region`, `modem_preset` | clients, for display |
| modules | `atak`, `mqtt`, `storeforward`, `paxcount`, … | whoever enables them |

Four consequences worth calling out:

**Shared enums moved to a leaf.** `Role`, `RegionCode`, `ModemPreset`, `LocSource`
and friends live in `common.proto`, which imports nothing. Previously an
over-the-air message like `User` reached into `Config.DeviceConfig.Role` — a wire
type depending on the entire configuration tree.

**Config messages are top level.** `Config.DeviceConfig` is now `DeviceConfig`. The
wrapper existed only to carry a `oneof` for admin transport; that role is now an
explicit `ConfigPayload`, and every other consumer gets a flat type.

**The hardware enum is gone.** It grew with every new board and forced a schema pull
request per product. `hw_model` is a packed `uint32` — vendor in the high byte,
device in the low — and the names live in registry data files that clients ship and
firmware never needs. Adding a board no longer touches the schema at all.

**Imports run one way.** Nothing in the air layer — everything that can appear in a
`Data` payload — imports the client layer. That includes `admin`, which is easy to
miss: remote administration means configuration travels over the mesh, so
`AdminMessage` is an on-air payload rather than a phone-link one, and so are the
`config`, `module_config` and `device_ui` types it carries. Two types moved to
make this hold: `DeviceMetadata` into `common.proto`, since both layers need it and
it depends on nothing but `Role`, and `NodeRemoteHardwarePin` into
`module_config.proto` beside the pin type it wraps.

The benefit is that a consumer decoding only mesh traffic — an MQTT bridge, a map
backend, an analytics pipeline — can compile the air layer and never pull in
`FromRadio`, `ToRadio` or the storage types. It also means splitting the schema into
separately published air and client modules stays a mechanical change if it is ever
wanted, without paying for that split now: one module, one artifact per language,
unchanged.

Field numbering was rebuilt from scratch across every message: no holes, no reserved
tags, counting from 1, with the fields a message actually populates placed below tag
15 where the protobuf key costs one byte instead of two.

---

## 2. A variable-length header that can grow

The on-air header was 16 fixed bytes, and any new field meant paying for it on every
packet forever. The 3.0 header is split by **who is allowed to write to it**:

- a small **core** that relays rewrite at fixed offsets — hop limit, next hop, relay
- an **extension block** that no relay may touch, and therefore cannot strip
- an append-only **path** at the frame tail

A relay's entire header parse is a version check, a table lookup and one bounds
check. It never decodes the extension block; it copies the bytes. That is what makes
an unencrypted, expandable header safe rather than an attack surface: a field a relay
has never heard of survives the trip intact, and the AEAD tag now covers the whole
block, so nobody can add or drop one without failing authentication. Today the header
is not authenticated at all.

The core is profile-selected, and the profiles are smaller than the fixed header they
replace:

| profile | bytes | vs today |
|---|--:|--:|
| minimal — nonce, blob, tag | 5 | −11 |
| broadcast | 12 | −4 |
| unicast | 16 | same |

Broadcast — the dominant traffic class — gets cheaper because it stops sending four
bytes of `0xFFFFFFFF` to say "everyone". Unicast reaches parity by dropping the
channel hash, which a direct message never has: a DM is always PKI, so the byte was
carrying one bit of information that the profile now encodes structurally.

**Expandability pays for itself before a single extension is added**, and an unknown
future field costs bytes only on the packets that carry it.

---

## 3. Telemetry became a list of readings

Four message types — environment, air quality, power, health — declared **74 fields**
between them, one per quantity. The consequences were all bad:

- most of the message was absent on any given node
- a node could not report two of the same quantity, which is why six separate
  temperature fields existed, and `ch1`/`ch2`/`ch3` voltage pairs that were an
  ordinal wearing a costume
- every new sensor needed a schema change, and every client an update
- a node with two sensor categories sent **two packets**, because the variants were
  mutually exclusive

They are replaced by one `SensorReadings` message: a list of quantities, a list of
values, and optional per-sample times. 62 quantities cover what the 74 fields did,
with room to grow to 127 before anything gets more expensive. The unit and scale are
part of the quantity, so a value is always an integer and never a float — a float is
four fixed bytes on the wire, spends its precision on digits no sensor resolves, and
costs software floating point on an MCU without an FPU.

The layout is columnar and delta coded: the quantity set is named once, values run
down a column per quantity as differences, and sample times are differenced twice so
a fixed reporting cadence collapses to zeros. A column that does not move at all —
rainfall, a lightning count, a wind vane in still air — says so in its key and is sent
once instead of once per sample. All of it is ordinary packed protobuf, which any
generated decoder already reads.

Measured against a 21-hour capture of the public MQTT broker, eight buffered samples:

| | bytes |
|---|--:|
| one message per reading (2.x) | 200 |
| 3.0 `SensorReadings` | **71** |

A node replaying what it buffered while offline now costs roughly a third of what it
did, and a node with an environment sensor and an air-quality sensor sends one packet
instead of two.

**The technique is not specific to telemetry.** Any list of small records has the same
shape, and paying the framing once per column instead of once per element is worth as
much there. `NeighborInfo` used to carry one submessage per edge, each with its own tag,
length byte and inner field tags; as two parallel columns it is 40% smaller at ten
neighbours and fits roughly twice as many edges in a packet. Node numbers moved to
`fixed32` for a related reason — a NodeNum is uniformly random over 32 bits, so a varint
costs five bytes fifteen times in sixteen.

---

## 4. Booleans are packed, and the packing is checked

A `bool` costs a tag plus a byte every time it is true. Messages had accumulated ten
and twelve of them; `TelemetryConfig` alone carried ten. Seventeen messages now pack
their booleans into a single integer, which is worth about 80 bytes across the
configuration surface — bytes that live in flash on every device and travel on every
admin exchange.

The important part is not the packing but the **convention**. Bit meanings are
declared in the schema as an enum of hex masks, so protoc exports them to Python,
TypeScript, Kotlin, Swift and C# for free. Previously they lived as `#define`s in a
firmware header, invisible to every other language and kept in step by hand.

That convention is enforced. `protoc` rejects two enum values sharing a *number*, but
nothing in it knows a mask must be a single bit — `0x06` for what should be one flag
passes every standard check and silently breaks every consumer that masks with it. A
CI job now rejects it, and a generator emits named C++ accessors that compile to
byte-identical instructions to the hand-written mask.

---

## Credit

Thanks to **NomDeTom** for sustained review of this work and for the idea behind the
telemetry encoding: the delta-coded columnar layout — lay a stack of readings on its
side and send only what changed — is his, and it is worth more than every other
byte-level change here combined. His prototype takes it further with bit packing and
resolution shifting; 3.0 ships the delta coding alone, which carries the win in plain
protobuf.
