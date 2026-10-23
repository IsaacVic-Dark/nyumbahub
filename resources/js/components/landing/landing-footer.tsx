import { Link, usePage } from '@inertiajs/react';

type Col = { title: string; links: { label: string; href: string }[] };

const COLUMNS: Col[] = [
    {
        title: 'Platform',
        links: [
            { label: 'About NyumbaHub', href: '/help' },
            { label: 'How it works', href: '/help' },
            { label: 'Explore homes', href: '/explore' },
            { label: 'Post a vacancy', href: '/post' },
        ],
    },
    {
        title: 'Trust',
        links: [
            { label: 'Safety centre', href: '/safety' },
            { label: 'Community guidelines', href: '/help' },
            { label: 'Privacy policy', href: '/help' },
            { label: 'Terms of use', href: '/help' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Help centre', href: '/help' },
            { label: 'Contact', href: '/help' },
        ],
    },
];

export function LandingFooter() {
    const isAdmin = Boolean(
        (usePage().props as { auth?: { user?: { is_admin?: boolean } | null } })
            .auth?.user?.is_admin,
    );

    const columns = COLUMNS.map((c) =>
        isAdmin && c.title === 'Support'
            ? { ...c, links: [...c.links, { label: 'Staff portal', href: '/admin' }] }
            : c,
    );

    return (
        <footer className="bg-lp-footer text-lp-footer-fg">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div>
                        <div className="font-serif text-xl font-bold">
                            NyumbaHub
                        </div>
                        <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-lp-footer-fg/70">
                            Real vacancy reports. Real tenant experiences. A
                            community platform, not an agency.
                        </p>
                    </div>
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase">
                                {col.title}
                            </h4>
                            <div className="mt-4 flex flex-col gap-2.5">
                                {col.links.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-sm text-lp-footer-fg/70 transition hover:text-lp-footer-fg"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-lp-footer-fg/60 sm:flex-row sm:justify-between">
                    <p>
                        © 2026 NyumbaHub. Every listing is a tenant-reported
                        vacancy report, not an official property listing.
                    </p>
                    <p>🇰🇪 Kenya · Prices in KES</p>
                </div>
            </div>
        </footer>
    );
}