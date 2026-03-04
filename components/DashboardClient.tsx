'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Skeleton } from '@/components/ui/skeleton'
// Lightweight tabs — no heavy dependencies, static import is fine
import HoldingsTab from './tabs/HoldingsTab'
import TransactionsTab from './tabs/TransactionsTab'

// Loading skeleton shown while a tab chunk downloads (~50–200ms)
function TabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}

// Heavy tabs — dynamically imported so recharts is code-split into separate chunks
// and only downloaded when the user navigates to that tab
const OverviewTab = dynamic(() => import('./tabs/OverviewTab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
})
const AnalyticsTab = dynamic(() => import('./tabs/AnalyticsTab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
})
const MarketTab = dynamic(() => import('./tabs/MarketTab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
})
const WishlistTab = dynamic(() => import('./tabs/WishlistTab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
})
const SecurityTab = dynamic(() => import('./tabs/SecurityTab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
})

export type TabType = 'overview' | 'holdings' | 'transactions' | 'analytics' | 'market' | 'wishlist' | 'security'

interface DashboardClientProps {
  initialData: {
    dbError:      string | null
    portfolios:   any[]
    holdings:     any[]
    transactions: any[]
    performance:  any[]
    wishlist:     any[]
  }
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  // Start closed (matches SSR); open on desktop after hydration
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768)
  }, [])

  const portfolio = initialData.portfolios[0]
  const isDbError   = !!initialData.dbError
  const isEmptyState = !isDbError && !portfolio

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* Mobile backdrop — closes sidebar when tapped outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        portfolio={portfolio}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          portfolio={portfolio}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-grid"
          style={{ backgroundColor: 'var(--bg-primary)' }}
          tabIndex={-1}
        >
          {isDbError ? (
            <DbErrorState message={initialData.dbError!} />
          ) : isEmptyState ? (
            <EmptyState />
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  portfolio={portfolio}
                  holdings={initialData.holdings}
                  transactions={initialData.transactions}
                  performance={initialData.performance}
                />
              )}
              {activeTab === 'holdings' && (
                <HoldingsTab holdings={initialData.holdings} portfolio={portfolio} />
              )}
              {activeTab === 'transactions' && (
                <TransactionsTab transactions={initialData.transactions} portfolio={portfolio} />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsTab
                  holdings={initialData.holdings}
                  performance={initialData.performance}
                  portfolio={portfolio}
                />
              )}
              {activeTab === 'market' && <MarketTab />}
              {activeTab === 'wishlist' && (
                <WishlistTab wishlist={initialData.wishlist} portfolio={portfolio} />
              )}
              {activeTab === 'security' && <SecurityTab />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function DbErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-lg">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>
          Database Connection Failed
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          Could not connect to MongoDB. Check that <code style={{ color: 'var(--gold)' }}>MONGODB_URI</code> is set
          in your environment variables and that your Atlas cluster allows connections from this host.
        </p>
        <code
          className="block text-xs text-left px-4 py-3 rounded mb-4 break-all"
          style={{ background: 'var(--bg-card)', color: 'var(--loss)', border: '1px solid var(--border)' }}
        >
          {message}
        </code>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          On Netlify: Site settings → Environment variables → add <code style={{ color: 'var(--gold)' }}>MONGODB_URI</code>
        </p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>
          No Portfolio Found
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
          Run the seed script to populate the database
        </p>
        <code className="text-sm px-4 py-2 rounded" style={{ background: 'var(--bg-card)', color: 'var(--gold)', border: '1px solid var(--border)' }}>
          npm run seed
        </code>
      </div>
    </div>
  )
}
