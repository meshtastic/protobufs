# Meshtastic 3.0 Protobufs - Design Overview

Why the schema is shaped the way it is. The companion document, [SCHEMA.md](SCHEMA.md), is
the developer reference: conventions, encodings and the rules a client has to follow.

Sections 1 to 4 cover the shape of the schema and the encodings it uses. Sections 5 to 9
cover the capabilities it carries: reach control, a store and forward design that holds
ciphertext, authentication on every frame, anycast, and the tables and UI strings that are
data rather than code. Section 10 answers why the whole thing is protobuf.

---

## 1. The schema is arranged by function

A file's contents follow from what compiles it, not from where a message happened to be
written. Air payloads, phone-API messages, flash storage types and registry data are
separate files, so anything that needs one type does not pull in the whole tree:

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

**Shared enums live in a leaf.** `Role`, `RegionCode`, `ModemPreset`, `LocSource` and
friends are in `common.proto`, which imports nothing, so an over-the-air message like
`User` does not depend on the configuration tree to name a role.

**Config messages are top level.** `DeviceConfig` is a message, not a member of a wrapper.
The `oneof` an admin exchange needs is its own type, `ConfigPayload`, and every other
consumer gets a flat type.

**Hardware names are data.** `hw_model` is a packed `uint32` - vendor in the high byte,
device in the low - and the names live in registry files that clients ship and firmware
never needs, so adding a board does not touch the schema.

**Imports run one way.** Nothing in the air layer - everything that can appear in a `Data`
payload - imports the client layer. That includes `admin`, which is easy to miss: remote
administration means configuration travels over the mesh, so `AdminMessage` is an on-air
payload rather than a phone-link one, and so are the `config`, `module_config` and
`device_ui` types it carries. `DeviceMetadata` sits in `common.proto` because both layers
need it and it depends on nothing but `Role`, and `NodeRemoteHardwarePin` sits in
`module_config.proto` beside the pin type it wraps.

The benefit is that a consumer decoding only mesh traffic - an MQTT bridge, a map backend,
an analytics pipeline - compiles the air layer and never pulls in `FromRadio`, `ToRadio` or
the storage types. It also means splitting the schema into separately published air and
client modules stays a mechanical change if it is ever wanted, without paying for that
split now: one module, one artifact per language.

Field numbers count from 1 with no holes and no reserved tags, and the fields a message
actually populates sit below tag 15, where the protobuf key costs one byte instead of two.

---

## 2. A variable-length header that can grow

The header is split by **who is allowed to write to it**:

- a small **core** that relays rewrite at fixed offsets - hop limit, next hop, relay
- an **options block** that no relay may touch, and therefore cannot strip
- an append-only **path** at the frame tail

A relay's entire header parse is a version check, a table lookup and one bounds check. It
never decodes the options block; it copies the bytes. That is what makes an unencrypted,
expandable header safe rather than an attack surface: a field a relay has never heard of
survives the trip intact, and the AEAD tag covers the whole block, so nobody can add or
drop one without failing authentication.

The core is profile-selected:

| profile | bytes | carries |
|---|--:|---|
| minimal | 5 | a nonce, a blob and a tag; no addressing |
| broadcast | 12 | sender, id, channel hash, relay |
| unicast | 16 | sender, id, destination, relay, next hop |

Broadcast is the dominant traffic class and the cheapest: "everyone" is a profile, not four
bytes of `0xFFFFFFFF`. Unicast carries no channel hash at all, because a direct message is
always PKI - the profile says so structurally, where a byte would have to.

**An unknown future field costs bytes only on the packets that carry it**, which is the
whole argument for the design: a fixed header charges every packet forever for a field most
of them do not use.

Three fields live in the block today, and each costs nothing on a packet without it:
fragmentation state, `hop_flags` - the originator's authenticated instructions to relays,
"do not learn a route from this" and "a store and forward server should keep this" - and a
region code. The path tail earns its keep twice over: a reply steers itself from the route
the request took, so a node learns a whole path from one round trip rather than one hop per
exchange, and the tail is the route record, which is why nothing here needs a traceroute
message or a traceroute port.

---

## 3. Telemetry is a list of readings

`SensorReadings` carries a list of quantities, a list of values and optional per-sample
times. 127 quantities fit in the one-byte key range, 62 of them defined today, and the unit
and scale are part of the quantity, so a value is always an integer and never a float - a
float is four fixed bytes on the wire, spends its precision on digits no sensor resolves,
and costs software floating point on an MCU without an FPU.

The alternative shape, one field per quantity, fails in four ways at once: most of the
message is absent on any given node; a node cannot report two of the same quantity, so a
second temperature sensor needs a second field and a third needs a third; every new sensor
is a schema change and a client update; and a node with two sensor categories sends two
packets, because the categories are mutually exclusive variants. A list has none of those
properties, and an ordinal in the key is what lets one node report four temperatures.

The layout is columnar and delta coded: the quantity set is named once, values run down a
column per quantity as differences, and sample times are differenced twice so a fixed
reporting cadence collapses to zeros. A column that does not move at all - rainfall, a
lightning count, a wind vane in still air - says so in its key and is sent once instead of
once per sample. All of it is ordinary packed protobuf, which any generated decoder already
reads.

Measured against a 21-hour capture of the public MQTT broker, eight buffered samples in one
packet cost **71 bytes**, against 200 for the same readings sent one message at a time. A
node replaying what it buffered while offline pays roughly a third, and a node with an
environment sensor and an air-quality sensor sends one packet rather than two.

**The technique is not specific to telemetry.** Any list of small records has the same
shape, and paying the framing once per column instead of once per element is worth as much
there. `NeighborInfo` carries two parallel columns rather than a submessage per edge, which
fits roughly twice as many edges in a packet. Node numbers are `fixed32` for a related
reason: a NodeNum is uniformly random over 32 bits, so a varint costs five bytes fifteen
times in sixteen.

---

## 4. Booleans are packed, and the packing is checked

A `bool` costs a tag plus a byte every time it is true, and a configuration message
accumulates ten or twelve of them. 33 messages pack their booleans into a single integer,
worth about 80 bytes across the configuration surface - bytes that live in flash on every
device and travel on every admin exchange.

The important part is not the packing but the **convention**. Bit meanings are declared in
the schema as an enum of hex masks, so protoc exports them to Python, TypeScript, Kotlin,
Swift and C# for free. A `#define` in a firmware header does none of that, and every other
language keeps its copy in step by hand.

That convention is enforced. `protoc` rejects two enum values sharing a *number*, but
nothing in it knows a mask must be a single bit - `0x06` for what should be one flag passes
every standard check and silently breaks every consumer that masks with it. A CI job
rejects it, and a generator emits named C++ accessors that compile to byte-identical
instructions to the hand-written mask.

---

## 5. Reach control, because sixteen channels is sixteen floods

A channel table holds sixteen channels, and a broadcast with nothing to bound it floods to
its hop budget on every relay. Three layers bound reach, and only the third costs a byte:

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

A server stores frames, not messages. Replaying decoded text keyed by a server-local index
is the shape to avoid: it needs the channel keys on the server, it gives a client no way to
tell one server from another, and a reboot or a ring wrap loses the client's place.

`StoredFrame` keeps the header fields the AEAD authenticates, the options block verbatim and
the ciphertext with its tag, so:

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

A shared channel key authenticates nothing on its own: everyone on the channel holds it, so
confidentiality without integrity lets any of them flip bits in a frame undetectably, and
integrity alone still cannot say which member sent something. Three layers answer that.

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
which will do. A direct message to one named node has no failover, and a broadcast reaches
everyone; anycast is the middle. A group is a key pair, its id lives in the NodeNum space,
and a frame to it is an ordinary unicast with `HOP_ANYCAST` set.

The first frame floods within the channel's scope; every member that decrypts it acks from
its own NodeNum, so the sender learns who answered and every relay on the reverse path
learns a next hop for the group. Later frames follow that path and no other member hears
them. When the nearest member disappears, the retry falls back to a flood, another member
acks, and the tables relearn - the same machinery as a direct message to a node that moved.
Unicast stays 16 bytes, because a group destination is a PKI destination like any other.

---

## 9. Tables and strings are data, not code

Two kinds of knowledge would otherwise live in firmware and in every client's source, and
drift:

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

## 10. Why it is protobuf

A schema for a 256-byte radio frame invites the question of whether protobuf is the right
frame at all. The answer is that **the framing was never the bottleneck - the encoding
choices inside it are.** A negative `int32` costs ten bytes whatever its magnitude, where
the `sint32` of the same value costs one: that single choice is the whole 10-byte difference
between a position above sea level and one below it, and it applies to every signed quantity
the protocol carries. Getting those choices right is worth more than any realistic framing
switch would return.

**ASN.1 UPER** is the theoretically correct answer for a radio link, and 3GPP uses it in
LTE for exactly this reason: a range-constrained field packs to its true bit width, so
an altitude bounded to −1000..8848 is 14 bits rather than a varint. Against the
protobuf used this way the remaining gap is real but modest - roughly 7 bytes on a basic
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
