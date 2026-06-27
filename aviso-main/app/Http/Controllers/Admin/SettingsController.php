<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsProfileRequest;
use App\Services\SystemSettingService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(
        protected SystemSettingService $settingService,
        protected UserService $userService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('main/Settings', [
            'systemSettings' => $this->settingService->get(),
        ]);
    }

    public function updateProfile(UpdateSettingsProfileRequest $request): RedirectResponse
    {
        $this->userService->updateUser($request->user(), $request->validated());

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::min(8)->mixedCase()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password changed successfully.');
    }

    public function updateSystem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'confidence_threshold'     => 'required|integer|min:0|max:100',
            'items_per_page'           => 'required|integer|in:10,15,25,50',
            'default_sort'             => 'required|string|in:haz_code,type,area,confidence,distance,detected_at',
            'emergency_hazard_types'   => 'required|array|min:1',
            'emergency_hazard_types.*' => 'string|in:Pothole,Road Excavation,Road Barrier,Traffic Sign,Traffic Light Red,Traffic Light Orange,Traffic Light Green',
        ]);

        $this->settingService->update($validated);

        return back()->with('success', 'System settings saved.');
    }
}
