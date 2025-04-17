<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::post('/payments/callback', [PaymentController::class, 'handleCallback'])->name('payments.callback');