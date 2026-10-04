<?php

namespace App\Enums;

enum FlagReason: string
{
    case BuildingNotFound = 'building_not_found';
    case InformationInaccurate = 'information_inaccurate';
    case Fraud = 'fraud';
    case Safety = 'safety';
    case Duplicate = 'duplicate';
    case Policy = 'policy';
}
