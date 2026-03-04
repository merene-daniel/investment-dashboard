import connectDB from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'
import Holding from '@/models/Holding'
import Transaction from '@/models/Transaction'
import PerformanceSnapshot from '@/models/PerformanceSnapshot'
import Wishlist from '@/models/Wishlist'
import DashboardClient from '@/components/DashboardClient'

async function getDashboardData() {
  try {
    await connectDB()

    const [portfolios, holdings, transactions, performanceRaw, wishlist] = await Promise.all([
      Portfolio.find({}).sort({ createdAt: -1 }).lean(),
      Holding.find({}).sort({ marketValue: -1 }).lean(),
      Transaction.find({}).sort({ date: -1 }).limit(20).lean(),
      PerformanceSnapshot.find({})
        .sort({ date: 1 })
        .where('date').gte(Date.now() - 365 * 86400000)
        .lean(),
      Wishlist.find({}).sort({ createdAt: -1 }).lean(),
    ])

    const performance = performanceRaw.map((p: any) => ({
      date: new Date(p.date).toISOString().split('T')[0],
      value: p.totalValue,
      return: p.totalReturnPercent,
      benchmark: p.benchmark,
    }))

    return {
      portfolios:   JSON.parse(JSON.stringify(portfolios)),
      holdings:     JSON.parse(JSON.stringify(holdings)),
      transactions: JSON.parse(JSON.stringify(transactions)),
      performance,
      wishlist:     JSON.parse(JSON.stringify(wishlist)),
    }
  } catch (error) {
    console.error('DB Error:', error)
    return {
      portfolios:   [],
      holdings:     [],
      transactions: [],
      performance:  [],
      wishlist:     [],
    }
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  return <DashboardClient initialData={data} />
}
