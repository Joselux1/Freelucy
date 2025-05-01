<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    // Obtener todos los servicios con el usuario que los creó
    public function index()
    {
        $services = Service::with('user')->get();
        return response()->json($services);
    }

    // Crear nuevo servicio
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video' => 'nullable|mimes:mp4,mov,ogg,qt|max:20000',
        ]);
    
        $service = new Service($request->only('title', 'description', 'price'));
        $service->user_id = Auth::id();
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services/images', 'public');
            $service->image_url = '/storage/' . $imagePath;
        }
    
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('services/videos', 'public');
            $service->video_url = '/storage/' . $videoPath;
        }
    
        $service->save();
    
        return response()->json($service, 201);
    }
    public function show($id)
{
    $service = Service::with('user')->find($id);

    if (!$service) {
        return response()->json(['message' => 'Servicio no encontrado'], 404);
    }

    return response()->json($service);
}
public function getReviews($id)
{
    $service = Service::with('reviews.user')->findOrFail($id);

    return response()->json([
        'title' => $service->title,
        'reviews' => $service->reviews->map(function ($r) {
            return [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'created_at' => $r->created_at,
                'user' => [
                    'name' => $r->user->name
                ]
            ];
        })
    ]);
}

    
    
}
