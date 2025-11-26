// @/app/(app)/live-trades/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import LiveControlBar from '@/components/live/LiveControlBar';
import PreTradePanel from '@/components/live/PreTradePanel';
import TradeBlotter from '@/components/live/TradeBlotter';
import PostTradeModal from '@/components/live/PostTradeModal';
import { PlaybookTemplate, TradeDraft, CompletedTrade, LiveTradeSession } from '@/lib/live-trading/types';
import { loadPlaybooks } from '@/lib/live-trading/mock-data';
import { loadDrafts, saveDrafts, loadTrades, saveTrade } from '@/lib/live-trading/storage';

/**
 * =================================================================
 * Live Trading Cockpit
 * =================================================================
 * This page serves as the main hub for intraday trading, focusing
 * on a Draft -> Finalize workflow for rapid trade journaling.
 */
export default function LiveTradingCockpitPage() {
  const [playbooks] = useState<PlaybookTemplate[]>(loadPlaybooks());
  const [activeSession, setActiveSession] = useState<LiveTradeSession>({
    playbookId: playbooks[0]?.id || '',
    instrument: 'EUR/USD',
    side: 'Long',
    size: 10000,
    riskPercent: 1,
  });
  const [drafts, setDrafts] = useState<TradeDraft[]>([]);
  const [trades, setTrades] = useState<CompletedTrade[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState<TradeDraft | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setDrafts(loadDrafts());
    setTrades(loadTrades());
  }, []);

  const handleSessionChange = (update: Partial<LiveTradeSession>) => {
    setActiveSession(prev => ({ ...prev, ...update }));
  };
  
  const selectedPlaybook = playbooks.find(p => p.id === activeSession.playbookId);

  const handlePrepareTrade = useCallback(() => {
    if (!selectedPlaybook) return;

    const newDraft: TradeDraft = {
      id: `draft_${Date.now()}`,
      createdAt: new Date().toISOString(),
      playbookId: selectedPlaybook.id,
      playbookName: selectedPlaybook.name,
      params: {
        instrument: activeSession.instrument,
        side: activeSession.side,
        size: activeSession.size,
        riskPercent: activeSession.riskPercent,
      },
      notes: '', // Or a template from playbook
    };
    
    const updatedDrafts = [newDraft, ...drafts];
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
    
    setActiveDraft(newDraft);
    setIsModalOpen(true);
  }, [selectedPlaybook, activeSession, drafts]);

  const handleOpenDraft = (draft: TradeDraft) => {
    setActiveDraft(draft);
    setIsModalOpen(true);
  };
  
  const handleSaveTrade = (finalizedTrade: CompletedTrade) => {
    // Add to trades list
    const updatedTrades = [finalizedTrade, ...trades];
    setTrades(updatedTrades);
    saveTrade(finalizedTrade);

    // Remove the draft it came from
    if (finalizedTrade.draftId) {
      const updatedDrafts = drafts.filter(d => d.id !== finalizedTrade.draftId);
      setDrafts(updatedDrafts);
      saveDrafts(updatedDrafts);
    }
    
    setIsModalOpen(false);
    setActiveDraft(null);
  };

  return (
    <div className="flex h-full flex-col bg-[#0B0B0C] text-gray-300 font-code">
      
      <LiveControlBar
        session={activeSession}
        onSessionChange={handleSessionChange}
        playbooks={playbooks}
        onPrepareTrade={handlePrepareTrade}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-2 p-2 overflow-hidden">
        
        <div className="flex flex-col gap-2 overflow-y-auto">
          {selectedPlaybook && <PreTradePanel playbook={selectedPlaybook} onOpenDraft={handleOpenDraft} />}
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto">
          <TradeBlotter trades={trades} onLogNew={() => { setActiveDraft(null); setIsModalOpen(true); }} />
        </div>

      </div>

      {isModalOpen && selectedPlaybook && (
        <PostTradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          draft={activeDraft}
          playbook={selectedPlaybook}
          onSave={handleSaveTrade}
        />
      )}
    </div>
  );
}
