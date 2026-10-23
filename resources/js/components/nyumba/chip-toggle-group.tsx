import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Multi-select chips. Controlled with `value` + `onChange`, otherwise keeps its own state.
 * `options` may be plain strings or [value, label] pairs.
 */
export function ChipToggleGroup({
    options,
    value,
    onChange,
}: {
    options: (string | [string, string])[];
    value?: string[];
    onChange?: (value: string[]) => void;
}) {
    const [internal, setInternal] = useState<string[]>([]);
    const active = value ?? internal;

    const toggle = (o: string) => {
        const next = active.includes(o) ? active.filter((x) => x !== o) : [...active, o];
        setInternal(next);
        onChange?.(next);
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
                const [val, label] = Array.isArray(opt) ? opt : [opt, opt];

                return (
                    <button
                        key={val}
                        type="button"
                        onClick={() => toggle(val)}
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                            active.includes(val)
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300',
                        )}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
