// @/app/(app)/live-trades/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { PlaybookTemplate, LiveTradeSession, TradeDraft } from '@/lib/live-trading/types';
import { mockPlaybookTemplates } from '@/lib/live-trading/mock-data';
import { getDrafts, saveDraft, deleteDraft, getTrades, saveTrade, clearAll } from '@/lib/live-trading/storage';
import { Trade } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, Edit, Copy, BookOpen, ListChecks, FileSliders, BrainCircuit, Rocket, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AddTradeSheet from '@/components/trades/add-trade-sheet';

import StrategySelect from '@/components/live/StrategySelect';
import RulesList from '@/components/live/RulesList';
import ChecklistPanel from '@/components/live/ChecklistPanel';

/**
 * =================================================================
 * Live Trading Workspace Page
 * =================================================================
 * This page serves as a daily workspace for logging trades.
 * It combines pre-trade playbook review on the left with a live
 * trade blotter on the right.
 */
export default function LiveTradingPage() {
  const [todaysTrades, setTodaysTrades] = useState<Trade[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookTemplate | null>(mockPlaybookTemplates[0] || null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reset checklist when playbook changes
    const newChecklistState: Record<string, boolean> = {};
    if (selectedPlaybook) {
      selectedPlaybook.checklist.forEach(item => {
          newChecklistState[item.id] = false;
      });
    }
    setChecklistState(newChecklistState);
  }, [selectedPlaybook]);


  const handleChecklistChange = (itemId: string, isChecked: boolean) => {
    setChecklistState(prev => ({...prev, [itemId]: isChecked}));
  };

  // Callback to add a newly logged trade to the list for today
  // This would be passed to the AddTradeSheet in a real implementation
  const handleLogTrade = (newTrade: Trade) => {
    setTodaysTrades(prev => [newTrade, ...prev]);
  };

  return (
    <div className="container mx-auto max-w-7xl p-0 sm:p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight font-headline text-gradient">Live Trading Workspace</h1>
        <p className="text-sm text-muted-foreground">Log your trades as they happen and review your playbook in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- LEFT COLUMN: Pre-Trade --- */}
        <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BrainCircuit className="w-5 h-5 text-primary"/>
                1. Select Strategy
              </CardTitle>
              <CardDescription>Choose your playbook to load rules and checklists.</CardDescription>
            </CardHeader>
            <CardContent>
                <StrategySelect 
                    playbooks={mockPlaybookTemplates}
                    selectedPlaybookId={selectedPlaybook?.id}
                    onSelectPlaybook={(id) => setSelectedPlaybook(mockPlaybookTemplates.find(p => p.id === id) || null)}
                />
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-primary"/>
                  2. Playbook Rules
                </CardTitle>
                <CardDescription className="text-sm">Mandatory conditions for this playbook.</CardDescription>
             </CardHeader>
             <CardContent>
                {selectedPlaybook ? (
                    <RulesList rules={selectedPlaybook.rules} />
                ) : (
                    <div className="p-4 rounded-lg h-32 flex items-center justify-center bg-background/50">
                        <p className="text-muted-foreground text-sm">Select a playbook to see its rules.</p>
                    </div>
                )}
             </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="w-5 h-5 text-primary"/>
                  3. Pre-Flight Checklist
                </CardTitle>
                <CardDescription className="text-sm">Confirm your personal and market checks.</CardDescription>
             </CardHeader>
             <CardContent>
                 {selectedPlaybook ? (
                    <ChecklistPanel 
                        items={selectedPlaybook.checklist}
                        checklistState={checklistState}
                        onChecklistChange={handleChecklistChange}
                    />
                 ) : (
                    <div className="p-4 rounded-lg h-40 flex items-center justify-center bg-background/50">
                        <p className="text-muted-foreground text-sm">Select a playbook to see its checklist.</p>
                    </div>
                 )}
             </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: Trade Logging --- */}
        <div className="w-full space-y-6 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSliders className="w-5 h-5 text-primary"/>
                Today's Trade Blotter
              </CardTitle>
              <CardDescription>Log your trades for the day here.</CardDescription>
            </CardHeader>
            <CardContent>
                <AddTradeSheet>
                    <Button className="w-full" size="lg" useAnimation>
                        <PlusCircle className="mr-2"/> Log New Trade
                    </Button>
                </AddTradeSheet>

                <Separator className="my-6" />

                <h3 className="text-md font-semibold mb-4">Logged Trades ({todaysTrades.length})</h3>
                <ScrollArea className="h-64">
                    <div className="space-y-3 pr-4">
                        {todaysTrades.length > 0 ? todaysTrades.map(trade => (
                            <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm">
                                <div>
                                    <span className="font-bold">{trade.symbol}</span>
                                    <span className={`ml-2 font-semibold ${trade.direction === 'Long' ? 'text-green-500' : 'text-red-500'}`}>{trade.direction}</span>
                                </div>
                                <div className={`font-semibold ${trade.realizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.realizedPnl.toFixed(2)}
                                </div>
                            </div>
                        )) : (
                            <div className="flex items-center justify-center h-full min-h-[100px]">
                                <p className="text-muted-foreground text-sm">No trades logged for today.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" variant="outline" disabled>
                    <Save className="mr-2" /> Save Day's Trades
                </Button>
            </CardFooter>
          </Card>
        </div>

      </div>

    </div>
  );
}
