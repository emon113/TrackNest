<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use App\Notifications\ContactRequestReceived; // <-- IMPORT

class ContactController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Contacts/Index', [
            'myContacts' => $user->acceptedContacts,
            'pendingSent' => $user->pendingContacts,
            'pendingReceived' => $user->pendingContactRequests,
        ]);
    }

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

    public function sendRequest(Request $request, User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return Redirect::back()->with('error', 'You cannot add yourself as a contact.');
        }

        DB::transaction(function () use ($currentUser, $user) {
            $existing = $currentUser->contacts()->where('contact_id', $user->id)->first();
            $reverse = $user->contacts()->where('contact_id', $currentUser->id)->first();

            if ($existing || $reverse) return;

            $currentUser->contacts()->attach($user->id, ['status' => 'pending']);

            // --- NOTIFICATION TRIGGER ---
            $user->notify(new ContactRequestReceived($currentUser));

            activity()
                ->performedOn($user)
                ->log("You sent a contact request to {$user->username}");
        });

        return Redirect::back()->with('success', 'Contact request sent.');
    }

    public function acceptRequest(Request $request, User $user)
    {
        $currentUser = Auth::user();
        $req = $currentUser->contactOf()->where('user_id', $user->id)->wherePivot('status', 'pending')->first();

        if (!$req) return Redirect::back()->with('error', 'No pending request found.');

        $req->pivot->status = 'accepted';
        $req->pivot->save();

        activity()->performedOn($user)->log("You are now contacts with {$user->username}");

        return Redirect::back()->with('success', 'Contact request accepted.');
    }

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

        return Redirect::back()->with('success', 'Contact removed.');
    }
}
