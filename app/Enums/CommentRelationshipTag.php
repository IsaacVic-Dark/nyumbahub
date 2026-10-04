<?php

namespace App\Enums;

enum CommentRelationshipTag: string
{
    case PastTenant = 'past_tenant';
    case CurrentTenant = 'current_tenant';
    case Visitor = 'visitor';
}
