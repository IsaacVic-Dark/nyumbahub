import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Pagination({
    page,
    lastPage,
    onPage,
}: {
    page: number;
    lastPage: number;
    onPage: (p: number) => void;
}) {
    if (lastPage <= 1) {
        return null;
    }

    const start = Math.max(1, Math.min(page - 2, lastPage - 4));
    const pages = Array.from({ length: Math.min(5, lastPage) }, (_, i) => start + i);

    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
                ← Previous
            </Button>
            {pages.map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onPage(n)}
                    className={cn(
                        'flex size-8 items-center justify-center rounded-full border text-sm font-medium',
                        n === page
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-stone-200 text-stone-600',
                    )}
                >
                    {n}
                </button>
            ))}
            <Button variant="ghost" size="sm" disabled={page >= lastPage} onClick={() => onPage(page + 1)}>
                Next →
            </Button>
        </div>
    );
}
