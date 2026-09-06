import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ListingStatusBadge, VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Card } from '@/components/ui/card';
import { STATUS_META, VERIFICATION_META } from '@/lib/nyumba-data';
import type { ListingStatus, VerificationBadge } from '@/types/nyumba';

const TOPICS = [
    'How NyumbaHub works',
    'How to post a reliable vacancy report',
    'How community confirmation works',
    'How to search safely',
    'How trust badges work',
    'How to report inaccurate information',
    'Privacy and document protection',
    'Community guidelines',
    'Contact support',
];

const FAQS: [string, string][] = [
    [
        'Is NyumbaHub an agent?',
        'No. NyumbaHub is a community platform for tenant-reported vacancy reports. We do not advertise on behalf of landlords, manage property, show houses or take commission.',
    ],
    [
        'Does NyumbaHub guarantee a home is vacant?',
        'No. Every report is a snapshot from a tenant or visitor. Always confirm availability at the building before paying anything.',
    ],
    [
        'Can I post a home before moving out?',
        'Yes. Mark it as an upcoming vacancy and give your expected move-out date so seekers know when to visit.',
    ],
    [
        'Can I edit or delete my report?',
        'Yes. Go to Profile → My vacancy reports. Edits are logged so the community can see what changed.',
    ],
    [
        'Why is a listing marked "needs reconfirmation"?',
        'No one has confirmed the home after a physical visit recently, so the information may be out of date.',
    ],
    [
        "Why can't I see the exact unit number?",
        'Unit numbers are private to protect the previous tenant and current occupants. A contributor may share it privately if they choose.',
    ],
    [
        'How is the last-known rent verified?',
        'It is what the previous tenant says they paid, and it can be updated by community members after a visit. It is not a landlord-quoted price.',
    ],
    [
        'Can a former tenant be held responsible if the house is already taken?',
        'No. Contributors share information in good faith. NyumbaHub is not a booking system and no one is promising you a house.',
    ],
    [
        'How does NyumbaHub protect users from fake reports?',
        'Through phone and optional identity verification, private occupancy evidence, duplicate detection, contribution weighting, rate limits and a human moderation queue.',
    ],
];

const STATUS_KEYS = Object.keys(STATUS_META) as ListingStatus[];
const BADGE_KEYS = Object.keys(VERIFICATION_META) as VerificationBadge[];

export default function Help() {
    return (
        <div className="py-6 pb-16">
            <Head title="Help centre" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Help centre
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Guides, community guidelines and frequently asked questions.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TOPICS.map((t) => (
                    <button
                        key={t}
                        onClick={() => toast(`Opening: ${t}`)}
                        className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4 text-left text-sm font-semibold text-stone-800 hover:border-stone-300"
                    >
                        {t}
                        <ChevronRight className="size-4 text-stone-400" />
                    </button>
                ))}
            </div>

            <h2 className="mt-8 mb-3 text-lg font-extrabold text-stone-900">
                Trust badges explained
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {BADGE_KEYS.map((key) => (
                    <Card key={key} className="p-4">
                        <VerificationBadgePill badge={key} />
                        <p className="mt-2 text-xs text-stone-500">
                            {VERIFICATION_META[key].tip}
                        </p>
                    </Card>
                ))}
                {STATUS_KEYS.map((key) => (
                    <Card key={key} className="p-4">
                        <ListingStatusBadge status={key} />
                        <p className="mt-2 text-xs text-stone-500">
                            {STATUS_META[key].tip}
                        </p>
                    </Card>
                ))}
            </div>

            <h2 className="mt-8 mb-3 text-lg font-extrabold text-stone-900">
                Frequently asked questions
            </h2>
            <div className="flex flex-col gap-2">
                {FAQS.map(([q, a]) => (
                    <details
                        key={q}
                        className="group rounded-xl border border-stone-200 bg-white p-4"
                    >
                        <summary className="cursor-pointer text-sm font-bold text-stone-900 marker:content-none">
                            {q}
                        </summary>
                        <p className="mt-2 text-sm text-stone-500">{a}</p>
                    </details>
                ))}
            </div>
        </div>
    );
}