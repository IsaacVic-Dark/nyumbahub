<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // still_vacant | new_tenant_moved_in | occupied | rent_changed |
            // building_not_found | information_inaccurate  (README §4.5)
            $table->string('type');

            // Only used when type = rent_changed (README §4.5.3); a background
            // job groups these by figure and applies once N independent users
            // agree (threshold pulled from `settings`).
            $table->decimal('reported_rent_amount', 10, 2)->nullable();

            // Links to the tenancy-agreement evidence when type =
            // new_tenant_moved_in, required per README §4.5.1's evidence gate.
            $table->foreignId('evidence_id')->nullable()
                ->constrained('listing_evidence')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['listing_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_confirmations');
    }
};
