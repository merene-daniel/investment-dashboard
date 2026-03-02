'use client'

import { useState, memo } from 'react'
import {
  TrendingUp, TrendingDown, Minus,
  Globe, Clock, ExternalLink,
  ArrowUpRight, ArrowDownRight,
  Newspaper, BarChart3,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface MarketIndex {
  name: string
  ticker: string
  value: string
  change: string
  changePercent: number
  sparkline: number[]
}

interface NewsItem {
  headline: string
  source: string
  time: string
  sentiment: 'Bullish' | 'Bearish' | 'Neutral'
  category: string
}

interface Mover {
  symbol: string
  name: string
  price: string
  changePercent: number
}

interface Sector {
  name: string
  changePercent: number
  ytd: string
}

// ── Static Data ────────────────────────────────────────────────────────────

const INDICES: Record<string, MarketIndex[]> = {
  US: [
    { name: 'S&P 500',           ticker: 'SPX',   value: '5,243.77', change: '+35.61', changePercent:  0.68, sparkline: [96,97,95,98,97,99,98,100,99,101,100,102,101,103,102,104,103,105,104,105] },
    { name: 'NASDAQ Composite',  ticker: 'COMP',  value: '16,742.39', change: '+155.82', changePercent:  0.94, sparkline: [94,96,95,98,96,99,97,101,99,102,100,103,101,104,102,106,104,107,105,107] },
    { name: 'Dow Jones',         ticker: 'DJI',   value: '38,996.39', change: '+78.84', changePercent:  0.20, sparkline: [99,100,98,101,100,102,101,103,102,103,102,104,103,104,103,105,104,105,104,105] },
    { name: 'Russell 2000',      ticker: 'RUT',   value: '2,065.22',  change: '-3.09',  changePercent: -0.15, sparkline: [102,101,103,101,102,100,101,99,100,99,101,100,100,99,100,99,100,99,100,99] },
    { name: 'VIX',               ticker: 'VIX',   value: '13.85',     change: '-0.30',  changePercent: -2.14, sparkline: [105,103,106,104,103,102,103,101,102,100,101,99,100,98,99,97,98,96,97,96] },
    { name: 'US Dollar Index',   ticker: 'DXY',   value: '104.28',    change: '+0.21',  changePercent:  0.20, sparkline: [99,100,99,101,100,101,100,102,101,102,101,103,102,103,102,103,103,104,103,104] },
  ],
  Europe: [
    { name: 'DAX',               ticker: 'DAX',   value: '17,894.11', change: '+92.82', changePercent:  0.52, sparkline: [97,98,97,99,98,100,99,101,100,101,100,102,101,102,101,103,102,103,102,103] },
    { name: 'FTSE 100',          ticker: 'UKX',   value: '7,952.44',  change: '-14.48', changePercent: -0.18, sparkline: [101,100,102,100,101,100,100,99,100,99,100,99,101,100,100,99,100,99,100,99] },
    { name: 'CAC 40',            ticker: 'CAC',   value: '7,805.62',  change: '+24.10', changePercent:  0.31, sparkline: [98,99,98,100,99,100,99,101,100,101,100,101,101,102,101,102,101,102,101,102] },
    { name: 'Euro Stoxx 50',     ticker: 'SX5E',  value: '4,892.73',  change: '+21.53', changePercent:  0.44, sparkline: [97,98,97,99,98,100,99,100,99,101,100,101,100,102,101,102,101,102,101,102] },
    { name: 'IBEX 35',           ticker: 'IBEX',  value: '10,512.80', change: '+67.83', changePercent:  0.65, sparkline: [97,98,97,99,98,100,99,101,100,102,101,102,101,103,102,103,102,103,102,103] },
    { name: 'AEX Index',         ticker: 'AEX',   value: '870.34',    change: '+4.82',  changePercent:  0.56, sparkline: [97,98,97,99,98,100,99,101,100,101,100,102,101,102,101,103,102,103,102,103] },
  ],
  Asia: [
    { name: 'Nikkei 225',        ticker: 'NKY',   value: '38,487.24', change: '+467.87', changePercent:  1.23, sparkline: [96,97,96,98,97,99,98,100,99,101,100,102,101,103,102,104,103,105,104,106] },
    { name: 'Hang Seng',         ticker: 'HSI',   value: '16,511.87', change: '-145.62', changePercent: -0.87, sparkline: [104,103,105,103,104,102,103,101,102,100,101,100,101,100,100,99,100,99,99,98] },
    { name: 'Shanghai Comp.',    ticker: 'SHCOMP', value: '3,042.71', change: '+12.47',  changePercent:  0.41, sparkline: [98,99,98,100,99,100,99,101,100,101,100,101,101,101,100,101,100,101,100,101] },
    { name: 'ASX 200',           ticker: 'AS51',  value: '7,654.30',  change: '+21.40',  changePercent:  0.28, sparkline: [98,99,98,100,99,100,99,101,100,101,100,101,100,101,100,101,101,101,100,101] },
    { name: 'KOSPI',             ticker: 'KOSPI', value: '2,634.70',  change: '-8.69',   changePercent: -0.33, sparkline: [101,100,102,100,101,100,101,99,100,99,100,99,100,99,100,99,100,99,100,99] },
    { name: 'SENSEX',            ticker: 'SENSEX', value: '72,643.72', change: '+245.81', changePercent:  0.34, sparkline: [98,99,98,100,99,100,99,101,100,101,100,101,100,102,101,102,101,102,101,102] },
  ],
}

const SECTORS: Sector[] = [
  { name: 'Technology',              changePercent:  1.42, ytd: '+8.34%'  },
  { name: 'Communication Services',  changePercent:  0.87, ytd: '+5.12%'  },
  { name: 'Consumer Discretionary',  changePercent:  0.65, ytd: '+3.87%'  },
  { name: 'Financials',              changePercent:  0.33, ytd: '+6.22%'  },
  { name: 'Industrials',             changePercent:  0.21, ytd: '+4.18%'  },
  { name: 'Consumer Staples',        changePercent:  0.12, ytd: '+1.54%'  },
  { name: 'Materials',               changePercent: -0.08, ytd: '+2.09%'  },
  { name: 'Healthcare',              changePercent: -0.24, ytd: '-0.87%'  },
  { name: 'Energy',                  changePercent: -0.41, ytd: '+7.63%'  },
  { name: 'Utilities',               changePercent: -0.67, ytd: '-3.21%'  },
  { name: 'Real Estate',             changePercent: -0.92, ytd: '-4.56%'  },
]

const GAINERS: Mover[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.',   price: '$875.40', changePercent:  4.82 },
  { symbol: 'META', name: 'Meta Platforms', price: '$492.15', changePercent:  3.21 },
  { symbol: 'AMD',  name: 'Advanced Micro', price: '$178.42', changePercent:  3.15 },
  { symbol: 'TSLA', name: 'Tesla Inc.',     price: '$177.67', changePercent:  2.87 },
  { symbol: 'NFLX', name: 'Netflix Inc.',   price: '$628.55', changePercent:  2.44 },
]

const LOSERS: Mover[] = [
  { symbol: 'PFE',  name: 'Pfizer Inc.',    price: '$26.82',  changePercent: -3.12 },
  { symbol: 'INTC', name: 'Intel Corp.',    price: '$31.17',  changePercent: -2.89 },
  { symbol: 'XOM',  name: 'Exxon Mobil',   price: '$112.40', changePercent: -1.94 },
  { symbol: 'BA',   name: 'Boeing Co.',     price: '$186.25', changePercent: -1.76 },
  { symbol: 'WBA',  name: 'Walgreens',      price: '$18.92',  changePercent: -1.54 },
]

const NEWS: NewsItem[] = [
  {
    headline: 'Federal Reserve Signals Potential Rate Cuts in H2 as Inflation Cools to 3.1%',
    source: 'Reuters',
    time: '2h ago',
    sentiment: 'Bullish',
    category: 'Macro',
  },
  {
    headline: 'NVIDIA Reports Record Q4 Revenue of $22.1B Driven by Surging AI Chip Demand',
    source: 'Bloomberg',
    time: '4h ago',
    sentiment: 'Bullish',
    category: 'Earnings',
  },
  {
    headline: "China's Manufacturing PMI Contracts for Third Consecutive Month, Raising Growth Concerns",
    source: 'CNBC',
    time: '5h ago',
    sentiment: 'Bearish',
    category: 'Global',
  },
  {
    headline: 'European Central Bank Holds Rates Steady, Opens Door to June Cut Amid Slowing Growth',
    source: 'Financial Times',
    time: '6h ago',
    sentiment: 'Neutral',
    category: 'Macro',
  },
  {
    headline: 'Apple Unveils On-Device AI Features for iPhone, Challenging OpenAI in Consumer Market',
    source: 'WSJ',
    time: '8h ago',
    sentiment: 'Bullish',
    category: 'Technology',
  },
  {
    headline: 'Oil Prices Slide 2% as OPEC+ Production Dispute Raises Supply Outlook Uncertainty',
    source: 'Reuters',
    time: '10h ago',
    sentiment: 'Bearish',
    category: 'Commodities',
  },
]

// ── Helper: Inline SVG Sparkline ───────────────────────────────────────────

const Sparkline = memo(function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const W = 80
  const H = 32
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 2) - 1,
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`
  const color = up ? '#10b981' : '#ef4444'
  const gradId = `sg-${up ? 'u' : 'd'}-${data[0]}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
})

// ── Helper: Sentiment badge ────────────────────────────────────────────────

const SENTIMENT_STYLES: Record<string, { bg: string; color: string }> = {
  Bullish:  { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  Bearish:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  Neutral:  { bg: 'rgba(234,179,8,0.1)',    color: '#eab308' },
}

// ── Main Component ─────────────────────────────────────────────────────────

function MarketTab() {
  const [region, setRegion] = useState<'US' | 'Europe' | 'Asia'>('US')
  const indices = INDICES[region]
  const maxSectorAbs = Math.max(...SECTORS.map(s => Math.abs(s.changePercent)))

  return (
    <div className="space-y-6 pb-4 fade-in-up">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Market Overview
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontFamily: 'var(--font-mono)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-slow inline-block" />
          MARKET OPEN
        </div>
      </div>

      {/* ── Regional tabs + Index Grid ── */}
      <div className="glass-card overflow-hidden">
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Market region"
          className="flex items-center gap-1 p-4 pb-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {(['US', 'Europe', 'Asia'] as const).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={region === r}
              aria-controls={`region-panel-${r}`}
              id={`region-tab-${r}`}
              onClick={() => setRegion(r)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 -mb-px"
              style={
                region === r
                  ? {
                      background: 'var(--bg-card)',
                      borderTop: '1px solid var(--border)',
                      borderLeft: '1px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                      borderBottom: '1px solid var(--bg-card)',
                      color: '#eab308',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: 'var(--text-secondary)',
                    }
              }
            >
              <Globe size={13} aria-hidden="true" />
              {r}
            </button>
          ))}
          <div className="flex-1" />
          <span
            className="text-xs pb-3 pr-1"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Real-time · USD
          </span>
        </div>

        {/* Index cards grid */}
        <div
          role="tabpanel"
          id={`region-panel-${region}`}
          aria-labelledby={`region-tab-${region}`}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px"
          style={{ background: 'var(--border)' }}
        >
          {indices.map((idx) => {
            const up = idx.changePercent >= 0
            return (
              <div
                key={idx.ticker}
                className="p-5 transition-colors duration-200"
                style={{ background: 'var(--bg-card)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card)')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                      {idx.ticker}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {idx.name}
                    </p>
                  </div>
                  <Sparkline data={idx.sparkline} up={up} />
                </div>
                <div className="flex items-end justify-between">
                  <p
                    className="text-xl font-bold"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
                  >
                    {idx.value}
                  </p>
                  <div className="flex items-center gap-1.5 text-right">
                    {up
                      ? <ArrowUpRight size={14} style={{ color: '#10b981' }} />
                      : <ArrowDownRight size={14} style={{ color: '#ef4444' }} />
                    }
                    <div>
                      <p
                        className="text-sm font-semibold leading-tight"
                        style={{ fontFamily: 'var(--font-mono)', color: up ? '#10b981' : '#ef4444' }}
                      >
                        {up ? '+' : ''}{idx.changePercent.toFixed(2)}%
                      </p>
                      <p
                        className="text-xs leading-tight"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                      >
                        {idx.change}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom 3-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Sector Performance (spans 1 col) ── */}
        <section aria-labelledby="sector-heading" className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={15} style={{ color: '#eab308' }} />
            <h3 id="sector-heading" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Performance by Sector
            </h3>
            <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Today
            </span>
          </div>
          <div className="space-y-2.5">
            {SECTORS.map((sector) => {
              const up = sector.changePercent >= 0
              const barWidth = (Math.abs(sector.changePercent) / maxSectorAbs) * 100
              return (
                <div key={sector.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {sector.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                      >
                        YTD {sector.ytd}
                      </span>
                      <span
                        className="text-xs font-semibold w-14 text-right"
                        style={{ fontFamily: 'var(--font-mono)', color: up ? '#10b981' : '#ef4444' }}
                      >
                        {up ? '+' : ''}{sector.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        background: up
                          ? 'linear-gradient(to right, #10b981, #34d399)'
                          : 'linear-gradient(to right, #ef4444, #f87171)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Gainers & Losers (spans 1 col) ── */}
        <div className="space-y-4">
          {/* Gainers */}
          <section aria-labelledby="gainers-heading" className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} style={{ color: '#10b981' }} />
              <h3 id="gainers-heading" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Top Gainers
              </h3>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontFamily: 'var(--font-mono)' }}
              >
                S&P 500
              </span>
            </div>
            <table className="w-full">
              <tbody>
                {GAINERS.map((m, i) => (
                  <tr
                    key={m.symbol}
                    style={{ borderBottom: i < GAINERS.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <td className="py-2 pr-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontFamily: 'var(--font-mono)' }}
                      >
                        {m.symbol.slice(0, 2)}
                      </div>
                    </td>
                    <td className="py-2">
                      <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {m.symbol}
                      </p>
                      <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                        {m.name}
                      </p>
                    </td>
                    <td className="py-2 text-right">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {m.price}
                      </p>
                    </td>
                    <td className="py-2 pl-3 text-right">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}
                      >
                        +{m.changePercent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Losers */}
          <section aria-labelledby="losers-heading" className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={15} style={{ color: '#ef4444' }} aria-hidden="true" />
              <h3 id="losers-heading" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Top Losers
              </h3>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontFamily: 'var(--font-mono)' }}
              >
                S&P 500
              </span>
            </div>
            <table className="w-full">
              <tbody>
                {LOSERS.map((m, i) => (
                  <tr
                    key={m.symbol}
                    style={{ borderBottom: i < LOSERS.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <td className="py-2 pr-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontFamily: 'var(--font-mono)' }}
                      >
                        {m.symbol.slice(0, 2)}
                      </div>
                    </td>
                    <td className="py-2">
                      <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {m.symbol}
                      </p>
                      <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                        {m.name}
                      </p>
                    </td>
                    <td className="py-2 text-right">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {m.price}
                      </p>
                    </td>
                    <td className="py-2 pl-3 text-right">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}
                      >
                        {m.changePercent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* ── Today's Top News (spans 1 col) ── */}
        <section aria-labelledby="news-heading" className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Newspaper size={15} style={{ color: '#eab308' }} aria-hidden="true" />
            <h3 id="news-heading" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Today's Top News
            </h3>
          </div>
          <div className="space-y-1">
            {NEWS.map((item, i) => {
              const s = SENTIMENT_STYLES[item.sentiment]
              return (
                <article
                  key={i}
                  aria-label={`${item.source}: ${item.headline}`}
                  className="group p-3.5 rounded-xl transition-colors duration-150"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                  }}
                >
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', fontFamily: 'var(--font-mono)' }}
                    >
                      {item.source}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: s.bg, color: s.color }}
                      aria-label={`Sentiment: ${item.sentiment}`}
                    >
                      {item.sentiment}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                    >
                      {item.category}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={10} aria-hidden="true" />
                      <time>{item.time}</time>
                    </span>
                  </div>
                  {/* Headline */}
                  <p className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    {item.headline}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default memo(MarketTab)
