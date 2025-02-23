<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'username',
        'password',
        'role',
        'email',
        'full_name',
        'phone',
        'address',
        'province_name',
        'city_name',
        'district_name',
        'subdistrict_name',
        'zip_code',
        'address_details',
        'latitude',
        'longitude',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        
    ];

    

    /**
     * Relasi ke tabel Orders (satu user bisa memiliki banyak order).
     */
    public function orders() 
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function purchaseRequests()
    {
        return $this->hasMany(PurchaseRequest::class);
    }
}
