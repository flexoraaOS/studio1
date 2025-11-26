/**
 * =================================================================
 * Flexoraa Trade Journal v1.0 - Universal Calculation Engine
 * =================================================================
 * This file contains the definitive, authoritative logic for all
 * financial calculations within the TradeSight Pro application,
 * including P&L, R-Multiple, and risk, as specified.
 *
 * It is built to handle forex, commodities, stocks, and crypto
 * with precision.
 */

import { Instrument, TradeSide, InstrumentCategory, CompletedTrade, LiveTradeSession } from './types';

// --- Constants ---
const STANDARD_LOT_SIZE = 100000;

// --- Helper Functions ---

/**
 * Determines the pip size for a given Forex pair.
 * @param symbol The trading symbol (e.g., 'EUR/USD', 'USD/JPY').
 * @returns The pip size (0.0001 for most pairs, 0.01 for JPY pairs).
 */
const getPipSize = (symbol: string): number => {
  return symbol.toUpperCase().includes('JPY') ? 0.01 : 0.0001;
};

/**
 * Determines the category of an instrument based on its symbol or existing category.
 * @param instrument The instrument object.
 * @returns A specific asset class category.
 */
const getAssetClass = (instrument: Instrument): InstrumentCategory => {
    // This function can be expanded with more sophisticated logic if needed.
    // For now, we'll rely on the pre-assigned category.
    return instrument.category;
}

// --- Core P&L Calculation ---

interface PnlParams {
    entryPrice: number;
    exitPrice: number;
    size: number; // For stocks/crypto: shares/units. For FX: lots. For futures: contracts.
    side: TradeSide;
    instrument: Instrument;
    // For future use with cross-currency accounts
    // quoteToAccountFxRate?: number; 
}

/**
 * Calculates the gross Profit & Loss for any trade, before fees.
 * @param params The parameters for the P&L calculation.
 * @returns The gross P&L in the instrument's quote currency.
 */
export function calculateGrossPnl(params: PnlParams): number {
    const { entryPrice, exitPrice, size, side, instrument } = params;

    if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(size) || !instrument) {
        return 0;
    }

    const priceDiff = side === 'Long' ? exitPrice - entryPrice : entryPrice - exitPrice;
    const assetClass = getAssetClass(instrument);
    
    // FOREX
    if (assetClass.startsWith('Forex')) {
        const pipSize = getPipSize(instrument.symbol);
        const pips = priceDiff / pipSize;
        const positionUnits = size * STANDARD_LOT_SIZE; // size is in lots
        const grossPnl = pips * positionUnits * pipSize;
        return grossPnl;
    }

    // STOCKS & CRYPTO (treated similarly)
    if (assetClass.startsWith('Stocks') || assetClass.startsWith('Crypto')) {
        // Here, 'size' is the number of shares or coins
        return priceDiff * size;
    }
    
    // FUTURES, COMMODITIES, INDICES (CFDs)
    // This assumes a simple model. A real-world engine would look up tickValue and contract_size.
    if (assetClass.startsWith('Indices') || assetClass.startsWith('Metals') || assetClass.startsWith('Energy')) {
        const pointValue = 1; // Assuming 1 point move = $1 per contract for simplicity
        return priceDiff * pointValue * size;
    }

    // Default fallback
    return priceDiff * size;
}


// --- Core Risk & R-Multiple Calculation ---

interface RiskParams {
    entryPrice: number;
    stopLossPrice: number;
    size: number;
    side: TradeSide;
    instrument: Instrument;
}

/**
 * Calculates the total monetary risk for a trade based on stop-loss.
 * @param params The parameters for the risk calculation.
 * @returns The total risk amount in the instrument's quote currency.
 */
export function calculateRiskAmount(params: RiskParams): number {
    const { entryPrice, stopLossPrice, size, side, instrument } = params;

    if (isNaN(entryPrice) || isNaN(stopLossPrice) || stopLossPrice === entryPrice || isNaN(size)) {
        return 0;
    }
    
    const riskPerUnit = side === 'Long' ? entryPrice - stopLossPrice : stopLossPrice - entryPrice;
    if (riskPerUnit <= 0) return 0; // Invalid stop-loss

    const assetClass = getAssetClass(instrument);

    // FOREX
    if (assetClass.startsWith('Forex')) {
        const pipSize = getPipSize(instrument.symbol);
        const riskPips = riskPerUnit / pipSize;
        const positionUnits = size * STANDARD_LOT_SIZE; // size is in lots
        const riskAmount = riskPips * positionUnits * pipSize;
        return riskAmount;
    }

    // STOCKS, CRYPTO, FUTURES, etc.
    return riskPerUnit * size;
}

/**
 * Calculates the R-Multiple for a completed trade.
 * @param netPnl The net profit or loss of the trade.
 * @param riskAmount The initial calculated risk amount for the trade.
 * @returns The R-Multiple.
 */
export function calculateRMultiple(netPnl: number, riskAmount: number): number {
    if (riskAmount <= 0) return 0;
    return netPnl / riskAmount;
}


// --- Wrapper Functions for UI ---

/**
 * A convenient wrapper to compute all P&L related metrics for the PostTradeModal.
 */
export function computeTradeMetrics(tradeData: {
    entryPriceStr: string,
    exitPriceStr: string,
    stopLossPriceStr: string,
    feesStr: string,
    session: LiveTradeSession | CompletedTrade | null
}) {
    if (!tradeData.session) {
        return { grossPnl: 0, netPnl: 0, rMultiple: 0, riskAmount: 0 };
    }

    const entryPrice = parseFloat(tradeData.entryPriceStr);
    const exitPrice = parseFloat(tradeData.exitPriceStr);
    const stopLossPrice = parseFloat(tradeData.stopLossPriceStr);
    const fees = parseFloat(tradeData.feesStr) || 0;

    const { instrument, side, size } = tradeData.session;

    const grossPnl = calculateGrossPnl({ entryPrice, exitPrice, size, side, instrument });
    const netPnl = grossPnl - fees;

    const riskAmount = calculateRiskAmount({ entryPrice, stopLossPrice, size, side, instrument });
    const rMultiple = calculateRMultiple(netPnl, riskAmount);

    return {
        grossPnl,
        netPnl,
        rMultiple,
        riskAmount
    };
}
