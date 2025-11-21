import React from 'react';
import type { Metadata } from 'next';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import {
    mockKpis,
    mockEquityCurve,
    mockPerformanceData,
    mockRollingMetrics,
    mockStrategyContributions,
    mockPnlCalendar
} from '@/lib/data';
import KpiCard from '@/components/dashboard/kpi-card';
import EquityChart from '@/components/dashboard/equity-chart';
import PerformanceChart from '@/components/dashboard/performance-chart';
import DrawdownChart from '@/components/analytics/drawdown-chart';
import RollingMetricsChart from '@/components/analytics/rolling-metrics-chart';
import StrategyWaterfallChart from '@/components/analytics/strategy-waterfall-chart';
import PnlCalendar from '@/components/analytics/pnl-calendar';

export const metadata: Metadata = {
    title: 'Analytics | TradeSight Pro',
};

const kpiIcons = {
    "Realized P&L": <TrendingUp className="text-green-500" />,
    "Win Rate": <Target className="text-blue-500" />,
    "Sharpe Ratio": <TrendingUp className="text-purple-500" />,
    "Max Drawdown": <TrendingDown className="text-red-500" />,
};

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Advanced Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your trading performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockKpis.map((kpi) => (
                    <KpiCard
                        key={kpi.title}
                        kpi={kpi}
                        icon={kpiIcons[kpi.title as keyof typeof kpiIcons]}
                    />
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <EquityChart data={mockEquityCurve} />
                <DrawdownChart data={mockEquityCurve} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <PerformanceChart data={mockPerformanceData} />
                <RollingMetricsChart data={mockRollingMetrics} />
            </div>
            
             <div className="grid gap-4 lg:grid-cols-1">
                <StrategyWaterfallChart data={mockStrategyContributions} />
            </div>
            
            <div className="grid gap-4 lg:grid-cols-1">
                <PnlCalendar data={mockPnlCalendar} />
            </div>

        </div>
    );
}
