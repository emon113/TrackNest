<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Note;
use App\Models\Task;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index()
    {
        $user = auth()->user();

        // 1. Get stats
        // We filter tasks by checking if their related column name is NOT 'Done'
        $openTasksCount = $user->tasks()->whereHas('column', function ($query) {
            $query->where('name', '!=', 'Done');
        })->count();

        $stats = [
            'notes' => $user->notes()->count(),
            'notebooks' => $user->notebooks()->count(),
            'boards' => $user->boards()->count(),
            'tasks' => $openTasksCount,
        ];

        // 2. Get pinned notes
        $pinnedNotes = $user->notes()
            ->where('is_pinned', true)
            ->latest('updated_at')
            ->take(5)
            ->get();

        // 3. Get upcoming deadlines (Filter by Column Name != 'Done')
        $upcomingDeadlines = $user->tasks()
            ->with(['board:id,name', 'column:id,name']) // Eager load board and column
            ->whereHas('column', function ($query) {
                $query->where('name', '!=', 'Done');
            })
            ->whereNotNull('deadline')
            ->where('deadline', '>=', now())
            ->orderBy('deadline', 'asc')
            ->take(5)
            ->get();

        // 4. Get "To-Do" tasks (Filter by Column Name == 'To Do')
        $myTodos = $user->tasks()
            ->with(['board:id,name', 'column:id,name'])
            ->whereHas('column', function ($query) {
                $query->where('name', 'To Do');
            })
            ->orderBy('order', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'pinnedNotes' => $pinnedNotes,
            'upcomingDeadlines' => $upcomingDeadlines,
            'myTodos' => $myTodos,
        ]);
    }
}
