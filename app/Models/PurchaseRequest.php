<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PurchaseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'service_id', 'description', 'photo_path',
        'weight', 'shipping_cost', 'status'
    ];

    protected $casts = [
        'photo_path' => 'array', // Konversi JSON ke array otomatis
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function offerPrice(): HasOne
    {
        return $this->hasOne(OfferPrice::class, 'pr_id');
    }
}
