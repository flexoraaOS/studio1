
// components/live/TradeBlotter.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for today's trades
const mockTodaysTrades = [
  { time: '09:45:12', pair: 'EUR/USD', side: 'Long', size: 10000, result: 250.00 },
  { time: '10:15:34', pair: 'XAU/USD', side: 'Short', size: 5, result: -120.50 },
];

export default function TradeBlotter() {
    return (
        <Card className="flex-1 flex flex-col bg-transparent border-white/10 rounded-sm overflow-hidden">
            <CardHeader className="p-3 border-b border-white/10 flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">Today's Trade Blotter</CardTitle>
                 <Button variant="ghost" size="sm" className="h-7 text-xs bg-[#FF3B47]/20 text-[#FF3B47] hover:bg-[#FF3B47]/30">
                    <PlusCircle className="mr-1 h-3 w-3"/>
                    Log New
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-grow">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead className="text-xs">Time</TableHead>
                                <TableHead className="text-xs">Pair</TableHead>
                                <TableHead className="text-xs">Side</TableHead>
                                <TableHead className="text-xs text-right">Result</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTodaysTrades.length > 0 ? mockTodaysTrades.map((trade, index) => (
                                <TableRow key={index} className="border-white/10">
                                    <TableCell className="py-2 px-3 text-xs">{trade.time}</TableCell>
                                    <TableCell className="py-2 px-3 text-xs font-semibold">{trade.pair}</TableCell>
                                    <TableCell className={cn("py-2 px-3 text-xs font-bold", trade.side === 'Long' ? 'text-green-400' : 'text-red-400')}>{trade.side}</TableCell>
                                    <TableCell className={cn("py-2 px-3 text-xs text-right font-semibold", trade.result >= 0 ? 'text-green-400' : 'text-red-400')}>
                                        {trade.result.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-xs text-gray-500">
                                        No trades logged today.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <div className="p-2 border-t border-white/10">
                    <Button variant="outline" className="w-full h-8 text-xs border-white/20">
                        <Archive className="mr-2 h-3 w-3" />
                        Save Day's Trades
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
