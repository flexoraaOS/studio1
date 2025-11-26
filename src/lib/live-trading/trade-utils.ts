import { TradeSide } from './types';

/**
 * Computes the Profit and Loss (PnL) of a trade.
 * @param entry - The entry price.
 * @param exit - The exit price.
 * @param size - The size of the trade.
 * @param side - The direction of the trade ('Long' or 'Short').
 * @returns The raw PnL of the trade.
 */
export function computePnL(entry: number, exit: number, size: number, side: TradeSide): number {
  if (isNaN(entry) || isNaN(exit) || isNaN(size) || !side) return 0;
  if (side === 'Long') {
    return (exit - entry) * size;
  }
  return (entry - exit) * size;
}

/**
 * Computes the R-multiple of a trade.
 * @param entry - The entry price.
 * @param exit - The exit price.
 * @param stop - The stop-loss price.
 * @param side - The direction of the trade ('Long' or 'Short').
 * @returns The R-multiple of the trade.
 */
export function computeRMultiple(entry: number, exit: number, stop: number, side: TradeSide): number {
    if (isNaN(entry) || isNaN(exit) || isNaN(stop) || stop === entry) return 0;

    const riskPerUnit = side === 'Long' ? entry - stop : stop - entry;
    if (riskPerUnit <= 0) return 0;

    const pnlPerUnit = side === 'Long' ? exit - entry : entry - exit;

    return pnlPerUnit / riskPerUnit;
}


/**
 * Computes the slippage of a trade.
 * For now, this is a placeholder. A real implementation would compare
 * the intended fill price with the actual executed price.
 * @param expectedPrice - The price at which the trade was intended to be filled.
 * @param actualPrice - The price at which the trade was actually filled.
 * @returns The slippage amount.
 */
export function computeSlippage(expectedPrice: number, actualPrice: number): number {
    if (isNaN(expectedPrice) || isNaN(actualPrice)) return 0;
    return Math.abs(actualPrice - expectedPrice);
}

/**
 * Computes the elapsed time between two timestamps.
 * @param start - The start time (ISO string or Date).
 * @param end - The end time (ISO string or Date).
 * @returns A formatted string representing the elapsed time.
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
