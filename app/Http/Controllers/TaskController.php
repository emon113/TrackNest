<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Board;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect; // <-- Make sure this is imported

class TaskController extends Controller
{
    /**
     * Display the Kanban board for a *specific* board.
     */
    public function index(Board $board)
    {
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        // --- THIS IS THE FIX ---
        // The ->with('assignees') line is now GONE.
        $tasks = $board->tasks()
            ->orderBy('order', 'asc')
            ->get();

        return Inertia::render('Tasks/Index', [
            'board' => $board,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Store a new task *on a specific board*.
     */
    public function store(Request $request, Board $board)
    {
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string|in:todo,doing,done',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'assigned_by' => 'nullable|string|max:255'
        ]);

        $maxOrder = $board->tasks()
            ->where('status', $request->status)
            ->max('order');

        $board->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'deadline' => $request->deadline,
            'assigned_by' => $request->assigned_by,
            'order' => $maxOrder + 1,
            'user_id' => auth()->id()
        ]);

        return Redirect::back()->with('success', 'Task created.');
    }

    /**
     * Update the task's content.
     */
    public function update(Request $request, Task $task)
    {
        if ($task->board->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'assigned_by' => 'nullable|string|max:255'
        ]);

        $task->update($request->only('title', 'description', 'deadline', 'assigned_by'));

        return Redirect::back()->with('success', 'Task updated.');
    }

    /**
     * Handle the drag-and-drop action.
     */
    public function move(Request $request, Task $task)
    {
        $board = $task->board;
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|string|in:todo,doing,done',
            'order' => 'required|integer|min:0',
        ]);

        $oldStatus = $task->status;
        $oldOrder = $task->order;
        $newStatus = $request->status;
        $newOrder = $request->order;

        DB::transaction(function () use ($task, $board, $oldStatus, $oldOrder, $newStatus, $newOrder) {

            $query = $board->tasks();

            if ($oldStatus === $newStatus) {
                if ($newOrder < $oldOrder) {
                    $query->where('status', $oldStatus)
                        ->whereBetween('order', [$newOrder, $oldOrder - 1])
                        ->increment('order');
                } else {
                    $query->where('status', $oldStatus)
                        ->whereBetween('order', [$oldOrder + 1, $newOrder])
                        ->decrement('order');
                }
            } else {
                // Moved to a different column
                $board->tasks()->where('status', $oldStatus)
                    ->where('order', '>', $oldOrder)
                    ->decrement('order');

                $board->tasks()->where('status', $newStatus)
                    ->where('order', '>=', $newOrder)
                    ->increment('order');
            }

            $task->update([
                'status' => $newStatus,
                'order' => $newOrder,
            ]);
        });

        // This is the correct response for Inertia D&D
        return Redirect::back();
    }

    /**
     * Delete a task.
     */
    public function destroy(Task $task)
    {
        $board = $task->board;
        if ($board->user_id !== auth()->id()) {
            abort(403);
        }

        $task->delete();

        $board->tasks()
            ->where('status', $task->status)
            ->where('order', '>', $task->order)
            ->decrement('order');

        return Redirect::back()->with('success', 'Task deleted.');
    }
}
