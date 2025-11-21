'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Choose what you want to be notified about and where.
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
    );
}
