import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/** Works uncontrolled (defaultValue) or controlled (value + onChange). */
export function RadioCardGroup({
    name,
    options,
    defaultValue,
    value,
    onChange,
}: {
    name: string;
    options: string[];
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
}) {
    const [internal, setInternal] = useState(defaultValue ?? '');
    const current = value ?? internal;

    return (
        <RadioGroup
            name={name}
            value={current}
            onValueChange={(v) => {
                setInternal(v);
                onChange?.(v);
            }}
            className="gap-2"
        >
            {options.map((option) => (
                <Label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800 has-[[data-state=checked]]:border-emerald-600 has-[[data-state=checked]]:bg-emerald-50"
                >
                    <RadioGroupItem value={option} />
                    {option}
                </Label>
            ))}
        </RadioGroup>
    );
}
