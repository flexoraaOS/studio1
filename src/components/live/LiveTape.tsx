'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeDraft } from '@/lib/live-trading/types';
import { cn } from '@/lib/utils';
import { Crosshair } from 'lucide-react';

interface LiveTapeProps {
  activeTrade: TradeDraft | null; // This now receives a TradeDraft or null
}

const LiveTapeMetric: React.FC<{ label: string; value: string | React.ReactNode; color?: string; className?: string }> = ({ label, value, color, className }) => (
  <div className={`flex flex-col items-center justify-center p-4 border-r border-white/5 last:border-r-0 ${className}`}>
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-semibold font-mono ${color}`}>{value}</p>
  </div>
);

export default function LiveTape({ activeTrade: draft }: LiveTapeProps) {

  // No more live updates. This component is now a static display of draft parameters.
  if (!draft) {
    return (
      <Card className="bg-[#121213] border-white/10 flex-1 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <Crosshair className="mx-auto w-12 h-12 mb-2" />
          <p className="font-semibold">No Active Draft</p>
          <p className="text-sm">Click "Prepare Trade" to begin a draft.</p>
        </div>
      </Card>
    );
  }

  const { entryPrice = 0, stopLoss = 0, side } = draft.params;

  return (
    <Card className="bg-[#121213] border-white/10 flex-1 flex flex-col">
       <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-white/10">
            <h3 className="font-semibold text-lg">{draft.params.instrument.symbol}</h3>
            <Badge variant={side === 'Long' ? 'default' : 'destructive'} className={`text-sm ${side === 'Long' ? 'bg-[#39FF88]/20 text-[#39FF88] border-none' : 'bg-[#FF3B47]/20 text-[#FF3B47] border-none'}`}>
              {side}
            </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
          <LiveTapeMetric label="Suggested Entry" value={entryPrice > 0 ? entryPrice.toFixed(5) : 'N/A'} className="border-b md:border-b-0 md:border-r" />
          <LiveTapeMetric label="Suggested Stop" value={stopLoss > 0 ? stopLoss.toFixed(5) : 'N/A'} />
        </div>
         <div className="grid grid-cols-2 flex-1 border-t border-white/10">
            <LiveTapeMetric label="R-Multiple" value={'--'} className="border-r" />
            <LiveTapeMetric label="Live P&L" value={'$--.--'} />
        </div>
      </CardContent>
    </Card>
  );
}
