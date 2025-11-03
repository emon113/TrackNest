<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'is_pinned', 'notebook_id'];

    protected $casts = [
        'is_pinned' => 'boolean',
        'created_at' => 'datetime', // <-- ADD THIS
        'updated_at' => 'datetime', // <-- ADD THIS
    ];

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
