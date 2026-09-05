import NyumbaAppLayoutTemplate from '@/layouts/app/nyumba-app-layout';
import type { PropsWithChildren } from 'react';

export default function NyumbaLayout({
    title,
    children,
}: PropsWithChildren<{ title?: string }>) {
    return (
        <NyumbaAppLayoutTemplate title={title}>
            {children}
        </NyumbaAppLayoutTemplate>
    );
}