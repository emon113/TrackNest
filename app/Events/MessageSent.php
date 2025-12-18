<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // <--- IMPORTANT
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // <--- USE THIS FOR INSTANT CHAT
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Use ShouldBroadcastNow so it doesn't wait for a queue worker (faster for chat)
class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        // We broadcast to a private channel specifically for this conversation
        return [
            new PrivateChannel('chat.' . $this->message->conversation_id),
        ];
    }

    /**
     * Data to broadcast to the frontend.
     * We explicitly format it to ensure the avatar/name is available immediately.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'body' => $this->message->body, // Will be decrypted automatically
            'user_id' => $this->message->user_id,
            'created_at' => $this->message->created_at,
            'sender' => [
                'id' => $this->message->sender->id,
                'name' => $this->message->sender->name,
                'username' => $this->message->sender->username,
                'avatar' => $this->message->sender->avatar,
            ]
        ];
    }
}
