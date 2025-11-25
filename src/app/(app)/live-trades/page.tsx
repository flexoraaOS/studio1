
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

  useEffect(() => {
    // Load existing drafts from local storage on component mount
    setDrafts(getDrafts());
  }, []);

  const handleCreateNewDraft = () => {
    const newDraft: TradeDraft = {
      id: `draft_${Date.now()}`,
      createdAt: new Date().toISOString(),
      // Default empty values, to be filled by user
      playbookId: '',
      params: {
          instrument: '',
          side: 'Long',
          size: 0,
          riskPercent: 1,
      },
      checklistState: {},
      notes: '',
    };
    saveDraft(newDraft);
    setDrafts(getDrafts());
    // TODO: Set this new draft as the active one to be edited
  };
  
  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    setDrafts(getDrafts());
  }

  return (
    <div className="container mx-auto max-w-7xl p-0 sm:p-4">
      {/* 7. Use a cleaner header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Live Trading Workspace</h1>
        <p className="text-muted-foreground">Pre-trade checks → Execute → Post-trade upload</p>
      </div>

      {/* 2. Use a 2-column or modular terminal layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- LEFT COLUMN: Pre-Trade --- */}
        <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary"/>
                1. Select Strategy
              </CardTitle>
              <CardDescription>Choose your playbook to load rules and checklists.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* TODO: Placeholder for StrategySelect component */}
                <div className="p-4 rounded-lg h-24 flex items-center justify-center bg-background/50">
                    <p className="text-muted-foreground text-sm">StrategySelect Component</p>
                </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary"/>
                  2. Playbook Rules
                </CardTitle>
                <CardDescription>Mandatory conditions for this playbook.</CardDescription>
             </CardHeader>
             <CardContent>
                {/* 3. Convert "Rules" + "Checklist" into collapsible panels */}
                {/* TODO: Placeholder for RulesList component (as Accordion) */}
                 <div className="p-4 rounded-lg h-32 flex items-center justify-center bg-background/50">
                    <p className="text-muted-foreground text-sm">RulesList Accordion Component</p>
                </div>
             </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-primary"/>
                  3. Pre-Flight Checklist
                </CardTitle>
                <CardDescription>Confirm your personal and market checks.</CardDescription>
             </CardHeader>
             <CardContent>
                 {/* TODO: Placeholder for ChecklistPanel component (as Accordion) */}
                 <div className="p-4 rounded-lg h-40 flex items-center justify-center bg-background/50">
                    <p className="text-muted-foreground text-sm">ChecklistPanel Component</p>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: Trade Execution --- */}
        <div className="w-full space-y-6 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
          
          {/* 8. Replace the “3. Go Live” card with a pro CTA */}
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
          
           {/* 9. Move Post-Trade Review into a modal */}
           {/* The upload form and review panels will now be triggered from a modal, not shown directly on the page. */}
        </div>

      </div>

      <Separator className="my-8" />

      {/* Drafts Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Drafts</h2>
         <Card>
            <CardContent className="p-4">
                <ScrollArea className="h-48">
                    <div className="space-y-2">
                        {drafts.length > 0 ? drafts.map(draft => (
                            <div key={draft.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                <div>
                                    <p className="font-semibold">{draft.params.instrument || 'Untitled Draft'}</p>
                                    <p className="text-sm text-muted-foreground">
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
