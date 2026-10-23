<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('confirmation_helpful_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_confirmation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['community_confirmation_id', 'user_id'], 'confirmation_helpful_votes_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('confirmation_helpful_votes');
    }
};
