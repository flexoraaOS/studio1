'use client';
import { useState, useEffect, useCallback } from 'react';
import { LiveTradeSession, PlaybookTemplate, TradeDraft, CompletedTrade, ActiveTrade } from '@/lib/live-trading/types';
import { loadPlaybooks, loadDefaultInstrument } from '@/lib/live-trading/mock-data';
import * as storage from '@/lib/live-trading/storage';
import { usePostTradeModal } from '@/components/live/PostTradeModal';

export const useLiveTrading = () => {
  const [playbooks] = useState<PlaybookTemplate[]>(loadPlaybooks());
  const { openModal } = usePostTradeModal();

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
  
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [drafts, setDrafts] = useState<TradeDraft[]>([]);
  const [blotterKey, setBlotterKey] = useState(Date.now());

  useEffect(() => {
    setDrafts(storage.loadDrafts());
    setActiveTrade(storage.loadActiveTrade());
  }, []);

  const refreshBlotter = () => setBlotterKey(Date.now());
  const refreshDrafts = () => setDrafts(storage.loadDrafts());

  const handlePrepareTrade = useCallback(() => {
    if (!session.instrument || !session.playbookId) return;

    // This now creates an ActiveTrade instead of a draft
    const newActiveTrade: ActiveTrade = {
      id: `live_${Date.now()}`,
      startTime: new Date().toISOString(),
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
    
    storage.saveActiveTrade(newActiveTrade);
    setActiveTrade(newActiveTrade);
  }, [session, playbooks]);
  
  const handleFinalizeTrade = useCallback((activeTradeForModal: ActiveTrade) => {
    openModal({ 
      mode: 'finalize',
      activeTrade: activeTradeForModal
    });
  }, [openModal]);
  
  const handleSaveTrade = (trade: CompletedTrade) => {
    storage.clearActiveTrade();
    setActiveTrade(null);
    if (trade.draftId && trade.draftId.startsWith('draft_')) {
      storage.deleteDraft(trade.draftId);
    }
    refreshDrafts();
    refreshBlotter();
  };

  const handleOpenDraft = (draft: TradeDraft) => {
    openModal({
      mode: 'finalize',
      draft: draft,
    });
  };
  
  const handleClearBlotter = () => {
    storage.clearTrades();
    refreshBlotter();
  }

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
    handleClearBlotter,
  };
};
