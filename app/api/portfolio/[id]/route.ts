import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const portfolio = await Portfolio.findById(id)
    if (!portfolio) {
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: portfolio })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const body = await request.json()
    const portfolio = await Portfolio.findByIdAndUpdate(id, body, { new: true })
    if (!portfolio) {
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: portfolio })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update portfolio' }, { status: 500 })
  }
}
