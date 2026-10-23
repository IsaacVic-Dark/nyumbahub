import { Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { ListingCard } from '@/components/nyumba/listing-card';
import { MetricStat } from '@/components/nyumba/metric-stat';
import { EmptyCard, ErrorCard, LoadingGrid } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Paginated } from '@/lib/api';
import { HOUSE_TYPES } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import type { Listing } from '@/types/nyumba';

const RENT_RANGES: [string, string, string, string][] = [
    // [value, label, min_rent, max_rent]
    ['u10', 'Under 10,000', '', '10000'],
    ['10-20', '10,000 – 20,000', '10000', '20000'],
    ['20-35', '20,000 – 35,000', '20000', '35000'],
    ['35-60', '35,000 – 60,000', '35000', '60000'],
    ['60+', 'Above 60,000', '60000', ''],
];

/** Home-page search card: sends the visitor to /explore with the filters applied. */
export function HomeSearchCard({ placeholder }: { placeholder: string }) {
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
        <Card className="mt-6 flex flex-col gap-2.5 p-4">
            <Input
                placeholder={placeholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && go()}
            />
            <div className="grid grid-cols-2 gap-2.5">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700"
                >
                    <option value="">What are you looking for?</option>
                    {HOUSE_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                <select
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700"
                >
                    <option value="">Rent range (KES)</option>
                    {RENT_RANGES.map(([v, l]) => (
                        <option key={v} value={v}>
                            {l}
                        </option>
                    ))}
                </select>
            </div>
            <Button className="w-full" onClick={go}>
                <Search className="size-4" /> Search vacancy reports
            </Button>
        </Card>
    );
}

type Stats = {
    active_reports: number;
    confirmations_this_week: number;
    verified_contributors: number;
    neighbourhoods_covered: number;
};

/** Real counts from GET /api/stats. */
export function HomeMetrics({ className }: { className: string }) {
    const { data } = useApi<{ data: Stats }>('/stats');
    const s = data?.data;
    const fmt = (n: number | undefined) => (n === undefined ? '—' : n.toLocaleString('en-KE'));

    return (
        <section className={className}>
            <MetricStat value={fmt(s?.active_reports)} label="Recently reported vacancies" />
            <MetricStat value={fmt(s?.confirmations_this_week)} label="Community confirmations this week" />
            <MetricStat value={fmt(s?.verified_contributors)} label="Verified contributors" />
            <MetricStat value={fmt(s?.neighbourhoods_covered)} label="Neighbourhoods covered" />
        </section>
    );
}

/** Latest public reports. `count` cards in a responsive grid. */
export function FeaturedListings({ count = 6 }: { count?: number }) {
    const { data, loading, error, reload } = useApi<Paginated<Listing>>('/listings', { per_page: count, sort: 'recent' });

    if (error) return <ErrorCard message={error} onRetry={reload} />;
    if (loading && !data) return <LoadingGrid count={3} />;
    if (!data?.data.length) {
        return (
            <EmptyCard
                emoji="🏘️"
                title="No vacancy reports yet"
                body="Be the first to share a home you recently vacated."
                action={
                    <Button className="mt-2" asChild>
                        <Link href="/post">Post a vacancy report</Link>
                    </Button>
                }
            />
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((l) => (
                <ListingCard key={l.id} listing={l} />
            ))}
        </div>
    );
}

/** One highlighted listing for the hero (latest report), or nothing while loading / empty. */
export function HeroListing() {
    const { data } = useApi<Paginated<Listing>>('/listings', { per_page: 1, sort: 'recent' });
    const listing = data?.data[0];

    return listing ? <ListingCard listing={listing} /> : null;
}
