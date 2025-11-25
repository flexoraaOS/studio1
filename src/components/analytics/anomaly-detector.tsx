'use client';
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldAlert, BadgeAlert } from 'lucide-react';
import { Trade, Anomaly } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const ANOMALY_RULES = [
    {
        id: 'large-loss',
        description: 'Trade resulted in a significant loss ( > 5% of entry value).',
        severity: 'high',
        test: (trade: Trade) => trade.pnlPercent < -5,
        getValue: (trade: Trade) => `${trade.pnlPercent.toFixed(2)}% P&L`
    },
    {
        id: 'high-slippage',
        description: 'Slippage was unusually high.',
        severity: 'medium',
        test: (trade: Trade) => (trade.slippage ?? 0) > 1.0,
        getValue: (trade: Trade) => `₹${trade.slippage?.toFixed(2)} Slippage`
    },
    {
        id: 'short-duration',
        description: 'Trade was held for a very short period (< 2 minutes).',
        severity: 'low',
        test: (trade: Trade) => (trade.durationSeconds ?? Infinity) < 120,
        getValue: (trade: Trade) => `${trade.durationSeconds}s Duration`
    },
     {
        id: 'outsized-win',
        description: 'Trade resulted in an unusually large win (> 10%).',
        severity: 'low',
        test: (trade: Trade) => trade.pnlPercent > 10,
        getValue: (trade: Trade) => `${trade.pnlPercent.toFixed(2)}% P&L`
    },
];

const SEVERITY_CONFIG = {
    high: { icon: ShieldAlert, color: 'text-destructive', badge: 'destructive' },
    medium: { icon: AlertTriangle, color: 'text-yellow-500', badge: 'secondary' },
    low: { icon: BadgeAlert, color: 'text-blue-500', badge: 'outline' },
};

interface AnomalyDetectorProps {
    trades: Trade[];
}

export default function AnomalyDetector({ trades }: AnomalyDetectorProps) {
    const anomalies: Anomaly[] = useMemo(() => {
        const detected: Anomaly[] = [];
        trades.forEach(trade => {
            ANOMALY_RULES.forEach(rule => {
                if (rule.test(trade)) {
                    detected.push({
                        tradeId: trade.id,
                        symbol: trade.symbol,
                        reason: rule.description,
                        severity: rule.severity as 'high' | 'medium' | 'low',
                        value: rule.getValue(trade),
                    });
                }
            });
        });
        return detected.sort((a, b) => {
            const severityOrder = { high: 0, medium: 1, low: 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
    }, [trades]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Anomaly Detector</CardTitle>
                <CardDescription>Rule-based alerts for outlier trades.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[350px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Alert</TableHead>
                                <TableHead>Trade</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                         <TooltipProvider>
                        <TableBody>
                            {anomalies.length > 0 ? anomalies.map((anomaly, index) => {
                                const config = SEVERITY_CONFIG[anomaly.severity];
                                const Icon = config.icon;
                                return (
                                     <Tooltip key={`${anomaly.tradeId}-${index}`} delayDuration={100}>
                                        <TableRow>
                                            <TableCell>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={cn("w-4 h-4", config.color)} />
                                                        <Badge variant={config.badge as any}>{anomaly.severity}</Badge>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{anomaly.reason}</p>
                                                </TooltipContent>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{anomaly.symbol}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">{anomaly.value}</TableCell>
                                        </TableRow>
                                     </Tooltip>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No anomalies detected.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                         </TooltipProvider>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
