<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('service_name');
            $table->text('description')->nullable();
            $table->decimal('base_price', 12, 2);
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    public function down(): void {
        Schema::dropIfExists('services');
    }
};
