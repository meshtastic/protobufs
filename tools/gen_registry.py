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
entry is rejected. Registry fields keep integer units (MHz x100, percent, kHz); a
value firmware holds as a fraction is entered rounded down, and firmware keeps the
exact value.
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

LEGACY_FILE = '00-legacy.yaml'
VENDOR_MAX = 0x3F
DEVICE_MIN, DEVICE_MAX = 0x01, 0xFE
TWO_VARINT_BYTES = 0x4000

VENDOR_SLUG = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
UPPER_WORDS = re.compile(r'^[A-Z0-9]+(?:_[A-Z0-9]+)*$')

REGION_TABLES = ('preset_lists', 'profiles', 'swap_groups', 'regions')
REGION_INTS = ('freq_start_mhz_x100', 'freq_end_mhz_x100', 'duty_cycle', 'router_duty_cycle', 'power_limit_dbm')
REGION_BOOLS = ('frequency_switching', 'wide_lora')
REGION_KEYS = ('region', 'profile') + REGION_INTS + REGION_BOOLS + ('override_slot',)
PROFILE_INTS = ('spacing_khz', 'padding_khz', 'position_throttle', 'telemetry_throttle')
PROFILE_BOOLS = ('audio_permitted', 'licensed_only')
PROFILE_KEYS = ('name', 'preset_list', 'default_preset') + PROFILE_INTS + PROFILE_BOOLS
PRESET_KEYS = ('preset', 'name', 'bandwidth_khz', 'wide_bandwidth_khz', 'spread_factor', 'coding_rate')

OUTPUTS = ('hw_vendors.json', 'hw_devices.json', 'regions.json', 'modem_presets.json')


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
    """RegionCode and ModemPreset, read from common.proto so the data follows the schema."""

    def __init__(self, proto_text):
        self.regions = self._enum(proto_text, 'RegionCode')
        self.presets = self._enum(proto_text, 'ModemPreset')

    @staticmethod
    def _enum(proto_text, name):
        m = re.search(r'^enum %s \{(.*?)^\}' % name, proto_text, re.S | re.M)
        if not m:
            raise SystemExit('error: enum %s not found in common.proto' % name)
        return {k: int(v) for k, v in re.findall(r'^\s+([A-Z][A-Z0-9_]*) = (\d+);', m.group(1), re.M)}


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
            if not exact_keys(errors, dwhere, device, ('id', 'slug', 'name'), ('display',)):
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
            if 'display' in device:
                entry['display'] = text(errors, dwhere, device['display'], 'display')
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


def build_presets(doc, enums, errors):
    where = 'modem_presets.yaml'
    if not exact_keys(errors, where, doc, ('revision', 'presets')):
        return None
    revision = build_revision(errors, where, doc)
    if not isinstance(doc['presets'], list):
        errors.add(where, 'presets must be a list')
        return None

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
        check_ints(errors, pwhere, preset, ('bandwidth_khz',), low=1)
        check_ints(errors, pwhere, preset, ('wide_bandwidth_khz',))
        if not is_int(preset['spread_factor']) or not 5 <= preset['spread_factor'] <= 12:
            errors.add(pwhere, 'spread_factor must be 5-12')
        if not is_int(preset['coding_rate']) or not 5 <= preset['coding_rate'] <= 8:
            errors.add(pwhere, 'coding_rate must be 5-8, the denominator of 4/x')
        entry = {key: preset[key] for key in PRESET_KEYS}
        entry.update(preset=name, name=text(errors, pwhere, preset['name'], 'name'))
        out.append(entry)

    out.sort(key=lambda e: enums.presets[e['preset']])
    return {'revision': revision, 'presets': out}


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
        if not exact_keys(errors, pwhere, entry, PROFILE_KEYS):
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
        profile = {key: entry[key] for key in PROFILE_KEYS}
        profile['default_preset'] = default
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
        if not exact_keys(errors, rwhere, entry, REGION_KEYS):
            continue
        code = enum_name(errors, rwhere, 'REGION_', entry['region'], enums.regions, 'RegionCode',
                         reserved=('REGION_UNSET',))
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
        if entry['freq_start_mhz_x100'] >= entry['freq_end_mhz_x100']:
            errors.add(rwhere, 'freq_start_mhz_x100 must be below freq_end_mhz_x100')
        if not 1 <= entry['duty_cycle'] <= 100:
            errors.add(rwhere, 'duty_cycle must be 1-100')
        if entry['router_duty_cycle'] > 100:
            errors.add(rwhere, 'router_duty_cycle must be 0-100')
        if entry['router_duty_cycle'] == entry['duty_cycle']:
            errors.add(rwhere, 'router_duty_cycle repeats duty_cycle; leave it 0')
        if not is_int(entry['override_slot']) or not -1 <= entry['override_slot'] <= 32767:
            errors.add(rwhere, 'override_slot must be -1, 0 or a slot number')
        if entry['wide_lora'] and presets is not None:
            for name in lists[profile['preset_list']]:
                if not presets[name]['wide_bandwidth_khz']:
                    errors.add(rwhere, 'is wide_lora but permits %s, which has no wide_bandwidth_khz' % name)
        region = {key: entry[key] for key in REGION_KEYS}
        del region['region']
        regions[code] = dict(region_code=code, **region)
    for pname in profiles:
        if pname not in profiles_used:
            errors.add(where, 'profile %s is not used by any region' % pname)

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
    presets = build_presets(load_yaml(os.path.join(REGISTRY, 'modem_presets.yaml'), errors), enums, errors)
    regions = build_regions(load_yaml(os.path.join(REGISTRY, 'regions.yaml'), errors), enums, presets, errors)
    return dict(zip(OUTPUTS, (vendors, devices, regions, presets)))


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

    fast = {'preset': 'LONG_FAST', 'name': 'LongFast', 'bandwidth_khz': 250, 'wide_bandwidth_khz': 812,
            'spread_factor': 11, 'coding_rate': 5}
    narrow = {'preset': 'NARROW_FAST', 'name': 'NarrowFast', 'bandwidth_khz': 62, 'wide_bandwidth_khz': 0,
              'spread_factor': 7, 'coding_rate': 6}

    def presets(*entries):
        return lambda errors: build_presets({'revision': 1, 'presets': list(entries)}, enums, errors)

    expect('valid presets', False, presets(fast, narrow))
    expect('an unknown preset', True, presets(dict(fast, preset='WARP')))
    expect('a preset defined twice', True, presets(fast, fast))
    expect('spread factor 13', True, presets(dict(fast, spread_factor=13)))
    expect('coding rate 9', True, presets(dict(fast, coding_rate=9)))
    expect('zero bandwidth', True, presets(dict(fast, bandwidth_khz=0)))

    preset_registry = build_presets({'revision': 1, 'presets': [fast, narrow]}, enums, Errors())
    lists = ({'name': 'STD', 'presets': ['LONG_FAST']}, {'name': 'NARROW', 'presets': ['NARROW_FAST']})
    std = {'name': 'STD', 'preset_list': 'STD', 'default_preset': 'LONG_FAST', 'spacing_khz': 0, 'padding_khz': 0,
           'audio_permitted': True, 'licensed_only': False, 'position_throttle': 1, 'telemetry_throttle': 1}
    ham = dict(std, name='HAM', preset_list='NARROW', default_preset='NARROW_FAST', padding_khz=18, licensed_only=True)
    us = {'region': 'US', 'profile': 'STD', 'freq_start_mhz_x100': 90200, 'freq_end_mhz_x100': 92800,
          'duty_cycle': 100, 'router_duty_cycle': 0, 'power_limit_dbm': 30, 'frequency_switching': False,
          'wide_lora': False, 'override_slot': 0}
    ham70 = dict(us, region='ITU1_70CM', profile='HAM', freq_start_mhz_x100=43000, freq_end_mhz_x100=44000,
                 override_slot=37)
    cn = dict(us, region='CN')

    def regions(lists=lists, profiles=(std, ham), regions=(us, ham70), swap_groups=(), revision=1):
        doc = {'revision': revision, 'preset_lists': list(lists), 'profiles': list(profiles),
               'regions': list(regions), 'swap_groups': list(swap_groups)}
        return lambda errors: build_regions(doc, enums, preset_registry, errors)

    expect('valid region tables', False, regions())
    expect('revision 0', True, regions(revision=0))
    expect('an unknown region', True, regions(regions=(us, dict(ham70, region='MARS'))))
    expect('the UNSET region', True, regions(regions=(us, ham70, dict(us, region='UNSET'))))
    expect('a region defined twice', True, regions(regions=(us, ham70, us)))
    expect('an undefined profile', True, regions(regions=(us, ham70, dict(cn, profile='NOPE'))))
    expect('reversed frequencies', True, regions(regions=(dict(us, freq_end_mhz_x100=90000), ham70)))
    expect('a zero duty cycle', True, regions(regions=(dict(us, duty_cycle=0), ham70)))
    expect('a router duty cycle repeating duty_cycle', True,
           regions(regions=(dict(us, duty_cycle=10, router_duty_cycle=10), ham70)))
    expect('a router duty cycle of its own', False, regions(regions=(dict(us, duty_cycle=2, router_duty_cycle=10), ham70)))
    expect('override slot -2', True, regions(regions=(us, dict(ham70, override_slot=-2))))
    expect('a wide region permitting a preset without a wide form', True,
           regions(regions=(us, dict(ham70, wide_lora=True))))
    expect('a default preset outside its list', True, regions(profiles=(std, dict(ham, default_preset='LONG_FAST'))))
    expect('a listed preset without parameters', True,
           regions(lists=({'name': 'STD', 'presets': ['LONG_FAST', 'SHORT_FAST']}, lists[1])))
    expect('an unused profile', True, regions(profiles=(std, ham, dict(ham, name='SPARE', licensed_only=False))))
    expect('an unused preset list', True,
           regions(lists=lists + ({'name': 'SPARE', 'presets': ['LONG_FAST', 'NARROW_FAST']},)))
    expect('two lists holding the same presets', True,
           regions(lists=lists + ({'name': 'COPY', 'presets': ['LONG_FAST']},),
                   profiles=(std, ham, dict(std, name='OTHER', preset_list='COPY')),
                   regions=(us, ham70, dict(cn, profile='OTHER'))))
    expect('two identical profiles', True,
           regions(profiles=(std, ham, dict(std, name='OTHER')), regions=(us, ham70, dict(cn, profile='OTHER'))))
    expect('a valid swap group', False, regions(swap_groups=({'regions': ['US', 'ITU1_70CM']},)))
    expect('a swap group of one region', True, regions(swap_groups=({'regions': ['US']},)))
    expect('a region in two swap groups', True,
           regions(swap_groups=({'regions': ['US', 'ITU1_70CM']}, {'regions': ['ITU1_70CM', 'US']})))
    expect('swap siblings permitting the same preset', True,
           regions(regions=(us, ham70, cn), swap_groups=({'regions': ['US', 'CN']},)))

    before = {'revision': 3, 'regions': [{'name': 'US'}]}
    changed = {'revision': 3, 'regions': [{'name': 'EU'}]}
    expect('a change without a revision bump', True, lambda e: compare_revision('regions', before, changed, e))
    expect('a revision going down', True, lambda e: compare_revision('regions', before, dict(before, revision=2), e))
    expect('a change with a revision bump', False,
           lambda e: compare_revision('regions', before, dict(changed, revision=4), e))
    expect('no change at the same revision', False, lambda e: compare_revision('regions', before, dict(before), e))

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

    with open(COMMON_PROTO, encoding='utf-8') as fh:
        enums = Enums(fh.read())
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
            for name in ('regions.json', 'modem_presets.json'):
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
          '%d presets (revision %d)' % (
              'ok' if args.check else 'wrote registry/generated',
              len(generated['hw_vendors.json']['vendors']), len(generated['hw_devices.json']['devices']),
              len(regions['regions']), len(regions['profiles']), len(regions['preset_lists']),
              len(regions['swap_groups']), regions['revision'],
              len(generated['modem_presets.json']['presets']), generated['modem_presets.json']['revision']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
