<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_id', 'offerprice_id', 'completed_photo_path', 'shipping_receipt', 'shipping_receipt_customer','shipping_proof_customer','status','customer_confirmation',

    ];

    protected $casts = [
        'completed_photo_path' => 'array', // Konversi JSON ke array otomatis
        // 'revised_photo_path' => 'array', // Konversi JSON ke array otomatis
        // 'customer_feedback' => 'array',
    ];

      public function complains(): HasMany
    {
        return $this->hasMany(OrderComplain::class, 'order_id', 'order_id');
    }

    public function offerPrice(): BelongsTo
    {
        return $this->belongsTo(OfferPrice::class, 'offerprice_id');
    }

    public function shipping(): HasOne
    {
        return $this->hasOne(Shipping::class, 'order_id');
    }
    public function reviews()
    {
        return $this->hasMany(Review::class, 'order_id', 'order_id');
    }
}
