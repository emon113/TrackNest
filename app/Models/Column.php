<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Column extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['name', 'order', 'board_id'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name'])
            ->setDescriptionForEvent(fn(string $eventName) => "Column '{$this->name}' was {$eventName}");
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class)->orderBy('order');
    }
}
