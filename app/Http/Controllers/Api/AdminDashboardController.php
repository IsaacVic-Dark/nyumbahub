<?php

namespace App\Http\Controllers\Api;

use App\Enums\DuplicateFlagStatus;
use App\Enums\FlagStatus;
use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Models\CommunityConfirmation;
use App\Models\DuplicateFlag;
use App\Models\FlaggedContent;
use App\Models\Listing;
use App\Models\ListingComment;
use App\Models\ListingStatusHistory;
use App\Models\User;
use App\Support\ListingFilters;
use Illuminate\Http\Request;

/** Read-only numbers + queues for the staff portal. Actions reuse the existing resolve endpoints. */
class AdminDashboardController extends Controller
{
    private function guard(Request $request): void
    {
        abort_unless($request->user()->isAdmin(), 403, 'You do not have permission to perform this action.');
    }

    public function overview(Request $request)
    {
        $this->guard($request);
        $visible = ListingFilters::publicStatuses();
        $totalEver = Listing::withTrashed()->count();
        $removed = Listing::where('status', ListingStatus::Removed->value)->count();

        return response()->json(['data' => [
            'metrics' => [
                'active_reports' => Listing::whereIn('status', $visible)->count(),
                'posted_24h' => Listing::where('created_at', '>=', now()->subDay())->count(),
                'flagged_reports' => FlaggedContent::where('status', FlagStatus::Open->value)->where('flaggable_type', Listing::class)->count(),
                'flagged_comments' => FlaggedContent::where('status', FlagStatus::Open->value)->where('flaggable_type', ListingComment::class)->count(),
                'duplicate_alerts' => DuplicateFlag::where('status', DuplicateFlagStatus::Pending->value)->count(),
                'expiring_7d' => Listing::whereIn('status', $visible)->whereBetween('expires_at', [now(), now()->addDays(7)])->count(),
                'confirmations_today' => CommunityConfirmation::where('created_at', '>=', now()->startOfDay())->count(),
                'users' => User::count(),
                'removed_rate' => $totalEver ? round($removed / $totalEver * 100, 1) : 0,
            ],
            'audit_log' => ListingStatusHistory::query()->with(['changedBy:id,name,role', 'listing:id,house_type'])
                ->latest('id')->limit(10)->get()->map(fn ($h) => [
                    'actor' => $h->changed_by_system ? 'system' : ($h->changedBy?->name ?? 'unknown'),
                    'action' => trim(sprintf(
                        '%s report #%d: %s → %s%s',
                        $h->listing?->house_type ?? 'Listing', $h->listing_id,
                        $h->from_status?->value ?? 'new', $h->to_status->value,
                        $h->reason ? " ({$h->reason})" : '',
                    )),
                    'at' => $h->created_at,
                ]),
        ]]);
    }

    /** tab = flagged | comments | duplicates */
    public function queue(Request $request)
    {
        $this->guard($request);
        $tab = $request->query('tab', 'flagged');

        if ($tab === 'duplicates') {
            $rows = DuplicateFlag::where('status', DuplicateFlagStatus::Pending->value)
                ->with(['listing.building.subEstate.estate', 'listing.reporter:id,name,trust_score', 'duplicateOf'])
                ->latest('id')->limit(50)->get()->map(fn ($d) => [
                    'id' => $d->id, 'kind' => 'duplicate',
                    'report' => $this->listingSummary($d->listing),
                    'contributor' => $this->contributor($d->listing?->reporter),
                    'signals' => $d->listing ? $d->listing->media()->count().' media' : '—',
                    'flag' => "Possible duplicate of report #{$d->duplicate_of_listing_id}",
                    'submitted_at' => $d->created_at,
                ]);

            return response()->json(['data' => $rows]);
        }

        $type = $tab === 'comments' ? ListingComment::class : Listing::class;
        $flags = FlaggedContent::where('status', FlagStatus::Open->value)->where('flaggable_type', $type)
            ->with('flaggable')->latest('id')->limit(50)->get();

        $rows = $flags->map(function (FlaggedContent $f) {
            $target = $f->flaggable;

            if ($target instanceof Listing) {
                $target->loadMissing('building.subEstate.estate', 'reporter:id,name,trust_score');

                return [
                    'id' => $f->id, 'kind' => 'flag',
                    'report' => $this->listingSummary($target),
                    'contributor' => $this->contributor($target->reporter),
                    'signals' => $target->media()->count().' media · '.$target->confirmed_count.' confirmations',
                    'flag' => str_replace('_', ' ', $f->reason->value).($f->details ? ': '.$f->details : ''),
                    'submitted_at' => $f->created_at,
                ];
            }

            $target?->loadMissing('user:id,name,trust_score');

            return [
                'id' => $f->id, 'kind' => 'flag',
                'report' => $target ? '“'.str($target->body)->limit(80).'”' : '(deleted comment)',
                'contributor' => $this->contributor($target?->user),
                'signals' => '—',
                'flag' => str_replace('_', ' ', $f->reason->value).($f->details ? ': '.$f->details : ''),
                'submitted_at' => $f->created_at,
            ];
        });

        return response()->json(['data' => $rows]);
    }

    private function listingSummary(?Listing $l): string
    {
        if (! $l) {
            return '(deleted report)';
        }
        $estate = $l->building?->subEstate?->estate?->name;

        return sprintf('#%d · %s%s · KES %s', $l->id, $l->house_type, $estate ? " · {$estate}" : '', number_format((float) $l->last_monthly_rent));
    }

    private function contributor(?User $u): string
    {
        return $u ? "{$u->name} · Trust {$u->trust_score}" : '—';
    }
}
