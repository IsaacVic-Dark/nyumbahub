import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { ChipToggleGroup } from '@/components/nyumba/chip-toggle-group';
import { Field } from '@/components/nyumba/field';
import { RadioCardGroup } from '@/components/nyumba/radio-card-group';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SEARCH_ALERTS } from '@/lib/nyumba-data';

export default function Alerts() {
    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Search alerts" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Search alerts
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Get told the moment a matching vacancy is reported near you.
            </p>

            <Card className="mt-5 flex flex-col gap-5 p-5">
                <h3 className="font-bold text-stone-900">Create an alert</h3>
                <Field label="Estate or area">
                    <Input placeholder="e.g. South B, Nairobi" />
                </Field>
                <Field label="Maximum rent (KES)">
                    <Input inputMode="numeric" placeholder="15000" />
                </Field>
                <Field label="Property type">
                    <ChipToggleGroup
                        options={['Bedsitter', 'Studio', '1BR', '2BR', '3BR', 'Maisonette']}
                    />
                </Field>
                <Field label="Bedrooms">
                    <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm">
                        <option>Any</option>
                        <option>Studio</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3+</option>
                    </select>
                </Field>
                <Field label="Distance from a place">
                    <div className="flex gap-2">
                        <Input placeholder="e.g. Westlands office" />
                        <select className="h-10 w-32 shrink-0 rounded-md border border-stone-200 bg-white px-3 text-sm">
                            <option>2 km</option>
                            <option>5 km</option>
                            <option>10 km</option>
                        </select>
                    </div>
                </Field>
                <Field label="Required amenities">
                    <ChipToggleGroup
                        options={[
                            'Reliable water',
                            'Parking',
                            'Near matatu stage',
                            'Gated compound',
                            'Internet available',
                        ]}
                    />
                </Field>
                <Field label="Notification frequency">
                    <RadioCardGroup
                        name="freq"
                        options={['Instant', 'Daily digest', 'Weekly digest']}
                    />
                </Field>
                <Field label="Delivery channels">
                    <ChipToggleGroup
                        options={[
                            'Push notification',
                            'Email',
                            'SMS (optional)',
                            'WhatsApp (coming soon)',
                        ]}
                    />
                </Field>
                <Button className="w-full" onClick={() => toast('Alert created')}>
                    Create alert
                </Button>
            </Card>

            <h3 className="mt-6 mb-3 text-base font-bold text-stone-900">
                Your alerts
            </h3>
            <div className="flex flex-col gap-3">
                {SEARCH_ALERTS.map((a) => (
                    <Card
                        key={a.title}
                        className="flex items-center justify-between p-4"
                    >
                        <div>
                            <b className="text-sm text-stone-900">{a.title}</b>
                            <p className="text-xs text-stone-400">{a.schedule}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                {a.matches}
                            </span>
                            <button
                                aria-label="Pause"
                                onClick={() => toast('Alert paused')}
                                className="flex size-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
                            >
                                ⏸
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}