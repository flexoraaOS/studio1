
import { TradeSide, Instrument } from './types';

// --- Universal Constants ---
const FOREX_STANDARD_LOT_UNITS = 100000;

/**
 * Determines the pip size for a given Forex pair.
 * @param symbol The trading symbol (e.g., 'EUR/USD', 'USD/JPY').
 * @returns The pip size (0.0001 for most pairs, 0.01 for JPY pairs).
 */
const getPipSize = (symbol: string): number => {
  return symbol.toUpperCase().includes('JPY') ? 0.01 : 0.0001;
};

/**
 * Calculates the value of one pip for a given trade.
 * For simplicity in this version, we assume the account currency is the quote currency.
 * E.g., for EUR/USD, the account is in USD. For USD/JPY, the account is in JPY.
 * A future version would need to handle cross-currency conversions.
 * @param instrument The instrument being traded.
 * @returns The value of one pip for one standard lot.
 */
const getPipValuePerLot = (instrument: Instrument): number => {
  if (!instrument.category.startsWith('Forex')) return 0;
  const pipSize = getPipSize(instrument.symbol);
  return FOREX_STANDARD_LOT_UNITS * pipSize; // e.g., 100,000 * 0.0001 = $10
};


/**
 * Computes the Profit and Loss (PnL) of a trade based on its asset class.
 * @param entry - The entry price.
 * @param exit - The exit price.
 * @param size - The size of the trade (lots for FX, shares/contracts for others).
 * @param side - The direction of the trade ('Long' or 'Short').
 * @param instrument - The instrument being traded.
 * @returns The gross P&L of the trade in the instrument's quote currency.
 */
export function computePnL(entry: number, exit: number, size: number, side: TradeSide, instrument?: Instrument): number {
  if (isNaN(entry) || isNaN(exit) || isNaN(size) || !side || !instrument) return 0;

  const priceDiff = side === 'Long' ? exit - entry : entry - exit;

  switch (instrument.category.split(' ')[0]) {
    case 'Forex': {
      const pipSize = getPipSize(instrument.symbol);
      const pips = priceDiff / pipSize;
      const pipValueForTrade = getPipValuePerLot(instrument) * size;
      return pips * pipValueForTrade;
    }
    
    case 'Stocks':
    case 'Crypto': {
      // For stocks and crypto, size is the quantity of shares/coins
      return priceDiff * size;
    }

    case 'Indices':
    case 'Metals':
    case 'Energy':
    case 'Commodities': {
       // Assuming for CFDs/Futures, 'size' is number of contracts and contract_size is 1 for simplicity.
       // A more robust engine would have a lookup for each instrument's contract_size/tick_value.
       // E.g. Price diff * contract_size * contracts
       const pointValue = 1; // Assuming 1 point move = $1 per contract for simplicity
       return priceDiff * pointValue * size;
    }

    default:
      // Fallback for simple price difference calculation
      return priceDiff * size;
  }
}

/**
 * Computes the R-multiple of a trade, a universal risk-based performance metric.
 * @param entry - The entry price.
 * @param exit - The exit price.
 * @param stop - The stop-loss price.
 * @param side - The direction of the trade ('Long' or 'Short').
 * @returns The R-multiple of the trade.
 */
export function computeRMultiple(entry: number, exit: number, stop: number, side: TradeSide): number {
    if (isNaN(entry) || isNaN(exit) || isNaN(stop) || stop === entry) return 0;

    const riskPerUnit = side === 'Long' ? entry - stop : stop - entry;
    if (riskPerUnit <= 0) return 0; // Stop loss is on the wrong side of entry

    const pnlPerUnit = side === 'Long' ? exit - entry : entry - exit;

    return pnlPerUnit / riskPerUnit;
}


/**
 * Computes the elapsed time between two timestamps.
 * @param start - The start time (ISO string or Date).
 * @param end - The end time (ISO string or Date).
 * @returns A formatted string representing the elapsed time (HH:MM:SS).
 */
export function computeElapsedTime(start: string | Date, end: string | Date): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '00:00:00';
  
  let diff = Math.abs(endDate.getTime() - startDate.getTime()) / 1000;

  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = Math.floor(diff % 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
