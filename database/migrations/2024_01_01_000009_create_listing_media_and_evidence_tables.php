<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // photo | video
            $table->string('file_path');
            $table->timestamps();
            $table->softDeletes();
        });

        // Sensitive verification documents — encrypted at rest, never public
        // (README §8). file_path should point at encrypted storage; consider
        // an EncryptedCast or storage-driver-level encryption on this column.
        Schema::create('listing_evidence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // phone_otp | photo | video | receipt | agreement | national_id
            $table->string('file_path')->nullable(); // null for e.g. phone_otp/gps-only evidence
            $table->string('status')->default('pending'); // pending | verified | rejected
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_evidence');
        Schema::dropIfExists('listing_media');
    }
};
