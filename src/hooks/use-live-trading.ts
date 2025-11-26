'use client';
import { useState, useEffect, useCallback } from 'react';
import { LiveTradeSession, PlaybookTemplate, TradeDraft, CompletedTrade, ActiveTrade } from '@/lib/live-trading/types';
import { loadPlaybooks, loadDefaultInstrument } from '@/lib/live-trading/mock-data';
import * as storage from '@/lib/live-trading/storage';

export const useLiveTrading = () => {
  const [playbooks] = useState<PlaybookTemplate[]>(loadPlaybooks());
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
        entryPrice: 1.0567, // MOCK PRICE
        stopLoss: 1.0547, // MOCK PRICE
      },
      notes: '',
    };
    
    storage.saveActiveTrade(newActiveTrade);
    setActiveTrade(newActiveTrade);
  }, [session, playbooks]);

  const handleFinalizeTrade = useCallback(() => {
    if (!activeTrade) return;
    
    const finalTrade: ActiveTrade = {
      ...activeTrade,
      params: {
        ...activeTrade.params,
        exitPrice: 1.0587 // MOCK PRICE
      }
    };
    // The modal will open, prefilled with this `finalTrade`
    // This is a placeholder for opening the modal.
    console.log("Finalizing trade:", finalTrade);
    // In a real app, you'd open the modal here.
    // For now, we simulate saving it directly.
    const completedTrade: CompletedTrade = {
        id: `trade_${Date.now()}`,
        draftId: finalTrade.id,
        playbookId: finalTrade.playbookId,
        instrument: finalTrade.params.instrument,
        side: finalTrade.params.side,
        size: finalTrade.params.size,
        entryTimestamp: finalTrade.startTime,
        exitTimestamp: new Date().toISOString(),
        entryPrice: finalTrade.params.entryPrice,
        exitPrice: finalTrade.params.exitPrice!,
        stopLoss: finalTrade.params.stopLoss,
        fees: 5.0,
        pnl: (finalTrade.params.exitPrice! - finalTrade.params.entryPrice) * finalTrade.params.size,
        rMultiple: 1.5,
        slippage: 0.00002,
        notes: "Trade finalized from live session.",
        tags: [],
        attachments: [],
        adherence: {},
    };
    storage.saveTrade(completedTrade);
    storage.clearActiveTrade();
    setActiveTrade(null);
    refreshBlotter();
  }, [activeTrade]);
  
  const handleSaveTrade = (trade: CompletedTrade) => {
    storage.clearActiveTrade();
    setActiveTrade(null);
    refreshDrafts();
    refreshBlotter();
  };

  const handleOpenDraft = (draft: TradeDraft) => {
    // This would open the modal pre-filled with draft data
    console.log("Opening draft in modal:", draft);
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
