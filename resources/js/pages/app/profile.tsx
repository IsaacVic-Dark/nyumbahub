import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useInitials } from '@/hooks/use-initials';
import { useSavedListings } from '@/hooks/use-saved-listings';
import { PRIVACY_TOGGLES, PROFILE_METRICS, PROFILE_NAV, TRUST_LEVELS } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';

export default function Profile() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const { saved } = useSavedListings();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const metrics = [...PROFILE_METRICS.slice(0, 5), [String(saved.length), 'Saved homes'] as [string, string], ...PROFILE_METRICS.slice(5)];

    return (
        <div className="mx-auto max-w-4xl py-6 pb-16">
            <Head title="My profile" />

            <h1 className="text-2xl font-extrabold text-stone-900">My profile</h1>
            <p className="mt-1 text-sm text-stone-500">
                Your contributions, trust level and privacy controls.
            </p>

            <Card className="mt-5 p-5">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-800">
                        {getInitials(auth.user?.name ?? 'Wanjiru M.')}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-bold text-stone-900">
                                {auth.user?.name ?? 'Wanjiru M.'}
                            </h3>
                            <VerificationBadgePill badge="phone" />
                            <VerificationBadgePill badge="id" />
                        </div>
                        <p className="text-sm text-stone-500">
                            Trusted Tenant · Joined March 2025 · Nairobi
                        </p>
                    </div>
                </div>
                <p className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
                    🌍 Community impact: your reports have been viewed 3,412
                    times and helped 47 people shortlist a home.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {metrics.map(([n, l]) => (
                        <div key={l} className="text-center">
                            <div className="text-xl font-extrabold text-emerald-700">
                                {n}
                            </div>
                            <div className="mt-0.5 text-xs text-stone-500">
                                {l}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="mt-4 p-5">
                <h3 className="font-bold text-stone-900">
                    Contributor trust levels
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                    {TRUST_LEVELS.map(([title, desc, done]) => (
                        <div
                            key={title}
                            className="flex items-center justify-between rounded-lg border border-stone-100 p-3"
                        >
                            <div>
                                <b className="text-sm text-stone-900">{title}</b>
                                <p className="text-xs text-stone-400">{desc}</p>
                            </div>
                            <span
                                className={cn(
                                    'shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold',
                                    done
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'border-stone-200 bg-stone-100 text-stone-500',
                                )}
                            >
                                {done ? 'Achieved' : 'Locked'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full w-3/5 rounded-full bg-emerald-600" />
                </div>
                <p className="mt-1.5 text-xs text-stone-400">
                    Verification progress: Phone verified ✓ · Identity
                    verification pending ⏳ · Former tenant evidence submitted
                    ✓ · Trusted Tenant achieved ✓
                </p>
            </Card>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Card className="p-5">
                    <h3 className="font-bold text-stone-900">
                        Profile navigation
                    </h3>
                    <div className="mt-3 flex flex-col gap-2">
                        {PROFILE_NAV.map(([title, href]) => (
                            <Link
                                key={title}
                                href={href}
                                className="flex items-center justify-between rounded-lg border border-stone-100 p-3 text-sm font-semibold text-stone-800 hover:border-stone-200"
                            >
                                {title}
                                <ChevronRight className="size-4 text-stone-400" />
                            </Link>
                        ))}
                        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="mt-2 w-full">
                                    Delete account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete account</DialogTitle>
                                    <DialogDescription>
                                        This permanently removes your profile.
                                        Published vacancy reports may remain
                                        in an anonymised form so the
                                        community is not left with broken
                                        information.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 sm:gap-2">
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setDeleteOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => {
                                            setDeleteOpen(false);
                                            toast('Deletion request received');
                                        }}
                                    >
                                        Delete account
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>

                <Card className="p-5">
                    <h3 className="font-bold text-stone-900">
                        Privacy settings
                    </h3>
                    <div className="mt-3 flex flex-col gap-2">
                        {PRIVACY_TOGGLES.map(([label, checked]) => (
                            <Label
                                key={label}
                                className="flex cursor-pointer items-center justify-between rounded-lg border border-stone-100 p-3 text-sm font-semibold text-stone-800"
                            >
                                {label}
                                <Checkbox defaultChecked={checked} />
                            </Label>
                        ))}
                        <Input
                            type="date"
                            aria-label="Disable messages after"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}