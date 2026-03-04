export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import PerformanceSnapshot from '@/models/PerformanceSnapshot'
import Holding from '@/models/Holding'

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')
    const period = searchParams.get('period') || '1Y'

    if (!portfolioId) {
      return NextResponse.json({ success: false, error: 'portfolioId required' }, { status: 400 })
    }

    const days = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 9999 }[period] || 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [performance, holdings] = await Promise.all([
      PerformanceSnapshot.find({
        portfolioId,
        date: { $gte: startDate },
      }).sort({ date: 1 }),
      Holding.find({ portfolioId }),
    ])

    // Sector allocation
    const sectorMap: Record<string, number> = {}
    for (const h of holdings) {
      sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.marketValue
    }
    const totalMarketValue = holdings.reduce((s, h) => s + h.marketValue, 0)
    const sectorAllocation = Object.entries(sectorMap).map(([sector, value]) => ({
      sector,
      value: Math.round(value * 100) / 100,
      percent: Math.round((value / totalMarketValue) * 10000) / 100,
    })).sort((a, b) => b.value - a.value)

    // Asset type allocation
    const assetMap: Record<string, number> = {}
    for (const h of holdings) {
      assetMap[h.assetType] = (assetMap[h.assetType] || 0) + h.marketValue
    }
    const assetAllocation = Object.entries(assetMap).map(([type, value]) => ({
      type,
      value: Math.round(value * 100) / 100,
      percent: Math.round((value / totalMarketValue) * 10000) / 100,
    }))

    return NextResponse.json({
      success: true,
      data: {
        performance: performance.map(p => ({
          date: p.date.toISOString().split('T')[0],
          value: p.totalValue,
          return: p.totalReturnPercent,
          benchmark: p.benchmark,
        })),
        sectorAllocation,
        assetAllocation,
        metrics: {
          sharpeRatio: 1.42,
          beta: 1.08,
          alpha: 3.21,
          volatility: 14.5,
          maxDrawdown: -18.3,
          winRate: 62.4,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
