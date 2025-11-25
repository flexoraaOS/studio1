// This file defines the TypeScript types for the Live Trading Workspace.

/**
 * =================================================================
 * TYPE DEFINITIONS for Live Trading Workspace (Draft-to-Finalize Flow)
 * =================================================================
 */

export type ISOString = string;
export type InstrumentType = 'Stock' | 'Futures' | 'FX' | 'Options' | 'Crypto';
export type OrderType = 'Market' | 'Limit';
export type TradeSide = 'Long' | 'Short';


// --- Playbook Types ---

export type PlaybookRule = {
  id: string;
  category: 'Entry' | 'Exit' | 'Risk' | 'Setup';
  description: string;
  isMandatory: boolean;
};

export type PlaybookTemplate = {
  id: string;
  name: string;
  version: string;
  description: string;
  allowedInstrumentTypes: InstrumentType[];
  rules: PlaybookRule[];
};


// --- Session & Trade Types ---

// Represents the configuration in the control bar
export interface LiveTradeSession {
  playbookId: string;
  instrument: string;
  side: TradeSide;
  size: number;
  riskPercent: number;
}

// A pre-trade snapshot with selected strategy and parameters.
export type TradeDraft = {
  id: string; // "draft_..."
  createdAt: ISOString;
  playbookId: string;
  playbookName: string;
  params: {
    instrument?: string;
    side?: TradeSide;
    size?: number;
    riskPercent?: number;
    entryPrice?: string;
  };
  notes: string;
};

// Represents a fully logged, immutable trade record.
export type CompletedTrade = {
  id: string; // "trade_..."
  draftId?: string; // Link to the original draft
  playbookId: string;
  instrument: string;
  side: TradeSide;
  size: number;
  entryTimestamp: ISOString;
  exitTimestamp: ISOString;
  entryPrice: number;
  exitPrice: number;
  fees: number;
  pnl: number;
  rMultiple: number;
  slippage: number;
  notes: string;
  tags: string[];
  attachments: any[]; // Placeholder for attachment type
};
