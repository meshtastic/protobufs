# TreeGuard Protobuf Documentation

## Overview

The TreeGuard protobuf message (`TreeGuardMetrics`) is designed for tree health monitoring systems that use vibration analysis and environmental sensors to detect tree stress and potential hazards.

## Message Structure

```protobuf
message TreeGuardMetrics {
  uint64 timestamp_ms = 1;
  uint32 strike_count = 2;
  float offset_x_y = 3;
  float offset_y_z = 4;
  float max_y = 5;
  float max_z = 6;
  float fft_low_ratio = 7;
  float fft_high_ratio = 8;
  float hf_energy_ratio = 9;
  float battery_soc_percent = 10;
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `timestamp_ms` | uint64 | Time since boot in milliseconds |
| `strike_count` | uint32 | Number of time-domain peaks detected (vibration events) |
| `offset_x_y` | float | Average X-Y axis offset from vibration analysis |
| `offset_y_z` | float | Average Y-Z axis offset from vibration analysis |
| `max_y` | float | Maximum absolute Y magnitude from accelerometer |
| `max_z` | float | Maximum absolute Z magnitude from accelerometer |
| `fft_low_ratio` | float | Low-frequency ratio (0-25 Hz range) from FFT analysis |
| `fft_high_ratio` | float | Mid-high frequency ratio (125-200 Hz range) from FFT analysis |
| `hf_energy_ratio` | float | High-frequency energy ratio - overall high-frequency energy content |
| `battery_soc_percent` | float | Battery state of charge percentage (0-100%) |

## Usage Example

### C/C++ (Firmware)

```cpp
#include "meshtastic/treeguard.pb.h"

// Create and populate a TreeGuard metrics message
meshtastic_TreeGuardMetrics metrics = meshtastic_TreeGuardMetrics_init_zero;

metrics.timestamp_ms = millis();
metrics.strike_count = 42;
metrics.offset_x_y = 0.15f;
metrics.offset_y_z = 0.23f;
metrics.max_y = 1.2f;
metrics.max_z = 0.8f;
metrics.fft_low_ratio = 0.35f;
metrics.fft_high_ratio = 0.12f;
metrics.hf_energy_ratio = 0.08f;
metrics.battery_soc_percent = 87.5f;

// Encode and send via Meshtastic...
```

## Integration with Meshtastic

To integrate TreeGuard metrics into the Meshtastic telemetry system:

1. Add `TreeGuardMetrics` to the `Telemetry` message variant in `telemetry.proto`
2. Register a new port number in `portnums.proto` for TreeGuard data
3. Implement the sensor reading logic in the firmware
4. Add configuration options in `module_config.proto` if needed

## Sensor Requirements

The TreeGuard system typically requires:
- **Accelerometer**: 3-axis accelerometer for vibration detection (e.g., ADXL345, MPU6050)
- **Battery Monitor**: For SOC reporting (e.g., MAX17048, LC709203F)
- **Microcontroller**: Capable of FFT processing for frequency analysis

## Data Interpretation

- **strike_count**: Higher values indicate more vibration events (wind, impacts, etc.)
- **offset_x_y / offset_y_z**: Indicates directional bias in vibrations
- **max_y / max_z**: Peak acceleration magnitudes
- **fft_low_ratio**: Low-frequency vibrations (wind sway, slow movements)
- **fft_high_ratio**: High-frequency vibrations (impacts, cracking sounds)
- **hf_energy_ratio**: Overall high-frequency energy (potential stress indicators)
