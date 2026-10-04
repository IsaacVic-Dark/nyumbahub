<?php

namespace Database\Seeders;

use App\Models\Estate;
use App\Models\Town;
use Illuminate\Database\Seeder;

class EstateSeeder extends Seeder
{
    public function run(): void
    {
        // town name => estates. Starter set; extend as you go.
        $estates = [
            'Nairobi' => [
                'Kilimani', 'Kileleshwa', 'Lavington', 'Westlands', 'Parklands',
                'South B', 'South C', 'Embakasi', 'Kasarani', 'Roysambu',
                "Lang'ata", 'Karen', 'Donholm', 'Buruburu', 'Umoja',
                'Eastleigh', 'Ngara', 'Githurai',
            ],
            'Mombasa' => ['Nyali', 'Bamburi', 'Likoni', 'Tudor', 'Kizingo', 'Changamwe'],
            'Kisumu' => ['Milimani', 'Nyalenda', 'Kondele'],
            'Nakuru' => ['Milimani', 'Section 58', 'Lanet'],
            'Eldoret' => ['Elgon View', 'Kapsoya'],
            'Thika' => ['Makongeni', 'Section 9'],
            'Ruiru' => ['Kimbo', 'Membley'],
            'Kitengela' => ['Milimani', 'Muigai'],
        ];

        foreach ($estates as $townName => $names) {
            $town = Town::where('name', $townName)->first();

            if (! $town) {
                $this->command?->warn("Town not found: {$townName} (run TownSeeder first)");
                continue;
            }

            foreach ($names as $name) {
                Estate::firstOrCreate(['town_id' => $town->id, 'name' => $name]);
            }
        }
    }
}