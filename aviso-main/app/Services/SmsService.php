<?php

namespace App\Services;

use App\Models\EmergencyContact;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send an SMS via SMS API PH. Best-effort: never throws, so a gateway
     * failure can never break the caller (e.g. the rider's SOS response).
     */
    public function send(string $recipientRaw, string $message): bool
    {
        $recipient = EmergencyContact::normalizeToE164Ph($recipientRaw);

        if (!$recipient) {
            Log::warning('[SmsService] Skipped send — unrecognized phone format', ['raw' => $recipientRaw]);
            return false;
        }

        $apiKey = config('services.smsapiph.key');

        if (empty($apiKey)) {
            Log::warning('[SmsService] SMS_API_KEY not configured — skipping send.');
            return false;
        }

        try {
            $response = Http::withHeaders(['x-api-key' => $apiKey])
                ->timeout(10)
                ->post(config('services.smsapiph.url'), [
                    'recipient' => $recipient,
                    'message'   => $message,
                ]);

            if (!$response->successful()) {
                Log::error('[SmsService] Send failed', [
                    'recipient' => $recipient,
                    'status'    => $response->status(),
                    'body'      => $response->body(),
                ]);
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('[SmsService] Exception during send', [
                'recipient' => $recipient,
                'error'     => $e->getMessage(),
            ]);
            return false;
        }
    }
}
