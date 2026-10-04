<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_estate_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_estate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->unsignedTinyInteger('security_rating');
            $table->unsignedTinyInteger('power_rating');
            $table->unsignedTinyInteger('water_rating');
            $table->unsignedTinyInteger('network_rating');

            $table->timestamps();
            $table->softDeletes();

            // One editable rating per user per sub-estate (README §4.6).
            $table->unique(['sub_estate_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_estate_ratings');
    }
};
