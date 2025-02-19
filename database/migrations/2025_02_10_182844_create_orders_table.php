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
    Schema::create('orders', function (Blueprint $table) {
        $table->string('order_id', 20)->primary();
        $table->foreignId('offerprice_id')->constrained('offer_prices')->onDelete('cascade');
        $table->json('completed_photo_path')->nullable();
        $table->string('shipping_receipt')->nullable();
        $table->string('shipping_receipt_customer')->nullable();
        $table->string('shipping_proof_customer')->nullable();
        $table->enum('status', ['processing', 'waiting_for_customer_shipment', 'waiting_for_admin_confirmation', 'completed', 'waiting_for_cust_confirmation' ,'customer_complain', 'approved', 'revised','waiting_for_payment', 'waiting_for_shipment', 'shipped'])->default('processing');
        $table->enum('customer_confirmation', ['approved', 'rejected', 'pending'])->default('pending');
        // $table->text('customer_feedback')->nullable();
        // $table->json('revised_photo_path')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
