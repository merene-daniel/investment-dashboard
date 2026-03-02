import { NextResponse } from 'next/server'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return { hash, salt }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, password, confirmPassword, country } = body

    // Validate required fields
    if (!email || !username || !password || !confirmPassword || !country) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Username: 3–30 alphanumeric/underscore/hyphen chars
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { success: false, error: 'Username must be 3–30 characters (letters, numbers, _ or -).' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match.' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check uniqueness
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] })
    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'email' : 'username'
      return NextResponse.json(
        { success: false, error: `An account with that ${field} already exists.` },
        { status: 409 }
      )
    }

    const { hash, salt } = hashPassword(password)

    const user = await User.create({
      email: email.toLowerCase(),
      username,
      passwordHash: hash,
      salt,
      country,
    })

    return NextResponse.json(
      { success: true, data: { id: user._id, email: user.email, username: user.username, country: user.country } },
      { status: 201 }
    )
  } catch (error: any) {
    // Duplicate key from race condition
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0] ?? 'field'
      return NextResponse.json(
        { success: false, error: `An account with that ${field} already exists.` },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
