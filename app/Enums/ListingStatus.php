<?php

namespace App\Enums;

enum ListingStatus: string
{
    case UpcomingVacancy = 'upcoming_vacancy';
    case RecentlyVacated = 'recently_vacated';
    case CommunityConfirmedVacant = 'community_confirmed_vacant';
    case Unconfirmed = 'unconfirmed';
    case PossiblyOccupied = 'possibly_occupied';
    case OccupiedPendingConfirmation = 'occupied_pending_confirmation';
    case Occupied = 'occupied';
    case Archived = 'archived';
    case Removed = 'removed';
}
