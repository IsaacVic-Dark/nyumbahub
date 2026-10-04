<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->unique()->constrained()->cascadeOnDelete();

            $table->date('lived_from')->nullable();
            $table->date('lived_to')->nullable();
            $table->text('pros')->nullable();
            $table->text('cons')->nullable();
            $table->text('how_repairs_handled')->nullable();
            $table->text('recurring_issues')->nullable();
            $table->boolean('rent_changed_during_stay')->default(false);
            $table->text('reason_for_leaving')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_reviews');
    }
};
