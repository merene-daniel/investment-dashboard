import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Holding from '@/models/Holding'

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')
    
    const query = portfolioId ? { portfolioId } : {}
    const holdings = await Holding.find(query).sort({ marketValue: -1 })
    return NextResponse.json({ success: true, data: holdings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch holdings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const { shares, avgCostBasis, currentPrice } = body
    
    const marketValue = shares * currentPrice
    const totalCost = shares * avgCostBasis
    const unrealizedPnL = marketValue - totalCost
    const unrealizedPnLPercent = (unrealizedPnL / totalCost) * 100
    
    const holding = await Holding.create({
      ...body,
      marketValue,
      totalCost,
      unrealizedPnL,
      unrealizedPnLPercent,
    })
    
    return NextResponse.json({ success: true, data: holding }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create holding' }, { status: 500 })
  }
}
