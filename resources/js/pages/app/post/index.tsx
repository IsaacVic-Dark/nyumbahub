import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Video } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChipToggleGroup } from '@/components/nyumba/chip-toggle-group';
import { Field } from '@/components/nyumba/field';
import { RadioCardGroup } from '@/components/nyumba/radio-card-group';
import { RateControl } from '@/components/nyumba/rate-control';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PLACEHOLDER_PHOTOS } from '@/lib/nyumba-data';

const STEP_LABELS = [
    'Vacancy timing',
    'Location',
    'Rent and costs',
    'Home details',
    'Condition report',
    'Photos and evidence',
    'Review and publish',
];

const CONDITION_FIELDS = [
    'Water reliability',
    'Plumbing',
    'Electricity',
    'Kitchen',
    'Bathroom',
    'Walls and paint',
    'Doors and windows',
    'Floors',
    'Security',
    'Noise level',
    'Natural light',
    'Ventilation',
    'Pests',
    'Mould / leaks',
    'Maintenance response',
    'Value for money',
];

function StepOne() {
    return (
        <div className="flex flex-col gap-5">
            <Field label="Are you moving out soon or have you already moved out?">
                <RadioCardGroup
                    name="timing"
                    options={['I plan to move out', 'I have moved out']}
                />
            </Field>
            <Field
                label="Expected move-out date"
                hint="Only shown if you have not moved yet."
            >
                <Input type="date" />
            </Field>
            <Field label="Date you moved out">
                <Input type="date" />
            </Field>
            <Field label="When did you last personally confirm the home was vacant?">
                <Input type="date" />
            </Field>
            <Field label="Is the home likely still vacant?">
                <RadioCardGroup
                    name="likely"
                    options={['Yes', 'Not sure', 'I only know that I moved out']}
                />
            </Field>
        </div>
    );
}

function StepTwo() {
    return (
        <div className="flex flex-col gap-5">
            <Field label="County">
                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                    <option>Select county</option>
                    <option>Nairobi</option>
                    <option>Kiambu</option>
                    <option>Kajiado</option>
                    <option>Machakos</option>
                </select>
            </Field>
            <Field label="Town / city">
                <Input placeholder="e.g. Ruaka" />
            </Field>
            <Field label="Estate / neighbourhood">
                <Input placeholder="e.g. Gacharage" />
            </Field>
            <Field
                label="Building / plot name"
                hint="Shown only to verified members if you choose."
            >
                <Input placeholder="e.g. Wendani Court" />
            </Field>
            <Field label="Block or wing">
                <Input placeholder="e.g. Block B" />
            </Field>
            <Field label="House type">
                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                    {[
                        'Bedsitter',
                        'Studio',
                        'Single room',
                        '1-Bedroom',
                        '2-Bedroom',
                        '3-Bedroom',
                        'Maisonette',
                        'House',
                    ].map((o) => (
                        <option key={o}>{o}</option>
                    ))}
                </select>
            </Field>
            <Field label="Floor">
                <Input placeholder="e.g. 2nd floor" />
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
                <Input placeholder="e.g. B7" />
            </Field>
            <Field
                label="Map pin"
                hint="We publish an approximate circle, not the exact building point."
            >
                <div className="relative flex h-40 items-center justify-center rounded-xl bg-emerald-50">
                    <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-amber-950">
                        <MapPin className="size-3.5" /> Drag to adjust
                    </span>
                </div>
            </Field>
            <Field label="Landmark and directions">
                <Textarea placeholder="From Ruaka stage, walk toward the market…" />
            </Field>
            <Field label="Nearest matatu stage">
                <Input placeholder="e.g. Ruaka stage, 7-minute walk" />
            </Field>
            <Field label="Privacy setting">
                <RadioCardGroup
                    name="priv"
                    options={[
                        'Show approximate location publicly',
                        'Share more detailed directions only with verified members',
                    ]}
                />
            </Field>
        </div>
    );
}

function StepThree() {
    return (
        <div className="flex flex-col gap-5">
            <Field label="Last-known monthly rent (KES)">
                <Input inputMode="numeric" placeholder="22000" />
            </Field>
            <Field label="Last-known deposit (KES)">
                <Input inputMode="numeric" placeholder="22000" />
            </Field>
            <Field label="Water cost">
                <Input placeholder="e.g. KES 500 – 900 monthly" />
            </Field>
            <Field label="Garbage collection charge">
                <Input placeholder="e.g. KES 200 monthly" />
            </Field>
            <Field label="Electricity arrangement">
                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                    <option>Prepaid tokens</option>
                    <option>Postpaid bill</option>
                    <option>Shared meter</option>
                    <option>Included in rent</option>
                </select>
            </Field>
            <Field label="Service charge">
                <Input placeholder="e.g. None" />
            </Field>
            <Field label="Parking cost">
                <Input placeholder="e.g. KES 1,000 monthly" />
            </Field>
            <Field label="Other regular costs">
                <Input placeholder="e.g. Security levy" />
            </Field>
            <Field label="Estimated total move-in cost">
                <Input placeholder="e.g. 46,000" />
            </Field>
            <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                <Checkbox />
                I understand that rent may change after I move out.
            </Label>
        </div>
    );
}

function StepFour() {
    return (
        <div className="flex flex-col gap-5">
            <Field label="Property type">
                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                    <option>1-Bedroom</option>
                    <option>Bedsitter</option>
                    <option>Studio</option>
                    <option>2-Bedroom</option>
                    <option>Maisonette</option>
                </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Bedrooms">
                    <Input type="number" min={0} defaultValue={1} />
                </Field>
                <Field label="Bathrooms">
                    <Input type="number" min={1} defaultValue={1} />
                </Field>
            </div>
            <Field label="Furnishing">
                <RadioCardGroup
                    name="furn"
                    options={['Unfurnished', 'Partly furnished', 'Fully furnished']}
                />
            </Field>
            <Field label="Features">
                <ChipToggleGroup
                    options={[
                        'Parking',
                        'Balcony',
                        'Lift',
                        'Security guard',
                        'CCTV',
                        'Gated compound',
                        'Borehole',
                        'Water tank',
                    ]}
                />
            </Field>
            <Field label="Water source">
                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                    <option>County water with tank backup</option>
                    <option>Borehole</option>
                    <option>County water only</option>
                    <option>Water vendor / bowser</option>
                </select>
            </Field>
            <Field label="Internet providers available">
                <ChipToggleGroup
                    options={[
                        'Safaricom Home Fibre',
                        'Faiba',
                        'Zuku',
                        'Poa Internet',
                        'None known',
                    ]}
                />
            </Field>
            <Field label="Pet policy, if known">
                <RadioCardGroup
                    name="pets"
                    options={[
                        'Pets allowed',
                        'Pets not allowed',
                        'Not sure — ask the caretaker',
                    ]}
                />
            </Field>
            <Field label="Nearby facilities">
                <ChipToggleGroup
                    options={[
                        'Matatu stage',
                        'School',
                        'Hospital',
                        'Market',
                        'Supermarket',
                        'Church',
                        'Mosque',
                        'Workplace area',
                    ]}
                />
            </Field>
        </div>
    );
}

function StepFive() {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm text-stone-500">
                Rate 1 (poor) to 5 (excellent). Add a short note where it
                helps the next tenant.
            </p>
            {CONDITION_FIELDS.map((label) => (
                <Card key={label} className="p-4">
                    <div className="flex items-center justify-between">
                        <b className="text-sm text-stone-900">{label}</b>
                        <RateControl label={label} />
                    </div>
                    <Input
                        className="mt-2"
                        placeholder={`Optional note about ${label.toLowerCase()}`}
                    />
                </Card>
            ))}
        </div>
    );
}

function StepSix() {
    const labels = ['LIVING ✓', 'KITCHEN ✓', 'BATHROOM ✓'];
    return (
        <div className="flex flex-col gap-5">
            <p className="text-sm text-stone-500">
                Minimum 3 photos required. Recommended: living area/bedroom,
                kitchen, bathroom, exterior or building entrance, and the
                water/electricity meter.
            </p>
            <div className="grid grid-cols-3 gap-2">
                {labels.map((label, i) => (
                    <div
                        key={label}
                        className="relative aspect-square overflow-hidden rounded-lg bg-stone-100"
                    >
                        <img
                            src={PLACEHOLDER_PHOTOS[i % PLACEHOLDER_PHOTOS.length]}
                            alt={label}
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            {label}
                        </span>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => toast('Photo picker would open here')}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 text-sm text-stone-400"
                >
                    + Add
                </button>
            </div>
            <div>
                <div className="flex items-center justify-between text-sm text-stone-600">
                    <span>Uploading exterior.jpg</span>
                    <span className="text-stone-400">68%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full w-[68%] rounded-full bg-emerald-600" />
                </div>
                <p className="mt-1 text-xs text-stone-400">
                    Images are compressed on your phone before upload to save
                    data.
                </p>
            </div>
            <Field label="Optional short video walk-through">
                <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => toast('Video picker would open here')}
                >
                    <Video className="size-4" /> Add a 15–60 second
                    walk-through
                </Button>
            </Field>
            <Field label="Optional proof of former occupancy">
                <ChipToggleGroup
                    options={[
                        'Blurred rent receipt',
                        'Blurred lease / tenancy document',
                        'Utility bill',
                    ]}
                />
            </Field>
            <p className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                🔐 Documents are used only to verify your connection to this
                home. They will not be publicly displayed.
            </p>
            <p className="rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-800">
                ⚠️ Remove or blur personal details, ID numbers, account
                numbers and phone numbers before uploading. We scan uploads
                and warn you when we detect them.
            </p>
        </div>
    );
}

function StepSeven() {
    return (
        <div className="flex flex-col gap-5">
            <Field label="What did you like about living here?">
                <Textarea placeholder="Good natural light, responsive caretaker…" />
            </Field>
            <Field label="What should a new tenant know before moving in?">
                <Textarea />
            </Field>
            <Field label="Were there water, electricity, security, access, repair, noise, pest or cost issues?">
                <Textarea />
            </Field>
            <Field label="What costs surprised you?">
                <Textarea />
            </Field>
            <Field label="What advice would you give the next tenant?">
                <Textarea />
            </Field>

            <Card className="p-4">
                <h4 className="text-sm font-bold text-stone-900">
                    Review rules
                </h4>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-stone-500">
                    <li>Share your direct experience.</li>
                    <li>Be factual and specific.</li>
                    <li>
                        Do not publish names, phone numbers, ID details,
                        threats, insults or unverified accusations.
                    </li>
                    <li>NyumbaHub may review or remove harmful content.</li>
                </ul>
            </Card>

            <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                <Checkbox />
                I lived in or recently visited this home and the information
                is accurate to the best of my knowledge.
            </Label>
            <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                <Checkbox />
                I understand NyumbaHub will display this as a tenant-reported
                vacancy, not an official listing.
            </Label>
        </div>
    );
}

const STEP_BODIES = [StepOne, StepTwo, StepThree, StepFour, StepFive, StepSix, StepSeven];

export default function PostVacancy() {
    const [step, setStep] = useState(1);
    const StepBody = STEP_BODIES[step - 1];

    const publish = () => {
        toast('Vacancy report published');
        router.visit('/post/success');
    };

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Post a vacancy report" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Post a vacancy report
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Help someone avoid the stress of house hunting. Share what
                you know about the home you recently vacated.
            </p>

            <Card className="mt-5 p-4">
                <div className="flex items-center justify-between text-sm">
                    <b>
                        Step {step} of 7 · {STEP_LABELS[step - 1]}
                    </b>
                    <span className="text-stone-400">
                        Draft saved automatically ✓
                    </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${(step / 7) * 100}%` }}
                    />
                </div>
            </Card>

            <div className="mt-5">
                <StepBody />
            </div>

            <div className="mt-6 flex gap-3">
                <Button
                    variant="ghost"
                    className="flex-1"
                    disabled={step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                    Back
                </Button>
                {step === 7 ? (
                    <Button className="flex-1" onClick={publish}>
                        Publish vacancy report
                    </Button>
                ) : (
                    <Button
                        className="flex-1"
                        onClick={() => setStep((s) => Math.min(7, s + 1))}
                    >
                        Continue
                    </Button>
                )}
            </div>

            <p className="mt-6 text-center text-xs text-stone-400">
                Leaving now keeps your draft. You can finish it later from
                Profile → My vacancy reports.
            </p>
        </div>
    );
}