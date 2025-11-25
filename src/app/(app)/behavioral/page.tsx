'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { mockBehavioralMetrics, mockBehavioralTrend } from '@/lib/data';
import BehavioralScorecard from '@/components/behavioral/behavioral-scorecard';
import BehavioralTrendChart from '@/components/behavioral/behavioral-trend-chart';

export default function BehavioralPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Behavioral Dashboard</h1>
                    <p className="text-muted-foreground">Monitor your trading psychology and discipline.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockBehavioralMetrics.map((metric, index) => (
                    <BehavioralScorecard key={index} metric={metric} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Trades Per Day Trend</CardTitle>
                        <CardDescription>Are you over-trading or under-trading?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BehavioralTrendChart data={mockBehavioralTrend} dataKey="tradesPerDay" color="hsl(var(--chart-1))" />
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Average Hold Time Trend</CardTitle>
                        <CardDescription>Is your patience paying off?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BehavioralTrendChart data={mockBehavioralTrend} dataKey="avgHoldTime" color="hsl(var(--chart-2))" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
