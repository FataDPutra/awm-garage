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
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('offerprice_id')->constrained('offer_prices')->onDelete('cascade');
        $table->decimal('amount', 12, 2);
        $table->string('payment_method', 50);
        $table->enum('payment_type', ['dp', 'full']);
        $table->string('transaction_id')->nullable();
        $table->enum('payment_status', ['pending', 'success', 'failed', 'paid'])->default('pending');
        $table->timestamp('payment_time')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
