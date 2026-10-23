import { Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { ListingStatusBadge } from '@/components/nyumba/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApi } from '@/lib/use-api';
import type { Listing } from '@/types/nyumba';

export default function PostSuccess() {
    const id = new URLSearchParams(window.location.search).get('listing');
    const { data } = useApi<{ data: Listing }>(id ? `/listings/${id}` : null);
    const listing = data?.data;
    const url = id ? `${window.location.origin}/listings/${id}` : window.location.origin;

    const share = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: listing?.title ?? 'Vacancy on NyumbaHub', url });
            } else {
                await navigator.clipboard.writeText(url);
                toast('Link copied');
            }
        } catch {
            // dismissed
        }
    };

    return (
        <div className="mx-auto max-w-md py-16">
            <Head title="Report published" />

            <Card className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="text-5xl">🎉</div>
                <h1 className="text-xl font-extrabold text-stone-900">
                    Your vacancy report can help someone find a home faster.
                </h1>
                <p className="text-sm text-stone-500">Thank you for contributing to the NyumbaHub community.</p>
                {listing && (
                    <div className="flex items-center gap-2">
                        <ListingStatusBadge status={listing.status} />
                    </div>
                )}
                <p className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                    Return after a few days to confirm whether the home is still vacant. Reports that are
                    reconfirmed stay visible for longer.
                </p>

                <div className="mt-2 flex w-full flex-col gap-2">
                    <Button className="w-full" onClick={() => void share()}>
                        Share with your estate / community
                    </Button>
                    {id && (
                        <Button variant="ghost" className="w-full" asChild>
                            <Link href={`/listings/${id}`}>View my report</Link>
                        </Button>
                    )}
                    <Button variant="ghost" className="w-full" asChild>
                        <Link href="/profile">Go to my profile</Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
