import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { VerificationBadgePill } from '@/components/nyumba/status-badge';
import { ErrorCard } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useInitials } from '@/hooks/use-initials';
import { api, getErrorMessage } from '@/lib/api';
import { formatMonthYear } from '@/lib/format';
import { useApi } from '@/lib/use-api';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types/auth';
import type { Profile as ProfileData } from '@/types/nyumba';

const PRIVACY_TOGGLES: [keyof ProfileData['privacy'], string][] = [
    ['hide_public_name', 'Hide my public name (show as anonymous)'],
    ['hide_profile_photo', 'Hide my profile photo'],
    ['allow_questions', 'Allow questions from house seekers'],
    ['directions_verified_only', 'Share directions only with verified users'],
    ['show_activity_status', 'Show my activity status'],
];

const NAV: [string, string][] = [
    ['My reports', '/my-reports'],
    ['My confirmations', '/my-confirmations'],
    ['Saved homes', '/saved'],
    ['Search alerts', '/alerts'],
    ['Account settings', '/settings/profile'],
];

export default function Profile() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();
    const { data, loading, error, reload, setData } = useApi<{ data: ProfileData }>('/me/profile');
    const p = data?.data;

    const updatePrivacy = async (patch: Partial<ProfileData['privacy']>) => {
        if (!p) return;
        const prev = p.privacy;
        setData((d) => (d ? { data: { ...d.data, privacy: { ...d.data.privacy, ...patch } } } : d));
        try {
            await api.put('/me/privacy', patch);
        } catch (e) {
            setData((d) => (d ? { data: { ...d.data, privacy: prev } } : d));
            toast.error(getErrorMessage(e));
        }
    };

    if (error) {
        return <div className="py-10"><ErrorCard message={error} onRetry={reload} /></div>;
    }
    if (loading || !p) {
        return (
            <div className="mx-auto max-w-4xl py-6">
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    const m = p.metrics;
    const metrics: [number, string][] = [
        [m.reports_posted, 'Reports posted'],
        [m.reports_active, 'Active reports'],
        [m.confirmations, 'Confirmations'],
        [m.helpful_votes, 'Helpful votes'],
        [m.reviews, 'Reviews'],
        [m.saved_homes, 'Saved homes'],
        [m.search_alerts, 'Search alerts'],
        [m.trust_score, 'Trust score'],
    ];
    const achieved = p.trust_levels.filter((t) => t.achieved).length;

    return (
        <div className="mx-auto max-w-4xl py-6 pb-16">
            <Head title="My profile" />

            <h1 className="text-2xl font-extrabold text-stone-900">My profile</h1>
            <p className="mt-1 text-sm text-stone-500">Your contributions, trust level and privacy controls.</p>

            <Card className="mt-5 p-5">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-800">
                        {getInitials(p.name)}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-bold text-stone-900">{p.name}</h3>
                            {p.verification.phone && <VerificationBadgePill badge="phone" />}
                            {p.verification.identity && <VerificationBadgePill badge="id" />}
                        </div>
                        <p className="text-sm text-stone-500">
                            {p.trust_level} · Joined {formatMonthYear(p.joined_at)}
                        </p>
                    </div>
                    {auth.user?.is_admin && (
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/admin">Staff portal</Link>
                        </Button>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {metrics.map(([n, l]) => (
                        <div key={l} className="text-center">
                            <div className="text-xl font-extrabold text-emerald-700">{n}</div>
                            <div className="mt-0.5 text-xs text-stone-500">{l}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="mt-4 p-5">
                <h3 className="font-bold text-stone-900">Contributor trust levels</h3>
                <div className="mt-3 flex flex-col gap-2">
                    {p.trust_levels.map((t) => (
                        <div key={t.title} className="flex items-center justify-between rounded-lg border border-stone-100 p-3">
                            <div>
                                <b className="text-sm text-stone-900">{t.title}</b>
                                <p className="text-xs text-stone-400">{t.description}</p>
                            </div>
                            <span
                                className={cn(
                                    'shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold',
                                    t.achieved
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'border-stone-200 bg-stone-100 text-stone-500',
                                )}
                            >
                                {t.achieved ? 'Achieved' : 'Locked'}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${(achieved / Math.max(1, p.trust_levels.length)) * 100}%` }}
                    />
                </div>
                <p className="mt-1.5 text-xs text-stone-400">
                    Phone {p.verification.phone ? 'verified ✓' : 'not verified'} · Identity{' '}
                    {p.verification.identity ? 'verified ✓' : 'not verified'}
                </p>
            </Card>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Card className="p-5">
                    <h3 className="font-bold text-stone-900">Profile navigation</h3>
                    <div className="mt-3 flex flex-col gap-2">
                        {NAV.map(([title, href]) => (
                            <Link
                                key={title}
                                href={href}
                                className="flex items-center justify-between rounded-lg border border-stone-100 p-3 text-sm font-semibold text-stone-800 hover:border-stone-200"
                            >
                                {title}
                                <ChevronRight className="size-4 text-stone-400" />
                            </Link>
                        ))}
                        <Button variant="destructive" className="mt-2 w-full" asChild>
                            <Link href="/settings/profile">Delete account…</Link>
                        </Button>
                    </div>
                </Card>

                <Card className="p-5">
                    <h3 className="font-bold text-stone-900">Privacy settings</h3>
                    <div className="mt-3 flex flex-col gap-2">
                        {PRIVACY_TOGGLES.map(([key, label]) => (
                            <Label
                                key={key}
                                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-stone-100 p-3 text-sm font-semibold text-stone-800"
                            >
                                {label}
                                <Checkbox
                                    checked={Boolean(p.privacy[key])}
                                    onCheckedChange={(c) => void updatePrivacy({ [key]: c === true })}
                                />
                            </Label>
                        ))}
                        <Label className="mt-1 flex flex-col items-start gap-1.5 text-sm font-semibold text-stone-800">
                            Disable messages after
                            <Input
                                type="date"
                                value={p.privacy.messages_disabled_after?.slice(0, 10) ?? ''}
                                onChange={(e) => void updatePrivacy({ messages_disabled_after: e.target.value || null })}
                            />
                        </Label>
                    </div>
                </Card>
            </div>
        </div>
    );
}
