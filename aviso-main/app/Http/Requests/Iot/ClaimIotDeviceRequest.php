<?php

namespace App\Http\Requests\Iot;

use Illuminate\Foundation\Http\FormRequest;

class ClaimIotDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_uid' => ['required', 'string', 'max:32', 'regex:/^[A-Za-z0-9_-]+$/'],
            'pairing_code' => ['required', 'digits:6'],
            'firmware_version' => ['nullable', 'string', 'max:20'],
        ];
    }
}
