/**
 * charts.js — Canvas-based chart renderers (no external libraries).
 */

const INCOME_COLOR = "#16a34a";
const EXPENSE_COLOR = "#dc2626";
const GRID_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#e2e8f0";

/**
 * Draw a bar chart showing income vs expenses per month.
 * @param {HTMLCanvasElement} canvas
 * @param {{ month: string, income: number, expense: number }[]} data
 */
export function drawBarChart(canvas, data) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight || 220;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  if (!data.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data yet", W / 2, H / 2);
    return;
  }

  const PAD = { top: 20, right: 16, bottom: 40, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const yStep = Math.ceil(maxVal / 4);
  const yMax = yStep * 4;

  // Grid lines
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + chartH - (i / 4) * chartH;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + chartW, y); ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`€${(yStep * i).toLocaleString()}`, PAD.left - 6, y + 4);
  }

  // Bars
  const groupW = chartW / data.length;
  const barW = Math.min(groupW * 0.35, 28);
  const gap = barW * 0.4;

  data.forEach((d, i) => {
    const gx = PAD.left + i * groupW + groupW / 2;

    // Income bar
    const ih = (d.income / yMax) * chartH;
    ctx.fillStyle = INCOME_COLOR;
    ctx.beginPath();
    ctx.roundRect(gx - barW - gap / 2, PAD.top + chartH - ih, barW, ih, [4, 4, 0, 0]);
    ctx.fill();

    // Expense bar
    const eh = (d.expense / yMax) * chartH;
    ctx.fillStyle = EXPENSE_COLOR;
    ctx.beginPath();
    ctx.roundRect(gx + gap / 2, PAD.top + chartH - eh, barW, eh, [4, 4, 0, 0]);
    ctx.fill();

    // X-axis label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.month, gx, PAD.top + chartH + 16);
  });
}
