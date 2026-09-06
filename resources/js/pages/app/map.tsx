import { Head, Link } from '@inertiajs/react';
import { Bath, BedDouble, Droplet, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ListingCard } from '@/components/nyumba/listing-card';
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
import { useSavedListings } from '@/hooks/use-saved-listings';
import { formatKes, MOCK_LISTINGS } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';
import type { ListingStatus } from '@/types/nyumba';

// The source data has no real geo-coordinates for these mock listings —
// these positions are purely illustrative until a real map (e.g. Leaflet +
// actual lat/lng on the Listing model) is wired up.
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
    L1: { x: 30, y: 40 },
    L2: { x: 58, y: 25 },
    L3: { x: 72, y: 55 },
    L4: { x: 22, y: 62 },
    L5: { x: 46, y: 78 },
    L6: { x: 82, y: 32 },
};

const PIN_COLOR: Record<ListingStatus, string> = {
    confirmed: 'bg-emerald-600',
    vacated: 'bg-amber-500',
    upcoming: 'bg-sky-600',
    reconfirm: 'bg-stone-400',
    occupied: 'bg-red-600',
};

const STATUS_CHIPS = [
    'All statuses',
    'Community confirmed',
    'Recently vacated',
    'Upcoming',
    'Under KES 20,000',
];

const LEGEND: [string, string][] = [
    ['bg-emerald-600', 'Community-confirmed vacant'],
    ['bg-amber-500', 'Recently vacated'],
    ['bg-sky-600', 'Upcoming vacancy'],
    ['bg-stone-400', 'Needs reconfirmation'],
    ['bg-red-600', 'Possibly occupied / flagged'],
];

export default function MapDiscovery() {
    const [selectedId, setSelectedId] = useState(MOCK_LISTINGS[0].id);
    const [activeChip, setActiveChip] = useState(STATUS_CHIPS[0]);
    const { isSaved, toggle } = useSavedListings();
    const selected = MOCK_LISTINGS.find((l) => l.id === selectedId) ?? MOCK_LISTINGS[0];

    return (
        <div className="py-6 pb-16">
            <Head title="Map discovery" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Map discovery
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Approximate, building-level locations only. Exact units are
                never shown publicly.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {STATUS_CHIPS.map((c) => (
                    <button
                        key={c}
                        onClick={() => setActiveChip(c)}
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium',
                            activeChip === c
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : 'border-stone-200 bg-white text-stone-600',
                        )}
                    >
                        {c}
                    </button>
                ))}
                <Button variant="ghost" size="sm" className="ml-auto">
                    Filters
                </Button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]">
                <aside className="hidden max-h-[70vh] flex-col gap-4 overflow-y-auto lg:flex">
                    {MOCK_LISTINGS.map((l, i) => (
                        <button
                            key={l.id}
                            onClick={() => setSelectedId(l.id)}
                            className="text-left"
                        >
                            <ListingCard listing={l} index={i} />
                        </button>
                    ))}
                </aside>

                <div>
                    <div className="relative h-[62vh] min-h-[380px] overflow-hidden rounded-2xl bg-emerald-50">
                        {/* Decorative "roads" */}
                        <div className="absolute inset-x-0 top-[44%] h-2.5 bg-emerald-100" />
                        <div className="absolute inset-y-0 left-[52%] w-2.5 bg-emerald-100" />
                        <div className="absolute inset-x-0 top-[70%] h-1.5 bg-emerald-100" />

                        {MOCK_LISTINGS.map((l) => {
                            const pos = PIN_POSITIONS[l.id];
                            return (
                                <button
                                    key={l.id}
                                    onClick={() => setSelectedId(l.id)}
                                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                    className={cn(
                                        'absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md ring-2 ring-white transition',
                                        PIN_COLOR[l.status],
                                        l.id === selectedId && 'scale-125 ring-4',
                                    )}
                                >
                                    {formatKes(l.rent).replace('KES ', '')}
                                </button>
                            );
                        })}

                        <div className="absolute inset-x-2 top-2 flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toast('Searching this area…')}
                            >
                                Search this area
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary">
                                        <MapPin className="size-4" /> Use my
                                        location
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Use your location?
                                        </DialogTitle>
                                        <DialogDescription>
                                            NyumbaHub would like to use your
                                            approximate location to show
                                            vacancy reports near you. We never
                                            store your precise coordinates and
                                            never share them with other users.
                                            You can turn this off any time in
                                            Privacy settings.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-2">
                                        <Button variant="ghost" className="flex-1">
                                            Not now
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() =>
                                                toast('Showing reports near you')
                                            }
                                        >
                                            Allow once
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="absolute right-2 bottom-2 flex flex-col gap-1 rounded-lg bg-white/95 p-2.5 text-[11px] text-stone-600 shadow-sm">
                            {LEGEND.map(([color, label]) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <span className={cn('size-2.5 rounded-full', color)} />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-2.5 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                        🔐 Exact unit details may be shared only after you
                        choose to visit or contact the contributor.
                    </p>

                    <Card className="mt-3 p-4">
                        <div className="flex items-center justify-between">
                            <ListingStatusBadge status={selected.status} />
                            <span className="text-xs text-stone-400">
                                Last confirmed: {selected.confirmed}
                            </span>
                        </div>
                        <h3 className="mt-2 text-sm font-bold text-stone-900">
                            {selected.title}
                        </h3>
                        <div className="mt-1 text-sm font-extrabold text-stone-900">
                            {formatKes(selected.rent)}{' '}
                            <span className="text-xs font-normal text-stone-500">
                                last known / month
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
                            <span className="inline-flex items-center gap-1">
                                <BedDouble className="size-3.5" />
                                {selected.beds || 'Studio'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Bath className="size-3.5" /> {selected.baths}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Droplet className="size-3.5" /> {selected.water}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="size-3.5" /> {selected.near}
                            </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Button size="sm" className="flex-1" asChild>
                                <Link href={`/listings/${selected.id}`}>
                                    View report
                                </Link>
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggle(selected.id)}
                            >
                                {isSaved(selected.id) ? '♥ Saved' : '♡ Save'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}