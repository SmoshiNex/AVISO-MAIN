// ============================================================
// AVISO IoT — crash black box
// ------------------------------------------------------------
// Keeps the last 5 s of 100 Hz readings in RAM. On a crash it also
// records the next 5 s, then the network task writes both to
// LittleFS as one CSV (max BLACKBOX_MAX_FILES, oldest deleted).
// Nothing is written during normal riding, so flash never fills up.
// ============================================================
#pragma once
#include <Arduino.h>
#include "imu.h"

namespace BlackBox {
  void begin();                                       // mounts LittleFS
  void record(const ImuSample& s, unsigned long nowMs); // sensor task, every sample
  void startCapture(const char* eventUid);            // sensor task, on crash
  bool pendingWrite();                                // capture complete, not yet saved
  void writePending();                                // network task
  String listJson();                                  // [{"name":..,"size":..}]
}
