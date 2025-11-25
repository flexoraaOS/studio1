// This file contains mock data for playbooks and instruments.
import { PlaybookTemplate, InstrumentType } from './types';

/**
 * =================================================================
 * MOCK DATA for Live Trading Workspace
 * =================================================================
 * This data is deterministic and used for development and testing.
 */

export const mockPlaybookTemplates: PlaybookTemplate[] = [
  {
    id: 'pb_orb_v1.2',
    name: 'Opening Range Breakout (ORB)',
    version: '1.2',
    description: 'Trades breakouts of the first 15-minute range on high-volume stocks.',
    allowedInstrumentTypes: ['Stock', 'Futures'],
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
  }
];

export const mockInstruments: Record<InstrumentType, string[]> = {
  Stock: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN', 'META'],
  Futures: ['ES', 'NQ', 'CL', 'GC', 'ZB', 'ZN'],
  FX: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
  Options: ['SPY C450', 'AAPL P170', 'TSLA C300'],
  Crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
};

export const loadPlaybooks = (): PlaybookTemplate[] => {
    return mockPlaybookTemplates;
}
