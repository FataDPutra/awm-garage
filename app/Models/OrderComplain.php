<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderComplain extends Model
{
    protected $fillable = [
        'order_id',
        'customer_feedback',
        'revised_photo_path',
    ];

    protected $casts = [
        'revised_photo_path' => 'array',
    ];

    public function order(): BelongsTo
{
    return $this->belongsTo(Order::class, 'order_id');
}

    
}