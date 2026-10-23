import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChipToggleGroup } from '@/components/nyumba/chip-toggle-group';
import { Field } from '@/components/nyumba/field';
import { RadioCardGroup } from '@/components/nyumba/radio-card-group';
import { EmptyCard, ErrorCard } from '@/components/nyumba/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api, getErrorMessage, getFieldErrors } from '@/lib/api';
import { HOUSE_TYPES } from '@/lib/nyumba-data';
import { useApi } from '@/lib/use-api';
import type { SearchAlert } from '@/types/nyumba';

const AMENITIES: [string, string][] = [
    ['water', 'Reliable water'],
    ['parking', 'Parking'],
    ['stage', 'Near matatu stage'],
    ['gated', 'Gated compound'],
    ['internet', 'Internet available'],
];
const CHANNELS: [string, string][] = [
    ['push', 'In-app notification'],
    ['email', 'Email'],
];
const FREQ: Record<string, string> = { 'Instant': 'instant', 'Daily digest': 'daily', 'Weekly digest': 'weekly' };
const FREQ_LABEL: Record<string, string> = { instant: 'Instant', daily: 'Daily digest', weekly: 'Weekly digest' };

export default function Alerts() {
    const { data, loading, error, reload } = useApi<{ data: SearchAlert[] }>('/search-alerts');
    const [area, setArea] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [bedrooms, setBedrooms] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);
    const [freq, setFreq] = useState('Instant');
    const [channels, setChannels] = useState<string[]>(['push']);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const create = async () => {
        setSaving(true);
        setErrors({});
        try {
            await api.post('/search-alerts', {
                area: area.trim() || null,
                max_rent: maxRent ? Number(maxRent) : null,
                house_types: types,
                bedrooms: bedrooms === '' ? null : bedrooms === '3+' ? 3 : Number(bedrooms),
                bedrooms_plus: bedrooms === '3+',
                amenities,
                frequency: FREQ[freq],
                channels: channels.length ? channels : ['push'],
            });
            toast('Alert created');
            setArea('');
            setMaxRent('');
            setTypes([]);
            setBedrooms('');
            setAmenities([]);
            reload();
        } catch (e) {
            setErrors(getFieldErrors(e));
            toast.error(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (a: SearchAlert) => {
        try {
            await api.put(`/search-alerts/${a.id}`, { is_active: !a.is_active });
            toast(a.is_active ? 'Alert paused' : 'Alert resumed');
            reload();
        } catch (e) {
            toast.error(getErrorMessage(e));
        }
    };

    const remove = async (a: SearchAlert) => {
        try {
            await api.delete(`/search-alerts/${a.id}`);
            toast('Alert deleted');
            reload();
        } catch (e) {
            toast.error(getErrorMessage(e));
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Search alerts" />

            <h1 className="text-2xl font-extrabold text-stone-900">Search alerts</h1>
            <p className="mt-1 text-sm text-stone-500">
                Get told the moment a matching vacancy is reported near you.
            </p>

            <Card className="mt-5 flex flex-col gap-5 p-5">
                <h3 className="font-bold text-stone-900">Create an alert</h3>
                <Field label="Estate or area" error={errors.area}>
                    <Input placeholder="e.g. South B, Nairobi" value={area} onChange={(e) => setArea(e.target.value)} />
                </Field>
                <Field label="Maximum rent (KES)" error={errors.max_rent}>
                    <Input inputMode="numeric" placeholder="15000" value={maxRent} onChange={(e) => setMaxRent(e.target.value.replace(/\D/g, ''))} />
                </Field>
                <Field label="Property type">
                    <ChipToggleGroup options={[...HOUSE_TYPES]} value={types} onChange={setTypes} />
                </Field>
                <Field label="Bedrooms">
                    <select
                        className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                    >
                        <option value="">Any</option>
                        <option value="0">Studio</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3+">3+</option>
                    </select>
                </Field>
                <Field label="Required amenities">
                    <ChipToggleGroup options={AMENITIES} value={amenities} onChange={setAmenities} />
                </Field>
                <Field label="Notification frequency">
                    <RadioCardGroup name="freq" options={Object.keys(FREQ)} value={freq} onChange={setFreq} />
                </Field>
                <Field label="Delivery channels">
                    <ChipToggleGroup options={CHANNELS} value={channels} onChange={setChannels} />
                    <p className="mt-1 text-xs text-stone-400">
                        Alerts are delivered in the app. Email, SMS and WhatsApp delivery are coming later.
                    </p>
                </Field>
                <Button className="w-full" disabled={saving} onClick={() => void create()}>
                    Create alert
                </Button>
            </Card>

            <h3 className="mt-6 mb-3 text-base font-bold text-stone-900">Your alerts</h3>
            <div className="flex flex-col gap-3">
                {error && <ErrorCard message={error} onRetry={reload} />}
                {!loading && !error && data?.data.length === 0 && (
                    <EmptyCard emoji="🔔" title="No alerts yet" body="Create one above and we'll tell you when a match is reported." />
                )}
                {data?.data.map((a) => (
                    <Card key={a.id} className="flex items-center justify-between gap-3 p-4">
                        <div>
                            <b className="text-sm text-stone-900">{a.title}</b>
                            <p className="text-xs text-stone-400">
                                {FREQ_LABEL[a.frequency]}
                                {a.is_active ? '' : ' · Paused'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {a.matches_count !== undefined && (
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                    {a.matches_count} matches
                                </span>
                            )}
                            <button
                                aria-label={a.is_active ? 'Pause' : 'Resume'}
                                onClick={() => void toggleActive(a)}
                                className="flex size-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
                            >
                                {a.is_active ? '⏸' : '▶'}
                            </button>
                            <button
                                aria-label="Delete"
                                onClick={() => void remove(a)}
                                className="flex size-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
                            >
                                🗑
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
