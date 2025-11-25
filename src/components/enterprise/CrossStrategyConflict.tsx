// components/enterprise/CrossStrategyConflict.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { StrategyCorrelation } from '@/lib/enterprise/types';
import { mockStrategyCorrelations } from '@/lib/enterprise/mock-data';
import { cn } from '@/lib/utils';

const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.7) return 'bg-green-700';
    if (correlation > 0.3) return 'bg-green-600/70';
    if (correlation < -0.7) return 'bg-red-700';
    if (correlation < -0.3) return 'bg-red-600/70';
    return 'bg-muted';
};

/**
 * CrossStrategyConflict Component
 * @description Displays a correlation matrix to identify conflicting or overlapping strategies.
 */
export default function CrossStrategyConflict() {
    const strategies = [...new Set(mockStrategyCorrelations.flatMap(c => [c.strategyA, c.strategyB]))];
    
    const correlationMap = new Map<string, number>();
    mockStrategyCorrelations.forEach(c => {
        correlationMap.set(`${c.strategyA}-${c.strategyB}`, c.correlation);
        correlationMap.set(`${c.strategyB}-${c.strategyA}`, c.correlation);
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cross-Strategy Correlation</CardTitle>
                <CardDescription>Identify overlapping or conflicting strategies.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="p-2 border bg-muted w-1/4"></th>
                                {strategies.map(s => <th key={s} className="p-2 border bg-muted font-normal text-center">{s}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {strategies.map(rowStrategy => (
                                <tr key={rowStrategy}>
                                    <td className="p-2 border bg-muted font-medium">{rowStrategy}</td>
                                    {strategies.map(colStrategy => {
                                        if (rowStrategy === colStrategy) {
                                            return <td key={colStrategy} className="p-2 border bg-muted-foreground/30 text-center">1.00</td>;
                                        }
                                        const correlation = correlationMap.get(`${rowStrategy}-${colStrategy}`) ?? 0;
                                        return (
                                            <td key={colStrategy} className="p-0 border text-center">
                                                 <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className={cn("p-2 cursor-pointer h-full", getCorrelationColor(correlation))}>
                                                                {correlation.toFixed(2)}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Correlation between {rowStrategy} and {colStrategy}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                 </TooltipProvider>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
