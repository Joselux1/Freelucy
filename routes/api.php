<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;


/*
|--------------------------------------------------------------------------
| API Routes (Sanctum + SPA)
|--------------------------------------------------------------------------
*/

// Ruta protegida para obtener el usuario autenticado con su rol
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);



// 🛠 Servicios (GET público, POST privado)
Route::get('/services', [ServiceController::class, 'index']);
Route::middleware('auth:sanctum')->post('/services', [ServiceController::class, 'store']);

// Ejemplo adicional: contratar un servicio
Route::middleware('auth:sanctum')->post('/services/{id}/contract', [ServiceController::class, 'contract']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->load('role'); // Suponiendo que el modelo User tiene relación con Role

});
Route::post('/logout', function () {
    Auth::guard('web')->logout();
    return response()->json(['message' => 'Sesión cerrada']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/services', [ServiceController::class, 'store']);
});

Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/services/{id}/reviews', [ServiceController::class, 'getReviews']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/received', [MessageController::class, 'received']);
    Route::get('/messages/sent', [MessageController::class, 'sent']);
});




Route::middleware('auth:sanctum')->post('/profile/update', [UserController::class, 'update']);

