<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Note;
use App\Models\Task;
use App\Models\Board;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        // 1. Basic Cards Stats
        $stats = [
            'total_users' => User::count(),
            'total_notes' => Note::count(),
            'total_tasks' => Task::count(),
            'active_today' => User::whereDate('updated_at', today())->count(),
        ];

        // 2. Chart Data: User Growth (Last 30 Days)
        $userGrowth = User::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => Carbon::parse($item->date)->format('M d'),
                'users' => $item->count
            ]);

        // 3. Chart Data: Content Distribution (Pie Chart)
        $contentDistribution = [
            ['name' => 'Notes', 'value' => Note::count(), 'color' => '#14b8a6'], // Teal
            ['name' => 'Tasks', 'value' => Task::count(), 'color' => '#8b5cf6'], // Violet
            ['name' => 'Boards', 'value' => Board::count(), 'color' => '#f59e0b'], // Amber
        ];

        // 4. Chart Data: Recent Activity Volume (Last 7 Days)
        // Using the activity_log table
        $activityVolume = DB::table('activity_log')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'day' => Carbon::parse($item->date)->format('D'), // Mon, Tue...
                'actions' => $item->count
            ]);

        // 5. User List
        $users = User::withCount(['notes', 'tasks'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'charts' => [
                'userGrowth' => $userGrowth,
                'contentDistribution' => $contentDistribution,
                'activityVolume' => $activityVolume,
            ],
            'users' => $users
        ]);
    }

    public function toggleBan(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot ban yourself.');
        }

        $user->is_banned = !$user->is_banned;
        $user->save();

        $status = $user->is_banned ? 'banned' : 'unbanned';
        return back()->with('success', "User has been {$status}.");
    }
}
