#!/usr/bin/env python3
"""Self-check for gen_bitfield_accessors.py.

Three things are worth proving, and none of them need nanopb or the firmware:

  1. The validator rejects a mask that is not a single bit, and two masks that
     overlap. This is the whole reason the generator exists, so it is checked
     directly rather than inferred.
  2. The emitted header compiles, against stub enum constants standing in for the
     ones nanopb generates.
  3. The accessors actually read and write the right bits.

Usage:
    buf build -o descriptor.binpb
    python tools/test_bitfield_accessors.py descriptor.binpb
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_bitfield_accessors as gen  # noqa: E402

from google.protobuf import descriptor_pb2  # noqa: E402


def check_validator() -> list[str]:
    """The validator must reject exactly the mistakes the macros allowed."""
    fails = []

    good = {'ctype': 'uint32_t',
            'values': [('NONE', 0), ('A', 0x1), ('B', 0x2), ('C', 0x4)]}
    if gen.validate(good) != []:
        fails.append('a valid mask set was rejected')

    multi = {'ctype': 'uint32_t', 'values': [('NONE', 0), ('BAD', 0x600)]}
    if not any('single bit' in p for p in gen.validate(multi)):
        fails.append('a multi-bit value (0x600) was not rejected')

    dup = {'ctype': 'uint32_t',
           'values': [('NONE', 0), ('A', 0x4), ('B', 0x4)]}
    if not any('share bit' in p for p in gen.validate(dup)):
        fails.append('two values sharing a bit were not rejected')

    wide = {'ctype': 'uint32_t', 'values': [('NONE', 0), ('TOOBIG', 1 << 33)]}
    if not any('does not fit' in p for p in gen.validate(wide)):
        fails.append('a value wider than the field was not rejected')

    return fails


def stub_enums(records) -> str:
    """Stand in for the enum constants nanopb emits, so the header can compile."""
    out = ['#pragma once\n#include <stdint.h>\n']
    seen = set()
    for rec in records:
        for name, num in rec['values']:
            sym = '%s_%s' % (rec['enum_c'], name)
            if sym in seen:
                continue
            seen.add(sym)
            suffix = 'ULL' if rec['ctype'] == 'uint64_t' else 'U'
            out.append('static const %s %s = 0x%X%s;\n' % (rec['ctype'], sym, num, suffix))
    return ''.join(out)


MAIN = '''#include "stubs.h"
#include "bitfields.h"
#include <cassert>
#include <cstdio>

int main() {
  // A round trip through a view must set exactly the bit its mask names.
  uint32_t w = 0;
  meshtastic_NodeInfo_flags_view f(w);
  assert(!f.is_muted());
  f.set_is_muted();
  assert(f.is_muted());
  assert(w == meshtastic_NodeFlags_NODE_FLAG_IS_MUTED);

  // Setting a second flag must not disturb the first.
  f.set_via_mqtt();
  assert(f.is_muted() && f.via_mqtt());
  assert(w == (meshtastic_NodeFlags_NODE_FLAG_IS_MUTED |
               meshtastic_NodeFlags_NODE_FLAG_VIA_MQTT));

  // Clearing one leaves the other.
  f.clear_is_muted();
  assert(!f.is_muted() && f.via_mqtt());

  // any/all over a mask pair.
  assert(f.any(meshtastic_NodeFlags_NODE_FLAG_VIA_MQTT |
               meshtastic_NodeFlags_NODE_FLAG_IS_FAVORITE));
  assert(!f.all(meshtastic_NodeFlags_NODE_FLAG_VIA_MQTT |
                meshtastic_NodeFlags_NODE_FLAG_IS_FAVORITE));
  f.clear();
  assert(w == 0);

  // A 64-bit bitfield works the same way.
  uint64_t p = 0;
  meshtastic_PowerConfig_powermon_enables_view pm(p);
  pm.set_gps_active();
  assert(pm.gps_active());
  assert(p == meshtastic_PowerMon_State_GPS_Active);

  // The stored and client-facing node words share one enum, so a value written
  // through one view reads back through the other.
  uint32_t stored = 0;
  meshtastic_NodeInfoLite_bitfield_view s(stored);
  s.set_is_favorite();
  meshtastic_NodeInfo_flags_view mirror(stored);
  assert(mirror.is_favorite());

  std::puts("bitfield accessors OK");
  return 0;
}
'''


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('descriptor')
    ap.add_argument('--cxx', default=os.environ.get('CXX', 'g++'))
    args = ap.parse_args()

    fails = check_validator()
    for f in fails:
        print('FAIL: validator: %s' % f, file=sys.stderr)
    if fails:
        return 1
    print('ok: validator rejects multi-bit, duplicate and oversized masks')

    fds = descriptor_pb2.FileDescriptorSet()
    fds.ParseFromString(open(args.descriptor, 'rb').read())
    enums = gen.collect_enums(fds)
    records = gen.find_bitfields(fds, enums)
    for rec in records:
        problems = gen.validate(rec)
        if problems:
            print('FAIL: %s: %s' % (rec['where'], '; '.join(problems)), file=sys.stderr)
            return 1
    print('ok: all %d bitfields in the schema pass validation' % len(records))

    with tempfile.TemporaryDirectory() as d:
        open(os.path.join(d, 'bitfields.h'), 'w', newline='\n').write(gen.emit(records))
        open(os.path.join(d, 'stubs.h'), 'w', newline='\n').write(stub_enums(records))
        open(os.path.join(d, 'main.cpp'), 'w', newline='\n').write(MAIN)
        exe = os.path.join(d, 'a.exe' if os.name == 'nt' else 'a.out')
        cmd = [args.cxx, '-std=c++17', '-Os', '-Wall', '-Wextra', '-Werror',
               '-I', d, os.path.join(d, 'main.cpp'), '-o', exe]
        # An MSYS2/mingw g++ given by absolute path cannot find its own runtime
        # DLLs unless its bin directory is on PATH, and fails silently if not.
        env = dict(os.environ)
        cxx_dir = os.path.dirname(os.path.abspath(args.cxx))
        if os.path.isdir(cxx_dir):
            env['PATH'] = cxx_dir + os.pathsep + env.get('PATH', '')
        r = subprocess.run(cmd, capture_output=True, text=True, env=env)
        if r.returncode:
            print('FAIL: compile\n%s\n%s' % (r.stdout, r.stderr), file=sys.stderr)
            return 1
        print('ok: generated header compiles at -Os with -Wall -Wextra -Werror')
        r = subprocess.run([exe], capture_output=True, text=True, env=env)
        if r.returncode:
            print('FAIL: run\n%s\n%s' % (r.stdout, r.stderr), file=sys.stderr)
            return 1
        print('ok: ' + r.stdout.strip())
    return 0


if __name__ == '__main__':
    sys.exit(main())
