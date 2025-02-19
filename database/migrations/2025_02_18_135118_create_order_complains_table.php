<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_complains', function (Blueprint $table) {
            $table->id();
            $table->string('order_id', 20);
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
            $table->text('customer_feedback')->nullable();
            $table->json('revised_photo_path')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_complains');
    }
};