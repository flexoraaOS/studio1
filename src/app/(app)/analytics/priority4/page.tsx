'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import StressTestRunner from '@/components/analytics/stress-test-runner';
import CumulativeAttributionChart from '@/components/analytics/cumulative-attribution-chart';
import { mockHistoricalEquity, mockFactorReturns, mockFactorAttribution } from '@/lib/data';

export default function Priority4AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Priority-4 Advanced Analytics</h1>
                    <p className="text-muted-foreground">Advanced Risk & Performance Attribution Models.</p>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StressTestRunner
                    baseEquityCurve={mockHistoricalEquity}
                    factorReturns={mockFactorReturns}
                />
                <CumulativeAttributionChart
                    attributionData={mockFactorAttribution}
                />
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>More Analytics Coming Soon</CardTitle>
                    <CardDescription>
                       Market-Regime Performance, Edge-Decay Curves, and more will be added here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Stay tuned for more institutional-grade analytics to further refine your trading edge.</p>
                </CardContent>
            </Card>
        </div>
    )
}
