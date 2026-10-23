<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserNotificationResource;
use App\Models\UserNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['category' => ['sometimes', 'in:saved,alerts,you,account']]);

        $query = $request->user()->userNotifications()
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->query('category')))
            ->latest('id');

        return UserNotificationResource::collection($query->paginate(30))->additional([
            'unread_count' => $request->user()->userNotifications()->whereNull('read_at')->count(),
        ]);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'unread_count' => $request->user()->userNotifications()->whereNull('read_at')->count(),
        ]);
    }

    public function markRead(Request $request, UserNotification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['read_at' => $notification->read_at ?? now()]);

        return new UserNotificationResource($notification);
    }

    public function markAllRead(Request $request)
    {
        $request->user()->userNotifications()->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['unread_count' => 0]);
    }
}
