import { NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'

const PortfolioSchema = z.object({
  name:        z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  currency:    z.string().length(3).optional().default('USD'),
})

export async function GET() {
  try {
    await connectDB()
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: portfolios })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body   = await request.json()
    const parsed = PortfolioSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid portfolio data.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await connectDB()
    const portfolio = await Portfolio.create(parsed.data)
    return NextResponse.json({ success: true, data: portfolio }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio' }, { status: 500 })
  }
}
