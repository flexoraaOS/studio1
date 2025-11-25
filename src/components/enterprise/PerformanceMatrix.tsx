// components/enterprise/PerformanceMatrix.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PerformanceMatrixData, Timeframe, PerformanceMetric } from '@/lib/enterprise/types';
import { mockPerformanceMatrix } from '@/lib/enterprise/mock-data';

function getMetricColor(value: number, metric: PerformanceMetric): string {
    if (metric === 'Win Rate' || metric === 'Profit Factor' || metric === 'Expectancy') {
        if (value > (metric === 'Win Rate' ? 0.6 : 2.0)) return 'text-green-400';
        if (value > (metric === 'Win Rate' ? 0.5 : 1.0)) return 'text-green-500';
        return 'text-red-500';
    }
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-foreground';
}

function formatMetric(value: number, metric: PerformanceMetric): string {
    if (metric === 'Return' || metric === 'Win Rate') {
        return `${value.toFixed(1)}%`;
    }
    if (metric === 'Expectancy') {
        return `₹${value.toFixed(2)}`;
    }
    return value.toFixed(2);
}

/**
 * PerformanceMatrix Component
 * @description Displays a grid of performance metrics across multiple timeframes.
 * @param {Object} props - Component properties.
 * @param {PerformanceMatrixData} [props.data=mockPerformanceMatrix] - The matrix data.
 */
export default function PerformanceMatrix({ data = mockPerformanceMatrix }: { data?: PerformanceMatrixData }) {
    const timeframes = Object.keys(data) as Timeframe[];
    const metrics = Object.keys(data.Intraday) as PerformanceMetric[];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Multi-Timeframe Performance Matrix</CardTitle>
                <CardDescription>Key metrics segmented by trading horizon.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Metric</TableHead>
                                {timeframes.map(tf => <TableHead key={tf} className="text-right">{tf}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.map(metric => (
                                <TableRow key={metric}>
                                    <TableCell className="font-medium">{metric}</TableCell>
                                    {timeframes.map(tf => {
                                        const value = data[tf][metric];
                                        return (
                                            <TableCell key={`${tf}-${metric}`} className="text-right">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className={`font-mono font-semibold cursor-pointer ${getMetricColor(value, metric)}`}>
                                                                {formatMetric(value, metric)}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Click to see trades</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
