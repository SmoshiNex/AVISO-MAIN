<?php

namespace App\Http\Requests\Iot;

use Illuminate\Foundation\Http\FormRequest;

class IotHeartbeatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'local_ip' => ['required', 'ip'],
            'rssi' => ['nullable', 'integer', 'between:-127,0'],
            'uptime_seconds' => ['nullable', 'integer', 'min:0'],
            'firmware_version' => ['nullable', 'string', 'max:20'],
            'reset_reason' => ['nullable', 'string', 'max:30'],
        ];
    }
}
