/**
 * export.js — CSV export for transactions.
 */

/** @param {import('./transactions.js').Transaction[]} transactions */
export function exportCSV(transactions) {
  const headers = ["Date", "Description", "Type", "Category", "Amount (EUR)"];
  const rows = transactions.map(t => [
    t.date, `"${t.description.replace(/"/g,'""')}"`, t.type, t.category,
    t.type === "expense" ? `-${t.amount.toFixed(2)}` : t.amount.toFixed(2),
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url, download: `finance-${new Date().toISOString().slice(0,10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
}
