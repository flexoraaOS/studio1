
import React from 'react';
import type { Metadata } from 'next';
import { RadioTower, TrendingUp } from 'lucide-react';
import TradesDataTable from '@/components/trades/trades-data-table';
import { mockTrades } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Live Trades | Flexoraa TraderOS',
};

export default function LiveTradesPage() {
    const liveTrades = mockTrades.filter(trade => trade.status === 'Open');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient flex items-center gap-2">
                        <RadioTower className="w-8 h-8"/>
                        Live Trades
                    </h1>
                    <p className="text-muted-foreground">Monitor your open positions in real-time.</p>
                </div>
            </div>

            <Card className="bg-green-500/10 border-green-500/30">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Live P&L Ticker
                    </CardTitle>
                    <CardDescription>Real-time updates of your open positions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-400">₹2,450.50</p>
                    <p className="text-sm text-muted-foreground">+1.25% today</p>
                </CardContent>
            </Card>

            <TradesDataTable trades={liveTrades} />
        </div>
    );
}
