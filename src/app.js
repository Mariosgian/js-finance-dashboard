/**
 * app.js — Main entry point. Bootstraps the app and wires up events.
 */

import { add, remove, filter, getTotals, getCategoryBreakdown, getUniqueMonths } from "./transactions.js";
import { renderTransaction, renderCategories } from "./ui.js";
import { drawBarChart } from "./charts.js";
import { exportCSV } from "./export.js";

// ===== Element refs =====
const form = document.getElementById("transactionForm");
const listEl = document.getElementById("transactionsList");
const emptyEl = document.getElementById("emptyState");
const filterType = document.getElementById("filterType");
const filterMonth = document.getElementById("filterMonth");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpensesEl = document.getElementById("totalExpenses");
const balanceEl = document.getElementById("balance");
const categoriesEl = document.getElementById("categoriesGrid");
const barCanvas = document.getElementById("barChart");
const themeToggle = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");
const formError = document.getElementById("formError");

// ===== Init =====
document.getElementById("date").valueAsDate = new Date();
render();

// ===== Events =====
form.addEventListener("submit", e => {
  e.preventDefault();
  const desc = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!desc) return showError("Please enter a description.");
  if (!amount || amount <= 0) return showError("Please enter a valid amount.");
  if (!date) return showError("Please select a date.");

  hideError();
  add({ description: desc, amount, type, category, date });
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
  render();
});

filterType.addEventListener("change", renderList);
filterMonth.addEventListener("change", renderList);
exportBtn.addEventListener("click", () => exportCSV(filter()));
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  themeToggle.textContent = isDark ? "🌙" : "☀️";
});

// ===== Render =====
function render() {
  renderSummary();
  renderList();
  renderChart();
  renderCategoryBreakdown();
  populateMonthFilter();
}

function renderSummary() {
  const { income, expense, balance } = getTotals();
  totalIncomeEl.textContent = `€${income.toFixed(2)}`;
  totalExpensesEl.textContent = `€${expense.toFixed(2)}`;
  balanceEl.textContent = `€${balance.toFixed(2)}`;
  balanceEl.style.color = balance >= 0 ? "var(--income)" : "var(--expense)";
}

function renderList() {
  const txs = filter({ type: filterType.value, month: filterMonth.value });
  listEl.innerHTML = "";
  if (!txs.length) {
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.classList.add("hidden");
  txs.forEach(tx => {
    listEl.appendChild(renderTransaction(tx, id => { remove(id); render(); }));
  });
}

function renderChart() {
  const months = [...new Set(filter().map(t => t.date.slice(0, 7)))].sort().slice(-6);
  const data = months.map(month => {
    const txs = filter({ month });
    return {
      month: month.slice(5),
      income: txs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });
  drawBarChart(barCanvas, data);
  document.getElementById("chartLegend").innerHTML = `
    <span class="legend-item"><span class="legend-dot" style="background:#16a34a"></span>Income</span>
    <span class="legend-item"><span class="legend-dot" style="background:#dc2626"></span>Expenses</span>
  `;
}

function renderCategoryBreakdown() {
  const breakdown = getCategoryBreakdown();
  categoriesEl.innerHTML = "";
  if (!breakdown.length) {
    categoriesEl.innerHTML = `<p class="empty-state">No expense categories yet.</p>`;
    return;
  }
  renderCategories(breakdown).forEach(el => categoriesEl.appendChild(el));
}

function populateMonthFilter() {
  const current = filterMonth.value;
  const months = getUniqueMonths();
  filterMonth.innerHTML = `<option value="all">All months</option>` +
    months.map(m => `<option value="${m}" ${m === current ? "selected" : ""}>${m}</option>`).join("");
}

function showError(msg) {
  formError.textContent = msg;
  formError.classList.remove("hidden");
}
function hideError() {
  formError.classList.add("hidden");
}
