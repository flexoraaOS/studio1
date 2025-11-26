import React from 'react';
import type { Metadata } from 'next';
import { PlusCircle, File, Zap, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TradesDataTable from '@/components/trades/trades-data-table';
import { mockTrades } from '@/lib/data';
import AddTradeSheet from '@/components/trades/add-trade-sheet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Trades | Flexoraa TraderOS',
};

export default function TradesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">All Trades</h1>
                    <p className="text-muted-foreground">Manage and review your trading history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <File className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <AddTradeSheet>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Trade
                        </Button>
                    </AddTradeSheet>
                </div>
            </div>
            
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                         <BrainCircuit className="w-5 h-5 text-amber-400" />
                         AI-Powered Auto-Tagging
                    </CardTitle>
                    <CardDescription>Let AI discover patterns and suggest tags for your trades.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Our upcoming clustering feature will analyze your trades based on metrics like hold time, size, and instrument type to automatically suggest tags, helping you uncover hidden patterns in your strategy.
                    </p>
                </CardContent>
                 <CardFooter>
                    <Button variant="secondary" className="w-full" disabled>
                        Enable Auto-Tagging (Coming Soon)
                    </Button>
                </CardFooter>
            </Card>

            <TradesDataTable trades={mockTrades} />
        </div>
    );
}
