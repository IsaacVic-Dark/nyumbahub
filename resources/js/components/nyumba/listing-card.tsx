import { Link } from '@inertiajs/react';
import {
    Bath,
    BedDouble,
    Camera,
    Car,
    Droplet,
    Heart,
    Home,
    ShieldCheck,
    Video,
} from 'lucide-react';
import { RatingStars } from '@/components/nyumba/rating-stars';
import { ListingStatusBadge, VerificationBadgePill } from '@/components/nyumba/status-badge';
import { Card } from '@/components/ui/card';
import { useSaveListing } from '@/hooks/use-saved-listings';
import { timeAgo } from '@/lib/format';
import { formatKes, scoreLabel } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/nyumba';

export function ListingCard({
    listing,
    onSavedChange,
}: {
    listing: Listing;
    onSavedChange?: (saved: boolean) => void;
}) {
    const { saved, toggle } = useSaveListing(listing.id, listing.is_saved, onSavedChange);
    const loc = listing.location;
    const scores = listing.condition?.scores ?? {};
    const water = scoreLabel(scores['Water reliability']);
    const security = scoreLabel(scores['Security']);
    const hasParking = listing.details?.features?.includes('Parking');

    return (
        <Card className="group overflow-hidden p-0 transition hover:shadow-md">
            <Link href={`/listings/${listing.id}`} className="block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    {listing.thumbnail ? (
                        <img
                            src={listing.thumbnail}
                            alt={`${listing.house_type} in ${loc?.estate?.name ?? 'Kenya'}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-300">
                            <Home className="size-12" />
                        </div>
                    )}
                    <div className="absolute top-2 left-2">
                        <ListingStatusBadge status={listing.status} />
                    </div>
                    <button
                        type="button"
                        aria-label={saved ? 'Remove from saved homes' : 'Save home'}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void toggle();
                        }}
                        className={cn(
                            'absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white',
                            saved && 'text-red-600',
                        )}
                    >
                        <Heart className={cn('size-4', saved && 'fill-red-600')} />
                    </button>
                    {listing.photos_count > 0 && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                            <Camera className="size-3" /> {listing.photos_count}
                            {listing.has_video && (
                                <>
                                    <span className="mx-0.5">·</span>
                                    <Video className="size-3" />
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <span className="text-xs font-semibold text-emerald-700">
                        {listing.house_type} ·{' '}
                        {[loc?.estate?.name, loc?.town?.name].filter(Boolean).join(', ')}
                    </span>
                    <h3 className="text-sm leading-snug font-bold text-stone-900">
                        {listing.title}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-stone-900">
                            {formatKes(listing.last_monthly_rent)}{' '}
                            <span className="text-xs font-normal text-stone-500">
                                last known / month
                            </span>
                        </div>
                        {listing.rating !== null && <RatingStars rating={listing.rating} />}
                    </div>

                    <div className="text-xs text-stone-500">
                        {listing.deposit_amount !== null && (
                            <>Deposit {formatKes(listing.deposit_amount)} · </>
                        )}
                        Reported {timeAgo(listing.created_at)} · Last confirmed:{' '}
                        {listing.last_confirmed_at
                            ? timeAgo(listing.last_confirmed_at)
                            : 'Not yet confirmed'}
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
                        {listing.bedrooms !== null && (
                            <span className="inline-flex items-center gap-1">
                                <BedDouble className="size-3.5" />
                                {listing.bedrooms ? `${listing.bedrooms} bd` : 'Studio'}
                            </span>
                        )}
                        {listing.bathrooms !== null && (
                            <span className="inline-flex items-center gap-1">
                                <Bath className="size-3.5" /> {listing.bathrooms} ba
                            </span>
                        )}
                        {listing.details?.features && (
                            <span className="inline-flex items-center gap-1">
                                <Car className="size-3.5" />
                                {hasParking ? 'Parking' : 'No parking'}
                            </span>
                        )}
                        {water && (
                            <span className="inline-flex items-center gap-1">
                                <Droplet className="size-3.5" /> {water}
                            </span>
                        )}
                        {security && (
                            <span className="inline-flex items-center gap-1">
                                <ShieldCheck className="size-3.5" /> {security}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {listing.badges.slice(0, 2).map((badge) => (
                            <VerificationBadgePill key={badge} badge={badge} />
                        ))}
                    </div>

                    <p className="border-t border-stone-100 pt-2 text-[11px] text-stone-400">
                        Tenant-reported. Confirm rent and availability when you visit.
                    </p>
                </div>
            </Link>
        </Card>
    );
}
