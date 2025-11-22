<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Board;
use App\Models\User;
use App\Models\Column;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskMoved;

class TaskController extends Controller
{
    public function index(Board $board)
    {
        $user = auth()->user();
        if ($board->user_id !== $user->id && !$board->collaborators->contains($user->id)) {
            abort(403);
        }
        $board->load(['columns.tasks.assignedTo', 'columns.tasks.assignedBy']);
        $allMembers = $board->collaborators->push($board->user);
        return Inertia::render('Tasks/Index', [
            'board' => $board,
            'columns' => $board->columns,
            'members' => $allMembers,
        ]);
    }

    public function store(Request $request, Board $board)
    {
        $user = auth()->user();
        if ($board->user_id !== $user->id && !$board->collaborators->contains($user->id)) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'column_id' => ['required', Rule::exists('columns', 'id')->where('board_id', $board->id)],
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'assigned_to_id' => 'nullable|exists:users,id',
        ]);

        $maxOrder = Task::where('column_id', $request->column_id)->max('order');

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'column_id' => $request->column_id,
            'board_id' => $board->id,
            'deadline' => $request->deadline,
            'user_id' => auth()->id(),
            'assigned_to_id' => $request->assigned_to_id,
            'assigned_by_id' => $request->assigned_to_id ? auth()->id() : null,
            'order' => $maxOrder + 1,
        ]);

        $task->refresh();

        if ($request->assigned_to_id && $request->assigned_to_id !== auth()->id()) {
            $assignee = User::find($request->assigned_to_id);
            $assignee->notify(new TaskAssigned($task, auth()->user()));

            activity()
                ->performedOn($task)
                ->log("You assigned task '{$task->title}' to {$assignee->name}");
        }

        return Redirect::back()->with('success', 'Task created.');
    }

    public function update(Request $request, Task $task)
    {
        $board = $task->board;

        // Handle orphan tasks safely
        if ($board) {
            $user = auth()->user();
            if ($board->user_id !== $user->id && !$board->collaborators->contains($user->id)) {
                abort(403);
            }
        } else {
            if ($task->user_id !== auth()->id()) abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'assigned_to_id' => 'nullable|exists:users,id',
        ]);

        $oldAssigneeId = $task->assigned_to_id;

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'assigned_to_id' => $request->assigned_to_id,
            'assigned_by_id' => ($request->assigned_to_id && $request->assigned_to_id != $oldAssigneeId)
                                ? auth()->id()
                                : $task->assigned_by_id,
        ]);

        $task->refresh();

        if ($request->assigned_to_id && $request->assigned_to_id != $oldAssigneeId && $request->assigned_to_id !== auth()->id()) {
            $assignee = User::find($request->assigned_to_id);
            $assignee->notify(new TaskAssigned($task, auth()->user()));

            activity()
                ->performedOn($task)
                ->log("You assigned task '{$task->title}' to {$assignee->name}");
        }

        return Redirect::back()->with('success', 'Task updated.');
    }

    public function move(Request $request, Task $task)
    {
        if (!$task->board) return Redirect::back();
        $board = $task->board;
        $user = auth()->user();

        if ($board->user_id !== $user->id && !$board->collaborators->contains($user->id)) {
            abort(403);
        }

        $request->validate([
            'column_id' => ['required', Rule::exists('columns', 'id')->where('board_id', $board->id)],
            'order' => 'required|integer|min:0',
        ]);

        $oldColumnId = $task->column_id;
        $newColumnId = $request->column_id;
        $oldOrder = $task->order;
        $newOrder = $request->order;

        // --- FIX: Removed Task::withoutLogs() wrapper to prevent crash ---
        DB::transaction(function () use ($task, $oldColumnId, $newColumnId, $oldOrder, $newOrder) {
            if ($oldColumnId == $newColumnId) {
                if ($newOrder < $oldOrder) {
                    Task::where('column_id', $oldColumnId)->whereBetween('order', [$newOrder, $oldOrder - 1])->increment('order');
                } else {
                    Task::where('column_id', $oldColumnId)->whereBetween('order', [$oldOrder + 1, $newOrder])->decrement('order');
                }
            } else {
                Task::where('column_id', $oldColumnId)->where('order', '>', $oldOrder)->decrement('order');
                Task::where('column_id', $newColumnId)->where('order', '>=', $newOrder)->increment('order');
            }
            $task->update(['column_id' => $newColumnId, 'order' => $newOrder]);
        });
        // --- END FIX ---

        if ($oldColumnId != $newColumnId) {
            $newColumn = Column::find($newColumnId);
            $oldColumn = Column::find($oldColumnId);

            activity()
                ->performedOn($task)
                ->log("You moved task '{$task->title}' from {$oldColumn->name} to {$newColumn->name}");

            $usersToNotify = $board->collaborators->push($board->user);
            $usersToNotify = $usersToNotify->reject(fn($u) => $u->id === $user->id);

            if($usersToNotify->count() > 0) {
                Notification::send($usersToNotify, new TaskMoved($task, $newColumn, $user));
            }
        }

        return Redirect::back();
    }

    public function destroy(Task $task)
    {
        $user = auth()->user();
        $board = $task->board;

        if ($board) {
            if ($board->user_id !== $user->id && !$board->collaborators->contains($user->id)) abort(403);
        } else {
            if ($task->user_id !== $user->id) abort(403);
        }

        $title = $task->title;
        $task->delete();

        if ($task->column_id) {
            Task::where('column_id', $task->column_id)->where('order', '>', $task->order)->decrement('order');
        }

        return Redirect::back()->with('success', 'Task deleted.');
    }
}
