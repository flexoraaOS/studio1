import React from 'react';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Analytics | TradeSight Pro',
};

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Advanced Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your trading performance.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>
                        Advanced interactive charts and analytics are under development.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This section will include features like:</p>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                        <li>Drawdown Curves and Daily/Hourly Heatmaps</li>
                        <li>Rolling Metrics (Sharpe, Volatility)</li>
                        <li>Waterfall Charts for Strategy Contributions</li>
                        <li>Correlation Matrix of Strategies</li>
                        <li>And much more...</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
