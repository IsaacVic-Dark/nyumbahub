import { useState } from 'react';
import { cn } from '@/lib/utils';

/** 1–5 rating buttons. Controlled with `value` + `onChange`, otherwise keeps its own state. */
export function RateControl({
    label,
    value,
    onChange,
}: {
    label: string;
    value?: number | null;
    onChange?: (value: number) => void;
}) {
    const [internal, setInternal] = useState<number | null>(null);
    const selected = value ?? internal;

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
                    onClick={() => {
                        setInternal(n);
                        onChange?.(n);
                    }}
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
