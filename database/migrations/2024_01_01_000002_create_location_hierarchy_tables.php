<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// counties -> towns -> estates -> sub_estates -> buildings
// Grouped in one migration since they're a single conceptual hierarchy created
// together; feel free to split into 5 files if you prefer one-table-per-file.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('counties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('towns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('county_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('estates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('town_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sub_estates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estate_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            // Denormalized rating averages recalculated whenever sub_estate_ratings
            // is written to or updated (see README §4.6).
            $table->decimal('avg_security_rating', 3, 2)->default(0);
            $table->decimal('avg_power_rating', 3, 2)->default(0);
            $table->decimal('avg_water_rating', 3, 2)->default(0);
            $table->decimal('avg_network_rating', 3, 2)->default(0);
            $table->unsignedInteger('ratings_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_estate_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('directions')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buildings');
        Schema::dropIfExists('sub_estates');
        Schema::dropIfExists('estates');
        Schema::dropIfExists('towns');
        Schema::dropIfExists('counties');
    }
};
