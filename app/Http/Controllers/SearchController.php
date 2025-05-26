<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        try {
            // Obtener el término de búsqueda
            $query = trim($request->input('query'));

            // Verificar si el término de búsqueda está vacío
            if (empty($query)) {
                return response()->json(['message' => 'La consulta está vacía'], 400);
            }

            // Realizar la búsqueda solo en el campo 'title'
            $services = Service::where('title', 'LIKE', "%{$query}%")->get();

            // Verificar si se encontraron resultados
            if ($services->isEmpty()) {
                return response()->json(['message' => 'No se encontraron servicios'], 404);
            }

            return response()->json($services, 200);
        } catch (\Exception $e) {
            // Registrar el error en el log
            Log::error("Error en la búsqueda: " . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}
