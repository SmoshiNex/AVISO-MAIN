<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use App\Services\TripService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TripController extends Controller
{
    protected $tripService;

    public function __construct(TripService $tripService)
    {
        $this->tripService = $tripService;
    }

    /**
     * Start a new trip — called when the rider turns on their location.
     *
     * Records the rider's starting coordinates and creates an active trip.
     * The admin map will immediately pick this up on the next poll.
     */
    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rider_code' => ['required', 'string', 'max:30'],
            'latitude'   => ['required', 'numeric', 'between:-90,90'],
            'longitude'  => ['required', 'numeric', 'between:-180,180'],
        ]);

        $trip = $this->tripService->startTrip($validated);

        return response()->json([
            'success' => true,
            'message' => 'Trip started successfully.',
            'data'    => $trip,
        ], 201);
    }

    /**
     * Update the rider's live location — called continuously while riding.
     *
     * Only active trips can be updated. The admin map reads current_lat/lng
     * to display the rider's moving pin.
     */
    public function updateLocation(Request $request, Trip $trip): JsonResponse
    {
        if ($trip->status !== Trip::STATUS_ACTIVE) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update location of a trip that has already ended.',
            ], 422);
        }

        $validated = $request->validate([
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $this->tripService->updateLocation(
            $trip,
            (float) $validated['latitude'],
            (float) $validated['longitude'],
        );

        return response()->json([
            'success' => true,
            'message' => 'Location updated.',
        ]);
    }

    /**
     * End a trip — called when the rider reaches their destination.
     *
     * Saves the final coordinates and marks the trip as ended.
     * The admin map will stop showing this rider on the next poll.
     */
    public function end(Request $request, Trip $trip): JsonResponse
    {
        if ($trip->status !== Trip::STATUS_ACTIVE) {
            return response()->json([
                'success' => false,
                'message' => 'This trip has already ended.',
            ], 422);
        }

        $validated = $request->validate([
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $this->tripService->endTrip(
            $trip,
            (float) $validated['latitude'],
            (float) $validated['longitude'],
        );

        return response()->json([
            'success' => true,
            'message' => 'Trip ended successfully.',
            'data'    => $trip->fresh(),
        ]);
    }
}
