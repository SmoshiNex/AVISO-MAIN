<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * rider_events becomes the crash-detection log: every classification the
     * IoT unit makes (normal / hard braking / road bump / crash) with the
     * sensor values behind it, so the team can study each category's range
     * and set the detection thresholds from real data.
     */
    public function up(): void
    {
        Schema::table('rider_events', function (Blueprint $table) {
            $table->string('event_uid', 64)->nullable()->unique()->after('id')->comment('Id from the IoT unit; dedupes retries');
            $table->string('source', 10)->default('iot')->after('event_uid');
            $table->decimal('vertical_g', 6, 3)->nullable()->after('acceleration_peak');
            $table->decimal('horizontal_g', 6, 3)->nullable()->after('vertical_g');
            $table->decimal('gyro_peak_dps', 8, 2)->nullable()->after('horizontal_g');
            $table->decimal('tilt_deg', 6, 2)->nullable()->after('gyro_peak_dps');
            $table->string('barangay_code', 10)->nullable()->after('longitude')->index();
            $table->string('area', 100)->nullable()->after('barangay_code');
            $table->index(['event_type', 'detected_at']);
        });
    }

    public function down(): void
    {
        Schema::table('rider_events', function (Blueprint $table) {
            $table->dropIndex(['event_type', 'detected_at']);
            $table->dropIndex(['barangay_code']);
            $table->dropUnique(['event_uid']);
            $table->dropColumn([
                'event_uid', 'source', 'vertical_g', 'horizontal_g',
                'gyro_peak_dps', 'tilt_deg', 'barangay_code', 'area',
            ]);
        });
    }
};
