import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ListingCard } from '@/components/nyumba/listing-card';
import { EmptyCard, ErrorCard, LoadingGrid } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Paginated } from '@/lib/api';
import { timeAgo } from '@/lib/format';
import { formatKes, SAVED_FLAGS, scoreLabel } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/nyumba';

const COMPARE_ROWS: [string, (l: Listing) => string][] = [
    ['Type', (l) => l.house_type],
    ['Last known rent', (l) => formatKes(l.last_monthly_rent)],
    ['Deposit', (l) => (l.deposit_amount !== null ? formatKes(l.deposit_amount) : '—')],
    ['Water', (l) => scoreLabel(l.condition?.scores?.['Water reliability']) ?? '—'],
    ['Security', (l) => scoreLabel(l.condition?.scores?.['Security']) ?? '—'],
    ['Parking', (l) => (l.details?.features?.includes('Parking') ? 'Yes' : '—')],
    ['Rating', (l) => (l.rating !== null ? `${l.rating}/5` : '—')],
    ['Last confirmed', (l) => (l.last_confirmed_at ? timeAgo(l.last_confirmed_at) : 'Not yet')],
];

export default function Saved() {
    const { data, loading, error, reload, setData } = useApi<Paginated<Listing>>('/saved-listings');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const listings = data?.data ?? [];
    const compareSet = listings.slice(0, 3);

    return (
        <div className="py-6 pb-16">
            <Head title="Saved homes" />

            <h1 className="text-2xl font-extrabold text-stone-900">Saved homes</h1>
            <p className="mt-1 text-sm text-stone-500">Track status changes on the reports you care about.</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex overflow-hidden rounded-full border border-stone-200">
                    {(['grid', 'list'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={cn('px-3 py-1.5 text-xs font-medium capitalize', view === v ? 'bg-emerald-700 text-white' : 'text-stone-600')}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {compareSet.length > 1 && (
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
                                            <th className="py-2 pr-4 font-medium">Field</th>
                                            {compareSet.map((l) => (
                                                <th key={l.id} className="py-2 pr-4 font-medium">
                                                    {l.location?.estate?.name ?? l.title}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {COMPARE_ROWS.map(([label, get]) => (
                                            <tr key={label} className="border-b border-stone-100">
                                                <td className="py-2 pr-4 text-stone-500">{label}</td>
                                                {compareSet.map((l) => (
                                                    <td key={l.id} className="py-2 pr-4 font-semibold text-stone-900">
                                                        {get(l)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading && <div className="mt-5"><LoadingGrid count={3} /></div>}
            {error && <div className="mt-5"><ErrorCard message={error} onRetry={reload} /></div>}

            {!loading && !error && listings.length > 0 && (
                <div className={cn('mt-5 grid gap-5', view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:max-w-lg')}>
                    {listings.map((listing) => {
                        const flag = SAVED_FLAGS[listing.status];

                        return (
                            <div key={listing.id}>
                                {flag && (
                                    <span className={cn('mb-1.5 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold', flag.className)}>
                                        {flag.label}
                                    </span>
                                )}
                                <ListingCard
                                    listing={listing}
                                    onSavedChange={(s) => {
                                        if (!s) setData((p) => (p ? { ...p, data: p.data.filter((x) => x.id !== listing.id) } : p));
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !error && listings.length === 0 && (
                <div className="mt-8">
                    <EmptyCard
                        emoji="🏘️"
                        title="No saved homes yet"
                        body="Tap the heart on any vacancy report to keep an eye on it. We will tell you when the community confirms it or the rent changes."
                        action={
                            <Button className="mt-2" asChild>
                                <Link href="/explore">Explore recently vacated homes</Link>
                            </Button>
                        }
                    />
                </div>
            )}
        </div>
    );
}
