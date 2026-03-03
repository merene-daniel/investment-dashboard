'use client'

import { Bell, Search, Menu, RefreshCw } from 'lucide-react'
import { formatCurrency, formatPercent, getPnLClass } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TopBarProps {
  portfolio: any
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const tickerData = [
  { symbol: 'AAPL',    price: 189.84,   change:  1.23 },
  { symbol: 'MSFT',    price: 415.26,   change: -0.54 },
  { symbol: 'NVDA',    price: 875.35,   change:  3.21 },
  { symbol: 'AMZN',    price: 186.52,   change:  0.87 },
  { symbol: 'GOOGL',   price: 172.63,   change: -1.12 },
  { symbol: 'JPM',     price: 212.45,   change:  0.34 },
  { symbol: 'BRK.B',   price: 378.90,   change:  0.12 },
  { symbol: 'VOO',     price: 485.62,   change:  0.92 },
  { symbol: 'S&P 500', price: 5243.77,  change:  0.68 },
  { symbol: 'NASDAQ',  price: 16742.39, change:  0.94 },
  { symbol: 'BTC/USD', price: 67842.00, change:  2.34 },
  { symbol: 'ETH/USD', price: 3521.40,  change:  1.87 },
]

export default function TopBar({ portfolio, sidebarOpen, setSidebarOpen }: TopBarProps) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const doubled = [...tickerData, ...tickerData]

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      {/* Ticker */}
      <div
        className="ticker-wrap py-1.5 px-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(234,179,8,0.03)' }}
      >
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mr-8">
              <span className="font-mono text-xs font-medium" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {item.symbol}
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                {formatCurrency(item.price)}
              </span>
              <span className={`font-mono text-xs ${getPnLClass(item.change)}`}>
                {formatPercent(item.change)}
              </span>
              <span style={{ color: 'var(--border)', marginLeft: '8px' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main top bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-sidebar"
            className="lg:hidden"
          >
            <Menu size={18} aria-hidden="true" />
          </Button>

          {portfolio && (
            <div>
              <h1 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {portfolio.name}
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dateStr} · {timeStr}</span>
                <Badge variant="profit" className="text-[10px] uppercase tracking-wider">
                  Market Open
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div role="search" className="relative hidden md:flex items-center">
            <Search
              size={14}
              className="absolute left-3 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search symbol..."
              aria-label="Search for a stock symbol"
              className="pl-8 w-40 h-9 text-sm"
            />
          </div>

          <ThemeToggle />

          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.reload()}
            aria-label="Refresh dashboard data"
            className="hover:rotate-180 transition-transform duration-500"
          >
            <RefreshCw size={16} aria-hidden="true" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            aria-label="Notifications — 1 unread"
            className="relative"
          >
            <Bell size={16} aria-hidden="true" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--gold)' }}
              aria-hidden="true"
            />
          </Button>

          <Avatar className="w-8 h-8">
            <AvatarFallback
              className="text-sm font-semibold text-black"
              style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
            >
              J
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
