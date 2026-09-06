<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

// TODO: wrap back in Route::middleware(['auth', 'verified'])->group(...) once
// auth is wired up for the NyumbaHub app routes. Left open for now so every
// page (dashboard, explore, listing, post, etc.) can be reviewed without logging in.
Route::inertia('dashboard', 'app/dashboard')->name('dashboard');
Route::inertia('explore', 'app/explore')->name('explore');

// Mock-data-backed for now — swap the closure for a controller + Eloquent
// lookup once listings are persisted.
Route::get('/listings/{listing}', function (string $listing) {
    return Inertia::render('app/listings/show', ['id' => $listing]);
})->name('listings.show');

Route::inertia('post', 'app/post/index')->name('post.create');
Route::inertia('post/success', 'app/post/success')->name('post.success');
Route::inertia('confirm', 'app/confirm')->name('confirm');
Route::inertia('saved', 'app/saved')->name('saved');
Route::inertia('alerts', 'app/alerts')->name('alerts');
Route::inertia('notifications', 'app/notifications')->name('notifications');
Route::inertia('profile', 'app/profile')->name('profile');
Route::inertia('messages', 'app/messages')->name('messages');

require __DIR__.'/settings.php';