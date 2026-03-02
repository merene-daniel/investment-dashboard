import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'

export async function GET() {
  try {
    await connectDB()
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: portfolios })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const portfolio = await Portfolio.create(body)
    return NextResponse.json({ success: true, data: portfolio }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio' }, { status: 500 })
  }
}
