// ============================================================
// AVISO — Storage Cleanup (Enhanced)
// ------------------------------------------------------------
// Deletes the threshold-gathering files. Only run this AFTER
// retrieval-littlefs and after checking the saved CSVs open.
// ============================================================
#include <LittleFS.h>

// Files written by threshold-gathering v5
const char* FILES_TO_DELETE[] = {
  "/threshold_log_v5.csv",
  "/threshold_sessions_v5.csv",
  "/sensor_stream_log_v2.csv",   // older v4 sessions, if still on the unit
};
const int FILE_COUNT = sizeof(FILES_TO_DELETE) / sizeof(FILES_TO_DELETE[0]);
const unsigned long CONFIRMATION_DELAY_MS = 5000;  // pause before deleting, giving you a chance to abort

void listAllFiles() {
  Serial.println("[INFO] Files currently on this device:");
  File root = LittleFS.open("/");
  File f = root.openNextFile();
  bool anyFound = false;
  while (f) {
    Serial.println("  " + String(f.name()) + "  (" + String(f.size()) + " bytes)");
    anyFound = true;
    f = root.openNextFile();
  }
  if (!anyFound) Serial.println("  (none found)");
}

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  delay(1000);

  Serial.println("=====================================");
  Serial.println("AVISO Storage Cleanup");
  Serial.println("=====================================");

  bool mounted = false;
  for (int i = 0; i < 3; i++) {
    if (LittleFS.begin(false)) { mounted = true; break; }
    delay(300);
  }
  if (!mounted) {
    Serial.println("[ERROR] LittleFS mount failed after 3 attempts.");
    while (1) delay(1000);
  }

  listAllFiles();
  Serial.println("");

  bool anyToDelete = false;
  for (int i = 0; i < FILE_COUNT; i++) {
    if (!LittleFS.exists(FILES_TO_DELETE[i])) continue;
    File checkFile = LittleFS.open(FILES_TO_DELETE[i], "r");
    Serial.println("[WARNING] About to permanently delete: " + String(FILES_TO_DELETE[i]) +
                   "  (" + String(checkFile.size()) + " bytes)");
    checkFile.close();
    anyToDelete = true;
  }
  if (!anyToDelete) {
    Serial.println("[INFO] Nothing to delete. Check the file list above if this is unexpected.");
    return;
  }

  Serial.println("[WARNING] Make sure you have already retrieved this data before continuing.");
  Serial.println("[WARNING] Deleting in " + String(CONFIRMATION_DELAY_MS / 1000) + " seconds...");
  Serial.println("[WARNING] Reset the board now if you have NOT retrieved this data yet.");
  delay(CONFIRMATION_DELAY_MS);

  for (int i = 0; i < FILE_COUNT; i++) {
    if (!LittleFS.exists(FILES_TO_DELETE[i])) continue;
    if (LittleFS.remove(FILES_TO_DELETE[i])) {
      Serial.println("[DONE] Deleted: " + String(FILES_TO_DELETE[i]));
    } else {
      Serial.println("[ERROR] Delete failed: " + String(FILES_TO_DELETE[i]));
    }
  }

  size_t freeBytes = LittleFS.totalBytes() - LittleFS.usedBytes();
  size_t totalBytes = LittleFS.totalBytes();
  Serial.println("[STORAGE] Free space now: " + String(freeBytes) + " / " + String(totalBytes) + " bytes");
  Serial.println("[INFO] Note: attempt counters in EEPROM are unaffected by this cleanup.");
  Serial.println("[INFO] Your next session will continue numbering from where it left off.");
}

void loop() {}
