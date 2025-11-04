<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity; // <-- Import the Activity model

class ActivityLogController extends Controller
{
    public function index()
    {
        // Get all activities caused by the logged-in user
        $activities = Activity::where('causer_id', auth()->id())
            ->with('subject') // Get the model (Note/Task) that was changed
            ->latest() // Show newest first
            ->paginate(30); // Paginate for performance

        return Inertia::render('Activity/Index', [
            'activities' => $activities
        ]);
    }
}
