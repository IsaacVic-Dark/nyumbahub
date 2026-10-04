<?php

namespace Database\Seeders;

use App\Models\County;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CountySeeder extends Seeder
{
    public function run(): void
    {
        // [code, name, latitude, longitude]. Coordinates are approximate county HQ locations.
        $counties = [
            ['001', 'Mombasa', -4.0435, 39.6682],
            ['002', 'Kwale', -4.1816, 39.4606],
            ['003', 'Kilifi', -3.6305, 39.8499],
            ['004', 'Tana River', -1.5167, 40.0333],
            ['005', 'Lamu', -2.2717, 40.9020],
            ['006', 'Taita Taveta', -3.3993, 38.3677],
            ['007', 'Garissa', -0.4532, 39.6461],
            ['008', 'Wajir', 1.7471, 40.0573],
            ['009', 'Mandera', 3.9366, 41.8670],
            ['010', 'Marsabit', 2.3284, 37.9899],
            ['011', 'Isiolo', 0.3546, 37.5822],
            ['012', 'Meru', 0.0480, 37.6559],
            ['013', 'Tharaka-Nithi', -0.3333, 37.6500],
            ['014', 'Embu', -0.5389, 37.4596],
            ['015', 'Kitui', -1.3667, 38.0106],
            ['016', 'Machakos', -1.5177, 37.2634],
            ['017', 'Makueni', -1.7833, 37.6333],
            ['018', 'Nyandarua', -0.2667, 36.3833],
            ['019', 'Nyeri', -0.4197, 36.9511],
            ['020', 'Kirinyaga', -0.4989, 37.2803],
            ['021', "Murang'a", -0.7210, 37.1526],
            ['022', 'Kiambu', -1.1714, 36.8356],
            ['023', 'Turkana', 3.1191, 35.5973],
            ['024', 'West Pokot', 1.2389, 35.1119],
            ['025', 'Samburu', 1.0966, 36.6988],
            ['026', 'Trans Nzoia', 1.0191, 35.0020],
            ['027', 'Uasin Gishu', 0.5143, 35.2698],
            ['028', 'Elgeyo-Marakwet', 0.6703, 35.5081],
            ['029', 'Nandi', 0.2046, 35.1050],
            ['030', 'Baringo', 0.4919, 35.7430],
            ['031', 'Laikipia', 0.2667, 36.5333],
            ['032', 'Nakuru', -0.3031, 36.0800],
            ['033', 'Narok', -1.0783, 35.8600],
            ['034', 'Kajiado', -1.8524, 36.7768],
            ['035', 'Kericho', -0.3689, 35.2863],
            ['036', 'Bomet', -0.7813, 35.3416],
            ['037', 'Kakamega', 0.2827, 34.7519],
            ['038', 'Vihiga', 0.0833, 34.7167],
            ['039', 'Bungoma', 0.5635, 34.5606],
            ['040', 'Busia', 0.4608, 34.1115],
            ['041', 'Siaya', 0.0607, 34.2881],
            ['042', 'Kisumu', -0.0917, 34.7680],
            ['043', 'Homa Bay', -0.5273, 34.4571],
            ['044', 'Migori', -1.0634, 34.4731],
            ['045', 'Kisii', -0.6817, 34.7667],
            ['046', 'Nyamira', -0.5633, 34.9358],
            ['047', 'Nairobi', -1.2921, 36.8219],
        ];

        foreach ($counties as [$code, $name, $lat, $lng]) {
            County::updateOrCreate(
                ['code' => $code],
                [
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'latitude' => $lat,
                    'longitude' => $lng,
                ]
            );
        }
    }
}