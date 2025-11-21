'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from 'lucide-react';

export default function DataPrivacySettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                    Manage your personal data and account privacy settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex flex-col space-y-2 p-4 border rounded-lg">
                    <h3 className="font-semibold">Export Your Data</h3>
                    <p className="text-sm text-muted-foreground">Download a copy of all your trading data in CSV format.</p>
                    <Button variant="secondary" className="mt-2 self-start">
                        <Download className="mr-2" />
                        Export Data
                    </Button>
                </div>
                 <div className="flex flex-col space-y-2 p-4 border border-destructive/50 rounded-lg">
                    <h3 className="font-semibold text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action is irreversible.</p>
                    <Button variant="destructive" className="mt-2 self-start">
                        <Trash2 className="mr-2" />
                        Delete My Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
