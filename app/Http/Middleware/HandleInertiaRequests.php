<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => function () use ($request) {
                $user = $request->user();

                // Calculate unread chat count
                // Logic: Count conversations where the latest message is newer than when I last read it
                $unreadChatCount = 0;
                if ($user) {
                    $unreadChatCount = $user->conversations()
                        ->whereHas('messages', function ($query) use ($user) {
                            $query->where('user_id', '!=', $user->id) // Message not sent by me
                                  ->latest()
                                  ->limit(1);
                        })
                        ->get()
                        ->filter(function ($convo) {
                            $lastMessage = $convo->messages()->latest()->first();
                            $lastRead = $convo->pivot->last_read_at;

                            if (!$lastMessage) return false; // No messages
                            if (!$lastRead) return true; // Never read

                            return $lastMessage->created_at->gt($lastRead);
                        })
                        ->count();
                }

                return [
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'username' => $user->username,
                        'avatar' => $user->avatar,
                        'role' => $user->role,
                    ] : null,
                    'notifications' => $user ? $user->unreadNotifications : [],
                    'unread_chat_count' => $unreadChatCount, // <-- ADD THIS
                ];
            },
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
