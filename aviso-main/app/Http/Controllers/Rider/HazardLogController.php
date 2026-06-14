<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Models\HazardLog;
use App\Services\HazardLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HazardLogController extends Controller
{
    protected $hazardLogService;

    public function __construct(HazardLogService $hazardLogService)
    {
        $this->hazardLogService = $hazardLogService;
    }

    /**
     * Store a new hazard detection sent by the rider's edge device.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'        => ['required', Rule::in(HazardLog::TYPES)],
            'latitude'    => ['required', 'numeric', 'between:-90,90'],
            'longitude'   => ['required', 'numeric', 'between:-180,180'],
            'confidence'  => ['required', 'numeric', 'between:0,100'],
            'distance'    => ['required', 'numeric', 'min:0'],
            'rider_code'  => ['required', 'string', 'max:30'],
            'detected_at' => ['nullable', 'date'],
        ]);

        $log = $this->hazardLogService->processIncomingHazard($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hazard log created successfully.',
            'data'    => $log,
        ], 201);
    }
}
