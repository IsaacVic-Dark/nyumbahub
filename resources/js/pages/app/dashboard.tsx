import { Link } from '@inertiajs/react';
import {
    Handshake,
    Lock,
    Search,
    ShieldAlert,
    ShowerHead,
    Wallet,
    Warehouse,
} from 'lucide-react';
import { ListingCard } from '@/components/nyumba/listing-card';
import { MetricStat } from '@/components/nyumba/metric-stat';
import { SectionHeading } from '@/components/nyumba/section-heading';
import { SiteFooter } from '@/components/nyumba/site-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_LISTINGS } from '@/lib/nyumba-data';

const METRICS = [
    { value: '1,284', label: 'Recently reported vacancies' },
    { value: '417', label: 'Community confirmations this week' },
    { value: '2,930', label: 'Verified former tenants' },
    { value: '186', label: 'Neighbourhoods covered' },
];

const STEPS = [
    {
        title: 'A tenant moves out',
        body: 'Someone leaves a bedsitter in South B or a 1-bedroom in Ruaka.',
    },
    {
        title: 'They share what they know',
        body: 'Location, last-known rent, condition and lived experience.',
    },
    {
        title: 'Seekers verify at the building',
        body: 'You visit and confirm availability with the caretaker or management yourself.',
    },
    {
        title: 'The community keeps it current',
        body: 'Visitors confirm, update rent, or mark a home as occupied.',
    },
];

const WHY_USE = [
    {
        icon: Search,
        title: 'Find homes earlier',
        body: 'Hear about a vacancy the week a tenant moves, not weeks later.',
    },
    {
        icon: Wallet,
        title: 'Know the last-known rent',
        body: 'Walk into a viewing already knowing what the previous tenant paid.',
    },
    {
        icon: Warehouse,
        title: 'See real condition reports',
        body: 'Walls, plumbing, sockets, dampness and pests — scored honestly.',
    },
    {
        icon: ShowerHead,
        title: 'Water, security, noise & hidden costs',
        body: 'Garbage, service charge and meter arrangements before you commit.',
    },
    {
        icon: Handshake,
        title: 'Less guessing, fewer dead ends',
        body: 'Reduce reliance on unclear listings and repeated viewing fees.',
    },
    {
        icon: Lock,
        title: 'Privacy by design',
        body: 'Exact unit numbers stay private. Phone numbers are never public.',
    },
];

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-16 py-8">
            {/* HERO */}
            <section className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        🇰🇪 Built for Kenya · Nairobi & surrounding towns
                    </span>
                    <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                        Find homes through people who lived there.
                    </h1>
                    <p className="mt-4 max-w-md text-base text-stone-600">
                        Discover recently vacated homes, last-known rent, real
                        house conditions, and honest tenant experiences from
                        your community.
                    </p>

                    <Card className="mt-6 flex flex-col gap-2.5 p-4">
                        <Input placeholder="Location or estate, e.g. Ruaka" />
                        <div className="grid grid-cols-2 gap-2.5">
                            <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700">
                                <option>What are you looking for?</option>
                                <option>Bedsitter</option>
                                <option>Studio</option>
                                <option>Single room</option>
                                <option>1-Bedroom</option>
                                <option>2-Bedroom</option>
                                <option>3-Bedroom</option>
                                <option>Maisonette</option>
                                <option>House</option>
                            </select>
                            <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700">
                                <option>Rent range (KES)</option>
                                <option>Under 10,000</option>
                                <option>10,000 – 20,000</option>
                                <option>20,000 – 35,000</option>
                                <option>35,000 – 60,000</option>
                                <option>Above 60,000</option>
                            </select>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/explore">
                                <Search className="size-4" /> Search
                            </Link>
                        </Button>
                    </Card>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/explore">
                                Explore recently vacated homes
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-amber-500 text-amber-950 hover:bg-amber-400"
                        >
                            <Link href="/post">Post a vacancy report</Link>
                        </Button>
                    </div>
                    <p className="mt-4 text-xs text-stone-500">
                        🛡️ Tenant-reported. Community-confirmed. Always
                        verify when you visit.
                    </p>
                </div>

                <div className="hidden lg:block">
                    <div className="mx-auto max-w-sm -rotate-1">
                        <ListingCard listing={MOCK_LISTINGS[0]} index={0} />
                    </div>
                </div>
            </section>

            {/* TRUST METRICS */}
            <section className="grid grid-cols-2 gap-6 rounded-2xl border border-stone-200 bg-white py-8 sm:grid-cols-4">
                {METRICS.map((m) => (
                    <MetricStat key={m.label} {...m} />
                ))}
            </section>

            {/* HOW IT WORKS */}
            <section>
                <SectionHeading
                    title="How NyumbaHub works"
                    subtitle="Four simple community steps. No agents, no brokerage, no booking."
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, i) => (
                        <Card key={step.title} className="p-5">
                            <span className="text-sm font-extrabold text-emerald-700">
                                {i + 1}
                            </span>
                            <h4 className="mt-2 text-sm font-bold text-stone-900">
                                {step.title}
                            </h4>
                            <p className="mt-1 text-sm text-stone-500">
                                {step.body}
                            </p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* WHY USE */}
            <section>
                <SectionHeading title="Why use NyumbaHub" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {WHY_USE.map(({ icon: Icon, title, body }) => (
                        <Card key={title} className="p-5">
                            <Icon className="size-6 text-emerald-700" />
                            <h4 className="mt-2 text-sm font-bold text-stone-900">
                                {title}
                            </h4>
                            <p className="mt-1 text-sm text-stone-500">
                                {body}
                            </p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FEATURED LISTINGS */}
            <section>
                <SectionHeading
                    title="Featured recent vacancy reports"
                    action={
                        <Button variant="ghost" asChild>
                            <Link href="/explore">View all</Link>
                        </Button>
                    }
                />
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {MOCK_LISTINGS.map((listing, i) => (
                        <ListingCard key={listing.id} listing={listing} index={i} />
                    ))}
                </div>
            </section>

            {/* COMMUNITY VERIFICATION */}
            <Card className="flex flex-col gap-3 p-6 sm:p-8">
                <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Community verification
                </span>
                <h2 className="text-xl font-extrabold text-stone-900">
                    Reports get stronger when people confirm them
                </h2>
                <p className="text-sm text-stone-600">
                    After you visit a building, tell the community what you
                    found. A single confirmation moves a report from
                    &ldquo;Recently Vacated&rdquo; to &ldquo;Community
                    Confirmed&rdquo;, and a contradiction sends it to
                    moderation instead of silently changing.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                        ✅ <b className="text-stone-900">Still vacant</b> —
                        refreshes the last-confirmed time for everyone.
                    </div>
                    <div className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                        🔁 <b className="text-stone-900">Rent changed</b> —
                        updates last-known rent with a visible history.
                    </div>
                    <div className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                        🚫 <b className="text-stone-900">No longer vacant</b>{' '}
                        — flags the report as possibly occupied.
                    </div>
                </div>
                <Button variant="secondary" asChild className="w-fit">
                    <Link href="/confirm">See the confirmation flow</Link>
                </Button>
            </Card>

            {/* SAFETY */}
            <Card className="flex flex-col gap-3 border-amber-200 bg-amber-50 p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-amber-800">
                    <ShieldAlert className="size-5" /> Safety and transparency
                </h2>
                <ul className="grid gap-2 text-sm text-amber-900/80">
                    <li>
                        NyumbaHub does not rent houses, manage property, or
                        collect rent, deposits or booking fees.
                    </li>
                    <li>
                        Vacancy and rent can change quickly — a report is a
                        snapshot, not a guarantee.
                    </li>
                    <li>
                        Always inspect a property in person before paying any
                        money.
                    </li>
                    <li>
                        Never send money before confirming the responsible
                        person and the actual house.
                    </li>
                </ul>
                <Button
                    asChild
                    className="w-fit bg-amber-500 text-amber-950 hover:bg-amber-400"
                >
                    <Link href="/safety">Visit the Safety Centre</Link>
                </Button>
            </Card>

            <SiteFooter />
        </div>
    );
}

Dashboard.layout = {
    title: 'Home',
};