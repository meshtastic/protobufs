#!/usr/bin/env python3
"""Generate named C++ accessors for the schema's packed bitfields.

Packed booleans live in the schema as an enum of hex masks beside a uint32 field
(see the Bitfields section in SCHEMA.md). That gets the bit meanings into
every generated language for free, but firmware still has to write `n->flags &
MASK` by hand, which is where bit-assignment bugs come from.

This reads the descriptor set protoc/buf already emits and writes a header-only
view over the plain integer nanopb generates. The generated struct and the wire
format are both untouched: the view is a wrapper, and at -Os it compiles to the
same instructions as the hand-written mask.

A view is a class template over the integer it wraps (X_view_t<T>), made by a function
of the same name without the suffix (X_view(field)), because nanopb sizes that integer
from the .options file (int_size:8 gives a uint8_t) and the descriptor does not carry it.
A function deduces T in C++11; class template argument deduction would need C++17, and
GCC 9 mis-parses it in some expressions. The same view reads a const field; only the
setters need a mutable one. Each view asserts at instantiation that every mask fits the type it was
given, and the .options files are read here too so --check catches a mask wider than
its int_size before any firmware compiles.

The real value is the checks. A mask that is not a single bit, or two masks that
overlap, are rejected here rather than shipped. The emitted header repeats the
guarantee as static_asserts so it survives someone bypassing the generator.

Usage:
    buf build -o descriptor.binpb
    python tools/gen_bitfield_accessors.py descriptor.binpb -o meshtastic_bitfields.h
    python tools/gen_bitfield_accessors.py descriptor.binpb --check   # CI

Then in C++11 or later:
    meshtastic_MeshPacket_flags_view(p.flags).want_ack()
    meshtastic_MeshPacket_flags_view(p.flags).set_want_ack(true)

Requires the `protobuf` Python runtime, which is only needed to read the
descriptor - nothing at firmware build time depends on it.
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

# A field is a bitfield when its own comment says so. The marker is prose that is
# already there for human readers, so nothing extra has to be maintained, and a
# uint32 of bits that is not a set of named booleans - a GPIO mask, or an index
# into another enum - simply never says this and is skipped.
MARKER = re.compile(r'bitwise OR of ([A-Za-z_][A-Za-z0-9_.]*) values', re.I)

# Numeric field types that can carry a bitfield.
INT_TYPES = {
    descriptor_pb2.FieldDescriptorProto.TYPE_UINT32: 'uint32_t',
    descriptor_pb2.FieldDescriptorProto.TYPE_UINT64: 'uint64_t',
    descriptor_pb2.FieldDescriptorProto.TYPE_FIXED32: 'uint32_t',
    descriptor_pb2.FieldDescriptorProto.TYPE_FIXED64: 'uint64_t',
}

LABEL_REPEATED = descriptor_pb2.FieldDescriptorProto.LABEL_REPEATED

DEFAULT_OPTIONS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'meshtastic')
INT_SIZE = re.compile(r'^\s*\*?([A-Za-z_][A-Za-z0-9_.]*)\s.*\bint_size:(8|16|32|64)\b')


def parse_int_sizes(options_dir: str) -> dict[tuple[str, ...], int]:
    """(message path..., field) -> bit width, from nanopb int_size lines in *.options."""
    sizes: dict[tuple[str, ...], int] = {}
    for path in glob.glob(os.path.join(options_dir, '*.options')):
        with open(path, encoding='utf-8') as fh:
            for line in fh:
                m = INT_SIZE.match(line.split('#', 1)[0])
                if m:
                    sizes[tuple(m.group(1).split('.'))] = int(m.group(2))
    return sizes


def field_bits(scope: list[str], field: str, proto_bits: int, sizes) -> int:
    """nanopb's storage width: the longest .options pattern that ends in this field."""
    full = tuple(scope) + (field,)
    best, best_len = proto_bits, 0
    for key, bits in sizes.items():
        if len(key) > best_len and full[-len(key):] == key:
            best, best_len = bits, len(key)
    return best


class Error(Exception):
    pass


def c_name(package: str, path: list[str]) -> str:
    """nanopb's C name for a nested type: meshtastic_Outer_Inner."""
    return '_'.join([package.replace('.', '_')] + path)


def collect_enums(fds) -> dict[str, list[tuple[str, int]]]:
    """Fully-qualified enum name -> [(value name, number)]."""
    out: dict[str, list[tuple[str, int]]] = {}

    def walk(pkg: str, path: list[str], msg):
        for en in msg.enum_type:
            fq = '.'.join([pkg] + path + [en.name])
            out[fq] = [(v.name, v.number) for v in en.value]
        for nested in msg.nested_type:
            walk(pkg, path + [nested.name], nested)

    for f in fds.file:
        pkg = f.package
        for en in f.enum_type:
            out['.'.join([pkg, en.name])] = [(v.name, v.number) for v in en.value]
        for msg in f.message_type:
            walk(pkg, [msg.name], msg)
    return out


def enum_files(fds) -> dict[str, str]:
    """Fully-qualified enum name -> the .proto file that defines it."""
    out: dict[str, str] = {}
    for f in fds.file:
        for fq in collect_enums(descriptor_pb2.FileDescriptorSet(file=[f])):
            out[fq] = f.name
    return out


def pb_header(proto: str) -> str:
    """The header nanopb generates for a .proto, as its own headers include it."""
    return proto[:-len('.proto')] + '.pb.h' if proto.endswith('.proto') else proto + '.pb.h'


def comments_by_path(f) -> dict[tuple[int, ...], str]:
    out = {}
    for loc in f.source_code_info.location:
        text = (loc.leading_comments or '') + (loc.trailing_comments or '')
        if text:
            out[tuple(loc.path)] = text
    return out


def resolve(ref: str, pkg: str, scope: list[str], enums: dict) -> str:
    """Resolve an enum reference the way protoc does: innermost scope outwards."""
    for i in range(len(scope), -1, -1):
        cand = '.'.join([pkg] + scope[:i] + [ref])
        if cand in enums:
            return cand
    cand = '.'.join([pkg, ref])
    if cand in enums:
        return cand
    if ref in enums:
        return ref
    raise Error('cannot resolve enum %r' % ref)


def find_bitfields(fds, enums, sizes=None):
    """Yield one record per bitfield field found."""
    found = []
    defined_in = enum_files(fds)
    for f in fds.file:
        pkg = f.package
        comments = comments_by_path(f)

        def walk(path_prefix, msg, scope):
            # 4 = FileDescriptorProto.message_type, 3 = DescriptorProto.nested_type
            for fi, field in enumerate(msg.field):
                text = comments.get(tuple(path_prefix) + (2, fi), '')
                m = MARKER.search(text)
                if not m:
                    continue
                if field.label == LABEL_REPEATED:
                    raise Error('%s.%s is repeated; a bitfield must be singular'
                                % ('.'.join(scope), field.name))
                if field.type not in INT_TYPES:
                    raise Error('%s.%s is not an unsigned integer'
                                % ('.'.join(scope), field.name))
                fq = resolve(m.group(1), pkg, scope, enums)
                proto_bits = 64 if INT_TYPES[field.type] == 'uint64_t' else 32
                found.append({
                    'struct': c_name(pkg, scope),
                    'field': field.name,
                    'ctype': INT_TYPES[field.type],
                    'bits': field_bits(scope, field.name, proto_bits, sizes or {}),
                    'enum_fq': fq,
                    'enum_c': c_name(pkg, fq[len(pkg) + 1:].split('.')),
                    'values': enums[fq],
                    'where': '%s: %s.%s' % (f.name, '.'.join(scope), field.name),
                    # The struct's header, and the enum's: a comment reference is not an import.
                    'headers': sorted({pb_header(f.name), pb_header(defined_in[fq])}),
                })
            for ni, nested in enumerate(msg.nested_type):
                walk(list(path_prefix) + [3, ni], nested, scope + [nested.name])

        for mi, msg in enumerate(f.message_type):
            walk([4, mi], msg, [msg.name])
    return found


def validate(rec) -> list[str]:
    """Every non-zero mask must be a single bit, and no two may overlap."""
    problems = []
    seen: dict[int, str] = {}
    for name, num in rec['values']:
        if num == 0:
            continue
        if num < 0:
            problems.append('%s = %d is negative' % (name, num))
            continue
        if num & (num - 1):
            problems.append('%s = 0x%X is not a single bit' % (name, num))
            continue
        if num in seen:
            problems.append('%s and %s share bit 0x%X' % (seen[num], name, num))
            continue
        seen[num] = name
    width = rec.get('bits') or (64 if rec['ctype'] == 'uint64_t' else 32)
    for name, num in rec['values']:
        if num >= (1 << width):
            problems.append('%s = 0x%X does not fit the %d-bit field' % (name, num, width))
    return problems


def accessor_name(value_name: str, enum_values) -> str:
    """FLAG_IS_MUTED -> is_muted, dropping the prefix the whole enum shares."""
    names = [n for n, v in enum_values if v != 0]
    prefix = ''
    if len(names) > 1:
        parts = [n.split('_') for n in names]
        common = []
        for chunk in zip(*parts):
            if len(set(chunk)) == 1:
                common.append(chunk[0])
            else:
                break
        # Never eat the whole name.
        while common and any(len(p) <= len(common) for p in parts):
            common.pop()
        prefix = '_'.join(common) + '_' if common else ''
    name = value_name[len(prefix):] if prefix and value_name.startswith(prefix) else value_name
    return name.lower()


HEADER = '''// Generated by tools/gen_bitfield_accessors.py -- do not edit.
//
// Named accessors for the schema's packed bitfields. Each view wraps the plain
// integer nanopb generates; the struct and the wire format are unchanged, and at
// -Os these compile to the same instructions as a hand-written mask.
//
// The static_asserts below prove every mask is a single distinct bit, so a bad
// bit assignment fails the build rather than shipping.

#pragma once
// Also guarded by name: a header reached through two include spellings is two files to
// some toolchains' #pragma once, and a template cannot be defined twice.
#ifndef MESHTASTIC_BITFIELDS_H
#define MESHTASTIC_BITFIELDS_H

#include <limits>
#include <stdint.h>
#include <type_traits>

'''


def emit(records) -> str:
    out = [HEADER]
    headers = sorted({h for rec in records for h in rec.get('headers', ())})
    if headers:
        out.append(''.join('#include "%s"\n' % h for h in headers) + '\n')
    for rec in sorted(records, key=lambda r: (r['struct'], r['field'])):
        vals = [(n, v) for n, v in rec['values'] if v != 0]
        view = '%s_%s_view' % (rec['struct'], rec['field'])
        out.append('// %s\n' % rec['where'])
        for name, num in vals:
            out.append('static_assert((%s_%s & (%s_%s - 1)) == 0,\n'
                       '              "%s must be a single bit");\n'
                       % (rec['enum_c'], name, rec['enum_c'], name, name))
        total = 0
        for _, num in vals:
            total |= num
        out.append('static_assert((%s) == 0x%XU, "%s masks must be disjoint");\n'
                   % (' + '.join('%s_%s' % (rec['enum_c'], n) for n, _ in vals) or '0',
                      total, rec['field']))
        out.append('''
template <typename T> struct %s_t {
  typedef typename std::remove_const<T>::type word;
  static_assert(std::is_unsigned<word>::value, "%s wraps an unsigned field");
  static_assert(0x%XULL <= std::numeric_limits<word>::max(), "%s masks do not fit the field");

  T &raw;

  explicit %s_t(T &v) : raw(v) {}

''' % (view, view, total, rec['field'], view))
        for name, num in vals:
            acc = accessor_name(name, rec['values'])
            mask = '%s_%s' % (rec['enum_c'], name)
            out.append('  bool %s() const { return (raw & %s) != 0; }\n' % (acc, mask))
            out.append('  void set_%s(bool on = true) { raw = static_cast<word>(on ? (raw | %s) : (raw & ~%s)); }\n'
                       % (acc, mask, mask))
            out.append('  void clear_%s() { set_%s(false); }\n\n' % (acc, acc))
        out.append('''  bool any(uint64_t m) const { return (raw & m) != 0; }
  bool all(uint64_t m) const { return (raw & m) == m; }
  void set(uint64_t m, bool on = true) { raw = static_cast<word>(on ? (raw | m) : (raw & ~m)); }
  void clear() { raw = 0; }
};

template <typename T> inline %s_t<T> %s(T &v) { return %s_t<T>(v); }

''' % (view, view, view))
    out.append('#endif // MESHTASTIC_BITFIELDS_H\n')
    return ''.join(out)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('descriptor', help='FileDescriptorSet, e.g. from `buf build -o`')
    ap.add_argument('-o', '--output', help='header to write (default: stdout)')
    ap.add_argument('--list', action='store_true', help='list bitfields found and exit')
    ap.add_argument('--check', action='store_true',
                    help='validate only, emit nothing; for CI')
    ap.add_argument('--options-dir', default=DEFAULT_OPTIONS_DIR,
                    help='directory of nanopb *.options files, for int_size (default: ../meshtastic)')
    args = ap.parse_args()

    fds = descriptor_pb2.FileDescriptorSet()
    with open(args.descriptor, 'rb') as fh:
        fds.ParseFromString(fh.read())

    if not any(f.HasField('source_code_info') for f in fds.file):
        return err('descriptor has no source info; build it without --exclude-source-info')

    enums = collect_enums(fds)
    try:
        records = find_bitfields(fds, enums, parse_int_sizes(args.options_dir))
    except Error as e:
        return err(str(e))

    if not records:
        return err('no bitfields found; is the "bitwise OR of X values" marker present?')

    bad = False
    for rec in records:
        problems = validate(rec)
        for p in problems:
            print('error: %s: %s' % (rec['where'], p), file=sys.stderr)
            bad = True
    if bad:
        return 1

    if args.check:
        print('ok: %d bitfields, every mask a single distinct bit' % len(records))
        return 0

    if args.list:
        for rec in sorted(records, key=lambda r: r['where']):
            print('%-58s %-34s %d bits in a %d-bit field' % (rec['where'], rec['enum_fq'],
                                                         len([v for _, v in rec['values'] if v]), rec['bits']))
        return 0

    text = emit(records)
    if args.output:
        with open(args.output, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(text)
        print('wrote %s (%d bitfields)' % (args.output, len(records)), file=sys.stderr)
    else:
        sys.stdout.write(text)
    return 0


def err(msg: str) -> int:
    print('error: ' + msg, file=sys.stderr)
    return 1


if __name__ == '__main__':
    sys.exit(main())
