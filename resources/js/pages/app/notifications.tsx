import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { EmptyCard, ErrorCard, LoadingGrid } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api, getErrorMessage } from '@/lib/api';
import type { Paginated } from '@/lib/api';
import { shortAgo } from '@/lib/format';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { ApiNotification } from '@/types/nyumba';

type Cat = ApiNotification['category'] | 'all';

const TABS: { label: string; category: Cat }[] = [
    { label: 'All', category: 'all' },
    { label: 'Saved homes', category: 'saved' },
    { label: 'Search alerts', category: 'alerts' },
    { label: 'Your reports', category: 'you' },
    { label: 'Account', category: 'account' },
];

export default function Notifications() {
    const [tab, setTab] = useState<Cat>('all');
    const { data, loading, error, reload } = useApi<Paginated<ApiNotification>>(
        '/notifications',
        tab === 'all' ? {} : { category: tab },
    );
    const [items, setItems] = useState<ApiNotification[]>([]);

    useEffect(() => {
        if (data) setItems(data.data);
    }, [data]);

    const unreadCount = items.filter((n) => n.unread).length;

    const markAll = async () => {
        try {
            await api.post('/notifications/read-all');
            setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
            toast('All marked as read');
        } catch (e) {
            toast.error(getErrorMessage(e));
        }
    };

    const markRead = async (n: ApiNotification) => {
        if (!n.unread) return;
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
        try {
            await api.post(`/notifications/${n.id}/read`);
        } catch {
            // non-critical
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Activity centre" />

            <h1 className="text-2xl font-extrabold text-stone-900">Activity centre</h1>
            <p className="mt-1 text-sm text-stone-500">
                Updates on saved homes, your reports and your account.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
                {TABS.map((t) => (
                    <button
                        key={t.label}
                        onClick={() => setTab(t.category)}
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium',
                            tab === t.category
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : 'border-stone-200 bg-white text-stone-600',
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
                {unreadCount > 0 && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        {unreadCount} unread
                    </span>
                )}
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => void markAll()}>
                    Mark all as read
                </Button>
            </div>

            <div className="mt-3 flex flex-col gap-3">
                {loading && <LoadingGrid count={3} />}
                {error && <ErrorCard message={error} onRetry={reload} />}
                {!loading && !error && items.length === 0 && (
                    <EmptyCard title="Nothing here yet" body="Updates about saved homes, alerts and your reports will appear here." />
                )}
                {items.map((n) => (
                    <Card
                        key={n.id}
                        className={cn('flex items-start gap-3 p-4', n.unread && 'border-l-4 border-l-emerald-600')}
                    >
                        <span className="text-lg">{n.icon ?? '🔔'}</span>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <b className="text-sm text-stone-900">{n.title}</b>
                                <span className="shrink-0 text-xs text-stone-400">{shortAgo(n.created_at)}</span>
                            </div>
                            {n.body && <p className="mt-0.5 text-sm text-stone-500">{n.body}</p>}
                            {n.listing_id && (
                                <div className="mt-2 flex gap-2">
                                    <Button variant="secondary" size="sm" asChild onClick={() => void markRead(n)}>
                                        <Link href={`/listings/${n.listing_id}`}>View</Link>
                                    </Button>
                                    {n.category !== 'you' && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/listings/${n.listing_id}/confirm`}>Confirm</Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                            {!n.listing_id && n.unread && (
                                <Button variant="ghost" size="sm" className="mt-1" onClick={() => void markRead(n)}>
                                    Mark as read
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
