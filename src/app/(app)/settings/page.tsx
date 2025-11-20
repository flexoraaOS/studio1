import React from 'react';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Settings | TradeSight Pro',
};

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>
                        This page will allow you to manage your application settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <p>Features will include:</p>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                        <li>User Profile Management</li>
                        <li>Base Currency and FX Settings</li>
                        <li>Security (2FA, Password)</li>
                        <li>API Key Management</li>
                        <li>Notification Preferences</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
