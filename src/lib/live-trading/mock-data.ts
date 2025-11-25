// This file contains mock data for playbooks and instruments.

import { PlaybookTemplate, InstrumentType } from './types';

/**
 * =================================================================
 * MOCK DATA for Live Trading Workspace
 * =================================================================
 * This data is deterministic and used for development, testing, and Storybook.
 */

export const mockPlaybookTemplates: PlaybookTemplate[] = [
  {
    id: 'pb_orb_v1.2',
    name: 'Opening Range Breakout (ORB)',
    version: '1.2',
    description: 'Trades breakouts of the first 15-minute range on high-volume stocks.',
    allowedInstrumentTypes: ['Stock', 'Futures'],
    defaultParams: {
      riskPercent: 1.0,
      orderType: 'Market',
    },
    checklist: [
      { id: 'chk_orb_1', label: 'Pre-market volume is > 500k shares', isMandatory: true },
      { id: 'chk_orb_2', label: 'Market is in a clear trend (check SPY/QQQ)', isMandatory: true },
      { id: 'chk_orb_3', label: 'No major economic news scheduled in the next hour', isMandatory: false },
      { id: 'chk_orb_4', label: 'I am mentally prepared and focused', isMandatory: true },
    ],
    rules: [
      {
        id: 'rule_orb_1',
        name: 'Entry Time',
        explanation: 'Entry must occur within the first hour of market open.',
        example: 'Enter between 9:30 AM and 10:30 AM EST.',
        condition: { type: 'timeWindow', metric: 'entryTime', after: '09:30', before: '10:30' }
      },
      {
        id: 'rule_orb_2',
        name: 'Max Risk',
        explanation: 'Risk per trade should not exceed 2% of the account.',
        example: 'Risk percentage is set to 2.0% or less.',
        condition: { type: 'numeric', metric: 'riskPercent', operator: '<=', value: 2.0 }
      },
    ],
    notesTemplate: `
**Trade Thesis:**
- Stock: 
- Catalyst: 
- Reason for Entry:

**Plan:**
- Entry Zone: 
- Stop Loss: 
- Target 1: 
- Target 2: 
`
  },
  {
    id: 'pb_mr_v2.1',
    name: 'FX Mean Reversion',
    version: '2.1',
    description: 'Fades over-extensions on major FX pairs during London/NY overlap.',
    allowedInstrumentTypes: ['FX'],
    defaultParams: {
      riskPercent: 0.5,
      orderType: 'Limit',
    },
    checklist: [
      { id: 'chk_mr_1', label: 'Price is > 1.5 ATR(14) from the 20 EMA', isMandatory: true },
      { id: 'chk_mr_2', label: 'RSI is overbought (>70) or oversold (<30)', isMandatory: true },
      { id: 'chk_mr_3', label: 'No high-impact news releases for the currency pair', isMandatory: true },
    ],
    rules: [
      {
        id: 'rule_mr_1',
        name: 'Session Time',
        explanation: 'Only trade during the high-liquidity London/NY overlap session.',
        example: 'Entry must be between 8:00 AM and 12:00 PM EST.',
        condition: { type: 'timeWindow', metric: 'entryTime', after: '08:00', before: '12:00' }
      },
      {
        id: 'rule_mr_2',
        name: 'Instrument Type',
        explanation: 'This playbook is designed exclusively for FX pairs.',
        example: 'Instrument type is set to FX.',
        condition: { type: 'equality', metric: 'instrumentType', value: 'FX' }
      },
    ],
    notesTemplate: `
**Setup:**
- Pair: 
- Higher Timeframe Trend: 
- Reason for Fade: 

**Execution:**
- Limit Order Price: 
- Stop Loss: 
- Target: 
`
  }
];

export const mockInstruments: Record<InstrumentType, string[]> = {
  Stock: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN', 'META'],
  Futures: ['ES', 'NQ', 'CL', 'GC', 'ZB', 'ZN'],
  FX: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
  Options: ['SPY C450', 'AAPL P170', 'TSLA C300'],
  Crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
};
