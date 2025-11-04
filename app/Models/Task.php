<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity; // <-- 1. Import
use Spatie\Activitylog\LogOptions;            // <-- 2. Import

class Task extends Model
{
    use HasFactory, LogsActivity; // <-- 3. Use

    protected $fillable = [
        'title',
        'description',
        'status',
        'order',
        'deadline',
        'user_id',
        'assigned_by',
        'board_id'
    ];

    protected $casts = [
        'deadline' => 'datetime',
    ];

    // --- 4. Add this function ---
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'status', 'deadline']) // Log these fields
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "You {$eventName} the task '{$this->title}'");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }
}
