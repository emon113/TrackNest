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
            ->logFillable() // <--- Log ALL fields
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Board '{$this->name}' was {$eventName}");
    }

    public function user() { return $this->belongsTo(User::class); }
    public function columns() { return $this->hasMany(Column::class)->orderBy('order'); }
    public function collaborators() { return $this->belongsToMany(User::class, 'board_user'); }
    public function tasks() { return $this->hasManyThrough(Task::class, Column::class); }
}
