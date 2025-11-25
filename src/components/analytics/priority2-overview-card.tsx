'use client';
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { calculateParametricVaR, calculateRollingSharpe } from '@/lib/statistics';
import { DailyReturn, MonteCarloSimulation } from '@/lib/types';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface Priority2OverviewCardProps {
    dailyReturns: DailyReturn[];
    simulations: MonteCarloSimulation[];
}

export default function Priority2OverviewCard({ dailyReturns, simulations }: Priority2OverviewCardProps) {
    
    const overviewData = useMemo(() => {
        if (!dailyReturns || dailyReturns.length === 0) {
            return { latestSharpe: 0, var95: 0, medianOutcome: 0, initialEquity: 0 };
        }
        const last30DayReturns = dailyReturns.slice(-30);
        const rollingSharpe = calculateRollingSharpe(dailyReturns, 30);
        const latestSharpe = rollingSharpe[rollingSharpe.length - 1]?.sharpe;

        const { var: var95 } = calculateParametricVaR(last30DayReturns.map(r => r.return), 0.95, 1);

        const lastSimulationDay = simulations.length > 0 ? simulations[0].length - 1 : 0;
        const finalValues = simulations.map(sim => sim[lastSimulationDay]);
        const medianOutcome = finalValues.sort((a,b) => a-b)[Math.floor(finalValues.length / 2)];
        const initialEquity = simulations.length > 0 ? simulations[0][0] : 0;
        
        return {
            latestSharpe,
            var95,
            medianOutcome,
            initialEquity
        };
    }, [dailyReturns, simulations]);

    const formatCurrency = (value: number) => {
        if (Math.abs(value) >= 1_000_000) {
            return `₹${(value / 1_000_000).toFixed(2)}M`;
        }
        if (Math.abs(value) >= 1_000) {
            return `₹${(value / 1_000).toFixed(1)}k`;
        }
        return `₹${value.toFixed(2)}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Advanced Analytics Overview</CardTitle>
                <CardDescription>Snapshot of key risk and performance projections.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow className="border-none">
                            <TableCell className="font-semibold p-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-blue-500 w-5 h-5"/>
                                    <span>30-Day Rolling Sharpe</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right p-2 text-lg font-mono">{overviewData.latestSharpe?.toFixed(2) ?? 'N/A'}</TableCell>
                            
                            <TableCell className="font-semibold p-2">
                                <div className="flex items-center gap-2">
                                     <AlertTriangle className="text-orange-500 w-5 h-5" />
                                    <span>1-Day VaR (95%)</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right p-2 text-lg font-mono">{formatCurrency(overviewData.var95)}</TableCell>

                            <TableCell className="font-semibold p-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-green-500 w-5 h-5"/>
                                    <span>MC Median Outcome (1yr)</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right p-2 text-lg font-mono">
                                {formatCurrency(overviewData.medianOutcome)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
