// ============================================================
// AVISO — Storage Cleanup (Enhanced)
// ============================================================
#include <LittleFS.h>

const char* FILE_TO_DELETE = "/sensor_stream_log.csv";  // change if clearing deployment_log.csv
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

  if (!LittleFS.exists(FILE_TO_DELETE)) {
    Serial.println("[INFO] File not found: " + String(FILE_TO_DELETE));
    Serial.println("[INFO] Nothing to delete. Check the file list above if this is unexpected.");
    return;
  }

  File checkFile = LittleFS.open(FILE_TO_DELETE, "r");
  size_t sizeBeforeDelete = checkFile.size();
  checkFile.close();

  Serial.println("[WARNING] About to permanently delete: " + String(FILE_TO_DELETE));
  Serial.println("[WARNING] File size: " + String(sizeBeforeDelete) + " bytes");
  Serial.println("[WARNING] Make sure you have already retrieved this data before continuing.");
  Serial.println("[WARNING] Deleting in " + String(CONFIRMATION_DELAY_MS / 1000) + " seconds...");
  Serial.println("[WARNING] Reset the board now if you have NOT retrieved this data yet.");
  delay(CONFIRMATION_DELAY_MS);

  if (LittleFS.remove(FILE_TO_DELETE)) {
    Serial.println("[DONE] Deleted: " + String(FILE_TO_DELETE));
  } else {
    Serial.println("[ERROR] Delete failed — file may be in use or corrupted.");
  }

  size_t freeBytes = LittleFS.totalBytes() - LittleFS.usedBytes();
  size_t totalBytes = LittleFS.totalBytes();
  Serial.println("[STORAGE] Free space now: " + String(freeBytes) + " / " + String(totalBytes) + " bytes");
  Serial.println("[INFO] Note: attempt counters in EEPROM are unaffected by this cleanup.");
  Serial.println("[INFO] Your next session will continue numbering from where it left off.");
}

void loop() {}