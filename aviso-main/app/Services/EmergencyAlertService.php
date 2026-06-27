<?php

namespace App\Services;

use App\Events\EmergencyAlertTriggered;
use App\Models\EmergencyAlert;
use App\Models\User;

class EmergencyAlertService
{
    public function triggerSos(User $rider, float $lat, float $lng): EmergencyAlert
    {
        // If rider already has a pending alert, update coords and re-broadcast the same record.
        // This prevents duplicate pins on the admin map when crash detection fires multiple times.
        $existing = EmergencyAlert::with('user')
            ->where('user_id', $rider->id)
            ->where('status', EmergencyAlert::STATUS_PENDING)
            ->latest()
            ->first();

        if ($existing) {
            $existing->update(['latitude' => $lat, 'longitude' => $lng]);
            broadcast(new EmergencyAlertTriggered($existing));
            return $existing;
        }

        $alert = EmergencyAlert::create([
            'user_id'      => $rider->id,
            'rider_code'   => $rider->username ?? (string) $rider->id,
            'latitude'     => $lat,
            'longitude'    => $lng,
            'triggered_at' => now(),
            'status'       => EmergencyAlert::STATUS_PENDING,
        ]);

        $alert->setRelation('user', $rider);
        broadcast(new EmergencyAlertTriggered($alert));

        return $alert;
    }
}
