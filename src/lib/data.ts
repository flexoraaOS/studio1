import type { Trade, Kpi, ChartData, RollingMetric, StrategyContribution, PnlCalendarData, ExpectancyData, TimeOfDayData, DailyReturn, FactorReturns, MonteCarloData, RollingBeta, CohortDataPoint, HistoricalEquityPoint, Anomaly, FactorAttribution, RegimePerformance, EdgeDecayDataPoint, SlippageData } from './types';

export const mockTrades: Trade[] = [
  { id: 'T001', entryTime: '2023-10-26 09:30', exitTime: '2023-10-26 10:00', symbol: 'RELIANCE', direction: 'Long', size: 100, entryPrice: 2300.50, exitPrice: 2315.75, realizedPnl: 1525.00, pnlPercent: 0.66, currency: 'INR', strategy: 'Breakout', status: 'Closed', entryDate: '2023-10-26T09:30:00Z', exitDate: '2023-10-26T10:00:00Z', slippage: 0.05, durationSeconds: 1800, broker: 'Zerodha' },
  { id: 'T002', entryTime: '2023-10-26 11:05', exitTime: '2023-10-26 11:45', symbol: 'TSLA', direction: 'Short', size: 10, entryPrice: 215.20, exitPrice: 212.10, realizedPnl: 31.00, pnlPercent: 1.44, currency: 'USD', strategy: 'Momentum', status: 'Closed', entryDate: '2023-10-26T11:05:00Z', exitDate: '2023-10-26T11:45:00Z', slippage: 0.10, durationSeconds: 2400, broker: 'Interactive Brokers' },
  { id: 'T003', entryTime: '2023-10-27 14:10', exitTime: '2023-10-27 15:00', symbol: 'EUR/USD', direction: 'Long', size: 10000, entryPrice: 1.0560, exitPrice: 1.0540, realizedPnl: -20.00, pnlPercent: -0.19, currency: 'EUR', strategy: 'Scalping', status: 'Closed', entryDate: '2023-10-27T14:10:00Z', exitDate: '2023-10-27T15:00:00Z', slippage: 0.0001, durationSeconds: 3000, broker: 'OANDA' },
  { id: 'T004', entryTime: '2023-10-28 10:00', exitTime: '2023-10-28 12:30', symbol: 'INFY', direction: 'Long', size: 200, entryPrice: 1450.00, exitPrice: 1435.50, realizedPnl: -2900.00, pnlPercent: -1.00, currency: 'INR', strategy: 'Mean Reversion', status: 'Closed', entryDate: '2023-10-28T10:00:00Z', exitDate: '2023-10-28T12:30:00Z', slippage: 0.15, durationSeconds: 9000, broker: 'Zerodha' },
  { id: 'T005', entryTime: '2023-10-29 09:45', exitTime: '2023-10-29 10:15', symbol: 'AAPL', direction: 'Long', size: 50, entryPrice: 170.10, exitPrice: 172.30, realizedPnl: 110.00, pnlPercent: 1.29, currency: 'USD', strategy: 'Breakout', status: 'Closed', entryDate: '2023-10-29T09:45:00Z', exitDate: '2023-10-29T10:15:00Z', slippage: 0.08, durationSeconds: 1800, broker: 'Interactive Brokers' },
  { id: 'T006', entryTime: '2023-11-01 20:30', exitTime: '2023-11-01 21:00', symbol: 'BTC/USD', direction: 'Short', size: 0.5, entryPrice: 34500, exitPrice: 34800, realizedPnl: -150.00, pnlPercent: -0.87, currency: 'USD', strategy: 'Momentum', status: 'Closed', entryDate: '2023-11-01T20:30:00Z', exitDate: '2023-11-01T21:00:00Z', slippage: 15.0, durationSeconds: 1800, broker: 'Coinbase' },
  { id: 'T007', entryTime: '2023-11-02 11:00', exitTime: '2023-11-02 11:00', symbol: 'HDFCBANK', direction: 'Long', size: 150, entryPrice: 1490.25, exitPrice: 0, realizedPnl: 0, pnlPercent: 0, currency: 'INR', strategy: 'Breakout', status: 'Open', entryDate: '2023-11-02T11:00:00Z', slippage: 0.0, durationSeconds: 0, broker: 'Zerodha' },
  // Anomalous Trades for Detector
  { id: 'A001', entryTime: '2023-11-03 09:30', exitTime: '2023-11-03 09:31', symbol: 'NIFTY50', direction: 'Long', size: 500, entryPrice: 19200, exitPrice: 19100, realizedPnl: -50000.00, pnlPercent: -6.52, currency: 'INR', strategy: 'Scalping', status: 'Closed', entryDate: '2023-11-03T09:30:00Z', exitDate: '2023-11-03T09:31:00Z', slippage: 2.5, durationSeconds: 60, broker: 'Zerodha' },
  { id: 'A002', entryTime: '2023-11-03 10:00', exitTime: '2023-11-03 15:00', symbol: 'AMZN', direction: 'Long', size: 1000, entryPrice: 140.00, exitPrice: 160.50, realizedPnl: 20500, pnlPercent: 14.64, currency: 'USD', strategy: 'Day-Trade', status: 'Closed', entryDate: '2023-11-03T10:00:00Z', exitDate: '2023-11-03T15:00:00Z', slippage: 0.50, durationSeconds: 18000, broker: 'Interactive Brokers' },
  { id: 'A003', entryTime: '2023-11-04 14:00', exitTime: '2023-11-04 14:00', symbol: 'MSFT', direction: 'Short', size: 5, entryPrice: 350, exitPrice: 340, realizedPnl: 50.00, pnlPercent: 2.85, currency: 'USD', strategy: 'Momentum', status: 'Closed', entryDate: '2023-11-04T14:00:00Z', exitDate: '2023-11-04T14:00:00Z', slippage: 1.1, durationSeconds: 1, broker: 'Interactive Brokers' },
];

export const mockKpis: Kpi[] = [
  { title: 'Realized P&L', value: '₹1,24,845.72', change: '+2.1%', changeType: 'positive', description: 'Past 30 days' },
  { title: 'Win Rate', value: '62.5%', change: '-1.5%', changeType: 'negative', description: 'All time' },
  { title: 'Sharpe Ratio', value: '1.78', description: 'Annualized' },
  { title: 'Max Drawdown', value: '₹-42,108.30', description: 'All time' },
];

const equityData: ChartData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 90 + i);
  const equity = 100000 + (i * 1000) + (Math.sin(i / 5) * 5000) + (Math.random() * 3000);
  return {
    date: date.toISOString(),
    Equity: equity,
  };
});

export const mockEquityCurve: ChartData[] = equityData.map((dataPoint, index) => {
  const high = Math.max(...equityData.slice(0, index + 1).map(d => d.Equity as number));
  const equity = dataPoint.Equity as number;
  const drawdown = ((equity - high) / high) * 100;
  return {
    ...dataPoint,
    Drawdown: isFinite(drawdown) ? drawdown : 0,
  };
});

export const mockPerformanceData: ChartData[] = [
    { name: 'Breakout', 'P&L': 4000, trades: 24 },
    { name: 'Momentum', 'P&L': 3000, trades: 32 },
    { name: 'Mean Reversion', 'P&L': -2000, trades: 18 },
    { name: 'Scalping', 'P&L': 780, trades: 110 },
    { name: 'Swing', 'P&L': 5400, trades: 12 },
];

export const mockRollingMetrics: RollingMetric[] = Array.from({ length: 60 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 60 + i);
    return {
        date: date.toISOString(),
        sharpe: 1.5 + Math.sin(i / 10) * 0.5 + (Math.random() - 0.5) * 0.2,
        volatility: 0.8 + Math.cos(i / 15) * 0.3 + (Math.random() - 0.5) * 0.1,
    };
});

export const mockStrategyContributions: StrategyContribution[] = [
    { name: 'Opening Balance', value: 100000 },
    { name: 'Breakout', value: 15000 },
    { name: 'Momentum', value: 22000 },
    { name: 'Mean Reversion', value: -8000 },
    { name: 'Scalping', value: 4500 },
    { name: 'Swing', value: 18000 },
    { name: 'Fees & Comm.', value: -2500 },
    { name: 'Closing Balance', value: 149000, isTotal: true },
];

export const mockPnlCalendar: PnlCalendarData[] = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() -1);
    date.setDate(date.getDate() + i);
    const pnl = (Math.random() - 0.45) * 5000;
    return {
        date: date.toISOString().split('T')[0],
        pnl,
    };
});

export const mockExpectancyData: ExpectancyData[] = [
    { strategy: 'Breakout', expectancy: 150.75, winRate: 0.65, avgWin: 450.25, lossRate: 0.35, avgLoss: 250.00, tradeCount: 50 },
    { strategy: 'Momentum', expectancy: 210.20, winRate: 0.58, avgWin: 750.50, lossRate: 0.42, avgLoss: 420.10, tradeCount: 75 },
    { strategy: 'Mean Reversion', expectancy: -50.10, winRate: 0.72, avgWin: 200.00, lossRate: 0.28, avgLoss: 700.50, tradeCount: 40 },
    { strategy: 'Scalping', expectancy: 5.50, winRate: 0.85, avgWin: 25.00, lossRate: 0.15, avgLoss: 105.00, tradeCount: 250 },
];

export const mockTimeOfDayData: TimeOfDayData[] = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 8; // Trading hours from 8 AM to midnight
    return {
        hour,
        pnl: (Math.random() - 0.4) * 2000,
        winRate: 0.4 + Math.random() * 0.3, // win rate between 40% and 70%
        tradeCount: Math.floor(Math.random() * 20) + 5,
    };
});


// --- Priority 2 Mock Data ---

// Generate a realistic 3-year historical equity curve
export const mockHistoricalEquity: HistoricalEquityPoint[] = [];
let lastEquity = 100000;
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 3);

for (let i = 0; i < 365 * 3; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dailyReturn = (Math.random() - 0.49) * 0.03; // Avg daily return slightly positive, with volatility
    lastEquity *= (1 + dailyReturn);
    // Add some larger shock events
    if (i % 100 === 0) lastEquity *= (1 + (Math.random() - 0.5) * 0.1);

    mockHistoricalEquity.push({
        date: date.toISOString(),
        equity: lastEquity,
    });
}

// Generate daily returns from the equity curve
export const mockDailyReturns: DailyReturn[] = mockHistoricalEquity.slice(1).map((current, i) => {
    const previous = mockHistoricalEquity[i];
    const dailyReturn = (current.equity - previous.equity) / previous.equity;
    return {
        date: current.date,
        return: dailyReturn,
        isWin: dailyReturn > 0,
    };
});

// Mock Fama-French factor returns
export const mockFactorReturns: FactorReturns = {
    dates: [],
    Mkt_RF: [],
    SMB: [],
    HML: [],
};

mockDailyReturns.forEach(dr => {
    mockFactorReturns.dates.push(dr.date);
    // Simulate some correlation with the market and other factors
    mockFactorReturns.Mkt_RF.push(dr.return * 0.8 + (Math.random() - 0.5) * 0.01);
    mockFactorReturns.SMB.push((Math.random() - 0.5) * 0.005);
    mockFactorReturns.HML.push((Math.random() - 0.5) * 0.004);
});

// --- Priority 3 Mock Data ---

export const mockCohortData: { cohorts: Record<string, number[]>, cohortNames: string[] } = {
  cohortNames: ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"],
  cohorts: {
    "2023-01": [0, 100, 150, 120, 200, 220, 210, 250, 240, 230, 260, 280],
    "2023-02": [0, 80, 110, 130, 125, 140, 160, 150, 170, 190, 180],
    "2023-03": [0, 120, 100, 90, 80, 70, 60, 50, 40, 30],
    "2023-04": [0, 50, 60, 70, 80, 90, 100, 110],
    "2023-05": [0, 200, 220, 240, 230, 250],
    "2023-06": [0, -50, -40, -30],
  },
};

// --- Priority 4 Mock Data ---
export const mockFactorAttribution: FactorAttribution[] = mockDailyReturns.slice(-180).map((dr, i) => {
    const mkt_contrib = mockFactorReturns.Mkt_RF[i] * (0.8 + (Math.random() - 0.5) * 0.2);
    const smb_contrib = mockFactorReturns.SMB[i] * (0.2 + (Math.random() - 0.5) * 0.1);
    const hml_contrib = mockFactorReturns.HML[i] * (-0.1 + (Math.random() - 0.5) * 0.1);
    const alpha = dr.return - mkt_contrib - smb_contrib - hml_contrib;
    return {
        date: dr.date,
        totalReturn: dr.return,
        mkt_rf_contrib: mkt_contrib,
        smb_contrib: smb_contrib,
        hml_contrib: hml_contrib,
        alpha_contrib: alpha
    };
});

export const mockRegimePerformance: RegimePerformance[] = [
    { regime: 'High Volatility', pnl: 45000, winRate: 0.55, tradeCount: 150, avgWin: 600, avgLoss: 400 },
    { regime: 'Low Volatility', pnl: 75000, winRate: 0.68, tradeCount: 250, avgWin: 450, avgLoss: 200 },
    { regime: 'Trending', pnl: 95000, winRate: 0.62, tradeCount: 200, avgWin: 800, avgLoss: 550 },
    { regime: 'Mean-Reverting', pnl: 25000, winRate: 0.75, tradeCount: 180, avgWin: 300, avgLoss: 350 },
];

export const mockEdgeDecayData: EdgeDecayDataPoint[] = Array.from({ length: 100 }, (_, i) => ({
    day: i,
    survival: Math.exp(-i * 0.025) * (0.98 + Math.random() * 0.04), // Exponential decay with noise
}));

export const mockSlippageData: SlippageData[] = [
    { broker: 'Zerodha', instrument: 'RELIANCE', avgSlippage: 0.08, tradeCount: 50 },
    { broker: 'Zerodha', instrument: 'NIFTY50', avgSlippage: 1.25, tradeCount: 120 },
    { broker: 'Interactive Brokers', instrument: 'TSLA', avgSlippage: 0.12, tradeCount: 30 },
    { broker: 'Interactive Brokers', instrument: 'AAPL', avgSlippage: 0.09, tradeCount: 45 },
    { broker: 'OANDA', instrument: 'EUR/USD', avgSlippage: 0.00015, tradeCount: 200 },
    { broker: 'Coinbase', instrument: 'BTC/USD', avgSlippage: 12.50, tradeCount: 80 },
];
