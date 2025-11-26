export type ISOString = string;
export type InstrumentType = 'Stock' | 'Futures' | 'FX' | 'Options' | 'Crypto';
export type OrderType = 'Market' | 'Limit';
export type TradeSide = 'Long' | 'Short';
export type InstrumentCategory = 
  | 'Forex Majors' | 'Forex Minors' | 'Forex Exotics' 
  | 'Metals' | 'Energy' | 'Agriculture' 
  | 'Indices US' | 'Indices Europe' | 'Indices Asia' | 'Indices Global'
  | 'Crypto Large' | 'Crypto Mid' 
  | 'Stocks Tech' | 'Stocks Finance' | 'Stocks Energy' | 'Stocks Healthcare' | 'Stocks Consumer' | 'Stocks Others'
  | 'Bonds' | 'Futures Equity' | 'Futures Commodity' | 'Futures FX';

export interface Instrument {
  symbol: string;
  name: string;
  category: InstrumentCategory;
}

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
  instrument: Instrument;
  side: TradeSide;
  size: number; // Represents lot size, e.g., 1.0 for a standard lot
}

// A pre-trade snapshot with selected strategy and parameters.
export type TradeDraft = {
  id: string; // "draft_..."
  createdAt: ISOString;
  playbookId: string;
  playbookName: string;
  params: {
    instrument: Instrument;
    side: TradeSide;
    size: number; // Represents lot size
    entryPrice?: number;
    stopLoss?: number;
  };
  notes: string;
};

// Represents a trade that is currently active.
// In the Draft-Finalize flow, this is effectively the same as TradeDraft
// It represents the "active context" for the modal.
export type ActiveTrade = TradeDraft;


// Represents a fully logged, immutable trade record.
export type CompletedTrade = {
  id: string; // "trade_..."
  draftId?: string; // Link to the original draft
  playbookId: string;
  instrument: Instrument;
  side: TradeSide;
  size: number; // Represents lot size
  entryTimestamp: ISOString;
  exitTimestamp: ISOString;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  fees: number;
  pnl: number;
  rMultiple: number;
  slippage: number;
  notes: string;
  tags: string[];
  attachments: {id: string, data: string}[];
  adherence: Record<string, boolean>;
};
