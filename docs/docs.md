# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [mesh.proto](#mesh.proto)
    - [ChannelSettings](#.ChannelSettings)
    - [Data](#.Data)
    - [DeviceState](#.DeviceState)
    - [FromRadio](#.FromRadio)
    - [LogRecord](#.LogRecord)
    - [MeshPacket](#.MeshPacket)
    - [MyNodeInfo](#.MyNodeInfo)
    - [NodeInfo](#.NodeInfo)
    - [Position](#.Position)
    - [RadioConfig](#.RadioConfig)
    - [RadioConfig.UserPreferences](#.RadioConfig.UserPreferences)
    - [RouteDiscovery](#.RouteDiscovery)
    - [SubPacket](#.SubPacket)
    - [ToRadio](#.ToRadio)
    - [User](#.User)
  
    - [ChannelSettings.ModemConfig](#.ChannelSettings.ModemConfig)
    - [Constants](#.Constants)
    - [CriticalErrorCode](#.CriticalErrorCode)
    - [GpsOperation](#.GpsOperation)
    - [LocationSharing](#.LocationSharing)
    - [LogRecord.Level](#.LogRecord.Level)
    - [RegionCode](#.RegionCode)
    - [RouteError](#.RouteError)
  
- [portnums.proto](#portnums.proto)
    - [PortNum](#.PortNum)
  
- [remote_hardware.proto](#remote_hardware.proto)
    - [HardwareMessage](#.HardwareMessage)
  
    - [HardwareMessage.Type](#.HardwareMessage.Type)
  
- [Scalar Value Types](#scalar-value-types)



<a name="mesh.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## mesh.proto
Meshtastic protobufs

For more information on protobufs (and tools to use them with the language of
your choice) see
https://developers.google.com/protocol-buffers/docs/proto3

We are not placing any of these defs inside a package, because if you do the
resulting nanopb version is super verbose package mesh.

Protobuf build instructions:

To build java classes for reading writing:
protoc -I=. --java_out /tmp mesh.proto

To generate Nanopb c code:
/home/kevinh/packages/nanopb-0.4.0-linux-x86/generator-bin/protoc
--nanopb_out=/tmp -I=app/src/main/proto mesh.proto

Nanopb binaries available here: https://jpa.kapsi.fi/nanopb/download/ use nanopb
0.4.0


<a name=".ChannelSettings"></a>

### ChannelSettings
Full settings (center freq, spread factor, pre-shared secret key etc...)
needed to configure a radio for speaking on a particlar channel This
information can be encoded as a QRcode/url so that other users can configure
their radio to join the same channel.
A note aboute how channel names are shown to users:
channelname-Xy
poundsymbol is a prefix used to indicate this is a channel name (idea from @professr).
Where X is a letter from A-Z (base 26) representing a hash of the PSK for this
channel - so that if the user changes anything about the channel (which does
force a new PSK) this letter will also change. Thus preventing user confusion if
two friends try to type in a channel name of &#34;BobsChan&#34; and then can&#39;t talk
because their PSKs will be different.  The PSK is hashed into this letter by
&#34;0x41 &#43; [xor all bytes of the psk ] modulo 26&#34;
This also allows the option of someday if people have the PSK off (zero), the
users COULD type in a channel name and be able to talk.
Y is a lower case letter from a-z that represents the channel &#39;speed&#39; settings
(for some future definition of speed)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| tx_power | [int32](#int32) |  | If zero then, use default max legal continuous power (ie. something that won&#39;t burn out the radio hardware) In most cases you should use zero here. |
| modem_config | [ChannelSettings.ModemConfig](#ChannelSettings.ModemConfig) |  | Note: This is the &#39;old&#39; mechanism for specifying channel parameters. Either modem_config or bandwidth/spreading/coding will be specified - NOT BOTH. As a heuristic: If bandwidth is specified, do not use modem_config. Because protobufs take ZERO space when the value is zero this works out nicely. This value is replaced by bandwidth/spread_factor/coding_rate. If you&#39;d like to experiment with other options add them to MeshRadio.cpp in the device code. |
| bandwidth | [uint32](#uint32) |  | Bandwidth in MHz Certain bandwidth numbers are &#39;special&#39; and will be converted to the appropriate floating point value: 31 -&gt; 31.25MHz |
| spread_factor | [uint32](#uint32) |  | A number from 7 to 12. Indicates number of chirps per symbol as 1&lt;&lt;spread_factor. |
| coding_rate | [uint32](#uint32) |  | The denominator of the coding rate. ie for 4/8, the value is 8. 5/8 the value is 5. |
| channel_num | [uint32](#uint32) |  | A channel number between 1 and 13 (or whatever the max is in the current region). If ZERO then the rule is &#34;use the old channel name hash based algoritm to derive the channel number&#34;) If using the hash algorithm the channel number will be: hash(channel_name) % NUM_CHANNELS (Where num channels depends on the regulatory region). NUM_CHANNELS_US is 13, for other values see MeshRadio.h in the device code. hash a string into an integer - djb2 by Dan Bernstein. - http://www.cse.yorku.ca/~oz/hash.html unsigned long hash(char *str) { unsigned long hash = 5381; int c; while ((c = *str&#43;&#43;) != 0) hash = ((hash &lt;&lt; 5) &#43; hash) &#43; (unsigned char) c; return hash; } |
| psk | [bytes](#bytes) |  | A simple preshared key for now for crypto. Must be either 0 bytes (no crypto), 16 bytes (AES128), or 32 bytes (AES256) A special shorthand is used for 1 byte long psks. These psks should be treated as only minimally secure, because they are listed in this source code. Those bytes are mapped using the following scheme: 0 = No crypto 1 = The special default channel key: {0xd4, 0xf1, 0xbb, 0x3a, 0x20, 0x29, 0x07, 0x59, 0xf0, 0xbc, 0xff, 0xab, 0xcf, 0x4e, 0x69, 0xbf} 2 through 10 = The default channel key, except with 1 through 9 added to the last byte |
| name | [string](#string) |  | A SHORT name that will be packed into the URL. Less than 12 bytes. Something for end users to call the channel If this is the empty string it is assumed that this channel is the special (minimially secure) &#34;Default&#34; channel. In user interfaces it should be rendered as a local language translation of &#34;X&#34;. For channel_num hashing empty string will be treated as &#34;X&#34;. Where &#34;X&#34; is selected based on the english words listed above for ModemConfig |






<a name=".Data"></a>

### Data
a data message to forward to an external app (or possibly also be consumed
internally in the case of CLEAR_TEXT and CLEAR_READACK)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| portnum | [PortNum](#PortNum) |  | formerly named typ and of type Type |
| payload | [bytes](#bytes) |  | required |






<a name=".DeviceState"></a>

### DeviceState
This message is never sent over the wire, but it is used for serializing DB
state to flash in the device code
FIXME, since we write this each time we enter deep sleep (and have infinite
flash) it would be better to use some sort of append only data structure for
the receive queue and use the preferences store for the other stuff


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| radio | [RadioConfig](#RadioConfig) |  |  |
| my_node | [MyNodeInfo](#MyNodeInfo) |  | Read only settings/info about this node |
| owner | [User](#User) |  | My owner info |
| node_db | [NodeInfo](#NodeInfo) | repeated |  |
| receive_queue | [MeshPacket](#MeshPacket) | repeated | Received packets saved for delivery to the phone |
| version | [uint32](#uint32) |  | A version integer used to invalidate old save files when we make incompatible changes This integer is set at build time and is private to NodeDB.cpp in the device code. |
| rx_text_message | [MeshPacket](#MeshPacket) |  | We keep the last received text message (only) stored in the device flash, so we can show it on the screen. Might be null |
| no_save | [bool](#bool) |  | Used only during development. Indicates developer is testing and changes should never be saved to flash. |
| did_gps_reset | [bool](#bool) |  | Some GPSes seem to have bogus settings from the factory, so we always do one factory reset |
| secondary_channels | [ChannelSettings](#ChannelSettings) | repeated | Secondary channels are only used for encryption/decryption/authentication purposes. Their radio settings (freq etc) are ignored, only psk is used.

Note: this is not kept inside of RadioConfig because that would make ToRadio/FromRadio worse case &gt; 512 bytes (to big for BLE) |






<a name=".FromRadio"></a>

### FromRadio
packets from the radio to the phone will appear on the fromRadio
characteristic.  It will support READ and NOTIFY.  When a new packet arrives
the device will BLE notify?  it will sit in that
descriptor until consumed by the phone, at which point the next item in the
FIFO will be populated.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num | [uint32](#uint32) |  | The packet num, used to allow the phone to request missing read packets from the FIFO, see our bluetooth docs |
| packet | [MeshPacket](#MeshPacket) |  |  |
| my_info | [MyNodeInfo](#MyNodeInfo) |  | Tells the phone what our node number is, can be -1 if we&#39;ve not yet joined a mesh. |
| node_info | [NodeInfo](#NodeInfo) |  | One packet is sent for each node in the on radio DB starts over with the first node in our DB |
| radio | [RadioConfig](#RadioConfig) |  | In rev1 this was the radio BLE characteristic |
| log_record | [LogRecord](#LogRecord) |  | set to send debug console output over our protobuf stream |
| config_complete_id | [uint32](#uint32) |  | sent as true once the device has finished sending all of the responses to want_config recipient should check if this ID matches our original request nonce, if not, it means your config responses haven&#39;t started yet |
| rebooted | [bool](#bool) |  | Sent to tell clients the radio has just rebooted. Set to true if present. Not used on all transports, currently just used for the serial console. |
| secondary_channel | [ChannelSettings](#ChannelSettings) |  | One of the secondary channels, they are all sent during config download |






<a name=".LogRecord"></a>

### LogRecord
Debug output from the device.

To minimize the size of records inside the device code, if a time/source/level is not set 
on the message it is assumed to be a contuinuation of the previously sent message.  This allows
the device code to use fixed maxlen 64 byte strings for messages, and then extend as needed by
emitting multiple records.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| message | [string](#string) |  |  |
| time | [fixed32](#fixed32) |  | Seconds since 1970 - or 0 for unknown/unset |
| source | [string](#string) |  | Usually based on thread name - if known |
| level | [LogRecord.Level](#LogRecord.Level) |  | Not yet set |






<a name=".MeshPacket"></a>

### MeshPacket
A full packet sent/received over the mesh
Note: For simplicity reasons (and that we want to keep over the radio packets
very small, we now assume that there is only _one_ SubPacket in each
MeshPacket).


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| from | [uint32](#uint32) |  | The sending node number. Note: Our crypto implementation uses this field as well. See docs/software/crypto.md for details. FIXME - really should be fixed32 instead, this encoding only hurts the ble link though. |
| to | [uint32](#uint32) |  | The (immediate) destination for this packet. If we are using routing, the final destination will be in payload.dest FIXME - really should be fixed32 instead, this encoding only hurts the ble link though. |
| channel_index | [uint32](#uint32) |  | If set, this indicates the index in the secondary_channels table that this packet was sent/received on. If unset, packet was on the primary channel. |
| decoded | [SubPacket](#SubPacket) |  |  |
| encrypted | [bytes](#bytes) |  |  |
| id | [uint32](#uint32) |  | A unique ID for this packet. Always 0 for no-ack packets or non broadcast packets (and therefore take zero bytes of space). Otherwise a unique ID for this packet. Useful for flooding algorithms. ID only needs to be unique on a _per sender_ basis. And it only needs to be unique for a few minutes (long enough to last for the length of any ACK or the completion of a mesh broadcast flood). Note: Our crypto implementation uses this id as well. See docs/software/crypto.md for details. FIXME - really should be fixed32 instead, this encoding only hurts the ble link though. |
| rx_time | [fixed32](#fixed32) |  | The time this message was received by the esp32 (secs since 1970). Note: / this field is _never_ sent on the radio link itself (to save space) Times / are typically not sent over the mesh, but they will be added to any Packet / (chain of SubPacket) sent to the phone (so the phone can know exact time / of reception) |
| rx_snr | [float](#float) |  | Never* sent over the radio links. Set during reception to indicate the / SNR / of this packet. Used to collect statistics on current link waulity. |
| hop_limit | [uint32](#uint32) |  | If unset treated as zero (no fowarding, send to adjacent nodes only) if 1, allow hopping through one node, etc... For our usecase real world topologies probably have a max of about 3. This field is normally placed into a few of bits in the header. |
| want_ack | [bool](#bool) |  | This packet is being sent as a reliable message, we would prefer it to arrive at the destination. We would like to receive a ack packet in response. Broadcasts messages treat this flag specially: Since acks for broadcasts would rapidly flood the channel, the normal ack behavior is suppressed. Instead, the original sender listens to see if at least one node is rebroadcasting this packet (because naive flooding algoritm). If it hears that the odds (given typical LoRa topologies) the odds are very high that every node should eventually receive the message. So FloodingRouter.cpp generates an implicit ack which is delivered to the original sender. If after some time we don&#39;t hear anyone rebroadcast our packet, we will timeout and retransmit, using the regular resend logic. Note: This flag is normally sent in a flag bit in the header when sent over the wire |






<a name=".MyNodeInfo"></a>

### MyNodeInfo
Unique local debugging info for this node

Note: we don&#39;t include position or the user info, because that will come in the

Sent to the phone in response to WantNodes.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| my_node_num | [uint32](#uint32) |  | Tells the phone what our node number is, default starting value is lowbyte / of macaddr, but it will be fixed if that is already in use |
| has_gps | [bool](#bool) |  | Note: this bool no longer means &#34;we have our own GPS&#34;. Because gps_operation is more advanced, but we&#39;d like old phone apps to keep working. So for legacy reasons we set this flag as follows: if false it would be great if the phone can help provide gps coordinates. If true we don&#39;t need location assistance from the phone. |
| num_channels | [int32](#int32) |  | # of legal channels (set at build time in the device flash image) |
| region | [string](#string) |  | The region code for my radio (US, CN, etc...) Note: This string is deprecated. The 1.0 builds populate it based on the flashed firmware name. But for newer builds this string will be unpopulated (missing/null). For those builds you should instead look at the new read/write region enum in UserSettings The format of this string was 1.0-US or 1.0-CN etc.. Or empty string if unset. |
| hw_model | [string](#string) |  | TBEAM, HELTEC, etc... |
| firmware_version | [string](#string) |  | 0.0.5 etc... |
| error_code | [CriticalErrorCode](#CriticalErrorCode) |  | An error message we&#39;d like to report back to the mothership through / analytics. It indicates a serious bug occurred on the device, the device / coped with it, but we still want to tell the devs about the bug. This / field will be cleared after the phone reads MyNodeInfo (i.e. it will only / be reported once) a numeric error code to go with error message, zero / means no error |
| error_address | [uint32](#uint32) |  | A numeric error address (nonzero if available) |
| error_count | [uint32](#uint32) |  | The total number of errors this node has ever encountered (well - since / the last time we discarded preferences) |
| packet_id_bits | [uint32](#uint32) |  | How many bits are used for the packetid. If zero it is assumed we use eight bit packetids Old device loads (older that 0.6.5 do not populate this field, but all newer loads do). |
| current_packet_id | [uint32](#uint32) |  | The current ID this node is using for sending new packets (exposed so that the phone can self assign packet IDs if it wishes by picking packet IDs from the opposite side of the pacekt ID space). Old device loads (older that 0.6.5 do not populate this field, but all newer loads do). FIXME: that we need to expose this is a bit of a mistake. Really the phones should be modeled/treated as 1st class nodes like any other, and the radio connected to the phone just routes like any other. This would allow all sorts of clean/clever routing topologies in the future. |
| node_num_bits | [uint32](#uint32) |  | How many bits are used for the nodenum. If zero it is assumed we use eight bit nodenums New device loads will user 32 bit nodenum. Old device loads (older that 0.6.5 do not populate this field, but all newer loads do). |
| message_timeout_msec | [uint32](#uint32) |  | How long before we consider a message abandoned and we can clear our caches of any messages in flight Normally quite large to handle the worst case message delivery time, 5 minutes. Formerly called FLOOD_EXPIRE_TIME in the device code |
| min_app_version | [uint32](#uint32) |  | The minimum app version that can talk to this device. Phone/PC apps should compare this to their build number and if too low tell the user they must update their app |






<a name=".NodeInfo"></a>

### NodeInfo
Full information about a node on the mesh


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num | [uint32](#uint32) |  | the node number |
| user | [User](#User) |  | The user info for this node |
| position | [Position](#Position) |  | This position data will also contain a time last seen |
| snr | [float](#float) |  | Returns the Signal-to-noise ratio (SNR) of the last received message, as / measured by the receiver. return SNR of the last received message in dB |
| next_hop | [uint32](#uint32) |  | Our current preferred node node for routing - might be the same as num if / we are adjacent Or zero if we don&#39;t yet know a route to this node. |






<a name=".Position"></a>

### Position
a gps position


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| latitude_i | [sint32](#sint32) |  | The new preferred location encoding, divide by 1e-7 to get degrees in floating point |
| longitude_i | [sint32](#sint32) |  |  |
| altitude | [int32](#int32) |  | In meters above MSL |
| battery_level | [int32](#int32) |  | 1-100 (0 means not provided) |
| time | [fixed32](#fixed32) |  | This is usually not sent over the mesh (to save space), but it is sent / from the phone so that the local device can set its RTC If it is sent over / the mesh (because there are devices on the mesh without GPS), it will only / be sent by devices which has a hardware GPS clock. / seconds since 1970 |






<a name=".RadioConfig"></a>

### RadioConfig
The entire set of user settable/readable settings for our radio device.
Includes both the current channel settings and any preferences the user has
set for behavior of their node


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| preferences | [RadioConfig.UserPreferences](#RadioConfig.UserPreferences) |  |  |
| channel_settings | [ChannelSettings](#ChannelSettings) |  |  |






<a name=".RadioConfig.UserPreferences"></a>

### RadioConfig.UserPreferences
see sw-design.md for more information on these preferences


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| position_broadcast_secs | [uint32](#uint32) |  | We should send our position this often (but only if it has changed significantly). Defaults to 15 minutes |
| send_owner_interval | [uint32](#uint32) |  | Send our owner info at least this often (also we always send once at boot - to rejoin the mesh) |
| wait_bluetooth_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of 1 minute |
| screen_on_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of one minute |
| phone_timeout_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of 15 minutes |
| phone_sds_timeout_sec | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of two hours, MAXUINT for disabled |
| mesh_sds_timeout_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of two hours, MAXUINT for disabled |
| sds_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of one year |
| ls_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of 3600 |
| min_wake_secs | [uint32](#uint32) |  | Power management state machine option. See https://github.com/meshtastic/Meshtastic-device/blob/master/docs/software/power.md for details. 0 for default of 10 seconds |
| wifi_ssid | [string](#string) |  | If set, this node will try to join the specified wifi network and acquire an address via DHCP |
| wifi_password | [string](#string) |  | If set, will be use to authenticate to the named wifi |
| wifi_ap_mode | [bool](#bool) |  | If set, the node will operate as an AP (and DHCP server), otherwise it will be a station |
| region | [RegionCode](#RegionCode) |  | The region code for my radio (US, CN, EU433, etc...) |
| is_router | [bool](#bool) |  | Are we operating as a router. Changes behavior in the following ways: The device will only sleep for critically low battery level (i.e. always tries to stay alive for the mesh) In the future routing decisions will preferentially route packets through nodes with this attribute (because assumed good line of sight) |
| is_low_power | [bool](#bool) |  | If set, we are powered from a low-current source (i.e. solar), so even if it looks like we have power flowing in we should try to minimize power consumption as much as possible. YOU DO NOT NEED TO SET THIS IF YOU&#39;VE set is_router (it is implied in that case). |
| fixed_position | [bool](#bool) |  | If set, this node is at a fixed position. We will generate GPS position updates at the regular interval, but use whatever the last lat/lon/alt we have for the node. The lat/lon/alt can be set by an internal GPS or with the help of the app. |
| factory_reset | [bool](#bool) |  | This setting is never saved to disk, but if set, all device settings will be returned to factory defaults. (Region, serial number etc... will be preserved) |
| debug_log_enabled | [bool](#bool) |  | By default we turn off logging as soon as an API client connects (to keep shared serial link quiet). Set this to true to leave the debug log outputting even when API is active. |
| location_share | [LocationSharing](#LocationSharing) |  | How our location is shared with other nodes (or the local phone) |
| gps_operation | [GpsOperation](#GpsOperation) |  | How the GPS hardware in this unit is operated. Note: This is independent of how our location is shared with other devices. For that see LocationSharing |
| gps_update_interval | [uint32](#uint32) |  | How often should we try to get GPS position (in seconds) when we are in GpsOpMobile mode? or zero for the default of once every 120 seconds or a very large value (maxint) to update only once at boot. |
| gps_attempt_time | [uint32](#uint32) |  | How long should we try to get our position during each gps_update_interval attempt? (in seconds) Or if zero, use the default of 30 seconds. If we don&#39;t get a new gps fix in that time, the gps will be put into sleep until the next gps_update_rate window. |
| ignore_incoming | [uint32](#uint32) | repeated | For testing it is useful sometimes to force a node to never listen to particular other nodes (simulating radio out of range). All nodenums listed in ignore_incoming will have packets they send droped on receive (by router.cpp) |






<a name=".RouteDiscovery"></a>

### RouteDiscovery
A message used in our Dynamic Source Routing protocol (RFC 4728 based)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| route | [int32](#int32) | repeated | The list of nodes this packet has visited so far |






<a name=".SubPacket"></a>

### SubPacket
The payload portion fo a packet, this is the actual bytes that are sent
inside a radio packet (because from/to are broken out by the comms library)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| position | [Position](#Position) |  | Prior to 1.20 positions were communicated as a special payload type, now they are GPS_POSITION_APP Data |
| data | [Data](#Data) |  |  |
| user | [User](#User) |  | Prior to 1.20 positions were communicated as a special payload type, now they are MESH_USERINFO_APP |
| route_request | [RouteDiscovery](#RouteDiscovery) |  | A route request going from the requester |
| route_reply | [RouteDiscovery](#RouteDiscovery) |  | A route reply |
| route_error | [RouteError](#RouteError) |  | A failure in a routed message |
| want_response | [bool](#bool) |  | Not normally used, but for testing a sender can request that recipient responds in kind (i.e. if it received a position, it should unicast back its position). Note: that if you set this on a broadcast you will receive many replies. |
| success_id | [uint32](#uint32) |  | This packet is a requested acknoledgement indicating that we have received the specified message ID. This packet type can be used both for immediate (0 hops) messages or can be routed through multiple hops if dest is set. Note: As an optimization, recipients can _also_ populate a field in payload if they think the recipient would appreciate that extra state. |
| fail_id | [uint32](#uint32) |  | This is a nak, we failed to deliver this message. |
| dest | [uint32](#uint32) |  | The address of the destination node. This field is is filled in by the mesh radio device software, applicaiton layer software should never need it. RouteDiscovery messages _must_ populate this. Other message types might need to if they are doing multihop routing. |
| source | [uint32](#uint32) |  | The address of the original sender for this message. This field should _only_ be populated for reliable multihop packets (to keep packets small). |
| original_id | [uint32](#uint32) |  | Only used in route_error messages. Indicates the original message ID that this message is reporting failure on. |






<a name=".ToRadio"></a>

### ToRadio
packets/commands to the radio will be written (reliably) to the toRadio
characteristic.  Once the write completes the phone can assume it is handled.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| packet | [MeshPacket](#MeshPacket) |  | send this packet on the mesh |
| want_config_id | [uint32](#uint32) |  | phone wants radio to send full node db to the phone, This is typically the first packet sent to the radio when the phone gets a bluetooth connection. The radio will respond by sending back a MyNodeInfo, a owner, a radio config and a series of FromRadio.node_infos, and config_complete the integer you write into this field will be reported back in the config_complete_id response this allows clients to never be confused by a stale old partially sent config. |
| set_radio | [RadioConfig](#RadioConfig) |  | set the radio provisioning for this node |
| set_owner | [User](#User) |  | Set the owner for this node |






<a name=".User"></a>

### User
Broadcast when a newly powered mesh node wants to find a node num it can use
// Sent from the phone over bluetooth to set the user id for the owner of this
node.
// Also sent from nodes to each other when a new node signs on (so all clients
can have this info)

The algorithm is as follows:
when a node starts up, it broadcasts their user and the normal flow is for all
other nodes to reply with their User as well (so the new node can build its node
db)
If a node ever receives a User (not just the first broadcast) message where
the sender node number equals our node number, that indicates a collision has
occurred and the following steps should happen:

If the receiving node (that was already in the mesh)&#39;s macaddr is LOWER than the
new User who just tried to sign in: it gets to keep its nodenum.  We send a
broadcast message of OUR User (we use a broadcast so that the other node can
receive our message, considering we have the same id - it also serves to let
observers correct their nodedb) - this case is rare so it should be okay.

If any node receives a User where the macaddr is GTE than their local macaddr,
they have been vetoed and should pick a new random nodenum (filtering against
whatever it knows about the nodedb) and rebroadcast their User.

A few nodenums are reserved and will never be requested:
0xff - broadcast
0 through 3 - for future use


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | a globally unique ID string for this user. In the case of Signal that would mean &#43;16504442323, for the default macaddr derived id it would be !&lt;6 hexidecimal bytes&gt; |
| long_name | [string](#string) |  | A full name for this user, i.e. &#34;Kevin Hester&#34; |
| short_name | [string](#string) |  | A VERY short name, ideally two characters. Suitable for a tiny OLED screen |
| macaddr | [bytes](#bytes) |  | This is the addr of the radio. Not populated by the phone, but added by the esp32 when broadcasting |





 


<a name=".ChannelSettings.ModemConfig"></a>

### ChannelSettings.ModemConfig
Standard predefined channel settings 
Note: these mappings must match ModemConfigChoice in the device code.

| Name | Number | Description |
| ---- | ------ | ----------- |
| Bw125Cr45Sf128 | 0 | &lt; Bw = 125 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC |
| Bw500Cr45Sf128 | 1 | &lt; Bw = 500 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC |
| Bw31_25Cr48Sf512 | 2 | &lt; Bw = 31.25 kHz, Cr = 4/8, Sf = 512chips/symbol, |
| Bw125Cr48Sf4096 | 3 | &lt; Bw = 125 kHz, Cr = 4/8, Sf = 4096chips/symbol, CRC |



<a name=".Constants"></a>

### Constants
Shared constants between device and phone

| Name | Number | Description |
| ---- | ------ | ----------- |
| Unused | 0 | First enum must be zero, and we are just using this enum to pass int constants between two very different environments |
| DATA_PAYLOAD_LEN | 240 | From mesh.options note: this payload length is ONLY the bytes that are sent inside of the radiohead packet Data.payload max_size:240 |



<a name=".CriticalErrorCode"></a>

### CriticalErrorCode
Error codes for critical errors

The device might report these fault codes on the screen.  If you encounter a fault code, please
post on the meshtastic.discourse.group and we&#39;ll try to help.

| Name | Number | Description |
| ---- | ------ | ----------- |
| None | 0 |  |
| TxWatchdog | 1 | A software bug was detected while trying to send lora |
| SleepEnterWait | 2 | A software bug was detected on entry to sleep |
| NoRadio | 3 | No Lora radio hardware could be found |
| Unspecified | 4 | Not normally used |
| UBloxInitFailed | 5 | We failed while configuring a UBlox GPS |
| NoAXP192 | 6 | This board was expected to have a power management chip and it is missing or broken |
| InvalidRadioSetting | 7 | The channel tried to set a radio setting which is not supported by this chipset, radio comms settings are now undefined. |



<a name=".GpsOperation"></a>

### GpsOperation
How the GPS hardware in this unit is operated.

Note: This is independent of how our location is shared with other devices.  For that see LocationSharing

| Name | Number | Description |
| ---- | ------ | ----------- |
| GpsOpUnset | 0 | This is treated as GpsOpMobile - it is the default settting |
| GpsOpMobile | 2 | This node is mobile and we should get GPS position at a rate governed by gps_update_rate |
| GpsOpTimeOnly | 3 | We should only use the GPS to get time (no location data should be acquired/stored) Once we have the time we treat gps_update_interval as MAXINT (i.e. sleep forever) |
| GpsOpDisabled | 4 | GPS is always turned off - this mode is not recommended - use GpsOpTimeOnly instead |



<a name=".LocationSharing"></a>

### LocationSharing
How our location is shared with other nodes (or the local phone)

| Name | Number | Description |
| ---- | ------ | ----------- |
| LocUnset | 0 | This is the default and treated as LocEnabled) |
| LocEnabled | 1 | We are sharing our location |
| LocDisabled | 2 | We are not sharing our location (if the unit has a GPS it will default to only get time - i.e. GpsOpTimeOnly) |



<a name=".LogRecord.Level"></a>

### LogRecord.Level
Log levels, chosen to match python logging conventions.

| Name | Number | Description |
| ---- | ------ | ----------- |
| UNSET | 0 |  |
| CRITICAL | 50 |  |
| ERROR | 40 |  |
| WARNING | 30 |  |
| INFO | 20 |  |
| DEBUG | 10 |  |
| TRACE | 5 |  |



<a name=".RegionCode"></a>

### RegionCode
The frequency/regulatory region the user has selected.

Note: In 1.0 builds (which must still be supported by the android app for a
long time) this field will be unpopulated.

If firmware is ever upgraded from an old 1.0ish build, the old
MyNodeInfo.region string will be used to set UserPreferences.region and the
old value will be no longer set.

| Name | Number | Description |
| ---- | ------ | ----------- |
| Unset | 0 |  |
| US | 1 |  |
| EU433 | 2 |  |
| EU865 | 3 |  |
| CN | 4 |  |
| JP | 5 |  |
| ANZ | 6 |  |
| KR | 7 |  |
| TW | 8 |  |



<a name=".RouteError"></a>

### RouteError


| Name | Number | Description |
| ---- | ------ | ----------- |
| NONE | 0 |  |
| NO_ROUTE | 1 | Our node doesn&#39;t have a route to the requested destination anymore. |
| GOT_NAK | 2 | We received a nak while trying to forward on your behalf |
| TIMEOUT | 3 |  |


 

 

 



<a name="portnums.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## portnums.proto


 


<a name=".PortNum"></a>

### PortNum
For any new &#39;apps&#39; that run on the device or via sister apps on phones/PCs they should pick and use a
unique &#39;portnum&#39; for their application.

If you are making a new app using meshtastic, please send in a pull request to add your &#39;portnum&#39; to this
master table.  PortNums should be assigned in the following range:

0-63   Core Meshtastic use, do not use for third party apps
64-127 Registered 3rd party apps, send in a pull request that adds a new entry to portnums.proto to 
register your application
256-511 Use one of these portnums for your private applications that you don&#39;t want to register publically

All other values are reserved.

Note: This was formerly a Type enum named &#39;typ&#39; with the same id #

We have change to this &#39;portnum&#39; based scheme for specifying app handlers for particular payloads.  
This change is backwards compatible by treating the legacy OPAQUE/CLEAR_TEXT values identically.

| Name | Number | Description |
| ---- | ------ | ----------- |
| UNKNOWN_APP | 0 | Deprecated: do not use in new code (formerly called OPAQUE) A message sent from a device outside of the mesh, in a form the mesh does not understand NOTE: This must be 0, because it is documented in IMeshService.aidl to be so |
| TEXT_MESSAGE_APP | 1 | a simple UTF-8 text message, which even the little micros in the mesh can understand and show on their screen eventually in some circumstances even signal might send messages in this form (see below) Formerly called CLEAR_TEXT |
| REMOTE_HARDWARE_APP | 2 | Reserved for built-in GPIO/example app. See remote_hardware.proto/HardwareMessage for details on the message sent/received to this port number |
| POSITION_APP | 3 | The built-in position messaging app. See Position for details on the message sent to this port number. |
| NODEINFO_APP | 4 | The built-in user info app. See User for details on the message sent to this port number. |
| REPLY_APP | 32 | Provides a &#39;ping&#39; service that replies to any packet it receives. Also this serves as a small example plugin. |
| IP_TUNNEL_APP | 33 | Used for the python IP tunnel feature |
| PRIVATE_APP | 256 | Private applications should use portnums &gt;= 256. To simplify initial development and testing you can use &#34;PRIVATE_APP&#34; in your code without needing to rebuild protobuf files (via bin/regin_protos.sh) |


 

 

 



<a name="remote_hardware.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## remote_hardware.proto



<a name=".HardwareMessage"></a>

### HardwareMessage
A example app to show off the plugin system. This message is used for REMOTE_HARDWARE_APP PortNums.

Also provides easy remote access to any GPIO.  

In the future other remote hardware operations can be added based on user interest 
(i.e. serial output, spi/i2c input/output).

FIXME - currently this feature is turned on by default which is dangerous because no security yet (beyond the 
channel mechanism).  It should be off by default and then protected based on some TBD mechanism (a special channel
once multichannel support is included?)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| typ | [HardwareMessage.Type](#HardwareMessage.Type) |  | What type of HardwareMessage is this? |
| gpio_mask | [uint64](#uint64) |  | What gpios are we changing. Not used for all MessageTypes, see MessageType for details |
| gpio_value | [uint64](#uint64) |  | For gpios that were listed in gpio_mask as valid, what are the signal levels for those gpios. Not used for all MessageTypes, see MessageType for details |





 


<a name=".HardwareMessage.Type"></a>

### HardwareMessage.Type


| Name | Number | Description |
| ---- | ------ | ----------- |
| UNSET | 0 | Unset/unused |
| WRITE_GPIOS | 1 | Set gpio gpios based on gpio_mask/gpio_value |
| WATCH_GPIOS | 2 | We are now interested in watching the gpio_mask gpios. If the selected gpios change, please broadcast GPIOS_CHANGED.

Will implicitly change the gpios requested to be INPUT gpios. |
| GPIOS_CHANGED | 3 | The gpios listed in gpio_mask have changed, the new values are listed in gpio_value |
| READ_GPIOS | 4 | Read the gpios specified in gpio_mask, send back a READ_GPIOS_REPLY reply with gpio_value populated |
| READ_GPIOS_REPLY | 5 | A reply to READ_GPIOS. gpio_mask and gpio_value will be populated |


 

 

 



## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |

