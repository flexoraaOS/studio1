// components/live/TradeBlotter.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Archive, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompletedTrade } from '@/lib/live-trading/types';

interface TradeBlotterProps {
    trades: CompletedTrade[];
    onLogNew: () => void;
}

export default function TradeBlotter({ trades, onLogNew }: TradeBlotterProps) {
    const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const handleSaveDay = () => {
        // In a real app, this would trigger an API call to finalize the day's trades.
        // For now, it can just show an alert or toast.
        alert(`${trades.length} trades saved for the day.`);
    };

    return (
        <Card className="flex-1 flex flex-col bg-transparent border-white/10 rounded-sm overflow-hidden">
            <CardHeader className="p-3 border-b border-white/10 flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-sm font-semibold">Today's Blotter</CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        {trades.length} trades logged
                    </CardDescription>
                </div>
                 <Button onClick={onLogNew} variant="ghost" size="sm" className="h-7 text-xs bg-[#FF3B47]/20 text-[#FF3B47] hover:bg-[#FF3B47]/30">
                    <PlusCircle className="mr-1 h-3 w-3"/>
                    Log Manual Trade
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-grow">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-xs">Time</TableHead>
                                <TableHead className="text-xs">Pair</TableHead>
                                <TableHead className="text-xs">Side</TableHead>
                                <TableHead className="text-xs text-right">Result (₹)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trades.length > 0 ? trades.map((trade) => (
                                <TableRow key={trade.id} className="border-white/10 hover:bg-white/5 cursor-pointer">
                                    <TableCell className="py-2 px-3 text-xs">{formatTime(trade.entryTimestamp)}</TableCell>
                                    <TableCell className="py-2 px-3 text-xs font-semibold">{trade.instrument}</TableCell>
                                    <TableCell className={cn("py-2 px-3 text-xs font-bold", trade.side === 'Long' ? 'text-green-400' : 'text-red-400')}>{trade.side}</TableCell>
                                    <TableCell className={cn("py-2 px-3 text-xs text-right font-semibold", trade.pnl >= 0 ? 'text-green-400' : 'text-red-400')}>
                                        {trade.pnl.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={4} className="h-24 text-center text-xs text-gray-500">
                                        No trades logged today.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <CardFooter className="p-2 border-t border-white/10">
                    <Button onClick={handleSaveDay} variant="outline" className="w-full h-8 text-xs border-white/20">
                        <Archive className="mr-2 h-3 w-3" />
                        Save Day's Trades
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>
    );
}
