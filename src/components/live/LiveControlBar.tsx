'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LiveTradeSession, PlaybookTemplate, TradeSide, Instrument, TradeDraft } from '@/lib/live-trading/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Square } from 'lucide-react';
import InstrumentSelect from './InstrumentSelect';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

interface LiveControlBarProps {
  session: LiveTradeSession;
  onSessionChange: (session: LiveTradeSession) => void;
  playbooks: PlaybookTemplate[];
  onLogTrade: () => void;
  isTradeActive: boolean;
}

export default function LiveControlBar({ session, onSessionChange, playbooks, onLogTrade, isTradeActive }: LiveControlBarProps) {
  const handleSessionValueChange = <K extends keyof LiveTradeSession>(key: K, value: LiveTradeSession[K]) => {
    onSessionChange({ ...session, [key]: value });
  };
  
  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b border-white/10 bg-gradient-to-b from-[#1B0708] to-[#0B0B0C]">
      <TooltipProvider>
        <div className="flex items-center gap-3 w-full">
          {/* Strategy */}
          <Select
            value={session.playbookId}
            onValueChange={(val) => handleSessionValueChange('playbookId', val)}
          >
            <SelectTrigger className="w-[250px] bg-transparent border-white/10 rounded-sm">
              <SelectValue placeholder="Select a playbook..." />
            </SelectTrigger>
            <SelectContent className="bg-[#0F0F10] border-white/20 text-gray-200">
              {playbooks.map(pb => (
                <SelectItem key={pb.id} value={pb.id} className="focus:bg-white/10">{pb.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Instrument */}
           <InstrumentSelect
            value={session.instrument}
            onChange={(val) => handleSessionValueChange('instrument', val)}
          />

          {/* Side */}
          <div className="flex items-center rounded-sm border border-white/10 p-0.5">
            <Button
              size="sm"
              className={`h-8 px-4 rounded-sm transition-all ${session.side === 'Long' ? 'bg-[#39FF88]/90 text-black' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
              onClick={() => handleSessionValueChange('side', 'Long')}
            >
              Long
            </Button>
            <Button
              size="sm"
              className={`h-8 px-4 rounded-sm transition-all ${session.side === 'Short' ? 'bg-[#FF3B47]/90 text-black' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
              onClick={() => handleSessionValueChange('side', 'Short')}
            >
              Short
            </Button>
          </div>

          {/* Size */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Label htmlFor="size-input" className="text-xs text-gray-400">Size</Label>
                <Input
                    id="size-input"
                    type="number"
                    value={session.size}
                    onChange={(e) => handleSessionValueChange('size', parseFloat(e.target.value))}
                    className="w-28 bg-transparent border-white/10 rounded-sm"
                    placeholder="Size"
                />
            </div>
          </div>

          <div className="flex-grow" />

          {/* Actions */}
          <div className="flex items-center gap-2">
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className="bg-[#39FF88] text-black hover:bg-[#39FF88]/80 shadow-[0_0_15px_rgba(57,255,136,0.5)]"
                        onClick={onLogTrade}
                        data-testid="log-trade-button"
                    >
                        <Play className="w-4 h-4 mr-2"/>
                        Log Trade
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0F0F10] border-white/20 text-gray-200"><p>Log a new trade (E)</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </header>
  );
}
