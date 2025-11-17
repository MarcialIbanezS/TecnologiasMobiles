<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FirebaseController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('homepage');
});

Route::get('/home', function () {
    return view('homepage');
});

Route::get('/dashboard', [FirebaseController::class, 
'getDashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/register', function () {
    return view('register');
})->name('register');

Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/contact', [FirebaseController::class, 
'getFichasMedicas'])->middleware(['auth', 'verified'])->name('contact');

Route::post('/contact', [FirebaseController::class, 
'createFichaMedica'])->middleware(['auth', 'verified'])->name('contact.store');

Route::post('/contact/search', [FirebaseController::class, 
'searchFichaMedica'])->middleware(['auth', 'verified'])->name('contact.search');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/webpay', function () {
    return view('webpay');
});

require __DIR__.'/auth.php';
