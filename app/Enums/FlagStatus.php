<?php

namespace App\Enums;

enum FlagStatus: string
{
    case Open = 'open';
    case Actioned = 'actioned';
    case Dismissed = 'dismissed';
}
