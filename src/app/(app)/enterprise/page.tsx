// app/enterprise/page.tsx
'use client';
import React, { useState } from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays, subYears } from 'date-fns';
import { Filter, Building, Bot } from 'lucide-react';
import PlaybookBuilder from '@/components/enterprise/PlaybookBuilder';
import PerformanceMatrix from '@/components/enterprise/PerformanceMatrix';
import RiskOfRuin from '@/components/enterprise/RiskOfRuin';
import MultiPathMonteCarlo from '@/components/enterprise/MultiPathMonteCarlo';
import NLPCompanionPanel from '@/components/enterprise/NLPCompanionPanel';

// export const metadata: Metadata = {
//     title: 'Enterprise Analytics | TradeSight Pro',
// };

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
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Column 1 */}
                <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
                    <PlaybookBuilder />
                </div>

                {/* Column 2 */}
                <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
                    <MultiPathMonteCarlo />
                    <PerformanceMatrix />
                </div>
                
                {/* Column 3 */}
                <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">
                    <NLPCompanionPanel />
                    <RiskOfRuin />
                </div>
            </div>
            
             {/* Placeholder for future components */}
            <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">More Enterprise Panels Coming Soon</h3>
                <p className="mt-1 text-sm text-muted-foreground">TradeBook Quality, Risk Matrix, Exposure Pyramid, and more will appear here.</p>
            </div>
        </div>
    );
}
