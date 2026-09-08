<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/deals', [ProductController::class, 'deals']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/upcoming', [EventController::class, 'upcoming']);
Route::get('/events/{event}', [EventController::class, 'show']);
