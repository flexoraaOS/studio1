'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

export default function APISettings() {
    return (
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
    );
}
