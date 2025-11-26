import { PlaybookTemplate, Instrument, InstrumentCategory } from './types';

export const mockPlaybookTemplates: PlaybookTemplate[] = [
  {
    id: 'pb_orb_v1.2',
    name: 'Opening Range Breakout (ORB)',
    version: '1.2',
    description: 'Trades breakouts of the first 15-minute range on high-volume stocks.',
    allowedInstrumentTypes: ['Stock', 'Futures', 'Crypto'],
    rules: [
      { id: 'r1_1', category: 'Setup', description: 'Market is trending pre-market', isMandatory: true },
      { id: 'r1_2', category: 'Entry', description: 'Enter on volume spike > 2x avg', isMandatory: true },
      { id: 'r1_3', category: 'Risk', description: 'Stop loss below 15-min low/high', isMandatory: true },
      { id: 'r1_4', category: 'Exit', description: 'Target 2R or end of day', isMandatory: false },
    ]
  },
  {
    id: 'pb_mr_v2.1',
    name: 'FX Mean Reversion',
    version: '2.1',
    description: 'Fades over-extensions on major FX pairs during London/NY overlap.',
    allowedInstrumentTypes: ['FX'],
    rules: [
      { id: 'r2_1', category: 'Setup', description: 'Price is > 1.5 ATR(14) from the 20 EMA', isMandatory: true },
      { id: 'r2_2', category: 'Entry', description: 'Enter after reversal candlestick pattern', isMandatory: true },
      { id: 'r2_3', category: 'Risk', description: 'Stop loss above/below the wick of entry candle', isMandatory: true },
    ],
  },
  {
    id: 'pb_swing_v1.0',
    name: 'Index Swing Trade',
    version: '1.0',
    description: 'Swing trading major indices based on weekly support/resistance.',
    allowedInstrumentTypes: ['Futures', 'Options'],
    rules: [
      { id: 'r3_1', category: 'Setup', description: 'Price is testing a key weekly level', isMandatory: true },
      { id: 'r3_2', category: 'Entry', description: 'Enter on daily confirmation candle', isMandatory: true },
      { id: 'r3_3', category: 'Risk', description: 'Stop loss is 1.5% below entry', isMandatory: true },
    ],
  }
];

export const ALL_INSTRUMENTS: Instrument[] = [
  // Forex Majors
  { symbol: 'EUR/USD', name: 'Euro vs US Dollar', category: 'Forex Majors' },
  { symbol: 'GBP/USD', name: 'British Pound vs US Dollar', category: 'Forex Majors' },
  { symbol: 'USD/JPY', name: 'US Dollar vs Japanese Yen', category: 'Forex Majors' },
  { symbol: 'USD/CHF', name: 'US Dollar vs Swiss Franc', category: 'Forex Majors' },
  { symbol: 'USD/CAD', name: 'US Dollar vs Canadian Dollar', category: 'Forex Majors' },
  { symbol: 'AUD/USD', name: 'Australian Dollar vs US Dollar', category: 'Forex Majors' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar vs US Dollar', category: 'Forex Majors' },

  // Forex Minors
  { symbol: 'EUR/GBP', name: 'Euro vs British Pound', category: 'Forex Minors' },
  { symbol: 'EUR/JPY', name: 'Euro vs Japanese Yen', category: 'Forex Minors' },
  { symbol: 'EUR/CHF', name: 'Euro vs Swiss Franc', category: 'Forex Minors' },
  { symbol: 'EUR/AUD', name: 'Euro vs Australian Dollar', category: 'Forex Minors' },
  { symbol: 'EUR/CAD', name: 'Euro vs Canadian Dollar', category: 'Forex Minors' },
  { symbol: 'EUR/NZD', name: 'Euro vs New Zealand Dollar', category: 'Forex Minors' },
  { symbol: 'GBP/JPY', name: 'British Pound vs Japanese Yen', category: 'Forex Minors' },
  { symbol: 'GBP/CHF', name: 'British Pound vs Swiss Franc', category: 'Forex Minors' },
  { symbol: 'GBP/AUD', name: 'British Pound vs Australian Dollar', category: 'Forex Minors' },
  { symbol: 'GBP/CAD', name: 'British Pound vs Canadian Dollar', category: 'Forex Minors' },
  { symbol: 'GBP/NZD', name: 'British Pound vs New Zealand Dollar', category: 'Forex Minors' },
  { symbol: 'AUD/JPY', name: 'Australian Dollar vs Japanese Yen', category: 'Forex Minors' },
  { symbol: 'AUD/CHF', name: 'Australian Dollar vs Swiss Franc', category: 'Forex Minors' },
  { symbol: 'AUD/CAD', name: 'Australian Dollar vs Canadian Dollar', category: 'Forex Minors' },
  { symbol: 'AUD/NZD', name: 'Australian Dollar vs New Zealand Dollar', category: 'Forex Minors' },
  { symbol: 'NZD/JPY', name: 'New Zealand Dollar vs Japanese Yen', category: 'Forex Minors' },
  { symbol: 'NZD/CHF', name: 'New Zealand Dollar vs Swiss Franc', category: 'Forex Minors' },
  { symbol: 'NZD/CAD', name: 'New Zealand Dollar vs Canadian Dollar', category: 'Forex Minors' },
  { symbol: 'CAD/JPY', name: 'Canadian Dollar vs Japanese Yen', category: 'Forex Minors' },
  { symbol: 'CHF/JPY', name: 'Swiss Franc vs Japanese Yen', category: 'Forex Minors' },
  
  // Commodities - Metals
  { symbol: 'XAU/USD', name: 'Gold', category: 'Metals' },
  { symbol: 'XAG/USD', name: 'Silver', category: 'Metals' },
  { symbol: 'XPT/USD', name: 'Platinum', category: 'Metals' },
  { symbol: 'XPD/USD', name: 'Palladium', category: 'Metals' },
  { symbol: 'Copper', name: 'Copper Futures', category: 'Metals' },

  // Commodities - Energy
  { symbol: 'WTI', name: 'Crude Oil (WTI)', category: 'Energy' },
  { symbol: 'Brent', name: 'Brent Crude Oil', category: 'Energy' },
  { symbol: 'Natural Gas', name: 'Natural Gas Futures', category: 'Energy' },

  // Indices - US
  { symbol: 'SPX', name: 'S&P 500', category: 'Indices US' },
  { symbol: 'NDX', name: 'Nasdaq 100', category: 'Indices US' },
  { symbol: 'DJI', name: 'Dow Jones 30', category: 'Indices US' },
  { symbol: 'RUT', name: 'Russell 2000', category: 'Indices US' },
  { symbol: 'VIX', name: 'CBOE Volatility Index', category: 'Indices US' },
  
  // Indices - Europe
  { symbol: 'GER40', name: 'Germany 40 DAX', category: 'Indices Europe' },
  { symbol: 'UK100', name: 'FTSE 100', category: 'Indices Europe' },
  { symbol: 'FRA40', name: 'CAC 40', category: 'Indices Europe' },
  
  // Indices - Asia
  { symbol: 'JP225', name: 'Nikkei 225', category: 'Indices Asia' },
  { symbol: 'HK50', name: 'Hang Seng 50', category: 'Indices Asia' },
  { symbol: 'NIFTY50', name: 'Nifty 50', category: 'Indices Asia' },
  
  // Crypto - Large Cap
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'Crypto Large' },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'Crypto Large' },
  { symbol: 'SOL/USD', name: 'Solana', category: 'Crypto Large' },
  { symbol: 'XRP/USD', name: 'Ripple', category: 'Crypto Large' },
  
  // Stocks - Tech
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stocks Tech' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Stocks Tech' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'Stocks Tech' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', category: 'Stocks Tech' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', category: 'Stocks Tech' },
];

export const INSTRUMENT_GROUPS = ALL_INSTRUMENTS.reduce((acc, instrument) => {
  const category = instrument.category as InstrumentCategory;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(instrument);
  return acc;
}, {} as Record<InstrumentCategory, Instrument[]>);


// For simpler access in the control bar
export const mockInstruments: Record<string, Instrument[]> = {
  FX: INSTRUMENT_GROUPS['Forex Majors'],
  Indices: INSTRUMENT_GROUPS['Indices US'],
  Commodities: INSTRUMENT_GROUPS['Metals'],
  Crypto: INSTRUMENT_GROUPS['Crypto Large'],
  Stocks: INSTRUMENT_GROUPS['Stocks Tech'],
};

export function loadPlaybooks(): PlaybookTemplate[] {
  return mockPlaybookTemplates;
}

export function loadDefaultInstrument(): Instrument {
  // Ensure there's at least one instrument before trying to access it
  if (ALL_INSTRUMENTS.length === 0) {
    // Return a fallback instrument or throw an error
    return { symbol: 'N/A', name: 'No instruments loaded', category: 'Stocks Others' };
  }
  return ALL_INSTRUMENTS[0];
}
