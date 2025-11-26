'use client';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LiveControlBar from '@/components/live/LiveControlBar';
import PreTradePanel from '@/components/live/PreTradePanel';
import TradeBlotter from '@/components/live/TradeBlotter';
import { PostTradeModal } from '@/components/live/PostTradeModal';
import { useLiveTrading } from '@/hooks/use-live-trading';

export default function LiveTradingCockpitPage() {
  const {
    session,
    setSession,
    playbooks,
    activeTrade, // This is now a draft, but we keep the name for minimal refactoring where it represents the "active context"
    blotterKey,
    handlePrepareTrade,
    handleFinalizeTrade,
    handleSaveTrade,
    handleClearBlotter,
    modalState,
    openModal,
    closeModal,
  } = useLiveTrading();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#0B0B0C] text-gray-300 font-code">
        <LiveControlBar
          session={session}
          onSessionChange={setSession}
          playbooks={playbooks}
          onPrepareTrade={handlePrepareTrade}
          onFinalizeTrade={() => handleFinalizeTrade(activeTrade)}
          isTradeActive={!!activeTrade}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            <PreTradePanel
              playbookId={session.playbookId}
              playbooks={playbooks}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            <TradeBlotter blotterKey={blotterKey} onClear={handleClearBlotter} />
          </div>
        </div>

        <PostTradeModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          initialState={modalState}
          onSave={handleSaveTrade}
          playbooks={playbooks}
        />
      </div>
    </DndProvider>
  );
}
