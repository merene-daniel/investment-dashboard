import { NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import connectDB from '@/lib/mongodb'
import MFAToken from '@/models/MFAToken'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // ── Rate limit: 10 attempts per 10 minutes per IP ────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = rateLimit(`mfa-verify:${ip}`, 10, 10 * 60_000)
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  try {
    const body = await request.json()
    const { target, code } = body

    if (!target || !code) {
      return NextResponse.json(
        { success: false, error: 'Target and code are required.' },
        { status: 400 }
      )
    }

    if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Code must be exactly 6 digits.' },
        { status: 400 }
      )
    }

    // Per-target rate limit: 5 guesses per 10 minutes
    const normalizedTarget = String(target).toLowerCase().trim()
    const targetRl = rateLimit(`mfa-verify-target:${normalizedTarget}`, 5, 10 * 60_000)
    if (!targetRl.allowed) return rateLimitResponse(targetRl.resetAt)

    await connectDB()

    // Most recent valid token for this target
    const token = await MFAToken.findOne({
      target: normalizedTarget,
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 })

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Code has expired or was not found. Please request a new code.' },
        { status: 400 }
      )
    }

    // Timing-safe OTP comparison
    let codeMatch = false
    try {
      const storedHash    = Buffer.from(token.codeHash, 'hex')
      const candidateHash = scryptSync(code, token.salt, 32)
      codeMatch = timingSafeEqual(storedHash, candidateHash)
    } catch {
      codeMatch = false
    }

    if (!codeMatch) {
      return NextResponse.json(
        { success: false, error: 'Incorrect code. Please try again.' },
        { status: 400 }
      )
    }

    // Mark token as consumed — single-use
    token.used = true
    await token.save()

    return NextResponse.json({ success: true, message: 'Verification successful.' })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
