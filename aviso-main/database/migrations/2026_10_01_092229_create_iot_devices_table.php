<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * One row per AVISO IoT crash-detection unit (ESP32 + BNO055) and the
     * rider it is paired to. The device authenticates with a secret key that
     * is stored here only as a SHA-256 hash.
     */
    public function up(): void
    {
        Schema::create('iot_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('device_uid', 32)->unique()->comment('ESP32 MAC-derived id');
            $table->string('api_key_hash', 64);
            $table->string('firmware_version', 20)->nullable();
            $table->string('local_ip', 45)->nullable()->comment('Address on the rider phone hotspot');
            $table->smallInteger('rssi')->nullable();
            $table->unsignedInteger('uptime_seconds')->nullable();
            $table->string('reset_reason', 30)->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('iot_devices');
    }
};
