import { NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

// Field-length guards — reject oversized payloads before any DB work
const MAX_IDENTIFIER_LEN = 254  // RFC 5321 max email length
const MAX_PASSWORD_LEN   = 128

export async function POST(request: Request) {
  // ── Rate limit: 5 attempts per minute per IP ──────────────────────────────
  const ip  = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl  = rateLimit(`login:${ip}`, 5, 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/username and password are required.' },
        { status: 400 }
      )
    }

    // Length guards — prevent DoS via scrypt with huge inputs
    if (
      typeof identifier !== 'string' || identifier.length > MAX_IDENTIFIER_LEN ||
      typeof password   !== 'string' || password.length   > MAX_PASSWORD_LEN
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
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
      const storedHash    = Buffer.from(user.passwordHash, 'hex')
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
      success:     true,
      mfaRequired: true,
      userId:      user._id.toString(),
      email:       user.email,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
