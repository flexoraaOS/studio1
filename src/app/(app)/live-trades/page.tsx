
'use client';

import React, { useState, useEffect } from 'react';
import type { PlaybookTemplate, LiveTradeSession, TradeDraft } from '@/lib/live-trading/types';
import { mockPlaybookTemplates } from '@/lib/live-trading/mock-data';
import { getDrafts, saveDraft, deleteDraft, getTrades, saveTrade, clearAll } from '@/lib/live-trading/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Rocket, Edit, Copy } from 'lucide-react';

// TODO: Import components as they are created in subsequent steps
// import StrategySelect from '@/components/live/StrategySelect';
// import ChecklistPanel from '@/components/live/ChecklistPanel';
// import QuickParams from '@/components/live/QuickParams';
// import LivePreviewCard from '@/components/live/LivePreviewCard';
// import { UploadFormDialog } from '@/components/live/UploadForm';


/**
 * =================================================================
 * Live Trading Workspace Page
 * =================================================================
 * This page serves as the main entry point for the live trading workflow.
 * It will orchestrate the selection of strategies, completion of checklists,
 * management of live sessions, and initiation of post-trade uploads.
 *
 * This is a placeholder structure and will be filled out in subsequent steps.
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
    <div className="container mx-auto p-0 sm:p-4">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* --- LEFT COLUMN: Setup & Pre-Trade --- */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Pre-Trade Setup</CardTitle>
              <CardDescription>Select your strategy and complete your pre-flight checklist.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* TODO: Placeholder for StrategySelect component */}
                <div className="p-4 border-2 border-dashed rounded-lg h-32 flex items-center justify-center">
                    <p className="text-muted-foreground">StrategySelect Component</p>
                </div>
                {/* TODO: Placeholder for ChecklistPanel component */}
                <div className="p-4 border-2 border-dashed rounded-lg h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">ChecklistPanel Component</p>
                </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
              <CardDescription>Saved pre-trade snapshots.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-40">
                    <div className="space-y-2">
                        {drafts.length > 0 ? drafts.map(draft => (
                            <div key={draft.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <div>
                                    <p className="font-semibold text-sm">{draft.params.instrument || 'Untitled Draft'}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(draft.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7"><Copy className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteDraft(draft.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </div>
                            </div>
                        )) : (
                           <p className="text-sm text-muted-foreground text-center pt-4">No drafts saved.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleCreateNewDraft} variant="outline" className="w-full">
                    <PlusCircle className="mr-2"/> New Draft
                </Button>
            </CardFooter>
          </Card>

        </div>

        {/* --- MIDDLE COLUMN: Parameters & Live --- */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>2. Trade Parameters</CardTitle>
              <CardDescription>Configure your entry, risk, and targets.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* TODO: Placeholder for QuickParams component */}
                <div className="p-4 border-2 border-dashed rounded-lg h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">QuickParams Component</p>
                </div>
            </CardContent>
          </Card>
          
           <div className="sticky top-20 z-10">
               <Card className="bg-gradient-to-br from-primary/20 to-background border-primary/50">
                    <CardHeader>
                      <CardTitle>3. Go Live</CardTitle>
                      <CardDescription>Confirm your setup and start the live entry process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* TODO: Placeholder for LivePreviewCard component */}
                        <div className="p-4 border-2 border-dashed rounded-lg h-32 flex items-center justify-center">
                            <p className="text-muted-foreground">LivePreviewCard Component</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg" useAnimation>
                          <Rocket className="mr-2"/> Start Live Entry
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
        
        {/* --- RIGHT COLUMN: Rules & Review --- */}
        <div className="w-full lg:w-1/3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Playbook Rules</CardTitle>
                    <CardDescription>Rules for the selected playbook.</CardDescription>
                </CardHeader>
                <CardContent>
                     {/* TODO: Placeholder for RulesList component */}
                    <div className="p-4 border-2 border-dashed rounded-lg h-48 flex items-center justify-center">
                        <p className="text-muted-foreground">RulesList Component</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Post-Trade Review</CardTitle>
                    <CardDescription>Review results after uploading a trade.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* TODO: Placeholder for RuleResultsPanel component */}
                    <div className="p-4 border-2 border-dashed rounded-lg h-32 flex items-center justify-center">
                        <p className="text-muted-foreground">RuleResultsPanel Component</p>
                    </div>
                     {/* TODO: Placeholder for ReviewerPanel component */}
                     <div className="mt-4 p-4 border-2 border-dashed rounded-lg h-32 flex items-center justify-center">
                        <p className="text-muted-foreground">ReviewerPanel Component</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        
      </div>
    </div>
  );
}
