<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rider\RiderEventFilterRequest;
use App\Http\Requests\Rider\StoreRiderEventRequest;
use App\Services\RiderEventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The rider's own crash-detection log (events classified by their IoT unit).
 */
class RiderEventController extends Controller
{
    public function __construct(private RiderEventService $riderEventService)
    {
        //
    }

    public function index(RiderEventFilterRequest $request): JsonResponse
    {
        return response()->json($this->riderEventService->paginate($request->validated(), Auth::user()));
    }

    public function stats(RiderEventFilterRequest $request): JsonResponse
    {
        return response()->json(['stats' => $this->riderEventService->statsByType($request->validated(), Auth::user())]);
    }

    public function export(RiderEventFilterRequest $request): StreamedResponse
    {
        return $this->riderEventService->csvResponse($request->validated(), Auth::user());
    }

    public function store(StoreRiderEventRequest $request): JsonResponse
    {
        $event = $this->riderEventService->record(Auth::user(), $request->validated());

        return response()->json(['id' => $event->id], 201);
    }
}
