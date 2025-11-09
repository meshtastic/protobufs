import { t as __export } from "./chunk-z5eko27R.mjs";
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import { file_google_protobuf_descriptor } from "@bufbuild/protobuf/wkt";

//#region lib/meshtastic/channel_pb.ts
var channel_pb_exports = /* @__PURE__ */ __export({
	ChannelSchema: () => ChannelSchema,
	ChannelSettingsSchema: () => ChannelSettingsSchema,
	Channel_Role: () => Channel_Role,
	Channel_RoleSchema: () => Channel_RoleSchema,
	ModuleSettingsSchema: () => ModuleSettingsSchema,
	file_meshtastic_channel: () => file_meshtastic_channel
});
/**
* Describes the file meshtastic/channel.proto.
*/
const file_meshtastic_channel = /* @__PURE__ */ fileDesc("ChhtZXNodGFzdGljL2NoYW5uZWwucHJvdG8SCm1lc2h0YXN0aWMiuAEKD0NoYW5uZWxTZXR0aW5ncxIXCgtjaGFubmVsX251bRgBIAEoDUICGAESCwoDcHNrGAIgASgMEgwKBG5hbWUYAyABKAkSCgoCaWQYBCABKAcSFgoOdXBsaW5rX2VuYWJsZWQYBSABKAgSGAoQZG93bmxpbmtfZW5hYmxlZBgGIAEoCBIzCg9tb2R1bGVfc2V0dGluZ3MYByABKAsyGi5tZXNodGFzdGljLk1vZHVsZVNldHRpbmdzIj4KDk1vZHVsZVNldHRpbmdzEhoKEnBvc2l0aW9uX3ByZWNpc2lvbhgBIAEoDRIQCghpc19tdXRlZBgCIAEoCCKhAQoHQ2hhbm5lbBINCgVpbmRleBgBIAEoBRItCghzZXR0aW5ncxgCIAEoCzIbLm1lc2h0YXN0aWMuQ2hhbm5lbFNldHRpbmdzEiYKBHJvbGUYAyABKA4yGC5tZXNodGFzdGljLkNoYW5uZWwuUm9sZSIwCgRSb2xlEgwKCERJU0FCTEVEEAASCwoHUFJJTUFSWRABEg0KCVNFQ09OREFSWRACQmMKFG9yZy5tZXNodGFzdGljLnByb3RvQg1DaGFubmVsUHJvdG9zWiJnaXRodWIuY29tL21lc2h0YXN0aWMvZ28vZ2VuZXJhdGVkqgIUTWVzaHRhc3RpYy5Qcm90b2J1ZnO6AgBiBnByb3RvMw");
/**
* Describes the message meshtastic.ChannelSettings.
* Use `create(ChannelSettingsSchema)` to create a new message.
*/
const ChannelSettingsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_channel, 0);
/**
* Describes the message meshtastic.ModuleSettings.
* Use `create(ModuleSettingsSchema)` to create a new message.
*/
const ModuleSettingsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_channel, 1);
/**
* Describes the message meshtastic.Channel.
* Use `create(ChannelSchema)` to create a new message.
*/
const ChannelSchema = /* @__PURE__ */ messageDesc(file_meshtastic_channel, 2);
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
let Channel_Role = /* @__PURE__ */ function(Channel_Role$1) {
	/**
	*
	* This channel is not in use right now
	*
	* @generated from enum value: DISABLED = 0;
	*/
	Channel_Role$1[Channel_Role$1["DISABLED"] = 0] = "DISABLED";
	/**
	*
	* This channel is used to set the frequency for the radio - all other enabled channels must be SECONDARY
	*
	* @generated from enum value: PRIMARY = 1;
	*/
	Channel_Role$1[Channel_Role$1["PRIMARY"] = 1] = "PRIMARY";
	/**
	*
	* Secondary channels are only used for encryption/decryption/authentication purposes.
	* Their radio settings (freq etc) are ignored, only psk is used.
	*
	* @generated from enum value: SECONDARY = 2;
	*/
	Channel_Role$1[Channel_Role$1["SECONDARY"] = 2] = "SECONDARY";
	return Channel_Role$1;
}({});
/**
* Describes the enum meshtastic.Channel.Role.
*/
const Channel_RoleSchema = /* @__PURE__ */ enumDesc(file_meshtastic_channel, 2, 0);

//#endregion
//#region lib/meshtastic/device_ui_pb.ts
/**
* Describes the file meshtastic/device_ui.proto.
*/
const file_meshtastic_device_ui = /* @__PURE__ */ fileDesc("ChptZXNodGFzdGljL2RldmljZV91aS5wcm90bxIKbWVzaHRhc3RpYyLABQoORGV2aWNlVUlDb25maWcSDwoHdmVyc2lvbhgBIAEoDRIZChFzY3JlZW5fYnJpZ2h0bmVzcxgCIAEoDRIWCg5zY3JlZW5fdGltZW91dBgDIAEoDRITCgtzY3JlZW5fbG9jaxgEIAEoCBIVCg1zZXR0aW5nc19sb2NrGAUgASgIEhAKCHBpbl9jb2RlGAYgASgNEiAKBXRoZW1lGAcgASgOMhEubWVzaHRhc3RpYy5UaGVtZRIVCg1hbGVydF9lbmFibGVkGAggASgIEhYKDmJhbm5lcl9lbmFibGVkGAkgASgIEhQKDHJpbmdfdG9uZV9pZBgKIAEoDRImCghsYW5ndWFnZRgLIAEoDjIULm1lc2h0YXN0aWMuTGFuZ3VhZ2USKwoLbm9kZV9maWx0ZXIYDCABKAsyFi5tZXNodGFzdGljLk5vZGVGaWx0ZXISMQoObm9kZV9oaWdobGlnaHQYDSABKAsyGS5tZXNodGFzdGljLk5vZGVIaWdobGlnaHQSGAoQY2FsaWJyYXRpb25fZGF0YRgOIAEoDBIhCghtYXBfZGF0YRgPIAEoCzIPLm1lc2h0YXN0aWMuTWFwEi0KDGNvbXBhc3NfbW9kZRgQIAEoDjIXLm1lc2h0YXN0aWMuQ29tcGFzc01vZGUSGAoQc2NyZWVuX3JnYl9jb2xvchgRIAEoDRIbChNpc19jbG9ja2ZhY2VfYW5hbG9nGBIgASgIEkIKCmdwc19mb3JtYXQYEyABKA4yLi5tZXNodGFzdGljLkRldmljZVVJQ29uZmlnLkdwc0Nvb3JkaW5hdGVGb3JtYXQiVgoTR3BzQ29vcmRpbmF0ZUZvcm1hdBIHCgNERUMQABIHCgNETVMQARIHCgNVVE0QAhIICgRNR1JTEAMSBwoDT0xDEAQSCAoET1NHUhAFEgcKA01MUxAGIqcBCgpOb2RlRmlsdGVyEhYKDnVua25vd25fc3dpdGNoGAEgASgIEhYKDm9mZmxpbmVfc3dpdGNoGAIgASgIEhkKEXB1YmxpY19rZXlfc3dpdGNoGAMgASgIEhEKCWhvcHNfYXdheRgEIAEoBRIXCg9wb3NpdGlvbl9zd2l0Y2gYBSABKAgSEQoJbm9kZV9uYW1lGAYgASgJEg8KB2NoYW5uZWwYByABKAUifgoNTm9kZUhpZ2hsaWdodBITCgtjaGF0X3N3aXRjaBgBIAEoCBIXCg9wb3NpdGlvbl9zd2l0Y2gYAiABKAgSGAoQdGVsZW1ldHJ5X3N3aXRjaBgDIAEoCBISCgppYXFfc3dpdGNoGAQgASgIEhEKCW5vZGVfbmFtZRgFIAEoCSI9CghHZW9Qb2ludBIMCgR6b29tGAEgASgFEhAKCGxhdGl0dWRlGAIgASgFEhEKCWxvbmdpdHVkZRgDIAEoBSJMCgNNYXASIgoEaG9tZRgBIAEoCzIULm1lc2h0YXN0aWMuR2VvUG9pbnQSDQoFc3R5bGUYAiABKAkSEgoKZm9sbG93X2dwcxgDIAEoCCo+CgtDb21wYXNzTW9kZRILCgdEWU5BTUlDEAASDgoKRklYRURfUklORxABEhIKDkZSRUVaRV9IRUFESU5HEAIqJQoFVGhlbWUSCAoEREFSSxAAEgkKBUxJR0hUEAESBwoDUkVEEAIqwAIKCExhbmd1YWdlEgsKB0VOR0xJU0gQABIKCgZGUkVOQ0gQARIKCgZHRVJNQU4QAhILCgdJVEFMSUFOEAMSDgoKUE9SVFVHVUVTRRAEEgsKB1NQQU5JU0gQBRILCgdTV0VESVNIEAYSCwoHRklOTklTSBAHEgoKBlBPTElTSBAIEgsKB1RVUktJU0gQCRILCgdTRVJCSUFOEAoSCwoHUlVTU0lBThALEgkKBURVVENIEAwSCQoFR1JFRUsQDRINCglOT1JXRUdJQU4QDhINCglTTE9WRU5JQU4QDxINCglVS1JBSU5JQU4QEBINCglCVUxHQVJJQU4QERIJCgVDWkVDSBASEgoKBkRBTklTSBATEhYKElNJTVBMSUZJRURfQ0hJTkVTRRAeEhcKE1RSQURJVElPTkFMX0NISU5FU0UQH0JkChRvcmcubWVzaHRhc3RpYy5wcm90b0IORGV2aWNlVUlQcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z");

//#endregion
//#region lib/meshtastic/config_pb.ts
var config_pb_exports = /* @__PURE__ */ __export({
	ConfigSchema: () => ConfigSchema,
	Config_BluetoothConfigSchema: () => Config_BluetoothConfigSchema,
	Config_BluetoothConfig_PairingMode: () => Config_BluetoothConfig_PairingMode,
	Config_BluetoothConfig_PairingModeSchema: () => Config_BluetoothConfig_PairingModeSchema,
	Config_DeviceConfigSchema: () => Config_DeviceConfigSchema,
	Config_DeviceConfig_BuzzerMode: () => Config_DeviceConfig_BuzzerMode,
	Config_DeviceConfig_BuzzerModeSchema: () => Config_DeviceConfig_BuzzerModeSchema,
	Config_DeviceConfig_RebroadcastMode: () => Config_DeviceConfig_RebroadcastMode,
	Config_DeviceConfig_RebroadcastModeSchema: () => Config_DeviceConfig_RebroadcastModeSchema,
	Config_DeviceConfig_Role: () => Config_DeviceConfig_Role,
	Config_DeviceConfig_RoleSchema: () => Config_DeviceConfig_RoleSchema,
	Config_DisplayConfigSchema: () => Config_DisplayConfigSchema,
	Config_DisplayConfig_CompassOrientation: () => Config_DisplayConfig_CompassOrientation,
	Config_DisplayConfig_CompassOrientationSchema: () => Config_DisplayConfig_CompassOrientationSchema,
	Config_DisplayConfig_DeprecatedGpsCoordinateFormat: () => Config_DisplayConfig_DeprecatedGpsCoordinateFormat,
	Config_DisplayConfig_DeprecatedGpsCoordinateFormatSchema: () => Config_DisplayConfig_DeprecatedGpsCoordinateFormatSchema,
	Config_DisplayConfig_DisplayMode: () => Config_DisplayConfig_DisplayMode,
	Config_DisplayConfig_DisplayModeSchema: () => Config_DisplayConfig_DisplayModeSchema,
	Config_DisplayConfig_DisplayUnits: () => Config_DisplayConfig_DisplayUnits,
	Config_DisplayConfig_DisplayUnitsSchema: () => Config_DisplayConfig_DisplayUnitsSchema,
	Config_DisplayConfig_OledType: () => Config_DisplayConfig_OledType,
	Config_DisplayConfig_OledTypeSchema: () => Config_DisplayConfig_OledTypeSchema,
	Config_LoRaConfigSchema: () => Config_LoRaConfigSchema,
	Config_LoRaConfig_ModemPreset: () => Config_LoRaConfig_ModemPreset,
	Config_LoRaConfig_ModemPresetSchema: () => Config_LoRaConfig_ModemPresetSchema,
	Config_LoRaConfig_RegionCode: () => Config_LoRaConfig_RegionCode,
	Config_LoRaConfig_RegionCodeSchema: () => Config_LoRaConfig_RegionCodeSchema,
	Config_NetworkConfigSchema: () => Config_NetworkConfigSchema,
	Config_NetworkConfig_AddressMode: () => Config_NetworkConfig_AddressMode,
	Config_NetworkConfig_AddressModeSchema: () => Config_NetworkConfig_AddressModeSchema,
	Config_NetworkConfig_IpV4ConfigSchema: () => Config_NetworkConfig_IpV4ConfigSchema,
	Config_NetworkConfig_ProtocolFlags: () => Config_NetworkConfig_ProtocolFlags,
	Config_NetworkConfig_ProtocolFlagsSchema: () => Config_NetworkConfig_ProtocolFlagsSchema,
	Config_PositionConfigSchema: () => Config_PositionConfigSchema,
	Config_PositionConfig_GpsMode: () => Config_PositionConfig_GpsMode,
	Config_PositionConfig_GpsModeSchema: () => Config_PositionConfig_GpsModeSchema,
	Config_PositionConfig_PositionFlags: () => Config_PositionConfig_PositionFlags,
	Config_PositionConfig_PositionFlagsSchema: () => Config_PositionConfig_PositionFlagsSchema,
	Config_PowerConfigSchema: () => Config_PowerConfigSchema,
	Config_SecurityConfigSchema: () => Config_SecurityConfigSchema,
	Config_SessionkeyConfigSchema: () => Config_SessionkeyConfigSchema,
	file_meshtastic_config: () => file_meshtastic_config
});
/**
* Describes the file meshtastic/config.proto.
*/
const file_meshtastic_config = /* @__PURE__ */ fileDesc("ChdtZXNodGFzdGljL2NvbmZpZy5wcm90bxIKbWVzaHRhc3RpYyKNKQoGQ29uZmlnEjEKBmRldmljZRgBIAEoCzIfLm1lc2h0YXN0aWMuQ29uZmlnLkRldmljZUNvbmZpZ0gAEjUKCHBvc2l0aW9uGAIgASgLMiEubWVzaHRhc3RpYy5Db25maWcuUG9zaXRpb25Db25maWdIABIvCgVwb3dlchgDIAEoCzIeLm1lc2h0YXN0aWMuQ29uZmlnLlBvd2VyQ29uZmlnSAASMwoHbmV0d29yaxgEIAEoCzIgLm1lc2h0YXN0aWMuQ29uZmlnLk5ldHdvcmtDb25maWdIABIzCgdkaXNwbGF5GAUgASgLMiAubWVzaHRhc3RpYy5Db25maWcuRGlzcGxheUNvbmZpZ0gAEi0KBGxvcmEYBiABKAsyHS5tZXNodGFzdGljLkNvbmZpZy5Mb1JhQ29uZmlnSAASNwoJYmx1ZXRvb3RoGAcgASgLMiIubWVzaHRhc3RpYy5Db25maWcuQmx1ZXRvb3RoQ29uZmlnSAASNQoIc2VjdXJpdHkYCCABKAsyIS5tZXNodGFzdGljLkNvbmZpZy5TZWN1cml0eUNvbmZpZ0gAEjkKCnNlc3Npb25rZXkYCSABKAsyIy5tZXNodGFzdGljLkNvbmZpZy5TZXNzaW9ua2V5Q29uZmlnSAASLwoJZGV2aWNlX3VpGAogASgLMhoubWVzaHRhc3RpYy5EZXZpY2VVSUNvbmZpZ0gAGvYGCgxEZXZpY2VDb25maWcSMgoEcm9sZRgBIAEoDjIkLm1lc2h0YXN0aWMuQ29uZmlnLkRldmljZUNvbmZpZy5Sb2xlEhoKDnNlcmlhbF9lbmFibGVkGAIgASgIQgIYARITCgtidXR0b25fZ3BpbxgEIAEoDRITCgtidXp6ZXJfZ3BpbxgFIAEoDRJJChByZWJyb2FkY2FzdF9tb2RlGAYgASgOMi8ubWVzaHRhc3RpYy5Db25maWcuRGV2aWNlQ29uZmlnLlJlYnJvYWRjYXN0TW9kZRIgChhub2RlX2luZm9fYnJvYWRjYXN0X3NlY3MYByABKA0SIgoaZG91YmxlX3RhcF9hc19idXR0b25fcHJlc3MYCCABKAgSFgoKaXNfbWFuYWdlZBgJIAEoCEICGAESHAoUZGlzYWJsZV90cmlwbGVfY2xpY2sYCiABKAgSDQoFdHpkZWYYCyABKAkSHgoWbGVkX2hlYXJ0YmVhdF9kaXNhYmxlZBgMIAEoCBI/CgtidXp6ZXJfbW9kZRgNIAEoDjIqLm1lc2h0YXN0aWMuQ29uZmlnLkRldmljZUNvbmZpZy5CdXp6ZXJNb2RlItQBCgRSb2xlEgoKBkNMSUVOVBAAEg8KC0NMSUVOVF9NVVRFEAESCgoGUk9VVEVSEAISFQoNUk9VVEVSX0NMSUVOVBADGgIIARIQCghSRVBFQVRFUhAEGgIIARILCgdUUkFDS0VSEAUSCgoGU0VOU09SEAYSBwoDVEFLEAcSEQoNQ0xJRU5UX0hJRERFThAIEhIKDkxPU1RfQU5EX0ZPVU5EEAkSDwoLVEFLX1RSQUNLRVIQChIPCgtST1VURVJfTEFURRALEg8KC0NMSUVOVF9CQVNFEAwicwoPUmVicm9hZGNhc3RNb2RlEgcKA0FMTBAAEhUKEUFMTF9TS0lQX0RFQ09ESU5HEAESDgoKTE9DQUxfT05MWRACEg4KCktOT1dOX09OTFkQAxIICgROT05FEAQSFgoSQ09SRV9QT1JUTlVNU19PTkxZEAUiaQoKQnV6emVyTW9kZRIPCgtBTExfRU5BQkxFRBAAEgwKCERJU0FCTEVEEAESFgoSTk9USUZJQ0FUSU9OU19PTkxZEAISDwoLU1lTVEVNX09OTFkQAxITCg9ESVJFQ1RfTVNHX09OTFkQBBqRBQoOUG9zaXRpb25Db25maWcSHwoXcG9zaXRpb25fYnJvYWRjYXN0X3NlY3MYASABKA0SKAogcG9zaXRpb25fYnJvYWRjYXN0X3NtYXJ0X2VuYWJsZWQYAiABKAgSFgoOZml4ZWRfcG9zaXRpb24YAyABKAgSFwoLZ3BzX2VuYWJsZWQYBCABKAhCAhgBEhsKE2dwc191cGRhdGVfaW50ZXJ2YWwYBSABKA0SHAoQZ3BzX2F0dGVtcHRfdGltZRgGIAEoDUICGAESFgoOcG9zaXRpb25fZmxhZ3MYByABKA0SDwoHcnhfZ3BpbxgIIAEoDRIPCgd0eF9ncGlvGAkgASgNEigKIGJyb2FkY2FzdF9zbWFydF9taW5pbXVtX2Rpc3RhbmNlGAogASgNEi0KJWJyb2FkY2FzdF9zbWFydF9taW5pbXVtX2ludGVydmFsX3NlY3MYCyABKA0SEwoLZ3BzX2VuX2dwaW8YDCABKA0SOwoIZ3BzX21vZGUYDSABKA4yKS5tZXNodGFzdGljLkNvbmZpZy5Qb3NpdGlvbkNvbmZpZy5HcHNNb2RlIqsBCg1Qb3NpdGlvbkZsYWdzEgkKBVVOU0VUEAASDAoIQUxUSVRVREUQARIQCgxBTFRJVFVERV9NU0wQAhIWChJHRU9JREFMX1NFUEFSQVRJT04QBBIHCgNET1AQCBIJCgVIVkRPUBAQEg0KCVNBVElOVklFVxAgEgoKBlNFUV9OTxBAEg4KCVRJTUVTVEFNUBCAARIMCgdIRUFESU5HEIACEgoKBVNQRUVEEIAEIjUKB0dwc01vZGUSDAoIRElTQUJMRUQQABILCgdFTkFCTEVEEAESDwoLTk9UX1BSRVNFTlQQAhqEAgoLUG93ZXJDb25maWcSFwoPaXNfcG93ZXJfc2F2aW5nGAEgASgIEiYKHm9uX2JhdHRlcnlfc2h1dGRvd25fYWZ0ZXJfc2VjcxgCIAEoDRIfChdhZGNfbXVsdGlwbGllcl9vdmVycmlkZRgDIAEoAhIbChN3YWl0X2JsdWV0b290aF9zZWNzGAQgASgNEhAKCHNkc19zZWNzGAYgASgNEg8KB2xzX3NlY3MYByABKA0SFQoNbWluX3dha2Vfc2VjcxgIIAEoDRIiChpkZXZpY2VfYmF0dGVyeV9pbmFfYWRkcmVzcxgJIAEoDRIYChBwb3dlcm1vbl9lbmFibGVzGCAgASgEGuUDCg1OZXR3b3JrQ29uZmlnEhQKDHdpZmlfZW5hYmxlZBgBIAEoCBIRCgl3aWZpX3NzaWQYAyABKAkSEAoId2lmaV9wc2sYBCABKAkSEgoKbnRwX3NlcnZlchgFIAEoCRITCgtldGhfZW5hYmxlZBgGIAEoCBJCCgxhZGRyZXNzX21vZGUYByABKA4yLC5tZXNodGFzdGljLkNvbmZpZy5OZXR3b3JrQ29uZmlnLkFkZHJlc3NNb2RlEkAKC2lwdjRfY29uZmlnGAggASgLMisubWVzaHRhc3RpYy5Db25maWcuTmV0d29ya0NvbmZpZy5JcFY0Q29uZmlnEhYKDnJzeXNsb2dfc2VydmVyGAkgASgJEhkKEWVuYWJsZWRfcHJvdG9jb2xzGAogASgNEhQKDGlwdjZfZW5hYmxlZBgLIAEoCBpGCgpJcFY0Q29uZmlnEgoKAmlwGAEgASgHEg8KB2dhdGV3YXkYAiABKAcSDgoGc3VibmV0GAMgASgHEgsKA2RucxgEIAEoByIjCgtBZGRyZXNzTW9kZRIICgRESENQEAASCgoGU1RBVElDEAEiNAoNUHJvdG9jb2xGbGFncxIQCgxOT19CUk9BRENBU1QQABIRCg1VRFBfQlJPQURDQVNUEAEaiQgKDURpc3BsYXlDb25maWcSFgoOc2NyZWVuX29uX3NlY3MYASABKA0SVgoKZ3BzX2Zvcm1hdBgCIAEoDjI+Lm1lc2h0YXN0aWMuQ29uZmlnLkRpc3BsYXlDb25maWcuRGVwcmVjYXRlZEdwc0Nvb3JkaW5hdGVGb3JtYXRCAhgBEiEKGWF1dG9fc2NyZWVuX2Nhcm91c2VsX3NlY3MYAyABKA0SHQoRY29tcGFzc19ub3J0aF90b3AYBCABKAhCAhgBEhMKC2ZsaXBfc2NyZWVuGAUgASgIEjwKBXVuaXRzGAYgASgOMi0ubWVzaHRhc3RpYy5Db25maWcuRGlzcGxheUNvbmZpZy5EaXNwbGF5VW5pdHMSNwoEb2xlZBgHIAEoDjIpLm1lc2h0YXN0aWMuQ29uZmlnLkRpc3BsYXlDb25maWcuT2xlZFR5cGUSQQoLZGlzcGxheW1vZGUYCCABKA4yLC5tZXNodGFzdGljLkNvbmZpZy5EaXNwbGF5Q29uZmlnLkRpc3BsYXlNb2RlEhQKDGhlYWRpbmdfYm9sZBgJIAEoCBIdChV3YWtlX29uX3RhcF9vcl9tb3Rpb24YCiABKAgSUAoTY29tcGFzc19vcmllbnRhdGlvbhgLIAEoDjIzLm1lc2h0YXN0aWMuQ29uZmlnLkRpc3BsYXlDb25maWcuQ29tcGFzc09yaWVudGF0aW9uEhUKDXVzZV8xMmhfY2xvY2sYDCABKAgSGgoSdXNlX2xvbmdfbm9kZV9uYW1lGA0gASgIIisKHURlcHJlY2F0ZWRHcHNDb29yZGluYXRlRm9ybWF0EgoKBlVOVVNFRBAAIigKDERpc3BsYXlVbml0cxIKCgZNRVRSSUMQABIMCghJTVBFUklBTBABImYKCE9sZWRUeXBlEg0KCU9MRURfQVVUTxAAEhAKDE9MRURfU1NEMTMwNhABEg8KC09MRURfU0gxMTA2EAISDwoLT0xFRF9TSDExMDcQAxIXChNPTEVEX1NIMTEwN18xMjhfMTI4EAQiQQoLRGlzcGxheU1vZGUSCwoHREVGQVVMVBAAEgwKCFRXT0NPTE9SEAESDAoISU5WRVJURUQQAhIJCgVDT0xPUhADIroBChJDb21wYXNzT3JpZW50YXRpb24SDQoJREVHUkVFU18wEAASDgoKREVHUkVFU185MBABEg8KC0RFR1JFRVNfMTgwEAISDwoLREVHUkVFU18yNzAQAxIWChJERUdSRUVTXzBfSU5WRVJURUQQBBIXChNERUdSRUVTXzkwX0lOVkVSVEVEEAUSGAoUREVHUkVFU18xODBfSU5WRVJURUQQBhIYChRERUdSRUVTXzI3MF9JTlZFUlRFRBAHGtoHCgpMb1JhQ29uZmlnEhIKCnVzZV9wcmVzZXQYASABKAgSPwoMbW9kZW1fcHJlc2V0GAIgASgOMikubWVzaHRhc3RpYy5Db25maWcuTG9SYUNvbmZpZy5Nb2RlbVByZXNldBIRCgliYW5kd2lkdGgYAyABKA0SFQoNc3ByZWFkX2ZhY3RvchgEIAEoDRITCgtjb2RpbmdfcmF0ZRgFIAEoDRIYChBmcmVxdWVuY3lfb2Zmc2V0GAYgASgCEjgKBnJlZ2lvbhgHIAEoDjIoLm1lc2h0YXN0aWMuQ29uZmlnLkxvUmFDb25maWcuUmVnaW9uQ29kZRIRCglob3BfbGltaXQYCCABKA0SEgoKdHhfZW5hYmxlZBgJIAEoCBIQCgh0eF9wb3dlchgKIAEoBRITCgtjaGFubmVsX251bRgLIAEoDRIbChNvdmVycmlkZV9kdXR5X2N5Y2xlGAwgASgIEh4KFnN4MTI2eF9yeF9ib29zdGVkX2dhaW4YDSABKAgSGgoSb3ZlcnJpZGVfZnJlcXVlbmN5GA4gASgCEhcKD3BhX2Zhbl9kaXNhYmxlZBgPIAEoCBIXCg9pZ25vcmVfaW5jb21pbmcYZyADKA0SEwoLaWdub3JlX21xdHQYaCABKAgSGQoRY29uZmlnX29rX3RvX21xdHQYaSABKAgirgIKClJlZ2lvbkNvZGUSCQoFVU5TRVQQABIGCgJVUxABEgoKBkVVXzQzMxACEgoKBkVVXzg2OBADEgYKAkNOEAQSBgoCSlAQBRIHCgNBTloQBhIGCgJLUhAHEgYKAlRXEAgSBgoCUlUQCRIGCgJJThAKEgoKBk5aXzg2NRALEgYKAlRIEAwSCwoHTE9SQV8yNBANEgoKBlVBXzQzMxAOEgoKBlVBXzg2OBAPEgoKBk1ZXzQzMxAQEgoKBk1ZXzkxORAREgoKBlNHXzkyMxASEgoKBlBIXzQzMxATEgoKBlBIXzg2OBAUEgoKBlBIXzkxNRAVEgsKB0FOWl80MzMQFhIKCgZLWl80MzMQFxIKCgZLWl84NjMQGBIKCgZOUF84NjUQGRIKCgZCUl85MDIQGiKpAQoLTW9kZW1QcmVzZXQSDQoJTE9OR19GQVNUEAASDQoJTE9OR19TTE9XEAESFgoOVkVSWV9MT05HX1NMT1cQAhoCCAESDwoLTUVESVVNX1NMT1cQAxIPCgtNRURJVU1fRkFTVBAEEg4KClNIT1JUX1NMT1cQBRIOCgpTSE9SVF9GQVNUEAYSEQoNTE9OR19NT0RFUkFURRAHEg8KC1NIT1JUX1RVUkJPEAgarQEKD0JsdWV0b290aENvbmZpZxIPCgdlbmFibGVkGAEgASgIEjwKBG1vZGUYAiABKA4yLi5tZXNodGFzdGljLkNvbmZpZy5CbHVldG9vdGhDb25maWcuUGFpcmluZ01vZGUSEQoJZml4ZWRfcGluGAMgASgNIjgKC1BhaXJpbmdNb2RlEg4KClJBTkRPTV9QSU4QABINCglGSVhFRF9QSU4QARIKCgZOT19QSU4QAhq2AQoOU2VjdXJpdHlDb25maWcSEgoKcHVibGljX2tleRgBIAEoDBITCgtwcml2YXRlX2tleRgCIAEoDBIRCglhZG1pbl9rZXkYAyADKAwSEgoKaXNfbWFuYWdlZBgEIAEoCBIWCg5zZXJpYWxfZW5hYmxlZBgFIAEoCBIdChVkZWJ1Z19sb2dfYXBpX2VuYWJsZWQYBiABKAgSHQoVYWRtaW5fY2hhbm5lbF9lbmFibGVkGAggASgIGhIKEFNlc3Npb25rZXlDb25maWdCEQoPcGF5bG9hZF92YXJpYW50QmIKFG9yZy5tZXNodGFzdGljLnByb3RvQgxDb25maWdQcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z", [file_meshtastic_device_ui]);
/**
* Describes the message meshtastic.Config.
* Use `create(ConfigSchema)` to create a new message.
*/
const ConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0);
/**
* Describes the message meshtastic.Config.DeviceConfig.
* Use `create(Config_DeviceConfigSchema)` to create a new message.
*/
const Config_DeviceConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 0);
/**
*
* Defines the device's role on the Mesh network
*
* @generated from enum meshtastic.Config.DeviceConfig.Role
*/
let Config_DeviceConfig_Role = /* @__PURE__ */ function(Config_DeviceConfig_Role$1) {
	/**
	*
	* Description: App connected or stand alone messaging device.
	* Technical Details: Default Role
	*
	* @generated from enum value: CLIENT = 0;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["CLIENT"] = 0] = "CLIENT";
	/**
	*
	*  Description: Device that does not forward packets from other devices.
	*
	* @generated from enum value: CLIENT_MUTE = 1;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["CLIENT_MUTE"] = 1] = "CLIENT_MUTE";
	/**
	*
	* Description: Infrastructure node for extending network coverage by relaying messages. Visible in Nodes list.
	* Technical Details: Mesh packets will prefer to be routed over this node. This node will not be used by client apps.
	*   The wifi radio and the oled screen will be put to sleep.
	*   This mode may still potentially have higher power usage due to it's preference in message rebroadcasting on the mesh.
	*
	* @generated from enum value: ROUTER = 2;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["ROUTER"] = 2] = "ROUTER";
	/**
	* @generated from enum value: ROUTER_CLIENT = 3 [deprecated = true];
	* @deprecated
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["ROUTER_CLIENT"] = 3] = "ROUTER_CLIENT";
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
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["REPEATER"] = 4] = "REPEATER";
	/**
	*
	* Description: Broadcasts GPS position packets as priority.
	* Technical Details: Position Mesh packets will be prioritized higher and sent more frequently by default.
	*   When used in conjunction with power.is_power_saving = true, nodes will wake up,
	*   send position, and then sleep for position.position_broadcast_secs seconds.
	*
	* @generated from enum value: TRACKER = 5;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["TRACKER"] = 5] = "TRACKER";
	/**
	*
	* Description: Broadcasts telemetry packets as priority.
	* Technical Details: Telemetry Mesh packets will be prioritized higher and sent more frequently by default.
	*   When used in conjunction with power.is_power_saving = true, nodes will wake up,
	*   send environment telemetry, and then sleep for telemetry.environment_update_interval seconds.
	*
	* @generated from enum value: SENSOR = 6;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["SENSOR"] = 6] = "SENSOR";
	/**
	*
	* Description: Optimized for ATAK system communication and reduces routine broadcasts.
	* Technical Details: Used for nodes dedicated for connection to an ATAK EUD.
	*    Turns off many of the routine broadcasts to favor CoT packet stream
	*    from the Meshtastic ATAK plugin -> IMeshService -> Node
	*
	* @generated from enum value: TAK = 7;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["TAK"] = 7] = "TAK";
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
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["CLIENT_HIDDEN"] = 8] = "CLIENT_HIDDEN";
	/**
	*
	* Description: Broadcasts location as message to default channel regularly for to assist with device recovery.
	* Technical Details: Used to automatically send a text message to the mesh
	*    with the current position of the device on a frequent interval:
	*    "I'm lost! Position: lat / long"
	*
	* @generated from enum value: LOST_AND_FOUND = 9;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["LOST_AND_FOUND"] = 9] = "LOST_AND_FOUND";
	/**
	*
	* Description: Enables automatic TAK PLI broadcasts and reduces routine broadcasts.
	* Technical Details: Turns off many of the routine broadcasts to favor ATAK CoT packet stream
	*    and automatic TAK PLI (position location information) broadcasts.
	*    Uses position module configuration to determine TAK PLI broadcast interval.
	*
	* @generated from enum value: TAK_TRACKER = 10;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["TAK_TRACKER"] = 10] = "TAK_TRACKER";
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
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["ROUTER_LATE"] = 11] = "ROUTER_LATE";
	/**
	*
	* Description: Treats packets from or to favorited nodes as ROUTER, and all other packets as CLIENT.
	* Technical Details: Used for stronger attic/roof nodes to distribute messages more widely
	*    from weaker, indoor, or less-well-positioned nodes. Recommended for users with multiple nodes
	*    where one CLIENT_BASE acts as a more powerful base station, such as an attic/roof node.
	*
	* @generated from enum value: CLIENT_BASE = 12;
	*/
	Config_DeviceConfig_Role$1[Config_DeviceConfig_Role$1["CLIENT_BASE"] = 12] = "CLIENT_BASE";
	return Config_DeviceConfig_Role$1;
}({});
/**
* Describes the enum meshtastic.Config.DeviceConfig.Role.
*/
const Config_DeviceConfig_RoleSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 0, 0);
/**
*
* Defines the device's behavior for how messages are rebroadcast
*
* @generated from enum meshtastic.Config.DeviceConfig.RebroadcastMode
*/
let Config_DeviceConfig_RebroadcastMode = /* @__PURE__ */ function(Config_DeviceConfig_RebroadcastMode$1) {
	/**
	*
	* Default behavior.
	* Rebroadcast any observed message, if it was on our private channel or from another mesh with the same lora params.
	*
	* @generated from enum value: ALL = 0;
	*/
	Config_DeviceConfig_RebroadcastMode$1[Config_DeviceConfig_RebroadcastMode$1["ALL"] = 0] = "ALL";
	/**
	*
	* Same as behavior as ALL but skips packet decoding and simply rebroadcasts them.
	* Only available in Repeater role. Setting this on any other roles will result in ALL behavior.
	*
	* @generated from enum value: ALL_SKIP_DECODING = 1;
	*/
	Config_DeviceConfig_RebroadcastMode$1[Config_DeviceConfig_RebroadcastMode$1["ALL_SKIP_DECODING"] = 1] = "ALL_SKIP_DECODING";
	/**
	*
	* Ignores observed messages from foreign meshes that are open or those which it cannot decrypt.
	* Only rebroadcasts message on the nodes local primary / secondary channels.
	*
	* @generated from enum value: LOCAL_ONLY = 2;
	*/
	Config_DeviceConfig_RebroadcastMode$1[Config_DeviceConfig_RebroadcastMode$1["LOCAL_ONLY"] = 2] = "LOCAL_ONLY";
	/**
	*
	* Ignores observed messages from foreign meshes like LOCAL_ONLY,
	* but takes it step further by also ignoring messages from nodenums not in the node's known list (NodeDB)
	*
	* @generated from enum value: KNOWN_ONLY = 3;
	*/
	Config_DeviceConfig_RebroadcastMode$1[Config_DeviceConfig_RebroadcastMode$1["KNOWN_ONLY"] = 3] = "KNOWN_ONLY";
	/**
	*
	* Only permitted for SENSOR, TRACKER and TAK_TRACKER roles, this will inhibit all rebroadcasts, not unlike CLIENT_MUTE role.
	*
	* @generated from enum value: NONE = 4;
	*/
	Config_DeviceConfig_RebroadcastMode$1[Config_DeviceConfig_RebroadcastMode$1["NONE"] = 4] = "NONE";
	/**
	*
	* Ignores packets from non-standard portnums such as: TAK, RangeTest, PaxCounter, etc.
	* Only rebroadcasts packets with standard portnums: NodeInfo, Text, Position, Telemetry, and Routing.
	*
	* @generated from enum value: CORE_PORTNUMS_ONLY = 5;
	*/
	Config_DeviceConfig_RebroadcastMode$1[Config_DeviceConfig_RebroadcastMode$1["CORE_PORTNUMS_ONLY"] = 5] = "CORE_PORTNUMS_ONLY";
	return Config_DeviceConfig_RebroadcastMode$1;
}({});
/**
* Describes the enum meshtastic.Config.DeviceConfig.RebroadcastMode.
*/
const Config_DeviceConfig_RebroadcastModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 0, 1);
/**
*
* Defines buzzer behavior for audio feedback
*
* @generated from enum meshtastic.Config.DeviceConfig.BuzzerMode
*/
let Config_DeviceConfig_BuzzerMode = /* @__PURE__ */ function(Config_DeviceConfig_BuzzerMode$1) {
	/**
	*
	* Default behavior.
	* Buzzer is enabled for all audio feedback including button presses and alerts.
	*
	* @generated from enum value: ALL_ENABLED = 0;
	*/
	Config_DeviceConfig_BuzzerMode$1[Config_DeviceConfig_BuzzerMode$1["ALL_ENABLED"] = 0] = "ALL_ENABLED";
	/**
	*
	* Disabled.
	* All buzzer audio feedback is disabled.
	*
	* @generated from enum value: DISABLED = 1;
	*/
	Config_DeviceConfig_BuzzerMode$1[Config_DeviceConfig_BuzzerMode$1["DISABLED"] = 1] = "DISABLED";
	/**
	*
	* Notifications Only.
	* Buzzer is enabled only for notifications and alerts, but not for button presses.
	* External notification config determines the specifics of the notification behavior.
	*
	* @generated from enum value: NOTIFICATIONS_ONLY = 2;
	*/
	Config_DeviceConfig_BuzzerMode$1[Config_DeviceConfig_BuzzerMode$1["NOTIFICATIONS_ONLY"] = 2] = "NOTIFICATIONS_ONLY";
	/**
	*
	* Non-notification system buzzer tones only.
	* Buzzer is enabled only for non-notification tones such as button presses, startup, shutdown, but not for alerts.
	*
	* @generated from enum value: SYSTEM_ONLY = 3;
	*/
	Config_DeviceConfig_BuzzerMode$1[Config_DeviceConfig_BuzzerMode$1["SYSTEM_ONLY"] = 3] = "SYSTEM_ONLY";
	/**
	*
	* Direct Message notifications only.
	* Buzzer is enabled only for direct messages and alerts, but not for button presses.
	* External notification config determines the specifics of the notification behavior.
	*
	* @generated from enum value: DIRECT_MSG_ONLY = 4;
	*/
	Config_DeviceConfig_BuzzerMode$1[Config_DeviceConfig_BuzzerMode$1["DIRECT_MSG_ONLY"] = 4] = "DIRECT_MSG_ONLY";
	return Config_DeviceConfig_BuzzerMode$1;
}({});
/**
* Describes the enum meshtastic.Config.DeviceConfig.BuzzerMode.
*/
const Config_DeviceConfig_BuzzerModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 0, 2);
/**
* Describes the message meshtastic.Config.PositionConfig.
* Use `create(Config_PositionConfigSchema)` to create a new message.
*/
const Config_PositionConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 1);
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
let Config_PositionConfig_PositionFlags = /* @__PURE__ */ function(Config_PositionConfig_PositionFlags$1) {
	/**
	*
	* Required for compilation
	*
	* @generated from enum value: UNSET = 0;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* Include an altitude value (if available)
	*
	* @generated from enum value: ALTITUDE = 1;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["ALTITUDE"] = 1] = "ALTITUDE";
	/**
	*
	* Altitude value is MSL
	*
	* @generated from enum value: ALTITUDE_MSL = 2;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["ALTITUDE_MSL"] = 2] = "ALTITUDE_MSL";
	/**
	*
	* Include geoidal separation
	*
	* @generated from enum value: GEOIDAL_SEPARATION = 4;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["GEOIDAL_SEPARATION"] = 4] = "GEOIDAL_SEPARATION";
	/**
	*
	* Include the DOP value ; PDOP used by default, see below
	*
	* @generated from enum value: DOP = 8;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["DOP"] = 8] = "DOP";
	/**
	*
	* If POS_DOP set, send separate HDOP / VDOP values instead of PDOP
	*
	* @generated from enum value: HVDOP = 16;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["HVDOP"] = 16] = "HVDOP";
	/**
	*
	* Include number of "satellites in view"
	*
	* @generated from enum value: SATINVIEW = 32;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["SATINVIEW"] = 32] = "SATINVIEW";
	/**
	*
	* Include a sequence number incremented per packet
	*
	* @generated from enum value: SEQ_NO = 64;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["SEQ_NO"] = 64] = "SEQ_NO";
	/**
	*
	* Include positional timestamp (from GPS solution)
	*
	* @generated from enum value: TIMESTAMP = 128;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["TIMESTAMP"] = 128] = "TIMESTAMP";
	/**
	*
	* Include positional heading
	* Intended for use with vehicle not walking speeds
	* walking speeds are likely to be error prone like the compass
	*
	* @generated from enum value: HEADING = 256;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["HEADING"] = 256] = "HEADING";
	/**
	*
	* Include positional speed
	* Intended for use with vehicle not walking speeds
	* walking speeds are likely to be error prone like the compass
	*
	* @generated from enum value: SPEED = 512;
	*/
	Config_PositionConfig_PositionFlags$1[Config_PositionConfig_PositionFlags$1["SPEED"] = 512] = "SPEED";
	return Config_PositionConfig_PositionFlags$1;
}({});
/**
* Describes the enum meshtastic.Config.PositionConfig.PositionFlags.
*/
const Config_PositionConfig_PositionFlagsSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 1, 0);
/**
* @generated from enum meshtastic.Config.PositionConfig.GpsMode
*/
let Config_PositionConfig_GpsMode = /* @__PURE__ */ function(Config_PositionConfig_GpsMode$1) {
	/**
	*
	* GPS is present but disabled
	*
	* @generated from enum value: DISABLED = 0;
	*/
	Config_PositionConfig_GpsMode$1[Config_PositionConfig_GpsMode$1["DISABLED"] = 0] = "DISABLED";
	/**
	*
	* GPS is present and enabled
	*
	* @generated from enum value: ENABLED = 1;
	*/
	Config_PositionConfig_GpsMode$1[Config_PositionConfig_GpsMode$1["ENABLED"] = 1] = "ENABLED";
	/**
	*
	* GPS is not present on the device
	*
	* @generated from enum value: NOT_PRESENT = 2;
	*/
	Config_PositionConfig_GpsMode$1[Config_PositionConfig_GpsMode$1["NOT_PRESENT"] = 2] = "NOT_PRESENT";
	return Config_PositionConfig_GpsMode$1;
}({});
/**
* Describes the enum meshtastic.Config.PositionConfig.GpsMode.
*/
const Config_PositionConfig_GpsModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 1, 1);
/**
* Describes the message meshtastic.Config.PowerConfig.
* Use `create(Config_PowerConfigSchema)` to create a new message.
*/
const Config_PowerConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 2);
/**
* Describes the message meshtastic.Config.NetworkConfig.
* Use `create(Config_NetworkConfigSchema)` to create a new message.
*/
const Config_NetworkConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 3);
/**
* Describes the message meshtastic.Config.NetworkConfig.IpV4Config.
* Use `create(Config_NetworkConfig_IpV4ConfigSchema)` to create a new message.
*/
const Config_NetworkConfig_IpV4ConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 3, 0);
/**
* @generated from enum meshtastic.Config.NetworkConfig.AddressMode
*/
let Config_NetworkConfig_AddressMode = /* @__PURE__ */ function(Config_NetworkConfig_AddressMode$1) {
	/**
	*
	* obtain ip address via DHCP
	*
	* @generated from enum value: DHCP = 0;
	*/
	Config_NetworkConfig_AddressMode$1[Config_NetworkConfig_AddressMode$1["DHCP"] = 0] = "DHCP";
	/**
	*
	* use static ip address
	*
	* @generated from enum value: STATIC = 1;
	*/
	Config_NetworkConfig_AddressMode$1[Config_NetworkConfig_AddressMode$1["STATIC"] = 1] = "STATIC";
	return Config_NetworkConfig_AddressMode$1;
}({});
/**
* Describes the enum meshtastic.Config.NetworkConfig.AddressMode.
*/
const Config_NetworkConfig_AddressModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 3, 0);
/**
*
* Available flags auxiliary network protocols
*
* @generated from enum meshtastic.Config.NetworkConfig.ProtocolFlags
*/
let Config_NetworkConfig_ProtocolFlags = /* @__PURE__ */ function(Config_NetworkConfig_ProtocolFlags$1) {
	/**
	*
	* Do not broadcast packets over any network protocol
	*
	* @generated from enum value: NO_BROADCAST = 0;
	*/
	Config_NetworkConfig_ProtocolFlags$1[Config_NetworkConfig_ProtocolFlags$1["NO_BROADCAST"] = 0] = "NO_BROADCAST";
	/**
	*
	* Enable broadcasting packets via UDP over the local network
	*
	* @generated from enum value: UDP_BROADCAST = 1;
	*/
	Config_NetworkConfig_ProtocolFlags$1[Config_NetworkConfig_ProtocolFlags$1["UDP_BROADCAST"] = 1] = "UDP_BROADCAST";
	return Config_NetworkConfig_ProtocolFlags$1;
}({});
/**
* Describes the enum meshtastic.Config.NetworkConfig.ProtocolFlags.
*/
const Config_NetworkConfig_ProtocolFlagsSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 3, 1);
/**
* Describes the message meshtastic.Config.DisplayConfig.
* Use `create(Config_DisplayConfigSchema)` to create a new message.
*/
const Config_DisplayConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 4);
/**
*
* Deprecated in 2.7.4: Unused
*
* @generated from enum meshtastic.Config.DisplayConfig.DeprecatedGpsCoordinateFormat
*/
let Config_DisplayConfig_DeprecatedGpsCoordinateFormat = /* @__PURE__ */ function(Config_DisplayConfig_DeprecatedGpsCoordinateFormat$1) {
	/**
	* @generated from enum value: UNUSED = 0;
	*/
	Config_DisplayConfig_DeprecatedGpsCoordinateFormat$1[Config_DisplayConfig_DeprecatedGpsCoordinateFormat$1["UNUSED"] = 0] = "UNUSED";
	return Config_DisplayConfig_DeprecatedGpsCoordinateFormat$1;
}({});
/**
* Describes the enum meshtastic.Config.DisplayConfig.DeprecatedGpsCoordinateFormat.
*/
const Config_DisplayConfig_DeprecatedGpsCoordinateFormatSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 4, 0);
/**
*
* Unit display preference
*
* @generated from enum meshtastic.Config.DisplayConfig.DisplayUnits
*/
let Config_DisplayConfig_DisplayUnits = /* @__PURE__ */ function(Config_DisplayConfig_DisplayUnits$1) {
	/**
	*
	* Metric (Default)
	*
	* @generated from enum value: METRIC = 0;
	*/
	Config_DisplayConfig_DisplayUnits$1[Config_DisplayConfig_DisplayUnits$1["METRIC"] = 0] = "METRIC";
	/**
	*
	* Imperial
	*
	* @generated from enum value: IMPERIAL = 1;
	*/
	Config_DisplayConfig_DisplayUnits$1[Config_DisplayConfig_DisplayUnits$1["IMPERIAL"] = 1] = "IMPERIAL";
	return Config_DisplayConfig_DisplayUnits$1;
}({});
/**
* Describes the enum meshtastic.Config.DisplayConfig.DisplayUnits.
*/
const Config_DisplayConfig_DisplayUnitsSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 4, 1);
/**
*
* Override OLED outo detect with this if it fails.
*
* @generated from enum meshtastic.Config.DisplayConfig.OledType
*/
let Config_DisplayConfig_OledType = /* @__PURE__ */ function(Config_DisplayConfig_OledType$1) {
	/**
	*
	* Default / Autodetect
	*
	* @generated from enum value: OLED_AUTO = 0;
	*/
	Config_DisplayConfig_OledType$1[Config_DisplayConfig_OledType$1["OLED_AUTO"] = 0] = "OLED_AUTO";
	/**
	*
	* Default / Autodetect
	*
	* @generated from enum value: OLED_SSD1306 = 1;
	*/
	Config_DisplayConfig_OledType$1[Config_DisplayConfig_OledType$1["OLED_SSD1306"] = 1] = "OLED_SSD1306";
	/**
	*
	* Default / Autodetect
	*
	* @generated from enum value: OLED_SH1106 = 2;
	*/
	Config_DisplayConfig_OledType$1[Config_DisplayConfig_OledType$1["OLED_SH1106"] = 2] = "OLED_SH1106";
	/**
	*
	* Can not be auto detected but set by proto. Used for 128x64 screens
	*
	* @generated from enum value: OLED_SH1107 = 3;
	*/
	Config_DisplayConfig_OledType$1[Config_DisplayConfig_OledType$1["OLED_SH1107"] = 3] = "OLED_SH1107";
	/**
	*
	* Can not be auto detected but set by proto. Used for 128x128 screens
	*
	* @generated from enum value: OLED_SH1107_128_128 = 4;
	*/
	Config_DisplayConfig_OledType$1[Config_DisplayConfig_OledType$1["OLED_SH1107_128_128"] = 4] = "OLED_SH1107_128_128";
	return Config_DisplayConfig_OledType$1;
}({});
/**
* Describes the enum meshtastic.Config.DisplayConfig.OledType.
*/
const Config_DisplayConfig_OledTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 4, 2);
/**
* @generated from enum meshtastic.Config.DisplayConfig.DisplayMode
*/
let Config_DisplayConfig_DisplayMode = /* @__PURE__ */ function(Config_DisplayConfig_DisplayMode$1) {
	/**
	*
	* Default. The old style for the 128x64 OLED screen
	*
	* @generated from enum value: DEFAULT = 0;
	*/
	Config_DisplayConfig_DisplayMode$1[Config_DisplayConfig_DisplayMode$1["DEFAULT"] = 0] = "DEFAULT";
	/**
	*
	* Rearrange display elements to cater for bicolor OLED displays
	*
	* @generated from enum value: TWOCOLOR = 1;
	*/
	Config_DisplayConfig_DisplayMode$1[Config_DisplayConfig_DisplayMode$1["TWOCOLOR"] = 1] = "TWOCOLOR";
	/**
	*
	* Same as TwoColor, but with inverted top bar. Not so good for Epaper displays
	*
	* @generated from enum value: INVERTED = 2;
	*/
	Config_DisplayConfig_DisplayMode$1[Config_DisplayConfig_DisplayMode$1["INVERTED"] = 2] = "INVERTED";
	/**
	*
	* TFT Full Color Displays (not implemented yet)
	*
	* @generated from enum value: COLOR = 3;
	*/
	Config_DisplayConfig_DisplayMode$1[Config_DisplayConfig_DisplayMode$1["COLOR"] = 3] = "COLOR";
	return Config_DisplayConfig_DisplayMode$1;
}({});
/**
* Describes the enum meshtastic.Config.DisplayConfig.DisplayMode.
*/
const Config_DisplayConfig_DisplayModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 4, 3);
/**
* @generated from enum meshtastic.Config.DisplayConfig.CompassOrientation
*/
let Config_DisplayConfig_CompassOrientation = /* @__PURE__ */ function(Config_DisplayConfig_CompassOrientation$1) {
	/**
	*
	* The compass and the display are in the same orientation.
	*
	* @generated from enum value: DEGREES_0 = 0;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_0"] = 0] = "DEGREES_0";
	/**
	*
	* Rotate the compass by 90 degrees.
	*
	* @generated from enum value: DEGREES_90 = 1;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_90"] = 1] = "DEGREES_90";
	/**
	*
	* Rotate the compass by 180 degrees.
	*
	* @generated from enum value: DEGREES_180 = 2;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_180"] = 2] = "DEGREES_180";
	/**
	*
	* Rotate the compass by 270 degrees.
	*
	* @generated from enum value: DEGREES_270 = 3;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_270"] = 3] = "DEGREES_270";
	/**
	*
	* Don't rotate the compass, but invert the result.
	*
	* @generated from enum value: DEGREES_0_INVERTED = 4;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_0_INVERTED"] = 4] = "DEGREES_0_INVERTED";
	/**
	*
	* Rotate the compass by 90 degrees and invert.
	*
	* @generated from enum value: DEGREES_90_INVERTED = 5;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_90_INVERTED"] = 5] = "DEGREES_90_INVERTED";
	/**
	*
	* Rotate the compass by 180 degrees and invert.
	*
	* @generated from enum value: DEGREES_180_INVERTED = 6;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_180_INVERTED"] = 6] = "DEGREES_180_INVERTED";
	/**
	*
	* Rotate the compass by 270 degrees and invert.
	*
	* @generated from enum value: DEGREES_270_INVERTED = 7;
	*/
	Config_DisplayConfig_CompassOrientation$1[Config_DisplayConfig_CompassOrientation$1["DEGREES_270_INVERTED"] = 7] = "DEGREES_270_INVERTED";
	return Config_DisplayConfig_CompassOrientation$1;
}({});
/**
* Describes the enum meshtastic.Config.DisplayConfig.CompassOrientation.
*/
const Config_DisplayConfig_CompassOrientationSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 4, 4);
/**
* Describes the message meshtastic.Config.LoRaConfig.
* Use `create(Config_LoRaConfigSchema)` to create a new message.
*/
const Config_LoRaConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 5);
/**
* @generated from enum meshtastic.Config.LoRaConfig.RegionCode
*/
let Config_LoRaConfig_RegionCode = /* @__PURE__ */ function(Config_LoRaConfig_RegionCode$1) {
	/**
	*
	* Region is not set
	*
	* @generated from enum value: UNSET = 0;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* United States
	*
	* @generated from enum value: US = 1;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["US"] = 1] = "US";
	/**
	*
	* European Union 433mhz
	*
	* @generated from enum value: EU_433 = 2;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["EU_433"] = 2] = "EU_433";
	/**
	*
	* European Union 868mhz
	*
	* @generated from enum value: EU_868 = 3;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["EU_868"] = 3] = "EU_868";
	/**
	*
	* China
	*
	* @generated from enum value: CN = 4;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["CN"] = 4] = "CN";
	/**
	*
	* Japan
	*
	* @generated from enum value: JP = 5;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["JP"] = 5] = "JP";
	/**
	*
	* Australia / New Zealand
	*
	* @generated from enum value: ANZ = 6;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["ANZ"] = 6] = "ANZ";
	/**
	*
	* Korea
	*
	* @generated from enum value: KR = 7;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["KR"] = 7] = "KR";
	/**
	*
	* Taiwan
	*
	* @generated from enum value: TW = 8;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["TW"] = 8] = "TW";
	/**
	*
	* Russia
	*
	* @generated from enum value: RU = 9;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["RU"] = 9] = "RU";
	/**
	*
	* India
	*
	* @generated from enum value: IN = 10;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["IN"] = 10] = "IN";
	/**
	*
	* New Zealand 865mhz
	*
	* @generated from enum value: NZ_865 = 11;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["NZ_865"] = 11] = "NZ_865";
	/**
	*
	* Thailand
	*
	* @generated from enum value: TH = 12;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["TH"] = 12] = "TH";
	/**
	*
	* WLAN Band
	*
	* @generated from enum value: LORA_24 = 13;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["LORA_24"] = 13] = "LORA_24";
	/**
	*
	* Ukraine 433mhz
	*
	* @generated from enum value: UA_433 = 14;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["UA_433"] = 14] = "UA_433";
	/**
	*
	* Ukraine 868mhz
	*
	* @generated from enum value: UA_868 = 15;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["UA_868"] = 15] = "UA_868";
	/**
	*
	* Malaysia 433mhz
	*
	* @generated from enum value: MY_433 = 16;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["MY_433"] = 16] = "MY_433";
	/**
	*
	* Malaysia 919mhz
	*
	* @generated from enum value: MY_919 = 17;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["MY_919"] = 17] = "MY_919";
	/**
	*
	* Singapore 923mhz
	*
	* @generated from enum value: SG_923 = 18;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["SG_923"] = 18] = "SG_923";
	/**
	*
	* Philippines 433mhz
	*
	* @generated from enum value: PH_433 = 19;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["PH_433"] = 19] = "PH_433";
	/**
	*
	* Philippines 868mhz
	*
	* @generated from enum value: PH_868 = 20;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["PH_868"] = 20] = "PH_868";
	/**
	*
	* Philippines 915mhz
	*
	* @generated from enum value: PH_915 = 21;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["PH_915"] = 21] = "PH_915";
	/**
	*
	* Australia / New Zealand 433MHz
	*
	* @generated from enum value: ANZ_433 = 22;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["ANZ_433"] = 22] = "ANZ_433";
	/**
	*
	* Kazakhstan 433MHz
	*
	* @generated from enum value: KZ_433 = 23;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["KZ_433"] = 23] = "KZ_433";
	/**
	*
	* Kazakhstan 863MHz
	*
	* @generated from enum value: KZ_863 = 24;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["KZ_863"] = 24] = "KZ_863";
	/**
	*
	* Nepal 865MHz
	*
	* @generated from enum value: NP_865 = 25;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["NP_865"] = 25] = "NP_865";
	/**
	*
	* Brazil 902MHz
	*
	* @generated from enum value: BR_902 = 26;
	*/
	Config_LoRaConfig_RegionCode$1[Config_LoRaConfig_RegionCode$1["BR_902"] = 26] = "BR_902";
	return Config_LoRaConfig_RegionCode$1;
}({});
/**
* Describes the enum meshtastic.Config.LoRaConfig.RegionCode.
*/
const Config_LoRaConfig_RegionCodeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 5, 0);
/**
*
* Standard predefined channel settings
* Note: these mappings must match ModemPreset Choice in the device code.
*
* @generated from enum meshtastic.Config.LoRaConfig.ModemPreset
*/
let Config_LoRaConfig_ModemPreset = /* @__PURE__ */ function(Config_LoRaConfig_ModemPreset$1) {
	/**
	*
	* Long Range - Fast
	*
	* @generated from enum value: LONG_FAST = 0;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["LONG_FAST"] = 0] = "LONG_FAST";
	/**
	*
	* Long Range - Slow
	*
	* @generated from enum value: LONG_SLOW = 1;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["LONG_SLOW"] = 1] = "LONG_SLOW";
	/**
	*
	* Very Long Range - Slow
	* Deprecated in 2.5: Works only with txco and is unusably slow
	*
	* @generated from enum value: VERY_LONG_SLOW = 2 [deprecated = true];
	* @deprecated
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["VERY_LONG_SLOW"] = 2] = "VERY_LONG_SLOW";
	/**
	*
	* Medium Range - Slow
	*
	* @generated from enum value: MEDIUM_SLOW = 3;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["MEDIUM_SLOW"] = 3] = "MEDIUM_SLOW";
	/**
	*
	* Medium Range - Fast
	*
	* @generated from enum value: MEDIUM_FAST = 4;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["MEDIUM_FAST"] = 4] = "MEDIUM_FAST";
	/**
	*
	* Short Range - Slow
	*
	* @generated from enum value: SHORT_SLOW = 5;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["SHORT_SLOW"] = 5] = "SHORT_SLOW";
	/**
	*
	* Short Range - Fast
	*
	* @generated from enum value: SHORT_FAST = 6;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["SHORT_FAST"] = 6] = "SHORT_FAST";
	/**
	*
	* Long Range - Moderately Fast
	*
	* @generated from enum value: LONG_MODERATE = 7;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["LONG_MODERATE"] = 7] = "LONG_MODERATE";
	/**
	*
	* Short Range - Turbo
	* This is the fastest preset and the only one with 500kHz bandwidth.
	* It is not legal to use in all regions due to this wider bandwidth.
	*
	* @generated from enum value: SHORT_TURBO = 8;
	*/
	Config_LoRaConfig_ModemPreset$1[Config_LoRaConfig_ModemPreset$1["SHORT_TURBO"] = 8] = "SHORT_TURBO";
	return Config_LoRaConfig_ModemPreset$1;
}({});
/**
* Describes the enum meshtastic.Config.LoRaConfig.ModemPreset.
*/
const Config_LoRaConfig_ModemPresetSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 5, 1);
/**
* Describes the message meshtastic.Config.BluetoothConfig.
* Use `create(Config_BluetoothConfigSchema)` to create a new message.
*/
const Config_BluetoothConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 6);
/**
* @generated from enum meshtastic.Config.BluetoothConfig.PairingMode
*/
let Config_BluetoothConfig_PairingMode = /* @__PURE__ */ function(Config_BluetoothConfig_PairingMode$1) {
	/**
	*
	* Device generates a random PIN that will be shown on the screen of the device for pairing
	*
	* @generated from enum value: RANDOM_PIN = 0;
	*/
	Config_BluetoothConfig_PairingMode$1[Config_BluetoothConfig_PairingMode$1["RANDOM_PIN"] = 0] = "RANDOM_PIN";
	/**
	*
	* Device requires a specified fixed PIN for pairing
	*
	* @generated from enum value: FIXED_PIN = 1;
	*/
	Config_BluetoothConfig_PairingMode$1[Config_BluetoothConfig_PairingMode$1["FIXED_PIN"] = 1] = "FIXED_PIN";
	/**
	*
	* Device requires no PIN for pairing
	*
	* @generated from enum value: NO_PIN = 2;
	*/
	Config_BluetoothConfig_PairingMode$1[Config_BluetoothConfig_PairingMode$1["NO_PIN"] = 2] = "NO_PIN";
	return Config_BluetoothConfig_PairingMode$1;
}({});
/**
* Describes the enum meshtastic.Config.BluetoothConfig.PairingMode.
*/
const Config_BluetoothConfig_PairingModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_config, 0, 6, 0);
/**
* Describes the message meshtastic.Config.SecurityConfig.
* Use `create(Config_SecurityConfigSchema)` to create a new message.
*/
const Config_SecurityConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 7);
/**
* Describes the message meshtastic.Config.SessionkeyConfig.
* Use `create(Config_SessionkeyConfigSchema)` to create a new message.
*/
const Config_SessionkeyConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_config, 0, 8);

//#endregion
//#region lib/meshtastic/connection_status_pb.ts
var connection_status_pb_exports = /* @__PURE__ */ __export({
	BluetoothConnectionStatusSchema: () => BluetoothConnectionStatusSchema,
	DeviceConnectionStatusSchema: () => DeviceConnectionStatusSchema,
	EthernetConnectionStatusSchema: () => EthernetConnectionStatusSchema,
	NetworkConnectionStatusSchema: () => NetworkConnectionStatusSchema,
	SerialConnectionStatusSchema: () => SerialConnectionStatusSchema,
	WifiConnectionStatusSchema: () => WifiConnectionStatusSchema,
	file_meshtastic_connection_status: () => file_meshtastic_connection_status
});
/**
* Describes the file meshtastic/connection_status.proto.
*/
const file_meshtastic_connection_status = /* @__PURE__ */ fileDesc("CiJtZXNodGFzdGljL2Nvbm5lY3Rpb25fc3RhdHVzLnByb3RvEgptZXNodGFzdGljIrECChZEZXZpY2VDb25uZWN0aW9uU3RhdHVzEjMKBHdpZmkYASABKAsyIC5tZXNodGFzdGljLldpZmlDb25uZWN0aW9uU3RhdHVzSACIAQESOwoIZXRoZXJuZXQYAiABKAsyJC5tZXNodGFzdGljLkV0aGVybmV0Q29ubmVjdGlvblN0YXR1c0gBiAEBEj0KCWJsdWV0b290aBgDIAEoCzIlLm1lc2h0YXN0aWMuQmx1ZXRvb3RoQ29ubmVjdGlvblN0YXR1c0gCiAEBEjcKBnNlcmlhbBgEIAEoCzIiLm1lc2h0YXN0aWMuU2VyaWFsQ29ubmVjdGlvblN0YXR1c0gDiAEBQgcKBV93aWZpQgsKCV9ldGhlcm5ldEIMCgpfYmx1ZXRvb3RoQgkKB19zZXJpYWwiZwoUV2lmaUNvbm5lY3Rpb25TdGF0dXMSMwoGc3RhdHVzGAEgASgLMiMubWVzaHRhc3RpYy5OZXR3b3JrQ29ubmVjdGlvblN0YXR1cxIMCgRzc2lkGAIgASgJEgwKBHJzc2kYAyABKAUiTwoYRXRoZXJuZXRDb25uZWN0aW9uU3RhdHVzEjMKBnN0YXR1cxgBIAEoCzIjLm1lc2h0YXN0aWMuTmV0d29ya0Nvbm5lY3Rpb25TdGF0dXMiewoXTmV0d29ya0Nvbm5lY3Rpb25TdGF0dXMSEgoKaXBfYWRkcmVzcxgBIAEoBxIUCgxpc19jb25uZWN0ZWQYAiABKAgSGQoRaXNfbXF0dF9jb25uZWN0ZWQYAyABKAgSGwoTaXNfc3lzbG9nX2Nvbm5lY3RlZBgEIAEoCCJMChlCbHVldG9vdGhDb25uZWN0aW9uU3RhdHVzEgsKA3BpbhgBIAEoDRIMCgRyc3NpGAIgASgFEhQKDGlzX2Nvbm5lY3RlZBgDIAEoCCI8ChZTZXJpYWxDb25uZWN0aW9uU3RhdHVzEgwKBGJhdWQYASABKA0SFAoMaXNfY29ubmVjdGVkGAIgASgIQmYKFG9yZy5tZXNodGFzdGljLnByb3RvQhBDb25uU3RhdHVzUHJvdG9zWiJnaXRodWIuY29tL21lc2h0YXN0aWMvZ28vZ2VuZXJhdGVkqgIUTWVzaHRhc3RpYy5Qcm90b2J1ZnO6AgBiBnByb3RvMw");
/**
* Describes the message meshtastic.DeviceConnectionStatus.
* Use `create(DeviceConnectionStatusSchema)` to create a new message.
*/
const DeviceConnectionStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_connection_status, 0);
/**
* Describes the message meshtastic.WifiConnectionStatus.
* Use `create(WifiConnectionStatusSchema)` to create a new message.
*/
const WifiConnectionStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_connection_status, 1);
/**
* Describes the message meshtastic.EthernetConnectionStatus.
* Use `create(EthernetConnectionStatusSchema)` to create a new message.
*/
const EthernetConnectionStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_connection_status, 2);
/**
* Describes the message meshtastic.NetworkConnectionStatus.
* Use `create(NetworkConnectionStatusSchema)` to create a new message.
*/
const NetworkConnectionStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_connection_status, 3);
/**
* Describes the message meshtastic.BluetoothConnectionStatus.
* Use `create(BluetoothConnectionStatusSchema)` to create a new message.
*/
const BluetoothConnectionStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_connection_status, 4);
/**
* Describes the message meshtastic.SerialConnectionStatus.
* Use `create(SerialConnectionStatusSchema)` to create a new message.
*/
const SerialConnectionStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_connection_status, 5);

//#endregion
//#region lib/meshtastic/module_config_pb.ts
var module_config_pb_exports = /* @__PURE__ */ __export({
	ModuleConfigSchema: () => ModuleConfigSchema,
	ModuleConfig_AmbientLightingConfigSchema: () => ModuleConfig_AmbientLightingConfigSchema,
	ModuleConfig_AudioConfigSchema: () => ModuleConfig_AudioConfigSchema,
	ModuleConfig_AudioConfig_Audio_Baud: () => ModuleConfig_AudioConfig_Audio_Baud,
	ModuleConfig_AudioConfig_Audio_BaudSchema: () => ModuleConfig_AudioConfig_Audio_BaudSchema,
	ModuleConfig_CannedMessageConfigSchema: () => ModuleConfig_CannedMessageConfigSchema,
	ModuleConfig_CannedMessageConfig_InputEventChar: () => ModuleConfig_CannedMessageConfig_InputEventChar,
	ModuleConfig_CannedMessageConfig_InputEventCharSchema: () => ModuleConfig_CannedMessageConfig_InputEventCharSchema,
	ModuleConfig_DetectionSensorConfigSchema: () => ModuleConfig_DetectionSensorConfigSchema,
	ModuleConfig_DetectionSensorConfig_TriggerType: () => ModuleConfig_DetectionSensorConfig_TriggerType,
	ModuleConfig_DetectionSensorConfig_TriggerTypeSchema: () => ModuleConfig_DetectionSensorConfig_TriggerTypeSchema,
	ModuleConfig_ExternalNotificationConfigSchema: () => ModuleConfig_ExternalNotificationConfigSchema,
	ModuleConfig_MQTTConfigSchema: () => ModuleConfig_MQTTConfigSchema,
	ModuleConfig_MapReportSettingsSchema: () => ModuleConfig_MapReportSettingsSchema,
	ModuleConfig_NeighborInfoConfigSchema: () => ModuleConfig_NeighborInfoConfigSchema,
	ModuleConfig_PaxcounterConfigSchema: () => ModuleConfig_PaxcounterConfigSchema,
	ModuleConfig_RangeTestConfigSchema: () => ModuleConfig_RangeTestConfigSchema,
	ModuleConfig_RemoteHardwareConfigSchema: () => ModuleConfig_RemoteHardwareConfigSchema,
	ModuleConfig_SerialConfigSchema: () => ModuleConfig_SerialConfigSchema,
	ModuleConfig_SerialConfig_Serial_Baud: () => ModuleConfig_SerialConfig_Serial_Baud,
	ModuleConfig_SerialConfig_Serial_BaudSchema: () => ModuleConfig_SerialConfig_Serial_BaudSchema,
	ModuleConfig_SerialConfig_Serial_Mode: () => ModuleConfig_SerialConfig_Serial_Mode,
	ModuleConfig_SerialConfig_Serial_ModeSchema: () => ModuleConfig_SerialConfig_Serial_ModeSchema,
	ModuleConfig_StoreForwardConfigSchema: () => ModuleConfig_StoreForwardConfigSchema,
	ModuleConfig_TelemetryConfigSchema: () => ModuleConfig_TelemetryConfigSchema,
	RemoteHardwarePinSchema: () => RemoteHardwarePinSchema,
	RemoteHardwarePinType: () => RemoteHardwarePinType,
	RemoteHardwarePinTypeSchema: () => RemoteHardwarePinTypeSchema,
	file_meshtastic_module_config: () => file_meshtastic_module_config
});
/**
* Describes the file meshtastic/module_config.proto.
*/
const file_meshtastic_module_config = /* @__PURE__ */ fileDesc("Ch5tZXNodGFzdGljL21vZHVsZV9jb25maWcucHJvdG8SCm1lc2h0YXN0aWMitSYKDE1vZHVsZUNvbmZpZxIzCgRtcXR0GAEgASgLMiMubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuTVFUVENvbmZpZ0gAEjcKBnNlcmlhbBgCIAEoCzIlLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLlNlcmlhbENvbmZpZ0gAElQKFWV4dGVybmFsX25vdGlmaWNhdGlvbhgDIAEoCzIzLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkV4dGVybmFsTm90aWZpY2F0aW9uQ29uZmlnSAASRAoNc3RvcmVfZm9yd2FyZBgEIAEoCzIrLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLlN0b3JlRm9yd2FyZENvbmZpZ0gAEj4KCnJhbmdlX3Rlc3QYBSABKAsyKC5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5SYW5nZVRlc3RDb25maWdIABI9Cgl0ZWxlbWV0cnkYBiABKAsyKC5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5UZWxlbWV0cnlDb25maWdIABJGCg5jYW5uZWRfbWVzc2FnZRgHIAEoCzIsLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkNhbm5lZE1lc3NhZ2VDb25maWdIABI1CgVhdWRpbxgIIAEoCzIkLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkF1ZGlvQ29uZmlnSAASSAoPcmVtb3RlX2hhcmR3YXJlGAkgASgLMi0ubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuUmVtb3RlSGFyZHdhcmVDb25maWdIABJECg1uZWlnaGJvcl9pbmZvGAogASgLMisubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuTmVpZ2hib3JJbmZvQ29uZmlnSAASSgoQYW1iaWVudF9saWdodGluZxgLIAEoCzIuLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkFtYmllbnRMaWdodGluZ0NvbmZpZ0gAEkoKEGRldGVjdGlvbl9zZW5zb3IYDCABKAsyLi5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5EZXRlY3Rpb25TZW5zb3JDb25maWdIABI/CgpwYXhjb3VudGVyGA0gASgLMikubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuUGF4Y291bnRlckNvbmZpZ0gAGrACCgpNUVRUQ29uZmlnEg8KB2VuYWJsZWQYASABKAgSDwoHYWRkcmVzcxgCIAEoCRIQCgh1c2VybmFtZRgDIAEoCRIQCghwYXNzd29yZBgEIAEoCRIaChJlbmNyeXB0aW9uX2VuYWJsZWQYBSABKAgSFAoManNvbl9lbmFibGVkGAYgASgIEhMKC3Rsc19lbmFibGVkGAcgASgIEgwKBHJvb3QYCCABKAkSHwoXcHJveHlfdG9fY2xpZW50X2VuYWJsZWQYCSABKAgSHQoVbWFwX3JlcG9ydGluZ19lbmFibGVkGAogASgIEkcKE21hcF9yZXBvcnRfc2V0dGluZ3MYCyABKAsyKi5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5NYXBSZXBvcnRTZXR0aW5ncxpuChFNYXBSZXBvcnRTZXR0aW5ncxIdChVwdWJsaXNoX2ludGVydmFsX3NlY3MYASABKA0SGgoScG9zaXRpb25fcHJlY2lzaW9uGAIgASgNEh4KFnNob3VsZF9yZXBvcnRfbG9jYXRpb24YAyABKAgaggEKFFJlbW90ZUhhcmR3YXJlQ29uZmlnEg8KB2VuYWJsZWQYASABKAgSIgoaYWxsb3dfdW5kZWZpbmVkX3Bpbl9hY2Nlc3MYAiABKAgSNQoOYXZhaWxhYmxlX3BpbnMYAyADKAsyHS5tZXNodGFzdGljLlJlbW90ZUhhcmR3YXJlUGluGloKEk5laWdoYm9ySW5mb0NvbmZpZxIPCgdlbmFibGVkGAEgASgIEhcKD3VwZGF0ZV9pbnRlcnZhbBgCIAEoDRIaChJ0cmFuc21pdF9vdmVyX2xvcmEYAyABKAgalwMKFURldGVjdGlvblNlbnNvckNvbmZpZxIPCgdlbmFibGVkGAEgASgIEh4KFm1pbmltdW1fYnJvYWRjYXN0X3NlY3MYAiABKA0SHAoUc3RhdGVfYnJvYWRjYXN0X3NlY3MYAyABKA0SEQoJc2VuZF9iZWxsGAQgASgIEgwKBG5hbWUYBSABKAkSEwoLbW9uaXRvcl9waW4YBiABKA0SWgoWZGV0ZWN0aW9uX3RyaWdnZXJfdHlwZRgHIAEoDjI6Lm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkRldGVjdGlvblNlbnNvckNvbmZpZy5UcmlnZ2VyVHlwZRISCgp1c2VfcHVsbHVwGAggASgIIogBCgtUcmlnZ2VyVHlwZRINCglMT0dJQ19MT1cQABIOCgpMT0dJQ19ISUdIEAESEAoMRkFMTElOR19FREdFEAISDwoLUklTSU5HX0VER0UQAxIaChZFSVRIRVJfRURHRV9BQ1RJVkVfTE9XEAQSGwoXRUlUSEVSX0VER0VfQUNUSVZFX0hJR0gQBRrkAgoLQXVkaW9Db25maWcSFgoOY29kZWMyX2VuYWJsZWQYASABKAgSDwoHcHR0X3BpbhgCIAEoDRJACgdiaXRyYXRlGAMgASgOMi8ubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuQXVkaW9Db25maWcuQXVkaW9fQmF1ZBIOCgZpMnNfd3MYBCABKA0SDgoGaTJzX3NkGAUgASgNEg8KB2kyc19kaW4YBiABKA0SDwoHaTJzX3NjaxgHIAEoDSKnAQoKQXVkaW9fQmF1ZBISCg5DT0RFQzJfREVGQVVMVBAAEg8KC0NPREVDMl8zMjAwEAESDwoLQ09ERUMyXzI0MDAQAhIPCgtDT0RFQzJfMTYwMBADEg8KC0NPREVDMl8xNDAwEAQSDwoLQ09ERUMyXzEzMDAQBRIPCgtDT0RFQzJfMTIwMBAGEg4KCkNPREVDMl83MDAQBxIPCgtDT0RFQzJfNzAwQhAIGnYKEFBheGNvdW50ZXJDb25maWcSDwoHZW5hYmxlZBgBIAEoCBIiChpwYXhjb3VudGVyX3VwZGF0ZV9pbnRlcnZhbBgCIAEoDRIWCg53aWZpX3RocmVzaG9sZBgDIAEoBRIVCg1ibGVfdGhyZXNob2xkGAQgASgFGowFCgxTZXJpYWxDb25maWcSDwoHZW5hYmxlZBgBIAEoCBIMCgRlY2hvGAIgASgIEgsKA3J4ZBgDIAEoDRILCgN0eGQYBCABKA0SPwoEYmF1ZBgFIAEoDjIxLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLlNlcmlhbENvbmZpZy5TZXJpYWxfQmF1ZBIPCgd0aW1lb3V0GAYgASgNEj8KBG1vZGUYByABKA4yMS5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5TZXJpYWxDb25maWcuU2VyaWFsX01vZGUSJAocb3ZlcnJpZGVfY29uc29sZV9zZXJpYWxfcG9ydBgIIAEoCCKKAgoLU2VyaWFsX0JhdWQSEAoMQkFVRF9ERUZBVUxUEAASDAoIQkFVRF8xMTAQARIMCghCQVVEXzMwMBACEgwKCEJBVURfNjAwEAMSDQoJQkFVRF8xMjAwEAQSDQoJQkFVRF8yNDAwEAUSDQoJQkFVRF80ODAwEAYSDQoJQkFVRF85NjAwEAcSDgoKQkFVRF8xOTIwMBAIEg4KCkJBVURfMzg0MDAQCRIOCgpCQVVEXzU3NjAwEAoSDwoLQkFVRF8xMTUyMDAQCxIPCgtCQVVEXzIzMDQwMBAMEg8KC0JBVURfNDYwODAwEA0SDwoLQkFVRF81NzYwMDAQDhIPCgtCQVVEXzkyMTYwMBAPIn0KC1NlcmlhbF9Nb2RlEgsKB0RFRkFVTFQQABIKCgZTSU1QTEUQARIJCgVQUk9UTxACEgsKB1RFWFRNU0cQAxIICgROTUVBEAQSCwoHQ0FMVE9QTxAFEggKBFdTODUQBhINCglWRV9ESVJFQ1QQBxINCglNU19DT05GSUcQCBrpAgoaRXh0ZXJuYWxOb3RpZmljYXRpb25Db25maWcSDwoHZW5hYmxlZBgBIAEoCBIRCglvdXRwdXRfbXMYAiABKA0SDgoGb3V0cHV0GAMgASgNEhQKDG91dHB1dF92aWJyYRgIIAEoDRIVCg1vdXRwdXRfYnV6emVyGAkgASgNEg4KBmFjdGl2ZRgEIAEoCBIVCg1hbGVydF9tZXNzYWdlGAUgASgIEhsKE2FsZXJ0X21lc3NhZ2VfdmlicmEYCiABKAgSHAoUYWxlcnRfbWVzc2FnZV9idXp6ZXIYCyABKAgSEgoKYWxlcnRfYmVsbBgGIAEoCBIYChBhbGVydF9iZWxsX3ZpYnJhGAwgASgIEhkKEWFsZXJ0X2JlbGxfYnV6emVyGA0gASgIEg8KB3VzZV9wd20YByABKAgSEwoLbmFnX3RpbWVvdXQYDiABKA0SGQoRdXNlX2kyc19hc19idXp6ZXIYDyABKAgalwEKElN0b3JlRm9yd2FyZENvbmZpZxIPCgdlbmFibGVkGAEgASgIEhEKCWhlYXJ0YmVhdBgCIAEoCBIPCgdyZWNvcmRzGAMgASgNEhoKEmhpc3RvcnlfcmV0dXJuX21heBgEIAEoDRIdChVoaXN0b3J5X3JldHVybl93aW5kb3cYBSABKA0SEQoJaXNfc2VydmVyGAYgASgIGlkKD1JhbmdlVGVzdENvbmZpZxIPCgdlbmFibGVkGAEgASgIEg4KBnNlbmRlchgCIAEoDRIMCgRzYXZlGAMgASgIEhcKD2NsZWFyX29uX3JlYm9vdBgEIAEoCBrrAwoPVGVsZW1ldHJ5Q29uZmlnEh4KFmRldmljZV91cGRhdGVfaW50ZXJ2YWwYASABKA0SIwobZW52aXJvbm1lbnRfdXBkYXRlX2ludGVydmFsGAIgASgNEicKH2Vudmlyb25tZW50X21lYXN1cmVtZW50X2VuYWJsZWQYAyABKAgSIgoaZW52aXJvbm1lbnRfc2NyZWVuX2VuYWJsZWQYBCABKAgSJgoeZW52aXJvbm1lbnRfZGlzcGxheV9mYWhyZW5oZWl0GAUgASgIEhsKE2Fpcl9xdWFsaXR5X2VuYWJsZWQYBiABKAgSHAoUYWlyX3F1YWxpdHlfaW50ZXJ2YWwYByABKA0SIQoZcG93ZXJfbWVhc3VyZW1lbnRfZW5hYmxlZBgIIAEoCBIdChVwb3dlcl91cGRhdGVfaW50ZXJ2YWwYCSABKA0SHAoUcG93ZXJfc2NyZWVuX2VuYWJsZWQYCiABKAgSIgoaaGVhbHRoX21lYXN1cmVtZW50X2VuYWJsZWQYCyABKAgSHgoWaGVhbHRoX3VwZGF0ZV9pbnRlcnZhbBgMIAEoDRIdChVoZWFsdGhfc2NyZWVuX2VuYWJsZWQYDSABKAgSIAoYZGV2aWNlX3RlbGVtZXRyeV9lbmFibGVkGA4gASgIGt4EChNDYW5uZWRNZXNzYWdlQ29uZmlnEhcKD3JvdGFyeTFfZW5hYmxlZBgBIAEoCBIZChFpbnB1dGJyb2tlcl9waW5fYRgCIAEoDRIZChFpbnB1dGJyb2tlcl9waW5fYhgDIAEoDRIdChVpbnB1dGJyb2tlcl9waW5fcHJlc3MYBCABKA0SWQoUaW5wdXRicm9rZXJfZXZlbnRfY3cYBSABKA4yOy5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5DYW5uZWRNZXNzYWdlQ29uZmlnLklucHV0RXZlbnRDaGFyEloKFWlucHV0YnJva2VyX2V2ZW50X2NjdxgGIAEoDjI7Lm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkNhbm5lZE1lc3NhZ2VDb25maWcuSW5wdXRFdmVudENoYXISXAoXaW5wdXRicm9rZXJfZXZlbnRfcHJlc3MYByABKA4yOy5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5DYW5uZWRNZXNzYWdlQ29uZmlnLklucHV0RXZlbnRDaGFyEhcKD3VwZG93bjFfZW5hYmxlZBgIIAEoCBITCgdlbmFibGVkGAkgASgIQgIYARIeChJhbGxvd19pbnB1dF9zb3VyY2UYCiABKAlCAhgBEhEKCXNlbmRfYmVsbBgLIAEoCCJjCg5JbnB1dEV2ZW50Q2hhchIICgROT05FEAASBgoCVVAQERIICgRET1dOEBISCAoETEVGVBATEgkKBVJJR0hUEBQSCgoGU0VMRUNUEAoSCAoEQkFDSxAbEgoKBkNBTkNFTBAYGmUKFUFtYmllbnRMaWdodGluZ0NvbmZpZxIRCglsZWRfc3RhdGUYASABKAgSDwoHY3VycmVudBgCIAEoDRILCgNyZWQYAyABKA0SDQoFZ3JlZW4YBCABKA0SDAoEYmx1ZRgFIAEoDUIRCg9wYXlsb2FkX3ZhcmlhbnQiZAoRUmVtb3RlSGFyZHdhcmVQaW4SEAoIZ3Bpb19waW4YASABKA0SDAoEbmFtZRgCIAEoCRIvCgR0eXBlGAMgASgOMiEubWVzaHRhc3RpYy5SZW1vdGVIYXJkd2FyZVBpblR5cGUqSQoVUmVtb3RlSGFyZHdhcmVQaW5UeXBlEgsKB1VOS05PV04QABIQCgxESUdJVEFMX1JFQUQQARIRCg1ESUdJVEFMX1dSSVRFEAJCaAoUb3JnLm1lc2h0YXN0aWMucHJvdG9CEk1vZHVsZUNvbmZpZ1Byb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM");
/**
* Describes the message meshtastic.ModuleConfig.
* Use `create(ModuleConfigSchema)` to create a new message.
*/
const ModuleConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0);
/**
* Describes the message meshtastic.ModuleConfig.MQTTConfig.
* Use `create(ModuleConfig_MQTTConfigSchema)` to create a new message.
*/
const ModuleConfig_MQTTConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 0);
/**
* Describes the message meshtastic.ModuleConfig.MapReportSettings.
* Use `create(ModuleConfig_MapReportSettingsSchema)` to create a new message.
*/
const ModuleConfig_MapReportSettingsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 1);
/**
* Describes the message meshtastic.ModuleConfig.RemoteHardwareConfig.
* Use `create(ModuleConfig_RemoteHardwareConfigSchema)` to create a new message.
*/
const ModuleConfig_RemoteHardwareConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 2);
/**
* Describes the message meshtastic.ModuleConfig.NeighborInfoConfig.
* Use `create(ModuleConfig_NeighborInfoConfigSchema)` to create a new message.
*/
const ModuleConfig_NeighborInfoConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 3);
/**
* Describes the message meshtastic.ModuleConfig.DetectionSensorConfig.
* Use `create(ModuleConfig_DetectionSensorConfigSchema)` to create a new message.
*/
const ModuleConfig_DetectionSensorConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 4);
/**
* @generated from enum meshtastic.ModuleConfig.DetectionSensorConfig.TriggerType
*/
let ModuleConfig_DetectionSensorConfig_TriggerType = /* @__PURE__ */ function(ModuleConfig_DetectionSensorConfig_TriggerType$1) {
	/**
	* Event is triggered if pin is low
	*
	* @generated from enum value: LOGIC_LOW = 0;
	*/
	ModuleConfig_DetectionSensorConfig_TriggerType$1[ModuleConfig_DetectionSensorConfig_TriggerType$1["LOGIC_LOW"] = 0] = "LOGIC_LOW";
	/**
	* Event is triggered if pin is high
	*
	* @generated from enum value: LOGIC_HIGH = 1;
	*/
	ModuleConfig_DetectionSensorConfig_TriggerType$1[ModuleConfig_DetectionSensorConfig_TriggerType$1["LOGIC_HIGH"] = 1] = "LOGIC_HIGH";
	/**
	* Event is triggered when pin goes high to low
	*
	* @generated from enum value: FALLING_EDGE = 2;
	*/
	ModuleConfig_DetectionSensorConfig_TriggerType$1[ModuleConfig_DetectionSensorConfig_TriggerType$1["FALLING_EDGE"] = 2] = "FALLING_EDGE";
	/**
	* Event is triggered when pin goes low to high
	*
	* @generated from enum value: RISING_EDGE = 3;
	*/
	ModuleConfig_DetectionSensorConfig_TriggerType$1[ModuleConfig_DetectionSensorConfig_TriggerType$1["RISING_EDGE"] = 3] = "RISING_EDGE";
	/**
	* Event is triggered on every pin state change, low is considered to be
	* "active"
	*
	* @generated from enum value: EITHER_EDGE_ACTIVE_LOW = 4;
	*/
	ModuleConfig_DetectionSensorConfig_TriggerType$1[ModuleConfig_DetectionSensorConfig_TriggerType$1["EITHER_EDGE_ACTIVE_LOW"] = 4] = "EITHER_EDGE_ACTIVE_LOW";
	/**
	* Event is triggered on every pin state change, high is considered to be
	* "active"
	*
	* @generated from enum value: EITHER_EDGE_ACTIVE_HIGH = 5;
	*/
	ModuleConfig_DetectionSensorConfig_TriggerType$1[ModuleConfig_DetectionSensorConfig_TriggerType$1["EITHER_EDGE_ACTIVE_HIGH"] = 5] = "EITHER_EDGE_ACTIVE_HIGH";
	return ModuleConfig_DetectionSensorConfig_TriggerType$1;
}({});
/**
* Describes the enum meshtastic.ModuleConfig.DetectionSensorConfig.TriggerType.
*/
const ModuleConfig_DetectionSensorConfig_TriggerTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_module_config, 0, 4, 0);
/**
* Describes the message meshtastic.ModuleConfig.AudioConfig.
* Use `create(ModuleConfig_AudioConfigSchema)` to create a new message.
*/
const ModuleConfig_AudioConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 5);
/**
*
* Baudrate for codec2 voice
*
* @generated from enum meshtastic.ModuleConfig.AudioConfig.Audio_Baud
*/
let ModuleConfig_AudioConfig_Audio_Baud = /* @__PURE__ */ function(ModuleConfig_AudioConfig_Audio_Baud$1) {
	/**
	* @generated from enum value: CODEC2_DEFAULT = 0;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_DEFAULT"] = 0] = "CODEC2_DEFAULT";
	/**
	* @generated from enum value: CODEC2_3200 = 1;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_3200"] = 1] = "CODEC2_3200";
	/**
	* @generated from enum value: CODEC2_2400 = 2;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_2400"] = 2] = "CODEC2_2400";
	/**
	* @generated from enum value: CODEC2_1600 = 3;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_1600"] = 3] = "CODEC2_1600";
	/**
	* @generated from enum value: CODEC2_1400 = 4;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_1400"] = 4] = "CODEC2_1400";
	/**
	* @generated from enum value: CODEC2_1300 = 5;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_1300"] = 5] = "CODEC2_1300";
	/**
	* @generated from enum value: CODEC2_1200 = 6;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_1200"] = 6] = "CODEC2_1200";
	/**
	* @generated from enum value: CODEC2_700 = 7;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_700"] = 7] = "CODEC2_700";
	/**
	* @generated from enum value: CODEC2_700B = 8;
	*/
	ModuleConfig_AudioConfig_Audio_Baud$1[ModuleConfig_AudioConfig_Audio_Baud$1["CODEC2_700B"] = 8] = "CODEC2_700B";
	return ModuleConfig_AudioConfig_Audio_Baud$1;
}({});
/**
* Describes the enum meshtastic.ModuleConfig.AudioConfig.Audio_Baud.
*/
const ModuleConfig_AudioConfig_Audio_BaudSchema = /* @__PURE__ */ enumDesc(file_meshtastic_module_config, 0, 5, 0);
/**
* Describes the message meshtastic.ModuleConfig.PaxcounterConfig.
* Use `create(ModuleConfig_PaxcounterConfigSchema)` to create a new message.
*/
const ModuleConfig_PaxcounterConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 6);
/**
* Describes the message meshtastic.ModuleConfig.SerialConfig.
* Use `create(ModuleConfig_SerialConfigSchema)` to create a new message.
*/
const ModuleConfig_SerialConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 7);
/**
*
* TODO: REPLACE
*
* @generated from enum meshtastic.ModuleConfig.SerialConfig.Serial_Baud
*/
let ModuleConfig_SerialConfig_Serial_Baud = /* @__PURE__ */ function(ModuleConfig_SerialConfig_Serial_Baud$1) {
	/**
	* @generated from enum value: BAUD_DEFAULT = 0;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_DEFAULT"] = 0] = "BAUD_DEFAULT";
	/**
	* @generated from enum value: BAUD_110 = 1;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_110"] = 1] = "BAUD_110";
	/**
	* @generated from enum value: BAUD_300 = 2;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_300"] = 2] = "BAUD_300";
	/**
	* @generated from enum value: BAUD_600 = 3;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_600"] = 3] = "BAUD_600";
	/**
	* @generated from enum value: BAUD_1200 = 4;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_1200"] = 4] = "BAUD_1200";
	/**
	* @generated from enum value: BAUD_2400 = 5;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_2400"] = 5] = "BAUD_2400";
	/**
	* @generated from enum value: BAUD_4800 = 6;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_4800"] = 6] = "BAUD_4800";
	/**
	* @generated from enum value: BAUD_9600 = 7;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_9600"] = 7] = "BAUD_9600";
	/**
	* @generated from enum value: BAUD_19200 = 8;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_19200"] = 8] = "BAUD_19200";
	/**
	* @generated from enum value: BAUD_38400 = 9;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_38400"] = 9] = "BAUD_38400";
	/**
	* @generated from enum value: BAUD_57600 = 10;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_57600"] = 10] = "BAUD_57600";
	/**
	* @generated from enum value: BAUD_115200 = 11;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_115200"] = 11] = "BAUD_115200";
	/**
	* @generated from enum value: BAUD_230400 = 12;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_230400"] = 12] = "BAUD_230400";
	/**
	* @generated from enum value: BAUD_460800 = 13;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_460800"] = 13] = "BAUD_460800";
	/**
	* @generated from enum value: BAUD_576000 = 14;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_576000"] = 14] = "BAUD_576000";
	/**
	* @generated from enum value: BAUD_921600 = 15;
	*/
	ModuleConfig_SerialConfig_Serial_Baud$1[ModuleConfig_SerialConfig_Serial_Baud$1["BAUD_921600"] = 15] = "BAUD_921600";
	return ModuleConfig_SerialConfig_Serial_Baud$1;
}({});
/**
* Describes the enum meshtastic.ModuleConfig.SerialConfig.Serial_Baud.
*/
const ModuleConfig_SerialConfig_Serial_BaudSchema = /* @__PURE__ */ enumDesc(file_meshtastic_module_config, 0, 7, 0);
/**
*
* TODO: REPLACE
*
* @generated from enum meshtastic.ModuleConfig.SerialConfig.Serial_Mode
*/
let ModuleConfig_SerialConfig_Serial_Mode = /* @__PURE__ */ function(ModuleConfig_SerialConfig_Serial_Mode$1) {
	/**
	* @generated from enum value: DEFAULT = 0;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["DEFAULT"] = 0] = "DEFAULT";
	/**
	* @generated from enum value: SIMPLE = 1;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["SIMPLE"] = 1] = "SIMPLE";
	/**
	* @generated from enum value: PROTO = 2;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["PROTO"] = 2] = "PROTO";
	/**
	* @generated from enum value: TEXTMSG = 3;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["TEXTMSG"] = 3] = "TEXTMSG";
	/**
	* @generated from enum value: NMEA = 4;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["NMEA"] = 4] = "NMEA";
	/**
	* NMEA messages specifically tailored for CalTopo
	*
	* @generated from enum value: CALTOPO = 5;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["CALTOPO"] = 5] = "CALTOPO";
	/**
	* Ecowitt WS85 weather station
	*
	* @generated from enum value: WS85 = 6;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["WS85"] = 6] = "WS85";
	/**
	* VE.Direct is a serial protocol used by Victron Energy products
	* https://beta.ivc.no/wiki/index.php/Victron_VE_Direct_DIY_Cable
	*
	* @generated from enum value: VE_DIRECT = 7;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["VE_DIRECT"] = 7] = "VE_DIRECT";
	/**
	* Used to configure and view some parameters of MeshSolar.
	* https://heltec.org/project/meshsolar/
	*
	* @generated from enum value: MS_CONFIG = 8;
	*/
	ModuleConfig_SerialConfig_Serial_Mode$1[ModuleConfig_SerialConfig_Serial_Mode$1["MS_CONFIG"] = 8] = "MS_CONFIG";
	return ModuleConfig_SerialConfig_Serial_Mode$1;
}({});
/**
* Describes the enum meshtastic.ModuleConfig.SerialConfig.Serial_Mode.
*/
const ModuleConfig_SerialConfig_Serial_ModeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_module_config, 0, 7, 1);
/**
* Describes the message meshtastic.ModuleConfig.ExternalNotificationConfig.
* Use `create(ModuleConfig_ExternalNotificationConfigSchema)` to create a new message.
*/
const ModuleConfig_ExternalNotificationConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 8);
/**
* Describes the message meshtastic.ModuleConfig.StoreForwardConfig.
* Use `create(ModuleConfig_StoreForwardConfigSchema)` to create a new message.
*/
const ModuleConfig_StoreForwardConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 9);
/**
* Describes the message meshtastic.ModuleConfig.RangeTestConfig.
* Use `create(ModuleConfig_RangeTestConfigSchema)` to create a new message.
*/
const ModuleConfig_RangeTestConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 10);
/**
* Describes the message meshtastic.ModuleConfig.TelemetryConfig.
* Use `create(ModuleConfig_TelemetryConfigSchema)` to create a new message.
*/
const ModuleConfig_TelemetryConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 11);
/**
* Describes the message meshtastic.ModuleConfig.CannedMessageConfig.
* Use `create(ModuleConfig_CannedMessageConfigSchema)` to create a new message.
*/
const ModuleConfig_CannedMessageConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 12);
/**
*
* TODO: REPLACE
*
* @generated from enum meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar
*/
let ModuleConfig_CannedMessageConfig_InputEventChar = /* @__PURE__ */ function(ModuleConfig_CannedMessageConfig_InputEventChar$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: NONE = 0;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["NONE"] = 0] = "NONE";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: UP = 17;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["UP"] = 17] = "UP";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: DOWN = 18;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["DOWN"] = 18] = "DOWN";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: LEFT = 19;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["LEFT"] = 19] = "LEFT";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: RIGHT = 20;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["RIGHT"] = 20] = "RIGHT";
	/**
	*
	* '\n'
	*
	* @generated from enum value: SELECT = 10;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["SELECT"] = 10] = "SELECT";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: BACK = 27;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["BACK"] = 27] = "BACK";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: CANCEL = 24;
	*/
	ModuleConfig_CannedMessageConfig_InputEventChar$1[ModuleConfig_CannedMessageConfig_InputEventChar$1["CANCEL"] = 24] = "CANCEL";
	return ModuleConfig_CannedMessageConfig_InputEventChar$1;
}({});
/**
* Describes the enum meshtastic.ModuleConfig.CannedMessageConfig.InputEventChar.
*/
const ModuleConfig_CannedMessageConfig_InputEventCharSchema = /* @__PURE__ */ enumDesc(file_meshtastic_module_config, 0, 12, 0);
/**
* Describes the message meshtastic.ModuleConfig.AmbientLightingConfig.
* Use `create(ModuleConfig_AmbientLightingConfigSchema)` to create a new message.
*/
const ModuleConfig_AmbientLightingConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 0, 13);
/**
* Describes the message meshtastic.RemoteHardwarePin.
* Use `create(RemoteHardwarePinSchema)` to create a new message.
*/
const RemoteHardwarePinSchema = /* @__PURE__ */ messageDesc(file_meshtastic_module_config, 1);
/**
* @generated from enum meshtastic.RemoteHardwarePinType
*/
let RemoteHardwarePinType = /* @__PURE__ */ function(RemoteHardwarePinType$1) {
	/**
	*
	* Unset/unused
	*
	* @generated from enum value: UNKNOWN = 0;
	*/
	RemoteHardwarePinType$1[RemoteHardwarePinType$1["UNKNOWN"] = 0] = "UNKNOWN";
	/**
	*
	* GPIO pin can be read (if it is high / low)
	*
	* @generated from enum value: DIGITAL_READ = 1;
	*/
	RemoteHardwarePinType$1[RemoteHardwarePinType$1["DIGITAL_READ"] = 1] = "DIGITAL_READ";
	/**
	*
	* GPIO pin can be written to (high / low)
	*
	* @generated from enum value: DIGITAL_WRITE = 2;
	*/
	RemoteHardwarePinType$1[RemoteHardwarePinType$1["DIGITAL_WRITE"] = 2] = "DIGITAL_WRITE";
	return RemoteHardwarePinType$1;
}({});
/**
* Describes the enum meshtastic.RemoteHardwarePinType.
*/
const RemoteHardwarePinTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_module_config, 0);

//#endregion
//#region lib/meshtastic/portnums_pb.ts
var portnums_pb_exports = /* @__PURE__ */ __export({
	PortNum: () => PortNum,
	PortNumSchema: () => PortNumSchema,
	file_meshtastic_portnums: () => file_meshtastic_portnums
});
/**
* Describes the file meshtastic/portnums.proto.
*/
const file_meshtastic_portnums = /* @__PURE__ */ fileDesc("ChltZXNodGFzdGljL3BvcnRudW1zLnByb3RvEgptZXNodGFzdGljKvYECgdQb3J0TnVtEg8KC1VOS05PV05fQVBQEAASFAoQVEVYVF9NRVNTQUdFX0FQUBABEhcKE1JFTU9URV9IQVJEV0FSRV9BUFAQAhIQCgxQT1NJVElPTl9BUFAQAxIQCgxOT0RFSU5GT19BUFAQBBIPCgtST1VUSU5HX0FQUBAFEg0KCUFETUlOX0FQUBAGEh8KG1RFWFRfTUVTU0FHRV9DT01QUkVTU0VEX0FQUBAHEhAKDFdBWVBPSU5UX0FQUBAIEg0KCUFVRElPX0FQUBAJEhgKFERFVEVDVElPTl9TRU5TT1JfQVBQEAoSDQoJQUxFUlRfQVBQEAsSGAoUS0VZX1ZFUklGSUNBVElPTl9BUFAQDBINCglSRVBMWV9BUFAQIBIRCg1JUF9UVU5ORUxfQVBQECESEgoOUEFYQ09VTlRFUl9BUFAQIhIOCgpTRVJJQUxfQVBQEEASFQoRU1RPUkVfRk9SV0FSRF9BUFAQQRISCg5SQU5HRV9URVNUX0FQUBBCEhEKDVRFTEVNRVRSWV9BUFAQQxILCgdaUFNfQVBQEEQSEQoNU0lNVUxBVE9SX0FQUBBFEhIKDlRSQUNFUk9VVEVfQVBQEEYSFAoQTkVJR0hCT1JJTkZPX0FQUBBHEg8KC0FUQUtfUExVR0lOEEgSEgoOTUFQX1JFUE9SVF9BUFAQSRITCg9QT1dFUlNUUkVTU19BUFAQShIYChRSRVRJQ1VMVU1fVFVOTkVMX0FQUBBMEg8KC0NBWUVOTkVfQVBQEE0SEAoLUFJJVkFURV9BUFAQgAISEwoOQVRBS19GT1JXQVJERVIQgQISCAoDTUFYEP8DQl4KFG9yZy5tZXNodGFzdGljLnByb3RvQghQb3J0bnVtc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM");
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
let PortNum = /* @__PURE__ */ function(PortNum$1) {
	/**
	*
	* Deprecated: do not use in new code (formerly called OPAQUE)
	* A message sent from a device outside of the mesh, in a form the mesh does not understand
	* NOTE: This must be 0, because it is documented in IMeshService.aidl to be so
	* ENCODING: binary undefined
	*
	* @generated from enum value: UNKNOWN_APP = 0;
	*/
	PortNum$1[PortNum$1["UNKNOWN_APP"] = 0] = "UNKNOWN_APP";
	/**
	*
	* A simple UTF-8 text message, which even the little micros in the mesh
	* can understand and show on their screen eventually in some circumstances
	* even signal might send messages in this form (see below)
	* ENCODING: UTF-8 Plaintext (?)
	*
	* @generated from enum value: TEXT_MESSAGE_APP = 1;
	*/
	PortNum$1[PortNum$1["TEXT_MESSAGE_APP"] = 1] = "TEXT_MESSAGE_APP";
	/**
	*
	* Reserved for built-in GPIO/example app.
	* See remote_hardware.proto/HardwareMessage for details on the message sent/received to this port number
	* ENCODING: Protobuf
	*
	* @generated from enum value: REMOTE_HARDWARE_APP = 2;
	*/
	PortNum$1[PortNum$1["REMOTE_HARDWARE_APP"] = 2] = "REMOTE_HARDWARE_APP";
	/**
	*
	* The built-in position messaging app.
	* Payload is a Position message.
	* ENCODING: Protobuf
	*
	* @generated from enum value: POSITION_APP = 3;
	*/
	PortNum$1[PortNum$1["POSITION_APP"] = 3] = "POSITION_APP";
	/**
	*
	* The built-in user info app.
	* Payload is a User message.
	* ENCODING: Protobuf
	*
	* @generated from enum value: NODEINFO_APP = 4;
	*/
	PortNum$1[PortNum$1["NODEINFO_APP"] = 4] = "NODEINFO_APP";
	/**
	*
	* Protocol control packets for mesh protocol use.
	* Payload is a Routing message.
	* ENCODING: Protobuf
	*
	* @generated from enum value: ROUTING_APP = 5;
	*/
	PortNum$1[PortNum$1["ROUTING_APP"] = 5] = "ROUTING_APP";
	/**
	*
	* Admin control packets.
	* Payload is a AdminMessage message.
	* ENCODING: Protobuf
	*
	* @generated from enum value: ADMIN_APP = 6;
	*/
	PortNum$1[PortNum$1["ADMIN_APP"] = 6] = "ADMIN_APP";
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
	PortNum$1[PortNum$1["TEXT_MESSAGE_COMPRESSED_APP"] = 7] = "TEXT_MESSAGE_COMPRESSED_APP";
	/**
	*
	* Waypoint payloads.
	* Payload is a Waypoint message.
	* ENCODING: Protobuf
	*
	* @generated from enum value: WAYPOINT_APP = 8;
	*/
	PortNum$1[PortNum$1["WAYPOINT_APP"] = 8] = "WAYPOINT_APP";
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
	PortNum$1[PortNum$1["AUDIO_APP"] = 9] = "AUDIO_APP";
	/**
	*
	* Same as Text Message but originating from Detection Sensor Module.
	* NOTE: This portnum traffic is not sent to the public MQTT starting at firmware version 2.2.9
	*
	* @generated from enum value: DETECTION_SENSOR_APP = 10;
	*/
	PortNum$1[PortNum$1["DETECTION_SENSOR_APP"] = 10] = "DETECTION_SENSOR_APP";
	/**
	*
	* Same as Text Message but used for critical alerts.
	*
	* @generated from enum value: ALERT_APP = 11;
	*/
	PortNum$1[PortNum$1["ALERT_APP"] = 11] = "ALERT_APP";
	/**
	*
	* Module/port for handling key verification requests.
	*
	* @generated from enum value: KEY_VERIFICATION_APP = 12;
	*/
	PortNum$1[PortNum$1["KEY_VERIFICATION_APP"] = 12] = "KEY_VERIFICATION_APP";
	/**
	*
	* Provides a 'ping' service that replies to any packet it receives.
	* Also serves as a small example module.
	* ENCODING: ASCII Plaintext
	*
	* @generated from enum value: REPLY_APP = 32;
	*/
	PortNum$1[PortNum$1["REPLY_APP"] = 32] = "REPLY_APP";
	/**
	*
	* Used for the python IP tunnel feature
	* ENCODING: IP Packet. Handled by the python API, firmware ignores this one and pases on.
	*
	* @generated from enum value: IP_TUNNEL_APP = 33;
	*/
	PortNum$1[PortNum$1["IP_TUNNEL_APP"] = 33] = "IP_TUNNEL_APP";
	/**
	*
	* Paxcounter lib included in the firmware
	* ENCODING: protobuf
	*
	* @generated from enum value: PAXCOUNTER_APP = 34;
	*/
	PortNum$1[PortNum$1["PAXCOUNTER_APP"] = 34] = "PAXCOUNTER_APP";
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
	PortNum$1[PortNum$1["SERIAL_APP"] = 64] = "SERIAL_APP";
	/**
	*
	* STORE_FORWARD_APP (Work in Progress)
	* Maintained by Jm Casler (MC Hamster) : jm@casler.org
	* ENCODING: Protobuf
	*
	* @generated from enum value: STORE_FORWARD_APP = 65;
	*/
	PortNum$1[PortNum$1["STORE_FORWARD_APP"] = 65] = "STORE_FORWARD_APP";
	/**
	*
	* Optional port for messages for the range test module.
	* ENCODING: ASCII Plaintext
	* NOTE: This portnum traffic is not sent to the public MQTT starting at firmware version 2.2.9
	*
	* @generated from enum value: RANGE_TEST_APP = 66;
	*/
	PortNum$1[PortNum$1["RANGE_TEST_APP"] = 66] = "RANGE_TEST_APP";
	/**
	*
	* Provides a format to send and receive telemetry data from the Meshtastic network.
	* Maintained by Charles Crossan (crossan007) : crossan007@gmail.com
	* ENCODING: Protobuf
	*
	* @generated from enum value: TELEMETRY_APP = 67;
	*/
	PortNum$1[PortNum$1["TELEMETRY_APP"] = 67] = "TELEMETRY_APP";
	/**
	*
	* Experimental tools for estimating node position without a GPS
	* Maintained by Github user a-f-G-U-C (a Meshtastic contributor)
	* Project files at https://github.com/a-f-G-U-C/Meshtastic-ZPS
	* ENCODING: arrays of int64 fields
	*
	* @generated from enum value: ZPS_APP = 68;
	*/
	PortNum$1[PortNum$1["ZPS_APP"] = 68] = "ZPS_APP";
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
	PortNum$1[PortNum$1["SIMULATOR_APP"] = 69] = "SIMULATOR_APP";
	/**
	*
	* Provides a traceroute functionality to show the route a packet towards
	* a certain destination would take on the mesh. Contains a RouteDiscovery message as payload.
	* ENCODING: Protobuf
	*
	* @generated from enum value: TRACEROUTE_APP = 70;
	*/
	PortNum$1[PortNum$1["TRACEROUTE_APP"] = 70] = "TRACEROUTE_APP";
	/**
	*
	* Aggregates edge info for the network by sending out a list of each node's neighbors
	* ENCODING: Protobuf
	*
	* @generated from enum value: NEIGHBORINFO_APP = 71;
	*/
	PortNum$1[PortNum$1["NEIGHBORINFO_APP"] = 71] = "NEIGHBORINFO_APP";
	/**
	*
	* ATAK Plugin
	* Portnum for payloads from the official Meshtastic ATAK plugin
	*
	* @generated from enum value: ATAK_PLUGIN = 72;
	*/
	PortNum$1[PortNum$1["ATAK_PLUGIN"] = 72] = "ATAK_PLUGIN";
	/**
	*
	* Provides unencrypted information about a node for consumption by a map via MQTT
	*
	* @generated from enum value: MAP_REPORT_APP = 73;
	*/
	PortNum$1[PortNum$1["MAP_REPORT_APP"] = 73] = "MAP_REPORT_APP";
	/**
	*
	* PowerStress based monitoring support (for automated power consumption testing)
	*
	* @generated from enum value: POWERSTRESS_APP = 74;
	*/
	PortNum$1[PortNum$1["POWERSTRESS_APP"] = 74] = "POWERSTRESS_APP";
	/**
	*
	* Reticulum Network Stack Tunnel App
	* ENCODING: Fragmented RNS Packet. Handled by Meshtastic RNS interface
	*
	* @generated from enum value: RETICULUM_TUNNEL_APP = 76;
	*/
	PortNum$1[PortNum$1["RETICULUM_TUNNEL_APP"] = 76] = "RETICULUM_TUNNEL_APP";
	/**
	*
	* App for transporting Cayenne Low Power Payload, popular for LoRaWAN sensor nodes. Offers ability to send
	* arbitrary telemetry over meshtastic that is not covered by telemetry.proto
	* ENCODING: CayenneLLP
	*
	* @generated from enum value: CAYENNE_APP = 77;
	*/
	PortNum$1[PortNum$1["CAYENNE_APP"] = 77] = "CAYENNE_APP";
	/**
	*
	* Private applications should use portnums >= 256.
	* To simplify initial development and testing you can use "PRIVATE_APP"
	* in your code without needing to rebuild protobuf files (via [regen-protos.sh](https://github.com/meshtastic/firmware/blob/master/bin/regen-protos.sh))
	*
	* @generated from enum value: PRIVATE_APP = 256;
	*/
	PortNum$1[PortNum$1["PRIVATE_APP"] = 256] = "PRIVATE_APP";
	/**
	*
	* ATAK Forwarder Module https://github.com/paulmandal/atak-forwarder
	* ENCODING: libcotshrink
	*
	* @generated from enum value: ATAK_FORWARDER = 257;
	*/
	PortNum$1[PortNum$1["ATAK_FORWARDER"] = 257] = "ATAK_FORWARDER";
	/**
	*
	* Currently we limit port nums to no higher than this value
	*
	* @generated from enum value: MAX = 511;
	*/
	PortNum$1[PortNum$1["MAX"] = 511] = "MAX";
	return PortNum$1;
}({});
/**
* Describes the enum meshtastic.PortNum.
*/
const PortNumSchema = /* @__PURE__ */ enumDesc(file_meshtastic_portnums, 0);

//#endregion
//#region lib/meshtastic/telemetry_pb.ts
var telemetry_pb_exports = /* @__PURE__ */ __export({
	AirQualityMetricsSchema: () => AirQualityMetricsSchema,
	DeviceMetricsSchema: () => DeviceMetricsSchema,
	EnvironmentMetricsSchema: () => EnvironmentMetricsSchema,
	HealthMetricsSchema: () => HealthMetricsSchema,
	HostMetricsSchema: () => HostMetricsSchema,
	LocalStatsSchema: () => LocalStatsSchema,
	Nau7802ConfigSchema: () => Nau7802ConfigSchema,
	PowerMetricsSchema: () => PowerMetricsSchema,
	TelemetrySchema: () => TelemetrySchema,
	TelemetrySensorType: () => TelemetrySensorType,
	TelemetrySensorTypeSchema: () => TelemetrySensorTypeSchema,
	file_meshtastic_telemetry: () => file_meshtastic_telemetry
});
/**
* Describes the file meshtastic/telemetry.proto.
*/
const file_meshtastic_telemetry = /* @__PURE__ */ fileDesc("ChptZXNodGFzdGljL3RlbGVtZXRyeS5wcm90bxIKbWVzaHRhc3RpYyLzAQoNRGV2aWNlTWV0cmljcxIaCg1iYXR0ZXJ5X2xldmVsGAEgASgNSACIAQESFAoHdm9sdGFnZRgCIAEoAkgBiAEBEiAKE2NoYW5uZWxfdXRpbGl6YXRpb24YAyABKAJIAogBARIYCgthaXJfdXRpbF90eBgEIAEoAkgDiAEBEhsKDnVwdGltZV9zZWNvbmRzGAUgASgNSASIAQFCEAoOX2JhdHRlcnlfbGV2ZWxCCgoIX3ZvbHRhZ2VCFgoUX2NoYW5uZWxfdXRpbGl6YXRpb25CDgoMX2Fpcl91dGlsX3R4QhEKD191cHRpbWVfc2Vjb25kcyKCBwoSRW52aXJvbm1lbnRNZXRyaWNzEhgKC3RlbXBlcmF0dXJlGAEgASgCSACIAQESHgoRcmVsYXRpdmVfaHVtaWRpdHkYAiABKAJIAYgBARIgChNiYXJvbWV0cmljX3ByZXNzdXJlGAMgASgCSAKIAQESGwoOZ2FzX3Jlc2lzdGFuY2UYBCABKAJIA4gBARIUCgd2b2x0YWdlGAUgASgCSASIAQESFAoHY3VycmVudBgGIAEoAkgFiAEBEhAKA2lhcRgHIAEoDUgGiAEBEhUKCGRpc3RhbmNlGAggASgCSAeIAQESEAoDbHV4GAkgASgCSAiIAQESFgoJd2hpdGVfbHV4GAogASgCSAmIAQESEwoGaXJfbHV4GAsgASgCSAqIAQESEwoGdXZfbHV4GAwgASgCSAuIAQESGwoOd2luZF9kaXJlY3Rpb24YDSABKA1IDIgBARIXCgp3aW5kX3NwZWVkGA4gASgCSA2IAQESEwoGd2VpZ2h0GA8gASgCSA6IAQESFgoJd2luZF9ndXN0GBAgASgCSA+IAQESFgoJd2luZF9sdWxsGBEgASgCSBCIAQESFgoJcmFkaWF0aW9uGBIgASgCSBGIAQESGAoLcmFpbmZhbGxfMWgYEyABKAJIEogBARIZCgxyYWluZmFsbF8yNGgYFCABKAJIE4gBARIaCg1zb2lsX21vaXN0dXJlGBUgASgNSBSIAQESHQoQc29pbF90ZW1wZXJhdHVyZRgWIAEoAkgViAEBQg4KDF90ZW1wZXJhdHVyZUIUChJfcmVsYXRpdmVfaHVtaWRpdHlCFgoUX2Jhcm9tZXRyaWNfcHJlc3N1cmVCEQoPX2dhc19yZXNpc3RhbmNlQgoKCF92b2x0YWdlQgoKCF9jdXJyZW50QgYKBF9pYXFCCwoJX2Rpc3RhbmNlQgYKBF9sdXhCDAoKX3doaXRlX2x1eEIJCgdfaXJfbHV4QgkKB191dl9sdXhCEQoPX3dpbmRfZGlyZWN0aW9uQg0KC193aW5kX3NwZWVkQgkKB193ZWlnaHRCDAoKX3dpbmRfZ3VzdEIMCgpfd2luZF9sdWxsQgwKCl9yYWRpYXRpb25CDgoMX3JhaW5mYWxsXzFoQg8KDV9yYWluZmFsbF8yNGhCEAoOX3NvaWxfbW9pc3R1cmVCEwoRX3NvaWxfdGVtcGVyYXR1cmUirgUKDFBvd2VyTWV0cmljcxIYCgtjaDFfdm9sdGFnZRgBIAEoAkgAiAEBEhgKC2NoMV9jdXJyZW50GAIgASgCSAGIAQESGAoLY2gyX3ZvbHRhZ2UYAyABKAJIAogBARIYCgtjaDJfY3VycmVudBgEIAEoAkgDiAEBEhgKC2NoM192b2x0YWdlGAUgASgCSASIAQESGAoLY2gzX2N1cnJlbnQYBiABKAJIBYgBARIYCgtjaDRfdm9sdGFnZRgHIAEoAkgGiAEBEhgKC2NoNF9jdXJyZW50GAggASgCSAeIAQESGAoLY2g1X3ZvbHRhZ2UYCSABKAJICIgBARIYCgtjaDVfY3VycmVudBgKIAEoAkgJiAEBEhgKC2NoNl92b2x0YWdlGAsgASgCSAqIAQESGAoLY2g2X2N1cnJlbnQYDCABKAJIC4gBARIYCgtjaDdfdm9sdGFnZRgNIAEoAkgMiAEBEhgKC2NoN19jdXJyZW50GA4gASgCSA2IAQESGAoLY2g4X3ZvbHRhZ2UYDyABKAJIDogBARIYCgtjaDhfY3VycmVudBgQIAEoAkgPiAEBQg4KDF9jaDFfdm9sdGFnZUIOCgxfY2gxX2N1cnJlbnRCDgoMX2NoMl92b2x0YWdlQg4KDF9jaDJfY3VycmVudEIOCgxfY2gzX3ZvbHRhZ2VCDgoMX2NoM19jdXJyZW50Qg4KDF9jaDRfdm9sdGFnZUIOCgxfY2g0X2N1cnJlbnRCDgoMX2NoNV92b2x0YWdlQg4KDF9jaDVfY3VycmVudEIOCgxfY2g2X3ZvbHRhZ2VCDgoMX2NoNl9jdXJyZW50Qg4KDF9jaDdfdm9sdGFnZUIOCgxfY2g3X2N1cnJlbnRCDgoMX2NoOF92b2x0YWdlQg4KDF9jaDhfY3VycmVudCKxCQoRQWlyUXVhbGl0eU1ldHJpY3MSGgoNcG0xMF9zdGFuZGFyZBgBIAEoDUgAiAEBEhoKDXBtMjVfc3RhbmRhcmQYAiABKA1IAYgBARIbCg5wbTEwMF9zdGFuZGFyZBgDIAEoDUgCiAEBEh8KEnBtMTBfZW52aXJvbm1lbnRhbBgEIAEoDUgDiAEBEh8KEnBtMjVfZW52aXJvbm1lbnRhbBgFIAEoDUgEiAEBEiAKE3BtMTAwX2Vudmlyb25tZW50YWwYBiABKA1IBYgBARIbCg5wYXJ0aWNsZXNfMDN1bRgHIAEoDUgGiAEBEhsKDnBhcnRpY2xlc18wNXVtGAggASgNSAeIAQESGwoOcGFydGljbGVzXzEwdW0YCSABKA1ICIgBARIbCg5wYXJ0aWNsZXNfMjV1bRgKIAEoDUgJiAEBEhsKDnBhcnRpY2xlc181MHVtGAsgASgNSAqIAQESHAoPcGFydGljbGVzXzEwMHVtGAwgASgNSAuIAQESEAoDY28yGA0gASgNSAyIAQESHAoPY28yX3RlbXBlcmF0dXJlGA4gASgCSA2IAQESGQoMY28yX2h1bWlkaXR5GA8gASgCSA6IAQESHgoRZm9ybV9mb3JtYWxkZWh5ZGUYECABKAJID4gBARIaCg1mb3JtX2h1bWlkaXR5GBEgASgCSBCIAQESHQoQZm9ybV90ZW1wZXJhdHVyZRgSIAEoAkgRiAEBEhoKDXBtNDBfc3RhbmRhcmQYEyABKA1IEogBARIbCg5wYXJ0aWNsZXNfNDB1bRgUIAEoDUgTiAEBEhsKDnBtX3RlbXBlcmF0dXJlGBUgASgCSBSIAQESGAoLcG1faHVtaWRpdHkYFiABKAJIFYgBARIXCgpwbV92b2NfaWR4GBcgASgCSBaIAQESFwoKcG1fbm94X2lkeBgYIAEoAkgXiAEBEhoKDXBhcnRpY2xlc190cHMYGSABKAJIGIgBAUIQCg5fcG0xMF9zdGFuZGFyZEIQCg5fcG0yNV9zdGFuZGFyZEIRCg9fcG0xMDBfc3RhbmRhcmRCFQoTX3BtMTBfZW52aXJvbm1lbnRhbEIVChNfcG0yNV9lbnZpcm9ubWVudGFsQhYKFF9wbTEwMF9lbnZpcm9ubWVudGFsQhEKD19wYXJ0aWNsZXNfMDN1bUIRCg9fcGFydGljbGVzXzA1dW1CEQoPX3BhcnRpY2xlc18xMHVtQhEKD19wYXJ0aWNsZXNfMjV1bUIRCg9fcGFydGljbGVzXzUwdW1CEgoQX3BhcnRpY2xlc18xMDB1bUIGCgRfY28yQhIKEF9jbzJfdGVtcGVyYXR1cmVCDwoNX2NvMl9odW1pZGl0eUIUChJfZm9ybV9mb3JtYWxkZWh5ZGVCEAoOX2Zvcm1faHVtaWRpdHlCEwoRX2Zvcm1fdGVtcGVyYXR1cmVCEAoOX3BtNDBfc3RhbmRhcmRCEQoPX3BhcnRpY2xlc180MHVtQhEKD19wbV90ZW1wZXJhdHVyZUIOCgxfcG1faHVtaWRpdHlCDQoLX3BtX3ZvY19pZHhCDQoLX3BtX25veF9pZHhCEAoOX3BhcnRpY2xlc190cHMi6gIKCkxvY2FsU3RhdHMSFgoOdXB0aW1lX3NlY29uZHMYASABKA0SGwoTY2hhbm5lbF91dGlsaXphdGlvbhgCIAEoAhITCgthaXJfdXRpbF90eBgDIAEoAhIWCg5udW1fcGFja2V0c190eBgEIAEoDRIWCg5udW1fcGFja2V0c19yeBgFIAEoDRIaChJudW1fcGFja2V0c19yeF9iYWQYBiABKA0SGAoQbnVtX29ubGluZV9ub2RlcxgHIAEoDRIXCg9udW1fdG90YWxfbm9kZXMYCCABKA0SEwoLbnVtX3J4X2R1cGUYCSABKA0SFAoMbnVtX3R4X3JlbGF5GAogASgNEh0KFW51bV90eF9yZWxheV9jYW5jZWxlZBgLIAEoDRIYChBoZWFwX3RvdGFsX2J5dGVzGAwgASgNEhcKD2hlYXBfZnJlZV9ieXRlcxgNIAEoDRIWCg5udW1fdHhfZHJvcHBlZBgOIAEoDSJ7Cg1IZWFsdGhNZXRyaWNzEhYKCWhlYXJ0X2JwbRgBIAEoDUgAiAEBEhEKBHNwTzIYAiABKA1IAYgBARIYCgt0ZW1wZXJhdHVyZRgDIAEoAkgCiAEBQgwKCl9oZWFydF9icG1CBwoFX3NwTzJCDgoMX3RlbXBlcmF0dXJlIpECCgtIb3N0TWV0cmljcxIWCg51cHRpbWVfc2Vjb25kcxgBIAEoDRIVCg1mcmVlbWVtX2J5dGVzGAIgASgEEhcKD2Rpc2tmcmVlMV9ieXRlcxgDIAEoBBIcCg9kaXNrZnJlZTJfYnl0ZXMYBCABKARIAIgBARIcCg9kaXNrZnJlZTNfYnl0ZXMYBSABKARIAYgBARINCgVsb2FkMRgGIAEoDRINCgVsb2FkNRgHIAEoDRIOCgZsb2FkMTUYCCABKA0SGAoLdXNlcl9zdHJpbmcYCSABKAlIAogBAUISChBfZGlza2ZyZWUyX2J5dGVzQhIKEF9kaXNrZnJlZTNfYnl0ZXNCDgoMX3VzZXJfc3RyaW5nIp4DCglUZWxlbWV0cnkSDAoEdGltZRgBIAEoBxIzCg5kZXZpY2VfbWV0cmljcxgCIAEoCzIZLm1lc2h0YXN0aWMuRGV2aWNlTWV0cmljc0gAEj0KE2Vudmlyb25tZW50X21ldHJpY3MYAyABKAsyHi5tZXNodGFzdGljLkVudmlyb25tZW50TWV0cmljc0gAEjwKE2Fpcl9xdWFsaXR5X21ldHJpY3MYBCABKAsyHS5tZXNodGFzdGljLkFpclF1YWxpdHlNZXRyaWNzSAASMQoNcG93ZXJfbWV0cmljcxgFIAEoCzIYLm1lc2h0YXN0aWMuUG93ZXJNZXRyaWNzSAASLQoLbG9jYWxfc3RhdHMYBiABKAsyFi5tZXNodGFzdGljLkxvY2FsU3RhdHNIABIzCg5oZWFsdGhfbWV0cmljcxgHIAEoCzIZLm1lc2h0YXN0aWMuSGVhbHRoTWV0cmljc0gAEi8KDGhvc3RfbWV0cmljcxgIIAEoCzIXLm1lc2h0YXN0aWMuSG9zdE1ldHJpY3NIAEIJCgd2YXJpYW50Ij4KDU5hdTc4MDJDb25maWcSEgoKemVyb09mZnNldBgBIAEoBRIZChFjYWxpYnJhdGlvbkZhY3RvchgCIAEoAir5BAoTVGVsZW1ldHJ5U2Vuc29yVHlwZRIQCgxTRU5TT1JfVU5TRVQQABIKCgZCTUUyODAQARIKCgZCTUU2ODAQAhILCgdNQ1A5ODA4EAMSCgoGSU5BMjYwEAQSCgoGSU5BMjE5EAUSCgoGQk1QMjgwEAYSCQoFU0hUQzMQBxIJCgVMUFMyMhAIEgsKB1FNQzYzMTAQCRILCgdRTUk4NjU4EAoSDAoIUU1DNTg4M0wQCxIJCgVTSFQzMRAMEgwKCFBNU0EwMDNJEA0SCwoHSU5BMzIyMRAOEgoKBkJNUDA4NRAPEgwKCFJDV0w5NjIwEBASCQoFU0hUNFgQERIMCghWRU1MNzcwMBASEgwKCE1MWDkwNjMyEBMSCwoHT1BUMzAwMRAUEgwKCExUUjM5MFVWEBUSDgoKVFNMMjU5MTFGThAWEgkKBUFIVDEwEBcSEAoMREZST0JPVF9MQVJLEBgSCwoHTkFVNzgwMhAZEgoKBkJNUDNYWBAaEgwKCElDTTIwOTQ4EBsSDAoITUFYMTcwNDgQHBIRCg1DVVNUT01fU0VOU09SEB0SDAoITUFYMzAxMDIQHhIMCghNTFg5MDYxNBAfEgkKBVNDRDRYECASCwoHUkFEU0VOUxAhEgoKBklOQTIyNhAiEhAKDERGUk9CT1RfUkFJThAjEgoKBkRQUzMxMBAkEgwKCFJBSzEyMDM1ECUSDAoITUFYMTcyNjEQJhILCgdQQ1QyMDc1ECcSCwoHQURTMVgxNRAoEg8KC0FEUzFYMTVfQUxUECkSCQoFU0ZBMzAQKhIJCgVTRU41WBArEgsKB1RTTDI1NjEQLBIKCgZCSDE3NTAQLUJlChRvcmcubWVzaHRhc3RpYy5wcm90b0IPVGVsZW1ldHJ5UHJvdG9zWiJnaXRodWIuY29tL21lc2h0YXN0aWMvZ28vZ2VuZXJhdGVkqgIUTWVzaHRhc3RpYy5Qcm90b2J1ZnO6AgBiBnByb3RvMw");
/**
* Describes the message meshtastic.DeviceMetrics.
* Use `create(DeviceMetricsSchema)` to create a new message.
*/
const DeviceMetricsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 0);
/**
* Describes the message meshtastic.EnvironmentMetrics.
* Use `create(EnvironmentMetricsSchema)` to create a new message.
*/
const EnvironmentMetricsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 1);
/**
* Describes the message meshtastic.PowerMetrics.
* Use `create(PowerMetricsSchema)` to create a new message.
*/
const PowerMetricsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 2);
/**
* Describes the message meshtastic.AirQualityMetrics.
* Use `create(AirQualityMetricsSchema)` to create a new message.
*/
const AirQualityMetricsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 3);
/**
* Describes the message meshtastic.LocalStats.
* Use `create(LocalStatsSchema)` to create a new message.
*/
const LocalStatsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 4);
/**
* Describes the message meshtastic.HealthMetrics.
* Use `create(HealthMetricsSchema)` to create a new message.
*/
const HealthMetricsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 5);
/**
* Describes the message meshtastic.HostMetrics.
* Use `create(HostMetricsSchema)` to create a new message.
*/
const HostMetricsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 6);
/**
* Describes the message meshtastic.Telemetry.
* Use `create(TelemetrySchema)` to create a new message.
*/
const TelemetrySchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 7);
/**
* Describes the message meshtastic.Nau7802Config.
* Use `create(Nau7802ConfigSchema)` to create a new message.
*/
const Nau7802ConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_telemetry, 8);
/**
*
* Supported I2C Sensors for telemetry in Meshtastic
*
* @generated from enum meshtastic.TelemetrySensorType
*/
let TelemetrySensorType = /* @__PURE__ */ function(TelemetrySensorType$1) {
	/**
	*
	* No external telemetry sensor explicitly set
	*
	* @generated from enum value: SENSOR_UNSET = 0;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SENSOR_UNSET"] = 0] = "SENSOR_UNSET";
	/**
	*
	* High accuracy temperature, pressure, humidity
	*
	* @generated from enum value: BME280 = 1;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["BME280"] = 1] = "BME280";
	/**
	*
	* High accuracy temperature, pressure, humidity, and air resistance
	*
	* @generated from enum value: BME680 = 2;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["BME680"] = 2] = "BME680";
	/**
	*
	* Very high accuracy temperature
	*
	* @generated from enum value: MCP9808 = 3;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["MCP9808"] = 3] = "MCP9808";
	/**
	*
	* Moderate accuracy current and voltage
	*
	* @generated from enum value: INA260 = 4;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["INA260"] = 4] = "INA260";
	/**
	*
	* Moderate accuracy current and voltage
	*
	* @generated from enum value: INA219 = 5;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["INA219"] = 5] = "INA219";
	/**
	*
	* High accuracy temperature and pressure
	*
	* @generated from enum value: BMP280 = 6;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["BMP280"] = 6] = "BMP280";
	/**
	*
	* High accuracy temperature and humidity
	*
	* @generated from enum value: SHTC3 = 7;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SHTC3"] = 7] = "SHTC3";
	/**
	*
	* High accuracy pressure
	*
	* @generated from enum value: LPS22 = 8;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["LPS22"] = 8] = "LPS22";
	/**
	*
	* 3-Axis magnetic sensor
	*
	* @generated from enum value: QMC6310 = 9;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["QMC6310"] = 9] = "QMC6310";
	/**
	*
	* 6-Axis inertial measurement sensor
	*
	* @generated from enum value: QMI8658 = 10;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["QMI8658"] = 10] = "QMI8658";
	/**
	*
	* 3-Axis magnetic sensor
	*
	* @generated from enum value: QMC5883L = 11;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["QMC5883L"] = 11] = "QMC5883L";
	/**
	*
	* High accuracy temperature and humidity
	*
	* @generated from enum value: SHT31 = 12;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SHT31"] = 12] = "SHT31";
	/**
	*
	* PM2.5 air quality sensor
	*
	* @generated from enum value: PMSA003I = 13;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["PMSA003I"] = 13] = "PMSA003I";
	/**
	*
	* INA3221 3 Channel Voltage / Current Sensor
	*
	* @generated from enum value: INA3221 = 14;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["INA3221"] = 14] = "INA3221";
	/**
	*
	* BMP085/BMP180 High accuracy temperature and pressure (older Version of BMP280)
	*
	* @generated from enum value: BMP085 = 15;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["BMP085"] = 15] = "BMP085";
	/**
	*
	* RCWL-9620 Doppler Radar Distance Sensor, used for water level detection
	*
	* @generated from enum value: RCWL9620 = 16;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["RCWL9620"] = 16] = "RCWL9620";
	/**
	*
	* Sensirion High accuracy temperature and humidity
	*
	* @generated from enum value: SHT4X = 17;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SHT4X"] = 17] = "SHT4X";
	/**
	*
	* VEML7700 high accuracy ambient light(Lux) digital 16-bit resolution sensor.
	*
	* @generated from enum value: VEML7700 = 18;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["VEML7700"] = 18] = "VEML7700";
	/**
	*
	* MLX90632 non-contact IR temperature sensor.
	*
	* @generated from enum value: MLX90632 = 19;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["MLX90632"] = 19] = "MLX90632";
	/**
	*
	* TI OPT3001 Ambient Light Sensor
	*
	* @generated from enum value: OPT3001 = 20;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["OPT3001"] = 20] = "OPT3001";
	/**
	*
	* Lite On LTR-390UV-01 UV Light Sensor
	*
	* @generated from enum value: LTR390UV = 21;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["LTR390UV"] = 21] = "LTR390UV";
	/**
	*
	* AMS TSL25911FN RGB Light Sensor
	*
	* @generated from enum value: TSL25911FN = 22;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["TSL25911FN"] = 22] = "TSL25911FN";
	/**
	*
	* AHT10 Integrated temperature and humidity sensor
	*
	* @generated from enum value: AHT10 = 23;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["AHT10"] = 23] = "AHT10";
	/**
	*
	* DFRobot Lark Weather station (temperature, humidity, pressure, wind speed and direction)
	*
	* @generated from enum value: DFROBOT_LARK = 24;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["DFROBOT_LARK"] = 24] = "DFROBOT_LARK";
	/**
	*
	* NAU7802 Scale Chip or compatible
	*
	* @generated from enum value: NAU7802 = 25;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["NAU7802"] = 25] = "NAU7802";
	/**
	*
	* BMP3XX High accuracy temperature and pressure
	*
	* @generated from enum value: BMP3XX = 26;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["BMP3XX"] = 26] = "BMP3XX";
	/**
	*
	* ICM-20948 9-Axis digital motion processor
	*
	* @generated from enum value: ICM20948 = 27;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["ICM20948"] = 27] = "ICM20948";
	/**
	*
	* MAX17048 1S lipo battery sensor (voltage, state of charge, time to go)
	*
	* @generated from enum value: MAX17048 = 28;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["MAX17048"] = 28] = "MAX17048";
	/**
	*
	* Custom I2C sensor implementation based on https://github.com/meshtastic/i2c-sensor
	*
	* @generated from enum value: CUSTOM_SENSOR = 29;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["CUSTOM_SENSOR"] = 29] = "CUSTOM_SENSOR";
	/**
	*
	* MAX30102 Pulse Oximeter and Heart-Rate Sensor
	*
	* @generated from enum value: MAX30102 = 30;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["MAX30102"] = 30] = "MAX30102";
	/**
	*
	* MLX90614 non-contact IR temperature sensor
	*
	* @generated from enum value: MLX90614 = 31;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["MLX90614"] = 31] = "MLX90614";
	/**
	*
	* SCD40/SCD41 CO2, humidity, temperature sensor
	*
	* @generated from enum value: SCD4X = 32;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SCD4X"] = 32] = "SCD4X";
	/**
	*
	* ClimateGuard RadSens, radiation, Geiger-Muller Tube
	*
	* @generated from enum value: RADSENS = 33;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["RADSENS"] = 33] = "RADSENS";
	/**
	*
	* High accuracy current and voltage
	*
	* @generated from enum value: INA226 = 34;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["INA226"] = 34] = "INA226";
	/**
	*
	* DFRobot Gravity tipping bucket rain gauge
	*
	* @generated from enum value: DFROBOT_RAIN = 35;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["DFROBOT_RAIN"] = 35] = "DFROBOT_RAIN";
	/**
	*
	* Infineon DPS310 High accuracy pressure and temperature
	*
	* @generated from enum value: DPS310 = 36;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["DPS310"] = 36] = "DPS310";
	/**
	*
	* RAKWireless RAK12035 Soil Moisture Sensor Module
	*
	* @generated from enum value: RAK12035 = 37;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["RAK12035"] = 37] = "RAK12035";
	/**
	*
	* MAX17261 lipo battery gauge
	*
	* @generated from enum value: MAX17261 = 38;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["MAX17261"] = 38] = "MAX17261";
	/**
	*
	* PCT2075 Temperature Sensor
	*
	* @generated from enum value: PCT2075 = 39;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["PCT2075"] = 39] = "PCT2075";
	/**
	*
	* ADS1X15 ADC
	*
	* @generated from enum value: ADS1X15 = 40;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["ADS1X15"] = 40] = "ADS1X15";
	/**
	*
	* ADS1X15 ADC_ALT
	*
	* @generated from enum value: ADS1X15_ALT = 41;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["ADS1X15_ALT"] = 41] = "ADS1X15_ALT";
	/**
	*
	* Sensirion SFA30 Formaldehyde sensor
	*
	* @generated from enum value: SFA30 = 42;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SFA30"] = 42] = "SFA30";
	/**
	*
	* SEN5X PM SENSORS
	*
	* @generated from enum value: SEN5X = 43;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["SEN5X"] = 43] = "SEN5X";
	/**
	*
	* TSL2561 light sensor
	*
	* @generated from enum value: TSL2561 = 44;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["TSL2561"] = 44] = "TSL2561";
	/**
	*
	* BH1750 light sensor
	*
	* @generated from enum value: BH1750 = 45;
	*/
	TelemetrySensorType$1[TelemetrySensorType$1["BH1750"] = 45] = "BH1750";
	return TelemetrySensorType$1;
}({});
/**
* Describes the enum meshtastic.TelemetrySensorType.
*/
const TelemetrySensorTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_telemetry, 0);

//#endregion
//#region lib/meshtastic/xmodem_pb.ts
var xmodem_pb_exports = /* @__PURE__ */ __export({
	XModemSchema: () => XModemSchema,
	XModem_Control: () => XModem_Control,
	XModem_ControlSchema: () => XModem_ControlSchema,
	file_meshtastic_xmodem: () => file_meshtastic_xmodem
});
/**
* Describes the file meshtastic/xmodem.proto.
*/
const file_meshtastic_xmodem = /* @__PURE__ */ fileDesc("ChdtZXNodGFzdGljL3htb2RlbS5wcm90bxIKbWVzaHRhc3RpYyK2AQoGWE1vZGVtEisKB2NvbnRyb2wYASABKA4yGi5tZXNodGFzdGljLlhNb2RlbS5Db250cm9sEgsKA3NlcRgCIAEoDRINCgVjcmMxNhgDIAEoDRIOCgZidWZmZXIYBCABKAwiUwoHQ29udHJvbBIHCgNOVUwQABIHCgNTT0gQARIHCgNTVFgQAhIHCgNFT1QQBBIHCgNBQ0sQBhIHCgNOQUsQFRIHCgNDQU4QGBIJCgVDVFJMWhAaQmIKFG9yZy5tZXNodGFzdGljLnByb3RvQgxYbW9kZW1Qcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z");
/**
* Describes the message meshtastic.XModem.
* Use `create(XModemSchema)` to create a new message.
*/
const XModemSchema = /* @__PURE__ */ messageDesc(file_meshtastic_xmodem, 0);
/**
* @generated from enum meshtastic.XModem.Control
*/
let XModem_Control = /* @__PURE__ */ function(XModem_Control$1) {
	/**
	* @generated from enum value: NUL = 0;
	*/
	XModem_Control$1[XModem_Control$1["NUL"] = 0] = "NUL";
	/**
	* @generated from enum value: SOH = 1;
	*/
	XModem_Control$1[XModem_Control$1["SOH"] = 1] = "SOH";
	/**
	* @generated from enum value: STX = 2;
	*/
	XModem_Control$1[XModem_Control$1["STX"] = 2] = "STX";
	/**
	* @generated from enum value: EOT = 4;
	*/
	XModem_Control$1[XModem_Control$1["EOT"] = 4] = "EOT";
	/**
	* @generated from enum value: ACK = 6;
	*/
	XModem_Control$1[XModem_Control$1["ACK"] = 6] = "ACK";
	/**
	* @generated from enum value: NAK = 21;
	*/
	XModem_Control$1[XModem_Control$1["NAK"] = 21] = "NAK";
	/**
	* @generated from enum value: CAN = 24;
	*/
	XModem_Control$1[XModem_Control$1["CAN"] = 24] = "CAN";
	/**
	* @generated from enum value: CTRLZ = 26;
	*/
	XModem_Control$1[XModem_Control$1["CTRLZ"] = 26] = "CTRLZ";
	return XModem_Control$1;
}({});
/**
* Describes the enum meshtastic.XModem.Control.
*/
const XModem_ControlSchema = /* @__PURE__ */ enumDesc(file_meshtastic_xmodem, 0, 0);

//#endregion
//#region lib/nanopb_pb.ts
/**
* Describes the file nanopb.proto.
*/
const file_nanopb = /* @__PURE__ */ fileDesc("CgxuYW5vcGIucHJvdG8ipAcKDU5hbm9QQk9wdGlvbnMSEAoIbWF4X3NpemUYASABKAUSEgoKbWF4X2xlbmd0aBgOIAEoBRIRCgltYXhfY291bnQYAiABKAUSJgoIaW50X3NpemUYByABKA4yCC5JbnRTaXplOgpJU19ERUZBVUxUEiQKBHR5cGUYAyABKA4yCi5GaWVsZFR5cGU6CkZUX0RFRkFVTFQSGAoKbG9uZ19uYW1lcxgEIAEoCDoEdHJ1ZRIcCg1wYWNrZWRfc3RydWN0GAUgASgIOgVmYWxzZRIaCgtwYWNrZWRfZW51bRgKIAEoCDoFZmFsc2USGwoMc2tpcF9tZXNzYWdlGAYgASgIOgVmYWxzZRIYCglub191bmlvbnMYCCABKAg6BWZhbHNlEg0KBW1zZ2lkGAkgASgNEh4KD2Fub255bW91c19vbmVvZhgLIAEoCDoFZmFsc2USFQoGcHJvdG8zGAwgASgIOgVmYWxzZRIjChRwcm90bzNfc2luZ3VsYXJfbXNncxgVIAEoCDoFZmFsc2USHQoOZW51bV90b19zdHJpbmcYDSABKAg6BWZhbHNlEhsKDGZpeGVkX2xlbmd0aBgPIAEoCDoFZmFsc2USGgoLZml4ZWRfY291bnQYECABKAg6BWZhbHNlEh4KD3N1Ym1zZ19jYWxsYmFjaxgWIAEoCDoFZmFsc2USLwoMbWFuZ2xlX25hbWVzGBEgASgOMhEuVHlwZW5hbWVNYW5nbGluZzoGTV9OT05FEigKEWNhbGxiYWNrX2RhdGF0eXBlGBIgASgJOg1wYl9jYWxsYmFja190EjQKEWNhbGxiYWNrX2Z1bmN0aW9uGBMgASgJOhlwYl9kZWZhdWx0X2ZpZWxkX2NhbGxiYWNrEjAKDmRlc2NyaXB0b3JzaXplGBQgASgOMg8uRGVzY3JpcHRvclNpemU6B0RTX0FVVE8SGgoLZGVmYXVsdF9oYXMYFyABKAg6BWZhbHNlEg8KB2luY2x1ZGUYGCADKAkSDwoHZXhjbHVkZRgaIAMoCRIPCgdwYWNrYWdlGBkgASgJEkEKDXR5cGVfb3ZlcnJpZGUYGyABKA4yKi5nb29nbGUucHJvdG9idWYuRmllbGREZXNjcmlwdG9yUHJvdG8uVHlwZRIZCgtzb3J0X2J5X3RhZxgcIAEoCDoEdHJ1ZRIuCg1mYWxsYmFja190eXBlGB0gASgOMgouRmllbGRUeXBlOgtGVF9DQUxMQkFDSyppCglGaWVsZFR5cGUSDgoKRlRfREVGQVVMVBAAEg8KC0ZUX0NBTExCQUNLEAESDgoKRlRfUE9JTlRFUhAEEg0KCUZUX1NUQVRJQxACEg0KCUZUX0lHTk9SRRADEg0KCUZUX0lOTElORRAFKkQKB0ludFNpemUSDgoKSVNfREVGQVVMVBAAEggKBElTXzgQCBIJCgVJU18xNhAQEgkKBUlTXzMyECASCQoFSVNfNjQQQCpaChBUeXBlbmFtZU1hbmdsaW5nEgoKBk1fTk9ORRAAEhMKD01fU1RSSVBfUEFDS0FHRRABEg0KCU1fRkxBVFRFThACEhYKEk1fUEFDS0FHRV9JTklUSUFMUxADKkUKDkRlc2NyaXB0b3JTaXplEgsKB0RTX0FVVE8QABIICgREU18xEAESCAoERFNfMhACEggKBERTXzQQBBIICgREU184EAg6VAoObmFub3BiX2ZpbGVvcHQSHC5nb29nbGUucHJvdG9idWYuRmlsZU9wdGlvbnMY8gcgASgLMg4uTmFub1BCT3B0aW9uc1INbmFub3BiRmlsZW9wdDpVCg1uYW5vcGJfbXNnb3B0Eh8uZ29vZ2xlLnByb3RvYnVmLk1lc3NhZ2VPcHRpb25zGPIHIAEoCzIOLk5hbm9QQk9wdGlvbnNSDG5hbm9wYk1zZ29wdDpUCg5uYW5vcGJfZW51bW9wdBIcLmdvb2dsZS5wcm90b2J1Zi5FbnVtT3B0aW9ucxjyByABKAsyDi5OYW5vUEJPcHRpb25zUg1uYW5vcGJFbnVtb3B0OkYKBm5hbm9wYhIdLmdvb2dsZS5wcm90b2J1Zi5GaWVsZE9wdGlvbnMY8gcgASgLMg4uTmFub1BCT3B0aW9uc1IGbmFub3BiQj4KGGZpLmthcHNpLmtvdGkuanBhLm5hbm9wYloiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZA", [file_google_protobuf_descriptor]);

//#endregion
//#region lib/meshtastic/mesh_pb.ts
var mesh_pb_exports = /* @__PURE__ */ __export({
	ChunkedPayloadResponseSchema: () => ChunkedPayloadResponseSchema,
	ChunkedPayloadSchema: () => ChunkedPayloadSchema,
	ClientNotificationSchema: () => ClientNotificationSchema,
	CompressedSchema: () => CompressedSchema,
	Constants: () => Constants,
	ConstantsSchema: () => ConstantsSchema,
	CriticalErrorCode: () => CriticalErrorCode,
	CriticalErrorCodeSchema: () => CriticalErrorCodeSchema,
	DataSchema: () => DataSchema,
	DeviceMetadataSchema: () => DeviceMetadataSchema,
	DuplicatedPublicKeySchema: () => DuplicatedPublicKeySchema,
	ExcludedModules: () => ExcludedModules,
	ExcludedModulesSchema: () => ExcludedModulesSchema,
	FileInfoSchema: () => FileInfoSchema,
	FirmwareEdition: () => FirmwareEdition,
	FirmwareEditionSchema: () => FirmwareEditionSchema,
	FromRadioSchema: () => FromRadioSchema,
	HardwareModel: () => HardwareModel,
	HardwareModelSchema: () => HardwareModelSchema,
	HeartbeatSchema: () => HeartbeatSchema,
	KeyVerificationFinalSchema: () => KeyVerificationFinalSchema,
	KeyVerificationNumberInformSchema: () => KeyVerificationNumberInformSchema,
	KeyVerificationNumberRequestSchema: () => KeyVerificationNumberRequestSchema,
	KeyVerificationSchema: () => KeyVerificationSchema,
	LogRecordSchema: () => LogRecordSchema,
	LogRecord_Level: () => LogRecord_Level,
	LogRecord_LevelSchema: () => LogRecord_LevelSchema,
	LowEntropyKeySchema: () => LowEntropyKeySchema,
	MeshPacketSchema: () => MeshPacketSchema,
	MeshPacket_Delayed: () => MeshPacket_Delayed,
	MeshPacket_DelayedSchema: () => MeshPacket_DelayedSchema,
	MeshPacket_Priority: () => MeshPacket_Priority,
	MeshPacket_PrioritySchema: () => MeshPacket_PrioritySchema,
	MeshPacket_TransportMechanism: () => MeshPacket_TransportMechanism,
	MeshPacket_TransportMechanismSchema: () => MeshPacket_TransportMechanismSchema,
	MqttClientProxyMessageSchema: () => MqttClientProxyMessageSchema,
	MyNodeInfoSchema: () => MyNodeInfoSchema,
	NeighborInfoSchema: () => NeighborInfoSchema,
	NeighborSchema: () => NeighborSchema,
	NodeInfoSchema: () => NodeInfoSchema,
	NodeRemoteHardwarePinSchema: () => NodeRemoteHardwarePinSchema,
	PositionSchema: () => PositionSchema,
	Position_AltSource: () => Position_AltSource,
	Position_AltSourceSchema: () => Position_AltSourceSchema,
	Position_LocSource: () => Position_LocSource,
	Position_LocSourceSchema: () => Position_LocSourceSchema,
	QueueStatusSchema: () => QueueStatusSchema,
	RouteDiscoverySchema: () => RouteDiscoverySchema,
	RoutingSchema: () => RoutingSchema,
	Routing_Error: () => Routing_Error,
	Routing_ErrorSchema: () => Routing_ErrorSchema,
	ToRadioSchema: () => ToRadioSchema,
	UserSchema: () => UserSchema,
	WaypointSchema: () => WaypointSchema,
	file_meshtastic_mesh: () => file_meshtastic_mesh,
	resend_chunksSchema: () => resend_chunksSchema
});
/**
* Describes the file meshtastic/mesh.proto.
*/
const file_meshtastic_mesh = /* @__PURE__ */ fileDesc("ChVtZXNodGFzdGljL21lc2gucHJvdG8SCm1lc2h0YXN0aWMihwcKCFBvc2l0aW9uEhcKCmxhdGl0dWRlX2kYASABKA9IAIgBARIYCgtsb25naXR1ZGVfaRgCIAEoD0gBiAEBEhUKCGFsdGl0dWRlGAMgASgFSAKIAQESDAoEdGltZRgEIAEoBxI3Cg9sb2NhdGlvbl9zb3VyY2UYBSABKA4yHi5tZXNodGFzdGljLlBvc2l0aW9uLkxvY1NvdXJjZRI3Cg9hbHRpdHVkZV9zb3VyY2UYBiABKA4yHi5tZXNodGFzdGljLlBvc2l0aW9uLkFsdFNvdXJjZRIRCgl0aW1lc3RhbXAYByABKAcSHwoXdGltZXN0YW1wX21pbGxpc19hZGp1c3QYCCABKAUSGQoMYWx0aXR1ZGVfaGFlGAkgASgRSAOIAQESKAobYWx0aXR1ZGVfZ2VvaWRhbF9zZXBhcmF0aW9uGAogASgRSASIAQESDAoEUERPUBgLIAEoDRIMCgRIRE9QGAwgASgNEgwKBFZET1AYDSABKA0SFAoMZ3BzX2FjY3VyYWN5GA4gASgNEhkKDGdyb3VuZF9zcGVlZBgPIAEoDUgFiAEBEhkKDGdyb3VuZF90cmFjaxgQIAEoDUgGiAEBEhMKC2ZpeF9xdWFsaXR5GBEgASgNEhAKCGZpeF90eXBlGBIgASgNEhQKDHNhdHNfaW5fdmlldxgTIAEoDRIRCglzZW5zb3JfaWQYFCABKA0SEwoLbmV4dF91cGRhdGUYFSABKA0SEgoKc2VxX251bWJlchgWIAEoDRIWCg5wcmVjaXNpb25fYml0cxgXIAEoDSJOCglMb2NTb3VyY2USDQoJTE9DX1VOU0VUEAASDgoKTE9DX01BTlVBTBABEhAKDExPQ19JTlRFUk5BTBACEhAKDExPQ19FWFRFUk5BTBADImIKCUFsdFNvdXJjZRINCglBTFRfVU5TRVQQABIOCgpBTFRfTUFOVUFMEAESEAoMQUxUX0lOVEVSTkFMEAISEAoMQUxUX0VYVEVSTkFMEAMSEgoOQUxUX0JBUk9NRVRSSUMQBEINCgtfbGF0aXR1ZGVfaUIOCgxfbG9uZ2l0dWRlX2lCCwoJX2FsdGl0dWRlQg8KDV9hbHRpdHVkZV9oYWVCHgocX2FsdGl0dWRlX2dlb2lkYWxfc2VwYXJhdGlvbkIPCg1fZ3JvdW5kX3NwZWVkQg8KDV9ncm91bmRfdHJhY2sirQIKBFVzZXISEQoCaWQYASABKAlCBZI/AggQEhgKCWxvbmdfbmFtZRgCIAEoCUIFkj8CCCgSGQoKc2hvcnRfbmFtZRgDIAEoCUIFkj8CCAUSGgoHbWFjYWRkchgEIAEoDEIJGAGSPwQIBngBEisKCGh3X21vZGVsGAUgASgOMhkubWVzaHRhc3RpYy5IYXJkd2FyZU1vZGVsEhMKC2lzX2xpY2Vuc2VkGAYgASgIEjIKBHJvbGUYByABKA4yJC5tZXNodGFzdGljLkNvbmZpZy5EZXZpY2VDb25maWcuUm9sZRIZCgpwdWJsaWNfa2V5GAggASgMQgWSPwIIIBIcCg9pc191bm1lc3NhZ2FibGUYCSABKAhIAIgBAUISChBfaXNfdW5tZXNzYWdhYmxlInoKDlJvdXRlRGlzY292ZXJ5EhQKBXJvdXRlGAEgAygHQgWSPwIQCBIcCgtzbnJfdG93YXJkcxgCIAMoBUIHkj8EEAg4CBIZCgpyb3V0ZV9iYWNrGAMgAygHQgWSPwIQCBIZCghzbnJfYmFjaxgEIAMoBUIHkj8EEAg4CCKQBAoHUm91dGluZxI6Cg1yb3V0ZV9yZXF1ZXN0GAEgASgLMhoubWVzaHRhc3RpYy5Sb3V0ZURpc2NvdmVyeUIFkj8CWAFIABI4Cgtyb3V0ZV9yZXBseRgCIAEoCzIaLm1lc2h0YXN0aWMuUm91dGVEaXNjb3ZlcnlCBZI/AlgBSAASOAoMZXJyb3JfcmVhc29uGAMgASgOMhkubWVzaHRhc3RpYy5Sb3V0aW5nLkVycm9yQgWSPwJYAUgAIskCCgVFcnJvchIICgROT05FEAASDAoITk9fUk9VVEUQARILCgdHT1RfTkFLEAISCwoHVElNRU9VVBADEhAKDE5PX0lOVEVSRkFDRRAEEhIKDk1BWF9SRVRSQU5TTUlUEAUSDgoKTk9fQ0hBTk5FTBAGEg0KCVRPT19MQVJHRRAHEg8KC05PX1JFU1BPTlNFEAgSFAoQRFVUWV9DWUNMRV9MSU1JVBAJEg8KC0JBRF9SRVFVRVNUECASEgoOTk9UX0FVVEhPUklaRUQQIRIOCgpQS0lfRkFJTEVEECISFgoSUEtJX1VOS05PV05fUFVCS0VZECMSGQoVQURNSU5fQkFEX1NFU1NJT05fS0VZECQSIQodQURNSU5fUFVCTElDX0tFWV9VTkFVVEhPUklaRUQQJRIXChNSQVRFX0xJTUlUX0VYQ0VFREVEECZCCQoHdmFyaWFudCLaAQoERGF0YRIkCgdwb3J0bnVtGAEgASgOMhMubWVzaHRhc3RpYy5Qb3J0TnVtEhcKB3BheWxvYWQYAiABKAxCBpI/AwjpARIVCg13YW50X3Jlc3BvbnNlGAMgASgIEgwKBGRlc3QYBCABKAcSDgoGc291cmNlGAUgASgHEhIKCnJlcXVlc3RfaWQYBiABKAcSEAoIcmVwbHlfaWQYByABKAcSDQoFZW1vamkYCCABKAcSHAoIYml0ZmllbGQYCSABKA1CBZI/AjgISACIAQFCCwoJX2JpdGZpZWxkIkwKD0tleVZlcmlmaWNhdGlvbhINCgVub25jZRgBIAEoBBIUCgVoYXNoMRgCIAEoDEIFkj8CCCASFAoFaGFzaDIYAyABKAxCBZI/AgggIsoBCghXYXlwb2ludBIKCgJpZBgBIAEoDRIXCgpsYXRpdHVkZV9pGAIgASgPSACIAQESGAoLbG9uZ2l0dWRlX2kYAyABKA9IAYgBARIOCgZleHBpcmUYBCABKA0SEQoJbG9ja2VkX3RvGAUgASgNEhMKBG5hbWUYBiABKAlCBZI/AggeEhoKC2Rlc2NyaXB0aW9uGAcgASgJQgWSPwIIZBIMCgRpY29uGAggASgHQg0KC19sYXRpdHVkZV9pQg4KDF9sb25naXR1ZGVfaSKHAQoWTXF0dENsaWVudFByb3h5TWVzc2FnZRIUCgV0b3BpYxgBIAEoCUIFkj8CCDwSGAoEZGF0YRgCIAEoDEIIkj8FCLMDWAFIABIYCgR0ZXh0GAMgASgJQgiSPwUIswNYAUgAEhAKCHJldGFpbmVkGAQgASgIQhEKD3BheWxvYWRfdmFyaWFudCLpBwoKTWVzaFBhY2tldBIMCgRmcm9tGAEgASgHEgoKAnRvGAIgASgHEhYKB2NoYW5uZWwYAyABKA1CBZI/AjgIEioKB2RlY29kZWQYBCABKAsyEC5tZXNodGFzdGljLkRhdGFCBZI/AlgBSAASHQoJZW5jcnlwdGVkGAUgASgMQgiSPwUIgAJYAUgAEgoKAmlkGAYgASgHEg8KB3J4X3RpbWUYByABKAcSDgoGcnhfc25yGAggASgCEhgKCWhvcF9saW1pdBgJIAEoDUIFkj8COAgSEAoId2FudF9hY2sYCiABKAgSMQoIcHJpb3JpdHkYCyABKA4yHy5tZXNodGFzdGljLk1lc2hQYWNrZXQuUHJpb3JpdHkSDwoHcnhfcnNzaRgMIAEoBRIzCgdkZWxheWVkGA0gASgOMh4ubWVzaHRhc3RpYy5NZXNoUGFja2V0LkRlbGF5ZWRCAhgBEhAKCHZpYV9tcXR0GA4gASgIEhgKCWhvcF9zdGFydBgPIAEoDUIFkj8COAgSEgoKcHVibGljX2tleRgQIAEoDBIVCg1wa2lfZW5jcnlwdGVkGBEgASgIEhcKCG5leHRfaG9wGBIgASgNQgWSPwI4CBIZCgpyZWxheV9ub2RlGBMgASgNQgWSPwI4CBIQCgh0eF9hZnRlchgUIAEoDRJGChN0cmFuc3BvcnRfbWVjaGFuaXNtGBUgASgOMikubWVzaHRhc3RpYy5NZXNoUGFja2V0LlRyYW5zcG9ydE1lY2hhbmlzbSJ+CghQcmlvcml0eRIJCgVVTlNFVBAAEgcKA01JThABEg4KCkJBQ0tHUk9VTkQQChILCgdERUZBVUxUEEASDAoIUkVMSUFCTEUQRhIMCghSRVNQT05TRRBQEggKBEhJR0gQZBIJCgVBTEVSVBBuEgcKA0FDSxB4EgcKA01BWBB/IkIKB0RlbGF5ZWQSDAoITk9fREVMQVkQABIVChFERUxBWUVEX0JST0FEQ0FTVBABEhIKDkRFTEFZRURfRElSRUNUEAIizwEKElRyYW5zcG9ydE1lY2hhbmlzbRIWChJUUkFOU1BPUlRfSU5URVJOQUwQABISCg5UUkFOU1BPUlRfTE9SQRABEhcKE1RSQU5TUE9SVF9MT1JBX0FMVDEQAhIXChNUUkFOU1BPUlRfTE9SQV9BTFQyEAMSFwoTVFJBTlNQT1JUX0xPUkFfQUxUMxAEEhIKDlRSQU5TUE9SVF9NUVRUEAUSGwoXVFJBTlNQT1JUX01VTFRJQ0FTVF9VRFAQBhIRCg1UUkFOU1BPUlRfQVBJEAdCEQoPcGF5bG9hZF92YXJpYW50ItUCCghOb2RlSW5mbxILCgNudW0YASABKA0SHgoEdXNlchgCIAEoCzIQLm1lc2h0YXN0aWMuVXNlchImCghwb3NpdGlvbhgDIAEoCzIULm1lc2h0YXN0aWMuUG9zaXRpb24SCwoDc25yGAQgASgCEhIKCmxhc3RfaGVhcmQYBSABKAcSMQoOZGV2aWNlX21ldHJpY3MYBiABKAsyGS5tZXNodGFzdGljLkRldmljZU1ldHJpY3MSFgoHY2hhbm5lbBgHIAEoDUIFkj8COAgSEAoIdmlhX21xdHQYCCABKAgSHQoJaG9wc19hd2F5GAkgASgNQgWSPwI4CEgAiAEBEhMKC2lzX2Zhdm9yaXRlGAogASgIEhIKCmlzX2lnbm9yZWQYCyABKAgSIAoYaXNfa2V5X21hbnVhbGx5X3ZlcmlmaWVkGAwgASgIQgwKCl9ob3BzX2F3YXki3QEKCk15Tm9kZUluZm8SEwoLbXlfbm9kZV9udW0YASABKA0SFAoMcmVib290X2NvdW50GAggASgNEhcKD21pbl9hcHBfdmVyc2lvbhgLIAEoDRIYCglkZXZpY2VfaWQYDCABKAxCBZI/AggQEhYKB3Bpb19lbnYYDSABKAlCBZI/AggoEjwKEGZpcm13YXJlX2VkaXRpb24YDiABKA4yGy5tZXNodGFzdGljLkZpcm13YXJlRWRpdGlvbkIFkj8COAgSGwoMbm9kZWRiX2NvdW50GA8gASgNQgWSPwI4ECLPAQoJTG9nUmVjb3JkEhcKB21lc3NhZ2UYASABKAlCBpI/AwiAAxIMCgR0aW1lGAIgASgHEhUKBnNvdXJjZRgDIAEoCUIFkj8CCCASKgoFbGV2ZWwYBCABKA4yGy5tZXNodGFzdGljLkxvZ1JlY29yZC5MZXZlbCJYCgVMZXZlbBIJCgVVTlNFVBAAEgwKCENSSVRJQ0FMEDISCQoFRVJST1IQKBILCgdXQVJOSU5HEB4SCAoESU5GTxAUEgkKBURFQlVHEAoSCQoFVFJBQ0UQBSJlCgtRdWV1ZVN0YXR1cxISCgNyZXMYASABKAVCBZI/AjgIEhMKBGZyZWUYAiABKA1CBZI/AjgIEhUKBm1heGxlbhgDIAEoDUIFkj8COAgSFgoObWVzaF9wYWNrZXRfaWQYBCABKA0i6QYKCUZyb21SYWRpbxIKCgJpZBgBIAEoDRIvCgZwYWNrZXQYAiABKAsyFi5tZXNodGFzdGljLk1lc2hQYWNrZXRCBZI/AlgBSAASMAoHbXlfaW5mbxgDIAEoCzIWLm1lc2h0YXN0aWMuTXlOb2RlSW5mb0IFkj8CWAFIABIwCglub2RlX2luZm8YBCABKAsyFC5tZXNodGFzdGljLk5vZGVJbmZvQgWSPwJYAUgAEisKBmNvbmZpZxgFIAEoCzISLm1lc2h0YXN0aWMuQ29uZmlnQgWSPwJYAUgAEjIKCmxvZ19yZWNvcmQYBiABKAsyFS5tZXNodGFzdGljLkxvZ1JlY29yZEIFkj8CWAFIABIjChJjb25maWdfY29tcGxldGVfaWQYByABKA1CBZI/AlgBSAASGQoIcmVib290ZWQYCCABKAhCBZI/AlgBSAASNwoMbW9kdWxlQ29uZmlnGAkgASgLMhgubWVzaHRhc3RpYy5Nb2R1bGVDb25maWdCBZI/AlgBSAASLQoHY2hhbm5lbBgKIAEoCzITLm1lc2h0YXN0aWMuQ2hhbm5lbEIFkj8CWAFIABI1CgtxdWV1ZVN0YXR1cxgLIAEoCzIXLm1lc2h0YXN0aWMuUXVldWVTdGF0dXNCBZI/AlgBSAASMQoMeG1vZGVtUGFja2V0GAwgASgLMhIubWVzaHRhc3RpYy5YTW9kZW1CBZI/AlgBSAASNQoIbWV0YWRhdGEYDSABKAsyGi5tZXNodGFzdGljLkRldmljZU1ldGFkYXRhQgWSPwJYAUgAEksKFm1xdHRDbGllbnRQcm94eU1lc3NhZ2UYDiABKAsyIi5tZXNodGFzdGljLk1xdHRDbGllbnRQcm94eU1lc3NhZ2VCBZI/AlgBSAASLwoIZmlsZUluZm8YDyABKAsyFC5tZXNodGFzdGljLkZpbGVJbmZvQgWSPwJYAUgAEkMKEmNsaWVudE5vdGlmaWNhdGlvbhgQIAEoCzIeLm1lc2h0YXN0aWMuQ2xpZW50Tm90aWZpY2F0aW9uQgWSPwJYAUgAEjsKDmRldmljZXVpQ29uZmlnGBEgASgLMhoubWVzaHRhc3RpYy5EZXZpY2VVSUNvbmZpZ0IFkj8CWAFIAEIRCg9wYXlsb2FkX3ZhcmlhbnQiggQKEkNsaWVudE5vdGlmaWNhdGlvbhIVCghyZXBseV9pZBgBIAEoDUgBiAEBEgwKBHRpbWUYAiABKAcSKgoFbGV2ZWwYAyABKA4yGy5tZXNodGFzdGljLkxvZ1JlY29yZC5MZXZlbBIXCgdtZXNzYWdlGAQgASgJQgaSPwMIkAMSUQoea2V5X3ZlcmlmaWNhdGlvbl9udW1iZXJfaW5mb3JtGAsgASgLMicubWVzaHRhc3RpYy5LZXlWZXJpZmljYXRpb25OdW1iZXJJbmZvcm1IABJTCh9rZXlfdmVyaWZpY2F0aW9uX251bWJlcl9yZXF1ZXN0GAwgASgLMigubWVzaHRhc3RpYy5LZXlWZXJpZmljYXRpb25OdW1iZXJSZXF1ZXN0SAASQgoWa2V5X3ZlcmlmaWNhdGlvbl9maW5hbBgNIAEoCzIgLm1lc2h0YXN0aWMuS2V5VmVyaWZpY2F0aW9uRmluYWxIABJAChVkdXBsaWNhdGVkX3B1YmxpY19rZXkYDiABKAsyHy5tZXNodGFzdGljLkR1cGxpY2F0ZWRQdWJsaWNLZXlIABI0Cg9sb3dfZW50cm9weV9rZXkYDyABKAsyGS5tZXNodGFzdGljLkxvd0VudHJvcHlLZXlIAEIRCg9wYXlsb2FkX3ZhcmlhbnRCCwoJX3JlcGx5X2lkImUKG0tleVZlcmlmaWNhdGlvbk51bWJlckluZm9ybRINCgVub25jZRgBIAEoBBIeCg9yZW1vdGVfbG9uZ25hbWUYAiABKAlCBZI/AggoEhcKD3NlY3VyaXR5X251bWJlchgDIAEoDSJNChxLZXlWZXJpZmljYXRpb25OdW1iZXJSZXF1ZXN0Eg0KBW5vbmNlGAEgASgEEh4KD3JlbW90ZV9sb25nbmFtZRgCIAEoCUIFkj8CCCgifwoUS2V5VmVyaWZpY2F0aW9uRmluYWwSDQoFbm9uY2UYASABKAQSHgoPcmVtb3RlX2xvbmduYW1lGAIgASgJQgWSPwIIKBIQCghpc1NlbmRlchgDIAEoCBImChd2ZXJpZmljYXRpb25fY2hhcmFjdGVycxgEIAEoCUIFkj8CCAoiFQoTRHVwbGljYXRlZFB1YmxpY0tleSIPCg1Mb3dFbnRyb3B5S2V5IjkKCEZpbGVJbmZvEhkKCWZpbGVfbmFtZRgBIAEoCUIGkj8DCOQBEhIKCnNpemVfYnl0ZXMYAiABKA0ivgIKB1RvUmFkaW8SLwoGcGFja2V0GAEgASgLMhYubWVzaHRhc3RpYy5NZXNoUGFja2V0QgWSPwJYAUgAEh8KDndhbnRfY29uZmlnX2lkGAMgASgNQgWSPwJYAUgAEhsKCmRpc2Nvbm5lY3QYBCABKAhCBZI/AlgBSAASMQoMeG1vZGVtUGFja2V0GAUgASgLMhIubWVzaHRhc3RpYy5YTW9kZW1CBZI/AlgBSAASSwoWbXF0dENsaWVudFByb3h5TWVzc2FnZRgGIAEoCzIiLm1lc2h0YXN0aWMuTXF0dENsaWVudFByb3h5TWVzc2FnZUIFkj8CWAFIABIxCgloZWFydGJlYXQYByABKAsyFS5tZXNodGFzdGljLkhlYXJ0YmVhdEIFkj8CWAFIAEIRCg9wYXlsb2FkX3ZhcmlhbnQiSAoKQ29tcHJlc3NlZBIkCgdwb3J0bnVtGAEgASgOMhMubWVzaHRhc3RpYy5Qb3J0TnVtEhQKBGRhdGEYAiABKAxCBpI/AwjpASKOAQoMTmVpZ2hib3JJbmZvEg8KB25vZGVfaWQYASABKA0SFwoPbGFzdF9zZW50X2J5X2lkGAIgASgNEiQKHG5vZGVfYnJvYWRjYXN0X2ludGVydmFsX3NlY3MYAyABKA0SLgoJbmVpZ2hib3JzGAQgAygLMhQubWVzaHRhc3RpYy5OZWlnaGJvckIFkj8CEAoiZAoITmVpZ2hib3ISDwoHbm9kZV9pZBgBIAEoDRILCgNzbnIYAiABKAISFAoMbGFzdF9yeF90aW1lGAMgASgHEiQKHG5vZGVfYnJvYWRjYXN0X2ludGVydmFsX3NlY3MYBCABKA0i3gIKDkRldmljZU1ldGFkYXRhEh8KEGZpcm13YXJlX3ZlcnNpb24YASABKAlCBZI/AggSEhwKFGRldmljZV9zdGF0ZV92ZXJzaW9uGAIgASgNEhMKC2NhblNodXRkb3duGAMgASgIEg8KB2hhc1dpZmkYBCABKAgSFAoMaGFzQmx1ZXRvb3RoGAUgASgIEhMKC2hhc0V0aGVybmV0GAYgASgIEjIKBHJvbGUYByABKA4yJC5tZXNodGFzdGljLkNvbmZpZy5EZXZpY2VDb25maWcuUm9sZRIWCg5wb3NpdGlvbl9mbGFncxgIIAEoDRIrCghod19tb2RlbBgJIAEoDjIZLm1lc2h0YXN0aWMuSGFyZHdhcmVNb2RlbBIZChFoYXNSZW1vdGVIYXJkd2FyZRgKIAEoCBIOCgZoYXNQS0MYCyABKAgSGAoQZXhjbHVkZWRfbW9kdWxlcxgMIAEoDSIaCglIZWFydGJlYXQSDQoFbm9uY2UYASABKA0iVQoVTm9kZVJlbW90ZUhhcmR3YXJlUGluEhAKCG5vZGVfbnVtGAEgASgNEioKA3BpbhgCIAEoCzIdLm1lc2h0YXN0aWMuUmVtb3RlSGFyZHdhcmVQaW4iewoOQ2h1bmtlZFBheWxvYWQSEgoKcGF5bG9hZF9pZBgBIAEoDRIaCgtjaHVua19jb3VudBgCIAEoDUIFkj8COBASGgoLY2h1bmtfaW5kZXgYAyABKA1CBZI/AjgQEh0KDXBheWxvYWRfY2h1bmsYBCABKAxCBpI/AwjkASIfCg1yZXNlbmRfY2h1bmtzEg4KBmNodW5rcxgBIAMoDSKqAQoWQ2h1bmtlZFBheWxvYWRSZXNwb25zZRISCgpwYXlsb2FkX2lkGAEgASgNEhoKEHJlcXVlc3RfdHJhbnNmZXIYAiABKAhIABIZCg9hY2NlcHRfdHJhbnNmZXIYAyABKAhIABIyCg1yZXNlbmRfY2h1bmtzGAQgASgLMhkubWVzaHRhc3RpYy5yZXNlbmRfY2h1bmtzSABCEQoPcGF5bG9hZF92YXJpYW50KuIRCg1IYXJkd2FyZU1vZGVsEgkKBVVOU0VUEAASDAoIVExPUkFfVjIQARIMCghUTE9SQV9WMRACEhIKDlRMT1JBX1YyXzFfMVA2EAMSCQoFVEJFQU0QBBIPCgtIRUxURUNfVjJfMBAFEg4KClRCRUFNX1YwUDcQBhIKCgZUX0VDSE8QBxIQCgxUTE9SQV9WMV8xUDMQCBILCgdSQUs0NjMxEAkSDwoLSEVMVEVDX1YyXzEQChINCglIRUxURUNfVjEQCxIYChRMSUxZR09fVEJFQU1fUzNfQ09SRRAMEgwKCFJBSzExMjAwEA0SCwoHTkFOT19HMRAOEhIKDlRMT1JBX1YyXzFfMVA4EA8SDwoLVExPUkFfVDNfUzMQEBIUChBOQU5PX0cxX0VYUExPUkVSEBESEQoNTkFOT19HMl9VTFRSQRASEg0KCUxPUkFfVFlQRRATEgsKB1dJUEhPTkUQFBIOCgpXSU9fV00xMTEwEBUSCwoHUkFLMjU2MBAWEhMKD0hFTFRFQ19IUlVfMzYwMRAXEhoKFkhFTFRFQ19XSVJFTEVTU19CUklER0UQGBIOCgpTVEFUSU9OX0cxEBkSDAoIUkFLMTEzMTAQGhIUChBTRU5TRUxPUkFfUlAyMDQwEBsSEAoMU0VOU0VMT1JBX1MzEBwSDQoJQ0FOQVJZT05FEB0SDwoLUlAyMDQwX0xPUkEQHhIOCgpTVEFUSU9OX0cyEB8SEQoNTE9SQV9SRUxBWV9WMRAgEg4KCk5SRjUyODQwREsQIRIHCgNQUFIQIhIPCgtHRU5JRUJMT0NLUxAjEhEKDU5SRjUyX1VOS05PV04QJBINCglQT1JURFVJTk8QJRIPCgtBTkRST0lEX1NJTRAmEgoKBkRJWV9WMRAnEhUKEU5SRjUyODQwX1BDQTEwMDU5ECgSCgoGRFJfREVWECkSCwoHTTVTVEFDSxAqEg0KCUhFTFRFQ19WMxArEhEKDUhFTFRFQ19XU0xfVjMQLBITCg9CRVRBRlBWXzI0MDBfVFgQLRIXChNCRVRBRlBWXzkwMF9OQU5PX1RYEC4SDAoIUlBJX1BJQ08QLxIbChdIRUxURUNfV0lSRUxFU1NfVFJBQ0tFUhAwEhkKFUhFTFRFQ19XSVJFTEVTU19QQVBFUhAxEgoKBlRfREVDSxAyEg4KClRfV0FUQ0hfUzMQMxIRCg1QSUNPTVBVVEVSX1MzEDQSDwoLSEVMVEVDX0hUNjIQNRISCg5FQllURV9FU1AzMl9TMxA2EhEKDUVTUDMyX1MzX1BJQ08QNxINCglDSEFUVEVSXzIQOBIeChpIRUxURUNfV0lSRUxFU1NfUEFQRVJfVjFfMBA5EiAKHEhFTFRFQ19XSVJFTEVTU19UUkFDS0VSX1YxXzAQOhILCgdVTlBIT05FEDsSDAoIVERfTE9SQUMQPBITCg9DREVCWVRFX0VPUkFfUzMQPRIPCgtUV0NfTUVTSF9WNBA+EhYKEk5SRjUyX1BST01JQ1JPX0RJWRA/Eh8KG1JBRElPTUFTVEVSXzkwMF9CQU5ESVRfTkFOTxBAEhwKGEhFTFRFQ19DQVBTVUxFX1NFTlNPUl9WMxBBEh0KGUhFTFRFQ19WSVNJT05fTUFTVEVSX1QxOTAQQhIdChlIRUxURUNfVklTSU9OX01BU1RFUl9FMjEzEEMSHQoZSEVMVEVDX1ZJU0lPTl9NQVNURVJfRTI5MBBEEhkKFUhFTFRFQ19NRVNIX05PREVfVDExNBBFEhYKElNFTlNFQ0FQX0lORElDQVRPUhBGEhMKD1RSQUNLRVJfVDEwMDBfRRBHEgsKB1JBSzMxNzIQSBIKCgZXSU9fRTUQSRIaChZSQURJT01BU1RFUl85MDBfQkFORElUEEoSEwoPTUUyNUxTMDFfNFkxMFREEEsSGAoUUlAyMDQwX0ZFQVRIRVJfUkZNOTUQTBIVChFNNVNUQUNLX0NPUkVCQVNJQxBNEhEKDU01U1RBQ0tfQ09SRTIQThINCglSUElfUElDTzIQTxISCg5NNVNUQUNLX0NPUkVTMxBQEhEKDVNFRUVEX1hJQU9fUzMQURILCgdNUzI0U0YxEFISDAoIVExPUkFfQzYQUxIPCgtXSVNNRVNIX1RBUBBUEg0KCVJPVVRBU1RJQxBVEgwKCE1FU0hfVEFCEFYSDAoITUVTSExJTksQVxISCg5YSUFPX05SRjUyX0tJVBBYEhAKDFRISU5LTk9ERV9NMRBZEhAKDFRISU5LTk9ERV9NMhBaEg8KC1RfRVRIX0VMSVRFEFsSFQoRSEVMVEVDX1NFTlNPUl9IVUIQXBIaChZSRVNFUlZFRF9GUklFRF9DSElDS0VOEF0SFgoSSEVMVEVDX01FU0hfUE9DS0VUEF4SFAoQU0VFRURfU09MQVJfTk9ERRBfEhgKFE5PTUFEU1RBUl9NRVRFT1JfUFJPEGASDQoJQ1JPV1BBTkVMEGESCwoHTElOS18zMhBiEhgKFFNFRUVEX1dJT19UUkFDS0VSX0wxEGMSHQoZU0VFRURfV0lPX1RSQUNLRVJfTDFfRUlOSxBkEg8KC01VWklfUjFfTkVPEGUSDgoKVF9ERUNLX1BSTxBmEhAKDFRfTE9SQV9QQUdFUhBnEhQKEE01U1RBQ0tfUkVTRVJWRUQQaBIPCgtXSVNNRVNIX1RBRxBpEgsKB1JBSzMzMTIQahIQCgxUSElOS05PREVfTTUQaxIVChFIRUxURUNfTUVTSF9TT0xBUhBsEg8KC1RfRUNIT19MSVRFEG0SDQoJSEVMVEVDX1Y0EG4SDwoLTTVTVEFDS19DNkwQbxIZChVNNVNUQUNLX0NBUkRQVVRFUl9BRFYQcBIeChpIRUxURUNfV0lSRUxFU1NfVFJBQ0tFUl9WMhBxEhEKDVRfV0FUQ0hfVUxUUkEQchIQCgxUSElOS05PREVfTTMQcxISCg5XSVNNRVNIX1RBUF9WMhB0EgsKB1JBSzM0MDEQdRIPCgpQUklWQVRFX0hXEP8BKiwKCUNvbnN0YW50cxIICgRaRVJPEAASFQoQREFUQV9QQVlMT0FEX0xFThDpASq0AgoRQ3JpdGljYWxFcnJvckNvZGUSCAoETk9ORRAAEg8KC1RYX1dBVENIRE9HEAESFAoQU0xFRVBfRU5URVJfV0FJVBACEgwKCE5PX1JBRElPEAMSDwoLVU5TUEVDSUZJRUQQBBIVChFVQkxPWF9VTklUX0ZBSUxFRBAFEg0KCU5PX0FYUDE5MhAGEhkKFUlOVkFMSURfUkFESU9fU0VUVElORxAHEhMKD1RSQU5TTUlUX0ZBSUxFRBAIEgwKCEJST1dOT1VUEAkSEgoOU1gxMjYyX0ZBSUxVUkUQChIRCg1SQURJT19TUElfQlVHEAsSIAocRkxBU0hfQ09SUlVQVElPTl9SRUNPVkVSQUJMRRAMEiIKHkZMQVNIX0NPUlJVUFRJT05fVU5SRUNPVkVSQUJMRRANKn8KD0Zpcm13YXJlRWRpdGlvbhILCgdWQU5JTExBEAASEQoNU01BUlRfQ0lUSVpFThABEg4KCk9QRU5fU0FVQ0UQEBIKCgZERUZDT04QERIPCgtCVVJOSU5HX01BThASEg4KCkhBTVZFTlRJT04QExIPCgtESVlfRURJVElPThB/KoADCg9FeGNsdWRlZE1vZHVsZXMSEQoNRVhDTFVERURfTk9ORRAAEg8KC01RVFRfQ09ORklHEAESEQoNU0VSSUFMX0NPTkZJRxACEhMKD0VYVE5PVElGX0NPTkZJRxAEEhcKE1NUT1JFRk9SV0FSRF9DT05GSUcQCBIUChBSQU5HRVRFU1RfQ09ORklHEBASFAoQVEVMRU1FVFJZX0NPTkZJRxAgEhQKEENBTk5FRE1TR19DT05GSUcQQBIRCgxBVURJT19DT05GSUcQgAESGgoVUkVNT1RFSEFSRFdBUkVfQ09ORklHEIACEhgKE05FSUdIQk9SSU5GT19DT05GSUcQgAQSGwoWQU1CSUVOVExJR0hUSU5HX0NPTkZJRxCACBIbChZERVRFQ1RJT05TRU5TT1JfQ09ORklHEIAQEhYKEVBBWENPVU5URVJfQ09ORklHEIAgEhUKEEJMVUVUT09USF9DT05GSUcQgEASFAoOTkVUV09SS19DT05GSUcQgIABQmAKFG9yZy5tZXNodGFzdGljLnByb3RvQgpNZXNoUHJvdG9zWiJnaXRodWIuY29tL21lc2h0YXN0aWMvZ28vZ2VuZXJhdGVkqgIUTWVzaHRhc3RpYy5Qcm90b2J1ZnO6AgBiBnByb3RvMw", [
	file_meshtastic_channel,
	file_meshtastic_config,
	file_meshtastic_device_ui,
	file_meshtastic_module_config,
	file_meshtastic_portnums,
	file_meshtastic_telemetry,
	file_meshtastic_xmodem,
	file_nanopb
]);
/**
* Describes the message meshtastic.Position.
* Use `create(PositionSchema)` to create a new message.
*/
const PositionSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 0);
/**
*
* How the location was acquired: manual, onboard GPS, external (EUD) GPS
*
* @generated from enum meshtastic.Position.LocSource
*/
let Position_LocSource = /* @__PURE__ */ function(Position_LocSource$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: LOC_UNSET = 0;
	*/
	Position_LocSource$1[Position_LocSource$1["LOC_UNSET"] = 0] = "LOC_UNSET";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: LOC_MANUAL = 1;
	*/
	Position_LocSource$1[Position_LocSource$1["LOC_MANUAL"] = 1] = "LOC_MANUAL";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: LOC_INTERNAL = 2;
	*/
	Position_LocSource$1[Position_LocSource$1["LOC_INTERNAL"] = 2] = "LOC_INTERNAL";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: LOC_EXTERNAL = 3;
	*/
	Position_LocSource$1[Position_LocSource$1["LOC_EXTERNAL"] = 3] = "LOC_EXTERNAL";
	return Position_LocSource$1;
}({});
/**
* Describes the enum meshtastic.Position.LocSource.
*/
const Position_LocSourceSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 0, 0);
/**
*
* How the altitude was acquired: manual, GPS int/ext, etc
* Default: same as location_source if present
*
* @generated from enum meshtastic.Position.AltSource
*/
let Position_AltSource = /* @__PURE__ */ function(Position_AltSource$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: ALT_UNSET = 0;
	*/
	Position_AltSource$1[Position_AltSource$1["ALT_UNSET"] = 0] = "ALT_UNSET";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: ALT_MANUAL = 1;
	*/
	Position_AltSource$1[Position_AltSource$1["ALT_MANUAL"] = 1] = "ALT_MANUAL";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: ALT_INTERNAL = 2;
	*/
	Position_AltSource$1[Position_AltSource$1["ALT_INTERNAL"] = 2] = "ALT_INTERNAL";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: ALT_EXTERNAL = 3;
	*/
	Position_AltSource$1[Position_AltSource$1["ALT_EXTERNAL"] = 3] = "ALT_EXTERNAL";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: ALT_BAROMETRIC = 4;
	*/
	Position_AltSource$1[Position_AltSource$1["ALT_BAROMETRIC"] = 4] = "ALT_BAROMETRIC";
	return Position_AltSource$1;
}({});
/**
* Describes the enum meshtastic.Position.AltSource.
*/
const Position_AltSourceSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 0, 1);
/**
* Describes the message meshtastic.User.
* Use `create(UserSchema)` to create a new message.
*/
const UserSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 1);
/**
* Describes the message meshtastic.RouteDiscovery.
* Use `create(RouteDiscoverySchema)` to create a new message.
*/
const RouteDiscoverySchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 2);
/**
* Describes the message meshtastic.Routing.
* Use `create(RoutingSchema)` to create a new message.
*/
const RoutingSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 3);
/**
*
* A failure in delivering a message (usually used for routing control messages, but might be provided in addition to ack.fail_id to provide
* details on the type of failure).
*
* @generated from enum meshtastic.Routing.Error
*/
let Routing_Error = /* @__PURE__ */ function(Routing_Error$1) {
	/**
	*
	* This message is not a failure
	*
	* @generated from enum value: NONE = 0;
	*/
	Routing_Error$1[Routing_Error$1["NONE"] = 0] = "NONE";
	/**
	*
	* Our node doesn't have a route to the requested destination anymore.
	*
	* @generated from enum value: NO_ROUTE = 1;
	*/
	Routing_Error$1[Routing_Error$1["NO_ROUTE"] = 1] = "NO_ROUTE";
	/**
	*
	* We received a nak while trying to forward on your behalf
	*
	* @generated from enum value: GOT_NAK = 2;
	*/
	Routing_Error$1[Routing_Error$1["GOT_NAK"] = 2] = "GOT_NAK";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TIMEOUT = 3;
	*/
	Routing_Error$1[Routing_Error$1["TIMEOUT"] = 3] = "TIMEOUT";
	/**
	*
	* No suitable interface could be found for delivering this packet
	*
	* @generated from enum value: NO_INTERFACE = 4;
	*/
	Routing_Error$1[Routing_Error$1["NO_INTERFACE"] = 4] = "NO_INTERFACE";
	/**
	*
	* We reached the max retransmission count (typically for naive flood routing)
	*
	* @generated from enum value: MAX_RETRANSMIT = 5;
	*/
	Routing_Error$1[Routing_Error$1["MAX_RETRANSMIT"] = 5] = "MAX_RETRANSMIT";
	/**
	*
	* No suitable channel was found for sending this packet (i.e. was requested channel index disabled?)
	*
	* @generated from enum value: NO_CHANNEL = 6;
	*/
	Routing_Error$1[Routing_Error$1["NO_CHANNEL"] = 6] = "NO_CHANNEL";
	/**
	*
	* The packet was too big for sending (exceeds interface MTU after encoding)
	*
	* @generated from enum value: TOO_LARGE = 7;
	*/
	Routing_Error$1[Routing_Error$1["TOO_LARGE"] = 7] = "TOO_LARGE";
	/**
	*
	* The request had want_response set, the request reached the destination node, but no service on that node wants to send a response
	* (possibly due to bad channel permissions)
	*
	* @generated from enum value: NO_RESPONSE = 8;
	*/
	Routing_Error$1[Routing_Error$1["NO_RESPONSE"] = 8] = "NO_RESPONSE";
	/**
	*
	* Cannot send currently because duty cycle regulations will be violated.
	*
	* @generated from enum value: DUTY_CYCLE_LIMIT = 9;
	*/
	Routing_Error$1[Routing_Error$1["DUTY_CYCLE_LIMIT"] = 9] = "DUTY_CYCLE_LIMIT";
	/**
	*
	* The application layer service on the remote node received your request, but considered your request somehow invalid
	*
	* @generated from enum value: BAD_REQUEST = 32;
	*/
	Routing_Error$1[Routing_Error$1["BAD_REQUEST"] = 32] = "BAD_REQUEST";
	/**
	*
	* The application layer service on the remote node received your request, but considered your request not authorized
	* (i.e you did not send the request on the required bound channel)
	*
	* @generated from enum value: NOT_AUTHORIZED = 33;
	*/
	Routing_Error$1[Routing_Error$1["NOT_AUTHORIZED"] = 33] = "NOT_AUTHORIZED";
	/**
	*
	* The client specified a PKI transport, but the node was unable to send the packet using PKI (and did not send the message at all)
	*
	* @generated from enum value: PKI_FAILED = 34;
	*/
	Routing_Error$1[Routing_Error$1["PKI_FAILED"] = 34] = "PKI_FAILED";
	/**
	*
	* The receiving node does not have a Public Key to decode with
	*
	* @generated from enum value: PKI_UNKNOWN_PUBKEY = 35;
	*/
	Routing_Error$1[Routing_Error$1["PKI_UNKNOWN_PUBKEY"] = 35] = "PKI_UNKNOWN_PUBKEY";
	/**
	*
	* Admin packet otherwise checks out, but uses a bogus or expired session key
	*
	* @generated from enum value: ADMIN_BAD_SESSION_KEY = 36;
	*/
	Routing_Error$1[Routing_Error$1["ADMIN_BAD_SESSION_KEY"] = 36] = "ADMIN_BAD_SESSION_KEY";
	/**
	*
	* Admin packet sent using PKC, but not from a public key on the admin key list
	*
	* @generated from enum value: ADMIN_PUBLIC_KEY_UNAUTHORIZED = 37;
	*/
	Routing_Error$1[Routing_Error$1["ADMIN_PUBLIC_KEY_UNAUTHORIZED"] = 37] = "ADMIN_PUBLIC_KEY_UNAUTHORIZED";
	/**
	*
	* Airtime fairness rate limit exceeded for a packet
	* This typically enforced per portnum and is used to prevent a single node from monopolizing airtime
	*
	* @generated from enum value: RATE_LIMIT_EXCEEDED = 38;
	*/
	Routing_Error$1[Routing_Error$1["RATE_LIMIT_EXCEEDED"] = 38] = "RATE_LIMIT_EXCEEDED";
	return Routing_Error$1;
}({});
/**
* Describes the enum meshtastic.Routing.Error.
*/
const Routing_ErrorSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 3, 0);
/**
* Describes the message meshtastic.Data.
* Use `create(DataSchema)` to create a new message.
*/
const DataSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 4);
/**
* Describes the message meshtastic.KeyVerification.
* Use `create(KeyVerificationSchema)` to create a new message.
*/
const KeyVerificationSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 5);
/**
* Describes the message meshtastic.Waypoint.
* Use `create(WaypointSchema)` to create a new message.
*/
const WaypointSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 6);
/**
* Describes the message meshtastic.MqttClientProxyMessage.
* Use `create(MqttClientProxyMessageSchema)` to create a new message.
*/
const MqttClientProxyMessageSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 7);
/**
* Describes the message meshtastic.MeshPacket.
* Use `create(MeshPacketSchema)` to create a new message.
*/
const MeshPacketSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 8);
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
let MeshPacket_Priority = /* @__PURE__ */ function(MeshPacket_Priority$1) {
	/**
	*
	* Treated as Priority.DEFAULT
	*
	* @generated from enum value: UNSET = 0;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: MIN = 1;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["MIN"] = 1] = "MIN";
	/**
	*
	* Background position updates are sent with very low priority -
	* if the link is super congested they might not go out at all
	*
	* @generated from enum value: BACKGROUND = 10;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["BACKGROUND"] = 10] = "BACKGROUND";
	/**
	*
	* This priority is used for most messages that don't have a priority set
	*
	* @generated from enum value: DEFAULT = 64;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["DEFAULT"] = 64] = "DEFAULT";
	/**
	*
	* If priority is unset but the message is marked as want_ack,
	* assume it is important and use a slightly higher priority
	*
	* @generated from enum value: RELIABLE = 70;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["RELIABLE"] = 70] = "RELIABLE";
	/**
	*
	* If priority is unset but the packet is a response to a request, we want it to get there relatively quickly.
	* Furthermore, responses stop relaying packets directed to a node early.
	*
	* @generated from enum value: RESPONSE = 80;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["RESPONSE"] = 80] = "RESPONSE";
	/**
	*
	* Higher priority for specific message types (portnums) to distinguish between other reliable packets.
	*
	* @generated from enum value: HIGH = 100;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["HIGH"] = 100] = "HIGH";
	/**
	*
	* Higher priority alert message used for critical alerts which take priority over other reliable packets.
	*
	* @generated from enum value: ALERT = 110;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["ALERT"] = 110] = "ALERT";
	/**
	*
	* Ack/naks are sent with very high priority to ensure that retransmission
	* stops as soon as possible
	*
	* @generated from enum value: ACK = 120;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["ACK"] = 120] = "ACK";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: MAX = 127;
	*/
	MeshPacket_Priority$1[MeshPacket_Priority$1["MAX"] = 127] = "MAX";
	return MeshPacket_Priority$1;
}({});
/**
* Describes the enum meshtastic.MeshPacket.Priority.
*/
const MeshPacket_PrioritySchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 8, 0);
/**
*
* Identify if this is a delayed packet
*
* @generated from enum meshtastic.MeshPacket.Delayed
*/
let MeshPacket_Delayed = /* @__PURE__ */ function(MeshPacket_Delayed$1) {
	/**
	*
	* If unset, the message is being sent in real time.
	*
	* @generated from enum value: NO_DELAY = 0;
	*/
	MeshPacket_Delayed$1[MeshPacket_Delayed$1["NO_DELAY"] = 0] = "NO_DELAY";
	/**
	*
	* The message is delayed and was originally a broadcast
	*
	* @generated from enum value: DELAYED_BROADCAST = 1;
	*/
	MeshPacket_Delayed$1[MeshPacket_Delayed$1["DELAYED_BROADCAST"] = 1] = "DELAYED_BROADCAST";
	/**
	*
	* The message is delayed and was originally a direct message
	*
	* @generated from enum value: DELAYED_DIRECT = 2;
	*/
	MeshPacket_Delayed$1[MeshPacket_Delayed$1["DELAYED_DIRECT"] = 2] = "DELAYED_DIRECT";
	return MeshPacket_Delayed$1;
}({});
/**
* Describes the enum meshtastic.MeshPacket.Delayed.
*/
const MeshPacket_DelayedSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 8, 1);
/**
*
* Enum to identify which transport mechanism this packet arrived over
*
* @generated from enum meshtastic.MeshPacket.TransportMechanism
*/
let MeshPacket_TransportMechanism = /* @__PURE__ */ function(MeshPacket_TransportMechanism$1) {
	/**
	*
	* The default case is that the node generated a packet itself
	*
	* @generated from enum value: TRANSPORT_INTERNAL = 0;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_INTERNAL"] = 0] = "TRANSPORT_INTERNAL";
	/**
	*
	* Arrived via the primary LoRa radio
	*
	* @generated from enum value: TRANSPORT_LORA = 1;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_LORA"] = 1] = "TRANSPORT_LORA";
	/**
	*
	* Arrived via a secondary LoRa radio
	*
	* @generated from enum value: TRANSPORT_LORA_ALT1 = 2;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_LORA_ALT1"] = 2] = "TRANSPORT_LORA_ALT1";
	/**
	*
	* Arrived via a tertiary LoRa radio
	*
	* @generated from enum value: TRANSPORT_LORA_ALT2 = 3;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_LORA_ALT2"] = 3] = "TRANSPORT_LORA_ALT2";
	/**
	*
	* Arrived via a quaternary LoRa radio
	*
	* @generated from enum value: TRANSPORT_LORA_ALT3 = 4;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_LORA_ALT3"] = 4] = "TRANSPORT_LORA_ALT3";
	/**
	*
	* Arrived via an MQTT connection
	*
	* @generated from enum value: TRANSPORT_MQTT = 5;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_MQTT"] = 5] = "TRANSPORT_MQTT";
	/**
	*
	* Arrived via Multicast UDP
	*
	* @generated from enum value: TRANSPORT_MULTICAST_UDP = 6;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_MULTICAST_UDP"] = 6] = "TRANSPORT_MULTICAST_UDP";
	/**
	*
	* Arrived via API connection
	*
	* @generated from enum value: TRANSPORT_API = 7;
	*/
	MeshPacket_TransportMechanism$1[MeshPacket_TransportMechanism$1["TRANSPORT_API"] = 7] = "TRANSPORT_API";
	return MeshPacket_TransportMechanism$1;
}({});
/**
* Describes the enum meshtastic.MeshPacket.TransportMechanism.
*/
const MeshPacket_TransportMechanismSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 8, 2);
/**
* Describes the message meshtastic.NodeInfo.
* Use `create(NodeInfoSchema)` to create a new message.
*/
const NodeInfoSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 9);
/**
* Describes the message meshtastic.MyNodeInfo.
* Use `create(MyNodeInfoSchema)` to create a new message.
*/
const MyNodeInfoSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 10);
/**
* Describes the message meshtastic.LogRecord.
* Use `create(LogRecordSchema)` to create a new message.
*/
const LogRecordSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 11);
/**
*
* Log levels, chosen to match python logging conventions.
*
* @generated from enum meshtastic.LogRecord.Level
*/
let LogRecord_Level = /* @__PURE__ */ function(LogRecord_Level$1) {
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: UNSET = 0;
	*/
	LogRecord_Level$1[LogRecord_Level$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: CRITICAL = 50;
	*/
	LogRecord_Level$1[LogRecord_Level$1["CRITICAL"] = 50] = "CRITICAL";
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: ERROR = 40;
	*/
	LogRecord_Level$1[LogRecord_Level$1["ERROR"] = 40] = "ERROR";
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: WARNING = 30;
	*/
	LogRecord_Level$1[LogRecord_Level$1["WARNING"] = 30] = "WARNING";
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: INFO = 20;
	*/
	LogRecord_Level$1[LogRecord_Level$1["INFO"] = 20] = "INFO";
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: DEBUG = 10;
	*/
	LogRecord_Level$1[LogRecord_Level$1["DEBUG"] = 10] = "DEBUG";
	/**
	*
	* Log levels, chosen to match python logging conventions.
	*
	* @generated from enum value: TRACE = 5;
	*/
	LogRecord_Level$1[LogRecord_Level$1["TRACE"] = 5] = "TRACE";
	return LogRecord_Level$1;
}({});
/**
* Describes the enum meshtastic.LogRecord.Level.
*/
const LogRecord_LevelSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 11, 0);
/**
* Describes the message meshtastic.QueueStatus.
* Use `create(QueueStatusSchema)` to create a new message.
*/
const QueueStatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 12);
/**
* Describes the message meshtastic.FromRadio.
* Use `create(FromRadioSchema)` to create a new message.
*/
const FromRadioSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 13);
/**
* Describes the message meshtastic.ClientNotification.
* Use `create(ClientNotificationSchema)` to create a new message.
*/
const ClientNotificationSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 14);
/**
* Describes the message meshtastic.KeyVerificationNumberInform.
* Use `create(KeyVerificationNumberInformSchema)` to create a new message.
*/
const KeyVerificationNumberInformSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 15);
/**
* Describes the message meshtastic.KeyVerificationNumberRequest.
* Use `create(KeyVerificationNumberRequestSchema)` to create a new message.
*/
const KeyVerificationNumberRequestSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 16);
/**
* Describes the message meshtastic.KeyVerificationFinal.
* Use `create(KeyVerificationFinalSchema)` to create a new message.
*/
const KeyVerificationFinalSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 17);
/**
* Describes the message meshtastic.DuplicatedPublicKey.
* Use `create(DuplicatedPublicKeySchema)` to create a new message.
*/
const DuplicatedPublicKeySchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 18);
/**
* Describes the message meshtastic.LowEntropyKey.
* Use `create(LowEntropyKeySchema)` to create a new message.
*/
const LowEntropyKeySchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 19);
/**
* Describes the message meshtastic.FileInfo.
* Use `create(FileInfoSchema)` to create a new message.
*/
const FileInfoSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 20);
/**
* Describes the message meshtastic.ToRadio.
* Use `create(ToRadioSchema)` to create a new message.
*/
const ToRadioSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 21);
/**
* Describes the message meshtastic.Compressed.
* Use `create(CompressedSchema)` to create a new message.
*/
const CompressedSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 22);
/**
* Describes the message meshtastic.NeighborInfo.
* Use `create(NeighborInfoSchema)` to create a new message.
*/
const NeighborInfoSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 23);
/**
* Describes the message meshtastic.Neighbor.
* Use `create(NeighborSchema)` to create a new message.
*/
const NeighborSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 24);
/**
* Describes the message meshtastic.DeviceMetadata.
* Use `create(DeviceMetadataSchema)` to create a new message.
*/
const DeviceMetadataSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 25);
/**
* Describes the message meshtastic.Heartbeat.
* Use `create(HeartbeatSchema)` to create a new message.
*/
const HeartbeatSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 26);
/**
* Describes the message meshtastic.NodeRemoteHardwarePin.
* Use `create(NodeRemoteHardwarePinSchema)` to create a new message.
*/
const NodeRemoteHardwarePinSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 27);
/**
* Describes the message meshtastic.ChunkedPayload.
* Use `create(ChunkedPayloadSchema)` to create a new message.
*/
const ChunkedPayloadSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 28);
/**
* Describes the message meshtastic.resend_chunks.
* Use `create(resend_chunksSchema)` to create a new message.
*/
const resend_chunksSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 29);
/**
* Describes the message meshtastic.ChunkedPayloadResponse.
* Use `create(ChunkedPayloadResponseSchema)` to create a new message.
*/
const ChunkedPayloadResponseSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mesh, 30);
/**
*
* Note: these enum names must EXACTLY match the string used in the device
* bin/build-all.sh script.
* Because they will be used to find firmware filenames in the android app for OTA updates.
* To match the old style filenames, _ is converted to -, p is converted to .
*
* @generated from enum meshtastic.HardwareModel
*/
let HardwareModel = /* @__PURE__ */ function(HardwareModel$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: UNSET = 0;
	*/
	HardwareModel$1[HardwareModel$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TLORA_V2 = 1;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_V2"] = 1] = "TLORA_V2";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TLORA_V1 = 2;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_V1"] = 2] = "TLORA_V1";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TLORA_V2_1_1P6 = 3;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_V2_1_1P6"] = 3] = "TLORA_V2_1_1P6";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TBEAM = 4;
	*/
	HardwareModel$1[HardwareModel$1["TBEAM"] = 4] = "TBEAM";
	/**
	*
	* The original heltec WiFi_Lora_32_V2, which had battery voltage sensing hooked to GPIO 13
	* (see HELTEC_V2 for the new version).
	*
	* @generated from enum value: HELTEC_V2_0 = 5;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_V2_0"] = 5] = "HELTEC_V2_0";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TBEAM_V0P7 = 6;
	*/
	HardwareModel$1[HardwareModel$1["TBEAM_V0P7"] = 6] = "TBEAM_V0P7";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: T_ECHO = 7;
	*/
	HardwareModel$1[HardwareModel$1["T_ECHO"] = 7] = "T_ECHO";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TLORA_V1_1P3 = 8;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_V1_1P3"] = 8] = "TLORA_V1_1P3";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: RAK4631 = 9;
	*/
	HardwareModel$1[HardwareModel$1["RAK4631"] = 9] = "RAK4631";
	/**
	*
	* The new version of the heltec WiFi_Lora_32_V2 board that has battery sensing hooked to GPIO 37.
	* Sadly they did not update anything on the silkscreen to identify this board
	*
	* @generated from enum value: HELTEC_V2_1 = 10;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_V2_1"] = 10] = "HELTEC_V2_1";
	/**
	*
	* Ancient heltec WiFi_Lora_32 board
	*
	* @generated from enum value: HELTEC_V1 = 11;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_V1"] = 11] = "HELTEC_V1";
	/**
	*
	* New T-BEAM with ESP32-S3 CPU
	*
	* @generated from enum value: LILYGO_TBEAM_S3_CORE = 12;
	*/
	HardwareModel$1[HardwareModel$1["LILYGO_TBEAM_S3_CORE"] = 12] = "LILYGO_TBEAM_S3_CORE";
	/**
	*
	* RAK WisBlock ESP32 core: https://docs.rakwireless.com/Product-Categories/WisBlock/RAK11200/Overview/
	*
	* @generated from enum value: RAK11200 = 13;
	*/
	HardwareModel$1[HardwareModel$1["RAK11200"] = 13] = "RAK11200";
	/**
	*
	* B&Q Consulting Nano Edition G1: https://uniteng.com/wiki/doku.php?id=meshtastic:nano
	*
	* @generated from enum value: NANO_G1 = 14;
	*/
	HardwareModel$1[HardwareModel$1["NANO_G1"] = 14] = "NANO_G1";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TLORA_V2_1_1P8 = 15;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_V2_1_1P8"] = 15] = "TLORA_V2_1_1P8";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TLORA_T3_S3 = 16;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_T3_S3"] = 16] = "TLORA_T3_S3";
	/**
	*
	* B&Q Consulting Nano G1 Explorer: https://wiki.uniteng.com/en/meshtastic/nano-g1-explorer
	*
	* @generated from enum value: NANO_G1_EXPLORER = 17;
	*/
	HardwareModel$1[HardwareModel$1["NANO_G1_EXPLORER"] = 17] = "NANO_G1_EXPLORER";
	/**
	*
	* B&Q Consulting Nano G2 Ultra: https://wiki.uniteng.com/en/meshtastic/nano-g2-ultra
	*
	* @generated from enum value: NANO_G2_ULTRA = 18;
	*/
	HardwareModel$1[HardwareModel$1["NANO_G2_ULTRA"] = 18] = "NANO_G2_ULTRA";
	/**
	*
	* LoRAType device: https://loratype.org/
	*
	* @generated from enum value: LORA_TYPE = 19;
	*/
	HardwareModel$1[HardwareModel$1["LORA_TYPE"] = 19] = "LORA_TYPE";
	/**
	*
	* wiphone https://www.wiphone.io/
	*
	* @generated from enum value: WIPHONE = 20;
	*/
	HardwareModel$1[HardwareModel$1["WIPHONE"] = 20] = "WIPHONE";
	/**
	*
	* WIO Tracker WM1110 family from Seeed Studio. Includes wio-1110-tracker and wio-1110-sdk
	*
	* @generated from enum value: WIO_WM1110 = 21;
	*/
	HardwareModel$1[HardwareModel$1["WIO_WM1110"] = 21] = "WIO_WM1110";
	/**
	*
	* RAK2560 Solar base station based on RAK4630
	*
	* @generated from enum value: RAK2560 = 22;
	*/
	HardwareModel$1[HardwareModel$1["RAK2560"] = 22] = "RAK2560";
	/**
	*
	* Heltec HRU-3601: https://heltec.org/project/hru-3601/
	*
	* @generated from enum value: HELTEC_HRU_3601 = 23;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_HRU_3601"] = 23] = "HELTEC_HRU_3601";
	/**
	*
	* Heltec Wireless Bridge
	*
	* @generated from enum value: HELTEC_WIRELESS_BRIDGE = 24;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_WIRELESS_BRIDGE"] = 24] = "HELTEC_WIRELESS_BRIDGE";
	/**
	*
	* B&Q Consulting Station Edition G1: https://uniteng.com/wiki/doku.php?id=meshtastic:station
	*
	* @generated from enum value: STATION_G1 = 25;
	*/
	HardwareModel$1[HardwareModel$1["STATION_G1"] = 25] = "STATION_G1";
	/**
	*
	* RAK11310 (RP2040 + SX1262)
	*
	* @generated from enum value: RAK11310 = 26;
	*/
	HardwareModel$1[HardwareModel$1["RAK11310"] = 26] = "RAK11310";
	/**
	*
	* Makerfabs SenseLoRA Receiver (RP2040 + RFM96)
	*
	* @generated from enum value: SENSELORA_RP2040 = 27;
	*/
	HardwareModel$1[HardwareModel$1["SENSELORA_RP2040"] = 27] = "SENSELORA_RP2040";
	/**
	*
	* Makerfabs SenseLoRA Industrial Monitor (ESP32-S3 + RFM96)
	*
	* @generated from enum value: SENSELORA_S3 = 28;
	*/
	HardwareModel$1[HardwareModel$1["SENSELORA_S3"] = 28] = "SENSELORA_S3";
	/**
	*
	* Canary Radio Company - CanaryOne: https://canaryradio.io/products/canaryone
	*
	* @generated from enum value: CANARYONE = 29;
	*/
	HardwareModel$1[HardwareModel$1["CANARYONE"] = 29] = "CANARYONE";
	/**
	*
	* Waveshare RP2040 LoRa - https://www.waveshare.com/rp2040-lora.htm
	*
	* @generated from enum value: RP2040_LORA = 30;
	*/
	HardwareModel$1[HardwareModel$1["RP2040_LORA"] = 30] = "RP2040_LORA";
	/**
	*
	* B&Q Consulting Station G2: https://wiki.uniteng.com/en/meshtastic/station-g2
	*
	* @generated from enum value: STATION_G2 = 31;
	*/
	HardwareModel$1[HardwareModel$1["STATION_G2"] = 31] = "STATION_G2";
	/**
	*
	* ---------------------------------------------------------------------------
	* Less common/prototype boards listed here (needs one more byte over the air)
	* ---------------------------------------------------------------------------
	*
	* @generated from enum value: LORA_RELAY_V1 = 32;
	*/
	HardwareModel$1[HardwareModel$1["LORA_RELAY_V1"] = 32] = "LORA_RELAY_V1";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: NRF52840DK = 33;
	*/
	HardwareModel$1[HardwareModel$1["NRF52840DK"] = 33] = "NRF52840DK";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: PPR = 34;
	*/
	HardwareModel$1[HardwareModel$1["PPR"] = 34] = "PPR";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: GENIEBLOCKS = 35;
	*/
	HardwareModel$1[HardwareModel$1["GENIEBLOCKS"] = 35] = "GENIEBLOCKS";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: NRF52_UNKNOWN = 36;
	*/
	HardwareModel$1[HardwareModel$1["NRF52_UNKNOWN"] = 36] = "NRF52_UNKNOWN";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: PORTDUINO = 37;
	*/
	HardwareModel$1[HardwareModel$1["PORTDUINO"] = 37] = "PORTDUINO";
	/**
	*
	* The simulator built into the android app
	*
	* @generated from enum value: ANDROID_SIM = 38;
	*/
	HardwareModel$1[HardwareModel$1["ANDROID_SIM"] = 38] = "ANDROID_SIM";
	/**
	*
	* Custom DIY device based on @NanoVHF schematics: https://github.com/NanoVHF/Meshtastic-DIY/tree/main/Schematics
	*
	* @generated from enum value: DIY_V1 = 39;
	*/
	HardwareModel$1[HardwareModel$1["DIY_V1"] = 39] = "DIY_V1";
	/**
	*
	* nRF52840 Dongle : https://www.nordicsemi.com/Products/Development-hardware/nrf52840-dongle/
	*
	* @generated from enum value: NRF52840_PCA10059 = 40;
	*/
	HardwareModel$1[HardwareModel$1["NRF52840_PCA10059"] = 40] = "NRF52840_PCA10059";
	/**
	*
	* Custom Disaster Radio esp32 v3 device https://github.com/sudomesh/disaster-radio/tree/master/hardware/board_esp32_v3
	*
	* @generated from enum value: DR_DEV = 41;
	*/
	HardwareModel$1[HardwareModel$1["DR_DEV"] = 41] = "DR_DEV";
	/**
	*
	* M5 esp32 based MCU modules with enclosure, TFT and LORA Shields. All Variants (Basic, Core, Fire, Core2, CoreS3, Paper) https://m5stack.com/
	*
	* @generated from enum value: M5STACK = 42;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK"] = 42] = "M5STACK";
	/**
	*
	* New Heltec LoRA32 with ESP32-S3 CPU
	*
	* @generated from enum value: HELTEC_V3 = 43;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_V3"] = 43] = "HELTEC_V3";
	/**
	*
	* New Heltec Wireless Stick Lite with ESP32-S3 CPU
	*
	* @generated from enum value: HELTEC_WSL_V3 = 44;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_WSL_V3"] = 44] = "HELTEC_WSL_V3";
	/**
	*
	* New BETAFPV ELRS Micro TX Module 2.4G with ESP32 CPU
	*
	* @generated from enum value: BETAFPV_2400_TX = 45;
	*/
	HardwareModel$1[HardwareModel$1["BETAFPV_2400_TX"] = 45] = "BETAFPV_2400_TX";
	/**
	*
	* BetaFPV ExpressLRS "Nano" TX Module 900MHz with ESP32 CPU
	*
	* @generated from enum value: BETAFPV_900_NANO_TX = 46;
	*/
	HardwareModel$1[HardwareModel$1["BETAFPV_900_NANO_TX"] = 46] = "BETAFPV_900_NANO_TX";
	/**
	*
	* Raspberry Pi Pico (W) with Waveshare SX1262 LoRa Node Module
	*
	* @generated from enum value: RPI_PICO = 47;
	*/
	HardwareModel$1[HardwareModel$1["RPI_PICO"] = 47] = "RPI_PICO";
	/**
	*
	* Heltec Wireless Tracker with ESP32-S3 CPU, built-in GPS, and TFT
	* Newer V1.1, version is written on the PCB near the display.
	*
	* @generated from enum value: HELTEC_WIRELESS_TRACKER = 48;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_WIRELESS_TRACKER"] = 48] = "HELTEC_WIRELESS_TRACKER";
	/**
	*
	* Heltec Wireless Paper with ESP32-S3 CPU and E-Ink display
	*
	* @generated from enum value: HELTEC_WIRELESS_PAPER = 49;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_WIRELESS_PAPER"] = 49] = "HELTEC_WIRELESS_PAPER";
	/**
	*
	* LilyGo T-Deck with ESP32-S3 CPU, Keyboard and IPS display
	*
	* @generated from enum value: T_DECK = 50;
	*/
	HardwareModel$1[HardwareModel$1["T_DECK"] = 50] = "T_DECK";
	/**
	*
	* LilyGo T-Watch S3 with ESP32-S3 CPU and IPS display
	*
	* @generated from enum value: T_WATCH_S3 = 51;
	*/
	HardwareModel$1[HardwareModel$1["T_WATCH_S3"] = 51] = "T_WATCH_S3";
	/**
	*
	* Bobricius Picomputer with ESP32-S3 CPU, Keyboard and IPS display
	*
	* @generated from enum value: PICOMPUTER_S3 = 52;
	*/
	HardwareModel$1[HardwareModel$1["PICOMPUTER_S3"] = 52] = "PICOMPUTER_S3";
	/**
	*
	* Heltec HT-CT62 with ESP32-C3 CPU and SX1262 LoRa
	*
	* @generated from enum value: HELTEC_HT62 = 53;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_HT62"] = 53] = "HELTEC_HT62";
	/**
	*
	* EBYTE SPI LoRa module and ESP32-S3
	*
	* @generated from enum value: EBYTE_ESP32_S3 = 54;
	*/
	HardwareModel$1[HardwareModel$1["EBYTE_ESP32_S3"] = 54] = "EBYTE_ESP32_S3";
	/**
	*
	* Waveshare ESP32-S3-PICO with PICO LoRa HAT and 2.9inch e-Ink
	*
	* @generated from enum value: ESP32_S3_PICO = 55;
	*/
	HardwareModel$1[HardwareModel$1["ESP32_S3_PICO"] = 55] = "ESP32_S3_PICO";
	/**
	*
	* CircuitMess Chatter 2 LLCC68 Lora Module and ESP32 Wroom
	* Lora module can be swapped out for a Heltec RA-62 which is "almost" pin compatible
	* with one cut and one jumper Meshtastic works
	*
	* @generated from enum value: CHATTER_2 = 56;
	*/
	HardwareModel$1[HardwareModel$1["CHATTER_2"] = 56] = "CHATTER_2";
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
	HardwareModel$1[HardwareModel$1["HELTEC_WIRELESS_PAPER_V1_0"] = 57] = "HELTEC_WIRELESS_PAPER_V1_0";
	/**
	*
	* Heltec Wireless Tracker with ESP32-S3 CPU, built-in GPS, and TFT
	* Older "V1.0" Variant
	*
	* @generated from enum value: HELTEC_WIRELESS_TRACKER_V1_0 = 58;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_WIRELESS_TRACKER_V1_0"] = 58] = "HELTEC_WIRELESS_TRACKER_V1_0";
	/**
	*
	* unPhone with ESP32-S3, TFT touchscreen,  LSM6DS3TR-C accelerometer and gyroscope
	*
	* @generated from enum value: UNPHONE = 59;
	*/
	HardwareModel$1[HardwareModel$1["UNPHONE"] = 59] = "UNPHONE";
	/**
	*
	* Teledatics TD-LORAC NRF52840 based M.2 LoRA module
	* Compatible with the TD-WRLS development board
	*
	* @generated from enum value: TD_LORAC = 60;
	*/
	HardwareModel$1[HardwareModel$1["TD_LORAC"] = 60] = "TD_LORAC";
	/**
	*
	* CDEBYTE EoRa-S3 board using their own MM modules, clone of LILYGO T3S3
	*
	* @generated from enum value: CDEBYTE_EORA_S3 = 61;
	*/
	HardwareModel$1[HardwareModel$1["CDEBYTE_EORA_S3"] = 61] = "CDEBYTE_EORA_S3";
	/**
	*
	* TWC_MESH_V4
	* Adafruit NRF52840 feather express with SX1262, SSD1306 OLED and NEO6M GPS
	*
	* @generated from enum value: TWC_MESH_V4 = 62;
	*/
	HardwareModel$1[HardwareModel$1["TWC_MESH_V4"] = 62] = "TWC_MESH_V4";
	/**
	*
	* NRF52_PROMICRO_DIY
	* Promicro NRF52840 with SX1262/LLCC68, SSD1306 OLED and NEO6M GPS
	*
	* @generated from enum value: NRF52_PROMICRO_DIY = 63;
	*/
	HardwareModel$1[HardwareModel$1["NRF52_PROMICRO_DIY"] = 63] = "NRF52_PROMICRO_DIY";
	/**
	*
	* RadioMaster 900 Bandit Nano, https://www.radiomasterrc.com/products/bandit-nano-expresslrs-rf-module
	* ESP32-D0WDQ6 With SX1276/SKY66122, SSD1306 OLED and No GPS
	*
	* @generated from enum value: RADIOMASTER_900_BANDIT_NANO = 64;
	*/
	HardwareModel$1[HardwareModel$1["RADIOMASTER_900_BANDIT_NANO"] = 64] = "RADIOMASTER_900_BANDIT_NANO";
	/**
	*
	* Heltec Capsule Sensor V3 with ESP32-S3 CPU, Portable LoRa device that can replace GNSS modules or sensors
	*
	* @generated from enum value: HELTEC_CAPSULE_SENSOR_V3 = 65;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_CAPSULE_SENSOR_V3"] = 65] = "HELTEC_CAPSULE_SENSOR_V3";
	/**
	*
	* Heltec Vision Master T190 with ESP32-S3 CPU, and a 1.90 inch TFT display
	*
	* @generated from enum value: HELTEC_VISION_MASTER_T190 = 66;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_VISION_MASTER_T190"] = 66] = "HELTEC_VISION_MASTER_T190";
	/**
	*
	* Heltec Vision Master E213 with ESP32-S3 CPU, and a 2.13 inch E-Ink display
	*
	* @generated from enum value: HELTEC_VISION_MASTER_E213 = 67;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_VISION_MASTER_E213"] = 67] = "HELTEC_VISION_MASTER_E213";
	/**
	*
	* Heltec Vision Master E290 with ESP32-S3 CPU, and a 2.9 inch E-Ink display
	*
	* @generated from enum value: HELTEC_VISION_MASTER_E290 = 68;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_VISION_MASTER_E290"] = 68] = "HELTEC_VISION_MASTER_E290";
	/**
	*
	* Heltec Mesh Node T114 board with nRF52840 CPU, and a 1.14 inch TFT display, Ultimate low-power design,
	* specifically adapted for the Meshtatic project
	*
	* @generated from enum value: HELTEC_MESH_NODE_T114 = 69;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_MESH_NODE_T114"] = 69] = "HELTEC_MESH_NODE_T114";
	/**
	*
	* Sensecap Indicator from Seeed Studio. ESP32-S3 device with TFT and RP2040 coprocessor
	*
	* @generated from enum value: SENSECAP_INDICATOR = 70;
	*/
	HardwareModel$1[HardwareModel$1["SENSECAP_INDICATOR"] = 70] = "SENSECAP_INDICATOR";
	/**
	*
	* Seeed studio T1000-E tracker card. NRF52840 w/ LR1110 radio, GPS, button, buzzer, and sensors.
	*
	* @generated from enum value: TRACKER_T1000_E = 71;
	*/
	HardwareModel$1[HardwareModel$1["TRACKER_T1000_E"] = 71] = "TRACKER_T1000_E";
	/**
	*
	* RAK3172 STM32WLE5 Module (https://store.rakwireless.com/products/wisduo-lpwan-module-rak3172)
	*
	* @generated from enum value: RAK3172 = 72;
	*/
	HardwareModel$1[HardwareModel$1["RAK3172"] = 72] = "RAK3172";
	/**
	*
	* Seeed Studio Wio-E5 (either mini or Dev kit) using STM32WL chip.
	*
	* @generated from enum value: WIO_E5 = 73;
	*/
	HardwareModel$1[HardwareModel$1["WIO_E5"] = 73] = "WIO_E5";
	/**
	*
	* RadioMaster 900 Bandit, https://www.radiomasterrc.com/products/bandit-expresslrs-rf-module
	* SSD1306 OLED and No GPS
	*
	* @generated from enum value: RADIOMASTER_900_BANDIT = 74;
	*/
	HardwareModel$1[HardwareModel$1["RADIOMASTER_900_BANDIT"] = 74] = "RADIOMASTER_900_BANDIT";
	/**
	*
	* Minewsemi ME25LS01 (ME25LE01_V1.0). NRF52840 w/ LR1110 radio, buttons and leds and pins.
	*
	* @generated from enum value: ME25LS01_4Y10TD = 75;
	*/
	HardwareModel$1[HardwareModel$1["ME25LS01_4Y10TD"] = 75] = "ME25LS01_4Y10TD";
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
	HardwareModel$1[HardwareModel$1["RP2040_FEATHER_RFM95"] = 76] = "RP2040_FEATHER_RFM95";
	/**
	* M5 esp32 based MCU modules with enclosure, TFT and LORA Shields. All Variants (Basic, Core, Fire, Core2, CoreS3, Paper) https://m5stack.com/ 
	*
	* @generated from enum value: M5STACK_COREBASIC = 77;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK_COREBASIC"] = 77] = "M5STACK_COREBASIC";
	/**
	* @generated from enum value: M5STACK_CORE2 = 78;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK_CORE2"] = 78] = "M5STACK_CORE2";
	/**
	* Pico2 with Waveshare Hat, same as Pico 
	*
	* @generated from enum value: RPI_PICO2 = 79;
	*/
	HardwareModel$1[HardwareModel$1["RPI_PICO2"] = 79] = "RPI_PICO2";
	/**
	* M5 esp32 based MCU modules with enclosure, TFT and LORA Shields. All Variants (Basic, Core, Fire, Core2, CoreS3, Paper) https://m5stack.com/ 
	*
	* @generated from enum value: M5STACK_CORES3 = 80;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK_CORES3"] = 80] = "M5STACK_CORES3";
	/**
	* Seeed XIAO S3 DK
	*
	* @generated from enum value: SEEED_XIAO_S3 = 81;
	*/
	HardwareModel$1[HardwareModel$1["SEEED_XIAO_S3"] = 81] = "SEEED_XIAO_S3";
	/**
	*
	* Nordic nRF52840+Semtech SX1262 LoRa BLE Combo Module. nRF52840+SX1262 MS24SF1
	*
	* @generated from enum value: MS24SF1 = 82;
	*/
	HardwareModel$1[HardwareModel$1["MS24SF1"] = 82] = "MS24SF1";
	/**
	*
	* Lilygo TLora-C6 with the new ESP32-C6 MCU
	*
	* @generated from enum value: TLORA_C6 = 83;
	*/
	HardwareModel$1[HardwareModel$1["TLORA_C6"] = 83] = "TLORA_C6";
	/**
	*
	* WisMesh Tap
	* RAK-4631 w/ TFT in injection modled case
	*
	* @generated from enum value: WISMESH_TAP = 84;
	*/
	HardwareModel$1[HardwareModel$1["WISMESH_TAP"] = 84] = "WISMESH_TAP";
	/**
	*
	* Similar to PORTDUINO but used by Routastic devices, this is not any
	* particular device and does not run Meshtastic's code but supports
	* the same frame format.
	* Runs on linux, see https://github.com/Jorropo/routastic
	*
	* @generated from enum value: ROUTASTIC = 85;
	*/
	HardwareModel$1[HardwareModel$1["ROUTASTIC"] = 85] = "ROUTASTIC";
	/**
	*
	* Mesh-Tab, esp32 based
	* https://github.com/valzzu/Mesh-Tab
	*
	* @generated from enum value: MESH_TAB = 86;
	*/
	HardwareModel$1[HardwareModel$1["MESH_TAB"] = 86] = "MESH_TAB";
	/**
	*
	* MeshLink board developed by LoraItalia. NRF52840, eByte E22900M22S (Will also come with other frequencies), 25w MPPT solar charger (5v,12v,18v selectable), support for gps, buzzer, oled or e-ink display, 10 gpios, hardware watchdog
	* https://www.loraitalia.it
	*
	* @generated from enum value: MESHLINK = 87;
	*/
	HardwareModel$1[HardwareModel$1["MESHLINK"] = 87] = "MESHLINK";
	/**
	*
	* Seeed XIAO nRF52840 + Wio SX1262 kit
	*
	* @generated from enum value: XIAO_NRF52_KIT = 88;
	*/
	HardwareModel$1[HardwareModel$1["XIAO_NRF52_KIT"] = 88] = "XIAO_NRF52_KIT";
	/**
	*
	* Elecrow ThinkNode M1 & M2
	* https://www.elecrow.com/wiki/ThinkNode-M1_Transceiver_Device(Meshtastic)_Power_By_nRF52840.html
	* https://www.elecrow.com/wiki/ThinkNode-M2_Transceiver_Device(Meshtastic)_Power_By_NRF52840.html (this actually uses ESP32-S3)
	*
	* @generated from enum value: THINKNODE_M1 = 89;
	*/
	HardwareModel$1[HardwareModel$1["THINKNODE_M1"] = 89] = "THINKNODE_M1";
	/**
	* @generated from enum value: THINKNODE_M2 = 90;
	*/
	HardwareModel$1[HardwareModel$1["THINKNODE_M2"] = 90] = "THINKNODE_M2";
	/**
	*
	* Lilygo T-ETH-Elite
	*
	* @generated from enum value: T_ETH_ELITE = 91;
	*/
	HardwareModel$1[HardwareModel$1["T_ETH_ELITE"] = 91] = "T_ETH_ELITE";
	/**
	*
	* Heltec HRI-3621 industrial probe
	*
	* @generated from enum value: HELTEC_SENSOR_HUB = 92;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_SENSOR_HUB"] = 92] = "HELTEC_SENSOR_HUB";
	/**
	*
	* Reserved Fried Chicken ID for future use
	*
	* @generated from enum value: RESERVED_FRIED_CHICKEN = 93;
	*/
	HardwareModel$1[HardwareModel$1["RESERVED_FRIED_CHICKEN"] = 93] = "RESERVED_FRIED_CHICKEN";
	/**
	*
	* Heltec Magnetic Power Bank with Meshtastic compatible
	*
	* @generated from enum value: HELTEC_MESH_POCKET = 94;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_MESH_POCKET"] = 94] = "HELTEC_MESH_POCKET";
	/**
	*
	* Seeed Solar Node
	*
	* @generated from enum value: SEEED_SOLAR_NODE = 95;
	*/
	HardwareModel$1[HardwareModel$1["SEEED_SOLAR_NODE"] = 95] = "SEEED_SOLAR_NODE";
	/**
	*
	* NomadStar Meteor Pro https://nomadstar.ch/
	*
	* @generated from enum value: NOMADSTAR_METEOR_PRO = 96;
	*/
	HardwareModel$1[HardwareModel$1["NOMADSTAR_METEOR_PRO"] = 96] = "NOMADSTAR_METEOR_PRO";
	/**
	*
	* Elecrow CrowPanel Advance models, ESP32-S3 and TFT with SX1262 radio plugin
	*
	* @generated from enum value: CROWPANEL = 97;
	*/
	HardwareModel$1[HardwareModel$1["CROWPANEL"] = 97] = "CROWPANEL";
	/**
	*
	* Lilygo LINK32 board with sensors
	*
	* @generated from enum value: LINK_32 = 98;
	*/
	HardwareModel$1[HardwareModel$1["LINK_32"] = 98] = "LINK_32";
	/**
	*
	* Seeed Tracker L1
	*
	* @generated from enum value: SEEED_WIO_TRACKER_L1 = 99;
	*/
	HardwareModel$1[HardwareModel$1["SEEED_WIO_TRACKER_L1"] = 99] = "SEEED_WIO_TRACKER_L1";
	/**
	*
	* Seeed Tracker L1 EINK driver
	*
	* @generated from enum value: SEEED_WIO_TRACKER_L1_EINK = 100;
	*/
	HardwareModel$1[HardwareModel$1["SEEED_WIO_TRACKER_L1_EINK"] = 100] = "SEEED_WIO_TRACKER_L1_EINK";
	/**
	*
	* Muzi Works R1 Neo
	*
	* @generated from enum value: MUZI_R1_NEO = 101;
	*/
	HardwareModel$1[HardwareModel$1["MUZI_R1_NEO"] = 101] = "MUZI_R1_NEO";
	/**
	*
	* Lilygo T-Deck Pro
	*
	* @generated from enum value: T_DECK_PRO = 102;
	*/
	HardwareModel$1[HardwareModel$1["T_DECK_PRO"] = 102] = "T_DECK_PRO";
	/**
	*
	* Lilygo TLora Pager
	*
	* @generated from enum value: T_LORA_PAGER = 103;
	*/
	HardwareModel$1[HardwareModel$1["T_LORA_PAGER"] = 103] = "T_LORA_PAGER";
	/**
	*
	* M5Stack Reserved
	*
	* 0x68
	*
	* @generated from enum value: M5STACK_RESERVED = 104;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK_RESERVED"] = 104] = "M5STACK_RESERVED";
	/**
	*
	* RAKwireless WisMesh Tag
	*
	* @generated from enum value: WISMESH_TAG = 105;
	*/
	HardwareModel$1[HardwareModel$1["WISMESH_TAG"] = 105] = "WISMESH_TAG";
	/**
	*
	* RAKwireless WisBlock Core RAK3312 https://docs.rakwireless.com/product-categories/wisduo/rak3112-module/overview/
	*
	* @generated from enum value: RAK3312 = 106;
	*/
	HardwareModel$1[HardwareModel$1["RAK3312"] = 106] = "RAK3312";
	/**
	*
	* Elecrow ThinkNode M5 https://www.elecrow.com/wiki/ThinkNode_M5_Meshtastic_LoRa_Signal_Transceiver_ESP32-S3.html
	*
	* @generated from enum value: THINKNODE_M5 = 107;
	*/
	HardwareModel$1[HardwareModel$1["THINKNODE_M5"] = 107] = "THINKNODE_M5";
	/**
	*
	* MeshSolar is an integrated power management and communication solution designed for outdoor low-power devices.
	* https://heltec.org/project/meshsolar/
	*
	* @generated from enum value: HELTEC_MESH_SOLAR = 108;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_MESH_SOLAR"] = 108] = "HELTEC_MESH_SOLAR";
	/**
	*
	* Lilygo T-Echo Lite
	*
	* @generated from enum value: T_ECHO_LITE = 109;
	*/
	HardwareModel$1[HardwareModel$1["T_ECHO_LITE"] = 109] = "T_ECHO_LITE";
	/**
	*
	* New Heltec LoRA32 with ESP32-S3 CPU
	*
	* @generated from enum value: HELTEC_V4 = 110;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_V4"] = 110] = "HELTEC_V4";
	/**
	*
	* M5Stack C6L
	*
	* @generated from enum value: M5STACK_C6L = 111;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK_C6L"] = 111] = "M5STACK_C6L";
	/**
	*
	* M5Stack Cardputer Adv
	*
	* @generated from enum value: M5STACK_CARDPUTER_ADV = 112;
	*/
	HardwareModel$1[HardwareModel$1["M5STACK_CARDPUTER_ADV"] = 112] = "M5STACK_CARDPUTER_ADV";
	/**
	*
	* ESP32S3 main controller with GPS and TFT screen.
	*
	* @generated from enum value: HELTEC_WIRELESS_TRACKER_V2 = 113;
	*/
	HardwareModel$1[HardwareModel$1["HELTEC_WIRELESS_TRACKER_V2"] = 113] = "HELTEC_WIRELESS_TRACKER_V2";
	/**
	*
	* LilyGo T-Watch Ultra
	*
	* @generated from enum value: T_WATCH_ULTRA = 114;
	*/
	HardwareModel$1[HardwareModel$1["T_WATCH_ULTRA"] = 114] = "T_WATCH_ULTRA";
	/**
	*
	* Elecrow ThinkNode M3
	*
	* @generated from enum value: THINKNODE_M3 = 115;
	*/
	HardwareModel$1[HardwareModel$1["THINKNODE_M3"] = 115] = "THINKNODE_M3";
	/**
	*
	* RAK WISMESH_TAP_V2 with ESP32-S3 CPU
	*
	* @generated from enum value: WISMESH_TAP_V2 = 116;
	*/
	HardwareModel$1[HardwareModel$1["WISMESH_TAP_V2"] = 116] = "WISMESH_TAP_V2";
	/**
	*
	* RAK3401
	*
	* @generated from enum value: RAK3401 = 117;
	*/
	HardwareModel$1[HardwareModel$1["RAK3401"] = 117] = "RAK3401";
	/**
	*
	* ------------------------------------------------------------------------------------------------------------------------------------------
	* Reserved ID For developing private Ports. These will show up in live traffic sparsely, so we can use a high number. Keep it within 8 bits.
	* ------------------------------------------------------------------------------------------------------------------------------------------
	*
	* @generated from enum value: PRIVATE_HW = 255;
	*/
	HardwareModel$1[HardwareModel$1["PRIVATE_HW"] = 255] = "PRIVATE_HW";
	return HardwareModel$1;
}({});
/**
* Describes the enum meshtastic.HardwareModel.
*/
const HardwareModelSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 0);
/**
*
* Shared constants between device and phone
*
* @generated from enum meshtastic.Constants
*/
let Constants = /* @__PURE__ */ function(Constants$1) {
	/**
	*
	* First enum must be zero, and we are just using this enum to
	* pass int constants between two very different environments
	*
	* @generated from enum value: ZERO = 0;
	*/
	Constants$1[Constants$1["ZERO"] = 0] = "ZERO";
	/**
	*
	* From mesh.options
	* note: this payload length is ONLY the bytes that are sent inside of the Data protobuf (excluding protobuf overhead). The 16 byte header is
	* outside of this envelope
	*
	* @generated from enum value: DATA_PAYLOAD_LEN = 233;
	*/
	Constants$1[Constants$1["DATA_PAYLOAD_LEN"] = 233] = "DATA_PAYLOAD_LEN";
	return Constants$1;
}({});
/**
* Describes the enum meshtastic.Constants.
*/
const ConstantsSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 1);
/**
*
* Error codes for critical errors
* The device might report these fault codes on the screen.
* If you encounter a fault code, please post on the meshtastic.discourse.group
* and we'll try to help.
*
* @generated from enum meshtastic.CriticalErrorCode
*/
let CriticalErrorCode = /* @__PURE__ */ function(CriticalErrorCode$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: NONE = 0;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["NONE"] = 0] = "NONE";
	/**
	*
	* A software bug was detected while trying to send lora
	*
	* @generated from enum value: TX_WATCHDOG = 1;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["TX_WATCHDOG"] = 1] = "TX_WATCHDOG";
	/**
	*
	* A software bug was detected on entry to sleep
	*
	* @generated from enum value: SLEEP_ENTER_WAIT = 2;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["SLEEP_ENTER_WAIT"] = 2] = "SLEEP_ENTER_WAIT";
	/**
	*
	* No Lora radio hardware could be found
	*
	* @generated from enum value: NO_RADIO = 3;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["NO_RADIO"] = 3] = "NO_RADIO";
	/**
	*
	* Not normally used
	*
	* @generated from enum value: UNSPECIFIED = 4;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["UNSPECIFIED"] = 4] = "UNSPECIFIED";
	/**
	*
	* We failed while configuring a UBlox GPS
	*
	* @generated from enum value: UBLOX_UNIT_FAILED = 5;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["UBLOX_UNIT_FAILED"] = 5] = "UBLOX_UNIT_FAILED";
	/**
	*
	* This board was expected to have a power management chip and it is missing or broken
	*
	* @generated from enum value: NO_AXP192 = 6;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["NO_AXP192"] = 6] = "NO_AXP192";
	/**
	*
	* The channel tried to set a radio setting which is not supported by this chipset,
	* radio comms settings are now undefined.
	*
	* @generated from enum value: INVALID_RADIO_SETTING = 7;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["INVALID_RADIO_SETTING"] = 7] = "INVALID_RADIO_SETTING";
	/**
	*
	* Radio transmit hardware failure. We sent data to the radio chip, but it didn't
	* reply with an interrupt.
	*
	* @generated from enum value: TRANSMIT_FAILED = 8;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["TRANSMIT_FAILED"] = 8] = "TRANSMIT_FAILED";
	/**
	*
	* We detected that the main CPU voltage dropped below the minimum acceptable value
	*
	* @generated from enum value: BROWNOUT = 9;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["BROWNOUT"] = 9] = "BROWNOUT";
	/**
	* Selftest of SX1262 radio chip failed 
	*
	* @generated from enum value: SX1262_FAILURE = 10;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["SX1262_FAILURE"] = 10] = "SX1262_FAILURE";
	/**
	*
	* A (likely software but possibly hardware) failure was detected while trying to send packets.
	* If this occurs on your board, please post in the forum so that we can ask you to collect some information to allow fixing this bug
	*
	* @generated from enum value: RADIO_SPI_BUG = 11;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["RADIO_SPI_BUG"] = 11] = "RADIO_SPI_BUG";
	/**
	*
	* Corruption was detected on the flash filesystem but we were able to repair things.
	* If you see this failure in the field please post in the forum because we are interested in seeing if this is occurring in the field.
	*
	* @generated from enum value: FLASH_CORRUPTION_RECOVERABLE = 12;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["FLASH_CORRUPTION_RECOVERABLE"] = 12] = "FLASH_CORRUPTION_RECOVERABLE";
	/**
	*
	* Corruption was detected on the flash filesystem but we were unable to repair things.
	* NOTE: Your node will probably need to be reconfigured the next time it reboots (it will lose the region code etc...)
	* If you see this failure in the field please post in the forum because we are interested in seeing if this is occurring in the field.
	*
	* @generated from enum value: FLASH_CORRUPTION_UNRECOVERABLE = 13;
	*/
	CriticalErrorCode$1[CriticalErrorCode$1["FLASH_CORRUPTION_UNRECOVERABLE"] = 13] = "FLASH_CORRUPTION_UNRECOVERABLE";
	return CriticalErrorCode$1;
}({});
/**
* Describes the enum meshtastic.CriticalErrorCode.
*/
const CriticalErrorCodeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 2);
/**
*
* Enum to indicate to clients whether this firmware is a special firmware build, like an event.
* The first 16 values are reserved for non-event special firmwares, like the Smart Citizen use case.
*
* @generated from enum meshtastic.FirmwareEdition
*/
let FirmwareEdition = /* @__PURE__ */ function(FirmwareEdition$1) {
	/**
	*
	* Vanilla firmware
	*
	* @generated from enum value: VANILLA = 0;
	*/
	FirmwareEdition$1[FirmwareEdition$1["VANILLA"] = 0] = "VANILLA";
	/**
	*
	* Firmware for use in the Smart Citizen environmental monitoring network
	*
	* @generated from enum value: SMART_CITIZEN = 1;
	*/
	FirmwareEdition$1[FirmwareEdition$1["SMART_CITIZEN"] = 1] = "SMART_CITIZEN";
	/**
	*
	* Open Sauce, the maker conference held yearly in CA
	*
	* @generated from enum value: OPEN_SAUCE = 16;
	*/
	FirmwareEdition$1[FirmwareEdition$1["OPEN_SAUCE"] = 16] = "OPEN_SAUCE";
	/**
	*
	* DEFCON, the yearly hacker conference
	*
	* @generated from enum value: DEFCON = 17;
	*/
	FirmwareEdition$1[FirmwareEdition$1["DEFCON"] = 17] = "DEFCON";
	/**
	*
	* Burning Man, the yearly hippie gathering in the desert
	*
	* @generated from enum value: BURNING_MAN = 18;
	*/
	FirmwareEdition$1[FirmwareEdition$1["BURNING_MAN"] = 18] = "BURNING_MAN";
	/**
	*
	* Hamvention, the Dayton amateur radio convention
	*
	* @generated from enum value: HAMVENTION = 19;
	*/
	FirmwareEdition$1[FirmwareEdition$1["HAMVENTION"] = 19] = "HAMVENTION";
	/**
	*
	* Placeholder for DIY and unofficial events
	*
	* @generated from enum value: DIY_EDITION = 127;
	*/
	FirmwareEdition$1[FirmwareEdition$1["DIY_EDITION"] = 127] = "DIY_EDITION";
	return FirmwareEdition$1;
}({});
/**
* Describes the enum meshtastic.FirmwareEdition.
*/
const FirmwareEditionSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 3);
/**
*
* Enum for modules excluded from a device's configuration.
* Each value represents a ModuleConfigType that can be toggled as excluded
* by setting its corresponding bit in the `excluded_modules` bitmask field.
*
* @generated from enum meshtastic.ExcludedModules
*/
let ExcludedModules = /* @__PURE__ */ function(ExcludedModules$1) {
	/**
	*
	* Default value of 0 indicates no modules are excluded.
	*
	* @generated from enum value: EXCLUDED_NONE = 0;
	*/
	ExcludedModules$1[ExcludedModules$1["EXCLUDED_NONE"] = 0] = "EXCLUDED_NONE";
	/**
	*
	* MQTT module
	*
	* @generated from enum value: MQTT_CONFIG = 1;
	*/
	ExcludedModules$1[ExcludedModules$1["MQTT_CONFIG"] = 1] = "MQTT_CONFIG";
	/**
	*
	* Serial module
	*
	* @generated from enum value: SERIAL_CONFIG = 2;
	*/
	ExcludedModules$1[ExcludedModules$1["SERIAL_CONFIG"] = 2] = "SERIAL_CONFIG";
	/**
	*
	* External Notification module
	*
	* @generated from enum value: EXTNOTIF_CONFIG = 4;
	*/
	ExcludedModules$1[ExcludedModules$1["EXTNOTIF_CONFIG"] = 4] = "EXTNOTIF_CONFIG";
	/**
	*
	* Store and Forward module
	*
	* @generated from enum value: STOREFORWARD_CONFIG = 8;
	*/
	ExcludedModules$1[ExcludedModules$1["STOREFORWARD_CONFIG"] = 8] = "STOREFORWARD_CONFIG";
	/**
	*
	* Range Test module
	*
	* @generated from enum value: RANGETEST_CONFIG = 16;
	*/
	ExcludedModules$1[ExcludedModules$1["RANGETEST_CONFIG"] = 16] = "RANGETEST_CONFIG";
	/**
	*
	* Telemetry module
	*
	* @generated from enum value: TELEMETRY_CONFIG = 32;
	*/
	ExcludedModules$1[ExcludedModules$1["TELEMETRY_CONFIG"] = 32] = "TELEMETRY_CONFIG";
	/**
	*
	* Canned Message module
	*
	* @generated from enum value: CANNEDMSG_CONFIG = 64;
	*/
	ExcludedModules$1[ExcludedModules$1["CANNEDMSG_CONFIG"] = 64] = "CANNEDMSG_CONFIG";
	/**
	*
	* Audio module
	*
	* @generated from enum value: AUDIO_CONFIG = 128;
	*/
	ExcludedModules$1[ExcludedModules$1["AUDIO_CONFIG"] = 128] = "AUDIO_CONFIG";
	/**
	*
	* Remote Hardware module
	*
	* @generated from enum value: REMOTEHARDWARE_CONFIG = 256;
	*/
	ExcludedModules$1[ExcludedModules$1["REMOTEHARDWARE_CONFIG"] = 256] = "REMOTEHARDWARE_CONFIG";
	/**
	*
	* Neighbor Info module
	*
	* @generated from enum value: NEIGHBORINFO_CONFIG = 512;
	*/
	ExcludedModules$1[ExcludedModules$1["NEIGHBORINFO_CONFIG"] = 512] = "NEIGHBORINFO_CONFIG";
	/**
	*
	* Ambient Lighting module
	*
	* @generated from enum value: AMBIENTLIGHTING_CONFIG = 1024;
	*/
	ExcludedModules$1[ExcludedModules$1["AMBIENTLIGHTING_CONFIG"] = 1024] = "AMBIENTLIGHTING_CONFIG";
	/**
	*
	* Detection Sensor module
	*
	* @generated from enum value: DETECTIONSENSOR_CONFIG = 2048;
	*/
	ExcludedModules$1[ExcludedModules$1["DETECTIONSENSOR_CONFIG"] = 2048] = "DETECTIONSENSOR_CONFIG";
	/**
	*
	* Paxcounter module
	*
	* @generated from enum value: PAXCOUNTER_CONFIG = 4096;
	*/
	ExcludedModules$1[ExcludedModules$1["PAXCOUNTER_CONFIG"] = 4096] = "PAXCOUNTER_CONFIG";
	/**
	*
	* Bluetooth config (not technically a module, but used to indicate bluetooth capabilities)
	*
	* @generated from enum value: BLUETOOTH_CONFIG = 8192;
	*/
	ExcludedModules$1[ExcludedModules$1["BLUETOOTH_CONFIG"] = 8192] = "BLUETOOTH_CONFIG";
	/**
	*
	* Network config (not technically a module, but used to indicate network capabilities)
	*
	* @generated from enum value: NETWORK_CONFIG = 16384;
	*/
	ExcludedModules$1[ExcludedModules$1["NETWORK_CONFIG"] = 16384] = "NETWORK_CONFIG";
	return ExcludedModules$1;
}({});
/**
* Describes the enum meshtastic.ExcludedModules.
*/
const ExcludedModulesSchema = /* @__PURE__ */ enumDesc(file_meshtastic_mesh, 4);

//#endregion
//#region lib/meshtastic/admin_pb.ts
var admin_pb_exports = /* @__PURE__ */ __export({
	AdminMessageSchema: () => AdminMessageSchema,
	AdminMessage_BackupLocation: () => AdminMessage_BackupLocation,
	AdminMessage_BackupLocationSchema: () => AdminMessage_BackupLocationSchema,
	AdminMessage_ConfigType: () => AdminMessage_ConfigType,
	AdminMessage_ConfigTypeSchema: () => AdminMessage_ConfigTypeSchema,
	AdminMessage_InputEventSchema: () => AdminMessage_InputEventSchema,
	AdminMessage_ModuleConfigType: () => AdminMessage_ModuleConfigType,
	AdminMessage_ModuleConfigTypeSchema: () => AdminMessage_ModuleConfigTypeSchema,
	HamParametersSchema: () => HamParametersSchema,
	KeyVerificationAdminSchema: () => KeyVerificationAdminSchema,
	KeyVerificationAdmin_MessageType: () => KeyVerificationAdmin_MessageType,
	KeyVerificationAdmin_MessageTypeSchema: () => KeyVerificationAdmin_MessageTypeSchema,
	NodeRemoteHardwarePinsResponseSchema: () => NodeRemoteHardwarePinsResponseSchema,
	SharedContactSchema: () => SharedContactSchema,
	file_meshtastic_admin: () => file_meshtastic_admin
});
/**
* Describes the file meshtastic/admin.proto.
*/
const file_meshtastic_admin = /* @__PURE__ */ fileDesc("ChZtZXNodGFzdGljL2FkbWluLnByb3RvEgptZXNodGFzdGljItYYCgxBZG1pbk1lc3NhZ2USFwoPc2Vzc2lvbl9wYXNza2V5GGUgASgMEh0KE2dldF9jaGFubmVsX3JlcXVlc3QYASABKA1IABIzChRnZXRfY2hhbm5lbF9yZXNwb25zZRgCIAEoCzITLm1lc2h0YXN0aWMuQ2hhbm5lbEgAEhsKEWdldF9vd25lcl9yZXF1ZXN0GAMgASgISAASLgoSZ2V0X293bmVyX3Jlc3BvbnNlGAQgASgLMhAubWVzaHRhc3RpYy5Vc2VySAASQQoSZ2V0X2NvbmZpZ19yZXF1ZXN0GAUgASgOMiMubWVzaHRhc3RpYy5BZG1pbk1lc3NhZ2UuQ29uZmlnVHlwZUgAEjEKE2dldF9jb25maWdfcmVzcG9uc2UYBiABKAsyEi5tZXNodGFzdGljLkNvbmZpZ0gAEk4KGWdldF9tb2R1bGVfY29uZmlnX3JlcXVlc3QYByABKA4yKS5tZXNodGFzdGljLkFkbWluTWVzc2FnZS5Nb2R1bGVDb25maWdUeXBlSAASPgoaZ2V0X21vZHVsZV9jb25maWdfcmVzcG9uc2UYCCABKAsyGC5tZXNodGFzdGljLk1vZHVsZUNvbmZpZ0gAEjQKKmdldF9jYW5uZWRfbWVzc2FnZV9tb2R1bGVfbWVzc2FnZXNfcmVxdWVzdBgKIAEoCEgAEjUKK2dldF9jYW5uZWRfbWVzc2FnZV9tb2R1bGVfbWVzc2FnZXNfcmVzcG9uc2UYCyABKAlIABIlChtnZXRfZGV2aWNlX21ldGFkYXRhX3JlcXVlc3QYDCABKAhIABJCChxnZXRfZGV2aWNlX21ldGFkYXRhX3Jlc3BvbnNlGA0gASgLMhoubWVzaHRhc3RpYy5EZXZpY2VNZXRhZGF0YUgAEh4KFGdldF9yaW5ndG9uZV9yZXF1ZXN0GA4gASgISAASHwoVZ2V0X3Jpbmd0b25lX3Jlc3BvbnNlGA8gASgJSAASLgokZ2V0X2RldmljZV9jb25uZWN0aW9uX3N0YXR1c19yZXF1ZXN0GBAgASgISAASUwolZ2V0X2RldmljZV9jb25uZWN0aW9uX3N0YXR1c19yZXNwb25zZRgRIAEoCzIiLm1lc2h0YXN0aWMuRGV2aWNlQ29ubmVjdGlvblN0YXR1c0gAEjEKDHNldF9oYW1fbW9kZRgSIAEoCzIZLm1lc2h0YXN0aWMuSGFtUGFyYW1ldGVyc0gAEi8KJWdldF9ub2RlX3JlbW90ZV9oYXJkd2FyZV9waW5zX3JlcXVlc3QYEyABKAhIABJcCiZnZXRfbm9kZV9yZW1vdGVfaGFyZHdhcmVfcGluc19yZXNwb25zZRgUIAEoCzIqLm1lc2h0YXN0aWMuTm9kZVJlbW90ZUhhcmR3YXJlUGluc1Jlc3BvbnNlSAASIAoWZW50ZXJfZGZ1X21vZGVfcmVxdWVzdBgVIAEoCEgAEh0KE2RlbGV0ZV9maWxlX3JlcXVlc3QYFiABKAlIABITCglzZXRfc2NhbGUYFyABKA1IABJFChJiYWNrdXBfcHJlZmVyZW5jZXMYGCABKA4yJy5tZXNodGFzdGljLkFkbWluTWVzc2FnZS5CYWNrdXBMb2NhdGlvbkgAEkYKE3Jlc3RvcmVfcHJlZmVyZW5jZXMYGSABKA4yJy5tZXNodGFzdGljLkFkbWluTWVzc2FnZS5CYWNrdXBMb2NhdGlvbkgAEkwKGXJlbW92ZV9iYWNrdXBfcHJlZmVyZW5jZXMYGiABKA4yJy5tZXNodGFzdGljLkFkbWluTWVzc2FnZS5CYWNrdXBMb2NhdGlvbkgAEj8KEHNlbmRfaW5wdXRfZXZlbnQYGyABKAsyIy5tZXNodGFzdGljLkFkbWluTWVzc2FnZS5JbnB1dEV2ZW50SAASJQoJc2V0X293bmVyGCAgASgLMhAubWVzaHRhc3RpYy5Vc2VySAASKgoLc2V0X2NoYW5uZWwYISABKAsyEy5tZXNodGFzdGljLkNoYW5uZWxIABIoCgpzZXRfY29uZmlnGCIgASgLMhIubWVzaHRhc3RpYy5Db25maWdIABI1ChFzZXRfbW9kdWxlX2NvbmZpZxgjIAEoCzIYLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnSAASLAoic2V0X2Nhbm5lZF9tZXNzYWdlX21vZHVsZV9tZXNzYWdlcxgkIAEoCUgAEh4KFHNldF9yaW5ndG9uZV9tZXNzYWdlGCUgASgJSAASGwoRcmVtb3ZlX2J5X25vZGVudW0YJiABKA1IABIbChFzZXRfZmF2b3JpdGVfbm9kZRgnIAEoDUgAEh4KFHJlbW92ZV9mYXZvcml0ZV9ub2RlGCggASgNSAASMgoSc2V0X2ZpeGVkX3Bvc2l0aW9uGCkgASgLMhQubWVzaHRhc3RpYy5Qb3NpdGlvbkgAEh8KFXJlbW92ZV9maXhlZF9wb3NpdGlvbhgqIAEoCEgAEhcKDXNldF90aW1lX29ubHkYKyABKAdIABIfChVnZXRfdWlfY29uZmlnX3JlcXVlc3QYLCABKAhIABI8ChZnZXRfdWlfY29uZmlnX3Jlc3BvbnNlGC0gASgLMhoubWVzaHRhc3RpYy5EZXZpY2VVSUNvbmZpZ0gAEjUKD3N0b3JlX3VpX2NvbmZpZxguIAEoCzIaLm1lc2h0YXN0aWMuRGV2aWNlVUlDb25maWdIABIaChBzZXRfaWdub3JlZF9ub2RlGC8gASgNSAASHQoTcmVtb3ZlX2lnbm9yZWRfbm9kZRgwIAEoDUgAEh0KE2JlZ2luX2VkaXRfc2V0dGluZ3MYQCABKAhIABIeChRjb21taXRfZWRpdF9zZXR0aW5ncxhBIAEoCEgAEjAKC2FkZF9jb250YWN0GEIgASgLMhkubWVzaHRhc3RpYy5TaGFyZWRDb250YWN0SAASPAoQa2V5X3ZlcmlmaWNhdGlvbhhDIAEoCzIgLm1lc2h0YXN0aWMuS2V5VmVyaWZpY2F0aW9uQWRtaW5IABIeChRmYWN0b3J5X3Jlc2V0X2RldmljZRheIAEoBUgAEhwKEnJlYm9vdF9vdGFfc2Vjb25kcxhfIAEoBUgAEhgKDmV4aXRfc2ltdWxhdG9yGGAgASgISAASGAoOcmVib290X3NlY29uZHMYYSABKAVIABIaChBzaHV0ZG93bl9zZWNvbmRzGGIgASgFSAASHgoUZmFjdG9yeV9yZXNldF9jb25maWcYYyABKAVIABIWCgxub2RlZGJfcmVzZXQYZCABKAhIABpTCgpJbnB1dEV2ZW50EhIKCmV2ZW50X2NvZGUYASABKA0SDwoHa2JfY2hhchgCIAEoDRIPCgd0b3VjaF94GAMgASgNEg8KB3RvdWNoX3kYBCABKA0i1gEKCkNvbmZpZ1R5cGUSEQoNREVWSUNFX0NPTkZJRxAAEhMKD1BPU0lUSU9OX0NPTkZJRxABEhAKDFBPV0VSX0NPTkZJRxACEhIKDk5FVFdPUktfQ09ORklHEAMSEgoORElTUExBWV9DT05GSUcQBBIPCgtMT1JBX0NPTkZJRxAFEhQKEEJMVUVUT09USF9DT05GSUcQBhITCg9TRUNVUklUWV9DT05GSUcQBxIVChFTRVNTSU9OS0VZX0NPTkZJRxAIEhMKD0RFVklDRVVJX0NPTkZJRxAJIrsCChBNb2R1bGVDb25maWdUeXBlEg8KC01RVFRfQ09ORklHEAASEQoNU0VSSUFMX0NPTkZJRxABEhMKD0VYVE5PVElGX0NPTkZJRxACEhcKE1NUT1JFRk9SV0FSRF9DT05GSUcQAxIUChBSQU5HRVRFU1RfQ09ORklHEAQSFAoQVEVMRU1FVFJZX0NPTkZJRxAFEhQKEENBTk5FRE1TR19DT05GSUcQBhIQCgxBVURJT19DT05GSUcQBxIZChVSRU1PVEVIQVJEV0FSRV9DT05GSUcQCBIXChNORUlHSEJPUklORk9fQ09ORklHEAkSGgoWQU1CSUVOVExJR0hUSU5HX0NPTkZJRxAKEhoKFkRFVEVDVElPTlNFTlNPUl9DT05GSUcQCxIVChFQQVhDT1VOVEVSX0NPTkZJRxAMIiMKDkJhY2t1cExvY2F0aW9uEgkKBUZMQVNIEAASBgoCU0QQAUIRCg9wYXlsb2FkX3ZhcmlhbnQiWwoNSGFtUGFyYW1ldGVycxIRCgljYWxsX3NpZ24YASABKAkSEAoIdHhfcG93ZXIYAiABKAUSEQoJZnJlcXVlbmN5GAMgASgCEhIKCnNob3J0X25hbWUYBCABKAkiZgoeTm9kZVJlbW90ZUhhcmR3YXJlUGluc1Jlc3BvbnNlEkQKGW5vZGVfcmVtb3RlX2hhcmR3YXJlX3BpbnMYASADKAsyIS5tZXNodGFzdGljLk5vZGVSZW1vdGVIYXJkd2FyZVBpbiJzCg1TaGFyZWRDb250YWN0EhAKCG5vZGVfbnVtGAEgASgNEh4KBHVzZXIYAiABKAsyEC5tZXNodGFzdGljLlVzZXISFQoNc2hvdWxkX2lnbm9yZRgDIAEoCBIZChFtYW51YWxseV92ZXJpZmllZBgEIAEoCCKcAgoUS2V5VmVyaWZpY2F0aW9uQWRtaW4SQgoMbWVzc2FnZV90eXBlGAEgASgOMiwubWVzaHRhc3RpYy5LZXlWZXJpZmljYXRpb25BZG1pbi5NZXNzYWdlVHlwZRIWCg5yZW1vdGVfbm9kZW51bRgCIAEoDRINCgVub25jZRgDIAEoBBIcCg9zZWN1cml0eV9udW1iZXIYBCABKA1IAIgBASJnCgtNZXNzYWdlVHlwZRIZChVJTklUSUFURV9WRVJJRklDQVRJT04QABIbChdQUk9WSURFX1NFQ1VSSVRZX05VTUJFUhABEg0KCURPX1ZFUklGWRACEhEKDURPX05PVF9WRVJJRlkQA0ISChBfc2VjdXJpdHlfbnVtYmVyQmEKFG9yZy5tZXNodGFzdGljLnByb3RvQgtBZG1pblByb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM", [
	file_meshtastic_channel,
	file_meshtastic_config,
	file_meshtastic_connection_status,
	file_meshtastic_device_ui,
	file_meshtastic_mesh,
	file_meshtastic_module_config
]);
/**
* Describes the message meshtastic.AdminMessage.
* Use `create(AdminMessageSchema)` to create a new message.
*/
const AdminMessageSchema = /* @__PURE__ */ messageDesc(file_meshtastic_admin, 0);
/**
* Describes the message meshtastic.AdminMessage.InputEvent.
* Use `create(AdminMessage_InputEventSchema)` to create a new message.
*/
const AdminMessage_InputEventSchema = /* @__PURE__ */ messageDesc(file_meshtastic_admin, 0, 0);
/**
*
* TODO: REPLACE
*
* @generated from enum meshtastic.AdminMessage.ConfigType
*/
let AdminMessage_ConfigType = /* @__PURE__ */ function(AdminMessage_ConfigType$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: DEVICE_CONFIG = 0;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["DEVICE_CONFIG"] = 0] = "DEVICE_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: POSITION_CONFIG = 1;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["POSITION_CONFIG"] = 1] = "POSITION_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: POWER_CONFIG = 2;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["POWER_CONFIG"] = 2] = "POWER_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: NETWORK_CONFIG = 3;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["NETWORK_CONFIG"] = 3] = "NETWORK_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: DISPLAY_CONFIG = 4;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["DISPLAY_CONFIG"] = 4] = "DISPLAY_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: LORA_CONFIG = 5;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["LORA_CONFIG"] = 5] = "LORA_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: BLUETOOTH_CONFIG = 6;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["BLUETOOTH_CONFIG"] = 6] = "BLUETOOTH_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: SECURITY_CONFIG = 7;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["SECURITY_CONFIG"] = 7] = "SECURITY_CONFIG";
	/**
	*
	* Session key config
	*
	* @generated from enum value: SESSIONKEY_CONFIG = 8;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["SESSIONKEY_CONFIG"] = 8] = "SESSIONKEY_CONFIG";
	/**
	*
	* device-ui config
	*
	* @generated from enum value: DEVICEUI_CONFIG = 9;
	*/
	AdminMessage_ConfigType$1[AdminMessage_ConfigType$1["DEVICEUI_CONFIG"] = 9] = "DEVICEUI_CONFIG";
	return AdminMessage_ConfigType$1;
}({});
/**
* Describes the enum meshtastic.AdminMessage.ConfigType.
*/
const AdminMessage_ConfigTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_admin, 0, 0);
/**
*
* TODO: REPLACE
*
* @generated from enum meshtastic.AdminMessage.ModuleConfigType
*/
let AdminMessage_ModuleConfigType = /* @__PURE__ */ function(AdminMessage_ModuleConfigType$1) {
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: MQTT_CONFIG = 0;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["MQTT_CONFIG"] = 0] = "MQTT_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: SERIAL_CONFIG = 1;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["SERIAL_CONFIG"] = 1] = "SERIAL_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: EXTNOTIF_CONFIG = 2;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["EXTNOTIF_CONFIG"] = 2] = "EXTNOTIF_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: STOREFORWARD_CONFIG = 3;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["STOREFORWARD_CONFIG"] = 3] = "STOREFORWARD_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: RANGETEST_CONFIG = 4;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["RANGETEST_CONFIG"] = 4] = "RANGETEST_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: TELEMETRY_CONFIG = 5;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["TELEMETRY_CONFIG"] = 5] = "TELEMETRY_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: CANNEDMSG_CONFIG = 6;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["CANNEDMSG_CONFIG"] = 6] = "CANNEDMSG_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: AUDIO_CONFIG = 7;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["AUDIO_CONFIG"] = 7] = "AUDIO_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: REMOTEHARDWARE_CONFIG = 8;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["REMOTEHARDWARE_CONFIG"] = 8] = "REMOTEHARDWARE_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: NEIGHBORINFO_CONFIG = 9;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["NEIGHBORINFO_CONFIG"] = 9] = "NEIGHBORINFO_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: AMBIENTLIGHTING_CONFIG = 10;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["AMBIENTLIGHTING_CONFIG"] = 10] = "AMBIENTLIGHTING_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: DETECTIONSENSOR_CONFIG = 11;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["DETECTIONSENSOR_CONFIG"] = 11] = "DETECTIONSENSOR_CONFIG";
	/**
	*
	* TODO: REPLACE
	*
	* @generated from enum value: PAXCOUNTER_CONFIG = 12;
	*/
	AdminMessage_ModuleConfigType$1[AdminMessage_ModuleConfigType$1["PAXCOUNTER_CONFIG"] = 12] = "PAXCOUNTER_CONFIG";
	return AdminMessage_ModuleConfigType$1;
}({});
/**
* Describes the enum meshtastic.AdminMessage.ModuleConfigType.
*/
const AdminMessage_ModuleConfigTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_admin, 0, 1);
/**
* @generated from enum meshtastic.AdminMessage.BackupLocation
*/
let AdminMessage_BackupLocation = /* @__PURE__ */ function(AdminMessage_BackupLocation$1) {
	/**
	*
	* Backup to the internal flash
	*
	* @generated from enum value: FLASH = 0;
	*/
	AdminMessage_BackupLocation$1[AdminMessage_BackupLocation$1["FLASH"] = 0] = "FLASH";
	/**
	*
	* Backup to the SD card
	*
	* @generated from enum value: SD = 1;
	*/
	AdminMessage_BackupLocation$1[AdminMessage_BackupLocation$1["SD"] = 1] = "SD";
	return AdminMessage_BackupLocation$1;
}({});
/**
* Describes the enum meshtastic.AdminMessage.BackupLocation.
*/
const AdminMessage_BackupLocationSchema = /* @__PURE__ */ enumDesc(file_meshtastic_admin, 0, 2);
/**
* Describes the message meshtastic.HamParameters.
* Use `create(HamParametersSchema)` to create a new message.
*/
const HamParametersSchema = /* @__PURE__ */ messageDesc(file_meshtastic_admin, 1);
/**
* Describes the message meshtastic.NodeRemoteHardwarePinsResponse.
* Use `create(NodeRemoteHardwarePinsResponseSchema)` to create a new message.
*/
const NodeRemoteHardwarePinsResponseSchema = /* @__PURE__ */ messageDesc(file_meshtastic_admin, 2);
/**
* Describes the message meshtastic.SharedContact.
* Use `create(SharedContactSchema)` to create a new message.
*/
const SharedContactSchema = /* @__PURE__ */ messageDesc(file_meshtastic_admin, 3);
/**
* Describes the message meshtastic.KeyVerificationAdmin.
* Use `create(KeyVerificationAdminSchema)` to create a new message.
*/
const KeyVerificationAdminSchema = /* @__PURE__ */ messageDesc(file_meshtastic_admin, 4);
/**
*
* Three stages of this request.
*
* @generated from enum meshtastic.KeyVerificationAdmin.MessageType
*/
let KeyVerificationAdmin_MessageType = /* @__PURE__ */ function(KeyVerificationAdmin_MessageType$1) {
	/**
	*
	* This is the first stage, where a client initiates
	*
	* @generated from enum value: INITIATE_VERIFICATION = 0;
	*/
	KeyVerificationAdmin_MessageType$1[KeyVerificationAdmin_MessageType$1["INITIATE_VERIFICATION"] = 0] = "INITIATE_VERIFICATION";
	/**
	*
	* After the nonce has been returned over the mesh, the client prompts for the security number
	* And uses this message to provide it to the node.
	*
	* @generated from enum value: PROVIDE_SECURITY_NUMBER = 1;
	*/
	KeyVerificationAdmin_MessageType$1[KeyVerificationAdmin_MessageType$1["PROVIDE_SECURITY_NUMBER"] = 1] = "PROVIDE_SECURITY_NUMBER";
	/**
	*
	* Once the user has compared the verification message, this message notifies the node.
	*
	* @generated from enum value: DO_VERIFY = 2;
	*/
	KeyVerificationAdmin_MessageType$1[KeyVerificationAdmin_MessageType$1["DO_VERIFY"] = 2] = "DO_VERIFY";
	/**
	*
	* This is the cancel path, can be taken at any point
	*
	* @generated from enum value: DO_NOT_VERIFY = 3;
	*/
	KeyVerificationAdmin_MessageType$1[KeyVerificationAdmin_MessageType$1["DO_NOT_VERIFY"] = 3] = "DO_NOT_VERIFY";
	return KeyVerificationAdmin_MessageType$1;
}({});
/**
* Describes the enum meshtastic.KeyVerificationAdmin.MessageType.
*/
const KeyVerificationAdmin_MessageTypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_admin, 4, 0);

//#endregion
//#region lib/meshtastic/apponly_pb.ts
var apponly_pb_exports = /* @__PURE__ */ __export({
	ChannelSetSchema: () => ChannelSetSchema,
	file_meshtastic_apponly: () => file_meshtastic_apponly
});
/**
* Describes the file meshtastic/apponly.proto.
*/
const file_meshtastic_apponly = /* @__PURE__ */ fileDesc("ChhtZXNodGFzdGljL2FwcG9ubHkucHJvdG8SCm1lc2h0YXN0aWMibwoKQ2hhbm5lbFNldBItCghzZXR0aW5ncxgBIAMoCzIbLm1lc2h0YXN0aWMuQ2hhbm5lbFNldHRpbmdzEjIKC2xvcmFfY29uZmlnGAIgASgLMh0ubWVzaHRhc3RpYy5Db25maWcuTG9SYUNvbmZpZ0JjChRvcmcubWVzaHRhc3RpYy5wcm90b0INQXBwT25seVByb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM", [file_meshtastic_channel, file_meshtastic_config]);
/**
* Describes the message meshtastic.ChannelSet.
* Use `create(ChannelSetSchema)` to create a new message.
*/
const ChannelSetSchema = /* @__PURE__ */ messageDesc(file_meshtastic_apponly, 0);

//#endregion
//#region lib/meshtastic/atak_pb.ts
var atak_pb_exports = /* @__PURE__ */ __export({
	ContactSchema: () => ContactSchema,
	GeoChatSchema: () => GeoChatSchema,
	GroupSchema: () => GroupSchema,
	MemberRole: () => MemberRole,
	MemberRoleSchema: () => MemberRoleSchema,
	PLISchema: () => PLISchema,
	StatusSchema: () => StatusSchema,
	TAKPacketSchema: () => TAKPacketSchema,
	Team: () => Team,
	TeamSchema: () => TeamSchema,
	file_meshtastic_atak: () => file_meshtastic_atak
});
/**
* Describes the file meshtastic/atak.proto.
*/
const file_meshtastic_atak = /* @__PURE__ */ fileDesc("ChVtZXNodGFzdGljL2F0YWsucHJvdG8SCm1lc2h0YXN0aWMi+AEKCVRBS1BhY2tldBIVCg1pc19jb21wcmVzc2VkGAEgASgIEiQKB2NvbnRhY3QYAiABKAsyEy5tZXNodGFzdGljLkNvbnRhY3QSIAoFZ3JvdXAYAyABKAsyES5tZXNodGFzdGljLkdyb3VwEiIKBnN0YXR1cxgEIAEoCzISLm1lc2h0YXN0aWMuU3RhdHVzEh4KA3BsaRgFIAEoCzIPLm1lc2h0YXN0aWMuUExJSAASIwoEY2hhdBgGIAEoCzITLm1lc2h0YXN0aWMuR2VvQ2hhdEgAEhAKBmRldGFpbBgHIAEoDEgAQhEKD3BheWxvYWRfdmFyaWFudCJcCgdHZW9DaGF0Eg8KB21lc3NhZ2UYASABKAkSDwoCdG8YAiABKAlIAIgBARIYCgt0b19jYWxsc2lnbhgDIAEoCUgBiAEBQgUKA190b0IOCgxfdG9fY2FsbHNpZ24iTQoFR3JvdXASJAoEcm9sZRgBIAEoDjIWLm1lc2h0YXN0aWMuTWVtYmVyUm9sZRIeCgR0ZWFtGAIgASgOMhAubWVzaHRhc3RpYy5UZWFtIhkKBlN0YXR1cxIPCgdiYXR0ZXJ5GAEgASgNIjQKB0NvbnRhY3QSEAoIY2FsbHNpZ24YASABKAkSFwoPZGV2aWNlX2NhbGxzaWduGAIgASgJIl8KA1BMSRISCgpsYXRpdHVkZV9pGAEgASgPEhMKC2xvbmdpdHVkZV9pGAIgASgPEhAKCGFsdGl0dWRlGAMgASgFEg0KBXNwZWVkGAQgASgNEg4KBmNvdXJzZRgFIAEoDSrAAQoEVGVhbRIUChBVbnNwZWNpZmVkX0NvbG9yEAASCQoFV2hpdGUQARIKCgZZZWxsb3cQAhIKCgZPcmFuZ2UQAxILCgdNYWdlbnRhEAQSBwoDUmVkEAUSCgoGTWFyb29uEAYSCgoGUHVycGxlEAcSDQoJRGFya19CbHVlEAgSCAoEQmx1ZRAJEggKBEN5YW4QChIICgRUZWFsEAsSCQoFR3JlZW4QDBIOCgpEYXJrX0dyZWVuEA0SCQoFQnJvd24QDip/CgpNZW1iZXJSb2xlEg4KClVuc3BlY2lmZWQQABIOCgpUZWFtTWVtYmVyEAESDAoIVGVhbUxlYWQQAhIGCgJIURADEgoKBlNuaXBlchAEEgkKBU1lZGljEAUSEwoPRm9yd2FyZE9ic2VydmVyEAYSBwoDUlRPEAcSBgoCSzkQCEJgChRvcmcubWVzaHRhc3RpYy5wcm90b0IKQVRBS1Byb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM");
/**
* Describes the message meshtastic.TAKPacket.
* Use `create(TAKPacketSchema)` to create a new message.
*/
const TAKPacketSchema = /* @__PURE__ */ messageDesc(file_meshtastic_atak, 0);
/**
* Describes the message meshtastic.GeoChat.
* Use `create(GeoChatSchema)` to create a new message.
*/
const GeoChatSchema = /* @__PURE__ */ messageDesc(file_meshtastic_atak, 1);
/**
* Describes the message meshtastic.Group.
* Use `create(GroupSchema)` to create a new message.
*/
const GroupSchema = /* @__PURE__ */ messageDesc(file_meshtastic_atak, 2);
/**
* Describes the message meshtastic.Status.
* Use `create(StatusSchema)` to create a new message.
*/
const StatusSchema = /* @__PURE__ */ messageDesc(file_meshtastic_atak, 3);
/**
* Describes the message meshtastic.Contact.
* Use `create(ContactSchema)` to create a new message.
*/
const ContactSchema = /* @__PURE__ */ messageDesc(file_meshtastic_atak, 4);
/**
* Describes the message meshtastic.PLI.
* Use `create(PLISchema)` to create a new message.
*/
const PLISchema = /* @__PURE__ */ messageDesc(file_meshtastic_atak, 5);
/**
* @generated from enum meshtastic.Team
*/
let Team = /* @__PURE__ */ function(Team$1) {
	/**
	*
	* Unspecifed
	*
	* @generated from enum value: Unspecifed_Color = 0;
	*/
	Team$1[Team$1["Unspecifed_Color"] = 0] = "Unspecifed_Color";
	/**
	*
	* White
	*
	* @generated from enum value: White = 1;
	*/
	Team$1[Team$1["White"] = 1] = "White";
	/**
	*
	* Yellow
	*
	* @generated from enum value: Yellow = 2;
	*/
	Team$1[Team$1["Yellow"] = 2] = "Yellow";
	/**
	*
	* Orange
	*
	* @generated from enum value: Orange = 3;
	*/
	Team$1[Team$1["Orange"] = 3] = "Orange";
	/**
	*
	* Magenta
	*
	* @generated from enum value: Magenta = 4;
	*/
	Team$1[Team$1["Magenta"] = 4] = "Magenta";
	/**
	*
	* Red
	*
	* @generated from enum value: Red = 5;
	*/
	Team$1[Team$1["Red"] = 5] = "Red";
	/**
	*
	* Maroon
	*
	* @generated from enum value: Maroon = 6;
	*/
	Team$1[Team$1["Maroon"] = 6] = "Maroon";
	/**
	*
	* Purple
	*
	* @generated from enum value: Purple = 7;
	*/
	Team$1[Team$1["Purple"] = 7] = "Purple";
	/**
	*
	* Dark Blue
	*
	* @generated from enum value: Dark_Blue = 8;
	*/
	Team$1[Team$1["Dark_Blue"] = 8] = "Dark_Blue";
	/**
	*
	* Blue
	*
	* @generated from enum value: Blue = 9;
	*/
	Team$1[Team$1["Blue"] = 9] = "Blue";
	/**
	*
	* Cyan
	*
	* @generated from enum value: Cyan = 10;
	*/
	Team$1[Team$1["Cyan"] = 10] = "Cyan";
	/**
	*
	* Teal
	*
	* @generated from enum value: Teal = 11;
	*/
	Team$1[Team$1["Teal"] = 11] = "Teal";
	/**
	*
	* Green
	*
	* @generated from enum value: Green = 12;
	*/
	Team$1[Team$1["Green"] = 12] = "Green";
	/**
	*
	* Dark Green
	*
	* @generated from enum value: Dark_Green = 13;
	*/
	Team$1[Team$1["Dark_Green"] = 13] = "Dark_Green";
	/**
	*
	* Brown
	*
	* @generated from enum value: Brown = 14;
	*/
	Team$1[Team$1["Brown"] = 14] = "Brown";
	return Team$1;
}({});
/**
* Describes the enum meshtastic.Team.
*/
const TeamSchema = /* @__PURE__ */ enumDesc(file_meshtastic_atak, 0);
/**
*
* Role of the group member
*
* @generated from enum meshtastic.MemberRole
*/
let MemberRole = /* @__PURE__ */ function(MemberRole$1) {
	/**
	*
	* Unspecifed
	*
	* @generated from enum value: Unspecifed = 0;
	*/
	MemberRole$1[MemberRole$1["Unspecifed"] = 0] = "Unspecifed";
	/**
	*
	* Team Member
	*
	* @generated from enum value: TeamMember = 1;
	*/
	MemberRole$1[MemberRole$1["TeamMember"] = 1] = "TeamMember";
	/**
	*
	* Team Lead
	*
	* @generated from enum value: TeamLead = 2;
	*/
	MemberRole$1[MemberRole$1["TeamLead"] = 2] = "TeamLead";
	/**
	*
	* Headquarters
	*
	* @generated from enum value: HQ = 3;
	*/
	MemberRole$1[MemberRole$1["HQ"] = 3] = "HQ";
	/**
	*
	* Airsoft enthusiast
	*
	* @generated from enum value: Sniper = 4;
	*/
	MemberRole$1[MemberRole$1["Sniper"] = 4] = "Sniper";
	/**
	*
	* Medic
	*
	* @generated from enum value: Medic = 5;
	*/
	MemberRole$1[MemberRole$1["Medic"] = 5] = "Medic";
	/**
	*
	* ForwardObserver
	*
	* @generated from enum value: ForwardObserver = 6;
	*/
	MemberRole$1[MemberRole$1["ForwardObserver"] = 6] = "ForwardObserver";
	/**
	*
	* Radio Telephone Operator
	*
	* @generated from enum value: RTO = 7;
	*/
	MemberRole$1[MemberRole$1["RTO"] = 7] = "RTO";
	/**
	*
	* Doggo
	*
	* @generated from enum value: K9 = 8;
	*/
	MemberRole$1[MemberRole$1["K9"] = 8] = "K9";
	return MemberRole$1;
}({});
/**
* Describes the enum meshtastic.MemberRole.
*/
const MemberRoleSchema = /* @__PURE__ */ enumDesc(file_meshtastic_atak, 1);

//#endregion
//#region lib/meshtastic/cannedmessages_pb.ts
var cannedmessages_pb_exports = /* @__PURE__ */ __export({
	CannedMessageModuleConfigSchema: () => CannedMessageModuleConfigSchema,
	file_meshtastic_cannedmessages: () => file_meshtastic_cannedmessages
});
/**
* Describes the file meshtastic/cannedmessages.proto.
*/
const file_meshtastic_cannedmessages = /* @__PURE__ */ fileDesc("Ch9tZXNodGFzdGljL2Nhbm5lZG1lc3NhZ2VzLnByb3RvEgptZXNodGFzdGljIi0KGUNhbm5lZE1lc3NhZ2VNb2R1bGVDb25maWcSEAoIbWVzc2FnZXMYASABKAlCbwoUb3JnLm1lc2h0YXN0aWMucHJvdG9CGUNhbm5lZE1lc3NhZ2VDb25maWdQcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z");
/**
* Describes the message meshtastic.CannedMessageModuleConfig.
* Use `create(CannedMessageModuleConfigSchema)` to create a new message.
*/
const CannedMessageModuleConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_cannedmessages, 0);

//#endregion
//#region lib/meshtastic/localonly_pb.ts
var localonly_pb_exports = /* @__PURE__ */ __export({
	LocalConfigSchema: () => LocalConfigSchema,
	LocalModuleConfigSchema: () => LocalModuleConfigSchema,
	file_meshtastic_localonly: () => file_meshtastic_localonly
});
/**
* Describes the file meshtastic/localonly.proto.
*/
const file_meshtastic_localonly = /* @__PURE__ */ fileDesc("ChptZXNodGFzdGljL2xvY2Fsb25seS5wcm90bxIKbWVzaHRhc3RpYyKyAwoLTG9jYWxDb25maWcSLwoGZGV2aWNlGAEgASgLMh8ubWVzaHRhc3RpYy5Db25maWcuRGV2aWNlQ29uZmlnEjMKCHBvc2l0aW9uGAIgASgLMiEubWVzaHRhc3RpYy5Db25maWcuUG9zaXRpb25Db25maWcSLQoFcG93ZXIYAyABKAsyHi5tZXNodGFzdGljLkNvbmZpZy5Qb3dlckNvbmZpZxIxCgduZXR3b3JrGAQgASgLMiAubWVzaHRhc3RpYy5Db25maWcuTmV0d29ya0NvbmZpZxIxCgdkaXNwbGF5GAUgASgLMiAubWVzaHRhc3RpYy5Db25maWcuRGlzcGxheUNvbmZpZxIrCgRsb3JhGAYgASgLMh0ubWVzaHRhc3RpYy5Db25maWcuTG9SYUNvbmZpZxI1CglibHVldG9vdGgYByABKAsyIi5tZXNodGFzdGljLkNvbmZpZy5CbHVldG9vdGhDb25maWcSDwoHdmVyc2lvbhgIIAEoDRIzCghzZWN1cml0eRgJIAEoCzIhLm1lc2h0YXN0aWMuQ29uZmlnLlNlY3VyaXR5Q29uZmlnIvsGChFMb2NhbE1vZHVsZUNvbmZpZxIxCgRtcXR0GAEgASgLMiMubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuTVFUVENvbmZpZxI1CgZzZXJpYWwYAiABKAsyJS5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5TZXJpYWxDb25maWcSUgoVZXh0ZXJuYWxfbm90aWZpY2F0aW9uGAMgASgLMjMubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuRXh0ZXJuYWxOb3RpZmljYXRpb25Db25maWcSQgoNc3RvcmVfZm9yd2FyZBgEIAEoCzIrLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLlN0b3JlRm9yd2FyZENvbmZpZxI8CgpyYW5nZV90ZXN0GAUgASgLMigubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuUmFuZ2VUZXN0Q29uZmlnEjsKCXRlbGVtZXRyeRgGIAEoCzIoLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLlRlbGVtZXRyeUNvbmZpZxJECg5jYW5uZWRfbWVzc2FnZRgHIAEoCzIsLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkNhbm5lZE1lc3NhZ2VDb25maWcSMwoFYXVkaW8YCSABKAsyJC5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5BdWRpb0NvbmZpZxJGCg9yZW1vdGVfaGFyZHdhcmUYCiABKAsyLS5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5SZW1vdGVIYXJkd2FyZUNvbmZpZxJCCg1uZWlnaGJvcl9pbmZvGAsgASgLMisubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuTmVpZ2hib3JJbmZvQ29uZmlnEkgKEGFtYmllbnRfbGlnaHRpbmcYDCABKAsyLi5tZXNodGFzdGljLk1vZHVsZUNvbmZpZy5BbWJpZW50TGlnaHRpbmdDb25maWcSSAoQZGV0ZWN0aW9uX3NlbnNvchgNIAEoCzIuLm1lc2h0YXN0aWMuTW9kdWxlQ29uZmlnLkRldGVjdGlvblNlbnNvckNvbmZpZxI9CgpwYXhjb3VudGVyGA4gASgLMikubWVzaHRhc3RpYy5Nb2R1bGVDb25maWcuUGF4Y291bnRlckNvbmZpZxIPCgd2ZXJzaW9uGAggASgNQmUKFG9yZy5tZXNodGFzdGljLnByb3RvQg9Mb2NhbE9ubHlQcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z", [file_meshtastic_config, file_meshtastic_module_config]);
/**
* Describes the message meshtastic.LocalConfig.
* Use `create(LocalConfigSchema)` to create a new message.
*/
const LocalConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_localonly, 0);
/**
* Describes the message meshtastic.LocalModuleConfig.
* Use `create(LocalModuleConfigSchema)` to create a new message.
*/
const LocalModuleConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_localonly, 1);

//#endregion
//#region lib/meshtastic/clientonly_pb.ts
var clientonly_pb_exports = /* @__PURE__ */ __export({
	DeviceProfileSchema: () => DeviceProfileSchema,
	file_meshtastic_clientonly: () => file_meshtastic_clientonly
});
/**
* Describes the file meshtastic/clientonly.proto.
*/
const file_meshtastic_clientonly = /* @__PURE__ */ fileDesc("ChttZXNodGFzdGljL2NsaWVudG9ubHkucHJvdG8SCm1lc2h0YXN0aWMiqQMKDURldmljZVByb2ZpbGUSFgoJbG9uZ19uYW1lGAEgASgJSACIAQESFwoKc2hvcnRfbmFtZRgCIAEoCUgBiAEBEhgKC2NoYW5uZWxfdXJsGAMgASgJSAKIAQESLAoGY29uZmlnGAQgASgLMhcubWVzaHRhc3RpYy5Mb2NhbENvbmZpZ0gDiAEBEjkKDW1vZHVsZV9jb25maWcYBSABKAsyHS5tZXNodGFzdGljLkxvY2FsTW9kdWxlQ29uZmlnSASIAQESMQoOZml4ZWRfcG9zaXRpb24YBiABKAsyFC5tZXNodGFzdGljLlBvc2l0aW9uSAWIAQESFQoIcmluZ3RvbmUYByABKAlIBogBARIcCg9jYW5uZWRfbWVzc2FnZXMYCCABKAlIB4gBAUIMCgpfbG9uZ19uYW1lQg0KC19zaG9ydF9uYW1lQg4KDF9jaGFubmVsX3VybEIJCgdfY29uZmlnQhAKDl9tb2R1bGVfY29uZmlnQhEKD19maXhlZF9wb3NpdGlvbkILCglfcmluZ3RvbmVCEgoQX2Nhbm5lZF9tZXNzYWdlc0JmChRvcmcubWVzaHRhc3RpYy5wcm90b0IQQ2xpZW50T25seVByb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM", [file_meshtastic_localonly, file_meshtastic_mesh]);
/**
* Describes the message meshtastic.DeviceProfile.
* Use `create(DeviceProfileSchema)` to create a new message.
*/
const DeviceProfileSchema = /* @__PURE__ */ messageDesc(file_meshtastic_clientonly, 0);

//#endregion
//#region lib/meshtastic/mqtt_pb.ts
var mqtt_pb_exports = /* @__PURE__ */ __export({
	MapReportSchema: () => MapReportSchema,
	ServiceEnvelopeSchema: () => ServiceEnvelopeSchema,
	file_meshtastic_mqtt: () => file_meshtastic_mqtt
});
/**
* Describes the file meshtastic/mqtt.proto.
*/
const file_meshtastic_mqtt = /* @__PURE__ */ fileDesc("ChVtZXNodGFzdGljL21xdHQucHJvdG8SCm1lc2h0YXN0aWMiYQoPU2VydmljZUVudmVsb3BlEiYKBnBhY2tldBgBIAEoCzIWLm1lc2h0YXN0aWMuTWVzaFBhY2tldBISCgpjaGFubmVsX2lkGAIgASgJEhIKCmdhdGV3YXlfaWQYAyABKAki3wMKCU1hcFJlcG9ydBIRCglsb25nX25hbWUYASABKAkSEgoKc2hvcnRfbmFtZRgCIAEoCRIyCgRyb2xlGAMgASgOMiQubWVzaHRhc3RpYy5Db25maWcuRGV2aWNlQ29uZmlnLlJvbGUSKwoIaHdfbW9kZWwYBCABKA4yGS5tZXNodGFzdGljLkhhcmR3YXJlTW9kZWwSGAoQZmlybXdhcmVfdmVyc2lvbhgFIAEoCRI4CgZyZWdpb24YBiABKA4yKC5tZXNodGFzdGljLkNvbmZpZy5Mb1JhQ29uZmlnLlJlZ2lvbkNvZGUSPwoMbW9kZW1fcHJlc2V0GAcgASgOMikubWVzaHRhc3RpYy5Db25maWcuTG9SYUNvbmZpZy5Nb2RlbVByZXNldBIbChNoYXNfZGVmYXVsdF9jaGFubmVsGAggASgIEhIKCmxhdGl0dWRlX2kYCSABKA8SEwoLbG9uZ2l0dWRlX2kYCiABKA8SEAoIYWx0aXR1ZGUYCyABKAUSGgoScG9zaXRpb25fcHJlY2lzaW9uGAwgASgNEh4KFm51bV9vbmxpbmVfbG9jYWxfbm9kZXMYDSABKA0SIQoZaGFzX29wdGVkX3JlcG9ydF9sb2NhdGlvbhgOIAEoCEJgChRvcmcubWVzaHRhc3RpYy5wcm90b0IKTVFUVFByb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM", [file_meshtastic_config, file_meshtastic_mesh]);
/**
* Describes the message meshtastic.ServiceEnvelope.
* Use `create(ServiceEnvelopeSchema)` to create a new message.
*/
const ServiceEnvelopeSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mqtt, 0);
/**
* Describes the message meshtastic.MapReport.
* Use `create(MapReportSchema)` to create a new message.
*/
const MapReportSchema = /* @__PURE__ */ messageDesc(file_meshtastic_mqtt, 1);

//#endregion
//#region lib/meshtastic/paxcount_pb.ts
var paxcount_pb_exports = /* @__PURE__ */ __export({
	PaxcountSchema: () => PaxcountSchema,
	file_meshtastic_paxcount: () => file_meshtastic_paxcount
});
/**
* Describes the file meshtastic/paxcount.proto.
*/
const file_meshtastic_paxcount = /* @__PURE__ */ fileDesc("ChltZXNodGFzdGljL3BheGNvdW50LnByb3RvEgptZXNodGFzdGljIjUKCFBheGNvdW50EgwKBHdpZmkYASABKA0SCwoDYmxlGAIgASgNEg4KBnVwdGltZRgDIAEoDUJkChRvcmcubWVzaHRhc3RpYy5wcm90b0IOUGF4Y291bnRQcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z");
/**
* Describes the message meshtastic.Paxcount.
* Use `create(PaxcountSchema)` to create a new message.
*/
const PaxcountSchema = /* @__PURE__ */ messageDesc(file_meshtastic_paxcount, 0);

//#endregion
//#region lib/meshtastic/powermon_pb.ts
var powermon_pb_exports = /* @__PURE__ */ __export({
	PowerMonSchema: () => PowerMonSchema,
	PowerMon_State: () => PowerMon_State,
	PowerMon_StateSchema: () => PowerMon_StateSchema,
	PowerStressMessageSchema: () => PowerStressMessageSchema,
	PowerStressMessage_Opcode: () => PowerStressMessage_Opcode,
	PowerStressMessage_OpcodeSchema: () => PowerStressMessage_OpcodeSchema,
	file_meshtastic_powermon: () => file_meshtastic_powermon
});
/**
* Describes the file meshtastic/powermon.proto.
*/
const file_meshtastic_powermon = /* @__PURE__ */ fileDesc("ChltZXNodGFzdGljL3Bvd2VybW9uLnByb3RvEgptZXNodGFzdGljIuABCghQb3dlck1vbiLTAQoFU3RhdGUSCAoETm9uZRAAEhEKDUNQVV9EZWVwU2xlZXAQARISCg5DUFVfTGlnaHRTbGVlcBACEgwKCFZleHQxX09uEAQSDQoJTG9yYV9SWE9uEAgSDQoJTG9yYV9UWE9uEBASEQoNTG9yYV9SWEFjdGl2ZRAgEgkKBUJUX09uEEASCwoGTEVEX09uEIABEg4KCVNjcmVlbl9PbhCAAhITCg5TY3JlZW5fRHJhd2luZxCABBIMCgdXaWZpX09uEIAIEg8KCkdQU19BY3RpdmUQgBAi/wIKElBvd2VyU3RyZXNzTWVzc2FnZRIyCgNjbWQYASABKA4yJS5tZXNodGFzdGljLlBvd2VyU3RyZXNzTWVzc2FnZS5PcGNvZGUSEwoLbnVtX3NlY29uZHMYAiABKAIinwIKBk9wY29kZRIJCgVVTlNFVBAAEg4KClBSSU5UX0lORk8QARIPCgtGT1JDRV9RVUlFVBACEg0KCUVORF9RVUlFVBADEg0KCVNDUkVFTl9PThAQEg4KClNDUkVFTl9PRkYQERIMCghDUFVfSURMRRAgEhEKDUNQVV9ERUVQU0xFRVAQIRIOCgpDUFVfRlVMTE9OECISCgoGTEVEX09OEDASCwoHTEVEX09GRhAxEgwKCExPUkFfT0ZGEEASCwoHTE9SQV9UWBBBEgsKB0xPUkFfUlgQQhIKCgZCVF9PRkYQUBIJCgVCVF9PThBREgwKCFdJRklfT0ZGEGASCwoHV0lGSV9PThBhEgsKB0dQU19PRkYQcBIKCgZHUFNfT04QcUJkChRvcmcubWVzaHRhc3RpYy5wcm90b0IOUG93ZXJNb25Qcm90b3NaImdpdGh1Yi5jb20vbWVzaHRhc3RpYy9nby9nZW5lcmF0ZWSqAhRNZXNodGFzdGljLlByb3RvYnVmc7oCAGIGcHJvdG8z");
/**
* Describes the message meshtastic.PowerMon.
* Use `create(PowerMonSchema)` to create a new message.
*/
const PowerMonSchema = /* @__PURE__ */ messageDesc(file_meshtastic_powermon, 0);
/**
* Any significant power changing event in meshtastic should be tagged with a powermon state transition.
* If you are making new meshtastic features feel free to add new entries at the end of this definition.
*
* @generated from enum meshtastic.PowerMon.State
*/
let PowerMon_State = /* @__PURE__ */ function(PowerMon_State$1) {
	/**
	* @generated from enum value: None = 0;
	*/
	PowerMon_State$1[PowerMon_State$1["None"] = 0] = "None";
	/**
	* @generated from enum value: CPU_DeepSleep = 1;
	*/
	PowerMon_State$1[PowerMon_State$1["CPU_DeepSleep"] = 1] = "CPU_DeepSleep";
	/**
	* @generated from enum value: CPU_LightSleep = 2;
	*/
	PowerMon_State$1[PowerMon_State$1["CPU_LightSleep"] = 2] = "CPU_LightSleep";
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
	PowerMon_State$1[PowerMon_State$1["Vext1_On"] = 4] = "Vext1_On";
	/**
	* @generated from enum value: Lora_RXOn = 8;
	*/
	PowerMon_State$1[PowerMon_State$1["Lora_RXOn"] = 8] = "Lora_RXOn";
	/**
	* @generated from enum value: Lora_TXOn = 16;
	*/
	PowerMon_State$1[PowerMon_State$1["Lora_TXOn"] = 16] = "Lora_TXOn";
	/**
	* @generated from enum value: Lora_RXActive = 32;
	*/
	PowerMon_State$1[PowerMon_State$1["Lora_RXActive"] = 32] = "Lora_RXActive";
	/**
	* @generated from enum value: BT_On = 64;
	*/
	PowerMon_State$1[PowerMon_State$1["BT_On"] = 64] = "BT_On";
	/**
	* @generated from enum value: LED_On = 128;
	*/
	PowerMon_State$1[PowerMon_State$1["LED_On"] = 128] = "LED_On";
	/**
	* @generated from enum value: Screen_On = 256;
	*/
	PowerMon_State$1[PowerMon_State$1["Screen_On"] = 256] = "Screen_On";
	/**
	* @generated from enum value: Screen_Drawing = 512;
	*/
	PowerMon_State$1[PowerMon_State$1["Screen_Drawing"] = 512] = "Screen_Drawing";
	/**
	* @generated from enum value: Wifi_On = 1024;
	*/
	PowerMon_State$1[PowerMon_State$1["Wifi_On"] = 1024] = "Wifi_On";
	/**
	*
	* GPS is actively trying to find our location
	* See GPSPowerState for more details
	*
	* @generated from enum value: GPS_Active = 2048;
	*/
	PowerMon_State$1[PowerMon_State$1["GPS_Active"] = 2048] = "GPS_Active";
	return PowerMon_State$1;
}({});
/**
* Describes the enum meshtastic.PowerMon.State.
*/
const PowerMon_StateSchema = /* @__PURE__ */ enumDesc(file_meshtastic_powermon, 0, 0);
/**
* Describes the message meshtastic.PowerStressMessage.
* Use `create(PowerStressMessageSchema)` to create a new message.
*/
const PowerStressMessageSchema = /* @__PURE__ */ messageDesc(file_meshtastic_powermon, 1);
/**
*
* What operation would we like the UUT to perform.
* note: senders should probably set want_response in their request packets, so that they can know when the state
* machine has started processing their request
*
* @generated from enum meshtastic.PowerStressMessage.Opcode
*/
let PowerStressMessage_Opcode = /* @__PURE__ */ function(PowerStressMessage_Opcode$1) {
	/**
	*
	* Unset/unused
	*
	* @generated from enum value: UNSET = 0;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["UNSET"] = 0] = "UNSET";
	/**
	* Print board version slog and send an ack that we are alive and ready to process commands
	*
	* @generated from enum value: PRINT_INFO = 1;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["PRINT_INFO"] = 1] = "PRINT_INFO";
	/**
	* Try to turn off all automatic processing of packets, screen, sleeping, etc (to make it easier to measure in isolation)
	*
	* @generated from enum value: FORCE_QUIET = 2;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["FORCE_QUIET"] = 2] = "FORCE_QUIET";
	/**
	* Stop powerstress processing - probably by just rebooting the board
	*
	* @generated from enum value: END_QUIET = 3;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["END_QUIET"] = 3] = "END_QUIET";
	/**
	* Turn the screen on
	*
	* @generated from enum value: SCREEN_ON = 16;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["SCREEN_ON"] = 16] = "SCREEN_ON";
	/**
	* Turn the screen off
	*
	* @generated from enum value: SCREEN_OFF = 17;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["SCREEN_OFF"] = 17] = "SCREEN_OFF";
	/**
	* Let the CPU run but we assume mostly idling for num_seconds
	*
	* @generated from enum value: CPU_IDLE = 32;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["CPU_IDLE"] = 32] = "CPU_IDLE";
	/**
	* Force deep sleep for FIXME seconds
	*
	* @generated from enum value: CPU_DEEPSLEEP = 33;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["CPU_DEEPSLEEP"] = 33] = "CPU_DEEPSLEEP";
	/**
	* Spin the CPU as fast as possible for num_seconds
	*
	* @generated from enum value: CPU_FULLON = 34;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["CPU_FULLON"] = 34] = "CPU_FULLON";
	/**
	* Turn the LED on for num_seconds (and leave it on - for baseline power measurement purposes)
	*
	* @generated from enum value: LED_ON = 48;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["LED_ON"] = 48] = "LED_ON";
	/**
	* Force the LED off for num_seconds
	*
	* @generated from enum value: LED_OFF = 49;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["LED_OFF"] = 49] = "LED_OFF";
	/**
	* Completely turn off the LORA radio for num_seconds
	*
	* @generated from enum value: LORA_OFF = 64;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["LORA_OFF"] = 64] = "LORA_OFF";
	/**
	* Send Lora packets for num_seconds
	*
	* @generated from enum value: LORA_TX = 65;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["LORA_TX"] = 65] = "LORA_TX";
	/**
	* Receive Lora packets for num_seconds (node will be mostly just listening, unless an external agent is helping stress this by sending packets on the current channel)
	*
	* @generated from enum value: LORA_RX = 66;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["LORA_RX"] = 66] = "LORA_RX";
	/**
	* Turn off the BT radio for num_seconds
	*
	* @generated from enum value: BT_OFF = 80;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["BT_OFF"] = 80] = "BT_OFF";
	/**
	* Turn on the BT radio for num_seconds
	*
	* @generated from enum value: BT_ON = 81;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["BT_ON"] = 81] = "BT_ON";
	/**
	* Turn off the WIFI radio for num_seconds
	*
	* @generated from enum value: WIFI_OFF = 96;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["WIFI_OFF"] = 96] = "WIFI_OFF";
	/**
	* Turn on the WIFI radio for num_seconds
	*
	* @generated from enum value: WIFI_ON = 97;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["WIFI_ON"] = 97] = "WIFI_ON";
	/**
	* Turn off the GPS radio for num_seconds
	*
	* @generated from enum value: GPS_OFF = 112;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["GPS_OFF"] = 112] = "GPS_OFF";
	/**
	* Turn on the GPS radio for num_seconds
	*
	* @generated from enum value: GPS_ON = 113;
	*/
	PowerStressMessage_Opcode$1[PowerStressMessage_Opcode$1["GPS_ON"] = 113] = "GPS_ON";
	return PowerStressMessage_Opcode$1;
}({});
/**
* Describes the enum meshtastic.PowerStressMessage.Opcode.
*/
const PowerStressMessage_OpcodeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_powermon, 1, 0);

//#endregion
//#region lib/meshtastic/remote_hardware_pb.ts
var remote_hardware_pb_exports = /* @__PURE__ */ __export({
	HardwareMessageSchema: () => HardwareMessageSchema,
	HardwareMessage_Type: () => HardwareMessage_Type,
	HardwareMessage_TypeSchema: () => HardwareMessage_TypeSchema,
	file_meshtastic_remote_hardware: () => file_meshtastic_remote_hardware
});
/**
* Describes the file meshtastic/remote_hardware.proto.
*/
const file_meshtastic_remote_hardware = /* @__PURE__ */ fileDesc("CiBtZXNodGFzdGljL3JlbW90ZV9oYXJkd2FyZS5wcm90bxIKbWVzaHRhc3RpYyLWAQoPSGFyZHdhcmVNZXNzYWdlEi4KBHR5cGUYASABKA4yIC5tZXNodGFzdGljLkhhcmR3YXJlTWVzc2FnZS5UeXBlEhEKCWdwaW9fbWFzaxgCIAEoBBISCgpncGlvX3ZhbHVlGAMgASgEImwKBFR5cGUSCQoFVU5TRVQQABIPCgtXUklURV9HUElPUxABEg8KC1dBVENIX0dQSU9TEAISEQoNR1BJT1NfQ0hBTkdFRBADEg4KClJFQURfR1BJT1MQBBIUChBSRUFEX0dQSU9TX1JFUExZEAVCZAoUb3JnLm1lc2h0YXN0aWMucHJvdG9CDlJlbW90ZUhhcmR3YXJlWiJnaXRodWIuY29tL21lc2h0YXN0aWMvZ28vZ2VuZXJhdGVkqgIUTWVzaHRhc3RpYy5Qcm90b2J1ZnO6AgBiBnByb3RvMw");
/**
* Describes the message meshtastic.HardwareMessage.
* Use `create(HardwareMessageSchema)` to create a new message.
*/
const HardwareMessageSchema = /* @__PURE__ */ messageDesc(file_meshtastic_remote_hardware, 0);
/**
*
* TODO: REPLACE
*
* @generated from enum meshtastic.HardwareMessage.Type
*/
let HardwareMessage_Type = /* @__PURE__ */ function(HardwareMessage_Type$1) {
	/**
	*
	* Unset/unused
	*
	* @generated from enum value: UNSET = 0;
	*/
	HardwareMessage_Type$1[HardwareMessage_Type$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* Set gpio gpios based on gpio_mask/gpio_value
	*
	* @generated from enum value: WRITE_GPIOS = 1;
	*/
	HardwareMessage_Type$1[HardwareMessage_Type$1["WRITE_GPIOS"] = 1] = "WRITE_GPIOS";
	/**
	*
	* We are now interested in watching the gpio_mask gpios.
	* If the selected gpios change, please broadcast GPIOS_CHANGED.
	* Will implicitly change the gpios requested to be INPUT gpios.
	*
	* @generated from enum value: WATCH_GPIOS = 2;
	*/
	HardwareMessage_Type$1[HardwareMessage_Type$1["WATCH_GPIOS"] = 2] = "WATCH_GPIOS";
	/**
	*
	* The gpios listed in gpio_mask have changed, the new values are listed in gpio_value
	*
	* @generated from enum value: GPIOS_CHANGED = 3;
	*/
	HardwareMessage_Type$1[HardwareMessage_Type$1["GPIOS_CHANGED"] = 3] = "GPIOS_CHANGED";
	/**
	*
	* Read the gpios specified in gpio_mask, send back a READ_GPIOS_REPLY reply with gpio_value populated
	*
	* @generated from enum value: READ_GPIOS = 4;
	*/
	HardwareMessage_Type$1[HardwareMessage_Type$1["READ_GPIOS"] = 4] = "READ_GPIOS";
	/**
	*
	* A reply to READ_GPIOS. gpio_mask and gpio_value will be populated
	*
	* @generated from enum value: READ_GPIOS_REPLY = 5;
	*/
	HardwareMessage_Type$1[HardwareMessage_Type$1["READ_GPIOS_REPLY"] = 5] = "READ_GPIOS_REPLY";
	return HardwareMessage_Type$1;
}({});
/**
* Describes the enum meshtastic.HardwareMessage.Type.
*/
const HardwareMessage_TypeSchema = /* @__PURE__ */ enumDesc(file_meshtastic_remote_hardware, 0, 0);

//#endregion
//#region lib/meshtastic/rtttl_pb.ts
var rtttl_pb_exports = /* @__PURE__ */ __export({
	RTTTLConfigSchema: () => RTTTLConfigSchema,
	file_meshtastic_rtttl: () => file_meshtastic_rtttl
});
/**
* Describes the file meshtastic/rtttl.proto.
*/
const file_meshtastic_rtttl = /* @__PURE__ */ fileDesc("ChZtZXNodGFzdGljL3J0dHRsLnByb3RvEgptZXNodGFzdGljIh8KC1JUVFRMQ29uZmlnEhAKCHJpbmd0b25lGAEgASgJQmcKFG9yZy5tZXNodGFzdGljLnByb3RvQhFSVFRUTENvbmZpZ1Byb3Rvc1oiZ2l0aHViLmNvbS9tZXNodGFzdGljL2dvL2dlbmVyYXRlZKoCFE1lc2h0YXN0aWMuUHJvdG9idWZzugIAYgZwcm90bzM");
/**
* Describes the message meshtastic.RTTTLConfig.
* Use `create(RTTTLConfigSchema)` to create a new message.
*/
const RTTTLConfigSchema = /* @__PURE__ */ messageDesc(file_meshtastic_rtttl, 0);

//#endregion
//#region lib/meshtastic/storeforward_pb.ts
var storeforward_pb_exports = /* @__PURE__ */ __export({
	StoreAndForwardSchema: () => StoreAndForwardSchema,
	StoreAndForward_HeartbeatSchema: () => StoreAndForward_HeartbeatSchema,
	StoreAndForward_HistorySchema: () => StoreAndForward_HistorySchema,
	StoreAndForward_RequestResponse: () => StoreAndForward_RequestResponse,
	StoreAndForward_RequestResponseSchema: () => StoreAndForward_RequestResponseSchema,
	StoreAndForward_StatisticsSchema: () => StoreAndForward_StatisticsSchema,
	file_meshtastic_storeforward: () => file_meshtastic_storeforward
});
/**
* Describes the file meshtastic/storeforward.proto.
*/
const file_meshtastic_storeforward = /* @__PURE__ */ fileDesc("Ch1tZXNodGFzdGljL3N0b3JlZm9yd2FyZC5wcm90bxIKbWVzaHRhc3RpYyKcBwoPU3RvcmVBbmRGb3J3YXJkEjcKAnJyGAEgASgOMisubWVzaHRhc3RpYy5TdG9yZUFuZEZvcndhcmQuUmVxdWVzdFJlc3BvbnNlEjcKBXN0YXRzGAIgASgLMiYubWVzaHRhc3RpYy5TdG9yZUFuZEZvcndhcmQuU3RhdGlzdGljc0gAEjYKB2hpc3RvcnkYAyABKAsyIy5tZXNodGFzdGljLlN0b3JlQW5kRm9yd2FyZC5IaXN0b3J5SAASOgoJaGVhcnRiZWF0GAQgASgLMiUubWVzaHRhc3RpYy5TdG9yZUFuZEZvcndhcmQuSGVhcnRiZWF0SAASDgoEdGV4dBgFIAEoDEgAGs0BCgpTdGF0aXN0aWNzEhYKDm1lc3NhZ2VzX3RvdGFsGAEgASgNEhYKDm1lc3NhZ2VzX3NhdmVkGAIgASgNEhQKDG1lc3NhZ2VzX21heBgDIAEoDRIPCgd1cF90aW1lGAQgASgNEhAKCHJlcXVlc3RzGAUgASgNEhgKEHJlcXVlc3RzX2hpc3RvcnkYBiABKA0SEQoJaGVhcnRiZWF0GAcgASgIEhIKCnJldHVybl9tYXgYCCABKA0SFQoNcmV0dXJuX3dpbmRvdxgJIAEoDRpJCgdIaXN0b3J5EhgKEGhpc3RvcnlfbWVzc2FnZXMYASABKA0SDgoGd2luZG93GAIgASgNEhQKDGxhc3RfcmVxdWVzdBgDIAEoDRouCglIZWFydGJlYXQSDgoGcGVyaW9kGAEgASgNEhEKCXNlY29uZGFyeRgCIAEoDSK8AgoPUmVxdWVzdFJlc3BvbnNlEgkKBVVOU0VUEAASEAoMUk9VVEVSX0VSUk9SEAESFAoQUk9VVEVSX0hFQVJUQkVBVBACEg8KC1JPVVRFUl9QSU5HEAMSDwoLUk9VVEVSX1BPTkcQBBIPCgtST1VURVJfQlVTWRAFEhIKDlJPVVRFUl9ISVNUT1JZEAYSEAoMUk9VVEVSX1NUQVRTEAcSFgoSUk9VVEVSX1RFWFRfRElSRUNUEAgSGQoVUk9VVEVSX1RFWFRfQlJPQURDQVNUEAkSEAoMQ0xJRU5UX0VSUk9SEEASEgoOQ0xJRU5UX0hJU1RPUlkQQRIQCgxDTElFTlRfU1RBVFMQQhIPCgtDTElFTlRfUElORxBDEg8KC0NMSUVOVF9QT05HEEQSEAoMQ0xJRU5UX0FCT1JUEGpCCQoHdmFyaWFudEJrChRvcmcubWVzaHRhc3RpYy5wcm90b0IVU3RvcmVBbmRGb3J3YXJkUHJvdG9zWiJnaXRodWIuY29tL21lc2h0YXN0aWMvZ28vZ2VuZXJhdGVkqgIUTWVzaHRhc3RpYy5Qcm90b2J1ZnO6AgBiBnByb3RvMw");
/**
* Describes the message meshtastic.StoreAndForward.
* Use `create(StoreAndForwardSchema)` to create a new message.
*/
const StoreAndForwardSchema = /* @__PURE__ */ messageDesc(file_meshtastic_storeforward, 0);
/**
* Describes the message meshtastic.StoreAndForward.Statistics.
* Use `create(StoreAndForward_StatisticsSchema)` to create a new message.
*/
const StoreAndForward_StatisticsSchema = /* @__PURE__ */ messageDesc(file_meshtastic_storeforward, 0, 0);
/**
* Describes the message meshtastic.StoreAndForward.History.
* Use `create(StoreAndForward_HistorySchema)` to create a new message.
*/
const StoreAndForward_HistorySchema = /* @__PURE__ */ messageDesc(file_meshtastic_storeforward, 0, 1);
/**
* Describes the message meshtastic.StoreAndForward.Heartbeat.
* Use `create(StoreAndForward_HeartbeatSchema)` to create a new message.
*/
const StoreAndForward_HeartbeatSchema = /* @__PURE__ */ messageDesc(file_meshtastic_storeforward, 0, 2);
/**
*
* 001 - 063 = From Router
* 064 - 127 = From Client
*
* @generated from enum meshtastic.StoreAndForward.RequestResponse
*/
let StoreAndForward_RequestResponse = /* @__PURE__ */ function(StoreAndForward_RequestResponse$1) {
	/**
	*
	* Unset/unused
	*
	* @generated from enum value: UNSET = 0;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["UNSET"] = 0] = "UNSET";
	/**
	*
	* Router is an in error state.
	*
	* @generated from enum value: ROUTER_ERROR = 1;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_ERROR"] = 1] = "ROUTER_ERROR";
	/**
	*
	* Router heartbeat
	*
	* @generated from enum value: ROUTER_HEARTBEAT = 2;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_HEARTBEAT"] = 2] = "ROUTER_HEARTBEAT";
	/**
	*
	* Router has requested the client respond. This can work as a
	* "are you there" message.
	*
	* @generated from enum value: ROUTER_PING = 3;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_PING"] = 3] = "ROUTER_PING";
	/**
	*
	* The response to a "Ping"
	*
	* @generated from enum value: ROUTER_PONG = 4;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_PONG"] = 4] = "ROUTER_PONG";
	/**
	*
	* Router is currently busy. Please try again later.
	*
	* @generated from enum value: ROUTER_BUSY = 5;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_BUSY"] = 5] = "ROUTER_BUSY";
	/**
	*
	* Router is responding to a request for history.
	*
	* @generated from enum value: ROUTER_HISTORY = 6;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_HISTORY"] = 6] = "ROUTER_HISTORY";
	/**
	*
	* Router is responding to a request for stats.
	*
	* @generated from enum value: ROUTER_STATS = 7;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_STATS"] = 7] = "ROUTER_STATS";
	/**
	*
	* Router sends a text message from its history that was a direct message.
	*
	* @generated from enum value: ROUTER_TEXT_DIRECT = 8;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_TEXT_DIRECT"] = 8] = "ROUTER_TEXT_DIRECT";
	/**
	*
	* Router sends a text message from its history that was a broadcast.
	*
	* @generated from enum value: ROUTER_TEXT_BROADCAST = 9;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["ROUTER_TEXT_BROADCAST"] = 9] = "ROUTER_TEXT_BROADCAST";
	/**
	*
	* Client is an in error state.
	*
	* @generated from enum value: CLIENT_ERROR = 64;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["CLIENT_ERROR"] = 64] = "CLIENT_ERROR";
	/**
	*
	* Client has requested a replay from the router.
	*
	* @generated from enum value: CLIENT_HISTORY = 65;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["CLIENT_HISTORY"] = 65] = "CLIENT_HISTORY";
	/**
	*
	* Client has requested stats from the router.
	*
	* @generated from enum value: CLIENT_STATS = 66;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["CLIENT_STATS"] = 66] = "CLIENT_STATS";
	/**
	*
	* Client has requested the router respond. This can work as a
	* "are you there" message.
	*
	* @generated from enum value: CLIENT_PING = 67;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["CLIENT_PING"] = 67] = "CLIENT_PING";
	/**
	*
	* The response to a "Ping"
	*
	* @generated from enum value: CLIENT_PONG = 68;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["CLIENT_PONG"] = 68] = "CLIENT_PONG";
	/**
	*
	* Client has requested that the router abort processing the client's request
	*
	* @generated from enum value: CLIENT_ABORT = 106;
	*/
	StoreAndForward_RequestResponse$1[StoreAndForward_RequestResponse$1["CLIENT_ABORT"] = 106] = "CLIENT_ABORT";
	return StoreAndForward_RequestResponse$1;
}({});
/**
* Describes the enum meshtastic.StoreAndForward.RequestResponse.
*/
const StoreAndForward_RequestResponseSchema = /* @__PURE__ */ enumDesc(file_meshtastic_storeforward, 0, 0);

//#endregion
export { atak_pb_exports as ATAK, admin_pb_exports as Admin, apponly_pb_exports as AppOnly, cannedmessages_pb_exports as CannedMessages, channel_pb_exports as Channel, clientonly_pb_exports as ClientOnly, config_pb_exports as Config, connection_status_pb_exports as ConnectionStatus, localonly_pb_exports as LocalOnly, mesh_pb_exports as Mesh, module_config_pb_exports as ModuleConfig, mqtt_pb_exports as Mqtt, paxcount_pb_exports as PaxCount, portnums_pb_exports as Portnums, powermon_pb_exports as PowerMon, remote_hardware_pb_exports as RemoteHardware, rtttl_pb_exports as Rtttl, storeforward_pb_exports as StoreForward, telemetry_pb_exports as Telemetry, xmodem_pb_exports as Xmodem };