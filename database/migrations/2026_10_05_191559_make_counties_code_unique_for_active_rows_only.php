   <?php

   use Illuminate\Database\Migrations\Migration;
   use Illuminate\Database\Schema\Blueprint;
   use Illuminate\Support\Facades\DB;
   use Illuminate\Support\Facades\Schema;

   return new class extends Migration
   {
       public function up(): void
       {
           Schema::table('counties', function (Blueprint $table) {
               $table->dropUnique(['code']);
           });

           DB::statement('CREATE UNIQUE INDEX counties_code_active_unique ON counties (code) WHERE deleted_at IS NULL');
       }

       public function down(): void
       {
           DB::statement('DROP INDEX IF EXISTS counties_code_active_unique');

           Schema::table('counties', function (Blueprint $table) {
               $table->unique('code');
           });
       }
   };