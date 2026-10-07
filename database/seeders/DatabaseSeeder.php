<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Re-runnable: creates the admin if missing, otherwise makes sure it has the admin role.
        $admin = User::where('email', 'admin@example.com')->first();

        if ($admin) {
            // `role` isn't in $fillable, so forceFill is needed (cast to UserRole on save).
            $admin->forceFill(['role' => UserRole::Admin])->save();
        } else {
            User::factory()->admin()->create([
                'name' => 'admin',
                'email' => 'admin@example.com',
            ]);
        }

        $this->call([
            CountySeeder::class,
            TownSeeder::class,
            EstateSeeder::class,
            SubEstateSeeder::class,
            BuildingSeeder::class,
        ]);
    }
}
