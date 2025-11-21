import React from 'react';
import type { Metadata } from 'next';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { mockKpis, mockEquityCurve, mockPerformanceData, mockTrades } from '@/lib/data';
import KpiCard from '@/components/dashboard/kpi-card';
import EquityChart from '@/components/dashboard/equity-chart';
import PerformanceChart from '@/components/dashboard/performance-chart';
import RecentTradesTable from '@/components/dashboard/recent-trades-table';

export const metadata: Metadata = {
    title: 'Dashboard | TradeSight Pro',
};

const kpiIcons = {
    "Realized P&L": <TrendingUp className="text-green-500" />,
    "Win Rate": <Target className="text-blue-500" />,
    "Sharpe Ratio": <TrendingUp className="text-purple-500" />,
    "Max Drawdown": <TrendingDown className="text-red-500" />,
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
                <div className="flex items-center gap-2">
                    {/* Add date range picker here */}
                </div>
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
                <PerformanceChart data={mockPerformanceData} />
            </div>

            <div>
                <RecentTradesTable trades={mockTrades.slice(0, 5)} />
            </div>
        </div>
    );
}
