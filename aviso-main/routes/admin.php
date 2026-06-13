<?php

use App\Http\Controllers\Admin\AdminAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('web')->group(function () {
    // Redirect root to login
    Route::redirect('/', '/login');

    // Admin Dashboard (Protected by session auth)
    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('main/Dashboard');
        })->name('dashboard');

        Route::get('/map', function () {
            return Inertia::render('main/MapPage');
        })->name('map');
        
        Route::post('logout', [AdminAuthController::class, 'destroy'])->name('logout');
    });

    // Admin Authentication Routes
    Route::middleware('guest')->group(function () {
        Route::get('login', [AdminAuthController::class, 'create'])->name('login');
        Route::post('login', [AdminAuthController::class, 'store']);
    });
});