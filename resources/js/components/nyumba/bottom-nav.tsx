import { Link } from '@inertiajs/react';
import { Heart, MapPin, Plus, Search, User } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

const NAV_BOTTOM = [
    { title: 'Explore', href: '/explore', icon: Search },
    { title: 'Map', href: '/map', icon: MapPin },
    { title: 'Post', href: '/post', icon: Plus },
    { title: 'Saved', href: '/saved', icon: Heart },
    { title: 'Profile', href: '/profile', icon: User },
] as const;

export function BottomNav() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-md items-center justify-between px-2 py-1.5">
                {NAV_BOTTOM.map(({ title, href, icon: Icon }, i) => {
                    const active = isCurrentUrl(href);
                    const isPost = i === 2;

                    return (
                        <Link
                            key={title}
                            href={href}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium text-stone-500',
                                active && !isPost && 'text-emerald-700',
                            )}
                        >
                            {isPost ? (
                                <span className="-mt-4 flex size-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-md">
                                    <Icon className="size-5" />
                                </span>
                            ) : (
                                <Icon className="size-5" />
                            )}
                            <span>{title}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}