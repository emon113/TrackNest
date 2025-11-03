<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\NotebookController; // Make sure this is imported

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- 1. 'verified' has been REMOVED from this route ---
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard'); // <-- No more 'verified'

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- 2. 'verified' has been REMOVED from this group ---
Route::middleware(['auth'])->group(function () { // <-- No more 'verified'

    // Notes routes
    Route::patch('/notes/{note}/pin', [NoteController::class, 'togglePin'])->name('notes.togglePin');
    Route::resource('notes', NoteController::class);

    // Notebook resource route
    Route::resource('notebooks', NotebookController::class)->except(['show']);
});


require __DIR__.'/auth.php';
