import { Head, Link } from '@inertiajs/react';
import { Bath, BedDouble, Droplet, MapPin } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ListingCard } from '@/components/nyumba/listing-card';
import { ListingsMap, PIN_COLOR } from '@/components/nyumba/listing-map';
import { ErrorCard } from '@/components/nyumba/states';
import { ListingStatusBadge } from '@/components/nyumba/status-badge';
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
import { useSaveListing } from '@/hooks/use-saved-listings';
import type { Paginated } from '@/lib/api';
import { timeAgo } from '@/lib/format';
import { formatKes, scoreLabel } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/nyumba';

const CHIPS: { label: string; params: Record<string, unknown> }[] = [
    { label: 'All statuses', params: {} },
    { label: 'Community confirmed', params: { status: 'community_confirmed_vacant' } },
    { label: 'Recently vacated', params: { status: 'recently_vacated' } },
    { label: 'Upcoming', params: { status: 'upcoming_vacancy' } },
    { label: 'Under KES 20,000', params: { max_rent: 20000 } },
];

const LEGEND: [string, string][] = [
    [PIN_COLOR.community_confirmed_vacant, 'Community-confirmed vacant'],
    [PIN_COLOR.recently_vacated, 'Recently vacated'],
    [PIN_COLOR.upcoming_vacancy, 'Upcoming vacancy'],
    [PIN_COLOR.unconfirmed, 'Needs reconfirmation'],
    [PIN_COLOR.possibly_occupied, 'Possibly occupied / flagged'],
];

function SelectedCard({ listing }: { listing: Listing }) {
    const { saved, toggle } = useSaveListing(listing.id, listing.is_saved);
    const scores = listing.condition?.scores ?? {};
    const water = scoreLabel(scores['Water reliability']);

    return (
        <Card className="mt-3 p-4">
            <div className="flex items-center justify-between">
                <ListingStatusBadge status={listing.status} />
                <span className="text-xs text-stone-400">
                    Last confirmed: {listing.last_confirmed_at ? timeAgo(listing.last_confirmed_at) : 'Not yet'}
                </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-stone-900">{listing.title}</h3>
            <div className="mt-1 text-sm font-extrabold text-stone-900">
                {formatKes(listing.last_monthly_rent)}{' '}
                <span className="text-xs font-normal text-stone-500">last known / month</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
                {listing.bedrooms !== null && (
                    <span className="inline-flex items-center gap-1">
                        <BedDouble className="size-3.5" />
                        {listing.bedrooms || 'Studio'}
                    </span>
                )}
                {listing.bathrooms !== null && (
                    <span className="inline-flex items-center gap-1">
                        <Bath className="size-3.5" /> {listing.bathrooms}
                    </span>
                )}
                {water && (
                    <span className="inline-flex items-center gap-1">
                        <Droplet className="size-3.5" /> {water}
                    </span>
                )}
                {listing.nearest_stage && (
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" /> {listing.nearest_stage}
                    </span>
                )}
            </div>
            <div className="mt-3 flex gap-2">
                <Button size="sm" className="flex-1" asChild>
                    <Link href={`/listings/${listing.id}`}>View report</Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void toggle()}>
                    {saved ? '♥ Saved' : '♡ Save'}
                </Button>
            </div>
        </Card>
    );
}

export default function MapDiscovery() {
    const [chip, setChip] = useState(0);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [bbox, setBbox] = useState<string | null>(null);
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [near, setNear] = useState<{ lat: number; lng: number } | null>(null);
    const [locOpen, setLocOpen] = useState(false);
    const latestBbox = useRef<string | null>(null);

    const params = useMemo(
        () => ({
            ...CHIPS[chip].params,
            has_coordinates: 1,
            per_page: 100,
            ...(bbox ? { bbox } : {}),
            ...(near ? { sort: 'nearest', lat: near.lat, lng: near.lng } : {}),
        }),
        [chip, bbox, near],
    );
    const { data, error, reload } = useApi<Paginated<Listing>>('/listings', params);
    const listings = useMemo(() => data?.data ?? [], [data]);
    const selected = listings.find((l) => l.id === selectedId) ?? listings[0] ?? null;

    const locate = () => {
        setLocOpen(false);
        if (!navigator.geolocation) {
            toast.error('Location is not available on this device.');

            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setBbox(null);
                setNear({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setCenter([pos.coords.latitude, pos.coords.longitude]);
                toast('Showing reports near you');
            },
            () => toast.error('Could not get your location. Check your browser permission.'),
            { maximumAge: 60000, timeout: 10000 },
        );
    };

    return (
        <div className="py-6 pb-16">
            <Head title="Map discovery" />

            <h1 className="text-2xl font-extrabold text-stone-900">Map discovery</h1>
            <p className="mt-1 text-sm text-stone-500">
                Approximate, building-level locations only. Exact units are never shown publicly.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {CHIPS.map((c, i) => (
                    <button
                        key={c.label}
                        onClick={() => setChip(i)}
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium',
                            chip === i ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-200 bg-white text-stone-600',
                        )}
                    >
                        {c.label}
                    </button>
                ))}
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href="/explore">Filters</Link>
                </Button>
            </div>

            {error && <div className="mt-4"><ErrorCard message={error} onRetry={reload} /></div>}

            <div className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]">
                <aside className="hidden max-h-[70vh] flex-col gap-4 overflow-y-auto lg:flex">
                    {listings.length === 0 && <p className="text-sm text-stone-500">No reports with a map location in this area.</p>}
                    {listings.map((l) => (
                        <button key={l.id} onClick={() => setSelectedId(l.id)} className="text-left">
                            <ListingCard listing={l} />
                        </button>
                    ))}
                </aside>

                <div>
                    <div className="relative">
                        <ListingsMap
                            listings={listings}
                            selectedId={selected?.id}
                            onSelect={setSelectedId}
                            onMoveEnd={(b) => (latestBbox.current = b)}
                            center={center}
                            className="z-0 h-[62vh] min-h-[380px] overflow-hidden rounded-2xl"
                        />
                        <div className="absolute inset-x-2 top-2 z-[500] flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                    setNear(null);
                                    setBbox(latestBbox.current);
                                }}
                            >
                                Search this area
                            </Button>
                            <Dialog open={locOpen} onOpenChange={setLocOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary">
                                        <MapPin className="size-4" /> Use my location
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Use your location?</DialogTitle>
                                        <DialogDescription>
                                            NyumbaHub would like to use your approximate location to show vacancy
                                            reports near you. We never store your precise coordinates and never share
                                            them with other users.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-2">
                                        <Button variant="ghost" className="flex-1" onClick={() => setLocOpen(false)}>
                                            Not now
                                        </Button>
                                        <Button className="flex-1" onClick={locate}>
                                            Allow once
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="absolute right-2 bottom-2 z-[500] flex flex-col gap-1 rounded-lg bg-white/95 p-2.5 text-[11px] text-stone-600 shadow-sm">
                            {LEGEND.map(([color, label]) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <span className="size-2.5 rounded-full" style={{ background: color }} />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-2.5 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                        🔐 Exact unit details may be shared only after you choose to visit or contact the contributor.
                    </p>

                    {selected && <SelectedCard key={selected.id} listing={selected} />}
                </div>
            </div>
        </div>
    );
}
