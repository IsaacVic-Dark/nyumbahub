import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Field } from '@/components/nyumba/field';
import { RadioCardGroup } from '@/components/nyumba/radio-card-group';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Confirm() {
    const submit = () => {
        toast('Confirmation submitted. Thank you!');
        router.visit('/listings/L1');
    };

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="I visited this location" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                I visited this location
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Your visit keeps this report accurate for the next person.
            </p>

            <Card className="mt-5 p-4 text-sm">
                <b>Confirming:</b>{' '}
                <span className="text-stone-500">
                    Recently vacated 1-bedroom in Ruaka near Two Rivers
                </span>
            </Card>

            <h3 className="mt-6 mb-2 text-base font-bold text-stone-900">
                What did you find?
            </h3>
            <RadioCardGroup
                name="conf"
                options={[
                    'I found the home still vacant.',
                    'The home is no longer vacant.',
                    'The rent has changed.',
                    'The location details need correction.',
                    'I could not confirm the home.',
                    'I found another vacant unit in this building.',
                ]}
            />

            <Card className="mt-4 p-4">
                <h3 className="font-bold text-stone-900">If still vacant</h3>
                <div className="mt-3 flex flex-col gap-4">
                    <Field label="Date and time of your visit">
                        <Input type="datetime-local" />
                    </Field>
                    <Field label="Optional photo">
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => toast('Camera would open here')}
                        >
                            📷 Add a photo from your visit
                        </Button>
                    </Field>
                    <Field label="Optional note">
                        <Textarea placeholder="The caretaker said the house is still open." />
                    </Field>
                    <Field label="Did you speak to the caretaker or management?">
                        <RadioCardGroup
                            name="spoke"
                            options={['Yes', 'No', 'Nobody was available']}
                        />
                    </Field>
                    <Field label="Optional rent update (KES)">
                        <Input inputMode="numeric" placeholder="22000" />
                    </Field>
                    <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-semibold text-stone-800">
                        <Checkbox />
                        I confirm this is based on my own recent visit.
                    </Label>
                </div>
            </Card>

            <Card className="mt-4 p-4">
                <h3 className="font-bold text-stone-900">
                    If no longer vacant
                </h3>
                <div className="mt-3 flex flex-col gap-4">
                    <Field label="Date of visit">
                        <Input type="date" />
                    </Field>
                    <Field label="What happened?">
                        <RadioCardGroup
                            name="why"
                            options={[
                                'The unit was occupied',
                                'Caretaker said it has been rented',
                                'The building could not confirm it',
                                'Other',
                            ]}
                        />
                    </Field>
                    <Field label="Optional explanation">
                        <Textarea />
                    </Field>
                </div>
            </Card>

            <p className="mt-4 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                🔐 Your name and phone number are never shown publicly. Your
                confirmation helps keep NyumbaHub accurate.
            </p>

            <Card className="mt-4 p-4">
                <h4 className="text-sm font-bold text-stone-900">
                    How confirmations are weighted
                </h4>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-stone-500">
                    <li>New contributors can submit confirmations immediately.</li>
                    <li>Trusted contributors carry greater verification weight.</li>
                    <li>
                        Suspicious or contradictory reports are routed to
                        moderation instead of changing the status.
                    </li>
                    <li>
                        Rate limits prevent repeated attempts to manipulate a
                        report&rsquo;s status.
                    </li>
                </ul>
            </Card>

            <Button className="mt-6 w-full" onClick={submit}>
                Submit confirmation
            </Button>
        </div>
    );
}