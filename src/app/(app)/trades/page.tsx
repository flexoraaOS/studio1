import React from 'react';
import type { Metadata } from 'next';
import { PlusCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TradesDataTable from '@/components/trades/trades-data-table';
import { mockTrades } from '@/lib/data';
import AddTradeSheet from '@/components/trades/add-trade-sheet';

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
            <TradesDataTable trades={mockTrades} />
        </div>
    );
}