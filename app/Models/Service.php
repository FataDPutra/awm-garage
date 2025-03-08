<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes; // Tambahkan ini

class Service extends Model
{
    use HasFactory, SoftDeletes; // Tambahkan SoftDeletes

    protected $fillable = ['service_name', 'description', 'base_price'];

    protected $dates = ['deleted_at']; // Pastikan deleted_at dianggap sebagai tanggal

    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }

    public function additionals()
    {
        return $this->hasMany(ServiceAdditional::class);
    }
}