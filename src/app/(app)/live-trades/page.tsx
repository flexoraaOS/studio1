'use client';

import React, { useState, useEffect } from 'react';
import type { PlaybookTemplate, LiveTradeSession, TradeDraft } from '@/lib/live-trading/types';
import { mockPlaybookTemplates } from '@/lib/live-trading/mock-data';
import { getDrafts, saveDraft, deleteDraft, getTrades, saveTrade, clearAll } from '@/lib/live-trading/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Rocket, Edit, Copy, BookOpen, ListChecks, FileSliders, BrainCircuit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import StrategySelect from '@/components/live/StrategySelect';
import RulesList from '@/components/live/RulesList';
import ChecklistPanel from '@/components/live/ChecklistPanel';

/**
 * =================================================================
 * Live Trading Workspace Page
 * =================================================================
 * This page serves as the main entry point for the live trading workflow.
 * It orchestrates the selection of strategies, completion of checklists,
 * management of live sessions, and initiation of post-trade uploads.
 */
export default function LiveTradingPage() {
  const [drafts, setDrafts] = useState<TradeDraft[]>([]);
  const [activeSession, setActiveSession] = useState<LiveTradeSession | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookTemplate | null>(mockPlaybookTemplates[0] || null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load existing drafts from local storage on component mount
    setDrafts(getDrafts());
  }, []);

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

  const handleCreateNewDraft = () => {
    const newDraft: TradeDraft = {
      id: `draft_${Date.now()}`,
      createdAt: new Date().toISOString(),
      playbookId: selectedPlaybook?.id || '',
      params: {
          instrument: '',
          side: 'Long',
          size: 0,
          riskPercent: selectedPlaybook?.defaultParams.riskPercent || 1,
      },
      checklistState: {},
      notes: selectedPlaybook?.notesTemplate || '',
    };
    saveDraft(newDraft);
    setDrafts(getDrafts());
  };
  
  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    setDrafts(getDrafts());
  };

  const handleChecklistChange = (itemId: string, isChecked: boolean) => {
    setChecklistState(prev => ({...prev, [itemId]: isChecked}));
  };

  return (
    <div className="container mx-auto max-w-7xl p-0 sm:p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight font-headline text-gradient">Live Trading Workspace</h1>
        <p className="text-sm text-muted-foreground">Pre-trade checks → Execute → Post-trade upload</p>
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
                <CardDescription>Mandatory conditions for this playbook.</CardDescription>
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
                <CardDescription>Confirm your personal and market checks.</CardDescription>
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

        {/* --- RIGHT COLUMN: Trade Execution --- */}
        <div className="w-full space-y-6 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSliders className="w-5 h-5 text-primary"/>
                4. Trade Parameters
              </CardTitle>
              <CardDescription>Configure your entry, risk, and targets.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* TODO: Placeholder for QuickParams component */}
                <div className="p-4 rounded-lg h-64 flex items-center justify-center bg-background/50">
                    <p className="text-muted-foreground text-sm">QuickParams Component</p>
                </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">5. Go Live</h3>
               {/* TODO: Placeholder for LivePreviewCard component */}
              <div className="p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg h-24 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">LivePreviewCard Component (key stats)</p>
              </div>
              <Button className="w-full" size="lg" useAnimation>
                <Rocket className="mr-2"/> Start Live Entry
              </Button>
          </div>
          
        </div>

      </div>

      <Separator className="my-8" />

      {/* Drafts Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Drafts</h2>
         <Card>
            <CardContent className="p-4">
                <ScrollArea className="h-48">
                    <div className="space-y-2">
                        {drafts.length > 0 ? drafts.map(draft => (
                            <div key={draft.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                <div>
                                    <p className="font-semibold text-sm">{mockPlaybookTemplates.find(p => p.id === draft.playbookId)?.name || 'Untitled Draft'}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Saved: {new Date(draft.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8"><Copy className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteDraft(draft.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </div>
                            </div>
                        )) : (
                           <div className="flex items-center justify-center h-full min-h-[100px]">
                              <p className="text-muted-foreground">No drafts saved.</p>
                           </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
                 <Button onClick={handleCreateNewDraft} variant="outline" className="w-full">
                    <PlusCircle className="mr-2"/> New Draft
                </Button>
            </CardFooter>
          </Card>
      </div>

    </div>
  );
}
