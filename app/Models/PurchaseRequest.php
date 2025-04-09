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
        'user_id',
        'service_id',
        'description',
        'photo_path',
        'weight',
        'shipping_cost_to_admin',
        'shipping_to_admin_details',
        'source_address',
        'destination_address',
        'shipping_to_customer_preference',
        'additional_details', 
        'status',
    ];

    protected $casts = [
        'photo_path' => 'array',
        'weight' => 'decimal:2',
        'shipping_cost_to_admin' => 'decimal:2',
        'shipping_to_admin_details' => 'array',
        'source_address' => 'array',
        'destination_address' => 'array',
        'shipping_to_customer_preference' => 'array',
        'additional_details' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class)->withTrashed(); // Izinkan akses service yang sudah di-soft delete
    }

    public function offerPrice(): HasOne
    {
        return $this->hasOne(OfferPrice::class, 'pr_id');
    }
}