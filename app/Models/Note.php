<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Note extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['title', 'content', 'is_pinned', 'notebook_id'];

    protected $casts = [
        'is_pinned' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable() // <--- Log ALL fillable fields
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Note '{$this->title}' was {$eventName}");
    }

    public function user() { return $this->belongsTo(User::class); }
    public function notebook() { return $this->belongsTo(Notebook::class); }
    public function tags() { return $this->belongsToMany(Tag::class, 'note_tag'); }
}
