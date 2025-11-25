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
  entryDate?: string;
  exitDate?: string;
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

export type ExpectancyData = {
    strategy: string;
    expectancy: number;
    winRate: number;
    avgWin: number;
    lossRate: number;
    avgLoss: number;
    tradeCount: number;
};

export type TimeOfDayData = {
    hour: number;
    pnl: number;
    winRate: number;
    tradeCount: number;
};


// --- Priority 2 Analytics Types ---

export type DailyReturn = {
  date: string;
  return: number;
  isWin: boolean;
};

export type FactorReturns = {
  dates: string[];
  Mkt_RF: number[];
  SMB: number[];
  HML: number[];
};

export type HistoricalEquityPoint = {
    date: string;
    equity: number;
};

export type MonteCarloSimulation = number[]; // An array of equity values over time for one simulation

export type MonteCarloPercentiles = {
    p5: number;
    p25: number;
    p50: number; // Median
    p75: number;
    p95: number;
};

export type MonteCarloData = {
    actualEquity: HistoricalEquityPoint[];
    simulations: MonteCarloSimulation[];
    percentiles: MonteCarloPercentiles[];
};

export type VarAnalysis = {
    var: number;
    cvar: number;
};

export type RollingBeta = {
    date: string;
    betas: {
        'Mkt_RF'?: number;
        'SMB'?: number;
        'HML'?: number;
    };
    ci: {
       'Mkt_RF'?: { lower: number; upper: number };
       'SMB'?: { lower: number; upper: number };
       'HML'?: { lower: number; upper: number };
    }
};

export type RollingMetric<T extends string> = {
    date: string;
} & {
    [key in T]: number;
};
