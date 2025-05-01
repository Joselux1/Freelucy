<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
/*
|--------------------------------------------------------------------------
| Web Routes - Autenticación con sesiones
|--------------------------------------------------------------------------
| Estas rutas utilizan el middleware 'web' por defecto (cookies y sesión)
| Asegúrate de no moverlas a 'api.php'
*/

// Página por defecto
Route::get('/', function () {
    return view('welcome');
});

// CSRF token se obtiene automáticamente con esta ruta
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

//--------------------------------------
//     Rutas de Autenticación
//--------------------------------------
Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth')->get('/me', function (Request $request) {// Usuario autenticado (protegido)
    return $request->user();
});

//--------------------------------------
//     Rutas de Servicios
//--------------------------------------
Route::get('services', [ServiceController::class, 'index']);  // Ruta para obtener todos los servicios.
Route::middleware('auth:sanctum')->post('/services', [ServiceController::class, 'store']);


