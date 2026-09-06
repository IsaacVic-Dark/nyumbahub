import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NOTIFICATIONS, type NotificationItem } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';

const TABS: { label: string; category: NotificationItem['category'] | 'all' }[] = [
    { label: 'All', category: 'all' },
    { label: 'Saved homes', category: 'saved' },
    { label: 'Search alerts', category: 'alerts' },
    { label: 'Your reports', category: 'you' },
    { label: 'Account', category: 'account' },
];

export default function Notifications() {
    const [tab, setTab] = useState<NotificationItem['category'] | 'all'>('all');
    const [items, setItems] = useState(NOTIFICATIONS);
    const filtered = items.filter((n) => tab === 'all' || n.category === tab);
    const unreadCount = items.filter((n) => n.unread).length;

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Activity centre" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Activity centre
            </h1>
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
                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                        setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
                        toast('All marked as read');
                    }}
                >
                    Mark all as read
                </Button>
            </div>

            <div className="mt-3 flex flex-col gap-3">
                {filtered.map((n) => (
                    <Card
                        key={n.title}
                        className={cn(
                            'flex items-start gap-3 p-4',
                            n.unread && 'border-l-4 border-l-emerald-600',
                        )}
                    >
                        <span className="text-lg">{n.icon}</span>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <b className="text-sm text-stone-900">{n.title}</b>
                                <span className="shrink-0 text-xs text-stone-400">
                                    {n.when}
                                </span>
                            </div>
                            <p className="mt-0.5 text-sm text-stone-500">{n.body}</p>
                            <div className="mt-2 flex gap-2">
                                <Button variant="secondary" size="sm" asChild>
                                    <Link href="/listings/L1">View</Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/confirm">Confirm</Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}