<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\NotebookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {

    // Notes
    Route::patch('/notes/{note}/pin', [NoteController::class, 'togglePin'])->name('notes.togglePin');
    Route::resource('notes', NoteController::class);
    Route::resource('notebooks', NotebookController::class)->except(['show']);

    // Tasks
    Route::resource('boards', BoardController::class);
    Route::get('/boards/{board}/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/boards/{board}/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}/move', [TaskController::class, 'move'])->name('tasks.move');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Activity
    Route::get('/activity', [ActivityLogController::class, 'index'])->name('activity.index');

    // Contacts
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');
    Route::post('/contacts/search', [ContactController::class, 'search'])->name('contacts.search');
    Route::post('/contacts/{user}/add', [ContactController::class, 'sendRequest'])->name('contacts.add');
    Route::patch('/contacts/{user}/accept', [ContactController::class, 'acceptRequest'])->name('contacts.accept');
    Route::delete('/contacts/{user}/remove', [ContactController::class, 'removeContact'])->name('contacts.remove');

    // Notifications
    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return redirect()->back();
    })->name('notifications.read_all');

    // --- ADD THIS NEW ROUTE ---
    Route::patch('/notifications/{id}/read', function ($id) {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return redirect()->back();
    })->name('notifications.read_one');

    // --- ADD THIS NEW ROUTE ---
    Route::get('/notifications/history', [App\Http\Controllers\NotificationController::class, 'index'])
        ->name('notifications.index');
});

require __DIR__.'/auth.php';
