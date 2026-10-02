#include "blackbox.h"
#include "config.h"
#include <LittleFS.h>
#include <algorithm>
#include <vector>

namespace {
  struct Row {
    uint32_t t;
    float linX, linY, linZ;
    float gyrX, gyrY, gyrZ;
    float tilt;
  };

  Row ring[BLACKBOX_SAMPLES];
  size_t ringHead = 0;
  size_t ringCount = 0;

  Row before[BLACKBOX_SAMPLES];
  Row after[BLACKBOX_SAMPLES];
  size_t beforeCount = 0;
  size_t afterCount = 0;

  volatile bool capturing = false;
  volatile bool readyToWrite = false;
  char captureUid[40] = {0};
  bool fsReady = false;

  Row toRow(const ImuSample& s, unsigned long now) {
    return { (uint32_t)now, s.linX, s.linY, s.linZ, s.gyrX, s.gyrY, s.gyrZ, s.tiltDeg };
  }

  void writeRows(File& f, const Row* rows, size_t n, const char* phase) {
    for (size_t i = 0; i < n; i++) {
      const Row& r = rows[i];
      f.printf("%s,%lu,%.2f,%.2f,%.2f,%.1f,%.1f,%.1f,%.1f\n", phase, (unsigned long)r.t,
               r.linX, r.linY, r.linZ, r.gyrX, r.gyrY, r.gyrZ, r.tilt);
    }
  }

  // Keep at most BLACKBOX_MAX_FILES recordings; delete the oldest names first
  // (names start with the boot counter and millis, so they sort by age).
  void pruneOldFiles() {
    std::vector<String> names;
    File dir = LittleFS.open("/bb");
    if (!dir) return;
    for (File f = dir.openNextFile(); f; f = dir.openNextFile()) names.push_back(String(f.name()));
    std::sort(names.begin(), names.end());
    while (names.size() >= BLACKBOX_MAX_FILES) {
      LittleFS.remove("/bb/" + names.front());
      names.erase(names.begin());
    }
  }
}

namespace BlackBox {

void begin() {
  fsReady = LittleFS.begin(true);
  if (fsReady && !LittleFS.exists("/bb")) LittleFS.mkdir("/bb");
}

void record(const ImuSample& s, unsigned long now) {
  Row r = toRow(s, now);
  if (capturing) {
    after[afterCount++] = r;
    if (afterCount >= BLACKBOX_SAMPLES) {
      capturing = false;
      readyToWrite = true;
    }
  }
  ring[ringHead] = r;
  ringHead = (ringHead + 1) % BLACKBOX_SAMPLES;
  if (ringCount < BLACKBOX_SAMPLES) ringCount++;
}

void startCapture(const char* eventUid) {
  if (capturing || readyToWrite) return;   // one recording at a time
  // Copy the ring (oldest first) as the "before" part.
  size_t start = (ringHead + BLACKBOX_SAMPLES - ringCount) % BLACKBOX_SAMPLES;
  for (size_t i = 0; i < ringCount; i++) before[i] = ring[(start + i) % BLACKBOX_SAMPLES];
  beforeCount = ringCount;
  afterCount = 0;
  strncpy(captureUid, eventUid, sizeof(captureUid) - 1);
  capturing = true;
}

bool pendingWrite() { return readyToWrite; }

void writePending() {
  if (!readyToWrite) return;
  if (fsReady) {
    pruneOldFiles();
    File f = LittleFS.open(String("/bb/") + captureUid + ".csv", "w");
    if (f) {
      f.println("phase,millis,linX,linY,linZ,gyroX,gyroY,gyroZ,tiltDeg");
      writeRows(f, before, beforeCount, "before");
      writeRows(f, after, afterCount, "after");
      f.close();
    }
  }
  // Never block detection on storage problems: drop the recording and move on.
  readyToWrite = false;
}

String listJson() {
  String out = "[";
  if (fsReady) {
    File dir = LittleFS.open("/bb");
    bool first = true;
    for (File f = dir ? dir.openNextFile() : File(); f; f = dir.openNextFile()) {
      if (!first) out += ",";
      out += "{\"name\":\"" + String(f.name()) + "\",\"size\":" + String(f.size()) + "}";
      first = false;
    }
  }
  return out + "]";
}

} // namespace BlackBox
