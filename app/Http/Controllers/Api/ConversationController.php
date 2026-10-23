<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use App\Services\Notifier;
use Illuminate\Http\Request;

/**
 * Private, optional questions between a house seeker and the former tenant
 * who reported a listing. Phone numbers / names are never exposed: each side
 * only sees "A house seeker" or "Former tenant".
 */
class ConversationController extends Controller
{
    private const EXPIRY_DAYS = 30;

    private function present(Conversation $c, int $userId, bool $withMessages = false): array
    {
        $asOwner = $c->owner_id === $userId;
        $listing = $c->listing;
        $estate = $listing?->building?->subEstate?->estate;
        $last = $c->relationLoaded('messages') ? $c->messages->last() : null;

        return [
            'id' => $c->id,
            'listing_id' => $c->listing_id,
            'listing_label' => $listing ? trim($listing->house_type.($estate ? ' · '.$estate->name : '')) : null,
            'status' => $c->status,
            'as_owner' => $asOwner,
            'counterpart' => $asOwner ? 'A house seeker' : 'Former tenant',
            'blocked_by_me' => $c->blocked_by_id === $userId,
            'expires_at' => $c->expires_at,
            'is_expired' => $c->isExpired(),
            'last_message' => $last ? ['body' => $last->body, 'created_at' => $last->created_at] : null,
            'messages' => $withMessages ? $c->messages->map(fn (Message $m) => [
                'id' => $m->id,
                'from' => $m->sender_id === $userId ? 'me' : 'them',
                'body' => $m->body,
                'created_at' => $m->created_at,
            ])->values() : null,
            'created_at' => $c->created_at,
        ];
    }

    private function mine(Request $request, Conversation $conversation): Conversation
    {
        abort_unless($conversation->hasParticipant($request->user()), 403);

        return $conversation->load('listing.building.subEstate.estate', 'messages');
    }

    public function index(Request $request)
    {
        $id = $request->user()->id;

        $items = Conversation::query()
            ->where(fn ($q) => $q->where('seeker_id', $id)->orWhere('owner_id', $id))
            ->with('listing.building.subEstate.estate', 'messages')
            ->latest('updated_at')->get()
            ->map(fn ($c) => $this->present($c, $id));

        return response()->json(['data' => $items]);
    }

    public function show(Request $request, Conversation $conversation)
    {
        return response()->json(['data' => $this->present($this->mine($request, $conversation), $request->user()->id, true)]);
    }

    /** A seeker opens a conversation about a listing with their first question. */
    public function store(Request $request, Listing $listing)
    {
        $data = $request->validate(['body' => ['required', 'string', 'max:1000']]);
        $user = $request->user();

        abort_if($listing->user_id === $user->id, 403, 'You cannot message yourself about your own report.');

        $listing->loadMissing('reporter');
        $owner = $listing->reporter;
        abort_unless($owner && $owner->privacy('allow_questions', true), 403, 'This contributor is not accepting questions.');
        $until = $owner->privacy('messages_disabled_after', null);
        abort_if($until && now()->startOfDay()->gt(\Carbon\Carbon::parse($until)->endOfDay()), 403, 'This contributor has turned off new messages.');

        $conversation = Conversation::firstOrCreate(
            ['listing_id' => $listing->id, 'seeker_id' => $user->id],
            ['owner_id' => $listing->user_id, 'status' => 'pending', 'expires_at' => now()->addDays(self::EXPIRY_DAYS)],
        );

        abort_if(in_array($conversation->status, ['declined', 'blocked'], true), 403, 'This conversation is closed.');
        abort_if($conversation->status === 'accepted' && $conversation->isExpired(), 403, 'This conversation has expired.');
        abort_if(
            $conversation->status === 'pending' && ! $conversation->wasRecentlyCreated,
            422, 'Your first question is still waiting for the contributor to respond.',
        );

        $conversation->messages()->create(['sender_id' => $user->id, 'body' => $data['body']]);
        $conversation->touch();

        Notifier::send($listing->user_id, 'you', 'Someone asked you a question', '"'.str($data['body'])->limit(120).'"', $listing, '💬');

        return response()->json(['data' => $this->present($this->mine($request, $conversation), $user->id, true)], 201);
    }

    public function sendMessage(Request $request, Conversation $conversation)
    {
        $conversation = $this->mine($request, $conversation);
        $data = $request->validate(['body' => ['required', 'string', 'max:1000']]);
        $user = $request->user();

        abort_unless($conversation->status === 'accepted', 403, 'Messages can be sent once the contributor accepts the request.');
        abort_if($conversation->isExpired(), 403, 'This conversation has expired.');

        $conversation->messages()->create(['sender_id' => $user->id, 'body' => $data['body']]);
        $conversation->touch();

        $otherId = $conversation->seeker_id === $user->id ? $conversation->owner_id : $conversation->seeker_id;
        Notifier::send($otherId, 'you', 'New message', '"'.str($data['body'])->limit(120).'"', $conversation->listing, '💬');

        return response()->json(['data' => $this->present($this->mine($request, $conversation), $user->id, true)], 201);
    }

    /** The contributor accepts or declines a message request. */
    public function respond(Request $request, Conversation $conversation)
    {
        $data = $request->validate(['action' => ['required', 'in:accept,decline']]);
        abort_unless($conversation->owner_id === $request->user()->id, 403);
        abort_unless($conversation->status === 'pending', 422, 'This request has already been answered.');

        $conversation->update([
            'status' => $data['action'] === 'accept' ? 'accepted' : 'declined',
            'expires_at' => now()->addDays(self::EXPIRY_DAYS),
        ]);

        if ($data['action'] === 'accept') {
            Notifier::send($conversation->seeker_id, 'you', 'Your question was accepted', null, $conversation->listing, '💬');
        }

        return response()->json(['data' => $this->present($this->mine($request, $conversation), $request->user()->id, true)]);
    }

    public function block(Request $request, Conversation $conversation)
    {
        abort_unless($conversation->hasParticipant($request->user()), 403);

        $conversation->update(['status' => 'blocked', 'blocked_by_id' => $request->user()->id]);

        return response()->json(['data' => $this->present($this->mine($request, $conversation), $request->user()->id, true)]);
    }
}
