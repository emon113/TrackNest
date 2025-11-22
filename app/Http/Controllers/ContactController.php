<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    /**
     * Display the contacts page.
     */
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Contacts/Index', [
            'myContacts' => $user->acceptedContacts,
            'pendingSent' => $user->pendingContacts,
            'pendingReceived' => $user->pendingContactRequests,
        ]);
    }

    /**
     * Search for users by their @username.
     */
    public function search(Request $request)
    {
        $request->validate(['search' => 'required|string|max:100']);

        $user = Auth::user();
        $search = $request->input('search');

        $myContactIds = $user->acceptedContacts->pluck('id')
            ->merge($user->pendingContacts->pluck('id'))
            ->merge($user->pendingContactRequests->pluck('id'))
            ->push($user->id)
            ->unique();

        $users = User::searchByUsername($search)
            ->whereNotIn('id', $myContactIds)
            ->take(10)
            ->get(['id', 'name', 'username']);

        return response()->json($users);
    }

    /**
     * Send a new contact request.
     */
    public function sendRequest(Request $request, User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return Redirect::back()->with('error', 'You cannot add yourself as a contact.');
        }

        DB::transaction(function () use ($currentUser, $user) {
            $existing = $currentUser->contacts()->where('contact_id', $user->id)->first();
            $reverse = $user->contacts()->where('contact_id', $currentUser->id)->first();

            if ($existing || $reverse) {
                return; // A request already exists, do nothing
            }

            $currentUser->contacts()->attach($user->id, ['status' => 'pending']);

            // --- 1. LOG ACTIVITY FOR SENDER ---
            // 'performedOn' is the user receiving the request
            // 'causedBy' is automatic (the logged-in user)
            activity()
                ->performedOn($user)
                ->log("You sent a contact request to {$user->username}");

            // --- 2. LOG ACTIVITY FOR RECIPIENT ---
            // 'causedBy' is the recipient (so it appears in *their* feed)
            // 'performedOn' is the user who sent the request
            activity()
                ->causedBy($user)
                ->performedOn($currentUser)
                ->log("You received a contact request from {$currentUser->username}");
        });

        return Redirect::back()->with('success', 'Contact request sent.');
    }

    /**
     * Accept a pending contact request.
     */
    public function acceptRequest(Request $request, User $user)
    {
        $currentUser = Auth::user();

        $request = $currentUser->contactOf()
            ->where('user_id', $user->id)
            ->wherePivot('status', 'pending')
            ->first();

        if (!$request) {
            return Redirect::back()->with('error', 'No pending request found.');
        }

        $request->pivot->status = 'accepted';
        $request->pivot->save();

        // --- 3. LOG ACTIVITY FOR ACCEPTER ---
        activity()
            ->performedOn($user)
            ->log("You are now contacts with {$user->username}");

        // --- 4. LOG ACTIVITY FOR SENDER ---
        activity()
            ->causedBy($user)
            ->performedOn($currentUser)
            ->log("{$currentUser->username} accepted your contact request");

        return Redirect::back()->with('success', 'Contact request accepted.');
    }

    /**
     * Remove a contact (or decline a request).
     */
    public function removeContact(Request $request, User $user)
    {
        $currentUser = Auth::user();

        $contact = $currentUser->contacts()->where('contact_id', $user->id)->first();
        $contactOf = $currentUser->contactOf()->where('user_id', $user->id)->first();

        if ($contact) {
            $currentUser->contacts()->detach($user->id);
        } elseif ($contactOf) {
            $currentUser->contactOf()->detach($user->id);
        } else {
            return Redirect::back()->with('error', 'Contact not found.');
        }

        // --- 5. We *could* log this, but it might be noisy.
        // We'll leave it out for now to keep the log clean.

        return Redirect::back()->with('success', 'Contact removed.');
    }
}
