import { NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/username and password are required.' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find by email OR username — lowercase comparison for email
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { username: identifier.trim() },
      ],
    })

    if (!user) {
      // Generic message — never reveal which field is wrong
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      )
    }

    // Timing-safe password comparison
    let passwordMatch = false
    try {
      const storedHash = Buffer.from(user.passwordHash, 'hex')
      const candidateHash = scryptSync(password, user.salt, 64)
      passwordMatch = timingSafeEqual(storedHash, candidateHash)
    } catch {
      passwordMatch = false
    }

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      mfaRequired: true,
      userId: user._id.toString(),
      email: user.email,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
