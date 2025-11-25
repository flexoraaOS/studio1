'use client';
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateHistoricalVaR, calculateParametricVaR } from '@/lib/statistics';
import { DailyReturn } from '@/lib/types';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VarCvarPanelProps {
    dailyReturns: DailyReturn[];
}

type VarMethod = 'historical' | 'parametric';

export default function VarCvarPanel({ dailyReturns }: VarCvarPanelProps) {
    const [confidence, setConfidence] = useState(0.95);
    const [horizon, setHorizon] = useState(10);
    const [method, setMethod] = useState<VarMethod>('historical');

    const returns = useMemo(() => dailyReturns.map(d => d.return), [dailyReturns]);

    const { var: varValue, cvar } = useMemo(() => {
        if (returns.length === 0) return { var: 0, cvar: 0 };
        if (method === 'historical') {
            return calculateHistoricalVaR(returns, confidence, horizon);
        } else {
            return calculateParametricVaR(returns, confidence, horizon);
        }
    }, [returns, confidence, horizon, method]);

    const formatCurrency = (value: number) => `₹${Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>Value-at-Risk (VaR) & CVaR</CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                    VaR estimates the maximum potential loss over a given time horizon at a specific confidence level. CVaR (or Expected Shortfall) is the expected loss if that VaR threshold is crossed.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardDescription>Estimate potential portfolio losses.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label>Confidence Level</Label>
                        <Select value={String(confidence)} onValueChange={(val) => setConfidence(Number(val))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0.90">90%</SelectItem>
                                <SelectItem value="0.95">95%</SelectItem>
                                <SelectItem value="0.99">99%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="horizon">Horizon (Days)</Label>
                        <Input id="horizon" type="number" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} min="1" />
                    </div>
                </div>
                <div className="mb-4">
                    <Label>Method</Label>
                    <Select value={method} onValueChange={(val: VarMethod) => setMethod(val)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="historical">Historical Simulation</SelectItem>
                            <SelectItem value="parametric">Parametric (Variance-Covariance)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Metric</TableHead>
                            <TableHead className="text-right">Estimated Loss</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>VaR ({confidence * 100}%)</TableCell>
                            <TableCell className="text-right font-mono text-red-500">{formatCurrency(varValue)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>CVaR ({confidence * 100}%)</TableCell>
                            <TableCell className="text-right font-mono text-red-500">{formatCurrency(cvar)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
