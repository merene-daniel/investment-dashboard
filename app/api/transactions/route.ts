import { NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

const OBJECT_ID_RE = /^[a-f\d]{24}$/i
const VALID_TYPES   = ['BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL'] as const

const TransactionSchema = z.object({
  portfolioId: z.string().regex(OBJECT_ID_RE, 'Invalid portfolioId'),
  symbol:      z.string().min(1).max(10).toUpperCase().optional(),
  type:        z.enum(VALID_TYPES),
  shares:      z.number().positive().optional(),
  price:       z.number().nonnegative().optional(),
  amount:      z.number(),
  date:        z.string().datetime().optional(),
  notes:       z.string().max(500).optional(),
})

const MAX_LIMIT = 500
const MIN_LIMIT = 1

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)

    const portfolioId = searchParams.get('portfolioId')
    const type        = searchParams.get('type')

    // Validate and clamp `limit` — prevent unbounded queries
    const rawLimit = parseInt(searchParams.get('limit') ?? '50', 10)
    const limit    = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, MIN_LIMIT), MAX_LIMIT)
      : 50

    if (portfolioId && !OBJECT_ID_RE.test(portfolioId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid portfolioId format.' },
        { status: 400 }
      )
    }

    // Whitelist `type` values to prevent arbitrary query injection
    const query: Record<string, unknown> = {}
    if (portfolioId) query.portfolioId = portfolioId
    if (type && (VALID_TYPES as readonly string[]).includes(type)) query.type = type

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit)

    return NextResponse.json({ success: true, data: transactions })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body   = await request.json()
    const parsed = TransactionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction data.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await connectDB()
    const transaction = await Transaction.create(parsed.data)
    return NextResponse.json({ success: true, data: transaction }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create transaction' }, { status: 500 })
  }
}
