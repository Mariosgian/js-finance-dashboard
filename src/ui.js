/**
 * ui.js — DOM rendering helpers.
 */

const CATEGORY_ICONS = {
  food: "🍔", transport: "🚌", entertainment: "🎬",
  health: "💊", utilities: "⚡", salary: "💼",
  freelance: "💻", other: "📦",
};

/** @param {number} n */
const fmt = n => `€${Math.abs(n).toFixed(2)}`;

/** @param {import('./transactions.js').Transaction} tx @param {(id: string) => void} onDelete */
export function renderTransaction(tx, onDelete) {
  const li = document.createElement("li");
  li.className = "transaction-item";
  li.dataset.id = tx.id;
  li.innerHTML = `
    <span class="transaction-icon">${CATEGORY_ICONS[tx.category] ?? "📦"}</span>
    <div class="transaction-info">
      <p class="transaction-desc">${escHtml(tx.description)}</p>
      <p class="transaction-meta">${tx.category} · ${tx.date}</p>
    </div>
    <span class="transaction-amount ${tx.type}">
      ${tx.type === "income" ? "+" : "-"}${fmt(tx.amount)}
    </span>
    <button class="transaction-delete" aria-label="Delete transaction" title="Delete">✕</button>
  `;
  li.querySelector(".transaction-delete").addEventListener("click", () => onDelete(tx.id));
  return li;
}

/** @param {{ category: string, amount: number, pct: number }[]} breakdown */
export function renderCategories(breakdown) {
  return breakdown.map(({ category, amount, pct }) => {
    const div = document.createElement("div");
    div.className = "category-item";
    div.innerHTML = `
      <p class="category-name">${CATEGORY_ICONS[category] ?? "📦"} ${category}</p>
      <p class="category-amount">${fmt(amount)}</p>
      <div class="category-bar">
        <div class="category-bar-fill" style="width:${pct}%"></div>
      </div>
    `;
    return div;
  });
}

/** @param {string} s */
function escHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
