
import type { Trade, Kpi, ChartData, RollingMetric, StrategyContribution, PnlCalendarData, ExpectancyData, TimeOfDayData } from './types';

export const mockTrades: Trade[] = [
  { id: 'T001', entryTime: '2023-10-26 09:30', exitTime: '2023-10-26 10:00', symbol: 'RELIANCE', direction: 'Long', size: 100, entryPrice: 2300.50, exitPrice: 2315.75, realizedPnl: 1525.00, pnlPercent: 0.66, currency: 'INR', strategy: 'Breakout', status: 'Closed', entryDate: '2023-10-26T09:30:00Z', exitDate: '2023-10-26T10:00:00Z' },
  { id: 'T002', entryTime: '2023-10-26 11:05', exitTime: '2023-10-26 11:45', symbol: 'TSLA', direction: 'Short', size: 10, entryPrice: 215.20, exitPrice: 212.10, realizedPnl: 31.00, pnlPercent: 1.44, currency: 'USD', strategy: 'Momentum', status: 'Closed', entryDate: '2023-10-26T11:05:00Z', exitDate: '2023-10-26T11:45:00Z' },
  { id: 'T003', entryTime: '2023-10-27 14:10', exitTime: '2023-10-27 15:00', symbol: 'EUR/USD', direction: 'Long', size: 10000, entryPrice: 1.0560, exitPrice: 1.0540, realizedPnl: -20.00, pnlPercent: -0.19, currency: 'EUR', strategy: 'Scalping', status: 'Closed', entryDate: '2023-10-27T14:10:00Z', exitDate: '2023-10-27T15:00:00Z' },
  { id: 'T004', entryTime: '2023-10-28 10:00', exitTime: '2023-10-28 12:30', symbol: 'INFY', direction: 'Long', size: 200, entryPrice: 1450.00, exitPrice: 1435.50, realizedPnl: -2900.00, pnlPercent: -1.00, currency: 'INR', strategy: 'Mean Reversion', status: 'Closed', entryDate: '2023-10-28T10:00:00Z', exitDate: '2023-10-28T12:30:00Z' },
  { id: 'T005', entryTime: '2023-10-29 09:45', exitTime: '2023-10-29 10:15', symbol: 'AAPL', direction: 'Long', size: 50, entryPrice: 170.10, exitPrice: 172.30, realizedPnl: 110.00, pnlPercent: 1.29, currency: 'USD', strategy: 'Breakout', status: 'Closed', entryDate: '2023-10-29T09:45:00Z', exitDate: '2023-10-29T10:15:00Z' },
  { id: 'T006', entryTime: '2023-11-01 20:30', exitTime: '2023-11-01 21:00', symbol: 'BTC/USD', direction: 'Short', size: 0.5, entryPrice: 34500, exitPrice: 34800, realizedPnl: -150.00, pnlPercent: -0.87, currency: 'USD', strategy: 'Momentum', status: 'Closed', entryDate: '2023-11-01T20:30:00Z', exitDate: '2023-11-01T21:00:00Z' },
  { id: 'T007', entryTime: '2023-11-02 11:00', exitTime: '2023-11-02 11:00', symbol: 'HDFCBANK', direction: 'Long', size: 150, entryPrice: 1490.25, exitPrice: 0, realizedPnl: 0, pnlPercent: 0, currency: 'INR', strategy: 'Breakout', status: 'Open', entryDate: '2023-11-02T11:00:00Z' },
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
