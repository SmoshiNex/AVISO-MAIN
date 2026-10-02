<?php

namespace App\Http\Requests\Iot;

use Illuminate\Foundation\Http\FormRequest;

class IotCrashRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_uid' => ['required', 'string', 'max:64', 'regex:/^[A-Za-z0-9_-]+$/'],
            'peak_g' => ['required', 'numeric', 'between:0,100'],
            'vertical_g' => ['nullable', 'numeric', 'between:0,100'],
            'horizontal_g' => ['nullable', 'numeric', 'between:0,100'],
            'peak_gyro_dps' => ['nullable', 'numeric', 'between:0,5000'],
            'tilt_deg' => ['nullable', 'numeric', 'between:0,180'],
        ];
    }
}
