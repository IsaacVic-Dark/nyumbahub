import { Head, Link } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';
import { ListingCard } from '@/components/nyumba/listing-card';
import { MetricStat } from '@/components/nyumba/metric-stat';
import { SectionHeading } from '@/components/nyumba/section-heading';
import { SiteFooter } from '@/components/nyumba/site-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_LISTINGS } from '@/lib/nyumba-data';
import { home } from '@/routes';

const METRICS = [
    { value: '1,284', label: 'Recently reported vacancies' },
    { value: '356', label: 'Community confirmations this week' },
    { value: '942', label: 'Verified former tenants' },
    { value: '47', label: 'Neighbourhoods covered' },
];

const STEPS = [
    { title: 'Step 1', body: 'A tenant moves out.' },
    {
        title: 'Step 2',
        body: "They share the home's location, rent, condition, and lived experience.",
    },
    {
        title: 'Step 3',
        body: 'House seekers find it and verify availability at the building.',
    },
    { title: 'Step 4', body: 'The community keeps reports current.' },
];

const WHY_USE = [
    { icon: '🏠', title: 'Find homes earlier' },
    { icon: '💰', title: 'Know the last-known rent before visiting' },
    { icon: '📋', title: 'See real condition reports' },
    { icon: '🚿', title: 'Learn about water, security, noise and hidden costs' },
    { icon: '🤝', title: 'Avoid relying only on agents and unclear information' },
];

export default function Welcome() {
    return (
        <>
            <Head title="NyumbaHub — Find homes through people who lived there." />

            {/* GUEST HEADER */}
            <header className="border-b border-stone-200">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
                    <Link href={home()} className="flex items-center gap-2 font-bold text-stone-900">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">
                            N
                        </span>
                        NyumbaHub
                    </Link>
                    <nav className="ml-6 hidden items-center gap-4 text-sm font-medium text-stone-600 sm:flex">
                        <Link href="/explore">Explore</Link>
                        <Link href="/safety">Safety</Link>
                        <Link href="/help">Help</Link>
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/explore">Explore homes</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 lg:px-8">
                {/* HERO */}
                <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-14">
                    <div>
                        <h1 className="text-3xl leading-[1.1] font-extrabold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.7rem]">
                            Find homes through people who lived there.
                        </h1>
                        <p className="mt-4 max-w-md text-base text-stone-600 lg:text-lg">
                            Discover recently vacated homes, last-known rent,
                            real house conditions, and honest tenant
                            experiences from your community.
                        </p>

                        <Card className="mt-6 flex flex-col gap-2.5 p-4">
                            <Input placeholder="Search estate, town, or landmark — e.g. Ruaka, Kilimani" />
                            <div className="grid grid-cols-2 gap-2.5">
                                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700">
                                    <option>What are you looking for?</option>
                                    <option>Bedsitter</option>
                                    <option>Studio</option>
                                    <option>1 Bedroom</option>
                                    <option>2 Bedroom</option>
                                    <option>3 Bedroom</option>
                                    <option>Maisonette</option>
                                </select>
                                <select className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700">
                                    <option>Rent range (KES)</option>
                                    <option>Under 10,000</option>
                                    <option>10,000 – 20,000</option>
                                    <option>20,000 – 35,000</option>
                                    <option>35,000+</option>
                                </select>
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/explore">
                                    Search vacancy reports
                                </Link>
                            </Button>
                        </Card>

                        <div className="mb-5 flex flex-wrap gap-3">
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
                        <p className="text-xs text-stone-500">
                            Tenant-reported. Community-confirmed. Always
                            verify when you visit.
                        </p>
                    </div>

                    <div className="hidden sm:block">
                        <div className="mx-auto max-w-sm">
                            <ListingCard listing={MOCK_LISTINGS[0]} index={0} />
                        </div>
                    </div>
                </section>

                {/* TRUST METRICS */}
                <section className="grid grid-cols-2 gap-6 border-y border-stone-200 bg-stone-50 py-8 lg:grid-cols-4">
                    {METRICS.map((m) => (
                        <MetricStat key={m.label} {...m} />
                    ))}
                </section>
                <p className="py-2 text-center text-[11px] text-stone-400">
                    Sample metrics shown for illustration — replace with live
                    figures.
                </p>

                {/* HOW IT WORKS */}
                <section className="py-12">
                    <SectionHeading title="How NyumbaHub works" />
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((step) => (
                            <Card key={step.title} className="p-5">
                                <div className="mb-2 text-sm font-extrabold text-emerald-700">
                                    {step.title}
                                </div>
                                <p className="text-sm text-stone-700">
                                    {step.body}
                                </p>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>

            {/* WHY USE */}
            <section className="bg-emerald-50 py-12">
                <div className="mx-auto max-w-4xl px-4 lg:px-8">
                    <h2 className="mb-6 text-2xl font-extrabold text-stone-900">
                        Why use NyumbaHub
                    </h2>
                    <ul className="grid gap-3 text-sm sm:grid-cols-2">
                        {WHY_USE.map((item) => (
                            <li key={item.title} className="flex gap-2 text-stone-700">
                                <span>{item.icon}</span>
                                {item.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 lg:px-8">
                {/* FEATURED LISTINGS */}
                <section className="py-12">
                    <SectionHeading
                        title="Featured recent vacancy reports"
                        action={
                            <Button variant="ghost" asChild>
                                <Link href="/explore">See all</Link>
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
                <section className="border-y border-stone-200 bg-stone-50 py-12 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-3 text-2xl font-extrabold text-stone-900">
                            Kept accurate by the community
                        </h2>
                        <p className="text-sm text-stone-500">
                            Reports become more useful when people confirm
                            them after visiting. Every &ldquo;still
                            vacant,&rdquo; &ldquo;now occupied,&rdquo; or
                            &ldquo;rent changed&rdquo; update comes from
                            someone who actually checked — not from us.
                        </p>
                    </div>
                </section>

                {/* SAFETY & TRANSPARENCY */}
                <section className="py-12">
                    <Card className="mx-auto max-w-3xl border-amber-300 p-6">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-stone-900">
                            <ShieldAlert className="size-5 text-amber-600" />
                            Safety and transparency
                        </h2>
                        <ul className="space-y-2 text-sm text-stone-500">
                            <li>
                                • NyumbaHub does not rent houses or collect
                                rent.
                            </li>
                            <li>• Vacancy and rent can change quickly.</li>
                            <li>
                                • Inspect a property before paying any money.
                            </li>
                            <li>
                                • Never send money before confirming the
                                responsible person and the house.
                            </li>
                        </ul>
                        <Button variant="outline" size="sm" className="mt-4" asChild>
                            <Link href="/safety">Visit the Safety Centre</Link>
                        </Button>
                    </Card>
                </section>

                <SiteFooter />
            </main>
        </>
    );
}