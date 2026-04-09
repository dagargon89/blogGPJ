<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:access-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('tags', TagController::class)->except(['show']);
        Route::resource('posts', PostController::class)->except(['show']);
    });
