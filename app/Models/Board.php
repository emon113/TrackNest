<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Board extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['name', 'description', 'user_id'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'description'])
            ->setDescriptionForEvent(fn(string $eventName) => "You {$eventName} the board '{$this->name}'");
    }

    // The owner
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // The columns (dynamic status)
    public function columns()
    {
        return $this->hasMany(Column::class)->orderBy('order');
    }

    // The collaborators (people you shared with)
    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'board_user');
    }

    // Helper to get ALL tasks in the board through columns
    public function tasks()
    {
        return $this->hasManyThrough(Task::class, Column::class);
    }
}
