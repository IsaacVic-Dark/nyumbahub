<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_comment_id')->nullable()
                ->constrained('listing_comments')->cascadeOnDelete();

            $table->text('body');
            // Self-declared, not verified, per README §4.4: past_tenant | current_tenant | visitor
            $table->string('relationship_tag')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('listing_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_comments');
    }
};
