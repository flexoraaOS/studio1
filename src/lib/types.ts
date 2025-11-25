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
  slippage?: number; // Added for anomaly detection
  durationSeconds?: number; // Added for anomaly detection
  broker?: string;
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

export type RollingMetric<T extends string> = {
    date: string;
} & {
    [key in T]: number;
};

export type StrategyContribution = {
    name: string;
    value: number;
    isTotal?: boolean;
};

export type PnlCalendarData = {
    date: string;
    pnl: number;
};

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

// --- Priority 3 Analytics Types ---
export type CohortDataPoint = {
    day: number;
    [cohortName: string]: number; // cohortName will be e.g., "2023-01", value is cumulative PnL
};

export type Anomaly = {
  tradeId: string;
  symbol: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  value: string;
};

// --- Priority 4 Analytics Types ---
export type FactorAttribution = {
    date: string;
    totalReturn: number;
    mkt_rf_contrib: number;
    smb_contrib: number;
    hml_contrib: number;
    alpha_contrib: number;
};

export type Scenario = {
    name: string;
    marketShock: number; // as a percentage, e.g., -0.2 for -20%
    interestRateShock: number; // absolute change, e.g., 0.01 for +1%
    volatilityShock: number; // relative change, e.g., 0.5 for +50%
};

export type RegimePerformance = {
    regime: string;
    pnl: number;
    winRate: number;
    tradeCount: number;
    avgWin: number;
    avgLoss: number;
};

export type EdgeDecayDataPoint = {
    day: number;
    survival: number; // Probability from 1 to 0
};

export type SlippageData = {
    broker: string;
    instrument: string;
    avgSlippage: number;
    tradeCount: number;
};

// --- Priority 5 Analytics Types ---
export type BehavioralMetric = {
    title: string;
    value: string;
    target: string;
    status: 'good' | 'warning' | 'bad';
    description: string;
};

export type BehavioralDataPoint = {
    date: string;
    tradesPerDay: number;
    avgHoldTime: number; // in hours
    winRate: number;
};
