<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Note;
use App\Models\Notebook;
use App\Models\Tag;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index()
    {
        $user = auth()->user();

        // 1. Get stats for the "At a Glance" widget
        $stats = [
            'notes' => $user->notes()->count(),
            'notebooks' => $user->notebooks()->count(),
            'tags' => $user->tags()->count(),
        ];

        // 2. Get the 5 most recently updated notes
        $recentNotes = $user->notes()
            ->latest('updated_at')
            ->take(5)
            ->get(['id', 'title', 'updated_at']);

        // 3. Get up to 5 pinned notes
        $pinnedNotes = $user->notes()
            ->where('is_pinned', true)
            ->latest('updated_at')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentNotes' => $recentNotes,
            'pinnedNotes' => $pinnedNotes,
        ]);
    }
}
