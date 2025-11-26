'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActiveTrade } from '@/lib/live-trading/types';
import { cn } from '@/lib/utils';
import { computePnL, computeRMultiple } from '@/lib/live-trading/trade-utils';
import { TrendingUp, TrendingDown, Crosshair, DollarSign } from 'lucide-react';
import LiveTimer from './LiveTimer';

interface LiveTapeProps {
  activeTrade: ActiveTrade | null;
}

const LiveTapeMetric: React.FC<{ label: string; value: string | React.ReactNode; color?: string; className?: string }> = ({ label, value, color, className }) => (
  <div className={`flex flex-col items-center justify-center p-4 border-r border-white/5 last:border-r-0 ${className}`}>
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-semibold font-mono ${color}`}>{value}</p>
  </div>
);

export default function LiveTape({ activeTrade }: LiveTapeProps) {
  const [mockExitPrice, setMockExitPrice] = useState(activeTrade?.params.entryPrice || 0);

  useEffect(() => {
    if (activeTrade) {
      setMockExitPrice(activeTrade.params.entryPrice);
      const interval = setInterval(() => {
        setMockExitPrice(prev => prev + (Math.random() - 0.5) * 0.0001);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTrade]);

  if (!activeTrade) {
    return (
      <Card className="bg-[#121213] border-white/10 flex-1 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <Crosshair className="mx-auto w-12 h-12 mb-2" />
          <p className="font-semibold">No Active Trade</p>
          <p className="text-sm">Click "Start Trade" to begin a session.</p>
        </div>
      </Card>
    );
  }

  const { entryPrice, stopLoss, side, size } = activeTrade.params;
  const pnl = computePnL(entryPrice, mockExitPrice, size, side);
  const rMultiple = computeRMultiple(entryPrice, mockExitPrice, stopLoss, side);

  const pnlColor = pnl >= 0 ? 'text-[#39FF88]' : 'text-[#FF3B47]';

  return (
    <Card className="bg-[#121213] border-white/10 flex-1 flex flex-col">
      <div className="grid grid-cols-5 flex-1">
        <LiveTapeMetric label="Entry Price" value={entryPrice.toFixed(5)} />
        <LiveTapeMetric label="Current Price" value={mockExitPrice.toFixed(5)} />
        <LiveTapeMetric label="Stop Loss" value={stopLoss.toFixed(5)} />
        <LiveTapeMetric label="R-Multiple" value={rMultiple.toFixed(2) + 'R'} color={pnlColor} />
        <LiveTapeMetric label="Live P&L" value={`$${pnl.toFixed(2)}`} color={pnlColor} />
      </div>
    </Card>
  );
}
