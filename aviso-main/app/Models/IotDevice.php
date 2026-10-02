<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * An AVISO IoT crash-detection unit (ESP32 + BNO055) mounted on a rider's
 * motorcycle. It reaches the server through the rider's phone hotspot.
 */
class IotDevice extends Model
{
    /** A device that hasn't sent a heartbeat for this long counts as offline. */
    const ONLINE_WINDOW_SECONDS = 90;

    protected $fillable = [
        'user_id',
        'device_uid',
        'api_key_hash',
        'firmware_version',
        'local_ip',
        'rssi',
        'uptime_seconds',
        'reset_reason',
        'last_seen_at',
    ];

    protected $hidden = ['api_key_hash'];

    protected $casts = [
        'last_seen_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function isOnline(): bool
    {
        return $this->last_seen_at !== null
            && $this->last_seen_at->gt(now()->subSeconds(self::ONLINE_WINDOW_SECONDS));
    }

    public static function hashKey(string $plainKey): string
    {
        return hash('sha256', $plainKey);
    }
}
