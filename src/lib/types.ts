export type Trade = {
  id: string;
  entryTime: string;
  exitTime: string;
  symbol: string;
  direction: 'Long' | 'Short';
  size: number;
  entryPrice: number;
  exitPrice: number;
  realizedPnl: number;
  pnlPercent: number;
  currency: 'USD' | 'INR' | 'EUR';
  strategy: string;
  status: 'Closed' | 'Open';
};

export type Kpi = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  description: string;
};

export type ChartData = {
  date?: string;
  [key: string]: number | string | undefined;
};

export type RollingMetric = {
    date: string;
    sharpe: number;
    volatility: number;
}

export type StrategyContribution = {
    name: string;
    value: number;
    isTotal?: boolean;
}

export type PnlCalendarData = {
    date: string;
    pnl: number;
}