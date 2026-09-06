import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function RadioCardGroup({
    name,
    options,
    defaultValue,
}: {
    name: string;
    options: string[];
    defaultValue?: string;
}) {
    return (
        <RadioGroup
            name={name}
            defaultValue={defaultValue}
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