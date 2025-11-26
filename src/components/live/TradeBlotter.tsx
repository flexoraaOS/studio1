'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Save } from 'lucide-react';
import { CompletedTrade } from '@/lib/live-trading/types';
import { loadTrades, clearTrades } from '@/lib/live-trading/storage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TradeBlotterProps {
  key: number; // To force re-renders
  onClear: () => void;
}

export default function TradeBlotter({ key, onClear }: TradeBlotterProps) {
  const [trades, setTrades] = useState<CompletedTrade[]>([]);

  useEffect(() => {
    setTrades(loadTrades());
  }, [key]);

  return (
    <Card className="bg-[#121213] border-white/10 flex-1 flex flex-col">
      <CardHeader className="p-3 border-b border-white/10">
        <CardTitle className="text-base font-semibold text-white">Today's Logged Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-400 text-xs">Time</TableHead>
              <TableHead className="text-gray-400 text-xs">Pair</TableHead>
              <TableHead className="text-gray-400 text-xs">Side</TableHead>
              <TableHead className="text-gray-400 text-xs text-right">Size</TableHead>
              <TableHead className="text-gray-400 text-xs text-right">R-Multiple</TableHead>
              <TableHead className="text-gray-400 text-xs text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.length > 0 ? trades.map(trade => (
              <TableRow key={trade.id} className="border-white/10">
                <TableCell className="text-xs py-2">{format(new Date(trade.exitTimestamp), 'HH:mm:ss')}</TableCell>
                <TableCell className="font-semibold py-2">{trade.instrument.symbol}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={trade.side === 'Long' ? 'default' : 'destructive'} className={`text-xs ${trade.side === 'Long' ? 'bg-[#39FF88]/20 text-[#39FF88] border-none' : 'bg-[#FF3B47]/20 text-[#FF3B47] border-none'}`}>
                    {trade.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-2">{trade.size.toLocaleString()}</TableCell>
                <TableCell className={cn("text-right font-semibold py-2", trade.rMultiple >= 0 ? 'text-[#39FF88]' : 'text-[#FF3B47]')}>{trade.rMultiple.toFixed(2)}R</TableCell>
                <TableCell className={cn("text-right font-semibold py-2", trade.pnl >= 0 ? 'text-[#39FF88]' : 'text-[#FF3B47]')}>${trade.pnl.toFixed(2)}</TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        No trades logged for today.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter className="p-2 border-t border-white/10">
        <Button variant="destructive" size="sm" onClick={onClear} className="w-full bg-red-800/50 text-red-400 hover:bg-red-800/70">
            Clear Day's Trades
        </Button>
      </CardFooter>
    </Card>
  );
}

