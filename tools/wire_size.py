#!/usr/bin/env python3
"""Encoded size of the messages 3.0 changed, against their 2.x shapes.

Prints the table in this directory's README. Every number is computed from the
protobuf wire rules below rather than measured on a device, so it is exact for
the scenario given and says nothing about how often that scenario occurs.

    python tools/wire_size.py            # the table
    python tools/wire_size.py --check    # self-check, exits non-zero on failure
"""

import argparse
import sys

# --- wire model ------------------------------------------------------------
# Protobuf encodes a field as a key (tag << 3 | wire type) followed by the
# value. Everything here follows from that plus varint and zigzag.


def varint(v):
    """Bytes a non-negative varint occupies."""
    assert v >= 0
    n = 1
    while v >= 0x80:
        v >>= 7
        n += 1
    return n


def zigzag(v):
    """Bytes a sint32/sint64 occupies. Magnitude drives width, not sign."""
    return varint((v << 1) if v >= 0 else ((-v << 1) - 1))


def int32(v):
    """Bytes a plain int32 occupies. A negative value sign-extends to 64 bits
    and costs ten, whatever its magnitude. This is the 2.x mistake."""
    return 10 if v < 0 else varint(v)


def key(tag):
    return varint(tag << 3)


def f32(_v=0):
    return 4


def flt(_v=0.0):
    """A float is a fixed32 wire type: always four bytes, never fewer."""
    return 4


def field(tag, size):
    """One tagged field."""
    return key(tag) + size


def packed(tag, sizes):
    """A packed repeated scalar: one key and one length for the whole field."""
    body = sum(sizes)
    return key(tag) + varint(body) + body


def unpacked(tag, sizes):
    """A repeated scalar nanopb emits as a callback: a key per element."""
    return sum(key(tag) + s for s in sizes)


def submsg(tag, body):
    """A length-delimited submessage: a key and a length on every element."""
    return key(tag) + varint(body) + body


# --- scenarios -------------------------------------------------------------
# Each returns (2.x bytes, 3.0 bytes, note). Field numbers follow the schema
# each side actually had, since a tag above 15 costs two bytes for its key.

SNR8 = [-4, -12, -7, -18, -2, -9, -15, -6]  # quarter-dB, eight hops, all negative
NODES8 = 8


def route_discovery():
    # A completed traceroute carries both directions: route and snr_towards on
    # the way out, route_back and snr_back on the way home.
    old = 2 * (packed(1, [4] * NODES8) + unpacked(2, [int32(s) for s in SNR8]))
    new = 2 * (packed(1, [4] * NODES8) + packed(2, [zigzag(s) for s in SNR8]))
    return old, new, "8 hops each way, negative SNR throughout"


def position_basic():
    # lat/lon/alt/time only.
    old = field(1, f32()) + field(2, f32()) + field(3, int32(120)) + field(4, f32())
    # 3.0: scaled coordinates in the packed arm of the oneof, sint32 altitude.
    new = field(1, zigzag(0x0D5F1E >> 3)) + field(3, zigzag(0x0A21C4 >> 3))
    new += field(6, f32()) + field(7, zigzag(120))
    return old, new, "lat, lon, altitude, time"


def position_negative_alt():
    old = field(1, f32()) + field(2, f32()) + field(3, int32(-120)) + field(4, f32())
    new = field(1, zigzag(0x0D5F1E >> 3)) + field(3, zigzag(0x0A21C4 >> 3))
    new += field(6, f32()) + field(7, zigzag(-120))
    return old, new, "the same, 120 m below sea level"


def device_metrics():
    # 2.x carried voltage, channel_utilization and air_util_tx as floats.
    old = field(1, varint(87)) + field(2, flt()) + field(3, flt()) + field(4, flt())
    old += field(5, varint(864000))
    # 3.0 scales them to integers: millivolts and centi-percent.
    new = field(1, varint(87)) + field(2, varint(4021)) + field(3, varint(1250))
    new += field(4, varint(310)) + field(5, varint(864000))
    return old, new, "battery, voltage, two utilisations, uptime"


ENV = [("temperature", 1582), ("humidity", 6550), ("pressure", 98801)]


def environment_one():
    # 2.x EnvironmentMetrics: one float field per quantity, tags 1..3.
    old = sum(field(t, flt()) for t in (1, 2, 3))
    # 3.0 SensorReadings: a one-byte key per quantity, one absolute value each.
    new = packed(1, [1] * len(ENV)) + packed(2, [zigzag(v) for _, v in ENV])
    return old, new, "temperature, humidity, pressure, one sample"


def environment_batch(n=16):
    old = n * sum(field(t, flt()) for t in (1, 2, 3))
    cols = [
        [1582] + [-34] * (n - 1),
        [6550] + [21] * (n - 1),
        [98801] + [13] * (n - 1),
    ]
    vals = [zigzag(v) for col in cols for v in col]
    new = packed(1, [1] * len(cols)) + packed(2, vals)
    new += packed(3, [zigzag(3600)] + [zigzag(0)] * (n - 2))
    return old, new, "the same three quantities, %d samples in one packet" % n


NEIGHBOURS = [
    (0x9E2A4C71, -12), (0x1B77D033, -4), (0xC4019AEF, -20), (0x55A3F218, -7),
    (0xE80B6D95, -15), (0x2F94A1C0, -3), (0xA71E5B4D, -18), (0x63CD07A2, -9),
    (0xD52840F6, -6), (0x0EB9C384, -11),
]


def neighbor_info():
    # 2.x: uint32 self ids, then one Neighbor submessage per edge.
    old = field(1, varint(NEIGHBOURS[0][0])) + field(2, varint(NEIGHBOURS[0][0]))
    old += field(3, varint(900))
    for nid, snr in NEIGHBOURS:
        old += submsg(4, field(1, varint(nid)) + field(2, zigzag(snr)))
    # 3.0: fixed32 self ids, then two parallel columns.
    new = field(1, f32()) + field(2, f32()) + field(3, varint(900))
    new += packed(4, [4] * len(NEIGHBOURS))
    new += packed(5, [zigzag(snr) for _, snr in NEIGHBOURS])
    return old, new, "%d edges" % len(NEIGHBOURS)


VERTICES = 32


def drawn_shape():
    # The columns were already in the schema, but without a nanopb max_count
    # they were callback fields, so every element carried its own key.
    deltas = [(-1) ** i * (120 + 37 * i) for i in range(VERTICES)]
    sizes = [zigzag(d) for d in deltas]
    old = unpacked(12, sizes) + unpacked(13, sizes)
    new = packed(12, sizes) + packed(13, sizes)
    return old, new, "%d vertices, packed vs a nanopb callback" % VERTICES


SCENARIOS = [
    ("RouteDiscovery", route_discovery),
    ("Position, basic", position_basic),
    ("Position, negative altitude", position_negative_alt),
    ("DeviceMetrics", device_metrics),
    ("Environment, live", environment_one),
    ("Environment, batched", environment_batch),
    ("NeighborInfo", neighbor_info),
    ("DrawnShape", drawn_shape),
]


def rows():
    for name, fn in SCENARIOS:
        old, new, note = fn()
        yield name, old, new, note


def table():
    out = ["| message | scenario | 2.x | 3.0 | saved |",
           "|---|---|--:|--:|--:|"]
    for name, old, new, note in rows():
        pct = round(100 * (old - new) / old)
        out.append("| `%s` | %s | %d | **%d** | %d%% |" % (name, note, old, new, pct))
    return "\n".join(out)


def check():
    """Every scenario must shrink, and the model must agree with the wire rules
    on the cases that motivated each change."""
    failures = []

    for name, old, new, _ in rows():
        if new >= old:
            failures.append("%s did not shrink: %d -> %d" % (name, old, new))

    # A negative int32 costs ten bytes; the sint32 of the same value costs one.
    if int32(-4) != 10 or zigzag(-4) != 1:
        failures.append("zigzag model wrong: int32(-4)=%d zigzag(-4)=%d"
                        % (int32(-4), zigzag(-4)))

    # Packing saves exactly one key per element beyond the first, less the
    # length prefix.
    sizes = [1] * 10
    if unpacked(4, sizes) - packed(4, sizes) != 8:
        failures.append("packing model wrong")

    # A tag above 15 needs two bytes for its key. This is why field numbering
    # was rebuilt from 1.
    if key(15) != 1 or key(16) != 2:
        failures.append("key width wrong")

    for f in failures:
        print("FAIL: " + f, file=sys.stderr)
    return not failures


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="self-check only")
    args = ap.parse_args()
    if args.check:
        ok = check()
        print("ok: %d scenarios" % len(SCENARIOS) if ok else "failed")
        return 0 if ok else 1
    print(table())
    return 0


if __name__ == "__main__":
    sys.exit(main())
