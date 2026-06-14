<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Rider\HazardLogController;
use App\Http\Controllers\Rider\TripController;

// All routes here are loaded by the RouteServiceProvider
// and typically prefixed with /api/rider

Route::post('/hazard-logs', [HazardLogController::class, 'store']);

// ── Trip / Live Location ───────────────────────────────────────────────────
Route::post('/trips',                      [TripController::class, 'start']);
Route::put('/trips/{trip}/location',       [TripController::class, 'updateLocation']);
Route::put('/trips/{trip}/end',            [TripController::class, 'end']);