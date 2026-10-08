/**
 * store.js — State management with localStorage persistence.
 */

const STORAGE_KEY = "finance-dashboard-v1";

/** @returns {import('./transactions.js').Transaction[]} */
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** @param {import('./transactions.js').Transaction[]} transactions */
function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

export const store = { loadTransactions, saveTransactions, clearAll };
