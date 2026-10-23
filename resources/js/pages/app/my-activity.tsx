import { Head, Link } from '@inertiajs/react';
import { ListingCard } from '@/components/nyumba/listing-card';
import { EmptyCard, ErrorCard, LoadingGrid } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Paginated } from '@/lib/api';
import { timeAgo } from '@/lib/format';
import { formatKes } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import type { Listing } from '@/types/nyumba';

type MyConfirmation = {
    id: number;
    type: string | null;
    note: string | null;
    reported_rent_amount: number | null;
    created_at: string;
    listing_id: number;
    listing_title: string | null;
};

const TYPE_LABEL: Record<string, string> = {
    still_vacant: 'Found still vacant',
    occupied: 'Reported occupied',
    rent_changed: 'Reported a rent change',
    information_inaccurate: 'Reported inaccurate details',
    building_not_found: 'Could not find the building',
    new_tenant_moved_in: 'Reported a new tenant',
};

function Reports() {
    const { data, loading, error, reload } = useApi<Paginated<Listing>>('/me/listings');

    return (
        <>
            {loading && <LoadingGrid count={2} />}
            {error && <ErrorCard message={error} onRetry={reload} />}
            {data && data.data.length === 0 && (
                <EmptyCard
                    emoji="📝"
                    title="No reports yet"
                    body="Moving out? Help the next tenant by posting your vacancy."
                    action={<Button asChild><Link href="/post">Post a vacancy</Link></Button>}
                />
            )}
            <div className="grid gap-5 sm:grid-cols-2">
                {data?.data.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                ))}
            </div>
        </>
    );
}

function Confirmations() {
    const { data, loading, error, reload } = useApi<{ data: MyConfirmation[] }>('/me/confirmations');

    return (
        <div className="flex flex-col gap-3">
            {loading && <LoadingGrid count={2} />}
            {error && <ErrorCard message={error} onRetry={reload} />}
            {data && data.data.length === 0 && (
                <EmptyCard emoji="✅" title="No confirmations yet" body="Visit a reported home and tell the community what you find." />
            )}
            {data?.data.map((c) => (
                <Card key={c.id} className="p-4">
                    <div className="flex items-center justify-between gap-2">
                        <b className="text-sm text-stone-900">{TYPE_LABEL[c.type ?? ''] ?? c.type}</b>
                        <span className="text-xs text-stone-400">{timeAgo(c.created_at)}</span>
                    </div>
                    <Link href={`/listings/${c.listing_id}`} className="text-sm text-emerald-700 underline">
                        {c.listing_title ?? `Report #${c.listing_id}`}
                    </Link>
                    {c.reported_rent_amount !== null && (
                        <p className="text-sm text-stone-500">New rent: {formatKes(c.reported_rent_amount)}</p>
                    )}
                    {c.note && <p className="mt-1 text-sm text-stone-600">{c.note}</p>}
                </Card>
            ))}
        </div>
    );
}

export default function MyActivity({ tab }: { tab: 'reports' | 'confirmations' }) {
    const isReports = tab === 'reports';

    return (
        <div className="mx-auto max-w-3xl py-6 pb-16">
            <Head title={isReports ? 'My reports' : 'My confirmations'} />
            <h1 className="text-2xl font-extrabold text-stone-900">{isReports ? 'My reports' : 'My confirmations'}</h1>
            <p className="mt-1 mb-5 text-sm text-stone-500">
                {isReports ? 'Vacancy reports you have posted.' : 'Visits you have confirmed for other reports.'}
            </p>
            {isReports ? <Reports /> : <Confirmations />}
        </div>
    );
}
