'use client'

import { useState, memo } from 'react'
import { formatCurrency, formatPercent, getPnLClass } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AnalyticsTabProps {
  holdings: any[]
  performance: any[]
  portfolio: any
}

const PERIOD_OPTIONS = ['1W', '1M', '3M', '6M', '1Y']

const SECTOR_COLORS: Record<string, string> = {
  Technology: '#eab308',
  Financials: '#3b82f6',
  'Consumer Discretionary': '#10b981',
  'Communication Services': '#8b5cf6',
  Diversified: '#f97316',
  'Fixed Income': '#06b6d4',
  Other: '#6b7280',
}

const metrics = [
  { label: 'Sharpe Ratio', value: '1.42', description: 'Risk-adjusted return', positive: true },
  { label: 'Beta', value: '1.08', description: 'vs. S&P 500', neutral: true },
  { label: 'Alpha', value: '+3.21%', description: 'Excess return', positive: true },
  { label: 'Volatility', value: '14.5%', description: 'Annualized std dev', neutral: true },
  { label: 'Max Drawdown', value: '-18.3%', description: 'Peak to trough', positive: false },
  { label: 'Win Rate', value: '62.4%', description: 'Profitable periods', positive: true },
]

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ color: 'var(--text-muted)' }} className="mb-2">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
              {entry.name === 'Portfolio' ? formatCurrency(entry.value) : `${entry.value?.toFixed(2)}%`}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function AnalyticsTab({ holdings, performance, portfolio }: AnalyticsTabProps) {
  const [period, setPeriod] = useState('1Y')

  const dayCount = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[period] || 365
  const sliced = performance.slice(-dayCount).filter((_, i, arr) => i % Math.ceil(arr.length / 80) === 0)

  // Sector allocation
  const sectorMap: Record<string, number> = {}
  for (const h of holdings) {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.marketValue
  }
  const totalMV = holdings.reduce((s, h) => s + h.marketValue, 0)
  const pieData = Object.entries(sectorMap).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    pct: Math.round((value / totalMV) * 1000) / 10,
    color: SECTOR_COLORS[name] || '#6b7280',
  }))

  // Monthly returns (last 12 months)
  const monthlyData: Record<string, { gain: number; loss: number }> = {}
  for (let i = 1; i < performance.length; i++) {
    const curr = performance[i]
    const prev = performance[i - 1]
    const month = curr.date.substring(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { gain: 0, loss: 0 }
    const change = curr.value - prev.value
    if (change >= 0) monthlyData[month].gain += change
    else monthlyData[month].loss += Math.abs(change)
  }
  const monthlyChart = Object.entries(monthlyData).slice(-12).map(([month, { gain, loss }]) => ({
    month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
    gain: Math.round(gain),
    loss: -Math.round(loss),
  }))

  // Radar data for portfolio characteristics
  const radarData = [
    { subject: 'Growth', value: 72 },
    { subject: 'Income', value: 38 },
    { subject: 'Value', value: 45 },
    { subject: 'Quality', value: 81 },
    { subject: 'Momentum', value: 68 },
    { subject: 'Low Vol', value: 52 },
  ]

  return (
    <div className="space-y-5">
      {/* Risk metrics */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div
                className={`font-mono text-xl font-semibold mb-1 ${
                  m.positive ? 'text-emerald-400' : m.positive === false ? 'text-red-400' : ''
                }`}
                style={m.neutral ? { color: 'var(--text-primary)' } : {}}
              >
                {m.value}
              </div>
              <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{m.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period selector + Performance chart */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Performance vs Benchmark
            </h2>
            <div
              className="flex items-center gap-1 p-1 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              {PERIOD_OPTIONS.map(p => (
                <Button
                  key={p}
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 h-auto text-xs font-mono font-medium transition-all"
                  style={
                    period === p
                      ? { background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.25)' }
                      : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' }
                  }
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={sliced} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(234,179,8,0.06)" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return period === '1W' || period === '1M'
                    ? `${d.getMonth() + 1}/${d.getDate()}`
                    : new Date(v).toLocaleString('default', { month: 'short' })
                }}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                tickLine={false} axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v, true)}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                tickLine={false} axisLine={false} width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={1.5} fill="url(#portfolioGrad)" name="Portfolio" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom row: Monthly returns + Sector pie + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly returns bar chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-0 px-5 pt-5">
            <CardTitle className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Monthly Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-5">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyChart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(234,179,8,0.06)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(Math.abs(v) / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: any) => formatCurrency(Math.abs(v), true)}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="gain" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Pie */}
        <Card>
          <CardHeader className="pb-0 px-5 pt-5">
            <CardTitle className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Sector Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-5">
            <div className="flex items-center justify-center">
              <PieChart width={160} height={160}>
                <Pie data={pieData} cx={80} cy={80} innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => formatCurrency(v, true)}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </div>
            <div className="space-y-2 mt-2">
              {pieData.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  </span>
                  <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio characteristics radar */}
        <Card>
          <CardHeader className="pb-0 px-5 pt-5">
            <CardTitle className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Portfolio Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-5">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <PolarGrid stroke="rgba(234,179,8,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Radar name="Portfolio" dataKey="value" stroke="#eab308" fill="#eab308" fillOpacity={0.15} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {radarData.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>{r.subject}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: '#eab308' }} />
                    </div>
                    <span className="font-mono w-6 text-right" style={{ color: 'var(--text-secondary)' }}>{r.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default memo(AnalyticsTab)
