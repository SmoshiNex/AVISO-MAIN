<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmergencyContact;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmergencyContactController extends Controller
{
    /**
     * Display a listing of the user's emergency contacts.
     */
    public function index(User $user): JsonResponse
    {
        return response()->json([
            'success' => true,
            'contacts' => $user->emergencyContacts()->orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Store a newly created emergency contact in storage.
     */
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'relationship'   => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
        ]);

        $contact = $user->emergencyContacts()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Emergency contact added successfully.',
            'contact' => $contact
        ], 201);
    }

    /**
     * Remove the specified emergency contact from storage.
     */
    public function destroy(EmergencyContact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Emergency contact deleted successfully.'
        ]);
    }
}
