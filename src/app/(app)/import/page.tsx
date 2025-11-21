import React from 'react';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Link, Waypoints, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Import Trades | TradeSight Pro',
};

const importOptions = [
    {
        icon: FileText,
        title: 'Import from CSV/XLS',
        description: 'Upload a file from your broker. Use our mapping UI to match columns.',
        buttonText: 'Upload File',
    },
    {
        icon: Link,
        title: 'Connect Broker API',
        description: 'Connect directly to your broker for seamless, automatic trade synchronization.',
        buttonText: 'Connect API',
        disabled: true,
    },
    {
        icon: Waypoints,
        title: 'Setup Webhook',
        description: 'Receive real-time trade fills from platforms that support webhooks.',
        buttonText: 'Configure',
    }
];

export default function ImportPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Import Data</h1>
                <p className="text-muted-foreground">Sync your trades from any source.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {importOptions.map(option => (
                    <Card key={option.title} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <option.icon className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle>{option.title}</CardTitle>
                                    <CardDescription>{option.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                           <Button className="w-full" disabled={!!option.disabled}>
                                {option.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
