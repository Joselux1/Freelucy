<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller{
    // Método para obtener los servicios
    public function index()
    {
        $services = Service::all();  // Esto trae todos los servicios de la base de datos.
        return response()->json($services);
    }



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
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
            $service->image_url = '/storage/' . $imagePath;
        }
    
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('services', 'public');
            $service->video_url = '/storage/' . $videoPath;
        }
    
        $service->save();
    
        return response()->json($service, 201);
    }
    
    

}
