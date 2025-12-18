<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// --- THIS IS THE CHAT CHANNEL ---
Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    // Check if the user is actually a participant in this conversation
    $conversation = Conversation::find($conversationId);

    if (!$conversation) return false;

    return $conversation->users->contains($user->id);
});
