'use client'
import React, {useState, useMemo} from 'react';
import { TrendingUp, TrendingDown, Target, Scale, Hash, HeartPulse, AreaChart, BarChart, LineChart, TestTube, Dna } from 'lucide-react';
import { mockKpis, mockEquityCurve, mockTrades, mockPnlCalendar, mockPerformanceData } from '@/lib/data';
import KpiCard from '@/components/dashboard/kpi-card';
import EquityChart from '@/components/dashboard/equity-chart';
import DrawdownChart from '@/components/analytics/drawdown-chart';
import RecentTradesTable from '@/components/dashboard/recent-trades-table';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import PnlCalendar from '@/components/analytics/pnl-calendar';
import PerformanceChart from '@/components/dashboard/performance-chart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Kpi } from '@/lib/types';
import TraderDNAReport from '@/components/enterprise/TraderDNAReport';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';


const kpiIcons = {
    "Realized P&L": <TrendingUp className="text-green-500" />,
    "Win Rate": <Target className="text-blue-500" />,
    "Sharpe Ratio": <TrendingUp className="text-purple-500" />,
    "Max Drawdown": <TrendingDown className="text-red-500" />,
};

const dashboardKpis: Kpi[] = [
  { title: 'Realized P&L', value: '₹1,24,845.72', change: '+2.1%', changeType: 'positive', description: 'Past 30 days' },
  { title: 'Win Rate', value: '62.5%', change: '-1.5%', changeType: 'negative', description: 'All time' },
  { title: 'Sharpe Ratio', value: '1.78', description: 'Annualized' },
  { title: 'Max Drawdown', value: '₹-42,108.30', description: 'All time' },
];

const analyticsSections = [
    {
        title: 'Quantitative Analytics',
        description: 'Monte Carlo, VaR/CVaR, Factor Exposure',
        href: '/analytics/priority2',
        icon: AreaChart
    },
    {
        title: 'Behavioral & Edge Analysis',
        description: 'Cohort Analysis, Anomaly Detection',
        href: '/analytics/priority3',
        icon: BarChart
    },
    {
        title: 'Risk & Attribution Models',
        description: 'Stress Testing, Factor Attribution',
        href: '/analytics/priority4',
        icon: TestTube
    }
];


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
                {dashboardKpis.map((kpi) => (
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PnlCalendar data={mockPnlCalendar} />
                </div>
                <div className="lg:col-span-1">
                    <PerformanceChart data={mockPerformanceData} />
                </div>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Advanced Analytics</CardTitle>
                        <CardDescription>Explore deeper insights into your trading performance.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                         {analyticsSections.map(section => (
                            <Card key={section.title} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <section.icon className="w-8 h-8 text-primary" />
                                        <div>
                                            <CardTitle className="text-lg">{section.title}</CardTitle>
                                            <CardDescription className="text-xs">{section.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardFooter className="mt-auto">
                                    <Button asChild className="w-full" variant="secondary">
                                        <Link href={section.href}>
                                            Explore
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                         ))}
                         <Dialog>
                            <DialogTrigger asChild>
                                 <Card className="flex flex-col cursor-pointer hover:bg-muted/50 transition-colors">
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <Dna className="w-8 h-8 text-primary" />
                                            <div>
                                                <CardTitle className="text-lg">Trader DNA Report</CardTitle>
                                                <CardDescription className="text-xs">Your unique trading personality profile.</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardFooter className="mt-auto">
                                        <Button className="w-full" variant="secondary">
                                            View Report
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <TraderDNAReport />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>


            <div>
                <RecentTradesTable trades={filteredTrades.slice(0, 5)} />
            </div>
        </div>
    );
}
