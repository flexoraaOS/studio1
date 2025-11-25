
// @/components/live/LiveControlBar.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, StopCircle, ChevronDown, Repeat } from 'lucide-react';
import { mockPlaybookTemplates, mockInstruments } from '@/lib/live-trading/mock-data';
import { cn } from '@/lib/utils';

export default function LiveControlBar() {
  const [isLive, setIsLive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#141415]/80 p-2 backdrop-blur-sm font-mono text-xs">
      <Select defaultValue={mockPlaybookTemplates[0].id}>
        <SelectTrigger className="w-48 bg-transparent border-white/10 rounded-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {mockPlaybookTemplates.map(p => (
            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="EUR/USD">
        <SelectTrigger className="w-32 bg-transparent border-white/10 rounded-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(mockInstruments).map(([type, symbols]) => (
            <div key={type}>
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">{type}</p>
              {symbols.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </div>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex items-center">
        <Button variant="ghost" className="rounded-r-none h-9 px-3 bg-green-500/20 text-green-400 hover:bg-green-500/30">Long</Button>
        <Button variant="ghost" className="rounded-l-none h-9 px-3 bg-red-500/20 text-red-400 hover:bg-red-500/30">Short</Button>
      </div>

      <Input type="number" placeholder="Size" className="w-24 bg-transparent border-white/10 rounded-sm" />
      <Input type="number" placeholder="Risk %" className="w-20 bg-transparent border-white/10 rounded-sm" />

      <Button 
        variant="ghost" 
        className="bg-[#FFAA55]/20 text-[#FFAA55] hover:bg-[#FFAA55]/30 h-9"
        onClick={() => setIsLive(true)}
        disabled={isLive}
      >
        <Play className="mr-2 h-4 w-4" /> Start Trade
      </Button>
      <Button 
        variant="ghost" 
        className="bg-[#FF3B47]/20 text-[#FF3B47] hover:bg-[#FF3B47]/30 h-9"
        onClick={() => setIsLive(false)}
        disabled={!isLive}
      >
        <StopCircle className="mr-2 h-4 w-4" /> End Trade
      </Button>

      {isLive && (
        <div className="ml-auto flex items-center gap-2 text-green-400">
          <Timer className="h-4 w-4" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      )}
    </div>
  );
}
