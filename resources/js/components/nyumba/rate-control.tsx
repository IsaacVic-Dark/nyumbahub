import { useState } from 'react';
import { cn } from '@/lib/utils';

export function RateControl({ label }: { label: string }) {
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <div
            role="group"
            aria-label={`${label} rating`}
            className="flex items-center gap-1"
        >
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => setSelected(n)}
                    className={cn(
                        'flex size-7 items-center justify-center rounded-md border text-xs font-bold',
                        selected === n
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-stone-200 bg-white text-stone-500',
                    )}
                >
                    {n}
                </button>
            ))}
        </div>
    );
}