'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Settings, LogOut, User, Monitor } from 'lucide-react';
import Link from 'next/link';
import { FlexoraaTraderOSLogo } from '@/components/icons';
import SearchBar from '@/components/search-bar';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { RemindersDialog } from '@/components/reminders/reminders-dialog';

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/trades', label: 'Trades' },
    { href: '/import', label: 'Import' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/behavioral', label: 'Behavioral' },
    { href: 'reminders', label: 'Reminders' },
    { href: '/enterprise', label: 'Enterprise' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    // useEffect(() => {
    //     if (!isUserLoading && !user) {
    //         router.push('/login');
    //     }
    // }, [isUserLoading, user, router]);
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        if (names.length === 1 && names[0].length > 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        return "U";
    };

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
        }
        router.push('/login');
    };
    
    if (isUserLoading || !user) {
        // This will show a loading screen but won't redirect.
        // Once not loading, if there's no user, it will proceed to render children
        // which might have their own logic, or just appear broken without user data.
        // For the dev button, this is what we want.
    }

    return (
       <div className={cn("flex min-h-screen w-full flex-col", "animated-background")}>
           <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-10">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <FlexoraaTraderOSLogo className="h-6 w-6" />
                        <span className="sr-only">Flexoraa TraderOS</span>
                    </Link>
                    {navItems.map((item) => {
                        if (item.href === 'reminders') {
                            return (
                                <RemindersDialog key={item.href}>
                                    <button className="text-muted-foreground transition-colors hover:text-primary font-medium">
                                        {item.label}
                                    </button>
                                </RemindersDialog>
                            );
                        }
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground transition-colors hover:text-primary font-medium"
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <SearchBar />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                               <Avatar>
                                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user?.displayName || 'Guest'}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="flex items-center w-full">
                                    <Settings className="mr-2" /> Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                     <Monitor className="mr-2" /> Theme
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <ThemeToggle />
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {children}
            </main>
        </div>
    );
}
