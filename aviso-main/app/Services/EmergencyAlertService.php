<?php

namespace App\Services;

use App\Events\EmergencyAlertTriggered;
use App\Models\EmergencyAlert;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmergencyAlertService
{
    public function __construct(
        private SmsService $smsService,
        private GeocodingService $geocodingService,
    ) {
        //
    }

    public function triggerSos(User $rider, float $lat, float $lng): EmergencyAlert
    {
        // If rider already has a pending alert, update coords and re-broadcast the same record
        // instead of creating a new one — this keeps the admin map from getting duplicate pins
        // when crash detection fires multiple times for the same incident. Emergency contacts
        // are still notified on every trigger, with no throttling — an SOS must never go silent.
        $existing = EmergencyAlert::with('user')
            ->where('user_id', $rider->id)
            ->where('status', EmergencyAlert::STATUS_PENDING)
            ->latest()
            ->first();

        if ($existing) {
            $existing->update(['latitude' => $lat, 'longitude' => $lng]);
            broadcast(new EmergencyAlertTriggered($existing));
            $this->notifyEmergencyContacts($rider, $lat, $lng);
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
     * SkySMS rejects (422) any single message over 160 characters, which would
     * silently drop the alert — so name/address are capped and the final
     * message is hard-truncated as a safety net. Worst-case (max-length name
     * + address) measures 151 chars, leaving margin below the cap.
     */
    private const SMS_MAX_LENGTH = 160;
    private const NAME_MAX       = 30;
    private const ADDRESS_MAX    = 25;

    /**
     * Static dispatch numbers shown to emergency contacts alongside every SOS,
     * sent as a second SMS. Mirrors the list in the admin live-map's
     * EmergencyHotlinesPanel — kept in sync manually since it's Zamboanga
     * City government data, not something derived from application state.
     */
    private const HOTLINES_MESSAGE =
        'AVISO Emergency Hotlines: ZCDRRMO 995-9601, EOC 0966-731-6242, '
        . 'Rescue 0926-091-2492, EMS 926-1848, Fire 991-2267';

    /**
     * SMS every registered emergency contact of the rider. Called on every
     * SOS trigger, whether it creates a new alert or updates an existing
     * pending one — never throttled, an SOS must never go silent.
     *
     * Two messages per contact: the alert itself (with a Google Maps search
     * instruction — plain coordinates, not a link, since SkySMS blocks and
     * never delivers any message containing a URL/domain), then the static
     * emergency hotlines so contacts know exactly who else to call.
     */
    private function notifyEmergencyContacts(User $rider, float $lat, float $lng): void
    {
        $fullName = self::truncate(trim("{$rider->first_name} {$rider->last_name}"), self::NAME_MAX);
        $address  = $this->geocodingService->reverseGeocode($lat, $lng);
        $address  = $address ? self::truncate($address, self::ADDRESS_MAX) : null;

        $latStr = number_format($lat, 6, '.', '');
        $lngStr = number_format($lng, 6, '.', '');

        // Plain GPS coordinates, no URL — avoids SMS gateway link/content filters.
        $location = $address ? "near {$address} (GPS: {$latStr}, {$lngStr})" : "at GPS {$latStr}, {$lngStr}";
        $message  = self::truncate(
            "AVISO ALERT: {$fullName} triggered an SOS {$location}. Search the GPS in Google Maps.",
            self::SMS_MAX_LENGTH,
        );

        foreach ($rider->emergencyContacts as $contact) {
            $this->smsService->send($contact->contact_number, $message);
            $this->smsService->send($contact->contact_number, self::HOTLINES_MESSAGE);
        }
    }

    private static function truncate(string $text, int $max): string
    {
        return strlen($text) > $max ? substr($text, 0, $max - 3) . '...' : $text;
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
