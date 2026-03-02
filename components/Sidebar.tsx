'use client'

import { LayoutDashboard, TrendingUp, List, BarChart2, Settings, ChevronLeft, Wallet, Shield, Globe, Heart } from 'lucide-react'
import { TabType } from './DashboardClient'
import { formatCurrency, formatPercent, getPnLClass } from '@/lib/utils'

interface SidebarProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  open: boolean
  setOpen: (open: boolean) => void
  portfolio: any
}

const navItems = [
  { id: 'overview'     as TabType, icon: LayoutDashboard, label: 'Overview'     },
  { id: 'market'       as TabType, icon: Globe,           label: 'Market'       },
  { id: 'holdings'     as TabType, icon: TrendingUp,      label: 'Holdings'     },
  { id: 'transactions' as TabType, icon: List,            label: 'Transactions' },
  { id: 'analytics'    as TabType, icon: BarChart2,       label: 'Analytics'    },
  { id: 'wishlist'     as TabType, icon: Heart,           label: 'Wishlist'     },
]

export default function Sidebar({ activeTab, setActiveTab, open, setOpen, portfolio }: SidebarProps) {
  return (
    <aside
      aria-label="Main navigation"
      className={[
        'flex flex-col transition-all duration-300 z-40',
        // Mobile: fixed overlay that slides in from left
        // Desktop: relative, always part of the flex flow
        'absolute md:relative inset-y-0 left-0',
        open ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
      style={{
        width: open ? '240px' : '72px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 pb-6">
        <div
          className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
        >
          <span className="text-black font-bold text-sm">A</span>
          <div className="absolute inset-0 rounded-xl pulse-ring" style={{ color: '#eab308' }} />
        </div>
        {open && (
          <div className="overflow-hidden">
            <div className="font-display font-semibold text-lg leading-tight gold-text">Armor</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>INVESTTRACK</div>
          </div>
        )}
      </div>

      {/* Portfolio summary card */}
      {open && portfolio && (
        <div className="mx-3 mb-4 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={12} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>TOTAL VALUE</span>
          </div>
          <div className="font-mono text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(portfolio.totalValue, true)}
          </div>
          <div className={`flex items-center gap-1 mt-1 text-xs ${getPnLClass(portfolio.dayPnL)}`}>
            <span>{portfolio.dayPnL >= 0 ? '▲' : '▼'}</span>
            <span>{formatCurrency(Math.abs(portfolio.dayPnL), true)}</span>
            <span>({formatPercent(portfolio.dayPnLPercent)})</span>
            <span style={{ color: 'var(--text-muted)' }} className="ml-1">today</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2" aria-label="Dashboard sections" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={!open ? item.label : undefined}
              title={!open ? item.label : undefined}
              className="w-full flex items-center gap-3 rounded-xl mb-1 transition-all duration-200"
              style={{
                padding: open ? '10px 14px' : '10px',
                justifyContent: open ? 'flex-start' : 'center',
                background: isActive ? 'rgba(234, 179, 8, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(234, 179, 8, 0.2)' : '1px solid transparent',
                color: isActive ? '#eab308' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} aria-hidden="true" />
              {open && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {isActive && !open && (
                <div
                  className="absolute right-0 w-0.5 h-8 rounded-l"
                  style={{ background: '#eab308' }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
        {open && portfolio && (
          <div className="mb-2 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <Shield size={12} style={{ color: '#10b981' }} />
            <span className="text-xs" style={{ color: '#10b981' }}>{portfolio.riskLevel} Risk</span>
          </div>
        )}
        <button
          className="w-full flex items-center gap-3 rounded-xl transition-all duration-200"
          style={{
            padding: open ? '10px 14px' : '10px',
            justifyContent: open ? 'flex-start' : 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Settings size={18} />
          {open && <span className="text-sm">Settings</span>}
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full items-center justify-center z-10 transition-all"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <ChevronLeft size={12} aria-hidden="true" style={{ transform: open ? '' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
      </button>
    </aside>
  )
}
