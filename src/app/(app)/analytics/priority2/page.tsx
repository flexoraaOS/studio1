'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Download, TestTube, ChevronsRight } from 'lucide-react';
import MonteCarloChart from '@/components/analytics/monte-carlo-chart';
import VarCvarPanel from '@/components/analytics/var-cvar-panel';
import FactorExposureChart from '@/components/analytics/factor-exposure-chart';
import RollingMetricsChart from '@/components/analytics/rolling-metrics-chart';
import { 
    mockDailyReturns, 
    mockFactorReturns, 
    mockHistoricalEquity 
} from '@/lib/data';
import { generateMonteCarloSimulations } from '@/lib/statistics';
import Priority2OverviewCard from '@/components/analytics/priority2-overview-card';

export default function Priority2AnalyticsPage() {
    const [monteCarloSimulations, setMonteCarloSimulations] = useState(100);
    const [rollingWindow, setRollingWindow] = useState(30);

    const mcData = useMemo(() => {
        return generateMonteCarloSimulations(mockHistoricalEquity, monteCarloSimulations, 365);
    }, [monteCarloSimulations]);
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Priority-2 Advanced Analytics</h1>
                    <p className="text-muted-foreground">Quantitative deep-dive into portfolio risk and performance characteristics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share View
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>
            
            <Priority2OverviewCard dailyReturns={mockDailyReturns} simulations={mcData.simulations} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Monte Carlo Equity Bands</CardTitle>
                                <CardDescription>Simulated future equity paths based on historical returns.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={String(monteCarloSimulations)} onValueChange={(val) => setMonteCarloSimulations(Number(val))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Simulations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="100">100 Simulations</SelectItem>
                                        <SelectItem value="500">500 Simulations</SelectItem>
                                        <SelectItem value="1000">1000 Simulations</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <MonteCarloChart data={mcData} />
                    </CardContent>
                </Card>
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <VarCvarPanel dailyReturns={mockDailyReturns} />
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TestTube className="w-5 h-5 text-purple-400"/>
                                Advanced MC Analysis
                            </CardTitle>
                            <CardDescription>Attribution and scenario analysis for simulations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Deeper analysis of simulation results, including factor attribution for tail risk and probability cones for specific market scenarios.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full" disabled>
                                Explore Attribution (Coming Soon)
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Rolling Metrics Suite</CardTitle>
                        <CardDescription>Select a metric to see its rolling performance over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RollingMetricsChart dailyReturns={mockDailyReturns} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Factor Exposure (Fama-French)</CardTitle>
                        <CardDescription>Rolling beta coefficients against common market factors.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FactorExposureChart strategyReturns={mockDailyReturns} factorReturns={mockFactorReturns} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
