# Meshtastic Protobuf Analysis: Wire Size Optimization & 3.0 Restructuring

> Analysis of the full protobuf repository for Meshtastic 3.0 (breaking change).
> Primary consumer: nanopb on memory-constrained embedded devices.
> Primary goal: minimize encoded OTA proto size, secondary goals: reduce RAM, simplify structure.

---

# Part 1: Wire Encoding Optimizations

## 1.1 Critical: `int32` Fields with Negative Values

In protobuf, `int32` encodes negative numbers by sign-extending to 64 bits, producing a
**10-byte varint** for *any* negative value (even -1). `sint32` uses zigzag encoding and costs
only 1-2 bytes for small negatives. This is by far the single largest source of waste.

### Over-the-air messages (highest impact)

| Location | Field | Current | Typical Value | Current Cost | With `sint32` | Savings |
|---|---|---|---|---|---|---|
| mesh.proto | `Position.altitude` | `int32` | -430 to +8848 | **10 bytes if negative** | 1-2 bytes | **~8 bytes** |
| mesh.proto | `Position.timestamp_millis_adjust` | `int32` | small +/- | **10 bytes if negative** | 1 byte | **~9 bytes** |
| mesh.proto | `RouteDiscovery.snr_towards` | `repeated int32` | -20 to +10 (x4) | **10 bytes x up to 8** | 1 byte each | **up to 72 bytes** |
| mesh.proto | `RouteDiscovery.snr_back` | `repeated int32` | same | **10 bytes x up to 8** | 1 byte each | **up to 72 bytes** |
| atak.proto | `PLI.altitude` | `int32` | can be negative | **10 bytes if negative** | 1-2 bytes | **~8 bytes** |
| deviceonly.proto | `PositionLite.altitude` | `int32` | same as Position | **10 bytes if negative** | 1-2 bytes | **~8 bytes** |

### Local/config messages (still wasteful)

| Location | Field | Typical Value | Issue |
|---|---|---|---|
| telemetry.proto | `LocalStats.noise_floor` | -120 dBm (always negative!) | **Always 10 bytes**, sint32 = 1 byte |
| mesh.proto | `QueueStatus.res` | error codes, may be negative | 10 bytes if negative |
| module_config.proto | `PaxcounterConfig.wifi_threshold` | -80 (default!) | **Always 10 bytes** |
| module_config.proto | `PaxcounterConfig.ble_threshold` | -80 (default!) | **Always 10 bytes** |
| connection_status.proto | `WifiConnectionStatus.rssi` | -70 (always negative) | **Always 10 bytes** |
| connection_status.proto | `BluetoothConnectionStatus.rssi` | -60 (always negative) | **Always 10 bytes** |

**Total potential savings on a single traceroute response: up to ~150 bytes (64% of the 233-byte payload budget).**

## 1.2 `float` Fields -> Scaled Integers

Every `float` costs exactly **4 bytes + tag**. Many values would be far smaller as scaled integers using varint encoding.

### DeviceMetrics (sent by every node periodically)

| Field | Current | Proposed | Example | Bytes Now | Bytes After | Save |
|---|---|---|---|---|---|---|
| `voltage` | `float` | `uint32` millivolts | 3.7V = 3700 | 5 | 3 | **2** |
| `channel_utilization` | `float` | `uint32` x100 | 45.2% = 4520 | 5 | 3 | **2** |
| `air_util_tx` | `float` | `uint32` x100 | 1.5% = 150 | 5 | 2 | **3** |

### EnvironmentMetrics (sensor nodes)

| Field | Proposed | Example | Save |
|---|---|---|---|
| `temperature` | `sint32` x100 degC | 25.50C = 2550 | **2-3 bytes** |
| `relative_humidity` | `uint32` x100 % | 65.5% = 6550 | **2 bytes** |
| `barometric_pressure` | `uint32` Pa | 1013.25hPa = 101325 | **1 byte** |
| `wind_speed` | `uint32` x100 m/s | 5.2 m/s = 520 | **2 bytes** |
| `soil_temperature` | `sint32` x100 degC | -5.0C = -500 | **10 -> 2 bytes!** (int32+negative) |
| All other float fields | scaled integers | various | **1-3 bytes each** |

### SNR fields (multiple locations)

| Location | Field | Current | Proposed | Save |
|---|---|---|---|---|
| mesh.proto | `Neighbor.snr` | `float` | `sint32` x4 | **3 bytes per neighbor** |
| mesh.proto | `NodeInfo.snr` | `float` | `sint32` x4 | **3 bytes** |
| deviceonly.proto | `NodeInfoLite.snr` | `float` | `sint32` x4 | **3 bytes** |
| mesh.proto | `MeshPacket.rx_snr` | `float` | `sint32` x4 | **3 bytes** |

NeighborInfo with 10 neighbors: **saves ~30 bytes**.

### PowerStressMessage

| Field | Current | Issue |
|---|---|---|
| `num_seconds` | `float` | Should be `uint32` seconds. No sub-second precision needed for stress test durations. |

### Config floats

| Field | Current | Proposed |
|---|---|---|
| `PowerConfig.adc_multiplier_override` | `float` | `uint32` x100 (e.g. 320 for 3.20) |
| `LoRaConfig.frequency_offset` | `float` | `sint32` Hz |
| `LoRaConfig.override_frequency` | `float` | `uint32` x100 kHz or Hz integer |

## 1.3 `fixed32` Fields That Should Be `uint32`

`fixed32` always costs 4 bytes. `uint32` (varint) costs 1-5 bytes depending on value.
For random 32-bit IDs, fixed32 is correct (varint would average ~5 bytes). But several
fields use fixed32 when their values are small or structured.

| Location | Field | Current | Values | Proposed | Save |
|---|---|---|---|---|---|
| mesh.proto | `Data.emoji` | `fixed32` | Unicode 0x1F600-0x1FAD6 | `uint32` | **1 byte** (3 vs 4) |
| mesh.proto | `Position.time` | `fixed32` | epoch secs ~1.7B | Keep `fixed32` | (varint = 5, worse) |
| mesh.proto | `Position.timestamp` | `fixed32` | epoch secs | Keep `fixed32` | (same) |
| mesh.proto | `Waypoint.icon` | `fixed32` | Unicode codepoint | `uint32` | **1 byte** |
| mesh.proto | `Data.dest/source/request_id/reply_id` | `fixed32` | node IDs, random 32-bit | Keep `fixed32` | (correct) |
| mesh.proto | `MeshPacket.from/to/id` | `fixed32` | node IDs, packet IDs | Keep `fixed32` | (correct) |

## 1.4 Field Number Reallocation

Fields 1-15 use a **1-byte** tag, fields 16+ use **2-byte** tags. In a breaking 3.0, we can
renumber fields to put the most frequently populated ones in the 1-15 range.

### Position message

Currently fields 16-23 (`ground_track`, `fix_quality`, `fix_type`, `sats_in_view`,
`sensor_id`, `next_update`, `seq_number`, `precision_bits`) all use 2-byte tags.

**Recommendation**: In 3.0, renumber so that the fields controlled by common `position_flags`
(ALTITUDE, DOP, SATINVIEW, HEADING, SPEED, TIMESTAMP) occupy fields 1-15, and rarely-used
fields (sensor_id, seq_number, next_update, timestamp_millis_adjust) go to 16+.

### LoRaConfig

Fields `ignore_incoming` (103), `ignore_mqtt` (104), `config_ok_to_mqtt` (105) have a
bizarre gap from field 15. In 3.0, renumber to 16-18. Saves 1 byte per tag.

### AdminMessage

Fields jump from 27 to 32, then to 64-67, then 94-103. Renumber contiguously.
The `session_passkey` field is 101 (2-byte tag) but is sent with *every* admin message.
**Move to field 1 or 2** to save 1 byte on every admin packet.

---

# Part 2: Structural Refactoring for 3.0

## 2.1 Current Import Dependency Graph

```
mesh.proto ──imports──> channel.proto
           ──imports──> config.proto ──imports──> device_ui.proto
           ──imports──> device_ui.proto
           ──imports──> module_config.proto
           ──imports──> portnums.proto
           ──imports──> telemetry.proto
           ──imports──> xmodem.proto

admin.proto ──imports──> channel, config, connection_status, device_ui, mesh, module_config

deviceonly.proto ──imports──> channel, config, localonly, mesh, telemetry, nanopb

localonly.proto ──imports──> config, module_config

mqtt.proto ──imports──> config, mesh

clientonly.proto ──imports──> localonly, mesh

apponly.proto ──imports──> channel, config
```

**mesh.proto is a god file** with 7 imports and ~2570 lines. It contains OTA wire messages,
API messages, storage types, notification types, utility types, and massive enums
(HardwareModel alone is 120+ entries). Every file that needs *any* mesh type pulls in
the entire dependency tree.

## 2.2 Problem: Cross-Cutting Type References

These create unnecessary coupling and force large imports:

| Type Reference | Where Used | Problem |
|---|---|---|
| `Config.DeviceConfig.Role` | `User.role`, `UserLite.role`, `MapReport.role`, `DeviceMetadata.role` | OTA wire type (`User`) depends on config.proto's nested enum |
| `Config.LoRaConfig.RegionCode` | `MapReport.region` | MQTT message depends on config internals |
| `Config.LoRaConfig.ModemPreset` | `MapReport.modem_preset` | same |
| `DeviceMetrics` | `NodeInfo.device_metrics`, `NodeInfoLite.device_metrics` | mesh.proto depends on telemetry.proto |
| `RemoteHardwarePin` | `NodeRemoteHardwarePin` in mesh.proto | mesh.proto depends on module_config.proto |
| `DeviceUIConfig` | `FromRadio.deviceuiConfig` | mesh.proto depends on device_ui.proto |
| `XModem` | `FromRadio.xmodemPacket`, `ToRadio.xmodemPacket` | mesh.proto depends on xmodem.proto |
| `Channel` | `FromRadio.channel` | mesh.proto depends on channel.proto |
| `Position.LocSource` | `PositionLite.location_source` | deviceonly.proto depends on mesh.proto for a nested enum |

## 2.3 Problem: Duplicate "Lite" Messages

Three pairs of near-identical messages exist in deviceonly.proto:

| Full (mesh.proto) | Lite (deviceonly.proto) | Difference |
|---|---|---|
| `Position` (23 fields) | `PositionLite` (5 fields) | Lite is a strict subset |
| `User` (9 fields) | `UserLite` (8 fields) | Lite drops `id`, renumbers fields |
| `NodeInfo` (13 fields) | `NodeInfoLite` (13 fields) | Nearly identical, Lite adds `next_hop`/`bitfield` |

This creates a maintenance burden (every Position bug must be fixed in two places, e.g.
`PositionLite.altitude` has the same `int32` problem). And it means separate nanopb
decode/encode functions for nearly the same data.

## 2.4 Problem: The `Config` Oneof Wrapper Pattern

`Config` uses a oneof to wrap sub-configs for OTA admin transport:
```protobuf
message Config {
  message DeviceConfig { ... }
  message PositionConfig { ... }
  // ...
  oneof payload_variant {
    DeviceConfig device = 1;
    PositionConfig position = 2;
    // ...
  }
}
```

Then `LocalConfig` in localonly.proto unwraps them back to individual fields:
```protobuf
message LocalConfig {
  Config.DeviceConfig device = 1;
  Config.PositionConfig position = 2;
  // ...
}
```

This means:
1. **Config sub-messages are deeply nested** (`Config.DeviceConfig.Role`), forcing awkward
   cross-references everywhere.
2. **The `Config` message itself exists only as a transport oneof** - it adds 2 bytes of
   oneof overhead to every admin config exchange.
3. **nanopb must generate the full `Config` union struct** even though only one variant is
   ever populated at a time.

The same pattern applies to `ModuleConfig` and `LocalModuleConfig`.

## 2.5 Problem: `FromRadio`/`ToRadio` as Kitchen Sinks

`FromRadio` has a 17-variant oneof that pulls in types from 7+ proto files:

```
MeshPacket, MyNodeInfo, NodeInfo, Config, LogRecord, uint32,
bool, ModuleConfig, Channel, QueueStatus, XModem, DeviceMetadata,
MqttClientProxyMessage, FileInfo, ClientNotification, DeviceUIConfig
```

This means **any firmware build that uses FromRadio (all of them) must compile protobuf
support for XModem, DeviceUI, MQTT proxy, etc.** even if those features are disabled.

## 2.6 Problem: `HardwareModel` Enum Bloat

`HardwareModel` in mesh.proto has 120+ entries and grows with every new board. It is
referenced by `User.hw_model`, `DeviceMetadata.hw_model`, and `MapReport.hw_model`.
Being in mesh.proto means every OTA message file transitively includes this giant enum.

**3.0 Solution: Replace with Vendor ID / Device ID scheme** (see Section 3.7).

---

# Part 3: Proposed 3.0 Structure

## 3.1 Recommended File Layout

```
meshtastic/
  # === Leaf types (no meshtastic/ imports) ===
  common.proto            # Role, HardwareModel, LocSource, coordinate helpers
  portnums.proto          # PortNum enum (unchanged)
  telemetry.proto         # DeviceMetrics, EnvironmentMetrics, etc.
  channel.proto           # ChannelSettings, Channel
  device_ui.proto         # DeviceUIConfig (unchanged)

  # === Wire protocol (minimal imports, OTA-critical) ===
  wire.proto              # Position, User, Data, RouteDiscovery, Routing,
                          # Waypoint, Neighbor, NeighborInfo, Compressed,
                          # KeyVerification, StatusMessage, StoreForwardPlusPlus

  # === Packet framing ===
  packet.proto            # MeshPacket only (imports wire.proto, portnums.proto)

  # === Configuration (not OTA-critical) ===
  config.proto            # DeviceConfig, PositionConfig, etc. as TOP-LEVEL messages
  module_config.proto     # MQTTConfig, SerialConfig, etc. as TOP-LEVEL messages

  # === Phone/client API ===
  api.proto               # FromRadio, ToRadio, QueueStatus, LogRecord,
                          # MyNodeInfo, DeviceMetadata, Heartbeat, FileInfo,
                          # ClientNotification, MqttClientProxyMessage
                          # (imports everything it needs)

  # === Admin ===
  admin.proto             # AdminMessage (imports config, module_config, api)

  # === Storage (device-only, never OTA) ===
  storage.proto           # NodeInfo, DeviceState, NodeDatabase, ChannelFile,
                          # LocalConfig, LocalModuleConfig, BackupPreferences
                          # (replaces deviceonly.proto + localonly.proto)

  # === Feature modules (leaf, no cross-imports) ===
  atak.proto
  mqtt.proto
  storeforward.proto
  paxcount.proto
  remote_hardware.proto
  xmodem.proto
  powermon.proto
  rtttl.proto
  cannedmessages.proto
  interdevice.proto
  connection_status.proto

  # === Client-only ===
  apponly.proto
  clientonly.proto
```

## 3.2 Extract `common.proto`

Move shared enums and types that are referenced across many files into a common leaf file:

```protobuf
// common.proto - no meshtastic/ imports
syntax = "proto3";
package meshtastic;

enum Role { ... }              // Currently Config.DeviceConfig.Role
enum HardwareModel { ... }    // Currently in mesh.proto
enum RegionCode { ... }        // Currently Config.LoRaConfig.RegionCode
enum ModemPreset { ... }       // Currently Config.LoRaConfig.ModemPreset

enum LocSource {
  LOC_UNSET = 0;
  LOC_MANUAL = 1;
  LOC_INTERNAL = 2;
  LOC_EXTERNAL = 3;
}

enum AltSource {
  ALT_UNSET = 0;
  ALT_MANUAL = 1;
  ALT_INTERNAL = 2;
  ALT_EXTERNAL = 3;
  ALT_BAROMETRIC = 4;
}
```

**Impact**: Eliminates the `Config.DeviceConfig.Role` cross-reference pattern. Every file
that needs `Role` imports only `common.proto` (a leaf with zero imports), not the entire
config tree.

## 3.3 Flatten Config Messages

Remove the `Config` and `ModuleConfig` wrapper oneofs. Make each config a top-level message:

```protobuf
// config.proto - 3.0
syntax = "proto3";
package meshtastic;
import "meshtastic/common.proto";

message DeviceConfig {
  Role role = 1;
  uint32 button_gpio = 2;
  // ...
}

message PositionConfig {
  uint32 position_broadcast_secs = 1;
  // ...
}

// No wrapping Config message, no oneof
```

For admin transport, use the `AdminMessage` oneof to discriminate which config is being
sent (it already does this via `ConfigType` enum). The extra `Config` wrapper oneof
currently adds 2 bytes of overhead to every config exchange and forces nanopb to allocate
a union large enough for the biggest config variant.

**Impact on LocalConfig**: `LocalConfig` would directly embed `DeviceConfig`, `PositionConfig`,
etc. without the `Config.` prefix. Cleaner C code, smaller generated structs.

## 3.4 Eliminate Duplicate Lite Messages

In 3.0, unify the full and lite versions. The "full" `Position` has 23 fields but most are
optional/conditional. The NodeDB can store the same `Position` message and simply not
populate the rarely-needed fields. With proto3, unpopulated fields cost zero bytes on disk.

For `User` vs `UserLite`: the only difference is `UserLite` drops `User.id` (the node ID
string). In 3.0, just use `User` everywhere. If the string isn't populated, it costs zero
bytes. The `id` field is only needed for OTA broadcasts; the NodeDB simply won't populate it.

For `NodeInfo` vs `NodeInfoLite`: nearly identical. Merge into one `NodeInfo` message.
The `NodeInfoLite`-only fields (`next_hop`, `bitfield`) should be added to the unified type.
The `NodeInfo`-only fields (`is_key_manually_verified`, `is_muted`) are already being
replaced by the `bitfield` in Lite, so adopt the bitfield approach.

**Impact**: Eliminates ~200 lines of duplicate definitions, removes duplicate nanopb
encode/decode functions, and ensures fixes (like `int32` -> `sint32` for altitude) only
need to happen once.

## 3.5 Decouple `FromRadio`/`ToRadio` from Feature Modules

Currently `FromRadio` directly includes `XModem`, `DeviceUIConfig`, `MqttClientProxyMessage`
etc. in its oneof. This forces every build to include those types.

**Recommendation**: Use a generic extension pattern:

```protobuf
message FromRadio {
  uint32 id = 1;
  oneof payload_variant {
    MeshPacket packet = 2;
    MyNodeInfo my_info = 3;
    NodeInfo node_info = 4;
    Config config = 5;             // or specific config type
    LogRecord log_record = 6;
    uint32 config_complete_id = 7;
    bool rebooted = 8;
    ModuleConfig module_config = 9;
    Channel channel = 10;
    QueueStatus queue_status = 11;
    bytes module_payload = 12;     // Generic: module-specific payloads
    DeviceMetadata metadata = 13;
    ClientNotification notification = 14;
    FileInfo file_info = 15;
  }
}
```

Move XModem, DeviceUIConfig, and MqttClientProxyMessage to use the generic `module_payload`
(with a discriminator byte or separate portnum-like field) or keep them as separate oneof
entries only in builds that need them. The key point is that `api.proto` should not import
`xmodem.proto` or `device_ui.proto` directly.

Alternatively (simpler for nanopb): keep the oneof entries but move `FromRadio`/`ToRadio`
to `api.proto` which is compiled separately from the wire protocol, so that builds
can selectively include api.proto's dependencies.

## 3.6 Consolidate Boolean Flags into Bitfields

Several messages have many boolean fields that each cost 2 bytes (1 tag + 1 value) when true.
A single `uint32` bitfield can hold up to 32 booleans for 1-2 tag bytes + 1-5 value bytes.

### NodeInfo: 4 booleans = 8 bytes -> 1 bitfield = ~3 bytes

```protobuf
// Current (mesh.proto):
bool via_mqtt = 8;
bool is_favorite = 10;
bool is_ignored = 11;
bool is_key_manually_verified = 12;
bool is_muted = 13;

// 3.0: pack into bitfield (NodeInfoLite already does this partially)
uint32 flags = 8;  // bit 0: via_mqtt, bit 1: is_favorite, etc.
```

**Saves 4-8 bytes per NodeInfo.** NodeInfoLite already uses a bitfield for some of these -
3.0 should adopt this universally.

### DeviceMetadata: 6 booleans

```protobuf
bool canShutdown = 3;
bool hasWifi = 4;
bool hasBluetooth = 5;
bool hasEthernet = 6;
bool hasRemoteHardware = 10;
bool hasPKC = 11;
```

These 6 booleans cost up to 12 bytes. A single `uint32 capabilities` bitfield costs ~3 bytes.
**Saves ~9 bytes.**

### ExternalNotificationConfig: 7 booleans

```protobuf
bool active = 4;
bool alert_message = 5;
bool alert_message_vibra = 10;
bool alert_message_buzzer = 11;
bool alert_bell = 6;
bool alert_bell_vibra = 12;
bool alert_bell_buzzer = 13;
bool use_pwm = 7;
bool use_i2s_as_buzzer = 15;
```

Pack into `uint32 alert_flags`. Saves ~14 bytes on config storage.

## 3.7 Replace `HardwareModel` Enum with Vendor/Device ID

The `HardwareModel` enum is the fastest-growing type in the repo (120+ entries), requires a
proto PR for every new board, and pollutes every file that transitively imports mesh.proto.

**Replace with a single packed `uint32 hw_model`** encoded as `(vendor_id << 8) | device_id`:

```protobuf
// No more HardwareModel enum. Just:
uint32 hw_model = 5;  // packed: 7-bit vendor (bits 14:8) + 8-bit device (bits 7:0)
```

With nanopb `int_size:16`, this is a `uint16_t` in the C struct.

**Vendor ID is 7 bits (0x00-0x7F)** to stay within the 2-byte varint threshold. The packed
value never exceeds `0x7FFF` (32767), which encodes as exactly **2 varint bytes**. An 8-bit
vendor ID (0x80+) would push the packed value above 0x7FFF and cost a 3rd varint byte — the
same kind of bloat we are trying to eliminate. Wire cost: **1 tag + 1-2 varint bytes = 2-3
bytes**, identical to the current enum.

### Vendor/Device ID allocation

| Vendor ID | Meaning | Device IDs |
|---|---|---|
| 0x00 | **Legacy / Meshtastic community** | 0x00-0xFE map 1:1 to current `HardwareModel` values |
| 0x01-0x6F | Registered third-party vendors (111 slots) | Managed by each vendor (256 DIDs each) |
| 0x70-0x7F | **Private / development** (16 VIDs × 256 DIDs = 4096 boards) | Unrestricted, never registered |

### Backward compatibility

Vendor 0 preserves the existing numeric values. `TBEAM = 4` becomes vendor=0, device=4,
packed value = `0x0004` = **4** — identical to today. This means:

- **Existing firmware that compares against numeric constants continues to work.** The code
  already handles these as plain integers, not symbolic enum names. Comparing against
  `vid=1, did=0` or the integer `256` is the same operation.
- All current board definitions (0-254) remain valid as vendor=0 devices with no renumbering.
- `PRIVATE_HW = 255` (0x00FF) naturally becomes vendor=0, device=255. New private/dev
  boards should use VIDs 0x70-0x7F, giving 4096 unregistered slots.

### Hardware Registry Proto Files

Clients and apps need to translate numeric IDs into human-readable display strings
(e.g. VID=4 → "Heltec", DID=4 → "Lora V4" → display **"Heltec Lora V4"**). This requires
registry proto files that are **not part of the wire protocol** but ship with clients:

```protobuf
// hw_vendor_registry.proto — Vendor ID → name mapping
// NOT used on-wire; consumed by clients/apps for display purposes only.
syntax = "proto3";
package meshtastic;

message HwVendor {
  uint32 vendor_id = 1;   // 0x00-0x7F
  string name      = 2;   // e.g. "Heltec", "LILYGO", "RAKwireless"
}

message HwVendorRegistry {
  repeated HwVendor vendors = 1;
}
```

```protobuf
// hw_device_registry.proto — (Vendor ID, Device ID) → name mapping
syntax = "proto3";
package meshtastic;

message HwDevice {
  uint32 vendor_id  = 1;  // parent vendor
  uint32 device_id  = 2;  // 0x00-0xFE
  string name       = 3;  // e.g. "Lora V4", "T-Beam Supreme"
  string display    = 4;  // optional pre-formatted: "Heltec Lora V4"
}

message HwDeviceRegistry {
  repeated HwDevice devices = 1;
}
```

**Workflow:**
- The registries live in this repo as `.proto` definitions + serialized `.pb` data files
  (or JSON equivalents for web clients).
- Firmware does **not** include the registry — it only stores/sends the packed `uint32`.
- Clients bundle the registry and look up display names locally.
- Adding a new board = updating the registry data file. No proto schema change needed.
- The registry can be versioned independently and fetched as an OTA update by clients.

### Benefits

1. **Eliminates the 120+ entry enum** from the wire protocol proto source — the registry
   moves to dedicated data files consumed only by clients.
2. **Decentralized governance** — vendors manage their own 0-254 device ID space. Only
   vendor registration is centralized (a simple table, similar to USB VID but for 7 bits).
3. **No proto PR needed for new boards** — once a vendor ID is assigned, they can ship new
   device IDs without touching the wire protocol protos. Only the registry data file is updated.
4. **Zero wire overhead** — packed uint32 encodes identically to the current enum varint.
   Vendor 0 devices up to ID 127 still fit in 1 varint byte.
5. **Removes HardwareModel from common.proto** — no need to carry the enum in any proto file
   at all. The `uint32 hw_model` field is self-contained.
6. **Clients get richer metadata** — the registry can carry additional fields (display name,
   image URL, capabilities) without affecting wire format or firmware.

### nanopb options

```
*User.hw_model          int_size:16
*DeviceMetadata.hw_model int_size:16
*MapReport.hw_model     int_size:16
```

Helper macros in firmware:
```c
#define HW_VENDOR(hw_model)  ((uint8_t)(((hw_model) >> 8) & 0x7F))
#define HW_DEVICE(hw_model)  ((uint8_t)((hw_model) & 0xFF))
#define HW_MODEL(vid, did)   (((uint16_t)((vid) & 0x7F) << 8) | (uint8_t)(did))
```

## 3.8 Trim Deprecated Fields

In a 3.0 breaking change, fully remove all deprecated fields rather than keeping stubs:

| Message | Deprecated Fields to Remove |
|---|---|
| `User` | `macaddr` (field 4) |
| `UserLite` | `macaddr` (field 1) |
| `MeshPacket` | `delayed` (field 13) |
| `DeviceConfig` | `serial_enabled` (field 2), `is_managed` (field 9) |
| `PositionConfig` | `gps_enabled` (field 4), `gps_attempt_time` (field 6) |
| `DisplayConfig` | `gps_format` (field 2), `compass_north_top` (field 4) |
| `LoRaConfig` | `LONG_SLOW` (enum 1), `VERY_LONG_SLOW` (enum 2) |
| `CannedMessageConfig` | `enabled` (field 9), `allow_input_source` (field 10) |
| `ChannelSettings` | `channel_num` (field 1) |
| `DeviceState` | `no_save` (field 9), `did_gps_reset` (field 11) |

Removing these frees up low field numbers for reuse and reduces nanopb struct sizes.

---

# Part 4: nanopb-Specific Recommendations

## 4.1 Add Missing `int_size` Options

Several enum/small-range fields lack `int_size` constraints. This doesn't affect wire size
but saves RAM in the nanopb C structs:

```
# mesh.options additions
*Position.location_source  int_size:8
*Position.altitude_source  int_size:8
*Position.fix_quality      int_size:8
*Position.fix_type         int_size:8
*Position.sats_in_view     int_size:8
*Position.sensor_id        int_size:8
*Position.precision_bits   int_size:8

*Routing.error_reason      int_size:8

*MeshPacket.priority       int_size:8
*MeshPacket.delayed        int_size:8

*NodeInfo.channel          int_size:8

*Neighbor.node_broadcast_interval_secs  int_size:16

# config.options additions
*PositionConfig.gps_mode   int_size:8
*DisplayConfig.oled        int_size:8
*DisplayConfig.displaymode int_size:8
*DisplayConfig.compass_orientation int_size:8
*BluetoothConfig.mode      int_size:8

# telemetry.options additions
*AirQualityMetrics.pm10_standard     int_size:16
*AirQualityMetrics.pm25_standard     int_size:16
*AirQualityMetrics.pm100_standard    int_size:16
*AirQualityMetrics.pm10_environmental  int_size:16
*AirQualityMetrics.pm25_environmental  int_size:16
*AirQualityMetrics.pm100_environmental int_size:16
*AirQualityMetrics.co2               int_size:16
```

## 4.2 Use `anonymous_oneof` More Aggressively

Currently only `MeshPacket`, `ToRadio`, `FromRadio`, and `Routing` use `anonymous_oneof:true`.
Other messages with oneofs should also use it to reduce nanopb struct nesting overhead:

```
*Telemetry.variant                 anonymous_oneof:true
*Config.payload_variant            anonymous_oneof:true
*ModuleConfig.payload_variant      anonymous_oneof:true
*ClientNotification.payload_variant anonymous_oneof:true
*StoreAndForward.variant           anonymous_oneof:true
*ChunkedPayloadResponse.payload_variant anonymous_oneof:true
*MqttClientProxyMessage.payload_variant anonymous_oneof:true
*TAKPacket.payload_variant         anonymous_oneof:true
*InterdeviceMessage.data           anonymous_oneof:true
*SensorData.data                   anonymous_oneof:true
```

This produces a flat C union rather than a nested struct, reducing memory and indirection.

## 4.3 Consider `FT_POINTER` for Large Infrequent Messages

The MQTT module already uses `FT_POINTER` for `ServiceEnvelope` fields. Consider the same
for other large but infrequently-used types to avoid static allocation:

- `AdminMessage.get_ringtone_response` (231 bytes max)
- `AdminMessage.set_canned_message_module_messages` (201 bytes max)
- `LogRecord.message` (384 bytes max)
- `ClientNotification.message` (400 bytes max)

This trades dynamic allocation for RAM savings when these messages aren't in use.

## 4.4 Consider `FT_CALLBACK` for Variable-Length Collections

`NodeDatabase.nodes` already uses `callback_datatype = "std::vector<>"`. Consider the same
for other repeated fields that can have variable counts, to avoid oversized static arrays:

- `NeighborInfo.neighbors` (currently max_count:10, wastes RAM when fewer)
- `LoRaConfig.ignore_incoming` (currently max_count:3)
- `RemoteHardwareConfig.available_pins` (currently max_count:4)

---

# Part 5: OTA Byte Budget Analysis

With all proposed changes applied, estimated savings for common OTA messages:

| Message | Current Typical Size | Estimated 3.0 Size | Savings |
|---|---|---|---|
| Traceroute (8-hop, negative SNR) | ~180 bytes | ~30 bytes | **~150 bytes (83%)** |
| Position (basic: lat/lon/alt/time) | ~22 bytes | ~18 bytes | **~4 bytes** |
| Position (full, negative altitude) | ~55 bytes | ~38 bytes | **~17 bytes** |
| DeviceMetrics telemetry | ~25 bytes | ~15 bytes | **~10 bytes** |
| EnvironmentMetrics (temp+hum+press) | ~20 bytes | ~12 bytes | **~8 bytes** |
| NeighborInfo (10 neighbors) | ~95 bytes | ~55 bytes | **~40 bytes** |
| User (NodeInfo broadcast) | ~75 bytes | ~70 bytes | **~5 bytes** |
| NodeInfo (full, stored) | ~130 bytes | ~110 bytes | **~20 bytes** |
| DeviceMetadata | ~40 bytes | ~28 bytes | **~12 bytes** |

---

# Part 6: Summary of All Recommendations

## Wire Encoding Changes (applied to all relevant messages)

| # | Change | Impact | Scope |
|---|---|---|---|
| W1 | `int32` -> `sint32` for all potentially-negative fields | **Critical** | ~12 fields across 6 files |
| W2 | `float` -> scaled `uint32`/`sint32` for telemetry | **High** | ~35 float fields across telemetry.proto |
| W3 | `float` -> `sint32` x4 for all SNR fields | **High** | 4 fields across mesh.proto, deviceonly.proto |
| W4 | `fixed32` -> `uint32` for emoji/icon fields | **Low** | 2 fields |
| W5 | Renumber fields to put hot paths in 1-15 | **Medium** | Position, AdminMessage, LoRaConfig |
| W6 | Pack booleans into bitfields | **Medium** | NodeInfo, DeviceMetadata, ExternalNotificationConfig |

## Structural Changes

| # | Change | Impact |
|---|---|---|
| S1 | Extract `common.proto` with shared enums (Role, RegionCode, etc.) | Breaks the mesh->config dependency for OTA types |
| S2 | Flatten `Config`/`ModuleConfig` wrappers to top-level messages | Simpler C code, smaller nanopb unions, removes 2-byte oneof overhead |
| S3 | Merge Position/PositionLite, User/UserLite, NodeInfo/NodeInfoLite | Eliminates duplicate maintenance, single encode/decode path |
| S4 | Split mesh.proto into wire.proto + packet.proto + api.proto | Each file is focused, selective compilation possible |
| S5 | Decouple FromRadio/ToRadio from feature modules (xmodem, device_ui) | Reduces mandatory compile dependencies |
| S6 | Replace `HardwareModel` enum with packed vendor/device uint32 | Eliminates ever-growing enum; enables third-party HW without proto changes |
| S7 | Remove all deprecated fields and renumber | Frees low field numbers, shrinks nanopb structs |

## nanopb-Specific Changes

| # | Change | Impact |
|---|---|---|
| N1 | Add `int_size:8` for ~25 enum/small-range fields | RAM savings |
| N2 | Add `anonymous_oneof:true` for ~10 more oneofs | Flatter C structs |
| N3 | Use `FT_POINTER` for large infrequent string fields | RAM savings when idle |
| N4 | Use `FT_CALLBACK` for more variable-length repeated fields | RAM savings |

---

# Appendix: On the Merits of Protobuf3 vs Alternative Serialization Protocols

> This section records a deliberation on whether a different wire protocol could outperform
> protobuf3 for Meshtastic's dual use case: OTA data frames over LoRa and config storage on flash.

## The Central Finding

**The protocol is not the bottleneck. The encoding choices inside protobuf are.**

The `int32`→`sint32` fix alone recovers up to 150 bytes on a single traceroute — more than any
realistic protocol switch would achieve. The float-to-scaled-integer conversions recover another
10-40 bytes on telemetry messages. These are encoding mistakes, not protocol limitations.
Fix the mistakes before evaluating alternatives.

## Evaluated Alternatives

### ASN.1 UPER/PER

The theoretically optimal choice for radio-constrained links. Used in 3GPP LTE (RRC, NAS) for
exactly this reason. Achieves bit-level packing with schema-constrained field ranges:

```
altitude  INTEGER (-1000..8848)   -- 14 bits (vs 1-10 bytes in protobuf)
snr       INTEGER (-200..127)     -- 8 bits (vs 1-10 bytes in protobuf)
```

After the analysis.md fixes, the remaining gap vs UPER is modest:

| Message | Protobuf (post-fix) | ASN.1 UPER | Gain |
|---|---|---|---|
| Position (basic) | ~18 bytes | ~11 bytes | 7 bytes |
| RouteDiscovery (8-hop) | ~30 bytes | ~12 bytes | 18 bytes |
| DeviceMetrics | ~15 bytes | ~9 bytes | 6 bytes |

**Why it loses for Meshtastic**: no field tags means no forward/backward compatibility.
A node running old firmware receiving a new-schema UPER message gets garbage. In a mesh
network where nodes routinely run different firmware versions, this is fatal. Additionally,
`asn1c` generates complex hard-to-audit C code with no nanopb equivalent; every platform
(Go, Python, Swift, C#, web) needs its own ASN.1 stack.

### CBOR (RFC 8949)

The IETF standard for constrained IoT encoding. Used in Matter, CoAP, OSCORE. Uses integer
map keys analogous to protobuf field tags, giving similar self-describing semantics and
comparable schema evolution properties.

Wire density is roughly equal to or slightly worse than well-tuned protobuf — CBOR integer
encoding mirrors varint but map/array framing adds a byte of overhead per message. No nanopb
equivalent exists; `tinycbor` does not generate typed C structs from a schema.

**Verdict**: not a density win, and loses nanopb's typed code generation with zero benefit.

### FlatBuffers / Cap'n Proto

Zero-copy access, but the wire format is larger than protobuf because all fields including
defaults are serialized. Designed for memory-mapped high-bandwidth systems. Not competitive
in a 233-byte LoRa payload budget.

### Custom Bit-Packed Format

Maximum possible density. Zero tooling. Zero schema evolution. Every client (firmware, Go
server, Python CLI, Swift iOS, C# Android, web) must implement bespoke bit-fiddling code
and keep it synchronized. This is the path that produces years of fragile maintenance.

## The Architecture Already Supports a Hybrid

The codebase already demonstrates the right pattern. `PortNum` discriminates the inner payload
encoding; the outer MeshPacket frame stays protobuf. Two existing examples:

- `TEXT_MESSAGE_COMPRESSED_APP` (portnum 7): Unishox2-compressed UTF-8 inside a protobuf frame
- `AUDIO_APP` (portnum 9): raw Codec2 frames, not protobuf at all

The `Compressed` message in mesh.proto formalizes this: `portnum` + opaque `bytes data`.

This is the correct hybrid model. Protobuf handles what it is genuinely good at — schema-versioned,
multi-language, forward-compatible framing. For message types where every byte matters and the
schema is stable, a dedicated compact inner encoding can live inside the `Data.payload` bytes
without touching the outer frame or breaking any client.

**The one message type that warrants this treatment** is `RouteDiscovery` (traceroute). It has
a very regular structure (parallel arrays of node IDs and SNR values, all fields always
populated), is emitted frequently during diagnostics, and after the sint32 fix still accounts
for the largest single OTA messages. A `TRACEROUTE_COMPACT_APP` portnum with fixed-width
entries and 8-bit SNR resolution could halve the remaining size — exactly as text compression
does today.

## For Flash Storage

Protobuf is close to ideal for config stored on flash. Flash is measured in megabytes, not the
233-byte LoRa payload budget; schema evolution matters when firmware updates change config
structure; and nanopb reads directly into typed C structs with no runtime overhead. No
alternative is worth pursuing here. The structural refactoring in Parts 2-3 (flattening Config
wrappers, merging Lite/Full pairs, extracting common.proto) is the right focus — it simplifies
code and reduces RAM without changing protocols.

## Verdict

| Concern | Recommendation |
|---|---|
| OTA encoding efficiency | Apply the analysis.md fixes first. They deliver 60-80% of all achievable gains while staying in protobuf. |
| Protocol switch for frame layer | Not warranted. Schema evolution + multi-platform tooling + nanopb are not replaceable. |
| Specific high-frequency messages | Hybrid is viable. Consider a compact inner encoding for RouteDiscovery, following the text compression precedent. |
| Flash storage | Stay in protobuf. Focus on the structural refactoring in Parts 2-3. |
| ASN.1 UPER | Best theoretical density; wrong choice for a field-deployed mesh with mixed firmware versions. |
