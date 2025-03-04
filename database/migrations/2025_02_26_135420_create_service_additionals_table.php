<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_additionals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade'); // Relasi ke services
            $table->foreignId('additional_type_id')->constrained('additional_types')->onDelete('cascade')->after('service_id'); // Tambah foreign key
            $table->string('name')->nullable(); // Nama additional (misalnya 'Red' untuk color)
            $table->string('image_path')->nullable(); // Path gambar (misalnya untuk warna)
            $table->decimal('additional_price', 12, 2)->default(0); // Harga tambahan untuk additional
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_additionals');
    }
};
