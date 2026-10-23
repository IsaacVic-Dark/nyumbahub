import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Clock,
    Droplets,
    FileText,
    LogOut,
    RefreshCw,
    Search,
    ShieldAlert,
    Users,
    Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { LandingFooter } from '@/components/landing/landing-footer';
import {
    brandButton,
    LandingNav,
    outlineButton,
} from '@/components/landing/landing-nav';
import {
    CONTAINER,
    EYEBROW,
    FeaturedGrid,
    HeroVisual,
    LandingSearchBar,
    LandingStats,
    SectionHead,
} from '@/components/landing/landing-parts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ---------------------------- static content ---------------------------- */

const PROPERTY_TYPES = [
    {
        type: '2-Bedroom',
        image: '/images/2_bedroom_img.jpg',
        body: 'Room for couples, small families, or a home office.',
    },
    {
        type: '1-Bedroom',
        image: '/images/1_bedroom_img.jpg',
        body: 'A comfortable step up with a separate bedroom and living space.',
    },
    {
        type: 'Bedsitter',
        image: '/images/bedsitter_img.jpg',
        body: 'Compact and affordable. Ideal for one person starting out.',
    },
    {
        type: '3-Bedroom',
        image: '/images/3_bedroom_img.jpg',
        body: 'Space for growing families who need room to breathe.',
    },
];

// Swap this for any photo in /public/images
const BETTER_WAY_IMAGE = '/images/3_bedroom_img.jpg';

const BETTER_WAY: { icon: LucideIcon; title: string; body: string }[] = [
    {
        icon: Clock,
        title: 'Find homes earlier',
        body: 'See vacancies reported by tenants before they reach adverts.',
    },
    {
        icon: Wallet,
        title: 'Know the last-known rent before visiting',
        body: 'Go in with a realistic price and the right questions.',
    },
    {
        icon: ClipboardCheck,
        title: 'See real condition reports',
        body: 'Ratings and notes from people who actually lived there.',
    },
    {
        icon: Droplets,
        title: 'Learn about water, security, noise and hidden costs',
        body: 'The things a viewing rarely tells you.',
    },
    {
        icon: Users,
        title: 'Avoid relying only on agents and unclear information',
        body: 'Community-confirmed details you can check for yourself.',
    },
];

const STEPS: { n: string; icon: LucideIcon; title: string; body: string }[] = [
    {
        n: '01',
        icon: LogOut,
        title: 'A tenant moves out',
        body: 'They decide to share what they know about the home.',
    },
    {
        n: '02',
        icon: FileText,
        title: 'Experience shared',
        body: "They share the home's location, rent, condition, and lived experience.",
    },
    {
        n: '03',
        icon: Search,
        title: 'Seekers find it',
        body: 'House seekers find it and verify availability at the building.',
    },
    {
        n: '04',
        icon: RefreshCw,
        title: 'Community keeps it current',
        body: 'The community keeps reports current.',
    },
];

// TODO: PLACEHOLDER testimonials. Replace with real quotes before launch.
const TESTIMONIALS = [
    {
        quote: 'I found a bedsitter before it was even advertised, and the last-known rent was spot on. No surprises at the door.',
        name: 'Wanjiru K.',
        meta: 'House seeker · Ruaka',
        tag: 'Bedsitter',
    },
    {
        quote: 'The water and security ratings told me what the caretaker never would. That honesty saved me a wasted trip.',
        name: 'Brian O.',
        meta: 'House seeker · Kilimani',
        tag: '1-Bedroom',
    },
    {
        quote: 'I posted my vacancy report in ten minutes and neighbours confirmed it within days. It felt good helping the next tenant.',
        name: 'Achieng M.',
        meta: 'Reporter · Kasarani',
        tag: '2-Bedroom',
    },
];

const SAFETY_POINTS = [
    'NyumbaHub does not rent houses or collect rent.',
    'Vacancy and rent can change quickly.',
    'Inspect a property before paying any money.',
    'Never send money before confirming the responsible person and the house.',
];

/* -------------------------------- page --------------------------------- */

export default function Welcome() {
    const [t, setT] = useState(0);
    const current = TESTIMONIALS[t];
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="landing min-h-screen bg-lp-bg text-lp-ink">
            <Head title="NyumbaHub — Find homes through people who lived there." />

            <LandingNav />

            <main>
                {/* HERO */}
                <section className={cn(CONTAINER, 'pt-10 pb-14 lg:pt-14')}>
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                        <div>
                            <p className={EYEBROW}>
                                Find a place. Know before you go.
                            </p>
                            <h1 className="mt-4 font-serif text-4xl leading-[1.05] font-bold tracking-tight text-lp-ink sm:text-5xl lg:text-[3.4rem]">
                                Find homes through people who lived there.
                            </h1>
                            <p className="mt-5 max-w-md text-base leading-relaxed text-lp-muted">
                                Discover recently vacated homes, last-known
                                rent, real house conditions, and honest tenant
                                experiences from your community.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    size="lg"
                                    className={cn('h-11', brandButton)}
                                >
                                    <Link href="/explore">
                                        Explore homes
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className={cn('h-11', outlineButton)}
                                >
                                    <Link href="/post">
                                        Post a vacancy report
                                    </Link>
                                </Button>
                            </div>

                            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-lp-muted">
                                {[
                                    'Tenant-reported',
                                    'Community-confirmed',
                                    'Always verify when you visit',
                                ].map((x) => (
                                    <li
                                        key={x}
                                        className="flex items-center gap-1.5"
                                    >
                                        <CheckCheck className="size-3.5 text-lp-brand" />
                                        {x}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <HeroVisual />
                    </div>

                    <LandingSearchBar />
                    <LandingStats />
                </section>

                {/* FEATURED */}
                <section className="bg-lp-alt py-16 lg:py-20">
                    <div className={CONTAINER}>
                        <SectionHead
                            eyebrow="Featured reports"
                            title={
                                <>
                                    Homes Worth
                                    <br />
                                    Coming Home To.
                                </>
                            }
                            body="Explore the latest tenant-reported homes, with last-known rent, condition notes, and community confirmation."
                        />
                        <div className="mt-10">
                            <FeaturedGrid count={3} />
                        </div>
                    </div>
                </section>

                {/* PROPERTY TYPES */}
                <section className="py-16 lg:py-20">
                    <div className={CONTAINER}>
                        <SectionHead
                            eyebrow="Explore by house type"
                            title={
                                <>
                                    A Home for Every
                                    <br />
                                    Next Chapter.
                                </>
                            }
                            body="From compact bedsitters to family-sized homes, explore the possibilities."
                        />
                        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
                            {PROPERTY_TYPES.map((p) => (
                                <Link
                                    key={p.type}
                                    href={`/explore?house_type=${encodeURIComponent(p.type)}`}
                                    className="group block"
                                >
                                    <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-lp-alt">
                                        <img
                                            src={p.image}
                                            alt={p.type}
                                            loading="lazy"
                                            className="size-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="mt-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-lp-ink">
                                                {p.type}
                                            </h3>
                                            <p className="mt-1 text-xs leading-relaxed text-lp-muted">
                                                {p.body}
                                            </p>
                                        </div>
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-lp-line text-lp-muted transition group-hover:border-lp-brand group-hover:text-lp-brand">
                                            <ArrowRight className="size-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BETTER WAY */}
                <section className="bg-lp-alt py-16 lg:py-20">
                    <div
                        className={cn(
                            CONTAINER,
                            'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
                        )}
                    >
                        <div className="aspect-[4/4.4] overflow-hidden rounded-2xl">
                            <img
                                src={BETTER_WAY_IMAGE}
                                alt="A home found through NyumbaHub"
                                loading="lazy"
                                className="size-full object-cover"
                            />
                        </div>
                        <div>
                            <p className={EYEBROW}>The NyumbaHub difference</p>
                            <h2 className="mt-3 font-serif text-3xl leading-[1.1] font-bold tracking-tight text-lp-ink sm:text-4xl">
                                A Better Way
                                <br />
                                to Find Home.
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-lp-muted">
                                Finding a home is more than a search. It&rsquo;s
                                a decision about how you want to live, and
                                people who lived there know best.
                            </p>
                            <ul className="mt-8 border-t border-lp-line">
                                {BETTER_WAY.map(
                                    ({ icon: Icon, title, body }) => (
                                        <li
                                            key={title}
                                            className="flex gap-4 border-b border-lp-line py-4"
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-lp-line bg-lp-card text-lp-brand">
                                                <Icon className="size-4" />
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-semibold text-lp-ink">
                                                    {title}
                                                </h3>
                                                <p className="mt-0.5 text-xs text-lp-muted">
                                                    {body}
                                                </p>
                                            </div>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* STEPS */}
                <section className="py-16 lg:py-20">
                    <div className={CONTAINER}>
                        <SectionHead
                            eyebrow="How NyumbaHub works"
                            title="Every Step, Made Clear."
                            body="From one tenant's move-out to your next viewing, here is how a vacancy report comes to life."
                        />
                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                            {STEPS.map(({ n, icon: Icon, title, body }, i) => (
                                <div
                                    key={n}
                                    className={cn(
                                        'lg:px-6',
                                        i > 0 && 'lg:border-l lg:border-lp-line',
                                        i === 0 && 'lg:pl-0',
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="font-serif text-4xl font-bold text-lp-brand">
                                            {n}
                                        </span>
                                        <span className="flex size-9 items-center justify-center rounded-full bg-lp-soft text-lp-brand">
                                            <Icon className="size-4" />
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-base font-semibold text-lp-ink">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-lp-muted">
                                        {body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS (placeholder content) */}
                <section className="bg-lp-alt py-16 lg:py-20">
                    <div
                        className={cn(
                            CONTAINER,
                            'grid items-center gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-14',
                        )}
                    >
                        <div>
                            <p className={EYEBROW}>Testimonials</p>
                            <h2 className="mt-3 font-serif text-3xl leading-[1.1] font-bold tracking-tight text-lp-ink sm:text-4xl">
                                Stories From
                                <br />
                                Our Community.
                            </h2>
                            <p className="mt-4 max-w-xs text-sm leading-relaxed text-lp-muted">
                                Hear from house seekers and tenants who shared
                                and found homes on NyumbaHub.
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <button
                                    type="button"
                                    aria-label="Previous story"
                                    onClick={() =>
                                        setT(
                                            (t - 1 + TESTIMONIALS.length) %
                                                TESTIMONIALS.length,
                                        )
                                    }
                                    className="flex size-9 items-center justify-center rounded-full border border-lp-line bg-lp-card text-lp-ink hover:bg-lp-bg"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next story"
                                    onClick={() =>
                                        setT((t + 1) % TESTIMONIALS.length)
                                    }
                                    className="flex size-9 items-center justify-center rounded-full border border-lp-line bg-lp-card text-lp-ink hover:bg-lp-bg"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                                <span className="text-xs text-lp-muted">
                                    <b className="text-lp-ink">{pad(t + 1)}</b>{' '}
                                    / {pad(TESTIMONIALS.length)}
                                </span>
                            </div>
                        </div>

                        <figure className="rounded-2xl border border-lp-line bg-lp-card p-8 sm:p-10">
                            <span className="font-serif text-6xl leading-none text-lp-brand">
                                &ldquo;
                            </span>
                            <blockquote className="mt-2 font-serif text-xl leading-snug font-semibold text-lp-ink sm:text-2xl">
                                {current.quote}
                            </blockquote>
                            <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-lp-line pt-5">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-full bg-lp-soft text-sm font-semibold text-lp-brand">
                                        {current.name[0]}
                                    </span>
                                    <div>
                                        <div className="text-sm font-semibold text-lp-ink">
                                            {current.name}
                                        </div>
                                        <div className="text-xs text-lp-muted">
                                            {current.meta}
                                        </div>
                                    </div>
                                </div>
                                <span className="rounded-full bg-lp-soft px-3 py-1 text-[11px] font-medium text-lp-brand">
                                    {current.tag}
                                </span>
                            </figcaption>
                        </figure>
                    </div>
                </section>

                {/* COMMUNITY + SAFETY */}
                <section className="py-16 lg:py-20">
                    <div className={cn(CONTAINER, 'max-w-4xl')}>
                        <div className="text-center">
                            <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-lp-soft text-lp-brand">
                                <BadgeCheck className="size-5" />
                            </span>
                            <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-lp-ink">
                                Kept accurate by the community
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-lp-muted">
                                Reports become more useful when people confirm
                                them after visiting. Every &ldquo;still
                                vacant,&rdquo; &ldquo;now occupied,&rdquo; or
                                &ldquo;rent changed&rdquo; update comes from
                                someone who actually checked, not from us.
                            </p>
                        </div>

                        <div className="mt-12 rounded-2xl border border-lp-line bg-lp-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-lp-ink">
                                <ShieldAlert className="size-5 text-lp-brand" />
                                Safety and transparency
                            </h2>
                            <ul className="mt-4 space-y-2 text-sm text-lp-muted">
                                {SAFETY_POINTS.map((p) => (
                                    <li key={p} className="flex gap-2">
                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lp-brand" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className={cn('mt-5', outlineButton)}
                            >
                                <Link href="/safety">Visit the Safety Centre</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}