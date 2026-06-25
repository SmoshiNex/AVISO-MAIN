<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rider\UpdateProfileRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = Auth::user();
        $this->userService->updateUser($user, $request->validated());
        $user->refresh();

        return response()->json([
            'username'    => $user->username,
            'street'      => $user->street,
            'barangay_id' => $user->barangay_id,
            'city_id'     => $user->city_id,
            'province_id' => $user->province_id,
            'region_id'   => $user->region_id,
            'address'     => $user->address,
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user      = Auth::user();
        $extension = $request->file('avatar')->extension();

        $path = $request->file('avatar')->storeAs(
            'avatars', $user->id . '.' . $extension, 'public'
        );

        $user->update(['avatar_path' => $path]);

        return response()->json([
            'avatar_url' => url(Storage::disk('public')->url($path)),
        ]);
    }
}
