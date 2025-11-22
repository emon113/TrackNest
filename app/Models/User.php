<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- EXISTING RELATIONSHIPS ---
    public function notes() { return $this->hasMany(Note::class); }
    public function notebooks() { return $this->hasMany(Notebook::class); }
    public function tags() { return $this->hasMany(Tag::class); }
    public function tasks() { return $this->hasMany(Task::class); }
    public function boards() { return $this->hasMany(Board::class); }

    // --- CONTACT RELATIONSHIPS (No changes) ---
    public function contacts()
    {
        return $this->belongsToMany(User::class, 'contacts', 'user_id', 'contact_id')
            ->withTimestamps()
            ->withPivot('status');
    }

    public function contactOf()
    {
        return $this->belongsToMany(User::class, 'contacts', 'contact_id', 'user_id')
            ->withTimestamps()
            ->withPivot('status');
    }

    public function getAcceptedContactsAttribute()
    {
        $contacts = $this->contacts()->wherePivot('status', 'accepted')->get();
        $contactOf = $this->contactOf()->wherePivot('status', 'accepted')->get();
        return $contacts->merge($contactOf);
    }

    public function getPendingContactsAttribute()
    {
        return $this->contacts()->wherePivot('status', 'pending')->get();
    }

    public function getPendingContactRequestsAttribute()
    {
        return $this->contactOf()->wherePivot('status', 'pending')->get();
    }

    /**
     * --- THIS IS THE FIX ---
     *
     * Scope a query to search for users by username.
     * This now searches for the username directly, stripping any '@'
     * from the *search term* first.
     */
    public function scopeSearchByUsername(Builder $query, string $username)
    {
        // 1. Clean the username by stripping the '@' if the searcher typed it
        $cleanedUsername = ltrim($username, '@');

        if (empty($cleanedUsername)) {
            return $query->where('id', false); // Returns an empty result
        }

        // 3. Search the database for the username (e.g., 'johndoe')
        return $query->where('username', 'LIKE', $cleanedUsername . '%');
    }

    public function sharedBoards()
    {
        return $this->belongsToMany(Board::class, 'board_user');
    }

    // Tasks assigned TO me
    public function tasksAssignedToMe()
    {
        return $this->hasMany(Task::class, 'assigned_to_id');
    }
}
