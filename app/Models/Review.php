<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['order_id', 'rating', 'review', 'media_paths'];

    protected $casts = [
        'media_paths' => 'array', // Cast ke array untuk menyimpan path media (gambar/video)
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
}