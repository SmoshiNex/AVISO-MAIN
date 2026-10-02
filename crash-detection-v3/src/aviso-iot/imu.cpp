#include "imu.h"
#include "config.h"
#include <Wire.h>
#include <EEPROM.h>
#include <Preferences.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

namespace {
  Adafruit_BNO055 bno(BNO055_SENSOR_ID, BNO055_I2C_ADDRESS);
  bool savedCalibration = false;

  // Unit vector of gravity when the bike is upright.
  float upX = 0, upY = 0, upZ = 1;
  bool uprightSaved = false;

  constexpr float G = 9.80665f;

  float norm3(float x, float y, float z) { return sqrtf(x * x + y * y + z * z); }

  bool loadEepromCalibration() {
    EEPROM.begin(EEPROM_SIZE);
    if (EEPROM.read(CALIBRATION_FLAG_ADDR) != 0x55) return false;
    adafruit_bno055_offsets_t offsets;
    EEPROM.get(CALIBRATION_DATA_ADDR, offsets);
    bno.setSensorOffsets(offsets);   // switches to CONFIG and back internally
    return true;
  }

  void loadUpright() {
    Preferences prefs;
    prefs.begin("aviso", true);
    uprightSaved = prefs.isKey("upX");
    if (uprightSaved) {
      upX = prefs.getFloat("upX", 0);
      upY = prefs.getFloat("upY", 0);
      upZ = prefs.getFloat("upZ", 1);
    }
    prefs.end();
  }
}

namespace Imu {

bool begin() {
  Wire.begin();
  Wire.setClock(400000);

  bool found = false;
  for (int i = 0; i < 3 && !found; i++) {
    // IMU mode = accelerometer + gyroscope fusion. The magnetometer is left
    // out: the engine and frame disturb it, and tilt/impact do not need it.
    found = bno.begin(OPERATION_MODE_IMUPLUS);
    if (!found) delay(500);
  }
  if (!found) return false;

  bno.setExtCrystalUse(true);
  savedCalibration = loadEepromCalibration();
  loadUpright();
  delay(50);
  return true;
}

bool hasSavedCalibration() { return savedCalibration; }
bool hasUprightReference() { return uprightSaved; }

bool read(ImuSample& s) {
  imu::Vector<3> lin = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL); // m/s^2
  imu::Vector<3> grav = bno.getVector(Adafruit_BNO055::VECTOR_GRAVITY);    // m/s^2
  imu::Vector<3> gyr = bno.getVector(Adafruit_BNO055::VECTOR_GYROSCOPE);   // deg/s

  s.linX = lin.x(); s.linY = lin.y(); s.linZ = lin.z();
  s.gravX = grav.x(); s.gravY = grav.y(); s.gravZ = grav.z();
  s.gyrX = gyr.x(); s.gyrY = gyr.y(); s.gyrZ = gyr.z();

  float gravNorm = norm3(s.gravX, s.gravY, s.gravZ);
  if (gravNorm < 1.0f) return false;   // gravity is always ~9.8: zero means a failed read

  // First run without a saved upright: use the current direction until the
  // rider calibrates on the center stand (good enough to start, see README).
  if (!uprightSaved && upX == 0 && upY == 0 && upZ == 1) {
    upX = s.gravX / gravNorm; upY = s.gravY / gravNorm; upZ = s.gravZ / gravNorm;
  }

  float ux = s.gravX / gravNorm, uy = s.gravY / gravNorm, uz = s.gravZ / gravNorm;

  float linNorm = norm3(s.linX, s.linY, s.linZ);
  float vertical = s.linX * ux + s.linY * uy + s.linZ * uz;
  float horizontal = sqrtf(fmaxf(0.0f, linNorm * linNorm - vertical * vertical));

  s.linearG = linNorm / G;
  s.verticalG = fabsf(vertical) / G;
  s.horizontalG = horizontal / G;
  s.gyroDps = norm3(s.gyrX, s.gyrY, s.gyrZ);
  s.yawRateDps = s.gyrX * ux + s.gyrY * uy + s.gyrZ * uz;

  float dot = fmaxf(-1.0f, fminf(1.0f, ux * upX + uy * upY + uz * upZ));
  s.tiltDeg = acosf(dot) * 180.0f / PI;
  return true;
}

void calibrateUpright(int samples) {
  float sx = 0, sy = 0, sz = 0;
  int n = 0;
  for (int i = 0; i < samples; i++) {
    imu::Vector<3> grav = bno.getVector(Adafruit_BNO055::VECTOR_GRAVITY);
    if (norm3(grav.x(), grav.y(), grav.z()) > 1.0f) {
      sx += grav.x(); sy += grav.y(); sz += grav.z(); n++;
    }
    delay(SAMPLE_INTERVAL_MS);
  }
  if (n == 0) return;
  float len = norm3(sx, sy, sz);
  upX = sx / len; upY = sy / len; upZ = sz / len;
  uprightSaved = true;

  Preferences prefs;
  prefs.begin("aviso", false);
  prefs.putFloat("upX", upX);
  prefs.putFloat("upY", upY);
  prefs.putFloat("upZ", upZ);
  prefs.end();
}

void calibrationStatus(uint8_t& sys, uint8_t& gyro, uint8_t& accel) {
  uint8_t mag;
  bno.getCalibration(&sys, &gyro, &accel, &mag);
}

} // namespace Imu
