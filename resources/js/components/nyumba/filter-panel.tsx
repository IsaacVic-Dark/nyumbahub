import { ChipToggleGroup } from '@/components/nyumba/chip-toggle-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Paginated } from '@/lib/api';
import { EMPTY_FILTERS, type ExploreFilters } from '@/lib/filters';
import {
    AMENITY_FILTERS,
    AVAILABILITY_FILTERS,
    CONDITION_FILTERS,
    CONFIRMED_WITHIN,
    HOUSE_TYPES,
    REPORTED_WITHIN,
    TRUST_FILTERS,
} from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import type { County, NamedRef } from '@/types/nyumba';

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-stone-100 py-3 last:border-b-0">
            <h4 className="mb-2 text-sm font-bold text-stone-900">{title}</h4>
            {children}
        </div>
    );
}

function NativeSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: [string, string][];
}) {
    return (
        <select
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
        >
            <option value="">{label}</option>
            {options.map(([v, l]) => (
                <option key={v} value={v}>
                    {l}
                </option>
            ))}
        </select>
    );
}

export function FilterPanel({
    filters,
    onChange,
    total,
    onApply,
}: {
    filters: ExploreFilters;
    onChange: (patch: Partial<ExploreFilters>) => void;
    total?: number;
    onApply?: () => void;
}) {
    const counties = useApi<Paginated<County>>('/counties', { per_page: 100 });
    const towns = useApi<Paginated<NamedRef>>(
        filters.county_id ? `/counties/${filters.county_id}/towns` : null,
        { per_page: 100 },
    );

    return (
        <div>
            <FilterGroup title="Location">
                <div className="flex flex-col gap-2">
                    <NativeSelect
                        label="County — All"
                        value={filters.county_id}
                        onChange={(v) => onChange({ county_id: v, town_id: '' })}
                        options={(counties.data?.data ?? []).map((c) => [String(c.id), c.name])}
                    />
                    <NativeSelect
                        label="Town — All"
                        value={filters.town_id}
                        onChange={(v) => onChange({ town_id: v })}
                        options={(towns.data?.data ?? []).map((t) => [String(t.id), t.name])}
                    />
                    <Input
                        placeholder="Estate / neighbourhood"
                        value={filters.estate}
                        onChange={(e) => onChange({ estate: e.target.value })}
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Property type">
                <ChipToggleGroup
                    options={[...HOUSE_TYPES]}
                    value={filters.house_type}
                    onChange={(v) => onChange({ house_type: v })}
                />
            </FilterGroup>

            <FilterGroup title="Rent range (KES)">
                <div className="flex gap-2">
                    <Input
                        placeholder="Min"
                        inputMode="numeric"
                        value={filters.min_rent}
                        onChange={(e) => onChange({ min_rent: e.target.value.replace(/\D/g, '') })}
                    />
                    <Input
                        placeholder="Max"
                        inputMode="numeric"
                        value={filters.max_rent}
                        onChange={(e) => onChange({ max_rent: e.target.value.replace(/\D/g, '') })}
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Deposit range (KES)">
                <div className="flex gap-2">
                    <Input
                        placeholder="Min"
                        inputMode="numeric"
                        value={filters.min_deposit}
                        onChange={(e) => onChange({ min_deposit: e.target.value.replace(/\D/g, '') })}
                    />
                    <Input
                        placeholder="Max"
                        inputMode="numeric"
                        value={filters.max_deposit}
                        onChange={(e) => onChange({ max_deposit: e.target.value.replace(/\D/g, '') })}
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Availability type">
                <ChipToggleGroup
                    options={AVAILABILITY_FILTERS}
                    value={filters.status}
                    onChange={(v) => onChange({ status: v })}
                />
            </FilterGroup>

            <FilterGroup title="Dates">
                <div className="flex flex-col gap-2">
                    <NativeSelect
                        label="Reported — any time"
                        value={filters.reported_within}
                        onChange={(v) => onChange({ reported_within: v })}
                        options={REPORTED_WITHIN}
                    />
                    <NativeSelect
                        label="Last confirmed — any time"
                        value={filters.confirmed_within}
                        onChange={(v) => onChange({ confirmed_within: v })}
                        options={CONFIRMED_WITHIN}
                    />
                </div>
            </FilterGroup>

            <FilterGroup title="Condition & utilities">
                <ChipToggleGroup
                    options={CONDITION_FILTERS}
                    value={filters.condition}
                    onChange={(v) => onChange({ condition: v })}
                />
            </FilterGroup>

            <FilterGroup title="Amenities">
                <ChipToggleGroup
                    options={AMENITY_FILTERS}
                    value={filters.amenities}
                    onChange={(v) => onChange({ amenities: v })}
                />
            </FilterGroup>

            <FilterGroup title="Trust">
                <ChipToggleGroup
                    options={TRUST_FILTERS}
                    value={filters.trust}
                    onChange={(v) => onChange({ trust: v })}
                />
            </FilterGroup>

            <div className="flex gap-2 pt-3">
                <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}
                >
                    Clear
                </Button>
                <Button className="flex-1" onClick={onApply}>
                    {total !== undefined
                        ? `Show ${total} report${total === 1 ? '' : 's'}`
                        : 'Show results'}
                </Button>
            </div>
        </div>
    );
}
