// ============================================================
// AVISO IoT — BNO055 sensor (IMU fusion mode, no magnetometer)
// ============================================================
#pragma once
#include <Arduino.h>

struct ImuSample {
  float linX, linY, linZ;    // linear acceleration, m/s^2 (gravity removed)
  float gravX, gravY, gravZ; // gravity vector, m/s^2
  float gyrX, gyrY, gyrZ;    // angular rate, deg/s
  // Derived:
  float linearG;             // |linear| in g
  float verticalG;           // |linear . up|, g
  float horizontalG;         // linear part perpendicular to gravity, g
  float gyroDps;             // |gyro|
  float yawRateDps;          // gyro . up (turn rate)
  float tiltDeg;             // angle between gravity now and the saved upright
};

namespace Imu {
  // Starts the BNO055 in IMU mode and loads the saved calibration offsets.
  // Returns false if the sensor does not answer.
  bool begin();
  bool hasSavedCalibration();

  // Reads one sample. Returns false on an I2C failure (all-zero read).
  bool read(ImuSample& out);

  // Saves the current gravity direction as "upright" (bike on center stand).
  // Averages `samples` readings taken SAMPLE_INTERVAL_MS apart.
  void calibrateUpright(int samples = 100);
  bool hasUprightReference();

  // BNO055 self-calibration levels 0..3.
  void calibrationStatus(uint8_t& sys, uint8_t& gyro, uint8_t& accel);
}
