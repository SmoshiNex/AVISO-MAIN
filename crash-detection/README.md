# AVISO IoT — crash detection unit

ESP32 + GY-BNO055 + passive buzzer + buck converter, mounted rigidly at the
Honda Click 125 luggage hook. Detects **normal riding, hard braking, road
bumps and crashes**, streams live data to the AVISO rider app over the
rider's **phone hotspot**, and can report a crash to the server by itself if
the app does not respond.

## Folders

Each folder is one Arduino sketch (the Arduino IDE compiles every file in a
folder together, so sketches must not share a folder).

| Folder | Purpose |
|---|---|
| `aviso-iot/` | **Field firmware** — runs on the bike |
| `threshold-gathering/` | Records labelled 30 s sessions (normal / brake / bump / crash) at 100 Hz to set the thresholds |
| `crash-detection/` | Earlier field logger (kept for reference; superseded by `aviso-iot`) |
| `calibration/` | Calibrates the BNO055 once and saves its offsets |
| `retrieval-littlefs/` | Prints the gathering files over USB serial |
| `storage-cleanup/` | Deletes the gathering files |
| `testing-buzzer/` | Finds the buzzer's loudest tone (2000 Hz) |

`calibration/` saves the offsets to EEPROM (flag `0x55` at address 0, offsets
from address 1); `threshold-gathering` and `aviso-iot` load them at boot.

## Wiring

| Part | ESP32 |
|---|---|
| BNO055 SDA / SCL | GPIO 21 / GPIO 22 |
| BNO055 VIN / GND | 3V3 / GND (address 0x29, as wired now) |
| Passive buzzer | GPIO 4 (other leg to GND) |
| Status LED | GPIO 2 (on-board) |
| Buck converter out (5 V) | 5V/VIN + GND |
| Buck converter in | Motorcycle 12 V switched (key-on) line **through an inline fuse** |

Mounting: **bolt or tightly zip-tie** the box — it must not hang or swing on
the hook. Fix the BNO055 flat to the box (not floating on its wires). Seal
the cable opening against rain. A reset reason of `BROWNOUT` in the app means
the power is dipping — check the buck converter and wiring.

## Arduino IDE setup

- Board: **ESP32 Dev Module**, ESP32 core **3.x** (Boards Manager: "esp32" by Espressif)
- Partition scheme: **No OTA (1MB APP/3MB SPIFFS)** — room for logs and black boxes
- Libraries (Library Manager):
  - Adafruit BNO055 + Adafruit Unified Sensor
  - WebSockets by Markus Sattler (Links2004)
  - ArduinoJson by Benoit Blanchon (**v7**)

## First-time setup

1. In the AVISO app: **Profile → IoT Device → Get pairing code** (valid 10 min).
2. Power the unit. With no saved hotspot it opens Wi-Fi **`AVISO-SETUP-xxxx`**
   (password `aviso1234`). Connect your phone to it and open **http://192.168.4.1**.
3. Enter your **phone hotspot name + password**, the **server URL**, and the
   **pairing code**. Up to 3 hotspots are remembered (e.g. three team members).
4. Turn on that phone hotspot. The unit joins it, pairs (one short beep) and
   from then on joins automatically whenever the hotspot is on.
5. With the bike upright on the **center stand**, tap **Calibrate upright** in
   the app. Tilt is measured from this position.

Server URL before hosting: connect the laptop running Laravel to the **same
phone hotspot** and use its hotspot IP, e.g. `http://192.168.43.50:8000`
(run `php artisan serve --host=0.0.0.0`). The unit can only reach a server
the hotspot can reach.

## How detection works

All numbers are **placeholders** in `aviso-iot/config.h` until the
threshold-gathering data is analysed.

- **G-force** = linear acceleration (gravity removed → **0 g at rest**), split
  into **vertical** (up/down) and **horizontal** (forward/back/sideways).
- **Gyro** = rotation speed in °/s. **Turn rate** = rotation around vertical.
- **Tilt** = angle between gravity now and the saved upright direction (works
  for a fall in any direction; the side stand is only ~10–15°).

| Category | Rule (placeholder values) |
|---|---|
| Normal | none of the below; a **summary every 10 s** (highest values in that window) is logged |
| Bump | vertical ≥ 0.8 g while upright → logged as road data |
| Hard braking | horizontal ≥ 0.45 g for ≥ 200 ms, rotation ≤ 60 °/s → logged |
| **Crash** | **hit** (≥ 3 g or ≥ 250 °/s) → **tilt ≥ 60°** within 3 s → fallen **and still** (≤ 30 °/s) for 3 s |
| Crash (no hit) | tilt ≥ 60° and still for 5 s **during a ride** (slow slide/tip-over) |

Back upright (≤ 30°) before confirmation → nothing happens.

**Known limits:** in fusion mode the BNO055 accelerometer is fixed at ±4 g,
so harder impacts read as ~4 g (keep the hit threshold below 4 g). The unit
does not know which way is "forward", so hard acceleration also counts as
"hard braking" (rare on a scooter).

## Crash flow

1. Crash confirmed → **buzzer alarm** (also alerts bystanders), black box
   saves 5 s before + 5 s after, the crash is sent to the app every second
   until the app acknowledges.
2. App shows the **15 s countdown**. "I'm OK" → app sends `cancel` → alarm
   stops, nothing is reported.
3. Countdown ends → the app sends the SOS (with the crash id) and tells the
   unit `sos_sent`.
4. **Backup:** if after 25 s the unit got neither `cancel` nor `sos_sent`
   (app closed, phone busy), it posts the crash to `/api/iot/crash` itself.
   The server uses the rider's last trip position (the unit has no GPS).
5. Both paths carry the same crash id, so the server raises **one** alert.

## App ↔ unit protocol (WebSocket `ws://<unit-ip>:81`, JSON)

| Direction | Message |
|---|---|
| unit → app | `hello` (uid, fw, reset reason, paired, calibration) · `tel` 10 Hz (`g`, `vg`, `hg`, `gy`, `yaw`, `tilt`, `st`) · `evt` (`normal` / `road_bump` / `hard_braking` / `crash`, with `id`, `peak_g`, `vg`, `hg`, `peak_gyro`, `tilt`) · `crash_cleared` · `calibrated` |
| app → unit | `ack` · `cancel` · `sos_sent` · `ride` (`active`) · `calibrate_upright` · `beep` |

The app finds the unit's IP from the server (the unit reports it in its
heartbeat every 30 s) or from a manually entered IP.

Black box files: `http://<unit-ip>/blackbox` (list) and
`http://<unit-ip>/blackbox/<name>` (CSV).

## Crash detection logs

During a ride, every event the unit classifies (all four categories) is
uploaded by the app with the phone's GPS and stored in the server's
`rider_events` table. Events are queued on the phone when there is no signal.

- **Admin web → Crash Detection Logs**: filters (category, barangay, rider,
  dates), a *Threshold reference* table (min / avg / max of every sensor
  value per category) and **Download CSV**.
- **Rider app → Profile → Crash Detection Logs**: the rider's own records,
  per-category ranges and **Download CSV** (share/save).

Once the thresholds are in place, these logs show whether they separate the
categories in real riding (e.g. normal riding's max vertical G should stay
below `BUMP_VERTICAL_G`).

## Gathering thresholds (do this before trusting detection)

Arduino IDE: board **ESP32 Dev Module**, partition **No OTA (1MB APP/3MB
SPIFFS)** (about 7 sessions fit; the default partition fits about 3).

1. Upload `calibration/` once and follow its steps (still, then 6
   orientations). Three rising tones = saved.
2. Mount the box in its **final** position.
3. In `threshold-gathering/threshold-gathering.ino` set `sessionMode`
   (0 normal, 1 brake, 2 bump, 3 crash) and upload. Check the beep count.
4. Keep the bike **upright and still** until the low start tone: the upright
   reference for `tiltDeg` is captured right before it.
5. Run several 30 s sessions per category (normal ≥10, brake ≥10, bump ≥10,
   crash ≥5). **Crash sessions only with a drop rig or by laying the stopped
   bike gently on its side on grass.**
6. Retrieve with `retrieval-littlefs` (prints `threshold_sessions_v5.csv`,
   then `threshold_log_v5.csv`), then clear with `storage-cleanup`. The
   gathering sketch refuses to start (alarm) when a full session no longer
   fits.
7. The log's `linearG`, `verticalG`, `horizontalG`, `gyroDps` and `tiltDeg`
   columns are computed exactly like the field firmware, so pick thresholds
   straight from them (e.g. bump threshold above the highest `verticalG` in
   normal riding) and put them in `aviso-iot/config.h`. Rows with
   `clipped=1` hit the 4 g sensor limit (the true peak was higher).

## Bench test (box on a table, app connected)

| Action | Expected |
|---|---|
| Tap the table hard | `road_bump` event |
| Tap, then roll the box 90° and leave it 3 s | alarm + app countdown |
| Tap "I'm OK" | alarm stops |
| Repeat, force-close the app | after ~25 s one SOS on the admin map |
| Turn the box 90° slowly, no tap, no ride | nothing |
| Unplug the hotspot | unit keeps detecting; reconnects when it is back |
