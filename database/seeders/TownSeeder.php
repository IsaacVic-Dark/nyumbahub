<?php

namespace Database\Seeders;

use App\Models\County;
use App\Models\Town;
use Illuminate\Database\Seeder;

class TownSeeder extends Seeder
{
    public function run(): void
    {
        // county name => towns. Every county has at least its HQ town.
        $towns = [
            'Mombasa' => ['Mombasa'],
            'Kwale' => ['Kwale', 'Ukunda'],
            'Kilifi' => ['Kilifi', 'Malindi', 'Mtwapa'],
            'Tana River' => ['Hola'],
            'Lamu' => ['Lamu'],
            'Taita Taveta' => ['Voi', 'Wundanyi'],
            'Garissa' => ['Garissa'],
            'Wajir' => ['Wajir'],
            'Mandera' => ['Mandera'],
            'Marsabit' => ['Marsabit'],
            'Isiolo' => ['Isiolo'],
            'Meru' => ['Meru'],
            'Tharaka-Nithi' => ['Chuka'],
            'Embu' => ['Embu'],
            'Kitui' => ['Kitui'],
            'Machakos' => ['Machakos', 'Athi River', 'Mlolongo'],
            'Makueni' => ['Wote'],
            'Nyandarua' => ['Ol Kalou'],
            'Nyeri' => ['Nyeri'],
            'Kirinyaga' => ['Kerugoya'],
            "Murang'a" => ["Murang'a"],
            'Kiambu' => ['Kiambu', 'Thika', 'Ruiru', 'Juja', 'Limuru', 'Kikuyu'],
            'Turkana' => ['Lodwar'],
            'West Pokot' => ['Kapenguria'],
            'Samburu' => ['Maralal'],
            'Trans Nzoia' => ['Kitale'],
            'Uasin Gishu' => ['Eldoret'],
            'Elgeyo-Marakwet' => ['Iten'],
            'Nandi' => ['Kapsabet'],
            'Baringo' => ['Kabarnet'],
            'Laikipia' => ['Nanyuki', 'Rumuruti'],
            'Nakuru' => ['Nakuru', 'Naivasha', 'Gilgil'],
            'Narok' => ['Narok'],
            'Kajiado' => ['Kajiado', 'Kitengela', 'Ngong', 'Ongata Rongai'],
            'Kericho' => ['Kericho'],
            'Bomet' => ['Bomet'],
            'Kakamega' => ['Kakamega'],
            'Vihiga' => ['Mbale'],
            'Bungoma' => ['Bungoma'],
            'Busia' => ['Busia'],
            'Siaya' => ['Siaya'],
            'Kisumu' => ['Kisumu'],
            'Homa Bay' => ['Homa Bay'],
            'Migori' => ['Migori'],
            'Kisii' => ['Kisii'],
            'Nyamira' => ['Nyamira'],
            'Nairobi' => ['Nairobi'],
        ];

        foreach ($towns as $countyName => $names) {
            $county = County::where('name', $countyName)->first();

            if (! $county) {
                $this->command?->warn("County not found: {$countyName} (run CountySeeder first)");
                continue;
            }

            foreach ($names as $name) {
                Town::firstOrCreate(['county_id' => $county->id, 'name' => $name]);
            }
        }
    }
}