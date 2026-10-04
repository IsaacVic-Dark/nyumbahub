<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // the reporter
            $table->foreignId('building_id')->constrained()->cascadeOnDelete();

            $table->string('house_type');
            $table->decimal('last_monthly_rent', 10, 2);
            $table->decimal('deposit_amount', 10, 2)->nullable();
            $table->date('move_out_date'); // actual or expected, see README §4.1
            $table->boolean('is_vacancy_confirmed_by_reporter')->default(false);
            $table->text('directions')->nullable(); // landmarks etc, redundant w/ building.directions but reporter-specific

            // String columns + PHP backed-enum casts (App\Enums\ListingStatus /
            // ArchiveReason) rather than native Postgres enums: adding a new
            // status/reason later is a one-line PHP change instead of an
            // ALTER TYPE migration.
            $table->string('status')->default('upcoming_vacancy');
            $table->string('archive_reason')->nullable();

            $table->timestamp('expires_at')->nullable();
            $table->integer('trust_score')->default(0);
            $table->unsignedInteger('confirmed_count')->default(0);
            $table->timestamp('last_confirmed_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index(['building_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
