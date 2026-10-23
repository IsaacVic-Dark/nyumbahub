import { Link, usePage } from '@inertiajs/react';
import { Bell, Heart, Map, PlusCircle, Search } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { useApi } from '@/lib/use-api';
import { dashboard } from '@/routes';

const NAV_DESK = [
    { title: 'Explore', href: '/explore', icon: Search },
    { title: 'Map', href: '/map', icon: Map },
    { title: 'Saved', href: '/saved', icon: Heart },
] as const;

export function TopNav() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();
    // Unread badge on the bell (signed-in users only).
    const unread = useApi<{ unread_count: number }>(
        auth.user ? '/notifications/unread-count' : null,
        undefined,
        { skipAuthRedirect: true },
    );
    const unreadCount = unread.data?.unread_count ?? 0;

    return (
        <header className="sticky top-0 z-40 hidden border-b border-stone-200 bg-white/95 backdrop-blur lg:block">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
                <Link href={dashboard()} className="flex items-center gap-2">
                    <AppLogo />
                </Link>

                <nav className="flex h-full items-center gap-1">
                    {NAV_DESK.map(({ title, href, icon: Icon }) => (
                        <Link
                            key={title}
                            href={href}
                            className={cn(
                                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100',
                                isCurrentUrl(href) &&
                                    'bg-emerald-50 text-emerald-800',
                            )}
                        >
                            <Icon className="size-4" />
                            {title}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        asChild
                        className="bg-amber-500 text-amber-950 hover:bg-amber-400"
                    >
                        <Link href="/post">
                            <PlusCircle className="size-4" />
                            Post a vacancy report
                        </Link>
                    </Button>

                    {auth.user ? (
                        <>
                            <Button variant="ghost" size="icon" asChild className="relative">
                                <Link href="/notifications" aria-label="Notifications">
                                    <Bell className="size-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-4 font-bold text-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-10 rounded-full p-1"
                                    >
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-full bg-emerald-100 text-emerald-800">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}