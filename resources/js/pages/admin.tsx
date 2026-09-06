import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const METRICS: [string, string][] = [
    ['1,284', 'Total active reports'],
    ['96', 'Posted in last 24h'],
    ['31', 'Pending moderation'],
    ['12', 'Flagged reports'],
    ['5', 'Flagged reviews'],
    ['8', 'Duplicate alerts'],
    ['44', 'Expiring in 7 days'],
    ['417', 'Confirmations today'],
    ['9', 'Suspended accounts'],
    ['0.7%', 'Fake-report rate'],
];

const QUEUE_TABS = ['Pending (31)', 'Flagged (12)', 'Duplicates (8)', 'Reviews (5)'];

const QUEUE_ROWS: [string, string, string, string][] = [
    ['1BR · Ruaka · KES 22,000', 'Wanjiru M. · Trust 92', '9 photos · Evidence ✓', '—'],
    ['Bedsitter · South B · KES 11,500', 'Otieno K. · Trust 74', '7 photos · Evidence ✓', 'Duplicate: 2 similar in same plot'],
    ['Studio · Kilimani · KES 34,000', 'Anon · Trust 31', '3 photos · No evidence', 'Rent implausible for area'],
    ['2BR · Kasarani · KES 19,000', 'Mueni S. · Trust 88', '8 photos · Evidence ✓', '1 user reported "already occupied"'],
    ['1BR · Embakasi · KES 14,000', 'New member · Trust 12', '2 photos', 'Possible phone number in review text'],
];

const ROW_ACTIONS = ['Approve', 'Reject', 'Request changes', 'Archive', 'Suspend', 'Note'];

const ADMIN_FUNCTIONS = [
    'Manage users',
    'Manage reports',
    'Manage confirmations',
    'Manage flags',
    'Manage content rules',
    'Configure report expiry',
    'Configure trust thresholds',
    'Featured locations',
    'View analytics',
    'Export anonymised reports',
];

const AUDIT_LOG: [string, string, string][] = [
    ['moderator_amina', 'Approved report #4821', '09:12'],
    ['super_admin', 'Changed report expiry to 21 days', '08:47'],
    ['moderator_brian', 'Suspended contributor #9931 for duplicate spam', '08:20'],
    ['content_reviewer_joy', 'Removed review text containing a phone number', '07:58'],
    ['support_ken', 'Merged duplicate reports #4790 and #4802', '07:31'],
];

export default function Admin() {
    const [tab, setTab] = useState(QUEUE_TABS[0]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <Head title="Staff portal" />

            <div>
                <h1 className="text-xl font-extrabold text-stone-900">
                    NyumbaHub staff portal
                </h1>
                <p className="text-sm text-stone-500">
                    Moderation, trust & safety, and platform configuration.
                    Desktop-optimised.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Signed in as: Super admin
                </span>
                <select className="h-8 rounded-md border border-stone-200 bg-white px-2 text-xs">
                    <option>Super admin</option>
                    <option>Moderator</option>
                    <option>Support agent</option>
                    <option>Content reviewer</option>
                    <option>Analyst</option>
                </select>
                <span className="text-xs text-stone-400">
                    Role-based permissions applied to every action below.
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {METRICS.map(([n, l]) => (
                    <Card key={l} className="p-3 text-center">
                        <div className="text-lg font-extrabold text-emerald-700">
                            {n}
                        </div>
                        <div className="mt-0.5 text-[11px] text-stone-500">
                            {l}
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-stone-900">
                        Moderation queue
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {QUEUE_TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-xs font-medium',
                                    tab === t
                                        ? 'border-emerald-700 bg-emerald-700 text-white'
                                        : 'border-stone-200 bg-white text-stone-600',
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-3 overflow-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="border-b border-stone-200 text-left text-stone-500">
                                <th className="py-2 pr-4 font-medium">Report</th>
                                <th className="py-2 pr-4 font-medium">Contributor</th>
                                <th className="py-2 pr-4 font-medium">Signals</th>
                                <th className="py-2 pr-4 font-medium">Flags</th>
                                <th className="py-2 pr-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {QUEUE_ROWS.map(([report, contributor, signals, flag]) => (
                                <tr key={report} className="border-b border-stone-100 align-top">
                                    <td className="py-2 pr-4">
                                        <b className="text-stone-900">{report}</b>
                                        <div className="text-xs text-stone-400">
                                            Submitted 3h ago
                                        </div>
                                    </td>
                                    <td className="py-2 pr-4 text-stone-600">{contributor}</td>
                                    <td className="py-2 pr-4 text-stone-500">{signals}</td>
                                    <td className="py-2 pr-4">
                                        {flag === '—' ? (
                                            <span className="text-stone-400">—</span>
                                        ) : (
                                            <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                {flag}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2 pr-4">
                                        <div className="flex flex-wrap gap-1">
                                            {ROW_ACTIONS.map((a) => (
                                                <button
                                                    key={a}
                                                    onClick={() => toast(`${a}: ${report}`)}
                                                    className="rounded-full border border-stone-200 px-2 py-1 text-[11px] font-medium text-stone-600 hover:border-stone-300"
                                                >
                                                    {a}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="p-4">
                    <h3 className="font-bold text-stone-900">Admin functions</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {ADMIN_FUNCTIONS.map((t) => (
                            <button
                                key={t}
                                onClick={() => toast(t)}
                                className="rounded-lg border border-stone-200 bg-white p-3 text-left text-sm font-semibold text-stone-800 hover:border-stone-300"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </Card>

                <Card className="p-4">
                    <h3 className="font-bold text-stone-900">Audit log</h3>
                    <div className="mt-3 flex flex-col gap-3">
                        {AUDIT_LOG.map(([user, action, time]) => (
                            <div key={user + time} className="border-l-2 border-stone-200 pl-3">
                                <div className="flex items-center justify-between">
                                    <b className="text-sm text-stone-900">{user}</b>
                                    <span className="text-xs text-stone-400">{time}</span>
                                </div>
                                <p className="text-sm text-stone-500">{action}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-xs text-stone-400">
                        Every moderation action is immutable and attributable.
                    </p>
                </Card>
            </div>
        </div>
    );
}