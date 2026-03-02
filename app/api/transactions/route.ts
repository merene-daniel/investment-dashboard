import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')
    
    const query: Record<string, unknown> = {}
    if (portfolioId) query.portfolioId = portfolioId
    if (type) query.type = type
    
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit)
    
    return NextResponse.json({ success: true, data: transactions })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const transaction = await Transaction.create(body)
    return NextResponse.json({ success: true, data: transaction }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create transaction' }, { status: 500 })
  }
}
