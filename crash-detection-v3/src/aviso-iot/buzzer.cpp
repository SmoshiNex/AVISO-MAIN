#include "buzzer.h"
#include "config.h"

namespace {
  struct Step { uint16_t freq; uint16_t ms; };   // freq 0 = silence

  const Step TONE_READY[] = { {1500, 150}, {0, 50}, {2000, 150} };
  const Step TONE_OK[]    = { {2000, 120} };
  const Step TONE_ERR[]   = { {1000, 250}, {0, 100}, {800, 350} };
  const Step TONE_ALARM[] = { {2000, 150}, {1700, 150} };   // repeats

  volatile BuzzerPattern requested = PATTERN_NONE;
  volatile bool requestPending = false;

  BuzzerPattern current = PATTERN_NONE;
  const Step* steps = nullptr;
  size_t stepCount = 0;
  size_t stepIndex = 0;
  unsigned long stepEndsAt = 0;
  unsigned long alarmStartedAt = 0;

  void startStep(unsigned long now) {
    const Step& st = steps[stepIndex];
    if (st.freq) {
      tone(BUZZER_PIN, st.freq);
      digitalWrite(LED_PIN, HIGH);
    } else {
      noTone(BUZZER_PIN);
      digitalWrite(LED_PIN, LOW);
    }
    stepEndsAt = now + st.ms;
  }

  void silence() {
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    current = PATTERN_NONE;
    steps = nullptr;
  }
}

namespace Buzzer {

void begin() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
}

void play(BuzzerPattern pattern) {
  requested = pattern;
  requestPending = true;
}

void stop() { play(PATTERN_NONE); }

bool alarmActive() {
  return current == PATTERN_ALARM || (requestPending && requested == PATTERN_ALARM);
}

void update(unsigned long now) {
  if (requestPending) {
    requestPending = false;
    current = requested;
    switch (current) {
      case PATTERN_READY: steps = TONE_READY; stepCount = sizeof(TONE_READY) / sizeof(Step); break;
      case PATTERN_OK:    steps = TONE_OK;    stepCount = sizeof(TONE_OK) / sizeof(Step);    break;
      case PATTERN_ERROR: steps = TONE_ERR;   stepCount = sizeof(TONE_ERR) / sizeof(Step);   break;
      case PATTERN_ALARM: steps = TONE_ALARM; stepCount = sizeof(TONE_ALARM) / sizeof(Step); alarmStartedAt = now; break;
      default:            silence(); return;
    }
    stepIndex = 0;
    startStep(now);
    return;
  }

  if (!steps || (long)(now - stepEndsAt) < 0) return;

  if (current == PATTERN_ALARM && now - alarmStartedAt >= ALARM_MAX_MS) {
    silence();
    return;
  }

  stepIndex++;
  if (stepIndex >= stepCount) {
    if (current != PATTERN_ALARM) { silence(); return; }
    stepIndex = 0;   // the alarm loops
  }
  startStep(now);
}

} // namespace Buzzer
