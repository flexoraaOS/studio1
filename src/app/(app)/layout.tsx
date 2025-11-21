import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LayoutDashboard, ArrowRightLeft, Upload, BarChart2, Settings, LifeBuoy, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { TradeSightProLogo } from '@/components/icons';
import SearchBar from '@/components/search-bar';

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/trades', label: 'Trades' },
    { href: '/import', label: 'Import' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/settings', label: 'Settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
       <div className="flex min-h-screen w-full flex-col">
           <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <TradeSightProLogo className="h-6 w-6" />
                        <span className="sr-only">TradeSight Pro</span>
                    </Link>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <SearchBar />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                               <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><User className="mr-2" /> Profile</DropdownMenuItem>
                            <DropdownMenuItem><Settings className="mr-2" /> Settings</DropdownMenuItem>
                            <DropdownMenuItem><LifeBuoy className="mr-2" /> Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><LogOut className="mr-2" /> Logout</DropdownMenuItem>
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