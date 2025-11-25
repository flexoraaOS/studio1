'use client';
import React, {useState, useMemo} from 'react';
import { TrendingUp, Scale, Hash, HeartPulse, HelpCircle } from 'lucide-react';
import {
    mockKpis,
    mockEquityCurve,
    mockPerformanceData,
    mockRollingMetrics,
    mockStrategyContributions,
    mockPnlCalendar,
    mockExpectancyData,
    mockTimeOfDayData,
    mockDailyReturns
} from '@/lib/data';
import KpiCard from '@/components/dashboard/kpi-card';
import EquityChart from '@/components/dashboard/equity-chart';
import PerformanceChart from '@/components/dashboard/performance-chart';
import DrawdownChart from '@/components/analytics/drawdown-chart';
import RollingMetricsChart from '@/components/analytics/rolling-metrics-chart';
import StrategyWaterfallChart from '@/components/analytics/strategy-waterfall-chart';
import PnlCalendar from '@/components/analytics/pnl-calendar';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import ExpectancyTable from '@/components/analytics/expectancy-table';
import TimeOfDayMatrix from '@/components/analytics/time-of-day-matrix';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Kpi } from '@/lib/types';
import PerformanceMatrix from '@/components/enterprise/PerformanceMatrix';

const kpiIcons = {
    "Profit Factor": <TrendingUp className="text-green-500" />,
    "Avg P&L / Trade": <Scale className="text-blue-500" />,
    "Total Trades": <Hash className="text-purple-500" />,
    "Behavioral Score": <HeartPulse className="text-amber-500" />,
};

const analyticsKpis: Kpi[] = [
  { title: 'Profit Factor', value: '2.41', change: '+0.12', changeType: 'positive', description: 'Gross Win / Gross Loss' },
  { title: 'Avg P&L / Trade', value: '₹1,245.80', change: '-₹80.10', changeType: 'negative', description: 'Past 30 days' },
  { title: 'Total Trades', value: '112', description: 'Past 30 days' },
  { title: 'Behavioral Score', value: '88/100', change: '+5 pts', changeType: 'positive', description: 'Recent discipline' },
];

export default function AnalyticsPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -90),
        to: new Date(),
    });

     const filteredEquityCurve = useMemo(() => {
        if (!date?.from) return mockEquityCurve;
        const to = date.to || new Date();
        return mockEquityCurve.filter(d => {
            const dDate = new Date(d.date as string);
            return dDate >= date.from! && dDate <= to;
        });
    }, [date]);
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Deep dive into your trading performance.</p>
                </div>
                 <DateRangePicker date={date} setDate={setDate} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {analyticsKpis.map((kpi) => (
                    <KpiCard
                        key={kpi.title}
                        kpi={kpi}
                        icon={kpiIcons[kpi.title as keyof typeof kpiIcons]}
                    />
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <EquityChart data={filteredEquityCurve} />
                <DrawdownChart data={filteredEquityCurve} />
            </div>

            <div className="grid gap-4 lg:grid-cols-1">
                <ExpectancyTable data={mockExpectancyData} />
            </div>
            
            <div className="grid gap-4 lg:grid-cols-1">
                <TimeOfDayMatrix data={mockTimeOfDayData} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <PerformanceChart data={mockPerformanceData} />
                <PerformanceMatrix />
            </div>
            
             <div className="grid gap-4 lg:grid-cols-1">
                <StrategyWaterfallChart data={mockStrategyContributions} />
            </div>
            
            <div className="grid gap-4 lg:grid-cols-1">
                <PnlCalendar data={mockPnlCalendar} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/30">
                    <CardHeader>
                        <CardTitle>Priority-2 Analytics</CardTitle>
                        <CardDescription>Monte Carlo, VaR, and factor analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/analytics/priority2">
                                Go to Advanced Analytics
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/30">
                    <CardHeader>
                        <CardTitle>Priority-3 Analytics</CardTitle>
                        <CardDescription>Cohort Analysis and anomaly detection.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/analytics/priority3">
                                Go to Cohort Analysis
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/30">
                    <CardHeader>
                        <CardTitle>Priority-4 Analytics</CardTitle>
                        <CardDescription>Stress Testing and Performance Attribution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/analytics/priority4">
                                Go to Risk & Attribution
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
