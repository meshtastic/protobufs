#!/usr/bin/env python3
"""Validate the registry data and generate its JSON.

The registries - hardware vendors and devices, regulatory regions, modem presets -
are data, not schema: adding a board or a region never touches a .proto. Their
source is YAML under registry/. This tool checks it against the rules below and
writes registry/generated/*.json, the protobuf JSON mapping of the registry
messages. Firmware build scripts and clients read that JSON, and `buf convert`
serializes it to the binary form.

    python tools/gen_registry.py                     # regenerate registry/generated/
    python tools/gen_registry.py --check             # CI: rules hold, generated files current
    python tools/gen_registry.py --check --base origin/trident
                                                     # also: allocations kept, revisions raised
    python tools/gen_registry.py --selftest          # the rules reject what they should

Hardware: one file per vendor in registry/hardware/, named after the vendor slug;
00-legacy.yaml is vendor 0x00. Vendor ids are 0x00-0x3F and device ids 0x01-0xFE,
because 0x00 (the vendor as a whole) and 0xFF (any other device from that vendor)
are reserved, and every packed hw_model then fits two varint bytes. Ids and slugs
are unique. An allocated id is permanent: against --base it may not disappear or
change its slug. Each hardware registry's revision is its entry count, which
therefore only grows.

Regions and presets: entries name a RegionCode or ModemPreset, values are in range,
and any change to the data must raise `revision` in its YAML. regions.yaml holds
four tables - regions, profiles, preset lists, swap groups - that refer to each
other by name, and each fact is stated once: an unreferenced or duplicated table
entry is rejected. Frequencies and bandwidths are exact hertz and duty cycles per
mille; a band edge with no exact value rounds inward. UNSET is a copy of US. Every
preset a region permits, and every bandwidth code that is not NO_PLAN_CELLS, gets a
slot plan (SCHEMA.md section 6) that stays inside its block.

Roles: every Role value has exactly one roles entry, row names are unique, a row's
switches apply to its role, no two rows share a role, switches and TAK flags, every
role has a row without switches, and any change raises `revision`.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit('error: this needs PyYAML (pip install pyyaml)')

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
REGISTRY = os.path.join(ROOT, 'registry')
HARDWARE = os.path.join(REGISTRY, 'hardware')
GENERATED = os.path.join(REGISTRY, 'generated')
COMMON_PROTO = os.path.join(ROOT, 'meshtastic', 'common.proto')
CONFIG_PROTO = os.path.join(ROOT, 'meshtastic', 'config.proto')
MODULE_CONFIG_PROTO = os.path.join(ROOT, 'meshtastic', 'module_config.proto')

LEGACY_FILE = '00-legacy.yaml'
VENDOR_MAX = 0x3F
DEVICE_MIN, DEVICE_MAX = 0x01, 0xFE
TWO_VARINT_BYTES = 0x4000

VENDOR_SLUG = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
UPPER_WORDS = re.compile(r'^[A-Z0-9]+(?:_[A-Z0-9]+)*$')

REGION_TABLES = ('preset_lists', 'profiles', 'swap_groups', 'regions')
REGION_INTS = ('freq_start_hz', 'freq_end_hz', 'duty_cycle_permille', 'power_limit_dbm')
REGION_BOOLS = ('frequency_switching', 'wide_lora', 'edge_clearance')
REGION_KEYS = ('region', 'profile') + REGION_INTS + ('frequency_switching', 'wide_lora', 'override_slot',
                                                     'edge_clearance')
PROFILE_INTS = ('spacing_hz', 'unit_channel_hz', 'max_bandwidth_hz', 'position_throttle', 'telemetry_throttle',
                'default_hop_start')
PROFILE_BOOLS = ('audio_permitted', 'licensed_only')
PROFILE_KEYS = ('name', 'preset_list', 'default_preset') + PROFILE_INTS + PROFILE_BOOLS
PRESET_KEYS = ('preset', 'name', 'bandwidth_hz', 'wide_bandwidth_hz', 'spread_factor', 'coding_rate')

# Region and bandwidth code pairs with no slot plan: the bandwidth is wider than every
# sub-band or above the profile's cap. A change to this set is a change to what users
# can select, so it is stated here rather than accepted silently.
NO_PLAN_CELLS = frozenset(
    [(r, hz) for r in ('EU_866', 'EU_874', 'EU_917')
     for hz in (203125, 250000, 406250, 500000, 812500, 1625000)] +
    [('EU_868', hz) for hz in (406250, 500000, 812500, 1625000)] +
    [('EU_N_868', hz) for hz in (250000, 406250, 500000, 812500, 1625000)] +
    [(r, hz) for r in ('RU', 'PH_868') for hz in (812500, 1625000)])

# The slot plan keeps at least this many gaps when it drops a slot for edge clearance.
CLEARANCE_MIN_GAPS = 4

OUTPUTS = ('hw_vendors.json', 'hw_devices.json', 'regions.json', 'modem_presets.json', 'roles.json')

# Each role switch applies to one role; firmware ignores it elsewhere and clears it on set_config.
SWITCH_ROLE = {
    'DEVICE_RELAY_LATE': 'ROUTER',
    'DEVICE_RELAY_FAVORITES': 'CLIENT',
    'DEVICE_QUIET': 'CLIENT',
    'DEVICE_LOST_AND_FOUND': 'TRACKER',
}
ROLE_KEYS = ('role', 'label', 'description')
PRESET_REQUIRED = ('name', 'label', 'description', 'role')
PRESET_OPTIONAL = ('device_flags', 'tak_flags', 'defaults')
DEFAULT_INTS = ('node_info_broadcast_secs', 'position_broadcast_secs', 'broadcast_smart_minimum_distance',
                'broadcast_smart_minimum_interval_secs', 'device_update_interval_secs', 'sensor_update_interval_secs',
                'neighbor_info_update_interval_secs')
DEFAULT_BOOLS = ('reset_intervals', 'position_broadcast_smart_enabled', 'environment_measurement', 'unmessagable')
DEFAULT_KEYS = DEFAULT_INTS + DEFAULT_BOOLS + ('position_flags', 'rebroadcast_mode')


class Errors(list):
    def add(self, where, message):
        self.append('%s: %s' % (where, message))


def is_int(value):
    return isinstance(value, int) and not isinstance(value, bool)


def exact_keys(errors, where, obj, required, optional=()):
    """True when obj is a mapping holding every required key and nothing unknown."""
    if not isinstance(obj, dict):
        errors.add(where, 'expected a mapping')
        return False
    for key in required:
        if key not in obj:
            errors.add(where, 'missing %s' % key)
    for key in obj:
        if key not in required and key not in optional:
            errors.add(where, 'unknown key %s' % key)
    return all(key in obj for key in required)


def text(errors, where, value, label):
    if not isinstance(value, str) or not value.strip():
        errors.add(where, '%s must be a non-empty string' % label)
        return ''
    return value


def enum_name(errors, where, prefix, value, table, label, reserved=()):
    """The prefixed enum value name for a YAML name, or None after reporting it."""
    name = '%s%s' % (prefix, value)
    if not isinstance(value, str) or name not in table or name in reserved:
        errors.add(where, '%r is not a %s' % (value, label))
        return None
    return name


def check_ints(errors, where, obj, keys, low=0):
    valid = True
    for key in keys:
        if not is_int(obj[key]) or obj[key] < low:
            errors.add(where, '%s must be an integer of at least %d' % (key, low))
            valid = False
    return valid


def check_bools(errors, where, obj, keys):
    valid = True
    for key in keys:
        if not isinstance(obj[key], bool):
            errors.add(where, '%s must be true or false' % key)
            valid = False
    return valid


class Enums:
    """The enums the registries name, read from the schema so the data follows it."""

    def __init__(self, proto_text, config_text='', module_config_text=''):
        self.regions = self._enum(proto_text, 'RegionCode')
        self.presets = self._enum(proto_text, 'ModemPreset')
        self.roles = self._enum(proto_text, 'Role')
        if config_text:
            self.device_flags = self._nested(config_text, 'DeviceConfig', 'Flags')
            self.rebroadcast_modes = self._nested(config_text, 'DeviceConfig', 'RebroadcastMode')
            self.position_flags = self._nested(config_text, 'PositionConfig', 'PositionFlags')
        if module_config_text:
            self.tak_flags = self._nested(module_config_text, 'TAKConfig', 'Flags')

    @staticmethod
    def _nested(proto_text, message, name):
        start = re.search(r'^message %s \{' % message, proto_text, re.M)
        m = start and re.compile(r'^(\s+)enum %s \{(.*?)^\1\}' % name, re.S | re.M).search(proto_text, start.end())
        if not m:
            raise SystemExit('error: enum %s.%s not found' % (message, name))
        return {k: int(v, 0) for k, v in
                re.findall(r'^\s+([A-Z][A-Z0-9_]*) = (0x[0-9A-Fa-f]+|\d+)\s*(?:;|\[)', m.group(2), re.M)}

    @staticmethod
    def _enum(proto_text, name):
        m = re.search(r'^enum %s \{(.*?)^\}' % name, proto_text, re.S | re.M)
        if not m:
            raise SystemExit('error: enum %s not found in common.proto' % name)
        # A value may carry a field_metadata annotation, so the line does not end at the ';'.
        return {k: int(v) for k, v in
                re.findall(r'^\s+([A-Z][A-Z0-9_]*) = (\d+)\s*(?:;|\[)', m.group(1), re.M)}


# --- hardware ---------------------------------------------------------------

def build_hardware(files, errors):
    """files maps a file name to its parsed YAML. Returns the vendor and device registries."""
    vendors, devices = [], []
    vendor_ids, vendor_slugs, packed_ids, device_slugs = {}, {}, {}, {}

    for fname in sorted(files):
        doc, where = files[fname], 'hardware/' + fname
        if not exact_keys(errors, where, doc, ('vendor', 'devices')):
            continue
        vendor = doc['vendor']
        if not exact_keys(errors, where + ' vendor', vendor, ('id', 'slug', 'name')):
            continue
        vid, vslug = vendor['id'], vendor['slug']
        if not is_int(vid) or not 0 <= vid <= VENDOR_MAX:
            errors.add(where, 'vendor id %r is outside 0x00-0x3F' % (vid,))
            continue
        if not isinstance(vslug, str) or not VENDOR_SLUG.match(vslug):
            errors.add(where, 'vendor slug %r must be lower-case words joined by -' % (vslug,))
            continue
        if fname == LEGACY_FILE and vid != 0:
            errors.add(where, '%s holds vendor 0x00' % LEGACY_FILE)
        if fname != LEGACY_FILE:
            if vid == 0:
                errors.add(where, 'vendor 0x00 lives in %s' % LEGACY_FILE)
            if fname != vslug + '.yaml':
                errors.add(where, 'a vendor file is named after its slug: %s.yaml' % vslug)
        if vid in vendor_ids:
            errors.add(where, 'vendor id 0x%02X is already %s' % (vid, vendor_ids[vid]))
        if vslug in vendor_slugs:
            errors.add(where, 'vendor slug %s is already used in %s' % (vslug, vendor_slugs[vslug]))
        vendor_ids[vid], vendor_slugs[vslug] = vslug, fname
        vendors.append({'vendor_id': vid, 'slug': vslug,
                        'name': text(errors, where, vendor['name'], 'vendor name')})

        if not isinstance(doc['devices'], list):
            errors.add(where, 'devices must be a list')
            continue
        for index, device in enumerate(doc['devices']):
            dwhere = '%s devices[%d]' % (where, index)
            if not exact_keys(errors, dwhere, device, ('id', 'slug', 'name')):
                continue
            did, dslug = device['id'], device['slug']
            if not is_int(did) or not DEVICE_MIN <= did <= DEVICE_MAX:
                errors.add(dwhere, 'device id %r is outside 0x01-0xFE; 0x00 and 0xFF are reserved' % (did,))
                continue
            if not isinstance(dslug, str) or not UPPER_WORDS.match(dslug):
                errors.add(dwhere, 'slug %r must be upper-case words joined by _' % (dslug,))
                continue
            packed = (vid << 8) | did
            if packed >= TWO_VARINT_BYTES:
                errors.add(dwhere, 'packed id 0x%04X needs three varint bytes' % packed)
            if packed in packed_ids:
                errors.add(dwhere, 'id 0x%04X is already %s' % (packed, packed_ids[packed]))
            if dslug in device_slugs:
                errors.add(dwhere, 'slug %s is already id %s' % (dslug, device_slugs[dslug]))
            packed_ids[packed], device_slugs[dslug] = dslug, '0x%04X' % packed
            entry = {'vendor_id': vid, 'device_id': did, 'slug': dslug,
                     'name': text(errors, dwhere, device['name'], 'name')}
            devices.append(entry)

    vendors.sort(key=lambda e: e['vendor_id'])
    devices.sort(key=lambda e: (e['vendor_id'] << 8) | e['device_id'])
    return ({'revision': len(vendors), 'vendors': vendors},
            {'revision': len(devices), 'devices': devices})


def compare_hardware(base_vendors, base_devices, vendors, devices, errors):
    """An allocated id is permanent: it may not disappear or change its slug."""
    if base_vendors:
        now = {e['vendor_id']: e['slug'] for e in vendors['vendors']}
        for e in base_vendors.get('vendors', []):
            vid = e['vendor_id']
            if vid not in now:
                errors.add('hardware', 'vendor 0x%02X (%s) was removed' % (vid, e['slug']))
            elif now[vid] != e['slug']:
                errors.add('hardware', 'vendor 0x%02X changed slug from %s to %s' % (vid, e['slug'], now[vid]))
    if base_devices:
        now = {(e['vendor_id'] << 8) | e['device_id']: e['slug'] for e in devices['devices']}
        for e in base_devices.get('devices', []):
            packed = (e['vendor_id'] << 8) | e['device_id']
            if packed not in now:
                errors.add('hardware', 'device 0x%04X (%s) was removed' % (packed, e['slug']))
            elif now[packed] != e['slug']:
                errors.add('hardware', 'device 0x%04X changed slug from %s to %s'
                           % (packed, e['slug'], now[packed]))


# --- modem presets ----------------------------------------------------------

def build_revision(errors, where, doc):
    revision = doc.get('revision')
    if not is_int(revision) or revision < 1:
        errors.add(where, 'revision must be a positive integer')
        return 0
    return revision


def documented_bandwidth_codes(config_text):
    """The fractional codes LoRaConfig.bandwidth's comment lists, as {code: Hz}."""
    m = re.search(r'/\*((?:(?!\*/).)*?)\*/\s*uint32 bandwidth = ', config_text, re.S)
    if not m:
        raise SystemExit('error: LoRaConfig.bandwidth not found in config.proto')
    return {int(code): round(float(khz) * 1000) for code, khz in re.findall(r'(\d+) = (\d+(?:\.\d+)?)', m.group(1))}


def build_bandwidth_codes(errors, where, entries, documented):
    """The LoRaConfig.bandwidth code table, which config.proto's comment must agree with."""
    if not isinstance(entries, list) or not entries:
        errors.add(where, 'bandwidth_codes must be a non-empty list')
        return []
    out, seen = [], set()
    for index, entry in enumerate(entries):
        cwhere = '%s bandwidth_codes[%d]' % (where, index)
        if not exact_keys(errors, cwhere, entry, ('code', 'bandwidth_hz')):
            continue
        if not check_ints(errors, cwhere, entry, ('code', 'bandwidth_hz'), low=1):
            continue
        if entry['code'] in seen:
            errors.add(cwhere, 'code %d is listed twice' % entry['code'])
        seen.add(entry['code'])
        if entry['code'] not in documented and entry['bandwidth_hz'] != entry['code'] * 1000:
            errors.add(cwhere, 'code %d is kHz as it stands unless config.proto documents it' % entry['code'])
        out.append({'code': entry['code'], 'bandwidth_hz': entry['bandwidth_hz']})
    for code, hz in sorted(documented.items()):
        listed = next((e['bandwidth_hz'] for e in out if e['code'] == code), None)
        if listed != hz:
            errors.add(where, 'config.proto documents bandwidth code %d as %d Hz, the table has %s'
                       % (code, hz, listed))
    return out


def build_presets(doc, enums, errors, documented_codes=None):
    where = 'modem_presets.yaml'
    if not exact_keys(errors, where, doc, ('revision', 'presets', 'bandwidth_codes')):
        return None
    revision = build_revision(errors, where, doc)
    if not isinstance(doc['presets'], list):
        errors.add(where, 'presets must be a list')
        return None
    codes = build_bandwidth_codes(errors, where, doc['bandwidth_codes'], documented_codes or {})

    out, seen = [], set()
    for index, preset in enumerate(doc['presets']):
        pwhere = '%s presets[%d]' % (where, index)
        if not exact_keys(errors, pwhere, preset, PRESET_KEYS):
            continue
        name = enum_name(errors, pwhere, 'MODEM_', preset['preset'], enums.presets, 'ModemPreset')
        if not name:
            continue
        pwhere = '%s %s' % (where, preset['preset'])
        if name in seen:
            errors.add(pwhere, 'defined twice')
        seen.add(name)
        check_ints(errors, pwhere, preset, ('bandwidth_hz',), low=1)
        check_ints(errors, pwhere, preset, ('wide_bandwidth_hz',))
        if not is_int(preset['spread_factor']) or not 5 <= preset['spread_factor'] <= 12:
            errors.add(pwhere, 'spread_factor must be 5-12')
        if not is_int(preset['coding_rate']) or not 5 <= preset['coding_rate'] <= 8:
            errors.add(pwhere, 'coding_rate must be 5-8, the denominator of 4/x')
        entry = {key: preset[key] for key in PRESET_KEYS}
        entry.update(preset=name, name=text(errors, pwhere, preset['name'], 'name'))
        out.append(entry)

    out.sort(key=lambda e: enums.presets[e['preset']])
    return {'revision': revision, 'presets': out, 'bandwidth_codes': codes}


# --- regions ----------------------------------------------------------------

def table_name(errors, where, entry, names, label):
    """The entry's name if it is well formed and new; reported and None otherwise."""
    name = entry['name']
    if not isinstance(name, str) or not UPPER_WORDS.match(name):
        errors.add(where, '%s name %r must be upper-case words joined by _' % (label, name))
        return None
    if name in names:
        errors.add(where, '%s %s is defined twice' % (label, name))
        return None
    return name


def build_sub_bands(errors, where, entry):
    """sub_bands_hz as SubBand messages; absent is one block equal to the band edges."""
    if 'sub_bands_hz' not in entry:
        return []
    value = entry['sub_bands_hz']
    if (not isinstance(value, list) or len(value) < 2 or
            not all(isinstance(b, list) and len(b) == 2 and all(is_int(e) for e in b) for b in value)):
        errors.add(where, 'sub_bands_hz must list at least two [start, end] pairs of integers')
        return []
    if value[0][0] != entry['freq_start_hz'] or value[-1][1] != entry['freq_end_hz']:
        errors.add(where, 'sub_bands_hz must start at freq_start_hz and end at freq_end_hz')
    for (start, end), following in zip(value, value[1:] + [None]):
        if start >= end:
            errors.add(where, 'sub-band [%d, %d] is empty or reversed' % (start, end))
        if following is not None and end > following[0]:
            errors.add(where, 'sub-bands [%d, %d] and [%d, %d] overlap or are out of order'
                       % (start, end, following[0], following[1]))
    return [{'start_hz': start, 'end_hz': end} for start, end in value]


def segment_plan(start, end, bandwidth, profile, edge_clearance):
    """One block's slots as (count, pitch, first_centre) in half-hertz, or None (SCHEMA.md section 6)."""
    span, bw = 2 * (end - start), 2 * bandwidth
    spacing, unit = 2 * profile['spacing_hz'], 2 * profile['unit_channel_hz']
    if unit:
        padding = (-(-bw // unit) * unit - bw) // 2
    else:
        padding = 2 * profile.get('padding_hz', 0)
    if span < 2 * padding + bw:
        return None
    pitch = spacing + 2 * padding + bw
    count = (span + spacing) // pitch

    def extent(n):
        return n * (bw + 2 * padding) + (n - 1) * spacing

    if edge_clearance and 2 * (span - extent(count)) + 4 * padding < bw and count - 1 >= CLEARANCE_MIN_GAPS:
        count -= 1
    offset = (span - extent(count)) // 2
    if unit:
        offset = offset // unit * unit
    return count, pitch, 2 * start + offset + padding + bw // 2


def slot_plan(region, profile, bandwidth):
    """[(start, end, count, pitch, first_centre)] per block holding a slot; empty is no plan."""
    if profile['max_bandwidth_hz'] and bandwidth > profile['max_bandwidth_hz']:
        return []
    blocks = [(b['start_hz'], b['end_hz']) for b in region.get('sub_bands', [])] or \
        [(region['freq_start_hz'], region['freq_end_hz'])]
    plan = []
    for start, end in blocks:
        segment = segment_plan(start, end, bandwidth, profile, region['edge_clearance'])
        if segment:
            plan.append((start, end) + segment)
    return plan


def check_slot_plans(errors, where, regions, profiles, lists, presets, codes):
    """Every permitted preset has a plan, and every plan's slots stay inside their block."""
    def inside(label, plan, bandwidth):
        for start, end, count, pitch, first in plan:
            if count < 1 or first - bandwidth < 2 * start or first + (count - 1) * pitch + bandwidth > 2 * end:
                errors.add(label, 'slots leave the block %d-%d Hz' % (start, end))

    no_plan = set()
    for code, region in regions.items():
        name, profile = code[len('REGION_'):], profiles[region['profile']]
        for preset in lists[profile['preset_list']]:
            bandwidth = presets[preset]['wide_bandwidth_hz' if region['wide_lora'] else 'bandwidth_hz']
            plan = slot_plan(region, profile, bandwidth)
            if not plan:
                errors.add('%s %s' % (where, name), 'permits %s but has no slot for %d Hz' % (preset, bandwidth))
            inside('%s %s %s' % (where, name, preset), plan, bandwidth)
        for entry in codes:
            plan = slot_plan(region, profile, entry['bandwidth_hz'])
            if not plan:
                no_plan.add((name, entry['bandwidth_hz']))
            inside('%s %s bandwidth code %d' % (where, name, entry['code']), plan, entry['bandwidth_hz'])
    expected = {(name, hz) for name, hz in NO_PLAN_CELLS if 'REGION_' + name in regions}
    for name, hz in sorted(no_plan ^ expected):
        errors.add(where, '%s %s a slot plan for %d Hz; NO_PLAN_CELLS says otherwise'
                   % (name, 'has no' if (name, hz) in no_plan else 'has', hz))


def build_regions(doc, enums, preset_registry, errors):
    """preset_registry is the built modem preset registry, or None when it did not build."""
    where = 'regions.yaml'
    if not exact_keys(errors, where, doc, ('revision',) + REGION_TABLES):
        return None
    revision = build_revision(errors, where, doc)
    for table in REGION_TABLES:
        if not isinstance(doc[table], list):
            errors.add(where, '%s must be a list' % table)
            return None
    presets = {p['preset']: p for p in preset_registry['presets']} if preset_registry else None

    lists, list_by_content = {}, {}
    for index, entry in enumerate(doc['preset_lists']):
        lwhere = '%s preset_lists[%d]' % (where, index)
        if not exact_keys(errors, lwhere, entry, ('name', 'presets')):
            continue
        lname = table_name(errors, lwhere, entry, lists, 'preset list')
        if not lname:
            continue
        members = []
        if not isinstance(entry['presets'], list) or not entry['presets']:
            errors.add(lwhere, 'presets must be a non-empty list')
        else:
            for value in entry['presets']:
                name = enum_name(errors, lwhere, 'MODEM_', value, enums.presets, 'ModemPreset')
                if not name:
                    continue
                if name in members:
                    errors.add(lwhere, '%s is listed twice' % value)
                elif presets is not None and name not in presets:
                    errors.add(lwhere, '%s has no entry in modem_presets.yaml' % value)
                else:
                    members.append(name)
        members.sort(key=enums.presets.get)
        if tuple(members) in list_by_content:
            errors.add(lwhere, 'holds the same presets as %s' % list_by_content[tuple(members)])
        list_by_content[tuple(members)] = lname
        lists[lname] = members

    profiles, profile_by_content, lists_used = {}, {}, set()
    for index, entry in enumerate(doc['profiles']):
        pwhere = '%s profiles[%d]' % (where, index)
        if not exact_keys(errors, pwhere, entry, PROFILE_KEYS, ('padding_hz',)):
            continue
        pname = table_name(errors, pwhere, entry, profiles, 'profile')
        if not pname:
            continue
        lists_used.add(entry['preset_list'])
        if entry['preset_list'] not in lists:
            errors.add(pwhere, 'preset_list %r is not defined' % (entry['preset_list'],))
            continue
        default = enum_name(errors, pwhere, 'MODEM_', entry['default_preset'], enums.presets, 'ModemPreset')
        if default and default not in lists[entry['preset_list']]:
            errors.add(pwhere, 'default_preset %s is not in preset list %s' % (entry['default_preset'], entry['preset_list']))
        if not check_ints(errors, pwhere, entry, PROFILE_INTS) or not check_bools(errors, pwhere, entry, PROFILE_BOOLS):
            continue
        unit = entry['unit_channel_hz']
        # A raster derives its padding, so a stored one would be a dead second value.
        if unit and 'padding_hz' in entry:
            errors.add(pwhere, 'has unit_channel_hz, which derives the padding; drop padding_hz')
        elif not unit and 'padding_hz' not in entry:
            errors.add(pwhere, 'missing padding_hz')
        elif not unit and not check_ints(errors, pwhere, entry, ('padding_hz',)):
            continue
        if unit and entry['spacing_hz'] % unit:
            errors.add(pwhere, 'spacing_hz must be a whole multiple of unit_channel_hz, or slots leave the raster')
        profile = {key: entry[key] for key in PROFILE_KEYS}
        profile['default_preset'] = default
        if not unit and 'padding_hz' in entry:
            profile = dict(list(profile.items())[:4] + [('padding_hz', entry['padding_hz'])] + list(profile.items())[4:])
        content = tuple(v for k, v in profile.items() if k != 'name')
        if content in profile_by_content:
            errors.add(pwhere, 'is identical to profile %s' % profile_by_content[content])
        profile_by_content[content] = pname
        profiles[pname] = profile
    for lname in lists:
        if lname not in lists_used:
            errors.add(where, 'preset list %s is not used by any profile' % lname)

    regions, profiles_used = {}, set()
    for index, entry in enumerate(doc['regions']):
        rwhere = '%s regions[%d]' % (where, index)
        if not exact_keys(errors, rwhere, entry, REGION_KEYS, ('sub_bands_hz',)):
            continue
        code = enum_name(errors, rwhere, 'REGION_', entry['region'], enums.regions, 'RegionCode')
        if not code:
            continue
        rwhere = '%s %s' % (where, entry['region'])
        if code in regions:
            errors.add(rwhere, 'defined twice')
            continue
        profiles_used.add(entry['profile'])
        profile = profiles.get(entry['profile'])
        if profile is None:
            errors.add(rwhere, 'profile %r is not defined' % (entry['profile'],))
            continue
        if not check_ints(errors, rwhere, entry, REGION_INTS) or not check_bools(errors, rwhere, entry, REGION_BOOLS):
            continue
        if entry['freq_start_hz'] >= entry['freq_end_hz']:
            errors.add(rwhere, 'freq_start_hz must be below freq_end_hz')
        if not 1 <= entry['duty_cycle_permille'] <= 1000:
            errors.add(rwhere, 'duty_cycle_permille must be 1-1000')
        if not is_int(entry['override_slot']) or not -1 <= entry['override_slot'] <= 32767:
            errors.add(rwhere, 'override_slot must be -1, 0 or a slot number')
        # Raster quantisation can leave the dropped slot's room all on one side, so the
        # clearance rule's guarantee does not hold there.
        if entry['edge_clearance'] and profile['unit_channel_hz']:
            errors.add(rwhere, 'edge_clearance needs a continuous profile, and %s has a raster' % entry['profile'])
        if entry['wide_lora'] and presets is not None:
            for name in lists[profile['preset_list']]:
                if not presets[name]['wide_bandwidth_hz']:
                    errors.add(rwhere, 'is wide_lora but permits %s, which has no wide_bandwidth_hz' % name)
        sub_bands = build_sub_bands(errors, rwhere, entry)
        region = {'region_code': code, 'profile': entry['profile'],
                  'freq_start_hz': entry['freq_start_hz'], 'freq_end_hz': entry['freq_end_hz']}
        if sub_bands:
            region['sub_bands'] = sub_bands
        region.update((key, entry[key]) for key in REGION_KEYS[4:])
        regions[code] = region
    for pname in profiles:
        if pname not in profiles_used:
            errors.add(where, 'profile %s is not used by any region' % pname)

    us, unset = regions.get('REGION_US'), regions.get('REGION_UNSET')
    if unset is None:
        errors.add(where, 'UNSET has no entry; it is a copy of US')
    elif us is not None:
        differ = sorted(k for k in set(us) | set(unset) if k != 'region_code' and us.get(k) != unset.get(k))
        if differ:
            errors.add(where, 'UNSET is a copy of US but differs in %s' % ', '.join(differ))

    if presets is not None and not errors:
        check_slot_plans(errors, where, regions, profiles, lists, presets, preset_registry['bandwidth_codes'])

    swap_groups, grouped = [], {}
    for index, entry in enumerate(doc['swap_groups']):
        gwhere = '%s swap_groups[%d]' % (where, index)
        if not exact_keys(errors, gwhere, entry, ('regions',)):
            continue
        if not isinstance(entry['regions'], list) or len(entry['regions']) < 2:
            errors.add(gwhere, 'regions must list at least two regions')
            continue
        members, owner = [], {}
        for value in entry['regions']:
            code = enum_name(errors, gwhere, 'REGION_', value, enums.regions, 'RegionCode',
                             reserved=('REGION_UNSET',))
            if not code:
                continue
            if code not in regions:
                errors.add(gwhere, '%s has no entry in regions' % value)
                continue
            if code in grouped:
                errors.add(gwhere, '%s is already in swap_groups[%d]' % (value, grouped[code]))
                continue
            grouped[code] = index
            members.append(code)
            for name in lists[profiles[regions[code]['profile']]['preset_list']]:
                if name in owner:
                    errors.add(gwhere, '%s and %s both permit %s' % (owner[name], value, name))
                owner[name] = value
        swap_groups.append({'regions': members})

    return {
        'revision': revision,
        'regions': sorted(regions.values(), key=lambda e: enums.regions[e['region_code']]),
        'profiles': list(profiles.values()),
        'preset_lists': [{'name': name, 'presets': members} for name, members in lists.items()],
        'swap_groups': swap_groups,
    }


# --- roles ------------------------------------------------------------------

def flag_word(errors, where, value, table, label, allowed=None):
    """A list of enum value names, OR-ed into one word."""
    if not isinstance(value, list):
        errors.add(where, '%s must be a list of names' % label)
        return 0
    word = 0
    for name in value:
        if name not in table or (allowed is not None and name not in allowed):
            errors.add(where, '%s is not a %s' % (name, label))
            continue
        if word & table[name]:
            errors.add(where, '%s is listed twice' % name)
        word |= table[name]
    return word


def build_roles(doc, enums, errors):
    where = 'roles.yaml'
    if not exact_keys(errors, where, doc, ('revision', 'roles', 'presets')):
        return None
    revision = build_revision(errors, where, doc)
    if not isinstance(doc['roles'], list) or not isinstance(doc['presets'], list):
        errors.add(where, 'roles and presets must be lists')
        return None

    roles = {}
    for index, entry in enumerate(doc['roles']):
        rwhere = '%s roles[%d]' % (where, index)
        if not exact_keys(errors, rwhere, entry, ROLE_KEYS):
            continue
        role = entry['role']
        if role not in enums.roles:
            errors.add(rwhere, '%s is not a Role' % role)
        elif role in roles:
            errors.add(rwhere, '%s defined twice' % role)
        else:
            roles[role] = {'role': role, 'label': text(errors, rwhere, entry['label'], 'label'),
                           'description': text(errors, rwhere, entry['description'], 'description')}
    for role in enums.roles:
        if role not in roles:
            errors.add(where, 'Role %s has no roles entry' % role)

    presets, seen, configurations = [], set(), {}
    for index, entry in enumerate(doc['presets']):
        pwhere = '%s presets[%d]' % (where, index)
        if not exact_keys(errors, pwhere, entry, PRESET_REQUIRED, PRESET_OPTIONAL):
            continue
        name = entry['name']
        if not isinstance(name, str) or not UPPER_WORDS.match(name):
            errors.add(pwhere, 'name must be UPPER_CASE words')
            continue
        pwhere = '%s preset %s' % (where, name)
        if name in seen:
            errors.add(pwhere, 'defined twice')
        seen.add(name)
        role = entry['role']
        if role not in enums.roles:
            errors.add(pwhere, '%s is not a Role' % role)
            continue
        out = {'name': name, 'label': text(errors, pwhere, entry['label'], 'label'),
               'description': text(errors, pwhere, entry['description'], 'description'), 'role': role}
        switches = entry.get('device_flags', [])
        out['device_flags'] = flag_word(errors, pwhere, switches, enums.device_flags, 'role switch', SWITCH_ROLE)
        for switch in switches if isinstance(switches, list) else []:
            if SWITCH_ROLE.get(switch, role) != role:
                errors.add(pwhere, '%s applies to %s, not %s' % (switch, SWITCH_ROLE[switch], role))
        out['tak_flags'] = flag_word(errors, pwhere, entry.get('tak_flags', []), enums.tak_flags, 'TAKConfig flag')
        configuration = (role, out['device_flags'], out['tak_flags'])
        if configuration in configurations:
            errors.add(pwhere, 'the same role, switches and TAK flags as %s' % configurations[configuration])
        configurations[configuration] = name
        defaults = entry.get('defaults', {})
        dwhere = pwhere + ' defaults'
        if not isinstance(defaults, dict) or not exact_keys(errors, dwhere, defaults, (), DEFAULT_KEYS):
            continue
        check_ints(errors, dwhere, defaults, [k for k in DEFAULT_INTS if k in defaults])
        check_bools(errors, dwhere, defaults, [k for k in DEFAULT_BOOLS if k in defaults])
        if 'rebroadcast_mode' in defaults:
            mode = defaults['rebroadcast_mode']
            if mode not in enums.rebroadcast_modes:
                errors.add(dwhere, '%s is not a RebroadcastMode' % mode)
            elif mode == 'NONE' and role == 'ROUTER':
                errors.add(dwhere, 'a router cannot have rebroadcast_mode NONE')
        out_defaults = {k: defaults[k] for k in DEFAULT_KEYS if k in defaults and k != 'position_flags'}
        if 'position_flags' in defaults:
            out_defaults['position_flags'] = flag_word(errors, dwhere, defaults['position_flags'],
                                                       enums.position_flags, 'PositionFlags value')
        out['defaults'] = out_defaults
        presets.append(out)
    for role in enums.roles:
        if (role, 0, 0) not in configurations:
            errors.add(where, 'Role %s has no row without switches' % role)

    return {'revision': revision, 'roles': sorted(roles.values(), key=lambda r: enums.roles[r['role']]),
            'presets': presets}


def compare_revision(label, base, new, errors):
    """Data edited in place carries its own revision, which any change must raise."""
    if not base or not new:
        return
    strip = lambda d: {k: v for k, v in d.items() if k != 'revision'}
    if new['revision'] < base['revision']:
        errors.add(label, 'revision went down from %d to %d' % (base['revision'], new['revision']))
    elif new['revision'] == base['revision'] and strip(new) != strip(base):
        errors.add(label, 'the data changed but revision is still %d; raise it' % new['revision'])


# --- files ------------------------------------------------------------------

def load_yaml(path, errors):
    where = os.path.relpath(path, ROOT).replace(os.sep, '/')
    try:
        with open(path, encoding='utf-8') as fh:
            return yaml.safe_load(fh)
    except FileNotFoundError:
        errors.add(where, 'missing')
    except yaml.YAMLError as exc:
        errors.add(where, 'not valid YAML: %s' % exc)
    return None


def generate(enums, errors):
    files = {}
    for fname in (sorted(os.listdir(HARDWARE)) if os.path.isdir(HARDWARE) else []):
        if fname.endswith('.yaml'):
            files[fname] = load_yaml(os.path.join(HARDWARE, fname), errors)
    vendors, devices = build_hardware(files, errors)
    with open(CONFIG_PROTO, encoding='utf-8') as fh:
        documented = documented_bandwidth_codes(fh.read())
    presets = build_presets(load_yaml(os.path.join(REGISTRY, 'modem_presets.yaml'), errors), enums, errors, documented)
    regions = build_regions(load_yaml(os.path.join(REGISTRY, 'regions.yaml'), errors), enums, presets, errors)
    roles = build_roles(load_yaml(os.path.join(REGISTRY, 'roles.yaml'), errors), enums, errors)
    return dict(zip(OUTPUTS, (vendors, devices, regions, presets, roles)))


def render(obj):
    return json.dumps(obj, indent=2, ensure_ascii=False) + '\n'


def base_json(ref, name):
    """The generated file as it was at ref, or None when it did not exist there yet."""
    proc = subprocess.run(['git', 'show', '%s:registry/generated/%s' % (ref, name)],
                          cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    return json.loads(proc.stdout) if proc.returncode == 0 else None


# --- self-test --------------------------------------------------------------

def selftest(enums):
    failures = []

    def expect(label, should_reject, run):
        errors = Errors()
        run(errors)
        if should_reject and not errors:
            failures.append('%s: accepted' % label)
        if not should_reject and errors:
            failures.append('%s: rejected (%s)' % (label, errors[0]))

    acme = {'id': 0x01, 'slug': 'acme', 'name': 'Acme'}
    board = {'id': 0x01, 'slug': 'ACME_BOARD', 'name': 'Board'}

    def hardware(vendor, devices, fname='acme.yaml'):
        return lambda errors: build_hardware({fname: {'vendor': vendor, 'devices': devices}}, errors)

    expect('a valid vendor file', False, hardware(acme, [board]))
    expect('vendor id 0x40', True, hardware(dict(acme, id=0x40), [board]))
    expect('device id 0x00', True, hardware(acme, [dict(board, id=0x00)]))
    expect('device id 0xFF', True, hardware(acme, [dict(board, id=0xFF)]))
    expect('a duplicate device id', True, hardware(acme, [board, dict(board, slug='OTHER_BOARD')]))
    expect('a duplicate slug', True, hardware(acme, [board, dict(board, id=0x02)]))
    expect('a file not named after its slug', True, hardware(acme, [board], 'other.yaml'))
    expect('vendor 0x00 outside the legacy file', True, hardware(dict(acme, id=0x00), [board]))
    expect('an unknown key', True, hardware(acme, [dict(board, colour='red')]))
    expect('a lower-case device slug', True, hardware(acme, [dict(board, slug='acme_board')]))

    base_devices = {'devices': [{'vendor_id': 1, 'device_id': 1, 'slug': 'ACME_BOARD', 'name': 'Board'}]}

    def against_base(devices):
        def run(errors):
            vendors_now, devices_now = build_hardware({'acme.yaml': {'vendor': acme, 'devices': devices}}, errors)
            compare_hardware(None, base_devices, vendors_now, devices_now, errors)
        return run

    expect('an allocated id removed', True, against_base([dict(board, id=0x02, slug='NEW_BOARD')]))
    expect('an allocated slug changed', True, against_base([dict(board, slug='RENAMED_BOARD')]))
    expect('an allocation kept under a new name', False, against_base([dict(board, name='Better')]))

    fast = {'preset': 'LONG_FAST', 'name': 'LongFast', 'bandwidth_hz': 250000, 'wide_bandwidth_hz': 812500,
            'spread_factor': 11, 'coding_rate': 5}
    narrow = {'preset': 'NARROW_FAST', 'name': 'NarrowFast', 'bandwidth_hz': 62500, 'wide_bandwidth_hz': 0,
              'spread_factor': 7, 'coding_rate': 6}
    codes = [{'code': 125, 'bandwidth_hz': 125000}, {'code': 62, 'bandwidth_hz': 62500}]
    documented = {62: 62500}

    def presets(*entries, codes=codes):
        doc = {'revision': 1, 'presets': list(entries), 'bandwidth_codes': list(codes)}
        return lambda errors: build_presets(doc, enums, errors, documented)

    expect('valid presets', False, presets(fast, narrow))
    expect('an unknown preset', True, presets(dict(fast, preset='WARP')))
    expect('a preset defined twice', True, presets(fast, fast))
    expect('spread factor 13', True, presets(dict(fast, spread_factor=13)))
    expect('coding rate 9', True, presets(dict(fast, coding_rate=9)))
    expect('zero bandwidth', True, presets(dict(fast, bandwidth_hz=0)))
    expect('a bandwidth code config.proto documents differently', True,
           presets(fast, codes=[codes[0], {'code': 62, 'bandwidth_hz': 62000}]))
    expect('a documented bandwidth code missing', True, presets(fast, codes=[codes[0]]))
    expect('an undocumented bandwidth code that is not kHz', True,
           presets(fast, codes=[{'code': 125, 'bandwidth_hz': 125500}, codes[1]]))
    expect('a bandwidth code listed twice', True, presets(fast, codes=codes + [codes[0]]))

    preset_registry = build_presets({'revision': 1, 'presets': [fast, narrow], 'bandwidth_codes': codes},
                                    enums, Errors(), documented)
    lists = ({'name': 'STD', 'presets': ['LONG_FAST']}, {'name': 'NARROW', 'presets': ['NARROW_FAST']})
    std = {'name': 'STD', 'preset_list': 'STD', 'default_preset': 'LONG_FAST', 'spacing_hz': 0, 'padding_hz': 0,
           'unit_channel_hz': 0, 'max_bandwidth_hz': 0, 'audio_permitted': True, 'licensed_only': False,
           'position_throttle': 1, 'telemetry_throttle': 1, 'default_hop_start': 3}
    ham = {k: v for k, v in std.items() if k != 'padding_hz'}
    ham.update(name='HAM', preset_list='NARROW', default_preset='NARROW_FAST', unit_channel_hz=100000,
               licensed_only=True)
    us = {'region': 'US', 'profile': 'STD', 'freq_start_hz': 902000000, 'freq_end_hz': 928000000,
          'duty_cycle_permille': 1000, 'power_limit_dbm': 30, 'frequency_switching': False, 'wide_lora': False,
          'override_slot': 0, 'edge_clearance': True}
    unset = dict(us, region='UNSET')
    ham70 = dict(us, region='ITU1_70CM', profile='HAM', freq_start_hz=430000000, freq_end_hz=440000000,
                 override_slot=37, edge_clearance=False)
    cn = dict(us, region='CN')

    def regions(lists=lists, profiles=(std, ham), regions=(unset, us, ham70), swap_groups=(), revision=1):
        doc = {'revision': revision, 'preset_lists': list(lists), 'profiles': list(profiles),
               'regions': list(regions), 'swap_groups': list(swap_groups)}
        return lambda errors: build_regions(doc, enums, preset_registry, errors)

    def with_cn(**fields):
        return regions(regions=(unset, us, ham70, dict(cn, **fields)))

    def without(entry, key):
        return {k: v for k, v in entry.items() if k != key}

    expect('valid region tables', False, regions())
    expect('revision 0', True, regions(revision=0))
    expect('an unknown region', True, regions(regions=(unset, us, dict(ham70, region='MARS'))))
    expect('no UNSET region', True, regions(regions=(us, ham70)))
    expect('an UNSET region differing from US', True, regions(regions=(dict(unset, power_limit_dbm=20), us, ham70)))
    expect('a region defined twice', True, regions(regions=(unset, us, ham70, us)))
    expect('an undefined profile', True, with_cn(profile='NOPE'))
    expect('reversed frequencies', True, with_cn(freq_end_hz=460000000))
    expect('a zero duty cycle', True, with_cn(duty_cycle_permille=0))
    expect('a duty cycle above 1000 per mille', True, with_cn(duty_cycle_permille=1001))
    expect('a region without edge_clearance', True, regions(regions=(unset, us, ham70, without(cn, 'edge_clearance'))))
    expect('edge clearance on a raster profile', True, regions(regions=(unset, us, dict(ham70, edge_clearance=True))))
    expect('a raster profile storing padding', True, regions(profiles=(std, dict(ham, padding_hz=18750))))
    expect('a continuous profile without padding', True, regions(profiles=(without(std, 'padding_hz'), ham)))
    expect('spacing off the raster', True, regions(profiles=(std, dict(ham, spacing_hz=50000))))
    expect('override slot -2', True, regions(regions=(unset, us, dict(ham70, override_slot=-2))))
    expect('a wide region permitting a preset without a wide form', True,
           regions(regions=(unset, us, dict(ham70, wide_lora=True))))
    expect('a region too narrow for a preset it permits', True, with_cn(freq_end_hz=470100000))
    expect('valid sub-bands', False, with_cn(sub_bands_hz=[[902000000, 910000000], [920000000, 928000000]]))
    expect('one sub-band', True, with_cn(sub_bands_hz=[[902000000, 928000000]]))
    expect('sub-bands out of order', True,
           with_cn(sub_bands_hz=[[902000000, 910000000], [920000000, 928000000], [912000000, 914000000]]))
    expect('overlapping sub-bands', True, with_cn(sub_bands_hz=[[902000000, 915000000], [910000000, 928000000]]))
    expect('sub-bands starting above the band', True,
           with_cn(sub_bands_hz=[[903000000, 910000000], [920000000, 928000000]]))
    expect('sub-bands ending below the band', True,
           with_cn(sub_bands_hz=[[902000000, 910000000], [920000000, 927000000]]))
    expect('a default preset outside its list', True, regions(profiles=(std, dict(ham, default_preset='LONG_FAST'))))
    expect('a listed preset without parameters', True,
           regions(lists=({'name': 'STD', 'presets': ['LONG_FAST', 'SHORT_FAST']}, lists[1])))
    expect('an unused profile', True, regions(profiles=(std, ham, dict(ham, name='SPARE', licensed_only=False))))
    expect('an unused preset list', True,
           regions(lists=lists + ({'name': 'SPARE', 'presets': ['LONG_FAST', 'NARROW_FAST']},)))
    expect('two lists holding the same presets', True,
           regions(lists=lists + ({'name': 'COPY', 'presets': ['LONG_FAST']},),
                   profiles=(std, ham, dict(std, name='OTHER', preset_list='COPY')),
                   regions=(unset, us, ham70, dict(cn, profile='OTHER'))))
    expect('two identical profiles', True,
           regions(profiles=(std, ham, dict(std, name='OTHER')), regions=(unset, us, ham70, dict(cn, profile='OTHER'))))
    expect('a valid swap group', False, regions(swap_groups=({'regions': ['US', 'ITU1_70CM']},)))
    expect('a swap group of one region', True, regions(swap_groups=({'regions': ['US']},)))
    expect('a region in two swap groups', True,
           regions(swap_groups=({'regions': ['US', 'ITU1_70CM']}, {'regions': ['ITU1_70CM', 'US']})))
    expect('swap siblings permitting the same preset', True,
           regions(regions=(unset, us, ham70, cn), swap_groups=({'regions': ['US', 'CN']},)))

    def plan_is(label, start, end, bandwidth, expected, clearance=False, sub_bands=(), **profile):
        region = {'freq_start_hz': start, 'freq_end_hz': end, 'edge_clearance': clearance,
                  'sub_bands': [{'start_hz': a, 'end_hz': b} for a, b in sub_bands]}
        profile = dict({'spacing_hz': 0, 'padding_hz': 0, 'unit_channel_hz': 0, 'max_bandwidth_hz': 0}, **profile)

        def run(errors):
            got = [segment[2:] for segment in slot_plan(region, profile, bandwidth)]
            if got != expected:
                errors.add(label, 'plan is %r, not %r' % (got, expected))
        expect(label, False, run)

    # (count, pitch, first centre), all in half-hertz.
    plan_is('US at 250 kHz drops one slot for edge clearance', 902000000, 928000000, 250000,
            [(103, 500000, 1804500000)], clearance=True)
    plan_is('RU at 125 kHz keeps four slots', 868700000, 869200000, 125000, [(4, 250000, 1737525000)], clearance=True)
    plan_is('JP at 250 kHz stays on the two-channel bond raster', 920500000, 923500000, 250000,
            [(7, 800000, 1841400000)], unit_channel_hz=200000)
    plan_is('a 20 kHz raster gives 15.6 kHz a 20 kHz pitch', 144000000, 146000000, 15600,
            [(100, 40000, 288020000)], unit_channel_hz=20000)
    plan_is('a 20 kHz raster gives 15.625 kHz the same grid', 144000000, 146000000, 15625,
            [(100, 40000, 288020000)], unit_channel_hz=20000)
    plan_is('one slot fits a block that has no room for spacing', 865600000, 865850000, 125000,
            [(1, 1200000, 1731450000)], spacing_hz=400000, padding_hz=37500)
    plan_is('no slot in a block narrower than slot and padding', 865600000, 865750000, 125000, [],
            spacing_hz=400000, padding_hz=37500)
    plan_is('a bandwidth over the cap has no plan', 874000000, 874400000, 203125, [], max_bandwidth_hz=200000)
    plan_is('each sub-band gets its own slots', 917300000, 918900000, 125000,
            [(3, 250000, 1834750000), (3, 250000, 1837150000)],
            sub_bands=((917300000, 917700000), (918500000, 918900000)), max_bandwidth_hz=200000)
    plan_is('203.125 kHz keeps its half hertz', 2400000000, 2483500000, 203125, [(411, 406250, 4800218750)])

    before = {'revision': 3, 'regions': [{'name': 'US'}]}
    changed = {'revision': 3, 'regions': [{'name': 'EU'}]}
    expect('a change without a revision bump', True, lambda e: compare_revision('regions', before, changed, e))
    expect('a revision going down', True, lambda e: compare_revision('regions', before, dict(before, revision=2), e))
    expect('a change with a revision bump', False,
           lambda e: compare_revision('regions', before, dict(changed, revision=4), e))
    expect('no change at the same revision', False, lambda e: compare_revision('regions', before, dict(before), e))

    with open(os.path.join(REGISTRY, 'roles.yaml'), encoding='utf-8') as fh:
        roles_doc = yaml.safe_load(fh)

    def roles(**changes):
        doc = dict(roles_doc, **changes)
        return lambda errors: build_roles(doc, enums, errors)

    def preset(name, **fields):
        return [dict(p, **fields) if p['name'] == name else p for p in roles_doc['presets']]

    expect('the shipped roles', False, roles())
    expect('a Role without a roles entry', True, roles(roles=roles_doc['roles'][:-1]))
    expect('a role defined twice', True, roles(roles=roles_doc['roles'] + roles_doc['roles'][:1]))
    expect('a switch on the wrong role', True, roles(presets=preset('CLIENT_RELAY_FAVORITES', role='ROUTER')))
    expect('a device flag that is not a role switch', True,
           roles(presets=preset('CLIENT', device_flags=['DEVICE_LED_HEARTBEAT_DISABLED'])))
    expect('a router that never rebroadcasts', True,
           roles(presets=preset('ROUTER', defaults={'rebroadcast_mode': 'NONE'})))
    expect('a role without a row without switches', True,
           roles(presets=[p for p in roles_doc['presets'] if p['name'] != 'SENSOR']))
    expect('two rows for one configuration', True,
           roles(presets=roles_doc['presets'] + [dict(roles_doc['presets'][0], name='CLIENT_AGAIN')]))
    expect('a preset defined twice', True, roles(presets=roles_doc['presets'] + roles_doc['presets'][:1]))
    expect('an unknown default', True, roles(presets=preset('SENSOR', defaults={'colour': 1})))
    expect('an unknown position flag', True,
           roles(presets=preset('CLIENT_TAK', defaults={'position_flags': ['NOPE']})))

    for failure in failures:
        print('FAIL: ' + failure, file=sys.stderr)
    if not failures:
        print('ok: the registry rules reject every bad case and accept the good ones')
    return 1 if failures else 0


# --- main -------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--check', action='store_true',
                    help='validate and confirm the generated files are current; write nothing')
    ap.add_argument('--base', metavar='REF',
                    help='git ref to compare against: allocations kept, revisions raised')
    ap.add_argument('--selftest', action='store_true', help='prove the rules reject bad data')
    args = ap.parse_args()

    with open(COMMON_PROTO, encoding='utf-8') as fh, open(CONFIG_PROTO, encoding='utf-8') as cfg, \
            open(MODULE_CONFIG_PROTO, encoding='utf-8') as mod:
        enums = Enums(fh.read(), cfg.read(), mod.read())
    if args.selftest:
        return selftest(enums)

    errors = Errors()
    generated = generate(enums, errors)

    if args.base and not errors:
        verify = subprocess.run(['git', 'rev-parse', '--verify', '--quiet', args.base + '^{commit}'],
                                cwd=ROOT, capture_output=True)
        if verify.returncode != 0:
            errors.add('--base', '%s is not a commit' % args.base)
        else:
            compare_hardware(base_json(args.base, 'hw_vendors.json'), base_json(args.base, 'hw_devices.json'),
                             generated['hw_vendors.json'], generated['hw_devices.json'], errors)
            for name in ('regions.json', 'modem_presets.json', 'roles.json'):
                compare_revision(name, base_json(args.base, name), generated[name], errors)

    if not errors:
        for name, obj in generated.items():
            path = os.path.join(GENERATED, name)
            if args.check:
                try:
                    with open(path, encoding='utf-8') as fh:
                        current = fh.read().replace('\r\n', '\n')
                except FileNotFoundError:
                    current = None
                if current != render(obj):
                    errors.add('registry/generated/' + name, 'out of date; run python tools/gen_registry.py')
            else:
                os.makedirs(GENERATED, exist_ok=True)
                with open(path, 'w', encoding='utf-8', newline='\n') as fh:
                    fh.write(render(obj))

    for error in errors:
        print('error: ' + error, file=sys.stderr)
    if errors:
        return 1

    regions = generated['regions.json']
    print('%s: %d vendors, %d devices; %d regions, %d profiles, %d preset lists, %d swap groups (revision %d); '
          '%d presets (revision %d); %d roles, %d role presets (revision %d)' % (
              'ok' if args.check else 'wrote registry/generated',
              len(generated['hw_vendors.json']['vendors']), len(generated['hw_devices.json']['devices']),
              len(regions['regions']), len(regions['profiles']), len(regions['preset_lists']),
              len(regions['swap_groups']), regions['revision'],
              len(generated['modem_presets.json']['presets']), generated['modem_presets.json']['revision'],
              len(generated['roles.json']['roles']), len(generated['roles.json']['presets']),
              generated['roles.json']['revision']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
