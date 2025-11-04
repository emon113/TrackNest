<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity; // <-- 1. Import Trait
use Spatie\Activitylog\LogOptions;            // <-- 2. Import LogOptions

class Note extends Model
{
    use HasFactory, LogsActivity; // <-- 3. Use Trait

    protected $fillable = ['title', 'content', 'is_pinned', 'notebook_id'];

    protected $casts = [
        'is_pinned' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // --- 4. Add this function to configure logging ---
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'content']) // Only log changes to these fields
            ->logOnlyDirty()                // Only log if 'title' or 'content' *actually changed*
            ->setDescriptionForEvent(fn(string $eventName) => "You {$eventName} the note '{$this->title}'");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notebook()
    {
        return $this->belongsTo(Notebook::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'note_tag');
    }
}
