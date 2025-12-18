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
        'name', 'email', 'password', 'username',
        'avatar', 'role', 'is_banned'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_banned' => 'boolean',
    ];

    // --- EXISTING RELATIONSHIPS ---
    public function notes() { return $this->hasMany(Note::class); }
    public function notebooks() { return $this->hasMany(Notebook::class); }
    public function tags() { return $this->hasMany(Tag::class); }
    public function tasks() { return $this->hasMany(Task::class); }
    public function boards() { return $this->hasMany(Board::class); }

    // --- CONTACT RELATIONSHIPS ---
    public function contacts() {
        return $this->belongsToMany(User::class, 'contacts', 'user_id', 'contact_id')
            ->withTimestamps()->withPivot('status');
    }
    public function contactOf() {
        return $this->belongsToMany(User::class, 'contacts', 'contact_id', 'user_id')
            ->withTimestamps()->withPivot('status');
    }
    public function getAcceptedContactsAttribute() {
        return $this->contacts()->wherePivot('status', 'accepted')->get()
            ->merge($this->contactOf()->wherePivot('status', 'accepted')->get());
    }
    public function getPendingContactsAttribute() {
        return $this->contacts()->wherePivot('status', 'pending')->get();
    }
    public function getPendingContactRequestsAttribute() {
        return $this->contactOf()->wherePivot('status', 'pending')->get();
    }
    public function sharedBoards() {
        return $this->belongsToMany(Board::class, 'board_user');
    }

    // --- THIS IS THE MISSING RELATIONSHIP (CHAT) ---
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }
    // --- END MISSING RELATIONSHIP ---

    public function scopeSearchByUsername(Builder $query, string $username) {
        $cleanedUsername = ltrim($username, '@');
        if (empty($cleanedUsername)) return $query->where('id', false);
        return $query->where('username', 'LIKE', $cleanedUsername . '%');
    }
}
