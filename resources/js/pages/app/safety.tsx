import { Head } from '@inertiajs/react';
import { ReportIssueDialog } from '@/components/nyumba/report-issue-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const TIPS: [string, string, string][] = [
    ['🔎', 'Inspect before you pay', 'See the actual house, not just photos. Photos may be old.'],
    ['🏢', 'Confirm availability at the building', 'Speak to the caretaker, landlord or management yourself.'],
    ['💸', 'Never send rent based on an online post', 'No deposit, no "viewing fee", no "reservation", no exceptions.'],
    ['🧾', 'Verify who may collect money', 'Ask for written confirmation of who is authorised.'],
    ['📄', 'Do not share documents in messages', 'Never send ID, passport or M-Pesa statements in a chat.'],
    ['🌤️', 'Visit in daylight where possible', 'Bring someone with you if the area is unfamiliar.'],
    ['📍', 'Tell someone where you are going', 'Share the estate and your expected return time.'],
    ['🚩', 'Report suspicious content', 'Flag listings, messages or payment requests immediately.'],
    ['🏦', 'NyumbaHub handles no money', 'We do not collect rent, deposits or booking fees. Ever.'],
];

export default function Safety() {
    return (
        <div className="py-6 pb-16">
            <Head title="Safety centre" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                House hunt safely.
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Practical steps to protect your money and your personal
                information.
            </p>

            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                🚨 NyumbaHub will never ask you to pay to unlock a house or
                reserve a vacancy.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TIPS.map(([emoji, title, body]) => (
                    <Card key={title} className="p-5">
                        <div className="text-2xl">{emoji}</div>
                        <h4 className="mt-2 text-sm font-bold text-stone-900">
                            {title}
                        </h4>
                        <p className="mt-1 text-sm text-stone-500">{body}</p>
                    </Card>
                ))}
            </div>

            <Card className="mt-5 p-6">
                <h3 className="font-bold text-stone-900">
                    Report something urgently
                </h3>
                <p className="mt-1.5 text-sm text-stone-500">
                    If someone asked you for money to reserve a house, tell
                    us right away so we can suspend the account.
                </p>
                <ReportIssueDialog
                    trigger={
                        <Button variant="destructive" className="mt-3">
                            Report a scam or unsafe user
                        </Button>
                    }
                />
            </Card>
        </div>
    );
}