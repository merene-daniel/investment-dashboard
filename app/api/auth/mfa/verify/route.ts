import { NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import connectDB from '@/lib/mongodb'
import MFAToken from '@/models/MFAToken'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { target, code } = body

    if (!target || !code) {
      return NextResponse.json(
        { success: false, error: 'Target and code are required.' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Code must be exactly 6 digits.' },
        { status: 400 }
      )
    }

    await connectDB()

    // Most recent valid token for this target
    const token = await MFAToken.findOne({
      target: target.toLowerCase().trim(),
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
      const storedHash = Buffer.from(token.codeHash, 'hex')
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
