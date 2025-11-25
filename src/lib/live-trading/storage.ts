// This file provides a localStorage wrapper for mock frontend data storage.

/**
 * =================================================================
 * MOCK STORAGE UTILS for Live Trading Workspace
 * =================================================================
 * Provides an interface to localStorage for storing drafts, trades,
 * and audit logs. This simulates a backend and allows for state
 * persistence during development.
 * 
 * TODO: Replace all functions in this file with actual API calls
 * to a Firestore backend.
 */

import type { TradeDraft, CompletedTrade, AuditLogEntry } from './types';

const DRAFTS_KEY = 'live_trading_drafts';
const TRADES_KEY = 'live_trading_trades';
const AUDIT_LOG_KEY = 'live_trading_audit_log';

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

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
}

// --- Drafts ---

export function getDrafts(): TradeDraft[] {
  return getFromStorage<TradeDraft>(DRAFTS_KEY);
}

export function saveDraft(draft: TradeDraft): void {
  const drafts = getDrafts();
  const existingIndex = drafts.findIndex(d => d.id === draft.id);
  if (existingIndex > -1) {
    drafts[existingIndex] = draft;
  } else {
    drafts.unshift(draft); // Add new drafts to the top
  }
  saveToStorage(DRAFTS_KEY, drafts);
}

export function deleteDraft(draftId: string): void {
  let drafts = getDrafts();
  drafts = drafts.filter(d => d.id !== draftId);
  saveToStorage(DRAFTS_KEY, drafts);
}

// --- Trades ---

export function getTrades(): CompletedTrade[] {
  return getFromStorage<CompletedTrade>(TRADES_KEY);
}

export function saveTrade(trade: CompletedTrade): void {
  const trades = getTrades();
  const existingIndex = trades.findIndex(t => t.id === trade.id);
  if (existingIndex > -1) {
    trades[existingIndex] = trade;
  } else {
    trades.unshift(trade);
  }
  saveToStorage(TRADES_KEY, trades);
}

// --- Audit Log ---

export function getAuditLog(): AuditLogEntry[] {
    return getFromStorage<AuditLogEntry>(AUDIT_LOG_KEY);
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logs = getAuditLog();
    const newEntry: AuditLogEntry = {
        ...entry,
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    saveToStorage(AUDIT_LOG_KEY, logs);
}

// --- Utility ---

export function clearAll(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(DRAFTS_KEY);
    window.localStorage.removeItem(TRADES_KEY);
    window.localStorage.removeItem(AUDIT_LOG_KEY);
}
