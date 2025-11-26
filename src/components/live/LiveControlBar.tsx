'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LiveTradeSession, PlaybookTemplate, TradeSide, Instrument, ActiveTrade } from '@/lib/live-trading/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Square, ChevronsUpDown, Check } from 'lucide-react';
import InstrumentSelect from './InstrumentSelect';
import { cn } from '@/lib/utils';
import LiveTimer from './LiveTimer';


interface LiveControlBarProps {
  session: LiveTradeSession;
  onSessionChange: (session: LiveTradeSession) => void;
  playbooks: PlaybookTemplate[];
  onPrepareTrade: () => void;
  onFinalizeTrade: () => void;
  activeTrade: ActiveTrade | null;
}

export default function LiveControlBar({ session, onSessionChange, playbooks, onPrepareTrade, onFinalizeTrade, activeTrade }: LiveControlBarProps) {
  const handleSessionValueChange = <K extends keyof LiveTradeSession>(key: K, value: LiveTradeSession[K]) => {
    onSessionChange({ ...session, [key]: value });
  };
  
  const isTradeActive = !!activeTrade;

  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b border-white/10 bg-gradient-to-b from-[#1B0708] to-[#0B0B0C]">
      <TooltipProvider>
        <div className="flex items-center gap-3 w-full">
          {/* Strategy */}
          <Select
            value={session.playbookId}
            onValueChange={(val) => handleSessionValueChange('playbookId', val)}
            disabled={isTradeActive}
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
            disabled={isTradeActive}
          />

          {/* Side */}
          <div className="flex items-center rounded-sm border border-white/10 p-0.5">
            <Button
              size="sm"
              className={`h-8 px-4 rounded-sm transition-all ${session.side === 'Long' ? 'bg-[#39FF88]/90 text-black' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
              onClick={() => handleSessionValueChange('side', 'Long')}
              disabled={isTradeActive}
            >
              Long
            </Button>
            <Button
              size="sm"
              className={`h-8 px-4 rounded-sm transition-all ${session.side === 'Short' ? 'bg-[#FF3B47]/90 text-black' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
              onClick={() => handleSessionValueChange('side', 'Short')}
              disabled={isTradeActive}
            >
              Short
            </Button>
          </div>

          {/* Size & Risk */}
          <div className="flex items-center gap-1">
             <Input
                type="number"
                value={session.size}
                onChange={(e) => handleSessionValueChange('size', parseFloat(e.target.value))}
                className="w-28 bg-transparent border-white/10 rounded-sm"
                placeholder="Size"
                disabled={isTradeActive}
            />
            <Input
                type="number"
                value={session.riskPercent}
                onChange={(e) => handleSessionValueChange('riskPercent', parseFloat(e.target.value))}
                className="w-24 bg-transparent border-white/10 rounded-sm"
                placeholder="Risk %"
                disabled={isTradeActive}
            />
          </div>

          <div className="flex-grow" />

          {/* Live Timer */}
          {isTradeActive && activeTrade.startTime && <LiveTimer startTime={activeTrade.startTime} />}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn("bg-[#39FF88] text-black hover:bg-[#39FF88]/80 shadow-[0_0_15px_rgba(57,255,136,0.5)]", !isTradeActive && 'hidden')}
                  onClick={onFinalizeTrade}
                >
                  <Square className="w-4 h-4 mr-2"/>
                  End Trade
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#0F0F10] border-white/20 text-gray-200"><p>Finalize and log this trade (E)</p></TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn("bg-[#FF3B47] text-white hover:bg-[#FF3B47]/80 shadow-[0_0_15px_rgba(255,59,71,0.5)]", isTradeActive && 'hidden')}
                  onClick={onPrepareTrade}
                >
                  <Play className="w-4 h-4 mr-2"/>
                  Start Trade
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#0F0F10] border-white/20 text-gray-200"><p>Start a new live trade session (S)</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </header>
  );
}
