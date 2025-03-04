<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable();
            $table->json('photo_path')->nullable();
            $table->decimal('weight', 5, 2);
            $table->decimal('shipping_cost_to_admin', 12, 2)->nullable();
            $table->json('shipping_to_admin_details')->nullable();
            $table->json('source_address')->nullable();
            $table->json('destination_address')->nullable();
            $table->json('shipping_to_customer_preference')->nullable();
            $table->json('additional_details')->nullable();
            $table->enum('status', ['pending', 'offer_sent', 'waiting_for_dp', 'processing', 'done', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};