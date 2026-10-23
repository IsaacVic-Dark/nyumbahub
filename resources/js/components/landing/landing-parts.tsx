import { Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    Banknote,
    ChevronDown,
    Heart,
    Home,
    MapPin,
    Search,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { brandButton, outlineButton } from '@/components/landing/landing-nav';
import { EmptyCard, ErrorCard } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSaveListing } from '@/hooks/use-saved-listings';
import type { Paginated } from '@/lib/api';
import { timeAgo } from '@/lib/format';
import { HOUSE_TYPES, formatKes } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/nyumba';

export const EYEBROW =
    'text-[11px] font-semibold tracking-[0.14em] uppercase text-lp-brand';

/** Container used by every landing section. */
export const CONTAINER = 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';

const placeOf = (l: Listing) => {
    const loc = l.location;

    return (
        [loc?.estate?.name, loc?.town?.name].filter(Boolean).join(', ') ||
        loc?.county?.name ||
        'Kenya'
    );
};

/* ------------------------------------------------------------------ */
/* Section heading: eyebrow + serif title on the left, blurb on right  */
/* ------------------------------------------------------------------ */
export function SectionHead({
    eyebrow,
    title,
    body,
}: {
    eyebrow: string;
    title: ReactNode;
    body?: string;
}) {
    return (
        <div className="grid items-end gap-4 md:grid-cols-2 md:gap-10">
            <div>
                <p className={EYEBROW}>{eyebrow}</p>
                <h2 className="mt-3 font-serif text-3xl leading-[1.1] font-bold tracking-tight text-lp-ink sm:text-4xl">
                    {title}
                </h2>
            </div>
            {body && (
                <p className="max-w-md text-sm leading-relaxed text-lp-muted md:justify-self-end md:pb-1">
                    {body}
                </p>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Hero search bar (same behaviour as the old HomeSearchCard)          */
/* ------------------------------------------------------------------ */
const RENT_RANGES: [string, string, string, string][] = [
    // [value, label, min_rent, max_rent]
    ['u10', 'Under 10,000', '', '10000'],
    ['10-20', '10,000 – 20,000', '10000', '20000'],
    ['20-35', '20,000 – 35,000', '20000', '35000'],
    ['35-60', '35,000 – 60,000', '35000', '60000'],
    ['60+', 'Above 60,000', '60000', ''],
];

function Field({
    icon,
    label,
    children,
}: {
    icon: ReactNode;
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 lg:py-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lp-soft text-lp-brand">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="text-[11px] text-lp-muted">{label}</div>
                {children}
            </div>
        </div>
    );
}

function SelectBox({
    value,
    onChange,
    placeholder,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    children: ReactNode;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium text-lp-ink outline-none"
            >
                <option value="" className="bg-lp-card text-lp-ink">
                    {placeholder}
                </option>
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-lp-muted" />
        </div>
    );
}

export function LandingSearchBar() {
    const [q, setQ] = useState('');
    const [type, setType] = useState('');
    const [rent, setRent] = useState('');

    const go = () => {
        const range = RENT_RANGES.find((r) => r[0] === rent);
        const data: Record<string, string> = {};
        if (q.trim()) data.q = q.trim();
        if (type) data.house_type = type;
        if (range?.[2]) data.min_rent = range[2];
        if (range?.[3]) data.max_rent = range[3];
        router.get('/explore', data);
    };

    return (
        <div className="mt-10 flex flex-col divide-y divide-lp-line rounded-2xl border border-lp-line bg-lp-card p-2 shadow-sm lg:flex-row lg:items-center lg:divide-x lg:divide-y-0">
            <Field icon={<MapPin className="size-4" />} label="Location">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && go()}
                    placeholder="Estate, town or landmark, e.g. Ruaka"
                    className="w-full bg-transparent text-sm font-medium text-lp-ink outline-none placeholder:font-normal placeholder:text-lp-muted/70"
                />
            </Field>
            <Field icon={<Home className="size-4" />} label="House type">
                <SelectBox
                    value={type}
                    onChange={setType}
                    placeholder="Any house type"
                >
                    {HOUSE_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-lp-card text-lp-ink">
                            {t}
                        </option>
                    ))}
                </SelectBox>
            </Field>
            <Field icon={<Banknote className="size-4" />} label="Rent range (KES)">
                <SelectBox value={rent} onChange={setRent} placeholder="Any rent">
                    {RENT_RANGES.map(([v, l]) => (
                        <option key={v} value={v} className="bg-lp-card text-lp-ink">
                            {l}
                        </option>
                    ))}
                </SelectBox>
            </Field>
            <Button
                onClick={go}
                size="lg"
                className={cn('m-2 h-12 px-6 lg:ml-2', brandButton)}
            >
                <Search className="size-4" /> Search homes
            </Button>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Hero image with the latest listing overlay                          */
/* ------------------------------------------------------------------ */
export function HeroVisual() {
    const { data } = useApi<Paginated<Listing>>('/listings', {
        per_page: 1,
        sort: 'recent',
    });
    const l = data?.data[0];

    return (
        <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-lp-alt">
            <img
                src="/images/home_1.jpg"
                alt="A home reported on NyumbaHub"
                className="size-full object-cover"
            />
            {l && (
                <Link
                    href={`/listings/${l.id}`}
                    className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-2xl bg-lp-card p-4 shadow-lg sm:right-auto sm:w-[70%]"
                >
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-lp-muted uppercase">
                            Latest report
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-lp-ink">
                            {l.title}
                        </p>
                        <p className="truncate text-xs text-lp-muted">
                            {placeOf(l)} · {formatKes(l.last_monthly_rent)}
                        </p>
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lp-brand text-lp-brand-fg">
                        <ArrowUpRight className="size-4" />
                    </span>
                </Link>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Real counts from GET /api/stats                                     */
/* ------------------------------------------------------------------ */
type Stats = {
    active_reports: number;
    confirmations_this_week: number;
    verified_contributors: number;
    neighbourhoods_covered: number;
};

export function LandingStats() {
    const { data } = useApi<{ data: Stats }>('/stats');
    const s = data?.data;
    const fmt = (n: number | undefined) =>
        n === undefined ? '—' : n.toLocaleString('en-KE');

    const items = [
        [fmt(s?.active_reports), 'Recently reported vacancies'],
        [fmt(s?.confirmations_this_week), 'Community confirmations this week'],
        [fmt(s?.verified_contributors), 'Verified contributors'],
        [fmt(s?.neighbourhoods_covered), 'Neighbourhoods covered'],
    ];

    return (
        <section className="mt-6 grid grid-cols-2 gap-y-6 rounded-2xl bg-lp-alt py-7 lg:grid-cols-4">
            {items.map(([value, label]) => (
                <div key={label} className="px-4 text-center">
                    <div className="font-serif text-3xl font-bold text-lp-brand">
                        {value}
                    </div>
                    <div className="mt-1 text-xs text-lp-muted">{label}</div>
                </div>
            ))}
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Featured listing card + grid (landing-only; ListingCard untouched)  */
/* ------------------------------------------------------------------ */
function ListingTile({ listing }: { listing: Listing }) {
    const { saved, toggle } = useSaveListing(listing.id, listing.is_saved);

    return (
        <article className="group overflow-hidden rounded-2xl border border-lp-line bg-lp-card transition hover:shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden bg-lp-alt">
                <Link href={`/listings/${listing.id}`} className="block size-full">
                    {listing.thumbnail ? (
                        <img
                            src={listing.thumbnail}
                            alt={`${listing.house_type} in ${placeOf(listing)}`}
                            loading="lazy"
                            className="size-full object-cover transition duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center text-lp-muted/40">
                            <Home className="size-12" />
                        </div>
                    )}
                </Link>
                <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-lp-card/95 px-2.5 py-1 text-[11px] font-medium text-lp-ink">
                    {listing.house_type}
                </span>
                <button
                    type="button"
                    aria-label={saved ? 'Remove from saved homes' : 'Save home'}
                    onClick={() => void toggle()}
                    className={cn(
                        'absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-lp-card/95 text-lp-ink shadow-sm transition hover:bg-lp-card',
                        saved && 'text-red-600',
                    )}
                >
                    <Heart className={cn('size-4', saved && 'fill-red-600')} />
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="truncate text-sm font-semibold text-lp-ink">
                        {listing.title}
                    </h3>
                    <span className="shrink-0 text-sm font-semibold text-lp-brand">
                        {formatKes(listing.last_monthly_rent)}
                    </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-lp-muted">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">{placeOf(listing)}</span>
                </p>

                <div className="mt-4 grid grid-cols-3 divide-x divide-lp-line border-y border-lp-line py-3 text-left">
                    {[
                        [listing.bedrooms ?? '—', 'Bedrooms'],
                        [listing.bathrooms ?? '—', 'Bathrooms'],
                        [listing.confirmed_count, 'Confirmations'],
                    ].map(([v, label], i) => (
                        <div key={label} className={i > 0 ? 'pl-4' : ''}>
                            <div className="text-sm font-semibold text-lp-ink">
                                {v}
                            </div>
                            <div className="text-[11px] text-lp-muted">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className="truncate text-lp-muted">
                        {listing.deposit_amount
                            ? `Deposit ${formatKes(listing.deposit_amount)}`
                            : `Reported ${timeAgo(listing.created_at)}`}
                    </span>
                    <Link
                        href={`/listings/${listing.id}`}
                        className="inline-flex shrink-0 items-center gap-1 font-semibold text-lp-brand hover:underline"
                    >
                        View home <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export function FeaturedGrid({ count = 3 }: { count?: number }) {
    const { data, loading, error, reload } = useApi<Paginated<Listing>>(
        '/listings',
        { per_page: count, sort: 'recent' },
    );

    if (error) return <ErrorCard message={error} onRetry={reload} />;

    if (loading && !data) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-2xl border border-lp-line bg-lp-card"
                    >
                        <Skeleton className="aspect-[4/3] w-full rounded-none" />
                        <div className="flex flex-col gap-2 p-5">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-3 w-3/5" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.data.length) {
        return (
            <EmptyCard
                emoji="🏘️"
                title="No vacancy reports yet"
                body="Be the first to share a home you recently vacated."
                action={
                    <Button className={cn('mt-2', brandButton)} asChild>
                        <Link href="/post">Post a vacancy report</Link>
                    </Button>
                }
            />
        );
    }

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((l) => (
                    <ListingTile key={l.id} listing={l} />
                ))}
            </div>
            <div className="mt-10 text-center">
                <Button variant="outline" asChild className={outlineButton}>
                    <Link href="/explore">Show all homes</Link>
                </Button>
            </div>
        </>
    );
}