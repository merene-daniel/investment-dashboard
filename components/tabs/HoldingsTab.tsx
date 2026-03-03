'use client'

import { useState } from 'react'
import { formatCurrency, formatPercent, getPnLClass } from '@/lib/utils'
import { TrendingUp, TrendingDown, Filter, SortAsc } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

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
          <Card key={i}>
            <CardContent className="p-4">
              <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{item.label}</div>
              <div className={`font-mono text-xl font-medium mb-1 ${item.pnl !== undefined ? getPnLClass(item.pnl) : ''}`} style={item.pnl === undefined ? { color: 'var(--text-primary)' } : {}}>
                {item.value}
              </div>
              <div className={`text-xs ${item.pnl !== undefined ? getPnLClass(item.pnl) : ''}`} style={item.pnl === undefined ? { color: 'var(--text-muted)' } : {}}>
                {item.note}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {assetTypes.map(type => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => setFilterType(type)}
              style={{
                background: filterType === type ? 'rgba(234,179,8,0.15)' : 'transparent',
                color: filterType === type ? '#eab308' : 'var(--text-muted)',
                border: filterType === type ? '1px solid rgba(234,179,8,0.25)' : '1px solid transparent',
              }}
            >
              {type}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          <SortAsc size={12} />
          <span>{sorted.length} positions</span>
        </div>
      </div>

      {/* Holdings table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Asset</TableHead>
                <TableHead className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('weight')}>
                  <span className="flex items-center justify-end gap-1">Weight {sortBy === 'weight' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
                </TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('marketValue')}>
                  <span className="flex items-center justify-end gap-1">Market Value {sortBy === 'marketValue' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('unrealizedPnL')}>
                  <span className="flex items-center justify-end gap-1">Unrealized P&L {sortBy === 'unrealizedPnL' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => handleSort('dayChange')}>
                  <span className="flex items-center justify-end gap-1">Day Change {sortBy === 'dayChange' ? (sortDir === 'desc' ? '↓' : '↑') : ''}</span>
                </TableHead>
                <TableHead className="text-right">Beta</TableHead>
                <TableHead className="text-right">Div Yield</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((h) => (
                <TableRow key={h._id} className="group cursor-pointer">
                  <TableCell>
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
                          <Badge variant="outline">
                            {h.assetType}
                          </Badge>
                        </div>
                        <div className="text-xs truncate max-w-32" style={{ color: 'var(--text-muted)' }}>{h.sector}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {h.shares.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(h.avgCostBasis)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(h.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(h.marketValue, true)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={h.unrealizedPnL >= 0 ? 'profit' : 'loss'} className="font-mono text-sm">
                      {h.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(h.unrealizedPnL, true)}
                    </Badge>
                    <div className={`text-xs mt-0.5 ${getPnLClass(h.unrealizedPnLPercent)}`}>
                      {formatPercent(h.unrealizedPnLPercent)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={h.dayChange >= 0 ? 'profit' : 'loss'} className="font-mono text-sm">
                      <span className="flex items-center gap-1">
                        {h.dayChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {formatCurrency(Math.abs(h.dayChange))}
                      </span>
                    </Badge>
                    <div className={`text-xs text-right mt-0.5 ${getPnLClass(h.dayChangePercent)}`}>
                      {formatPercent(h.dayChangePercent)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {h.beta?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm" style={{ color: h.dividendYield > 0 ? '#10b981' : 'var(--text-muted)' }}>
                    {h.dividendYield > 0 ? `${h.dividendYield.toFixed(2)}%` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
