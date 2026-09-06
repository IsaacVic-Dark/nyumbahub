import { Link } from '@inertiajs/react';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
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
            { label: 'Staff portal', href: '/admin' },
        ],
    },
];

export function SiteFooter() {
    return (
        <footer className="mt-16 rounded-2xl bg-emerald-950 px-6 py-10 text-emerald-50 sm:px-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="text-lg font-extrabold">NyumbaHub</div>
                    <p className="mt-2 max-w-[30ch] text-sm text-emerald-100/80">
                        Real vacancy reports. Real tenant experiences. A
                        community platform — not an agency.
                    </p>
                    <p className="mt-3 text-sm text-emerald-100/80">
                        🇰🇪 Kenya · Prices in KES
                    </p>
                </div>
                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <h4 className="text-sm font-bold">{col.title}</h4>
                        <div className="mt-3 flex flex-col gap-2">
                            {col.links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm text-emerald-100/80 hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-8 text-xs text-emerald-100/60">
                © 2026 NyumbaHub. Every listing is a tenant-reported vacancy
                report, not an official property listing.
            </p>
        </footer>
    );
}