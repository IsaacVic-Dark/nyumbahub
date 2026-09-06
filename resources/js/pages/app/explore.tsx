import { Head, Link } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FilterPanel } from '@/components/nyumba/filter-panel';
import { ListingCard } from '@/components/nyumba/listing-card';
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
import { MOCK_LISTINGS } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';

const QUICK_CHIPS = [
    'Community confirmed',
    'Under KES 15,000',
    'Bedsitter',
    'Near matatu stage',
    'Verified former tenant',
];

export default function Explore() {
    const [active, setActive] = useState<string[]>([]);
    const toggleChip = (c: string) =>
        setActive((prev) =>
            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
        );

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
                    />
                    <Sheet>
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
                            <FilterPanel />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
                        Filters
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/map">Map view</Link>
                    </Button>
                    <select
                        aria-label="Sort"
                        className="h-9 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700"
                        onChange={(e) =>
                            toast(`Sorted by ${e.target.value}`)
                        }
                    >
                        <option>Most recently reported</option>
                        <option>Most recently confirmed</option>
                        <option>Lowest last-known rent</option>
                        <option>Highest condition rating</option>
                        <option>Closest to my location</option>
                        <option>Most saved</option>
                    </select>
                    <span className="ml-auto text-xs text-stone-500">
                        {MOCK_LISTINGS.length} reports
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {QUICK_CHIPS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => toggleChip(c)}
                            className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                                active.includes(c)
                                    ? 'border-emerald-700 bg-emerald-700 text-white'
                                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300',
                            )}
                        >
                            {c}
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
                    <h3 className="mb-2 text-sm font-bold text-stone-900">
                        Filters
                    </h3>
                    <FilterPanel />
                </aside>

                <div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {MOCK_LISTINGS.map((listing, i) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                index={i}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm">
                            ← Previous
                        </Button>
                        {[1, 2, 3].map((n) => (
                            <button
                                key={n}
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-full border text-sm font-medium',
                                    n === 1
                                        ? 'border-emerald-700 bg-emerald-700 text-white'
                                        : 'border-stone-200 text-stone-600',
                                )}
                            >
                                {n}
                            </button>
                        ))}
                        <Button variant="ghost" size="sm">
                            Next →
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}