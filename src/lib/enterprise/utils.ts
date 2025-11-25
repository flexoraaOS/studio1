// lib/enterprise/utils.ts
import { RiskOfRuinParams, RiskOfRuinResult, MonteCarloScenario } from './types';

/**
 * =================================================================
 * CALCULATION UTILITIES FOR TRADESIGHT PRO ENTERPRISE FEATURES
 * =================================================================
 * This file contains deterministic, well-documented functions for
 * complex analytics calculations. Each utility must have unit tests.
 */

/**
 * Calculates the probability of Ruin based on the Gambler's Ruin formula variation.
 * This provides an estimation of ruin probability given a set of trading parameters.
 * Reference: https://www.investopedia.com/terms/r/ruin-risk-of.asp
 *
 * @param params - The risk parameters for the calculation.
 * @returns The calculated risk of ruin probability (0-1).
 */
export function calculateRiskOfRuin(params: RiskOfRuinParams): RiskOfRuinResult {
  const { winRate, avgWinLossRatio } = params;

  if (winRate <= 0 || avgWinLossRatio <= 0) {
    return { probability: 1, steps: [] };
  }
  
  const edge = winRate * avgWinLossRatio - (1 - winRate);
  if (edge <= 0) {
    return { probability: 1, steps: [] };
  }

  const ruinProbability = Math.pow(((1 - edge) / (1 + edge)), params.bankroll / (params.bankroll * params.riskPerTrade) / avgWinLossRatio);
  
  const steps = Array.from({length: 100}).map((_, i) => {
      return { trades: (i + 1) * 10, ruinProb: 1 - Math.pow(1 - ruinProbability, (i + 1) * 10)}
  });

  return { probability: isNaN(ruinProbability) ? 1: ruinProbability, steps };
}


/**
 * Generates paths for a multi-path Monte Carlo simulation.
 * This is a client-side prototype. For large simulations, a backend is recommended.
 * @param dailyReturns - Historical daily returns to sample from.
 * @param initialEquity - The starting equity for the simulation.
 * @param numSims - The number of simulations to run per scenario.
 * @param horizonDays - The number of days to project forward.
 * @param scenario - The scenario to apply to the returns.
 * @param shockParams - Parameters for the scenario shocks.
 * @returns An array of simulation paths (equity values over time).
 */
export function monteCarloPathSampler(
    dailyReturns: number[],
    initialEquity: number,
    numSims: number,
    horizonDays: number,
    scenario: MonteCarloScenario,
    shockParams: { volShock?: number; trend?: number } = {}
): number[][] {
    if (dailyReturns.length === 0) return [];
    
    let modifiedReturns = [...dailyReturns];

    // Apply scenario modifications to the historical returns distribution
    switch (scenario) {
        case 'VolShock':
            const volShock = shockParams.volShock || 0.5; // default +50% vol
            modifiedReturns = modifiedReturns.map(r => r * (1 + volShock));
            break;
        case 'Trend':
            const trend = shockParams.trend || 0.001; // default +0.1% daily trend
            modifiedReturns = modifiedReturns.map(r => r + trend);
            break;
        case 'MeanRevert':
            // Simulates returns oscillating around the mean
             modifiedReturns = modifiedReturns.map((r, i, arr) => {
                const mean = arr.reduce((a,b)=> a+b,0) / arr.length;
                return r > mean ? r * 0.9 : r * 1.1;
             });
            break;
        case 'Chop':
            // Simulates higher frequency of small positive/negative returns
             modifiedReturns = modifiedReturns.map(r => Math.sign(r) * Math.pow(Math.abs(r), 1.5));
            break;
        case 'Base':
        default:
            // No change
            break;
    }

    const simulations: number[][] = [];
    for (let i = 0; i < numSims; i++) {
        const simulationPath: number[] = [initialEquity];
        let currentEquity = initialEquity;
        for (let j = 0; j < horizonDays; j++) {
            const randomReturn = modifiedReturns[Math.floor(Math.random() * modifiedReturns.length)];
            currentEquity *= (1 + randomReturn);
            simulationPath.push(currentEquity);
        }
        simulations.push(simulationPath);
    }
    
    return simulations;
}

/**
 * A client-side k-means clustering prototype.
 * NOTE: This is for demonstration purposes. For large datasets, this should be
 * performed on the backend.
 * @param data - Array of data points (vectors).
 * @param k - The number of clusters.
 * @param maxIterations - Maximum number of iterations.
 * @returns An array of cluster assignments for each data point.
 */
export function kmeans(data: number[][], k: number, maxIterations = 100): { assignments: number[], centroids: number[][] } {
    if (data.length < k) return { assignments: [], centroids: [] };

    // 1. Initialize centroids randomly
    let centroids: number[][] = [];
    const usedIndices = new Set();
    while (centroids.length < k) {
        const index = Math.floor(Math.random() * data.length);
        if (!usedIndices.has(index)) {
            centroids.push(data[index]);
            usedIndices.add(index);
        }
    }
    
    let assignments: number[] = new Array(data.length);
    
    for (let iter = 0; iter < maxIterations; iter++) {
        // 2. Assign points to the nearest centroid
        for (let i = 0; i < data.length; i++) {
            let bestDistance = Infinity;
            let bestCentroid = -1;
            for (let j = 0; j < k; j++) {
                const distance = Math.sqrt(
                    data[i].reduce((sum, val, dim) => sum + (val - centroids[j][dim]) ** 2, 0)
                );
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestCentroid = j;
                }
            }
            assignments[i] = bestCentroid;
        }

        // 3. Update centroids to be the mean of assigned points
        const newCentroids: number[][] = new Array(k).fill(0).map(() => new Array(data[0].length).fill(0));
        const counts = new Array(k).fill(0);
        
        for (let i = 0; i < data.length; i++) {
            const clusterIndex = assignments[i];
            counts[clusterIndex]++;
            for (let dim = 0; dim < data[i].length; dim++) {
                newCentroids[clusterIndex][dim] += data[i][dim];
            }
        }
        
        for (let j = 0; j < k; j++) {
            if (counts[j] > 0) {
                newCentroids[j] = newCentroids[j].map(val => val / counts[j]);
            } else {
                // Re-initialize centroid if it has no points
                newCentroids[j] = data[Math.floor(Math.random() * data.length)];
            }
        }
        
        // 4. Check for convergence
        const converged = JSON.stringify(centroids) === JSON.stringify(newCentroids);
        centroids = newCentroids;
        if (converged) break;
    }
    
    return { assignments, centroids };
}
