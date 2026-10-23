<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('search_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('area')->nullable();            // free text: estate / town / county
            $table->decimal('max_rent', 10, 2)->nullable();
            $table->jsonb('house_types')->nullable();      // ["Bedsitter", "1-Bedroom"]
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->boolean('bedrooms_plus')->default(false); // "3+"
            $table->jsonb('amenities')->nullable();        // ["water","parking","stage","gated","internet"]
            $table->string('frequency')->default('instant'); // instant | daily | weekly
            $table->jsonb('channels')->nullable();         // ["push","email","sms"]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_alerts');
    }
};
