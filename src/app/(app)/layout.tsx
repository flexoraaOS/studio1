import React from 'react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Search, LayoutDashboard, ArrowRightLeft, Upload, BarChart2, Settings, LifeBuoy, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { TradeSightProLogo } from '@/components/icons';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/trades', icon: ArrowRightLeft, label: 'Trades' },
    { href: '/import', icon: Upload, label: 'Import' },
    { href: '/analytics', icon: BarChart2, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                            <TradeSightProLogo className="w-8 h-8 text-sidebar-primary" />
                            <h1 className="text-xl font-headline font-semibold text-sidebar-primary">TradeSight Pro</h1>
                        </div>
                    </SidebarHeader>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <Link href={item.href} className="w-full">
                                    <SidebarMenuButton tooltip={item.label}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <SidebarTrigger className="sm:hidden" />
                    <div className="relative flex-1 ml-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search trades, strategies..." className="w-full rounded-lg bg-secondary pl-8 md:w-[280px] lg:w-[320px]" />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="overflow-hidden rounded-full">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
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
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
