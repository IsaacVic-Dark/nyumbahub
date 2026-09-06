import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const NOTIFICATION_ROWS = [
    'Saved home confirmed vacant',
    'Saved home possibly occupied',
    'Rent updated on a saved report',
    'New match for a search alert',
    'Someone found my report helpful',
    'Someone asked me a question',
    'My report is due for reconfirmation',
    'Moderation updates',
];

const DATA_TOGGLES: [string, boolean][] = [
    ['Low-bandwidth mode (smaller images)', true],
    ['Cache recent searches for offline viewing', true],
    ['Save vacancy report drafts on this device', true],
];

export default function NotificationsSettings() {
    return (
        <div className="flex flex-col gap-6">
            <Head title="Notification settings" />

            <div>
                <h2 className="text-lg font-bold text-stone-900">
                    Notification settings
                </h2>
                <p className="text-sm text-stone-500">
                    Notifications, privacy and data controls.
                </p>
            </div>

            <Card className="p-5">
                <h3 className="font-bold text-stone-900">
                    Notification settings
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                    {NOTIFICATION_ROWS.map((label) => (
                        <div
                            key={label}
                            className="flex items-center justify-between rounded-lg border border-stone-100 p-3"
                        >
                            <span className="text-sm font-semibold text-stone-800">
                                {label}
                            </span>
                            <select className="h-9 rounded-md border border-stone-200 bg-white px-2 text-xs">
                                <option>Push</option>
                                <option>Push + Email</option>
                                <option>Push + SMS</option>
                                <option>Off</option>
                            </select>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-5">
                <h3 className="font-bold text-stone-900">
                    Data and connection
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                    {DATA_TOGGLES.map(([label, checked]) => (
                        <Label
                            key={label}
                            className="flex cursor-pointer items-center justify-between rounded-lg border border-stone-100 p-3 text-sm font-semibold text-stone-800"
                        >
                            {label}
                            <Checkbox defaultChecked={checked} />
                        </Label>
                    ))}
                </div>
                <p className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                    📶 Offline draft mode is on. One draft is waiting to
                    upload when you reconnect.
                </p>
            </Card>

            <Card className="border-red-200 p-5">
                <h3 className="font-bold text-stone-900">Danger zone</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast('Export requested')}
                    >
                        Export my data
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => toast('Deletion request received')}
                    >
                        Delete account
                    </Button>
                </div>
            </Card>
        </div>
    );
}

NotificationsSettings.layout = {
    breadcrumbs: [{ title: 'Notifications', href: '/settings/notifications' }],
};