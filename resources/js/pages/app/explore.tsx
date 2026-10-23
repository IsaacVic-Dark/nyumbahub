import { Head, Link } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FilterPanel } from '@/components/nyumba/filter-panel';
import { ListingCard } from '@/components/nyumba/listing-card';
import { Pagination } from '@/components/nyumba/pagination';
import { EmptyCard, ErrorCard, LoadingGrid } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useDebounced } from '@/hooks/use-debounced';
import type { Paginated } from '@/lib/api';
import { EMPTY_FILTERS, filtersFromSearch, filtersToParams, type ExploreFilters } from '@/lib/filters';
import { SORT_OPTIONS } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/nyumba';

// Quick chips: label, is it on?, and the filter change that toggles it.
const QUICK_CHIPS: {
    label: string;
    active: (f: ExploreFilters) => boolean;
    toggle: (f: ExploreFilters) => Partial<ExploreFilters>;
}[] = [
    {
        label: 'Community confirmed',
        active: (f) => f.status.includes('community_confirmed_vacant'),
        toggle: (f) => ({
            status: f.status.includes('community_confirmed_vacant')
                ? f.status.filter((s) => s !== 'community_confirmed_vacant')
                : [...f.status, 'community_confirmed_vacant'],
        }),
    },
    {
        label: 'Under KES 15,000',
        active: (f) => f.max_rent === '15000',
        toggle: (f) => ({ max_rent: f.max_rent === '15000' ? '' : '15000' }),
    },
    {
        label: 'Bedsitter',
        active: (f) => f.house_type.includes('Bedsitter'),
        toggle: (f) => ({
            house_type: f.house_type.includes('Bedsitter')
                ? f.house_type.filter((t) => t !== 'Bedsitter')
                : [...f.house_type, 'Bedsitter'],
        }),
    },
    {
        label: 'Near matatu stage',
        active: (f) => f.amenities.includes('stage'),
        toggle: (f) => ({
            amenities: f.amenities.includes('stage')
                ? f.amenities.filter((a) => a !== 'stage')
                : [...f.amenities, 'stage'],
        }),
    },
    {
        label: 'Verified former tenant',
        active: (f) => f.trust.includes('verified_tenant'),
        toggle: (f) => ({
            trust: f.trust.includes('verified_tenant')
                ? f.trust.filter((t) => t !== 'verified_tenant')
                : [...f.trust, 'verified_tenant'],
        }),
    },
];

export default function Explore() {
    const [filters, setFilters] = useState<ExploreFilters>(() =>
        filtersFromSearch(typeof window === 'undefined' ? '' : window.location.search),
    );
    const [page, setPage] = useState(1);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const update = (patch: Partial<ExploreFilters>) => {
        setFilters((f) => ({ ...f, ...patch }));
        setPage(1);
    };

    const debounced = useDebounced(filters);
    const params: Record<string, unknown> = {
        ...filtersToParams(debounced),
        page,
        per_page: 12,
        ...(debounced.sort === 'nearest' && coords ? coords : {}),
    };

    const { data, loading, error, reload } = useApi<Paginated<Listing>>('/listings', params);

    const onSort = (value: string) => {
        if (value !== 'nearest') {
            update({ sort: value });

            return;
        }
        if (!navigator.geolocation) {
            toast('Your browser cannot share its location');

            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                update({ sort: 'nearest' });
            },
            () => toast('Location permission was denied, so results are not sorted by distance'),
        );
    };

    const total = data?.meta.total;

    return (
        <div className="flex flex-col gap-4 py-6">
            <Head title="Explore" />

            <div>
                <h1 className="text-2xl font-extrabold text-stone-900">
                    Explore recently vacated homes
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                    Every result is a tenant-reported vacancy report. Confirm
                    availability at the building.
                </p>
            </div>

            <Card className="sticky top-16 z-30 flex flex-col gap-3 p-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search estate, town, building, or landmark"
                        aria-label="Search"
                        value={filters.q}
                        onChange={(e) => update({ q: e.target.value })}
                    />
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 lg:hidden"
                                aria-label="Filters"
                            >
                                <SlidersHorizontal className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full overflow-y-auto p-4 sm:max-w-sm"
                        >
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <FilterPanel
                                filters={filters}
                                onChange={update}
                                total={total}
                                onApply={() => setSheetOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/map">Map view</Link>
                    </Button>
                    <select
                        aria-label="Sort"
                        value={filters.sort}
                        className="h-9 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700"
                        onChange={(e) => onSort(e.target.value)}
                    >
                        {SORT_OPTIONS.map(([v, l]) => (
                            <option key={v} value={v}>
                                {l}
                            </option>
                        ))}
                    </select>
                    <span className="ml-auto text-xs text-stone-500">
                        {total === undefined ? '…' : `${total} report${total === 1 ? '' : 's'}`}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {QUICK_CHIPS.map((c) => (
                        <button
                            key={c.label}
                            type="button"
                            onClick={() => update(c.toggle(filters))}
                            className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                                c.active(filters)
                                    ? 'border-emerald-700 bg-emerald-700 text-white'
                                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300',
                            )}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </Card>

            <div className="rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                ⚠️ Rent and availability change fast. Treat every report as a
                lead to verify, never as a confirmed booking.
            </div>

            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                <aside className="hidden lg:sticky lg:top-40 lg:block lg:h-fit lg:max-h-[70vh] lg:overflow-y-auto lg:rounded-xl lg:border lg:border-stone-200 lg:bg-white lg:p-4">
                    <h3 className="mb-2 text-sm font-bold text-stone-900">Filters</h3>
                    <FilterPanel filters={filters} onChange={update} total={total} />
                </aside>

                <div>
                    {error ? (
                        <ErrorCard message={error} onRetry={reload} />
                    ) : loading && !data ? (
                        <LoadingGrid />
                    ) : data && data.data.length === 0 ? (
                        <EmptyCard
                            title="No reports match those filters"
                            body="Try a nearby estate or widen your rent range."
                            action={
                                <Button
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={() => update({ ...EMPTY_FILTERS, sort: filters.sort })}
                                >
                                    Clear filters
                                </Button>
                            }
                        />
                    ) : (
                        <div className={cn('grid gap-5 sm:grid-cols-2', loading && 'opacity-60')}>
                            {data?.data.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}

                    {data && (
                        <Pagination
                            page={data.meta.current_page}
                            lastPage={data.meta.last_page}
                            onPage={(p) => {
                                setPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
