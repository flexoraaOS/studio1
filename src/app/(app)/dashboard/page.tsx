'use client'
import React, {useState, useMemo} from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { mockKpis, mockEquityCurve, mockPerformanceData, mockTrades } from '@/lib/data';
import KpiCard from '@/components/dashboard/kpi-card';
import EquityChart from '@/components/dashboard/equity-chart';
import PerformanceChart from '@/components/dashboard/performance-chart';
import RecentTradesTable from '@/components/dashboard/recent-trades-table';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

const kpiIcons = {
    "Realized P&L": <TrendingUp className="text-green-500" />,
    "Win Rate": <Target className="text-blue-500" />,
    "Sharpe Ratio": <TrendingUp className="text-purple-500" />,
    "Max Drawdown": <TrendingDown className="text-red-500" />,
};

export default function DashboardPage() {
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

    const filteredTrades = useMemo(() => {
        if (!date?.from) return mockTrades;
        const to = date.to || new Date();
        return mockTrades.filter(t => {
            const tDate = new Date(t.entryDate as string);
            return tDate >= date.from! && tDate <= to;
        });
    }, [date]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
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
                <EquityChart data={filteredEquityCurve} />
                <PerformanceChart data={mockPerformanceData} />
            </div>

            <div>
                <RecentTradesTable trades={filteredTrades.slice(0, 5)} />
            </div>
        </div>
    );
}
