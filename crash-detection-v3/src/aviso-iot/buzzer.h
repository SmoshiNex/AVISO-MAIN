// ============================================================
// AVISO IoT — non-blocking passive buzzer + LED
// ------------------------------------------------------------
// Patterns play step by step from update(), called every 10 ms by
// the sensor task, so a sound never pauses crash detection.
// Only the sensor task touches the pins; other tasks just request
// a pattern. 2000 Hz is this buzzer's loudest tone (testing-buzzer).
// ============================================================
#pragma once
#include <Arduino.h>

enum BuzzerPattern : uint8_t {
  PATTERN_NONE,
  PATTERN_READY,      // two rising chirps at boot
  PATTERN_OK,         // short confirmation (paired, calibrated, test)
  PATTERN_ERROR,      // low double tone (pairing failed, sensor warning)
  PATTERN_ALARM,      // crash: loops 2000/1700 Hz until stopped
};

namespace Buzzer {
  void begin();
  void play(BuzzerPattern pattern);   // replaces whatever is playing
  void stop();
  bool alarmActive();
  void update(unsigned long nowMs);   // sensor task only
}
