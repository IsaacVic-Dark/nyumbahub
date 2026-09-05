import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RatingStars({
    rating,
    className,
}: {
    rating: number;
    className?: string;
}) {
    const rounded = Math.round(rating);

    return (
        <span
            className={cn('inline-flex items-center gap-1', className)}
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
            <span className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            'size-3.5',
                            i < rounded
                                ? 'fill-amber-500 text-amber-500'
                                : 'fill-stone-200 text-stone-200',
                        )}
                    />
                ))}
            </span>
            <span className="text-xs font-semibold text-stone-600">
                {rating.toFixed(1)}
            </span>
        </span>
    );
}