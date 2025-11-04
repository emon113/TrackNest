<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder; // <-- 1. IMPORT BUILDER

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

    // --- 2. NEW CONTACT RELATIONSHIPS ---

    /**
     * Get all contact relationships this user *initiated*.
     */
    public function contacts()
    {
        return $this->belongsToMany(User::class, 'contacts', 'user_id', 'contact_id')
            ->withTimestamps()
            ->withPivot('status');
    }

    /**
     * Get all contact relationships *sent to* this user.
     */
    public function contactOf()
    {
        return $this->belongsToMany(User::class, 'contacts', 'contact_id', 'user_id')
            ->withTimestamps()
            ->withPivot('status');
    }

    /**
     * Get all *accepted* contacts (friends).
     * This combines both contacts() and contactOf() where status is 'accepted'.
     */
    public function getAcceptedContactsAttribute()
    {
        $contacts = $this->contacts()->wherePivot('status', 'accepted')->get();
        $contactOf = $this->contactOf()->wherePivot('status', 'accepted')->get();
        return $contacts->merge($contactOf);
    }

    /**
     * Get all *pending* contact requests *sent by* this user.
     */
    public function getPendingContactsAttribute()
    {
        return $this->contacts()->wherePivot('status', 'pending')->get();
    }

    /**
     * Get all *pending* contact requests *received by* this user.
     */
    public function getPendingContactRequestsAttribute()
    {
        return $this->contactOf()->wherePivot('status', 'pending')->get();
    }

    /**
     * Scope a query to search for users by username.
     */
    public function scopeSearchByUsername(Builder $query, string $username)
    {
        // Search for @username, removing the @ if the user included it
        $username = ltrim($username, '@');
        if (empty($username)) {
            return $query;
        }

        return $query->where('username', 'LIKE', $username . '%');
    }
}
