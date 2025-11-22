<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ContactRequestReceived extends Notification
{
    use Queueable;

    public $sender;

    public function __construct($sender)
    {
        $this->sender = $sender;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // Store in DB
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => "{$this->sender->name} sent you a contact request.",
            'link' => route('contacts.index'),
            'icon' => 'UserPlusIcon',
        ];
    }
}
