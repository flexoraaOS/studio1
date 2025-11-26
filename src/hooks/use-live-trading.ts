'use client';
import { useState, useEffect, useCallback } from 'react';
import { LiveTradeSession, PlaybookTemplate, TradeDraft, CompletedTrade } from '@/lib/live-trading/types';
import { loadPlaybooks, loadDefaultInstrument } from '@/lib/live-trading/mock-data';
import * as storage from '@/lib/live-trading/storage';
import { usePostTradeModal } from '@/components/live/PostTradeModal';
import { useToast } from '@/hooks/use-toast';

export const useLiveTrading = () => {
  const [playbooks] = useState<PlaybookTemplate[]>(loadPlaybooks());
  const { modalState, openModal, closeModal } = usePostTradeModal();
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
  const [blotterKey, setBlotterKey] = useState(Date.now());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'e') {
            e.preventDefault();
            handleLogTrade();
        }
         if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const instrumentTrigger = document.querySelector('[data-testid="instrument-select-trigger"]');
            if (instrumentTrigger instanceof HTMLElement) {
                instrumentTrigger.focus();
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session, playbooks]);


  const refreshBlotter = () => setBlotterKey(Date.now());
  
  const handleLogTrade = useCallback((activeDraft?: TradeDraft | null) => {
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
    storage.saveTrade(trade);
    setActiveTrade(null);
    refreshBlotter();
    toast({
      title: "Trade Logged",
      description: `${trade.instrument.symbol} ${trade.side} has been saved.`
    });
  };

  const handleClearBlotter = () => {
    storage.clearTrades();
    refreshBlotter();
  };

  return {
    session,
    setSession,
    playbooks,
    activeTrade,
    blotterKey,
    handleLogTrade,
    handleSaveTrade,
    handleClearBlotter,
    modalState,
    openModal,
    closeModal,
  };
};
