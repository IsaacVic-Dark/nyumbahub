<?php

namespace Database\Seeders;

use App\Models\Estate;
use App\Models\SubEstate;
use Illuminate\Database\Seeder;

class SubEstateSeeder extends Seeder
{
    public function run(): void
    {
        // town => estate => sub-estates. Starter set; verify against your own data.
        $subEstates = [
            'Nairobi' => [
                'Embakasi' => ['Pipeline', 'Fedha', 'Tassia', 'Utawala'],
                'Buruburu' => ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'],
                'Umoja' => ['Umoja I', 'Umoja II'],
                'Kasarani' => ['Mwiki', 'Clay City'],
                'Kilimani' => ['Argwings Kodhek Road', 'Lenana Road'],
            ],
        ];

        foreach ($subEstates as $townName => $estates) {
            foreach ($estates as $estateName => $names) {
                $estate = Estate::where('name', $estateName)
                    ->whereHas('town', fn ($q) => $q->where('name', $townName))
                    ->first();

                if (! $estate) {
                    $this->command?->warn("Estate not found: {$estateName} in {$townName}");
                    continue;
                }

                foreach ($names as $name) {
                    SubEstate::firstOrCreate(['estate_id' => $estate->id, 'name' => $name]);
                }
            }
        }
    }
}