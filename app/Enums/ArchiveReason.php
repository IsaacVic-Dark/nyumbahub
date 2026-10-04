<?php

namespace App\Enums;

enum ArchiveReason: string
{
    case Expired = 'expired';
    case OccupiedOtherChannel = 'occupied_other_channel';
    case Moderated = 'moderated';
    case Duplicate = 'duplicate';
}
