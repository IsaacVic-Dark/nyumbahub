import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EmptyCard, ErrorCard } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api, getErrorMessage } from '@/lib/api';
import { timeAgo } from '@/lib/format';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types/auth';

type Overview = {
    metrics: Record<string, number>;
    audit_log: { actor: string; action: string; at: string }[];
};
type QueueRow = {
    id: number;
    kind: 'flag' | 'duplicate';
    report: string;
    contributor: string;
    signals: string;
    flag: string;
    submitted_at: string;
};

const METRIC_LABELS: [string, string, string][] = [
    ['active_reports', 'Total active reports', ''],
    ['posted_24h', 'Posted in last 24h', ''],
    ['flagged_reports', 'Flagged reports', ''],
    ['flagged_comments', 'Flagged comments', ''],
    ['duplicate_alerts', 'Duplicate alerts', ''],
    ['expiring_7d', 'Expiring in 7 days', ''],
    ['confirmations_today', 'Confirmations today', ''],
    ['users', 'Registered users', ''],
    ['removed_rate', 'Removed reports', '%'],
];

const TABS: [string, string][] = [
    ['flagged', 'Flagged reports'],
    ['comments', 'Flagged comments'],
    ['duplicates', 'Duplicates'],
];

export default function Admin() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [tab, setTab] = useState('flagged');
    const overview = useApi<{ data: Overview }>('/admin/overview');
    const queue = useApi<{ data: QueueRow[] }>('/admin/queue', { tab });

    const resolve = async (row: QueueRow, ok: boolean) => {
        try {
            if (row.kind === 'duplicate') {
                await api.post(`/duplicate-flags/${row.id}/resolve`, { status: ok ? 'confirmed' : 'rejected' });
            } else {
                await api.post(`/flagged-contents/${row.id}/resolve`, { status: ok ? 'actioned' : 'dismissed' });
            }
            toast(ok ? 'Action taken' : 'Dismissed');
            queue.reload();
            overview.reload();
        } catch (e) {
            toast.error(getErrorMessage(e));
        }
    };

    const m = overview.data?.data.metrics;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <Head title="Staff portal" />

            <div>
                <h1 className="text-xl font-extrabold text-stone-900">NyumbaHub staff portal</h1>
                <p className="text-sm text-stone-500">
                    Moderation, trust &amp; safety, and platform configuration. Desktop-optimised.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Signed in as: {auth.user?.name} ({auth.user?.role})
                </span>
                <Link href="/dashboard" className="text-xs text-stone-500 underline">Back to site</Link>
            </div>

            {overview.error && <ErrorCard message={overview.error} onRetry={overview.reload} />}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {METRIC_LABELS.map(([k, label, suffix]) => (
                    <Card key={k} className="p-3 text-center">
                        {m ? (
                            <div className="text-lg font-extrabold text-emerald-700">
                                {Number(m[k] ?? 0).toLocaleString()}
                                {suffix}
                            </div>
                        ) : (
                            <Skeleton className="mx-auto h-6 w-12" />
                        )}
                        <div className="mt-0.5 text-[11px] text-stone-500">{label}</div>
                    </Card>
                ))}
            </div>

            <Card className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-stone-900">Moderation queue</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {TABS.map(([k, label]) => (
                            <button
                                key={k}
                                onClick={() => setTab(k)}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-xs font-medium',
                                    tab === k
                                        ? 'border-emerald-700 bg-emerald-700 text-white'
                                        : 'border-stone-200 bg-white text-stone-600',
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {queue.error && <div className="mt-3"><ErrorCard message={queue.error} onRetry={queue.reload} /></div>}
                {queue.loading && <Skeleton className="mt-3 h-24 w-full" />}
                {!queue.loading && !queue.error && queue.data?.data.length === 0 && (
                    <div className="mt-3"><EmptyCard emoji="✅" title="Queue is clear" /></div>
                )}
                {!!queue.data?.data.length && (
                    <div className="mt-3 overflow-auto">
                        <table className="w-full min-w-[720px] text-sm">
                            <thead>
                                <tr className="border-b border-stone-200 text-left text-stone-500">
                                    <th className="py-2 pr-4 font-medium">Report</th>
                                    <th className="py-2 pr-4 font-medium">Contributor</th>
                                    <th className="py-2 pr-4 font-medium">Signals</th>
                                    <th className="py-2 pr-4 font-medium">Flag</th>
                                    <th className="py-2 pr-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.data.data.map((r) => (
                                    <tr key={`${r.kind}-${r.id}`} className="border-b border-stone-100 align-top">
                                        <td className="py-2 pr-4">
                                            <b className="text-stone-900">{r.report}</b>
                                            <div className="text-xs text-stone-400">Submitted {timeAgo(r.submitted_at)}</div>
                                        </td>
                                        <td className="py-2 pr-4 text-stone-600">{r.contributor}</td>
                                        <td className="py-2 pr-4 text-stone-500">{r.signals}</td>
                                        <td className="py-2 pr-4">
                                            <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                {r.flag}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-4">
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="destructive" onClick={() => void resolve(r, true)}>
                                                    {r.kind === 'duplicate' ? 'Confirm duplicate' : 'Remove'}
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => void resolve(r, false)}>
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Card className="p-4">
                <h3 className="font-bold text-stone-900">Audit log</h3>
                <div className="mt-3 flex flex-col gap-3">
                    {overview.data?.data.audit_log.length === 0 && (
                        <p className="text-sm text-stone-500">No status changes recorded yet.</p>
                    )}
                    {overview.data?.data.audit_log.map((a, i) => (
                        <div key={i} className="border-l-2 border-stone-200 pl-3">
                            <div className="flex items-center justify-between">
                                <b className="text-sm text-stone-900">{a.actor}</b>
                                <span className="text-xs text-stone-400">{timeAgo(a.at)}</span>
                            </div>
                            <p className="text-sm text-stone-500">{a.action}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-xs text-stone-400">Every status change is recorded and attributable.</p>
            </Card>
        </div>
    );
}
