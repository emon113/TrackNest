<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ChatController extends Controller
{
    public function index(Request $request, Conversation $conversation = null)
    {
        $user = auth()->user();

        // 1. If viewing a specific conversation, mark it as read immediately
        if ($conversation) {
            if (!$conversation->users->contains($user->id)) {
                abort(403);
            }

            // Update the pivot table 'last_read_at' to NOW
            $user->conversations()->updateExistingPivot($conversation->id, [
                'last_read_at' => now(),
            ]);
        }

        // 2. Get all conversations
        $conversations = $user->conversations()
            ->with(['users', 'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->get()
            ->map(function ($convo) use ($user) {
                $otherUser = $convo->users->where('id', '!=', $user->id)->first();
                $lastMsg = $convo->messages->first();

                // Check if unread
                $isUnread = false;
                if ($lastMsg && $lastMsg->user_id !== $user->id) {
                    $lastRead = $convo->pivot->last_read_at;
                    if (!$lastRead || $lastMsg->created_at->gt($lastRead)) {
                        $isUnread = true;
                    }
                }

                return [
                    'id' => $convo->id,
                    'avatar' => $otherUser ? $otherUser->avatar : null,
                    'name' => $otherUser ? $otherUser->name : 'Unknown User',
                    'last_message' => $lastMsg ? $lastMsg->body : 'No messages yet',
                    'last_message_date' => $lastMsg ? $lastMsg->created_at : $convo->created_at,
                    'is_unread' => $isUnread, // <-- Pass this to frontend
                ];
            })
            ->sortByDesc('last_message_date')
            ->values();

        // 3. Load active conversation details
        $activeConversation = null;
        $messages = [];

        if ($conversation) {
            $otherUser = $conversation->users->where('id', '!=', $user->id)->first();
            $activeConversation = [
                'id' => $conversation->id,
                'name' => $otherUser ? $otherUser->name : 'Unknown',
                'avatar' => $otherUser ? $otherUser->avatar : null,
                'user_id' => $otherUser ? $otherUser->id : null,
            ];

            $messages = $conversation->messages()
                ->with('sender:id,name,avatar,username')
                ->orderBy('created_at', 'asc')
                ->get();
        }

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, Conversation $conversation)
    {
        if (!$conversation->users->contains(auth()->id())) {
            abort(403);
        }

        $request->validate(['body' => 'required|string']);

        $message = $conversation->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        // Update sender's read time too, so it doesn't show as unread for them
        auth()->user()->conversations()->updateExistingPivot($conversation->id, [
            'last_read_at' => now(),
        ]);

        $message->load('sender');
        broadcast(new MessageSent($message))->toOthers();

        return Redirect::back();
    }

    public function start(User $user)
    {
        $currentUser = auth()->user();
        if ($currentUser->id === $user->id) return Redirect::back();

        $conversation = Conversation::whereHas('users', function ($query) use ($currentUser) {
            $query->where('user_id', $currentUser->id);
        })->whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create(['type' => 'private']);
            $conversation->users()->attach([$currentUser->id, $user->id]);
        }

        return Redirect::route('chat.show', $conversation->id);
    }
}
