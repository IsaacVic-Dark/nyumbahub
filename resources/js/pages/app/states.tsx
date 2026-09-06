import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { RateControl } from '@/components/nyumba/rate-control';
import { ListingStatusBadge, VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { STATUS_META, VERIFICATION_META } from '@/lib/nyumba-data';
import type { ListingStatus, VerificationBadge } from '@/types/nyumba';

const SYSTEM_STATES: [string, string, string, string][] = [
    ['First-time onboarding', '👋', 'Welcome to NyumbaHub. Are you looking for a home, moving out, or both?', 'Start'],
    ['Empty saved homes', '🏘️', 'Tap the heart on a report to track it here.', 'Explore homes'],
    ['Empty notifications', '🔕', 'No activity yet. We will tell you when a saved home changes.', 'Create an alert'],
    ['No search results', '🔍', 'Nothing matches those filters. Try a nearby estate.', 'Widen search'],
    ['Listing expired', '⌛', 'This report expired after 30 days without a confirmation.', 'See similar homes'],
    ['Reported as occupied', '🚫', 'A visitor reported this home may be taken.', 'Report differently'],
    ['Awaiting moderation', '⏳', 'This report is under review and not fully public yet.', 'Learn why'],
    ['Removed for policy reasons', '🛡️', 'This report broke community guidelines and was removed.', 'Read guidelines'],
    ['User blocked', '⛔', 'You blocked this user. They cannot message you.', 'Unblock'],
    ['Network error', '📡', 'We could not reach NyumbaHub. Cached results are shown.', 'Retry'],
    ['Slow connection mode', '🐢', 'Images are loading in low quality to save your data.', 'Use full quality'],
    ['Unsaved changes', '✍️', 'You have unsaved changes to your vacancy report.', 'Save draft'],
];

const STATUS_KEYS = Object.keys(STATUS_META) as ListingStatus[];
const BADGE_KEYS = Object.keys(VERIFICATION_META) as VerificationBadge[];

export default function States() {
    return (
        <div className="py-6 pb-16">
            <Head title="System states" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                System states
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Every important product state, in one place.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {SYSTEM_STATES.map(([title, emoji, body, cta]) => (
                    <Card key={title} className="flex flex-col items-center gap-1 p-6 text-center">
                        <div className="text-3xl">{emoji}</div>
                        <h4 className="mt-1 text-sm font-bold text-stone-900">
                            {title}
                        </h4>
                        <p className="text-sm text-stone-500">{body}</p>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="mt-2"
                            onClick={() => toast(cta)}
                        >
                            {cta}
                        </Button>
                    </Card>
                ))}
            </div>

            <h2 className="mt-8 mb-3 text-lg font-extrabold text-stone-900">
                Design system
            </h2>
            <Card className="flex flex-col gap-6 p-6">
                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Buttons
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <Button>Primary</Button>
                        <Button className="bg-amber-500 text-amber-950 hover:bg-amber-400">
                            Amber
                        </Button>
                        <Button variant="secondary">Soft</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Danger</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Inputs
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input placeholder="Text input" />
                        <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                            <option>Dropdown</option>
                        </select>
                        <Textarea placeholder="Textarea" />
                        <div>
                            <Input
                                placeholder="Invalid field"
                                className="border-red-400"
                            />
                            <span className="mt-1 block text-xs text-red-600">
                                Enter a valid Kenyan phone number.
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Badges
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_KEYS.map((k) => (
                            <ListingStatusBadge key={k} status={k} />
                        ))}
                        {BADGE_KEYS.map((k) => (
                            <VerificationBadgePill key={k} badge={k} />
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Rating control
                    </h4>
                    <RateControl label="demo" />
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Alert banners
                    </h4>
                    <div className="flex flex-col gap-2">
                        <p className="rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                            ⚠️ Rent and availability change quickly.
                        </p>
                        <p className="rounded-lg bg-stone-50 px-4 py-2 text-xs text-stone-600">
                            ℹ️ Neutral informational note.
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Skeletons
                    </h4>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-3.5 w-3/5" />
                        <Skeleton className="h-3.5 w-4/5" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-bold text-stone-900">
                        Modals, sheets & toasts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    Open bottom sheet
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom">
                                <SheetHeader>
                                    <SheetTitle>Bottom sheet</SheetTitle>
                                </SheetHeader>
                                <p className="p-4 text-sm text-stone-500">
                                    Bottom sheets are the primary mobile
                                    overlay pattern in NyumbaHub.
                                </p>
                            </SheetContent>
                        </Sheet>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast('This is a toast notification')}
                        >
                            Show toast
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}