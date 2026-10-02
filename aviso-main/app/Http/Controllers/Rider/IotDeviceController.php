<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Services\IotDeviceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * The rider's view of their IoT unit: where it is on the hotspot, whether it
 * is online, and pairing.
 */
class IotDeviceController extends Controller
{
    public function __construct(private IotDeviceService $iotDeviceService)
    {
        //
    }

    public function show(): JsonResponse
    {
        return response()->json(['device' => $this->iotDeviceService->deviceForRider(Auth::user())]);
    }

    public function pairingCode(): JsonResponse
    {
        return response()->json($this->iotDeviceService->createPairingCode(Auth::user()), 201);
    }

    public function destroy(): JsonResponse
    {
        $this->iotDeviceService->unpair(Auth::user());

        return response()->json(['ok' => true]);
    }
}
