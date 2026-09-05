<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// TODO: wrap back in Route::middleware(['auth', 'verified'])->group(...) once
// auth is wired up for the NyumbaHub app routes. Left open for now so every
// page (dashboard, explore, listing, post, etc.) can be reviewed without logging in.
Route::inertia('dashboard', 'app/dashboard')->name('dashboard');

require __DIR__.'/settings.php';