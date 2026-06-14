<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HazardLog extends Model
{
    // ── Type constants ────────────────────────────────────────────────────────
    const TYPE_POTHOLE          = 'Pothole';
    const TYPE_ROAD_EXCAVATION  = 'Road Excavation';
    const TYPE_ROAD_BARRIER     = 'Road Barrier';
    const TYPE_TRAFFIC_SIGN     = 'Traffic Sign';
    const TYPE_TRAFFIC_LIGHT    = 'Traffic Light';

    const TYPES = [
        self::TYPE_POTHOLE,
        self::TYPE_ROAD_EXCAVATION,
        self::TYPE_ROAD_BARRIER,
        self::TYPE_TRAFFIC_SIGN,
        self::TYPE_TRAFFIC_LIGHT,
    ];

    // ── Status constants ──────────────────────────────────────────────────────
    const STATUS_ACTIVE   = 'active';

    // ── Area labels (match the groupings in mockHazards.ts) ──────────────────
    const AREAS = [
        'City Proper',
        'Calarian',
        'San Roque',
        'Sta Maria',
        'Tugbungan',
        'Talon-Talon',
        'Pasonanca',
        'Putik',
        'Tumaga',
        'Lunzuran',
        'Baliwasan',
        'San Jose Gusu',
    ];

    // ── Eloquent config ───────────────────────────────────────────────────────
    protected $fillable = [
        'haz_code',
        'type',
        'area',
        'latitude',
        'longitude',
        'confidence',
        'distance',
        'rider_code',
        'status',
        'detected_at',
    ];

    protected $casts = [
        'latitude'    => 'decimal:7',
        'longitude'   => 'decimal:7',
        'confidence'  => 'decimal:2',
        'distance'    => 'decimal:2',
        'detected_at' => 'datetime',
    ];

    // ── Query scopes ──────────────────────────────────────────────────────────

    /** Scope: only active hazards */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /** Scope: filter by hazard type */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /** Scope: filter by area label */
    public function scopeByArea(Builder $query, string $area): Builder
    {
        return $query->where('area', $area);
    }

    /** Scope: search by haz_code or rider_code */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function (Builder $q) use ($term) {
            $q->where('haz_code',   'like', "%{$term}%")
              ->orWhere('rider_code', 'like', "%{$term}%");
        });
    }
}
