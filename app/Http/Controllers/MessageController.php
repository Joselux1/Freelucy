<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // Asegura que solo usuarios autenticados puedan acceder
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Enviar un mensaje (desde cliente a freelance)
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string|max:1000',
        ]);

        $message = new Message();
        $message->sender_id = Auth::id();
        $message->receiver_id = $request->receiver_id;
        $message->content = $request->content;
        $message->save();

        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'data' => $message
        ], 201);
    }

    // Ver los mensajes recibidos por el usuario autenticado
    public function received()
    {
        $messages = Message::where('receiver_id', Auth::id())
            ->with('sender:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    // Ver los mensajes enviados por el usuario autenticado
    public function sent()
    {
        $messages = Message::where('sender_id', Auth::id())
            ->with('receiver:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }
}
