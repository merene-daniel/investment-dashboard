'use client'

import { useState } from 'react'
import { formatCurrency, formatPercent, getPnLClass } from '@/lib/utils'
import { TrendingUp, TrendingDown, Filter, SortAsc } from 'lucide-react'

interface HoldingsTabProps {
  holdings: any[]
  portfolio: any
}

export default function HoldingsTab({ holdings, portfolio }: HoldingsTabProps) {
  const [sortBy, setSortBy] = useState<'marketValue' | 'unrealizedPnL' | 'dayChange' | 'weight'>('marketValue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterType, setFilterType] = useState<string>('All')

  const assetTypes = ['All', ...Array.from(new Set(holdings.map(h => h.assetType)))]

  const filtered = holdings.filter(h => filterType === 'All' || h.assetType === filterType)
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === 'desc' ? -1 : 1
    return (a[sortBy] - b[sortBy]) * dir
  })

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  const totalMV = holdings.reduce((s, h) => s + h.marketValue, 0)
  const totalPnL = holdings.reduce((s, h) => s + h.unrealizedPnL, 0)
  const totalDayPnL = holdings.reduce((s, h) => s + (h.dayChange * h.shares), 0)

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'INVESTED VALUE', value: formatCurrency(totalMV, true), note: `${holdings.length} positions` },
          { label: 'UNREALIZED P&L', value: formatCurrency(totalPnL, true), note: formatPercent((totalPnL / portfolio.totalInvested) * 100), pnl: totalPnL },
          { label: 'DAY P&L', value: formatCurrency(totalDayPnL, true), note: formatPercent((totalDayPnL / totalMV) * 100), pnl: totalDayPnL },
        ].map((item, i) => (
          <div key={i} className="glass-card p-4">
            <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{item.label}</div>
            <div className={`font-mono text-xl font-medium mb-1 ${item.pnl !== undefined ? getPnLClass(item.pnl) : ''}`} style={item.pnl === undefined ? { color: 'var(--text-primary)' } : {}}>
              {item.value}
            </div>
            <div className={`text-xs ${item.pnl !== undefined ? getPnLClass(item.pnl) : ''}`} style={item.pnl === undefined ? { color: 'var(--text-muted)' } : {}}>
              {item.note}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {assetTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterType === type ? 'rgba(234,179,8,0.15)' : 'transparent',
                color: filterType === type ? '#eab308' : 'var(--text-muted)',
                border: filterType === type ? '1px solid rgba(234,179,8,0.25)' : '1px solid transparent',
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          <SortAsc size={12} />
          <span>{sorted.length} positions</span>
        </div>
      </div>

      {/* Holdings table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="text-left">Asset</th>
              <th className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('weight')}>
                <span className="flex items-center justify-end gap-1">Weight {sortBy === 'weight' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
              </th>
              <th className="text-right">Shares</th>
              <th className="text-right">Avg Cost</th>
              <th className="text-right">Price</th>
              <th className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('marketValue')}>
                <span className="flex items-center justify-end gap-1">Market Value {sortBy === 'marketValue' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
              </th>
              <th className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('unrealizedPnL')}>
                <span className="flex items-center justify-end gap-1">Unrealized P&L {sortBy === 'unrealizedPnL' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
              </th>
              <th className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('dayChange')}>
                <span className="flex items-center justify-end gap-1">Day Change {sortBy === 'dayChange' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
              </th>
              <th className="text-right">Beta</th>
              <th className="text-right">Div Yield</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => (
              <tr key={h._id} className="group cursor-pointer">
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: `${h.color || '#eab308'}20`, color: h.color || '#eab308', border: `1px solid ${h.color || '#eab308'}30` }}
                    >
                      {h.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{h.symbol}</span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                        >
                          {h.assetType}
                        </span>
                      </div>
                      <div className="text-xs truncate max-w-32" style={{ color: 'var(--text-muted)' }}>{h.sector}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(h.weight, 100)}%`, background: h.color || '#eab308' }}
                      />
                    </div>
                    <span className="font-mono text-xs w-10 text-right" style={{ color: 'var(--text-secondary)' }}>
                      {h.weight?.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {h.shares.toLocaleString()}
                </td>
                <td className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {formatCurrency(h.avgCostBasis)}
                </td>
                <td className="text-right font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(h.currentPrice)}
                </td>
                <td className="text-right font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(h.marketValue, true)}
                </td>
                <td className="text-right">
                  <div className={`font-mono text-sm ${getPnLClass(h.unrealizedPnL)}`}>
                    {h.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(h.unrealizedPnL, true)}
                  </div>
                  <div className={`text-xs ${getPnLClass(h.unrealizedPnLPercent)}`}>
                    {formatPercent(h.unrealizedPnLPercent)}
                  </div>
                </td>
                <td className="text-right">
                  <div className={`flex items-center justify-end gap-1 font-mono text-sm ${getPnLClass(h.dayChange)}`}>
                    {h.dayChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {formatCurrency(Math.abs(h.dayChange))}
                  </div>
                  <div className={`text-xs text-right ${getPnLClass(h.dayChangePercent)}`}>
                    {formatPercent(h.dayChangePercent)}
                  </div>
                </td>
                <td className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {h.beta?.toFixed(2)}
                </td>
                <td className="text-right font-mono text-sm" style={{ color: h.dividendYield > 0 ? '#10b981' : 'var(--text-muted)' }}>
                  {h.dividendYield > 0 ? `${h.dividendYield.toFixed(2)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
