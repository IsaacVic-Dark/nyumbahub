<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('counties', function (Blueprint $table) {
            $table->string('code', 3)->nullable()->unique()->after('id');
            $table->string('slug')->nullable()->unique()->after('name');
            $table->decimal('latitude', 10, 7)->nullable()->after('slug');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    public function down(): void
    {
        Schema::table('counties', function (Blueprint $table) {
            $table->dropUnique(['code']);
            $table->dropUnique(['slug']);
            $table->dropColumn(['code', 'slug', 'latitude', 'longitude']);
        });
    }
};