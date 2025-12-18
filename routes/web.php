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
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\NotificationController;

// --- PUBLIC ROUTES ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- AUTHENTICATED ROUTES ---
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notes Module
    Route::patch('/notes/{note}/pin', [NoteController::class, 'togglePin'])->name('notes.togglePin');
    Route::resource('notes', NoteController::class);
    Route::resource('notebooks', NotebookController::class)->except(['show']);

    // Tasks Module (Boards, Columns, Tasks)
    Route::resource('boards', BoardController::class);

    // Column Management
    Route::post('/boards/{board}/columns', [ColumnController::class, 'store'])->name('columns.store');
    Route::put('/columns/{column}', [ColumnController::class, 'update'])->name('columns.update');
    Route::delete('/columns/{column}', [ColumnController::class, 'destroy'])->name('columns.destroy');

    // Task Management
    Route::get('/boards/{board}/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/boards/{board}/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}/move', [TaskController::class, 'move'])->name('tasks.move');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Contacts System
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');
    Route::post('/contacts/search', [ContactController::class, 'search'])->name('contacts.search');
    Route::post('/contacts/{user}/add', [ContactController::class, 'sendRequest'])->name('contacts.add');
    Route::patch('/contacts/{user}/accept', [ContactController::class, 'acceptRequest'])->name('contacts.accept');
    Route::delete('/contacts/{user}/remove', [ContactController::class, 'removeContact'])->name('contacts.remove');

    // Activity Log
    Route::get('/activity', [ActivityLogController::class, 'index'])->name('activity.index');

    // Notifications
    Route::get('/notifications/history', [NotificationController::class, 'index'])->name('notifications.index');

    Route::post('/notifications/read', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return redirect()->back();
    })->name('notifications.read');

    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return redirect()->back();
    })->name('notifications.read_all');

    Route::patch('/notifications/{id}/read', function ($id) {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return redirect()->back();
    })->name('notifications.read_one');

    // Chat Routes
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');

    // This route handles displaying a specific conversation (same controller method)
    Route::get('/chat/{conversation}', [ChatController::class, 'index'])->name('chat.show');

    // Sending a message
    Route::post('/chat/{conversation}', [ChatController::class, 'store'])->name('chat.store');

    // Starting a chat from Contacts page
    Route::post('/chat/start/{user}', [ChatController::class, 'start'])->name('chat.start');
});

// --- ADMIN ROUTES ---
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::patch('/users/{user}/ban', [AdminController::class, 'toggleBan'])->name('admin.users.ban');
});

require __DIR__.'/auth.php';
