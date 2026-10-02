// ============================================================
// AVISO IoT — motion classifier (normal / hard braking / bump / crash)
// ------------------------------------------------------------
// CRASH = a HIT, then the bike FALLS (tilt > FALL_TILT_DEG) within
// IMPACT_TO_FALL_MS, then stays fallen and STILL for FALL_CONFIRM_MS.
// A fall with no detected hit (slow slide/tip-over) needs
// TIPOVER_CONFIRM_MS and only counts while a ride is active.
// If the bike comes back upright before confirmation, nothing fires.
//
// NORMAL = every NORMAL_SUMMARY_MS with no other event, a summary of
// the highest values seen in that window (the baseline for tuning).
// ============================================================
#pragma once
#include "imu.h"
#include "shared.h"

class Detector {
 public:
  // Feed one 100 Hz sample. Returns true and fills `event` when an event fires.
  bool update(const ImuSample& s, unsigned long nowMs, DetectorEvent& event);

  MotionState state() const;

 private:
  enum CrashPhase : uint8_t { IDLE, IMPACT_SEEN, FALLEN, CONFIRMED };

  // Highest values over a span of samples.
  struct Peaks {
    float g = 0, vertical = 0, horizontal = 0, gyro = 0, tilt = 0;
    void reset() { *this = Peaks(); }
    void add(const ImuSample& s);
  };

  CrashPhase phase = IDLE;
  bool fallHadImpact = false;
  unsigned long impactAt = 0;
  unsigned long stillSince = 0;
  unsigned long uprightSince = 0;
  Peaks crashPeaks;

  Peaks window;                  // since the last event or normal summary
  unsigned long windowStart = 0;

  unsigned long lastBumpAt = 0;
  unsigned long brakeSince = 0;
  Peaks brakePeaks;
  unsigned long lastBrakeAt = 0;

  MotionState shownState = STATE_NORMAL;
  unsigned long shownUntil = 0;

  void fill(DetectorEvent& e, EventType type, const Peaks& p, unsigned long nowMs);
  void show(MotionState st, unsigned long nowMs);
  bool emit(DetectorEvent& e, EventType type, const Peaks& p, unsigned long nowMs);
};
