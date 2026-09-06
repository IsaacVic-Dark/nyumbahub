import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ListingCard } from '@/components/nyumba/listing-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useSavedListings } from '@/hooks/use-saved-listings';
import { formatKes, MOCK_LISTINGS, SAVED_FLAGS } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';

const COMPARE_ROWS: [string, string][] = [
    ['Type', 'type'],
    ['Last known rent', 'rent'],
    ['Deposit', 'deposit'],
    ['Water', 'water'],
    ['Security', 'security'],
    ['Parking', 'parking'],
    ['Rating', 'rating'],
    ['Last confirmed', 'confirmed'],
];

export default function Saved() {
    const { saved } = useSavedListings();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const savedListings = MOCK_LISTINGS.filter((l) => saved.includes(l.id));
    const compareSet = MOCK_LISTINGS.slice(0, 3);

    return (
        <div className="py-6 pb-16">
            <Head title="Saved homes" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Saved homes
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Track status changes on the reports you care about.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex overflow-hidden rounded-full border border-stone-200">
                    <button
                        onClick={() => setView('grid')}
                        className={cn(
                            'px-3 py-1.5 text-xs font-medium',
                            view === 'grid'
                                ? 'bg-emerald-700 text-white'
                                : 'text-stone-600',
                        )}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={cn(
                            'px-3 py-1.5 text-xs font-medium',
                            view === 'list'
                                ? 'bg-emerald-700 text-white'
                                : 'text-stone-600',
                        )}
                    >
                        List
                    </button>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-auto">
                            Compare up to 3
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Compare saved homes</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-stone-200 text-left text-stone-500">
                                        <th className="py-2 pr-4 font-medium">
                                            Field
                                        </th>
                                        {compareSet.map((l) => (
                                            <th
                                                key={l.id}
                                                className="py-2 pr-4 font-medium"
                                            >
                                                {l.estate}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARE_ROWS.map(([label, key]) => (
                                        <tr
                                            key={label}
                                            className="border-b border-stone-100"
                                        >
                                            <td className="py-2 pr-4 text-stone-500">
                                                {label}
                                            </td>
                                            {compareSet.map((l) => {
                                                const value = (l as never)[key as keyof typeof l];
                                                const display =
                                                    key === 'rent' || key === 'deposit'
                                                        ? formatKes(Number(value))
                                                        : String(value);
                                                return (
                                                    <td
                                                        key={l.id}
                                                        className="py-2 pr-4 font-semibold text-stone-900"
                                                    >
                                                        {display}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {savedListings.length ? (
                <div
                    className={cn(
                        'mt-5 grid gap-5',
                        view === 'grid'
                            ? 'sm:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 sm:max-w-lg',
                    )}
                >
                    {savedListings.map((listing, i) => {
                        const flag = SAVED_FLAGS[listing.id];
                        return (
                            <div key={listing.id}>
                                {flag && (
                                    <span
                                        className={cn(
                                            'mb-1.5 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold',
                                            flag.className,
                                        )}
                                    >
                                        {flag.label}
                                    </span>
                                )}
                                <ListingCard listing={listing} index={i} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Card className="mt-8 flex flex-col items-center gap-2 p-10 text-center">
                    <div className="text-4xl">🏘️</div>
                    <h3 className="text-lg font-bold text-stone-900">
                        No saved homes yet
                    </h3>
                    <p className="max-w-sm text-sm text-stone-500">
                        Tap the heart on any vacancy report to keep an eye on
                        it. We will tell you when the community confirms it
                        or the rent changes.
                    </p>
                    <Button className="mt-2" asChild>
                        <Link href="/explore">
                            Explore recently vacated homes
                        </Link>
                    </Button>
                </Card>
            )}
        </div>
    );
}