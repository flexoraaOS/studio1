/**
 * =================================================================
 * MOCK STORAGE UTILS for Live Trading Workspace
 * =================================================================
 * Provides an interface to localStorage for storing drafts and closed trades.
 * This simulates a backend and allows for state persistence during development.
 * 
 * TODO: Replace all functions in this file with actual API calls
 * to a Firestore backend.
 */

import type { TradeDraft, CompletedTrade, ActiveTrade } from './types';

const DRAFTS_KEY = 'ts_drafts';
const TRADES_KEY = 'ts_closed_trades';
const ACTIVE_TRADE_KEY = 'ts_active_trade';

// --- Generic Helpers ---

function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return [];
  }
}

function getObjectFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading object from localStorage key “${key}”:`, error);
    return null;
  }
}

function saveToStorage<T>(key: string, data: T[] | T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
}

// --- Active Trade ---

export function loadActiveTrade(): ActiveTrade | null {
  return getObjectFromStorage<ActiveTrade>(ACTIVE_TRADE_KEY);
}

export function saveActiveTrade(trade: ActiveTrade): void {
  saveToStorage<ActiveTrade>(ACTIVE_TRADE_KEY, trade);
}

export function clearActiveTrade(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACTIVE_TRADE_KEY);
}


// --- Drafts ---

/**
 * Loads all trade drafts from localStorage.
 * TODO: Replace with `getDocs(collection(db, 'users', userId, 'drafts'))`.
 */
export function loadDrafts(): TradeDraft[] {
  return getFromStorage<TradeDraft>(DRAFTS_KEY);
}

/**
 * Saves or updates a single draft.
 * TODO: Replace with `setDoc(doc(db, 'users', userId, 'drafts', draft.id), draft)`.
 */
export function saveDraft(draft: TradeDraft): void {
  const drafts = loadDrafts();
  const existingIndex = drafts.findIndex(d => d.id === draft.id);
  if (existingIndex > -1) {
    drafts[existingIndex] = draft;
  } else {
    drafts.unshift(draft);
  }
  saveToStorage<TradeDraft[]>(DRAFTS_KEY, drafts);
}

/**
 * Saves an array of trade drafts to localStorage.
 * TODO: Replace with batched writes or individual `setDoc` calls to Firestore.
 */
export function saveDrafts(drafts: TradeDraft[]): void {
  saveToStorage<TradeDraft[]>(DRAFTS_KEY, drafts);
}


/**
 * Deletes a single draft by ID.
 * TODO: Replace with `deleteDoc(doc(db, 'users', userId, 'drafts', draftId))`.
 */
export function deleteDraft(draftId: string): void {
  let drafts = loadDrafts();
  drafts = drafts.filter(d => d.id !== draftId);
  saveToStorage<TradeDraft[]>(DRAFTS_KEY, drafts);
}

/**
 * Deletes all drafts from localStorage.
 * TODO: Replace with a batched delete operation in Firestore.
 */
export function clearDrafts(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(DRAFTS_KEY);
}


// --- Completed Trades ---

/**
 * Loads all completed trades from localStorage.
 * TODO: Replace with `getDocs(collection(db, 'users', userId, 'trades'))`.
 */
export function loadTrades(): CompletedTrade[] {
  return getFromStorage<CompletedTrade>(TRADES_KEY);
}

/**
 * Saves a single completed trade to the list in localStorage.
 * TODO: Replace with `addDoc(collection(db, 'users', userId, 'trades'), trade)`.
 */
export function saveTrade(trade: CompletedTrade): void {
  const trades = loadTrades();
  const existingIndex = trades.findIndex(t => t.id === trade.id);
  if (existingIndex > -1) {
    trades[existingIndex] = trade;
  } else {
    trades.unshift(trade);
  }
  saveToStorage<CompletedTrade[]>(TRADES_KEY, trades);
}

/**
 * Deletes all completed trades from localStorage.
 * TODO: Replace with a batched delete operation in Firestore.
 */
export function clearTrades(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TRADES_KEY);
}
