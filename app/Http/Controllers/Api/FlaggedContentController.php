<?php

namespace App\Http\Controllers\Api;

use App\Enums\FlagStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ResolveFlaggedContentRequest;
use App\Http\Requests\StoreFlaggedContentRequest;
use App\Http\Resources\FlaggedContentResource;
use App\Models\FlaggedContent;
use App\Models\ListingComment;

// Top-level (not nested under Listing) since a flag targets a polymorphic
// `flaggable` — a listing or a comment (README §4.8).
class FlaggedContentController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', FlaggedContent::class);

        return FlaggedContentResource::collection(
            FlaggedContent::where('status', FlagStatus::Open)->paginate()
        );
    }

    public function store(StoreFlaggedContentRequest $request)
    {
        $flaggableClass = $request->validated('flaggable_type') === 'listing'
            ? \App\Models\Listing::class
            : ListingComment::class;

        $flag = FlaggedContent::create([
            'flaggable_type' => $flaggableClass,
            'flaggable_id' => $request->validated('flaggable_id'),
            'flagged_by_user_id' => $request->user()->id,
            'reason' => $request->validated('reason'),
            'details' => $request->validated('details'),
        ]);

        return new FlaggedContentResource($flag);
    }

    public function show(FlaggedContent $flaggedContent)
    {
        $this->authorize('view', $flaggedContent);

        return new FlaggedContentResource($flaggedContent);
    }

    public function resolve(ResolveFlaggedContentRequest $request, FlaggedContent $flaggedContent)
    {
        $flaggedContent->update([
            'status' => $request->validated('status'),
            'resolved_by_admin_id' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        // "typically resulting in `removed`" — README §4.8
        if ($request->validated('status') === 'actioned' && $flaggedContent->flaggable instanceof \App\Models\Listing) {
            $flaggedContent->flaggable->transitionTo(
                \App\Enums\ListingStatus::Removed,
                $request->user(),
                reason: 'Moderation: flag actioned'
            );
        }

        return new FlaggedContentResource($flaggedContent);
    }
}
