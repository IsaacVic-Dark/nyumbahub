import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

const LINKS = [
    { title: 'Explore', href: '/explore' },
    { title: 'Safety', href: '/safety' },
    { title: 'Help', href: '/help' },
] as const;

export const brandButton =
    'bg-lp-brand text-lp-brand-fg hover:bg-lp-brand/90 focus-visible:ring-lp-brand/30';
export const outlineButton =
    'border-lp-line bg-lp-card text-lp-ink shadow-none hover:bg-lp-alt hover:text-lp-ink';

export function LandingNav() {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();
    const getInitials = useInitials();

    return (
        <header className="sticky top-0 z-40 bg-lp-bg/90 backdrop-blur">
            <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
                {/* Wordmark (no icon) */}
                <Link
                    href={home()}
                    className="font-serif text-xl font-bold tracking-tight text-lp-ink"
                >
                    NyumbaHub
                </Link>

                {/* Centre links */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {LINKS.map(({ title, href }) => (
                        <Link
                            key={title}
                            href={href}
                            className={cn(
                                'border-b-2 border-transparent py-1 text-sm font-medium text-lp-muted transition hover:text-lp-ink',
                                isCurrentUrl(href) &&
                                    'border-lp-brand text-lp-brand',
                            )}
                        >
                            {title}
                        </Link>
                    ))}
                </nav>

                {/* Right actions (desktop) */}
                <div className="hidden items-center justify-end gap-2 lg:flex">
                    {auth.user ? (
                        <>
                            <Button asChild className={brandButton}>
                                <Link href="/explore">Explore homes</Link>
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
                                            <AvatarFallback className="rounded-full bg-lp-soft text-lp-brand">
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
                            <Button
                                variant="ghost"
                                asChild
                                className="text-lp-ink hover:bg-lp-alt hover:text-lp-ink"
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className={outlineButton}
                            >
                                <Link href="/register">Sign up</Link>
                            </Button>
                            <Button asChild className={brandButton}>
                                <Link href="/explore">Explore homes</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile menu */}
                <div className="flex justify-end lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open menu"
                                className="text-lp-ink hover:bg-lp-alt hover:text-lp-ink"
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        {/* Sheet renders in a portal, so it needs its own .landing scope for the colour tokens */}
                        <SheetContent
                            side="right"
                            className="landing w-72 border-lp-line bg-lp-bg p-0 text-lp-ink"
                        >
                            <SheetHeader className="border-b border-lp-line p-5">
                                <SheetTitle className="font-serif text-xl font-bold text-lp-ink">
                                    NyumbaHub
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-1 p-3">
                                {LINKS.map(({ title, href }) => (
                                    <Link
                                        key={title}
                                        href={href}
                                        className={cn(
                                            'rounded-lg px-3 py-2.5 text-sm font-medium text-lp-muted hover:bg-lp-alt hover:text-lp-ink',
                                            isCurrentUrl(href) &&
                                                'bg-lp-soft text-lp-brand',
                                        )}
                                    >
                                        {title}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto flex flex-col gap-2 p-5">
                                {!auth.user && (
                                    <>
                                        <Button
                                            variant="outline"
                                            asChild
                                            className={outlineButton}
                                        >
                                            <Link href="/login">Log in</Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            asChild
                                            className={outlineButton}
                                        >
                                            <Link href="/register">Sign up</Link>
                                        </Button>
                                    </>
                                )}
                                <Button asChild className={brandButton}>
                                    <Link href="/explore">Explore homes</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}