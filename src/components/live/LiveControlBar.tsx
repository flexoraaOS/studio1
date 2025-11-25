// @/components/live/LiveControlBar.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Save } from 'lucide-react';
import { mockInstruments } from '@/lib/live-trading/mock-data';
import { PlaybookTemplate, LiveTradeSession } from '@/lib/live-trading/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface LiveControlBarProps {
  session: LiveTradeSession;
  onSessionChange: (update: Partial<LiveTradeSession>) => void;
  playbooks: PlaybookTemplate[];
  onPrepareTrade: () => void;
}

export default function LiveControlBar({ session, onSessionChange, playbooks, onPrepareTrade }: LiveControlBarProps) {
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onPrepareTrade();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrepareTrade]);

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#141415]/80 p-2 backdrop-blur-sm font-mono text-xs">
       <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-48">
              <Select value={session.playbookId} onValueChange={(val) => onSessionChange({ playbookId: val })}>
                <SelectTrigger className="bg-transparent border-white/10 rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playbooks.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select a playbook to load its rules and defaults.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
             <div className="w-32">
              <Select value={session.instrument} onValueChange={(val) => onSessionChange({ instrument: val })}>
                <SelectTrigger className="bg-transparent border-white/10 rounded-sm">
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
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select the instrument to trade.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => onSessionChange({ side: 'Long' })}
          className={cn(
            "rounded-r-none h-9 px-3 hover:bg-green-500/40",
            session.side === 'Long' ? 'bg-green-500/30 text-green-300' : 'bg-white/5 text-gray-400'
          )}>
            Long
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => onSessionChange({ side: 'Short' })}
          className={cn(
            "rounded-l-none h-9 px-3 hover:bg-red-500/40",
            session.side === 'Short' ? 'bg-red-500/30 text-red-300' : 'bg-white/5 text-gray-400'
          )}>
            Short
        </Button>
      </div>

      <Input 
        type="number" 
        placeholder="Size" 
        value={session.size}
        onChange={(e) => onSessionChange({ size: parseFloat(e.target.value) || 0 })}
        className="w-24 bg-transparent border-white/10 rounded-sm" 
      />
      <Input 
        type="number" 
        placeholder="Risk %"
        value={session.riskPercent}
        onChange={(e) => onSessionChange({ riskPercent: parseFloat(e.target.value) || 0 })} 
        className="w-20 bg-transparent border-white/10 rounded-sm" 
      />

      <Button 
        variant="ghost" 
        className="bg-[#FFAA55]/20 text-[#FFAA55] hover:bg-[#FFAA55]/30 h-9"
        onClick={onPrepareTrade}
      >
        <Sparkles className="mr-2 h-4 w-4" /> Prepare Trade
      </Button>

      <div className="ml-auto text-xs text-gray-500">
        This cockpit records Drafts for manual quick-entry. Live market feeds are disabled.
      </div>
    </div>
  );
}
