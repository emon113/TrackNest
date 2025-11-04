<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     * This will be our new "Tasks" landing page.
     */
    public function index()
    {
        $boards = auth()->user()->boards()
            ->withCount('tasks')
            ->latest()
            ->get();

        return Inertia::render('Boards/Index', [
            'boards' => $boards
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('boards')->where('user_id', auth()->id()),
            ],
            'description' => 'nullable|string',
        ]);

        auth()->user()->boards()->create($validated);

        return Redirect::back()->with('success', 'Board created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Boards/Edit', [
            'board' => $board
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board)
    {
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('boards')->where('user_id', auth()->id())->ignore($board->id),
            ],
            'description' => 'nullable|string',
        ]);

        $board->update($validated);

        return Redirect::route('boards.index')->with('success', 'Board updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board)
    {
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        $board->delete();

        return Redirect::route('boards.index')->with('success', 'Board deleted.');
    }
}
