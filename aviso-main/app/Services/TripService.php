<?php

namespace App\Services;

use App\Events\RiderLocationUpdated;
use App\Models\Trip;
use Illuminate\Database\Eloquent\Collection;

class TripService
{
    /**
     * Start a new trip for a rider.
     *
     * Creates an active trip record using the rider's current location as
     * both the start and current position. The current_lat/lng will be
     * updated continuously while the trip is in progress.
     */
    public function startTrip(array $data): Trip
    {
        $trip = Trip::create([
            'rider_code'  => $data['rider_code'],
            'start_lat'   => $data['latitude'],
            'start_lng'   => $data['longitude'],
            'current_lat' => $data['latitude'],
            'current_lng' => $data['longitude'],
            'status'      => Trip::STATUS_ACTIVE,
            'started_at'  => now(),
        ]);

        // Broadcast the rider's initial position so the admin map
        // shows the pin immediately when the rider starts their trip.
        broadcast(new RiderLocationUpdated($trip));

        return $trip;
    }

    /**
     * Update the rider's current live position.
     *
     * Called repeatedly by the rider's device while a trip is active.
     * Only updates the current coordinates, leaving start/end untouched.
     */
    public function updateLocation(Trip $trip, float $lat, float $lng): bool
    {
        $updated = $trip->update([
            'current_lat' => $lat,
            'current_lng' => $lng,
        ]);

        // Push the new position to all admin map clients via Reverb.
        // This fires every time the rider's device sends a location update.
        broadcast(new RiderLocationUpdated($trip->fresh()));

        return $updated;
    }

    /**
     * End a trip and record the final destination coordinates.
     *
     * Sets the end coordinates and marks the trip as ended with a timestamp.
     * The start and route history remain intact for reference.
     */
    public function endTrip(Trip $trip, float $lat, float $lng): bool
    {
        return $trip->update([
            'current_lat' => $lat,
            'current_lng' => $lng,
            'end_lat'     => $lat,
            'end_lng'     => $lng,
            'status'      => Trip::STATUS_ENDED,
            'ended_at'    => now(),
        ]);
    }

    /**
     * Get all currently active trips for the admin live map.
     *
     * Returns trips ordered by most recently started so the map
     * can display the freshest riders first.
     */
    public function getActiveTrips(): Collection
    {
        return Trip::active()
            ->orderBy('started_at', 'desc')
            ->get();
    }
}
