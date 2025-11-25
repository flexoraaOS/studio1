
'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ExpectancyData } from '@/lib/types';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ExpectancyTableProps {
    data: ExpectancyData[];
}

const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
}

export default function ExpectancyTable({ data }: ExpectancyTableProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>Expectancy & Edge Decomposition</CardTitle>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                    Expectancy = (Win % × Avg Win) − (Loss % × Avg Loss). It shows the average amount you can expect to win or lose per trade.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardDescription>Average P&L per trade, broken down by strategy.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Strategy</TableHead>
                            <TableHead className="text-right">Expectancy</TableHead>
                            <TableHead className="text-right">Win Rate</TableHead>
                            <TableHead className="text-right">Avg. Win</TableHead>
                            <TableHead className="text-right">Loss Rate</TableHead>
                            <TableHead className="text-right">Avg. Loss</TableHead>
                            <TableHead className="text-right">Trade Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.strategy}>
                                <TableCell className="font-medium">{row.strategy}</TableCell>
                                <TableCell className={cn("text-right font-semibold", row.expectancy > 0 ? 'text-green-500' : 'text-red-500')}>
                                    {formatCurrency(row.expectancy)}
                                </TableCell>
                                <TableCell className="text-right">{formatPercentage(row.winRate)}</TableCell>
                                <TableCell className="text-right text-green-500">{formatCurrency(row.avgWin)}</TableCell>
                                <TableCell className="text-right">{formatPercentage(row.lossRate)}</TableCell>
                                <TableCell className="text-right text-red-500">{formatCurrency(row.avgLoss)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="secondary">{row.tradeCount}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
