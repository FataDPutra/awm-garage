<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdditionalType extends Model
{
    protected $fillable = ['name'];

    public function serviceAdditionals()
    {
        return $this->hasMany(ServiceAdditional::class);
    }
}