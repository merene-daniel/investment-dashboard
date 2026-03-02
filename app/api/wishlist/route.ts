import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wishlist from '@/models/Wishlist'

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')

    const query: Record<string, unknown> = {}
    if (portfolioId) query.portfolioId = portfolioId

    const items = await Wishlist.find(query).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const item = await Wishlist.create(body)
    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create wishlist item' },
      { status: 500 }
    )
  }
}
