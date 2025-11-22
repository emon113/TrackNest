<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Task extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title', 'description', 'status', 'order', 'deadline',
        'user_id', 'assigned_by_id', 'assigned_to_id', 'board_id', 'column_id'
    ];

    protected $casts = [
        'deadline' => 'datetime',
    ];

    // --- THIS IS THE CHANGE ---
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable() // <--- Log ALL fillable fields
            ->logOnlyDirty() // Only log what actually changed
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Task '{$this->title}' was {$eventName}");
    }

    public function user() { return $this->belongsTo(User::class); }
    public function board() { return $this->belongsTo(Board::class); }
    public function column() { return $this->belongsTo(Column::class); }
    public function assignedTo() { return $this->belongsTo(User::class, 'assigned_to_id'); }
    public function assignedBy() { return $this->belongsTo(User::class, 'assigned_by_id'); }
}
