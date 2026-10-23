import { Head, router } from '@inertiajs/react';
import { Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChipToggleGroup } from '@/components/nyumba/chip-toggle-group';
import { Field } from '@/components/nyumba/field';
import {
    EMPTY_LOCATION,
    isLocationComplete,
    LocationPicker,
    resolveBuildingId,
} from '@/components/nyumba/location-picker';
import type { LocationState } from '@/components/nyumba/location-picker';
import { RadioCardGroup } from '@/components/nyumba/radio-card-group';
import { RateControl } from '@/components/nyumba/rate-control';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, getErrorMessage } from '@/lib/api';
import { CONDITION_FIELDS, HOUSE_TYPES } from '@/lib/nyumba-data';

const STEP_LABELS = [
    'Vacancy timing',
    'Location',
    'Rent and costs',
    'Home details',
    'Condition report',
    'Photos and evidence',
    'Review and publish',
];

const PHOTO_LABELS = ['Living area', 'Bedroom', 'Kitchen', 'Bathroom', 'Exterior', 'Meter', 'Other'];
const EVIDENCE_TYPES: [string, string][] = [
    ['receipt', 'Blurred rent receipt'],
    ['agreement', 'Blurred lease / tenancy document'],
];
const selectClass = 'h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm';

type Form = {
    timing: string; // 'plan' | 'moved'
    moveOutDate: string;
    lastChecked: string;
    likely: string;
    location: LocationState;
    blockWing: string;
    houseType: string;
    floor: string;
    unitNumber: string;
    directions: string;
    nearestStage: string;
    privacy: string;
    rent: string;
    deposit: string;
    costWater: string;
    costGarbage: string;
    electricity: string;
    costService: string;
    costParking: string;
    costOther: string;
    costMoveIn: string;
    rentAck: boolean;
    bedrooms: string;
    bathrooms: string;
    furnishing: string;
    features: string[];
    waterSource: string;
    internet: string[];
    pets: string;
    facilities: string[];
    scores: Record<string, number>;
    notes: Record<string, string>;
    pros: string;
    cons: string;
    issues: string;
    surprised: string;
    advice: string;
    livedFrom: string;
    reasonLeaving: string;
    accurate: boolean;
    unofficial: boolean;
};

const EMPTY: Form = {
    timing: '', moveOutDate: '', lastChecked: '', likely: '',
    location: EMPTY_LOCATION, blockWing: '', houseType: '', floor: '', unitNumber: '',
    directions: '', nearestStage: '', privacy: 'public',
    rent: '', deposit: '', costWater: '', costGarbage: '', electricity: '', costService: '',
    costParking: '', costOther: '', costMoveIn: '', rentAck: false,
    bedrooms: '', bathrooms: '', furnishing: '', features: [], waterSource: '', internet: [], pets: '', facilities: [],
    scores: {}, notes: {},
    pros: '', cons: '', issues: '', surprised: '', advice: '', livedFrom: '', reasonLeaving: '',
    accurate: false, unofficial: false,
};

const DRAFT_KEY = 'nyumbahub.post-draft.v2';

function loadDraft(): { form: Form; step: number } {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as { form: Form; step: number };

            return { form: { ...EMPTY, ...parsed.form, location: { ...EMPTY_LOCATION, ...parsed.form.location } }, step: parsed.step || 1 };
        }
    } catch {
        // ignore
    }

    return { form: EMPTY, step: 1 };
}

type Upload = { file: File; label: string };
type Evidence = { file: File; type: string };

type SetF = <K extends keyof Form>(key: K, value: Form[K]) => void;

function Sel({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: readonly string[]; placeholder?: string }) {
    return (
        <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">{placeholder ?? 'Select'}</option>
            {options.map((o) => (
                <option key={o} value={o}>{o}</option>
            ))}
        </select>
    );
}

export default function PostVacancy() {
    const initial = useRef(loadDraft()).current;
    const [step, setStep] = useState(initial.step);
    const [f, setForm] = useState<Form>(initial.form);
    const [photos, setPhotos] = useState<Upload[]>([]);
    const [video, setVideo] = useState<File | null>(null);
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [evType, setEvType] = useState('receipt');
    const [busy, setBusy] = useState(false);

    const set: SetF = (key, value) => setForm((p) => ({ ...p, [key]: value }));

    useEffect(() => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: f, step }));
        } catch {
            // storage unavailable
        }
    }, [f, step]);

    const planning = f.timing === 'plan';

    // Per-step validation: returns an error message or null.
    const validate = (s: number): string | null => {
        if (s === 1) {
            if (!f.timing) return 'Tell us whether you are moving out or have moved out.';
            if (!f.moveOutDate) return planning ? 'Add your expected move-out date.' : 'Add the date you moved out.';
        }
        if (s === 2) {
            if (!isLocationComplete(f.location)) return 'Complete the county, town, estate, area and building.';
            if (!f.houseType) return 'Choose a house type.';
        }
        if (s === 3 && (!f.rent || Number(f.rent) <= 0)) return 'Enter the last-known monthly rent.';
        if (s === 6 && photos.length < 3) return 'Add at least 3 photos.';
        if (s === 7 && (!f.accurate || !f.unofficial)) return 'Please tick both confirmations.';

        return null;
    };

    const next = () => {
        const err = validate(step);
        if (err) return toast.error(err);
        setStep((s) => Math.min(7, s + 1));
        window.scrollTo({ top: 0 });
    };

    const publish = async () => {
        for (let s = 1; s <= 7; s++) {
            const err = validate(s);
            if (err) {
                setStep(s);

                return toast.error(err);
            }
        }

        setBusy(true);
        let listingId: number | null = null;
        try {
            const buildingId = await resolveBuildingId(f.location);
            const trim = (v: string) => (v.trim() === '' ? null : v.trim());

            const res = await api.post<{ data: { id: number } }>(`/buildings/${buildingId}/listings`, {
                house_type: f.houseType,
                last_monthly_rent: Number(f.rent),
                deposit_amount: f.deposit ? Number(f.deposit) : null,
                move_out_date: f.moveOutDate,
                is_vacancy_confirmed_by_reporter: f.likely === 'Yes',
                status: planning ? 'upcoming_vacancy' : 'recently_vacated',
                directions: trim(f.directions),
                nearest_stage: trim(f.nearestStage),
                bedrooms: f.bedrooms === '' ? null : Number(f.bedrooms),
                bathrooms: f.bathrooms === '' ? null : Number(f.bathrooms),
                details: {
                    floor: trim(f.floor),
                    furnishing: f.furnishing || null,
                    pets: trim(f.pets),
                    electricity: trim(f.electricity),
                    water_source: trim(f.waterSource),
                    privacy: f.privacy,
                    likely_vacant: trim(f.likely),
                    reporter_last_checked_at: f.lastChecked || null,
                    features: f.features,
                    internet: f.internet,
                    facilities: f.facilities,
                    block_wing: trim(f.blockWing),
                    unit_number: trim(f.unitNumber),
                },
            });
            listingId = res.data.data.id;
            localStorage.removeItem(DRAFT_KEY);

            const scores: Record<string, { score: number; note: string | null }> = {};
            for (const [k, v] of Object.entries(f.scores)) {
                scores[k] = { score: v, note: trim(f.notes[k] ?? '') };
            }

            const failures: string[] = [];
            const attempt = async (what: string, fn: () => Promise<unknown>) => {
                try {
                    await fn();
                } catch (e) {
                    failures.push(`${what}: ${getErrorMessage(e)}`);
                }
            };

            await attempt('Condition report', () =>
                api.put(`/listings/${listingId}/condition`, {
                    scores,
                    expected_hidden_costs: {
                        water: trim(f.costWater), garbage: trim(f.costGarbage), service_charge: trim(f.costService),
                        parking: trim(f.costParking), other: trim(f.costOther), move_in_total: trim(f.costMoveIn),
                        note: trim(f.surprised),
                    },
                }),
            );
            await attempt('Review', () =>
                api.put(`/listings/${listingId}/review`, {
                    lived_from: f.livedFrom || null,
                    lived_to: planning ? null : f.moveOutDate,
                    pros: trim(f.pros), cons: trim(f.cons), recurring_issues: trim(f.issues),
                    advice: trim(f.advice), reason_for_leaving: trim(f.reasonLeaving),
                }),
            );
            for (const p of photos) {
                const fd = new FormData();
                fd.append('type', 'photo');
                fd.append('label', p.label);
                fd.append('file', p.file);
                await attempt(`Photo ${p.file.name}`, () => api.post(`/listings/${listingId}/media`, fd));
            }
            if (video) {
                const fd = new FormData();
                fd.append('type', 'video');
                fd.append('file', video);
                await attempt('Video', () => api.post(`/listings/${listingId}/media`, fd));
            }
            for (const ev of evidence) {
                const fd = new FormData();
                fd.append('type', ev.type);
                fd.append('file', ev.file);
                await attempt('Evidence', () => api.post(`/listings/${listingId}/evidence`, fd));
            }

            if (failures.length) {
                toast.warning(`Published, but some parts did not save: ${failures.join('; ')}`);
            } else {
                toast('Vacancy report published');
            }
            router.visit(`/post/success?listing=${listingId}`);
        } catch (e) {
            toast.error(listingId ? `Published, but something went wrong: ${getErrorMessage(e)}` : getErrorMessage(e));
            if (listingId) router.visit(`/post/success?listing=${listingId}`);
        } finally {
            setBusy(false);
        }
    };

    const stepBody = (() => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col gap-5">
                        <Field label="Are you moving out soon or have you already moved out?">
                            <RadioCardGroup
                                name="timing"
                                options={['I plan to move out', 'I have moved out']}
                                value={f.timing === 'plan' ? 'I plan to move out' : f.timing === 'moved' ? 'I have moved out' : ''}
                                onChange={(v) => set('timing', v === 'I plan to move out' ? 'plan' : 'moved')}
                            />
                        </Field>
                        {f.timing && (
                            <Field label={planning ? 'Expected move-out date' : 'Date you moved out'}>
                                <Input type="date" value={f.moveOutDate} onChange={(e) => set('moveOutDate', e.target.value)} />
                            </Field>
                        )}
                        <Field label="When did you last personally confirm the home was vacant?">
                            <Input type="date" value={f.lastChecked} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set('lastChecked', e.target.value)} />
                        </Field>
                        <Field label="Is the home likely still vacant?">
                            <RadioCardGroup
                                name="likely"
                                options={['Yes', 'Not sure', 'I only know that I moved out']}
                                value={f.likely}
                                onChange={(v) => set('likely', v)}
                            />
                        </Field>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-5">
                        <LocationPicker value={f.location} onChange={(patch) => set('location', { ...f.location, ...patch })} />
                        <Field label="Block or wing" hint="Private: never publicly displayed.">
                            <Input placeholder="e.g. Block B" value={f.blockWing} onChange={(e) => set('blockWing', e.target.value)} />
                        </Field>
                        <Field label="House type">
                            <Sel value={f.houseType} onChange={(v) => set('houseType', v)} options={HOUSE_TYPES} placeholder="Select house type" />
                        </Field>
                        <Field label="Floor">
                            <Input placeholder="e.g. 2nd floor" value={f.floor} onChange={(e) => set('floor', e.target.value)} />
                        </Field>
                        <Field
                            label={
                                <>
                                    Exact unit number{' '}
                                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">
                                        Private: never publicly displayed
                                    </span>
                                </>
                            }
                            hint="Used only for moderation and duplicate detection."
                        >
                            <Input placeholder="e.g. B7" value={f.unitNumber} onChange={(e) => set('unitNumber', e.target.value)} />
                        </Field>
                        <Field label="Landmark and directions">
                            <Textarea placeholder="From Ruaka stage, walk toward the market…" value={f.directions} onChange={(e) => set('directions', e.target.value)} />
                        </Field>
                        <Field label="Nearest matatu stage">
                            <Input placeholder="e.g. Ruaka stage, 7-minute walk" value={f.nearestStage} onChange={(e) => set('nearestStage', e.target.value)} />
                        </Field>
                        <Field label="Privacy setting">
                            <RadioCardGroup
                                name="priv"
                                options={['Show approximate location publicly', 'Share more detailed directions only with verified members']}
                                value={f.privacy === 'verified_only' ? 'Share more detailed directions only with verified members' : 'Show approximate location publicly'}
                                onChange={(v) => set('privacy', v.startsWith('Share') ? 'verified_only' : 'public')}
                            />
                        </Field>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-5">
                        <Field label="Last-known monthly rent (KES)">
                            <Input inputMode="numeric" placeholder="22000" value={f.rent} onChange={(e) => set('rent', e.target.value.replace(/\D/g, ''))} />
                        </Field>
                        <Field label="Last-known deposit (KES)">
                            <Input inputMode="numeric" placeholder="22000" value={f.deposit} onChange={(e) => set('deposit', e.target.value.replace(/\D/g, ''))} />
                        </Field>
                        <Field label="Water cost"><Input placeholder="e.g. KES 500 – 900 monthly" value={f.costWater} onChange={(e) => set('costWater', e.target.value)} /></Field>
                        <Field label="Garbage collection charge"><Input placeholder="e.g. KES 200 monthly" value={f.costGarbage} onChange={(e) => set('costGarbage', e.target.value)} /></Field>
                        <Field label="Electricity arrangement">
                            <Sel value={f.electricity} onChange={(v) => set('electricity', v)} options={['Prepaid tokens', 'Postpaid bill', 'Shared meter', 'Included in rent']} />
                        </Field>
                        <Field label="Service charge"><Input placeholder="e.g. None" value={f.costService} onChange={(e) => set('costService', e.target.value)} /></Field>
                        <Field label="Parking cost"><Input placeholder="e.g. KES 1,000 monthly" value={f.costParking} onChange={(e) => set('costParking', e.target.value)} /></Field>
                        <Field label="Other regular costs"><Input placeholder="e.g. Security levy" value={f.costOther} onChange={(e) => set('costOther', e.target.value)} /></Field>
                        <Field label="Estimated total move-in cost"><Input placeholder="e.g. 46,000" value={f.costMoveIn} onChange={(e) => set('costMoveIn', e.target.value)} /></Field>
                        <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                            <Checkbox checked={f.rentAck} onCheckedChange={(c) => set('rentAck', c === true)} />
                            I understand that rent may change after I move out.
                        </Label>
                    </div>
                );
            case 4:
                return (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Bedrooms">
                                <Input type="number" min={0} value={f.bedrooms} placeholder="Leave empty to derive from type" onChange={(e) => set('bedrooms', e.target.value)} />
                            </Field>
                            <Field label="Bathrooms">
                                <Input type="number" min={0} value={f.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
                            </Field>
                        </div>
                        <Field label="Furnishing">
                            <RadioCardGroup name="furn" options={['Unfurnished', 'Partly furnished', 'Fully furnished']} value={f.furnishing} onChange={(v) => set('furnishing', v)} />
                        </Field>
                        <Field label="Features">
                            <ChipToggleGroup options={['Parking', 'Balcony', 'Lift', 'Security guard', 'CCTV', 'Gated compound', 'Borehole', 'Water tank']} value={f.features} onChange={(v) => set('features', v)} />
                        </Field>
                        <Field label="Water source">
                            <Sel value={f.waterSource} onChange={(v) => set('waterSource', v)} options={['County water with tank backup', 'Borehole', 'County water only', 'Water vendor / bowser']} />
                        </Field>
                        <Field label="Internet providers available">
                            <ChipToggleGroup options={['Safaricom Home Fibre', 'Faiba', 'Zuku', 'Poa Internet', 'None known']} value={f.internet} onChange={(v) => set('internet', v)} />
                        </Field>
                        <Field label="Pet policy, if known">
                            <RadioCardGroup name="pets" options={['Pets allowed', 'Pets not allowed', 'Not sure — ask the caretaker']} value={f.pets} onChange={(v) => set('pets', v)} />
                        </Field>
                        <Field label="Nearby facilities">
                            <ChipToggleGroup options={['Matatu stage', 'School', 'Hospital', 'Market', 'Supermarket', 'Church', 'Mosque', 'Workplace area']} value={f.facilities} onChange={(v) => set('facilities', v)} />
                        </Field>
                    </div>
                );
            case 5:
                return (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-stone-500">
                            Rate 1 (poor) to 5 (excellent). Add a short note where it helps the next tenant. Skip anything you do not know.
                        </p>
                        {CONDITION_FIELDS.map((label) => (
                            <Card key={label} className="p-4">
                                <div className="flex items-center justify-between">
                                    <b className="text-sm text-stone-900">{label}</b>
                                    <RateControl
                                        label={label}
                                        value={f.scores[label] ?? null}
                                        onChange={(v) => set('scores', { ...f.scores, [label]: v })}
                                    />
                                </div>
                                <Input
                                    className="mt-2"
                                    placeholder={`Optional note about ${label.toLowerCase()}`}
                                    maxLength={500}
                                    value={f.notes[label] ?? ''}
                                    onChange={(e) => set('notes', { ...f.notes, [label]: e.target.value })}
                                />
                            </Card>
                        ))}
                    </div>
                );
            case 6:
                return (
                    <div className="flex flex-col gap-5">
                        <p className="text-sm text-stone-500">
                            Minimum 3 photos required. Recommended: living area/bedroom, kitchen, bathroom, exterior or
                            building entrance, and the water/electricity meter.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {photos.map((p, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                                        <img src={URL.createObjectURL(p.file)} alt={p.label} className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            aria-label="Remove photo"
                                            onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                                            className="absolute top-1 right-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <select
                                        className="h-7 rounded border border-stone-200 bg-white px-1 text-[11px]"
                                        value={p.label}
                                        onChange={(e) => setPhotos((ps) => ps.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                                    >
                                        {PHOTO_LABELS.map((l) => (
                                            <option key={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 text-sm text-stone-400">
                                + Add
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files ?? []);
                                        setPhotos((ps) => [...ps, ...files.map((file, i) => ({ file, label: PHOTO_LABELS[(ps.length + i) % PHOTO_LABELS.length] }))]);
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        </div>
                        <Field label="Optional short video walk-through" hint="Up to 50 MB (mp4, mov or webm).">
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-stone-200 p-2 text-sm text-stone-600">
                                <Video className="size-4" /> {video ? video.name : 'Add a 15–60 second walk-through'}
                                <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
                            </label>
                        </Field>
                        <Field label="Optional proof of former occupancy">
                            <div className="flex gap-2">
                                <select className={selectClass} value={evType} onChange={(e) => setEvType(e.target.value)}>
                                    {EVIDENCE_TYPES.map(([v, l]) => (
                                        <option key={v} value={v}>{l}</option>
                                    ))}
                                </select>
                                <label className="flex shrink-0 cursor-pointer items-center rounded-md border border-stone-200 px-3 text-sm text-stone-600">
                                    Choose file
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setEvidence((ev) => [...ev, { file, type: evType }]);
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                            </div>
                            {evidence.map((ev, i) => (
                                <p key={i} className="mt-1 text-xs text-stone-500">
                                    {ev.file.name} ({ev.type}){' '}
                                    <button type="button" className="underline" onClick={() => setEvidence((x) => x.filter((_, j) => j !== i))}>remove</button>
                                </p>
                            ))}
                        </Field>
                        <p className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                            🔐 Documents are used only to verify your connection to this home. They will not be publicly displayed.
                        </p>
                        <p className="rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-800">
                            ⚠️ Remove or blur personal details, ID numbers, account numbers and phone numbers before uploading.
                        </p>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col gap-5">
                        <Field label="When did you start living here?">
                            <Input type="date" value={f.livedFrom} onChange={(e) => set('livedFrom', e.target.value)} />
                        </Field>
                        <Field label="Reason for leaving">
                            <Input value={f.reasonLeaving} onChange={(e) => set('reasonLeaving', e.target.value)} />
                        </Field>
                        <Field label="What did you like about living here?">
                            <Textarea placeholder="Good natural light, responsive caretaker…" value={f.pros} onChange={(e) => set('pros', e.target.value)} />
                        </Field>
                        <Field label="What should a new tenant know before moving in?">
                            <Textarea value={f.cons} onChange={(e) => set('cons', e.target.value)} />
                        </Field>
                        <Field label="Were there water, electricity, security, access, repair, noise, pest or cost issues?">
                            <Textarea value={f.issues} onChange={(e) => set('issues', e.target.value)} />
                        </Field>
                        <Field label="What costs surprised you?">
                            <Textarea value={f.surprised} onChange={(e) => set('surprised', e.target.value)} />
                        </Field>
                        <Field label="What advice would you give the next tenant?">
                            <Textarea value={f.advice} onChange={(e) => set('advice', e.target.value)} />
                        </Field>

                        <Card className="p-4">
                            <h4 className="text-sm font-bold text-stone-900">Review rules</h4>
                            <ul className="mt-2 flex flex-col gap-1 text-sm text-stone-500">
                                <li>Share your direct experience.</li>
                                <li>Be factual and specific.</li>
                                <li>Do not publish names, phone numbers, ID details, threats, insults or unverified accusations.</li>
                                <li>NyumbaHub may review or remove harmful content.</li>
                            </ul>
                        </Card>

                        <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                            <Checkbox checked={f.accurate} onCheckedChange={(c) => set('accurate', c === true)} />
                            I lived in or recently visited this home and the information is accurate to the best of my knowledge.
                        </Label>
                        <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                            <Checkbox checked={f.unofficial} onCheckedChange={(c) => set('unofficial', c === true)} />
                            I understand NyumbaHub will display this as a tenant-reported vacancy, not an official listing.
                        </Label>
                    </div>
                );
        }
    })();

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Post a vacancy report" />

            <h1 className="text-2xl font-extrabold text-stone-900">Post a vacancy report</h1>
            <p className="mt-1 text-sm text-stone-500">
                Help someone avoid the stress of house hunting. Share what you know about the home you recently vacated.
            </p>

            <Card className="mt-5 p-4">
                <div className="flex items-center justify-between text-sm">
                    <b>
                        Step {step} of 7 · {STEP_LABELS[step - 1]}
                    </b>
                    <span className="text-stone-400">Draft saved on this device ✓</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${(step / 7) * 100}%` }} />
                </div>
            </Card>

            <div className="mt-5">{stepBody}</div>

            <div className="mt-6 flex gap-3">
                <Button variant="ghost" className="flex-1" disabled={step === 1 || busy} onClick={() => setStep((s) => Math.max(1, s - 1))}>
                    Back
                </Button>
                {step === 7 ? (
                    <Button className="flex-1" disabled={busy} onClick={() => void publish()}>
                        {busy ? 'Publishing…' : 'Publish vacancy report'}
                    </Button>
                ) : (
                    <Button className="flex-1" onClick={next}>
                        Continue
                    </Button>
                )}
            </div>

            <p className="mt-6 text-center text-xs text-stone-400">
                Leaving now keeps your text answers on this device so you can finish later. Photos and files must be added again.
            </p>
        </div>
    );
}
