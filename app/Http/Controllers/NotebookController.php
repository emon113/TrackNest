<?php

namespace App\Http\Controllers;

use App\Models\Notebook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class NotebookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notebooks = auth()->user()->notebooks()->withCount('notes')->latest()->get();

        return Inertia::render('Notebooks/Index', [
            'notebooks' => $notebooks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                // Make sure the name is unique for this user
                Rule::unique('notebooks')->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                }),
            ],
        ]);

        auth()->user()->notebooks()->create($validated);

        return Redirect::back()->with('success', 'Notebook created.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Notebook $notebook)
    {
        // Check authorization
        if ($notebook->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('notebooks')->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                })->ignore($notebook->id),
            ],
        ]);

        $notebook->update($validated);

        return Redirect::back()->with('success', 'Notebook updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notebook $notebook)
    {
        // Check authorization
        if ($notebook->user_id !== auth()->id()) {
            abort(403);
        }

        $notebook->delete();

        return Redirect::back()->with('success', 'Notebook deleted.');
    }
}
