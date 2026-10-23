import { MapPin } from 'lucide-react';
import { Field } from '@/components/nyumba/field';
import { PinPicker } from '@/components/nyumba/listing-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import type { Paginated } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { County, NamedRef } from '@/types/nyumba';

export const NEW = 'new';

export interface LocationState {
    countyId: string;
    townId: string;
    estateId: string;
    newEstate: string;
    subEstateId: string;
    newSubEstate: string;
    buildingId: string;
    newBuilding: string;
    pin: { lat: number; lng: number } | null;
}

export const EMPTY_LOCATION: LocationState = {
    countyId: '',
    townId: '',
    estateId: '',
    newEstate: '',
    subEstateId: '',
    newSubEstate: '',
    buildingId: '',
    newBuilding: '',
    pin: null,
};

export function isLocationComplete(v: LocationState): boolean {
    const estateOk = v.estateId === NEW ? v.newEstate.trim() !== '' : v.estateId !== '';
    const subOk = v.estateId === NEW || v.subEstateId === NEW ? v.newSubEstate.trim() !== '' : v.subEstateId !== '';
    const buildingOk =
        v.estateId === NEW || v.subEstateId === NEW || v.buildingId === NEW
            ? v.newBuilding.trim() !== ''
            : v.buildingId !== '';

    return v.countyId !== '' && v.townId !== '' && estateOk && subOk && buildingOk;
}

/**
 * Creates whatever the contributor typed as "not listed" (estate -> sub-estate -> building)
 * and returns the final building id. Called once, when the report is published.
 */
export async function resolveBuildingId(v: LocationState): Promise<number> {
    let estateId = v.estateId;
    if (estateId === NEW) {
        const r = await api.post<{ data: NamedRef }>(`/towns/${v.townId}/estates`, { name: v.newEstate.trim() });
        estateId = String(r.data.data.id);
    }

    let subEstateId = v.subEstateId;
    if (v.estateId === NEW || subEstateId === NEW) {
        const r = await api.post<{ data: NamedRef }>(`/estates/${estateId}/sub-estates`, { name: v.newSubEstate.trim() });
        subEstateId = String(r.data.data.id);
    }

    if (v.estateId === NEW || v.subEstateId === NEW || v.buildingId === NEW) {
        const r = await api.post<{ data: NamedRef }>(`/sub-estates/${subEstateId}/buildings`, {
            name: v.newBuilding.trim(),
            latitude: v.pin?.lat ?? null,
            longitude: v.pin?.lng ?? null,
        });

        return r.data.data.id;
    }

    return Number(v.buildingId);
}

const selectClass =
    'h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm';

function LevelSelect({
    value,
    onChange,
    options,
    placeholder,
    addLabel,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    options: NamedRef[];
    placeholder: string;
    addLabel?: string;
    disabled?: boolean;
}) {
    return (
        <select
            className={selectClass}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.id} value={String(o.id)}>
                    {o.name}
                </option>
            ))}
            {addLabel && <option value={NEW}>{addLabel}</option>}
        </select>
    );
}

export function LocationPicker({
    value,
    onChange,
}: {
    value: LocationState;
    onChange: (patch: Partial<LocationState>) => void;
}) {
    const counties = useApi<Paginated<County>>('/counties', { per_page: 100 });
    const towns = useApi<Paginated<NamedRef>>(value.countyId ? `/counties/${value.countyId}/towns` : null, { per_page: 100 });
    const estates = useApi<Paginated<NamedRef>>(value.townId ? `/towns/${value.townId}/estates` : null, { per_page: 100 });
    const subs = useApi<Paginated<NamedRef>>(
        value.estateId && value.estateId !== NEW ? `/estates/${value.estateId}/sub-estates` : null,
        { per_page: 100 },
    );
    const buildings = useApi<Paginated<NamedRef>>(
        value.subEstateId && value.subEstateId !== NEW ? `/sub-estates/${value.subEstateId}/buildings` : null,
        { per_page: 100 },
    );

    const county = counties.data?.data.find((c) => String(c.id) === value.countyId);
    const center: [number, number] | null =
        county?.latitude != null && county?.longitude != null
            ? [Number(county.latitude), Number(county.longitude)]
            : null;

    const subIsNew = value.estateId === NEW || value.subEstateId === NEW;
    const buildingIsNew = subIsNew || value.buildingId === NEW;

    return (
        <div className="flex flex-col gap-5">
            <Field label="County">
                <LevelSelect
                    value={value.countyId}
                    placeholder="Select county"
                    options={counties.data?.data ?? []}
                    onChange={(v) => onChange({ ...EMPTY_LOCATION, countyId: v })}
                />
            </Field>

            <Field label="Town / city">
                <LevelSelect
                    value={value.townId}
                    placeholder={value.countyId ? 'Select town' : 'Select a county first'}
                    disabled={!value.countyId}
                    options={towns.data?.data ?? []}
                    onChange={(v) => onChange({ ...EMPTY_LOCATION, countyId: value.countyId, townId: v })}
                />
            </Field>

            <Field label="Estate / neighbourhood">
                <LevelSelect
                    value={value.estateId}
                    placeholder={value.townId ? 'Select estate' : 'Select a town first'}
                    disabled={!value.townId}
                    options={estates.data?.data ?? []}
                    addLabel="➕ My estate isn't listed"
                    onChange={(v) =>
                        onChange({
                            estateId: v,
                            newEstate: '',
                            subEstateId: '',
                            newSubEstate: '',
                            buildingId: '',
                            newBuilding: '',
                        })
                    }
                />
                {value.estateId === NEW && (
                    <Input
                        className="mt-2"
                        placeholder="e.g. Gacharage"
                        value={value.newEstate}
                        onChange={(e) => onChange({ newEstate: e.target.value })}
                    />
                )}
            </Field>

            {value.estateId !== '' && (
                <Field
                    label="Area within the estate"
                    hint="e.g. Pipeline, Phase 3. Use the estate name if there is no sub-area."
                >
                    {value.estateId !== NEW && (
                        <LevelSelect
                            value={value.subEstateId}
                            placeholder="Select area"
                            options={subs.data?.data ?? []}
                            addLabel="➕ My area isn't listed"
                            onChange={(v) =>
                                onChange({ subEstateId: v, newSubEstate: '', buildingId: '', newBuilding: '' })
                            }
                        />
                    )}
                    {subIsNew && (
                        <Input
                            className={value.estateId === NEW ? '' : 'mt-2'}
                            placeholder="Area / sub-estate name"
                            value={value.newSubEstate}
                            onChange={(e) => onChange({ newSubEstate: e.target.value })}
                        />
                    )}
                </Field>
            )}

            {(value.subEstateId !== '' || value.estateId === NEW) && (
                <Field
                    label="Building / plot name"
                    hint="Shown only to signed-in members; the public sees an approximate area."
                >
                    {!subIsNew && (
                        <LevelSelect
                            value={value.buildingId}
                            placeholder="Select building"
                            options={buildings.data?.data ?? []}
                            addLabel="➕ My building isn't listed"
                            onChange={(v) => onChange({ buildingId: v, newBuilding: '' })}
                        />
                    )}
                    {buildingIsNew && (
                        <Input
                            className={subIsNew ? '' : 'mt-2'}
                            placeholder="e.g. Wendani Court"
                            value={value.newBuilding}
                            onChange={(e) => onChange({ newBuilding: e.target.value })}
                        />
                    )}
                </Field>
            )}

            {buildingIsNew && (
                <Field
                    label="Map pin"
                    hint="Click the map or drag the pin. We only publish an approximate circle, not the exact building point."
                >
                    <PinPicker
                        className="z-0 h-56 overflow-hidden rounded-xl"
                        value={value.pin}
                        center={center}
                        onChange={(pin) => onChange({ pin })}
                    />
                    <div className="mt-2 flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                navigator.geolocation?.getCurrentPosition((pos) =>
                                    onChange({ pin: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
                                )
                            }
                        >
                            <MapPin className="size-4" /> Use my location
                        </Button>
                        {value.pin && (
                            <span className="text-xs text-stone-500">
                                {value.pin.lat.toFixed(4)}, {value.pin.lng.toFixed(4)}
                            </span>
                        )}
                    </div>
                </Field>
            )}
        </div>
    );
}
