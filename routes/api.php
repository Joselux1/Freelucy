<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;

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
