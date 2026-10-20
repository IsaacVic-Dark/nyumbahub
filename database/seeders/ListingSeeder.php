<?php

namespace Database\Seeders;

use App\Enums\CommentRelationshipTag as Tag;
use App\Enums\EvidenceStatus;
use App\Enums\EvidenceType;
use App\Enums\ListingStatus as S;
use App\Models\Building;
use App\Models\Listing;
use App\Models\ListingStatusHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeds demo data for `listings` and every `listing_*` table:
 * listing_conditions, listing_reviews, listing_comments, listing_media,
 * listing_evidence and listing_status_histories.
 *
 * Needs the buildings from BuildingSeeder, so it must run after it.
 * Re-runnable: every row is looked up before it is created.
 *
 * Some listings deliberately have no condition report, review, comments,
 * media or evidence so you can exercise the "no data yet" responses.
 */
class ListingSeeder extends Seeder
{
    public function run(): void
    {
        // Demo data only, so it never lands in production.
        if (! app()->environment('local')) {
            return;
        }

        $users = $this->demoUsers();

        foreach ($this->demoListings() as $data) {
            $building = Building::where('name', $data['building'])->first();

            if (! $building) {
                $this->command?->warn("Building not found: {$data['building']} (run BuildingSeeder first)");
                continue;
            }

            // --- listings ---------------------------------------------------
            $listing = Listing::firstOrCreate(
                [
                    'building_id' => $building->id,
                    'user_id' => $users[$data['reporter']]->id,
                    'house_type' => $data['house_type'],
                ],
                [
                    'last_monthly_rent' => $data['rent'],
                    'deposit_amount' => $data['deposit'],
                    'move_out_date' => now()->addDays($data['move_out_in_days'])->toDateString(),
                    'is_vacancy_confirmed_by_reporter' => $data['vacancy_confirmed'],
                    'directions' => $data['directions'],
                    'status' => $data['status'],
                    'expires_at' => isset($data['expires_in_days']) ? now()->addDays($data['expires_in_days']) : null,
                    'trust_score' => $data['trust_score'] ?? 0,
                    'confirmed_count' => $data['confirmed_count'] ?? 0,
                    'last_confirmed_at' => isset($data['last_confirmed_days_ago'])
                        ? now()->subDays($data['last_confirmed_days_ago'])
                        : null,
                ]
            );

            // --- listing_conditions (1:1) ----------------------------------
            if (! empty($data['condition'])) {
                $listing->condition()->updateOrCreate([], $data['condition']);
            }

            // --- listing_reviews (1:1) -------------------------------------
            if (! empty($data['review'])) {
                $review = $data['review'];
                $review['lived_from'] = now()->subMonths($review['lived_from_months_ago'])->toDateString();
                $review['lived_to'] = now()->subMonths($review['lived_to_months_ago'])->toDateString();
                unset($review['lived_from_months_ago'], $review['lived_to_months_ago']);

                $listing->review()->updateOrCreate([], $review);
            }

            // --- listing_comments (with one level of replies) --------------
            foreach ($data['comments'] ?? [] as $comment) {
                $parent = $listing->comments()->firstOrCreate(
                    [
                        'user_id' => $users[$comment['by']]->id,
                        'body' => $comment['body'],
                        'parent_comment_id' => null,
                    ],
                    ['relationship_tag' => $comment['tag']]
                );

                foreach ($comment['replies'] ?? [] as $reply) {
                    $listing->comments()->firstOrCreate(
                        [
                            'user_id' => $users[$reply['by']]->id,
                            'body' => $reply['body'],
                            'parent_comment_id' => $parent->id,
                        ],
                        ['relationship_tag' => $reply['tag']]
                    );
                }
            }

            // --- listing_media ---------------------------------------------
            // Placeholder paths: no real files exist at these locations.
            foreach ($data['media'] ?? [] as $path => $type) {
                $listing->media()->firstOrCreate(['file_path' => $path], ['type' => $type]);
            }

            // --- listing_evidence ------------------------------------------
            foreach ($data['evidence'] ?? [] as $evidence) {
                $listing->evidence()->firstOrCreate(
                    ['type' => $evidence['type']->value],
                    [
                        'file_path' => $evidence['file_path'],
                        'status' => $evidence['status'],
                        'verified_at' => $evidence['status'] === EvidenceStatus::Verified ? now()->subDays(2) : null,
                    ]
                );
            }

            // --- listing_status_histories (append-only audit trail) --------
            if ($listing->statusHistories()->doesntExist()) {
                foreach ($data['history'] as $step) {
                    $system = $step['system'] ?? false;

                    $history = new ListingStatusHistory([
                        'listing_id' => $listing->id,
                        'from_status' => $step['from'],
                        'to_status' => $step['to'],
                        'changed_by_user_id' => $system ? null : $users[$step['by']]->id,
                        'changed_by_system' => $system,
                        'reason' => $step['reason'],
                    ]);
                    // Not fillable (the model only has created_at), so set it directly.
                    $history->created_at = now()->subDays($step['days_ago']);
                    $history->save();
                }
            }
        }
    }

    /** @return array<string, User> */
    private function demoUsers(): array
    {
        // key => [name, email, phone, verified contributor?]
        $definitions = [
            'reporter1' => ['Wanjiku Mwangi', 'demo.wanjiku@example.com', '254700000001', true],
            'reporter2' => ['Brian Otieno', 'demo.brian@example.com', '254700000002', true],
            'tenant' => ['Amina Hassan', 'demo.amina@example.com', '254700000003', false],
            'neighbour' => ['Peter Kamau', 'demo.peter@example.com', '254700000004', false],
        ];

        $users = [];

        foreach ($definitions as $key => [$name, $email, $phone, $verified]) {
            $user = User::where('email', $email)->first();

            if (! $user) {
                $factory = User::factory();
                if ($verified) {
                    $factory = $factory->verifiedContributor();
                }
                // Password is the factory default: "password".
                $user = $factory->create(['name' => $name, 'email' => $email, 'phone' => $phone]);
            }

            $users[$key] = $user;
        }

        // Moderator actions in the history are attributed to the admin when one exists.
        $users['admin'] = User::where('email', 'admin@example.com')->first() ?? $users['reporter1'];

        return $users;
    }

    private function demoListings(): array
    {
        $goodCondition = [
            'water' => 'Reliable, borehole backup',
            'electricity' => 'Stable, KPLC prepaid meter',
            'internet' => 'Fiber ready',
            'plumbing' => 'No known issues',
            'kitchen' => 'Built-in cabinets and granite top',
            'walls_floors' => 'Tiled floors, freshly painted walls',
            'natural_light' => 'Good, south-facing windows',
            'noise' => 'Quiet',
            'security' => '24hr guard, perimeter wall, CCTV at the gate',
            'parking' => 'Allocated parking',
            'garbage_collection' => 'Twice weekly',
            'has_lift' => true,
            'pest_mould_leakage_history' => 'None reported',
            'expected_hidden_costs' => ['garbage_fee' => 500, 'service_charge' => 1500],
        ];

        $mixedCondition = [
            'water' => 'Occasional shortages, tank on the roof',
            'electricity' => 'Stable, KPLC',
            'internet' => 'No fiber, mobile data only',
            'plumbing' => 'Slow drain in the bathroom',
            'kitchen' => 'Open shelving, no cabinets',
            'walls_floors' => 'Cement floors, some wall cracks',
            'natural_light' => 'Average',
            'noise' => 'Moderate street noise at night',
            'security' => 'Night guard only',
            'parking' => 'Street parking only',
            'garbage_collection' => 'Weekly',
            'has_lift' => false,
            'pest_mould_leakage_history' => 'Minor damp during the rains',
            'expected_hidden_costs' => ['garbage_fee' => 300, 'water_bill' => 800],
        ];

        return [
            // 1. Community-confirmed vacant, fully populated.
            [
                'building' => 'Demo Apartments A',
                'reporter' => 'reporter1',
                'house_type' => '2 Bedroom',
                'rent' => 28000,
                'deposit' => 28000,
                'move_out_in_days' => -5,
                'vacancy_confirmed' => true,
                'directions' => 'Second floor, last door on the left. Gate is opposite the water kiosk.',
                'status' => S::CommunityConfirmedVacant,
                'expires_in_days' => 7,
                'trust_score' => 70,
                'confirmed_count' => 3,
                'last_confirmed_days_ago' => 1,
                'condition' => $goodCondition,
                'review' => [
                    'lived_from_months_ago' => 30,
                    'lived_to_months_ago' => 1,
                    'pros' => 'Quiet compound, water was always available, caretaker is responsive.',
                    'cons' => 'Parking fills up on weekends.',
                    'how_repairs_handled' => 'Minor repairs were fixed within a week of reporting.',
                    'recurring_issues' => null,
                    'rent_changed_during_stay' => true,
                    'reason_for_leaving' => 'Relocated for work.',
                ],
                'comments' => [
                    [
                        'by' => 'tenant',
                        'tag' => Tag::PastTenant,
                        'body' => 'I stayed here for two years. Landlord is fair and the water situation is good.',
                        'replies' => [
                            ['by' => 'reporter1', 'tag' => Tag::PastTenant, 'body' => 'Thanks for confirming, still vacant as of this week.'],
                        ],
                    ],
                    [
                        'by' => 'neighbour',
                        'tag' => Tag::Visitor,
                        'body' => 'Walked past yesterday, the unit still has the To Let sign up.',
                    ],
                ],
                'media' => [
                    'listings/demo/apartments-a-2br-1.jpg' => 'photo',
                    'listings/demo/apartments-a-2br-2.jpg' => 'photo',
                    'listings/demo/apartments-a-2br-3.jpg' => 'photo',
                ],
                'evidence' => [
                    ['type' => EvidenceType::PhoneOtp, 'file_path' => null, 'status' => EvidenceStatus::Verified],
                    ['type' => EvidenceType::Photo, 'file_path' => 'evidence/demo/apartments-a-2br-keys.jpg', 'status' => EvidenceStatus::Verified],
                    ['type' => EvidenceType::Receipt, 'file_path' => 'evidence/demo/apartments-a-2br-receipt.pdf', 'status' => EvidenceStatus::Pending],
                ],
                'history' => [
                    ['from' => null, 'to' => S::RecentlyVacated, 'by' => 'reporter1', 'reason' => 'Listing created', 'days_ago' => 6],
                    ['from' => S::RecentlyVacated, 'to' => S::CommunityConfirmedVacant, 'system' => true, 'reason' => 'Still vacant confirmation', 'days_ago' => 1],
                ],
            ],

            // 2. Upcoming vacancy: has a condition report but no review.
            [
                'building' => 'Demo Apartments A',
                'reporter' => 'reporter2',
                'house_type' => 'Bedsitter',
                'rent' => 8500,
                'deposit' => 8500,
                'move_out_in_days' => 10,
                'vacancy_confirmed' => false,
                'directions' => 'Ground floor, next to the caretaker\'s office.',
                'status' => S::UpcomingVacancy,
                'expires_in_days' => 14,
                'trust_score' => 10,
                'condition' => $mixedCondition,
                'comments' => [
                    ['by' => 'neighbour', 'tag' => Tag::Visitor, 'body' => 'Is the tenant really leaving on that date?'],
                ],
                'media' => [
                    'listings/demo/apartments-a-bedsitter-1.jpg' => 'photo',
                ],
                'history' => [
                    ['from' => null, 'to' => S::UpcomingVacancy, 'by' => 'reporter2', 'reason' => 'Listing created', 'days_ago' => 3],
                ],
            ],

            // 3. Possibly occupied: no condition, no review.
            [
                'building' => 'Demo Apartments B',
                'reporter' => 'reporter1',
                'house_type' => '1 Bedroom',
                'rent' => 15000,
                'deposit' => 15000,
                'move_out_in_days' => -20,
                'vacancy_confirmed' => true,
                'directions' => 'Third floor, take the stairs at the back of the building.',
                'status' => S::PossiblyOccupied,
                'trust_score' => 20,
                'comments' => [
                    ['by' => 'tenant', 'tag' => Tag::CurrentTenant, 'body' => 'I think someone moved in on Saturday, saw a moving truck.'],
                ],
                'media' => [
                    'listings/demo/apartments-b-1br-1.jpg' => 'photo',
                    'listings/demo/apartments-b-1br-2.jpg' => 'photo',
                ],
                'evidence' => [
                    ['type' => EvidenceType::Photo, 'file_path' => 'evidence/demo/apartments-b-1br-door.jpg', 'status' => EvidenceStatus::Pending],
                ],
                'history' => [
                    ['from' => null, 'to' => S::RecentlyVacated, 'by' => 'reporter1', 'reason' => 'Listing created', 'days_ago' => 20],
                    ['from' => S::RecentlyVacated, 'to' => S::PossiblyOccupied, 'system' => true, 'reason' => 'Unverified occupancy report', 'days_ago' => 2],
                ],
            ],

            // 4. Occupied, pending confirmation: condition + review + threaded comments + video.
            [
                'building' => 'Demo Towers',
                'reporter' => 'reporter2',
                'house_type' => '3 Bedroom',
                'rent' => 55000,
                'deposit' => 110000,
                'move_out_in_days' => -12,
                'vacancy_confirmed' => true,
                'directions' => 'Penthouse level, lift stops at floor 9 then one flight of stairs.',
                'status' => S::OccupiedPendingConfirmation,
                'trust_score' => 40,
                'confirmed_count' => 1,
                'last_confirmed_days_ago' => 9,
                'condition' => $goodCondition,
                'review' => [
                    'lived_from_months_ago' => 18,
                    'lived_to_months_ago' => 2,
                    'pros' => 'Great views, strong security, fast fiber.',
                    'cons' => 'Service charge went up twice.',
                    'how_repairs_handled' => 'Management responds through a WhatsApp group, usually within a day.',
                    'recurring_issues' => 'Lift was out of service a few times a month.',
                    'rent_changed_during_stay' => true,
                    'reason_for_leaving' => 'Bought a house.',
                ],
                'comments' => [
                    [
                        'by' => 'tenant',
                        'tag' => Tag::PastTenant,
                        'body' => 'Lift outages are the only real annoyance, everything else is solid.',
                        'replies' => [
                            ['by' => 'neighbour', 'tag' => Tag::CurrentTenant, 'body' => 'Agreed, though it has been more reliable since the new year.'],
                            ['by' => 'reporter2', 'tag' => Tag::PastTenant, 'body' => 'Management says a replacement motor is already on order.'],
                        ],
                    ],
                ],
                'media' => [
                    'listings/demo/towers-3br-1.jpg' => 'photo',
                    'listings/demo/towers-3br-2.jpg' => 'photo',
                    'listings/demo/towers-3br-3.jpg' => 'photo',
                    'listings/demo/towers-3br-walkthrough.mp4' => 'video',
                ],
                'evidence' => [
                    ['type' => EvidenceType::PhoneOtp, 'file_path' => null, 'status' => EvidenceStatus::Verified],
                    ['type' => EvidenceType::NationalId, 'file_path' => 'evidence/demo/towers-3br-id.jpg', 'status' => EvidenceStatus::Verified],
                    ['type' => EvidenceType::Agreement, 'file_path' => 'evidence/demo/towers-3br-agreement.pdf', 'status' => EvidenceStatus::Pending],
                ],
                'history' => [
                    ['from' => null, 'to' => S::RecentlyVacated, 'by' => 'reporter2', 'reason' => 'Listing created', 'days_ago' => 12],
                    ['from' => S::RecentlyVacated, 'to' => S::CommunityConfirmedVacant, 'system' => true, 'reason' => 'Still vacant confirmation', 'days_ago' => 9],
                    ['from' => S::CommunityConfirmedVacant, 'to' => S::OccupiedPendingConfirmation, 'system' => true, 'reason' => 'Verified claim + evidence submitted', 'days_ago' => 1],
                ],
            ],

            // 5. Occupied: condition but no review and no comments, rejected evidence.
            [
                'building' => 'Providence Square',
                'reporter' => 'reporter1',
                'house_type' => '1 Bedroom',
                'rent' => 12000,
                'deposit' => 12000,
                'move_out_in_days' => -40,
                'vacancy_confirmed' => true,
                'directions' => 'First floor, opposite the stairwell.',
                'status' => S::Occupied,
                'trust_score' => 85,
                'confirmed_count' => 5,
                'last_confirmed_days_ago' => 15,
                'condition' => $mixedCondition,
                'media' => [
                    'listings/demo/providence-1br-1.jpg' => 'photo',
                    'listings/demo/providence-1br-2.jpg' => 'photo',
                ],
                'evidence' => [
                    ['type' => EvidenceType::Agreement, 'file_path' => 'evidence/demo/providence-1br-agreement.pdf', 'status' => EvidenceStatus::Verified],
                    ['type' => EvidenceType::Receipt, 'file_path' => 'evidence/demo/providence-1br-receipt.jpg', 'status' => EvidenceStatus::Rejected],
                ],
                'history' => [
                    ['from' => null, 'to' => S::RecentlyVacated, 'by' => 'reporter1', 'reason' => 'Listing created', 'days_ago' => 40],
                    ['from' => S::RecentlyVacated, 'to' => S::CommunityConfirmedVacant, 'system' => true, 'reason' => 'Still vacant confirmation', 'days_ago' => 30],
                    ['from' => S::CommunityConfirmedVacant, 'to' => S::OccupiedPendingConfirmation, 'system' => true, 'reason' => 'Verified claim + evidence submitted', 'days_ago' => 16],
                    ['from' => S::OccupiedPendingConfirmation, 'to' => S::Occupied, 'by' => 'admin', 'reason' => 'Tenancy agreement verified', 'days_ago' => 15],
                ],
            ],

            // 6. Bare listing: nothing attached except its first history row.
            [
                'building' => 'MWM',
                'reporter' => 'reporter2',
                'house_type' => 'Bedsitter',
                'rent' => 7000,
                'deposit' => null,
                'move_out_in_days' => 3,
                'vacancy_confirmed' => false,
                'directions' => 'Behind the main gate, blue door.',
                'status' => S::UpcomingVacancy,
                'expires_in_days' => 10,
                'history' => [
                    ['from' => null, 'to' => S::UpcomingVacancy, 'by' => 'reporter2', 'reason' => 'Listing created', 'days_ago' => 1],
                ],
            ],
        ];
    }
}