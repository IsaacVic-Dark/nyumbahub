<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingStatusHistoryResource;
use App\Models\Listing;

// Read-only — see NOTES.md; write access to this table only ever happens
// through Listing::transitionTo(), never directly via the API.
class ListingStatusHistoryController extends Controller
{
    public function index(Listing $listing)
    {
        return ListingStatusHistoryResource::collection(
            $listing->statusHistories()->latest('created_at')->paginate()
        );
    }
}
