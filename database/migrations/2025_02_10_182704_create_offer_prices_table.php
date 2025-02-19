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
    Schema::create('offer_prices', function (Blueprint $table) {
        $table->id();
        $table->foreignId('pr_id')->constrained('purchase_requests')->onDelete('cascade');
        $table->decimal('service_price', 12, 2);
        $table->decimal('dp_amount', 12, 2);
        $table->integer('estimation_days');
        $table->decimal('total_price', 12, 2);
        $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offer_prices');
    }
};
