<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Append-only audit trail (README §4.7) — no soft deletes here on purpose:
// a history row that could itself be soft-deleted would defeat the "full
// history of any listing is auditable" guarantee the README calls for.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->foreignId('changed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('changed_by_system')->default(false); // true for scheduled-job transitions
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('listing_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_status_histories');
    }
};
