<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a paginated listing of users.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'sort']);

        $paginated = $this->userService->getPaginatedUsers($filters);
        $stats = $this->userService->getUserStats($filters);

        return Inertia::render('main/Users', [
            'users'   => $paginated,
            'stats'   => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'username'       => 'required|string|max:255|unique:users',
            'email'          => 'required|string|email|max:255|unique:users',
            'contact_number' => 'nullable|string|max:20',
            'address'        => 'nullable|string|max:1000',
            'role'           => ['required', Rule::in(['admin', 'rider'])],
            'password'       => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase(), 'confirmed'],
        ]);

        $this->userService->createUser($validated);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'username'       => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email'          => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'contact_number' => 'nullable|string|max:20',
            'address'        => 'nullable|string|max:1000',
            'role'           => ['required', Rule::in(['admin', 'rider'])],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase(), 'confirmed'];
        }

        $validated = $request->validate($rules);

        $this->userService->updateUser($user, $validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting the currently authenticated user
        if (auth()->id() === $user->id) {
            return redirect()->route('users.index')->with('error', 'You cannot delete your own account.');
        }

        $this->userService->deleteUser($user);

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
