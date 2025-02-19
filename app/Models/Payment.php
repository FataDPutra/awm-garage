<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'offerprice_id', 'amount', 'payment_method', 'payment_type',
        'transaction_id', 'payment_status', 'payment_time'
    ];

    public function offerPrice(): BelongsTo
    {
        return $this->belongsTo(OfferPrice::class, 'offerprice_id');
    }
}
