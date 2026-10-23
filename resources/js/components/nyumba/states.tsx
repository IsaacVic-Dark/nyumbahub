import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="flex flex-col gap-2 p-4">
                        <Skeleton className="h-3 w-2/5" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-3/5" />
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function ErrorCard({
    message,
    onRetry,
}: {
    message: string;
    onRetry?: () => void;
}) {
    return (
        <Card className="flex flex-col items-center gap-2 border-red-200 p-8 text-center">
            <div className="text-3xl">📡</div>
            <p className="text-sm text-stone-600">{message}</p>
            {onRetry && (
                <Button size="sm" variant="secondary" onClick={onRetry}>
                    Retry
                </Button>
            )}
        </Card>
    );
}

export function EmptyCard({
    emoji = '🔍',
    title,
    body,
    action,
}: {
    emoji?: string;
    title: string;
    body?: string;
    action?: React.ReactNode;
}) {
    return (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <div className="text-4xl">{emoji}</div>
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            {body && <p className="max-w-sm text-sm text-stone-500">{body}</p>}
            {action}
        </Card>
    );
}
