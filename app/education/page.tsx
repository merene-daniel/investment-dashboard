'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  ChevronRight, Shield, Search, X,
  TrendingUp, BarChart2, BookOpen, DollarSign,
  PieChart, Target, Repeat, FileText, Activity,
  Play, Clock, CheckCircle, ChevronDown, ChevronUp,
  Filter, Layers, Percent,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// ─── Types ────────────────────────────────────────────────────────────────────

type Level    = 'beginner' | 'advanced'
type Tag      = 'beginner' | 'advanced' | 'taxes' | 'portfolio' | 'analytics'
type MockType = 'portfolio' | 'chart' | 'table' | 'pie' | 'scatter' | 'form' | 'analytics'

interface Lesson {
  id: number
  title: string
  subtitle: string
  level: Level
  tags: Tag[]
  duration: string        // e.g. "4 min"
  durationSec: number     // for total calc
  icon: React.ElementType
  accentColor: string
  mockType: MockType
  videoDesc: string       // what the recording shows
  summary: string
  takeaways: string[]
}

// ─── Lesson Data ──────────────────────────────────────────────────────────────

const LESSONS: Lesson[] = [
  // ── Beginner ────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'What is Investing?',
    subtitle: 'Core concepts every investor must know',
    level: 'beginner',
    tags: ['beginner', 'portfolio'],
    duration: '3 min',
    durationSec: 180,
    icon: TrendingUp,
    accentColor: '#10b981',
    mockType: 'chart',
    videoDesc: 'Overview of the dashboard landing page — portfolio value card, day P&L indicator, and the real-time performance area chart.',
    summary: `Investing means putting your money into assets — stocks, bonds, ETFs, or real estate — that have the potential to grow in value over time. Unlike keeping cash in a savings account (which barely keeps pace with inflation), investing accepts a measured level of risk in exchange for the opportunity to build meaningful wealth over the long term.\n\nThe David Armor dashboard gives you an instant snapshot of every investment you own, how much it's worth today, and whether you're ahead or behind your cost basis — making the abstract concept of "your money working for you" completely visible.`,
    takeaways: [
      'Investing grows wealth beyond the rate of inflation',
      'Time in the market consistently beats trying to time the market',
      'Even small amounts ($50–$100/month) compound significantly over decades',
      'Know what you own — always understand an asset before buying it',
    ],
  },
  {
    id: 2,
    title: 'How to Read Your Portfolio',
    subtitle: 'Understand every number on your dashboard',
    level: 'beginner',
    tags: ['beginner', 'portfolio', 'analytics'],
    duration: '4 min',
    durationSec: 240,
    icon: BarChart2,
    accentColor: '#3b82f6',
    mockType: 'portfolio',
    videoDesc: 'Walkthrough of the Overview tab — total value, invested amount, unrealised P&L, day change, cash balance, and how to read the 365-day area chart.',
    summary: `The Overview tab is your command centre. At the top you'll find six key metrics: Total Value (what your portfolio is worth right now), Total Invested (what you paid), Total P&L (your gain or loss in dollars), P&L % (your return as a percentage), Day P&L (today's movement), and Cash Balance (available funds).\n\nBelow these cards is a 365-day performance area chart that plots your portfolio value over time. The filled area makes it easy to see periods of growth and drawdown at a glance. A positive slope means your investments are growing — a dip is normal and often a buying opportunity.`,
    takeaways: [
      'P&L = Current Value minus your original Cost Basis',
      'Green numbers mean you\'re ahead; red means you\'re below cost',
      'Day P&L resets to zero at market open each trading day',
      'The area chart uses closing prices — intraday swings aren\'t shown',
    ],
  },
  {
    id: 3,
    title: 'How to Add Transactions',
    subtitle: 'Record buys, sells, and dividends accurately',
    level: 'beginner',
    tags: ['beginner', 'portfolio'],
    duration: '2 min',
    durationSec: 120,
    icon: FileText,
    accentColor: '#8b5cf6',
    mockType: 'form',
    videoDesc: 'Screen recording of adding a BUY transaction — selecting ticker, entering shares and price, setting the date, and watching Holdings and P&L update instantly.',
    summary: `Every position in your portfolio is built from individual transactions. A BUY transaction increases your holding and raises your cost basis. A SELL reduces the holding and realises a gain or loss. Dividends are income events that don't affect share count but do add to your total return.\n\nTo add a transaction in David Armor: navigate to the Transactions tab, click "Add Transaction", choose the type (Buy/Sell/Dividend), enter the ticker symbol, number of shares, price per share, and date. The dashboard recalculates your portfolio metrics in real time once you save.`,
    takeaways: [
      'Always enter the exact price you paid — average cost matters for P&L accuracy',
      'Sell transactions lock in realised gains or losses permanently',
      'Dividend transactions don\'t change share count but increase total return',
      'Use the correct trade date so the performance chart stays accurate',
    ],
  },
  {
    id: 4,
    title: 'Risk vs. Return Explained',
    subtitle: 'Why higher potential gains come with higher uncertainty',
    level: 'beginner',
    tags: ['beginner', 'analytics'],
    duration: '5 min',
    durationSec: 300,
    icon: Activity,
    accentColor: '#ef4444',
    mockType: 'scatter',
    videoDesc: 'Side-by-side comparison in the Security tab — Conservative vs Aggressive risk profiles, beta exposure, and how the risk level badge in the sidebar reflects your overall portfolio stance.',
    summary: `The risk-return tradeoff is the most fundamental concept in investing: assets that offer the chance of higher returns almost always carry a higher probability of significant short-term losses. A government bond might return 4% with near-zero chance of loss. An individual tech stock might return 40% — or drop 40%.\n\nDavid Armor's Security tab shows your portfolio's overall risk level (Conservative, Moderate, or Aggressive) based on your current mix of holdings. The beta metric tells you how much your portfolio moves relative to the S&P 500: a beta of 1.2 means your portfolio tends to move 20% more than the index in either direction.`,
    takeaways: [
      'Higher expected return always comes with higher potential loss',
      'Beta > 1 means your portfolio amplifies market moves; < 1 means it cushions them',
      'Your risk level should match your time horizon and emotional tolerance',
      'Volatility is not permanent loss — only selling during a downturn realises a loss',
    ],
  },
  {
    id: 5,
    title: 'Diversification Basics',
    subtitle: 'Why spreading investments reduces overall risk',
    level: 'beginner',
    tags: ['beginner', 'portfolio'],
    duration: '4 min',
    durationSec: 240,
    icon: PieChart,
    accentColor: '#f59e0b',
    mockType: 'pie',
    videoDesc: 'Holdings tab walkthrough — sector allocation breakdown, how a concentrated position affects overall portfolio risk, and the effect of adding an uncorrelated asset.',
    summary: `Diversification is the practice of spreading your investments across different assets, sectors, and geographies so that a single bad event doesn't devastate your whole portfolio. If 100% of your money is in one stock and that company goes bankrupt, you lose everything. If that stock is 5% of a 20-position portfolio, the impact is manageable.\n\nDavid Armor's Holdings tab shows your sector allocation visually — you can immediately see if you're over-concentrated in Technology or underexposed to defensive sectors like Healthcare and Consumer Staples. A well-diversified portfolio typically spans 5+ sectors with no single holding exceeding 10-15% of total value.`,
    takeaways: [
      'No single holding should exceed 10–15% of your portfolio without a strong reason',
      'Sector diversification reduces industry-specific risk (e.g., a tech sell-off)',
      'Geographic diversification protects against country-specific economic downturns',
      'Correlations matter — assets that rise and fall together don\'t truly diversify',
    ],
  },

  // ── Advanced ─────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: 'Portfolio Allocation Strategies',
    subtitle: 'Strategic vs tactical allocation — building a framework',
    level: 'advanced',
    tags: ['advanced', 'portfolio'],
    duration: '5 min',
    durationSec: 300,
    icon: Layers,
    accentColor: '#eab308',
    mockType: 'portfolio',
    videoDesc: 'Using the Analytics tab to model target allocation — comparing current vs target weights, identifying drift, and planning rebalancing trades.',
    summary: `Strategic asset allocation sets long-term target weights for each asset class (e.g., 60% equities, 30% bonds, 10% alternatives) based on your investment goals, time horizon, and risk tolerance. You set it once and return to it periodically.\n\nTactical allocation overlays short-term adjustments on top of the strategic baseline — temporarily overweighting equities when valuations look attractive, or rotating into bonds when economic conditions deteriorate. David Armor's Analytics tab lets you compare your current allocation against any target and highlights drift — the gap between where you are and where your strategy says you should be.`,
    takeaways: [
      'Strategic allocation is about long-term goals; tactical is about short-term opportunity',
      'A 60/40 equity/bond split has historically balanced growth with stability',
      'Factor exposure (value, growth, momentum) is as important as asset class weight',
      'Review strategic allocation every 2-3 years or after major life changes',
    ],
  },
  {
    id: 7,
    title: 'Risk-Adjusted Returns',
    subtitle: 'Sharpe ratio, Sortino ratio, and what they reveal',
    level: 'advanced',
    tags: ['advanced', 'analytics'],
    duration: '5 min',
    durationSec: 300,
    icon: Target,
    accentColor: '#10b981',
    mockType: 'analytics',
    videoDesc: 'Analytics tab deep dive — reading the performance chart vs benchmark, interpreting alpha and beta values, and understanding what a Sharpe ratio above 1.0 means for your portfolio.',
    summary: `Raw return is only half the story. Two portfolios can both return 15% in a year — but one achieved it with calm, steady gains, while the other lurched up 40% and then crashed 25%. Risk-adjusted metrics capture this difference.\n\nThe Sharpe ratio divides excess return (your return minus the risk-free rate) by standard deviation (volatility). A Sharpe above 1.0 is considered good; above 2.0 is exceptional. The Sortino ratio is similar but only penalises downside volatility — it's more forgiving of upside swings. Armor's Analytics tab displays these metrics alongside alpha (return attributable to your skill vs the market) and beta (market sensitivity).`,
    takeaways: [
      'Sharpe > 1.0 means you\'re being compensated adequately for the risk you\'re taking',
      'Sortino ratio is preferable when your strategy tolerates upside volatility',
      'Positive alpha means your picks outperformed the market on a risk-adjusted basis',
      'Max drawdown shows the worst peak-to-trough loss — a key measure of real-world pain',
    ],
  },
  {
    id: 8,
    title: 'Tax-Loss Harvesting',
    subtitle: 'Strategically realise losses to offset taxable gains',
    level: 'advanced',
    tags: ['advanced', 'taxes'],
    duration: '4 min',
    durationSec: 240,
    icon: DollarSign,
    accentColor: '#6366f1',
    mockType: 'table',
    videoDesc: 'Transactions tab — identifying unrealised losses in the Holdings view, recording a strategic sell, and using the wash-sale 30-day window to plan the re-entry trade.',
    summary: `Tax-loss harvesting is the practice of deliberately selling a position at a loss to generate a capital loss that offsets taxable capital gains elsewhere in your portfolio, reducing your tax bill. If you've realised $10,000 in gains but have a position sitting at a $4,000 unrealised loss, selling it reduces your net taxable gain to $6,000.\n\nThe critical rule to observe is the wash-sale rule (US): you cannot repurchase the same or a substantially identical security within 30 days before or after the sale without disallowing the loss. A common strategy is to sell the losing position and immediately replace it with a similar-but-not-identical ETF, maintaining market exposure while the 30-day window passes.`,
    takeaways: [
      'Capital losses offset capital gains dollar-for-dollar in the same tax year',
      'Up to $3,000 of excess losses can be deducted against ordinary income annually (US)',
      'Respect the wash-sale rule — 30 days before and after the sale date',
      'Harvest losses in taxable accounts only — tax-advantaged accounts (IRA, 401k) don\'t benefit',
    ],
  },
  {
    id: 9,
    title: 'Rebalancing Strategies',
    subtitle: 'Calendar, threshold, and hybrid rebalancing approaches',
    level: 'advanced',
    tags: ['advanced', 'portfolio'],
    duration: '3 min',
    durationSec: 180,
    icon: Repeat,
    accentColor: '#f97316',
    mockType: 'chart',
    videoDesc: 'Portfolio drift visualisation — using the Analytics allocation chart to identify holdings that have grown beyond target weight and simulating the rebalancing trades needed.',
    summary: `As markets move, your carefully planned allocation drifts away from its target. Rebalancing restores it. There are three main approaches:\n\n**Calendar rebalancing** — review and rebalance on a fixed schedule (quarterly, annually). Simple to execute but ignores how far the portfolio has actually drifted.\n\n**Threshold rebalancing** — only rebalance when an asset class drifts more than a set percentage (e.g., 5%) from its target. More reactive and potentially more tax-efficient.\n\n**Hybrid** — rebalance on a schedule but only if drift exceeds a threshold. Balances simplicity with responsiveness.`,
    takeaways: [
      'Rebalancing automatically enforces "sell high, buy low" discipline',
      'In taxable accounts, prioritise rebalancing with new contributions to avoid tax events',
      'Annual rebalancing is sufficient for most long-term investors',
      'Transaction costs should factor into how frequently you rebalance',
    ],
  },
  {
    id: 10,
    title: 'Performance Analytics Interpretation',
    subtitle: 'Read charts, benchmarks, and attribution like a professional',
    level: 'advanced',
    tags: ['advanced', 'analytics'],
    duration: '5 min',
    durationSec: 300,
    icon: BarChart2,
    accentColor: '#ec4899',
    mockType: 'analytics',
    videoDesc: 'Full Analytics tab tour — area chart vs S&P 500 benchmark, sector attribution breakdown, alpha/beta interpretation, and how to use the date range selector to isolate specific periods.',
    summary: `The Analytics tab is the most information-dense part of David Armor. It contains four key analytical tools:\n\n**Performance Chart** — your portfolio return plotted against a benchmark (S&P 500). The gap between the two lines is your alpha over that period.\n\n**Sector Allocation** — a breakdown of your holdings by sector. Compare this to benchmark weights to identify deliberate tilts.\n\n**Risk Metrics** — Sharpe ratio, Sortino ratio, max drawdown, and beta. These tell you whether the returns you earned were worth the risk taken.\n\n**Attribution** — which individual positions contributed most to your total return. A 20% gain in a 2% position adds less value than a 10% gain in a 15% position.`,
    takeaways: [
      'Benchmark comparison reveals whether active decisions added value over passive indexing',
      'A sector overweight is only worth it if that sector\'s excess return compensates for the concentration risk',
      'Position-level attribution shows where your edge actually came from',
      'Look at rolling returns, not just inception-to-date, to identify consistency',
    ],
  },
]

const FILTERS: { id: Tag | 'all'; label: string }[] = [
  { id: 'all',       label: 'All Lessons'  },
  { id: 'beginner',  label: 'Beginner'     },
  { id: 'advanced',  label: 'Advanced'     },
  { id: 'portfolio', label: 'Portfolio'    },
  { id: 'analytics', label: 'Analytics'   },
  { id: 'taxes',     label: 'Taxes'        },
]

// ─── Video Mockup Components ──────────────────────────────────────────────────

function ChartMockup({ color }: { color: string }) {
  const bars = [40, 65, 50, 80, 60, 90, 75, 95, 70, 85]
  return (
    <div className="absolute inset-0 flex items-end justify-around px-4 pb-6 opacity-30">
      {bars.map((h, i) => (
        <div key={i} className="w-4 rounded-t" style={{ height: `${h}%`, background: color }} />
      ))}
    </div>
  )
}

function PortfolioMockup() {
  return (
    <div className="absolute inset-0 p-4 opacity-25 flex flex-col gap-2">
      {[['Total Value', '$48,290'], ['P&L', '+$3,840'], ['Day', '+$142']].map(([label, val]) => (
        <div key={label} className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-xs" style={{ color: '#8c8a77' }}>{label}</span>
          <span className="text-xs font-mono font-semibold" style={{ color: '#eab308' }}>{val}</span>
        </div>
      ))}
      <div className="flex-1 mt-1 rounded-lg overflow-hidden" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.1)' }}>
        <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
          <polyline points="0,50 30,40 60,42 90,25 120,30 150,15 180,18 200,10" fill="none" stroke="#eab308" strokeWidth="2" />
          <polygon points="0,50 30,40 60,42 90,25 120,30 150,15 180,18 200,10 200,60 0,60" fill="rgba(234,179,8,0.15)" />
        </svg>
      </div>
    </div>
  )
}

function TableMockup() {
  const rows = [['AAPL', '25', '$182.50', '+12.4%'], ['MSFT', '10', '$415.20', '+8.1%'], ['GOOGL', '5', '$142.80', '-2.3%']]
  return (
    <div className="absolute inset-0 p-3 opacity-25 flex flex-col gap-1">
      <div className="grid grid-cols-4 gap-1 px-2 mb-1">
        {['Symbol', 'Shares', 'Price', 'P&L'].map(h => (
          <span key={h} className="text-xs font-medium" style={{ color: '#4a4a3a' }}>{h}</span>
        ))}
      </div>
      {rows.map(row => (
        <div key={row[0]} className="grid grid-cols-4 gap-1 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {row.map((cell, i) => (
            <span key={i} className="text-xs font-mono" style={{ color: i === 3 ? (cell.startsWith('+') ? '#10b981' : '#ef4444') : '#8c8a77' }}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

function PieMockup({ color }: { color: string }) {
  const segments = [
    { pct: 35, offset: 0,    c: '#eab308' },
    { pct: 25, offset: 35,   c: color      },
    { pct: 20, offset: 60,   c: '#3b82f6'  },
    { pct: 20, offset: 80,   c: '#8b5cf6'  },
  ]
  const r = 30, cx = 50, cy = 50
  const total = 100
  let cumulative = 0
  const paths = segments.map(s => {
    const start = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += s.pct
    const end = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end)
    const large = s.pct > 50 ? 1 : 0
    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, c: s.c }
  })
  return (
    <div className="absolute inset-0 flex items-center justify-around px-4 opacity-30">
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.c} opacity={0.85} />)}
      </svg>
      <div className="flex flex-col gap-2">
        {[['Tech', '#eab308'], ['Finance', color], ['Health', '#3b82f6'], ['Energy', '#8b5cf6']].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            <span className="text-xs" style={{ color: '#8c8a77' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScatterMockup({ color }: { color: string }) {
  const pts = [[20,70],[30,55],[45,40],[55,60],[35,80],[65,30],[75,25],[50,50],[60,45],[40,65]]
  return (
    <div className="absolute inset-0 p-4 opacity-30">
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <line x1="8" y1="72" x2="95" y2="72" stroke="#4a4a3a" strokeWidth="0.5"/>
        <line x1="8" y1="72" x2="8"  y2="5"  stroke="#4a4a3a" strokeWidth="0.5"/>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color} opacity={0.7} />
        ))}
        <line x1="10" y1="75" x2="90" y2="20" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity={0.5} />
        <text x="50" y="78" fontSize="4" fill="#4a4a3a" textAnchor="middle">Risk</text>
        <text x="2" y="40" fontSize="4" fill="#4a4a3a" textAnchor="middle" transform="rotate(-90 2 40)">Return</text>
      </svg>
    </div>
  )
}

function AnalyticsMockup() {
  return (
    <div className="absolute inset-0 p-3 opacity-25 flex flex-col gap-2">
      <div className="flex-1 rounded-lg overflow-hidden" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.1)' }}>
        <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
          <polyline points="0,40 40,30 80,32 120,15 160,18 200,8"  fill="none" stroke="#eab308" strokeWidth="1.5"/>
          <polyline points="0,40 40,35 80,36 120,28 160,25 200,22" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2"/>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[['Sharpe', '1.42'], ['Alpha', '+3.2%'], ['Beta', '0.87']].map(([k, v]) => (
          <div key={k} className="rounded px-2 py-1 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-xs font-mono" style={{ color: '#eab308' }}>{v}</div>
            <div style={{ fontSize: 9, color: '#4a4a3a' }}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideoThumbnail({ lesson, playing, onPlay }: { lesson: Lesson; playing: boolean; onPlay: () => void }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '16/9', background: '#0d0d0a', border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={onPlay}
      role="button"
      aria-label={`Play: ${lesson.title}`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onPlay() }}
    >
      {/* Decorative mockup background */}
      {lesson.mockType === 'chart'     && <ChartMockup color={lesson.accentColor} />}
      {lesson.mockType === 'portfolio' && <PortfolioMockup />}
      {lesson.mockType === 'table'     && <TableMockup />}
      {lesson.mockType === 'pie'       && <PieMockup color={lesson.accentColor} />}
      {lesson.mockType === 'scatter'   && <ScatterMockup color={lesson.accentColor} />}
      {lesson.mockType === 'analytics' && <AnalyticsMockup />}

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,13,10,0.55) 0%, rgba(13,13,10,0.75) 100%)' }} />

      {/* Play button */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)', boxShadow: '0 0 24px rgba(234,179,8,0.4)' }}
          >
            <Play size={22} className="text-black ml-1" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Playing state */}
      {playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{ background: 'rgba(13,13,10,0.92)' }}>
          <div className="flex items-end gap-1 h-8">
            {[1,2,3,4,5].map(i => (
              <div
                key={i}
                className="w-1.5 rounded-full"
                style={{
                  height: `${20 + Math.sin(i * 1.2) * 14}px`,
                  background: '#eab308',
                  animation: `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <p className="text-xs font-medium" style={{ color: '#eab308' }}>Playing demo…</p>
          <p className="text-xs text-center px-6" style={{ color: 'var(--text-muted)' }}>{lesson.videoDesc}</p>
        </div>
      )}

      {/* Duration badge */}
      <div
        className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      >
        <Clock size={10} style={{ color: '#eab308' }} />
        <span className="text-xs font-medium" style={{ color: '#f5f0e8' }}>{lesson.duration}</span>
      </div>

      {/* Level badge */}
      <div
        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-xs font-semibold capitalize"
        style={{
          background: lesson.level === 'beginner' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)',
          border: `1px solid ${lesson.level === 'beginner' ? 'rgba(16,185,129,0.3)' : 'rgba(234,179,8,0.3)'}`,
          color: lesson.level === 'beginner' ? '#10b981' : '#eab308',
        }}
      >
        {lesson.level}
      </div>
    </div>
  )
}

// ─── Lesson Card ──────────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: Lesson }) {
  const [playing, setPlaying]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const Icon = lesson.icon

  return (
    <article
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <VideoThumbnail lesson={lesson} playing={playing} onPlay={() => setPlaying(p => !p)} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${lesson.accentColor}18`, border: `1px solid ${lesson.accentColor}30` }}
          >
            <Icon size={16} style={{ color: lesson.accentColor }} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>
              {lesson.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{lesson.subtitle}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {lesson.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs capitalize"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Screen recording description */}
        <div className="px-3 py-2 rounded-xl text-xs leading-relaxed" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.1)', color: 'var(--text-muted)' }}>
          <span className="font-medium" style={{ color: '#eab308' }}>📹 Recording: </span>
          {lesson.videoDesc}
        </div>

        {/* Summary */}
        <div>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--text-secondary)',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {lesson.summary.split('\n\n').map((para, i) => (
              <span key={i}>{para}{i < lesson.summary.split('\n\n').length - 1 ? <><br/><br/></> : ''}</span>
            ))}
          </p>
          {lesson.summary.length > 200 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-xs mt-2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {expanded ? <><ChevronUp size={12}/> Show less</> : <><ChevronDown size={12}/> Read more</>}
            </button>
          )}
        </div>

        {/* Key takeaways */}
        <div>
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Key Takeaways
          </p>
          <ul className="flex flex-col gap-1.5">
            {lesson.takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: lesson.accentColor }} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EducationPage() {
  const [search, setSearch]           = useState('')
  const [activeFilter, setActiveFilter] = useState<Tag | 'all'>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return LESSONS.filter(l => {
      const matchesFilter = activeFilter === 'all' || l.tags.includes(activeFilter as Tag)
      const matchesSearch = !q || l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [search, activeFilter])

  const beginnerLessons  = filtered.filter(l => l.level === 'beginner')
  const advancedLessons  = filtered.filter(l => l.level === 'advanced')
  const totalMinutes     = LESSONS.reduce((s, l) => s + l.durationSec, 0) / 60

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Nav ── */}
      <header role="banner">
        <nav
          className="sticky top-0 z-40"
          aria-label="Education page navigation"
          style={{
            background: 'rgba(13,13,10,0.92)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
            <Link href="/" className="flex items-center gap-3" aria-label="Back to David Armor home">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
                aria-hidden="true"
              >
                <Shield size={16} color="#000" />
              </div>
              <span className="text-lg font-bold gold-text" style={{ fontFamily: 'var(--font-display)' }}>
                David Armor
              </span>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-6" aria-label="Site navigation">
              <Link href="/education" className="text-sm font-medium" style={{ color: '#eab308' }}>Education</Link>
              <Link href="/security"  className="text-sm transition-colors hover:text-yellow-400" style={{ color: 'var(--text-secondary)' }}>Security</Link>
              <Link href="/about"     className="text-sm transition-colors hover:text-yellow-400" style={{ color: 'var(--text-secondary)' }}>About</Link>
            </nav>

            <div className="flex items-center justify-end gap-3">
              <ThemeToggle />
              <Link
                href="/dashboard"
                className="btn-primary flex items-center gap-2 text-sm"
                aria-label="Open the investment dashboard"
              >
                Dashboard
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-10 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.06) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#eab308' }}
          >
            <BookOpen size={11} aria-hidden="true" />
            David Armor Education Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Learn to Invest <span className="gold-text">Smarter</span>
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            From first-time investor to portfolio analyst — structured video lessons with text summaries,
            key takeaways, and real dashboard walkthroughs.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search lessons…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search lessons"
              className="w-full pl-11 pr-10 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Filters + Stats ── */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6" role="group" aria-label="Filter lessons">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              aria-pressed={activeFilter === f.id}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeFilter === f.id ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'var(--bg-card)',
                border: activeFilter === f.id ? 'none' : '1px solid var(--border)',
                color: activeFilter === f.id ? '#000' : 'var(--text-secondary)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats strip */}
        <div
          className="flex flex-wrap items-center gap-6 px-5 py-3 rounded-xl mb-10"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {[
            { icon: BookOpen,   value: `${LESSONS.length} lessons`, label: 'total content' },
            { icon: Clock,      value: `${Math.round(totalMinutes)} min`, label: 'total watch time' },
            { icon: Target,     value: '2 levels',   label: 'beginner & advanced' },
            { icon: Percent,    value: '5 topics',   label: 'portfolio, analytics, taxes & more' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Icon size={14} style={{ color: '#eab308' }} aria-hidden="true" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
          {filtered.length !== LESSONS.length && (
            <div className="ml-auto">
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', color: '#eab308' }}>
                Showing {filtered.length} of {LESSONS.length}
              </span>
            </div>
          )}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No lessons found</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try a different search term or filter.</p>
            <button onClick={() => { setSearch(''); setActiveFilter('all') }} className="mt-4 btn-secondary text-sm">
              Clear filters
            </button>
          </div>
        )}

        {/* ── Beginner Section ── */}
        {beginnerLessons.length > 0 && (
          <section aria-labelledby="beginner-heading" className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full" style={{ background: '#10b981' }} aria-hidden="true" />
              <div>
                <h2 id="beginner-heading" className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Beginner
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No prior knowledge needed — build your foundation step by step
                </p>
              </div>
              <span
                className="ml-auto text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
              >
                {beginnerLessons.length} lesson{beginnerLessons.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {beginnerLessons.map(l => <LessonCard key={l.id} lesson={l} />)}
            </div>
          </section>
        )}

        {/* ── Advanced Section ── */}
        {advancedLessons.length > 0 && (
          <section aria-labelledby="advanced-heading" className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full" style={{ background: '#eab308' }} aria-hidden="true" />
              <div>
                <h2 id="advanced-heading" className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Advanced
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Professional techniques for experienced investors and analysts
                </p>
              </div>
              <span
                className="ml-auto text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', color: '#eab308' }}
              >
                {advancedLessons.length} lesson{advancedLessons.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {advancedLessons.map(l => <LessonCard key={l.id} lesson={l} />)}
            </div>
          </section>
        )}
      </div>

      {/* ── CTA ── */}
      <section className="px-6 pb-16">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-10 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
          >
            <Activity size={24} className="text-black" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Ready to apply what you learned?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Open the David Armor dashboard and put these concepts to work with your real portfolio data.
          </p>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Open Dashboard
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        role="contentinfo"
        aria-label="Education page footer"
        className="py-8 px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="David Armor home">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
              aria-hidden="true"
            >
              <Shield size={14} color="#000" />
            </div>
            <span className="text-base font-bold gold-text" style={{ fontFamily: 'var(--font-display)' }}>David Armor</span>
          </Link>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} David Armor Investment Management. Educational content is for informational purposes only.
          </p>
        </div>
      </footer>

    </main>
  )
}
