// types/enterprise.ts

/**
 * =================================================================
 * MASTER INTERFACE DEFINITIONS FOR TRADESIGHT PRO ENTERPRISE FEATURES
 * =================================================================
 * This file contains all TypeScript types for the 19 enterprise-grade
 * analytics features.
 */

// --- Foundational Types ---

export type ISOString = string;

export type Account = {
  id: string;
  name: string;
  broker: string;
};

export type EnterpriseTrade = {
  id: string;
  accountId: string;
  strategyId: string;
  playbookId?: string;
  symbol: string;
  direction: 'Long' | 'Short';
  entryTimestamp: ISOString;
  exitTimestamp: ISOString;
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  fees: number;
  slippage: number;
  tags: string[];
  notes: string;
  fx_rate_ts: number;
  strategy_version: string;
  market_regime: 'High Vol' | 'Low Vol' | 'Trending' | 'Ranging';
  instrument_type: 'Stock' | 'Future' | 'Option' | 'FX';
};

export type DailyEquityRecord = {
  date: ISOString;
  equity: number;
  pnl: number;
  returns: number;
};

// --- Feature 2: Playbook Builder ---

export type PlaybookRule = {
  id: string;
  category: 'Entry' | 'Exit' | 'Risk' | 'Setup';
  description: string;
  isMandatory: boolean;
};

export type PlaybookTemplate = {
  id: string;
  name: string;
  description: string;
  rules: PlaybookRule[];
  tags: string[];
};

// --- Feature 3: NLP/AI Journal Companion ---

export type NLPPrompt = {
  id: string;
  text: string;
};

export type NLPReply = {
  id: string;
  type: 'summary' | 'suggestion' | 'observation';
  content: string;
  relatedTrades?: string[];
};

// --- Feature 4: Multi-Timeframe Performance Matrix ---

export type PerformanceMetric = 'Return' | 'Win Rate' | 'Expectancy' | 'Profit Factor';
export type Timeframe = 'Intraday' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
export type PerformanceMatrixData = Record<Timeframe, Record<PerformanceMetric, number>>;

// --- Feature 5: TradeBook Quality Score ---

export type RMultipleDistribution = {
  r: number;
  count: number;
};

export type TradeBookQualityScore = {
  overallScore: number; // 0-100
  rMultipleDistribution: RMultipleDistribution[];
  planAdherence: number; // 0-1
  exitEfficiency: number; // 0-1
};

// --- Feature 6: Risk-of-Ruin Dashboard ---

export type RiskOfRuinParams = {
  riskPerTrade: number; // as percentage of bankroll
  winRate: number; // 0-1
  avgWinLossRatio: number; // e.g., 2 for 2:1 R:R
  bankroll: number;
};

export type RiskOfRuinResult = {
  probability: number; // 0-1
  steps: { trades: number; ruinProb: number }[];
};

// --- Feature 7: Risk Matrix ---

export type RiskMatrixData = {
  tradeType: string;
  marketRegime: string;
  expectancy: number;
  confidence: number; // 0-1
  tradeCount: number;
};

// --- Feature 8: Exposure Pyramid ---

export type ExposurePyramidNode = {
  name: string;
  value: number;
  children?: ExposurePyramidNode[];
};

// --- Feature 9: Cross-Strategy Conflict Detector ---

export type StrategyCorrelation = {
  strategyA: string;
  strategyB: string;
  correlation: number; // -1 to 1
};

// --- Feature 10: Position Lifecycle Map ---

export type LifecyclePhase = 'Identified' | 'Stalking' | 'Executed' | 'Managed' | 'Exited' | 'Reviewed';
export type PositionLifecycle = {
  tradeId: string;
  events: {
    phase: LifecyclePhase;
    timestamp: ISOString;
    durationMinutes: number;
  }[];
};

// --- Feature 11: Playbook Adherence Score ---

export type AdherenceResult = {
  ruleId: string;
  passed: boolean;
  reason?: string;
};
export type PlaybookAdherenceScore = {
  tradeId: string;
  adherence: number; // 0-1
  results: AdherenceResult[];
};

// --- Feature 12: Multi-Account Aggregation ---
// Uses foundational types like Account and DailyEquityRecord

// --- Feature 13: Trader DNA Report ---

export type TraderDNA = {
  primaryBias: 'Momentum' | 'Mean-Reversion' | 'FOMO' | 'Over-Sizing';
  strengths: string[];
  weaknesses: string[];
  bestRegime: 'Trending' | 'Ranging';
  bestTimeframe: Timeframe;
};

// --- Feature 14: Session Recording Timeline ---

export type SessionEvent = {
  id: string;
  timestamp: ISOString;
  type: 'Trade' | 'Note' | 'Rule_Check' | 'Market_Event';
  content: string;
  relatedTradeId?: string;
};

export type TradingSession = {
  id: string;
  startTime: ISOString;
  endTime: ISOString;
  events: SessionEvent[];
  sessionScore: number;
};

// --- Feature 15: Hotspot Detection ---

export type Hotspot = {
  dimension: 'Hour' | 'DayOfWeek' | 'Strategy' | 'Instrument';
  value: string; // e.g., '14:00', 'Monday', 'Breakout'
  lossConcentration: number; // 0-1
  tradeCount: number;
};

// --- Feature 16: Consistency Score ---

export type ConsistencyScore = {
  date: ISOString;
  score: number; // 0-100
  sizingVariance: number;
  pnlVariance: number;
  adherenceVariance: number;
};

// --- Feature 17: Profit Drivers Breakdown ---

export type ProfitDriver = {
  type: 'Trade' | 'Week' | 'Strategy';
  identifier: string;
  pnl: number;
  percentageOfTotal: number;
};

// --- Feature 18: Multi-Path Scenario Monte Carlo ---

export type MonteCarloScenario = 'Base' | 'VolShock' | 'Trend' | 'MeanRevert' | 'Chop';
export type MonteCarloPath = {
  scenario: MonteCarloScenario;
  simulations: number[][]; // [simulation_index][day_index]
};

// --- Feature 19: Trade Cluster Explorer ---

export type TradeFeatureVector = {
  tradeId: string;
  holdTime: number; // normalized
  pnl: number; // normalized
  size: number; // normalized
  slippage: number; // normalized
};

export type TradeCluster = {
  clusterId: number;
  trades: EnterpriseTrade[];
  centroid: Omit<TradeFeatureVector, 'tradeId'>;
  suggestedName: string;
};

// --- Feature 20: Trade Improvement Planner ---

export type ImprovementTask = {
  id: string;
  title: string;
  description: string;
  sourceFeature: 'Hotspot' | 'Consistency' | 'TraderDNA';
  status: 'Todo' | 'InProgress' | 'Done';
  createdDate: ISOString;
};
