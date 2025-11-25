/**
 * @fileoverview statistics.ts - Client-side implementations for advanced analytics calculations.
 * This includes functions for VaR, CVaR, Monte Carlo simulations, rolling metrics, and factor analysis.
 */

import { DailyReturn, FactorReturns, MonteCarloData, RollingBeta, RollingMetric, HistoricalEquityPoint, Scenario, FactorAttribution } from './types';

// --- Statistical Helpers ---

/** Calculates the mean of a number array. */
const mean = (arr: number[]): number => arr.reduce((acc, val) => acc + val, 0) / arr.length;

/** Calculates the standard deviation of a number array. */
const stdDev = (arr: number[]): number => {
    if (arr.length < 2) return 0;
    const arrMean = mean(arr);
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - arrMean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
};

/**
 * Standard Normal variate using Box-Muller transform.
 * @returns A random number from a standard normal distribution.
 */
function randomNorm(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Inverse of the standard normal cumulative distribution function.
 * Approximation using the Beasley-Springer-Moro algorithm.
 * @param p The probability (0 < p < 1).
 * @returns The z-score corresponding to the probability.
 */
function normInv(p: number): number {
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const p_low = 0.02425;
  const p_high = 1 - p_low;
  let q, r;
  if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / (((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1));
  } else if (p > p_high) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / (((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1));
  } else {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
}

// --- Analytics Calculations ---

/**
 * Calculates Value-at-Risk (VaR) and Conditional VaR (CVaR) using Historical Simulation.
 * @param returns - An array of historical daily returns.
 * @param confidence - The confidence level (e.g., 0.95 for 95%).
 * @param horizon - The time horizon in days.
 * @returns An object containing the VaR and CVaR.
 */
export function calculateHistoricalVaR(returns: number[], confidence: number, horizon: number): { var: number; cvar: number } {
    if (returns.length === 0) return { var: 0, cvar: 0 };

    const sortedReturns = [...returns].sort((a, b) => a - b);
    const varIndex = Math.floor((1 - confidence) * sortedReturns.length);
    const historicalVar = sortedReturns[varIndex];

    const tailLosses = sortedReturns.slice(0, varIndex);
    const historicalCVar = tailLosses.length > 0 ? mean(tailLosses) : historicalVar;

    // Scale VaR and CVaR to the horizon
    const varValue = historicalVar * Math.sqrt(horizon);
    const cvarValue = historicalCVar * Math.sqrt(horizon);

    return { var: varValue, cvar: cvarValue };
}

/**
 * Calculates Value-at-Risk (VaR) and Conditional VaR (CVaR) using the Parametric method.
 * Assumes returns are normally distributed.
 * @param returns - An array of historical daily returns.
 * @param confidence - The confidence level (e.g., 0.95 for 95%).
 * @param horizon - The time horizon in days.
 * @returns An object containing the VaR and CVaR.
 */
export function calculateParametricVaR(returns: number[], confidence: number, horizon: number): { var: number; cvar: number } {
    if (returns.length < 2) return { var: 0, cvar: 0 };
    
    const mu = mean(returns);
    const sigma = stdDev(returns);
    const z = normInv(1 - confidence); // z-score is negative for left tail

    const varValue = -(mu * horizon + z * sigma * Math.sqrt(horizon));

    // CVaR formula for normal distribution
    const cvarValue = mu * horizon - sigma * Math.sqrt(horizon) * (1 / (1 - confidence)) * (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(z * z) / 2);
    
    return { var: -varValue, cvar: -cvarValue };
}

/**
 * Calculates rolling Sharpe Ratio.
 * @param dailyReturns - Array of daily return objects.
 * @param windowSize - The size of the rolling window.
 * @param riskFreeRate - Annual risk-free rate (default 0).
 * @returns An array of rolling Sharpe ratio metrics.
 */
export function calculateRollingSharpe(dailyReturns: DailyReturn[], windowSize: number, riskFreeRate: number = 0): RollingMetric<'sharpe'>[] {
    if (!dailyReturns || dailyReturns.length === 0) return [];
    const results: RollingMetric<'sharpe'>[] = [];
    const dailyRiskFree = Math.pow(1 + riskFreeRate, 1 / 252) - 1;

    for (let i = windowSize - 1; i < dailyReturns.length; i++) {
        const windowReturns = dailyReturns.slice(i - windowSize + 1, i + 1).map(d => d.return);
        const meanReturn = mean(windowReturns);
        const stdDevReturn = stdDev(windowReturns);

        if (stdDevReturn > 0) {
            const sharpe = ((meanReturn - dailyRiskFree) / stdDevReturn) * Math.sqrt(252);
            results.push({
                date: dailyReturns[i].date,
                sharpe: sharpe,
            });
        }
    }
    return results;
}

/**
 * Calculates rolling Volatility (annualized standard deviation of returns).
 * @param returns - Array of daily returns (numbers).
 * @param windowSize - The size of the rolling window.
 * @returns An array of rolling volatility metrics.
 */
export function calculateRollingVolatility(returns: number[], windowSize: number): RollingMetric<'volatility'>[] {
    const results: RollingMetric<'volatility'>[] = [];
    for (let i = windowSize - 1; i < returns.length; i++) {
        const windowReturns = returns.slice(i - windowSize + 1, i + 1);
        const volatility = stdDev(windowReturns) * Math.sqrt(252); // Annualize
        results.push({
            date: new Date(new Date().setDate(new Date().getDate() - returns.length + i)).toISOString(), // Placeholder date
            volatility: volatility,
        });
    }
    return results;
}

/**
 * Calculates rolling Win Rate.
 * @param dailyReturns - Array of daily return objects.
 * @param windowSize - The size of the rolling window.
 * @returns An array of rolling win rate metrics.
 */
export function calculateRollingWinRate(dailyReturns: DailyReturn[], windowSize: number): RollingMetric<'winRate'>[] {
    if (!dailyReturns || dailyReturns.length === 0) return [];
    const results: RollingMetric<'winRate'>[] = [];
    for (let i = windowSize - 1; i < dailyReturns.length; i++) {
        const window = dailyReturns.slice(i - windowSize + 1, i + 1);
        const wins = window.filter(d => d.isWin).length;
        results.push({
            date: dailyReturns[i].date,
            winRate: wins / windowSize,
        });
    }
    return results;
}


/**
 * Generates Monte Carlo equity curve simulations.
 * This is a simplified bootstrap method, sampling from historical returns.
 * @param historicalEquity - The historical equity data.
 * @param numSimulations - The number of simulations to run.
 * @param horizon - The number of days to project forward.
 * @returns A MonteCarloData object.
 */
export function generateMonteCarloSimulations(historicalEquity: HistoricalEquityPoint[], numSimulations: number, horizon: number): MonteCarloData {
    if (historicalEquity.length < 2) {
        return { actualEquity: [], simulations: [], percentiles: [] };
    }

    // Calculate historical daily returns
    const returns: number[] = [];
    for (let i = 1; i < historicalEquity.length; i++) {
        returns.push((historicalEquity[i].equity - historicalEquity[i - 1].equity) / historicalEquity[i - 1].equity);
    }
    const lastEquity = historicalEquity[historicalEquity.length - 1].equity;

    const simulations: number[][] = [];
    for (let i = 0; i < numSimulations; i++) {
        const simulation: number[] = [lastEquity];
        let currentEquity = lastEquity;
        for (let j = 0; j < horizon; j++) {
            const randomReturn = returns[Math.floor(Math.random() * returns.length)];
            currentEquity *= (1 + randomReturn);
            simulation.push(currentEquity);
        }
        simulations.push(simulation);
    }

    const percentiles: { p5: number; p25: number; p50: number; p75: number; p95: number; }[] = [];
    for (let day = 0; day <= horizon; day++) {
        const dailyValues = simulations.map(sim => sim[day]).sort((a, b) => a - b);
        percentiles.push({
            p5: dailyValues[Math.floor(dailyValues.length * 0.05)],
            p25: dailyValues[Math.floor(dailyValues.length * 0.25)],
            p50: dailyValues[Math.floor(dailyValues.length * 0.50)],
            p75: dailyValues[Math.floor(dailyValues.length * 0.75)],
            p95: dailyValues[Math.floor(dailyValues.length * 0.95)],
        });
    }

    return {
        actualEquity: historicalEquity,
        simulations,
        percentiles,
    };
}


export type Factor = 'Mkt_RF' | 'SMB' | 'HML';

/**
 * Performs Ordinary Least Squares (OLS) regression.
 * y = a + b*x
 * @param y - Dependent variable array.
 * @param x - Independent variable array.
 * @returns Beta (slope) and Alpha (intercept).
 */
function ols(y: number[], x: number[]): { beta: number; alpha: number, stdErr: number } {
    const n = y.length;
    if (n < 2) return { beta: 0, alpha: 0, stdErr: 0 };
    const meanX = mean(x);
    const meanY = mean(y);
    
    const numerator = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0);
    const denominator = x.reduce((acc, xi) => acc + Math.pow(xi - meanX, 2), 0);

    const beta = denominator === 0 ? 0 : numerator / denominator;
    const alpha = meanY - beta * meanX;

    // Calculate Standard Error of the beta coefficient
    if (n <= 2 || denominator === 0) {
        return { beta, alpha, stdErr: 0 };
    }
    const predictions = x.map(xi => alpha + beta * xi);
    const residuals = y.map((yi, i) => yi - predictions[i]);
    const residualSumOfSquares = residuals.reduce((acc, res) => acc + res * res, 0);
    const varianceOfBeta = (residualSumOfSquares / (n - 2)) / denominator;
    const stdErr = Math.sqrt(varianceOfBeta);

    return { beta, alpha, stdErr };
}


/**
 * Calculates rolling factor betas using OLS regression.
 * @param strategyReturns - The strategy's daily returns.
 * @param factorReturns - The market/factor daily returns.
 * @param windowSize - The size of the rolling window.
 * @returns An array of rolling beta objects.
 */
export function calculateRollingBetas(
    strategyReturns: DailyReturn[], 
    factorReturns: FactorReturns, 
    windowSize: number
): RollingBeta[] {
    const results: RollingBeta[] = [];
    const factors: Factor[] = ['Mkt_RF', 'SMB', 'HML'];
    const z_critical = 1.96; // for 95% confidence interval

    if (!strategyReturns || !factorReturns || strategyReturns.length === 0 || factorReturns.dates.length === 0) return [];

    // Align data by date
    const returnsMap = new Map(strategyReturns.map(r => [new Date(r.date).toDateString(), r.return]));

    for (let i = windowSize - 1; i < factorReturns.dates.length; i++) {
        const windowDates = factorReturns.dates.slice(i - windowSize + 1, i + 1);
        
        const y = windowDates.map(date => returnsMap.get(new Date(date).toDateString()) || 0).filter(v => !isNaN(v));

        if (y.length < windowSize) continue;

        const betas: { [key in Factor]?: number } = {};
        const ci: { [key in Factor]?: { lower: number; upper: number } } = {};

        factors.forEach(factor => {
            const factorData = factorReturns[factor];
            if(!factorData) return;
            
            const x = factorData.slice(i - windowSize + 1, i + 1);
            
            if (y.length === x.length) {
                const { beta, stdErr } = ols(y, x);
                betas[factor] = beta;
                ci[factor] = {
                    lower: beta - z_critical * stdErr,
                    upper: beta + z_critical * stdErr,
                };
            }
        });

        results.push({
            date: factorReturns.dates[i],
            betas: betas,
            ci: ci,
        });
    }
    return results;
}


/**
 * Applies a scenario shock to an equity curve.
 * @param equityCurve - The original historical equity points.
 * @param scenario - The shock scenario to apply.
 * @param factorReturns - The historical factor returns for market-based shocks.
 * @returns A new, shocked equity curve.
 */
export function applyScenarioShock(
    equityCurve: HistoricalEquityPoint[],
    scenario: Scenario,
    factorReturns: FactorReturns
): HistoricalEquityPoint[] {
    if (!equityCurve || equityCurve.length < 2) return [];

    const dailyReturns: DailyReturn[] = equityCurve.slice(1).map((current, i) => {
        const previous = equityCurve[i];
        return {
            date: current.date,
            return: (current.equity - previous.equity) / previous.equity,
            isWin: current.equity > previous.equity,
        };
    });

    const marketReturnsMap = new Map(factorReturns.dates.map((date, i) => [new Date(date).toDateString(), factorReturns.Mkt_RF[i]]));

    const shockedReturns = dailyReturns.map(dr => {
        const marketReturn = marketReturnsMap.get(new Date(dr.date).toDateString()) || 0;
        // Simplified shock application: assume beta of 1 to the market shock
        const shockedReturn = dr.return + (marketReturn * scenario.marketShock);
        return shockedReturn;
    });

    const shockedEquityCurve: HistoricalEquityPoint[] = [equityCurve[0]];
    let lastEquity = equityCurve[0].equity;

    for (let i = 0; i < shockedReturns.length; i++) {
        lastEquity *= (1 + shockedReturns[i]);
        shockedEquityCurve.push({
            date: dailyReturns[i].date,
            equity: lastEquity,
        });
    }

    return shockedEquityCurve;
}

/**
 * Calculates cumulative factor contributions.
 * @param factorAttributionData - The daily attribution data.
 * @returns Data formatted for a stacked area chart.
 */
export function calculateCumulativeAttribution(factorAttributionData: FactorAttribution[]): any[] {
    let cumulativeMkt = 0;
    let cumulativeSmb = 0;
    let cumulativeHml = 0;
    let cumulativeAlpha = 0;

    return factorAttributionData.map(d => {
        cumulativeMkt += d.mkt_rf_contrib;
        cumulativeSmb += d.smb_contrib;
        cumulativeHml += d.hml_contrib;
        cumulativeAlpha += d.alpha_contrib;
        return {
            date: d.date,
            mkt_rf: cumulativeMkt * 100, // as percentage
            smb: cumulativeSmb * 100,
            hml: cumulativeHml * 100,
            alpha: cumulativeAlpha * 100,
        };
    });
}
