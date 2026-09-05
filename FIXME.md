# Proto FIXME Notes

Extracted from inline `FIXME` comments in the `.proto` source files.
These represent known technical debt, missing documentation, or design issues to address.

---

## deviceonly.proto — DeviceState flash storage strategy

**File:** `deviceonly.proto` line 176
**Message:** `DeviceState`

> Since we write this each time we enter deep sleep (and have infinite flash) it would be better to use some sort of append-only data structure for the receive queue and use the preferences store for the other stuff.

**Impact:** Flash wear. Every deep-sleep cycle rewrites the full `DeviceState` blob. An append-only log for `receive_queue` plus a separate preferences store would reduce write amplification significantly.

---

## remote_hardware.proto — Feature enabled by default without auth

**File:** `remote_hardware.proto` line 17
**Message:** `HardwareMessage`

> Currently this feature is turned on by default which is dangerous because no security yet (beyond the channel mechanism). It should be off by default and then protected based on some TBD mechanism (a special channel once multichannel support is included?).

**Impact:** Security. Any node on the same channel can read/write GPIO pins on a remote node. The `RemoteHardwareConfig.enabled` flag (default `false`) now exists in `module_config.proto`, but the comment suggests the original code path may bypass it. Verify that the config flag is actually enforced in firmware.

---

## channel.proto — Missing multi-channel documentation

**File:** `channel.proto` lines 25-27
**Message:** `ChannelSettings`

> FIXME: Add description of multi-channel support and how primary vs secondary channels are used.
> FIXME: explain how apps use channels for security. Explain how remote settings and remote GPIO are managed as an example.

**Impact:** Documentation. The proto comment block for `ChannelSettings` is the primary reference for client developers. It should explain:
1. How PRIMARY vs SECONDARY channel roles work (only one PRIMARY sets the radio frequency; SECONDARY channels share the frequency but use independent PSKs for encryption).
2. How admin messages are secured via the admin channel.
3. How `RemoteHardware` module uses a dedicated channel for GPIO access control.

---

## channel.proto — Well Known Channels reference

**File:** `channel.proto` line 67
**Field:** `ChannelSettings.id`

> (see Well Known Channels FIXME)

**Impact:** Documentation. The comment references a "Well Known Channels" table that doesn't exist in the proto files. Should either:
1. Add a comment or enum listing the well-known channel IDs and their purposes, or
2. Link to the relevant firmware/docs source where these are defined.
