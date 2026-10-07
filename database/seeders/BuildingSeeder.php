<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\SubEstate;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    public function run(): void
    {
        // Demo data only, so it never lands in production.
        if (! app()->environment('local')) {
            return;
        }

        // town => estate => sub-estate => buildings
        $buildings = [
            'Nairobi' => [
                'Embakasi' => [
                    'Pipeline' => [
                        ['name' => 'Demo Apartments A', 'directions' => 'Demo entry. Replace with real data.'],
                        ['name' => 'Demo Apartments B'],
                    ],
                ],
                'Kilimani' => [
                    'Argwings Kodhek Road' => [
                        ['name' => 'Demo Towers', 'latitude' => -1.2921, 'longitude' => 36.7870],
                    ],
                ],
                'Kasarani' => [
                    'Mwiki' => [
                        ['name' => 'Providence Square', 'latitude' => -1.2312548511740355, 'longitude' => 36.934772477415585],
                        ['name' => 'MWM', 'latitude' => -1.2323508542051502, 'longitude' => 36.93628864320731],
                    ],
                ],
            ],
        ];

        foreach ($buildings as $townName => $estates) {
            foreach ($estates as $estateName => $subEstates) {
                foreach ($subEstates as $subEstateName => $items) {
                    $subEstate = SubEstate::where('name', $subEstateName)
                        ->whereHas('estate', fn ($q) => $q
                            ->where('name', $estateName)
                            ->whereHas('town', fn ($t) => $t->where('name', $townName)))
                        ->first();

                    if (! $subEstate) {
                        $this->command?->warn("Sub-estate not found: {$subEstateName} ({$estateName}, {$townName})");
                        continue;
                    }

                    foreach ($items as $item) {
                        Building::firstOrCreate(
                            ['sub_estate_id' => $subEstate->id, 'name' => $item['name']],
                            collect($item)->except('name')->all()
                        );
                    }
                }
            }
        }
    }
}