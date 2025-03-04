<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceAdditional extends Model
{
    protected $fillable = [
        'service_id',
        'additional_type_id', // [CHANGED] Ganti type menjadi relasi
        'name',
        'image_path',
        'additional_price',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function additionalType()
    {
        return $this->belongsTo(AdditionalType::class);
    }
}