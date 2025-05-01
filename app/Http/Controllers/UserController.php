<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;


class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|mimes:jpg,jpeg,png,webp,gif,bmp|max:2048',
        ]);

        $user->name = $request->name;

        if ($request->hasFile('avatar')) {
            // Borrar imagen anterior si existe
            if ($user->avatar && Storage::disk('public')->exists(str_replace('/storage/', '', $user->avatar))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
            }

            // Guardar nueva imagen
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'user' => $user,
        ]);
    }
}
