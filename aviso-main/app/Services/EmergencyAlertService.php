<?php

namespace App\Services;

use App\Events\EmergencyAlertTriggered;
use App\Models\EmergencyAlert;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmergencyAlertService
{
    public function __construct(private SmsService $smsService)
    {
        //
    }

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

        $this->notifyEmergencyContacts($rider, $lat, $lng);

        return $alert;
    }

    /**
     * SMS every registered emergency contact of the rider. Only called on
     * the create branch of triggerSos — the dedupe branch re-broadcasts the
     * same pending alert and must not re-notify contacts.
     */
    private function notifyEmergencyContacts(User $rider, float $lat, float $lng): void
    {
        $fullName = trim("{$rider->first_name} {$rider->last_name}");
        $mapsUrl  = "https://maps.google.com/?q={$lat},{$lng}";
        $message  = "AVISO ALERT: {$fullName} has triggered an emergency SOS. Location: {$mapsUrl}";

        foreach ($rider->emergencyContacts as $contact) {
            $this->smsService->send($contact->contact_number, $message);
        }
    }

    public function getHistoryGroupedByRider(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->whereHas('emergencyAlerts')
            ->withCount('emergencyAlerts')
            ->withMax('emergencyAlerts', 'triggered_at')
            ->with(['emergencyAlerts' => fn ($q) => $q->latest('triggered_at')->limit(1)]);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(fn ($q) => $q
                ->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('username', 'like', "%{$search}%"));
        }

        $perPage = (int) ($filters['per_page'] ?? 15);
        if (!in_array($perPage, [10, 15, 25, 50])) {
            $perPage = 15;
        }

        return $query->orderByDesc('emergency_alerts_max_triggered_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAlertsForRider(User $rider): Collection
    {
        return $rider->emergencyAlerts()->orderByDesc('triggered_at')->get();
    }

    public function resolve(EmergencyAlert $alert): EmergencyAlert
    {
        $alert->update([
            'status'      => EmergencyAlert::STATUS_RESOLVED,
            'resolved_at' => now(),
        ]);

        return $alert;
    }

    public function getAdminStats(): array
    {
        return [
            'total_today' => EmergencyAlert::whereDate('triggered_at', today())->count(),
            'total_week'  => EmergencyAlert::where('triggered_at', '>=', now()->subWeek())->count(),
            'pending'     => EmergencyAlert::pending()->count(),
            'resolved'    => EmergencyAlert::where('status', EmergencyAlert::STATUS_RESOLVED)->count(),
        ];
    }
}
