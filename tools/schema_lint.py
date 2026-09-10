#!/usr/bin/env python3
"""Check the schema against the four rules SCHEMA.md states as invariants.

Each of these is a rule the documentation already claims, that protoc and buf
lint cannot see, and that has been broken at least once without anyone noticing:

  signed      no plain int32/int64. A negative one sign-extends to 64 bits and
              costs ten bytes whatever its magnitude, which is the single
              largest encoding mistake 2.x carried. Use sint32 (zigzag) when a
              value can be negative, uint32 when it cannot, or sfixed32 when it
              is a full-width quantity where a varint would cost five anyway.

  float       no float/double. A float is a fixed32 wire type - four bytes,
              always - where a scaled integer is one to three, and it costs
              software floating point on an FPU-less MCU.

  packed      every repeated scalar needs max_count in the matching .options.
              Proto3 packs by default, but nanopb honours that only for a
              bounded field; without the bound it emits a callback, which
              writes a tag per element while the .proto still reads `repeated`.

  layering    nothing in the air layer imports the client layer, so a consumer
              that only decodes mesh traffic can compile the air layer alone.

Usage:
    buf build -o descriptor.binpb
    python tools/schema_lint.py descriptor.binpb          # all rules
    python tools/schema_lint.py descriptor.binpb --rule signed
    python tools/schema_lint.py --list-allowed            # exemptions and why

Exits non-zero on any violation. The signed and float rules need the
descriptor; packed and layering read the .proto and .options files directly,
since nanopb options are not in the descriptor buf emits.
"""
from __future__ import annotations

import argparse
import glob
import os
import re
import sys

try:
    from google.protobuf import descriptor_pb2
except ImportError:  # pragma: no cover
    sys.exit('error: this needs the protobuf Python runtime (pip install protobuf)')

F = descriptor_pb2.FieldDescriptorProto

SIGNED_VARINT = {F.TYPE_INT32: 'int32', F.TYPE_INT64: 'int64'}
FLOATING = {F.TYPE_FLOAT: 'float', F.TYPE_DOUBLE: 'double'}
SCALARS = {
    F.TYPE_DOUBLE, F.TYPE_FLOAT, F.TYPE_INT64, F.TYPE_UINT64, F.TYPE_INT32,
    F.TYPE_FIXED64, F.TYPE_FIXED32, F.TYPE_BOOL, F.TYPE_UINT32, F.TYPE_ENUM,
    F.TYPE_SFIXED32, F.TYPE_SFIXED64, F.TYPE_SINT32, F.TYPE_SINT64,
}

# The client layer: the phone link, on-device storage, and the data files that
# only a client reads. Everything else is air layer - anything that can turn up
# in a Data payload, which includes admin, since remote administration means
# configuration travels over the mesh.
CLIENT_LAYER = {
    'api', 'localonly', 'deviceonly', 'apponly', 'clientonly',
    'region_registry', 'modem_preset_registry',
    'hw_vendor_registry', 'hw_device_registry',
}

# Exemptions carry their reason. An allowlist entry is a decision on the record,
# not a way to quieten the rule.
ALLOWED = {
    ('float', 'meshtastic.Nau7802Config.calibrationFactor'):
        'A load cell calibration factor is a scale, and quantising a scale '
        'quantises every reading derived from it. The NAU7802 driver API is '
        'float on both sides, so a scaled integer would add two conversions '
        'and remove none, and at this magnitude the varint is four bytes too. '
        'Stored to flash, never on air.',
    ('packed', 'resend_chunks.chunks'):
        'A resend list has no natural bound - it is however many chunks were '
        'lost - so a callback is the right field type. Client-facing, over the '
        'phone link, where the framing is not paid on air.',
}

IMPORT = re.compile(r'^import "meshtastic/([a-z_0-9]+)\.proto";', re.M)
REPEATED_FIELD = re.compile(r'^\s*repeated\s+(\w+)\s+(\w+)\s*=', re.M)
MESSAGE = re.compile(r'^\s*message\s+(\w+)', re.M)

PROTO_SCALARS = {
    'double', 'float', 'int32', 'int64', 'uint32', 'uint64', 'sint32',
    'sint64', 'fixed32', 'fixed64', 'sfixed32', 'sfixed64', 'bool',
}


def fq(file_pb, path, field):
    parts = [file_pb.package] + path + [field.name]
    return '.'.join(p for p in parts if p)


def walk(file_pb, messages, path=()):
    """Yield (path, message) for every message including nested ones."""
    for msg in messages:
        here = list(path) + [msg.name]
        yield here, msg
        yield from walk(file_pb, msg.nested_type, here)


def check_types(fds):
    """The signed and float rules, both read from the descriptor."""
    out = []
    for file_pb in fds.file:
        if not file_pb.name.startswith('meshtastic/'):
            continue
        for path, msg in walk(file_pb, file_pb.message_type):
            for field in msg.field:
                name = fq(file_pb, path, field)
                if field.type in SIGNED_VARINT:
                    if ('signed', name) in ALLOWED:
                        continue
                    out.append(('signed', file_pb.name, name, (
                        '%s is a plain varint: a negative value costs ten bytes. '
                        'Use sint32 if it can be negative, uint32 if it cannot.'
                        % SIGNED_VARINT[field.type])))
                elif field.type in FLOATING:
                    if ('float', name) in ALLOWED:
                        continue
                    out.append(('float', file_pb.name, name, (
                        '%s is four fixed bytes on the wire; a scaled integer '
                        'is one to three.' % FLOATING[field.type])))
    return out


def check_packed(root):
    """Every repeated scalar needs max_count, or nanopb makes it a callback."""
    out = []
    for proto in sorted(glob.glob(os.path.join(root, 'meshtastic', '*.proto'))):
        options = proto[:-6] + '.options'
        opts = ''
        if os.path.exists(options):
            with open(options, encoding='utf-8') as fh:
                opts = fh.read()
        with open(proto, encoding='utf-8') as fh:
            text = fh.read()

        # Track the enclosing message by position, so the name in the .options
        # file can be matched.
        bounds = [(m.start(), m.group(1)) for m in MESSAGE.finditer(text)]
        for m in REPEATED_FIELD.finditer(text):
            if m.group(1) not in PROTO_SCALARS:
                continue
            owner = ''
            for pos, name in bounds:
                if pos < m.start():
                    owner = name
            key = '%s.%s' % (owner, m.group(2))
            if ('packed', key) in ALLOWED:
                continue
            if not re.search(r'\*?%s\s+max_count' % re.escape(key), opts):
                out.append(('packed', os.path.basename(proto), key,
                            'repeated %s with no max_count: nanopb emits a '
                            'callback, which writes a tag per element.'
                            % m.group(1)))
    return out


def check_layering(root):
    """No air-layer file may import a client-layer one."""
    out = []
    for proto in sorted(glob.glob(os.path.join(root, 'meshtastic', '*.proto'))):
        name = os.path.basename(proto)[:-6]
        if name in CLIENT_LAYER:
            continue
        with open(proto, encoding='utf-8') as fh:
            for dep in IMPORT.findall(fh.read()):
                if dep in CLIENT_LAYER:
                    out.append(('layering', os.path.basename(proto),
                                '%s -> %s' % (name, dep),
                                'air layer importing the client layer.'))
    return out


RULES = ('signed', 'float', 'packed', 'layering')


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('descriptor', nargs='?',
                    help='FileDescriptorSet, e.g. from `buf build -o`')
    ap.add_argument('--rule', choices=RULES, action='append',
                    help='run only this rule (repeatable)')
    ap.add_argument('--root', default='.', help='repository root')
    ap.add_argument('--list-allowed', action='store_true',
                    help='print the exemptions and their reasons, then exit')
    args = ap.parse_args()

    if args.list_allowed:
        for (rule, name), why in sorted(ALLOWED.items()):
            print('%s  %s\n    %s\n' % (rule, name, why))
        return 0

    wanted = set(args.rule or RULES)
    findings = []

    if wanted & {'signed', 'float'}:
        if not args.descriptor:
            print('error: the signed and float rules need a descriptor set',
                  file=sys.stderr)
            return 2
        fds = descriptor_pb2.FileDescriptorSet()
        with open(args.descriptor, 'rb') as fh:
            fds.ParseFromString(fh.read())
        findings += [f for f in check_types(fds) if f[0] in wanted]

    if 'packed' in wanted:
        findings += check_packed(args.root)
    if 'layering' in wanted:
        findings += check_layering(args.root)

    for rule, where, name, why in findings:
        print('%s: %s: %s: %s' % (rule, where, name, why), file=sys.stderr)

    if findings:
        print('%d violation(s) across %d rule(s)'
              % (len(findings), len({f[0] for f in findings})), file=sys.stderr)
        return 1

    print('ok: %s clean, %d exemption(s) on record'
          % (', '.join(sorted(wanted)), len(ALLOWED)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
