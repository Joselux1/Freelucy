<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Role;

class AuthController extends Controller
{
    // Registro
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Asignar por defecto el rol de 'usuario'
        $defaultRoleId = Role::where('name', 'usuario')->value('id');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $defaultRoleId,
        ]);

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user' => $user->load('role') // incluye el rol
        ]);
    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Estas credenciales no coinciden con nuestros registros.'],
            ]);
        }

        $request->session()->regenerate();

        // Cargar el rol asociado al usuario autenticado
        $user = User::with('role')->find(Auth::id());

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    // Usuario autenticado
    public function me(Request $request)
    {
        return response()->json(Auth::user()->load('role'));
    }
    
    
}
