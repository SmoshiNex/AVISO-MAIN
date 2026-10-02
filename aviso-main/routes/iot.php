<?php

use App\Http\Controllers\Iot\IotController;
use App\Http\Middleware\AuthenticateIotDevice;
use Illuminate\Support\Facades\Route;

// Endpoints called by the AVISO IoT unit (ESP32) over the rider's phone
// hotspot. Loaded under the api middleware group with the /api prefix.

Route::prefix('iot')->group(function () {

    // Pairing: trade the 6-digit code from the rider app for a device key.
    Route::post('/claim', [IotController::class, 'claim'])->middleware('throttle:10,1');

    Route::middleware([AuthenticateIotDevice::class, 'throttle:120,1'])->group(function () {
        Route::post('/heartbeat', [IotController::class, 'heartbeat']);
        // Wi-Fi backup crash report, used only when the phone never confirmed the crash.
        Route::post('/crash', [IotController::class, 'crash']);
    });
});
