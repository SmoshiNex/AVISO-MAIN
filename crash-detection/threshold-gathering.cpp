// ============================================================
// AVISO — Crash Detection Threshold Data Gathering
// Field-Hardened v3 (No Button, Buzzer-Calibrated)
// ------------------------------------------------------------
// PURPOSE:
//   Collects labeled sensor data for one of four motion
//   categories (normal / brake / bump / crash) to establish
//   real, evidence-based thresholds for the phone-side
//   four-threshold classifier (Process 4.0 in the AVISO DFD).
//   This sketch performs NO classification itself — it only
//   senses, signals, and logs.
//
// WORKFLOW:
//   1. Set sessionMode below to the category being tested.
//   2. Upload with laptop attached, confirm signals are correct.
//   3. Unplug laptop, power the unit independently, run the
//      30-second test in the field.
//   4. Retrieve data afterward using the separate retrieval
//      sketch. Attempt counters persist in EEPROM across
//      power cycles and are unaffected by storage cleanup.
//
// AUDIO DESIGN NOTE:
//   2000Hz was confirmed, by direct listening test on this
//   specific buzzer unit, to be its loudest resonant frequency.
//   It is used for signals where audibility matters most
//   (failure/alarm, category confirmation, test completion).
//   700Hz is deliberately kept for the "starting" signal so it
//   remains unmistakably distinct from every alert tone, not
//   because it is louder.
// ============================================================

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>
#include <LittleFS.h>
#include <EEPROM.h>
#include <esp_task_wdt.h>
#include <esp_system.h>

Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x29);  // I2C address confirmed via scanner on this hardware

// ============================================================
// SESSION CONFIGURATION — set this before each upload
// ============================================================
// 0 = normal riding | 1 = hard brake | 2 = road bump | 3 = crash (drop-rig only)
const int sessionMode = 0;

// ============================================================
// PIN ASSIGNMENTS
// ============================================================
#define LED_PIN 2
#define BUZZER_PIN 4

// ============================================================
// EEPROM LAYOUT
// ============================================================
#define EEPROM_SIZE 512
#define CALIBRATION_FLAG_ADDR 0     // 1 byte: 0x55 = valid calibration saved
#define CALIBRATION_DATA_ADDR 1     // BNO055 offset struct
#define ATTEMPT_COUNT_ADDR 100      // 4 bytes, one counter per category (0-3)

// ============================================================
// SYSTEM TIMING / SAFETY LIMITS
// ============================================================
#define WDT_TIMEOUT_SEC 8              // hardware watchdog — force-reboots if loop() ever stalls
#define LOW_STORAGE_WARNING_BYTES 20000 // warn but continue
#define STORAGE_WRITE_HALT_BYTES 5000   // hard stop — refuse to write below this
#define INIT_RETRY_ATTEMPTS 3           // startup checks get this many tries before declaring failure
#define INIT_RETRY_DELAY_MS 500
#define HEARTBEAT_INTERVAL_MS 15000     // quiet "still alive" tick during the test window

const char* LOG_FILE = "/sensor_stream_log.csv";
const char* sessionLabels[] = {"normal", "brake", "bump", "crash"};
int attemptNumber = 1;

unsigned long readingCount = 0;
int zeroReadingStreak = 0;
const int ZERO_STREAK_FAILURE_LIMIT = 10;  // consecutive all-zero readings = likely I2C failure

const unsigned long TEST_DURATION_MS = 30000;  // 30-second window per session (see rationale: more
                                                 // repetitions across short, clean sessions yields
                                                 // better data than fewer long sessions with more
                                                 // risk of unintended movement during the window)
unsigned long testStartTime = 0;
unsigned long lastHeartbeat = 0;
bool testActive = false;
bool testComplete = false;

// Baseline orientation captured at the start of each session,
// used to compute relative change rather than raw compass heading
float baselineOx = 0, baselineOy = 0, baselineOz = 0;

// Tracks the single worst moment of the session for quick
// end-of-test review, rather than requiring a manual scan of
// hundreds of logged rows
float peakAccelMag = 0;
float peakDeltaOzAtPeak = 0;

String resetReasonLabel = "unknown";  // written into every log row, flags sessions
                                       // that were interrupted by an unexpected reboot

// ============================================================
// BUZZER + LED SIGNAL LIBRARY
// ------------------------------------------------------------
// Every signal is both audible AND visible, since outdoor
// lighting can hide the LED and road/wind noise can mask the
// buzzer — each channel backs up the other.
// ============================================================

// Category confirmation: tone count == blink count == category
// number, so audio and visual always agree on what was selected.
// Uses the confirmed 2000Hz loudest frequency.
void signalCategoryConfirm(int categoryNumber) {
  delay(400);
  for (int i = 0; i < categoryNumber; i++) {
    tone(BUZZER_PIN, 2000, 250);
    digitalWrite(LED_PIN, HIGH); delay(250); digitalWrite(LED_PIN, LOW);
    delay(250);
  }
}

// "Test starting now" — deliberately low (700Hz) and sustained,
// so it can never be confused with a higher-pitched alert tone.
// Clarity of meaning matters more than loudness here.
void signalStartingNow() {
  tone(BUZZER_PIN, 700, 900);
  digitalWrite(LED_PIN, HIGH); delay(900); digitalWrite(LED_PIN, LOW);
  delay(200);
}

// "Test complete, safe to unplug" — three descending tones,
// topped by the confirmed loudest frequency, shaped differently
// from the failure alarm so the two are never mistaken for each other.
void signalTestComplete() {
  int freqs[] = {2000, 1500, 1000};
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, freqs[i], 220);
    digitalWrite(LED_PIN, HIGH); delay(220); digitalWrite(LED_PIN, LOW);
    delay(180);
  }
}

// Failure / alarm — the single most safety-relevant signal in
// this sketch. Alternates between two tones at or near the
// confirmed loudest frequency, since real alternation reads as
// "alarm" far more clearly than one repeated fixed beep.
void signalFailure() {
  for (int i = 0; i < 5; i++) {
    tone(BUZZER_PIN, 2000, 150);
    digitalWrite(LED_PIN, HIGH); delay(150); digitalWrite(LED_PIN, LOW);
    tone(BUZZER_PIN, 1700, 150);
    digitalWrite(LED_PIN, HIGH); delay(150); digitalWrite(LED_PIN, LOW);
  }
}

// Low storage warning — a "heads up," not an emergency, kept
// clearly lower and calmer than the failure alarm.
void signalLowStorageWarning() {
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, 1200, 300);
    digitalWrite(LED_PIN, HIGH); delay(300); digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}

// Heartbeat — intentionally quiet, brief, and infrequent.
// Its only job is reassurance that the unit hasn't silently
// hung during an unattended field test; loudness is not the goal.
void signalHeartbeat() {
  tone(BUZZER_PIN, 1000, 40);
  digitalWrite(LED_PIN, HIGH); delay(40); digitalWrite(LED_PIN, LOW);
}

// ============================================================
// CALIBRATION
// ------------------------------------------------------------
// Calibration is performed ONCE per physical sensor via a
// separate, dedicated calibration sketch. This sketch only
// loads the already-saved result — it never recalibrates.
// ============================================================
bool loadCalibration() {
  if (EEPROM.read(CALIBRATION_FLAG_ADDR) != 0x55) return false;
  adafruit_bno055_offsets_t offsets;
  EEPROM.get(CALIBRATION_DATA_ADDR, offsets);
  bno.setSensorOffsets(offsets);
  return true;
}

// ============================================================
// ATTEMPT COUNTER
// ------------------------------------------------------------
// Persists in EEPROM across power cycles and across storage
// cleanups, so repeated tests of the same category are always
// uniquely numbered (brake #1, brake #2, ...) rather than
// silently overwritten or ambiguous.
// ============================================================
int getAndIncrementAttempt(int mode) {
  int addr = ATTEMPT_COUNT_ADDR + mode;
  byte current = EEPROM.read(addr);
  if (current == 255) current = 0;  // unwritten EEPROM reads as 0xFF
  byte next = current + 1;
  EEPROM.write(addr, next);
  EEPROM.commit();
  return next;
}

// ============================================================
// PRE-TEST SENSOR SANITY CHECK
// ------------------------------------------------------------
// Confirms the sensor is returning real, physically plausible
// data before committing to a full test window — catches a
// silent I2C failure before it wastes a field trip.
// ============================================================
bool sensorSanityCheckOnce() {
  sensors_event_t testOrient, testAccel;
  bno.getEvent(&testOrient, Adafruit_BNO055::VECTOR_EULER);
  bno.getEvent(&testAccel, Adafruit_BNO055::VECTOR_LINEARACCEL);

  float mag = sqrt(sq(testAccel.acceleration.x) + sq(testAccel.acceleration.y) + sq(testAccel.acceleration.z));
  bool allZero = (mag == 0.0 && testOrient.orientation.x == 0.0 &&
                  testOrient.orientation.y == 0.0 && testOrient.orientation.z == 0.0);
  bool implausible = (mag > 50.0);
  return !(allZero || implausible);
}

// ============================================================
// RETRY WRAPPER
// ------------------------------------------------------------
// A cold power-up straight from the buck converter is more
// prone to a transient first-read glitch than a clean USB bench
// boot. Retrying before declaring a real failure avoids wasting
// an entire field trip over a one-off hiccup.
// ============================================================
bool retryCheck(bool (*checkFn)()) {
  for (int i = 0; i < INIT_RETRY_ATTEMPTS; i++) {
    if (checkFn()) return true;
    delay(INIT_RETRY_DELAY_MS);
  }
  return false;
}

bool tryBnoBegin() { return bno.begin(); }
bool tryLittleFsBegin() { return LittleFS.begin(true); }

bool hasStorageHeadroom() {
  size_t freeBytes = LittleFS.totalBytes() - LittleFS.usedBytes();
  return freeBytes >= STORAGE_WRITE_HALT_BYTES;
}

// Unrecoverable failure: alarm forever rather than fail silently.
// Serial output is still attempted in case a laptop happens to
// be attached, but the unit does not depend on it being seen.
void haltWithFailureSignal(const char* reason) {
  if (Serial) Serial.println("[FATAL] " + String(reason));
  while (1) {
    signalFailure();
    delay(1200);
    esp_task_wdt_reset();
  }
}

// ============================================================
// SETUP
// ============================================================
void setup() {
  Serial.begin(115200);
  delay(500);
  // Deliberately NO "while (!Serial) delay(10);" here — this
  // unit must boot and run fully correctly with no laptop
  // attached at all, since field testing has no Serial Monitor.

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  if (Serial) {
    Serial.println("=====================================");
    Serial.println("AVISO Threshold Data Gathering — Boot");
    Serial.println("=====================================");
  }

  // Record why the board booted — distinguishes a clean power-on
  // from a mid-session brownout or watchdog reset, so a corrupted
  // or interrupted session can be identified during later analysis.
  esp_reset_reason_t reason = esp_reset_reason();
  switch (reason) {
    case ESP_RST_POWERON:  resetReasonLabel = "poweron"; break;
    case ESP_RST_BROWNOUT: resetReasonLabel = "BROWNOUT"; break;
    case ESP_RST_PANIC:    resetReasonLabel = "PANIC"; break;
    case ESP_RST_TASK_WDT: resetReasonLabel = "WDT_TIMEOUT"; break;
    case ESP_RST_SW:       resetReasonLabel = "software"; break;
    default:               resetReasonLabel = "other_" + String((int)reason); break;
  }
  if (Serial) Serial.println("[INIT] Reset reason: " + resetReasonLabel);

  // Hardware watchdog: force-reboots the unit if loop() ever
  // stalls, rather than leaving a field unit silently hung.
  esp_task_wdt_config_t wdt_config = {
    .timeout_ms = WDT_TIMEOUT_SEC * 1000,
    .idle_core_mask = 0,
    .trigger_panic = true
  };
  esp_task_wdt_init(&wdt_config);
  esp_task_wdt_add(NULL);

  EEPROM.begin(EEPROM_SIZE);

  // --- Sensor presence check ---
  if (!retryCheck(tryBnoBegin)) haltWithFailureSignal("BNO055 not detected after retries.");
  bno.setExtCrystalUse(true);
  if (Serial) Serial.println("[INIT] BNO055 detected.");

  // --- Calibration check — this sketch never calibrates itself ---
  if (!loadCalibration()) haltWithFailureSignal("No saved calibration found. Run the calibration sketch first.");
  if (Serial) Serial.println("[INIT] Calibration loaded from flash.");

  // --- Storage initialization ---
  if (!retryCheck(tryLittleFsBegin)) haltWithFailureSignal("LittleFS mount failed after retries.");

  size_t freeBytesAtBoot = LittleFS.totalBytes() - LittleFS.usedBytes();
  size_t totalBytesAtBoot = LittleFS.totalBytes();
  if (Serial) Serial.println("[STORAGE] Free: " + String(freeBytesAtBoot) + " / " + String(totalBytesAtBoot) + " bytes");

  if (!hasStorageHeadroom()) haltWithFailureSignal("Storage critically low. Retrieve and clear data before continuing.");
  if (freeBytesAtBoot < LOW_STORAGE_WARNING_BYTES) {
    if (Serial) Serial.println("[WARNING] Storage running low.");
    signalLowStorageWarning();
  }

  // --- Log file setup (append-only — never overwrites prior sessions) ---
  if (!LittleFS.exists(LOG_FILE)) {
    File file = LittleFS.open(LOG_FILE, "w");
    file.println("session_label,attempt,reading,millis,accelX,accelY,accelZ,accelMag,orientX,orientY,orientZ,deltaOrientX,deltaOrientY,deltaOrientZ,resetReason");
    file.close();
    if (Serial) Serial.println("[INIT] New log file created.");
  } else {
    if (Serial) Serial.println("[INIT] Existing log file found — appending.");
  }

  // --- Pre-test sensor sanity check ---
  delay(300);
  bool sanityOk = false;
  for (int i = 0; i < INIT_RETRY_ATTEMPTS; i++) {
    if (sensorSanityCheckOnce()) { sanityOk = true; break; }
    delay(INIT_RETRY_DELAY_MS);
  }
  if (!sanityOk) haltWithFailureSignal("Sensor sanity check failed after retries.");
  if (Serial) Serial.println("[INIT] Sensor sanity check passed.");

  // --- Attempt numbering, persists across power cycles ---
  attemptNumber = getAndIncrementAttempt(sessionMode);

  if (Serial) {
    Serial.println("-------------------------------------");
    Serial.println("[SESSION] Category: " + String(sessionLabels[sessionMode]) +
                   "  |  Attempt #" + String(attemptNumber));
    Serial.println("[SESSION] Confirming via " + String(sessionMode + 1) + " tone(s)/blink(s)...");
  }

  // --- Signal: category confirmed, audio and visual in agreement ---
  signalCategoryConfirm(sessionMode + 1);

  // --- Capture baseline orientation for this session's delta calculations ---
  delay(300);
  sensors_event_t baselineEvent;
  bno.getEvent(&baselineEvent, Adafruit_BNO055::VECTOR_EULER);
  baselineOx = baselineEvent.orientation.x;
  baselineOy = baselineEvent.orientation.y;
  baselineOz = baselineEvent.orientation.z;
  if (Serial) Serial.println("[INIT] Baseline orientation captured.");

  // --- Signal: test window starting ---
  signalStartingNow();

  peakAccelMag = 0;
  peakDeltaOzAtPeak = 0;
  testStartTime = millis();
  lastHeartbeat = millis();
  testActive = true;
  testComplete = false;

  if (Serial) {
    Serial.println("[SESSION] Logging started. 30-second window running.");
    Serial.println("-------------------------------------");
  }
}

// ============================================================
// LOOP
// ============================================================
void loop() {
  esp_task_wdt_reset();

  if (testComplete) { delay(1000); return; }

  // --- Quiet heartbeat, confirms the unit hasn't silently hung ---
  if (testActive && (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL_MS)) {
    signalHeartbeat();
    lastHeartbeat = millis();
  }

  // --- End of test window ---
  if (testActive && (millis() - testStartTime >= TEST_DURATION_MS)) {
    testActive = false;
    testComplete = true;
    signalTestComplete();
    if (Serial) {
      Serial.println("-------------------------------------");
      Serial.println("[SUMMARY] Category: " + String(sessionLabels[sessionMode]) +
                     "  Attempt #" + String(attemptNumber));
      Serial.println("[SUMMARY] Total readings logged: " + String(readingCount));
      Serial.println("[SUMMARY] Peak accelMag: " + String(peakAccelMag, 2) +
                     "  |  dOrientZ at peak: " + String(peakDeltaOzAtPeak, 2));
      Serial.println("[SESSION] Complete. Safe to unplug.");
      Serial.println("-------------------------------------");
    }
    return;
  }

  // --- Read sensor ---
  sensors_event_t orientationData, linearAccelData;
  bno.getEvent(&orientationData, Adafruit_BNO055::VECTOR_EULER);
  bno.getEvent(&linearAccelData, Adafruit_BNO055::VECTOR_LINEARACCEL);

  float ax = linearAccelData.acceleration.x;
  float ay = linearAccelData.acceleration.y;
  float az = linearAccelData.acceleration.z;
  float accelMag = sqrt(ax * ax + ay * ay + az * az);
  float ox = orientationData.orientation.x;
  float oy = orientationData.orientation.y;
  float oz = orientationData.orientation.z;

  // --- Orientation delta from this session's baseline, with
  //     360-degree wraparound correction applied to all three axes ---
  float deltaOx = ox - baselineOx;
  float deltaOy = oy - baselineOy;
  float deltaOz = oz - baselineOz;
  if (deltaOx > 180) deltaOx -= 360;
  if (deltaOx < -180) deltaOx += 360;
  if (deltaOy > 180) deltaOy -= 360;
  if (deltaOy < -180) deltaOy += 360;
  if (deltaOz > 180) deltaOz -= 360;
  if (deltaOz < -180) deltaOz += 360;

  readingCount++;

  // --- Mid-test I2C failure detection: a genuinely connected
  //     sensor never reports all-zero for several readings in a row ---
  if (accelMag == 0.0 && ox == 0.0 && oy == 0.0 && oz == 0.0) zeroReadingStreak++;
  else zeroReadingStreak = 0;
  if (zeroReadingStreak >= ZERO_STREAK_FAILURE_LIMIT) {
    if (Serial) Serial.println("[ERROR] Sensor failure mid-test — zero readings persisting.");
    signalFailure();
  }

  // --- Track this session's single worst moment ---
  if (accelMag > peakAccelMag) { peakAccelMag = accelMag; peakDeltaOzAtPeak = deltaOz; }

  // --- Live telemetry (visible only when Serial is connected) ---
  if (Serial) {
    Serial.println("[" + String(sessionLabels[sessionMode]) + " #" + String(attemptNumber) + "] " +
                   "ax:" + String(ax, 2) + " ay:" + String(ay, 2) + " az:" + String(az, 2) +
                   " accelMag:" + String(accelMag, 2) +
                   " dOrientX:" + String(deltaOx, 2) + " dOrientY:" + String(deltaOy, 2) + " dOrientZ:" + String(deltaOz, 2));
  }

  // --- Persistent log, gated by a storage safety check on every write ---
  if (!hasStorageHeadroom()) {
    if (Serial) Serial.println("[ERROR] Storage critically low — logging stopped to prevent corruption.");
    signalFailure();
  } else {
    String line = String(sessionLabels[sessionMode]) + "," + String(attemptNumber) + "," + String(readingCount) + "," +
                  String(millis()) + "," + String(ax, 2) + "," + String(ay, 2) + "," + String(az, 2) + "," +
                  String(accelMag, 2) + "," + String(ox, 2) + "," + String(oy, 2) + "," + String(oz, 2) + "," +
                  String(deltaOx, 2) + "," + String(deltaOy, 2) + "," + String(deltaOz, 2) + "," + resetReasonLabel;
    File file = LittleFS.open(LOG_FILE, "a");
    if (file) { file.println(line); file.close(); }
  }

  delay(100);  // ~10 readings per second
}