import type { Trade, Kpi, ChartData } from './types';

export const mockTrades: Trade[] = [
  { id: 'T001', entryTime: '2023-10-26 09:30', exitTime: '2023-10-26 10:00', symbol: 'RELIANCE', direction: 'Long', size: 100, entryPrice: 2300.50, exitPrice: 2315.75, realizedPnl: 1525.00, pnlPercent: 0.66, currency: 'INR', strategy: 'Breakout', status: 'Closed' },
  { id: 'T002', entryTime: '2023-10-26 11:05', exitTime: '2023-10-26 11:45', symbol: 'TSLA', direction: 'Short', size: 10, entryPrice: 215.20, exitPrice: 212.10, realizedPnl: 31.00, pnlPercent: 1.44, currency: 'USD', strategy: 'Momentum', status: 'Closed' },
  { id: 'T003', entryTime: '2023-10-27 14:10', exitTime: '2023-10-27 15:00', symbol: 'EUR/USD', direction: 'Long', size: 10000, entryPrice: 1.0560, exitPrice: 1.0540, realizedPnl: -20.00, pnlPercent: -0.19, currency: 'EUR', strategy: 'Scalping', status: 'Closed' },
  { id: 'T004', entryTime: '2023-10-28 10:00', exitTime: '2023-10-28 12:30', symbol: 'INFY', direction: 'Long', size: 200, entryPrice: 1450.00, exitPrice: 1435.50, realizedPnl: -2900.00, pnlPercent: -1.00, currency: 'INR', strategy: 'Mean Reversion', status: 'Closed' },
  { id: 'T005', entryTime: '2023-10-29 09:45', exitTime: '2023-10-29 10:15', symbol: 'AAPL', direction: 'Long', size: 50, entryPrice: 170.10, exitPrice: 172.30, realizedPnl: 110.00, pnlPercent: 1.29, currency: 'USD', strategy: 'Breakout', status: 'Closed' },
  { id: 'T006', entryTime: '2023-11-01 20:30', exitTime: '2023-11-01 21:00', symbol: 'BTC/USD', direction: 'Short', size: 0.5, entryPrice: 34500, exitPrice: 34800, realizedPnl: -150.00, pnlPercent: -0.87, currency: 'USD', strategy: 'Momentum', status: 'Closed' },
  { id: 'T007', entryTime: '2023-11-02 11:00', exitTime: '2023-11-02 11:00', symbol: 'HDFCBANK', direction: 'Long', size: 150, entryPrice: 1490.25, exitPrice: 0, realizedPnl: 0, pnlPercent: 0, currency: 'INR', strategy: 'Breakout', status: 'Open' },
];

export const mockKpis: Kpi[] = [
  { title: 'Realized P&L', value: '₹1,24,845.72', change: '+2.1%', changeType: 'positive', description: 'Past 30 days' },
  { title: 'Win Rate', value: '62.5%', change: '-1.5%', changeType: 'negative', description: 'All time' },
  { title: 'Sharpe Ratio', value: '1.78', description: 'Annualized' },
  { title: 'Max Drawdown', value: '₹-42,108.30', description: 'All time' },
];

export const mockEquityCurve: ChartData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 90 + i);
  const value = 100000 + (i * 1000) + (Math.sin(i / 5) * 5000) + (Math.random() * 3000);
  return {
    date: date.toISOString().split('T')[0],
    Equity: value,
    Drawdown: (Math.random() * -5000),
  };
});

export const mockPerformanceData: ChartData[] = [
    { name: 'Breakout', 'P&L': 4000, trades: 24 },
    { name: 'Momentum', 'P&L': 3000, trades: 32 },
    { name: 'Mean Reversion', 'P&L': -2000, trades: 18 },
    { name: 'Scalping', 'P&L': 780, trades: 110 },
    { name: 'Swing', 'P&L': 5400, trades: 12 },
];
