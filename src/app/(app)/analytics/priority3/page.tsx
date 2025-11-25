'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CohortAnalysisChart from '@/components/analytics/cohort-analysis-chart';
import AnomalyDetector from '@/components/analytics/anomaly-detector';
import { mockCohortData, mockTrades } from '@/lib/data';

export default function Priority3AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Priority-3 Advanced Analytics</h1>
                    <p className="text-muted-foreground">Deep-dive into behavioral patterns and edge decay.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CohortAnalysisChart cohortData={mockCohortData} />
                </div>
                <div className="lg:col-span-1">
                    <AnomalyDetector trades={mockTrades} />
                </div>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>More Analytics Coming Soon</CardTitle>
                    <CardDescription>
                        Time-in-Market analysis, Trade Replay, and more advanced features will be added here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Stay tuned for more institutional-grade analytics to further refine your trading edge.</p>
                </CardContent>
            </Card>

        </div>
    )
}
