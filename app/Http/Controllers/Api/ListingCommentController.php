<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingCommentRequest;
use App\Http\Requests\UpdateListingCommentRequest;
use App\Http\Resources\ListingCommentResource;
use App\Models\Listing;
use App\Models\ListingComment;

class ListingCommentController extends Controller
{
    public function index(Listing $listing)
    {
        return ListingCommentResource::collection(
            $listing->comments()->with('user')->whereNull('parent_comment_id')->with('replies.user')->paginate()
        );
    }

    public function store(StoreListingCommentRequest $request, Listing $listing)
    {
        $comment = $listing->comments()->create($request->validated() + [
            'user_id' => $request->user()->id,
        ]);

        return new ListingCommentResource($comment->load('user'));
    }

    public function update(UpdateListingCommentRequest $request, ListingComment $comment)
    {
        $comment->update($request->validated());

        return new ListingCommentResource($comment);
    }

    public function destroy(ListingComment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->noContent();
    }
}
