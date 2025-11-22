<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskMoved extends Notification
{
    use Queueable;

    public $task;
    public $column;
    public $mover;

    /**
     * Create a new notification instance.
     */
    public function __construct($task, $column, $mover)
    {
        $this->task = $task;
        $this->column = $column; // The new column it was moved to
        $this->mover = $mover;   // The user who moved it
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            // Message: "John moved 'Fix Bug' to Done"
            'message' => "{$this->mover->name} moved '{$this->task->title}' to {$this->column->name}.",
            // Link to the specific board
            'link' => route('tasks.index', ['board' => $this->task->board_id]),
            // Icon for the frontend dropdown
            'icon' => 'ArrowPathIcon',
        ];
    }
}
