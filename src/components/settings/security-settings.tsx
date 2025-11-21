'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SecuritySettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                    Manage your password and secure your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="current-password">Change Password</Label>
                    <Input id="current-password" type="password" placeholder="Current Password" />
                    <Input id="new-password" type="password" placeholder="New Password" />
                    <Input id="confirm-password" type="password" placeholder="Confirm New Password" />
                </div>
                 <Separator />
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                           Add an extra layer of security to your account.
                        </p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>Update Password</Button>
            </CardFooter>
        </Card>
    );
}
