// ============================================================
// AVISO IoT — networking (runs in the network task, core 0)
// ------------------------------------------------------------
// MAIN LINK: the unit joins the rider's PHONE HOTSPOT (up to
// MAX_SAVED_NETWORKS saved). The rider app connects to it over a
// WebSocket on port WS_PORT for live data, events and commands.
// The hotspot also gives the unit internet, which it uses for
// heartbeats (so the app can find its IP) and the BACKUP SOS.
//
// SETUP: with no saved hotspot (or none found for SETUP_AP_AFTER_MS)
// the unit opens its own network "AVISO-SETUP-xxxx" with a setup
// page at http://192.168.4.1 — hotspot name/password, server URL and
// the 6-digit pairing code from the app.
// ============================================================
#pragma once
#include <Arduino.h>

namespace Net {
  void begin();
  void loop(unsigned long nowMs);   // call continuously from the network task
}
