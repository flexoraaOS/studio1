// app/enterprise/page.tsx
'use client';
import React, { useState } from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays, subYears } from 'date-fns';
import { Filter, Building, Bot, GanttChartSquare, Pyramid, ShieldCheck, GitPullRequest, Milestone, Telescope, FileText, CheckCircle, ListTodo } from 'lucide-react';
import PlaybookBuilder from '@/components/enterprise/PlaybookBuilder';
import PerformanceMatrix from '@/components/enterprise/PerformanceMatrix';
import RiskOfRuin from '@/components/enterprise/RiskOfRuin';
import MultiPathMonteCarlo from '@/components/enterprise/MultiPathMonteCarlo';
import NLPCompanionPanel from '@/components/enterprise/NLPCompanionPanel';
import RiskMatrix from '@/components/enterprise/RiskMatrix';
import TradeBookQualityScore from '@/components/enterprise/TradeBookQualityScore';
import CrossStrategyConflict from '@/components/enterprise/CrossStrategyConflict';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// export const metadata: Metadata = {
//     title: 'Enterprise Analytics | TradeSight Pro',
// };

const ComingSoonCard = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <Card className="h-full flex flex-col items-center justify-center text-center p-6 border-dashed">
        <Icon className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">Coming Soon</p>
    </Card>
);

export default function EnterpriseDashboardPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subYears(new Date(), 1),
        to: new Date(),
    });
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [selectedStrategy, setSelectedStrategy] = useState('all');

    return (
        <div className="flex flex-col gap-6">
            {/* Header and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Enterprise Suite</h1>
                    <p className="text-muted-foreground">Advanced tools for institutional-grade analytics and workflow.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Accounts</SelectItem>
                            <SelectItem value="acc_01">Primary Trading</SelectItem>
                            <SelectItem value="acc_02">Long Term IRA</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select Strategy" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Strategies</SelectItem>
                             <SelectItem value="Momentum">Momentum</SelectItem>
                            <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                            <SelectItem value="Breakout">Breakout</SelectItem>
                        </SelectContent>
                    </Select>
                    <DateRangePicker date={date} setDate={setDate} />
                    <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4"/>
                        <span className="sr-only">More Filters</span>
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <NLPCompanionPanel />
                    <RiskOfRuin />
                </div>

                <div className="md:col-span-2 xl:col-span-2 flex flex-col gap-6">
                    <MultiPathMonteCarlo />
                    <PerformanceMatrix />
                </div>
                
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <PlaybookBuilder />
                    <TradeBookQualityScore />
                </div>

                <div className="md:col-span-2 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <RiskMatrix />
                   <CrossStrategyConflict />
                   <ComingSoonCard title="Exposure Pyramid" icon={Pyramid} />
                </div>
                
                 <div className="md:col-span-2 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ComingSoonCard title="Playbook Adherence" icon={CheckCircle} />
                    <ComingSoonCard title="Position Lifecycle" icon={Milestone} />
                    <ComingSoonCard title="Trader DNA Report" icon={FileText} />
                    <ComingSoonCard title="Hotspot Detection" icon={Telescope} />
                </div>
                 <div className="md:col-span-2 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ComingSoonCard title="Session Timeline" icon={GanttChartSquare} />
                    <ComingSoonCard title="Consistency Score" icon={ShieldCheck} />
                    <ComingSoonCard title="Improvement Planner" icon={ListTodo} />
                 </div>
            </div>
        </div>
    );
}
