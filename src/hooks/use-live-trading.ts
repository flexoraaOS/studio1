'use client';
import { useState, useEffect, useCallback } from 'react';
import { LiveTradeSession, PlaybookTemplate, TradeDraft, CompletedTrade, ActiveTrade } from '@/lib/live-trading/types';
import { loadPlaybooks, loadDefaultInstrument } from '@/lib/live-trading/mock-data';
import * as storage from '@/lib/live-trading/storage';
import { usePostTradeModal } from '@/components/live/PostTradeModal';
import { useToast } from '@/hooks/use-toast';

export const useLiveTrading = () => {
  const [playbooks] = useState<PlaybookTemplate[]>(loadPlaybooks());
  const { openModal } = usePostTradeModal();
  const { toast } = useToast();

  const [session, setSession] = useState<LiveTradeSession>(() => {
    const defaultPlaybook = playbooks[0];
    return {
      playbookId: defaultPlaybook?.id || '',
      instrument: loadDefaultInstrument(),
      side: 'Long',
      size: 10000,
      riskPercent: 1,
    };
  });
  
  const [activeTrade, setActiveTrade] = useState<TradeDraft | null>(null);
  const [drafts, setDrafts] = useState<TradeDraft[]>([]);
  const [blotterKey, setBlotterKey] = useState(Date.now());

  useEffect(() => {
    setDrafts(storage.loadDrafts());
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 's') {
            e.preventDefault();
            handlePrepareTrade();
        }
        if (e.key.toLowerCase() === 'e') {
            e.preventDefault();
            handleFinalizeTrade();
        }
         if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            // This is a placeholder for focusing the instrument input.
            // A more robust solution might use a ref or a global state.
            const instrumentTrigger = document.querySelector('[data-testid="instrument-select-trigger"]');
            if (instrumentTrigger instanceof HTMLElement) {
                instrumentTrigger.focus();
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session, playbooks]); // Dependencies might need to be adjusted based on implementation details.


  const refreshBlotter = () => setBlotterKey(Date.now());
  const refreshDrafts = () => setDrafts(storage.loadDrafts());

  const handlePrepareTrade = useCallback(() => {
    if (!session.instrument || !session.playbookId) {
      toast({
        variant: 'destructive',
        title: "Cannot Prepare Trade",
        description: "Please select a playbook and an instrument first.",
      });
      return;
    };

    const newDraft: TradeDraft = {
      id: `draft_${Date.now()}`,
      playbookId: session.playbookId,
      playbookName: playbooks.find(p => p.id === session.playbookId)?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      params: {
        instrument: session.instrument,
        side: session.side,
        size: session.size,
        riskPercent: session.riskPercent,
        // Mock entry and stop-loss prices for demonstration
        entryPrice: 1.0567, 
        stopLoss: 1.0547,
      },
      notes: '',
    };
    
    storage.saveDraft(newDraft);
    refreshDrafts();
    setActiveTrade(newDraft); // Set as active context
    
    // Immediately open the modal to finalize
    openModal({ 
      mode: 'finalize',
      draft: newDraft
    });

  }, [session, playbooks, openModal, toast]);
  
  // This function now opens the modal for a manual entry (no pre-filled draft)
  const handleFinalizeTrade = useCallback((activeDraft?: TradeDraft | null) => {
    const draftToFinalize = activeDraft || {
      id: `draft_${Date.now()}`,
      playbookId: session.playbookId,
      playbookName: playbooks.find(p => p.id === session.playbookId)?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      params: { ...session },
      notes: ''
    };
    openModal({ 
      mode: 'finalize',
      draft: draftToFinalize
    });
  }, [openModal, session, playbooks]);
  
  const handleSaveTrade = (trade: CompletedTrade, draftId?: string) => {
    if (draftId) {
      storage.deleteDraft(draftId);
    }
    setActiveTrade(null); // Clear the active context
    refreshDrafts();
    refreshBlotter();
    toast({
      title: "Trade Logged",
      description: `${trade.instrument.symbol} ${trade.side} has been saved.`
    });
  };

  const handleOpenDraft = (draft: TradeDraft) => {
    setActiveTrade(draft); // Set as active context for the tape
    openModal({
      mode: 'finalize',
      draft: draft,
    });
  };

  const handleDeleteDraft = (draftId: string) => {
    storage.deleteDraft(draftId);
    refreshDrafts();
  };
  
  const handleCloneDraft = (draftId: string) => {
    const drafts = storage.loadDrafts();
    const draftToClone = drafts.find(d => d.id === draftId);
    if(draftToClone) {
        const newDraft = { ...draftToClone, id: `draft_${Date.now()}`};
        storage.saveDraft(newDraft);
        refreshDrafts();
    }
  }

  const handleClearBlotter = () => {
    storage.clearTrades();
    refreshBlotter();
  };

  return {
    session,
    setSession,
    playbooks,
    activeTrade,
    drafts,
    blotterKey,
    handlePrepareTrade,
    handleFinalizeTrade,
    handleSaveTrade,
    handleOpenDraft,
    handleDeleteDraft,
    handleCloneDraft,
    handleClearBlotter,
  };
};
