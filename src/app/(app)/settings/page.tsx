'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Settings</h1>
                <p className="text-muted-foreground">Manage your account and application preferences.</p>
            </div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>
                                This is how others will see you on the site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="https://picsum.photos/seed/user/80/80" alt="User" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Change Photo
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" defaultValue="@johndoe" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Profile</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize the look and feel of your dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label>Theme</Label>
                                 <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="base-currency">Base Currency</Label>
                                <Select defaultValue="INR">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR (₹)</SelectItem>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Choose what you want to be notified about.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Weekly Reports</Label>
                                    <p className="text-sm text-muted-foreground">
                                       Receive a summary of your trading performance every week.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Security Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified about any unusual activity on your account.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Trade Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get real-time notifications for trade executions.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                         <CardFooter>
                            <Button>Save Notifications</Button>
                         </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="api">
                     <Card>
                        <CardHeader>
                            <CardTitle>API Access</CardTitle>
                            <CardDescription>
                                Manage API keys for programmatic access to your trading data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted rounded-md flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">
                                You have no API keys.
                                </p>
                            </div>
                           
                        </CardContent>
                         <CardFooter>
                             <Button useAnimation>Create New API Key</Button>
                         </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
