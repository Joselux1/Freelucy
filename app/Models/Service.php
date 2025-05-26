<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Review; 

class Service extends Model
{
    use HasFactory;

    // Campos que pueden ser llenados de forma masiva
    protected $fillable = ['title', 'description', 'price', 'image_url', 'video_url', 'user_id'];

    // Relación: un servicio pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: un servicio puede tener muchas reseñas
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}