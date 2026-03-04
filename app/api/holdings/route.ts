import { NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Holding from '@/models/Holding'

const OBJECT_ID_RE = /^[a-f\d]{24}$/i

const HoldingSchema = z.object({
  portfolioId:   z.string().regex(OBJECT_ID_RE, 'Invalid portfolioId'),
  symbol:        z.string().min(1).max(10).toUpperCase(),
  name:          z.string().min(1).max(100),
  assetType:     z.enum(['stock', 'etf', 'crypto', 'bond', 'other']),
  shares:        z.number().positive(),
  avgCostBasis:  z.number().nonnegative(),
  currentPrice:  z.number().nonnegative(),
})

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')

    // Validate portfolioId format if supplied — prevents arbitrary query injection
    if (portfolioId && !OBJECT_ID_RE.test(portfolioId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid portfolioId format.' },
        { status: 400 }
      )
    }

    const query = portfolioId ? { portfolioId } : {}
    const holdings = await Holding.find(query).sort({ marketValue: -1 })
    return NextResponse.json({ success: true, data: holdings })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch holdings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body   = await request.json()
    const parsed = HoldingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid holding data.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { shares, avgCostBasis, currentPrice, ...rest } = parsed.data

    // Derive computed fields server-side — never trust client-calculated values
    const marketValue          = shares * currentPrice
    const totalCost            = shares * avgCostBasis
    const unrealizedPnL        = marketValue - totalCost
    const unrealizedPnLPercent = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0

    await connectDB()
    const holding = await Holding.create({
      ...rest,
      shares,
      avgCostBasis,
      currentPrice,
      marketValue,
      totalCost,
      unrealizedPnL,
      unrealizedPnLPercent,
    })

    return NextResponse.json({ success: true, data: holding }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create holding' }, { status: 500 })
  }
}
