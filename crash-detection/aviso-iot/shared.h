// ============================================================
// AVISO IoT — data shared between the sensor task (core 1) and
// the network task (core 0)
// ============================================================
#pragma once
#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/queue.h>

enum MotionState : uint8_t {
  STATE_NORMAL,
  STATE_BUMP,
  STATE_HARD_BRAKING,
  STATE_IMPACT,
  STATE_FALLEN,
  STATE_CRASH,
};

enum EventType : uint8_t {
  EVENT_NORMAL,          // 10 s summary of normal riding (the baseline for thresholds)
  EVENT_BUMP,
  EVENT_HARD_BRAKING,
  EVENT_CRASH,
  EVENT_CRASH_CLEARED,   // bike stood back up after a confirmed crash
};

struct DetectorEvent {
  EventType type;
  char uid[40];          // unique id: <device>-<boot>-<millis>
  float peakG;           // linear acceleration peak, g
  float peakVerticalG;   // up/down part peak, g
  float peakHorizontalG; // forward/back/sideways part peak, g
  float peakGyroDps;
  float tiltDeg;
  uint32_t atMillis;
};

// Latest readings, copied out by the network task for live telemetry.
struct Telemetry {
  float linearG;         // total linear acceleration, g (0 at rest)
  float verticalG;       // up/down part (bumps)
  float horizontalG;     // forward/back/sideways part (braking)
  float gyroDps;         // total rotation speed
  float yawRateDps;      // rotation around vertical (turning); sign set by mounting
  float tiltDeg;         // lean from the saved upright
  MotionState state;
};

const char* motionStateName(MotionState s);
const char* eventTypeName(EventType t);

// ---- Cross-task plumbing (defined in aviso-iot.ino) ----
extern QueueHandle_t eventQueue;          // sensor -> network
extern portMUX_TYPE telemetryMux;
extern Telemetry latestTelemetry;

// Requests from the network task, handled by the sensor task.
extern volatile bool requestCalibrateUpright;
extern volatile bool requestBeep;
extern volatile bool requestAlarmStop;
extern volatile bool rideActive;          // set by the app; enables the no-hit tip-over rule

// BNO055 self-calibration levels (0..3), refreshed once a second by the
// sensor task. Only that task talks to the sensor over I2C.
extern volatile uint8_t calSys, calGyro, calAccel;

extern String deviceUid;
extern uint32_t bootCount;
extern String resetReasonLabel;
