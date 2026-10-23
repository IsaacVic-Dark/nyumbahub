<?php

namespace App\Http\Controllers\Api;

use App\Enums\EvidenceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingEvidenceRequest;
use App\Http\Resources\ListingEvidenceResource;
use App\Models\Listing;
use App\Models\ListingEvidence;
use App\Enums\EvidenceType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// No generic `update` — status only ever moves via the admin-only verify/
// reject actions below, kept separate from a raw field edit for the same
// audit-trail reason as Listing's status field.
class ListingEvidenceController extends Controller
{
    public function index(Listing $listing)
    {
        $this->authorize('viewAny', [ListingEvidence::class, $listing]);

        $user = request()->user();
        $query = $listing->evidence();

        // National ID documents stay private to the owner and admins
        if (! $user->isAdmin() && $listing->user_id !== $user->id) {
            $query->where('type', '!=', EvidenceType::NationalId->value);
        }

        return ListingEvidenceResource::collection($query->paginate());
    }

    public function store(StoreListingEvidenceRequest $request, Listing $listing)
    {
        $this->authorize('create', [ListingEvidence::class, $listing]);

        $data = \Illuminate\Support\Arr::except($request->validated(), ['file']);

        if ($request->hasFile('file')) {
            // Private disk (storage/app/private): evidence is never publicly served.
            $data['file_path'] = $request->file('file')->store("listing-evidence/{$listing->id}", 'local');
        }

        $evidence = $listing->evidence()->create($data);

        return new ListingEvidenceResource($evidence);
    }

    public function show(ListingEvidence $evidence)
    {
        $this->authorize('view', $evidence);

        return new ListingEvidenceResource($evidence);
    }

    public function update(Request $request, ListingEvidence $evidence)
    {
        $this->authorize('update', $evidence);

        $evidence->update($request->validate([
            'type' => ['sometimes', Rule::enum(EvidenceType::class)],
            'file_path' => ['sometimes', 'string'],
        ]));

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
