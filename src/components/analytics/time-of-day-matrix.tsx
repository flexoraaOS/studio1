
'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TimeOfDayData } from '@/lib/types';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeOfDayMatrixProps {
    data: TimeOfDayData[];
}

const getPnlColor = (pnl: number, maxPnl: number, minPnl: number) => {
    if (pnl > 0) {
        const intensity = Math.round((pnl / maxPnl) * 8) + 1; // 1-9
        return `bg-green-950/`  // This is a hack, should be bg-green-${intensity}00, but tailwind can't do that. Let's use opacity.
    }
    if (pnl < 0) {
        const intensity = Math.round((pnl / minPnl) * 8) + 1; // 1-9
        return `bg-red-950/`
    }
    return 'bg-muted';
};

const getWinRateColor = (winRate: number) => {
    const intensity = Math.round(winRate * 9); // 0-9
    if (intensity > 5) return 'text-green-400';
    if (intensity < 5) return 'text-red-400';
    return 'text-foreground';
}


export default function TimeOfDayMatrix({ data }: TimeOfDayMatrixProps) {
    const maxPnl = Math.max(...data.map(d => d.pnl), 0);
    const minPnl = Math.min(...data.map(d => d.pnl), 0);
    
    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <CardTitle>Time-of-Day & Session Advantage</CardTitle>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                    Heatmap showing average P&L by the hour of trade entry. Helps identify your most and least profitable trading times.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardDescription>P&L and Win Rate by hour of entry. All times in your local timezone.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-1">
                    <TooltipProvider>
                        {data.map(d => (
                             <Tooltip key={d.hour} delayDuration={100}>
                                <TooltipTrigger>
                                    <div className={cn(
                                        "w-12 h-16 rounded-md flex flex-col items-center justify-center text-center p-1",
                                        d.pnl > 0 ? `bg-green-800/` + Math.max(20, Math.round((d.pnl/maxPnl)*100)) : `bg-red-800/` + Math.max(20, Math.round((d.pnl/minPnl)*100))
                                    )}>
                                        <div className="text-xs text-foreground/80">{d.hour}:00</div>
                                        <div className={cn("text-sm font-bold", getWinRateColor(d.winRate))}>{(d.winRate * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-foreground/80">({d.tradeCount})</div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{d.hour}:00 - {d.hour+1}:00</p>
                                    <p>Avg P&L: <span className={d.pnl > 0 ? 'text-green-400' : 'text-red-400'}>₹{d.pnl.toFixed(2)}</span></p>
                                    <p>Win Rate: { (d.winRate * 100).toFixed(1) }%</p>
                                    <p>Trades: {d.tradeCount}</p>
                                </TooltipContent>
                             </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}
