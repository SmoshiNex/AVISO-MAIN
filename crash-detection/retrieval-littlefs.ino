// ============================================================
// AVISO — Log Retrieval (Enhanced)
// ============================================================
#include <LittleFS.h>

const char* FILE_TO_RETRIEVE = "/sensor_stream_log.csv";  // change if retrieving deployment_log.csv

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

  if (!LittleFS.exists(FILE_TO_RETRIEVE)) {
    Serial.println("[ERROR] File not found: " + String(FILE_TO_RETRIEVE));
    Serial.println("[INFO] Check the file list above and update FILE_TO_RETRIEVE if needed.");
    while (1) delay(1000);
  }

  File file = LittleFS.open(FILE_TO_RETRIEVE, "r");
  Serial.println("[INFO] Retrieving: " + String(FILE_TO_RETRIEVE));
  Serial.println("[INFO] File size: " + String(file.size()) + " bytes");
  Serial.println("=== BEGIN CSV DATA (copy everything below) ===");

  int lineCount = 0;
  while (file.available()) {
    char c = file.read();
    Serial.write(c);
    if (c == '\n') lineCount++;
  }

  Serial.println("\n=== END CSV DATA ===");
  Serial.println("[INFO] Total lines (including header): " + String(lineCount));
  file.close();
}

void loop() {}