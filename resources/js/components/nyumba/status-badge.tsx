import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { STATUS_META, VERIFICATION_META } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';
import type { ListingStatus, VerificationBadge } from '@/types/nyumba';

type BaseProps = {
    className?: string;
};

function BadgePill({
    label,
    tip,
    className,
    pillClassName,
}: BaseProps & { label: string; tip: string; pillClassName: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={cn(
                        'inline-flex cursor-help items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-tight whitespace-nowrap',
                        pillClassName,
                        className,
                    )}
                >
                    {label}
                </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-center">
                {tip}
            </TooltipContent>
        </Tooltip>
    );
}

export function ListingStatusBadge({
    status,
    className,
}: BaseProps & { status: ListingStatus }) {
    const meta = STATUS_META[status];
    return (
        <BadgePill
            label={meta.label}
            tip={meta.tip}
            pillClassName={meta.className}
            className={className}
        />
    );
}

export function VerificationBadgePill({
    badge,
    className,
}: BaseProps & { badge: VerificationBadge }) {
    const meta = VERIFICATION_META[badge];
    return (
        <BadgePill
            label={meta.label}
            tip={meta.tip}
            pillClassName={meta.className}
            className={className}
        />
    );
}