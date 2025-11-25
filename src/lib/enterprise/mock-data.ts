// lib/enterprise/mock-data.ts
import {
  EnterpriseTrade,
  DailyEquityRecord,
  Account,
  PlaybookTemplate,
  PerformanceMatrixData,
  RiskMatrixData,
  Timeframe,
  PerformanceMetric,
  RiskOfRuinParams,
  TradeBookQualityScore,
  StrategyCorrelation
} from './types';

const SEED = 'tradesightpro';
let seed = 0;
function seededRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function createDeterministicGenerator(seedStr: string) {
    let h = 1779033703, i = 0, len = seedStr.length;
    for (; i < len; i++) {
        h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}

let random = createDeterministicGenerator(SEED);

const BROKERS = ['AlphaBroker', 'BetaFi', 'Gamma Trading'];
const STRATEGIES = ['Momentum', 'Mean Reversion', 'Breakout', 'Scalping'];
const SYMBOLS_BY_TYPE = {
  Stock: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'],
  Future: ['ES', 'NQ', 'CL', 'GC'],
  FX: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  Option: ['SPY C450', 'AAPL P170']
};
const REGIMES: ('High Vol' | 'Low Vol' | 'Trending' | 'Ranging')[] = ['High Vol', 'Low Vol', 'Trending', 'Ranging'];

export const mockAccounts: Account[] = [
  { id: 'acc_01', name: 'Primary Trading', broker: 'AlphaBroker' },
  { id: 'acc_02', name: 'Long Term IRA', broker: 'BetaFi' },
];

export function generateMockTrades(numTrades: number, daysBack: number): EnterpriseTrade[] {
  const trades: EnterpriseTrade[] = [];
  const today = new Date();

  for (let i = 0; i < numTrades; i++) {
    const instrument_type = Object.keys(SYMBOLS_BY_TYPE)[Math.floor(random() * 4)] as 'Stock' | 'Future' | 'FX' | 'Option';
    const symbols = SYMBOLS_BY_TYPE[instrument_type];
    const symbol = symbols[Math.floor(random() * symbols.length)];
    const accountId = mockAccounts[Math.floor(random() * mockAccounts.length)].id;
    const strategyId = STRATEGIES[Math.floor(random() * STRATEGIES.length)];
    const direction = random() > 0.5 ? 'Long' : 'Short';
    const size = Math.floor(random() * 100) + 1;
    
    const entryDate = new Date(today.getTime() - random() * daysBack * 24 * 60 * 60 * 1000);
    const exitDate = new Date(entryDate.getTime() + random() * 8 * 60 * 60 * 1000); // Up to 8 hours later
    
    const entryPrice = random() * 500 + 100;
    const pnlDirection = (random() > 0.45 ? 1 : -1) * (direction === 'Long' ? 1 : -1); // 55% win rate
    const pnlMagnitude = entryPrice * (random() * 0.05);
    const exitPrice = entryPrice + (pnlMagnitude * pnlDirection);
    const pnl = (exitPrice - entryPrice) * size * (direction === 'Long' ? 1 : -1);

    trades.push({
      id: `trade_${i}`,
      accountId,
      strategyId,
      playbookId: random() > 0.5 ? `pb_0${Math.floor(random() * 3) + 1}` : undefined,
      symbol,
      direction,
      entryTimestamp: entryDate.toISOString(),
      exitTimestamp: exitDate.toISOString(),
      entryPrice,
      exitPrice,
      size,
      pnl,
      fees: random() * 5,
      slippage: random() * 0.1,
      tags: ['q4', `tag_${i % 5}`],
      notes: 'Mock trade note.',
      fx_rate_ts: entryDate.getTime(),
      strategy_version: `v1.${Math.floor(random() * 3)}`,
      market_regime: REGIMES[Math.floor(random() * REGIMES.length)],
      instrument_type,
    });
  }
  return trades;
}

export function generateMockEquityCurve(days: number, initialEquity: number, accountId: string): DailyEquityRecord[] {
    const curve: DailyEquityRecord[] = [];
    let equity = initialEquity;
    const today = new Date();

    for (let i = days -1; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dailyReturn = (random() - 0.49) * 0.03; // Slightly positive drift
        const pnl = equity * dailyReturn;
        equity += pnl;

        curve.push({
            date: date.toISOString(),
            equity,
            pnl,
            returns: dailyReturn,
        });
    }
    return curve;
}


export const mockPlaybookTemplates: PlaybookTemplate[] = [
    {
        id: 'pb_01',
        name: 'ORB (Opening Range Breakout)',
        description: 'Trade breakouts of the first 15-min range.',
        tags: ['intraday', 'breakout'],
        rules: [
            { id: 'r1', category: 'Setup', description: 'Market is trending pre-market', isMandatory: true },
            { id: 'r2', category: 'Entry', description: 'Enter on volume spike > 2x avg', isMandatory: true },
            { id: 'r3', category: 'Risk', description: 'Stop loss below 15-min low/high', isMandatory: true },
            { id: 'r4', category: 'Exit', description: 'Target 2R or end of day', isMandatory: false },
        ]
    },
    {
        id: 'pb_02',
        name: 'Mean Reversion - 50 EMA',
        description: 'Fade extensions away from the 50-period EMA on the 5-min chart.',
        tags: ['scalping', 'mean-reversion'],
        rules: [
            { id: 'r1', category: 'Setup', description: 'Price is > 2 ATR from 50 EMA', isMandatory: true },
            { id: 'r2', category: 'Entry', description: 'Enter after reversal candlestick pattern', isMandatory: true },
            { id: 'r3', category: 'Risk', description: 'Stop loss above/below the wick of entry candle', isMandatory: true },
            { id: 'r4', category: 'Exit', description: 'Target the 50 EMA', isMandatory: true },
        ]
    }
];

export const mockPerformanceMatrix: PerformanceMatrixData = {
    Intraday: { 'Return': 1.2, 'Win Rate': 0.58, 'Expectancy': 25.30, 'Profit Factor': 1.6 },
    Daily: { 'Return': 0.1, 'Win Rate': 0.55, 'Expectancy': 150.10, 'Profit Factor': 1.4 },
    Weekly: { 'Return': 0.5, 'Win Rate': 0.60, 'Expectancy': 750.50, 'Profit Factor': 1.9 },
    Monthly: { 'Return': 2.1, 'Win Rate': 0.65, 'Expectancy': 3200.00, 'Profit Factor': 2.2 },
    Quarterly: { 'Return': 6.3, 'Win Rate': 0.70, 'Expectancy': 9800.00, 'Profit Factor': 2.8 },
};


export const mockTrades3Years = generateMockTrades(1500, 3 * 365);
export const mockEquity3YearsAcc1 = generateMockEquityCurve(3 * 365, 100000, 'acc_01');
export const mockEquity3YearsAcc2 = generateMockEquityCurve(3 * 365, 50000, 'acc_02');


export const mockRiskMatrix: RiskMatrixData[] = [];
const tradeTypes = ['Momentum', 'Mean Reversion', 'Breakout'];
const regimes = ['High Vol', 'Low Vol', 'Trending', 'Ranging'];

tradeTypes.forEach(type => {
  regimes.forEach(regime => {
    mockRiskMatrix.push({
      tradeType: type,
      marketRegime: regime,
      expectancy: (random() - 0.3) * 200,
      confidence: random() * 0.5 + 0.5,
      tradeCount: Math.floor(random() * 50) + 10,
    });
  });
});

export const mockTradeBookQualityScore: TradeBookQualityScore = {
    overallScore: 78,
    rMultipleDistribution: [
        { r: -3, count: 5 }, { r: -2, count: 15 }, { r: -1, count: 40 },
        { r: 0, count: 10 }, { r: 1, count: 35 }, { r: 2, count: 25 },
        { r: 3, count: 10 }, { r: 5, count: 5 }
    ],
    planAdherence: 0.85,
    exitEfficiency: 0.72,
    riskManagement: 0.9,
    discipline: 0.68,
};

export const mockStrategyCorrelations: StrategyCorrelation[] = [
    { strategyA: 'Momentum', strategyB: 'Mean Reversion', correlation: -0.65 },
    { strategyA: 'Momentum', strategyB: 'Breakout', correlation: 0.78 },
    { strategyA: 'Mean Reversion', strategyB: 'Breakout', correlation: -0.21 },
];
