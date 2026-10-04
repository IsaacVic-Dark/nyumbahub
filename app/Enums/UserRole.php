<?php

namespace App\Enums;

// Flat role for now per your call — README §9.3 leaves room for a
// `moderator` sub-tier later; add a case here when that's needed, no
// migration required since `role` is a plain string column.
enum UserRole: string
{
    case User = 'user';
    case Admin = 'admin';
}
