<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Review; 

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'price', 'image', 'video', 'user_id'];

    // Relación: un servicio pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}