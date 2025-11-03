<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notebook extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'user_id'];

    /**
     * Get the user that owns the notebook.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the notes for this notebook.
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}
