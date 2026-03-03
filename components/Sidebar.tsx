'use client'

import Link from 'next/link'
import { LayoutDashboard, TrendingUp, List, BarChart2, Settings, ChevronLeft, Shield, Globe, Heart } from 'lucide-react'
import { TabType } from './DashboardClient'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
  { id: 'wishlist'     as TabType, icon: Heart,           label: 'Wishlist'     },
  { id: 'security'     as TabType, icon: Shield,          label: 'Security'     },
  { id: 'analytics'    as TabType, icon: BarChart2,       label: 'Analytics'    },
]

export default function Sidebar({ activeTab, setActiveTab, open, setOpen, portfolio }: SidebarProps) {
  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Main navigation"
      className={[
        'flex flex-col transition-all duration-300 z-40',
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
      <Link
        href="/"
        aria-label="Armor — go to home page"
        className="flex items-center gap-3 p-5 pb-6 transition-opacity hover:opacity-80"
      >
        <div
          className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
        >
          <Shield size={18} color="#000" aria-hidden="true" />
          <div className="absolute inset-0 rounded-xl pulse-ring" style={{ color: '#eab308' }} />
        </div>
        {open && (
          <div className="overflow-hidden">
            <div className="font-display font-semibold text-lg leading-tight gold-text">Armor</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>INVESTTRACK</div>
          </div>
        )}
      </Link>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-2 pt-2" aria-label="Dashboard sections" role="navigation">
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
                background: isActive ? 'rgba(234,179,8,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(234,179,8,0.2)' : '1px solid transparent',
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} aria-hidden="true" />
              {open && <span className="text-sm font-medium">{item.label}</span>}
              {isActive && !open && (
                <div
                  className="absolute right-0 w-0.5 h-8 rounded-l"
                  style={{ background: 'var(--gold)' }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2">
        <Separator className="mb-2" />
        {open && portfolio && (
          <div className="mb-2 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <Shield size={12} style={{ color: 'var(--profit)' }} />
            <span className="text-xs" style={{ color: 'var(--profit)' }}>{portfolio.riskLevel} Risk</span>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full"
          style={{
            padding: open ? '10px 14px' : '10px',
            justifyContent: open ? 'flex-start' : 'center',
          }}
        >
          <Settings size={18} aria-hidden="true" />
          {open && <span className="text-sm ml-3">Settings</span>}
        </Button>
      </div>

      {/* Collapse toggle — desktop only */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10"
      >
        <ChevronLeft
          size={12}
          aria-hidden="true"
          style={{ transform: open ? '' : 'rotate(180deg)', transition: 'transform 0.3s' }}
        />
      </Button>
    </aside>
  )
}
