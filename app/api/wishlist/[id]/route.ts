import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wishlist from '@/models/Wishlist'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const deleted = await Wishlist.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Wishlist item not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete wishlist item' },
      { status: 500 }
    )
  }
}
