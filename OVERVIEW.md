# Meshtastic 3.0 Protobufs - What Changed and Why

Executive summary of the schema rework on the `trident` branch, which has been
accepted as the basis for Meshtastic 3.0. The companion document,
[SCHEMA.md](SCHEMA.md), is the developer reference: conventions, encodings and the
rules a client has to follow.

3.0 is a deliberate break. Nothing here is backwards compatible, the sync word keeps
2.x traffic off the air, and no stored data is migrated. Field numbers, message shapes
and encodings were therefore chosen freely, without regard to what 2.x had.

Sections 1 to 4 are the encoding rework: what the schema looks like and why it costs
fewer bytes. Sections 5 to 9 are what that rework made room for - reach control, a store
and forward design that holds ciphertext, authentication on every frame, anycast, and the
tables and UI strings that stop being code. Section 10 lists what went away, and
[SCHEMA.md §11](SCHEMA.md#11-what-changed-from-28) is the entry-by-entry inventory.

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
over-the-air message like `User` reached into `Config.DeviceConfig.Role` - a wire
type depending on the entire configuration tree.

**Config messages are top level.** `Config.DeviceConfig` is now `DeviceConfig`. The
wrapper existed only to carry a `oneof` for admin transport; that role is now an
explicit `ConfigPayload`, and every other consumer gets a flat type.

**The hardware enum is gone.** It grew with every new board and forced a schema pull
request per product. `hw_model` is a packed `uint32` - vendor in the high byte,
device in the low - and the names live in registry data files that clients ship and
firmware never needs. Adding a board no longer touches the schema at all.

**Imports run one way.** Nothing in the air layer - everything that can appear in a
`Data` payload - imports the client layer. That includes `admin`, which is easy to
miss: remote administration means configuration travels over the mesh, so
`AdminMessage` is an on-air payload rather than a phone-link one, and so are the
`config`, `module_config` and `device_ui` types it carries. Two types moved to
make this hold: `DeviceMetadata` into `common.proto`, since both layers need it and
it depends on nothing but `Role`, and `NodeRemoteHardwarePin` into
`module_config.proto` beside the pin type it wraps.

The benefit is that a consumer decoding only mesh traffic - an MQTT bridge, a map
backend, an analytics pipeline - can compile the air layer and never pull in
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

- a small **core** that relays rewrite at fixed offsets - hop limit, next hop, relay
- an **options block** that no relay may touch, and therefore cannot strip
- an append-only **path** at the frame tail

A relay's entire header parse is a version check, a table lookup and one bounds
check. It never decodes the options block; it copies the bytes. That is what makes
an unencrypted, expandable header safe rather than an attack surface: a field a relay
has never heard of survives the trip intact, and the AEAD tag now covers the whole
block, so nobody can add or drop one without failing authentication. Today the header
is not authenticated at all.

The core is profile-selected, and the profiles are smaller than the fixed header they
replace:

| profile | bytes | vs today |
|---|--:|--:|
| minimal - nonce, blob, tag | 5 | −11 |
| broadcast | 12 | −4 |
| unicast | 16 | same |

Broadcast - the dominant traffic class - gets cheaper because it stops sending four
bytes of `0xFFFFFFFF` to say "everyone". Unicast reaches parity by dropping the
channel hash, which a direct message never has: a DM is always PKI, so the byte was
carrying one bit of information that the profile now encodes structurally.

**Expandability pays for itself before a single extension is added**, and an unknown
future field costs bytes only on the packets that carry it.

Three fields already live in the block, and each costs nothing on the packets that do not
carry it: fragmentation state, `hop_flags` - the originator's authenticated instructions to
relays, "do not learn a route from this" and "a store and forward server should keep this" -
and a region code. The path tail earns its keep twice over: a reply steers itself from the
route the request took, so a node learns a whole path from one round trip instead of one hop
per exchange, and the tail is also the route record, which is why 3.0 needs no traceroute
message and no traceroute port.

---

## 3. Telemetry became a list of readings

Four message types - environment, air quality, power, health - declared **74 fields**
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
part of the quantity, so a value is always an integer and never a float - a float is
four fixed bytes on the wire, spends its precision on digits no sensor resolves, and
costs software floating point on an MCU without an FPU.

The layout is columnar and delta coded: the quantity set is named once, values run
down a column per quantity as differences, and sample times are differenced twice so
a fixed reporting cadence collapses to zeros. A column that does not move at all - 
rainfall, a lightning count, a wind vane in still air - says so in its key and is sent
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
`fixed32` for a related reason - a NodeNum is uniformly random over 32 bits, so a varint
costs five bytes fifteen times in sixteen.

---

## 4. Booleans are packed, and the packing is checked

A `bool` costs a tag plus a byte every time it is true. Messages had accumulated ten
and twelve of them; `TelemetryConfig` alone carried ten. Seventeen messages now pack
their booleans into a single integer, which is worth about 80 bytes across the
configuration surface - bytes that live in flash on every device and travel on every
admin exchange.

The important part is not the packing but the **convention**. Bit meanings are
declared in the schema as an enum of hex masks, so protoc exports them to Python,
TypeScript, Kotlin, Swift and C# for free. Previously they lived as `#define`s in a
firmware header, invisible to every other language and kept in step by hand.

That convention is enforced. `protoc` rejects two enum values sharing a *number*, but
nothing in it knows a mask must be a single bit - `0x06` for what should be one flag
passes every standard check and silently breaks every consumer that masks with it. A
CI job now rejects it, and a generator emits named C++ accessors that compile to
byte-identical instructions to the hand-written mask.

---

## 5. Reach control, because sixteen channels is sixteen floods

2.x had no statement of how far a channel's traffic should travel. Every broadcast flooded
to its hop budget on every relay, and 3.0 raises the channel table from 8 to 16, so the
problem grows with it. Three layers now bound reach, and only the third costs a byte:

- **`ChannelSettings.scope`** travels in the channel URL, so everyone who joins a channel
  launches its traffic the same way: local, regional or global. It caps the hop budget a
  sender starts with and decides whether the channel may uplink to MQTT at all.
- **`RelayConfig`** is the relay's side, and a relay sees only the one-byte channel hash. A
  small policy table per hash - forward, forward under a hop cap, or drop - lets an operator
  cap a channel whose key the node does not even hold. Default is forward everything, so an
  existing mesh behaves as it did.
- **`HeaderOptions.scope_code`** is a 16-bit keyed code, 5 bytes, for traffic that must cross
  relays holding none of its channels. It is deliberately **declarative**: the key comes from
  a region name people share, so the code states which region a frame claims and proves
  nothing. Nothing may authorise on it.

The regional cap is registry data, not firmware behaviour: `RegionProfile.default_hop_start`
says what a region launches with.

---

## 6. Store and forward keeps ciphertext, not messages

The 2.x module replayed decoded text keyed by a server-local index, which meant a server
held the channel keys, a client could not tell one server from another, and a reboot or a
ring wrap lost the client's place. A second design, Store & Forward++, added a hash chain
and never converged with the first.

3.0 stores the frame. `StoredFrame` keeps the header fields the AEAD authenticates, the
options block verbatim and the ciphertext with its tag, so:

- a server needs **no channel key**, and cannot read what it holds
- every AEAD tag and XEdDSA signature survives replay, so the **client** verifies the
  original sender rather than trusting the server
- a cursor is `(rx_time, id)` per stream, not an index, so it survives a server reboot, ring
  eviction, and moving to a different server
- a replay is one frame per packet with `want_ack`, and the cursor advances **on the ack** -
  acking before delivery is the failure mode this design exists to avoid

What is worth keeping is an originator's statement, not a guess: `HOP_STORE` sits in the
authenticated options block, so a keyless server can tell a text message from telemetry
without decrypting anything. A server announces itself with a five-byte anonymous pip rather
than a full addressed packet, because a beacon nobody answers should not pay for addressing.

---

## 7. Authentication, in three layers

2.8 leaves the header unauthenticated, and PSK channel traffic is AES-CTR with **no MAC**:
anyone holding the channel key - everyone on the channel - can flip bits in a frame and
nobody can tell. 3.0 closes that from three directions.

**Every encrypted frame carries an 8-byte AES-CCM tag, and there is no switch.** The tag
covers the header fields a relay must not touch, so budget inflation and address rewriting
both fail verification. On a frame that records its path, even the hop limit becomes
tamper-evident, because altering it moves the payload boundary.

**An explicit ack can prove it came from the recipient.** A channel key authenticates a frame
to the channel, not to a node, so any member could forge a delivery receipt.
`Routing.ack_proof` is a truncated HMAC under the pairwise PKI secret, bound to the packet
id it answers, and
`MeshPacket.ack_proof_status` reports the verdict. Reported, never enforced: an unproven ack
is acted on exactly as before.

**Direct messages can be forward secret.** Optional, off by default: each node publishes a
rotating X25519 key in its `User` and mixes it into the DM derivation, erasing old private
keys as it rotates, so recorded traffic older than the retention window stops decrypting even
if both long-term keys later leak. Granularity is one rotation interval, not one message -
per-message chains need state this frame budget cannot carry. Nothing on the air says which
derivation was used; the receiver tries and the tag decides.

XEdDSA still does the one thing no shared key can: attribute a frame to a single sender.

---

## 8. Anycast: a third traffic class

Routed traffic often has more than one valid sink - two uplinks, three egress nodes, any of
which will do. 2.x offers a direct message to one named node, which has no failover, or a
broadcast, which reaches everyone. Anycast is the missing middle: a group is a key pair, its
id lives in the NodeNum space, and a frame to it is an ordinary unicast with `HOP_ANYCAST`
set.

The first frame floods within the channel's scope; every member that decrypts it acks from
its own NodeNum, so the sender learns who answered and every relay on the reverse path
learns a next hop for the group. Later frames follow that path and no other member hears
them. When the nearest member disappears, the retry falls back to a flood, another member
acks, and the tables relearn - the same machinery as a direct message to a node that moved.
Unicast stays 16 bytes, because a group destination is a PKI destination like any other.

---

## 9. Data that used to be code

Two kinds of knowledge lived in firmware and in every client's source, and drifted:

**Regulatory and radio tables.** Regions, their frequency ranges and duty cycles, the modem
presets and which presets each region permits are now registry files under `registry/`,
validated in CI and generated into JSON that clients ship. Each fact appears in exactly one
table; firmware that builds its tables from the registry loses its private copies, and
adding a board or a region stops being a schema pull request.

**What a field means to a person.** `field_metadata.proto` carries the label, description,
unit, bounds, search keywords and the firmware version a field arrived in or left in, as one
option on the field itself. Generators turn it into a registry for TypeScript, Python, C,
Rust, Kotlin and Swift, so the strings an app shows come from the schema instead of being
retyped per platform. Adding an attribute is a schema change with no generator change.

---

## 10. What 3.0 takes away

Removals are the other half of the rework, and most of them are things that had stopped
earning their bytes:

| gone | because |
|---|---|
| `RouteDiscovery` and the traceroute port | the header's path tail already records the route, so every packet is traceable |
| Store & Forward++ and the v1 S&F protocol | replaced wholesale by the ciphertext log |
| `ChunkedPayload` and the LoRaWAN bridge's own chunking | `HeaderOptions.fragment` is the one fragmentation mechanism; nothing ever implemented the others |
| the compressed-text port | text is always compressed, so nothing needs to announce it |
| the range test module | discontinued |
| the 120-entry hardware enum, four telemetry metric messages, the channel role enum, two unusable modem presets, four redundant SHT sensor values | data, columns, position and one driver respectively |

Full inventory, entry by entry, in [SCHEMA.md §11](SCHEMA.md#11-what-changed-from-28).

---

## 11. Why it is still protobuf

A break this size is the moment to ask whether protobuf is the right frame at all. It
was asked, and the answer is that **the protocol was never the bottleneck - the
encoding choices inside it were.** A negative `int32` costs ten bytes whatever its
magnitude, where the `sint32` of the same value costs one: that single correction is the
whole 10-byte difference between a position above sea level and one below it, and it
applies to every signed quantity the protocol carries. That is more than any realistic
protocol switch would have returned, and it was a mistake rather than a limitation.

**ASN.1 UPER** is the theoretically correct answer for a radio link, and 3GPP uses it in
LTE for exactly this reason: a range-constrained field packs to its true bit width, so
an altitude bounded to −1000..8848 is 14 bits rather than a varint. Against the
corrected protobuf the remaining gap is real but modest - roughly 7 bytes on a basic
position and 6 on device metrics. It loses on the thing that matters
more: with no field tags there is no forward or backward compatibility, so a node on
older firmware receiving a newer message gets garbage rather than a partial read. A
mesh runs mixed firmware permanently. Every language would also need its own ASN.1
stack, and none of them would be nanopb.

**CBOR** keeps self-describing semantics and comparable schema evolution, but its
map and array framing costs about a byte per message against a well-tuned protobuf, so
it is not a density win, and no CBOR toolchain generates typed C structs the way nanopb
does. **FlatBuffers and Cap'n Proto** are larger on the wire, not smaller - they
serialise defaults for zero-copy access, which is the right trade at high bandwidth and
the wrong one inside a single LoRa frame. **A bespoke bit-packed format** reaches maximum
density and gives up schema evolution entirely, and every client - firmware, the Go
services, the Python CLI, iOS, Android, the web - reimplements the bit-fiddling and
keeps it in step by hand.

None of that forecloses a compact encoding where one is genuinely earned, because the
architecture already has the escape hatch: `PortNum` discriminates the payload encoding
while the outer frame stays protobuf. Unishox2-compressed text and raw Codec2 audio both
travel that way, and in 3.0 text is compressed unconditionally, so the port implies the
encoding instead of a second port advertising it. A message whose schema is stable and
whose every byte
matters can take a dedicated inner encoding inside `Data.payload` without touching the
frame or breaking a single client.

For flash storage the question barely arises. Flash is megabytes against a 256-byte
LoRa frame, schema evolution is what makes a firmware update survive a config change, and
nanopb decodes straight into typed C structs. The wins there were structural, and they
are §1.

---

## Credit

Thanks to **NomDeTom** for sustained review of this work and for the idea behind the
telemetry encoding: the delta-coded columnar layout - lay a stack of readings on its
side and send only what changed - is his, and it is worth more than every other
byte-level change here combined. His prototype takes it further with bit packing and
resolution shifting; 3.0 ships the delta coding alone, which carries the win in plain
protobuf.
