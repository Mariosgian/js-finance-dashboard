/**
 * transactions.js — Business logic for adding, deleting, filtering transactions.
 * @typedef {{ id: string, description: string, amount: number, type: 'income'|'expense', category: string, date: string }} Transaction
 */

import { store } from "./store.js";

/** @type {Transaction[]} */
let _transactions = store.loadTransactions();

export function getAll() { return [..._transactions]; }

/** @param {Omit<Transaction, 'id'>} data */
export function add(data) {
  const tx = { ...data, id: crypto.randomUUID() };
  _transactions.unshift(tx);
  store.saveTransactions(_transactions);
  return tx;
}

/** @param {string} id */
export function remove(id) {
  _transactions = _transactions.filter(t => t.id !== id);
  store.saveTransactions(_transactions);
}

/** @param {{ type?: string, month?: string }} filters */
export function filter({ type = "all", month = "all" } = {}) {
  return _transactions.filter(t => {
    const typeMatch = type === "all" || t.type === type;
    const monthMatch = month === "all" || t.date.startsWith(month);
    return typeMatch && monthMatch;
  });
}

export function getTotals() {
  const income = _transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = _transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function getCategoryBreakdown() {
  const expenses = _transactions.filter(t => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const map = {};
  for (const t of expenses) {
    map[t.category] = (map[t.category] || 0) + t.amount;
  }
  return Object.entries(map).map(([category, amount]) => ({
    category, amount, pct: total > 0 ? Math.round((amount / total) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);
}

export function getUniqueMonths() {
  const months = [...new Set(_transactions.map(t => t.date.slice(0, 7)))];
  return months.sort().reverse();
}
