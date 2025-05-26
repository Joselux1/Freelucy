<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BotController extends Controller
{
    public function respond(Request $request)
    {
        $question = strtolower($request->input('message'));

        //respuestas
        $responses = [
          '¡Hola! ¿En qué puedo ayudarte hoy?',
            'servicios' => 'Ofrecemos diseño, desarrollo web, marketing y más.',
            'precio' => 'Los precios varían según el servicio. ¿Qué estás buscando?',
            'soporte' => 'Nuestro soporte está disponible de lunes a viernes de 9 a 18 horas.',
            'ayuda' => 'Claro, ¿en qué necesitas ayuda?',
            'contacto' => 'Puedes contactarnos a través de nuestro correo electrónico: soportefreelucy@gmail.com',
            'horario' => 'Nuestro horario de atención es de lunes a viernes de 9 a 18 horas.',
        ];

        $answer = $responses[$question] ?? 'Lo siento, no entendí tu pregunta.';

        return response()->json(['reply' => $answer]);
    }
}

