import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function FilterGroup({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="border-b border-stone-100 py-3 last:border-b-0">
            <h4 className="mb-2 text-sm font-bold text-stone-900">{title}</h4>
            {children}
        </div>
    );
}

function ChipGroup({ options }: { options: string[] }) {
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

function NativeSelect({
    label,
    options,
}: {
    label: string;
    options: string[];
}) {
    return (
        <select
            aria-label={label}
            className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
        >
            <option>{label}</option>
            {options.map((o) => (
                <option key={o}>{o}</option>
            ))}
        </select>
    );
}

export function FilterPanel({ onApply }: { onApply?: () => void }) {
    return (
        <div>
            <FilterGroup title="Location">
                <div className="flex flex-col gap-2">
                    <NativeSelect
                        label="County — All"
                        options={['Nairobi', 'Kiambu', 'Kajiado', 'Machakos']}
                    />
                    <NativeSelect
                        label="Town — All"
                        options={['Nairobi', 'Ruaka', 'Rongai', 'Ruiru']}
                    />
                    <Input placeholder="Estate / neighbourhood" />
                </div>
            </FilterGroup>

            <FilterGroup title="Property type">
                <ChipGroup
                    options={[
                        'Bedsitter',
                        'Studio',
                        'Room',
                        '1BR',
                        '2BR',
                        '3BR',
                        'Maisonette',
                        'House',
                    ]}
                />
            </FilterGroup>

            <FilterGroup title="Rent range (KES)">
                <div className="flex gap-2">
                    <Input placeholder="Min" inputMode="numeric" />
                    <Input placeholder="Max" inputMode="numeric" />
                </div>
            </FilterGroup>

            <FilterGroup title="Deposit range (KES)">
                <div className="flex gap-2">
                    <Input placeholder="Min" inputMode="numeric" />
                    <Input placeholder="Max" inputMode="numeric" />
                </div>
            </FilterGroup>

            <FilterGroup title="Availability type">
                <ChipGroup
                    options={[
                        'Upcoming vacancy',
                        'Recently vacated',
                        'Community-confirmed vacant',
                    ]}
                />
            </FilterGroup>

            <FilterGroup title="Dates">
                <div className="flex flex-col gap-2">
                    <NativeSelect
                        label="Reported — any time"
                        options={[
                            'Last 24 hours',
                            'Last 3 days',
                            'Last 7 days',
                            'Last 30 days',
                        ]}
                    />
                    <NativeSelect
                        label="Last confirmed — any time"
                        options={[
                            'Within 24 hours',
                            'Within 3 days',
                            'Within a week',
                        ]}
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Condition & utilities">
                <ChipGroup
                    options={[
                        'Water reliable 4★+',
                        'Security 4★+',
                        'Condition 4★+',
                        'Internet available',
                        'Prepaid electricity',
                    ]}
                />
            </FilterGroup>

            <FilterGroup title="Amenities">
                <ChipGroup
                    options={[
                        'Parking',
                        'Pet-friendly',
                        'Furnished',
                        'Unfurnished',
                        'Near matatu stage',
                        'Balcony',
                        'Lift',
                        'Gated compound',
                    ]}
                />
            </FilterGroup>

            <FilterGroup title="Trust">
                <ChipGroup
                    options={[
                        'Verified former tenant',
                        'Has photos/video',
                        'Has community confirmation',
                        'Multiple confirmations',
                    ]}
                />
            </FilterGroup>

            <div className="flex gap-2 pt-3">
                <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => toast('Filters cleared')}
                >
                    Clear
                </Button>
                <Button
                    className="flex-1"
                    onClick={() => {
                        toast('Filters applied');
                        onApply?.();
                    }}
                >
                    Show 6 reports
                </Button>
            </div>
        </div>
    );
}