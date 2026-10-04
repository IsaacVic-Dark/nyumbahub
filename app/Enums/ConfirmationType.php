<?php

namespace App\Enums;

enum ConfirmationType: string
{
    case StillVacant = 'still_vacant';
    case NewTenantMovedIn = 'new_tenant_moved_in';
    case Occupied = 'occupied';
    case RentChanged = 'rent_changed';
    case BuildingNotFound = 'building_not_found';
    case InformationInaccurate = 'information_inaccurate';
}
