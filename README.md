# Aurum — Financial Investment Management Dashboard

A professional-grade investment portfolio management dashboard built with **Next.js 15**, **Tailwind CSS**, and **MongoDB**.

![Dashboard Preview](https://via.placeholder.com/1200x630/0d0d0a/eab308?text=Aurum+Dashboard)

## ✨ Features

- **Real-time Portfolio Overview** — Total value, P&L, day gains/losses with live ticker tape
- **Holdings Management** — Sortable/filterable table with weight, cost basis, unrealized P&L, beta, dividend yield
- **Transaction History** — Full audit trail of buys, sells, dividends, deposits with filters
- **Advanced Analytics** — Performance charts vs benchmark, sector/asset allocation (pie + bar), portfolio radar profile, risk metrics (Sharpe ratio, alpha, beta, max drawdown)
- **Persistent MongoDB Backend** — Mongoose models for Portfolio, Holdings, Transactions, and Performance Snapshots
- **REST API** — Clean Next.js 15 App Router API routes for all data
- **Dark Luxury Theme** — Obsidian/gold design system with Playfair Display + DM Sans typography

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 3 |
| Database | MongoDB + Mongoose |
| Charts | Recharts |
| Icons | Lucide React |
| Language | TypeScript |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure environment
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` with your MongoDB connection string:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/investment_dashboard
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/investment_dashboard
\`\`\`

### 3. Seed the database
\`\`\`bash
npm run seed
\`\`\`

This creates:
- 1 portfolio ("Growth Portfolio Alpha")
- 10 holdings (AAPL, MSFT, NVDA, AMZN, GOOGL, JPM, BRK.B, VOO, QQQ, TLT)
- ~50 transactions (buys, sells, dividends)
- 365 daily performance snapshots

### 4. Start the development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

## 📁 Project Structure

\`\`\`
investment-dashboard/
├── app/
│   ├── api/
│   │   ├── portfolio/       # GET, POST portfolio
│   │   │   └── [id]/        # GET, PUT by ID
│   │   ├── holdings/        # GET, POST holdings
│   │   ├── transactions/    # GET, POST transactions
│   │   └── analytics/       # GET performance + allocations
│   ├── dashboard/
│   │   └── page.tsx         # Server component — fetches data
│   ├── layout.tsx
│   ├── page.tsx             # Redirects to /dashboard
│   └── globals.css
├── components/
│   ├── DashboardClient.tsx  # Client shell with tab routing
│   ├── Sidebar.tsx          # Collapsible navigation
│   ├── TopBar.tsx           # Ticker tape + header
│   └── tabs/
│       ├── OverviewTab.tsx  # Summary + charts + top holdings
│       ├── HoldingsTab.tsx  # Full holdings table
│       ├── TransactionsTab.tsx
│       └── AnalyticsTab.tsx # Deep dive charts
├── lib/
│   ├── mongodb.ts           # Mongoose connection with caching
│   └── utils.ts             # formatCurrency, formatPercent, etc.
├── models/
│   ├── Portfolio.ts
│   ├── Holding.ts
│   ├── Transaction.ts
│   └── PerformanceSnapshot.ts
└── scripts/
    └── seed.js              # Database seeder
\`\`\`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/portfolio` | List all portfolios |
| POST | `/api/portfolio` | Create portfolio |
| GET | `/api/portfolio/:id` | Get portfolio by ID |
| PUT | `/api/portfolio/:id` | Update portfolio |
| GET | `/api/holdings?portfolioId=` | Get holdings |
| POST | `/api/holdings` | Add holding |
| GET | `/api/transactions?portfolioId=&type=&limit=` | Get transactions |
| POST | `/api/transactions` | Record transaction |
| GET | `/api/analytics?portfolioId=&period=1Y` | Performance + allocations |

## 📊 Dashboard Tabs

### Overview
- 4 stat cards (total value, total P&L, day P&L, cash)
- 1-year area chart of portfolio value
- Sector allocation bar breakdown
- Top 5 holdings table
- Recent transaction feed

### Holdings
- Summary cards (invested value, unrealized P&L, day P&L)
- Filter by asset type (Stock, ETF, Bond, Crypto)
- Sortable by: market value, unrealized P&L, day change, weight
- Full data: shares, avg cost, current price, market value, P&L, beta, dividend yield

### Transactions
- Filter by type + symbol search
- Export button (UI ready)
- Add Transaction button (UI ready)
- Full history with fees + status

### Analytics
- 6 risk metrics (Sharpe, Beta, Alpha, Volatility, Max Drawdown, Win Rate)
- Period selector (1W / 1M / 3M / 6M / 1Y)
- Performance area chart
- Monthly returns bar chart
- Sector pie chart
- Portfolio characteristics radar

## 🎨 Design System

- **Background**: Obsidian `#0d0d0a`
- **Accent**: Gold `#eab308`
- **Profit**: Emerald `#10b981`
- **Loss**: Red `#ef4444`
- **Display font**: Playfair Display
- **Body font**: DM Sans
- **Mono font**: DM Mono

## 📝 License

MIT
