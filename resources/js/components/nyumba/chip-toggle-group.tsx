import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ChipToggleGroup({ options }: { options: string[] }) {
    const [active, setActive] = useState<string[]>([]);
    const toggle = (o: string) =>
        setActive((prev) =>
            prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o],
        );

    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((o) => (
                <button
                    key={o}
                    type="button"
                    onClick={() => toggle(o)}
                    className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                        active.includes(o)
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300',
                    )}
                >
                    {o}
                </button>
            ))}
        </div>
    );
}