# 💰 Finance Dashboard

A lightweight, zero-dependency personal finance tracker built with vanilla JavaScript (ES2022+). No frameworks, no build tools — just HTML, CSS, and modern JS.

## Features

- 📊 Live charts (Canvas API — no libraries)
- ➕ Add income & expense transactions
- 🏷️ Category breakdown with percentages
- 💾 Persistent storage via `localStorage`
- 📱 Fully responsive (CSS Grid + Flexbox)
- 🌙 Dark/light mode toggle
- 📤 Export transactions to CSV

## Demo

![Finance Dashboard Preview](public/preview.png)

Open `index.html` in any modern browser — no server or build step needed.

## Tech

- **Vanilla JS (ES2022+)** — modules, optional chaining, structuredClone
- **Canvas API** — custom bar and doughnut charts
- **CSS custom properties** — theming and dark mode
- **localStorage** — client-side persistence
- **No dependencies** — zero npm packages

## Structure

```
js-finance-dashboard/
├── index.html          # Entry point
├── styles/
│   └── main.css        # All styles, CSS variables, dark mode
├── src/
│   ├── app.js          # Bootstrap + event wiring
│   ├── store.js        # State management (localStorage)
│   ├── transactions.js # Transaction logic (add, delete, filter)
│   ├── charts.js       # Canvas chart renderers
│   ├── ui.js           # DOM rendering helpers
│   └── export.js       # CSV export
└── public/
    └── preview.png
```

## Author

**Marios Giannoulis** — [mariosgian.com](https://mariosgian.com)
