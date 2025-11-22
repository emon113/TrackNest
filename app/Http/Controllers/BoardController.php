<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use App\Notifications\AddedToBoard;

class BoardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $myBoards = $user->boards()->withCount('tasks')->latest()->get();
        $sharedBoards = $user->sharedBoards()->withCount('tasks')->latest()->get();

        return Inertia::render('Boards/Index', [
            'boards' => $myBoards->merge($sharedBoards),
            'myContacts' => $user->accepted_contacts,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'collaborators' => 'nullable|array',
            'collaborators.*' => 'exists:users,id',
        ]);

        DB::transaction(function () use ($request) {
            $board = auth()->user()->boards()->create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            $board->columns()->createMany([
                ['name' => 'To Do', 'order' => 0],
                ['name' => 'Doing', 'order' => 1],
                ['name' => 'Done', 'order' => 2],
            ]);

            if ($request->has('collaborators')) {
                $board->collaborators()->sync($request->collaborators);

                $users = User::whereIn('id', $request->collaborators)->get();
                foreach($users as $user) {
                    $user->notify(new AddedToBoard($board, auth()->user()));
                    // --- LOG: Added Collaborator ---
                    activity()
                        ->performedOn($board)
                        ->log("You added {$user->name} to board '{$board->name}'");
                }
            }
        });

        return Redirect::back()->with('success', 'Board created.');
    }

    public function edit(Board $board)
    {
        if ($board->user_id !== auth()->id()) abort(403);
        $board->load('collaborators');

        return Inertia::render('Boards/Edit', [
            'board' => $board,
            'myContacts' => auth()->user()->accepted_contacts,
        ]);
    }

    public function update(Request $request, Board $board)
    {
        if ($board->user_id !== auth()->id()) abort(403);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'collaborators' => 'nullable|array',
            'collaborators.*' => 'exists:users,id',
        ]);

        $board->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        if ($request->has('collaborators')) {
            $originalIds = $board->collaborators->pluck('id')->toArray();
            $newIds = $request->collaborators;

            $board->collaborators()->sync($newIds);

            // Log additions
            $addedIds = array_diff($newIds, $originalIds);
            if (!empty($addedIds)) {
                $addedUsers = User::whereIn('id', $addedIds)->get();
                foreach($addedUsers as $user) {
                    $user->notify(new AddedToBoard($board, auth()->user()));
                    activity()->performedOn($board)->log("You added {$user->name} to board '{$board->name}'");
                }
            }

            // Log removals
            $removedIds = array_diff($originalIds, $newIds);
            if (!empty($removedIds)) {
                $removedUsers = User::whereIn('id', $removedIds)->get();
                foreach($removedUsers as $user) {
                    activity()->performedOn($board)->log("You removed {$user->name} from board '{$board->name}'");
                }
            }

        } else {
            $board->collaborators()->detach();
        }

        return Redirect::route('boards.index')->with('success', 'Board updated.');
    }

    public function destroy(Board $board)
    {
        if ($board->user_id !== auth()->id()) abort(403);
        $board->delete();
        return Redirect::route('boards.index')->with('success', 'Board deleted.');
    }
}
