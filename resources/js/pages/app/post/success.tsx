import { Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PostSuccess() {
    return (
        <div className="mx-auto max-w-md py-16">
            <Head title="Report published" />

            <Card className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="text-5xl">🎉</div>
                <h1 className="text-xl font-extrabold text-stone-900">
                    Your vacancy report can help someone find a home faster.
                </h1>
                <p className="text-sm text-stone-500">
                    Thank you for contributing to the NyumbaHub community.
                </p>
                <div className="flex items-center gap-2">
                    <VerificationBadgePill badge="review" />
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        Status: Under review
                    </span>
                </div>
                <p className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                    Return after a few days to confirm whether the home is
                    still vacant. Reports that are reconfirmed stay visible
                    for longer.
                </p>

                <div className="mt-2 flex w-full flex-col gap-2">
                    <Button
                        className="w-full"
                        onClick={() => toast('Share sheet opened')}
                    >
                        Share with your estate / community
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link href="/listings/L1">View my report</Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link href="/profile">Go to my profile</Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}