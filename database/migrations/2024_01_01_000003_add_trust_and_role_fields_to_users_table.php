<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Extends Laravel's default users table rather than redefining it, so this
// slots into a fresh install right after the framework's own
// create_users_table migration.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->unique()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('phone');
            $table->timestamp('national_id_verified_at')->nullable()->after('phone_verified_at');
            $table->boolean('is_verified_contributor')->default(false)->after('national_id_verified_at');
            $table->integer('trust_score')->default(0)->after('is_verified_contributor');
            // 'user' | 'admin' — admin-only per README §4.8; kept as a plain
            // string + PHP enum cast rather than a native DB enum so adding
            // roles later (e.g. a moderator tier, see README §9.3) never
            // requires an ALTER TYPE.
            $table->string('role')->default('user')->after('trust_score');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['phone', 'phone_verified_at', 'national_id_verified_at', 'is_verified_contributor', 'trust_score', 'role']);
        });
    }
};
