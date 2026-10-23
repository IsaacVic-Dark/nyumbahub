<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

// --- Public pages (they only read data from public API endpoints) ---------------
Route::inertia('dashboard', 'app/dashboard')->name('dashboard');
Route::inertia('explore', 'app/explore')->name('explore');
Route::inertia('map', 'app/map')->name('map');
Route::inertia('safety', 'app/safety')->name('safety');
Route::inertia('help', 'app/help')->name('help');
Route::inertia('states', 'app/states')->name('states');

// --- Signed-in pages (their API endpoints are behind auth:sanctum) --------------
Route::middleware('auth')->group(function () {
    // GET /api/listings/{id} requires a signed-in user, so the detail page does too.
    Route::get('/listings/{listing}', function (string $listing) {
        return Inertia::render('app/listings/show', ['id' => $listing]);
    })->whereNumber('listing')->name('listings.show');

    Route::get('/listings/{listing}/confirm', function (string $listing) {
        return Inertia::render('app/confirm', ['id' => $listing]);
    })->whereNumber('listing')->name('confirm');

    Route::inertia('post', 'app/post/index')->name('post.create');
    Route::inertia('post/success', 'app/post/success')->name('post.success');
    Route::inertia('saved', 'app/saved')->name('saved');
    Route::inertia('alerts', 'app/alerts')->name('alerts');
    Route::inertia('notifications', 'app/notifications')->name('notifications');
    Route::inertia('profile', 'app/profile')->name('profile');
    Route::inertia('messages', 'app/messages')->name('messages');
    Route::inertia('my-reports', 'app/my-activity', ['tab' => 'reports'])->name('my-reports');
    Route::inertia('my-confirmations', 'app/my-activity', ['tab' => 'confirmations'])->name('my-confirmations');
});

// --- Staff portal: admin / superadmin only ------------------------------------
// Top-level (not under 'app/') so app.tsx's layout resolver falls through to
// the default AppLayout/sidebar shell instead of the consumer NyumbaLayout.
Route::inertia('admin', 'admin')->middleware(['auth', 'admin'])->name('admin');

require __DIR__.'/settings.php';
