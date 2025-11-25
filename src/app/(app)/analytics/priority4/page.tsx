'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import StressTestRunner from '@/components/analytics/stress-test-runner';
import CumulativeAttributionChart from '@/components/analytics/cumulative-attribution-chart';
import { mockHistoricalEquity, mockFactorReturns, mockFactorAttribution, mockRegimePerformance, mockEdgeDecayData, mockSlippageData } from '@/lib/data';
import MarketRegimePerformance from '@/components/analytics/market-regime-performance';
import EdgeDecayCurve from '@/components/analytics/edge-decay-curve';
import SlippageAttribution from '@/components/analytics/slippage-attribution';

export default function Priority4AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Priority-4 Advanced Analytics</h1>
                    <p className="text-muted-foreground">Advanced Risk, Attribution & Edge-Decay Models.</p>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MarketRegimePerformance data={mockRegimePerformance} />
                <EdgeDecayCurve data={mockEdgeDecayData} />
                 <SlippageAttribution data={mockSlippageData} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>More Analytics Coming Soon</CardTitle>
                    <CardDescription>
                       More advanced features will be added here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Stay tuned for more institutional-grade analytics to further refine your trading edge.</p>
                </CardContent>
            </Card>
        </div>
    )
}
