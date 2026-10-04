<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flagged_contents', function (Blueprint $table) {
            $table->id();
            // Polymorphic: a flag can target a listing or a comment today,
            // and README §8 leaves the door open to flagging other content
            // later without a schema change.
            $table->string('flaggable_type');
            $table->unsignedBigInteger('flaggable_id');

            $table->foreignId('flagged_by_user_id')->constrained('users')->cascadeOnDelete();
            // building_not_found | information_inaccurate | fraud | safety | duplicate | policy
            $table->string('reason');
            $table->text('details')->nullable();

            $table->string('status')->default('open'); // open | actioned | dismissed
            $table->foreignId('resolved_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['flaggable_type', 'flaggable_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flagged_contents');
    }
};
