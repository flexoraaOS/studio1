// components/enterprise/RiskMatrix.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { RiskMatrixData } from '@/lib/enterprise/types';
import { mockRiskMatrix } from '@/lib/enterprise/mock-data';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

const getCellColor = (expectancy: number, confidence: number) => {
    if (confidence < 0.6) return 'bg-gray-700/50'; // Low confidence
    
    if (expectancy > 100) return 'bg-green-700';
    if (expectancy > 50) return 'bg-green-600';
    if (expectancy > 0) return 'bg-green-500/80';
    if (expectancy < -100) return 'bg-red-700';
    if (expectancy < -50) return 'bg-red-600';
    return 'bg-red-500/80';
};

/**
 * RiskMatrix Component
 * @description Displays a matrix of trade expectancy by trade type and market regime.
 */
export default function RiskMatrix() {
    const tradeTypes = [...new Set(mockRiskMatrix.map(d => d.tradeType))];
    const marketRegimes = [...new Set(mockRiskMatrix.map(d => d.marketRegime))];

    const dataMap = new Map<string, RiskMatrixData>();
    mockRiskMatrix.forEach(d => {
        dataMap.set(`${d.tradeType}-${d.marketRegime}`, d);
    });

    const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <CardTitle>Risk Matrix</CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-4 h-4 text-muted-foreground"/></TooltipTrigger>
                            <TooltipContent>
                               <p className="max-w-xs">Shows your expectancy for different strategy types under various market conditions.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardDescription>Expectancy by Trade Type vs. Market Regime</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="p-2 border bg-muted font-normal text-left">Trade Type</th>
                                {marketRegimes.map(regime => (
                                    <th key={regime} className="p-2 border bg-muted font-normal text-center">{regime}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tradeTypes.map(type => (
                                <tr key={type}>
                                    <td className="p-2 border bg-muted font-medium">{type}</td>
                                    {marketRegimes.map(regime => {
                                        const cellData = dataMap.get(`${type}-${regime}`);
                                        if (!cellData) return <td key={regime} className="p-2 border"></td>;

                                        return (
                                            <td key={regime} className="p-0 border">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className={cn(
                                                                "h-full w-full p-2 text-center cursor-pointer",
                                                                getCellColor(cellData.expectancy, cellData.confidence)
                                                            )} style={{ opacity: Math.max(0.3, cellData.confidence) }}>
                                                                <div className="font-bold text-white drop-shadow-md">{formatCurrency(cellData.expectancy)}</div>
                                                                <div className="text-xs text-white/70">({cellData.tradeCount})</div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Expectancy: {formatCurrency(cellData.expectancy)}</p>
                                                            <p>Confidence: {(cellData.confidence * 100).toFixed(0)}%</p>
                                                            <p>Trades: {cellData.tradeCount}</p>
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
