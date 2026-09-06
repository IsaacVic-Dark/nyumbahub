import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

export function Field({
    label,
    hint,
    children,
}: {
    label: ReactNode;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-stone-800">
                {label}
            </Label>
            {children}
            {hint && <span className="text-xs text-stone-400">{hint}</span>}
        </div>
    );
}