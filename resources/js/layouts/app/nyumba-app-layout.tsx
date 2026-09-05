import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { BottomNav } from '@/components/nyumba/bottom-nav';
import { TopNav } from '@/components/nyumba/top-nav';

type Props = PropsWithChildren<{
    title?: string;
}>;

export default function NyumbaAppLayout({ children, title }: Props) {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            {title && <Head title={title} />}
            <TopNav />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 lg:px-6 lg:pb-8">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}