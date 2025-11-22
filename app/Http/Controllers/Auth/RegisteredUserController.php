<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // --- 1. THIS IS THE FIX ---
        // We "merge" a cleaned version of the username into the request
        // This removes the '@' before it hits the validation rules.
        $request->merge([
            'username' => ltrim($request->username, '@')
        ]);

        // --- 2. THE VALIDATION IS NOW CORRECT ---
        // It validates the *cleaned* username (e.g., 'mahbubEmon')
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'username' => [
                'required',
                'string',
                'alpha_dash', // Allows letters, numbers, dashes, underscores
                'min:6',
                'max:12',
                Rule::unique(User::class),
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username, // Saves the clean 'mahbubEmon'
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', [], false));
    }
}
