// This file defines the TypeScript types for the Live Trading Workspace.

/**
 * =================================================================
 * TYPE DEFINITIONS for Live Trading Workspace
 * =================================================================
 */

export type ISOString = string;

// --- Playbook & Rule Engine Types ---

export type RuleCondition = 
  | { type: 'numeric'; metric: string; operator: '>' | '>=' | '<' | '<='; value: number }
  | { type: 'range'; metric: string; min: number; max: number }
  | { type: 'equality'; metric: string; value: string | number | boolean }
  | { type: 'timeWindow'; metric: 'entryTime'; after: string; before: string } // Time as 'HH:mm'
  | { type: 'textContains'; metric: 'notes' | 'symbol'; value: string }
  | { type: 'boolean'; metric: string; value: boolean };

export type PlaybookRule = {
  id: string;
  name: string;
  explanation: string;
  example: string;
  condition: RuleCondition;
};

export type ChecklistItem = {
  id: string;
  label: string;
  isMandatory: boolean;
};

export type PlaybookTemplate = {
  id: string;
  name: string;
  version: string;
  description: string;
  allowedInstrumentTypes: InstrumentType[];
  defaultParams: {
    riskPercent: number;
    orderType: OrderType;
  };
  checklist: ChecklistItem[];
  rules: PlaybookRule[];
  notesTemplate: string;
};

// --- Trade & Session Types ---

export type InstrumentType = 'Stock' | 'Futures' | 'FX' | 'Options' | 'Crypto';
export type OrderType = 'Market' | 'Limit';
export type TradeSide = 'Long' | 'Short';

export interface QuickParams {
  instrument: string;
  instrumentType?: InstrumentType;
  side: TradeSide;
  orderType: OrderType;
  size: number;
  riskPercent: number;
  expectedStop?: number;
  expectedTarget?: number;
}

export type TradeDraft = {
  id: string;
  createdAt: ISOString;
  playbookId: string;
  params: Partial<QuickParams>;
  checklistState: Record<string, boolean>; // key: checklist item id
  notes: string;
};

export type LiveTradeSession = {
  id: string;
  startedAt: ISOString;
  playbook: PlaybookTemplate;
  params: QuickParams;
  checklistState: Record<string, boolean>;
  notes: string;
};

// --- Post-Trade & Review Types ---

export type Attachment = {
  id: string;
  name: string;
  type: 'image/png' | 'image/jpeg' | 'application/pdf';
  content: string; // Base64 encoded string
};

export type CompletedTrade = {
  id: string;
  session: LiveTradeSession;
  execution: {
    entryTimestamp: ISOString;
    exitTimestamp: ISOString;
    entryPrice: number;
    exitPrice: number;
    filledSize: number;
    fees: number;
  };
  calculations: {
    realizedPnl: number;
    slippage: number;
    rMultiple: number;
  };
  attachments: Attachment[];
  review: {
    notes: string;
    finalStamp: 'Approved' | 'Rejected' | 'Pending';
    reviewer: string; // User ID or name
  };
  playbookResult: PlaybookResult;
};

export type RuleEvaluationResult = {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  actualValue?: string | number | boolean;
  expectedValue: string;
};

export type PlaybookResult = {
  adherencePercent: number;
  planFollowScore: number;
  ruleResults: RuleEvaluationResult[];
  checklistPassed: number;
  checklistTotal: number;
};

export type AuditLogEntry = {
  id: string;
  timestamp: ISOString;
  actor: string; // User ID or name
  action: 'CREATE_DRAFT' | 'START_SESSION' | 'SAVE_TRADE' | 'UPDATE_TRADE';
  tradeId: string;
  diff: Record<string, any>; // Simplified diff object
};
