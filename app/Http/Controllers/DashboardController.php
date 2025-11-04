<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Note;
use App\Models\Task; // <-- 1. Import Task

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index()
    {
        $user = auth()->user();

        // 2. Get stats (UPDATED)
        $stats = [
            'notes' => $user->notes()->count(),
            'notebooks' => $user->notebooks()->count(),
            'boards' => $user->boards()->count(), // <-- NEW
            'tasks' => $user->tasks()->where('status', '!=', 'done')->count(), // <-- NEW (Only pending)
        ];

        // 3. Get pinned notes (Unchanged)
        $pinnedNotes = $user->notes()
            ->where('is_pinned', true)
            ->latest('updated_at')
            ->take(5)
            ->get();

        // 4. Get upcoming deadlines (NEW)
        $upcomingDeadlines = $user->tasks()
            ->with('board:id,name') // Optimize query
            ->where('status', '!=', 'done')
            ->where('deadline', '>=', now())
            ->orderBy('deadline', 'asc')
            ->take(5)
            ->get();

        // 5. Get "To-Do" tasks (NEW)
        $myTodos = $user->tasks()
            ->with('board:id,name') // Optimize query
            ->where('status', 'todo')
            ->orderBy('order', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'pinnedNotes' => $pinnedNotes,
            'upcomingDeadlines' => $upcomingDeadlines, // <-- Pass new data
            'myTodos' => $myTodos,                   // <-- Pass new data
        ]);
    }
}
