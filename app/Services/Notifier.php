<?php

namespace App\Services;

use App\Enums\ListingStatus;
use App\Models\Listing;
use App\Models\User;
use App\Models\UserNotification;

/**
 * Creates in-app notifications (the "Activity centre"). Email / SMS / push
 * delivery is not implemented — this only writes rows to user_notifications.
 */
class Notifier
{
    /** @param int|User|iterable<int|User> $users */
    public static function send(
        int|User|iterable $users,
        string $category,
        string $title,
        ?string $body = null,
        ?Listing $listing = null,
        ?string $icon = null,
        ?int $exceptUserId = null,
    ): void {
        $ids = collect(is_iterable($users) ? $users : [$users])
            ->map(fn ($u) => $u instanceof User ? $u->id : (int) $u)
            ->unique()
            ->reject(fn ($id) => $id === $exceptUserId);

        foreach ($ids as $id) {
            UserNotification::create([
                'user_id' => $id,
                'listing_id' => $listing?->id,
                'category' => $category,
                'icon' => $icon,
                'title' => $title,
                'body' => $body,
            ]);
        }
    }

    /** Short "Bedsitter in South B" label used in notification bodies. */
    public static function label(Listing $listing): string
    {
        $listing->loadMissing('building.subEstate.estate.town');
        $estate = $listing->building?->subEstate?->estate;

        return trim($listing->house_type.($estate ? ' in '.$estate->name : ''));
    }

    public static function toSavers(Listing $listing, string $title, ?string $body, string $icon, ?int $exceptUserId = null): void
    {
        self::send(
            $listing->savedBy()->pluck('users.id'),
            'saved', $title, $body ?? self::label($listing), $listing, $icon, $exceptUserId,
        );
    }

    public static function listingStatusChanged(Listing $listing, ListingStatus $to, ?int $actorId = null): void
    {
        match ($to) {
            ListingStatus::CommunityConfirmedVacant => self::toSavers($listing, 'A saved home was confirmed vacant', null, '✅', $actorId),
            ListingStatus::PossiblyOccupied,
            ListingStatus::OccupiedPendingConfirmation,
            ListingStatus::Occupied => self::toSavers($listing, 'A saved home may be occupied', null, '⚠️', $actorId),
            ListingStatus::Unconfirmed => self::send(
                $listing->user_id, 'you', 'Your report is due for reconfirmation', self::label($listing), $listing, '🔄',
            ),
            default => null,
        };
    }
}
