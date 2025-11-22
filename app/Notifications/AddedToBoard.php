<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AddedToBoard extends Notification
{
    use Queueable;

    public $board;
    public $adder;

    public function __construct($board, $adder)
    {
        $this->board = $board;
        $this->adder = $adder;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => "{$this->adder->name} added you to the board '{$this->board->name}'.",
            'link' => route('tasks.index', ['board' => $this->board->id]),
            'icon' => 'ViewColumnsIcon',
        ];
    }
}
