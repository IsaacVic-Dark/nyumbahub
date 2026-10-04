<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

// Laravel 11+'s default skeleton ships this as a bare abstract class —
// re-adding AuthorizesRequests here since several controllers below use
// $this->authorize(...).
abstract class Controller
{
    use AuthorizesRequests;
}
