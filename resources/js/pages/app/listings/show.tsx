import { Head, Link } from '@inertiajs/react';
import {
    Ban,
    Camera,
    CheckCircle2,
    Compass,
    Flag,
    Heart,
    MapPin,
    MessageCircle,
    Share2,
    Video,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { KvList } from '@/components/nyumba/kv-list';
import { ListingCard } from '@/components/nyumba/listing-card';
import { RatingStars } from '@/components/nyumba/rating-stars';
import { ReportIssueDialog } from '@/components/nyumba/report-issue-dialog';
import { ScoreRow } from '@/components/nyumba/score-row';
import { ListingStatusBadge, VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSavedListings } from '@/hooks/use-saved-listings';
import {
    CONDITION_REPORT,
    EVIDENCE_PHOTO_LABELS,
    formatKes,
    GALLERY_LABELS,
    MOCK_CONFIRMATIONS,
    MOCK_LISTINGS,
    PLACEHOLDER_PHOTOS,
} from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';

export default function ListingShow({ id }: { id: string }) {
    const listing = MOCK_LISTINGS.find((l) => l.id === id) ?? MOCK_LISTINGS[0];
    const { isSaved, toggle } = useSavedListings();
    const saved = isSaved(listing.id);
    const [helpful, setHelpful] = useState<number[]>(
        MOCK_CONFIRMATIONS.map((c) => c.helpful),
    );

    const similar = MOCK_LISTINGS.filter((l) => l.id !== listing.id).slice(0, 3);

    return (
        <div className="flex flex-col gap-6 pb-12">
            <Head title={listing.title} />

            <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/explore">← Back</Link>
                </Button>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast('Link copied')}
                    >
                        <Share2 className="size-4" /> Share
                    </Button>
                    <ReportIssueDialog
                        trigger={
                            <Button variant="ghost" size="sm">
                                <Flag className="size-4" /> Report
                            </Button>
                        }
                    />
                    <Button
                        variant={saved ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => toggle(listing.id)}
                    >
                        <Heart className={cn('size-4', saved && 'fill-red-600 text-red-600')} />
                        {saved ? 'Saved' : 'Save'}
                    </Button>
                </div>
            </div>

            {/* GALLERY */}
            <div className="grid grid-cols-3 gap-2">
                {GALLERY_LABELS.map((label, i) => (
                    <div
                        key={label}
                        className={cn(
                            'relative aspect-video overflow-hidden rounded-xl bg-stone-100',
                            i === 0 &&
                                'col-span-3 aspect-video sm:col-span-1 sm:row-span-2 sm:aspect-square',
                        )}
                    >
                        <img
                            src={PLACEHOLDER_PHOTOS[i % PLACEHOLDER_PHOTOS.length]}
                            alt={label}
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
            <div className="-mt-4 flex items-center gap-2 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                    <Camera className="size-3" /> {listing.photos} photos
                </span>
                {listing.video && (
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
                <h1 className="mt-3 text-2xl font-extrabold text-stone-900">
                    {listing.title}
                </h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                    <MapPin className="size-4" /> Approximate area:{' '}
                    {listing.estate}, {listing.town} · {listing.county} County
                </p>
            </div>

            {/* PRICE CARD */}
            <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                    <div className="text-2xl font-extrabold text-stone-900">
                        {formatKes(listing.rent)}{' '}
                        <span className="text-sm font-normal text-stone-500">
                            per month (last known)
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">
                        Last known deposit: {formatKes(listing.deposit)}
                    </p>
                </div>
                <div className="text-right text-sm text-stone-600">
                    <div>
                        Reported vacant: <b>{listing.reported}</b>
                    </div>
                    <div>
                        Last community confirmation: <b>{listing.confirmed}</b>
                    </div>
                </div>
            </Card>

            <div className="rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                ⚠️ This is a tenant-reported vacancy, not an official
                property listing. Rent and availability may change. Confirm
                details at the building before making any payment.
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-emerald-50">
                <div className="flex size-28 items-center justify-center rounded-full border-2 border-dashed border-emerald-400 bg-emerald-100/60 text-xs font-semibold text-emerald-700">
                    Approximate area
                </div>
            </div>

            {/* ACTIONS */}
            <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={() => toast('Opening directions to the approximate area')}>
                    <Compass className="size-4" /> Get directions
                </Button>
                <Button variant="secondary" asChild>
                    <Link href="/messages">
                        <MessageCircle className="size-4" /> Ask former tenant
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/confirm">
                        <CheckCircle2 className="size-4" /> I checked: still vacant
                    </Link>
                </Button>
                <Button variant="destructive" asChild>
                    <Link href="/confirm">
                        <Ban className="size-4" /> Report as occupied
                    </Link>
                </Button>
            </div>

            {/* AT A GLANCE */}
            <Card className="p-5">
                <h3 className="mb-2 text-sm font-bold text-stone-900">At a glance</h3>
                <KvList
                    rows={[
                        ['Property type', listing.type],
                        ['Bedrooms', listing.beds ? String(listing.beds) : 'Studio / open plan'],
                        ['Bathrooms', String(listing.baths)],
                        ['Floor', '2nd floor (walk-up)'],
                        ['Parking', listing.parking],
                        ['Furnishing', 'Unfurnished'],
                        ['Pets', 'Ask the caretaker — no written policy'],
                        ['Internet', 'Safaricom Home Fibre & Faiba available'],
                        ['Security', `${listing.security} — manned gate, CCTV at entrance`],
                        ['Water', `${listing.water} — tank backup on the plot`],
                        ['Electricity', 'Prepaid tokens'],
                    ]}
                />
            </Card>

            {/* LAST-KNOWN COSTS */}
            <Card className="p-5">
                <h3 className="text-sm font-bold text-stone-900">Last-known costs</h3>
                <p className="mb-2 text-xs text-stone-500">
                    Reported by the former tenant. Costs may have changed
                    since move-out.
                </p>
                <KvList
                    rows={[
                        ['Monthly rent', formatKes(listing.rent)],
                        ['Deposit', formatKes(listing.deposit)],
                        ['Water charges', 'KES 500 – 900 / month'],
                        ['Garbage collection', 'KES 200 / month'],
                        ['Service charge', 'Not charged'],
                        ['Parking', 'KES 1,000 / month'],
                        ['Estimated move-in cost', formatKes(listing.rent * 2 + 2000)],
                    ]}
                />
                <div className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
                    💡 Hidden-cost note: &ldquo;The caretaker asked for a
                    one-off KES 1,000 water meter reading fee. Confirm garbage
                    charges before paying anything.&rdquo;
                </div>
            </Card>

            {/* TENANT EXPERIENCE */}
            <Card className="p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">
                        Former tenant&rsquo;s lived experience
                    </h3>
                    <VerificationBadgePill badge="tenant" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <RatingStars rating={listing.rating} />
                    <b className="text-sm text-stone-900">
                        {listing.rating}/5 overall
                    </b>
                </div>
                <div className="mt-2">
                    {Object.entries(listing.scores).map(([k, v]) => (
                        <ScoreRow key={k} label={k} score={v} />
                    ))}
                </div>
                <p className="mt-3 text-sm text-stone-700 italic">
                    &ldquo;{listing.note}&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                        Lived here: Mar 2024 – Jul 2026
                    </span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                        Reason for leaving: Relocated for work
                    </span>
                </div>
                <p className="mt-2 text-xs text-stone-400">
                    Opinions in this section are one person&rsquo;s
                    experience. Facts such as dates and confirmations are
                    labelled separately.
                </p>
            </Card>

            {/* CONDITION REPORT */}
            <Card className="p-5">
                <h3 className="mb-1 text-sm font-bold text-stone-900">
                    Detailed condition report
                </h3>
                <div>
                    {CONDITION_REPORT.map((item) => (
                        <ScoreRow
                            key={item.label}
                            label={item.label}
                            score={item.score}
                            note={item.note}
                        />
                    ))}
                </div>
            </Card>

            {/* PHOTOS & EVIDENCE */}
            <Card className="p-5">
                <h3 className="mb-3 text-sm font-bold text-stone-900">
                    Photos and evidence
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {EVIDENCE_PHOTO_LABELS.map((label, i) => (
                        <div
                            key={label}
                            className="relative aspect-square overflow-hidden rounded-lg bg-stone-100"
                        >
                            <img
                                src={PLACEHOLDER_PHOTOS[i % PLACEHOLDER_PHOTOS.length]}
                                alt={label}
                                className="h-full w-full object-cover"
                            />
                            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    <VerificationBadgePill badge="evidence" />
                    <VerificationBadgePill badge="tenant" />
                </div>
                <p className="mt-2 text-xs text-stone-400">
                    Documents are used only to verify a contributor&rsquo;s
                    connection to a home. They are never publicly displayed.
                </p>
            </Card>

            {/* LOCATION & ACCESS */}
            <Card className="p-5">
                <h3 className="mb-2 text-sm font-bold text-stone-900">
                    Location and access
                </h3>
                <KvList
                    rows={[
                        ['Estate', listing.estate],
                        ['Building', 'Shared only with verified members'],
                        ['Nearby landmarks', 'Two Rivers Mall, Ruaka Market'],
                        ['Nearest matatu stage', listing.near],
                        [
                            'Directions',
                            'From the stage, walk toward the market, turn left after the pharmacy, the gate is the 3rd on the right.',
                        ],
                        [
                            'Best time to visit',
                            'Weekdays 9am – 4pm when the caretaker is around',
                        ],
                    ]}
                />
                <div className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
                    🔐 The exact unit number is never published. It may be
                    shared privately by the contributor if they choose.
                </div>
            </Card>

            {/* COMMUNITY CONFIRMATIONS */}
            <Card className="p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">
                        Community confirmations
                    </h3>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/confirm">I visited this location</Link>
                    </Button>
                </div>
                <div className="mt-3 flex flex-col gap-4">
                    {MOCK_CONFIRMATIONS.map((c, i) => (
                        <div
                            key={c.who + c.when}
                            className="border-l-2 border-emerald-200 pl-4"
                        >
                            <div className="flex items-center justify-between">
                                <b className="text-sm text-stone-900">{c.who}</b>
                                <span className="text-xs text-stone-400">{c.when}</span>
                            </div>
                            <p className="mt-1 text-sm text-stone-600">{c.text}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setHelpful((prev) =>
                                        prev.map((n, idx) => (idx === i ? n + 1 : n)),
                                    );
                                    toast('Marked as helpful');
                                }}
                                className="mt-1.5 rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600 hover:border-stone-300"
                            >
                                👍 Helpful ({helpful[i]})
                            </button>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-xs text-stone-400">
                    Contributor names are always anonymised. Phone numbers are
                    never shown.
                </p>
            </Card>

            {/* SIMILAR NEARBY */}
            <div>
                <h3 className="mb-3 text-lg font-extrabold text-stone-900">
                    Similar nearby reports
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {similar.map((l, i) => (
                        <ListingCard key={l.id} listing={l} index={i + 1} />
                    ))}
                </div>
            </div>

            <ReportIssueDialog
                trigger={
                    <Button variant="ghost" className="w-full">
                        🚩 Report an issue with this report
                    </Button>
                }
            />
        </div>
    );
}