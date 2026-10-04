<?php

namespace App\Http\Controllers\Api;

use App\Enums\EvidenceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingEvidenceRequest;
use App\Http\Resources\ListingEvidenceResource;
use App\Models\Listing;
use App\Models\ListingEvidence;

// No generic `update` — status only ever moves via the admin-only verify/
// reject actions below, kept separate from a raw field edit for the same
// audit-trail reason as Listing's status field.
class ListingEvidenceController extends Controller
{
    public function index(Listing $listing)
    {
        abort_unless(
            request()->user()->isAdmin() || $listing->user_id === request()->user()->id,
            403
        );

        return ListingEvidenceResource::collection($listing->evidence()->paginate());
    }

    public function store(StoreListingEvidenceRequest $request, Listing $listing)
    {
        $evidence = $listing->evidence()->create($request->validated());

        return new ListingEvidenceResource($evidence);
    }

    public function show(ListingEvidence $evidence)
    {
        $this->authorize('view', $evidence);

        return new ListingEvidenceResource($evidence);
    }

    public function destroy(ListingEvidence $evidence)
    {
        $this->authorize('delete', $evidence);

        $evidence->delete();

        return response()->noContent();
    }

    public function verify(ListingEvidence $evidence)
    {
        $this->authorize('verify', ListingEvidence::class);

        $evidence->update(['status' => EvidenceStatus::Verified, 'verified_at' => now()]);

        return new ListingEvidenceResource($evidence);
    }

    public function reject(ListingEvidence $evidence)
    {
        $this->authorize('verify', ListingEvidence::class);

        $evidence->update(['status' => EvidenceStatus::Rejected]);

        return new ListingEvidenceResource($evidence);
    }
}
