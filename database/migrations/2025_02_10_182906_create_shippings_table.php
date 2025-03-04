<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('shippings', function (Blueprint $table) {
        $table->id();
        $table->string('order_id', 20);
        $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
        $table->string('courier_code', 20);
        $table->string('courier_name', 50);
        $table->string('courier_service', 50);
        $table->string('tracking_number', 100)->nullable();
        $table->timestamp('shipping_date')->nullable();
        $table->timestamp('received_date')->nullable();
        $table->enum('status', ['in_transit', 'delivered'])->default('in_transit');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shippings');
    }
};
