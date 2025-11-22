<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification
{
    use Queueable;

    public $task;
    public $assigner;

    public function __construct($task, $assigner)
    {
        $this->task = $task;
        $this->assigner = $assigner;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // Stores in DB (History) + available for polling (Live)
    }

    public function toDatabase(object $notifiable): array
    {
        // Ensure we get the board ID correctly
        $boardId = $this->task->board_id ?? $this->task->board->id;

        return [
            'message' => "{$this->assigner->name} assigned you the task '{$this->task->title}'.",
            'link' => route('tasks.index', ['board' => $boardId]),
            'icon' => 'ClipboardDocumentCheckIcon',
        ];
    }
}
