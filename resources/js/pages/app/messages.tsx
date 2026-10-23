import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReportIssueDialog } from '@/components/nyumba/report-issue-dialog';
import { EmptyCard, ErrorCard } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api, getErrorMessage } from '@/lib/api';
import { shortAgo } from '@/lib/format';
import { QUICK_QUESTIONS } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/nyumba';

export default function Messages() {
    const list = useApi<{ data: Conversation[] }>('/conversations');
    const [selected, setSelected] = useState<number | null>(() => {
        const c = new URLSearchParams(window.location.search).get('c');

        return c ? Number(c) : null;
    });
    const [detail, setDetail] = useState<Conversation | null>(null);
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);

    // Open the first conversation by default.
    useEffect(() => {
        if (selected === null && list.data?.data.length) {
            setSelected(list.data.data[0].id);
        }
    }, [list.data, selected]);

    useEffect(() => {
        if (selected === null) return;
        let live = true;
        api.get<{ data: Conversation }>(`/conversations/${selected}`)
            .then((r) => live && setDetail(r.data.data))
            .catch((e) => toast.error(getErrorMessage(e)));

        return () => {
            live = false;
        };
    }, [selected]);

    const act = async (fn: () => Promise<{ data: { data: Conversation } }>, msg: string) => {
        setBusy(true);
        try {
            const r = await fn();
            setDetail(r.data.data);
            list.reload();
            toast(msg);
        } catch (e) {
            toast.error(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    const send = async () => {
        if (!detail || !draft.trim()) return;
        const body = draft.trim();
        await act(() => api.post(`/conversations/${detail.id}/messages`, { body }), 'Sent');
        setDraft('');
    };

    const items = list.data?.data ?? [];
    const pendingForMe = detail && detail.as_owner && detail.status === 'pending';
    const canWrite = detail && detail.status === 'accepted' && !detail.is_expired;

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Questions and messages" />

            <h1 className="text-2xl font-extrabold text-stone-900">Questions and messages</h1>
            <p className="mt-1 text-sm text-stone-500">
                Private, optional questions between a house seeker and a former tenant. This is not an agent lead system.
            </p>

            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                🔐 Phone numbers are hidden by default. Never share ID numbers, M-Pesa details or documents in chat.
            </p>

            {list.error && <div className="mt-4"><ErrorCard message={list.error} onRetry={list.reload} /></div>}
            {list.loading && <Skeleton className="mt-4 h-24 w-full" />}
            {!list.loading && !list.error && items.length === 0 && (
                <div className="mt-4">
                    <EmptyCard
                        emoji="💬"
                        title="No conversations yet"
                        body="Open a listing and tap “Ask former tenant” to start one."
                    />
                </div>
            )}

            {items.length > 1 && (
                <div className="mt-4 flex flex-col gap-2">
                    {items.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelected(c.id)}
                            className={cn(
                                'rounded-lg border p-3 text-left text-sm',
                                c.id === selected ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-white',
                            )}
                        >
                            <div className="flex justify-between">
                                <b className="text-stone-900">{c.listing_label ?? 'Listing'}</b>
                                {c.last_message && (
                                    <span className="text-xs text-stone-400">{shortAgo(c.last_message.created_at)}</span>
                                )}
                            </div>
                            <p className="truncate text-xs text-stone-500">
                                {c.status === 'pending' ? 'Awaiting response' : (c.last_message?.body ?? c.status)}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {detail && (
                <>
                    {pendingForMe && (
                        <Card className="mt-4 p-5">
                            <h3 className="font-bold text-stone-900">Message request</h3>
                            <p className="mt-1 text-xs text-stone-400">
                                A house seeker wants to ask about your {detail.listing_label} report
                            </p>
                            <p className="mt-3 text-sm text-stone-700">
                                &ldquo;{detail.messages?.[0]?.body}&rdquo;
                            </p>
                            <div className="mt-3 flex gap-2">
                                <Button size="sm" className="flex-1" disabled={busy}
                                    onClick={() => void act(() => api.post(`/conversations/${detail.id}/respond`, { action: 'accept' }), 'Request accepted')}>
                                    Accept
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1" disabled={busy}
                                    onClick={() => void act(() => api.post(`/conversations/${detail.id}/respond`, { action: 'decline' }), 'Request declined')}>
                                    Decline
                                </Button>
                            </div>
                        </Card>
                    )}

                    <Card className="mt-4 p-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-stone-900">
                                Conversation · {detail.listing_label}
                            </h3>
                            <div className="flex gap-1">
                                {detail.status !== 'blocked' && (
                                    <Button variant="ghost" size="sm" disabled={busy}
                                        onClick={() => void act(() => api.post(`/conversations/${detail.id}/block`), 'User blocked')}>
                                        Block
                                    </Button>
                                )}
                                <ReportIssueDialog
                                    listingId={detail.listing_id}
                                    trigger={<Button variant="ghost" size="sm">Report</Button>}
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                            {detail.status === 'pending' && !detail.as_owner && 'Waiting for the contributor to accept your question.'}
                            {detail.status === 'declined' && 'This request was declined.'}
                            {detail.status === 'blocked' && (detail.blocked_by_me ? 'You blocked this conversation.' : 'This conversation is closed.')}
                            {detail.status === 'accepted' && (detail.is_expired
                                ? 'This conversation has expired.'
                                : `Auto-expiry: closes ${detail.expires_at ? new Date(detail.expires_at).toLocaleDateString() : 'in 30 days'}. ⏳`)}
                        </p>

                        <div className="mt-4 flex flex-col gap-2">
                            {detail.messages?.map((m) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
                                        m.from === 'me' ? 'ml-auto bg-emerald-700 text-white' : 'bg-stone-100 text-stone-800',
                                    )}
                                >
                                    {m.body}
                                </div>
                            ))}
                        </div>

                        {canWrite && (
                            <>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {QUICK_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => setDraft(q)}
                                            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-stone-300"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Input
                                        placeholder="Write a message…"
                                        value={draft}
                                        maxLength={1000}
                                        onChange={(e) => setDraft(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && void send()}
                                    />
                                    <Button disabled={busy} onClick={() => void send()}>Send</Button>
                                </div>
                            </>
                        )}
                        <p className="mt-2 text-xs text-stone-400">
                            Safety: NyumbaHub staff will never ask for payment in chat. Report anyone who requests money to &ldquo;reserve&rdquo; a house.
                        </p>
                    </Card>
                </>
            )}
        </div>
    );
}
