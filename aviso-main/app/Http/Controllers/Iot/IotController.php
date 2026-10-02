<?php

namespace App\Http\Controllers\Iot;

use App\Http\Controllers\Controller;
use App\Http\Requests\Iot\ClaimIotDeviceRequest;
use App\Http\Requests\Iot\IotCrashRequest;
use App\Http\Requests\Iot\IotHeartbeatRequest;
use App\Models\IotDevice;
use App\Services\IotDeviceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Endpoints called by the IoT unit itself, over the rider's phone hotspot.
 */
class IotController extends Controller
{
    public function __construct(private IotDeviceService $iotDeviceService)
    {
        //
    }

    public function claim(ClaimIotDeviceRequest $request): JsonResponse
    {
        $key = $this->iotDeviceService->claim(
            $request->validated('device_uid'),
            $request->validated('pairing_code'),
            $request->validated('firmware_version'),
        );

        if (! $key) {
            return response()->json(['message' => 'Invalid or expired pairing code.'], 422);
        }

        return response()->json(['device_key' => $key], 201);
    }

    public function heartbeat(IotHeartbeatRequest $request): JsonResponse
    {
        $this->iotDeviceService->recordHeartbeat($this->device($request), $request->validated());

        return response()->json(['ok' => true]);
    }

    public function crash(IotCrashRequest $request): JsonResponse
    {
        $alert = $this->iotDeviceService->reportCrash($this->device($request), $request->validated());

        if (! $alert) {
            return response()->json(['message' => 'No known rider location for this device.'], 409);
        }

        return response()->json(['alert_id' => $alert->id, 'status' => $alert->status], 201);
    }

    private function device(Request $request): IotDevice
    {
        return $request->attributes->get('iotDevice');
    }
}
