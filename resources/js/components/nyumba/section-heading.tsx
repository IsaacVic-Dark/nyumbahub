import type { ReactNode } from 'react';

export function SectionHeading({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h2 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
                )}
            </div>
            {action}
        </div>
    );
}