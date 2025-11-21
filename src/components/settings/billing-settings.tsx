'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function BillingSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Billing & Plan</CardTitle>
                <CardDescription>
                    Manage your subscription, payment methods, and view invoices.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold">Current Plan</h3>
                        <p className="text-3xl font-bold">Pro</p>
                        <p className="text-muted-foreground">Renews on December 1, 2024.</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Plan Features</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center"><Check className="text-green-500 mr-2" /> Unlimited Trades</li>
                        <li className="flex items-center"><Check className="text-green-500 mr-2" /> Advanced Analytics</li>
                        <li className="flex items-center"><Check className="text-green-500 mr-2" /> API Access</li>
                        <li className="flex items-center"><Check className="text-green-500 mr-2" /> Priority Support</li>
                    </ul>
                </div>
                 <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="flex items-center">
                        <p className="text-muted-foreground">Visa ending in •••• 4242</p>
                         <Button variant="link" className="ml-auto">Update</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                 <Button variant="outline">View Invoices</Button>
                 <Button useAnimation>Upgrade Plan</Button>
            </CardFooter>
        </Card>
    );
}
