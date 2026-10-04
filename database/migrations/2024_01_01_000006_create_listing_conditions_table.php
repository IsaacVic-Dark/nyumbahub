<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->unique()->constrained()->cascadeOnDelete();

            // Free-text condition fields per README §4.1 step 3. Modeled as
            // nullable text rather than fixed ratings since the doc doesn't
            // specify a rating scale — tighten to enums/integers later if you
            // want structured filtering on these.
            $table->text('water')->nullable();
            $table->text('electricity')->nullable();
            $table->text('internet')->nullable();
            $table->text('plumbing')->nullable();
            $table->text('kitchen')->nullable();
            $table->text('walls_floors')->nullable();
            $table->text('natural_light')->nullable();
            $table->text('noise')->nullable();
            $table->text('security')->nullable();
            $table->text('parking')->nullable();
            $table->text('garbage_collection')->nullable();
            $table->boolean('has_lift')->nullable();
            $table->text('pest_mould_leakage_history')->nullable();
            $table->jsonb('expected_hidden_costs')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_conditions');
    }
};
