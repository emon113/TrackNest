<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// --- WE ARE REMOVING 'use Laravel\Scout\Searchable;' ---

class Note extends Model
{
    // --- WE ARE REMOVING 'Searchable' from here ---
    use HasFactory;

    protected $fillable = ['title', 'content', 'is_pinned', 'notebook_id'];

    protected $casts = [
        'is_pinned' => 'boolean',
    ];

    // --- WE ARE REMOVING toSearchableArray() and searchableAs() ---

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
