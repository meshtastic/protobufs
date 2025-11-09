import { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { Message } from "@bufbuild/protobuf";

//#region lib/meshtastic/channel_pb.d.ts
declare namespace channel_pb_d_exports {
  export { Channel, ChannelSchema, ChannelSettings, ChannelSettingsSchema, Channel_Role, Channel_RoleSchema, ModuleSettings, ModuleSettingsSchema, file_meshtastic_channel };
}
/**
 * Describes the file meshtastic/channel.proto.
 */
declare const file_meshtastic_channel: GenFile;
/**
 *
 * This information can be encoded as a QRcode/url so that other users can configure
 * their radio to join the same channel.
 * A note about how channel names are shown to users: channelname-X
 * poundsymbol is a prefix used to indicate this is a channel name (idea from @professr).
 * Where X is a letter from A-Z (base 26) representing a hash of the PSK for this
 * channel - so that if the user changes anything about the channel (which does
 * force a new PSK) this letter will also change. Thus preventing user confusion if
 * two friends try to type in a channel name of "BobsChan" and then can't talk
 * because their PSKs will be different.
 * The PSK is hashed into this letter by "0x41 + [xor all bytes of the psk ] modulo 26"
 * This also allows the option of someday if people have the PSK off (zero), the
 * users COULD type in a channel name and be able to talk.
 * FIXME: Add description of multi-channel support and how primary vs secondary channels are used.
 * FIXME: explain how apps use channels for security.
 * explain how remote settings and remote gpio are managed as an example
 *
 * @generated from message meshtastic.ChannelSettings
 */
type ChannelSettings = Message<"meshtastic.ChannelSettings"> & {
  /**
   *
   * Deprecated in favor of LoraConfig.channel_num
   *
   * @generated from field: uint32 channel_num = 1 [deprecated = true];
   * @deprecated
   */
  channelNum: number;
  /**
   *
   * A simple pre-shared key for now for crypto.
   * Must be either 0 bytes (no crypto), 16 bytes (AES128), or 32 bytes (AES256).
   * A special shorthand is used for 1 byte long psks.
   * These psks should be treated as only minimally secure,
   * because they are listed in this source code.
   * Those bytes are mapped using the following scheme:
   * `0` = No crypto
   * `1` = The special "default" channel key: {0xd4, 0xf1, 0xbb, 0x3a, 0x20, 0x29, 0x07, 0x59, 0xf0, 0xbc, 0xff, 0xab, 0xcf, 0x4e, 0x69, 0x01}
   * `2` through 10 = The default channel key, except with 1 through 9 added to the last byte.
   * Shown to user as simple1 through 10
   *
   * @generated from field: bytes psk = 2;
   */
  psk: Uint8Array;
  /**
   *
   * A SHORT name that will be packed into the URL.
   * Less than 12 bytes.
   * Something for end users to call the channel
   * If this is the empty string it is assumed that this channel
   * is the special (minimally secure) "Default"channel.
   * In user interfaces it should be rendered as a local language translation of "X".
   * For channel_num hashing empty string will be treated as "X".
   * Where "X" is selected based on the English words listed above for ModemPreset
   *
   * @generated from field: string name = 3;
   */
  name: string;
  /**
   *
   * Used to construct a globally unique channel ID.
   * The full globally unique ID will be: "name.id" where ID is shown as base36.
   * Assuming that the number of meshtastic users is below 20K (true for a long time)
   * the chance of this 64 bit random number colliding with anyone else is super low.
   * And the penalty for collision is low as well, it just means that anyone trying to decrypt channel messages might need to
   * try multiple candidate channels.
   * Any time a non wire compatible change is made to a channel, this field should be regenerated.
   * There are a small number of 'special' globally known (and fairly) insecure standard channels.
   * Those channels do not have a numeric id included in the settings, but instead it is pulled from
   * a table of well known IDs.
   * (see Well Known Channels FIXME)
   *
   * @generated from field: fixed32 id = 4;
   */
  id: number;
  /**
   *
   * If true, messages on the mesh will be sent to the *public* internet by any gateway ndoe
   *
   * @generated from field: bool uplink_enabled = 5;
   */
  uplinkEnabled: boolean;
  /**
   *
   * If true, messages seen on the internet will be forwarded to the local mesh.
   *
   * @generated from field: bool downlink_enabled = 6;
   */
  downlinkEnabled: boolean;
  /**
   *
   * Per-channel module settings.
   *
   * @generated from field: meshtastic.ModuleSettings module_settings = 7;
   */
  moduleSettings?: ModuleSettings;
};
/**
 * Describes the message meshtastic.ChannelSettings.
 * Use `create(ChannelSettingsSchema)` to create a new message.
 */
declare const ChannelSettingsSchema: GenMessage<ChannelSettings>;
/**
 *
 * This message is specifically for modules to store per-channel configuration data.
 *
 * @generated from message meshtastic.ModuleSettings
 */
type ModuleSettings = Message<"meshtastic.ModuleSettings"> & {
  /**
   *
   * Bits of precision for the location sent in position packets.
   *
   * @generated from field: uint32 position_precision = 1;
   */
  positionPrecision: number;
  /**
   *
   * Controls whether or not the client / device should mute the current channel
   * Useful for noisy public channels you don't necessarily want to disable
   *
   * @generated from field: bool is_muted = 2;
   */
  isMuted: boolean;
};
/**
 * Describes the message meshtastic.ModuleSettings.
 * Use `create(ModuleSettingsSchema)` to create a new message.
 */
declare const ModuleSettingsSchema: GenMessage<ModuleSettings>;
/**
 *
 * A pair of a channel number, mode and the (sharable) settings for that channel
 *
 * @generated from message meshtastic.Channel
 */
type Channel = Message<"meshtastic.Channel"> & {
  /**
   *
   * The index of this channel in the channel table (from 0 to MAX_NUM_CHANNELS-1)
   * (Someday - not currently implemented) An index of -1 could be used to mean "set by name",
   * in which case the target node will find and set the channel by settings.name.
   *
   * @generated from field: int32 index = 1;
   */
  index: number;
  /**
   *
   * The new settings, or NULL to disable that channel
   *
   * @generated from field: meshtastic.ChannelSettings settings = 2;
   */
  settings?: ChannelSettings;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: meshtastic.Channel.Role role = 3;
   */
  role: Channel_Role;
};
/**
 * Describes the message meshtastic.Channel.
 * Use `create(ChannelSchema)` to create a new message.
 */
declare const ChannelSchema: GenMessage<Channel>;
/**
 *
 * How this channel is being used (or not).
 * Note: this field is an enum to give us options for the future.
 * In particular, someday we might make a 'SCANNING' option.
 * SCANNING channels could have different frequencies and the radio would
 * occasionally check that freq to see if anything is being transmitted.
 * For devices that have multiple physical radios attached, we could keep multiple PRIMARY/SCANNING channels active at once to allow
 * cross band routing as needed.
 * If a device has only a single radio (the common case) only one channel can be PRIMARY at a time
 * (but any number of SECONDARY channels can't be sent received on that common frequency)
 *
 * @generated from enum meshtastic.Channel.Role
 */
declare enum Channel_Role {
  /**
   *
   * This channel is not in use right now
   *
   * @generated from enum value: DISABLED = 0;
   */
  DISABLED = 0,
  /**
   *
   * This channel is used to set the frequency for the radio - all other enabled channels must be SECONDARY
   *
   * @generated from enum value: PRIMARY = 1;
   */
  PRIMARY = 1,
  /**
   *
   * Secondary channels are only used for encryption/decryption/authentication purposes.
   * Their radio settings (freq etc) are ignored, only psk is used.
   *
   * @generated from enum value: SECONDARY = 2;
   */
  SECONDARY = 2,
}
/**
 * Describes the enum meshtastic.Channel.Role.
 */
declare const Channel_RoleSchema: GenEnum<Channel_Role>;
//#endregion
//#region lib/meshtastic/device_ui_pb.d.ts
/**
 * @generated from message meshtastic.DeviceUIConfig
 */
type DeviceUIConfig = Message<"meshtastic.DeviceUIConfig"> & {
  /**
   *
   * A version integer used to invalidate saved files when we make incompatible changes.
   *
   * @generated from field: uint32 version = 1;
   */
  version: number;
  /**
   *
   * TFT display brightness 1..255
   *
   * @generated from field: uint32 screen_brightness = 2;
   */
  screenBrightness: number;
  /**
   *
   * Screen timeout 0..900
   *
   * @generated from field: uint32 screen_timeout = 3;
   */
  screenTimeout: number;
  /**
   *
   * Screen/Settings lock enabled
   *
   * @generated from field: bool screen_lock = 4;
   */
  screenLock: boolean;
  /**
   * @generated from field: bool settings_lock = 5;
   */
  settingsLock: boolean;
  /**
   * @generated from field: uint32 pin_code = 6;
   */
  pinCode: number;
  /**
   *
   * Color theme
   *
   * @generated from field: meshtastic.Theme theme = 7;
   */
  theme: Theme;
  /**
   *
   * Audible message, banner and ring tone
   *
   * @generated from field: bool alert_enabled = 8;
   */
  alertEnabled: boolean;
  /**
   * @generated from field: bool banner_enabled = 9;
   */
  bannerEnabled: boolean;
  /**
   * @generated from field: uint32 ring_tone_id = 10;
   */
  ringToneId: number;
  /**
   *
   * Localization
   *
   * @generated from field: meshtastic.Language language = 11;
   */
  language: Language;
  /**
   *
   * Node list filter
   *
   * @generated from field: meshtastic.NodeFilter node_filter = 12;
   */
  nodeFilter?: NodeFilter;
  /**
   *
   * Node list highlightening
   *
   * @generated from field: meshtastic.NodeHighlight node_highlight = 13;
   */
  nodeHighlight?: NodeHighlight;
  /**
   *
   * 8 integers for screen calibration data
   *
   * @generated from field: bytes calibration_data = 14;
   */
  calibrationData: Uint8Array;
  /**
   *
   * Map related data
   *
   * @generated from field: meshtastic.Map map_data = 15;
   */
  mapData?: Map;
  /**
   *
   * Compass mode
   *
   * @generated from field: meshtastic.CompassMode compass_mode = 16;
   */
  compassMode: CompassMode;
  /**
   *
   * RGB color for BaseUI
   * 0xRRGGBB format, e.g. 0xFF0000 for red
   *
   * @generated from field: uint32 screen_rgb_color = 17;
   */
  screenRgbColor: number;
  /**
   *
   * Clockface analog style
   * true for analog clockface, false for digital clockface
   *
   * @generated from field: bool is_clockface_analog = 18;
   */
  isClockfaceAnalog: boolean;
  /**
   *
   * How the GPS coordinates are formatted on the OLED screen.
   *
   * @generated from field: meshtastic.DeviceUIConfig.GpsCoordinateFormat gps_format = 19;
   */
  gpsFormat: DeviceUIConfig_GpsCoordinateFormat;
};
/**
 *
 * How the GPS coordinates are displayed on the OLED screen.
 *
 * @generated from enum meshtastic.DeviceUIConfig.GpsCoordinateFormat
 */
declare enum DeviceUIConfig_GpsCoordinateFormat {
  /**
   *
   * GPS coordinates are displayed in the normal decimal degrees format:
   * DD.DDDDDD DDD.DDDDDD
   *
   * @generated from enum value: DEC = 0;
   */
  DEC = 0,
  /**
   *
   * GPS coordinates are displayed in the degrees minutes seconds format:
   * DD°MM'SS"C DDD°MM'SS"C, where C is the compass point representing the locations quadrant
   *
   * @generated from enum value: DMS = 1;
   */
  DMS = 1,
  /**
   *
   * Universal Transverse Mercator format:
   * ZZB EEEEEE NNNNNNN, where Z is zone, B is band, E is easting, N is northing
   *
   * @generated from enum value: UTM = 2;
   */
  UTM = 2,
  /**
   *
   * Military Grid Reference System format:
   * ZZB CD EEEEE NNNNN, where Z is zone, B is band, C is the east 100k square, D is the north 100k square,
   * E is easting, N is northing
   *
   * @generated from enum value: MGRS = 3;
   */
  MGRS = 3,
  /**
   *
   * Open Location Code (aka Plus Codes).
   *
   * @generated from enum value: OLC = 4;
   */
  OLC = 4,
  /**
   *
   * Ordnance Survey Grid Reference (the National Grid System of the UK).
   * Format: AB EEEEE NNNNN, where A is the east 100k square, B is the north 100k square,
   * E is the easting, N is the northing
   *
   * @generated from enum value: OSGR = 5;
   */
  OSGR = 5,
  /**
   *
   * Maidenhead Locator System
   * Described here: https://en.wikipedia.org/wiki/Maidenhead_Locator_System
   *
   * @generated from enum value: MLS = 6;
   */
  MLS = 6,
}
/**
 * @generated from message meshtastic.NodeFilter
 */
type NodeFilter = Message<"meshtastic.NodeFilter"> & {
  /**
   *
   * Filter unknown nodes
   *
   * @generated from field: bool unknown_switch = 1;
   */
  unknownSwitch: boolean;
  /**
   *
   * Filter offline nodes
   *
   * @generated from field: bool offline_switch = 2;
   */
  offlineSwitch: boolean;
  /**
   *
   * Filter nodes w/o public key
   *
   * @generated from field: bool public_key_switch = 3;
   */
  publicKeySwitch: boolean;
  /**
   *
   * Filter based on hops away
   *
   * @generated from field: int32 hops_away = 4;
   */
  hopsAway: number;
  /**
   *
   * Filter nodes w/o position
   *
   * @generated from field: bool position_switch = 5;
   */
  positionSwitch: boolean;
  /**
   *
   * Filter nodes by matching name string
   *
   * @generated from field: string node_name = 6;
   */
  nodeName: string;
  /**
   *
   * Filter based on channel
   *
   * @generated from field: int32 channel = 7;
   */
  channel: number;
};
/**
 * @generated from message meshtastic.NodeHighlight
 */
type NodeHighlight = Message<"meshtastic.NodeHighlight"> & {
  /**
   *
   * Hightlight nodes w/ active chat
   *
   * @generated from field: bool chat_switch = 1;
   */
  chatSwitch: boolean;
  /**
   *
   * Highlight nodes w/ position
   *
   * @generated from field: bool position_switch = 2;
   */
  positionSwitch: boolean;
  /**
   *
   * Highlight nodes w/ telemetry data
   *
   * @generated from field: bool telemetry_switch = 3;
   */
  telemetrySwitch: boolean;
  /**
   *
   * Highlight nodes w/ iaq data
   *
   * @generated from field: bool iaq_switch = 4;
   */
  iaqSwitch: boolean;
  /**
   *
   * Highlight nodes by matching name string
   *
   * @generated from field: string node_name = 5;
   */
  nodeName: string;
};
/**
 * @generated from message meshtastic.GeoPoint
 */
type GeoPoint = Message<"meshtastic.GeoPoint"> & {
  /**
   *
   * Zoom level
   *
   * @generated from field: int32 zoom = 1;
   */
  zoom: number;
  /**
   *
   * Coordinate: latitude
   *
   * @generated from field: int32 latitude = 2;
   */
  latitude: number;
  /**
   *
   * Coordinate: longitude
   *
   * @generated from field: int32 longitude = 3;
   */
  longitude: number;
};
/**
 * @generated from message meshtastic.Map
 */
type Map = Message<"meshtastic.Map"> & {
  /**
   *
   * Home coordinates
   *
   * @generated from field: meshtastic.GeoPoint home = 1;
   */
  home?: GeoPoint;
  /**
   *
   * Map tile style
   *
   * @generated from field: string style = 2;
   */
  style: string;
  /**
   *
   * Map scroll follows GPS
   *
   * @generated from field: bool follow_gps = 3;
   */
  followGps: boolean;
};
/**
 * @generated from enum meshtastic.CompassMode
 */
declare enum CompassMode {
  /**
   *
   * Compass with dynamic ring and heading
   *
   * @generated from enum value: DYNAMIC = 0;
   */
  DYNAMIC = 0,
  /**
   *
   * Compass with fixed ring and heading
   *
   * @generated from enum value: FIXED_RING = 1;
   */
  FIXED_RING = 1,
  /**
   *
   * Compass with heading and freeze option
   *
   * @generated from enum value: FREEZE_HEADING = 2;
   */
  FREEZE_HEADING = 2,
}
/**
 * @generated from enum meshtastic.Theme
 */
declare enum Theme {
  /**
   *
   * Dark
   *
   * @generated from enum value: DARK = 0;
   */
  DARK = 0,
  /**
   *
   * Light
   *
   * @generated from enum value: LIGHT = 1;
   */
  LIGHT = 1,
  /**
   *
   * Red
   *
   * @generated from enum value: RED = 2;
   */
  RED = 2,
}
/**
 *
 * Localization
 *
 * @generated from enum meshtastic.Language
 */
declare enum Language {
  /**
   *
   * English
   *
   * @generated from enum value: ENGLISH = 0;
   */
  ENGLISH = 0,
  /**
   *
   * French
   *
   * @generated from enum value: FRENCH = 1;
   */
  FRENCH = 1,
  /**
   *
   * German
   *
   * @generated from enum value: GERMAN = 2;
   */
  GERMAN = 2,
  /**
   *
   * Italian
   *
   * @generated from enum value: ITALIAN = 3;
   */
  ITALIAN = 3,
  /**
   *
   * Portuguese
   *
   * @generated from enum value: PORTUGUESE = 4;
   */
  PORTUGUESE = 4,
  /**
   *
   * Spanish
   *
   * @generated from enum value: SPANISH = 5;
   */
  SPANISH = 5,
  /**
   *
   * Swedish
   *
   * @generated from enum value: SWEDISH = 6;
   */
  SWEDISH = 6,
  /**
   *
   * Finnish
   *
   * @generated from enum value: FINNISH = 7;
   */
  FINNISH = 7,
  /**
   *
   * Polish
   *
   * @generated from enum value: POLISH = 8;
   */
  POLISH = 8,
  /**
   *
   * Turkish
   *
   * @generated from enum value: TURKISH = 9;
   */
  TURKISH = 9,
  /**
   *
   * Serbian
   *
   * @generated from enum value: SERBIAN = 10;
   */
  SERBIAN = 10,
  /**
   *
   * Russian
   *
   * @generated from enum value: RUSSIAN = 11;
   */
  RUSSIAN = 11,
  /**
   *
   * Dutch
   *
   * @generated from enum value: DUTCH = 12;
   */
  DUTCH = 12,
  /**
   *
   * Greek
   *
   * @generated from enum value: GREEK = 13;
   */
  GREEK = 13,
  /**
   *
   * Norwegian
   *
   * @generated from enum value: NORWEGIAN = 14;
   */
  NORWEGIAN = 14,
  /**
   *
   * Slovenian
   *
   * @generated from enum value: SLOVENIAN = 15;
   */
  SLOVENIAN = 15,
  /**
   *
   * Ukrainian
   *
   * @generated from enum value: UKRAINIAN = 16;
   */
  UKRAINIAN = 16,
  /**
   *
   * Bulgarian
   *
   * @generated from enum value: BULGARIAN = 17;
   */
  BULGARIAN = 17,
  /**
   *
   * Czech
   *
   * @generated from enum value: CZECH = 18;
   */
  CZECH = 18,
  /**
   *
   * Danish
   *
   * @generated from enum value: DANISH = 19;
   */
  DANISH = 19,
  /**
   *
   * Simplified Chinese (experimental)
   *
   * @generated from enum value: SIMPLIFIED_CHINESE = 30;
   */
  SIMPLIFIED_CHINESE = 30,
  /**
   *
   * Traditional Chinese (experimental)
   *
   * @generated from enum value: TRADITIONAL_CHINESE = 31;
   */
  TRADITIONAL_CHINESE = 31,
}
declare namespace config_pb_d_exports {
  export { Config, ConfigSchema, Config_BluetoothConfig, Config_BluetoothConfigSchema, Config_BluetoothConfig_PairingMode, Config_BluetoothConfig_PairingModeSchema, Config_DeviceConfig, Config_DeviceConfigSchema, Config_DeviceConfig_BuzzerMode, Config_DeviceConfig_BuzzerModeSchema, Config_DeviceConfig_RebroadcastMode, Config_DeviceConfig_RebroadcastModeSchema, Config_DeviceConfig_Role, Config_DeviceConfig_RoleSchema, Config_DisplayConfig, Config_DisplayConfigSchema, Config_DisplayConfig_CompassOrientation, Config_DisplayConfig_CompassOrientationSchema, Config_DisplayConfig_DeprecatedGpsCoordinateFormat, Config_DisplayConfig_DeprecatedGpsCoordinateFormatSchema, Config_DisplayConfig_DisplayMode, Config_DisplayConfig_DisplayModeSchema, Config_DisplayConfig_DisplayUnits, Config_DisplayConfig_DisplayUnitsSchema, Config_DisplayConfig_OledType, Config_DisplayConfig_OledTypeSchema, Config_LoRaConfig, Config_LoRaConfigSchema, Config_LoRaConfig_ModemPreset, Config_LoRaConfig_ModemPresetSchema, Config_LoRaConfig_RegionCode, Config_LoRaConfig_RegionCodeSchema, Config_NetworkConfig, Config_NetworkConfigSchema, Config_NetworkConfig_AddressMode, Config_NetworkConfig_AddressModeSchema, Config_NetworkConfig_IpV4Config, Config_NetworkConfig_IpV4ConfigSchema, Config_NetworkConfig_ProtocolFlags, Config_NetworkConfig_ProtocolFlagsSchema, Config_PositionConfig, Config_PositionConfigSchema, Config_PositionConfig_GpsMode, Config_PositionConfig_GpsModeSchema, Config_PositionConfig_PositionFlags, Config_PositionConfig_PositionFlagsSchema, Config_PowerConfig, Config_PowerConfigSchema, Config_SecurityConfig, Config_SecurityConfigSchema, Config_SessionkeyConfig, Config_SessionkeyConfigSchema, file_meshtastic_config };
}
/**
 * Describes the file meshtastic/config.proto.
 */
declare const file_meshtastic_config: GenFile;
/**
 * @generated from message meshtastic.Config
 */
type Config = Message<"meshtastic.Config"> & {
  /**
   *
   * Payload Variant
   *
   * @generated from oneof meshtastic.Config.payload_variant
   */
  payloadVariant: {
    /**
     * @generated from field: meshtastic.Config.DeviceConfig device = 1;
     */
    value: Config_DeviceConfig;
    case: "device";
  } | {
    /**
     * @generated from field: meshtastic.Config.PositionConfig position = 2;
     */
    value: Config_PositionConfig;
    case: "position";
  } | {
    /**
     * @generated from field: meshtastic.Config.PowerConfig power = 3;
     */
    value: Config_PowerConfig;
    case: "power";
  } | {
    /**
     * @generated from field: meshtastic.Config.NetworkConfig network = 4;
     */
    value: Config_NetworkConfig;
    case: "network";
  } | {
    /**
     * @generated from field: meshtastic.Config.DisplayConfig display = 5;
     */
    value: Config_DisplayConfig;
    case: "display";
  } | {
    /**
     * @generated from field: meshtastic.Config.LoRaConfig lora = 6;
     */
    value: Config_LoRaConfig;
    case: "lora";
  } | {
    /**
     * @generated from field: meshtastic.Config.BluetoothConfig bluetooth = 7;
     */
    value: Config_BluetoothConfig;
    case: "bluetooth";
  } | {
    /**
     * @generated from field: meshtastic.Config.SecurityConfig security = 8;
     */
    value: Config_SecurityConfig;
    case: "security";
  } | {
    /**
     * @generated from field: meshtastic.Config.SessionkeyConfig sessionkey = 9;
     */
    value: Config_SessionkeyConfig;
    case: "sessionkey";
  } | {
    /**
     * @generated from field: meshtastic.DeviceUIConfig device_ui = 10;
     */
    value: DeviceUIConfig;
    case: "deviceUi";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.Config.
 * Use `create(ConfigSchema)` to create a new message.
 */
declare const ConfigSchema: GenMessage<Config>;
/**
 *
 * Configuration
 *
 * @generated from message meshtastic.Config.DeviceConfig
 */
type Config_DeviceConfig = Message<"meshtastic.Config.DeviceConfig"> & {
  /**
   *
   * Sets the role of node
   *
   * @generated from field: meshtastic.Config.DeviceConfig.Role role = 1;
   */
  role: Config_DeviceConfig_Role;
  /**
   *
   * Disabling this will disable the SerialConsole by not initilizing the StreamAPI
   * Moved to SecurityConfig
   *
   * @generated from field: bool serial_enabled = 2 [deprecated = true];
   * @deprecated
   */
  serialEnabled: boolean;
  /**
   *
   * For boards without a hard wired button, this is the pin number that will be used
   * Boards that have more than one button can swap the function with this one. defaults to BUTTON_PIN if defined.
   *
   * @generated from field: uint32 button_gpio = 4;
   */
  buttonGpio: number;
  /**
   *
   * For boards without a PWM buzzer, this is the pin number that will be used
   * Defaults to PIN_BUZZER if defined.
   *
   * @generated from field: uint32 buzzer_gpio = 5;
   */
  buzzerGpio: number;
  /**
   *
   * Sets the role of node
   *
   * @generated from field: meshtastic.Config.DeviceConfig.RebroadcastMode rebroadcast_mode = 6;
   */
  rebroadcastMode: Config_DeviceConfig_RebroadcastMode;
  /**
   *
   * Send our nodeinfo this often
   * Defaults to 900 Seconds (15 minutes)
   *
   * @generated from field: uint32 node_info_broadcast_secs = 7;
   */
  nodeInfoBroadcastSecs: number;
  /**
   *
   * Treat double tap interrupt on supported accelerometers as a button press if set to true
   *
   * @generated from field: bool double_tap_as_button_press = 8;
   */
  doubleTapAsButtonPress: boolean;
  /**
   *
   * If true, device is considered to be "managed" by a mesh administrator
   * Clients should then limit available configuration and administrative options inside the user interface
   * Moved to SecurityConfig
   *
   * @generated from field: bool is_managed = 9 [deprecated = true];
   * @deprecated
   */
  isManaged: boolean;
  /**
   *
   * Disables the triple-press of user button to enable or disable GPS
   *
   * @generated from field: bool disable_triple_click = 10;
   */
  disableTripleClick: boolean;
  /**
   *
   * POSIX Timezone definition string from https://github.com/nayarsystems/posix_tz_db/blob/master/zones.csv.
   *
   * @generated from field: string tzdef = 11;
   */
  tzdef: string;
  /**
   *
   * If true, disable the default blinking LED (LED_PIN) behavior on the device
   *
   * @generated from field: bool led_heartbeat_disabled = 12;
   */
  ledHeartbeatDisabled: boolean;
  /**
   *
   * Controls buzzer behavior for audio feedback
   * Defaults to ENABLED
   *
   * @generated from field: meshtastic.Config.DeviceConfig.BuzzerMode buzzer_mode = 13;
   */
  buzzerMode: Config_DeviceConfig_BuzzerMode;
};
/**
 * Describes the message meshtastic.Config.DeviceConfig.
 * Use `create(Config_DeviceConfigSchema)` to create a new message.
 */
declare const Config_DeviceConfigSchema: GenMessage<Config_DeviceConfig>;
/**
 *
 * Defines the device's role on the Mesh network
 *
 * @generated from enum meshtastic.Config.DeviceConfig.Role
 */
declare enum Config_DeviceConfig_Role {
  /**
   *
   * Description: App connected or stand alone messaging device.
   * Technical Details: Default Role
   *
   * @generated from enum value: CLIENT = 0;
   */
  CLIENT = 0,
  /**
   *
   *  Description: Device that does not forward packets from other devices.
   *
   * @generated from enum value: CLIENT_MUTE = 1;
   */
  CLIENT_MUTE = 1,
  /**
   *
   * Description: Infrastructure node for extending network coverage by relaying messages. Visible in Nodes list.
   * Technical Details: Mesh packets will prefer to be routed over this node. This node will not be used by client apps.
   *   The wifi radio and the oled screen will be put to sleep.
   *   This mode may still potentially have higher power usage due to it's preference in message rebroadcasting on the mesh.
   *
   * @generated from enum value: ROUTER = 2;
   */
  ROUTER = 2,
  /**
   * @generated from enum value: ROUTER_CLIENT = 3 [deprecated = true];
   * @deprecated
   */
  ROUTER_CLIENT = 3,
  /**
   *
   * Description: Infrastructure node for extending network coverage by relaying messages with minimal overhead. Not visible in Nodes list.
   * Technical Details: Mesh packets will simply be rebroadcasted over this node. Nodes configured with this role will not originate NodeInfo, Position, Telemetry
   *   or any other packet type. They will simply rebroadcast any mesh packets on the same frequency, channel num, spread factor, and coding rate.
   * Deprecated in v2.7.11 because it creates "holes" in the mesh rebroadcast chain.
   *
   * @generated from enum value: REPEATER = 4 [deprecated = true];
   * @deprecated
   */
  REPEATER = 4,
  /**
   *
   * Description: Broadcasts GPS position packets as priority.
   * Technical Details: Position Mesh packets will be prioritized higher and sent more frequently by default.
   *   When used in conjunction with power.is_power_saving = true, nodes will wake up,
   *   send position, and then sleep for position.position_broadcast_secs seconds.
   *
   * @generated from enum value: TRACKER = 5;
   */
  TRACKER = 5,
  /**
   *
   * Description: Broadcasts telemetry packets as priority.
   * Technical Details: Telemetry Mesh packets will be prioritized higher and sent more frequently by default.
   *   When used in conjunction with power.is_power_saving = true, nodes will wake up,
   *   send environment telemetry, and then sleep for telemetry.environment_update_interval seconds.
   *
   * @generated from enum value: SENSOR = 6;
   */
  SENSOR = 6,
  /**
   *
   * Description: Optimized for ATAK system communication and reduces routine broadcasts.
   * Technical Details: Used for nodes dedicated for connection to an ATAK EUD.
   *    Turns off many of the routine broadcasts to favor CoT packet stream
   *    from the Meshtastic ATAK plugin -> IMeshService -> Node
   *
   * @generated from enum value: TAK = 7;
   */
  TAK = 7,
  /**
   *
   * Description: Device that only broadcasts as needed for stealth or power savings.
   * Technical Details: Used for nodes that "only speak when spoken to"
   *    Turns all of the routine broadcasts but allows for ad-hoc communication
   *    Still rebroadcasts, but with local only rebroadcast mode (known meshes only)
   *    Can be used for clandestine operation or to dramatically reduce airtime / power consumption
   *
   * @generated from enum value: CLIENT_HIDDEN = 8;
   */
  CLIENT_HIDDEN = 8,
  /**
   *
   * Description: Broadcasts location as message to default channel regularly for to assist with device recovery.
   * Technical Details: Used to automatically send a text message to the mesh
   *    with the current position of the device on a frequent interval:
   *    "I'm lost! Position: lat / long"
   *
   * @generated from enum value: LOST_AND_FOUND = 9;
   */
  LOST_AND_FOUND = 9,
  /**
   *
   * Description: Enables automatic TAK PLI broadcasts and reduces routine broadcasts.
   * Technical Details: Turns off many of the routine broadcasts to favor ATAK CoT packet stream
   *    and automatic TAK PLI (position location information) broadcasts.
   *    Uses position module configuration to determine TAK PLI broadcast interval.
   *
   * @generated from enum value: TAK_TRACKER = 10;
   */
  TAK_TRACKER = 10,
  /**
   *
   * Description: Will always rebroadcast packets, but will do so after all other modes.
   * Technical Details: Used for router nodes that are intended to provide additional coverage
   *    in areas not already covered by other routers, or to bridge around problematic terrain,
   *    but should not be given priority over other routers in order to avoid unnecessaraily
   *    consuming hops.
   *
   * @generated from enum value: ROUTER_LATE = 11;
   */
  ROUTER_LATE = 11,
  /**
   *
   * Description: Treats packets from or to favorited nodes as ROUTER, and all other packets as CLIENT.
   * Technical Details: Used for stronger attic/roof nodes to distribute messages more widely
   *    from weaker, indoor, or less-well-positioned nodes. Recommended for users with multiple nodes
   *    where one CLIENT_BASE acts as a more powerful base station, such as an attic/roof node.
   *
   * @generated from enum value: CLIENT_BASE = 12;
   */
  CLIENT_BASE = 12,
}
/**
 * Describes the enum meshtastic.Config.DeviceConfig.Role.
 */
declare const Config_DeviceConfig_RoleSchema: GenEnum<Config_DeviceConfig_Role>;
/**
 *
 * Defines the device's behavior for how messages are rebroadcast
 *
 * @generated from enum meshtastic.Config.DeviceConfig.RebroadcastMode
 */
declare enum Config_DeviceConfig_RebroadcastMode {
  /**
   *
   * Default behavior.
   * Rebroadcast any observed message, if it was on our private channel or from another mesh with the same lora params.
   *
   * @generated from enum value: ALL = 0;
   */
  ALL = 0,
  /**
   *
   * Same as behavior as ALL but skips packet decoding and simply rebroadcasts them.
   * Only available in Repeater role. Setting this on any other roles will result in ALL behavior.
   *
   * @generated from enum value: ALL_SKIP_DECODING = 1;
   */
  ALL_SKIP_DECODING = 1,
  /**
   *
   * Ignores observed messages from foreign meshes that are open or those which it cannot decrypt.
   * Only rebroadcasts message on the nodes local primary / secondary channels.
   *
   * @generated from enum value: LOCAL_ONLY = 2;
   */
  LOCAL_ONLY = 2,
  /**
   *
   * Ignores observed messages from foreign meshes like LOCAL_ONLY,
   * but takes it step further by also ignoring messages from nodenums not in the node's known list (NodeDB)
   *
   * @generated from enum value: KNOWN_ONLY = 3;
   */
  KNOWN_ONLY = 3,
  /**
   *
   * Only permitted for SENSOR, TRACKER and TAK_TRACKER roles, this will inhibit all rebroadcasts, not unlike CLIENT_MUTE role.
   *
   * @generated from enum value: NONE = 4;
   */
  NONE = 4,
  /**
   *
   * Ignores packets from non-standard portnums such as: TAK, RangeTest, PaxCounter, etc.
   * Only rebroadcasts packets with standard portnums: NodeInfo, Text, Position, Telemetry, and Routing.
   *
   * @generated from enum value: CORE_PORTNUMS_ONLY = 5;
   */
  CORE_PORTNUMS_ONLY = 5,
}
/**
 * Describes the enum meshtastic.Config.DeviceConfig.RebroadcastMode.
 */
declare const Config_DeviceConfig_RebroadcastModeSchema: GenEnum<Config_DeviceConfig_RebroadcastMode>;
/**
 *
 * Defines buzzer behavior for audio feedback
 *
 * @generated from enum meshtastic.Config.DeviceConfig.BuzzerMode
 */
declare enum Config_DeviceConfig_BuzzerMode {
  /**
   *
   * Default behavior.
   * Buzzer is enabled for all audio feedback including button presses and alerts.
   *
   * @generated from enum value: ALL_ENABLED = 0;
   */
  ALL_ENABLED = 0,
  /**
   *
   * Disabled.
   * All buzzer audio feedback is disabled.
   *
   * @generated from enum value: DISABLED = 1;
   */
  DISABLED = 1,
  /**
   *
   * Notifications Only.
   * Buzzer is enabled only for notifications and alerts, but not for button presses.
   * External notification config determines the specifics of the notification behavior.
   *
   * @generated from enum value: NOTIFICATIONS_ONLY = 2;
   */
  NOTIFICATIONS_ONLY = 2,
  /**
   *
   * Non-notification system buzzer tones only.
   * Buzzer is enabled only for non-notification tones such as button presses, startup, shutdown, but not for alerts.
   *
   * @generated from enum value: SYSTEM_ONLY = 3;
   */
  SYSTEM_ONLY = 3,
  /**
   *
   * Direct Message notifications only.
   * Buzzer is enabled only for direct messages and alerts, but not for button presses.
   * External notification config determines the specifics of the notification behavior.
   *
   * @generated from enum value: DIRECT_MSG_ONLY = 4;
   */
  DIRECT_MSG_ONLY = 4,
}
/**
 * Describes the enum meshtastic.Config.DeviceConfig.BuzzerMode.
 */
declare const Config_DeviceConfig_BuzzerModeSchema: GenEnum<Config_DeviceConfig_BuzzerMode>;
/**
 *
 * Position Config
 *
 * @generated from message meshtastic.Config.PositionConfig
 */
type Config_PositionConfig = Message<"meshtastic.Config.PositionConfig"> & {
  /**
   *
   * We should send our position this often (but only if it has changed significantly)
   * Defaults to 15 minutes
   *
   * @generated from field: uint32 position_broadcast_secs = 1;
   */
  positionBroadcastSecs: number;
  /**
   *
   * Adaptive position braoadcast, which is now the default.
   *
   * @generated from field: bool position_broadcast_smart_enabled = 2;
   */
  positionBroadcastSmartEnabled: boolean;
  /**
   *
   * If set, this node is at a fixed position.
   * We will generate GPS position updates at the regular interval, but use whatever the last lat/lon/alt we have for the node.
   * The lat/lon/alt can be set by an internal GPS or with the help of the app.
   *
   * @generated from field: bool fixed_position = 3;
   */
  fixedPosition: boolean;
  /**
   *
   * Is GPS enabled for this node?
   *
   * @generated from field: bool gps_enabled = 4 [deprecated = true];
   * @deprecated
   */
  gpsEnabled: boolean;
  /**
   *
   * How often should we try to get GPS position (in seconds)
   * or zero for the default of once every 30 seconds
   * or a very large value (maxint) to update only once at boot.
   *
   * @generated from field: uint32 gps_update_interval = 5;
   */
  gpsUpdateInterval: number;
  /**
   *
   * Deprecated in favor of using smart / regular broadcast intervals as implicit attempt time
   *
   * @generated from field: uint32 gps_attempt_time = 6 [deprecated = true];
   * @deprecated
   */
  gpsAttemptTime: number;
  /**
   *
   * Bit field of boolean configuration options for POSITION messages
   * (bitwise OR of PositionFlags)
   *
   * @generated from field: uint32 position_flags = 7;
   */
  positionFlags: number;
  /**
   *
   * (Re)define GPS_RX_PIN for your board.
   *
   * @generated from field: uint32 rx_gpio = 8;
   */
  rxGpio: number;
  /**
   *
   * (Re)define GPS_TX_PIN for your board.
   *
   * @generated from field: uint32 tx_gpio = 9;
   */
  txGpio: number;
  /**
   *
   * The minimum distance in meters traveled (since the last send) before we can send a position to the mesh if position_broadcast_smart_enabled
   *
   * @generated from field: uint32 broadcast_smart_minimum_distance = 10;
   */
  broadcastSmartMinimumDistance: number;
  /**
   *
   * The minimum number of seconds (since the last send) before we can send a position to the mesh if position_broadcast_smart_enabled
   *
   * @generated from field: uint32 broadcast_smart_minimum_interval_secs = 11;
   */
  broadcastSmartMinimumIntervalSecs: number;
  /**
   *
   * (Re)define PIN_GPS_EN for your board.
   *
   * @generated from field: uint32 gps_en_gpio = 12;
   */
  gpsEnGpio: number;
  /**
   *
   * Set where GPS is enabled, disabled, or not present
   *
   * @generated from field: meshtastic.Config.PositionConfig.GpsMode gps_mode = 13;
   */
  gpsMode: Config_PositionConfig_GpsMode;
};
/**
 * Describes the message meshtastic.Config.PositionConfig.
 * Use `create(Config_PositionConfigSchema)` to create a new message.
 */
declare const Config_PositionConfigSchema: GenMessage<Config_PositionConfig>;
/**
 *
 * Bit field of boolean configuration options, indicating which optional
 * fields to include when assembling POSITION messages.
 * Longitude, latitude, altitude, speed, heading, and DOP
 * are always included (also time if GPS-synced)
 * NOTE: the more fields are included, the larger the message will be -
 *   leading to longer airtime and a higher risk of packet loss
 *
 * @generated from enum meshtastic.Config.PositionConfig.PositionFlags
 */
declare enum Config_PositionConfig_PositionFlags {
  /**
   *
   * Required for compilation
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * Include an altitude value (if available)
   *
   * @generated from enum value: ALTITUDE = 1;
   */
  ALTITUDE = 1,
  /**
   *
   * Altitude value is MSL
   *
   * @generated from enum value: ALTITUDE_MSL = 2;
   */
  ALTITUDE_MSL = 2,
  /**
   *
   * Include geoidal separation
   *
   * @generated from enum value: GEOIDAL_SEPARATION = 4;
   */
  GEOIDAL_SEPARATION = 4,
  /**
   *
   * Include the DOP value ; PDOP used by default, see below
   *
   * @generated from enum value: DOP = 8;
   */
  DOP = 8,
  /**
   *
   * If POS_DOP set, send separate HDOP / VDOP values instead of PDOP
   *
   * @generated from enum value: HVDOP = 16;
   */
  HVDOP = 16,
  /**
   *
   * Include number of "satellites in view"
   *
   * @generated from enum value: SATINVIEW = 32;
   */
  SATINVIEW = 32,
  /**
   *
   * Include a sequence number incremented per packet
   *
   * @generated from enum value: SEQ_NO = 64;
   */
  SEQ_NO = 64,
  /**
   *
   * Include positional timestamp (from GPS solution)
   *
   * @generated from enum value: TIMESTAMP = 128;
   */
  TIMESTAMP = 128,
  /**
   *
   * Include positional heading
   * Intended for use with vehicle not walking speeds
   * walking speeds are likely to be error prone like the compass
   *
   * @generated from enum value: HEADING = 256;
   */
  HEADING = 256,
  /**
   *
   * Include positional speed
   * Intended for use with vehicle not walking speeds
   * walking speeds are likely to be error prone like the compass
   *
   * @generated from enum value: SPEED = 512;
   */
  SPEED = 512,
}
/**
 * Describes the enum meshtastic.Config.PositionConfig.PositionFlags.
 */
declare const Config_PositionConfig_PositionFlagsSchema: GenEnum<Config_PositionConfig_PositionFlags>;
/**
 * @generated from enum meshtastic.Config.PositionConfig.GpsMode
 */
declare enum Config_PositionConfig_GpsMode {
  /**
   *
   * GPS is present but disabled
   *
   * @generated from enum value: DISABLED = 0;
   */
  DISABLED = 0,
  /**
   *
   * GPS is present and enabled
   *
   * @generated from enum value: ENABLED = 1;
   */
  ENABLED = 1,
  /**
   *
   * GPS is not present on the device
   *
   * @generated from enum value: NOT_PRESENT = 2;
   */
  NOT_PRESENT = 2,
}
/**
 * Describes the enum meshtastic.Config.PositionConfig.GpsMode.
 */
declare const Config_PositionConfig_GpsModeSchema: GenEnum<Config_PositionConfig_GpsMode>;
/**
 *
 * Power Config\
 * See [Power Config](/docs/settings/config/power) for additional power config details.
 *
 * @generated from message meshtastic.Config.PowerConfig
 */
type Config_PowerConfig = Message<"meshtastic.Config.PowerConfig"> & {
  /**
   *
   * Description: Will sleep everything as much as possible, for the tracker and sensor role this will also include the lora radio.
   * Don't use this setting if you want to use your device with the phone apps or are using a device without a user button.
   * Technical Details: Works for ESP32 devices and NRF52 devices in the Sensor or Tracker roles
   *
   * @generated from field: bool is_power_saving = 1;
   */
  isPowerSaving: boolean;
  /**
   *
   *  Description: If non-zero, the device will fully power off this many seconds after external power is removed.
   *
   * @generated from field: uint32 on_battery_shutdown_after_secs = 2;
   */
  onBatteryShutdownAfterSecs: number;
  /**
   *
   * Ratio of voltage divider for battery pin eg. 3.20 (R1=100k, R2=220k)
   * Overrides the ADC_MULTIPLIER defined in variant for battery voltage calculation.
   * https://meshtastic.org/docs/configuration/radio/power/#adc-multiplier-override
   * Should be set to floating point value between 2 and 6
   *
   * @generated from field: float adc_multiplier_override = 3;
   */
  adcMultiplierOverride: number;
  /**
   *
   *  Description: The number of seconds for to wait before turning off BLE in No Bluetooth states
   *  Technical Details: ESP32 Only 0 for default of 1 minute
   *
   * @generated from field: uint32 wait_bluetooth_secs = 4;
   */
  waitBluetoothSecs: number;
  /**
   *
   * Super Deep Sleep Seconds
   * While in Light Sleep if mesh_sds_timeout_secs is exceeded we will lower into super deep sleep
   * for this value (default 1 year) or a button press
   * 0 for default of one year
   *
   * @generated from field: uint32 sds_secs = 6;
   */
  sdsSecs: number;
  /**
   *
   * Description: In light sleep the CPU is suspended, LoRa radio is on, BLE is off an GPS is on
   * Technical Details: ESP32 Only 0 for default of 300
   *
   * @generated from field: uint32 ls_secs = 7;
   */
  lsSecs: number;
  /**
   *
   * Description: While in light sleep when we receive packets on the LoRa radio we will wake and handle them and stay awake in no BLE mode for this value
   * Technical Details: ESP32 Only 0 for default of 10 seconds
   *
   * @generated from field: uint32 min_wake_secs = 8;
   */
  minWakeSecs: number;
  /**
   *
   * I2C address of INA_2XX to use for reading device battery voltage
   *
   * @generated from field: uint32 device_battery_ina_address = 9;
   */
  deviceBatteryInaAddress: number;
  /**
   *
   * If non-zero, we want powermon log outputs.  With the particular (bitfield) sources enabled.
   * Note: we picked an ID of 32 so that lower more efficient IDs can be used for more frequently used options.
   *
   * @generated from field: uint64 powermon_enables = 32;
   */
  powermonEnables: bigint;
};
/**
 * Describes the message meshtastic.Config.PowerConfig.
 * Use `create(Config_PowerConfigSchema)` to create a new message.
 */
declare const Config_PowerConfigSchema: GenMessage<Config_PowerConfig>;
/**
 *
 * Network Config
 *
 * @generated from message meshtastic.Config.NetworkConfig
 */
type Config_NetworkConfig = Message<"meshtastic.Config.NetworkConfig"> & {
  /**
   *
   * Enable WiFi (disables Bluetooth)
   *
   * @generated from field: bool wifi_enabled = 1;
   */
  wifiEnabled: boolean;
  /**
   *
   * If set, this node will try to join the specified wifi network and
   * acquire an address via DHCP
   *
   * @generated from field: string wifi_ssid = 3;
   */
  wifiSsid: string;
  /**
   *
   * If set, will be use to authenticate to the named wifi
   *
   * @generated from field: string wifi_psk = 4;
   */
  wifiPsk: string;
  /**
   *
   * NTP server to use if WiFi is conneced, defaults to `meshtastic.pool.ntp.org`
   *
   * @generated from field: string ntp_server = 5;
   */
  ntpServer: string;
  /**
   *
   * Enable Ethernet
   *
   * @generated from field: bool eth_enabled = 6;
   */
  ethEnabled: boolean;
  /**
   *
   * acquire an address via DHCP or assign static
   *
   * @generated from field: meshtastic.Config.NetworkConfig.AddressMode address_mode = 7;
   */
  addressMode: Config_NetworkConfig_AddressMode;
  /**
   *
   * struct to keep static address
   *
   * @generated from field: meshtastic.Config.NetworkConfig.IpV4Config ipv4_config = 8;
   */
  ipv4Config?: Config_NetworkConfig_IpV4Config;
  /**
   *
   * rsyslog Server and Port
   *
   * @generated from field: string rsyslog_server = 9;
   */
  rsyslogServer: string;
  /**
   *
   * Flags for enabling/disabling network protocols
   *
   * @generated from field: uint32 enabled_protocols = 10;
   */
  enabledProtocols: number;
  /**
   *
   * Enable/Disable ipv6 support
   *
   * @generated from field: bool ipv6_enabled = 11;
   */
  ipv6Enabled: boolean;
};
/**
 * Describes the message meshtastic.Config.NetworkConfig.
 * Use `create(Config_NetworkConfigSchema)` to create a new message.
 */
declare const Config_NetworkConfigSchema: GenMessage<Config_NetworkConfig>;
/**
 * @generated from message meshtastic.Config.NetworkConfig.IpV4Config
 */
type Config_NetworkConfig_IpV4Config = Message<"meshtastic.Config.NetworkConfig.IpV4Config"> & {
  /**
   *
   * Static IP address
   *
   * @generated from field: fixed32 ip = 1;
   */
  ip: number;
  /**
   *
   * Static gateway address
   *
   * @generated from field: fixed32 gateway = 2;
   */
  gateway: number;
  /**
   *
   * Static subnet mask
   *
   * @generated from field: fixed32 subnet = 3;
   */
  subnet: number;
  /**
   *
   * Static DNS server address
   *
   * @generated from field: fixed32 dns = 4;
   */
  dns: number;
};
/**
 * Describes the message meshtastic.Config.NetworkConfig.IpV4Config.
 * Use `create(Config_NetworkConfig_IpV4ConfigSchema)` to create a new message.
 */
declare const Config_NetworkConfig_IpV4ConfigSchema: GenMessage<Config_NetworkConfig_IpV4Config>;
/**
 * @generated from enum meshtastic.Config.NetworkConfig.AddressMode
 */
declare enum Config_NetworkConfig_AddressMode {
  /**
   *
   * obtain ip address via DHCP
   *
   * @generated from enum value: DHCP = 0;
   */
  DHCP = 0,
  /**
   *
   * use static ip address
   *
   * @generated from enum value: STATIC = 1;
   */
  STATIC = 1,
}
/**
 * Describes the enum meshtastic.Config.NetworkConfig.AddressMode.
 */
declare const Config_NetworkConfig_AddressModeSchema: GenEnum<Config_NetworkConfig_AddressMode>;
/**
 *
 * Available flags auxiliary network protocols
 *
 * @generated from enum meshtastic.Config.NetworkConfig.ProtocolFlags
 */
declare enum Config_NetworkConfig_ProtocolFlags {
  /**
   *
   * Do not broadcast packets over any network protocol
   *
   * @generated from enum value: NO_BROADCAST = 0;
   */
  NO_BROADCAST = 0,
  /**
   *
   * Enable broadcasting packets via UDP over the local network
   *
   * @generated from enum value: UDP_BROADCAST = 1;
   */
  UDP_BROADCAST = 1,
}
/**
 * Describes the enum meshtastic.Config.NetworkConfig.ProtocolFlags.
 */
declare const Config_NetworkConfig_ProtocolFlagsSchema: GenEnum<Config_NetworkConfig_ProtocolFlags>;
/**
 *
 * Display Config
 *
 * @generated from message meshtastic.Config.DisplayConfig
 */
type Config_DisplayConfig = Message<"meshtastic.Config.DisplayConfig"> & {
  /**
   *
   * Number of seconds the screen stays on after pressing the user button or receiving a message
   * 0 for default of one minute MAXUINT for always on
   *
   * @generated from field: uint32 screen_on_secs = 1;
   */
  screenOnSecs: number;
  /**
   *
   * Deprecated in 2.7.4: Unused
   * How the GPS coordinates are formatted on the OLED screen.
   *
   * @generated from field: meshtastic.Config.DisplayConfig.DeprecatedGpsCoordinateFormat gps_format = 2 [deprecated = true];
   * @deprecated
   */
  gpsFormat: Config_DisplayConfig_DeprecatedGpsCoordinateFormat;
  /**
   *
   * Automatically toggles to the next page on the screen like a carousel, based the specified interval in seconds.
   * Potentially useful for devices without user buttons.
   *
   * @generated from field: uint32 auto_screen_carousel_secs = 3;
   */
  autoScreenCarouselSecs: number;
  /**
   *
   * If this is set, the displayed compass will always point north. if unset, the old behaviour
   * (top of display is heading direction) is used.
   *
   * @generated from field: bool compass_north_top = 4 [deprecated = true];
   * @deprecated
   */
  compassNorthTop: boolean;
  /**
   *
   * Flip screen vertically, for cases that mount the screen upside down
   *
   * @generated from field: bool flip_screen = 5;
   */
  flipScreen: boolean;
  /**
   *
   * Perferred display units
   *
   * @generated from field: meshtastic.Config.DisplayConfig.DisplayUnits units = 6;
   */
  units: Config_DisplayConfig_DisplayUnits;
  /**
   *
   * Override auto-detect in screen
   *
   * @generated from field: meshtastic.Config.DisplayConfig.OledType oled = 7;
   */
  oled: Config_DisplayConfig_OledType;
  /**
   *
   * Display Mode
   *
   * @generated from field: meshtastic.Config.DisplayConfig.DisplayMode displaymode = 8;
   */
  displaymode: Config_DisplayConfig_DisplayMode;
  /**
   *
   * Print first line in pseudo-bold? FALSE is original style, TRUE is bold
   *
   * @generated from field: bool heading_bold = 9;
   */
  headingBold: boolean;
  /**
   *
   * Should we wake the screen up on accelerometer detected motion or tap
   *
   * @generated from field: bool wake_on_tap_or_motion = 10;
   */
  wakeOnTapOrMotion: boolean;
  /**
   *
   * Indicates how to rotate or invert the compass output to accurate display on the display.
   *
   * @generated from field: meshtastic.Config.DisplayConfig.CompassOrientation compass_orientation = 11;
   */
  compassOrientation: Config_DisplayConfig_CompassOrientation;
  /**
   *
   * If false (default), the device will display the time in 24-hour format on screen.
   * If true, the device will display the time in 12-hour format on screen.
   *
   * @generated from field: bool use_12h_clock = 12;
   */
  use12hClock: boolean;
  /**
   *
   * If false (default), the device will use short names for various display screens.
   * If true, node names will show in long format
   *
   * @generated from field: bool use_long_node_name = 13;
   */
  useLongNodeName: boolean;
};
/**
 * Describes the message meshtastic.Config.DisplayConfig.
 * Use `create(Config_DisplayConfigSchema)` to create a new message.
 */
declare const Config_DisplayConfigSchema: GenMessage<Config_DisplayConfig>;
/**
 *
 * Deprecated in 2.7.4: Unused
 *
 * @generated from enum meshtastic.Config.DisplayConfig.DeprecatedGpsCoordinateFormat
 */
declare enum Config_DisplayConfig_DeprecatedGpsCoordinateFormat {
  /**
   * @generated from enum value: UNUSED = 0;
   */
  UNUSED = 0,
}
/**
 * Describes the enum meshtastic.Config.DisplayConfig.DeprecatedGpsCoordinateFormat.
 */
declare const Config_DisplayConfig_DeprecatedGpsCoordinateFormatSchema: GenEnum<Config_DisplayConfig_DeprecatedGpsCoordinateFormat>;
/**
 *
 * Unit display preference
 *
 * @generated from enum meshtastic.Config.DisplayConfig.DisplayUnits
 */
declare enum Config_DisplayConfig_DisplayUnits {
  /**
   *
   * Metric (Default)
   *
   * @generated from enum value: METRIC = 0;
   */
  METRIC = 0,
  /**
   *
   * Imperial
   *
   * @generated from enum value: IMPERIAL = 1;
   */
  IMPERIAL = 1,
}
/**
 * Describes the enum meshtastic.Config.DisplayConfig.DisplayUnits.
 */
declare const Config_DisplayConfig_DisplayUnitsSchema: GenEnum<Config_DisplayConfig_DisplayUnits>;
/**
 *
 * Override OLED outo detect with this if it fails.
 *
 * @generated from enum meshtastic.Config.DisplayConfig.OledType
 */
declare enum Config_DisplayConfig_OledType {
  /**
   *
   * Default / Autodetect
   *
   * @generated from enum value: OLED_AUTO = 0;
   */
  OLED_AUTO = 0,
  /**
   *
   * Default / Autodetect
   *
   * @generated from enum value: OLED_SSD1306 = 1;
   */
  OLED_SSD1306 = 1,
  /**
   *
   * Default / Autodetect
   *
   * @generated from enum value: OLED_SH1106 = 2;
   */
  OLED_SH1106 = 2,
  /**
   *
   * Can not be auto detected but set by proto. Used for 128x64 screens
   *
   * @generated from enum value: OLED_SH1107 = 3;
   */
  OLED_SH1107 = 3,
  /**
   *
   * Can not be auto detected but set by proto. Used for 128x128 screens
   *
   * @generated from enum value: OLED_SH1107_128_128 = 4;
   */
  OLED_SH1107_128_128 = 4,
}
/**
 * Describes the enum meshtastic.Config.DisplayConfig.OledType.
 */
declare const Config_DisplayConfig_OledTypeSchema: GenEnum<Config_DisplayConfig_OledType>;
/**
 * @generated from enum meshtastic.Config.DisplayConfig.DisplayMode
 */
declare enum Config_DisplayConfig_DisplayMode {
  /**
   *
   * Default. The old style for the 128x64 OLED screen
   *
   * @generated from enum value: DEFAULT = 0;
   */
  DEFAULT = 0,
  /**
   *
   * Rearrange display elements to cater for bicolor OLED displays
   *
   * @generated from enum value: TWOCOLOR = 1;
   */
  TWOCOLOR = 1,
  /**
   *
   * Same as TwoColor, but with inverted top bar. Not so good for Epaper displays
   *
   * @generated from enum value: INVERTED = 2;
   */
  INVERTED = 2,
  /**
   *
   * TFT Full Color Displays (not implemented yet)
   *
   * @generated from enum value: COLOR = 3;
   */
  COLOR = 3,
}
/**
 * Describes the enum meshtastic.Config.DisplayConfig.DisplayMode.
 */
declare const Config_DisplayConfig_DisplayModeSchema: GenEnum<Config_DisplayConfig_DisplayMode>;
/**
 * @generated from enum meshtastic.Config.DisplayConfig.CompassOrientation
 */
declare enum Config_DisplayConfig_CompassOrientation {
  /**
   *
   * The compass and the display are in the same orientation.
   *
   * @generated from enum value: DEGREES_0 = 0;
   */
  DEGREES_0 = 0,
  /**
   *
   * Rotate the compass by 90 degrees.
   *
   * @generated from enum value: DEGREES_90 = 1;
   */
  DEGREES_90 = 1,
  /**
   *
   * Rotate the compass by 180 degrees.
   *
   * @generated from enum value: DEGREES_180 = 2;
   */
  DEGREES_180 = 2,
  /**
   *
   * Rotate the compass by 270 degrees.
   *
   * @generated from enum value: DEGREES_270 = 3;
   */
  DEGREES_270 = 3,
  /**
   *
   * Don't rotate the compass, but invert the result.
   *
   * @generated from enum value: DEGREES_0_INVERTED = 4;
   */
  DEGREES_0_INVERTED = 4,
  /**
   *
   * Rotate the compass by 90 degrees and invert.
   *
   * @generated from enum value: DEGREES_90_INVERTED = 5;
   */
  DEGREES_90_INVERTED = 5,
  /**
   *
   * Rotate the compass by 180 degrees and invert.
   *
   * @generated from enum value: DEGREES_180_INVERTED = 6;
   */
  DEGREES_180_INVERTED = 6,
  /**
   *
   * Rotate the compass by 270 degrees and invert.
   *
   * @generated from enum value: DEGREES_270_INVERTED = 7;
   */
  DEGREES_270_INVERTED = 7,
}
/**
 * Describes the enum meshtastic.Config.DisplayConfig.CompassOrientation.
 */
declare const Config_DisplayConfig_CompassOrientationSchema: GenEnum<Config_DisplayConfig_CompassOrientation>;
/**
 *
 * Lora Config
 *
 * @generated from message meshtastic.Config.LoRaConfig
 */
type Config_LoRaConfig = Message<"meshtastic.Config.LoRaConfig"> & {
  /**
   *
   * When enabled, the `modem_preset` fields will be adhered to, else the `bandwidth`/`spread_factor`/`coding_rate`
   * will be taked from their respective manually defined fields
   *
   * @generated from field: bool use_preset = 1;
   */
  usePreset: boolean;
  /**
   *
   * Either modem_config or bandwidth/spreading/coding will be specified - NOT BOTH.
   * As a heuristic: If bandwidth is specified, do not use modem_config.
   * Because protobufs take ZERO space when the value is zero this works out nicely.
   * This value is replaced by bandwidth/spread_factor/coding_rate.
   * If you'd like to experiment with other options add them to MeshRadio.cpp in the device code.
   *
   * @generated from field: meshtastic.Config.LoRaConfig.ModemPreset modem_preset = 2;
   */
  modemPreset: Config_LoRaConfig_ModemPreset;
  /**
   *
   * Bandwidth in MHz
   * Certain bandwidth numbers are 'special' and will be converted to the
   * appropriate floating point value: 31 -> 31.25MHz
   *
   * @generated from field: uint32 bandwidth = 3;
   */
  bandwidth: number;
  /**
   *
   * A number from 7 to 12.
   * Indicates number of chirps per symbol as 1<<spread_factor.
   *
   * @generated from field: uint32 spread_factor = 4;
   */
  spreadFactor: number;
  /**
   *
   * The denominator of the coding rate.
   * ie for 4/5, the value is 5. 4/8 the value is 8.
   *
   * @generated from field: uint32 coding_rate = 5;
   */
  codingRate: number;
  /**
   *
   * This parameter is for advanced users with advanced test equipment, we do not recommend most users use it.
   * A frequency offset that is added to to the calculated band center frequency.
   * Used to correct for crystal calibration errors.
   *
   * @generated from field: float frequency_offset = 6;
   */
  frequencyOffset: number;
  /**
   *
   * The region code for the radio (US, CN, EU433, etc...)
   *
   * @generated from field: meshtastic.Config.LoRaConfig.RegionCode region = 7;
   */
  region: Config_LoRaConfig_RegionCode;
  /**
   *
   * Maximum number of hops. This can't be greater than 7.
   * Default of 3
   * Attempting to set a value > 7 results in the default
   *
   * @generated from field: uint32 hop_limit = 8;
   */
  hopLimit: number;
  /**
   *
   * Disable TX from the LoRa radio. Useful for hot-swapping antennas and other tests.
   * Defaults to false
   *
   * @generated from field: bool tx_enabled = 9;
   */
  txEnabled: boolean;
  /**
   *
   * If zero, then use default max legal continuous power (ie. something that won't
   * burn out the radio hardware)
   * In most cases you should use zero here.
   * Units are in dBm.
   *
   * @generated from field: int32 tx_power = 10;
   */
  txPower: number;
  /**
   *
   * This controls the actual hardware frequency the radio transmits on.
   * Most users should never need to be exposed to this field/concept.
   * A channel number between 1 and NUM_CHANNELS (whatever the max is in the current region).
   * If ZERO then the rule is "use the old channel name hash based
   * algorithm to derive the channel number")
   * If using the hash algorithm the channel number will be: hash(channel_name) %
   * NUM_CHANNELS (Where num channels depends on the regulatory region).
   *
   * @generated from field: uint32 channel_num = 11;
   */
  channelNum: number;
  /**
   *
   * If true, duty cycle limits will be exceeded and thus you're possibly not following
   * the local regulations if you're not a HAM.
   * Has no effect if the duty cycle of the used region is 100%.
   *
   * @generated from field: bool override_duty_cycle = 12;
   */
  overrideDutyCycle: boolean;
  /**
   *
   * If true, sets RX boosted gain mode on SX126X based radios
   *
   * @generated from field: bool sx126x_rx_boosted_gain = 13;
   */
  sx126xRxBoostedGain: boolean;
  /**
   *
   * This parameter is for advanced users and licensed HAM radio operators.
   * Ignore Channel Calculation and use this frequency instead. The frequency_offset
   * will still be applied. This will allow you to use out-of-band frequencies.
   * Please respect your local laws and regulations. If you are a HAM, make sure you
   * enable HAM mode and turn off encryption.
   *
   * @generated from field: float override_frequency = 14;
   */
  overrideFrequency: number;
  /**
   *
   * If true, disable the build-in PA FAN using pin define in RF95_FAN_EN.
   *
   * @generated from field: bool pa_fan_disabled = 15;
   */
  paFanDisabled: boolean;
  /**
   *
   * For testing it is useful sometimes to force a node to never listen to
   * particular other nodes (simulating radio out of range). All nodenums listed
   * in ignore_incoming will have packets they send dropped on receive (by router.cpp)
   *
   * @generated from field: repeated uint32 ignore_incoming = 103;
   */
  ignoreIncoming: number[];
  /**
   *
   * If true, the device will not process any packets received via LoRa that passed via MQTT anywhere on the path towards it.
   *
   * @generated from field: bool ignore_mqtt = 104;
   */
  ignoreMqtt: boolean;
  /**
   *
   * Sets the ok_to_mqtt bit on outgoing packets
   *
   * @generated from field: bool config_ok_to_mqtt = 105;
   */
  configOkToMqtt: boolean;
};
/**
 * Describes the message meshtastic.Config.LoRaConfig.
 * Use `create(Config_LoRaConfigSchema)` to create a new message.
 */
declare const Config_LoRaConfigSchema: GenMessage<Config_LoRaConfig>;
/**
 * @generated from enum meshtastic.Config.LoRaConfig.RegionCode
 */
declare enum Config_LoRaConfig_RegionCode {
  /**
   *
   * Region is not set
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * United States
   *
   * @generated from enum value: US = 1;
   */
  US = 1,
  /**
   *
   * European Union 433mhz
   *
   * @generated from enum value: EU_433 = 2;
   */
  EU_433 = 2,
  /**
   *
   * European Union 868mhz
   *
   * @generated from enum value: EU_868 = 3;
   */
  EU_868 = 3,
  /**
   *
   * China
   *
   * @generated from enum value: CN = 4;
   */
  CN = 4,
  /**
   *
   * Japan
   *
   * @generated from enum value: JP = 5;
   */
  JP = 5,
  /**
   *
   * Australia / New Zealand
   *
   * @generated from enum value: ANZ = 6;
   */
  ANZ = 6,
  /**
   *
   * Korea
   *
   * @generated from enum value: KR = 7;
   */
  KR = 7,
  /**
   *
   * Taiwan
   *
   * @generated from enum value: TW = 8;
   */
  TW = 8,
  /**
   *
   * Russia
   *
   * @generated from enum value: RU = 9;
   */
  RU = 9,
  /**
   *
   * India
   *
   * @generated from enum value: IN = 10;
   */
  IN = 10,
  /**
   *
   * New Zealand 865mhz
   *
   * @generated from enum value: NZ_865 = 11;
   */
  NZ_865 = 11,
  /**
   *
   * Thailand
   *
   * @generated from enum value: TH = 12;
   */
  TH = 12,
  /**
   *
   * WLAN Band
   *
   * @generated from enum value: LORA_24 = 13;
   */
  LORA_24 = 13,
  /**
   *
   * Ukraine 433mhz
   *
   * @generated from enum value: UA_433 = 14;
   */
  UA_433 = 14,
  /**
   *
   * Ukraine 868mhz
   *
   * @generated from enum value: UA_868 = 15;
   */
  UA_868 = 15,
  /**
   *
   * Malaysia 433mhz
   *
   * @generated from enum value: MY_433 = 16;
   */
  MY_433 = 16,
  /**
   *
   * Malaysia 919mhz
   *
   * @generated from enum value: MY_919 = 17;
   */
  MY_919 = 17,
  /**
   *
   * Singapore 923mhz
   *
   * @generated from enum value: SG_923 = 18;
   */
  SG_923 = 18,
  /**
   *
   * Philippines 433mhz
   *
   * @generated from enum value: PH_433 = 19;
   */
  PH_433 = 19,
  /**
   *
   * Philippines 868mhz
   *
   * @generated from enum value: PH_868 = 20;
   */
  PH_868 = 20,
  /**
   *
   * Philippines 915mhz
   *
   * @generated from enum value: PH_915 = 21;
   */
  PH_915 = 21,
  /**
   *
   * Australia / New Zealand 433MHz
   *
   * @generated from enum value: ANZ_433 = 22;
   */
  ANZ_433 = 22,
  /**
   *
   * Kazakhstan 433MHz
   *
   * @generated from enum value: KZ_433 = 23;
   */
  KZ_433 = 23,
  /**
   *
   * Kazakhstan 863MHz
   *
   * @generated from enum value: KZ_863 = 24;
   */
  KZ_863 = 24,
  /**
   *
   * Nepal 865MHz
   *
   * @generated from enum value: NP_865 = 25;
   */
  NP_865 = 25,
  /**
   *
   * Brazil 902MHz
   *
   * @generated from enum value: BR_902 = 26;
   */
  BR_902 = 26,
}
/**
 * Describes the enum meshtastic.Config.LoRaConfig.RegionCode.
 */
declare const Config_LoRaConfig_RegionCodeSchema: GenEnum<Config_LoRaConfig_RegionCode>;
/**
 *
 * Standard predefined channel settings
 * Note: these mappings must match ModemPreset Choice in the device code.
 *
 * @generated from enum meshtastic.Config.LoRaConfig.ModemPreset
 */
declare enum Config_LoRaConfig_ModemPreset {
  /**
   *
   * Long Range - Fast
   *
   * @generated from enum value: LONG_FAST = 0;
   */
  LONG_FAST = 0,
  /**
   *
   * Long Range - Slow
   *
   * @generated from enum value: LONG_SLOW = 1;
   */
  LONG_SLOW = 1,
  /**
   *
   * Very Long Range - Slow
   * Deprecated in 2.5: Works only with txco and is unusably slow
   *
   * @generated from enum value: VERY_LONG_SLOW = 2 [deprecated = true];
   * @deprecated
   */
  VERY_LONG_SLOW = 2,
  /**
   *
   * Medium Range - Slow
   *
   * @generated from enum value: MEDIUM_SLOW = 3;
   */
  MEDIUM_SLOW = 3,
  /**
   *
   * Medium Range - Fast
   *
   * @generated from enum value: MEDIUM_FAST = 4;
   */
  MEDIUM_FAST = 4,
  /**
   *
   * Short Range - Slow
   *
   * @generated from enum value: SHORT_SLOW = 5;
   */
  SHORT_SLOW = 5,
  /**
   *
   * Short Range - Fast
   *
   * @generated from enum value: SHORT_FAST = 6;
   */
  SHORT_FAST = 6,
  /**
   *
   * Long Range - Moderately Fast
   *
   * @generated from enum value: LONG_MODERATE = 7;
   */
  LONG_MODERATE = 7,
  /**
   *
   * Short Range - Turbo
   * This is the fastest preset and the only one with 500kHz bandwidth.
   * It is not legal to use in all regions due to this wider bandwidth.
   *
   * @generated from enum value: SHORT_TURBO = 8;
   */
  SHORT_TURBO = 8,
}
/**
 * Describes the enum meshtastic.Config.LoRaConfig.ModemPreset.
 */
declare const Config_LoRaConfig_ModemPresetSchema: GenEnum<Config_LoRaConfig_ModemPreset>;
/**
 * @generated from message meshtastic.Config.BluetoothConfig
 */
type Config_BluetoothConfig = Message<"meshtastic.Config.BluetoothConfig"> & {
  /**
   *
   * Enable Bluetooth on the device
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * Determines the pairing strategy for the device
   *
   * @generated from field: meshtastic.Config.BluetoothConfig.PairingMode mode = 2;
   */
  mode: Config_BluetoothConfig_PairingMode;
  /**
   *
   * Specified PIN for PairingMode.FixedPin
   *
   * @generated from field: uint32 fixed_pin = 3;
   */
  fixedPin: number;
};
/**
 * Describes the message meshtastic.Config.BluetoothConfig.
 * Use `create(Config_BluetoothConfigSchema)` to create a new message.
 */
declare const Config_BluetoothConfigSchema: GenMessage<Config_BluetoothConfig>;
/**
 * @generated from enum meshtastic.Config.BluetoothConfig.PairingMode
 */
declare enum Config_BluetoothConfig_PairingMode {
  /**
   *
   * Device generates a random PIN that will be shown on the screen of the device for pairing
   *
   * @generated from enum value: RANDOM_PIN = 0;
   */
  RANDOM_PIN = 0,
  /**
   *
   * Device requires a specified fixed PIN for pairing
   *
   * @generated from enum value: FIXED_PIN = 1;
   */
  FIXED_PIN = 1,
  /**
   *
   * Device requires no PIN for pairing
   *
   * @generated from enum value: NO_PIN = 2;
   */
  NO_PIN = 2,
}
/**
 * Describes the enum meshtastic.Config.BluetoothConfig.PairingMode.
 */
declare const Config_BluetoothConfig_PairingModeSchema: GenEnum<Config_BluetoothConfig_PairingMode>;
/**
 * @generated from message meshtastic.Config.SecurityConfig
 */
type Config_SecurityConfig = Message<"meshtastic.Config.SecurityConfig"> & {
  /**
   *
   * The public key of the user's device.
   * Sent out to other nodes on the mesh to allow them to compute a shared secret key.
   *
   * @generated from field: bytes public_key = 1;
   */
  publicKey: Uint8Array;
  /**
   *
   * The private key of the device.
   * Used to create a shared key with a remote device.
   *
   * @generated from field: bytes private_key = 2;
   */
  privateKey: Uint8Array;
  /**
   *
   * The public key authorized to send admin messages to this node.
   *
   * @generated from field: repeated bytes admin_key = 3;
   */
  adminKey: Uint8Array[];
  /**
   *
   * If true, device is considered to be "managed" by a mesh administrator via admin messages
   * Device is managed by a mesh administrator.
   *
   * @generated from field: bool is_managed = 4;
   */
  isManaged: boolean;
  /**
   *
   * Serial Console over the Stream API."
   *
   * @generated from field: bool serial_enabled = 5;
   */
  serialEnabled: boolean;
  /**
   *
   * By default we turn off logging as soon as an API client connects (to keep shared serial link quiet).
   * Output live debug logging over serial or bluetooth is set to true.
   *
   * @generated from field: bool debug_log_api_enabled = 6;
   */
  debugLogApiEnabled: boolean;
  /**
   *
   * Allow incoming device control over the insecure legacy admin channel.
   *
   * @generated from field: bool admin_channel_enabled = 8;
   */
  adminChannelEnabled: boolean;
};
/**
 * Describes the message meshtastic.Config.SecurityConfig.
 * Use `create(Config_SecurityConfigSchema)` to create a new message.
 */
declare const Config_SecurityConfigSchema: GenMessage<Config_SecurityConfig>;
/**
 *
 * Blank config request, strictly for getting the session key
 *
 * @generated from message meshtastic.Config.SessionkeyConfig
 */
type Config_SessionkeyConfig = Message<"meshtastic.Config.SessionkeyConfig"> & {};
/**
 * Describes the message meshtastic.Config.SessionkeyConfig.
 * Use `create(Config_SessionkeyConfigSchema)` to create a new message.
 */
declare const Config_SessionkeyConfigSchema: GenMessage<Config_SessionkeyConfig>;
declare namespace connection_status_pb_d_exports {
  export { BluetoothConnectionStatus, BluetoothConnectionStatusSchema, DeviceConnectionStatus, DeviceConnectionStatusSchema, EthernetConnectionStatus, EthernetConnectionStatusSchema, NetworkConnectionStatus, NetworkConnectionStatusSchema, SerialConnectionStatus, SerialConnectionStatusSchema, WifiConnectionStatus, WifiConnectionStatusSchema, file_meshtastic_connection_status };
}
/**
 * Describes the file meshtastic/connection_status.proto.
 */
declare const file_meshtastic_connection_status: GenFile;
/**
 * @generated from message meshtastic.DeviceConnectionStatus
 */
type DeviceConnectionStatus = Message<"meshtastic.DeviceConnectionStatus"> & {
  /**
   *
   * WiFi Status
   *
   * @generated from field: optional meshtastic.WifiConnectionStatus wifi = 1;
   */
  wifi?: WifiConnectionStatus;
  /**
   *
   * WiFi Status
   *
   * @generated from field: optional meshtastic.EthernetConnectionStatus ethernet = 2;
   */
  ethernet?: EthernetConnectionStatus;
  /**
   *
   * Bluetooth Status
   *
   * @generated from field: optional meshtastic.BluetoothConnectionStatus bluetooth = 3;
   */
  bluetooth?: BluetoothConnectionStatus;
  /**
   *
   * Serial Status
   *
   * @generated from field: optional meshtastic.SerialConnectionStatus serial = 4;
   */
  serial?: SerialConnectionStatus;
};
/**
 * Describes the message meshtastic.DeviceConnectionStatus.
 * Use `create(DeviceConnectionStatusSchema)` to create a new message.
 */
declare const DeviceConnectionStatusSchema: GenMessage<DeviceConnectionStatus>;
/**
 *
 * WiFi connection status
 *
 * @generated from message meshtastic.WifiConnectionStatus
 */
type WifiConnectionStatus = Message<"meshtastic.WifiConnectionStatus"> & {
  /**
   *
   * Connection status
   *
   * @generated from field: meshtastic.NetworkConnectionStatus status = 1;
   */
  status?: NetworkConnectionStatus;
  /**
   *
   * WiFi access point SSID
   *
   * @generated from field: string ssid = 2;
   */
  ssid: string;
  /**
   *
   * RSSI of wireless connection
   *
   * @generated from field: int32 rssi = 3;
   */
  rssi: number;
};
/**
 * Describes the message meshtastic.WifiConnectionStatus.
 * Use `create(WifiConnectionStatusSchema)` to create a new message.
 */
declare const WifiConnectionStatusSchema: GenMessage<WifiConnectionStatus>;
/**
 *
 * Ethernet connection status
 *
 * @generated from message meshtastic.EthernetConnectionStatus
 */
type EthernetConnectionStatus = Message<"meshtastic.EthernetConnectionStatus"> & {
  /**
   *
   * Connection status
   *
   * @generated from field: meshtastic.NetworkConnectionStatus status = 1;
   */
  status?: NetworkConnectionStatus;
};
/**
 * Describes the message meshtastic.EthernetConnectionStatus.
 * Use `create(EthernetConnectionStatusSchema)` to create a new message.
 */
declare const EthernetConnectionStatusSchema: GenMessage<EthernetConnectionStatus>;
/**
 *
 * Ethernet or WiFi connection status
 *
 * @generated from message meshtastic.NetworkConnectionStatus
 */
type NetworkConnectionStatus = Message<"meshtastic.NetworkConnectionStatus"> & {
  /**
   *
   * IP address of device
   *
   * @generated from field: fixed32 ip_address = 1;
   */
  ipAddress: number;
  /**
   *
   * Whether the device has an active connection or not
   *
   * @generated from field: bool is_connected = 2;
   */
  isConnected: boolean;
  /**
   *
   * Whether the device has an active connection to an MQTT broker or not
   *
   * @generated from field: bool is_mqtt_connected = 3;
   */
  isMqttConnected: boolean;
  /**
   *
   * Whether the device is actively remote syslogging or not
   *
   * @generated from field: bool is_syslog_connected = 4;
   */
  isSyslogConnected: boolean;
};
/**
 * Describes the message meshtastic.NetworkConnectionStatus.
 * Use `create(NetworkConnectionStatusSchema)` to create a new message.
 */
declare const NetworkConnectionStatusSchema: GenMessage<NetworkConnectionStatus>;
/**
 *
 * Bluetooth connection status
 *
 * @generated from message meshtastic.BluetoothConnectionStatus
 */
type BluetoothConnectionStatus = Message<"meshtastic.BluetoothConnectionStatus"> & {
  /**
   *
   * The pairing PIN for bluetooth
   *
   * @generated from field: uint32 pin = 1;
   */
  pin: number;
  /**
   *
   * RSSI of bluetooth connection
   *
   * @generated from field: int32 rssi = 2;
   */
  rssi: number;
  /**
   *
   * Whether the device has an active connection or not
   *
   * @generated from field: bool is_connected = 3;
   */
  isConnected: boolean;
};
/**
 * Describes the message meshtastic.BluetoothConnectionStatus.
 * Use `create(BluetoothConnectionStatusSchema)` to create a new message.
 */
declare const BluetoothConnectionStatusSchema: GenMessage<BluetoothConnectionStatus>;
/**
 *
 * Serial connection status
 *
 * @generated from message meshtastic.SerialConnectionStatus
 */
type SerialConnectionStatus = Message<"meshtastic.SerialConnectionStatus"> & {
  /**
   *
   * Serial baud rate
   *
   * @generated from field: uint32 baud = 1;
   */
  baud: number;
  /**
   *
   * Whether the device has an active connection or not
   *
   * @generated from field: bool is_connected = 2;
   */
  isConnected: boolean;
};
/**
 * Describes the message meshtastic.SerialConnectionStatus.
 * Use `create(SerialConnectionStatusSchema)` to create a new message.
 */
declare const SerialConnectionStatusSchema: GenMessage<SerialConnectionStatus>;
declare namespace module_config_pb_d_exports {
  export { ModuleConfig, ModuleConfigSchema, ModuleConfig_AmbientLightingConfig, ModuleConfig_AmbientLightingConfigSchema, ModuleConfig_AudioConfig, ModuleConfig_AudioConfigSchema, ModuleConfig_AudioConfig_Audio_Baud, ModuleConfig_AudioConfig_Audio_BaudSchema, ModuleConfig_CannedMessageConfig, ModuleConfig_CannedMessageConfigSchema, ModuleConfig_CannedMessageConfig_InputEventChar, ModuleConfig_CannedMessageConfig_InputEventCharSchema, ModuleConfig_DetectionSensorConfig, ModuleConfig_DetectionSensorConfigSchema, ModuleConfig_DetectionSensorConfig_TriggerType, ModuleConfig_DetectionSensorConfig_TriggerTypeSchema, ModuleConfig_ExternalNotificationConfig, ModuleConfig_ExternalNotificationConfigSchema, ModuleConfig_MQTTConfig, ModuleConfig_MQTTConfigSchema, ModuleConfig_MapReportSettings, ModuleConfig_MapReportSettingsSchema, ModuleConfig_NeighborInfoConfig, ModuleConfig_NeighborInfoConfigSchema, ModuleConfig_PaxcounterConfig, ModuleConfig_PaxcounterConfigSchema, ModuleConfig_RangeTestConfig, ModuleConfig_RangeTestConfigSchema, ModuleConfig_RemoteHardwareConfig, ModuleConfig_RemoteHardwareConfigSchema, ModuleConfig_SerialConfig, ModuleConfig_SerialConfigSchema, ModuleConfig_SerialConfig_Serial_Baud, ModuleConfig_SerialConfig_Serial_BaudSchema, ModuleConfig_SerialConfig_Serial_Mode, ModuleConfig_SerialConfig_Serial_ModeSchema, ModuleConfig_StoreForwardConfig, ModuleConfig_StoreForwardConfigSchema, ModuleConfig_TelemetryConfig, ModuleConfig_TelemetryConfigSchema, RemoteHardwarePin, RemoteHardwarePinSchema, RemoteHardwarePinType, RemoteHardwarePinTypeSchema, file_meshtastic_module_config };
}
/**
 * Describes the file meshtastic/module_config.proto.
 */
declare const file_meshtastic_module_config: GenFile;
/**
 *
 * Module Config
 *
 * @generated from message meshtastic.ModuleConfig
 */
type ModuleConfig = Message<"meshtastic.ModuleConfig"> & {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from oneof meshtastic.ModuleConfig.payload_variant
   */
  payloadVariant: {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.MQTTConfig mqtt = 1;
     */
    value: ModuleConfig_MQTTConfig;
    case: "mqtt";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.SerialConfig serial = 2;
     */
    value: ModuleConfig_SerialConfig;
    case: "serial";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.ExternalNotificationConfig external_notification = 3;
     */
    value: ModuleConfig_ExternalNotificationConfig;
    case: "externalNotification";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.StoreForwardConfig store_forward = 4;
     */
    value: ModuleConfig_StoreForwardConfig;
    case: "storeForward";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.RangeTestConfig range_test = 5;
     */
    value: ModuleConfig_RangeTestConfig;
    case: "rangeTest";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.TelemetryConfig telemetry = 6;
     */
    value: ModuleConfig_TelemetryConfig;
    case: "telemetry";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.CannedMessageConfig canned_message = 7;
     */
    value: ModuleConfig_CannedMessageConfig;
    case: "cannedMessage";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.AudioConfig audio = 8;
     */
    value: ModuleConfig_AudioConfig;
    case: "audio";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.RemoteHardwareConfig remote_hardware = 9;
     */
    value: ModuleConfig_RemoteHardwareConfig;
    case: "remoteHardware";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.NeighborInfoConfig neighbor_info = 10;
     */
    value: ModuleConfig_NeighborInfoConfig;
    case: "neighborInfo";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.AmbientLightingConfig ambient_lighting = 11;
     */
    value: ModuleConfig_AmbientLightingConfig;
    case: "ambientLighting";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.DetectionSensorConfig detection_sensor = 12;
     */
    value: ModuleConfig_DetectionSensorConfig;
    case: "detectionSensor";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.ModuleConfig.PaxcounterConfig paxcounter = 13;
     */
    value: ModuleConfig_PaxcounterConfig;
    case: "paxcounter";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.ModuleConfig.
 * Use `create(ModuleConfigSchema)` to create a new message.
 */
declare const ModuleConfigSchema: GenMessage<ModuleConfig>;
/**
 *
 * MQTT Client Config
 *
 * @generated from message meshtastic.ModuleConfig.MQTTConfig
 */
type ModuleConfig_MQTTConfig = Message<"meshtastic.ModuleConfig.MQTTConfig"> & {
  /**
   *
   * If a meshtastic node is able to reach the internet it will normally attempt to gateway any channels that are marked as
   * is_uplink_enabled or is_downlink_enabled.
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * The server to use for our MQTT global message gateway feature.
   * If not set, the default server will be used
   *
   * @generated from field: string address = 2;
   */
  address: string;
  /**
   *
   * MQTT username to use (most useful for a custom MQTT server).
   * If using a custom server, this will be honoured even if empty.
   * If using the default server, this will only be honoured if set, otherwise the device will use the default username
   *
   * @generated from field: string username = 3;
   */
  username: string;
  /**
   *
   * MQTT password to use (most useful for a custom MQTT server).
   * If using a custom server, this will be honoured even if empty.
   * If using the default server, this will only be honoured if set, otherwise the device will use the default password
   *
   * @generated from field: string password = 4;
   */
  password: string;
  /**
   *
   * Whether to send encrypted or decrypted packets to MQTT.
   * This parameter is only honoured if you also set server
   * (the default official mqtt.meshtastic.org server can handle encrypted packets)
   * Decrypted packets may be useful for external systems that want to consume meshtastic packets
   *
   * @generated from field: bool encryption_enabled = 5;
   */
  encryptionEnabled: boolean;
  /**
   *
   * Whether to send / consume json packets on MQTT
   *
   * @generated from field: bool json_enabled = 6;
   */
  jsonEnabled: boolean;
  /**
   *
   * If true, we attempt to establish a secure connection using TLS
   *
   * @generated from field: bool tls_enabled = 7;
   */
  tlsEnabled: boolean;
  /**
   *
   * The root topic to use for MQTT messages. Default is "msh".
   * This is useful if you want to use a single MQTT server for multiple meshtastic networks and separate them via ACLs
   *
   * @generated from field: string root = 8;
   */
  root: string;
  /**
   *
   * If true, we can use the connected phone / client to proxy messages to MQTT instead of a direct connection
   *
   * @generated from field: bool proxy_to_client_enabled = 9;
   */
  proxyToClientEnabled: boolean;
  /**
   *
   * If true, we will periodically report unencrypted information about our node to a map via MQTT
   *
   * @generated from field: bool map_reporting_enabled = 10;
   */
  mapReportingEnabled: boolean;
  /**
   *
   * Settings for reporting information about our node to a map via MQTT
   *
   * @generated from field: meshtastic.ModuleConfig.MapReportSettings map_report_settings = 11;
   */
  mapReportSettings?: ModuleConfig_MapReportSettings;
};
/**
 * Describes the message meshtastic.ModuleConfig.MQTTConfig.
 * Use `create(ModuleConfig_MQTTConfigSchema)` to create a new message.
 */
declare const ModuleConfig_MQTTConfigSchema: GenMessage<ModuleConfig_MQTTConfig>;
/**
 *
 * Settings for reporting unencrypted information about our node to a map via MQTT
 *
 * @generated from message meshtastic.ModuleConfig.MapReportSettings
 */
type ModuleConfig_MapReportSettings = Message<"meshtastic.ModuleConfig.MapReportSettings"> & {
  /**
   *
   * How often we should report our info to the map (in seconds)
   *
   * @generated from field: uint32 publish_interval_secs = 1;
   */
  publishIntervalSecs: number;
  /**
   *
   * Bits of precision for the location sent (default of 32 is full precision).
   *
   * @generated from field: uint32 position_precision = 2;
   */
  positionPrecision: number;
  /**
   *
   * Whether we have opted-in to report our location to the map
   *
   * @generated from field: bool should_report_location = 3;
   */
  shouldReportLocation: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.MapReportSettings.
 * Use `create(ModuleConfig_MapReportSettingsSchema)` to create a new message.
 */
declare const ModuleConfig_MapReportSettingsSchema: GenMessage<ModuleConfig_MapReportSettings>;
/**
 *
 * RemoteHardwareModule Config
 *
 * @generated from message meshtastic.ModuleConfig.RemoteHardwareConfig
 */
type ModuleConfig_RemoteHardwareConfig = Message<"meshtastic.ModuleConfig.RemoteHardwareConfig"> & {
  /**
   *
   * Whether the Module is enabled
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * Whether the Module allows consumers to read / write to pins not defined in available_pins
   *
   * @generated from field: bool allow_undefined_pin_access = 2;
   */
  allowUndefinedPinAccess: boolean;
  /**
   *
   * Exposes the available pins to the mesh for reading and writing
   *
   * @generated from field: repeated meshtastic.RemoteHardwarePin available_pins = 3;
   */
  availablePins: RemoteHardwarePin[];
};
/**
 * Describes the message meshtastic.ModuleConfig.RemoteHardwareConfig.
 * Use `create(ModuleConfig_RemoteHardwareConfigSchema)` to create a new message.
 */
declare const ModuleConfig_RemoteHardwareConfigSchema: GenMessage<ModuleConfig_RemoteHardwareConfig>;
/**
 *
 * NeighborInfoModule Config
 *
 * @generated from message meshtastic.ModuleConfig.NeighborInfoConfig
 */
type ModuleConfig_NeighborInfoConfig = Message<"meshtastic.ModuleConfig.NeighborInfoConfig"> & {
  /**
   *
   * Whether the Module is enabled
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * Interval in seconds of how often we should try to send our
   * Neighbor Info (minimum is 14400, i.e., 4 hours)
   *
   * @generated from field: uint32 update_interval = 2;
   */
  updateInterval: number;
  /**
   *
   * Whether in addition to sending it to MQTT and the PhoneAPI, our NeighborInfo should be transmitted over LoRa.
   * Note that this is not available on a channel with default key and name.
   *
   * @generated from field: bool transmit_over_lora = 3;
   */
  transmitOverLora: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.NeighborInfoConfig.
 * Use `create(ModuleConfig_NeighborInfoConfigSchema)` to create a new message.
 */
declare const ModuleConfig_NeighborInfoConfigSchema: GenMessage<ModuleConfig_NeighborInfoConfig>;
/**
 *
 * Detection Sensor Module Config
 *
 * @generated from message meshtastic.ModuleConfig.DetectionSensorConfig
 */
type ModuleConfig_DetectionSensorConfig = Message<"meshtastic.ModuleConfig.DetectionSensorConfig"> & {
  /**
   *
   * Whether the Module is enabled
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * Interval in seconds of how often we can send a message to the mesh when a
   * trigger event is detected
   *
   * @generated from field: uint32 minimum_broadcast_secs = 2;
   */
  minimumBroadcastSecs: number;
  /**
   *
   * Interval in seconds of how often we should send a message to the mesh
   * with the current state regardless of trigger events When set to 0, only
   * trigger events will be broadcasted Works as a sort of status heartbeat
   * for peace of mind
   *
   * @generated from field: uint32 state_broadcast_secs = 3;
   */
  stateBroadcastSecs: number;
  /**
   *
   * Send ASCII bell with alert message
   * Useful for triggering ext. notification on bell
   *
   * @generated from field: bool send_bell = 4;
   */
  sendBell: boolean;
  /**
   *
   * Friendly name used to format message sent to mesh
   * Example: A name "Motion" would result in a message "Motion detected"
   * Maximum length of 20 characters
   *
   * @generated from field: string name = 5;
   */
  name: string;
  /**
   *
   * GPIO pin to monitor for state changes
   *
   * @generated from field: uint32 monitor_pin = 6;
   */
  monitorPin: number;
  /**
   *
   * The type of trigger event to be used
   *
   * @generated from field: meshtastic.ModuleConfig.DetectionSensorConfig.TriggerType detection_trigger_type = 7;
   */
  detectionTriggerType: ModuleConfig_DetectionSensorConfig_TriggerType;
  /**
   *
   * Whether or not use INPUT_PULLUP mode for GPIO pin
   * Only applicable if the board uses pull-up resistors on the pin
   *
   * @generated from field: bool use_pullup = 8;
   */
  usePullup: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.DetectionSensorConfig.
 * Use `create(ModuleConfig_DetectionSensorConfigSchema)` to create a new message.
 */
declare const ModuleConfig_DetectionSensorConfigSchema: GenMessage<ModuleConfig_DetectionSensorConfig>;
/**
 * @generated from enum meshtastic.ModuleConfig.DetectionSensorConfig.TriggerType
 */
declare enum ModuleConfig_DetectionSensorConfig_TriggerType {
  /**
   * Event is triggered if pin is low
   *
   * @generated from enum value: LOGIC_LOW = 0;
   */
  LOGIC_LOW = 0,
  /**
   * Event is triggered if pin is high
   *
   * @generated from enum value: LOGIC_HIGH = 1;
   */
  LOGIC_HIGH = 1,
  /**
   * Event is triggered when pin goes high to low
   *
   * @generated from enum value: FALLING_EDGE = 2;
   */
  FALLING_EDGE = 2,
  /**
   * Event is triggered when pin goes low to high
   *
   * @generated from enum value: RISING_EDGE = 3;
   */
  RISING_EDGE = 3,
  /**
   * Event is triggered on every pin state change, low is considered to be
   * "active"
   *
   * @generated from enum value: EITHER_EDGE_ACTIVE_LOW = 4;
   */
  EITHER_EDGE_ACTIVE_LOW = 4,
  /**
   * Event is triggered on every pin state change, high is considered to be
   * "active"
   *
   * @generated from enum value: EITHER_EDGE_ACTIVE_HIGH = 5;
   */
  EITHER_EDGE_ACTIVE_HIGH = 5,
}
/**
 * Describes the enum meshtastic.ModuleConfig.DetectionSensorConfig.TriggerType.
 */
declare const ModuleConfig_DetectionSensorConfig_TriggerTypeSchema: GenEnum<ModuleConfig_DetectionSensorConfig_TriggerType>;
/**
 *
 * Audio Config for codec2 voice
 *
 * @generated from message meshtastic.ModuleConfig.AudioConfig
 */
type ModuleConfig_AudioConfig = Message<"meshtastic.ModuleConfig.AudioConfig"> & {
  /**
   *
   * Whether Audio is enabled
   *
   * @generated from field: bool codec2_enabled = 1;
   */
  codec2Enabled: boolean;
  /**
   *
   * PTT Pin
   *
   * @generated from field: uint32 ptt_pin = 2;
   */
  pttPin: number;
  /**
   *
   * The audio sample rate to use for codec2
   *
   * @generated from field: meshtastic.ModuleConfig.AudioConfig.Audio_Baud bitrate = 3;
   */
  bitrate: ModuleConfig_AudioConfig_Audio_Baud;
  /**
   *
   * I2S Word Select
   *
   * @generated from field: uint32 i2s_ws = 4;
   */
  i2sWs: number;
  /**
   *
   * I2S Data IN
   *
   * @generated from field: uint32 i2s_sd = 5;
   */
  i2sSd: number;
  /**
   *
   * I2S Data OUT
   *
   * @generated from field: uint32 i2s_din = 6;
   */
  i2sDin: number;
  /**
   *
   * I2S Clock
   *
   * @generated from field: uint32 i2s_sck = 7;
   */
  i2sSck: number;
};
/**
 * Describes the message meshtastic.ModuleConfig.AudioConfig.
 * Use `create(ModuleConfig_AudioConfigSchema)` to create a new message.
 */
declare const ModuleConfig_AudioConfigSchema: GenMessage<ModuleConfig_AudioConfig>;
/**
 *
 * Baudrate for codec2 voice
 *
 * @generated from enum meshtastic.ModuleConfig.AudioConfig.Audio_Baud
 */
declare enum ModuleConfig_AudioConfig_Audio_Baud {
  /**
   * @generated from enum value: CODEC2_DEFAULT = 0;
   */
  CODEC2_DEFAULT = 0,
  /**
   * @generated from enum value: CODEC2_3200 = 1;
   */
  CODEC2_3200 = 1,
  /**
   * @generated from enum value: CODEC2_2400 = 2;
   */
  CODEC2_2400 = 2,
  /**
   * @generated from enum value: CODEC2_1600 = 3;
   */
  CODEC2_1600 = 3,
  /**
   * @generated from enum value: CODEC2_1400 = 4;
   */
  CODEC2_1400 = 4,
  /**
   * @generated from enum value: CODEC2_1300 = 5;
   */
  CODEC2_1300 = 5,
  /**
   * @generated from enum value: CODEC2_1200 = 6;
   */
  CODEC2_1200 = 6,
  /**
   * @generated from enum value: CODEC2_700 = 7;
   */
  CODEC2_700 = 7,
  /**
   * @generated from enum value: CODEC2_700B = 8;
   */
  CODEC2_700B = 8,
}
/**
 * Describes the enum meshtastic.ModuleConfig.AudioConfig.Audio_Baud.
 */
declare const ModuleConfig_AudioConfig_Audio_BaudSchema: GenEnum<ModuleConfig_AudioConfig_Audio_Baud>;
/**
 *
 * Config for the Paxcounter Module
 *
 * @generated from message meshtastic.ModuleConfig.PaxcounterConfig
 */
type ModuleConfig_PaxcounterConfig = Message<"meshtastic.ModuleConfig.PaxcounterConfig"> & {
  /**
   *
   * Enable the Paxcounter Module
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   * @generated from field: uint32 paxcounter_update_interval = 2;
   */
  paxcounterUpdateInterval: number;
  /**
   *
   * WiFi RSSI threshold. Defaults to -80
   *
   * @generated from field: int32 wifi_threshold = 3;
   */
  wifiThreshold: number;
  /**
   *
   * BLE RSSI threshold. Defaults to -80
   *
   * @generated from field: int32 ble_threshold = 4;
   */
  bleThreshold: number;
};
/**
 * Describes the message meshtastic.ModuleConfig.PaxcounterConfig.
 * Use `create(ModuleConfig_PaxcounterConfigSchema)` to create a new message.
 */
declare const ModuleConfig_PaxcounterConfigSchema: GenMessage<ModuleConfig_PaxcounterConfig>;
/**
 *
 * Serial Config
 *
 * @generated from message meshtastic.ModuleConfig.SerialConfig
 */
type ModuleConfig_SerialConfig = Message<"meshtastic.ModuleConfig.SerialConfig"> & {
  /**
   *
   * Preferences for the SerialModule
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: bool echo = 2;
   */
  echo: boolean;
  /**
   *
   * RX pin (should match Arduino gpio pin number)
   *
   * @generated from field: uint32 rxd = 3;
   */
  rxd: number;
  /**
   *
   * TX pin (should match Arduino gpio pin number)
   *
   * @generated from field: uint32 txd = 4;
   */
  txd: number;
  /**
   *
   * Serial baud rate
   *
   * @generated from field: meshtastic.ModuleConfig.SerialConfig.Serial_Baud baud = 5;
   */
  baud: ModuleConfig_SerialConfig_Serial_Baud;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: uint32 timeout = 6;
   */
  timeout: number;
  /**
   *
   * Mode for serial module operation
   *
   * @generated from field: meshtastic.ModuleConfig.SerialConfig.Serial_Mode mode = 7;
   */
  mode: ModuleConfig_SerialConfig_Serial_Mode;
  /**
   *
   * Overrides the platform's defacto Serial port instance to use with Serial module config settings
   * This is currently only usable in output modes like NMEA / CalTopo and may behave strangely or not work at all in other modes
   * Existing logging over the Serial Console will still be present
   *
   * @generated from field: bool override_console_serial_port = 8;
   */
  overrideConsoleSerialPort: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.SerialConfig.
 * Use `create(ModuleConfig_SerialConfigSchema)` to create a new message.
 */
declare const ModuleConfig_SerialConfigSchema: GenMessage<ModuleConfig_SerialConfig>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from enum meshtastic.ModuleConfig.SerialConfig.Serial_Baud
 */
declare enum ModuleConfig_SerialConfig_Serial_Baud {
  /**
   * @generated from enum value: BAUD_DEFAULT = 0;
   */
  BAUD_DEFAULT = 0,
  /**
   * @generated from enum value: BAUD_110 = 1;
   */
  BAUD_110 = 1,
  /**
   * @generated from enum value: BAUD_300 = 2;
   */
  BAUD_300 = 2,
  /**
   * @generated from enum value: BAUD_600 = 3;
   */
  BAUD_600 = 3,
  /**
   * @generated from enum value: BAUD_1200 = 4;
   */
  BAUD_1200 = 4,
  /**
   * @generated from enum value: BAUD_2400 = 5;
   */
  BAUD_2400 = 5,
  /**
   * @generated from enum value: BAUD_4800 = 6;
   */
  BAUD_4800 = 6,
  /**
   * @generated from enum value: BAUD_9600 = 7;
   */
  BAUD_9600 = 7,
  /**
   * @generated from enum value: BAUD_19200 = 8;
   */
  BAUD_19200 = 8,
  /**
   * @generated from enum value: BAUD_38400 = 9;
   */
  BAUD_38400 = 9,
  /**
   * @generated from enum value: BAUD_57600 = 10;
   */
  BAUD_57600 = 10,
  /**
   * @generated from enum value: BAUD_115200 = 11;
   */
  BAUD_115200 = 11,
  /**
   * @generated from enum value: BAUD_230400 = 12;
   */
  BAUD_230400 = 12,
  /**
   * @generated from enum value: BAUD_460800 = 13;
   */
  BAUD_460800 = 13,
  /**
   * @generated from enum value: BAUD_576000 = 14;
   */
  BAUD_576000 = 14,
  /**
   * @generated from enum value: BAUD_921600 = 15;
   */
  BAUD_921600 = 15,
}
/**
 * Describes the enum meshtastic.ModuleConfig.SerialConfig.Serial_Baud.
 */
declare const ModuleConfig_SerialConfig_Serial_BaudSchema: GenEnum<ModuleConfig_SerialConfig_Serial_Baud>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from enum meshtastic.ModuleConfig.SerialConfig.Serial_Mode
 */
declare enum ModuleConfig_SerialConfig_Serial_Mode {
  /**
   * @generated from enum value: DEFAULT = 0;
   */
  DEFAULT = 0,
  /**
   * @generated from enum value: SIMPLE = 1;
   */
  SIMPLE = 1,
  /**
   * @generated from enum value: PROTO = 2;
   */
  PROTO = 2,
  /**
   * @generated from enum value: TEXTMSG = 3;
   */
  TEXTMSG = 3,
  /**
   * @generated from enum value: NMEA = 4;
   */
  NMEA = 4,
  /**
   * NMEA messages specifically tailored for CalTopo
   *
   * @generated from enum value: CALTOPO = 5;
   */
  CALTOPO = 5,
  /**
   * Ecowitt WS85 weather station
   *
   * @generated from enum value: WS85 = 6;
   */
  WS85 = 6,
  /**
   * VE.Direct is a serial protocol used by Victron Energy products
   * https://beta.ivc.no/wiki/index.php/Victron_VE_Direct_DIY_Cable
   *
   * @generated from enum value: VE_DIRECT = 7;
   */
  VE_DIRECT = 7,
  /**
   * Used to configure and view some parameters of MeshSolar.
   * https://heltec.org/project/meshsolar/
   *
   * @generated from enum value: MS_CONFIG = 8;
   */
  MS_CONFIG = 8,
}
/**
 * Describes the enum meshtastic.ModuleConfig.SerialConfig.Serial_Mode.
 */
declare const ModuleConfig_SerialConfig_Serial_ModeSchema: GenEnum<ModuleConfig_SerialConfig_Serial_Mode>;
/**
 *
 * External Notifications Config
 *
 * @generated from message meshtastic.ModuleConfig.ExternalNotificationConfig
 */
type ModuleConfig_ExternalNotificationConfig = Message<"meshtastic.ModuleConfig.ExternalNotificationConfig"> & {
  /**
   *
   * Enable the ExternalNotificationModule
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * When using in On/Off mode, keep the output on for this many
   * milliseconds. Default 1000ms (1 second).
   *
   * @generated from field: uint32 output_ms = 2;
   */
  outputMs: number;
  /**
   *
   * Define the output pin GPIO setting Defaults to
   * EXT_NOTIFY_OUT if set for the board.
   * In standalone devices this pin should drive the LED to match the UI.
   *
   * @generated from field: uint32 output = 3;
   */
  output: number;
  /**
   *
   * Optional: Define a secondary output pin for a vibra motor
   * This is used in standalone devices to match the UI.
   *
   * @generated from field: uint32 output_vibra = 8;
   */
  outputVibra: number;
  /**
   *
   * Optional: Define a tertiary output pin for an active buzzer
   * This is used in standalone devices to to match the UI.
   *
   * @generated from field: uint32 output_buzzer = 9;
   */
  outputBuzzer: number;
  /**
   *
   * IF this is true, the 'output' Pin will be pulled active high, false
   * means active low.
   *
   * @generated from field: bool active = 4;
   */
  active: boolean;
  /**
   *
   * True: Alert when a text message arrives (output)
   *
   * @generated from field: bool alert_message = 5;
   */
  alertMessage: boolean;
  /**
   *
   * True: Alert when a text message arrives (output_vibra)
   *
   * @generated from field: bool alert_message_vibra = 10;
   */
  alertMessageVibra: boolean;
  /**
   *
   * True: Alert when a text message arrives (output_buzzer)
   *
   * @generated from field: bool alert_message_buzzer = 11;
   */
  alertMessageBuzzer: boolean;
  /**
   *
   * True: Alert when the bell character is received (output)
   *
   * @generated from field: bool alert_bell = 6;
   */
  alertBell: boolean;
  /**
   *
   * True: Alert when the bell character is received (output_vibra)
   *
   * @generated from field: bool alert_bell_vibra = 12;
   */
  alertBellVibra: boolean;
  /**
   *
   * True: Alert when the bell character is received (output_buzzer)
   *
   * @generated from field: bool alert_bell_buzzer = 13;
   */
  alertBellBuzzer: boolean;
  /**
   *
   * use a PWM output instead of a simple on/off output. This will ignore
   * the 'output', 'output_ms' and 'active' settings and use the
   * device.buzzer_gpio instead.
   *
   * @generated from field: bool use_pwm = 7;
   */
  usePwm: boolean;
  /**
   *
   * The notification will toggle with 'output_ms' for this time of seconds.
   * Default is 0 which means don't repeat at all. 60 would mean blink
   * and/or beep for 60 seconds
   *
   * @generated from field: uint32 nag_timeout = 14;
   */
  nagTimeout: number;
  /**
   *
   * When true, enables devices with native I2S audio output to use the RTTTL over speaker like a buzzer
   * T-Watch S3 and T-Deck for example have this capability
   *
   * @generated from field: bool use_i2s_as_buzzer = 15;
   */
  useI2sAsBuzzer: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.ExternalNotificationConfig.
 * Use `create(ModuleConfig_ExternalNotificationConfigSchema)` to create a new message.
 */
declare const ModuleConfig_ExternalNotificationConfigSchema: GenMessage<ModuleConfig_ExternalNotificationConfig>;
/**
 *
 * Store and Forward Module Config
 *
 * @generated from message meshtastic.ModuleConfig.StoreForwardConfig
 */
type ModuleConfig_StoreForwardConfig = Message<"meshtastic.ModuleConfig.StoreForwardConfig"> & {
  /**
   *
   * Enable the Store and Forward Module
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: bool heartbeat = 2;
   */
  heartbeat: boolean;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: uint32 records = 3;
   */
  records: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: uint32 history_return_max = 4;
   */
  historyReturnMax: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: uint32 history_return_window = 5;
   */
  historyReturnWindow: number;
  /**
   *
   * Set to true to let this node act as a server that stores received messages and resends them upon request.
   *
   * @generated from field: bool is_server = 6;
   */
  isServer: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.StoreForwardConfig.
 * Use `create(ModuleConfig_StoreForwardConfigSchema)` to create a new message.
 */
declare const ModuleConfig_StoreForwardConfigSchema: GenMessage<ModuleConfig_StoreForwardConfig>;
/**
 *
 * Preferences for the RangeTestModule
 *
 * @generated from message meshtastic.ModuleConfig.RangeTestConfig
 */
type ModuleConfig_RangeTestConfig = Message<"meshtastic.ModuleConfig.RangeTestConfig"> & {
  /**
   *
   * Enable the Range Test Module
   *
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;
  /**
   *
   * Send out range test messages from this node
   *
   * @generated from field: uint32 sender = 2;
   */
  sender: number;
  /**
   *
   * Bool value indicating that this node should save a RangeTest.csv file.
   * ESP32 Only
   *
   * @generated from field: bool save = 3;
   */
  save: boolean;
  /**
   *
   * Bool indicating that the node should cleanup / destroy it's RangeTest.csv file.
   * ESP32 Only
   *
   * @generated from field: bool clear_on_reboot = 4;
   */
  clearOnReboot: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.RangeTestConfig.
 * Use `create(ModuleConfig_RangeTestConfigSchema)` to create a new message.
 */
declare const ModuleConfig_RangeTestConfigSchema: GenMessage<ModuleConfig_RangeTestConfig>;
/**
 *
 * Configuration for both device and environment metrics
 *
 * @generated from message meshtastic.ModuleConfig.TelemetryConfig
 */
type ModuleConfig_TelemetryConfig = Message<"meshtastic.ModuleConfig.TelemetryConfig"> & {
  /**
   *
   * Interval in seconds of how often we should try to send our
   * device metrics to the mesh
   *
   * @generated from field: uint32 device_update_interval = 1;
   */
  deviceUpdateInterval: number;
  /**
   * @generated from field: uint32 environment_update_interval = 2;
   */
  environmentUpdateInterval: number;
  /**
   *
   * Preferences for the Telemetry Module (Environment)
   * Enable/Disable the telemetry measurement module measurement collection
   *
   * @generated from field: bool environment_measurement_enabled = 3;
   */
  environmentMeasurementEnabled: boolean;
  /**
   *
   * Enable/Disable the telemetry measurement module on-device display
   *
   * @generated from field: bool environment_screen_enabled = 4;
   */
  environmentScreenEnabled: boolean;
  /**
   *
   * We'll always read the sensor in Celsius, but sometimes we might want to
   * display the results in Fahrenheit as a "user preference".
   *
   * @generated from field: bool environment_display_fahrenheit = 5;
   */
  environmentDisplayFahrenheit: boolean;
  /**
   *
   * Enable/Disable the air quality metrics
   *
   * @generated from field: bool air_quality_enabled = 6;
   */
  airQualityEnabled: boolean;
  /**
   *
   * Interval in seconds of how often we should try to send our
   * air quality metrics to the mesh
   *
   * @generated from field: uint32 air_quality_interval = 7;
   */
  airQualityInterval: number;
  /**
   *
   * Enable/disable Power metrics
   *
   * @generated from field: bool power_measurement_enabled = 8;
   */
  powerMeasurementEnabled: boolean;
  /**
   *
   * Interval in seconds of how often we should try to send our
   * power metrics to the mesh
   *
   * @generated from field: uint32 power_update_interval = 9;
   */
  powerUpdateInterval: number;
  /**
   *
   * Enable/Disable the power measurement module on-device display
   *
   * @generated from field: bool power_screen_enabled = 10;
   */
  powerScreenEnabled: boolean;
  /**
   *
   * Preferences for the (Health) Telemetry Module
   * Enable/Disable the telemetry measurement module measurement collection
   *
   * @generated from field: bool health_measurement_enabled = 11;
   */
  healthMeasurementEnabled: boolean;
  /**
   *
   * Interval in seconds of how often we should try to send our
   * health metrics to the mesh
   *
   * @generated from field: uint32 health_update_interval = 12;
   */
  healthUpdateInterval: number;
  /**
   *
   * Enable/Disable the health telemetry module on-device display
   *
   * @generated from field: bool health_screen_enabled = 13;
   */
  healthScreenEnabled: boolean;
  /**
   *
   * Enable/Disable the device telemetry module to send metrics to the mesh
   * Note: We will still send telemtry to the connected phone / client every minute over the API
   *
   * @generated from field: bool device_telemetry_enabled = 14;
   */
  deviceTelemetryEnabled: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.TelemetryConfig.
 * Use `create(ModuleConfig_TelemetryConfigSchema)` to create a new message.
 */
declare const ModuleConfig_TelemetryConfigSchema: GenMessage<ModuleConfig_TelemetryConfig>;
/**
 *
 * Canned Messages Module Config
 *
 * @generated from message meshtastic.ModuleConfig.CannedMessageConfig
 */
type ModuleConfig_CannedMessageConfig = Message<"meshtastic.ModuleConfig.CannedMessageConfig"> & {
  /**
   *
   * Enable the rotary encoder #1. This is a 'dumb' encoder sending pulses on both A and B pins while rotating.
   *
   * @generated from field: bool rotary1_enabled = 1;
   */
  rotary1Enabled: boolean;
  /**
   *
   * GPIO pin for rotary encoder A port.
   *
   * @generated from field: uint32 inputbroker_pin_a = 2;
   */
  inputbrokerPinA: number;
  /**
   *
   * GPIO pin for rotary encoder B port.
   *
   * @generated from field: uint32 inputbroker_pin_b = 3;
   */
  inputbrokerPinB: number;
  /**
   *
   * GPIO pin for rotary encoder Press port.
   *
   * @generated from field: uint32 inputbroker_pin_press = 4;
   */
  inputbrokerPinPress: number;
  /**
   *
   * Generate input event on CW of this kind.
   *
   * @generated from field: meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar inputbroker_event_cw = 5;
   */
  inputbrokerEventCw: ModuleConfig_CannedMessageConfig_InputEventChar;
  /**
   *
   * Generate input event on CCW of this kind.
   *
   * @generated from field: meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar inputbroker_event_ccw = 6;
   */
  inputbrokerEventCcw: ModuleConfig_CannedMessageConfig_InputEventChar;
  /**
   *
   * Generate input event on Press of this kind.
   *
   * @generated from field: meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar inputbroker_event_press = 7;
   */
  inputbrokerEventPress: ModuleConfig_CannedMessageConfig_InputEventChar;
  /**
   *
   * Enable the Up/Down/Select input device. Can be RAK rotary encoder or 3 buttons. Uses the a/b/press definitions from inputbroker.
   *
   * @generated from field: bool updown1_enabled = 8;
   */
  updown1Enabled: boolean;
  /**
   *
   * Enable/disable CannedMessageModule.
   *
   * @generated from field: bool enabled = 9 [deprecated = true];
   * @deprecated
   */
  enabled: boolean;
  /**
   *
   * Input event origin accepted by the canned message module.
   * Can be e.g. "rotEnc1", "upDownEnc1", "scanAndSelect", "cardkb", "serialkb", or keyword "_any"
   *
   * @generated from field: string allow_input_source = 10 [deprecated = true];
   * @deprecated
   */
  allowInputSource: string;
  /**
   *
   * CannedMessageModule also sends a bell character with the messages.
   * ExternalNotificationModule can benefit from this feature.
   *
   * @generated from field: bool send_bell = 11;
   */
  sendBell: boolean;
};
/**
 * Describes the message meshtastic.ModuleConfig.CannedMessageConfig.
 * Use `create(ModuleConfig_CannedMessageConfigSchema)` to create a new message.
 */
declare const ModuleConfig_CannedMessageConfigSchema: GenMessage<ModuleConfig_CannedMessageConfig>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from enum meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar
 */
declare enum ModuleConfig_CannedMessageConfig_InputEventChar {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: NONE = 0;
   */
  NONE = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: UP = 17;
   */
  UP = 17,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: DOWN = 18;
   */
  DOWN = 18,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: LEFT = 19;
   */
  LEFT = 19,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: RIGHT = 20;
   */
  RIGHT = 20,
  /**
   *
   * '\n'
   *
   * @generated from enum value: SELECT = 10;
   */
  SELECT = 10,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: BACK = 27;
   */
  BACK = 27,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: CANCEL = 24;
   */
  CANCEL = 24,
}
/**
 * Describes the enum meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar.
 */
declare const ModuleConfig_CannedMessageConfig_InputEventCharSchema: GenEnum<ModuleConfig_CannedMessageConfig_InputEventChar>;
/**
 *
 * Ambient Lighting Module - Settings for control of onboard LEDs to allow users to adjust the brightness levels and respective color levels.
 * Initially created for the RAK14001 RGB LED module.
 *
 * @generated from message meshtastic.ModuleConfig.AmbientLightingConfig
 */
type ModuleConfig_AmbientLightingConfig = Message<"meshtastic.ModuleConfig.AmbientLightingConfig"> & {
  /**
   *
   * Sets LED to on or off.
   *
   * @generated from field: bool led_state = 1;
   */
  ledState: boolean;
  /**
   *
   * Sets the current for the LED output. Default is 10.
   *
   * @generated from field: uint32 current = 2;
   */
  current: number;
  /**
   *
   * Sets the red LED level. Values are 0-255.
   *
   * @generated from field: uint32 red = 3;
   */
  red: number;
  /**
   *
   * Sets the green LED level. Values are 0-255.
   *
   * @generated from field: uint32 green = 4;
   */
  green: number;
  /**
   *
   * Sets the blue LED level. Values are 0-255.
   *
   * @generated from field: uint32 blue = 5;
   */
  blue: number;
};
/**
 * Describes the message meshtastic.ModuleConfig.AmbientLightingConfig.
 * Use `create(ModuleConfig_AmbientLightingConfigSchema)` to create a new message.
 */
declare const ModuleConfig_AmbientLightingConfigSchema: GenMessage<ModuleConfig_AmbientLightingConfig>;
/**
 *
 * A GPIO pin definition for remote hardware module
 *
 * @generated from message meshtastic.RemoteHardwarePin
 */
type RemoteHardwarePin = Message<"meshtastic.RemoteHardwarePin"> & {
  /**
   *
   * GPIO Pin number (must match Arduino)
   *
   * @generated from field: uint32 gpio_pin = 1;
   */
  gpioPin: number;
  /**
   *
   * Name for the GPIO pin (i.e. Front gate, mailbox, etc)
   *
   * @generated from field: string name = 2;
   */
  name: string;
  /**
   *
   * Type of GPIO access available to consumers on the mesh
   *
   * @generated from field: meshtastic.RemoteHardwarePinType type = 3;
   */
  type: RemoteHardwarePinType;
};
/**
 * Describes the message meshtastic.RemoteHardwarePin.
 * Use `create(RemoteHardwarePinSchema)` to create a new message.
 */
declare const RemoteHardwarePinSchema: GenMessage<RemoteHardwarePin>;
/**
 * @generated from enum meshtastic.RemoteHardwarePinType
 */
declare enum RemoteHardwarePinType {
  /**
   *
   * Unset/unused
   *
   * @generated from enum value: UNKNOWN = 0;
   */
  UNKNOWN = 0,
  /**
   *
   * GPIO pin can be read (if it is high / low)
   *
   * @generated from enum value: DIGITAL_READ = 1;
   */
  DIGITAL_READ = 1,
  /**
   *
   * GPIO pin can be written to (high / low)
   *
   * @generated from enum value: DIGITAL_WRITE = 2;
   */
  DIGITAL_WRITE = 2,
}
/**
 * Describes the enum meshtastic.RemoteHardwarePinType.
 */
declare const RemoteHardwarePinTypeSchema: GenEnum<RemoteHardwarePinType>;
declare namespace portnums_pb_d_exports {
  export { PortNum, PortNumSchema, file_meshtastic_portnums };
}
/**
 * Describes the file meshtastic/portnums.proto.
 */
declare const file_meshtastic_portnums: GenFile;
/**
 *
 * For any new 'apps' that run on the device or via sister apps on phones/PCs they should pick and use a
 * unique 'portnum' for their application.
 * If you are making a new app using meshtastic, please send in a pull request to add your 'portnum' to this
 * master table.
 * PortNums should be assigned in the following range:
 * 0-63   Core Meshtastic use, do not use for third party apps
 * 64-127 Registered 3rd party apps, send in a pull request that adds a new entry to portnums.proto to  register your application
 * 256-511 Use one of these portnums for your private applications that you don't want to register publically
 * All other values are reserved.
 * Note: This was formerly a Type enum named 'typ' with the same id #
 * We have change to this 'portnum' based scheme for specifying app handlers for particular payloads.
 * This change is backwards compatible by treating the legacy OPAQUE/CLEAR_TEXT values identically.
 *
 * @generated from enum meshtastic.PortNum
 */
declare enum PortNum {
  /**
   *
   * Deprecated: do not use in new code (formerly called OPAQUE)
   * A message sent from a device outside of the mesh, in a form the mesh does not understand
   * NOTE: This must be 0, because it is documented in IMeshService.aidl to be so
   * ENCODING: binary undefined
   *
   * @generated from enum value: UNKNOWN_APP = 0;
   */
  UNKNOWN_APP = 0,
  /**
   *
   * A simple UTF-8 text message, which even the little micros in the mesh
   * can understand and show on their screen eventually in some circumstances
   * even signal might send messages in this form (see below)
   * ENCODING: UTF-8 Plaintext (?)
   *
   * @generated from enum value: TEXT_MESSAGE_APP = 1;
   */
  TEXT_MESSAGE_APP = 1,
  /**
   *
   * Reserved for built-in GPIO/example app.
   * See remote_hardware.proto/HardwareMessage for details on the message sent/received to this port number
   * ENCODING: Protobuf
   *
   * @generated from enum value: REMOTE_HARDWARE_APP = 2;
   */
  REMOTE_HARDWARE_APP = 2,
  /**
   *
   * The built-in position messaging app.
   * Payload is a Position message.
   * ENCODING: Protobuf
   *
   * @generated from enum value: POSITION_APP = 3;
   */
  POSITION_APP = 3,
  /**
   *
   * The built-in user info app.
   * Payload is a User message.
   * ENCODING: Protobuf
   *
   * @generated from enum value: NODEINFO_APP = 4;
   */
  NODEINFO_APP = 4,
  /**
   *
   * Protocol control packets for mesh protocol use.
   * Payload is a Routing message.
   * ENCODING: Protobuf
   *
   * @generated from enum value: ROUTING_APP = 5;
   */
  ROUTING_APP = 5,
  /**
   *
   * Admin control packets.
   * Payload is a AdminMessage message.
   * ENCODING: Protobuf
   *
   * @generated from enum value: ADMIN_APP = 6;
   */
  ADMIN_APP = 6,
  /**
   *
   * Compressed TEXT_MESSAGE payloads.
   * ENCODING: UTF-8 Plaintext (?) with Unishox2 Compression
   * NOTE: The Device Firmware converts a TEXT_MESSAGE_APP to TEXT_MESSAGE_COMPRESSED_APP if the compressed
   * payload is shorter. There's no need for app developers to do this themselves. Also the firmware will decompress
   * any incoming TEXT_MESSAGE_COMPRESSED_APP payload and convert to TEXT_MESSAGE_APP.
   *
   * @generated from enum value: TEXT_MESSAGE_COMPRESSED_APP = 7;
   */
  TEXT_MESSAGE_COMPRESSED_APP = 7,
  /**
   *
   * Waypoint payloads.
   * Payload is a Waypoint message.
   * ENCODING: Protobuf
   *
   * @generated from enum value: WAYPOINT_APP = 8;
   */
  WAYPOINT_APP = 8,
  /**
   *
   * Audio Payloads.
   * Encapsulated codec2 packets. On 2.4 GHZ Bandwidths only for now
   * ENCODING: codec2 audio frames
   * NOTE: audio frames contain a 3 byte header (0xc0 0xde 0xc2) and a one byte marker for the decompressed bitrate.
   * This marker comes from the 'moduleConfig.audio.bitrate' enum minus one.
   *
   * @generated from enum value: AUDIO_APP = 9;
   */
  AUDIO_APP = 9,
  /**
   *
   * Same as Text Message but originating from Detection Sensor Module.
   * NOTE: This portnum traffic is not sent to the public MQTT starting at firmware version 2.2.9
   *
   * @generated from enum value: DETECTION_SENSOR_APP = 10;
   */
  DETECTION_SENSOR_APP = 10,
  /**
   *
   * Same as Text Message but used for critical alerts.
   *
   * @generated from enum value: ALERT_APP = 11;
   */
  ALERT_APP = 11,
  /**
   *
   * Module/port for handling key verification requests.
   *
   * @generated from enum value: KEY_VERIFICATION_APP = 12;
   */
  KEY_VERIFICATION_APP = 12,
  /**
   *
   * Provides a 'ping' service that replies to any packet it receives.
   * Also serves as a small example module.
   * ENCODING: ASCII Plaintext
   *
   * @generated from enum value: REPLY_APP = 32;
   */
  REPLY_APP = 32,
  /**
   *
   * Used for the python IP tunnel feature
   * ENCODING: IP Packet. Handled by the python API, firmware ignores this one and pases on.
   *
   * @generated from enum value: IP_TUNNEL_APP = 33;
   */
  IP_TUNNEL_APP = 33,
  /**
   *
   * Paxcounter lib included in the firmware
   * ENCODING: protobuf
   *
   * @generated from enum value: PAXCOUNTER_APP = 34;
   */
  PAXCOUNTER_APP = 34,
  /**
   *
   * Provides a hardware serial interface to send and receive from the Meshtastic network.
   * Connect to the RX/TX pins of a device with 38400 8N1. Packets received from the Meshtastic
   * network is forwarded to the RX pin while sending a packet to TX will go out to the Mesh network.
   * Maximum packet size of 240 bytes.
   * Module is disabled by default can be turned on by setting SERIAL_MODULE_ENABLED = 1 in SerialPlugh.cpp.
   * ENCODING: binary undefined
   *
   * @generated from enum value: SERIAL_APP = 64;
   */
  SERIAL_APP = 64,
  /**
   *
   * STORE_FORWARD_APP (Work in Progress)
   * Maintained by Jm Casler (MC Hamster) : jm@casler.org
   * ENCODING: Protobuf
   *
   * @generated from enum value: STORE_FORWARD_APP = 65;
   */
  STORE_FORWARD_APP = 65,
  /**
   *
   * Optional port for messages for the range test module.
   * ENCODING: ASCII Plaintext
   * NOTE: This portnum traffic is not sent to the public MQTT starting at firmware version 2.2.9
   *
   * @generated from enum value: RANGE_TEST_APP = 66;
   */
  RANGE_TEST_APP = 66,
  /**
   *
   * Provides a format to send and receive telemetry data from the Meshtastic network.
   * Maintained by Charles Crossan (crossan007) : crossan007@gmail.com
   * ENCODING: Protobuf
   *
   * @generated from enum value: TELEMETRY_APP = 67;
   */
  TELEMETRY_APP = 67,
  /**
   *
   * Experimental tools for estimating node position without a GPS
   * Maintained by Github user a-f-G-U-C (a Meshtastic contributor)
   * Project files at https://github.com/a-f-G-U-C/Meshtastic-ZPS
   * ENCODING: arrays of int64 fields
   *
   * @generated from enum value: ZPS_APP = 68;
   */
  ZPS_APP = 68,
  /**
   *
   * Used to let multiple instances of Linux native applications communicate
   * as if they did using their LoRa chip.
   * Maintained by GitHub user GUVWAF.
   * Project files at https://github.com/GUVWAF/Meshtasticator
   * ENCODING: Protobuf (?)
   *
   * @generated from enum value: SIMULATOR_APP = 69;
   */
  SIMULATOR_APP = 69,
  /**
   *
   * Provides a traceroute functionality to show the route a packet towards
   * a certain destination would take on the mesh. Contains a RouteDiscovery message as payload.
   * ENCODING: Protobuf
   *
   * @generated from enum value: TRACEROUTE_APP = 70;
   */
  TRACEROUTE_APP = 70,
  /**
   *
   * Aggregates edge info for the network by sending out a list of each node's neighbors
   * ENCODING: Protobuf
   *
   * @generated from enum value: NEIGHBORINFO_APP = 71;
   */
  NEIGHBORINFO_APP = 71,
  /**
   *
   * ATAK Plugin
   * Portnum for payloads from the official Meshtastic ATAK plugin
   *
   * @generated from enum value: ATAK_PLUGIN = 72;
   */
  ATAK_PLUGIN = 72,
  /**
   *
   * Provides unencrypted information about a node for consumption by a map via MQTT
   *
   * @generated from enum value: MAP_REPORT_APP = 73;
   */
  MAP_REPORT_APP = 73,
  /**
   *
   * PowerStress based monitoring support (for automated power consumption testing)
   *
   * @generated from enum value: POWERSTRESS_APP = 74;
   */
  POWERSTRESS_APP = 74,
  /**
   *
   * Reticulum Network Stack Tunnel App
   * ENCODING: Fragmented RNS Packet. Handled by Meshtastic RNS interface
   *
   * @generated from enum value: RETICULUM_TUNNEL_APP = 76;
   */
  RETICULUM_TUNNEL_APP = 76,
  /**
   *
   * App for transporting Cayenne Low Power Payload, popular for LoRaWAN sensor nodes. Offers ability to send
   * arbitrary telemetry over meshtastic that is not covered by telemetry.proto
   * ENCODING: CayenneLLP
   *
   * @generated from enum value: CAYENNE_APP = 77;
   */
  CAYENNE_APP = 77,
  /**
   *
   * Private applications should use portnums >= 256.
   * To simplify initial development and testing you can use "PRIVATE_APP"
   * in your code without needing to rebuild protobuf files (via [regen-protos.sh](https://github.com/meshtastic/firmware/blob/master/bin/regen-protos.sh))
   *
   * @generated from enum value: PRIVATE_APP = 256;
   */
  PRIVATE_APP = 256,
  /**
   *
   * ATAK Forwarder Module https://github.com/paulmandal/atak-forwarder
   * ENCODING: libcotshrink
   *
   * @generated from enum value: ATAK_FORWARDER = 257;
   */
  ATAK_FORWARDER = 257,
  /**
   *
   * Currently we limit port nums to no higher than this value
   *
   * @generated from enum value: MAX = 511;
   */
  MAX = 511,
}
/**
 * Describes the enum meshtastic.PortNum.
 */
declare const PortNumSchema: GenEnum<PortNum>;
declare namespace telemetry_pb_d_exports {
  export { AirQualityMetrics, AirQualityMetricsSchema, DeviceMetrics, DeviceMetricsSchema, EnvironmentMetrics, EnvironmentMetricsSchema, HealthMetrics, HealthMetricsSchema, HostMetrics, HostMetricsSchema, LocalStats, LocalStatsSchema, Nau7802Config, Nau7802ConfigSchema, PowerMetrics, PowerMetricsSchema, Telemetry, TelemetrySchema, TelemetrySensorType, TelemetrySensorTypeSchema, file_meshtastic_telemetry };
}
/**
 * Describes the file meshtastic/telemetry.proto.
 */
declare const file_meshtastic_telemetry: GenFile;
/**
 *
 * Key native device metrics such as battery level
 *
 * @generated from message meshtastic.DeviceMetrics
 */
type DeviceMetrics = Message<"meshtastic.DeviceMetrics"> & {
  /**
   *
   * 0-100 (>100 means powered)
   *
   * @generated from field: optional uint32 battery_level = 1;
   */
  batteryLevel?: number;
  /**
   *
   * Voltage measured
   *
   * @generated from field: optional float voltage = 2;
   */
  voltage?: number;
  /**
   *
   * Utilization for the current channel, including well formed TX, RX and malformed RX (aka noise).
   *
   * @generated from field: optional float channel_utilization = 3;
   */
  channelUtilization?: number;
  /**
   *
   * Percent of airtime for transmission used within the last hour.
   *
   * @generated from field: optional float air_util_tx = 4;
   */
  airUtilTx?: number;
  /**
   *
   * How long the device has been running since the last reboot (in seconds)
   *
   * @generated from field: optional uint32 uptime_seconds = 5;
   */
  uptimeSeconds?: number;
};
/**
 * Describes the message meshtastic.DeviceMetrics.
 * Use `create(DeviceMetricsSchema)` to create a new message.
 */
declare const DeviceMetricsSchema: GenMessage<DeviceMetrics>;
/**
 *
 * Weather station or other environmental metrics
 *
 * @generated from message meshtastic.EnvironmentMetrics
 */
type EnvironmentMetrics = Message<"meshtastic.EnvironmentMetrics"> & {
  /**
   *
   * Temperature measured
   *
   * @generated from field: optional float temperature = 1;
   */
  temperature?: number;
  /**
   *
   * Relative humidity percent measured
   *
   * @generated from field: optional float relative_humidity = 2;
   */
  relativeHumidity?: number;
  /**
   *
   * Barometric pressure in hPA measured
   *
   * @generated from field: optional float barometric_pressure = 3;
   */
  barometricPressure?: number;
  /**
   *
   * Gas resistance in MOhm measured
   *
   * @generated from field: optional float gas_resistance = 4;
   */
  gasResistance?: number;
  /**
   *
   * Voltage measured (To be depreciated in favor of PowerMetrics in Meshtastic 3.x)
   *
   * @generated from field: optional float voltage = 5;
   */
  voltage?: number;
  /**
   *
   * Current measured (To be depreciated in favor of PowerMetrics in Meshtastic 3.x)
   *
   * @generated from field: optional float current = 6;
   */
  current?: number;
  /**
   *
   * relative scale IAQ value as measured by Bosch BME680 . value 0-500.
   * Belongs to Air Quality but is not particle but VOC measurement. Other VOC values can also be put in here.
   *
   * @generated from field: optional uint32 iaq = 7;
   */
  iaq?: number;
  /**
   *
   * RCWL9620 Doppler Radar Distance Sensor, used for water level detection. Float value in mm.
   *
   * @generated from field: optional float distance = 8;
   */
  distance?: number;
  /**
   *
   * VEML7700 high accuracy ambient light(Lux) digital 16-bit resolution sensor.
   *
   * @generated from field: optional float lux = 9;
   */
  lux?: number;
  /**
   *
   * VEML7700 high accuracy white light(irradiance) not calibrated digital 16-bit resolution sensor.
   *
   * @generated from field: optional float white_lux = 10;
   */
  whiteLux?: number;
  /**
   *
   * Infrared lux
   *
   * @generated from field: optional float ir_lux = 11;
   */
  irLux?: number;
  /**
   *
   * Ultraviolet lux
   *
   * @generated from field: optional float uv_lux = 12;
   */
  uvLux?: number;
  /**
   *
   * Wind direction in degrees
   * 0 degrees = North, 90 = East, etc...
   *
   * @generated from field: optional uint32 wind_direction = 13;
   */
  windDirection?: number;
  /**
   *
   * Wind speed in m/s
   *
   * @generated from field: optional float wind_speed = 14;
   */
  windSpeed?: number;
  /**
   *
   * Weight in KG
   *
   * @generated from field: optional float weight = 15;
   */
  weight?: number;
  /**
   *
   * Wind gust in m/s
   *
   * @generated from field: optional float wind_gust = 16;
   */
  windGust?: number;
  /**
   *
   * Wind lull in m/s
   *
   * @generated from field: optional float wind_lull = 17;
   */
  windLull?: number;
  /**
   *
   * Radiation in µR/h
   *
   * @generated from field: optional float radiation = 18;
   */
  radiation?: number;
  /**
   *
   * Rainfall in the last hour in mm
   *
   * @generated from field: optional float rainfall_1h = 19;
   */
  rainfall1h?: number;
  /**
   *
   * Rainfall in the last 24 hours in mm
   *
   * @generated from field: optional float rainfall_24h = 20;
   */
  rainfall24h?: number;
  /**
   *
   * Soil moisture measured (% 1-100)
   *
   * @generated from field: optional uint32 soil_moisture = 21;
   */
  soilMoisture?: number;
  /**
   *
   * Soil temperature measured (*C)
   *
   * @generated from field: optional float soil_temperature = 22;
   */
  soilTemperature?: number;
};
/**
 * Describes the message meshtastic.EnvironmentMetrics.
 * Use `create(EnvironmentMetricsSchema)` to create a new message.
 */
declare const EnvironmentMetricsSchema: GenMessage<EnvironmentMetrics>;
/**
 *
 * Power Metrics (voltage / current / etc)
 *
 * @generated from message meshtastic.PowerMetrics
 */
type PowerMetrics = Message<"meshtastic.PowerMetrics"> & {
  /**
   *
   * Voltage (Ch1)
   *
   * @generated from field: optional float ch1_voltage = 1;
   */
  ch1Voltage?: number;
  /**
   *
   * Current (Ch1)
   *
   * @generated from field: optional float ch1_current = 2;
   */
  ch1Current?: number;
  /**
   *
   * Voltage (Ch2)
   *
   * @generated from field: optional float ch2_voltage = 3;
   */
  ch2Voltage?: number;
  /**
   *
   * Current (Ch2)
   *
   * @generated from field: optional float ch2_current = 4;
   */
  ch2Current?: number;
  /**
   *
   * Voltage (Ch3)
   *
   * @generated from field: optional float ch3_voltage = 5;
   */
  ch3Voltage?: number;
  /**
   *
   * Current (Ch3)
   *
   * @generated from field: optional float ch3_current = 6;
   */
  ch3Current?: number;
  /**
   *
   * Voltage (Ch4)
   *
   * @generated from field: optional float ch4_voltage = 7;
   */
  ch4Voltage?: number;
  /**
   *
   * Current (Ch4)
   *
   * @generated from field: optional float ch4_current = 8;
   */
  ch4Current?: number;
  /**
   *
   * Voltage (Ch5)
   *
   * @generated from field: optional float ch5_voltage = 9;
   */
  ch5Voltage?: number;
  /**
   *
   * Current (Ch5)
   *
   * @generated from field: optional float ch5_current = 10;
   */
  ch5Current?: number;
  /**
   *
   * Voltage (Ch6)
   *
   * @generated from field: optional float ch6_voltage = 11;
   */
  ch6Voltage?: number;
  /**
   *
   * Current (Ch6)
   *
   * @generated from field: optional float ch6_current = 12;
   */
  ch6Current?: number;
  /**
   *
   * Voltage (Ch7)
   *
   * @generated from field: optional float ch7_voltage = 13;
   */
  ch7Voltage?: number;
  /**
   *
   * Current (Ch7)
   *
   * @generated from field: optional float ch7_current = 14;
   */
  ch7Current?: number;
  /**
   *
   * Voltage (Ch8)
   *
   * @generated from field: optional float ch8_voltage = 15;
   */
  ch8Voltage?: number;
  /**
   *
   * Current (Ch8)
   *
   * @generated from field: optional float ch8_current = 16;
   */
  ch8Current?: number;
};
/**
 * Describes the message meshtastic.PowerMetrics.
 * Use `create(PowerMetricsSchema)` to create a new message.
 */
declare const PowerMetricsSchema: GenMessage<PowerMetrics>;
/**
 *
 * Air quality metrics
 *
 * @generated from message meshtastic.AirQualityMetrics
 */
type AirQualityMetrics = Message<"meshtastic.AirQualityMetrics"> & {
  /**
   *
   * Concentration Units Standard PM1.0 in ug/m3
   *
   * @generated from field: optional uint32 pm10_standard = 1;
   */
  pm10Standard?: number;
  /**
   *
   * Concentration Units Standard PM2.5 in ug/m3
   *
   * @generated from field: optional uint32 pm25_standard = 2;
   */
  pm25Standard?: number;
  /**
   *
   * Concentration Units Standard PM10.0 in ug/m3
   *
   * @generated from field: optional uint32 pm100_standard = 3;
   */
  pm100Standard?: number;
  /**
   *
   * Concentration Units Environmental PM1.0 in ug/m3
   *
   * @generated from field: optional uint32 pm10_environmental = 4;
   */
  pm10Environmental?: number;
  /**
   *
   * Concentration Units Environmental PM2.5 in ug/m3
   *
   * @generated from field: optional uint32 pm25_environmental = 5;
   */
  pm25Environmental?: number;
  /**
   *
   * Concentration Units Environmental PM10.0 in ug/m3
   *
   * @generated from field: optional uint32 pm100_environmental = 6;
   */
  pm100Environmental?: number;
  /**
   *
   * 0.3um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_03um = 7;
   */
  particles03um?: number;
  /**
   *
   * 0.5um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_05um = 8;
   */
  particles05um?: number;
  /**
   *
   * 1.0um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_10um = 9;
   */
  particles10um?: number;
  /**
   *
   * 2.5um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_25um = 10;
   */
  particles25um?: number;
  /**
   *
   * 5.0um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_50um = 11;
   */
  particles50um?: number;
  /**
   *
   * 10.0um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_100um = 12;
   */
  particles100um?: number;
  /**
   *
   * CO2 concentration in ppm
   *
   * @generated from field: optional uint32 co2 = 13;
   */
  co2?: number;
  /**
   *
   * CO2 sensor temperature in degC
   *
   * @generated from field: optional float co2_temperature = 14;
   */
  co2Temperature?: number;
  /**
   *
   * CO2 sensor relative humidity in %
   *
   * @generated from field: optional float co2_humidity = 15;
   */
  co2Humidity?: number;
  /**
   *
   * Formaldehyde sensor formaldehyde concentration in ppb
   *
   * @generated from field: optional float form_formaldehyde = 16;
   */
  formFormaldehyde?: number;
  /**
   *
   * Formaldehyde sensor relative humidity in %RH
   *
   * @generated from field: optional float form_humidity = 17;
   */
  formHumidity?: number;
  /**
   *
   * Formaldehyde sensor temperature in degrees Celsius
   *
   * @generated from field: optional float form_temperature = 18;
   */
  formTemperature?: number;
  /**
   *
   * Concentration Units Standard PM4.0 in ug/m3
   *
   * @generated from field: optional uint32 pm40_standard = 19;
   */
  pm40Standard?: number;
  /**
   *
   * 4.0um Particle Count in #/0.1l
   *
   * @generated from field: optional uint32 particles_40um = 20;
   */
  particles40um?: number;
  /**
   *
   * PM Sensor Temperature
   *
   * @generated from field: optional float pm_temperature = 21;
   */
  pmTemperature?: number;
  /**
   *
   * PM Sensor humidity
   *
   * @generated from field: optional float pm_humidity = 22;
   */
  pmHumidity?: number;
  /**
   *
   * PM Sensor VOC Index
   *
   * @generated from field: optional float pm_voc_idx = 23;
   */
  pmVocIdx?: number;
  /**
   *
   * PM Sensor NOx Index
   *
   * @generated from field: optional float pm_nox_idx = 24;
   */
  pmNoxIdx?: number;
  /**
   *
   * Typical Particle Size in um
   *
   * @generated from field: optional float particles_tps = 25;
   */
  particlesTps?: number;
};
/**
 * Describes the message meshtastic.AirQualityMetrics.
 * Use `create(AirQualityMetricsSchema)` to create a new message.
 */
declare const AirQualityMetricsSchema: GenMessage<AirQualityMetrics>;
/**
 *
 * Local device mesh statistics
 *
 * @generated from message meshtastic.LocalStats
 */
type LocalStats = Message<"meshtastic.LocalStats"> & {
  /**
   *
   * How long the device has been running since the last reboot (in seconds)
   *
   * @generated from field: uint32 uptime_seconds = 1;
   */
  uptimeSeconds: number;
  /**
   *
   * Utilization for the current channel, including well formed TX, RX and malformed RX (aka noise).
   *
   * @generated from field: float channel_utilization = 2;
   */
  channelUtilization: number;
  /**
   *
   * Percent of airtime for transmission used within the last hour.
   *
   * @generated from field: float air_util_tx = 3;
   */
  airUtilTx: number;
  /**
   *
   * Number of packets sent
   *
   * @generated from field: uint32 num_packets_tx = 4;
   */
  numPacketsTx: number;
  /**
   *
   * Number of packets received (both good and bad)
   *
   * @generated from field: uint32 num_packets_rx = 5;
   */
  numPacketsRx: number;
  /**
   *
   * Number of packets received that are malformed or violate the protocol
   *
   * @generated from field: uint32 num_packets_rx_bad = 6;
   */
  numPacketsRxBad: number;
  /**
   *
   * Number of nodes online (in the past 2 hours)
   *
   * @generated from field: uint32 num_online_nodes = 7;
   */
  numOnlineNodes: number;
  /**
   *
   * Number of nodes total
   *
   * @generated from field: uint32 num_total_nodes = 8;
   */
  numTotalNodes: number;
  /**
   *
   * Number of received packets that were duplicates (due to multiple nodes relaying).
   * If this number is high, there are nodes in the mesh relaying packets when it's unnecessary, for example due to the ROUTER/REPEATER role.
   *
   * @generated from field: uint32 num_rx_dupe = 9;
   */
  numRxDupe: number;
  /**
   *
   * Number of packets we transmitted that were a relay for others (not originating from ourselves).
   *
   * @generated from field: uint32 num_tx_relay = 10;
   */
  numTxRelay: number;
  /**
   *
   * Number of times we canceled a packet to be relayed, because someone else did it before us.
   * This will always be zero for ROUTERs/REPEATERs. If this number is high, some other node(s) is/are relaying faster than you.
   *
   * @generated from field: uint32 num_tx_relay_canceled = 11;
   */
  numTxRelayCanceled: number;
  /**
   *
   * Number of bytes used in the heap
   *
   * @generated from field: uint32 heap_total_bytes = 12;
   */
  heapTotalBytes: number;
  /**
   *
   * Number of bytes free in the heap
   *
   * @generated from field: uint32 heap_free_bytes = 13;
   */
  heapFreeBytes: number;
  /**
   *
   * Number of packets that were dropped because the transmit queue was full.
   *
   * @generated from field: uint32 num_tx_dropped = 14;
   */
  numTxDropped: number;
};
/**
 * Describes the message meshtastic.LocalStats.
 * Use `create(LocalStatsSchema)` to create a new message.
 */
declare const LocalStatsSchema: GenMessage<LocalStats>;
/**
 *
 * Health telemetry metrics
 *
 * @generated from message meshtastic.HealthMetrics
 */
type HealthMetrics = Message<"meshtastic.HealthMetrics"> & {
  /**
   *
   * Heart rate (beats per minute)
   *
   * @generated from field: optional uint32 heart_bpm = 1;
   */
  heartBpm?: number;
  /**
   *
   * SpO2 (blood oxygen saturation) level
   *
   * @generated from field: optional uint32 spO2 = 2;
   */
  spO2?: number;
  /**
   *
   * Body temperature in degrees Celsius
   *
   * @generated from field: optional float temperature = 3;
   */
  temperature?: number;
};
/**
 * Describes the message meshtastic.HealthMetrics.
 * Use `create(HealthMetricsSchema)` to create a new message.
 */
declare const HealthMetricsSchema: GenMessage<HealthMetrics>;
/**
 *
 * Linux host metrics
 *
 * @generated from message meshtastic.HostMetrics
 */
type HostMetrics = Message<"meshtastic.HostMetrics"> & {
  /**
   *
   * Host system uptime
   *
   * @generated from field: uint32 uptime_seconds = 1;
   */
  uptimeSeconds: number;
  /**
   *
   * Host system free memory
   *
   * @generated from field: uint64 freemem_bytes = 2;
   */
  freememBytes: bigint;
  /**
   *
   * Host system disk space free for /
   *
   * @generated from field: uint64 diskfree1_bytes = 3;
   */
  diskfree1Bytes: bigint;
  /**
   *
   * Secondary system disk space free
   *
   * @generated from field: optional uint64 diskfree2_bytes = 4;
   */
  diskfree2Bytes?: bigint;
  /**
   *
   * Tertiary disk space free
   *
   * @generated from field: optional uint64 diskfree3_bytes = 5;
   */
  diskfree3Bytes?: bigint;
  /**
   *
   * Host system one minute load in 1/100ths
   *
   * @generated from field: uint32 load1 = 6;
   */
  load1: number;
  /**
   *
   * Host system five minute load  in 1/100ths
   *
   * @generated from field: uint32 load5 = 7;
   */
  load5: number;
  /**
   *
   * Host system fifteen minute load  in 1/100ths
   *
   * @generated from field: uint32 load15 = 8;
   */
  load15: number;
  /**
   *
   * Optional User-provided string for arbitrary host system information
   * that doesn't make sense as a dedicated entry.
   *
   * @generated from field: optional string user_string = 9;
   */
  userString?: string;
};
/**
 * Describes the message meshtastic.HostMetrics.
 * Use `create(HostMetricsSchema)` to create a new message.
 */
declare const HostMetricsSchema: GenMessage<HostMetrics>;
/**
 *
 * Types of Measurements the telemetry module is equipped to handle
 *
 * @generated from message meshtastic.Telemetry
 */
type Telemetry = Message<"meshtastic.Telemetry"> & {
  /**
   *
   * Seconds since 1970 - or 0 for unknown/unset
   *
   * @generated from field: fixed32 time = 1;
   */
  time: number;
  /**
   * @generated from oneof meshtastic.Telemetry.variant
   */
  variant: {
    /**
     *
     * Key native device metrics such as battery level
     *
     * @generated from field: meshtastic.DeviceMetrics device_metrics = 2;
     */
    value: DeviceMetrics;
    case: "deviceMetrics";
  } | {
    /**
     *
     * Weather station or other environmental metrics
     *
     * @generated from field: meshtastic.EnvironmentMetrics environment_metrics = 3;
     */
    value: EnvironmentMetrics;
    case: "environmentMetrics";
  } | {
    /**
     *
     * Air quality metrics
     *
     * @generated from field: meshtastic.AirQualityMetrics air_quality_metrics = 4;
     */
    value: AirQualityMetrics;
    case: "airQualityMetrics";
  } | {
    /**
     *
     * Power Metrics
     *
     * @generated from field: meshtastic.PowerMetrics power_metrics = 5;
     */
    value: PowerMetrics;
    case: "powerMetrics";
  } | {
    /**
     *
     * Local device mesh statistics
     *
     * @generated from field: meshtastic.LocalStats local_stats = 6;
     */
    value: LocalStats;
    case: "localStats";
  } | {
    /**
     *
     * Health telemetry metrics
     *
     * @generated from field: meshtastic.HealthMetrics health_metrics = 7;
     */
    value: HealthMetrics;
    case: "healthMetrics";
  } | {
    /**
     *
     * Linux host metrics
     *
     * @generated from field: meshtastic.HostMetrics host_metrics = 8;
     */
    value: HostMetrics;
    case: "hostMetrics";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.Telemetry.
 * Use `create(TelemetrySchema)` to create a new message.
 */
declare const TelemetrySchema: GenMessage<Telemetry>;
/**
 *
 * NAU7802 Telemetry configuration, for saving to flash
 *
 * @generated from message meshtastic.Nau7802Config
 */
type Nau7802Config = Message<"meshtastic.Nau7802Config"> & {
  /**
   *
   * The offset setting for the NAU7802
   *
   * @generated from field: int32 zeroOffset = 1;
   */
  zeroOffset: number;
  /**
   *
   * The calibration factor for the NAU7802
   *
   * @generated from field: float calibrationFactor = 2;
   */
  calibrationFactor: number;
};
/**
 * Describes the message meshtastic.Nau7802Config.
 * Use `create(Nau7802ConfigSchema)` to create a new message.
 */
declare const Nau7802ConfigSchema: GenMessage<Nau7802Config>;
/**
 *
 * Supported I2C Sensors for telemetry in Meshtastic
 *
 * @generated from enum meshtastic.TelemetrySensorType
 */
declare enum TelemetrySensorType {
  /**
   *
   * No external telemetry sensor explicitly set
   *
   * @generated from enum value: SENSOR_UNSET = 0;
   */
  SENSOR_UNSET = 0,
  /**
   *
   * High accuracy temperature, pressure, humidity
   *
   * @generated from enum value: BME280 = 1;
   */
  BME280 = 1,
  /**
   *
   * High accuracy temperature, pressure, humidity, and air resistance
   *
   * @generated from enum value: BME680 = 2;
   */
  BME680 = 2,
  /**
   *
   * Very high accuracy temperature
   *
   * @generated from enum value: MCP9808 = 3;
   */
  MCP9808 = 3,
  /**
   *
   * Moderate accuracy current and voltage
   *
   * @generated from enum value: INA260 = 4;
   */
  INA260 = 4,
  /**
   *
   * Moderate accuracy current and voltage
   *
   * @generated from enum value: INA219 = 5;
   */
  INA219 = 5,
  /**
   *
   * High accuracy temperature and pressure
   *
   * @generated from enum value: BMP280 = 6;
   */
  BMP280 = 6,
  /**
   *
   * High accuracy temperature and humidity
   *
   * @generated from enum value: SHTC3 = 7;
   */
  SHTC3 = 7,
  /**
   *
   * High accuracy pressure
   *
   * @generated from enum value: LPS22 = 8;
   */
  LPS22 = 8,
  /**
   *
   * 3-Axis magnetic sensor
   *
   * @generated from enum value: QMC6310 = 9;
   */
  QMC6310 = 9,
  /**
   *
   * 6-Axis inertial measurement sensor
   *
   * @generated from enum value: QMI8658 = 10;
   */
  QMI8658 = 10,
  /**
   *
   * 3-Axis magnetic sensor
   *
   * @generated from enum value: QMC5883L = 11;
   */
  QMC5883L = 11,
  /**
   *
   * High accuracy temperature and humidity
   *
   * @generated from enum value: SHT31 = 12;
   */
  SHT31 = 12,
  /**
   *
   * PM2.5 air quality sensor
   *
   * @generated from enum value: PMSA003I = 13;
   */
  PMSA003I = 13,
  /**
   *
   * INA3221 3 Channel Voltage / Current Sensor
   *
   * @generated from enum value: INA3221 = 14;
   */
  INA3221 = 14,
  /**
   *
   * BMP085/BMP180 High accuracy temperature and pressure (older Version of BMP280)
   *
   * @generated from enum value: BMP085 = 15;
   */
  BMP085 = 15,
  /**
   *
   * RCWL-9620 Doppler Radar Distance Sensor, used for water level detection
   *
   * @generated from enum value: RCWL9620 = 16;
   */
  RCWL9620 = 16,
  /**
   *
   * Sensirion High accuracy temperature and humidity
   *
   * @generated from enum value: SHT4X = 17;
   */
  SHT4X = 17,
  /**
   *
   * VEML7700 high accuracy ambient light(Lux) digital 16-bit resolution sensor.
   *
   * @generated from enum value: VEML7700 = 18;
   */
  VEML7700 = 18,
  /**
   *
   * MLX90632 non-contact IR temperature sensor.
   *
   * @generated from enum value: MLX90632 = 19;
   */
  MLX90632 = 19,
  /**
   *
   * TI OPT3001 Ambient Light Sensor
   *
   * @generated from enum value: OPT3001 = 20;
   */
  OPT3001 = 20,
  /**
   *
   * Lite On LTR-390UV-01 UV Light Sensor
   *
   * @generated from enum value: LTR390UV = 21;
   */
  LTR390UV = 21,
  /**
   *
   * AMS TSL25911FN RGB Light Sensor
   *
   * @generated from enum value: TSL25911FN = 22;
   */
  TSL25911FN = 22,
  /**
   *
   * AHT10 Integrated temperature and humidity sensor
   *
   * @generated from enum value: AHT10 = 23;
   */
  AHT10 = 23,
  /**
   *
   * DFRobot Lark Weather station (temperature, humidity, pressure, wind speed and direction)
   *
   * @generated from enum value: DFROBOT_LARK = 24;
   */
  DFROBOT_LARK = 24,
  /**
   *
   * NAU7802 Scale Chip or compatible
   *
   * @generated from enum value: NAU7802 = 25;
   */
  NAU7802 = 25,
  /**
   *
   * BMP3XX High accuracy temperature and pressure
   *
   * @generated from enum value: BMP3XX = 26;
   */
  BMP3XX = 26,
  /**
   *
   * ICM-20948 9-Axis digital motion processor
   *
   * @generated from enum value: ICM20948 = 27;
   */
  ICM20948 = 27,
  /**
   *
   * MAX17048 1S lipo battery sensor (voltage, state of charge, time to go)
   *
   * @generated from enum value: MAX17048 = 28;
   */
  MAX17048 = 28,
  /**
   *
   * Custom I2C sensor implementation based on https://github.com/meshtastic/i2c-sensor
   *
   * @generated from enum value: CUSTOM_SENSOR = 29;
   */
  CUSTOM_SENSOR = 29,
  /**
   *
   * MAX30102 Pulse Oximeter and Heart-Rate Sensor
   *
   * @generated from enum value: MAX30102 = 30;
   */
  MAX30102 = 30,
  /**
   *
   * MLX90614 non-contact IR temperature sensor
   *
   * @generated from enum value: MLX90614 = 31;
   */
  MLX90614 = 31,
  /**
   *
   * SCD40/SCD41 CO2, humidity, temperature sensor
   *
   * @generated from enum value: SCD4X = 32;
   */
  SCD4X = 32,
  /**
   *
   * ClimateGuard RadSens, radiation, Geiger-Muller Tube
   *
   * @generated from enum value: RADSENS = 33;
   */
  RADSENS = 33,
  /**
   *
   * High accuracy current and voltage
   *
   * @generated from enum value: INA226 = 34;
   */
  INA226 = 34,
  /**
   *
   * DFRobot Gravity tipping bucket rain gauge
   *
   * @generated from enum value: DFROBOT_RAIN = 35;
   */
  DFROBOT_RAIN = 35,
  /**
   *
   * Infineon DPS310 High accuracy pressure and temperature
   *
   * @generated from enum value: DPS310 = 36;
   */
  DPS310 = 36,
  /**
   *
   * RAKWireless RAK12035 Soil Moisture Sensor Module
   *
   * @generated from enum value: RAK12035 = 37;
   */
  RAK12035 = 37,
  /**
   *
   * MAX17261 lipo battery gauge
   *
   * @generated from enum value: MAX17261 = 38;
   */
  MAX17261 = 38,
  /**
   *
   * PCT2075 Temperature Sensor
   *
   * @generated from enum value: PCT2075 = 39;
   */
  PCT2075 = 39,
  /**
   *
   * ADS1X15 ADC
   *
   * @generated from enum value: ADS1X15 = 40;
   */
  ADS1X15 = 40,
  /**
   *
   * ADS1X15 ADC_ALT
   *
   * @generated from enum value: ADS1X15_ALT = 41;
   */
  ADS1X15_ALT = 41,
  /**
   *
   * Sensirion SFA30 Formaldehyde sensor
   *
   * @generated from enum value: SFA30 = 42;
   */
  SFA30 = 42,
  /**
   *
   * SEN5X PM SENSORS
   *
   * @generated from enum value: SEN5X = 43;
   */
  SEN5X = 43,
  /**
   *
   * TSL2561 light sensor
   *
   * @generated from enum value: TSL2561 = 44;
   */
  TSL2561 = 44,
  /**
   *
   * BH1750 light sensor
   *
   * @generated from enum value: BH1750 = 45;
   */
  BH1750 = 45,
}
/**
 * Describes the enum meshtastic.TelemetrySensorType.
 */
declare const TelemetrySensorTypeSchema: GenEnum<TelemetrySensorType>;
declare namespace xmodem_pb_d_exports {
  export { XModem, XModemSchema, XModem_Control, XModem_ControlSchema, file_meshtastic_xmodem };
}
/**
 * Describes the file meshtastic/xmodem.proto.
 */
declare const file_meshtastic_xmodem: GenFile;
/**
 * @generated from message meshtastic.XModem
 */
type XModem = Message<"meshtastic.XModem"> & {
  /**
   * @generated from field: meshtastic.XModem.Control control = 1;
   */
  control: XModem_Control;
  /**
   * @generated from field: uint32 seq = 2;
   */
  seq: number;
  /**
   * @generated from field: uint32 crc16 = 3;
   */
  crc16: number;
  /**
   * @generated from field: bytes buffer = 4;
   */
  buffer: Uint8Array;
};
/**
 * Describes the message meshtastic.XModem.
 * Use `create(XModemSchema)` to create a new message.
 */
declare const XModemSchema: GenMessage<XModem>;
/**
 * @generated from enum meshtastic.XModem.Control
 */
declare enum XModem_Control {
  /**
   * @generated from enum value: NUL = 0;
   */
  NUL = 0,
  /**
   * @generated from enum value: SOH = 1;
   */
  SOH = 1,
  /**
   * @generated from enum value: STX = 2;
   */
  STX = 2,
  /**
   * @generated from enum value: EOT = 4;
   */
  EOT = 4,
  /**
   * @generated from enum value: ACK = 6;
   */
  ACK = 6,
  /**
   * @generated from enum value: NAK = 21;
   */
  NAK = 21,
  /**
   * @generated from enum value: CAN = 24;
   */
  CAN = 24,
  /**
   * @generated from enum value: CTRLZ = 26;
   */
  CTRLZ = 26,
}
/**
 * Describes the enum meshtastic.XModem.Control.
 */
declare const XModem_ControlSchema: GenEnum<XModem_Control>;
declare namespace mesh_pb_d_exports {
  export { ChunkedPayload, ChunkedPayloadResponse, ChunkedPayloadResponseSchema, ChunkedPayloadSchema, ClientNotification, ClientNotificationSchema, Compressed, CompressedSchema, Constants, ConstantsSchema, CriticalErrorCode, CriticalErrorCodeSchema, Data, DataSchema, DeviceMetadata, DeviceMetadataSchema, DuplicatedPublicKey, DuplicatedPublicKeySchema, ExcludedModules, ExcludedModulesSchema, FileInfo, FileInfoSchema, FirmwareEdition, FirmwareEditionSchema, FromRadio, FromRadioSchema, HardwareModel, HardwareModelSchema, Heartbeat, HeartbeatSchema, KeyVerification, KeyVerificationFinal, KeyVerificationFinalSchema, KeyVerificationNumberInform, KeyVerificationNumberInformSchema, KeyVerificationNumberRequest, KeyVerificationNumberRequestSchema, KeyVerificationSchema, LogRecord, LogRecordSchema, LogRecord_Level, LogRecord_LevelSchema, LowEntropyKey, LowEntropyKeySchema, MeshPacket, MeshPacketSchema, MeshPacket_Delayed, MeshPacket_DelayedSchema, MeshPacket_Priority, MeshPacket_PrioritySchema, MeshPacket_TransportMechanism, MeshPacket_TransportMechanismSchema, MqttClientProxyMessage, MqttClientProxyMessageSchema, MyNodeInfo, MyNodeInfoSchema, Neighbor, NeighborInfo, NeighborInfoSchema, NeighborSchema, NodeInfo, NodeInfoSchema, NodeRemoteHardwarePin, NodeRemoteHardwarePinSchema, Position, PositionSchema, Position_AltSource, Position_AltSourceSchema, Position_LocSource, Position_LocSourceSchema, QueueStatus, QueueStatusSchema, RouteDiscovery, RouteDiscoverySchema, Routing, RoutingSchema, Routing_Error, Routing_ErrorSchema, ToRadio, ToRadioSchema, User, UserSchema, Waypoint, WaypointSchema, file_meshtastic_mesh, resend_chunks, resend_chunksSchema };
}
/**
 * Describes the file meshtastic/mesh.proto.
 */
declare const file_meshtastic_mesh: GenFile;
/**
 *
 * A GPS Position
 *
 * @generated from message meshtastic.Position
 */
type Position = Message<"meshtastic.Position"> & {
  /**
   *
   * The new preferred location encoding, multiply by 1e-7 to get degrees
   * in floating point
   *
   * @generated from field: optional sfixed32 latitude_i = 1;
   */
  latitudeI?: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: optional sfixed32 longitude_i = 2;
   */
  longitudeI?: number;
  /**
   *
   * In meters above MSL (but see issue #359)
   *
   * @generated from field: optional int32 altitude = 3;
   */
  altitude?: number;
  /**
   *
   * This is usually not sent over the mesh (to save space), but it is sent
   * from the phone so that the local device can set its time if it is sent over
   * the mesh (because there are devices on the mesh without GPS or RTC).
   * seconds since 1970
   *
   * @generated from field: fixed32 time = 4;
   */
  time: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: meshtastic.Position.LocSource location_source = 5;
   */
  locationSource: Position_LocSource;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: meshtastic.Position.AltSource altitude_source = 6;
   */
  altitudeSource: Position_AltSource;
  /**
   *
   * Positional timestamp (actual timestamp of GPS solution) in integer epoch seconds
   *
   * @generated from field: fixed32 timestamp = 7;
   */
  timestamp: number;
  /**
   *
   * Pos. timestamp milliseconds adjustment (rarely available or required)
   *
   * @generated from field: int32 timestamp_millis_adjust = 8;
   */
  timestampMillisAdjust: number;
  /**
   *
   * HAE altitude in meters - can be used instead of MSL altitude
   *
   * @generated from field: optional sint32 altitude_hae = 9;
   */
  altitudeHae?: number;
  /**
   *
   * Geoidal separation in meters
   *
   * @generated from field: optional sint32 altitude_geoidal_separation = 10;
   */
  altitudeGeoidalSeparation?: number;
  /**
   *
   * Horizontal, Vertical and Position Dilution of Precision, in 1/100 units
   * - PDOP is sufficient for most cases
   * - for higher precision scenarios, HDOP and VDOP can be used instead,
   *   in which case PDOP becomes redundant (PDOP=sqrt(HDOP^2 + VDOP^2))
   * TODO: REMOVE/INTEGRATE
   *
   * @generated from field: uint32 PDOP = 11;
   */
  PDOP: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: uint32 HDOP = 12;
   */
  HDOP: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: uint32 VDOP = 13;
   */
  VDOP: number;
  /**
   *
   * GPS accuracy (a hardware specific constant) in mm
   *   multiplied with DOP to calculate positional accuracy
   * Default: "'bout three meters-ish" :)
   *
   * @generated from field: uint32 gps_accuracy = 14;
   */
  gpsAccuracy: number;
  /**
   *
   * Ground speed in m/s and True North TRACK in 1/100 degrees
   * Clarification of terms:
   * - "track" is the direction of motion (measured in horizontal plane)
   * - "heading" is where the fuselage points (measured in horizontal plane)
   * - "yaw" indicates a relative rotation about the vertical axis
   * TODO: REMOVE/INTEGRATE
   *
   * @generated from field: optional uint32 ground_speed = 15;
   */
  groundSpeed?: number;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: optional uint32 ground_track = 16;
   */
  groundTrack?: number;
  /**
   *
   * GPS fix quality (from NMEA GxGGA statement or similar)
   *
   * @generated from field: uint32 fix_quality = 17;
   */
  fixQuality: number;
  /**
   *
   * GPS fix type 2D/3D (from NMEA GxGSA statement)
   *
   * @generated from field: uint32 fix_type = 18;
   */
  fixType: number;
  /**
   *
   * GPS "Satellites in View" number
   *
   * @generated from field: uint32 sats_in_view = 19;
   */
  satsInView: number;
  /**
   *
   * Sensor ID - in case multiple positioning sensors are being used
   *
   * @generated from field: uint32 sensor_id = 20;
   */
  sensorId: number;
  /**
   *
   * Estimated/expected time (in seconds) until next update:
   * - if we update at fixed intervals of X seconds, use X
   * - if we update at dynamic intervals (based on relative movement etc),
   *   but "AT LEAST every Y seconds", use Y
   *
   * @generated from field: uint32 next_update = 21;
   */
  nextUpdate: number;
  /**
   *
   * A sequence number, incremented with each Position message to help
   *   detect lost updates if needed
   *
   * @generated from field: uint32 seq_number = 22;
   */
  seqNumber: number;
  /**
   *
   * Indicates the bits of precision set by the sending node
   *
   * @generated from field: uint32 precision_bits = 23;
   */
  precisionBits: number;
};
/**
 * Describes the message meshtastic.Position.
 * Use `create(PositionSchema)` to create a new message.
 */
declare const PositionSchema: GenMessage<Position>;
/**
 *
 * How the location was acquired: manual, onboard GPS, external (EUD) GPS
 *
 * @generated from enum meshtastic.Position.LocSource
 */
declare enum Position_LocSource {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: LOC_UNSET = 0;
   */
  LOC_UNSET = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: LOC_MANUAL = 1;
   */
  LOC_MANUAL = 1,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: LOC_INTERNAL = 2;
   */
  LOC_INTERNAL = 2,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: LOC_EXTERNAL = 3;
   */
  LOC_EXTERNAL = 3,
}
/**
 * Describes the enum meshtastic.Position.LocSource.
 */
declare const Position_LocSourceSchema: GenEnum<Position_LocSource>;
/**
 *
 * How the altitude was acquired: manual, GPS int/ext, etc
 * Default: same as location_source if present
 *
 * @generated from enum meshtastic.Position.AltSource
 */
declare enum Position_AltSource {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: ALT_UNSET = 0;
   */
  ALT_UNSET = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: ALT_MANUAL = 1;
   */
  ALT_MANUAL = 1,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: ALT_INTERNAL = 2;
   */
  ALT_INTERNAL = 2,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: ALT_EXTERNAL = 3;
   */
  ALT_EXTERNAL = 3,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: ALT_BAROMETRIC = 4;
   */
  ALT_BAROMETRIC = 4,
}
/**
 * Describes the enum meshtastic.Position.AltSource.
 */
declare const Position_AltSourceSchema: GenEnum<Position_AltSource>;
/**
 *
 * Broadcast when a newly powered mesh node wants to find a node num it can use
 * Sent from the phone over bluetooth to set the user id for the owner of this node.
 * Also sent from nodes to each other when a new node signs on (so all clients can have this info)
 * The algorithm is as follows:
 * when a node starts up, it broadcasts their user and the normal flow is for all
 * other nodes to reply with their User as well (so the new node can build its nodedb)
 * If a node ever receives a User (not just the first broadcast) message where
 * the sender node number equals our node number, that indicates a collision has
 * occurred and the following steps should happen:
 * If the receiving node (that was already in the mesh)'s macaddr is LOWER than the
 * new User who just tried to sign in: it gets to keep its nodenum.
 * We send a broadcast message of OUR User (we use a broadcast so that the other node can
 * receive our message, considering we have the same id - it also serves to let
 * observers correct their nodedb) - this case is rare so it should be okay.
 * If any node receives a User where the macaddr is GTE than their local macaddr,
 * they have been vetoed and should pick a new random nodenum (filtering against
 * whatever it knows about the nodedb) and rebroadcast their User.
 * A few nodenums are reserved and will never be requested:
 * 0xff - broadcast
 * 0 through 3 - for future use
 *
 * @generated from message meshtastic.User
 */
type User = Message<"meshtastic.User"> & {
  /**
   *
   * A globally unique ID string for this user.
   * In the case of Signal that would mean +16504442323, for the default macaddr derived id it would be !<8 hexidecimal bytes>.
   * Note: app developers are encouraged to also use the following standard
   * node IDs "^all" (for broadcast), "^local" (for the locally connected node)
   *
   * @generated from field: string id = 1;
   */
  id: string;
  /**
   *
   * A full name for this user, i.e. "Kevin Hester"
   *
   * @generated from field: string long_name = 2;
   */
  longName: string;
  /**
   *
   * A VERY short name, ideally two characters.
   * Suitable for a tiny OLED screen
   *
   * @generated from field: string short_name = 3;
   */
  shortName: string;
  /**
   *
   * Deprecated in Meshtastic 2.1.x
   * This is the addr of the radio.
   * Not populated by the phone, but added by the esp32 when broadcasting
   *
   * @generated from field: bytes macaddr = 4 [deprecated = true];
   * @deprecated
   */
  macaddr: Uint8Array;
  /**
   *
   * TBEAM, HELTEC, etc...
   * Starting in 1.2.11 moved to hw_model enum in the NodeInfo object.
   * Apps will still need the string here for older builds
   * (so OTA update can find the right image), but if the enum is available it will be used instead.
   *
   * @generated from field: meshtastic.HardwareModel hw_model = 5;
   */
  hwModel: HardwareModel;
  /**
   *
   * In some regions Ham radio operators have different bandwidth limitations than others.
   * If this user is a licensed operator, set this flag.
   * Also, "long_name" should be their licence number.
   *
   * @generated from field: bool is_licensed = 6;
   */
  isLicensed: boolean;
  /**
   *
   * Indicates that the user's role in the mesh
   *
   * @generated from field: meshtastic.Config.DeviceConfig.Role role = 7;
   */
  role: Config_DeviceConfig_Role;
  /**
   *
   * The public key of the user's device.
   * This is sent out to other nodes on the mesh to allow them to compute a shared secret key.
   *
   * @generated from field: bytes public_key = 8;
   */
  publicKey: Uint8Array;
  /**
   *
   * Whether or not the node can be messaged
   *
   * @generated from field: optional bool is_unmessagable = 9;
   */
  isUnmessagable?: boolean;
};
/**
 * Describes the message meshtastic.User.
 * Use `create(UserSchema)` to create a new message.
 */
declare const UserSchema: GenMessage<User>;
/**
 *
 * A message used in a traceroute
 *
 * @generated from message meshtastic.RouteDiscovery
 */
type RouteDiscovery = Message<"meshtastic.RouteDiscovery"> & {
  /**
   *
   * The list of nodenums this packet has visited so far to the destination.
   *
   * @generated from field: repeated fixed32 route = 1;
   */
  route: number[];
  /**
   *
   * The list of SNRs (in dB, scaled by 4) in the route towards the destination.
   *
   * @generated from field: repeated int32 snr_towards = 2;
   */
  snrTowards: number[];
  /**
   *
   * The list of nodenums the packet has visited on the way back from the destination.
   *
   * @generated from field: repeated fixed32 route_back = 3;
   */
  routeBack: number[];
  /**
   *
   * The list of SNRs (in dB, scaled by 4) in the route back from the destination.
   *
   * @generated from field: repeated int32 snr_back = 4;
   */
  snrBack: number[];
};
/**
 * Describes the message meshtastic.RouteDiscovery.
 * Use `create(RouteDiscoverySchema)` to create a new message.
 */
declare const RouteDiscoverySchema: GenMessage<RouteDiscovery>;
/**
 *
 * A Routing control Data packet handled by the routing module
 *
 * @generated from message meshtastic.Routing
 */
type Routing = Message<"meshtastic.Routing"> & {
  /**
   * @generated from oneof meshtastic.Routing.variant
   */
  variant: {
    /**
     *
     * A route request going from the requester
     *
     * @generated from field: meshtastic.RouteDiscovery route_request = 1;
     */
    value: RouteDiscovery;
    case: "routeRequest";
  } | {
    /**
     *
     * A route reply
     *
     * @generated from field: meshtastic.RouteDiscovery route_reply = 2;
     */
    value: RouteDiscovery;
    case: "routeReply";
  } | {
    /**
     *
     * A failure in delivering a message (usually used for routing control messages, but might be provided
     * in addition to ack.fail_id to provide details on the type of failure).
     *
     * @generated from field: meshtastic.Routing.Error error_reason = 3;
     */
    value: Routing_Error;
    case: "errorReason";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.Routing.
 * Use `create(RoutingSchema)` to create a new message.
 */
declare const RoutingSchema: GenMessage<Routing>;
/**
 *
 * A failure in delivering a message (usually used for routing control messages, but might be provided in addition to ack.fail_id to provide
 * details on the type of failure).
 *
 * @generated from enum meshtastic.Routing.Error
 */
declare enum Routing_Error {
  /**
   *
   * This message is not a failure
   *
   * @generated from enum value: NONE = 0;
   */
  NONE = 0,
  /**
   *
   * Our node doesn't have a route to the requested destination anymore.
   *
   * @generated from enum value: NO_ROUTE = 1;
   */
  NO_ROUTE = 1,
  /**
   *
   * We received a nak while trying to forward on your behalf
   *
   * @generated from enum value: GOT_NAK = 2;
   */
  GOT_NAK = 2,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TIMEOUT = 3;
   */
  TIMEOUT = 3,
  /**
   *
   * No suitable interface could be found for delivering this packet
   *
   * @generated from enum value: NO_INTERFACE = 4;
   */
  NO_INTERFACE = 4,
  /**
   *
   * We reached the max retransmission count (typically for naive flood routing)
   *
   * @generated from enum value: MAX_RETRANSMIT = 5;
   */
  MAX_RETRANSMIT = 5,
  /**
   *
   * No suitable channel was found for sending this packet (i.e. was requested channel index disabled?)
   *
   * @generated from enum value: NO_CHANNEL = 6;
   */
  NO_CHANNEL = 6,
  /**
   *
   * The packet was too big for sending (exceeds interface MTU after encoding)
   *
   * @generated from enum value: TOO_LARGE = 7;
   */
  TOO_LARGE = 7,
  /**
   *
   * The request had want_response set, the request reached the destination node, but no service on that node wants to send a response
   * (possibly due to bad channel permissions)
   *
   * @generated from enum value: NO_RESPONSE = 8;
   */
  NO_RESPONSE = 8,
  /**
   *
   * Cannot send currently because duty cycle regulations will be violated.
   *
   * @generated from enum value: DUTY_CYCLE_LIMIT = 9;
   */
  DUTY_CYCLE_LIMIT = 9,
  /**
   *
   * The application layer service on the remote node received your request, but considered your request somehow invalid
   *
   * @generated from enum value: BAD_REQUEST = 32;
   */
  BAD_REQUEST = 32,
  /**
   *
   * The application layer service on the remote node received your request, but considered your request not authorized
   * (i.e you did not send the request on the required bound channel)
   *
   * @generated from enum value: NOT_AUTHORIZED = 33;
   */
  NOT_AUTHORIZED = 33,
  /**
   *
   * The client specified a PKI transport, but the node was unable to send the packet using PKI (and did not send the message at all)
   *
   * @generated from enum value: PKI_FAILED = 34;
   */
  PKI_FAILED = 34,
  /**
   *
   * The receiving node does not have a Public Key to decode with
   *
   * @generated from enum value: PKI_UNKNOWN_PUBKEY = 35;
   */
  PKI_UNKNOWN_PUBKEY = 35,
  /**
   *
   * Admin packet otherwise checks out, but uses a bogus or expired session key
   *
   * @generated from enum value: ADMIN_BAD_SESSION_KEY = 36;
   */
  ADMIN_BAD_SESSION_KEY = 36,
  /**
   *
   * Admin packet sent using PKC, but not from a public key on the admin key list
   *
   * @generated from enum value: ADMIN_PUBLIC_KEY_UNAUTHORIZED = 37;
   */
  ADMIN_PUBLIC_KEY_UNAUTHORIZED = 37,
  /**
   *
   * Airtime fairness rate limit exceeded for a packet
   * This typically enforced per portnum and is used to prevent a single node from monopolizing airtime
   *
   * @generated from enum value: RATE_LIMIT_EXCEEDED = 38;
   */
  RATE_LIMIT_EXCEEDED = 38,
}
/**
 * Describes the enum meshtastic.Routing.Error.
 */
declare const Routing_ErrorSchema: GenEnum<Routing_Error>;
/**
 *
 * (Formerly called SubPacket)
 * The payload portion fo a packet, this is the actual bytes that are sent
 * inside a radio packet (because from/to are broken out by the comms library)
 *
 * @generated from message meshtastic.Data
 */
type Data = Message<"meshtastic.Data"> & {
  /**
   *
   * Formerly named typ and of type Type
   *
   * @generated from field: meshtastic.PortNum portnum = 1;
   */
  portnum: PortNum;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: bytes payload = 2;
   */
  payload: Uint8Array;
  /**
   *
   * Not normally used, but for testing a sender can request that recipient
   * responds in kind (i.e. if it received a position, it should unicast back it's position).
   * Note: that if you set this on a broadcast you will receive many replies.
   *
   * @generated from field: bool want_response = 3;
   */
  wantResponse: boolean;
  /**
   *
   * The address of the destination node.
   * This field is is filled in by the mesh radio device software, application
   * layer software should never need it.
   * RouteDiscovery messages _must_ populate this.
   * Other message types might need to if they are doing multihop routing.
   *
   * @generated from field: fixed32 dest = 4;
   */
  dest: number;
  /**
   *
   * The address of the original sender for this message.
   * This field should _only_ be populated for reliable multihop packets (to keep
   * packets small).
   *
   * @generated from field: fixed32 source = 5;
   */
  source: number;
  /**
   *
   * Only used in routing or response messages.
   * Indicates the original message ID that this message is reporting failure on. (formerly called original_id)
   *
   * @generated from field: fixed32 request_id = 6;
   */
  requestId: number;
  /**
   *
   * If set, this message is intened to be a reply to a previously sent message with the defined id.
   *
   * @generated from field: fixed32 reply_id = 7;
   */
  replyId: number;
  /**
   *
   * Defaults to false. If true, then what is in the payload should be treated as an emoji like giving
   * a message a heart or poop emoji.
   *
   * @generated from field: fixed32 emoji = 8;
   */
  emoji: number;
  /**
   *
   * Bitfield for extra flags. First use is to indicate that user approves the packet being uploaded to MQTT.
   *
   * @generated from field: optional uint32 bitfield = 9;
   */
  bitfield?: number;
};
/**
 * Describes the message meshtastic.Data.
 * Use `create(DataSchema)` to create a new message.
 */
declare const DataSchema: GenMessage<Data>;
/**
 *
 * The actual over-the-mesh message doing KeyVerification
 *
 * @generated from message meshtastic.KeyVerification
 */
type KeyVerification = Message<"meshtastic.KeyVerification"> & {
  /**
   *
   * random value Selected by the requesting node
   *
   * @generated from field: uint64 nonce = 1;
   */
  nonce: bigint;
  /**
   *
   * The final authoritative hash, only to be sent by NodeA at the end of the handshake
   *
   * @generated from field: bytes hash1 = 2;
   */
  hash1: Uint8Array;
  /**
   *
   * The intermediary hash (actually derived from hash1),
   * sent from NodeB to NodeA in response to the initial message.
   *
   * @generated from field: bytes hash2 = 3;
   */
  hash2: Uint8Array;
};
/**
 * Describes the message meshtastic.KeyVerification.
 * Use `create(KeyVerificationSchema)` to create a new message.
 */
declare const KeyVerificationSchema: GenMessage<KeyVerification>;
/**
 *
 * Waypoint message, used to share arbitrary locations across the mesh
 *
 * @generated from message meshtastic.Waypoint
 */
type Waypoint = Message<"meshtastic.Waypoint"> & {
  /**
   *
   * Id of the waypoint
   *
   * @generated from field: uint32 id = 1;
   */
  id: number;
  /**
   *
   * latitude_i
   *
   * @generated from field: optional sfixed32 latitude_i = 2;
   */
  latitudeI?: number;
  /**
   *
   * longitude_i
   *
   * @generated from field: optional sfixed32 longitude_i = 3;
   */
  longitudeI?: number;
  /**
   *
   * Time the waypoint is to expire (epoch)
   *
   * @generated from field: uint32 expire = 4;
   */
  expire: number;
  /**
   *
   * If greater than zero, treat the value as a nodenum only allowing them to update the waypoint.
   * If zero, the waypoint is open to be edited by any member of the mesh.
   *
   * @generated from field: uint32 locked_to = 5;
   */
  lockedTo: number;
  /**
   *
   * Name of the waypoint - max 30 chars
   *
   * @generated from field: string name = 6;
   */
  name: string;
  /**
   *
   * Description of the waypoint - max 100 chars
   *
   * @generated from field: string description = 7;
   */
  description: string;
  /**
   *
   * Designator icon for the waypoint in the form of a unicode emoji
   *
   * @generated from field: fixed32 icon = 8;
   */
  icon: number;
};
/**
 * Describes the message meshtastic.Waypoint.
 * Use `create(WaypointSchema)` to create a new message.
 */
declare const WaypointSchema: GenMessage<Waypoint>;
/**
 *
 * This message will be proxied over the PhoneAPI for the client to deliver to the MQTT server
 *
 * @generated from message meshtastic.MqttClientProxyMessage
 */
type MqttClientProxyMessage = Message<"meshtastic.MqttClientProxyMessage"> & {
  /**
   *
   * The MQTT topic this message will be sent /received on
   *
   * @generated from field: string topic = 1;
   */
  topic: string;
  /**
   *
   * The actual service envelope payload or text for mqtt pub / sub
   *
   * @generated from oneof meshtastic.MqttClientProxyMessage.payload_variant
   */
  payloadVariant: {
    /**
     *
     * Bytes
     *
     * @generated from field: bytes data = 2;
     */
    value: Uint8Array;
    case: "data";
  } | {
    /**
     *
     * Text
     *
     * @generated from field: string text = 3;
     */
    value: string;
    case: "text";
  } | {
    case: undefined;
    value?: undefined;
  };
  /**
   *
   * Whether the message should be retained (or not)
   *
   * @generated from field: bool retained = 4;
   */
  retained: boolean;
};
/**
 * Describes the message meshtastic.MqttClientProxyMessage.
 * Use `create(MqttClientProxyMessageSchema)` to create a new message.
 */
declare const MqttClientProxyMessageSchema: GenMessage<MqttClientProxyMessage>;
/**
 *
 * A packet envelope sent/received over the mesh
 * only payload_variant is sent in the payload portion of the LORA packet.
 * The other fields are either not sent at all, or sent in the special 16 byte LORA header.
 *
 * @generated from message meshtastic.MeshPacket
 */
type MeshPacket = Message<"meshtastic.MeshPacket"> & {
  /**
   *
   * The sending node number.
   * Note: Our crypto implementation uses this field as well.
   * See [crypto](/docs/overview/encryption) for details.
   *
   * @generated from field: fixed32 from = 1;
   */
  from: number;
  /**
   *
   * The (immediate) destination for this packet
   *
   * @generated from field: fixed32 to = 2;
   */
  to: number;
  /**
   *
   * (Usually) If set, this indicates the index in the secondary_channels table that this packet was sent/received on.
   * If unset, packet was on the primary channel.
   * A particular node might know only a subset of channels in use on the mesh.
   * Therefore channel_index is inherently a local concept and meaningless to send between nodes.
   * Very briefly, while sending and receiving deep inside the device Router code, this field instead
   * contains the 'channel hash' instead of the index.
   * This 'trick' is only used while the payload_variant is an 'encrypted'.
   *
   * @generated from field: uint32 channel = 3;
   */
  channel: number;
  /**
   * @generated from oneof meshtastic.MeshPacket.payload_variant
   */
  payloadVariant: {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.Data decoded = 4;
     */
    value: Data;
    case: "decoded";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: bytes encrypted = 5;
     */
    value: Uint8Array;
    case: "encrypted";
  } | {
    case: undefined;
    value?: undefined;
  };
  /**
   *
   * A unique ID for this packet.
   * Always 0 for no-ack packets or non broadcast packets (and therefore take zero bytes of space).
   * Otherwise a unique ID for this packet, useful for flooding algorithms.
   * ID only needs to be unique on a _per sender_ basis, and it only
   * needs to be unique for a few minutes (long enough to last for the length of
   * any ACK or the completion of a mesh broadcast flood).
   * Note: Our crypto implementation uses this id as well.
   * See [crypto](/docs/overview/encryption) for details.
   *
   * @generated from field: fixed32 id = 6;
   */
  id: number;
  /**
   *
   * The time this message was received by the esp32 (secs since 1970).
   * Note: this field is _never_ sent on the radio link itself (to save space) Times
   * are typically not sent over the mesh, but they will be added to any Packet
   * (chain of SubPacket) sent to the phone (so the phone can know exact time of reception)
   *
   * @generated from field: fixed32 rx_time = 7;
   */
  rxTime: number;
  /**
   *
   * *Never* sent over the radio links.
   * Set during reception to indicate the SNR of this packet.
   * Used to collect statistics on current link quality.
   *
   * @generated from field: float rx_snr = 8;
   */
  rxSnr: number;
  /**
   *
   * If unset treated as zero (no forwarding, send to direct neighbor nodes only)
   * if 1, allow hopping through one node, etc...
   * For our usecase real world topologies probably have a max of about 3.
   * This field is normally placed into a few of bits in the header.
   *
   * @generated from field: uint32 hop_limit = 9;
   */
  hopLimit: number;
  /**
   *
   * This packet is being sent as a reliable message, we would prefer it to arrive at the destination.
   * We would like to receive a ack packet in response.
   * Broadcasts messages treat this flag specially: Since acks for broadcasts would
   * rapidly flood the channel, the normal ack behavior is suppressed.
   * Instead, the original sender listens to see if at least one node is rebroadcasting this packet (because naive flooding algorithm).
   * If it hears that the odds (given typical LoRa topologies) the odds are very high that every node should eventually receive the message.
   * So FloodingRouter.cpp generates an implicit ack which is delivered to the original sender.
   * If after some time we don't hear anyone rebroadcast our packet, we will timeout and retransmit, using the regular resend logic.
   * Note: This flag is normally sent in a flag bit in the header when sent over the wire
   *
   * @generated from field: bool want_ack = 10;
   */
  wantAck: boolean;
  /**
   *
   * The priority of this message for sending.
   * See MeshPacket.Priority description for more details.
   *
   * @generated from field: meshtastic.MeshPacket.Priority priority = 11;
   */
  priority: MeshPacket_Priority;
  /**
   *
   * rssi of received packet. Only sent to phone for dispay purposes.
   *
   * @generated from field: int32 rx_rssi = 12;
   */
  rxRssi: number;
  /**
   *
   * Describe if this message is delayed
   *
   * @generated from field: meshtastic.MeshPacket.Delayed delayed = 13 [deprecated = true];
   * @deprecated
   */
  delayed: MeshPacket_Delayed;
  /**
   *
   * Describes whether this packet passed via MQTT somewhere along the path it currently took.
   *
   * @generated from field: bool via_mqtt = 14;
   */
  viaMqtt: boolean;
  /**
   *
   * Hop limit with which the original packet started. Sent via LoRa using three bits in the unencrypted header.
   * When receiving a packet, the difference between hop_start and hop_limit gives how many hops it traveled.
   *
   * @generated from field: uint32 hop_start = 15;
   */
  hopStart: number;
  /**
   *
   * Records the public key the packet was encrypted with, if applicable.
   *
   * @generated from field: bytes public_key = 16;
   */
  publicKey: Uint8Array;
  /**
   *
   * Indicates whether the packet was en/decrypted using PKI
   *
   * @generated from field: bool pki_encrypted = 17;
   */
  pkiEncrypted: boolean;
  /**
   *
   * Last byte of the node number of the node that should be used as the next hop in routing.
   * Set by the firmware internally, clients are not supposed to set this.
   *
   * @generated from field: uint32 next_hop = 18;
   */
  nextHop: number;
  /**
   *
   * Last byte of the node number of the node that will relay/relayed this packet.
   * Set by the firmware internally, clients are not supposed to set this.
   *
   * @generated from field: uint32 relay_node = 19;
   */
  relayNode: number;
  /**
   *
   * *Never* sent over the radio links.
   * Timestamp after which this packet may be sent.
   * Set by the firmware internally, clients are not supposed to set this.
   *
   * @generated from field: uint32 tx_after = 20;
   */
  txAfter: number;
  /**
   *
   * Indicates which transport mechanism this packet arrived over
   *
   * @generated from field: meshtastic.MeshPacket.TransportMechanism transport_mechanism = 21;
   */
  transportMechanism: MeshPacket_TransportMechanism;
};
/**
 * Describes the message meshtastic.MeshPacket.
 * Use `create(MeshPacketSchema)` to create a new message.
 */
declare const MeshPacketSchema: GenMessage<MeshPacket>;
/**
 *
 * The priority of this message for sending.
 * Higher priorities are sent first (when managing the transmit queue).
 * This field is never sent over the air, it is only used internally inside of a local device node.
 * API clients (either on the local node or connected directly to the node)
 * can set this parameter if necessary.
 * (values must be <= 127 to keep protobuf field to one byte in size.
 * Detailed background on this field:
 * I noticed a funny side effect of lora being so slow: Usually when making
 * a protocol there isn’t much need to use message priority to change the order
 * of transmission (because interfaces are fairly fast).
 * But for lora where packets can take a few seconds each, it is very important
 * to make sure that critical packets are sent ASAP.
 * In the case of meshtastic that means we want to send protocol acks as soon as possible
 * (to prevent unneeded retransmissions), we want routing messages to be sent next,
 * then messages marked as reliable and finally 'background' packets like periodic position updates.
 * So I bit the bullet and implemented a new (internal - not sent over the air)
 * field in MeshPacket called 'priority'.
 * And the transmission queue in the router object is now a priority queue.
 *
 * @generated from enum meshtastic.MeshPacket.Priority
 */
declare enum MeshPacket_Priority {
  /**
   *
   * Treated as Priority.DEFAULT
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: MIN = 1;
   */
  MIN = 1,
  /**
   *
   * Background position updates are sent with very low priority -
   * if the link is super congested they might not go out at all
   *
   * @generated from enum value: BACKGROUND = 10;
   */
  BACKGROUND = 10,
  /**
   *
   * This priority is used for most messages that don't have a priority set
   *
   * @generated from enum value: DEFAULT = 64;
   */
  DEFAULT = 64,
  /**
   *
   * If priority is unset but the message is marked as want_ack,
   * assume it is important and use a slightly higher priority
   *
   * @generated from enum value: RELIABLE = 70;
   */
  RELIABLE = 70,
  /**
   *
   * If priority is unset but the packet is a response to a request, we want it to get there relatively quickly.
   * Furthermore, responses stop relaying packets directed to a node early.
   *
   * @generated from enum value: RESPONSE = 80;
   */
  RESPONSE = 80,
  /**
   *
   * Higher priority for specific message types (portnums) to distinguish between other reliable packets.
   *
   * @generated from enum value: HIGH = 100;
   */
  HIGH = 100,
  /**
   *
   * Higher priority alert message used for critical alerts which take priority over other reliable packets.
   *
   * @generated from enum value: ALERT = 110;
   */
  ALERT = 110,
  /**
   *
   * Ack/naks are sent with very high priority to ensure that retransmission
   * stops as soon as possible
   *
   * @generated from enum value: ACK = 120;
   */
  ACK = 120,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: MAX = 127;
   */
  MAX = 127,
}
/**
 * Describes the enum meshtastic.MeshPacket.Priority.
 */
declare const MeshPacket_PrioritySchema: GenEnum<MeshPacket_Priority>;
/**
 *
 * Identify if this is a delayed packet
 *
 * @generated from enum meshtastic.MeshPacket.Delayed
 */
declare enum MeshPacket_Delayed {
  /**
   *
   * If unset, the message is being sent in real time.
   *
   * @generated from enum value: NO_DELAY = 0;
   */
  NO_DELAY = 0,
  /**
   *
   * The message is delayed and was originally a broadcast
   *
   * @generated from enum value: DELAYED_BROADCAST = 1;
   */
  DELAYED_BROADCAST = 1,
  /**
   *
   * The message is delayed and was originally a direct message
   *
   * @generated from enum value: DELAYED_DIRECT = 2;
   */
  DELAYED_DIRECT = 2,
}
/**
 * Describes the enum meshtastic.MeshPacket.Delayed.
 */
declare const MeshPacket_DelayedSchema: GenEnum<MeshPacket_Delayed>;
/**
 *
 * Enum to identify which transport mechanism this packet arrived over
 *
 * @generated from enum meshtastic.MeshPacket.TransportMechanism
 */
declare enum MeshPacket_TransportMechanism {
  /**
   *
   * The default case is that the node generated a packet itself
   *
   * @generated from enum value: TRANSPORT_INTERNAL = 0;
   */
  TRANSPORT_INTERNAL = 0,
  /**
   *
   * Arrived via the primary LoRa radio
   *
   * @generated from enum value: TRANSPORT_LORA = 1;
   */
  TRANSPORT_LORA = 1,
  /**
   *
   * Arrived via a secondary LoRa radio
   *
   * @generated from enum value: TRANSPORT_LORA_ALT1 = 2;
   */
  TRANSPORT_LORA_ALT1 = 2,
  /**
   *
   * Arrived via a tertiary LoRa radio
   *
   * @generated from enum value: TRANSPORT_LORA_ALT2 = 3;
   */
  TRANSPORT_LORA_ALT2 = 3,
  /**
   *
   * Arrived via a quaternary LoRa radio
   *
   * @generated from enum value: TRANSPORT_LORA_ALT3 = 4;
   */
  TRANSPORT_LORA_ALT3 = 4,
  /**
   *
   * Arrived via an MQTT connection
   *
   * @generated from enum value: TRANSPORT_MQTT = 5;
   */
  TRANSPORT_MQTT = 5,
  /**
   *
   * Arrived via Multicast UDP
   *
   * @generated from enum value: TRANSPORT_MULTICAST_UDP = 6;
   */
  TRANSPORT_MULTICAST_UDP = 6,
  /**
   *
   * Arrived via API connection
   *
   * @generated from enum value: TRANSPORT_API = 7;
   */
  TRANSPORT_API = 7,
}
/**
 * Describes the enum meshtastic.MeshPacket.TransportMechanism.
 */
declare const MeshPacket_TransportMechanismSchema: GenEnum<MeshPacket_TransportMechanism>;
/**
 *
 * The bluetooth to device link:
 * Old BTLE protocol docs from TODO, merge in above and make real docs...
 * use protocol buffers, and NanoPB
 * messages from device to phone:
 * POSITION_UPDATE (..., time)
 * TEXT_RECEIVED(from, text, time)
 * OPAQUE_RECEIVED(from, payload, time) (for signal messages or other applications)
 * messages from phone to device:
 * SET_MYID(id, human readable long, human readable short) (send down the unique ID
 * string used for this node, a human readable string shown for that id, and a very
 * short human readable string suitable for oled screen) SEND_OPAQUE(dest, payload)
 * (for signal messages or other applications) SEND_TEXT(dest, text) Get all
 * nodes() (returns list of nodes, with full info, last time seen, loc, battery
 * level etc) SET_CONFIG (switches device to a new set of radio params and
 * preshared key, drops all existing nodes, force our node to rejoin this new group)
 * Full information about a node on the mesh
 *
 * @generated from message meshtastic.NodeInfo
 */
type NodeInfo = Message<"meshtastic.NodeInfo"> & {
  /**
   *
   * The node number
   *
   * @generated from field: uint32 num = 1;
   */
  num: number;
  /**
   *
   * The user info for this node
   *
   * @generated from field: meshtastic.User user = 2;
   */
  user?: User;
  /**
   *
   * This position data. Note: before 1.2.14 we would also store the last time we've heard from this node in position.time, that is no longer true.
   * Position.time now indicates the last time we received a POSITION from that node.
   *
   * @generated from field: meshtastic.Position position = 3;
   */
  position?: Position;
  /**
   *
   * Returns the Signal-to-noise ratio (SNR) of the last received message,
   * as measured by the receiver. Return SNR of the last received message in dB
   *
   * @generated from field: float snr = 4;
   */
  snr: number;
  /**
   *
   * Set to indicate the last time we received a packet from this node
   *
   * @generated from field: fixed32 last_heard = 5;
   */
  lastHeard: number;
  /**
   *
   * The latest device metrics for the node.
   *
   * @generated from field: meshtastic.DeviceMetrics device_metrics = 6;
   */
  deviceMetrics?: DeviceMetrics;
  /**
   *
   * local channel index we heard that node on. Only populated if its not the default channel.
   *
   * @generated from field: uint32 channel = 7;
   */
  channel: number;
  /**
   *
   * True if we witnessed the node over MQTT instead of LoRA transport
   *
   * @generated from field: bool via_mqtt = 8;
   */
  viaMqtt: boolean;
  /**
   *
   * Number of hops away from us this node is (0 if direct neighbor)
   *
   * @generated from field: optional uint32 hops_away = 9;
   */
  hopsAway?: number;
  /**
   *
   * True if node is in our favorites list
   * Persists between NodeDB internal clean ups
   *
   * @generated from field: bool is_favorite = 10;
   */
  isFavorite: boolean;
  /**
   *
   * True if node is in our ignored list
   * Persists between NodeDB internal clean ups
   *
   * @generated from field: bool is_ignored = 11;
   */
  isIgnored: boolean;
  /**
   *
   * True if node public key has been verified.
   * Persists between NodeDB internal clean ups
   * LSB 0 of the bitfield
   *
   * @generated from field: bool is_key_manually_verified = 12;
   */
  isKeyManuallyVerified: boolean;
};
/**
 * Describes the message meshtastic.NodeInfo.
 * Use `create(NodeInfoSchema)` to create a new message.
 */
declare const NodeInfoSchema: GenMessage<NodeInfo>;
/**
 *
 * Unique local debugging info for this node
 * Note: we don't include position or the user info, because that will come in the
 * Sent to the phone in response to WantNodes.
 *
 * @generated from message meshtastic.MyNodeInfo
 */
type MyNodeInfo = Message<"meshtastic.MyNodeInfo"> & {
  /**
   *
   * Tells the phone what our node number is, default starting value is
   * lowbyte of macaddr, but it will be fixed if that is already in use
   *
   * @generated from field: uint32 my_node_num = 1;
   */
  myNodeNum: number;
  /**
   *
   * The total number of reboots this node has ever encountered
   * (well - since the last time we discarded preferences)
   *
   * @generated from field: uint32 reboot_count = 8;
   */
  rebootCount: number;
  /**
   *
   * The minimum app version that can talk to this device.
   * Phone/PC apps should compare this to their build number and if too low tell the user they must update their app
   *
   * @generated from field: uint32 min_app_version = 11;
   */
  minAppVersion: number;
  /**
   *
   * Unique hardware identifier for this device
   *
   * @generated from field: bytes device_id = 12;
   */
  deviceId: Uint8Array;
  /**
   *
   * The PlatformIO environment used to build this firmware
   *
   * @generated from field: string pio_env = 13;
   */
  pioEnv: string;
  /**
   *
   * The indicator for whether this device is running event firmware and which
   *
   * @generated from field: meshtastic.FirmwareEdition firmware_edition = 14;
   */
  firmwareEdition: FirmwareEdition;
  /**
   *
   * The number of nodes in the nodedb.
   * This is used by the phone to know how many NodeInfo packets to expect on want_config
   *
   * @generated from field: uint32 nodedb_count = 15;
   */
  nodedbCount: number;
};
/**
 * Describes the message meshtastic.MyNodeInfo.
 * Use `create(MyNodeInfoSchema)` to create a new message.
 */
declare const MyNodeInfoSchema: GenMessage<MyNodeInfo>;
/**
 *
 * Debug output from the device.
 * To minimize the size of records inside the device code, if a time/source/level is not set
 * on the message it is assumed to be a continuation of the previously sent message.
 * This allows the device code to use fixed maxlen 64 byte strings for messages,
 * and then extend as needed by emitting multiple records.
 *
 * @generated from message meshtastic.LogRecord
 */
type LogRecord = Message<"meshtastic.LogRecord"> & {
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from field: string message = 1;
   */
  message: string;
  /**
   *
   * Seconds since 1970 - or 0 for unknown/unset
   *
   * @generated from field: fixed32 time = 2;
   */
  time: number;
  /**
   *
   * Usually based on thread name - if known
   *
   * @generated from field: string source = 3;
   */
  source: string;
  /**
   *
   * Not yet set
   *
   * @generated from field: meshtastic.LogRecord.Level level = 4;
   */
  level: LogRecord_Level;
};
/**
 * Describes the message meshtastic.LogRecord.
 * Use `create(LogRecordSchema)` to create a new message.
 */
declare const LogRecordSchema: GenMessage<LogRecord>;
/**
 *
 * Log levels, chosen to match python logging conventions.
 *
 * @generated from enum meshtastic.LogRecord.Level
 */
declare enum LogRecord_Level {
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: CRITICAL = 50;
   */
  CRITICAL = 50,
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: ERROR = 40;
   */
  ERROR = 40,
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: WARNING = 30;
   */
  WARNING = 30,
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: INFO = 20;
   */
  INFO = 20,
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: DEBUG = 10;
   */
  DEBUG = 10,
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from enum value: TRACE = 5;
   */
  TRACE = 5,
}
/**
 * Describes the enum meshtastic.LogRecord.Level.
 */
declare const LogRecord_LevelSchema: GenEnum<LogRecord_Level>;
/**
 * @generated from message meshtastic.QueueStatus
 */
type QueueStatus = Message<"meshtastic.QueueStatus"> & {
  /**
   * Last attempt to queue status, ErrorCode
   *
   * @generated from field: int32 res = 1;
   */
  res: number;
  /**
   * Free entries in the outgoing queue
   *
   * @generated from field: uint32 free = 2;
   */
  free: number;
  /**
   * Maximum entries in the outgoing queue
   *
   * @generated from field: uint32 maxlen = 3;
   */
  maxlen: number;
  /**
   * What was mesh packet id that generated this response?
   *
   * @generated from field: uint32 mesh_packet_id = 4;
   */
  meshPacketId: number;
};
/**
 * Describes the message meshtastic.QueueStatus.
 * Use `create(QueueStatusSchema)` to create a new message.
 */
declare const QueueStatusSchema: GenMessage<QueueStatus>;
/**
 *
 * Packets from the radio to the phone will appear on the fromRadio characteristic.
 * It will support READ and NOTIFY. When a new packet arrives the device will BLE notify?
 * It will sit in that descriptor until consumed by the phone,
 * at which point the next item in the FIFO will be populated.
 *
 * @generated from message meshtastic.FromRadio
 */
type FromRadio = Message<"meshtastic.FromRadio"> & {
  /**
   *
   * The packet id, used to allow the phone to request missing read packets from the FIFO,
   * see our bluetooth docs
   *
   * @generated from field: uint32 id = 1;
   */
  id: number;
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from oneof meshtastic.FromRadio.payload_variant
   */
  payloadVariant: {
    /**
     *
     * Log levels, chosen to match python logging conventions.
     *
     * @generated from field: meshtastic.MeshPacket packet = 2;
     */
    value: MeshPacket;
    case: "packet";
  } | {
    /**
     *
     * Tells the phone what our node number is, can be -1 if we've not yet joined a mesh.
     * NOTE: This ID must not change - to keep (minimal) compatibility with <1.2 version of android apps.
     *
     * @generated from field: meshtastic.MyNodeInfo my_info = 3;
     */
    value: MyNodeInfo;
    case: "myInfo";
  } | {
    /**
     *
     * One packet is sent for each node in the on radio DB
     * starts over with the first node in our DB
     *
     * @generated from field: meshtastic.NodeInfo node_info = 4;
     */
    value: NodeInfo;
    case: "nodeInfo";
  } | {
    /**
     *
     * Include a part of the config (was: RadioConfig radio)
     *
     * @generated from field: meshtastic.Config config = 5;
     */
    value: Config;
    case: "config";
  } | {
    /**
     *
     * Set to send debug console output over our protobuf stream
     *
     * @generated from field: meshtastic.LogRecord log_record = 6;
     */
    value: LogRecord;
    case: "logRecord";
  } | {
    /**
     *
     * Sent as true once the device has finished sending all of the responses to want_config
     * recipient should check if this ID matches our original request nonce, if
     * not, it means your config responses haven't started yet.
     * NOTE: This ID must not change - to keep (minimal) compatibility with <1.2 version of android apps.
     *
     * @generated from field: uint32 config_complete_id = 7;
     */
    value: number;
    case: "configCompleteId";
  } | {
    /**
     *
     * Sent to tell clients the radio has just rebooted.
     * Set to true if present.
     * Not used on all transports, currently just used for the serial console.
     * NOTE: This ID must not change - to keep (minimal) compatibility with <1.2 version of android apps.
     *
     * @generated from field: bool rebooted = 8;
     */
    value: boolean;
    case: "rebooted";
  } | {
    /**
     *
     * Include module config
     *
     * @generated from field: meshtastic.ModuleConfig moduleConfig = 9;
     */
    value: ModuleConfig;
    case: "moduleConfig";
  } | {
    /**
     *
     * One packet is sent for each channel
     *
     * @generated from field: meshtastic.Channel channel = 10;
     */
    value: Channel;
    case: "channel";
  } | {
    /**
     *
     * Queue status info
     *
     * @generated from field: meshtastic.QueueStatus queueStatus = 11;
     */
    value: QueueStatus;
    case: "queueStatus";
  } | {
    /**
     *
     * File Transfer Chunk
     *
     * @generated from field: meshtastic.XModem xmodemPacket = 12;
     */
    value: XModem;
    case: "xmodemPacket";
  } | {
    /**
     *
     * Device metadata message
     *
     * @generated from field: meshtastic.DeviceMetadata metadata = 13;
     */
    value: DeviceMetadata;
    case: "metadata";
  } | {
    /**
     *
     * MQTT Client Proxy Message (device sending to client / phone for publishing to MQTT)
     *
     * @generated from field: meshtastic.MqttClientProxyMessage mqttClientProxyMessage = 14;
     */
    value: MqttClientProxyMessage;
    case: "mqttClientProxyMessage";
  } | {
    /**
     *
     * File system manifest messages
     *
     * @generated from field: meshtastic.FileInfo fileInfo = 15;
     */
    value: FileInfo;
    case: "fileInfo";
  } | {
    /**
     *
     * Notification message to the client
     *
     * @generated from field: meshtastic.ClientNotification clientNotification = 16;
     */
    value: ClientNotification;
    case: "clientNotification";
  } | {
    /**
     *
     * Persistent data for device-ui
     *
     * @generated from field: meshtastic.DeviceUIConfig deviceuiConfig = 17;
     */
    value: DeviceUIConfig;
    case: "deviceuiConfig";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.FromRadio.
 * Use `create(FromRadioSchema)` to create a new message.
 */
declare const FromRadioSchema: GenMessage<FromRadio>;
/**
 *
 * A notification message from the device to the client
 * To be used for important messages that should to be displayed to the user
 * in the form of push notifications or validation messages when saving
 * invalid configuration.
 *
 * @generated from message meshtastic.ClientNotification
 */
type ClientNotification = Message<"meshtastic.ClientNotification"> & {
  /**
   *
   * The id of the packet we're notifying in response to
   *
   * @generated from field: optional uint32 reply_id = 1;
   */
  replyId?: number;
  /**
   *
   * Seconds since 1970 - or 0 for unknown/unset
   *
   * @generated from field: fixed32 time = 2;
   */
  time: number;
  /**
   *
   * The level type of notification
   *
   * @generated from field: meshtastic.LogRecord.Level level = 3;
   */
  level: LogRecord_Level;
  /**
   *
   * The message body of the notification
   *
   * @generated from field: string message = 4;
   */
  message: string;
  /**
   * @generated from oneof meshtastic.ClientNotification.payload_variant
   */
  payloadVariant: {
    /**
     * @generated from field: meshtastic.KeyVerificationNumberInform key_verification_number_inform = 11;
     */
    value: KeyVerificationNumberInform;
    case: "keyVerificationNumberInform";
  } | {
    /**
     * @generated from field: meshtastic.KeyVerificationNumberRequest key_verification_number_request = 12;
     */
    value: KeyVerificationNumberRequest;
    case: "keyVerificationNumberRequest";
  } | {
    /**
     * @generated from field: meshtastic.KeyVerificationFinal key_verification_final = 13;
     */
    value: KeyVerificationFinal;
    case: "keyVerificationFinal";
  } | {
    /**
     * @generated from field: meshtastic.DuplicatedPublicKey duplicated_public_key = 14;
     */
    value: DuplicatedPublicKey;
    case: "duplicatedPublicKey";
  } | {
    /**
     * @generated from field: meshtastic.LowEntropyKey low_entropy_key = 15;
     */
    value: LowEntropyKey;
    case: "lowEntropyKey";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.ClientNotification.
 * Use `create(ClientNotificationSchema)` to create a new message.
 */
declare const ClientNotificationSchema: GenMessage<ClientNotification>;
/**
 * @generated from message meshtastic.KeyVerificationNumberInform
 */
type KeyVerificationNumberInform = Message<"meshtastic.KeyVerificationNumberInform"> & {
  /**
   * @generated from field: uint64 nonce = 1;
   */
  nonce: bigint;
  /**
   * @generated from field: string remote_longname = 2;
   */
  remoteLongname: string;
  /**
   * @generated from field: uint32 security_number = 3;
   */
  securityNumber: number;
};
/**
 * Describes the message meshtastic.KeyVerificationNumberInform.
 * Use `create(KeyVerificationNumberInformSchema)` to create a new message.
 */
declare const KeyVerificationNumberInformSchema: GenMessage<KeyVerificationNumberInform>;
/**
 * @generated from message meshtastic.KeyVerificationNumberRequest
 */
type KeyVerificationNumberRequest = Message<"meshtastic.KeyVerificationNumberRequest"> & {
  /**
   * @generated from field: uint64 nonce = 1;
   */
  nonce: bigint;
  /**
   * @generated from field: string remote_longname = 2;
   */
  remoteLongname: string;
};
/**
 * Describes the message meshtastic.KeyVerificationNumberRequest.
 * Use `create(KeyVerificationNumberRequestSchema)` to create a new message.
 */
declare const KeyVerificationNumberRequestSchema: GenMessage<KeyVerificationNumberRequest>;
/**
 * @generated from message meshtastic.KeyVerificationFinal
 */
type KeyVerificationFinal = Message<"meshtastic.KeyVerificationFinal"> & {
  /**
   * @generated from field: uint64 nonce = 1;
   */
  nonce: bigint;
  /**
   * @generated from field: string remote_longname = 2;
   */
  remoteLongname: string;
  /**
   * @generated from field: bool isSender = 3;
   */
  isSender: boolean;
  /**
   * @generated from field: string verification_characters = 4;
   */
  verificationCharacters: string;
};
/**
 * Describes the message meshtastic.KeyVerificationFinal.
 * Use `create(KeyVerificationFinalSchema)` to create a new message.
 */
declare const KeyVerificationFinalSchema: GenMessage<KeyVerificationFinal>;
/**
 * @generated from message meshtastic.DuplicatedPublicKey
 */
type DuplicatedPublicKey = Message<"meshtastic.DuplicatedPublicKey"> & {};
/**
 * Describes the message meshtastic.DuplicatedPublicKey.
 * Use `create(DuplicatedPublicKeySchema)` to create a new message.
 */
declare const DuplicatedPublicKeySchema: GenMessage<DuplicatedPublicKey>;
/**
 * @generated from message meshtastic.LowEntropyKey
 */
type LowEntropyKey = Message<"meshtastic.LowEntropyKey"> & {};
/**
 * Describes the message meshtastic.LowEntropyKey.
 * Use `create(LowEntropyKeySchema)` to create a new message.
 */
declare const LowEntropyKeySchema: GenMessage<LowEntropyKey>;
/**
 *
 * Individual File info for the device
 *
 * @generated from message meshtastic.FileInfo
 */
type FileInfo = Message<"meshtastic.FileInfo"> & {
  /**
   *
   * The fully qualified path of the file
   *
   * @generated from field: string file_name = 1;
   */
  fileName: string;
  /**
   *
   * The size of the file in bytes
   *
   * @generated from field: uint32 size_bytes = 2;
   */
  sizeBytes: number;
};
/**
 * Describes the message meshtastic.FileInfo.
 * Use `create(FileInfoSchema)` to create a new message.
 */
declare const FileInfoSchema: GenMessage<FileInfo>;
/**
 *
 * Packets/commands to the radio will be written (reliably) to the toRadio characteristic.
 * Once the write completes the phone can assume it is handled.
 *
 * @generated from message meshtastic.ToRadio
 */
type ToRadio = Message<"meshtastic.ToRadio"> & {
  /**
   *
   * Log levels, chosen to match python logging conventions.
   *
   * @generated from oneof meshtastic.ToRadio.payload_variant
   */
  payloadVariant: {
    /**
     *
     * Send this packet on the mesh
     *
     * @generated from field: meshtastic.MeshPacket packet = 1;
     */
    value: MeshPacket;
    case: "packet";
  } | {
    /**
     *
     * Phone wants radio to send full node db to the phone, This is
     * typically the first packet sent to the radio when the phone gets a
     * bluetooth connection. The radio will respond by sending back a
     * MyNodeInfo, a owner, a radio config and a series of
     * FromRadio.node_infos, and config_complete
     * the integer you write into this field will be reported back in the
     * config_complete_id response this allows clients to never be confused by
     * a stale old partially sent config.
     *
     * @generated from field: uint32 want_config_id = 3;
     */
    value: number;
    case: "wantConfigId";
  } | {
    /**
     *
     * Tell API server we are disconnecting now.
     * This is useful for serial links where there is no hardware/protocol based notification that the client has dropped the link.
     * (Sending this message is optional for clients)
     *
     * @generated from field: bool disconnect = 4;
     */
    value: boolean;
    case: "disconnect";
  } | {
    /**
     * @generated from field: meshtastic.XModem xmodemPacket = 5;
     */
    value: XModem;
    case: "xmodemPacket";
  } | {
    /**
     *
     * MQTT Client Proxy Message (for client / phone subscribed to MQTT sending to device)
     *
     * @generated from field: meshtastic.MqttClientProxyMessage mqttClientProxyMessage = 6;
     */
    value: MqttClientProxyMessage;
    case: "mqttClientProxyMessage";
  } | {
    /**
     *
     * Heartbeat message (used to keep the device connection awake on serial)
     *
     * @generated from field: meshtastic.Heartbeat heartbeat = 7;
     */
    value: Heartbeat;
    case: "heartbeat";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.ToRadio.
 * Use `create(ToRadioSchema)` to create a new message.
 */
declare const ToRadioSchema: GenMessage<ToRadio>;
/**
 *
 * Compressed message payload
 *
 * @generated from message meshtastic.Compressed
 */
type Compressed = Message<"meshtastic.Compressed"> & {
  /**
   *
   * PortNum to determine the how to handle the compressed payload.
   *
   * @generated from field: meshtastic.PortNum portnum = 1;
   */
  portnum: PortNum;
  /**
   *
   * Compressed data.
   *
   * @generated from field: bytes data = 2;
   */
  data: Uint8Array;
};
/**
 * Describes the message meshtastic.Compressed.
 * Use `create(CompressedSchema)` to create a new message.
 */
declare const CompressedSchema: GenMessage<Compressed>;
/**
 *
 * Full info on edges for a single node
 *
 * @generated from message meshtastic.NeighborInfo
 */
type NeighborInfo = Message<"meshtastic.NeighborInfo"> & {
  /**
   *
   * The node ID of the node sending info on its neighbors
   *
   * @generated from field: uint32 node_id = 1;
   */
  nodeId: number;
  /**
   *
   * Field to pass neighbor info for the next sending cycle
   *
   * @generated from field: uint32 last_sent_by_id = 2;
   */
  lastSentById: number;
  /**
   *
   * Broadcast interval of the represented node (in seconds)
   *
   * @generated from field: uint32 node_broadcast_interval_secs = 3;
   */
  nodeBroadcastIntervalSecs: number;
  /**
   *
   * The list of out edges from this node
   *
   * @generated from field: repeated meshtastic.Neighbor neighbors = 4;
   */
  neighbors: Neighbor[];
};
/**
 * Describes the message meshtastic.NeighborInfo.
 * Use `create(NeighborInfoSchema)` to create a new message.
 */
declare const NeighborInfoSchema: GenMessage<NeighborInfo>;
/**
 *
 * A single edge in the mesh
 *
 * @generated from message meshtastic.Neighbor
 */
type Neighbor = Message<"meshtastic.Neighbor"> & {
  /**
   *
   * Node ID of neighbor
   *
   * @generated from field: uint32 node_id = 1;
   */
  nodeId: number;
  /**
   *
   * SNR of last heard message
   *
   * @generated from field: float snr = 2;
   */
  snr: number;
  /**
   *
   * Reception time (in secs since 1970) of last message that was last sent by this ID.
   * Note: this is for local storage only and will not be sent out over the mesh.
   *
   * @generated from field: fixed32 last_rx_time = 3;
   */
  lastRxTime: number;
  /**
   *
   * Broadcast interval of this neighbor (in seconds).
   * Note: this is for local storage only and will not be sent out over the mesh.
   *
   * @generated from field: uint32 node_broadcast_interval_secs = 4;
   */
  nodeBroadcastIntervalSecs: number;
};
/**
 * Describes the message meshtastic.Neighbor.
 * Use `create(NeighborSchema)` to create a new message.
 */
declare const NeighborSchema: GenMessage<Neighbor>;
/**
 *
 * Device metadata response
 *
 * @generated from message meshtastic.DeviceMetadata
 */
type DeviceMetadata = Message<"meshtastic.DeviceMetadata"> & {
  /**
   *
   * Device firmware version string
   *
   * @generated from field: string firmware_version = 1;
   */
  firmwareVersion: string;
  /**
   *
   * Device state version
   *
   * @generated from field: uint32 device_state_version = 2;
   */
  deviceStateVersion: number;
  /**
   *
   * Indicates whether the device can shutdown CPU natively or via power management chip
   *
   * @generated from field: bool canShutdown = 3;
   */
  canShutdown: boolean;
  /**
   *
   * Indicates that the device has native wifi capability
   *
   * @generated from field: bool hasWifi = 4;
   */
  hasWifi: boolean;
  /**
   *
   * Indicates that the device has native bluetooth capability
   *
   * @generated from field: bool hasBluetooth = 5;
   */
  hasBluetooth: boolean;
  /**
   *
   * Indicates that the device has an ethernet peripheral
   *
   * @generated from field: bool hasEthernet = 6;
   */
  hasEthernet: boolean;
  /**
   *
   * Indicates that the device's role in the mesh
   *
   * @generated from field: meshtastic.Config.DeviceConfig.Role role = 7;
   */
  role: Config_DeviceConfig_Role;
  /**
   *
   * Indicates the device's current enabled position flags
   *
   * @generated from field: uint32 position_flags = 8;
   */
  positionFlags: number;
  /**
   *
   * Device hardware model
   *
   * @generated from field: meshtastic.HardwareModel hw_model = 9;
   */
  hwModel: HardwareModel;
  /**
   *
   * Has Remote Hardware enabled
   *
   * @generated from field: bool hasRemoteHardware = 10;
   */
  hasRemoteHardware: boolean;
  /**
   *
   * Has PKC capabilities
   *
   * @generated from field: bool hasPKC = 11;
   */
  hasPKC: boolean;
  /**
   *
   * Bit field of boolean for excluded modules
   * (bitwise OR of ExcludedModules)
   *
   * @generated from field: uint32 excluded_modules = 12;
   */
  excludedModules: number;
};
/**
 * Describes the message meshtastic.DeviceMetadata.
 * Use `create(DeviceMetadataSchema)` to create a new message.
 */
declare const DeviceMetadataSchema: GenMessage<DeviceMetadata>;
/**
 *
 * A heartbeat message is sent to the node from the client to keep the connection alive.
 * This is currently only needed to keep serial connections alive, but can be used by any PhoneAPI.
 *
 * @generated from message meshtastic.Heartbeat
 */
type Heartbeat = Message<"meshtastic.Heartbeat"> & {
  /**
   *
   * The nonce of the heartbeat message
   *
   * @generated from field: uint32 nonce = 1;
   */
  nonce: number;
};
/**
 * Describes the message meshtastic.Heartbeat.
 * Use `create(HeartbeatSchema)` to create a new message.
 */
declare const HeartbeatSchema: GenMessage<Heartbeat>;
/**
 *
 * RemoteHardwarePins associated with a node
 *
 * @generated from message meshtastic.NodeRemoteHardwarePin
 */
type NodeRemoteHardwarePin = Message<"meshtastic.NodeRemoteHardwarePin"> & {
  /**
   *
   * The node_num exposing the available gpio pin
   *
   * @generated from field: uint32 node_num = 1;
   */
  nodeNum: number;
  /**
   *
   * The the available gpio pin for usage with RemoteHardware module
   *
   * @generated from field: meshtastic.RemoteHardwarePin pin = 2;
   */
  pin?: RemoteHardwarePin;
};
/**
 * Describes the message meshtastic.NodeRemoteHardwarePin.
 * Use `create(NodeRemoteHardwarePinSchema)` to create a new message.
 */
declare const NodeRemoteHardwarePinSchema: GenMessage<NodeRemoteHardwarePin>;
/**
 * @generated from message meshtastic.ChunkedPayload
 */
type ChunkedPayload = Message<"meshtastic.ChunkedPayload"> & {
  /**
   *
   * The ID of the entire payload
   *
   * @generated from field: uint32 payload_id = 1;
   */
  payloadId: number;
  /**
   *
   * The total number of chunks in the payload
   *
   * @generated from field: uint32 chunk_count = 2;
   */
  chunkCount: number;
  /**
   *
   * The current chunk index in the total
   *
   * @generated from field: uint32 chunk_index = 3;
   */
  chunkIndex: number;
  /**
   *
   * The binary data of the current chunk
   *
   * @generated from field: bytes payload_chunk = 4;
   */
  payloadChunk: Uint8Array;
};
/**
 * Describes the message meshtastic.ChunkedPayload.
 * Use `create(ChunkedPayloadSchema)` to create a new message.
 */
declare const ChunkedPayloadSchema: GenMessage<ChunkedPayload>;
/**
 *
 * Wrapper message for broken repeated oneof support
 *
 * @generated from message meshtastic.resend_chunks
 */
type resend_chunks = Message<"meshtastic.resend_chunks"> & {
  /**
   * @generated from field: repeated uint32 chunks = 1;
   */
  chunks: number[];
};
/**
 * Describes the message meshtastic.resend_chunks.
 * Use `create(resend_chunksSchema)` to create a new message.
 */
declare const resend_chunksSchema: GenMessage<resend_chunks>;
/**
 *
 * Responses to a ChunkedPayload request
 *
 * @generated from message meshtastic.ChunkedPayloadResponse
 */
type ChunkedPayloadResponse = Message<"meshtastic.ChunkedPayloadResponse"> & {
  /**
   *
   * The ID of the entire payload
   *
   * @generated from field: uint32 payload_id = 1;
   */
  payloadId: number;
  /**
   * @generated from oneof meshtastic.ChunkedPayloadResponse.payload_variant
   */
  payloadVariant: {
    /**
     *
     * Request to transfer chunked payload
     *
     * @generated from field: bool request_transfer = 2;
     */
    value: boolean;
    case: "requestTransfer";
  } | {
    /**
     *
     * Accept the transfer chunked payload
     *
     * @generated from field: bool accept_transfer = 3;
     */
    value: boolean;
    case: "acceptTransfer";
  } | {
    /**
     *
     * Request missing indexes in the chunked payload
     *
     * @generated from field: meshtastic.resend_chunks resend_chunks = 4;
     */
    value: resend_chunks;
    case: "resendChunks";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.ChunkedPayloadResponse.
 * Use `create(ChunkedPayloadResponseSchema)` to create a new message.
 */
declare const ChunkedPayloadResponseSchema: GenMessage<ChunkedPayloadResponse>;
/**
 *
 * Note: these enum names must EXACTLY match the string used in the device
 * bin/build-all.sh script.
 * Because they will be used to find firmware filenames in the android app for OTA updates.
 * To match the old style filenames, _ is converted to -, p is converted to .
 *
 * @generated from enum meshtastic.HardwareModel
 */
declare enum HardwareModel {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TLORA_V2 = 1;
   */
  TLORA_V2 = 1,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TLORA_V1 = 2;
   */
  TLORA_V1 = 2,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TLORA_V2_1_1P6 = 3;
   */
  TLORA_V2_1_1P6 = 3,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TBEAM = 4;
   */
  TBEAM = 4,
  /**
   *
   * The original heltec WiFi_Lora_32_V2, which had battery voltage sensing hooked to GPIO 13
   * (see HELTEC_V2 for the new version).
   *
   * @generated from enum value: HELTEC_V2_0 = 5;
   */
  HELTEC_V2_0 = 5,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TBEAM_V0P7 = 6;
   */
  TBEAM_V0P7 = 6,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: T_ECHO = 7;
   */
  T_ECHO = 7,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TLORA_V1_1P3 = 8;
   */
  TLORA_V1_1P3 = 8,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: RAK4631 = 9;
   */
  RAK4631 = 9,
  /**
   *
   * The new version of the heltec WiFi_Lora_32_V2 board that has battery sensing hooked to GPIO 37.
   * Sadly they did not update anything on the silkscreen to identify this board
   *
   * @generated from enum value: HELTEC_V2_1 = 10;
   */
  HELTEC_V2_1 = 10,
  /**
   *
   * Ancient heltec WiFi_Lora_32 board
   *
   * @generated from enum value: HELTEC_V1 = 11;
   */
  HELTEC_V1 = 11,
  /**
   *
   * New T-BEAM with ESP32-S3 CPU
   *
   * @generated from enum value: LILYGO_TBEAM_S3_CORE = 12;
   */
  LILYGO_TBEAM_S3_CORE = 12,
  /**
   *
   * RAK WisBlock ESP32 core: https://docs.rakwireless.com/Product-Categories/WisBlock/RAK11200/Overview/
   *
   * @generated from enum value: RAK11200 = 13;
   */
  RAK11200 = 13,
  /**
   *
   * B&Q Consulting Nano Edition G1: https://uniteng.com/wiki/doku.php?id=meshtastic:nano
   *
   * @generated from enum value: NANO_G1 = 14;
   */
  NANO_G1 = 14,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TLORA_V2_1_1P8 = 15;
   */
  TLORA_V2_1_1P8 = 15,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TLORA_T3_S3 = 16;
   */
  TLORA_T3_S3 = 16,
  /**
   *
   * B&Q Consulting Nano G1 Explorer: https://wiki.uniteng.com/en/meshtastic/nano-g1-explorer
   *
   * @generated from enum value: NANO_G1_EXPLORER = 17;
   */
  NANO_G1_EXPLORER = 17,
  /**
   *
   * B&Q Consulting Nano G2 Ultra: https://wiki.uniteng.com/en/meshtastic/nano-g2-ultra
   *
   * @generated from enum value: NANO_G2_ULTRA = 18;
   */
  NANO_G2_ULTRA = 18,
  /**
   *
   * LoRAType device: https://loratype.org/
   *
   * @generated from enum value: LORA_TYPE = 19;
   */
  LORA_TYPE = 19,
  /**
   *
   * wiphone https://www.wiphone.io/
   *
   * @generated from enum value: WIPHONE = 20;
   */
  WIPHONE = 20,
  /**
   *
   * WIO Tracker WM1110 family from Seeed Studio. Includes wio-1110-tracker and wio-1110-sdk
   *
   * @generated from enum value: WIO_WM1110 = 21;
   */
  WIO_WM1110 = 21,
  /**
   *
   * RAK2560 Solar base station based on RAK4630
   *
   * @generated from enum value: RAK2560 = 22;
   */
  RAK2560 = 22,
  /**
   *
   * Heltec HRU-3601: https://heltec.org/project/hru-3601/
   *
   * @generated from enum value: HELTEC_HRU_3601 = 23;
   */
  HELTEC_HRU_3601 = 23,
  /**
   *
   * Heltec Wireless Bridge
   *
   * @generated from enum value: HELTEC_WIRELESS_BRIDGE = 24;
   */
  HELTEC_WIRELESS_BRIDGE = 24,
  /**
   *
   * B&Q Consulting Station Edition G1: https://uniteng.com/wiki/doku.php?id=meshtastic:station
   *
   * @generated from enum value: STATION_G1 = 25;
   */
  STATION_G1 = 25,
  /**
   *
   * RAK11310 (RP2040 + SX1262)
   *
   * @generated from enum value: RAK11310 = 26;
   */
  RAK11310 = 26,
  /**
   *
   * Makerfabs SenseLoRA Receiver (RP2040 + RFM96)
   *
   * @generated from enum value: SENSELORA_RP2040 = 27;
   */
  SENSELORA_RP2040 = 27,
  /**
   *
   * Makerfabs SenseLoRA Industrial Monitor (ESP32-S3 + RFM96)
   *
   * @generated from enum value: SENSELORA_S3 = 28;
   */
  SENSELORA_S3 = 28,
  /**
   *
   * Canary Radio Company - CanaryOne: https://canaryradio.io/products/canaryone
   *
   * @generated from enum value: CANARYONE = 29;
   */
  CANARYONE = 29,
  /**
   *
   * Waveshare RP2040 LoRa - https://www.waveshare.com/rp2040-lora.htm
   *
   * @generated from enum value: RP2040_LORA = 30;
   */
  RP2040_LORA = 30,
  /**
   *
   * B&Q Consulting Station G2: https://wiki.uniteng.com/en/meshtastic/station-g2
   *
   * @generated from enum value: STATION_G2 = 31;
   */
  STATION_G2 = 31,
  /**
   *
   * ---------------------------------------------------------------------------
   * Less common/prototype boards listed here (needs one more byte over the air)
   * ---------------------------------------------------------------------------
   *
   * @generated from enum value: LORA_RELAY_V1 = 32;
   */
  LORA_RELAY_V1 = 32,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: NRF52840DK = 33;
   */
  NRF52840DK = 33,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: PPR = 34;
   */
  PPR = 34,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: GENIEBLOCKS = 35;
   */
  GENIEBLOCKS = 35,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: NRF52_UNKNOWN = 36;
   */
  NRF52_UNKNOWN = 36,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: PORTDUINO = 37;
   */
  PORTDUINO = 37,
  /**
   *
   * The simulator built into the android app
   *
   * @generated from enum value: ANDROID_SIM = 38;
   */
  ANDROID_SIM = 38,
  /**
   *
   * Custom DIY device based on @NanoVHF schematics: https://github.com/NanoVHF/Meshtastic-DIY/tree/main/Schematics
   *
   * @generated from enum value: DIY_V1 = 39;
   */
  DIY_V1 = 39,
  /**
   *
   * nRF52840 Dongle : https://www.nordicsemi.com/Products/Development-hardware/nrf52840-dongle/
   *
   * @generated from enum value: NRF52840_PCA10059 = 40;
   */
  NRF52840_PCA10059 = 40,
  /**
   *
   * Custom Disaster Radio esp32 v3 device https://github.com/sudomesh/disaster-radio/tree/master/hardware/board_esp32_v3
   *
   * @generated from enum value: DR_DEV = 41;
   */
  DR_DEV = 41,
  /**
   *
   * M5 esp32 based MCU modules with enclosure, TFT and LORA Shields. All Variants (Basic, Core, Fire, Core2, CoreS3, Paper) https://m5stack.com/
   *
   * @generated from enum value: M5STACK = 42;
   */
  M5STACK = 42,
  /**
   *
   * New Heltec LoRA32 with ESP32-S3 CPU
   *
   * @generated from enum value: HELTEC_V3 = 43;
   */
  HELTEC_V3 = 43,
  /**
   *
   * New Heltec Wireless Stick Lite with ESP32-S3 CPU
   *
   * @generated from enum value: HELTEC_WSL_V3 = 44;
   */
  HELTEC_WSL_V3 = 44,
  /**
   *
   * New BETAFPV ELRS Micro TX Module 2.4G with ESP32 CPU
   *
   * @generated from enum value: BETAFPV_2400_TX = 45;
   */
  BETAFPV_2400_TX = 45,
  /**
   *
   * BetaFPV ExpressLRS "Nano" TX Module 900MHz with ESP32 CPU
   *
   * @generated from enum value: BETAFPV_900_NANO_TX = 46;
   */
  BETAFPV_900_NANO_TX = 46,
  /**
   *
   * Raspberry Pi Pico (W) with Waveshare SX1262 LoRa Node Module
   *
   * @generated from enum value: RPI_PICO = 47;
   */
  RPI_PICO = 47,
  /**
   *
   * Heltec Wireless Tracker with ESP32-S3 CPU, built-in GPS, and TFT
   * Newer V1.1, version is written on the PCB near the display.
   *
   * @generated from enum value: HELTEC_WIRELESS_TRACKER = 48;
   */
  HELTEC_WIRELESS_TRACKER = 48,
  /**
   *
   * Heltec Wireless Paper with ESP32-S3 CPU and E-Ink display
   *
   * @generated from enum value: HELTEC_WIRELESS_PAPER = 49;
   */
  HELTEC_WIRELESS_PAPER = 49,
  /**
   *
   * LilyGo T-Deck with ESP32-S3 CPU, Keyboard and IPS display
   *
   * @generated from enum value: T_DECK = 50;
   */
  T_DECK = 50,
  /**
   *
   * LilyGo T-Watch S3 with ESP32-S3 CPU and IPS display
   *
   * @generated from enum value: T_WATCH_S3 = 51;
   */
  T_WATCH_S3 = 51,
  /**
   *
   * Bobricius Picomputer with ESP32-S3 CPU, Keyboard and IPS display
   *
   * @generated from enum value: PICOMPUTER_S3 = 52;
   */
  PICOMPUTER_S3 = 52,
  /**
   *
   * Heltec HT-CT62 with ESP32-C3 CPU and SX1262 LoRa
   *
   * @generated from enum value: HELTEC_HT62 = 53;
   */
  HELTEC_HT62 = 53,
  /**
   *
   * EBYTE SPI LoRa module and ESP32-S3
   *
   * @generated from enum value: EBYTE_ESP32_S3 = 54;
   */
  EBYTE_ESP32_S3 = 54,
  /**
   *
   * Waveshare ESP32-S3-PICO with PICO LoRa HAT and 2.9inch e-Ink
   *
   * @generated from enum value: ESP32_S3_PICO = 55;
   */
  ESP32_S3_PICO = 55,
  /**
   *
   * CircuitMess Chatter 2 LLCC68 Lora Module and ESP32 Wroom
   * Lora module can be swapped out for a Heltec RA-62 which is "almost" pin compatible
   * with one cut and one jumper Meshtastic works
   *
   * @generated from enum value: CHATTER_2 = 56;
   */
  CHATTER_2 = 56,
  /**
   *
   * Heltec Wireless Paper, With ESP32-S3 CPU and E-Ink display
   * Older "V1.0" Variant, has no "version sticker"
   * E-Ink model is DEPG0213BNS800
   * Tab on the screen protector is RED
   * Flex connector marking is FPC-7528B
   *
   * @generated from enum value: HELTEC_WIRELESS_PAPER_V1_0 = 57;
   */
  HELTEC_WIRELESS_PAPER_V1_0 = 57,
  /**
   *
   * Heltec Wireless Tracker with ESP32-S3 CPU, built-in GPS, and TFT
   * Older "V1.0" Variant
   *
   * @generated from enum value: HELTEC_WIRELESS_TRACKER_V1_0 = 58;
   */
  HELTEC_WIRELESS_TRACKER_V1_0 = 58,
  /**
   *
   * unPhone with ESP32-S3, TFT touchscreen,  LSM6DS3TR-C accelerometer and gyroscope
   *
   * @generated from enum value: UNPHONE = 59;
   */
  UNPHONE = 59,
  /**
   *
   * Teledatics TD-LORAC NRF52840 based M.2 LoRA module
   * Compatible with the TD-WRLS development board
   *
   * @generated from enum value: TD_LORAC = 60;
   */
  TD_LORAC = 60,
  /**
   *
   * CDEBYTE EoRa-S3 board using their own MM modules, clone of LILYGO T3S3
   *
   * @generated from enum value: CDEBYTE_EORA_S3 = 61;
   */
  CDEBYTE_EORA_S3 = 61,
  /**
   *
   * TWC_MESH_V4
   * Adafruit NRF52840 feather express with SX1262, SSD1306 OLED and NEO6M GPS
   *
   * @generated from enum value: TWC_MESH_V4 = 62;
   */
  TWC_MESH_V4 = 62,
  /**
   *
   * NRF52_PROMICRO_DIY
   * Promicro NRF52840 with SX1262/LLCC68, SSD1306 OLED and NEO6M GPS
   *
   * @generated from enum value: NRF52_PROMICRO_DIY = 63;
   */
  NRF52_PROMICRO_DIY = 63,
  /**
   *
   * RadioMaster 900 Bandit Nano, https://www.radiomasterrc.com/products/bandit-nano-expresslrs-rf-module
   * ESP32-D0WDQ6 With SX1276/SKY66122, SSD1306 OLED and No GPS
   *
   * @generated from enum value: RADIOMASTER_900_BANDIT_NANO = 64;
   */
  RADIOMASTER_900_BANDIT_NANO = 64,
  /**
   *
   * Heltec Capsule Sensor V3 with ESP32-S3 CPU, Portable LoRa device that can replace GNSS modules or sensors
   *
   * @generated from enum value: HELTEC_CAPSULE_SENSOR_V3 = 65;
   */
  HELTEC_CAPSULE_SENSOR_V3 = 65,
  /**
   *
   * Heltec Vision Master T190 with ESP32-S3 CPU, and a 1.90 inch TFT display
   *
   * @generated from enum value: HELTEC_VISION_MASTER_T190 = 66;
   */
  HELTEC_VISION_MASTER_T190 = 66,
  /**
   *
   * Heltec Vision Master E213 with ESP32-S3 CPU, and a 2.13 inch E-Ink display
   *
   * @generated from enum value: HELTEC_VISION_MASTER_E213 = 67;
   */
  HELTEC_VISION_MASTER_E213 = 67,
  /**
   *
   * Heltec Vision Master E290 with ESP32-S3 CPU, and a 2.9 inch E-Ink display
   *
   * @generated from enum value: HELTEC_VISION_MASTER_E290 = 68;
   */
  HELTEC_VISION_MASTER_E290 = 68,
  /**
   *
   * Heltec Mesh Node T114 board with nRF52840 CPU, and a 1.14 inch TFT display, Ultimate low-power design,
   * specifically adapted for the Meshtatic project
   *
   * @generated from enum value: HELTEC_MESH_NODE_T114 = 69;
   */
  HELTEC_MESH_NODE_T114 = 69,
  /**
   *
   * Sensecap Indicator from Seeed Studio. ESP32-S3 device with TFT and RP2040 coprocessor
   *
   * @generated from enum value: SENSECAP_INDICATOR = 70;
   */
  SENSECAP_INDICATOR = 70,
  /**
   *
   * Seeed studio T1000-E tracker card. NRF52840 w/ LR1110 radio, GPS, button, buzzer, and sensors.
   *
   * @generated from enum value: TRACKER_T1000_E = 71;
   */
  TRACKER_T1000_E = 71,
  /**
   *
   * RAK3172 STM32WLE5 Module (https://store.rakwireless.com/products/wisduo-lpwan-module-rak3172)
   *
   * @generated from enum value: RAK3172 = 72;
   */
  RAK3172 = 72,
  /**
   *
   * Seeed Studio Wio-E5 (either mini or Dev kit) using STM32WL chip.
   *
   * @generated from enum value: WIO_E5 = 73;
   */
  WIO_E5 = 73,
  /**
   *
   * RadioMaster 900 Bandit, https://www.radiomasterrc.com/products/bandit-expresslrs-rf-module
   * SSD1306 OLED and No GPS
   *
   * @generated from enum value: RADIOMASTER_900_BANDIT = 74;
   */
  RADIOMASTER_900_BANDIT = 74,
  /**
   *
   * Minewsemi ME25LS01 (ME25LE01_V1.0). NRF52840 w/ LR1110 radio, buttons and leds and pins.
   *
   * @generated from enum value: ME25LS01_4Y10TD = 75;
   */
  ME25LS01_4Y10TD = 75,
  /**
   *
   * RP2040_FEATHER_RFM95
   * Adafruit Feather RP2040 with RFM95 LoRa Radio RFM95 with SX1272, SSD1306 OLED
   * https://www.adafruit.com/product/5714
   * https://www.adafruit.com/product/326
   * https://www.adafruit.com/product/938
   *  ^^^ short A0 to switch to I2C address 0x3C
   *
   *
   * @generated from enum value: RP2040_FEATHER_RFM95 = 76;
   */
  RP2040_FEATHER_RFM95 = 76,
  /**
   * M5 esp32 based MCU modules with enclosure, TFT and LORA Shields. All Variants (Basic, Core, Fire, Core2, CoreS3, Paper) https://m5stack.com/
   *
   * @generated from enum value: M5STACK_COREBASIC = 77;
   */
  M5STACK_COREBASIC = 77,
  /**
   * @generated from enum value: M5STACK_CORE2 = 78;
   */
  M5STACK_CORE2 = 78,
  /**
   * Pico2 with Waveshare Hat, same as Pico
   *
   * @generated from enum value: RPI_PICO2 = 79;
   */
  RPI_PICO2 = 79,
  /**
   * M5 esp32 based MCU modules with enclosure, TFT and LORA Shields. All Variants (Basic, Core, Fire, Core2, CoreS3, Paper) https://m5stack.com/
   *
   * @generated from enum value: M5STACK_CORES3 = 80;
   */
  M5STACK_CORES3 = 80,
  /**
   * Seeed XIAO S3 DK
   *
   * @generated from enum value: SEEED_XIAO_S3 = 81;
   */
  SEEED_XIAO_S3 = 81,
  /**
   *
   * Nordic nRF52840+Semtech SX1262 LoRa BLE Combo Module. nRF52840+SX1262 MS24SF1
   *
   * @generated from enum value: MS24SF1 = 82;
   */
  MS24SF1 = 82,
  /**
   *
   * Lilygo TLora-C6 with the new ESP32-C6 MCU
   *
   * @generated from enum value: TLORA_C6 = 83;
   */
  TLORA_C6 = 83,
  /**
   *
   * WisMesh Tap
   * RAK-4631 w/ TFT in injection modled case
   *
   * @generated from enum value: WISMESH_TAP = 84;
   */
  WISMESH_TAP = 84,
  /**
   *
   * Similar to PORTDUINO but used by Routastic devices, this is not any
   * particular device and does not run Meshtastic's code but supports
   * the same frame format.
   * Runs on linux, see https://github.com/Jorropo/routastic
   *
   * @generated from enum value: ROUTASTIC = 85;
   */
  ROUTASTIC = 85,
  /**
   *
   * Mesh-Tab, esp32 based
   * https://github.com/valzzu/Mesh-Tab
   *
   * @generated from enum value: MESH_TAB = 86;
   */
  MESH_TAB = 86,
  /**
   *
   * MeshLink board developed by LoraItalia. NRF52840, eByte E22900M22S (Will also come with other frequencies), 25w MPPT solar charger (5v,12v,18v selectable), support for gps, buzzer, oled or e-ink display, 10 gpios, hardware watchdog
   * https://www.loraitalia.it
   *
   * @generated from enum value: MESHLINK = 87;
   */
  MESHLINK = 87,
  /**
   *
   * Seeed XIAO nRF52840 + Wio SX1262 kit
   *
   * @generated from enum value: XIAO_NRF52_KIT = 88;
   */
  XIAO_NRF52_KIT = 88,
  /**
   *
   * Elecrow ThinkNode M1 & M2
   * https://www.elecrow.com/wiki/ThinkNode-M1_Transceiver_Device(Meshtastic)_Power_By_nRF52840.html
   * https://www.elecrow.com/wiki/ThinkNode-M2_Transceiver_Device(Meshtastic)_Power_By_NRF52840.html (this actually uses ESP32-S3)
   *
   * @generated from enum value: THINKNODE_M1 = 89;
   */
  THINKNODE_M1 = 89,
  /**
   * @generated from enum value: THINKNODE_M2 = 90;
   */
  THINKNODE_M2 = 90,
  /**
   *
   * Lilygo T-ETH-Elite
   *
   * @generated from enum value: T_ETH_ELITE = 91;
   */
  T_ETH_ELITE = 91,
  /**
   *
   * Heltec HRI-3621 industrial probe
   *
   * @generated from enum value: HELTEC_SENSOR_HUB = 92;
   */
  HELTEC_SENSOR_HUB = 92,
  /**
   *
   * Reserved Fried Chicken ID for future use
   *
   * @generated from enum value: RESERVED_FRIED_CHICKEN = 93;
   */
  RESERVED_FRIED_CHICKEN = 93,
  /**
   *
   * Heltec Magnetic Power Bank with Meshtastic compatible
   *
   * @generated from enum value: HELTEC_MESH_POCKET = 94;
   */
  HELTEC_MESH_POCKET = 94,
  /**
   *
   * Seeed Solar Node
   *
   * @generated from enum value: SEEED_SOLAR_NODE = 95;
   */
  SEEED_SOLAR_NODE = 95,
  /**
   *
   * NomadStar Meteor Pro https://nomadstar.ch/
   *
   * @generated from enum value: NOMADSTAR_METEOR_PRO = 96;
   */
  NOMADSTAR_METEOR_PRO = 96,
  /**
   *
   * Elecrow CrowPanel Advance models, ESP32-S3 and TFT with SX1262 radio plugin
   *
   * @generated from enum value: CROWPANEL = 97;
   */
  CROWPANEL = 97,
  /**
   *
   * Lilygo LINK32 board with sensors
   *
   * @generated from enum value: LINK_32 = 98;
   */
  LINK_32 = 98,
  /**
   *
   * Seeed Tracker L1
   *
   * @generated from enum value: SEEED_WIO_TRACKER_L1 = 99;
   */
  SEEED_WIO_TRACKER_L1 = 99,
  /**
   *
   * Seeed Tracker L1 EINK driver
   *
   * @generated from enum value: SEEED_WIO_TRACKER_L1_EINK = 100;
   */
  SEEED_WIO_TRACKER_L1_EINK = 100,
  /**
   *
   * Muzi Works R1 Neo
   *
   * @generated from enum value: MUZI_R1_NEO = 101;
   */
  MUZI_R1_NEO = 101,
  /**
   *
   * Lilygo T-Deck Pro
   *
   * @generated from enum value: T_DECK_PRO = 102;
   */
  T_DECK_PRO = 102,
  /**
   *
   * Lilygo TLora Pager
   *
   * @generated from enum value: T_LORA_PAGER = 103;
   */
  T_LORA_PAGER = 103,
  /**
   *
   * M5Stack Reserved
   *
   * 0x68
   *
   * @generated from enum value: M5STACK_RESERVED = 104;
   */
  M5STACK_RESERVED = 104,
  /**
   *
   * RAKwireless WisMesh Tag
   *
   * @generated from enum value: WISMESH_TAG = 105;
   */
  WISMESH_TAG = 105,
  /**
   *
   * RAKwireless WisBlock Core RAK3312 https://docs.rakwireless.com/product-categories/wisduo/rak3112-module/overview/
   *
   * @generated from enum value: RAK3312 = 106;
   */
  RAK3312 = 106,
  /**
   *
   * Elecrow ThinkNode M5 https://www.elecrow.com/wiki/ThinkNode_M5_Meshtastic_LoRa_Signal_Transceiver_ESP32-S3.html
   *
   * @generated from enum value: THINKNODE_M5 = 107;
   */
  THINKNODE_M5 = 107,
  /**
   *
   * MeshSolar is an integrated power management and communication solution designed for outdoor low-power devices.
   * https://heltec.org/project/meshsolar/
   *
   * @generated from enum value: HELTEC_MESH_SOLAR = 108;
   */
  HELTEC_MESH_SOLAR = 108,
  /**
   *
   * Lilygo T-Echo Lite
   *
   * @generated from enum value: T_ECHO_LITE = 109;
   */
  T_ECHO_LITE = 109,
  /**
   *
   * New Heltec LoRA32 with ESP32-S3 CPU
   *
   * @generated from enum value: HELTEC_V4 = 110;
   */
  HELTEC_V4 = 110,
  /**
   *
   * M5Stack C6L
   *
   * @generated from enum value: M5STACK_C6L = 111;
   */
  M5STACK_C6L = 111,
  /**
   *
   * M5Stack Cardputer Adv
   *
   * @generated from enum value: M5STACK_CARDPUTER_ADV = 112;
   */
  M5STACK_CARDPUTER_ADV = 112,
  /**
   *
   * ESP32S3 main controller with GPS and TFT screen.
   *
   * @generated from enum value: HELTEC_WIRELESS_TRACKER_V2 = 113;
   */
  HELTEC_WIRELESS_TRACKER_V2 = 113,
  /**
   *
   * LilyGo T-Watch Ultra
   *
   * @generated from enum value: T_WATCH_ULTRA = 114;
   */
  T_WATCH_ULTRA = 114,
  /**
   *
   * Elecrow ThinkNode M3
   *
   * @generated from enum value: THINKNODE_M3 = 115;
   */
  THINKNODE_M3 = 115,
  /**
   *
   * RAK WISMESH_TAP_V2 with ESP32-S3 CPU
   *
   * @generated from enum value: WISMESH_TAP_V2 = 116;
   */
  WISMESH_TAP_V2 = 116,
  /**
   *
   * RAK3401
   *
   * @generated from enum value: RAK3401 = 117;
   */
  RAK3401 = 117,
  /**
   *
   * ------------------------------------------------------------------------------------------------------------------------------------------
   * Reserved ID For developing private Ports. These will show up in live traffic sparsely, so we can use a high number. Keep it within 8 bits.
   * ------------------------------------------------------------------------------------------------------------------------------------------
   *
   * @generated from enum value: PRIVATE_HW = 255;
   */
  PRIVATE_HW = 255,
}
/**
 * Describes the enum meshtastic.HardwareModel.
 */
declare const HardwareModelSchema: GenEnum<HardwareModel>;
/**
 *
 * Shared constants between device and phone
 *
 * @generated from enum meshtastic.Constants
 */
declare enum Constants {
  /**
   *
   * First enum must be zero, and we are just using this enum to
   * pass int constants between two very different environments
   *
   * @generated from enum value: ZERO = 0;
   */
  ZERO = 0,
  /**
   *
   * From mesh.options
   * note: this payload length is ONLY the bytes that are sent inside of the Data protobuf (excluding protobuf overhead). The 16 byte header is
   * outside of this envelope
   *
   * @generated from enum value: DATA_PAYLOAD_LEN = 233;
   */
  DATA_PAYLOAD_LEN = 233,
}
/**
 * Describes the enum meshtastic.Constants.
 */
declare const ConstantsSchema: GenEnum<Constants>;
/**
 *
 * Error codes for critical errors
 * The device might report these fault codes on the screen.
 * If you encounter a fault code, please post on the meshtastic.discourse.group
 * and we'll try to help.
 *
 * @generated from enum meshtastic.CriticalErrorCode
 */
declare enum CriticalErrorCode {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: NONE = 0;
   */
  NONE = 0,
  /**
   *
   * A software bug was detected while trying to send lora
   *
   * @generated from enum value: TX_WATCHDOG = 1;
   */
  TX_WATCHDOG = 1,
  /**
   *
   * A software bug was detected on entry to sleep
   *
   * @generated from enum value: SLEEP_ENTER_WAIT = 2;
   */
  SLEEP_ENTER_WAIT = 2,
  /**
   *
   * No Lora radio hardware could be found
   *
   * @generated from enum value: NO_RADIO = 3;
   */
  NO_RADIO = 3,
  /**
   *
   * Not normally used
   *
   * @generated from enum value: UNSPECIFIED = 4;
   */
  UNSPECIFIED = 4,
  /**
   *
   * We failed while configuring a UBlox GPS
   *
   * @generated from enum value: UBLOX_UNIT_FAILED = 5;
   */
  UBLOX_UNIT_FAILED = 5,
  /**
   *
   * This board was expected to have a power management chip and it is missing or broken
   *
   * @generated from enum value: NO_AXP192 = 6;
   */
  NO_AXP192 = 6,
  /**
   *
   * The channel tried to set a radio setting which is not supported by this chipset,
   * radio comms settings are now undefined.
   *
   * @generated from enum value: INVALID_RADIO_SETTING = 7;
   */
  INVALID_RADIO_SETTING = 7,
  /**
   *
   * Radio transmit hardware failure. We sent data to the radio chip, but it didn't
   * reply with an interrupt.
   *
   * @generated from enum value: TRANSMIT_FAILED = 8;
   */
  TRANSMIT_FAILED = 8,
  /**
   *
   * We detected that the main CPU voltage dropped below the minimum acceptable value
   *
   * @generated from enum value: BROWNOUT = 9;
   */
  BROWNOUT = 9,
  /**
   * Selftest of SX1262 radio chip failed
   *
   * @generated from enum value: SX1262_FAILURE = 10;
   */
  SX1262_FAILURE = 10,
  /**
   *
   * A (likely software but possibly hardware) failure was detected while trying to send packets.
   * If this occurs on your board, please post in the forum so that we can ask you to collect some information to allow fixing this bug
   *
   * @generated from enum value: RADIO_SPI_BUG = 11;
   */
  RADIO_SPI_BUG = 11,
  /**
   *
   * Corruption was detected on the flash filesystem but we were able to repair things.
   * If you see this failure in the field please post in the forum because we are interested in seeing if this is occurring in the field.
   *
   * @generated from enum value: FLASH_CORRUPTION_RECOVERABLE = 12;
   */
  FLASH_CORRUPTION_RECOVERABLE = 12,
  /**
   *
   * Corruption was detected on the flash filesystem but we were unable to repair things.
   * NOTE: Your node will probably need to be reconfigured the next time it reboots (it will lose the region code etc...)
   * If you see this failure in the field please post in the forum because we are interested in seeing if this is occurring in the field.
   *
   * @generated from enum value: FLASH_CORRUPTION_UNRECOVERABLE = 13;
   */
  FLASH_CORRUPTION_UNRECOVERABLE = 13,
}
/**
 * Describes the enum meshtastic.CriticalErrorCode.
 */
declare const CriticalErrorCodeSchema: GenEnum<CriticalErrorCode>;
/**
 *
 * Enum to indicate to clients whether this firmware is a special firmware build, like an event.
 * The first 16 values are reserved for non-event special firmwares, like the Smart Citizen use case.
 *
 * @generated from enum meshtastic.FirmwareEdition
 */
declare enum FirmwareEdition {
  /**
   *
   * Vanilla firmware
   *
   * @generated from enum value: VANILLA = 0;
   */
  VANILLA = 0,
  /**
   *
   * Firmware for use in the Smart Citizen environmental monitoring network
   *
   * @generated from enum value: SMART_CITIZEN = 1;
   */
  SMART_CITIZEN = 1,
  /**
   *
   * Open Sauce, the maker conference held yearly in CA
   *
   * @generated from enum value: OPEN_SAUCE = 16;
   */
  OPEN_SAUCE = 16,
  /**
   *
   * DEFCON, the yearly hacker conference
   *
   * @generated from enum value: DEFCON = 17;
   */
  DEFCON = 17,
  /**
   *
   * Burning Man, the yearly hippie gathering in the desert
   *
   * @generated from enum value: BURNING_MAN = 18;
   */
  BURNING_MAN = 18,
  /**
   *
   * Hamvention, the Dayton amateur radio convention
   *
   * @generated from enum value: HAMVENTION = 19;
   */
  HAMVENTION = 19,
  /**
   *
   * Placeholder for DIY and unofficial events
   *
   * @generated from enum value: DIY_EDITION = 127;
   */
  DIY_EDITION = 127,
}
/**
 * Describes the enum meshtastic.FirmwareEdition.
 */
declare const FirmwareEditionSchema: GenEnum<FirmwareEdition>;
/**
 *
 * Enum for modules excluded from a device's configuration.
 * Each value represents a ModuleConfigType that can be toggled as excluded
 * by setting its corresponding bit in the `excluded_modules` bitmask field.
 *
 * @generated from enum meshtastic.ExcludedModules
 */
declare enum ExcludedModules {
  /**
   *
   * Default value of 0 indicates no modules are excluded.
   *
   * @generated from enum value: EXCLUDED_NONE = 0;
   */
  EXCLUDED_NONE = 0,
  /**
   *
   * MQTT module
   *
   * @generated from enum value: MQTT_CONFIG = 1;
   */
  MQTT_CONFIG = 1,
  /**
   *
   * Serial module
   *
   * @generated from enum value: SERIAL_CONFIG = 2;
   */
  SERIAL_CONFIG = 2,
  /**
   *
   * External Notification module
   *
   * @generated from enum value: EXTNOTIF_CONFIG = 4;
   */
  EXTNOTIF_CONFIG = 4,
  /**
   *
   * Store and Forward module
   *
   * @generated from enum value: STOREFORWARD_CONFIG = 8;
   */
  STOREFORWARD_CONFIG = 8,
  /**
   *
   * Range Test module
   *
   * @generated from enum value: RANGETEST_CONFIG = 16;
   */
  RANGETEST_CONFIG = 16,
  /**
   *
   * Telemetry module
   *
   * @generated from enum value: TELEMETRY_CONFIG = 32;
   */
  TELEMETRY_CONFIG = 32,
  /**
   *
   * Canned Message module
   *
   * @generated from enum value: CANNEDMSG_CONFIG = 64;
   */
  CANNEDMSG_CONFIG = 64,
  /**
   *
   * Audio module
   *
   * @generated from enum value: AUDIO_CONFIG = 128;
   */
  AUDIO_CONFIG = 128,
  /**
   *
   * Remote Hardware module
   *
   * @generated from enum value: REMOTEHARDWARE_CONFIG = 256;
   */
  REMOTEHARDWARE_CONFIG = 256,
  /**
   *
   * Neighbor Info module
   *
   * @generated from enum value: NEIGHBORINFO_CONFIG = 512;
   */
  NEIGHBORINFO_CONFIG = 512,
  /**
   *
   * Ambient Lighting module
   *
   * @generated from enum value: AMBIENTLIGHTING_CONFIG = 1024;
   */
  AMBIENTLIGHTING_CONFIG = 1024,
  /**
   *
   * Detection Sensor module
   *
   * @generated from enum value: DETECTIONSENSOR_CONFIG = 2048;
   */
  DETECTIONSENSOR_CONFIG = 2048,
  /**
   *
   * Paxcounter module
   *
   * @generated from enum value: PAXCOUNTER_CONFIG = 4096;
   */
  PAXCOUNTER_CONFIG = 4096,
  /**
   *
   * Bluetooth config (not technically a module, but used to indicate bluetooth capabilities)
   *
   * @generated from enum value: BLUETOOTH_CONFIG = 8192;
   */
  BLUETOOTH_CONFIG = 8192,
  /**
   *
   * Network config (not technically a module, but used to indicate network capabilities)
   *
   * @generated from enum value: NETWORK_CONFIG = 16384;
   */
  NETWORK_CONFIG = 16384,
}
/**
 * Describes the enum meshtastic.ExcludedModules.
 */
declare const ExcludedModulesSchema: GenEnum<ExcludedModules>;
declare namespace admin_pb_d_exports {
  export { AdminMessage, AdminMessageSchema, AdminMessage_BackupLocation, AdminMessage_BackupLocationSchema, AdminMessage_ConfigType, AdminMessage_ConfigTypeSchema, AdminMessage_InputEvent, AdminMessage_InputEventSchema, AdminMessage_ModuleConfigType, AdminMessage_ModuleConfigTypeSchema, HamParameters, HamParametersSchema, KeyVerificationAdmin, KeyVerificationAdminSchema, KeyVerificationAdmin_MessageType, KeyVerificationAdmin_MessageTypeSchema, NodeRemoteHardwarePinsResponse, NodeRemoteHardwarePinsResponseSchema, SharedContact, SharedContactSchema, file_meshtastic_admin };
}
/**
 * Describes the file meshtastic/admin.proto.
 */
declare const file_meshtastic_admin: GenFile;
/**
 *
 * This message is handled by the Admin module and is responsible for all settings/channel read/write operations.
 * This message is used to do settings operations to both remote AND local nodes.
 * (Prior to 1.2 these operations were done via special ToRadio operations)
 *
 * @generated from message meshtastic.AdminMessage
 */
type AdminMessage = Message<"meshtastic.AdminMessage"> & {
  /**
   *
   * The node generates this key and sends it with any get_x_response packets.
   * The client MUST include the same key with any set_x commands. Key expires after 300 seconds.
   * Prevents replay attacks for admin messages.
   *
   * @generated from field: bytes session_passkey = 101;
   */
  sessionPasskey: Uint8Array;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from oneof meshtastic.AdminMessage.payload_variant
   */
  payloadVariant: {
    /**
     *
     * Send the specified channel in the response to this message
     * NOTE: This field is sent with the channel index + 1 (to ensure we never try to send 'zero' - which protobufs treats as not present)
     *
     * @generated from field: uint32 get_channel_request = 1;
     */
    value: number;
    case: "getChannelRequest";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.Channel get_channel_response = 2;
     */
    value: Channel;
    case: "getChannelResponse";
  } | {
    /**
     *
     * Send the current owner data in the response to this message.
     *
     * @generated from field: bool get_owner_request = 3;
     */
    value: boolean;
    case: "getOwnerRequest";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.User get_owner_response = 4;
     */
    value: User;
    case: "getOwnerResponse";
  } | {
    /**
     *
     * Ask for the following config data to be sent
     *
     * @generated from field: meshtastic.AdminMessage.ConfigType get_config_request = 5;
     */
    value: AdminMessage_ConfigType;
    case: "getConfigRequest";
  } | {
    /**
     *
     * Send the current Config in the response to this message.
     *
     * @generated from field: meshtastic.Config get_config_response = 6;
     */
    value: Config;
    case: "getConfigResponse";
  } | {
    /**
     *
     * Ask for the following config data to be sent
     *
     * @generated from field: meshtastic.AdminMessage.ModuleConfigType get_module_config_request = 7;
     */
    value: AdminMessage_ModuleConfigType;
    case: "getModuleConfigRequest";
  } | {
    /**
     *
     * Send the current Config in the response to this message.
     *
     * @generated from field: meshtastic.ModuleConfig get_module_config_response = 8;
     */
    value: ModuleConfig;
    case: "getModuleConfigResponse";
  } | {
    /**
     *
     * Get the Canned Message Module messages in the response to this message.
     *
     * @generated from field: bool get_canned_message_module_messages_request = 10;
     */
    value: boolean;
    case: "getCannedMessageModuleMessagesRequest";
  } | {
    /**
     *
     * Get the Canned Message Module messages in the response to this message.
     *
     * @generated from field: string get_canned_message_module_messages_response = 11;
     */
    value: string;
    case: "getCannedMessageModuleMessagesResponse";
  } | {
    /**
     *
     * Request the node to send device metadata (firmware, protobuf version, etc)
     *
     * @generated from field: bool get_device_metadata_request = 12;
     */
    value: boolean;
    case: "getDeviceMetadataRequest";
  } | {
    /**
     *
     * Device metadata response
     *
     * @generated from field: meshtastic.DeviceMetadata get_device_metadata_response = 13;
     */
    value: DeviceMetadata;
    case: "getDeviceMetadataResponse";
  } | {
    /**
     *
     * Get the Ringtone in the response to this message.
     *
     * @generated from field: bool get_ringtone_request = 14;
     */
    value: boolean;
    case: "getRingtoneRequest";
  } | {
    /**
     *
     * Get the Ringtone in the response to this message.
     *
     * @generated from field: string get_ringtone_response = 15;
     */
    value: string;
    case: "getRingtoneResponse";
  } | {
    /**
     *
     * Request the node to send it's connection status
     *
     * @generated from field: bool get_device_connection_status_request = 16;
     */
    value: boolean;
    case: "getDeviceConnectionStatusRequest";
  } | {
    /**
     *
     * Device connection status response
     *
     * @generated from field: meshtastic.DeviceConnectionStatus get_device_connection_status_response = 17;
     */
    value: DeviceConnectionStatus;
    case: "getDeviceConnectionStatusResponse";
  } | {
    /**
     *
     * Setup a node for licensed amateur (ham) radio operation
     *
     * @generated from field: meshtastic.HamParameters set_ham_mode = 18;
     */
    value: HamParameters;
    case: "setHamMode";
  } | {
    /**
     *
     * Get the mesh's nodes with their available gpio pins for RemoteHardware module use
     *
     * @generated from field: bool get_node_remote_hardware_pins_request = 19;
     */
    value: boolean;
    case: "getNodeRemoteHardwarePinsRequest";
  } | {
    /**
     *
     * Respond with the mesh's nodes with their available gpio pins for RemoteHardware module use
     *
     * @generated from field: meshtastic.NodeRemoteHardwarePinsResponse get_node_remote_hardware_pins_response = 20;
     */
    value: NodeRemoteHardwarePinsResponse;
    case: "getNodeRemoteHardwarePinsResponse";
  } | {
    /**
     *
     * Enter (UF2) DFU mode
     * Only implemented on NRF52 currently
     *
     * @generated from field: bool enter_dfu_mode_request = 21;
     */
    value: boolean;
    case: "enterDfuModeRequest";
  } | {
    /**
     *
     * Delete the file by the specified path from the device
     *
     * @generated from field: string delete_file_request = 22;
     */
    value: string;
    case: "deleteFileRequest";
  } | {
    /**
     *
     * Set zero and offset for scale chips
     *
     * @generated from field: uint32 set_scale = 23;
     */
    value: number;
    case: "setScale";
  } | {
    /**
     *
     * Backup the node's preferences
     *
     * @generated from field: meshtastic.AdminMessage.BackupLocation backup_preferences = 24;
     */
    value: AdminMessage_BackupLocation;
    case: "backupPreferences";
  } | {
    /**
     *
     * Restore the node's preferences
     *
     * @generated from field: meshtastic.AdminMessage.BackupLocation restore_preferences = 25;
     */
    value: AdminMessage_BackupLocation;
    case: "restorePreferences";
  } | {
    /**
     *
     * Remove backups of the node's preferences
     *
     * @generated from field: meshtastic.AdminMessage.BackupLocation remove_backup_preferences = 26;
     */
    value: AdminMessage_BackupLocation;
    case: "removeBackupPreferences";
  } | {
    /**
     *
     * Send an input event to the node.
     * This is used to trigger physical input events like button presses, touch events, etc.
     *
     * @generated from field: meshtastic.AdminMessage.InputEvent send_input_event = 27;
     */
    value: AdminMessage_InputEvent;
    case: "sendInputEvent";
  } | {
    /**
     *
     * Set the owner for this node
     *
     * @generated from field: meshtastic.User set_owner = 32;
     */
    value: User;
    case: "setOwner";
  } | {
    /**
     *
     * Set channels (using the new API).
     * A special channel is the "primary channel".
     * The other records are secondary channels.
     * Note: only one channel can be marked as primary.
     * If the client sets a particular channel to be primary, the previous channel will be set to SECONDARY automatically.
     *
     * @generated from field: meshtastic.Channel set_channel = 33;
     */
    value: Channel;
    case: "setChannel";
  } | {
    /**
     *
     * Set the current Config
     *
     * @generated from field: meshtastic.Config set_config = 34;
     */
    value: Config;
    case: "setConfig";
  } | {
    /**
     *
     * Set the current Config
     *
     * @generated from field: meshtastic.ModuleConfig set_module_config = 35;
     */
    value: ModuleConfig;
    case: "setModuleConfig";
  } | {
    /**
     *
     * Set the Canned Message Module messages text.
     *
     * @generated from field: string set_canned_message_module_messages = 36;
     */
    value: string;
    case: "setCannedMessageModuleMessages";
  } | {
    /**
     *
     * Set the ringtone for ExternalNotification.
     *
     * @generated from field: string set_ringtone_message = 37;
     */
    value: string;
    case: "setRingtoneMessage";
  } | {
    /**
     *
     * Remove the node by the specified node-num from the NodeDB on the device
     *
     * @generated from field: uint32 remove_by_nodenum = 38;
     */
    value: number;
    case: "removeByNodenum";
  } | {
    /**
     *
     * Set specified node-num to be favorited on the NodeDB on the device
     *
     * @generated from field: uint32 set_favorite_node = 39;
     */
    value: number;
    case: "setFavoriteNode";
  } | {
    /**
     *
     * Set specified node-num to be un-favorited on the NodeDB on the device
     *
     * @generated from field: uint32 remove_favorite_node = 40;
     */
    value: number;
    case: "removeFavoriteNode";
  } | {
    /**
     *
     * Set fixed position data on the node and then set the position.fixed_position = true
     *
     * @generated from field: meshtastic.Position set_fixed_position = 41;
     */
    value: Position;
    case: "setFixedPosition";
  } | {
    /**
     *
     * Clear fixed position coordinates and then set position.fixed_position = false
     *
     * @generated from field: bool remove_fixed_position = 42;
     */
    value: boolean;
    case: "removeFixedPosition";
  } | {
    /**
     *
     * Set time only on the node
     * Convenience method to set the time on the node (as Net quality) without any other position data
     *
     * @generated from field: fixed32 set_time_only = 43;
     */
    value: number;
    case: "setTimeOnly";
  } | {
    /**
     *
     * Tell the node to send the stored ui data.
     *
     * @generated from field: bool get_ui_config_request = 44;
     */
    value: boolean;
    case: "getUiConfigRequest";
  } | {
    /**
     *
     * Reply stored device ui data.
     *
     * @generated from field: meshtastic.DeviceUIConfig get_ui_config_response = 45;
     */
    value: DeviceUIConfig;
    case: "getUiConfigResponse";
  } | {
    /**
     *
     * Tell the node to store UI data persistently.
     *
     * @generated from field: meshtastic.DeviceUIConfig store_ui_config = 46;
     */
    value: DeviceUIConfig;
    case: "storeUiConfig";
  } | {
    /**
     *
     * Set specified node-num to be ignored on the NodeDB on the device
     *
     * @generated from field: uint32 set_ignored_node = 47;
     */
    value: number;
    case: "setIgnoredNode";
  } | {
    /**
     *
     * Set specified node-num to be un-ignored on the NodeDB on the device
     *
     * @generated from field: uint32 remove_ignored_node = 48;
     */
    value: number;
    case: "removeIgnoredNode";
  } | {
    /**
     *
     * Begins an edit transaction for config, module config, owner, and channel settings changes
     * This will delay the standard *implicit* save to the file system and subsequent reboot behavior until committed (commit_edit_settings)
     *
     * @generated from field: bool begin_edit_settings = 64;
     */
    value: boolean;
    case: "beginEditSettings";
  } | {
    /**
     *
     * Commits an open transaction for any edits made to config, module config, owner, and channel settings
     *
     * @generated from field: bool commit_edit_settings = 65;
     */
    value: boolean;
    case: "commitEditSettings";
  } | {
    /**
     *
     * Add a contact (User) to the nodedb
     *
     * @generated from field: meshtastic.SharedContact add_contact = 66;
     */
    value: SharedContact;
    case: "addContact";
  } | {
    /**
     *
     * Initiate or respond to a key verification request
     *
     * @generated from field: meshtastic.KeyVerificationAdmin key_verification = 67;
     */
    value: KeyVerificationAdmin;
    case: "keyVerification";
  } | {
    /**
     *
     * Tell the node to factory reset config everything; all device state and configuration will be returned to factory defaults and BLE bonds will be cleared.
     *
     * @generated from field: int32 factory_reset_device = 94;
     */
    value: number;
    case: "factoryResetDevice";
  } | {
    /**
     *
     * Tell the node to reboot into the OTA Firmware in this many seconds (or <0 to cancel reboot)
     * Only Implemented for ESP32 Devices. This needs to be issued to send a new main firmware via bluetooth.
     *
     * @generated from field: int32 reboot_ota_seconds = 95;
     */
    value: number;
    case: "rebootOtaSeconds";
  } | {
    /**
     *
     * This message is only supported for the simulator Portduino build.
     * If received the simulator will exit successfully.
     *
     * @generated from field: bool exit_simulator = 96;
     */
    value: boolean;
    case: "exitSimulator";
  } | {
    /**
     *
     * Tell the node to reboot in this many seconds (or <0 to cancel reboot)
     *
     * @generated from field: int32 reboot_seconds = 97;
     */
    value: number;
    case: "rebootSeconds";
  } | {
    /**
     *
     * Tell the node to shutdown in this many seconds (or <0 to cancel shutdown)
     *
     * @generated from field: int32 shutdown_seconds = 98;
     */
    value: number;
    case: "shutdownSeconds";
  } | {
    /**
     *
     * Tell the node to factory reset config; all device state and configuration will be returned to factory defaults; BLE bonds will be preserved.
     *
     * @generated from field: int32 factory_reset_config = 99;
     */
    value: number;
    case: "factoryResetConfig";
  } | {
    /**
     *
     * Tell the node to reset the nodedb.
     * When true, favorites are preserved through reset.
     *
     * @generated from field: bool nodedb_reset = 100;
     */
    value: boolean;
    case: "nodedbReset";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.AdminMessage.
 * Use `create(AdminMessageSchema)` to create a new message.
 */
declare const AdminMessageSchema: GenMessage<AdminMessage>;
/**
 *
 * Input event message to be sent to the node.
 *
 * @generated from message meshtastic.AdminMessage.InputEvent
 */
type AdminMessage_InputEvent = Message<"meshtastic.AdminMessage.InputEvent"> & {
  /**
   *
   * The input event code
   *
   * @generated from field: uint32 event_code = 1;
   */
  eventCode: number;
  /**
   *
   * Keyboard character code
   *
   * @generated from field: uint32 kb_char = 2;
   */
  kbChar: number;
  /**
   *
   * The touch X coordinate
   *
   * @generated from field: uint32 touch_x = 3;
   */
  touchX: number;
  /**
   *
   * The touch Y coordinate
   *
   * @generated from field: uint32 touch_y = 4;
   */
  touchY: number;
};
/**
 * Describes the message meshtastic.AdminMessage.InputEvent.
 * Use `create(AdminMessage_InputEventSchema)` to create a new message.
 */
declare const AdminMessage_InputEventSchema: GenMessage<AdminMessage_InputEvent>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from enum meshtastic.AdminMessage.ConfigType
 */
declare enum AdminMessage_ConfigType {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: DEVICE_CONFIG = 0;
   */
  DEVICE_CONFIG = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: POSITION_CONFIG = 1;
   */
  POSITION_CONFIG = 1,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: POWER_CONFIG = 2;
   */
  POWER_CONFIG = 2,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: NETWORK_CONFIG = 3;
   */
  NETWORK_CONFIG = 3,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: DISPLAY_CONFIG = 4;
   */
  DISPLAY_CONFIG = 4,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: LORA_CONFIG = 5;
   */
  LORA_CONFIG = 5,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: BLUETOOTH_CONFIG = 6;
   */
  BLUETOOTH_CONFIG = 6,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: SECURITY_CONFIG = 7;
   */
  SECURITY_CONFIG = 7,
  /**
   *
   * Session key config
   *
   * @generated from enum value: SESSIONKEY_CONFIG = 8;
   */
  SESSIONKEY_CONFIG = 8,
  /**
   *
   * device-ui config
   *
   * @generated from enum value: DEVICEUI_CONFIG = 9;
   */
  DEVICEUI_CONFIG = 9,
}
/**
 * Describes the enum meshtastic.AdminMessage.ConfigType.
 */
declare const AdminMessage_ConfigTypeSchema: GenEnum<AdminMessage_ConfigType>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from enum meshtastic.AdminMessage.ModuleConfigType
 */
declare enum AdminMessage_ModuleConfigType {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: MQTT_CONFIG = 0;
   */
  MQTT_CONFIG = 0,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: SERIAL_CONFIG = 1;
   */
  SERIAL_CONFIG = 1,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: EXTNOTIF_CONFIG = 2;
   */
  EXTNOTIF_CONFIG = 2,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: STOREFORWARD_CONFIG = 3;
   */
  STOREFORWARD_CONFIG = 3,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: RANGETEST_CONFIG = 4;
   */
  RANGETEST_CONFIG = 4,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: TELEMETRY_CONFIG = 5;
   */
  TELEMETRY_CONFIG = 5,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: CANNEDMSG_CONFIG = 6;
   */
  CANNEDMSG_CONFIG = 6,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: AUDIO_CONFIG = 7;
   */
  AUDIO_CONFIG = 7,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: REMOTEHARDWARE_CONFIG = 8;
   */
  REMOTEHARDWARE_CONFIG = 8,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: NEIGHBORINFO_CONFIG = 9;
   */
  NEIGHBORINFO_CONFIG = 9,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: AMBIENTLIGHTING_CONFIG = 10;
   */
  AMBIENTLIGHTING_CONFIG = 10,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: DETECTIONSENSOR_CONFIG = 11;
   */
  DETECTIONSENSOR_CONFIG = 11,
  /**
   *
   * TODO: REPLACE
   *
   * @generated from enum value: PAXCOUNTER_CONFIG = 12;
   */
  PAXCOUNTER_CONFIG = 12,
}
/**
 * Describes the enum meshtastic.AdminMessage.ModuleConfigType.
 */
declare const AdminMessage_ModuleConfigTypeSchema: GenEnum<AdminMessage_ModuleConfigType>;
/**
 * @generated from enum meshtastic.AdminMessage.BackupLocation
 */
declare enum AdminMessage_BackupLocation {
  /**
   *
   * Backup to the internal flash
   *
   * @generated from enum value: FLASH = 0;
   */
  FLASH = 0,
  /**
   *
   * Backup to the SD card
   *
   * @generated from enum value: SD = 1;
   */
  SD = 1,
}
/**
 * Describes the enum meshtastic.AdminMessage.BackupLocation.
 */
declare const AdminMessage_BackupLocationSchema: GenEnum<AdminMessage_BackupLocation>;
/**
 *
 * Parameters for setting up Meshtastic for ameteur radio usage
 *
 * @generated from message meshtastic.HamParameters
 */
type HamParameters = Message<"meshtastic.HamParameters"> & {
  /**
   *
   * Amateur radio call sign, eg. KD2ABC
   *
   * @generated from field: string call_sign = 1;
   */
  callSign: string;
  /**
   *
   * Transmit power in dBm at the LoRA transceiver, not including any amplification
   *
   * @generated from field: int32 tx_power = 2;
   */
  txPower: number;
  /**
   *
   * The selected frequency of LoRA operation
   * Please respect your local laws, regulations, and band plans.
   * Ensure your radio is capable of operating of the selected frequency before setting this.
   *
   * @generated from field: float frequency = 3;
   */
  frequency: number;
  /**
   *
   * Optional short name of user
   *
   * @generated from field: string short_name = 4;
   */
  shortName: string;
};
/**
 * Describes the message meshtastic.HamParameters.
 * Use `create(HamParametersSchema)` to create a new message.
 */
declare const HamParametersSchema: GenMessage<HamParameters>;
/**
 *
 * Response envelope for node_remote_hardware_pins
 *
 * @generated from message meshtastic.NodeRemoteHardwarePinsResponse
 */
type NodeRemoteHardwarePinsResponse = Message<"meshtastic.NodeRemoteHardwarePinsResponse"> & {
  /**
   *
   * Nodes and their respective remote hardware GPIO pins
   *
   * @generated from field: repeated meshtastic.NodeRemoteHardwarePin node_remote_hardware_pins = 1;
   */
  nodeRemoteHardwarePins: NodeRemoteHardwarePin[];
};
/**
 * Describes the message meshtastic.NodeRemoteHardwarePinsResponse.
 * Use `create(NodeRemoteHardwarePinsResponseSchema)` to create a new message.
 */
declare const NodeRemoteHardwarePinsResponseSchema: GenMessage<NodeRemoteHardwarePinsResponse>;
/**
 * @generated from message meshtastic.SharedContact
 */
type SharedContact = Message<"meshtastic.SharedContact"> & {
  /**
   *
   * The node number of the contact
   *
   * @generated from field: uint32 node_num = 1;
   */
  nodeNum: number;
  /**
   *
   * The User of the contact
   *
   * @generated from field: meshtastic.User user = 2;
   */
  user?: User;
  /**
   *
   * Add this contact to the blocked / ignored list
   *
   * @generated from field: bool should_ignore = 3;
   */
  shouldIgnore: boolean;
  /**
   *
   * Set the IS_KEY_MANUALLY_VERIFIED bit
   *
   * @generated from field: bool manually_verified = 4;
   */
  manuallyVerified: boolean;
};
/**
 * Describes the message meshtastic.SharedContact.
 * Use `create(SharedContactSchema)` to create a new message.
 */
declare const SharedContactSchema: GenMessage<SharedContact>;
/**
 *
 * This message is used by a client to initiate or complete a key verification
 *
 * @generated from message meshtastic.KeyVerificationAdmin
 */
type KeyVerificationAdmin = Message<"meshtastic.KeyVerificationAdmin"> & {
  /**
   * @generated from field: meshtastic.KeyVerificationAdmin.MessageType message_type = 1;
   */
  messageType: KeyVerificationAdmin_MessageType;
  /**
   *
   * The nodenum we're requesting
   *
   * @generated from field: uint32 remote_nodenum = 2;
   */
  remoteNodenum: number;
  /**
   *
   * The nonce is used to track the connection
   *
   * @generated from field: uint64 nonce = 3;
   */
  nonce: bigint;
  /**
   *
   * The 4 digit code generated by the remote node, and communicated outside the mesh
   *
   * @generated from field: optional uint32 security_number = 4;
   */
  securityNumber?: number;
};
/**
 * Describes the message meshtastic.KeyVerificationAdmin.
 * Use `create(KeyVerificationAdminSchema)` to create a new message.
 */
declare const KeyVerificationAdminSchema: GenMessage<KeyVerificationAdmin>;
/**
 *
 * Three stages of this request.
 *
 * @generated from enum meshtastic.KeyVerificationAdmin.MessageType
 */
declare enum KeyVerificationAdmin_MessageType {
  /**
   *
   * This is the first stage, where a client initiates
   *
   * @generated from enum value: INITIATE_VERIFICATION = 0;
   */
  INITIATE_VERIFICATION = 0,
  /**
   *
   * After the nonce has been returned over the mesh, the client prompts for the security number
   * And uses this message to provide it to the node.
   *
   * @generated from enum value: PROVIDE_SECURITY_NUMBER = 1;
   */
  PROVIDE_SECURITY_NUMBER = 1,
  /**
   *
   * Once the user has compared the verification message, this message notifies the node.
   *
   * @generated from enum value: DO_VERIFY = 2;
   */
  DO_VERIFY = 2,
  /**
   *
   * This is the cancel path, can be taken at any point
   *
   * @generated from enum value: DO_NOT_VERIFY = 3;
   */
  DO_NOT_VERIFY = 3,
}
/**
 * Describes the enum meshtastic.KeyVerificationAdmin.MessageType.
 */
declare const KeyVerificationAdmin_MessageTypeSchema: GenEnum<KeyVerificationAdmin_MessageType>;
declare namespace apponly_pb_d_exports {
  export { ChannelSet, ChannelSetSchema, file_meshtastic_apponly };
}
/**
 * Describes the file meshtastic/apponly.proto.
 */
declare const file_meshtastic_apponly: GenFile;
/**
 *
 * This is the most compact possible representation for a set of channels.
 * It includes only one PRIMARY channel (which must be first) and
 * any SECONDARY channels.
 * No DISABLED channels are included.
 * This abstraction is used only on the the 'app side' of the world (ie python, javascript and android etc) to show a group of Channels as a (long) URL
 *
 * @generated from message meshtastic.ChannelSet
 */
type ChannelSet = Message<"meshtastic.ChannelSet"> & {
  /**
   *
   * Channel list with settings
   *
   * @generated from field: repeated meshtastic.ChannelSettings settings = 1;
   */
  settings: ChannelSettings[];
  /**
   *
   * LoRa config
   *
   * @generated from field: meshtastic.Config.LoRaConfig lora_config = 2;
   */
  loraConfig?: Config_LoRaConfig;
};
/**
 * Describes the message meshtastic.ChannelSet.
 * Use `create(ChannelSetSchema)` to create a new message.
 */
declare const ChannelSetSchema: GenMessage<ChannelSet>;
declare namespace atak_pb_d_exports {
  export { Contact, ContactSchema, GeoChat, GeoChatSchema, Group, GroupSchema, MemberRole, MemberRoleSchema, PLI, PLISchema, Status, StatusSchema, TAKPacket, TAKPacketSchema, Team, TeamSchema, file_meshtastic_atak };
}
/**
 * Describes the file meshtastic/atak.proto.
 */
declare const file_meshtastic_atak: GenFile;
/**
 *
 * Packets for the official ATAK Plugin
 *
 * @generated from message meshtastic.TAKPacket
 */
type TAKPacket = Message<"meshtastic.TAKPacket"> & {
  /**
   *
   * Are the payloads strings compressed for LoRA transport?
   *
   * @generated from field: bool is_compressed = 1;
   */
  isCompressed: boolean;
  /**
   *
   * The contact / callsign for ATAK user
   *
   * @generated from field: meshtastic.Contact contact = 2;
   */
  contact?: Contact;
  /**
   *
   * The group for ATAK user
   *
   * @generated from field: meshtastic.Group group = 3;
   */
  group?: Group;
  /**
   *
   * The status of the ATAK EUD
   *
   * @generated from field: meshtastic.Status status = 4;
   */
  status?: Status;
  /**
   *
   * The payload of the packet
   *
   * @generated from oneof meshtastic.TAKPacket.payload_variant
   */
  payloadVariant: {
    /**
     *
     * TAK position report
     *
     * @generated from field: meshtastic.PLI pli = 5;
     */
    value: PLI;
    case: "pli";
  } | {
    /**
     *
     * ATAK GeoChat message
     *
     * @generated from field: meshtastic.GeoChat chat = 6;
     */
    value: GeoChat;
    case: "chat";
  } | {
    /**
     *
     * Generic CoT detail XML
     * May be compressed / truncated by the sender (EUD)
     *
     * @generated from field: bytes detail = 7;
     */
    value: Uint8Array;
    case: "detail";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.TAKPacket.
 * Use `create(TAKPacketSchema)` to create a new message.
 */
declare const TAKPacketSchema: GenMessage<TAKPacket>;
/**
 *
 * ATAK GeoChat message
 *
 * @generated from message meshtastic.GeoChat
 */
type GeoChat = Message<"meshtastic.GeoChat"> & {
  /**
   *
   * The text message
   *
   * @generated from field: string message = 1;
   */
  message: string;
  /**
   *
   * Uid recipient of the message
   *
   * @generated from field: optional string to = 2;
   */
  to?: string;
  /**
   *
   * Callsign of the recipient for the message
   *
   * @generated from field: optional string to_callsign = 3;
   */
  toCallsign?: string;
};
/**
 * Describes the message meshtastic.GeoChat.
 * Use `create(GeoChatSchema)` to create a new message.
 */
declare const GeoChatSchema: GenMessage<GeoChat>;
/**
 *
 * ATAK Group
 * <__group role='Team Member' name='Cyan'/>
 *
 * @generated from message meshtastic.Group
 */
type Group = Message<"meshtastic.Group"> & {
  /**
   *
   * Role of the group member
   *
   * @generated from field: meshtastic.MemberRole role = 1;
   */
  role: MemberRole;
  /**
   *
   * Team (color)
   * Default Cyan
   *
   * @generated from field: meshtastic.Team team = 2;
   */
  team: Team;
};
/**
 * Describes the message meshtastic.Group.
 * Use `create(GroupSchema)` to create a new message.
 */
declare const GroupSchema: GenMessage<Group>;
/**
 *
 * ATAK EUD Status
 * <status battery='100' />
 *
 * @generated from message meshtastic.Status
 */
type Status = Message<"meshtastic.Status"> & {
  /**
   *
   * Battery level
   *
   * @generated from field: uint32 battery = 1;
   */
  battery: number;
};
/**
 * Describes the message meshtastic.Status.
 * Use `create(StatusSchema)` to create a new message.
 */
declare const StatusSchema: GenMessage<Status>;
/**
 *
 * ATAK Contact
 * <contact endpoint='0.0.0.0:4242:tcp' phone='+12345678' callsign='FALKE'/>
 *
 * @generated from message meshtastic.Contact
 */
type Contact = Message<"meshtastic.Contact"> & {
  /**
   *
   * Callsign
   *
   * @generated from field: string callsign = 1;
   */
  callsign: string;
  /**
   *
   * Device callsign
   *
   *
   * IP address of endpoint in integer form (0.0.0.0 default)
   *
   * @generated from field: string device_callsign = 2;
   */
  deviceCallsign: string;
};
/**
 * Describes the message meshtastic.Contact.
 * Use `create(ContactSchema)` to create a new message.
 */
declare const ContactSchema: GenMessage<Contact>;
/**
 *
 * Position Location Information from ATAK
 *
 * @generated from message meshtastic.PLI
 */
type PLI = Message<"meshtastic.PLI"> & {
  /**
   *
   * The new preferred location encoding, multiply by 1e-7 to get degrees
   * in floating point
   *
   * @generated from field: sfixed32 latitude_i = 1;
   */
  latitudeI: number;
  /**
   *
   * The new preferred location encoding, multiply by 1e-7 to get degrees
   * in floating point
   *
   * @generated from field: sfixed32 longitude_i = 2;
   */
  longitudeI: number;
  /**
   *
   * Altitude (ATAK prefers HAE)
   *
   * @generated from field: int32 altitude = 3;
   */
  altitude: number;
  /**
   *
   * Speed
   *
   * @generated from field: uint32 speed = 4;
   */
  speed: number;
  /**
   *
   * Course in degrees
   *
   * @generated from field: uint32 course = 5;
   */
  course: number;
};
/**
 * Describes the message meshtastic.PLI.
 * Use `create(PLISchema)` to create a new message.
 */
declare const PLISchema: GenMessage<PLI>;
/**
 * @generated from enum meshtastic.Team
 */
declare enum Team {
  /**
   *
   * Unspecifed
   *
   * @generated from enum value: Unspecifed_Color = 0;
   */
  Unspecifed_Color = 0,
  /**
   *
   * White
   *
   * @generated from enum value: White = 1;
   */
  White = 1,
  /**
   *
   * Yellow
   *
   * @generated from enum value: Yellow = 2;
   */
  Yellow = 2,
  /**
   *
   * Orange
   *
   * @generated from enum value: Orange = 3;
   */
  Orange = 3,
  /**
   *
   * Magenta
   *
   * @generated from enum value: Magenta = 4;
   */
  Magenta = 4,
  /**
   *
   * Red
   *
   * @generated from enum value: Red = 5;
   */
  Red = 5,
  /**
   *
   * Maroon
   *
   * @generated from enum value: Maroon = 6;
   */
  Maroon = 6,
  /**
   *
   * Purple
   *
   * @generated from enum value: Purple = 7;
   */
  Purple = 7,
  /**
   *
   * Dark Blue
   *
   * @generated from enum value: Dark_Blue = 8;
   */
  Dark_Blue = 8,
  /**
   *
   * Blue
   *
   * @generated from enum value: Blue = 9;
   */
  Blue = 9,
  /**
   *
   * Cyan
   *
   * @generated from enum value: Cyan = 10;
   */
  Cyan = 10,
  /**
   *
   * Teal
   *
   * @generated from enum value: Teal = 11;
   */
  Teal = 11,
  /**
   *
   * Green
   *
   * @generated from enum value: Green = 12;
   */
  Green = 12,
  /**
   *
   * Dark Green
   *
   * @generated from enum value: Dark_Green = 13;
   */
  Dark_Green = 13,
  /**
   *
   * Brown
   *
   * @generated from enum value: Brown = 14;
   */
  Brown = 14,
}
/**
 * Describes the enum meshtastic.Team.
 */
declare const TeamSchema: GenEnum<Team>;
/**
 *
 * Role of the group member
 *
 * @generated from enum meshtastic.MemberRole
 */
declare enum MemberRole {
  /**
   *
   * Unspecifed
   *
   * @generated from enum value: Unspecifed = 0;
   */
  Unspecifed = 0,
  /**
   *
   * Team Member
   *
   * @generated from enum value: TeamMember = 1;
   */
  TeamMember = 1,
  /**
   *
   * Team Lead
   *
   * @generated from enum value: TeamLead = 2;
   */
  TeamLead = 2,
  /**
   *
   * Headquarters
   *
   * @generated from enum value: HQ = 3;
   */
  HQ = 3,
  /**
   *
   * Airsoft enthusiast
   *
   * @generated from enum value: Sniper = 4;
   */
  Sniper = 4,
  /**
   *
   * Medic
   *
   * @generated from enum value: Medic = 5;
   */
  Medic = 5,
  /**
   *
   * ForwardObserver
   *
   * @generated from enum value: ForwardObserver = 6;
   */
  ForwardObserver = 6,
  /**
   *
   * Radio Telephone Operator
   *
   * @generated from enum value: RTO = 7;
   */
  RTO = 7,
  /**
   *
   * Doggo
   *
   * @generated from enum value: K9 = 8;
   */
  K9 = 8,
}
/**
 * Describes the enum meshtastic.MemberRole.
 */
declare const MemberRoleSchema: GenEnum<MemberRole>;
declare namespace cannedmessages_pb_d_exports {
  export { CannedMessageModuleConfig, CannedMessageModuleConfigSchema, file_meshtastic_cannedmessages };
}
/**
 * Describes the file meshtastic/cannedmessages.proto.
 */
declare const file_meshtastic_cannedmessages: GenFile;
/**
 *
 * Canned message module configuration.
 *
 * @generated from message meshtastic.CannedMessageModuleConfig
 */
type CannedMessageModuleConfig = Message<"meshtastic.CannedMessageModuleConfig"> & {
  /**
   *
   * Predefined messages for canned message module separated by '|' characters.
   *
   * @generated from field: string messages = 1;
   */
  messages: string;
};
/**
 * Describes the message meshtastic.CannedMessageModuleConfig.
 * Use `create(CannedMessageModuleConfigSchema)` to create a new message.
 */
declare const CannedMessageModuleConfigSchema: GenMessage<CannedMessageModuleConfig>;
declare namespace localonly_pb_d_exports {
  export { LocalConfig, LocalConfigSchema, LocalModuleConfig, LocalModuleConfigSchema, file_meshtastic_localonly };
}
/**
 * Describes the file meshtastic/localonly.proto.
 */
declare const file_meshtastic_localonly: GenFile;
/**
 * @generated from message meshtastic.LocalConfig
 */
type LocalConfig = Message<"meshtastic.LocalConfig"> & {
  /**
   *
   * The part of the config that is specific to the Device
   *
   * @generated from field: meshtastic.Config.DeviceConfig device = 1;
   */
  device?: Config_DeviceConfig;
  /**
   *
   * The part of the config that is specific to the GPS Position
   *
   * @generated from field: meshtastic.Config.PositionConfig position = 2;
   */
  position?: Config_PositionConfig;
  /**
   *
   * The part of the config that is specific to the Power settings
   *
   * @generated from field: meshtastic.Config.PowerConfig power = 3;
   */
  power?: Config_PowerConfig;
  /**
   *
   * The part of the config that is specific to the Wifi Settings
   *
   * @generated from field: meshtastic.Config.NetworkConfig network = 4;
   */
  network?: Config_NetworkConfig;
  /**
   *
   * The part of the config that is specific to the Display
   *
   * @generated from field: meshtastic.Config.DisplayConfig display = 5;
   */
  display?: Config_DisplayConfig;
  /**
   *
   * The part of the config that is specific to the Lora Radio
   *
   * @generated from field: meshtastic.Config.LoRaConfig lora = 6;
   */
  lora?: Config_LoRaConfig;
  /**
   *
   * The part of the config that is specific to the Bluetooth settings
   *
   * @generated from field: meshtastic.Config.BluetoothConfig bluetooth = 7;
   */
  bluetooth?: Config_BluetoothConfig;
  /**
   *
   * A version integer used to invalidate old save files when we make
   * incompatible changes This integer is set at build time and is private to
   * NodeDB.cpp in the device code.
   *
   * @generated from field: uint32 version = 8;
   */
  version: number;
  /**
   *
   * The part of the config that is specific to Security settings
   *
   * @generated from field: meshtastic.Config.SecurityConfig security = 9;
   */
  security?: Config_SecurityConfig;
};
/**
 * Describes the message meshtastic.LocalConfig.
 * Use `create(LocalConfigSchema)` to create a new message.
 */
declare const LocalConfigSchema: GenMessage<LocalConfig>;
/**
 * @generated from message meshtastic.LocalModuleConfig
 */
type LocalModuleConfig = Message<"meshtastic.LocalModuleConfig"> & {
  /**
   *
   * The part of the config that is specific to the MQTT module
   *
   * @generated from field: meshtastic.ModuleConfig.MQTTConfig mqtt = 1;
   */
  mqtt?: ModuleConfig_MQTTConfig;
  /**
   *
   * The part of the config that is specific to the Serial module
   *
   * @generated from field: meshtastic.ModuleConfig.SerialConfig serial = 2;
   */
  serial?: ModuleConfig_SerialConfig;
  /**
   *
   * The part of the config that is specific to the ExternalNotification module
   *
   * @generated from field: meshtastic.ModuleConfig.ExternalNotificationConfig external_notification = 3;
   */
  externalNotification?: ModuleConfig_ExternalNotificationConfig;
  /**
   *
   * The part of the config that is specific to the Store & Forward module
   *
   * @generated from field: meshtastic.ModuleConfig.StoreForwardConfig store_forward = 4;
   */
  storeForward?: ModuleConfig_StoreForwardConfig;
  /**
   *
   * The part of the config that is specific to the RangeTest module
   *
   * @generated from field: meshtastic.ModuleConfig.RangeTestConfig range_test = 5;
   */
  rangeTest?: ModuleConfig_RangeTestConfig;
  /**
   *
   * The part of the config that is specific to the Telemetry module
   *
   * @generated from field: meshtastic.ModuleConfig.TelemetryConfig telemetry = 6;
   */
  telemetry?: ModuleConfig_TelemetryConfig;
  /**
   *
   * The part of the config that is specific to the Canned Message module
   *
   * @generated from field: meshtastic.ModuleConfig.CannedMessageConfig canned_message = 7;
   */
  cannedMessage?: ModuleConfig_CannedMessageConfig;
  /**
   *
   * The part of the config that is specific to the Audio module
   *
   * @generated from field: meshtastic.ModuleConfig.AudioConfig audio = 9;
   */
  audio?: ModuleConfig_AudioConfig;
  /**
   *
   * The part of the config that is specific to the Remote Hardware module
   *
   * @generated from field: meshtastic.ModuleConfig.RemoteHardwareConfig remote_hardware = 10;
   */
  remoteHardware?: ModuleConfig_RemoteHardwareConfig;
  /**
   *
   * The part of the config that is specific to the Neighbor Info module
   *
   * @generated from field: meshtastic.ModuleConfig.NeighborInfoConfig neighbor_info = 11;
   */
  neighborInfo?: ModuleConfig_NeighborInfoConfig;
  /**
   *
   * The part of the config that is specific to the Ambient Lighting module
   *
   * @generated from field: meshtastic.ModuleConfig.AmbientLightingConfig ambient_lighting = 12;
   */
  ambientLighting?: ModuleConfig_AmbientLightingConfig;
  /**
   *
   * The part of the config that is specific to the Detection Sensor module
   *
   * @generated from field: meshtastic.ModuleConfig.DetectionSensorConfig detection_sensor = 13;
   */
  detectionSensor?: ModuleConfig_DetectionSensorConfig;
  /**
   *
   * Paxcounter Config
   *
   * @generated from field: meshtastic.ModuleConfig.PaxcounterConfig paxcounter = 14;
   */
  paxcounter?: ModuleConfig_PaxcounterConfig;
  /**
   *
   * A version integer used to invalidate old save files when we make
   * incompatible changes This integer is set at build time and is private to
   * NodeDB.cpp in the device code.
   *
   * @generated from field: uint32 version = 8;
   */
  version: number;
};
/**
 * Describes the message meshtastic.LocalModuleConfig.
 * Use `create(LocalModuleConfigSchema)` to create a new message.
 */
declare const LocalModuleConfigSchema: GenMessage<LocalModuleConfig>;
declare namespace clientonly_pb_d_exports {
  export { DeviceProfile, DeviceProfileSchema, file_meshtastic_clientonly };
}
/**
 * Describes the file meshtastic/clientonly.proto.
 */
declare const file_meshtastic_clientonly: GenFile;
/**
 *
 * This abstraction is used to contain any configuration for provisioning a node on any client.
 * It is useful for importing and exporting configurations.
 *
 * @generated from message meshtastic.DeviceProfile
 */
type DeviceProfile = Message<"meshtastic.DeviceProfile"> & {
  /**
   *
   * Long name for the node
   *
   * @generated from field: optional string long_name = 1;
   */
  longName?: string;
  /**
   *
   * Short name of the node
   *
   * @generated from field: optional string short_name = 2;
   */
  shortName?: string;
  /**
   *
   * The url of the channels from our node
   *
   * @generated from field: optional string channel_url = 3;
   */
  channelUrl?: string;
  /**
   *
   * The Config of the node
   *
   * @generated from field: optional meshtastic.LocalConfig config = 4;
   */
  config?: LocalConfig;
  /**
   *
   * The ModuleConfig of the node
   *
   * @generated from field: optional meshtastic.LocalModuleConfig module_config = 5;
   */
  moduleConfig?: LocalModuleConfig;
  /**
   *
   * Fixed position data
   *
   * @generated from field: optional meshtastic.Position fixed_position = 6;
   */
  fixedPosition?: Position;
  /**
   *
   * Ringtone for ExternalNotification
   *
   * @generated from field: optional string ringtone = 7;
   */
  ringtone?: string;
  /**
   *
   * Predefined messages for CannedMessage
   *
   * @generated from field: optional string canned_messages = 8;
   */
  cannedMessages?: string;
};
/**
 * Describes the message meshtastic.DeviceProfile.
 * Use `create(DeviceProfileSchema)` to create a new message.
 */
declare const DeviceProfileSchema: GenMessage<DeviceProfile>;
declare namespace mqtt_pb_d_exports {
  export { MapReport, MapReportSchema, ServiceEnvelope, ServiceEnvelopeSchema, file_meshtastic_mqtt };
}
/**
 * Describes the file meshtastic/mqtt.proto.
 */
declare const file_meshtastic_mqtt: GenFile;
/**
 *
 * This message wraps a MeshPacket with extra metadata about the sender and how it arrived.
 *
 * @generated from message meshtastic.ServiceEnvelope
 */
type ServiceEnvelope = Message<"meshtastic.ServiceEnvelope"> & {
  /**
   *
   * The (probably encrypted) packet
   *
   * @generated from field: meshtastic.MeshPacket packet = 1;
   */
  packet?: MeshPacket;
  /**
   *
   * The global channel ID it was sent on
   *
   * @generated from field: string channel_id = 2;
   */
  channelId: string;
  /**
   *
   * The sending gateway node ID. Can we use this to authenticate/prevent fake
   * nodeid impersonation for senders? - i.e. use gateway/mesh id (which is authenticated) + local node id as
   * the globally trusted nodenum
   *
   * @generated from field: string gateway_id = 3;
   */
  gatewayId: string;
};
/**
 * Describes the message meshtastic.ServiceEnvelope.
 * Use `create(ServiceEnvelopeSchema)` to create a new message.
 */
declare const ServiceEnvelopeSchema: GenMessage<ServiceEnvelope>;
/**
 *
 * Information about a node intended to be reported unencrypted to a map using MQTT.
 *
 * @generated from message meshtastic.MapReport
 */
type MapReport = Message<"meshtastic.MapReport"> & {
  /**
   *
   * A full name for this user, i.e. "Kevin Hester"
   *
   * @generated from field: string long_name = 1;
   */
  longName: string;
  /**
   *
   * A VERY short name, ideally two characters.
   * Suitable for a tiny OLED screen
   *
   * @generated from field: string short_name = 2;
   */
  shortName: string;
  /**
   *
   * Role of the node that applies specific settings for a particular use-case
   *
   * @generated from field: meshtastic.Config.DeviceConfig.Role role = 3;
   */
  role: Config_DeviceConfig_Role;
  /**
   *
   * Hardware model of the node, i.e. T-Beam, Heltec V3, etc...
   *
   * @generated from field: meshtastic.HardwareModel hw_model = 4;
   */
  hwModel: HardwareModel;
  /**
   *
   * Device firmware version string
   *
   * @generated from field: string firmware_version = 5;
   */
  firmwareVersion: string;
  /**
   *
   * The region code for the radio (US, CN, EU433, etc...)
   *
   * @generated from field: meshtastic.Config.LoRaConfig.RegionCode region = 6;
   */
  region: Config_LoRaConfig_RegionCode;
  /**
   *
   * Modem preset used by the radio (LongFast, MediumSlow, etc...)
   *
   * @generated from field: meshtastic.Config.LoRaConfig.ModemPreset modem_preset = 7;
   */
  modemPreset: Config_LoRaConfig_ModemPreset;
  /**
   *
   * Whether the node has a channel with default PSK and name (LongFast, MediumSlow, etc...)
   * and it uses the default frequency slot given the region and modem preset.
   *
   * @generated from field: bool has_default_channel = 8;
   */
  hasDefaultChannel: boolean;
  /**
   *
   * Latitude: multiply by 1e-7 to get degrees in floating point
   *
   * @generated from field: sfixed32 latitude_i = 9;
   */
  latitudeI: number;
  /**
   *
   * Longitude: multiply by 1e-7 to get degrees in floating point
   *
   * @generated from field: sfixed32 longitude_i = 10;
   */
  longitudeI: number;
  /**
   *
   * Altitude in meters above MSL
   *
   * @generated from field: int32 altitude = 11;
   */
  altitude: number;
  /**
   *
   * Indicates the bits of precision for latitude and longitude set by the sending node
   *
   * @generated from field: uint32 position_precision = 12;
   */
  positionPrecision: number;
  /**
   *
   * Number of online nodes (heard in the last 2 hours) this node has in its list that were received locally (not via MQTT)
   *
   * @generated from field: uint32 num_online_local_nodes = 13;
   */
  numOnlineLocalNodes: number;
  /**
   *
   * User has opted in to share their location (map report) with the mqtt server
   * Controlled by map_report.should_report_location
   *
   * @generated from field: bool has_opted_report_location = 14;
   */
  hasOptedReportLocation: boolean;
};
/**
 * Describes the message meshtastic.MapReport.
 * Use `create(MapReportSchema)` to create a new message.
 */
declare const MapReportSchema: GenMessage<MapReport>;
declare namespace paxcount_pb_d_exports {
  export { Paxcount, PaxcountSchema, file_meshtastic_paxcount };
}
/**
 * Describes the file meshtastic/paxcount.proto.
 */
declare const file_meshtastic_paxcount: GenFile;
/**
 *
 * TODO: REPLACE
 *
 * @generated from message meshtastic.Paxcount
 */
type Paxcount = Message<"meshtastic.Paxcount"> & {
  /**
   *
   * seen Wifi devices
   *
   * @generated from field: uint32 wifi = 1;
   */
  wifi: number;
  /**
   *
   * Seen BLE devices
   *
   * @generated from field: uint32 ble = 2;
   */
  ble: number;
  /**
   *
   * Uptime in seconds
   *
   * @generated from field: uint32 uptime = 3;
   */
  uptime: number;
};
/**
 * Describes the message meshtastic.Paxcount.
 * Use `create(PaxcountSchema)` to create a new message.
 */
declare const PaxcountSchema: GenMessage<Paxcount>;
declare namespace powermon_pb_d_exports {
  export { PowerMon, PowerMonSchema, PowerMon_State, PowerMon_StateSchema, PowerStressMessage, PowerStressMessageSchema, PowerStressMessage_Opcode, PowerStressMessage_OpcodeSchema, file_meshtastic_powermon };
}
/**
 * Describes the file meshtastic/powermon.proto.
 */
declare const file_meshtastic_powermon: GenFile;
/**
 * Note: There are no 'PowerMon' messages normally in use (PowerMons are sent only as structured logs - slogs).
 * But we wrap our State enum in this message to effectively nest a namespace (without our linter yelling at us)
 *
 * @generated from message meshtastic.PowerMon
 */
type PowerMon = Message<"meshtastic.PowerMon"> & {};
/**
 * Describes the message meshtastic.PowerMon.
 * Use `create(PowerMonSchema)` to create a new message.
 */
declare const PowerMonSchema: GenMessage<PowerMon>;
/**
 * Any significant power changing event in meshtastic should be tagged with a powermon state transition.
 * If you are making new meshtastic features feel free to add new entries at the end of this definition.
 *
 * @generated from enum meshtastic.PowerMon.State
 */
declare enum PowerMon_State {
  /**
   * @generated from enum value: None = 0;
   */
  None = 0,
  /**
   * @generated from enum value: CPU_DeepSleep = 1;
   */
  CPU_DeepSleep = 1,
  /**
   * @generated from enum value: CPU_LightSleep = 2;
   */
  CPU_LightSleep = 2,
  /**
   *
   * The external Vext1 power is on.  Many boards have auxillary power rails that the CPU turns on only
   * occasionally.  In cases where that rail has multiple devices on it we usually want to have logging on
   * the state of that rail as an independent record.
   * For instance on the Heltec Tracker 1.1 board, this rail is the power source for the GPS and screen.
   *
   * The log messages will be short and complete (see PowerMon.Event in the protobufs for details).
   * something like "S:PM:C,0x00001234,REASON" where the hex number is the bitmask of all current states.
   * (We use a bitmask for states so that if a log message gets lost it won't be fatal)
   *
   * @generated from enum value: Vext1_On = 4;
   */
  Vext1_On = 4,
  /**
   * @generated from enum value: Lora_RXOn = 8;
   */
  Lora_RXOn = 8,
  /**
   * @generated from enum value: Lora_TXOn = 16;
   */
  Lora_TXOn = 16,
  /**
   * @generated from enum value: Lora_RXActive = 32;
   */
  Lora_RXActive = 32,
  /**
   * @generated from enum value: BT_On = 64;
   */
  BT_On = 64,
  /**
   * @generated from enum value: LED_On = 128;
   */
  LED_On = 128,
  /**
   * @generated from enum value: Screen_On = 256;
   */
  Screen_On = 256,
  /**
   * @generated from enum value: Screen_Drawing = 512;
   */
  Screen_Drawing = 512,
  /**
   * @generated from enum value: Wifi_On = 1024;
   */
  Wifi_On = 1024,
  /**
   *
   * GPS is actively trying to find our location
   * See GPSPowerState for more details
   *
   * @generated from enum value: GPS_Active = 2048;
   */
  GPS_Active = 2048,
}
/**
 * Describes the enum meshtastic.PowerMon.State.
 */
declare const PowerMon_StateSchema: GenEnum<PowerMon_State>;
/**
 *
 * PowerStress testing support via the C++ PowerStress module
 *
 * @generated from message meshtastic.PowerStressMessage
 */
type PowerStressMessage = Message<"meshtastic.PowerStressMessage"> & {
  /**
   *
   * What type of HardwareMessage is this?
   *
   * @generated from field: meshtastic.PowerStressMessage.Opcode cmd = 1;
   */
  cmd: PowerStressMessage_Opcode;
  /**
   * @generated from field: float num_seconds = 2;
   */
  numSeconds: number;
};
/**
 * Describes the message meshtastic.PowerStressMessage.
 * Use `create(PowerStressMessageSchema)` to create a new message.
 */
declare const PowerStressMessageSchema: GenMessage<PowerStressMessage>;
/**
 *
 * What operation would we like the UUT to perform.
 * note: senders should probably set want_response in their request packets, so that they can know when the state
 * machine has started processing their request
 *
 * @generated from enum meshtastic.PowerStressMessage.Opcode
 */
declare enum PowerStressMessage_Opcode {
  /**
   *
   * Unset/unused
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   * Print board version slog and send an ack that we are alive and ready to process commands
   *
   * @generated from enum value: PRINT_INFO = 1;
   */
  PRINT_INFO = 1,
  /**
   * Try to turn off all automatic processing of packets, screen, sleeping, etc (to make it easier to measure in isolation)
   *
   * @generated from enum value: FORCE_QUIET = 2;
   */
  FORCE_QUIET = 2,
  /**
   * Stop powerstress processing - probably by just rebooting the board
   *
   * @generated from enum value: END_QUIET = 3;
   */
  END_QUIET = 3,
  /**
   * Turn the screen on
   *
   * @generated from enum value: SCREEN_ON = 16;
   */
  SCREEN_ON = 16,
  /**
   * Turn the screen off
   *
   * @generated from enum value: SCREEN_OFF = 17;
   */
  SCREEN_OFF = 17,
  /**
   * Let the CPU run but we assume mostly idling for num_seconds
   *
   * @generated from enum value: CPU_IDLE = 32;
   */
  CPU_IDLE = 32,
  /**
   * Force deep sleep for FIXME seconds
   *
   * @generated from enum value: CPU_DEEPSLEEP = 33;
   */
  CPU_DEEPSLEEP = 33,
  /**
   * Spin the CPU as fast as possible for num_seconds
   *
   * @generated from enum value: CPU_FULLON = 34;
   */
  CPU_FULLON = 34,
  /**
   * Turn the LED on for num_seconds (and leave it on - for baseline power measurement purposes)
   *
   * @generated from enum value: LED_ON = 48;
   */
  LED_ON = 48,
  /**
   * Force the LED off for num_seconds
   *
   * @generated from enum value: LED_OFF = 49;
   */
  LED_OFF = 49,
  /**
   * Completely turn off the LORA radio for num_seconds
   *
   * @generated from enum value: LORA_OFF = 64;
   */
  LORA_OFF = 64,
  /**
   * Send Lora packets for num_seconds
   *
   * @generated from enum value: LORA_TX = 65;
   */
  LORA_TX = 65,
  /**
   * Receive Lora packets for num_seconds (node will be mostly just listening, unless an external agent is helping stress this by sending packets on the current channel)
   *
   * @generated from enum value: LORA_RX = 66;
   */
  LORA_RX = 66,
  /**
   * Turn off the BT radio for num_seconds
   *
   * @generated from enum value: BT_OFF = 80;
   */
  BT_OFF = 80,
  /**
   * Turn on the BT radio for num_seconds
   *
   * @generated from enum value: BT_ON = 81;
   */
  BT_ON = 81,
  /**
   * Turn off the WIFI radio for num_seconds
   *
   * @generated from enum value: WIFI_OFF = 96;
   */
  WIFI_OFF = 96,
  /**
   * Turn on the WIFI radio for num_seconds
   *
   * @generated from enum value: WIFI_ON = 97;
   */
  WIFI_ON = 97,
  /**
   * Turn off the GPS radio for num_seconds
   *
   * @generated from enum value: GPS_OFF = 112;
   */
  GPS_OFF = 112,
  /**
   * Turn on the GPS radio for num_seconds
   *
   * @generated from enum value: GPS_ON = 113;
   */
  GPS_ON = 113,
}
/**
 * Describes the enum meshtastic.PowerStressMessage.Opcode.
 */
declare const PowerStressMessage_OpcodeSchema: GenEnum<PowerStressMessage_Opcode>;
declare namespace remote_hardware_pb_d_exports {
  export { HardwareMessage, HardwareMessageSchema, HardwareMessage_Type, HardwareMessage_TypeSchema, file_meshtastic_remote_hardware };
}
/**
 * Describes the file meshtastic/remote_hardware.proto.
 */
declare const file_meshtastic_remote_hardware: GenFile;
/**
 *
 * An example app to show off the module system. This message is used for
 * REMOTE_HARDWARE_APP PortNums.
 * Also provides easy remote access to any GPIO.
 * In the future other remote hardware operations can be added based on user interest
 * (i.e. serial output, spi/i2c input/output).
 * FIXME - currently this feature is turned on by default which is dangerous
 * because no security yet (beyond the channel mechanism).
 * It should be off by default and then protected based on some TBD mechanism
 * (a special channel once multichannel support is included?)
 *
 * @generated from message meshtastic.HardwareMessage
 */
type HardwareMessage = Message<"meshtastic.HardwareMessage"> & {
  /**
   *
   * What type of HardwareMessage is this?
   *
   * @generated from field: meshtastic.HardwareMessage.Type type = 1;
   */
  type: HardwareMessage_Type;
  /**
   *
   * What gpios are we changing. Not used for all MessageTypes, see MessageType for details
   *
   * @generated from field: uint64 gpio_mask = 2;
   */
  gpioMask: bigint;
  /**
   *
   * For gpios that were listed in gpio_mask as valid, what are the signal levels for those gpios.
   * Not used for all MessageTypes, see MessageType for details
   *
   * @generated from field: uint64 gpio_value = 3;
   */
  gpioValue: bigint;
};
/**
 * Describes the message meshtastic.HardwareMessage.
 * Use `create(HardwareMessageSchema)` to create a new message.
 */
declare const HardwareMessageSchema: GenMessage<HardwareMessage>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from enum meshtastic.HardwareMessage.Type
 */
declare enum HardwareMessage_Type {
  /**
   *
   * Unset/unused
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * Set gpio gpios based on gpio_mask/gpio_value
   *
   * @generated from enum value: WRITE_GPIOS = 1;
   */
  WRITE_GPIOS = 1,
  /**
   *
   * We are now interested in watching the gpio_mask gpios.
   * If the selected gpios change, please broadcast GPIOS_CHANGED.
   * Will implicitly change the gpios requested to be INPUT gpios.
   *
   * @generated from enum value: WATCH_GPIOS = 2;
   */
  WATCH_GPIOS = 2,
  /**
   *
   * The gpios listed in gpio_mask have changed, the new values are listed in gpio_value
   *
   * @generated from enum value: GPIOS_CHANGED = 3;
   */
  GPIOS_CHANGED = 3,
  /**
   *
   * Read the gpios specified in gpio_mask, send back a READ_GPIOS_REPLY reply with gpio_value populated
   *
   * @generated from enum value: READ_GPIOS = 4;
   */
  READ_GPIOS = 4,
  /**
   *
   * A reply to READ_GPIOS. gpio_mask and gpio_value will be populated
   *
   * @generated from enum value: READ_GPIOS_REPLY = 5;
   */
  READ_GPIOS_REPLY = 5,
}
/**
 * Describes the enum meshtastic.HardwareMessage.Type.
 */
declare const HardwareMessage_TypeSchema: GenEnum<HardwareMessage_Type>;
declare namespace rtttl_pb_d_exports {
  export { RTTTLConfig, RTTTLConfigSchema, file_meshtastic_rtttl };
}
/**
 * Describes the file meshtastic/rtttl.proto.
 */
declare const file_meshtastic_rtttl: GenFile;
/**
 *
 * Canned message module configuration.
 *
 * @generated from message meshtastic.RTTTLConfig
 */
type RTTTLConfig = Message<"meshtastic.RTTTLConfig"> & {
  /**
   *
   * Ringtone for PWM Buzzer in RTTTL Format.
   *
   * @generated from field: string ringtone = 1;
   */
  ringtone: string;
};
/**
 * Describes the message meshtastic.RTTTLConfig.
 * Use `create(RTTTLConfigSchema)` to create a new message.
 */
declare const RTTTLConfigSchema: GenMessage<RTTTLConfig>;
declare namespace storeforward_pb_d_exports {
  export { StoreAndForward, StoreAndForwardSchema, StoreAndForward_Heartbeat, StoreAndForward_HeartbeatSchema, StoreAndForward_History, StoreAndForward_HistorySchema, StoreAndForward_RequestResponse, StoreAndForward_RequestResponseSchema, StoreAndForward_Statistics, StoreAndForward_StatisticsSchema, file_meshtastic_storeforward };
}
/**
 * Describes the file meshtastic/storeforward.proto.
 */
declare const file_meshtastic_storeforward: GenFile;
/**
 *
 * TODO: REPLACE
 *
 * @generated from message meshtastic.StoreAndForward
 */
type StoreAndForward = Message<"meshtastic.StoreAndForward"> & {
  /**
   *
   * TODO: REPLACE
   *
   * @generated from field: meshtastic.StoreAndForward.RequestResponse rr = 1;
   */
  rr: StoreAndForward_RequestResponse;
  /**
   *
   * TODO: REPLACE
   *
   * @generated from oneof meshtastic.StoreAndForward.variant
   */
  variant: {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.StoreAndForward.Statistics stats = 2;
     */
    value: StoreAndForward_Statistics;
    case: "stats";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.StoreAndForward.History history = 3;
     */
    value: StoreAndForward_History;
    case: "history";
  } | {
    /**
     *
     * TODO: REPLACE
     *
     * @generated from field: meshtastic.StoreAndForward.Heartbeat heartbeat = 4;
     */
    value: StoreAndForward_Heartbeat;
    case: "heartbeat";
  } | {
    /**
     *
     * Text from history message.
     *
     * @generated from field: bytes text = 5;
     */
    value: Uint8Array;
    case: "text";
  } | {
    case: undefined;
    value?: undefined;
  };
};
/**
 * Describes the message meshtastic.StoreAndForward.
 * Use `create(StoreAndForwardSchema)` to create a new message.
 */
declare const StoreAndForwardSchema: GenMessage<StoreAndForward>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from message meshtastic.StoreAndForward.Statistics
 */
type StoreAndForward_Statistics = Message<"meshtastic.StoreAndForward.Statistics"> & {
  /**
   *
   * Number of messages we have ever seen
   *
   * @generated from field: uint32 messages_total = 1;
   */
  messagesTotal: number;
  /**
   *
   * Number of messages we have currently saved our history.
   *
   * @generated from field: uint32 messages_saved = 2;
   */
  messagesSaved: number;
  /**
   *
   * Maximum number of messages we will save
   *
   * @generated from field: uint32 messages_max = 3;
   */
  messagesMax: number;
  /**
   *
   * Router uptime in seconds
   *
   * @generated from field: uint32 up_time = 4;
   */
  upTime: number;
  /**
   *
   * Number of times any client sent a request to the S&F.
   *
   * @generated from field: uint32 requests = 5;
   */
  requests: number;
  /**
   *
   * Number of times the history was requested.
   *
   * @generated from field: uint32 requests_history = 6;
   */
  requestsHistory: number;
  /**
   *
   * Is the heartbeat enabled on the server?
   *
   * @generated from field: bool heartbeat = 7;
   */
  heartbeat: boolean;
  /**
   *
   * Maximum number of messages the server will return.
   *
   * @generated from field: uint32 return_max = 8;
   */
  returnMax: number;
  /**
   *
   * Maximum history window in minutes the server will return messages from.
   *
   * @generated from field: uint32 return_window = 9;
   */
  returnWindow: number;
};
/**
 * Describes the message meshtastic.StoreAndForward.Statistics.
 * Use `create(StoreAndForward_StatisticsSchema)` to create a new message.
 */
declare const StoreAndForward_StatisticsSchema: GenMessage<StoreAndForward_Statistics>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from message meshtastic.StoreAndForward.History
 */
type StoreAndForward_History = Message<"meshtastic.StoreAndForward.History"> & {
  /**
   *
   * Number of that will be sent to the client
   *
   * @generated from field: uint32 history_messages = 1;
   */
  historyMessages: number;
  /**
   *
   * The window of messages that was used to filter the history client requested
   *
   * @generated from field: uint32 window = 2;
   */
  window: number;
  /**
   *
   * Index in the packet history of the last message sent in a previous request to the server.
   * Will be sent to the client before sending the history and can be set in a subsequent request to avoid getting packets the server already sent to the client.
   *
   * @generated from field: uint32 last_request = 3;
   */
  lastRequest: number;
};
/**
 * Describes the message meshtastic.StoreAndForward.History.
 * Use `create(StoreAndForward_HistorySchema)` to create a new message.
 */
declare const StoreAndForward_HistorySchema: GenMessage<StoreAndForward_History>;
/**
 *
 * TODO: REPLACE
 *
 * @generated from message meshtastic.StoreAndForward.Heartbeat
 */
type StoreAndForward_Heartbeat = Message<"meshtastic.StoreAndForward.Heartbeat"> & {
  /**
   *
   * Period in seconds that the heartbeat is sent out that will be sent to the client
   *
   * @generated from field: uint32 period = 1;
   */
  period: number;
  /**
   *
   * If set, this is not the primary Store & Forward router on the mesh
   *
   * @generated from field: uint32 secondary = 2;
   */
  secondary: number;
};
/**
 * Describes the message meshtastic.StoreAndForward.Heartbeat.
 * Use `create(StoreAndForward_HeartbeatSchema)` to create a new message.
 */
declare const StoreAndForward_HeartbeatSchema: GenMessage<StoreAndForward_Heartbeat>;
/**
 *
 * 001 - 063 = From Router
 * 064 - 127 = From Client
 *
 * @generated from enum meshtastic.StoreAndForward.RequestResponse
 */
declare enum StoreAndForward_RequestResponse {
  /**
   *
   * Unset/unused
   *
   * @generated from enum value: UNSET = 0;
   */
  UNSET = 0,
  /**
   *
   * Router is an in error state.
   *
   * @generated from enum value: ROUTER_ERROR = 1;
   */
  ROUTER_ERROR = 1,
  /**
   *
   * Router heartbeat
   *
   * @generated from enum value: ROUTER_HEARTBEAT = 2;
   */
  ROUTER_HEARTBEAT = 2,
  /**
   *
   * Router has requested the client respond. This can work as a
   * "are you there" message.
   *
   * @generated from enum value: ROUTER_PING = 3;
   */
  ROUTER_PING = 3,
  /**
   *
   * The response to a "Ping"
   *
   * @generated from enum value: ROUTER_PONG = 4;
   */
  ROUTER_PONG = 4,
  /**
   *
   * Router is currently busy. Please try again later.
   *
   * @generated from enum value: ROUTER_BUSY = 5;
   */
  ROUTER_BUSY = 5,
  /**
   *
   * Router is responding to a request for history.
   *
   * @generated from enum value: ROUTER_HISTORY = 6;
   */
  ROUTER_HISTORY = 6,
  /**
   *
   * Router is responding to a request for stats.
   *
   * @generated from enum value: ROUTER_STATS = 7;
   */
  ROUTER_STATS = 7,
  /**
   *
   * Router sends a text message from its history that was a direct message.
   *
   * @generated from enum value: ROUTER_TEXT_DIRECT = 8;
   */
  ROUTER_TEXT_DIRECT = 8,
  /**
   *
   * Router sends a text message from its history that was a broadcast.
   *
   * @generated from enum value: ROUTER_TEXT_BROADCAST = 9;
   */
  ROUTER_TEXT_BROADCAST = 9,
  /**
   *
   * Client is an in error state.
   *
   * @generated from enum value: CLIENT_ERROR = 64;
   */
  CLIENT_ERROR = 64,
  /**
   *
   * Client has requested a replay from the router.
   *
   * @generated from enum value: CLIENT_HISTORY = 65;
   */
  CLIENT_HISTORY = 65,
  /**
   *
   * Client has requested stats from the router.
   *
   * @generated from enum value: CLIENT_STATS = 66;
   */
  CLIENT_STATS = 66,
  /**
   *
   * Client has requested the router respond. This can work as a
   * "are you there" message.
   *
   * @generated from enum value: CLIENT_PING = 67;
   */
  CLIENT_PING = 67,
  /**
   *
   * The response to a "Ping"
   *
   * @generated from enum value: CLIENT_PONG = 68;
   */
  CLIENT_PONG = 68,
  /**
   *
   * Client has requested that the router abort processing the client's request
   *
   * @generated from enum value: CLIENT_ABORT = 106;
   */
  CLIENT_ABORT = 106,
}
/**
 * Describes the enum meshtastic.StoreAndForward.RequestResponse.
 */
declare const StoreAndForward_RequestResponseSchema: GenEnum<StoreAndForward_RequestResponse>;
//#endregion
export { atak_pb_d_exports as ATAK, admin_pb_d_exports as Admin, apponly_pb_d_exports as AppOnly, cannedmessages_pb_d_exports as CannedMessages, channel_pb_d_exports as Channel, clientonly_pb_d_exports as ClientOnly, config_pb_d_exports as Config, connection_status_pb_d_exports as ConnectionStatus, localonly_pb_d_exports as LocalOnly, mesh_pb_d_exports as Mesh, module_config_pb_d_exports as ModuleConfig, mqtt_pb_d_exports as Mqtt, paxcount_pb_d_exports as PaxCount, portnums_pb_d_exports as Portnums, powermon_pb_d_exports as PowerMon, remote_hardware_pb_d_exports as RemoteHardware, rtttl_pb_d_exports as Rtttl, storeforward_pb_d_exports as StoreForward, telemetry_pb_d_exports as Telemetry, xmodem_pb_d_exports as Xmodem };