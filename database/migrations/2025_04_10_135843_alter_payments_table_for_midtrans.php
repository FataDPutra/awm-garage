<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {
            // Ubah payment_method menjadi string(100) dan nullable
            $table->string('payment_method', 100)->nullable()->change();
            // Pastikan payment_status sudah mendukung 'paid' dan 'success'
            // Tidak perlu ubah enum karena sudah sesuai dengan ['pending', 'success', 'failed', 'paid']
        });
    }

    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            // Kembalikan ke string(50) dan not nullable jika rollback
            $table->string('payment_method', 50)->nullable()->change();
        });
    }
};