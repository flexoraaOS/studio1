'use client';
import React, 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LiveControlBar from '@/components/live/LiveControlBar';
import PreTradePanel from '@/components/live/PreTradePanel';
import TradeBlotter from '@/components/live/TradeBlotter';
import { PostTradeModal, usePostTradeModal } from '@/components/live/PostTradeModal';
import { useLiveTrading } from '@/hooks/use-live-trading';
import LiveTape from '@/components/live/LiveTape';

export default function LiveTradingCockpitPage() {
  const {
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
  } = useLiveTrading();
  
  const { modalState, openModal, closeModal } = usePostTradeModal();

  const handleOpenFinalizeModal = (draft?: any) => {
    openModal({ 
      mode: draft ? 'finalize' : 'manual', 
      draft: draft || undefined
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#0B0B0C] text-gray-300 font-code">
        <LiveControlBar
          session={session}
          onSessionChange={setSession}
          playbooks={playbooks}
          onPrepareTrade={handlePrepareTrade}
          onFinalizeTrade={() => handleOpenFinalizeModal()}
          activeTrade={activeTrade}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr_380px] gap-2 p-2 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            <PreTradePanel
              playbookId={session.playbookId}
              playbooks={playbooks}
              drafts={drafts}
              onOpenDraft={handleOpenDraft}
            />
          </div>

          {/* Center Column */}
          <div className="flex flex-col gap-2 overflow-y-auto">
             <LiveTape activeTrade={activeTrade} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            <TradeBlotter key={blotterKey} onClear={handleClearBlotter} />
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
