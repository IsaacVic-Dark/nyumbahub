<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill existing rows (including soft-deleted ones) before adding NOT NULL.
        $taken = array_flip(DB::table('counties')->whereNotNull('slug')->pluck('slug')->all());

        foreach (DB::table('counties')->whereNull('slug')->orderBy('id')->get() as $county) {
            $base = Str::slug($county->name);
            $slug = $base;
            $i = 2;

            while (isset($taken[$slug])) {
                $slug = "{$base}-{$i}";
                $i++;
            }

            $taken[$slug] = true;
            DB::table('counties')->where('id', $county->id)->update(['slug' => $slug]);
        }

        Schema::table('counties', function (Blueprint $table) {
            $table->string('slug')->change();
        });
    }

    public function down(): void
    {
        Schema::table('counties', function (Blueprint $table) {
            $table->string('slug')->nullable()->change();
        });
    }
};