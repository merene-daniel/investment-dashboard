import { NextResponse } from 'next/server'
import { randomBytes, scryptSync } from 'crypto'
import connectDB from '@/lib/mongodb'
import MFAToken from '@/models/MFAToken'

function generateOTP(): string {
  // Cryptographically secure 6-digit code
  const n = parseInt(randomBytes(3).toString('hex'), 16) % 1_000_000
  return String(n).padStart(6, '0')
}

function hashCode(code: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(code, salt, 32).toString('hex')
  return { hash, salt }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, type, target } = body

    if (!type || !target) {
      return NextResponse.json(
        { success: false, error: 'MFA type and target are required.' },
        { status: 400 }
      )
    }

    if (type !== 'email' && type !== 'phone') {
      return NextResponse.json(
        { success: false, error: 'Invalid MFA type. Must be "email" or "phone".' },
        { status: 400 }
      )
    }

    const normalizedTarget = target.toLowerCase().trim()

    if (type === 'email' && !EMAIL_RE.test(normalizedTarget)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (type === 'phone' && !PHONE_RE.test(target.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number (e.g. +1 555 000 1234).' },
        { status: 400 }
      )
    }

    await connectDB()

    // Invalidate any outstanding tokens for this target
    await MFAToken.deleteMany({ target: normalizedTarget, used: false })

    const code = generateOTP()
    const { hash, salt } = hashCode(code)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await MFAToken.create({
      userId: userId ?? null,
      type,
      target: normalizedTarget,
      codeHash: hash,
      salt,
      expiresAt,
    })

    // ─── Production: send via email (nodemailer) or SMS (Twilio) here ───
    // e.g. await sendEmail({ to: target, subject: 'Your Armor login code', text: `Your code is ${code}` })
    // e.g. await twilioClient.messages.create({ to: target, from: TWILIO_NUMBER, body: `Your Armor code: ${code}` })

    return NextResponse.json({
      success: true,
      message: `Verification code sent to your ${type === 'email' ? 'email' : 'phone'}.`,
      // ⚠️  DEMO ONLY — remove demoCode before going to production
      demoCode: code,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    )
  }
}
