<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfferPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'pr_id',
        'service_price',
        'dp_amount',
        'estimation_days',
        'shipping_cost_to_customer',
        'shipping_to_customer_details',
        'total_price',
        'status',
    ];

    protected $casts = [
        'service_price' => 'decimal:2',
        'dp_amount' => 'decimal:2',
        'shipping_cost_to_customer' => 'decimal:2',
        'shipping_to_customer_details' => 'array',
        'total_price' => 'decimal:2',
    ];

    public function purchaseRequest(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequest::class, 'pr_id');
    }

    public function order(): HasOne
    {
        return $this->hasOne(Order::class, 'offerprice_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'offerprice_id');
    }
}