
// @/app/(app)/live-trades/page.tsx
'use client';

import React from 'react';

import PreTradePanel from '@/components/live/PreTradePanel';
import LiveTape from '@/components/live/LiveTape';
import TradeBlotter from '@/components/live/TradeBlotter';
import LiveControlBar from '@/components/live/LiveControlBar';

/**
 * =================================================================
 * Live Trading Cockpit
 * =================================================================
 * This page serves as the main hub for intraday trading execution,
 * combining pre-trade analysis, live monitoring, and post-trade logging
 * into a unified "cockpit" interface.
 */
export default function LiveTradingCockpitPage() {

  // TODO: Implement state management for live trade session,
  // selected strategy, instrument, and completed trades.

  return (
    <div className="flex h-full flex-col bg-[#0B0B0C] text-gray-300 font-code">
      
      {/* --- Sticky Control Bar --- */}
      <LiveControlBar />

      {/* --- Main Content Grid --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-2 p-2 overflow-hidden">
        
        {/* --- Left Column: Pre-Trade --- */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <PreTradePanel />
        </div>

        {/* --- Center Column: Live Tape --- */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <LiveTape />
        </div>
        
        {/* --- Right Column: Blotter --- */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <TradeBlotter />
        </div>

      </div>

      {/* 
        TODO: Add PostTradeModal component here. It will be triggered
        by the 'EndTradeButton' in the LiveControlBar.
      */}
      {/* <PostTradeModal isOpen={...} onSave={...} /> */}

    </div>
  );
}
