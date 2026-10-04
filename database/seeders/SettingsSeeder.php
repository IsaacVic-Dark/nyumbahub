<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

// Default values for every "Configurable: Yes" row in the README's
// business rules table (§6). Change these via the settings table/UI in
// production — this seeder only sets the initial defaults.
class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'occupied_confirmation_threshold' => ['2', 'Independent confirmations needed (after evidence) before a listing flips to occupied — README §4.5.1'],
            'rent_change_consensus_threshold' => ['2', 'Independent matching reports needed before a rent-change is applied — README §4.5.3'],
            'possibly_occupied_archive_days' => ['14', 'Days a listing can sit in possibly_occupied with no follow-up before archiving as occupied_other_channel — README §4.5.2'],
            'recently_vacated_unconfirmed_days' => ['14', 'Days without any confirmation before a listing moves to unconfirmed — README §6'],
            'archive_expired_days' => ['30', 'Days stale before a listing is archived with reason=expired — README §6'],
            'confirmation_extension_days' => ['7', 'Visibility window extension per "still vacant" confirmation — README §6'],
        ];

        foreach ($defaults as $key => [$value, $description]) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value, 'description' => $description]);
        }
    }
}
