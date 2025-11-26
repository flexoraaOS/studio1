'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CompletedTrade } from '@/lib/live-trading/types';
import * as storage from '@/lib/live-trading/storage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TradeBlotterProps {
  blotterKey: number; // To force re-renders
  onClear: () => void;
}

export default function TradeBlotter({ blotterKey, onClear }: TradeBlotterProps) {
  const [trades, setTrades] = useState<CompletedTrade[]>([]);

  useEffect(() => {
    setTrades(storage.loadTrades());
  }, [blotterKey]);

  return (
    <Card className="bg-[#121213] border-white/10 flex-1 flex flex-col">
      <CardHeader className="p-3 border-b border-white/10">
        <CardTitle className="text-base font-semibold text-white">Today's Logged Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
         <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400 text-xs">Time</TableHead>
                  <TableHead className="text-gray-400 text-xs">Pair</TableHead>
                  <TableHead className="text-gray-400 text-xs text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.length > 0 ? trades.map(trade => (
                  <TableRow key={trade.id} className="border-white/10 hover:bg-white/5 cursor-pointer">
                    <TableCell className="text-xs py-2">{format(new Date(trade.exitTimestamp), 'HH:mm:ss')}</TableCell>
                    <TableCell className="font-semibold py-2 text-sm">{trade.instrument.symbol}</TableCell>
                    <TableCell className={cn("text-right font-semibold py-2 text-sm", trade.pnl >= 0 ? 'text-[#39FF88]' : 'text-[#FF3B47]')}>${trade.pnl.toFixed(2)}</TableCell>
                  </TableRow>
                )) : (
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                            No trades logged for today.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
       <CardFooter className="p-2 border-t border-white/10">
        <Button variant="destructive" size="sm" onClick={onClear} className="w-full bg-red-800/50 text-red-400 hover:bg-red-800/70">
            Clear Day's Trades
        </Button>
      </CardFooter>
    </Card>
  );
}
