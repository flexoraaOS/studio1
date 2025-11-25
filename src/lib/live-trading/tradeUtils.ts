// This file contains utility functions for trade-related calculations.

/**
 * =================================================================
 * TRADE CALCULATION UTILS
 * =================================================================
 * This file contains deterministic, well-documented functions for
 * common trade calculations like P&L, slippage, and R-multiple.
 */

import type { CompletedTrade, TradeSide } from './types';

/**
 * Calculates the realized Profit and Loss (P&L) for a trade.
 * @param side - The direction of the trade ('Long' or 'Short').
 * @param entryPrice - The entry price of the trade.
 * @param exitPrice - The exit price of the trade.
 * @param size - The number of shares or contracts.
 * @param fees - Total fees for the trade.
 * @returns The realized P&L.
 */
export function calculateRealizedPnl(
  side: TradeSide,
  entryPrice: number,
  exitPrice: number,
  size: number,
  fees: number
): number {
  if (entryPrice <= 0 || exitPrice <= 0 || size <= 0) return -fees;

  const pnl = side === 'Long'
    ? (exitPrice - entryPrice) * size
    : (entryPrice - exitPrice) * size;
  
  return pnl - fees;
}

/**
 * Calculates slippage for a trade.
 * @param side - The direction of the trade ('Long' | 'Short').
 * @param filledPrice - The actual executed price.
 * @param expectedPrice - The price at which the order was placed (e.g., limit price or market price at time of order).
 * @returns The slippage amount per share/contract. Positive is bad slippage.
 */
export function calculateSlippage(
  side: TradeSide,
  filledPrice: number,
  expectedPrice: number
): number {
  if (filledPrice <= 0 || expectedPrice <= 0) return 0;
  
  return side === 'Long'
    ? filledPrice - expectedPrice
    : expectedPrice - filledPrice;
}

/**
 * Calculates the R-Multiple (Reward/Risk Ratio) of a completed trade.
 * @param entryPrice - The entry price of the trade.
 * @param exitPrice - The exit price of the trade.
 * @param stopLossPrice - The pre-defined stop-loss price.
 * @param side - The direction of the trade ('Long' | 'Short').
 * @returns The R-Multiple of the trade.
 */
export function calculateRMultiple(
  entryPrice: number,
  exitPrice: number,
  stopLossPrice: number,
  side: TradeSide
): number {
  if (entryPrice <= 0 || stopLossPrice <= 0) return 0;

  const riskPerShare = side === 'Long'
    ? entryPrice - stopLossPrice
    : stopLossPrice - entryPrice;

  if (riskPerShare <= 0) return 0;

  const rewardPerShare = side === 'Long'
    ? exitPrice - entryPrice
    : entryPrice - exitPrice;
    
  return rewardPerShare / riskPerShare;
}
