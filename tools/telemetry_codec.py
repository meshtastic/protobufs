#!/usr/bin/env python3
"""Encode and decode the 3.0 SensorReadings telemetry payload, standalone.

Turns a plain JSON file of timestamped sensor readings into the binary payload a
node would carry - a Telemetry message holding a SensorReadings batch - and back.
It needs no protoc and no generated code: the wire format is written by hand from
the protobuf rules, and the quantity and sensor names, their numbers and the
array bounds are read from telemetry.proto and telemetry.options at start-up, so
the tool follows the schema as it changes.

    python tools/telemetry_codec.py encode readings.json payload.bin
    python tools/telemetry_codec.py decode payload.bin [readings.json]
    python tools/telemetry_codec.py decode 0d80b2c668...           # hex also accepted
    python tools/telemetry_codec.py --check                         # self-test

It can also carry the payload over a real mesh, inside an ordinary 2.x MeshPacket
on an otherwise unused port, using the meshtastic Python package:

    python tools/telemetry_codec.py send readings.json --port COM21 [--dest !1234abcd]
    python tools/telemetry_codec.py listen --port COM21 [--timeout 60]

JSON format - values are in real units, and the quantity name says what unit and
scale it is carried in:

    {
      "sensors": { "AIR_TEMPERATURE_C_CENTI": "BME280" },
      "samples": [
        { "time": 1757836800, "AIR_TEMPERATURE_C_CENTI": 23.5, "AIR_PRESSURE_PA": 101325 },
        { "time": 1757837400, "AIR_TEMPERATURE_C_CENTI": 23.4 }
      ]
    }

A second sensor reporting the same quantity is named QUANTITY#1, #2 and so on.
`sensors` is optional. Decoding produces the same format, so a decoded file
re-encodes to the same bytes.
"""

import argparse
import json
import os
import re
import struct
import sys
import time as _time

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PROTO = os.path.join(HERE, '..', 'meshtastic', 'telemetry.proto')

# Data.payload is capped at this many bytes in both the 2.x and 3.0 schemas.
DATA_PAYLOAD_LEN = 233

# The port the test traffic travels on. Unassigned in both schemas; not for use
# beyond this tool.
TEST_PORTNUM = 99

# Telemetry field numbers, and the SensorReadings field numbers inside it.
TELEMETRY_TIME = 1
TELEMETRY_SENSOR_READINGS = 3
SR_KEYS, SR_VALUES, SR_TIME_DELTAS, SR_PRESENT, SR_SENSORS = 1, 2, 3, 4, 5

CONSTANT_BIT = 0x80
QUANTITY_MASK = 0x7F

SCALES = {'CENTI': 100, 'DECI': 10}


# --- schema -----------------------------------------------------------------

class Schema:
    """Names, numbers and bounds, read from the .proto and .options files."""

    def __init__(self, proto_path):
        with open(proto_path, encoding='utf-8') as fh:
            text = fh.read()
        self.quantities = self._enum(text, r'  enum Quantity \{(.*?)\n  \}')
        self.sensors = self._enum(text, r'^enum TelemetrySensorType \{(.*?)\n\}')
        self.quantity_names = {v: k for k, v in self.quantities.items()}
        self.sensor_names = {v: k for k, v in self.sensors.items()}

        options_path = proto_path[:-len('.proto')] + '.options'
        self.bounds = {}
        with open(options_path, encoding='utf-8') as fh:
            for field, n in re.findall(r'\*SensorReadings\.(\w+)\s+max_count:(\d+)', fh.read()):
                self.bounds[field] = int(n)

    @staticmethod
    def _enum(text, pattern):
        m = re.search(pattern, text, re.S | re.M)
        if not m:
            raise SystemExit('error: enum not found in telemetry.proto (%s)' % pattern)
        return {name: int(num) for name, num in re.findall(r'^\s+([A-Z][A-Z0-9_]*) = (\d+);', m.group(1), re.M)}

    def quantity(self, name):
        if name in self.quantities:
            return self.quantities[name]
        m = re.fullmatch(r'QUANTITY_(\d+)', name)       # an unknown number, round-tripped
        if m:
            return int(m.group(1))
        raise ValueError('unknown quantity %r' % name)

    def quantity_name(self, number):
        return self.quantity_names.get(number, 'QUANTITY_%d' % number)

    def sensor(self, name):
        if name in self.sensors:
            return self.sensors[name]
        m = re.fullmatch(r'SENSOR_(\d+)', name)
        if m:
            return int(m.group(1))
        raise ValueError('unknown sensor type %r' % name)

    def sensor_name(self, number):
        return self.sensor_names.get(number, 'SENSOR_%d' % number)


def scale_of(quantity_name):
    """Fixed-point scale, taken from the unit suffix the quantity name carries."""
    return SCALES.get(quantity_name.rsplit('_', 1)[-1], 1)


# --- protobuf wire ----------------------------------------------------------

def put_varint(out, v):
    if v < 0:
        raise ValueError('varint cannot be negative: %d' % v)
    while v >= 0x80:
        out.append((v & 0x7F) | 0x80)
        v >>= 7
    out.append(v)


def varint_len(v):
    n = 1
    while v >= 0x80:
        v >>= 7
        n += 1
    return n


def zigzag(v):
    return (v << 1) if v >= 0 else ((-v << 1) - 1)


def unzigzag(v):
    return (v >> 1) if not v & 1 else -((v + 1) >> 1)


def put_key(out, field, wire_type):
    put_varint(out, (field << 3) | wire_type)


def put_packed(out, field, values):
    """A packed repeated varint field; omitted entirely when empty, as proto3 does."""
    if not values:
        return 0
    body = bytearray()
    for v in values:
        put_varint(body, v)
    start = len(out)
    put_key(out, field, 2)
    put_varint(out, len(body))
    out += body
    return len(out) - start


def get_varint(buf, pos):
    result = shift = 0
    while True:
        if pos >= len(buf):
            raise ValueError('truncated varint')
        b = buf[pos]
        pos += 1
        result |= (b & 0x7F) << shift
        if not b & 0x80:
            return result, pos
        shift += 7
        if shift > 63:
            raise ValueError('varint too long')


def parse_fields(buf):
    """Walk a message, yielding (field, wire_type, value). Unknown fields are
    returned like any other and left for the caller to ignore."""
    pos = 0
    while pos < len(buf):
        key, pos = get_varint(buf, pos)
        field, wire_type = key >> 3, key & 7
        if wire_type == 0:
            value, pos = get_varint(buf, pos)
        elif wire_type == 1:
            value, pos = buf[pos:pos + 8], pos + 8
        elif wire_type == 2:
            n, pos = get_varint(buf, pos)
            value, pos = buf[pos:pos + n], pos + n
        elif wire_type == 5:
            value, pos = buf[pos:pos + 4], pos + 4
        else:
            raise ValueError('unsupported wire type %d at field %d' % (wire_type, field))
        if pos > len(buf):
            raise ValueError('field %d runs past the end of the message' % field)
        yield field, wire_type, value


def read_repeated(values, wire_type, raw):
    """A repeated varint field arrives packed (wire type 2) or one element per key
    (wire type 0). A conforming parser accepts both."""
    if wire_type == 0:
        values.append(raw)
        return
    pos = 0
    while pos < len(raw):
        v, pos = get_varint(raw, pos)
        values.append(v)


# --- encode -----------------------------------------------------------------

def parse_key(name):
    """'AIR_TEMPERATURE_C_CENTI#1' -> ('AIR_TEMPERATURE_C_CENTI', 1)."""
    base, _, ordinal = name.partition('#')
    return base, int(ordinal) if ordinal else 0


def encode(doc, schema, report=None):
    samples = sorted(doc.get('samples', []), key=lambda s: s['time'])
    if not samples:
        raise ValueError('no samples')

    # Columns in order of first appearance, each holding the samples that carry it.
    columns = {}
    for index, sample in enumerate(samples):
        for name, value in sample.items():
            if name == 'time':
                continue
            base, ordinal = parse_key(name)
            quantity = schema.quantity(base)
            if not 1 <= quantity <= QUANTITY_MASK:
                raise ValueError('%s: quantity %d does not fit seven bits' % (name, quantity))
            if not 0 <= ordinal <= 255:
                raise ValueError('%s: ordinal must be 0..255' % name)
            scaled = round(value * scale_of(base))
            if not -2 ** 31 <= scaled < 2 ** 31:
                raise ValueError('%s: %r does not fit sint32 once scaled' % (name, value))
            columns.setdefault(name, {'quantity': quantity, 'ordinal': ordinal,
                                      'samples': [], 'values': []})
            columns[name]['samples'].append(index)
            columns[name]['values'].append(scaled)

    keys, values, constants = [], [], []
    for name, col in columns.items():
        key = (col['ordinal'] << 8) | col['quantity']
        column = col['values']
        # Collapse a column that never moves, when that is a saving: the flag costs
        # a byte only if it pushes the key across a varint boundary, and saves one
        # zero delta per sample after the first.
        flat = len(column) >= 2 and len(set(column)) == 1
        if flat and len(column) - 1 > varint_len(key | CONSTANT_BIT) - varint_len(key):
            key |= CONSTANT_BIT
            values.append(zigzag(column[0]))
            constants.append(name)
        else:
            previous = 0
            for v in column:
                values.append(zigzag(v - previous))
                previous = v
        keys.append(key)

    times = [s['time'] for s in samples]
    intervals = [b - a for a, b in zip(times, times[1:])]
    time_deltas = [zigzag(b - a) for a, b in zip([0] + intervals, intervals)]

    dense = all(len(col['samples']) == len(samples) for col in columns.values())
    present = []
    if not dense:
        names = list(columns)
        for index in range(len(samples)):
            present.append(sum(1 << k for k, n in enumerate(names) if index in columns[n]['samples']))

    sensor_map = doc.get('sensors', {})
    sensors = [schema.sensor(sensor_map[n]) if n in sensor_map else 0 for n in columns] \
        if sensor_map else []
    unused = set(sensor_map) - set(columns)
    if unused:
        raise ValueError('sensors names keys no sample carries: %s' % ', '.join(sorted(unused)))

    readings = bytearray()
    sizes = {
        'keys': put_packed(readings, SR_KEYS, keys),
        'values': put_packed(readings, SR_VALUES, values),
        'time_deltas': put_packed(readings, SR_TIME_DELTAS, time_deltas),
        'present': put_packed(readings, SR_PRESENT, present),
        'sensors': put_packed(readings, SR_SENSORS, sensors),
    }

    out = bytearray()
    if times[0]:
        put_key(out, TELEMETRY_TIME, 5)
        out += struct.pack('<I', times[0])
    put_key(out, TELEMETRY_SENSOR_READINGS, 2)
    put_varint(out, len(readings))
    out += readings

    counts = {'keys': len(keys), 'values': len(values), 'time_deltas': len(time_deltas),
              'present': len(present), 'sensors': len(sensors)}
    over = ['%s has %d entries, the firmware bound is %d' % (f, counts[f], schema.bounds[f])
            for f in counts if f in schema.bounds and counts[f] > schema.bounds[f]]

    if report is not None:
        report.update(samples=len(samples), columns=len(columns), constants=constants,
                      ragged=not dense, counts=counts, sizes=sizes, total=len(out),
                      over=over)
    return bytes(out)


# --- decode -----------------------------------------------------------------

def decode(payload, schema, report=None):
    telemetry_time = 0
    readings = None
    for field, wire_type, value in parse_fields(payload):
        if field == TELEMETRY_TIME and wire_type == 5:
            telemetry_time = struct.unpack('<I', value)[0]
        elif field == TELEMETRY_SENSOR_READINGS and wire_type == 2:
            readings = bytes(value)
    if readings is None:
        raise ValueError('not a SensorReadings payload: Telemetry carries no sensor_readings')

    fields = {SR_KEYS: [], SR_VALUES: [], SR_TIME_DELTAS: [], SR_PRESENT: [], SR_SENSORS: []}
    for field, wire_type, value in parse_fields(readings):
        if field in fields and wire_type in (0, 2):
            read_repeated(fields[field], wire_type, value)
    keys, values = fields[SR_KEYS], [unzigzag(v) for v in fields[SR_VALUES]]
    time_deltas = [unzigzag(v) for v in fields[SR_TIME_DELTAS]]
    present, sensors = fields[SR_PRESENT], fields[SR_SENSORS]

    # The sample count comes from time_deltas, never from dividing values by keys.
    n = len(time_deltas) + 1
    times, t, interval = [telemetry_time], telemetry_time, 0
    for d in time_deltas:
        interval += d
        t += interval
        times.append(t)

    if present and len(present) != n:
        raise ValueError('present has %d bitmaps for %d samples' % (len(present), n))
    if sensors and len(sensors) != len(keys):
        raise ValueError('sensors has %d entries for %d keys' % (len(sensors), len(keys)))

    samples = [{'time': times[i]} for i in range(n)]
    sensor_map, unknown, pos = {}, [], 0
    for k, key in enumerate(keys):
        quantity, ordinal = key & QUANTITY_MASK, key >> 8
        constant = bool(key & CONSTANT_BIT)
        base = schema.quantity_name(quantity)
        if base not in schema.quantities:
            unknown.append(base)
        name = base if ordinal == 0 else '%s#%d' % (base, ordinal)

        carriers = [i for i in range(n) if not present or present[i] >> k & 1]
        if not carriers:
            raise ValueError('%s is carried by no sample' % name)
        length = 1 if constant else len(carriers)
        if pos + length > len(values):
            raise ValueError('values ran out in column %s' % name)
        column = values[pos:pos + length]
        pos += length

        if constant:
            column = column * len(carriers)
        else:
            running = 0
            for i, d in enumerate(column):
                running += d
                column[i] = running

        scale = scale_of(base)
        for i, raw in zip(carriers, column):
            samples[i][name] = raw if scale == 1 else round(raw / scale, len(str(scale)) - 1)
        if sensors and sensors[k]:
            sensor_map[name] = schema.sensor_name(sensors[k])

    if pos != len(values):
        raise ValueError('%d values left over: the columns do not account for the sample count'
                         % (len(values) - pos))

    if report is not None:
        report.update(samples=n, columns=len(keys), unknown=unknown, total=len(payload))
    doc = {}
    if sensor_map:
        doc['sensors'] = sensor_map
    doc['samples'] = samples
    return doc


# --- reporting --------------------------------------------------------------

def print_encode_report(r, out=sys.stderr):
    print('%d samples x %d columns, %d bytes (Data.payload cap %d%s)'
          % (r['samples'], r['columns'], r['total'], DATA_PAYLOAD_LEN,
             ', OVER' if r['total'] > DATA_PAYLOAD_LEN else ''), file=out)
    for field in ('keys', 'values', 'time_deltas', 'present', 'sensors'):
        if r['counts'][field]:
            print('  %-11s %3d entries %4d bytes' % (field, r['counts'][field], r['sizes'][field]),
                  file=out)
    if r['constants']:
        print('  constant    %s' % ', '.join(r['constants']), file=out)
    if r['ragged']:
        print('  ragged      a present bitmap is carried', file=out)
    for line in r['over']:
        print('  OVER BOUND  %s - a device will refuse to decode it' % line, file=out)


def load_payload(arg):
    if os.path.exists(arg):
        with open(arg, 'rb') as fh:
            return fh.read()
    try:
        return bytes.fromhex(arg.replace(' ', ''))
    except ValueError:
        raise SystemExit('error: %s is neither a file nor hex' % arg)


# --- mesh transport ---------------------------------------------------------

def open_interface(args):
    try:
        import meshtastic.serial_interface
        import meshtastic.tcp_interface
    except ImportError:
        raise SystemExit('error: send and listen need the meshtastic package (pip install meshtastic)')
    if args.host:
        return meshtastic.tcp_interface.TCPInterface(hostname=args.host)
    return meshtastic.serial_interface.SerialInterface(devPath=args.port)


def make_receiver(schema, received, out_dir=None):
    """A pubsub listener that decodes port-99 packets and ignores everything else.
    The caller must keep a reference to it: pubsub holds listeners weakly."""

    def on_receive(packet, interface):
        decoded = packet.get('decoded', {})
        if str(decoded.get('portnum')) != str(TEST_PORTNUM):
            return
        payload = decoded.get('payload', b'')
        header = 'from %s to %s id 0x%08x rx_snr %s rx_rssi %s hops %s' % (
            packet.get('fromId') or packet.get('from'), packet.get('toId') or packet.get('to'),
            packet.get('id', 0), packet.get('rxSnr'), packet.get('rxRssi'),
            packet.get('hopStart', 0) - packet.get('hopLimit', 0) if 'hopStart' in packet else '?')
        print('--- %s, %d bytes' % (header, len(payload)), file=sys.stderr)
        try:
            doc = decode(payload, schema)
        except ValueError as exc:
            print('    undecodable: %s  (%s)' % (exc, payload.hex()), file=sys.stderr)
            return
        print(json.dumps(doc, indent=2))
        sys.stdout.flush()
        received.append(doc)
        if out_dir:
            path = os.path.join(out_dir, '%08x.json' % packet.get('id', 0))
            with open(path, 'w', encoding='utf-8') as fh:
                json.dump(doc, fh, indent=2)

    return on_receive


def cmd_send(args, schema):
    with open(args.json, encoding='utf-8') as fh:
        doc = json.load(fh)
    report = {}
    payload = encode(doc, schema, report)
    print_encode_report(report)
    if report['over'] or len(payload) > DATA_PAYLOAD_LEN:
        raise SystemExit('error: payload would be refused; not sending')

    # A serial port admits one process, so the sender watches for arrivals itself
    # while it lingers - which is also what a send to self needs to see its echo.
    received = []
    receiver = make_receiver(schema, received)
    iface = open_interface(args)
    from pubsub import pub
    pub.subscribe(receiver, 'meshtastic.receive')
    try:
        dest = args.dest
        if dest == 'self':
            dest = iface.myInfo.my_node_num
        packet = iface.sendData(payload, destinationId=dest, portNum=TEST_PORTNUM,
                                wantAck=args.ack, channelIndex=args.channel)
        print('sent id 0x%08x on port %d to %s, %d bytes'
              % (packet.id, TEST_PORTNUM, dest, len(payload)), file=sys.stderr)
        _time.sleep(args.linger)
    finally:
        iface.close()
    print('%d port-%d payload(s) received while waiting' % (len(received), TEST_PORTNUM),
          file=sys.stderr)
    return 0


def cmd_listen(args, schema):
    received = []
    receiver = make_receiver(schema, received, args.out)
    iface = open_interface(args)
    from pubsub import pub
    pub.subscribe(receiver, 'meshtastic.receive')
    print('listening on port %d%s' % (TEST_PORTNUM,
          ' for %d s' % args.timeout if args.timeout else ''), file=sys.stderr)
    try:
        deadline = _time.time() + args.timeout if args.timeout else None
        while (not args.count or len(received) < args.count) and \
                (deadline is None or _time.time() < deadline):
            _time.sleep(0.2)
    except KeyboardInterrupt:
        pass
    finally:
        iface.close()
    print('%d payload(s) received' % len(received), file=sys.stderr)
    return 0 if received or not args.count else 1


# --- self-check -------------------------------------------------------------

def check(schema):
    """Round trips that fail if any encoding rule breaks."""
    failures = []

    def expect(cond, what):
        if not cond:
            failures.append(what)

    def roundtrip(doc, label):
        report = {}
        payload = encode(doc, schema, report)
        back = decode(payload, schema)
        again = encode(back, schema)
        expect(again == payload, '%s: decode then encode changed the bytes' % label)
        return payload, report, back

    t0 = 1757836800
    temp, press = 'AIR_TEMPERATURE_C_CENTI', 'AIR_PRESSURE_PA'

    # One sample reads as plain values: no deltas, no times, no bitmap.
    doc = {'samples': [{'time': t0, temp: 15.82, press: 98801}]}
    payload, r, back = roundtrip(doc, 'single sample')
    expect(back == doc, 'single sample: values changed')
    expect(r['counts']['time_deltas'] == 0 and r['counts']['present'] == 0,
           'single sample: carried times or a bitmap')

    # The worked example from the schema reference, byte for byte in the columns.
    doc = {'samples': [{'time': t0 + i * 3600, temp: t, press: p}
                       for i, (t, p) in enumerate([(15.82, 98801), (15.48, 98814), (15.14, 98857)])]}
    payload, r, back = roundtrip(doc, 'worked example')
    expect(back == doc, 'worked example: values changed')
    readings = dict((f, v) for f, _, v in parse_fields(dict(
        (f, v) for f, _, v in parse_fields(payload))[TELEMETRY_SENSOR_READINGS]))
    got = []
    read_repeated(got, 2, readings[SR_VALUES])
    expect([unzigzag(v) for v in got] == [1582, -34, -34, 98801, 13, 43],
           'worked example: values column is not [1582, -34, -34, 98801, 13, 43]')
    got = []
    read_repeated(got, 2, readings[SR_TIME_DELTAS])
    expect([unzigzag(v) for v in got] == [3600, 0], 'hourly cadence: time_deltas is not [3600, 0]')

    # Late sample: the change in interval is what is carried.
    doc = {'samples': [{'time': t, temp: 20.0 + i} for i, t in enumerate([t0, t0 + 3600, t0 + 7240])]}
    roundtrip(doc, 'jittered cadence')

    # Constant column: collapses from three samples, not at two.
    flat = lambda n: {'samples': [{'time': t0 + 60 * i, 'RAINFALL_1H_MM': 0, temp: 20 + i} for i in range(n)]}
    _, r, _ = roundtrip(flat(3), 'constant x3')
    expect('RAINFALL_1H_MM' in r['constants'], 'constant x3: column was not collapsed')
    _, r, _ = roundtrip(flat(2), 'constant x2')
    expect(not r['constants'], 'constant x2: collapsed where it saves nothing')

    # A second sensor already has a two-byte key, so collapsing pays at two samples.
    doc = {'samples': [{'time': t0 + 60 * i, temp + '#1': 21.5, temp: 20 + i} for i in range(2)]}
    _, r, back = roundtrip(doc, 'ordinal constant x2')
    expect(temp + '#1' in r['constants'], 'ordinal constant x2: not collapsed')
    expect(back == doc, 'ordinal: values changed')

    # Ragged: a sensor drops out, and deltas step over the gap.
    doc = {'samples': [{'time': t0, temp: 20.0, 'PM2_5_STD_UGM3_DECI': 5.5},
                       {'time': t0 + 60, temp: 20.5},
                       {'time': t0 + 120, temp: 21.0, 'PM2_5_STD_UGM3_DECI': 7.0}]}
    _, r, back = roundtrip(doc, 'ragged')
    expect(r['ragged'], 'ragged: no present bitmap')
    expect(back == doc, 'ragged: values changed')

    # Negative values, sensors, an unknown quantity number all survive.
    doc = {'sensors': {'QUANTITY_120': 'BME280'},
           'samples': [{'time': t0, 'QUANTITY_120': -40, 'CURRENT_MA': -1250}]}
    _, _, back = roundtrip(doc, 'unknown quantity')
    expect(back == doc, 'unknown quantity: not preserved')

    # Structural damage is refused rather than misread.
    good = encode({'samples': [{'time': t0 + i, temp: 20 + i} for i in range(3)]}, schema)
    for label, bad in (('truncated', good[:-1]),
                       ('no sensor_readings', good[:5])):
        try:
            decode(bad, schema)
            failures.append('%s: decoded without error' % label)
        except ValueError:
            pass

    for f in failures:
        print('FAIL: ' + f, file=sys.stderr)
    if not failures:
        print('ok: round trips, worked example, constants, ordinals, ragged, unknowns')
    return not failures


# --- main -------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--proto', default=DEFAULT_PROTO, help='path to telemetry.proto')
    ap.add_argument('--check', action='store_true', help='run the self-test and exit')
    sub = ap.add_subparsers(dest='cmd')

    p = sub.add_parser('encode', help='JSON readings to binary payload')
    p.add_argument('json')
    p.add_argument('out', nargs='?', help='output file (default: hex on stdout)')

    p = sub.add_parser('decode', help='binary payload to JSON readings')
    p.add_argument('payload', help='payload file, or the payload as hex')
    p.add_argument('out', nargs='?', help='output file (default: stdout)')

    for name in ('send', 'listen'):
        p = sub.add_parser(name, help='%s over a device on port %d' % (name, TEST_PORTNUM))
        if name == 'send':
            p.add_argument('json')
            p.add_argument('--dest', default='^all', help="node id, '^all', or 'self'")
            p.add_argument('--channel', type=int, default=0)
            p.add_argument('--ack', action='store_true')
            p.add_argument('--linger', type=float, default=2.0, help='seconds to wait before closing')
        else:
            p.add_argument('--timeout', type=float, default=0, help='seconds; 0 waits until ^C')
            p.add_argument('--count', type=int, default=0, help='stop after this many payloads')
            p.add_argument('--out', help='directory to write each payload as JSON')
        g = p.add_mutually_exclusive_group()
        g.add_argument('--port', help='serial port (default: autodetect)')
        g.add_argument('--host', help='TCP host')

    args = ap.parse_args()
    schema = Schema(args.proto)

    if args.check:
        return 0 if check(schema) else 1

    try:
        if args.cmd == 'encode':
            with open(args.json, encoding='utf-8') as fh:
                doc = json.load(fh)
            report = {}
            payload = encode(doc, schema, report)
            print_encode_report(report)
            if args.out:
                with open(args.out, 'wb') as fh:
                    fh.write(payload)
            else:
                print(payload.hex())
            return 1 if report['over'] else 0

        if args.cmd == 'decode':
            report = {}
            doc = decode(load_payload(args.payload), schema, report)
            text = json.dumps(doc, indent=2)
            if args.out:
                with open(args.out, 'w', encoding='utf-8') as fh:
                    fh.write(text + '\n')
            else:
                print(text)
            print('%d bytes, %d samples x %d columns' % (report['total'], report['samples'],
                  report['columns']), file=sys.stderr)
            if report['unknown']:
                print('unknown quantities kept by number: %s' % ', '.join(report['unknown']),
                      file=sys.stderr)
            return 0

        if args.cmd == 'send':
            return cmd_send(args, schema) or 0
        if args.cmd == 'listen':
            return cmd_listen(args, schema)
    except (ValueError, KeyError) as exc:
        raise SystemExit('error: %s' % exc)

    ap.print_help()
    return 2


if __name__ == '__main__':
    sys.exit(main())
