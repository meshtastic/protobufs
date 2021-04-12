# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [admin.proto](#admin.proto)
    - [AdminMessage](#.AdminMessage)
  
- [apponly.proto](#apponly.proto)
    - [ChannelSet](#.ChannelSet)
  
- [channel.proto](#channel.proto)
    - [Channel](#.Channel)
    - [ChannelSettings](#.ChannelSettings)
  
    - [Channel.Role](#.Channel.Role)
    - [ChannelSettings.ModemConfig](#.ChannelSettings.ModemConfig)
  
- [deviceonly.proto](#deviceonly.proto)
    - [ChannelFile](#.ChannelFile)
    - [DeviceState](#.DeviceState)
    - [LegacyRadioConfig](#.LegacyRadioConfig)
    - [LegacyRadioConfig.LegacyPreferences](#.LegacyRadioConfig.LegacyPreferences)
  
- [environmental_measurement.proto](#environmental_measurement.proto)
    - [EnvironmentalMeasurement](#.EnvironmentalMeasurement)
  
- [mesh.proto](#mesh.proto)
    - [Data](#.Data)
    - [FromRadio](#.FromRadio)
    - [LogRecord](#.LogRecord)
    - [MeshPacket](#.MeshPacket)
    - [MyNodeInfo](#.MyNodeInfo)
    - [NodeInfo](#.NodeInfo)
    - [Position](#.Position)
    - [RouteDiscovery](#.RouteDiscovery)
    - [Routing](#.Routing)
    - [ToRadio](#.ToRadio)
    - [ToRadio.PeerInfo](#.ToRadio.PeerInfo)
    - [User](#.User)
  
    - [Constants](#.Constants)
    - [CriticalErrorCode](#.CriticalErrorCode)
    - [HardwareModel](#.HardwareModel)
    - [LogRecord.Level](#.LogRecord.Level)
    - [MeshPacket.Priority](#.MeshPacket.Priority)
    - [Routing.Error](#.Routing.Error)
  
- [mqtt.proto](#mqtt.proto)
    - [ServiceEnvelope](#.ServiceEnvelope)
  
- [portnums.proto](#portnums.proto)
    - [PortNum](#.PortNum)
  
- [radioconfig.proto](#radioconfig.proto)
    - [RadioConfig](#.RadioConfig)
    - [RadioConfig.UserPreferences](#.RadioConfig.UserPreferences)
  
    - [ChargeCurrent](#.ChargeCurrent)
    - [GpsOperation](#.GpsOperation)
    - [LocationSharing](#.LocationSharing)
    - [RadioConfig.UserPreferences.EnvironmentalMeasurementSensorType](#.RadioConfig.UserPreferences.EnvironmentalMeasurementSensorType)
    - [RegionCode](#.RegionCode)
  
- [remote_hardware.proto](#remote_hardware.proto)
    - [HardwareMessage](#.HardwareMessage)
  
    - [HardwareMessage.Type](#.HardwareMessage.Type)
  
- [Scalar Value Types](#scalar-value-types)



<a name="admin.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## admin.proto



<a name=".AdminMessage"></a>

### AdminMessage
This message is handled by the Admin plugin and is responsible for all settings/channel read/write operations.  This message
is used to do settings operations to both remote AND local nodes.
(Prior to 1.2 these operations were done via special ToRadio operations)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| set_radio | [RadioConfig](#RadioConfig) |  | set the radio provisioning for this node |
| set_owner | [User](#User) |  | Set the owner for this node |
| set_channel | [Channel](#Channel) |  | Set channels (using the new API). A special channel is the &#34;primary channel&#34;. The other records are secondary channels. Note: only one channel can be marked as primary. If the client sets a particular channel to be primary, the previous channel will be set to SECONDARY automatically |
| get_radio_request | [bool](#bool) |  | Send the current RadioConfig in the response for this message |
| get_radio_response | [RadioConfig](#RadioConfig) |  |  |
| get_channel_request | [uint32](#uint32) |  | Send the specified channel in the response for this message NOTE: This field is sent with the channel index &#43; 1 (to ensure we never try to send &#39;zero&#39; - which protobufs treats as not present) |
| get_channel_response | [Channel](#Channel) |  |  |
| confirm_set_channel | [bool](#bool) |  | Setting channels/radio config remotely carries the risk that you might send an invalid config and the radio never talks to your mesh again. Therefore if setting either of these properties remotely, you must send a confirm_xxx message within 10 minutes. If you fail to do so, the radio will assume loss of comms and revert your changes. These messages are optional when changing the local node. |
| confirm_set_radio | [bool](#bool) |  |  |
| exit_simulator | [bool](#bool) |  | This message is only supported for the simulator porduino build. If received the simulator will exit successfully/ |
| reboot_seconds | [int32](#int32) |  | Tell the node to reboot in this many seconds (or &lt;0 to cancel reboot) |





 

 

 

 



<a name="apponly.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## apponly.proto



<a name=".ChannelSet"></a>

### ChannelSet
This is the most compact possible representation for a set of channels.  It includes only one PRIMARY channel (which must be first) and
any SECONDARY channels.  No DISABLED channels are included.
This abstraction is used only on the the &#39;app side&#39; of the world (ie python, javascript and android etc) to show a group of Channels as a (long) URL


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| settings | [ChannelSettings](#ChannelSettings) | repeated |  |





 

 

 

 



<a name="channel.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## channel.proto
Meshtastic protobufs

For more information on protobufs (and tools to use them with the language of your choice) see
https://developers.google.com/protocol-buffers/docs/proto3

We are not placing any of these defs inside a package, because if you do the
resulting nanopb version is super verbose package mesh.

Protobuf build instructions:

To build java classes for reading writing:
protoc -I=. --java_out /tmp mesh.proto

To generate Nanopb c code:
/home/kevinh/packages/nanopb-0.4.0-linux-x86/generator-bin/protoc --nanopb_out=/tmp -I=app/src/main/proto mesh.proto

Nanopb binaries available here: https://jpa.kapsi.fi/nanopb/download/ use nanopb 0.4.0


<a name=".Channel"></a>

### Channel
A pair of a channel number, mode and the (sharable) settings for that channel


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| index | [int32](#int32) |  | The index of this channel in the channel table (from 0 to MAX_NUM_CHANNELS-1) (Someday - not currently implemented) An index of -1 could be used to mean &#34;set by name&#34;, in which case the target node will find and set the channel by settings.name. |
| settings | [ChannelSettings](#ChannelSettings) |  | The new settings, or NULL to disable that channel |
| role | [Channel.Role](#Channel.Role) |  |  |






<a name=".ChannelSettings"></a>

### ChannelSettings
Full settings (center freq, spread factor, pre-shared secret key etc...)
needed to configure a radio for speaking on a particular channel This
information can be encoded as a QRcode/url so that other users can configure
their radio to join the same channel.
A note about how channel names are shown to users: channelname-Xy
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

FIXME: Add description of multi-channel support and how primary vs secondary channels are used.
FIXME: explain how apps use channels for security.  explain how remote settings and 
remote gpio are managed as an example


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| tx_power | [int32](#int32) |  | If zero then, use default max legal continuous power (ie. something that won&#39;t burn out the radio hardware) In most cases you should use zero here. Units are in dBm. |
| modem_config | [ChannelSettings.ModemConfig](#ChannelSettings.ModemConfig) |  | Note: This is the &#39;old&#39; mechanism for specifying channel parameters. Either modem_config or bandwidth/spreading/coding will be specified - NOT BOTH. As a heuristic: If bandwidth is specified, do not use modem_config. Because protobufs take ZERO space when the value is zero this works out nicely. This value is replaced by bandwidth/spread_factor/coding_rate. If you&#39;d like to experiment with other options add them to MeshRadio.cpp in the device code. |
| bandwidth | [uint32](#uint32) |  | Bandwidth in MHz Certain bandwidth numbers are &#39;special&#39; and will be converted to the appropriate floating point value: 31 -&gt; 31.25MHz |
| spread_factor | [uint32](#uint32) |  | A number from 7 to 12. Indicates number of chirps per symbol as 1&lt;&lt;spread_factor. |
| coding_rate | [uint32](#uint32) |  | The denominator of the coding rate. ie for 4/8, the value is 8. 5/8 the value is 5. |
| channel_num | [uint32](#uint32) |  | NOTE: this field is _independent_ and unrelated to the concepts in channel.proto. this is controlling the actual hardware frequency the radio is transmitting on. In a perfect world we would have called it something else (band?) but I forgot to make this change during the big 1.2 renaming. Most users should never need to be exposed to this field/concept. A channel number between 1 and 13 (or whatever the max is in the current region). If ZERO then the rule is &#34;use the old channel name hash based algorithm to derive the channel number&#34;) If using the hash algorithm the channel number will be: hash(channel_name) % NUM_CHANNELS (Where num channels depends on the regulatory region). NUM_CHANNELS_US is 13, for other values see MeshRadio.h in the device code. hash a string into an integer - djb2 by Dan Bernstein. - http://www.cse.yorku.ca/~oz/hash.html unsigned long hash(char *str) { unsigned long hash = 5381; int c; while ((c = *str&#43;&#43;) != 0) hash = ((hash &lt;&lt; 5) &#43; hash) &#43; (unsigned char) c; return hash; } |
| psk | [bytes](#bytes) |  | A simple pre-shared key for now for crypto. Must be either 0 bytes (no crypto), 16 bytes (AES128), or 32 bytes (AES256) A special shorthand is used for 1 byte long psks. These psks should be treated as only minimally secure, because they are listed in this source code. Those bytes are mapped using the following scheme: `0` = No crypto `1` = The special &#34;default&#34; channel key: {0xd4, 0xf1, 0xbb, 0x3a, 0x20, 0x29, 0x07, 0x59, 0xf0, 0xbc, 0xff, 0xab, 0xcf, 0x4e, 0x69, 0xbf} `2` through 10 = The default channel key, except with 1 through 9 added to the last byte. Shown to user as simple1 through 10 |
| name | [string](#string) |  | A SHORT name that will be packed into the URL. Less than 12 bytes. Something for end users to call the channel If this is the empty string it is assumed that this channel is the special (minimally secure) &#34;Default&#34;channel. In user interfaces it should be rendered as a local language translation of &#34;X&#34;. For channel_num hashing empty string will be treated as &#34;X&#34;. Where &#34;X&#34; is selected based on the English words listed above for ModemConfig |
| id | [fixed32](#fixed32) |  | Used to construct a globally unique channel ID. The full globally unique ID will be: &#34;name.id&#34; where ID is shown as base36. Assuming that the number of meshtastic users is below 20K (true for a long time) the chance of this 64 bit random number colliding with anyone else is super low. And the penalty for collision is low as well, it just means that anyone trying to decrypt channel messages might need to try multiple candidate channels. Any time a non wire compatible change is made to a channel, this field should be regenerated. There are a small number of &#39;special&#39; globally known (and fairly) insecure standard channels. Those channels do not have a numeric id included in the settings, but instead it is pulled from a table of well known IDs. (see Well Known Channels FIXME) |
| uplink_enabled | [bool](#bool) |  | If true, messages on the mesh will be sent to the *public* internet by any gateway ndoe |
| downlink_enabled | [bool](#bool) |  | If true, messages seen on the internet will be forwarded to the local mesh. |





 


<a name=".Channel.Role"></a>

### Channel.Role
How this channel is being used (or not).

Note: this field is an enum to give us options for the future.  In particular, someday
we might make a &#39;SCANNING&#39; option.  SCANNING channels could have different frequencies and the radio would
occasionally check that freq to see if anything is being transmitted.

For devices that have multiple physical radios attached, we could keep multiple PRIMARY/SCANNING channels active at once to allow
cross band routing as needed.  If a device has only a single radio (the common case) only one channel can be PRIMARY at a time
(but any number of SECONDARY channels can&#39;t be sent received on that common frequency)

| Name | Number | Description |
| ---- | ------ | ----------- |
| DISABLED | 0 | This channel is not in use right now |
| PRIMARY | 1 | This channel is used to set the frequency for the radio - all other enabled channels must be SECONDARY |
| SECONDARY | 2 | Secondary channels are only used for encryption/decryption/authentication purposes. Their radio settings (freq etc) are ignored, only psk is used. |



<a name=".ChannelSettings.ModemConfig"></a>

### ChannelSettings.ModemConfig
Standard predefined channel settings 
Note: these mappings must match ModemConfigChoice in the device code.

| Name | Number | Description |
| ---- | ------ | ----------- |
| Bw125Cr45Sf128 | 0 | &lt; Bw = 125 kHz, Cr = 4/5, Sf(7) = 128chips/symbol, CRC &lt; on. Default medium range (5.469 kbps) |
| Bw500Cr45Sf128 | 1 | &lt; Bw = 500 kHz, Cr = 4/5, Sf(7) = 128chips/symbol, CRC &lt; on. Fast&#43;short range (21.875 kbps) |
| Bw31_25Cr48Sf512 | 2 | &lt; Bw = 31.25 kHz, Cr = 4/8, Sf(9) = 512chips/symbol, &lt; CRC on. Slow&#43;long range (275 bps) |
| Bw125Cr48Sf4096 | 3 | &lt; Bw = 125 kHz, Cr = 4/8, Sf(12) = 4096chips/symbol, CRC &lt; on. Slow&#43;long range (183 bps) |


 

 

 



<a name="deviceonly.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## deviceonly.proto



<a name=".ChannelFile"></a>

### ChannelFile
The on-disk saved channels


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| channels | [Channel](#Channel) | repeated | The channels our node knows about |






<a name=".DeviceState"></a>

### DeviceState
This message is never sent over the wire, but it is used for serializing DB
state to flash in the device code
FIXME, since we write this each time we enter deep sleep (and have infinite
flash) it would be better to use some sort of append only data structure for
the receive queue and use the preferences store for the other stuff


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| legacyRadio | [LegacyRadioConfig](#LegacyRadioConfig) |  | Moved to its own file, but we keep this here so we can automatically migrate old radio.region settings |
| my_node | [MyNodeInfo](#MyNodeInfo) |  | Read only settings/info about this node |
| owner | [User](#User) |  | My owner info |
| node_db | [NodeInfo](#NodeInfo) | repeated |  |
| receive_queue | [MeshPacket](#MeshPacket) | repeated | Received packets saved for delivery to the phone |
| version | [uint32](#uint32) |  | A version integer used to invalidate old save files when we make incompatible changes This integer is set at build time and is private to NodeDB.cpp in the device code. |
| rx_text_message | [MeshPacket](#MeshPacket) |  | We keep the last received text message (only) stored in the device flash, so we can show it on the screen. Might be null |
| no_save | [bool](#bool) |  | Used only during development. Indicates developer is testing and changes should never be saved to flash. |
| did_gps_reset | [bool](#bool) |  | Some GPSes seem to have bogus settings from the factory, so we always do one factory reset. |






<a name=".LegacyRadioConfig"></a>

### LegacyRadioConfig
This is a stub version of the old 1.1 representation of RadioConfig.  But only keeping the region info.  The device firmware uses
this stub while migrating old nodes to the new preferences system.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| preferences | [LegacyRadioConfig.LegacyPreferences](#LegacyRadioConfig.LegacyPreferences) |  |  |






<a name=".LegacyRadioConfig.LegacyPreferences"></a>

### LegacyRadioConfig.LegacyPreferences



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| region | [RegionCode](#RegionCode) |  | The region code for my radio (US, CN, EU433, etc...) |





 

 

 

 



<a name="environmental_measurement.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## environmental_measurement.proto



<a name=".EnvironmentalMeasurement"></a>

### EnvironmentalMeasurement



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| temperature | [float](#float) |  |  |
| relative_humidity | [float](#float) |  |  |
| barometric_pressure | [float](#float) |  |  |





 

 

 

 



<a name="mesh.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## mesh.proto
Meshtastic protobufs

For more information on protobufs (and tools to use them with the language of your choice) see
https://developers.google.com/protocol-buffers/docs/proto3

We are not placing any of these defs inside a package, because if you do the
resulting nanopb version is super verbose package mesh.

Protobuf build instructions:

To build java classes for reading writing:
protoc -I=. --java_out /tmp mesh.proto

To generate Nanopb c code:
/home/kevinh/packages/nanopb-0.4.0-linux-x86/generator-bin/protoc --nanopb_out=/tmp -I=app/src/main/proto mesh.proto

Nanopb binaries available here: https://jpa.kapsi.fi/nanopb/download/ use nanopb 0.4.0


<a name=".Data"></a>

### Data
(Formerly called SubPacket)
The payload portion fo a packet, this is the actual bytes that are sent
inside a radio packet (because from/to are broken out by the comms library)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| portnum | [PortNum](#PortNum) |  | Formerly named typ and of type Type |
| payload | [bytes](#bytes) |  | Required |
| want_response | [bool](#bool) |  | Not normally used, but for testing a sender can request that recipient responds in kind (i.e. if it received a position, it should unicast back it&#39;s position). Note: that if you set this on a broadcast you will receive many replies. |
| dest | [fixed32](#fixed32) |  | The address of the destination node. This field is is filled in by the mesh radio device software, application layer software should never need it. RouteDiscovery messages _must_ populate this. Other message types might need to if they are doing multihop routing. |
| source | [fixed32](#fixed32) |  | The address of the original sender for this message. This field should _only_ be populated for reliable multihop packets (to keep packets small). |
| request_id | [fixed32](#fixed32) |  | Only used in routing or response messages. Indicates the original message ID that this message is reporting failure on. (formerly called original_id) |






<a name=".FromRadio"></a>

### FromRadio
Packets from the radio to the phone will appear on the fromRadio characteristic.
It will support READ and NOTIFY. When a new packet arrives the device will BLE notify?
It will sit in that descriptor until consumed by the phone,
at which point the next item in the FIFO will be populated.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num | [uint32](#uint32) |  | The packet num, used to allow the phone to request missing read packets from the FIFO, see our bluetooth docs |
| packet | [MeshPacket](#MeshPacket) |  |  |
| my_info | [MyNodeInfo](#MyNodeInfo) |  | Tells the phone what our node number is, can be -1 if we&#39;ve not yet joined a mesh. NOTE: This ID must not change - to keep (minimal) compatibility with &lt;1.2 version of android apps. |
| node_info | [NodeInfo](#NodeInfo) |  | One packet is sent for each node in the on radio DB starts over with the first node in our DB |
| log_record | [LogRecord](#LogRecord) |  | set to send debug console output over our protobuf stream |
| config_complete_id | [uint32](#uint32) |  | sent as true once the device has finished sending all of the responses to want_config recipient should check if this ID matches our original request nonce, if not, it means your config responses haven&#39;t started yet. NOTE: This ID must not change - to keep (minimal) compatibility with &lt;1.2 version of android apps. |
| rebooted | [bool](#bool) |  | Sent to tell clients the radio has just rebooted. Set to true if present. Not used on all transports, currently just used for the serial console. NOTE: This ID must not change - to keep (minimal) compatibility with &lt;1.2 version of android apps. |






<a name=".LogRecord"></a>

### LogRecord
Debug output from the device.

To minimize the size of records inside the device code, if a time/source/level is not set 
on the message it is assumed to be a continuation of the previously sent message.
This allows the device code to use fixed maxlen 64 byte strings for messages,
and then extend as needed by emitting multiple records.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| message | [string](#string) |  |  |
| time | [fixed32](#fixed32) |  | Seconds since 1970 - or 0 for unknown/unset |
| source | [string](#string) |  | Usually based on thread name - if known |
| level | [LogRecord.Level](#LogRecord.Level) |  | Not yet set |






<a name=".MeshPacket"></a>

### MeshPacket
A packet envelope sent/received over the mesh
only payloadVariant is sent in the payload portion of the LORA packet.
The other fields are either not sent at all, or sent in the special 16 byte LORA header.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| from | [fixed32](#fixed32) |  | The sending node number. Note: Our crypto implementation uses this field as well. See docs/software/crypto.md for details. FIXME - really should be fixed32 instead, this encoding only hurts the ble link though. |
| to | [fixed32](#fixed32) |  | The (immediatSee Priority description for more details.y should be fixed32 instead, this encoding only hurts the ble link though. |
| channel | [uint32](#uint32) |  | (Usually) If set, this indicates the index in the secondary_channels table that this packet was sent/received on. If unset, packet was on the primary channel. A particular node might know only a subset of channels in use on the mesh. Therefore channel_index is inherently a local concept and meaningless to send between nodes. Very briefly, while sending and receiving deep inside the device Router code, this field instead contains the &#39;channel hash&#39; instead of the index. This &#39;trick&#39; is only used while the payloadVariant is an &#39;encrypted&#39;. |
| decoded | [Data](#Data) |  |  |
| encrypted | [bytes](#bytes) |  |  |
| id | [fixed32](#fixed32) |  | A unique ID for this packet. Always 0 for no-ack packets or non broadcast packets (and therefore take zero bytes of space). Otherwise a unique ID for this packet, useful for flooding algorithms. ID only needs to be unique on a _per sender_ basis, and it only needs to be unique for a few minutes (long enough to last for the length of any ACK or the completion of a mesh broadcast flood). Note: Our crypto implementation uses this id as well. See docs/software/crypto.md for details. FIXME - really should be fixed32 instead, this encoding only hurts the ble link though. |
| rx_time | [fixed32](#fixed32) |  | The time this message was received by the esp32 (secs since 1970). Note: this field is _never_ sent on the radio link itself (to save space) Times are typically not sent over the mesh, but they will be added to any Packet (chain of SubPacket) sent to the phone (so the phone can know exact time of reception) |
| rx_snr | [float](#float) |  | Never* sent over the radio links. Set during reception to indicate the SNR of this packet. Used to collect statistics on current link quality. |
| hop_limit | [uint32](#uint32) |  | If unset treated as zero (no forwarding, send to adjacent nodes only) if 1, allow hopping through one node, etc... For our usecase real world topologies probably have a max of about 3. This field is normally placed into a few of bits in the header. |
| want_ack | [bool](#bool) |  | This packet is being sent as a reliable message, we would prefer it to arrive at the destination. We would like to receive a ack packet in response. Broadcasts messages treat this flag specially: Since acks for broadcasts would rapidly flood the channel, the normal ack behavior is suppressed. Instead, the original sender listens to see if at least one node is rebroadcasting this packet (because naive flooding algorithm). If it hears that the odds (given typical LoRa topologies) the odds are very high that every node should eventually receive the message. So FloodingRouter.cpp generates an implicit ack which is delivered to the original sender. If after some time we don&#39;t hear anyone rebroadcast our packet, we will timeout and retransmit, using the regular resend logic. Note: This flag is normally sent in a flag bit in the header when sent over the wire |
| priority | [MeshPacket.Priority](#MeshPacket.Priority) |  | The priority of this message for sending. See MeshPacket.Priority description for more details. |
| rx_rssi | [int32](#int32) |  | rssi of received packet. Only sent to phone for dispay purposes. |






<a name=".MyNodeInfo"></a>

### MyNodeInfo
Unique local debugging info for this node
Note: we don&#39;t include position or the user info, because that will come in the
Sent to the phone in response to WantNodes.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| my_node_num | [uint32](#uint32) |  | Tells the phone what our node number is, default starting value is lowbyte of macaddr, but it will be fixed if that is already in use |
| has_gps | [bool](#bool) |  | Note: This flag merely means we detected a hardware GPS in our node. Not the same as UserPreferences.location_sharing |
| num_bands | [uint32](#uint32) |  | # of frequencies that can be used (set at build time in the device flash image). Note: this is different from max_channels, this field is telling the # of frequency bands this node can use. (old name was num_channels) |
| max_channels | [uint32](#uint32) |  | The maximum number of &#39;software&#39; channels that can be set on this node. |
| region | [string](#string) |  | **Deprecated.** Deprecated! ONLY USED IN DEVICE CODE (for upgrading old 1.0 firmwares) DO NOT READ ELSEWHERE. The region code for my radio (US, CN, etc...) Note: This string is deprecated. The 1.0 builds populate it based on the flashed firmware name. But for newer builds this string will be unpopulated (missing/null). For those builds you should instead look at the new read/write region enum in UserSettings The format of this string was 1.0-US or 1.0-CN etc.. Or empty string if unset. |
| hw_model_deprecated | [string](#string) |  | **Deprecated.** TBEAM, HELTEC, etc... Starting in 1.2.11 moved to hw_model enum in the NodeInfo object. Apps will still need the string here for older builds (so OTA update can find the right image), but if the enum is available it will be used instead. |
| firmware_version | [string](#string) |  | 0.0.5 etc... |
| error_code | [CriticalErrorCode](#CriticalErrorCode) |  | An error message we&#39;d like to report back to the mothership through analytics. It indicates a serious bug occurred on the device, the device coped with it, but we still want to tell the devs about the bug. This field will be cleared after the phone reads MyNodeInfo (i.e. it will only be reported once) a numeric error code to go with error message, zero means no error |
| error_address | [uint32](#uint32) |  | A numeric error address (nonzero if available) |
| error_count | [uint32](#uint32) |  | The total number of errors this node has ever encountered (well - since the last time we discarded preferences) |
| reboot_count | [uint32](#uint32) |  | The total number of reboots this node has ever encountered (well - since the last time we discarded preferences) |
| message_timeout_msec | [uint32](#uint32) |  | How long before we consider a message abandoned and we can clear our caches of any messages in flight Normally quite large to handle the worst case message delivery time, 5 minutes. Formerly called FLOOD_EXPIRE_TIME in the device code |
| min_app_version | [uint32](#uint32) |  | The minimum app version that can talk to this device. Phone/PC apps should compare this to their build number and if too low tell the user they must update their app |






<a name=".NodeInfo"></a>

### NodeInfo
The bluetooth to device link:

Old BTLE protocol docs from TODO, merge in above and make real docs...

use protocol buffers, and NanoPB

messages from device to phone:
POSITION_UPDATE (..., time)
TEXT_RECEIVED(from, text, time)
OPAQUE_RECEIVED(from, payload, time) (for signal messages or other applications)

messages from phone to device:
SET_MYID(id, human readable long, human readable short) (send down the unique ID
string used for this node, a human readable string shown for that id, and a very
short human readable string suitable for oled screen) SEND_OPAQUE(dest, payload)
(for signal messages or other applications) SEND_TEXT(dest, text) Get all
nodes() (returns list of nodes, with full info, last time seen, loc, battery
level etc) SET_CONFIG (switches device to a new set of radio params and
preshared key, drops all existing nodes, force our node to rejoin this new group)

Full information about a node on the mesh


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num | [uint32](#uint32) |  | the node number |
| user | [User](#User) |  | The user info for this node |
| position | [Position](#Position) |  | This position data. Note: before 1.2.14 we would also store the last time we&#39;ve heard from this node in position.time. That is no longer true. Position.time now indicates the last time we received a POSITION from that node. |
| snr | [float](#float) |  | Returns the Signal-to-noise ratio (SNR) of the last received message, as measured by the receiver. Return SNR of the last received message in dB |
| last_heard | [fixed32](#fixed32) |  | Set to indicate the last time we received a packet from this node |






<a name=".Position"></a>

### Position
a gps position


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| latitude_i | [sfixed32](#sfixed32) |  | The new preferred location encoding, divide by 1e-7 to get degrees in floating point |
| longitude_i | [sfixed32](#sfixed32) |  |  |
| altitude | [int32](#int32) |  | In meters above MSL |
| battery_level | [int32](#int32) |  | 1-100 (0 means not provided) |
| time | [fixed32](#fixed32) |  | This is usually not sent over the mesh (to save space), but it is sent from the phone so that the local device can set its RTC If it is sent over the mesh (because there are devices on the mesh without GPS), it will only be sent by devices which has a hardware GPS clock. seconds since 1970 |






<a name=".RouteDiscovery"></a>

### RouteDiscovery
A message used in our Dynamic Source Routing protocol (RFC 4728 based)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| route | [fixed32](#fixed32) | repeated | The list of nodenums this packet has visited so far |






<a name=".Routing"></a>

### Routing
A Routing control Data packet handled by the routing plugin


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| route_request | [RouteDiscovery](#RouteDiscovery) |  | A route request going from the requester |
| route_reply | [RouteDiscovery](#RouteDiscovery) |  | A route reply |
| error_reason | [Routing.Error](#Routing.Error) |  | A failure in delivering a message (usually used for routing control messages, but might be provided in addition to ack.fail_id to provide details on the type of failure). |






<a name=".ToRadio"></a>

### ToRadio
packets/commands to the radio will be written (reliably) to the toRadio characteristic.
Once the write completes the phone can assume it is handled.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| packet | [MeshPacket](#MeshPacket) |  | send this packet on the mesh |
| peer_info | [ToRadio.PeerInfo](#ToRadio.PeerInfo) |  | Information about the peer, sent after the phone sneds want_config_id. Old clients do not send this, which is fine. |
| want_config_id | [uint32](#uint32) |  | phone wants radio to send full node db to the phone, This is typically the first packet sent to the radio when the phone gets a bluetooth connection. The radio will respond by sending back a MyNodeInfo, a owner, a radio config and a series of FromRadio.node_infos, and config_complete the integer you write into this field will be reported back in the config_complete_id response this allows clients to never be confused by a stale old partially sent config. |
| disconnect | [bool](#bool) |  | Tell API server we are disconnecting now. This is useful for serial links where there is no hardware/protocol based notification that the client has dropped the link. (Sending this message is optional for clients) |






<a name=".ToRadio.PeerInfo"></a>

### ToRadio.PeerInfo
Instead of sending want_config_id as a uint32, newer clients send this structure with information about the client.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| app_version | [uint32](#uint32) |  | The numeric version code for the client application, which in some cases are used to control device behavior (so the device can make assumptions about who is using the API. |
| mqtt_gateway | [bool](#bool) |  | True if the peer device can gateway MQTT packets. If true, the device will not try to send packets to the internet directly, instead it will pass the packets to the peer for dispatching. This feature is optional, if set to false the device will assume the client can not gateway to MQTT. |






<a name=".User"></a>

### User
Broadcast when a newly powered mesh node wants to find a node num it can use
Sent from the phone over bluetooth to set the user id for the owner of this node.
Also sent from nodes to each other when a new node signs on (so all clients can have this info)

The algorithm is as follows:
when a node starts up, it broadcasts their user and the normal flow is for all
other nodes to reply with their User as well (so the new node can build its nodedb)
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
| id | [string](#string) |  | A globally unique ID string for this user. In the case of Signal that would mean &#43;16504442323, for the default macaddr derived id it would be !&lt;8 hexidecimal bytes&gt; Note: app developers are encouraged to also use the following standard node IDs &#34;^all&#34; (for broadcast), &#34;^local&#34; (for the locally connected node) |
| long_name | [string](#string) |  | A full name for this user, i.e. &#34;Kevin Hester&#34; |
| short_name | [string](#string) |  | A VERY short name, ideally two characters. Suitable for a tiny OLED screen |
| macaddr | [bytes](#bytes) |  | This is the addr of the radio. Not populated by the phone, but added by the esp32 when broadcasting |
| hw_model | [HardwareModel](#HardwareModel) |  | TBEAM, HELTEC, etc... Starting in 1.2.11 moved to hw_model enum in the NodeInfo object. Apps will still need the string here for older builds (so OTA update can find the right image), but if the enum is available it will be used instead. |
| is_licensed | [bool](#bool) |  | In some regions HAM radio operators have different bandwidth limitations than others. If this user is a licensed operator, set this flag. Also, &#34;long_name&#34; should be their licence number. |





 


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

The device might report these fault codes on the screen.
If you encounter a fault code, please post on the meshtastic.discourse.group
and we&#39;ll try to help.

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
| TransmitFailed | 8 | Radio transmit hardware failure. We sent data to the radio chip, but it didn&#39;t reply with an interrupt. |
| Brownout | 9 | We detected that the main CPU voltage dropped below the minumum acceptable value |



<a name=".HardwareModel"></a>

### HardwareModel
Note: these enum names must EXACTLY match the string used in the device
bin/build-all.sh script.  Because they will be used to find firmware filenames
in the android app for OTA updates.
To match the old style filenames, _ is converted to -, p is converted to .

| Name | Number | Description |
| ---- | ------ | ----------- |
| UNSET | 0 |  |
| TLORA_V2 | 1 |  |
| TLORA_V1 | 2 |  |
| TLORA_V2_1_1p6 | 3 |  |
| TBEAM | 4 |  |
| HELTEC | 5 |  |
| TBEAM0p7 | 6 |  |
| T_ECHO | 7 |  |
| TLORA_V1_1p3 | 8 |  |
| RAK4631 | 9 |  |
| LORA_RELAY_V1 | 32 | Less common/prototype boards listed here (needs one more byte over the air) |
| NRF52840DK | 33 |  |
| PPR | 34 |  |
| GENIEBLOCKS | 35 |  |
| NRF52_UNKNOWN | 36 |  |
| PORTDUINO | 37 |  |
| ANDROID_SIM | 38 | The simulator built into the android app |



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



<a name=".MeshPacket.Priority"></a>

### MeshPacket.Priority
The priority of this message for sending.  Higher priorities are sent first
(when managing the transmit queue).
This field is never sent over the air, it is only used internally inside of a local device node.
API clients (either on the local node or connected directly to the node)
can set this parameter if necessary.

(values must be &lt;= 127 to keep protobuf field to one byte in size.

Detailed background on this field:

I noticed a funny side effect of lora being so slow: Usually when making
a protocol there isn’t much need to use message priority to change the order
of transmission (because interfaces are fairly fast).
But for lora where packets can take a few seconds each, it is very important
to make sure that critical packets are sent ASAP.
In the case of meshtastic that means we want to send protocol acks as soon as possible
(to prevent unneeded retransmissions), we want routing messages to be sent next,
then messages marked as reliable and finally ‘background’ packets like periodic position updates.

So I bit the bullet and implemented a new (internal - not sent over the air)
field in MeshPacket called ‘priority’.
And the transmission queue in the router object is now a priority queue.

| Name | Number | Description |
| ---- | ------ | ----------- |
| UNSET | 0 | Treated as Priority.DEFAULT |
| MIN | 1 |  |
| BACKGROUND | 10 | Background position updates are sent with very low priority - if the link is super congested they might not go out at all |
| DEFAULT | 64 | This priority is used for most messages that don&#39;t have a priority set |
| RELIABLE | 70 | If priority is unset but the message is marked as want_ack, assume it is important and use a slightly higher priority |
| ACK | 120 | Ack/naks are sent with very high priority to ensure that retransmission stops as soon as possible |
| MAX | 127 |  |



<a name=".Routing.Error"></a>

### Routing.Error
A failure in delivering a message (usually used for routing control messages, but might be provided in addition to ack.fail_id to provide
details on the type of failure).

| Name | Number | Description |
| ---- | ------ | ----------- |
| NONE | 0 | This message is not a failure |
| NO_ROUTE | 1 | Our node doesn&#39;t have a route to the requested destination anymore. |
| GOT_NAK | 2 | We received a nak while trying to forward on your behalf |
| TIMEOUT | 3 |  |
| NO_INTERFACE | 4 | No suitable interface could be found for delivering this packet |
| MAX_RETRANSMIT | 5 | We reached the max retransmission count (typically for naive flood routing) |
| NO_CHANNEL | 6 | No suitable channel was found for sending this packet (i.e. was requested channel index disabled?) |
| TOO_LARGE | 7 | The packet was too big for sending (exceeds interface MTU after encoding) |
| NO_RESPONSE | 8 | The request had want_response set, the request reached the destination node, but no service on that node wants to send a response (possibly due to bad channel permissions) |
| BAD_REQUEST | 32 | The application layer service on the remote node received your request, but considered your request somehow invalid |
| NOT_AUTHORIZED | 33 | The application layer service on the remote node received your request, but considered your request not authorized (i.e you did not send the request on the required bound channel) |


 

 

 



<a name="mqtt.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## mqtt.proto



<a name=".ServiceEnvelope"></a>

### ServiceEnvelope
This message wraps a MeshPacket with extra metadata about the sender and how it arrived.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| packet | [MeshPacket](#MeshPacket) |  | The (probably encrypted) packet |
| channel_id | [string](#string) |  | The global channel ID it was sent on |
| gateway_id | [string](#string) |  | The sending gateway node ID. Can we use this to authenticate/prevent fake nodeid impersonation for senders? - i.e. use gateway/mesh id (which is authenticated) &#43; local node id as the globally trusted nodenum |





 

 

 

 



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
64-127 Registered 3rd party apps, send in a pull request that adds a new entry to portnums.proto to  register your application
256-511 Use one of these portnums for your private applications that you don&#39;t want to register publically

All other values are reserved.

Note: This was formerly a Type enum named &#39;typ&#39; with the same id #

We have change to this &#39;portnum&#39; based scheme for specifying app handlers for particular payloads.
This change is backwards compatible by treating the legacy OPAQUE/CLEAR_TEXT values identically.

| Name | Number | Description |
| ---- | ------ | ----------- |
| UNKNOWN_APP | 0 | Deprecated: do not use in new code (formerly called OPAQUE) A message sent from a device outside of the mesh, in a form the mesh does not understand NOTE: This must be 0, because it is documented in IMeshService.aidl to be so |
| TEXT_MESSAGE_APP | 1 | A simple UTF-8 text message, which even the little micros in the mesh can understand and show on their screen eventually in some circumstances even signal might send messages in this form (see below) Formerly called CLEAR_TEXT |
| REMOTE_HARDWARE_APP | 2 | A message receive acknowledgment, sent in cleartext - allows radio to show user that a message has been read by the recipient, optional Note: this concept has been removed for now. Once READACK is implemented, use the new packet type/port number stuff? @exclude CLEAR_READACK = 2; Reserved for built-in GPIO/example app. See remote_hardware.proto/HardwareMessage for details on the message sent/received to this port number |
| POSITION_APP | 3 | The built-in position messaging app. See Position for details on the message sent to this port number. payload is a Position protobuf |
| NODEINFO_APP | 4 | The built-in user info app. See User for details on the message sent to this port number. payload is a User protobuf |
| ROUTING_APP | 5 | Protocol control packets for mesh protocol use, payload is a Routing protobuf |
| ADMIN_APP | 6 | Admin control packets, payload is a AdminMessage protobuf |
| REPLY_APP | 32 | Provides a &#39;ping&#39; service that replies to any packet it receives. Also this serves as a small example plugin. |
| IP_TUNNEL_APP | 33 | Used for the python IP tunnel feature |
| SERIAL_APP | 64 | Provides a hardware serial interface to send and receive from the Meshtastic network. Connect to the RX/TX pins of a device with 38400 8N1. Packets received from the Meshtastic network is forwarded to the RX pin while sending a packet to TX will go out to the Mesh network. Maximum packet size of 240 bytes. Plugin is disabled by default can be turned on by setting SERIALPLUGIN_ENABLED = 1 in SerialPlugh.cpp. Maintained by Jm Casler (MC Hamster) : jm@casler.org |
| STORE_FORWARD_APP | 65 | STORE_FORWARD_APP (Work in Progress) Maintained by Jm Casler (MC Hamster) : jm@casler.org |
| RANGE_TEST_APP | 66 | STORE_FORWARD_APP (Work in Progress) Maintained by Jm Casler (MC Hamster) : jm@casler.org |
| ENVIRONMENTAL_MEASUREMENT_APP | 67 | Provides a format to send and receive environmental data from the Meshtastic network. Maintained by Charles Crossan (crossan007) : crossan007@gmail.com |
| PRIVATE_APP | 256 | Private applications should use portnums &gt;= 256. To simplify initial development and testing you can use &#34;PRIVATE_APP&#34; in your code without needing to rebuild protobuf files (via bin/regin_protos.sh) |
| ATAK_FORWARDER | 257 | ATAK Forwarder Plugin https://github.com/paulmandal/atak-forwarder |
| MAX | 511 | Currently we limit port nums to no higher than this value |


 

 

 



<a name="radioconfig.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## radioconfig.proto
Meshtastic protobufs

For more information on protobufs (and tools to use them with the language of your choice) see
https://developers.google.com/protocol-buffers/docs/proto3

We are not placing any of these defs inside a package, because if you do the
resulting nanopb version is super verbose package mesh.

Protobuf build instructions:

To build java classes for reading writing:
protoc -I=. --java_out /tmp mesh.proto

To generate Nanopb c code:
/home/kevinh/packages/nanopb-0.4.0-linux-x86/generator-bin/protoc --nanopb_out=/tmp -I=app/src/main/proto mesh.proto

Nanopb binaries available here: https://jpa.kapsi.fi/nanopb/download/ use nanopb 0.4.0


<a name=".RadioConfig"></a>

### RadioConfig
The entire set of user settable/readable settings for our radio device.
Includes both the current channel settings and any preferences the user has
set for behavior of their node


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| preferences | [RadioConfig.UserPreferences](#RadioConfig.UserPreferences) |  |  |






<a name=".RadioConfig.UserPreferences"></a>

### RadioConfig.UserPreferences
see sw-design.md for more information on these preferences


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| position_broadcast_secs | [uint32](#uint32) |  | We should send our position this often (but only if it has changed significantly) Defaults to 15 minutes |
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
| charge_current | [ChargeCurrent](#ChargeCurrent) |  | Sets the current of the battery charger |
| is_router | [bool](#bool) |  | Are we operating as a router. Changes behavior in the following ways: The device will only sleep for critically low battery level (i.e. always tries to stay alive for the mesh) In the future routing decisions will preferentially route packets through nodes with this attribute (because assumed good line of sight) |
| is_low_power | [bool](#bool) |  | If set, we are powered from a low-current source (i.e. solar), so even if it looks like we have power flowing in we should try to minimize power consumption as much as possible. YOU DO NOT NEED TO SET THIS IF YOU&#39;VE set is_router (it is implied in that case). |
| fixed_position | [bool](#bool) |  | If set, this node is at a fixed position. We will generate GPS position updates at the regular interval, but use whatever the last lat/lon/alt we have for the node. The lat/lon/alt can be set by an internal GPS or with the help of the app. |
| serial_disabled | [bool](#bool) |  | If set, this will disable the SerialConsole by not initilizing the StreamAPI |
| location_share | [LocationSharing](#LocationSharing) |  | How our location is shared with other nodes (or the local phone) |
| gps_operation | [GpsOperation](#GpsOperation) |  | How the GPS hardware in this unit is operated. Note: This is independent of how our location is shared with other devices. For that see LocationSharing |
| gps_update_interval | [uint32](#uint32) |  | How often should we try to get GPS position (in seconds) when we are in GpsOpMobile mode? or zero for the default of once every 30 seconds or a very large value (maxint) to update only once at boot. |
| gps_attempt_time | [uint32](#uint32) |  | How long should we try to get our position during each gps_update_interval attempt? (in seconds) Or if zero, use the default of 30 seconds. If we don&#39;t get a new gps fix in that time, the gps will be put into sleep until the next gps_update_rate window. |
| frequency_offset | [float](#float) |  | This parameter is for advanced users with advanced test equipment, we do not recommend most users use it. A frequency offset that is added to to the calculated band center frequency. Used to correct for crystal calibration errors. |
| mqtt_server | [string](#string) |  | The server to use for our MQTT global message gateway feature. If not set, the default server will be used |
| mqtt_disabled | [bool](#bool) |  | If a meshtastic node is able to reach the internet it will normally attempt to gateway any channels that are marked as is_uplink_enabled or is_downlink_enabled. But if this flag is set, all MQTT features will be disabled and no servers will be contacted. |
| factory_reset | [bool](#bool) |  | This setting is never saved to disk, but if set, all device settings will be returned to factory defaults. (Region, serial number etc... will be preserved) |
| debug_log_enabled | [bool](#bool) |  | By default we turn off logging as soon as an API client connects (to keep shared serial link quiet). Set this to true to leave the debug log outputting even when API is active. |
| ignore_incoming | [uint32](#uint32) | repeated | If true, radio should not try to be smart about what packets to queue to the phone bool keep_all_packets = 101; If true, we will try to capture all the packets sent on the mesh, not just the ones destined to our node. bool promiscuous_mode = 102; For testing it is useful sometimes to force a node to never listen to particular other nodes (simulating radio out of range). All nodenums listed in ignore_incoming will have packets they send droped on receive (by router.cpp) |
| serialplugin_enabled | [bool](#bool) |  | Preferences for the SerialPlugin FIXME - Move this out of UserPreferences and into a section for plugin configuration. |
| serialplugin_echo | [bool](#bool) |  |  |
| serialplugin_rxd | [uint32](#uint32) |  |  |
| serialplugin_txd | [uint32](#uint32) |  |  |
| serialplugin_timeout | [uint32](#uint32) |  |  |
| serialplugin_mode | [uint32](#uint32) |  |  |
| ext_notification_plugin_enabled | [bool](#bool) |  | Preferences for the ExternalNotificationPlugin FIXME - Move this out of UserPreferences and into a section for plugin configuration. |
| ext_notification_plugin_output_ms | [uint32](#uint32) |  |  |
| ext_notification_plugin_output | [uint32](#uint32) |  |  |
| ext_notification_plugin_active | [bool](#bool) |  |  |
| ext_notification_plugin_alert_message | [bool](#bool) |  |  |
| ext_notification_plugin_alert_bell | [bool](#bool) |  |  |
| range_test_plugin_enabled | [bool](#bool) |  | Preferences for the RangeTestPlugin FIXME - Move this out of UserPreferences and into a section for plugin configuration. |
| range_test_plugin_sender | [uint32](#uint32) |  |  |
| range_test_plugin_save | [bool](#bool) |  |  |
| store_forward_plugin_enabled | [bool](#bool) |  | Preferences for the StoreForwardPlugin FIXME - Move this out of UserPreferences and into a section for plugin configuration. (was 136) |
| store_forward_plugin_records | [uint32](#uint32) |  |  |
| environmental_measurement_plugin_measurement_enabled | [bool](#bool) |  | Preferences for the EnvironmentalMeasurement Plugin FIXME - Move this out of UserPreferences and into a section for plugin configuration. Enable/Disable the environmental measurement plugin measurement collection |
| environmental_measurement_plugin_screen_enabled | [bool](#bool) |  | Enable/Disable the environmental measurement plugin on-device display |
| environmental_measurement_plugin_read_error_count_threshold | [uint32](#uint32) |  | Sometimes sensor reads can fail. If this happens, we will retry a configurable number of attempts Each attempt will be delayed by the minimum required refresh rate for that sensor |
| environmental_measurement_plugin_update_interval | [uint32](#uint32) |  | Interval in seconds of how often we should try to send our measurements to the mesh |
| environmental_measurement_plugin_recovery_interval | [uint32](#uint32) |  | Sometimes we can end up with more than read_error_count_threshold failures. In this case, we will stop trying to read from the sensor for a while. Wait this long until trying to read from the sensor again |
| environmental_measurement_plugin_display_farenheit | [bool](#bool) |  | We&#39;ll always read the sensor in Celsius, but sometimes we might want to display the results in Farenheit as a &#34;user preference&#34;. |
| environmental_measurement_plugin_sensor_type | [RadioConfig.UserPreferences.EnvironmentalMeasurementSensorType](#RadioConfig.UserPreferences.EnvironmentalMeasurementSensorType) |  | Specify the sensor type |
| environmental_measurement_plugin_sensor_pin | [uint32](#uint32) |  | Specify the peferred GPIO Pin for sensor readings |





 


<a name=".ChargeCurrent"></a>

### ChargeCurrent
Sets the charge control current of devices with a battery charger that can be
configured. This is passed into the axp power management chip like on the tbeam.

| Name | Number | Description |
| ---- | ------ | ----------- |
| MAUnset | 0 |  |
| MA100 | 1 |  |
| MA190 | 2 |  |
| MA280 | 3 |  |
| MA360 | 4 |  |
| MA450 | 5 |  |
| MA550 | 6 |  |
| MA630 | 7 |  |
| MA700 | 8 |  |
| MA780 | 9 |  |
| MA880 | 10 |  |
| MA960 | 11 |  |
| MA1000 | 12 |  |
| MA1080 | 13 |  |
| MA1160 | 14 |  |
| MA1240 | 15 |  |
| MA1320 | 16 |  |



<a name=".GpsOperation"></a>

### GpsOperation
How the GPS hardware in this unit is operated.
Note: This is independent of how our location is shared with other devices.  For that see LocationSharing

| Name | Number | Description |
| ---- | ------ | ----------- |
| GpsOpUnset | 0 | This is treated as GpsOpMobile - it is the default setting |
| GpsOpStationary | 1 | Note: This mode was removed, because it is identical go GpsOpMobile with a gps_update_rate of once per day This node is mostly stationary, we should try to get location only once per day, Once we have that position we should turn the GPS to sleep mode This is the recommended configuration for stationary &#39;router&#39; nodes |
| GpsOpMobile | 2 | This node is mobile and we should get GPS position at a rate governed by gps_update_rate |
| GpsOpTimeOnly | 3 | We should only use the GPS to get time (no location data should be acquired/stored) Once we have the time we treat gps_update_interval as MAXINT (i.e. sleep forever) |
| GpsOpDisabled | 4 | GPS is always turned off - this mode is not recommended - use GpsOpTimeOnly instead |



<a name=".LocationSharing"></a>

### LocationSharing
How our location is shared with other nodes (or the local phone)

| Name | Number | Description |
| ---- | ------ | ----------- |
| LocUnset | 0 | This is the default and treated as LocEnabled. |
| LocEnabled | 1 | We are sharing our location |
| LocDisabled | 2 | We are not sharing our location (if the unit has a GPS it will default to only get time - i.e. GpsOpTimeOnly) |



<a name=".RadioConfig.UserPreferences.EnvironmentalMeasurementSensorType"></a>

### RadioConfig.UserPreferences.EnvironmentalMeasurementSensorType


| Name | Number | Description |
| ---- | ------ | ----------- |
| DHT11 | 0 |  |



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
| RU | 9 |  |


 

 

 



<a name="remote_hardware.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## remote_hardware.proto



<a name=".HardwareMessage"></a>

### HardwareMessage
An example app to show off the plugin system. This message is used for 
REMOTE_HARDWARE_APP PortNums.

Also provides easy remote access to any GPIO.

In the future other remote hardware operations can be added based on user interest
(i.e. serial output, spi/i2c input/output).

FIXME - currently this feature is turned on by default which is dangerous
because no security yet (beyond the channel mechanism).
It should be off by default and then protected based on some TBD mechanism
(a special channel once multichannel support is included?)


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
| WATCH_GPIOS | 2 | We are now interested in watching the gpio_mask gpios. If the selected gpios change, please broadcast GPIOS_CHANGED. Will implicitly change the gpios requested to be INPUT gpios. |
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

