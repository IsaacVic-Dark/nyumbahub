import { Head, Link, router } from '@inertiajs/react';
import {
    Ban,
    Camera,
    CheckCircle2,
    Compass,
    Flag,
    Heart,
    Home,
    MapPin,
    MessageCircle,
    Share2,
    Video,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { KvList } from '@/components/nyumba/kv-list';
import { ApproximateAreaMap } from '@/components/nyumba/listing-map';
import { ListingCard } from '@/components/nyumba/listing-card';
import { RatingStars } from '@/components/nyumba/rating-stars';
import { ReportIssueDialog } from '@/components/nyumba/report-issue-dialog';
import { ScoreRow } from '@/components/nyumba/score-row';
import { ErrorCard } from '@/components/nyumba/states';
import { ListingStatusBadge, VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSaveListing } from '@/hooks/use-saved-listings';
import { api, getErrorMessage } from '@/lib/api';
import type { Paginated } from '@/lib/api';
import { formatMonthYear, timeAgo } from '@/lib/format';
import {
    CONDITION_FIELDS,
    EXPERIENCE_KEYS,
    formatKes,
    QUICK_QUESTIONS,
    scoreLabel,
} from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Confirmation, Listing } from '@/types/nyumba';

function AskDialog({ listing }: { listing: Listing }) {
    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    const send = async () => {
        if (!body.trim()) return;
        setSending(true);
        try {
            const res = await api.post<{ data: { id: number } }>(`/listings/${listing.id}/conversations`, {
                body: body.trim(),
            });
            toast('Question sent. You will be notified when the contributor responds.');
            setOpen(false);
            router.visit(`/messages?c=${res.data.data.id}`);
        } catch (e) {
            toast.error(getErrorMessage(e));
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <MessageCircle className="size-4" /> Ask former tenant
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask the former tenant</DialogTitle>
                    <DialogDescription>
                        Private and optional. Never share ID numbers, M-Pesa
                        details or documents in a message.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                        <button
                            key={q}
                            type="button"
                            onClick={() => setBody(q)}
                            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-stone-300"
                        >
                            {q}
                        </button>
                    ))}
                </div>
                <Textarea
                    placeholder="Write your question…"
                    value={body}
                    maxLength={1000}
                    onChange={(e) => setBody(e.target.value)}
                />
                <DialogFooter>
                    <Button className="w-full" disabled={sending || !body.trim()} onClick={() => void send()}>
                        Send question
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ListingShow({ id }: { id: string }) {
    const { data, loading, error, reload } = useApi<{ data: Listing }>(`/listings/${id}`);
    const confirmations = useApi<Paginated<Confirmation>>(`/listings/${id}/confirmations`);
    const similar = useApi<{ data: Listing[] }>(`/listings/${id}/similar`);
    const listing = data?.data;

    const { saved, toggle } = useSaveListing(Number(id), listing?.is_saved ?? false);
    // Vote overrides (toggled in this session) keyed by confirmation id.
    const [votes, setVotes] = useState<Record<number, { count: number; mine: boolean }>>({});

    if (error) {
        return (
            <div className="py-10">
                <ErrorCard message={error} onRetry={reload} />
            </div>
        );
    }

    if (loading || !listing) {
        return (
            <div className="flex flex-col gap-4 py-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-8 w-3/5" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    const loc = listing.location;
    const d = listing.details ?? {};
    const photos = (listing.media ?? []).filter((m) => m.type === 'photo');
    const videos = (listing.media ?? []).filter((m) => m.type === 'video');
    const scores = listing.condition?.scores ?? {};
    const costs = listing.condition?.expected_hidden_costs ?? {};
    const review = listing.review;
    const area = [loc?.estate?.name, loc?.town?.name].filter(Boolean).join(', ');

    const share = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: listing.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                toast('Link copied');
            }
        } catch {
            // user dismissed the share sheet
        }
    };

    const directionsUrl =
        loc?.latitude != null && loc?.longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([loc?.estate?.name, loc?.town?.name, 'Kenya'].filter(Boolean).join(' '))}`;

    const toggleHelpful = async (c: Confirmation) => {
        try {
            const res = await api.post<{ is_helpful: boolean; helpful_count: number }>(
                `/confirmations/${c.id}/helpful`,
            );
            setVotes((v) => ({ ...v, [c.id]: { count: res.data.helpful_count, mine: res.data.is_helpful } }));
            if (res.data.is_helpful) toast('Marked as helpful');
        } catch (e) {
            toast.error(getErrorMessage(e));
        }
    };

    const experienceRows = EXPERIENCE_KEYS.filter((k) => scores[k] && scores[k].score > 0);
    const hasExperience = experienceRows.length > 0 || review;

    return (
        <div className="flex flex-col gap-6 pb-12">
            <Head title={listing.title} />

            <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/explore">← Back</Link>
                </Button>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => void share()}>
                        <Share2 className="size-4" /> Share
                    </Button>
                    {!listing.is_owner && (
                        <ReportIssueDialog
                            listingId={listing.id}
                            trigger={
                                <Button variant="ghost" size="sm">
                                    <Flag className="size-4" /> Report
                                </Button>
                            }
                        />
                    )}
                    <Button variant={saved ? 'secondary' : 'ghost'} size="sm" onClick={() => void toggle()}>
                        <Heart className={cn('size-4', saved && 'fill-red-600 text-red-600')} />
                        {saved ? 'Saved' : 'Save'}
                    </Button>
                </div>
            </div>

            {/* GALLERY */}
            {photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {photos.slice(0, 3).map((m, i) => (
                        <div
                            key={m.id}
                            className={cn(
                                'relative aspect-video overflow-hidden rounded-xl bg-stone-100',
                                i === 0 && 'col-span-3 aspect-video sm:col-span-1 sm:row-span-2 sm:aspect-square',
                            )}
                        >
                            {m.url && <img src={m.url} alt={m.label ?? 'Home photo'} className="h-full w-full object-cover" />}
                            {m.label && (
                                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                                    {m.label}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex aspect-video max-h-64 w-full items-center justify-center rounded-xl bg-stone-100 text-stone-300">
                    <Home className="size-16" />
                </div>
            )}
            <div className="-mt-4 flex items-center gap-2 text-xs text-stone-500">
                {listing.photos_count > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                        <Camera className="size-3" /> {listing.photos_count} photos
                    </span>
                )}
                {listing.has_video && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                        <Video className="size-3" /> Move-out video
                    </span>
                )}
                <span className="ml-auto">Unit number hidden for privacy</span>
            </div>

            {/* TITLE */}
            <div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <ListingStatusBadge status={listing.status} />
                    {listing.badges.map((b) => (
                        <VerificationBadgePill key={b} badge={b} />
                    ))}
                </div>
                <h1 className="mt-3 text-2xl font-extrabold text-stone-900">{listing.title}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                    <MapPin className="size-4" /> Approximate area: {area}
                    {loc?.county ? ` · ${loc.county.name} County` : ''}
                </p>
            </div>

            {/* PRICE CARD */}
            <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                    <div className="text-2xl font-extrabold text-stone-900">
                        {formatKes(listing.last_monthly_rent)}{' '}
                        <span className="text-sm font-normal text-stone-500">per month (last known)</span>
                    </div>
                    {listing.deposit_amount !== null && (
                        <p className="mt-1 text-sm text-stone-500">
                            Last known deposit: {formatKes(listing.deposit_amount)}
                        </p>
                    )}
                </div>
                <div className="text-right text-sm text-stone-600">
                    <div>
                        Reported vacant: <b>{timeAgo(listing.created_at)}</b>
                    </div>
                    <div>
                        Last community confirmation:{' '}
                        <b>{listing.last_confirmed_at ? timeAgo(listing.last_confirmed_at) : 'Not yet confirmed'}</b>
                    </div>
                </div>
            </Card>

            <div className="rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                ⚠️ This is a tenant-reported vacancy, not an official property
                listing. Rent and availability may change. Confirm details at
                the building before making any payment.
            </div>

            {/* MAP */}
            {loc?.latitude != null && loc?.longitude != null && (
                <ApproximateAreaMap
                    latitude={loc.latitude}
                    longitude={loc.longitude}
                    className="z-0 h-48 overflow-hidden rounded-xl"
                />
            )}

            {/* ACTIONS */}
            <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild>
                    <a href={directionsUrl} target="_blank" rel="noreferrer">
                        <Compass className="size-4" /> Get directions
                    </a>
                </Button>
                {!listing.is_owner && <AskDialog listing={listing} />}
                {!listing.is_owner && (
                    <>
                        <Button variant="outline" asChild>
                            <Link href={`/listings/${listing.id}/confirm?type=still_vacant`}>
                                <CheckCircle2 className="size-4" /> I checked: still vacant
                            </Link>
                        </Button>
                        <Button variant="destructive" asChild>
                            <Link href={`/listings/${listing.id}/confirm?type=occupied`}>
                                <Ban className="size-4" /> Report as occupied
                            </Link>
                        </Button>
                    </>
                )}
            </div>

            {/* AT A GLANCE */}
            <Card className="p-5">
                <h3 className="mb-2 text-sm font-bold text-stone-900">At a glance</h3>
                <KvList
                    rows={[
                        ['Property type', listing.house_type],
                        ['Bedrooms', listing.bedrooms === null ? null : listing.bedrooms ? String(listing.bedrooms) : 'Studio / open plan'],
                        ['Bathrooms', listing.bathrooms === null ? null : String(listing.bathrooms)],
                        ['Floor', d.floor],
                        ['Features', d.features?.length ? d.features.join(', ') : null],
                        ['Furnishing', d.furnishing],
                        ['Pets', d.pets],
                        ['Internet', d.internet?.length ? d.internet.join(', ') : null],
                        ['Security', scoreLabel(scores['Security'])],
                        ['Water', [d.water_source, scoreLabel(scores['Water reliability'])].filter(Boolean).join(' — ') || null],
                        ['Electricity', d.electricity],
                    ]}
                />
            </Card>

            {/* LAST-KNOWN COSTS */}
            <Card className="p-5">
                <h3 className="text-sm font-bold text-stone-900">Last-known costs</h3>
                <p className="mb-2 text-xs text-stone-500">
                    Reported by the former tenant. Costs may have changed since move-out.
                </p>
                <KvList
                    rows={[
                        ['Monthly rent', formatKes(listing.last_monthly_rent)],
                        ['Deposit', listing.deposit_amount !== null ? formatKes(listing.deposit_amount) : null],
                        ['Water charges', costs.water],
                        ['Garbage collection', costs.garbage],
                        ['Service charge', costs.service_charge],
                        ['Parking', costs.parking],
                        ['Other regular costs', costs.other],
                        ['Estimated move-in cost', costs.move_in_total],
                    ]}
                />
                {costs.note && (
                    <div className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
                        💡 Hidden-cost note: &ldquo;{costs.note}&rdquo;
                    </div>
                )}
            </Card>

            {/* TENANT EXPERIENCE */}
            {hasExperience && (
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-stone-900">
                            Former tenant&rsquo;s lived experience
                        </h3>
                        {listing.badges.includes('tenant') && <VerificationBadgePill badge="tenant" />}
                    </div>
                    {listing.rating !== null && (
                        <div className="mt-2 flex items-center gap-2">
                            <RatingStars rating={listing.rating} />
                            <b className="text-sm text-stone-900">{listing.rating}/5 overall</b>
                        </div>
                    )}
                    <div className="mt-2">
                        {experienceRows.map((k) => (
                            <ScoreRow key={k} label={k} score={scores[k].score} />
                        ))}
                    </div>
                    {review?.pros && <p className="mt-3 text-sm text-stone-700 italic">&ldquo;{review.pros}&rdquo;</p>}
                    {review?.cons && (
                        <p className="mt-2 text-sm text-stone-600">
                            <b>Know before moving in:</b> {review.cons}
                        </p>
                    )}
                    {review?.recurring_issues && (
                        <p className="mt-2 text-sm text-stone-600">
                            <b>Issues:</b> {review.recurring_issues}
                        </p>
                    )}
                    {review?.advice && (
                        <p className="mt-2 text-sm text-stone-600">
                            <b>Advice:</b> {review.advice}
                        </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {review?.lived_from && (
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                                Lived here: {formatMonthYear(review.lived_from)}
                                {review.lived_to ? ` – ${formatMonthYear(review.lived_to)}` : ''}
                            </span>
                        )}
                        {review?.reason_for_leaving && (
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                                Reason for leaving: {review.reason_for_leaving}
                            </span>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-stone-400">
                        Opinions in this section are one person&rsquo;s experience. Facts such as dates
                        and confirmations are labelled separately.
                    </p>
                </Card>
            )}

            {/* CONDITION REPORT */}
            {Object.keys(scores).length > 0 && (
                <Card className="p-5">
                    <h3 className="mb-1 text-sm font-bold text-stone-900">Detailed condition report</h3>
                    <div>
                        {CONDITION_FIELDS.filter((k) => scores[k]).map((k) => (
                            <ScoreRow key={k} label={k} score={scores[k].score} note={scores[k].note ?? undefined} />
                        ))}
                    </div>
                </Card>
            )}

            {/* PHOTOS & VIDEO */}
            {(photos.length > 3 || videos.length > 0) && (
                <Card className="p-5">
                    <h3 className="mb-3 text-sm font-bold text-stone-900">Photos and video</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {photos.slice(3).map((m) => (
                            <div key={m.id} className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                                {m.url && <img src={m.url} alt={m.label ?? 'Home photo'} loading="lazy" className="h-full w-full object-cover" />}
                                {m.label && (
                                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                                        {m.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    {videos.map((m) => (
                        <video key={m.id} src={m.url ?? undefined} controls className="mt-3 w-full rounded-lg" />
                    ))}
                    <p className="mt-2 text-xs text-stone-400">
                        Documents are used only to verify a contributor&rsquo;s connection to a home.
                        They are never publicly displayed.
                    </p>
                </Card>
            )}

            {/* LOCATION & ACCESS */}
            <Card className="p-5">
                <h3 className="mb-2 text-sm font-bold text-stone-900">Location and access</h3>
                <KvList
                    rows={[
                        ['Estate', loc?.estate?.name],
                        ['Area', loc?.sub_estate?.name],
                        ['Building', loc?.building?.name],
                        ['Nearby facilities', d.facilities?.length ? d.facilities.join(', ') : null],
                        ['Nearest matatu stage', listing.nearest_stage],
                        [
                            'Directions',
                            listing.directions ??
                                (listing.directions_restricted
                                    ? 'Shared only with phone-verified members'
                                    : null),
                        ],
                    ]}
                />
                <div className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
                    🔐 The exact unit number is never published. It may be shared privately by the
                    contributor if they choose.
                </div>
            </Card>

            {/* COMMUNITY CONFIRMATIONS */}
            <Card className="p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">Community confirmations</h3>
                    {!listing.is_owner && (
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={`/listings/${listing.id}/confirm`}>I visited this location</Link>
                        </Button>
                    )}
                </div>
                <div className="mt-3 flex flex-col gap-4">
                    {confirmations.loading && <Skeleton className="h-16 w-full" />}
                    {confirmations.error && <p className="text-sm text-stone-500">{confirmations.error}</p>}
                    {confirmations.data && confirmations.data.data.length === 0 && (
                        <p className="text-sm text-stone-500">
                            No one has confirmed this report yet. If you visit, tell the community what you find.
                        </p>
                    )}
                    {confirmations.data?.data.map((c) => {
                        const v = votes[c.id] ?? { count: c.helpful_count, mine: c.is_helpful };

                        return (
                            <div key={c.id} className="border-l-2 border-emerald-200 pl-4">
                                <div className="flex items-center justify-between">
                                    <b className="text-sm text-stone-900">{c.who}</b>
                                    <span className="text-xs text-stone-400">{timeAgo(c.created_at)}</span>
                                </div>
                                <p className="mt-1 text-sm text-stone-600">{c.text}</p>
                                <button
                                    type="button"
                                    disabled={c.is_mine}
                                    onClick={() => void toggleHelpful(c)}
                                    className={cn(
                                        'mt-1.5 rounded-full border px-2.5 py-1 text-xs font-medium hover:border-stone-300 disabled:opacity-50',
                                        v.mine ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-600',
                                    )}
                                >
                                    👍 Helpful ({v.count})
                                </button>
                            </div>
                        );
                    })}
                </div>
                <p className="mt-3 text-xs text-stone-400">
                    Contributor names are always anonymised. Phone numbers are never shown.
                </p>
            </Card>

            {/* SIMILAR NEARBY */}
            {similar.data && similar.data.data.length > 0 && (
                <div>
                    <h3 className="mb-3 text-lg font-extrabold text-stone-900">Similar nearby reports</h3>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {similar.data.data.map((l) => (
                            <ListingCard key={l.id} listing={l} />
                        ))}
                    </div>
                </div>
            )}

            {!listing.is_owner && (
                <ReportIssueDialog
                    listingId={listing.id}
                    trigger={
                        <Button variant="ghost" className="w-full">
                            🚩 Report an issue with this report
                        </Button>
                    }
                />
            )}
        </div>
    );
}
