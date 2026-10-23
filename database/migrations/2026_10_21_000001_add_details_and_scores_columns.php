<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->unsignedTinyInteger('bedrooms')->nullable()->after('house_type');
            $table->unsignedTinyInteger('bathrooms')->nullable()->after('bedrooms');
            $table->string('nearest_stage')->nullable()->after('directions');
            // Non-queried extras from the "Post a vacancy report" wizard:
            // floor, furnishing, pets, electricity, water_source, features[],
            // internet[], facilities[], privacy, and the private unit_number.
            $table->jsonb('details')->nullable()->after('nearest_stage');
        });

        Schema::table('listing_conditions', function (Blueprint $table) {
            // { "Water reliability": { "score": 4, "note": "..." }, ... }
            $table->jsonb('scores')->nullable()->after('expected_hidden_costs');
        });

        Schema::table('listing_reviews', function (Blueprint $table) {
            $table->text('advice')->nullable()->after('reason_for_leaving');
        });

        Schema::table('listing_media', function (Blueprint $table) {
            $table->string('label')->nullable()->after('type');
        });

        Schema::table('community_confirmations', function (Blueprint $table) {
            $table->text('note')->nullable()->after('reported_rent_amount');
            $table->timestamp('visited_at')->nullable()->after('note');
            $table->string('spoke_to_caretaker')->nullable()->after('visited_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('privacy_settings')->nullable()->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('privacy_settings'));
        Schema::table('community_confirmations', fn (Blueprint $t) => $t->dropColumn(['note', 'visited_at', 'spoke_to_caretaker']));
        Schema::table('listing_media', fn (Blueprint $t) => $t->dropColumn('label'));
        Schema::table('listing_reviews', fn (Blueprint $t) => $t->dropColumn('advice'));
        Schema::table('listing_conditions', fn (Blueprint $t) => $t->dropColumn('scores'));
        Schema::table('listings', fn (Blueprint $t) => $t->dropColumn(['bedrooms', 'bathrooms', 'nearest_stage', 'details']));
    }
};
