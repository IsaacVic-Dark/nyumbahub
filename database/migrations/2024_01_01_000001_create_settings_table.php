<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Generic key/value config table. This is what backs every "Configurable: Yes"
// row in the README's business rules table (§6) — the confirmation thresholds,
// the possibly_occupied archive window, etc. Kept deliberately simple (no soft
// deletes, no extra audit columns) since it's read constantly by jobs/policies
// and only ever edited by admins.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
