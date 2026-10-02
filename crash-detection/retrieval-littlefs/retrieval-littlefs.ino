// ============================================================
// AVISO — Log Retrieval (Enhanced)
// ------------------------------------------------------------
// Prints each file below over Serial (115200 baud). Copy each
// block between BEGIN/END into its own .csv file on the laptop.
// Retrieve the short session summary first: it says which
// sessions are in the big log and whether each one was clean.
// ============================================================
#include <LittleFS.h>

// Files written by threshold-gathering v5 (summary first, it is small)
const char* FILES_TO_RETRIEVE[] = {
  "/threshold_sessions_v5.csv",
  "/threshold_log_v5.csv",
  "/sensor_stream_log_v2.csv",   // older v4 sessions, if still on the unit
};
const int FILE_COUNT = sizeof(FILES_TO_RETRIEVE) / sizeof(FILES_TO_RETRIEVE[0]);

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

void dumpFile(const char* path) {
  if (!LittleFS.exists(path)) {
    Serial.println("[SKIP] File not found: " + String(path));
    return;
  }
  File file = LittleFS.open(path, "r");
  Serial.println("[INFO] Retrieving: " + String(path));
  Serial.println("[INFO] File size: " + String(file.size()) + " bytes");
  Serial.println("=== BEGIN CSV DATA " + String(path) + " (copy everything below) ===");

  // Buffered copy: much faster than one byte at a time for a ~400 KB+ log.
  uint8_t buf[512];
  unsigned long lineCount = 0;
  while (file.available()) {
    size_t n = file.read(buf, sizeof(buf));
    for (size_t i = 0; i < n; i++) if (buf[i] == '\n') lineCount++;
    Serial.write(buf, n);
  }

  Serial.println("\n=== END CSV DATA " + String(path) + " ===");
  Serial.println("[INFO] Total lines (including header): " + String(lineCount));
  Serial.println("");
  file.close();
}

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  delay(1000);

  Serial.println("=====================================");
  Serial.println("AVISO Log Retrieval");
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

  for (int i = 0; i < FILE_COUNT; i++) dumpFile(FILES_TO_RETRIEVE[i]);
  Serial.println("[DONE] Retrieval finished.");
}

void loop() {}
