import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Field } from '@/components/nyumba/field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { api, getErrorMessage, getFieldErrors } from '@/lib/api';
import { useApi } from '@/lib/use-api';
import type { Listing } from '@/types/nyumba';

const OPTIONS: [string, string][] = [
    ['still_vacant', 'I found the home still vacant.'],
    ['occupied', 'The home is no longer vacant.'],
    ['rent_changed', 'The rent has changed.'],
    ['information_inaccurate', 'The location details need correction.'],
    ['building_not_found', 'I could not find / confirm the building.'],
];

const SPOKE = ['Yes', 'No', 'Nobody was available'];

export default function Confirm({ id }: { id: string }) {
    const { data } = useApi<{ data: Listing }>(`/listings/${id}`);
    const listing = data?.data;
    const initialType = new URLSearchParams(window.location.search).get('type');
    const [type, setType] = useState(OPTIONS.some(([v]) => v === initialType) ? (initialType as string) : 'still_vacant');
    const [visitedAt, setVisitedAt] = useState('');
    const [note, setNote] = useState('');
    const [spoke, setSpoke] = useState('');
    const [rent, setRent] = useState('');
    const [own, setOwn] = useState(false);
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = async () => {
        if (!own) {
            toast.error('Please confirm this is based on your own recent visit.');

            return;
        }
        setBusy(true);
        setErrors({});
        try {
            await api.post(`/listings/${id}/confirmations`, {
                type,
                note: note.trim() || null,
                visited_at: visitedAt ? new Date(visitedAt).toISOString() : null,
                spoke_to_caretaker: spoke || null,
                reported_rent_amount: type === 'rent_changed' && rent ? Number(rent) : null,
            });
            toast('Confirmation submitted. Thank you!');
            router.visit(`/listings/${id}`);
        } catch (e) {
            setErrors(getFieldErrors(e));
            toast.error(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="I visited this location" />

            <h1 className="text-2xl font-extrabold text-stone-900">I visited this location</h1>
            <p className="mt-1 text-sm text-stone-500">Your visit keeps this report accurate for the next person.</p>

            <Card className="mt-5 p-4 text-sm">
                <b>Confirming:</b>{' '}
                <span className="text-stone-500">
                    {listing ? (
                        <Link href={`/listings/${id}`} className="underline">
                            {listing.title}
                        </Link>
                    ) : (
                        'Loading…'
                    )}
                </span>
            </Card>

            <h3 className="mt-6 mb-2 text-base font-bold text-stone-900">What did you find?</h3>
            <RadioGroup value={type} onValueChange={setType} className="gap-2">
                {OPTIONS.map(([v, label]) => (
                    <Label
                        key={v}
                        htmlFor={`conf-${v}`}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800"
                    >
                        <RadioGroupItem id={`conf-${v}`} value={v} />
                        {label}
                    </Label>
                ))}
            </RadioGroup>
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}

            <Card className="mt-4 p-4">
                <h3 className="font-bold text-stone-900">Details of your visit</h3>
                <div className="mt-3 flex flex-col gap-4">
                    <Field label="Date and time of your visit" error={errors.visited_at}>
                        <Input type="datetime-local" value={visitedAt} max={new Date().toISOString().slice(0, 16)} onChange={(e) => setVisitedAt(e.target.value)} />
                    </Field>
                    {type === 'rent_changed' && (
                        <Field label="New rent (KES)" error={errors.reported_rent_amount}>
                            <Input inputMode="numeric" placeholder="22000" value={rent} onChange={(e) => setRent(e.target.value.replace(/\D/g, ''))} />
                        </Field>
                    )}
                    <Field label="Optional note" error={errors.note}>
                        <Textarea placeholder="e.g. The caretaker said the house is still open." value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
                    </Field>
                    <Field label="Did you speak to the caretaker or management?">
                        <RadioGroup value={spoke} onValueChange={setSpoke} className="gap-2">
                            {SPOKE.map((s) => (
                                <Label key={s} htmlFor={`spoke-${s}`} className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                                    <RadioGroupItem id={`spoke-${s}`} value={s} />
                                    {s}
                                </Label>
                            ))}
                        </RadioGroup>
                    </Field>
                    <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                        <Checkbox checked={own} onCheckedChange={(c) => setOwn(c === true)} />
                        I confirm this is based on my own recent visit.
                    </Label>
                </div>
            </Card>

            <p className="mt-4 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                🔐 Your name and phone number are never shown publicly. Your confirmation helps keep NyumbaHub accurate.
            </p>

            <Card className="mt-4 p-4">
                <h4 className="text-sm font-bold text-stone-900">How confirmations are weighted</h4>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-stone-500">
                    <li>New contributors can submit confirmations immediately.</li>
                    <li>Trusted contributors carry greater verification weight.</li>
                    <li>Suspicious or contradictory reports are routed to moderation instead of changing the status.</li>
                    <li>Rate limits prevent repeated attempts to manipulate a report&rsquo;s status.</li>
                </ul>
            </Card>

            <Button className="mt-6 w-full" disabled={busy} onClick={() => void submit()}>
                Submit confirmation
            </Button>
        </div>
    );
}
