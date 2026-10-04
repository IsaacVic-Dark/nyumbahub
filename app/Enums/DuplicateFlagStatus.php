<?php

namespace App\Enums;

enum DuplicateFlagStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Rejected = 'rejected';
}
