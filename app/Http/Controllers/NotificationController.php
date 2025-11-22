<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display the notification history.
     */
    public function index()
    {
        // Fetch all notifications (read and unread), paginated
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }
}
