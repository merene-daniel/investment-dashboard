'use client'

import { formatCurrency, formatPercent, getPnLClass, getPnLBg } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart } from 'lucide-react'

interface OverviewTabProps {
  portfolio: any
  holdings: any[]
  transactions: any[]
  performance: any[]
}

const SECTOR_COLORS: Record<string, string> = {
  Technology: '#eab308',
  Financials: '#3b82f6',
  'Consumer Discretionary': '#10b981',
  'Communication Services': '#8b5cf6',
  Diversified: '#f97316',
  'Fixed Income': '#06b6d4',
  Other: '#6b7280',
}

function StatCard({ title, value, sub, subValue, icon: Icon, color = '#eab308', delay = 0 }: any) {
  return (
    <div
      className="glass-card p-5 fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          {title}
        </span>
      </div>
      <div className="font-mono text-2xl font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      {sub && (
        <div className={`text-xs flex items-center gap-1 ${getPnLClass(parseFloat(subValue || '0'))}`}>
          {parseFloat(subValue || '0') >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-xs"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      >
        <div style={{ color: 'var(--text-muted)' }} className="mb-2">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
              {entry.name === 'value' ? formatCurrency(entry.value) : `${entry.value.toFixed(2)}%`}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function OverviewTab({ portfolio, holdings, transactions, performance }: OverviewTabProps) {
  const sectorMap: Record<string, number> = {}
  for (const h of holdings) {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.marketValue
  }
  const totalMV = holdings.reduce((s, h) => s + h.marketValue, 0)

  const topHoldings = [...holdings].slice(0, 5)

  const chartData = performance.filter((_, i) => i % 2 === 0).map(p => ({
    date: p.date,
    value: p.value,
    return: p.return,
    benchmark: p.benchmark,
  }))

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL VALUE"
          value={formatCurrency(portfolio.totalValue, true)}
          sub={`${formatPercent(portfolio.dayPnLPercent)} today`}
          subValue={portfolio.dayPnLPercent}
          icon={DollarSign}
          color="#eab308"
          delay={0}
        />
        <StatCard
          title="TOTAL P&L"
          value={formatCurrency(portfolio.totalPnL, true)}
          sub={`${formatPercent(portfolio.totalPnLPercent)} all time`}
          subValue={portfolio.totalPnLPercent}
          icon={TrendingUp}
          color={portfolio.totalPnL >= 0 ? '#10b981' : '#ef4444'}
          delay={100}
        />
        <StatCard
          title="DAY P&L"
          value={formatCurrency(portfolio.dayPnL, true)}
          sub={formatPercent(portfolio.dayPnLPercent)}
          subValue={portfolio.dayPnLPercent}
          icon={Activity}
          color={portfolio.dayPnL >= 0 ? '#10b981' : '#ef4444'}
          delay={200}
        />
        <StatCard
          title="CASH BALANCE"
          value={formatCurrency(portfolio.cashBalance, true)}
          sub={`${((portfolio.cashBalance / portfolio.totalValue) * 100).toFixed(1)}% of portfolio`}
          subValue={1}
          icon={PieChart}
          color="#8b5cf6"
          delay={300}
        />
      </div>

      {/* Main chart + Sector allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-card p-5 fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Portfolio Performance
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 rounded" style={{ background: '#eab308' }} />
                <span style={{ color: 'var(--text-muted)' }}>Portfolio</span>
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 rounded opacity-50" style={{ background: '#3b82f6', borderStyle: 'dashed' }} />
                <span style={{ color: 'var(--text-muted)' }}>Benchmark</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(234,179,8,0.06)" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
                }}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={30}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v, true)}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={1.5}
                fill="url(#goldGrad)"
                name="value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Allocation */}
        <div className="glass-card p-5 fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="font-display text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            Sector Allocation
          </h2>
          <div className="space-y-3">
            {Object.entries(sectorMap)
              .sort((a, b) => b[1] - a[1])
              .map(([sector, value]) => {
                const pct = (value / totalMV) * 100
                const color = SECTOR_COLORS[sector] || '#6b7280'
                return (
                  <div key={sector}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-secondary)' }}>{sector}</span>
                      <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Top Holdings + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Holdings */}
        <div className="glass-card overflow-hidden fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="p-5 pb-3">
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Top Holdings
            </h2>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Symbol</th>
                <th className="text-right">Value</th>
                <th className="text-right">P&L</th>
                <th className="text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {topHoldings.map((h) => (
                <tr key={h._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: `${h.color || '#eab308'}20`, color: h.color || '#eab308' }}
                      >
                        {h.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {h.symbol}
                        </div>
                        <div className="text-xs truncate max-w-24" style={{ color: 'var(--text-muted)' }}>
                          {h.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(h.marketValue, true)}
                  </td>
                  <td className={`text-right font-mono text-xs ${getPnLClass(h.unrealizedPnL)}`}>
                    {formatPercent(h.unrealizedPnLPercent)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(h.weight, 100)}%`, background: h.color || '#eab308' }}
                        />
                      </div>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {h.weight?.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card overflow-hidden fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="p-5 pb-3">
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Activity
            </h2>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Type</th>
                <th className="text-left">Asset</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((tx) => {
                const typeColors: Record<string, string> = {
                  BUY: '#10b981',
                  SELL: '#ef4444',
                  DIVIDEND: '#eab308',
                  DEPOSIT: '#8b5cf6',
                  WITHDRAWAL: '#f97316',
                }
                const color = typeColors[tx.type] || '#6b7280'
                return (
                  <tr key={tx._id}>
                    <td>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-mono font-medium"
                        style={{
                          background: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <div className="font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {tx.symbol || '—'}
                      </div>
                      <div className="text-xs truncate max-w-24" style={{ color: 'var(--text-muted)' }}>{tx.name}</div>
                    </td>
                    <td className="text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(tx.totalAmount, true)}
                    </td>
                    <td className="text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
