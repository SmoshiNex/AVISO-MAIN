<?php

namespace App\Http\Middleware;

use App\Services\IotDeviceService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Authenticates an AVISO IoT unit by its X-Device-Id / X-Device-Key headers
 * and exposes it to the controller as the `iotDevice` request attribute.
 */
class AuthenticateIotDevice
{
    public function __construct(private IotDeviceService $iotDeviceService)
    {
        //
    }

    public function handle(Request $request, Closure $next): Response
    {
        $deviceUid = (string) $request->header('X-Device-Id', '');
        $plainKey = (string) $request->header('X-Device-Key', '');

        $device = ($deviceUid !== '' && $plainKey !== '')
            ? $this->iotDeviceService->findByCredentials($deviceUid, $plainKey)
            : null;

        if (! $device) {
            return response()->json(['message' => 'Unknown or unpaired device.'], 401);
        }

        $request->attributes->set('iotDevice', $device);

        return $next($request);
    }
}
