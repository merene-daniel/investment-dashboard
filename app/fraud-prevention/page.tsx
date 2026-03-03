'use client'

import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, Shield, AlertTriangle,
  Lock, Eye, Phone, Mail, MousePointer, CheckCircle,
  XCircle, MessageSquare, AlertCircle,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const LAST_UPDATED = 'March 2026'

const RED_FLAGS = [
  { label: 'Urgent pressure tactics',    desc: 'Messages that demand immediate action — "Your account will be closed in 24 hours unless you verify now" — are almost always fraudulent.' },
  { label: 'Unsolicited contact',         desc: 'Armor will never cold-call you or send unsolicited SMS messages asking for your login credentials, OTP codes, or financial data.' },
  { label: 'Requests for credentials',   desc: 'We will never ask for your password, full social security number, or two-factor authentication codes via email, chat, or phone.' },
  { label: 'Suspicious sender domains',  desc: 'Legitimate Armor emails come only from @armor-invest.com. Be wary of lookalike domains such as armor-invest.net or armorr-invest.com.' },
  { label: 'Unexpected attachments',     desc: 'We do not send unsolicited attachments. If you receive a file from a sender claiming to be Armor, do not open it.' },
  { label: 'Too-good-to-be-true offers', desc: 'Impersonators may promise guaranteed returns, exclusive investment opportunities, or prize winnings. These are scams.' },
]

const ARMOR_PROTECTIONS = [
  {
    icon: Lock,
    color: 'var(--accent-green)',
    tintBg: 'rgba(16,185,129,0.08)',
    tintBorder: 'rgba(16,185,129,0.2)',
    title: 'Password Security',
    desc: 'All passwords are hashed using scrypt with a unique random salt before storage. Even in the unlikely event of a database breach, your plaintext password is never exposed.',
  },
  {
    icon: Shield,
    color: 'var(--accent-blue)',
    tintBg: 'rgba(59,130,246,0.08)',
    tintBorder: 'rgba(59,130,246,0.2)',
    title: 'Multi-Factor Authentication',
    desc: 'Enabling MFA means a stolen password alone is not enough to access your account. A time-limited one-time code sent to your phone or email is required on every login from a new device.',
  },
  {
    icon: Eye,
    color: 'var(--accent-purple)',
    tintBg: 'rgba(139,92,246,0.08)',
    tintBorder: 'rgba(139,92,246,0.2)',
    title: 'Session Management',
    desc: 'Sessions expire automatically after a period of inactivity. Concurrent login detection flags suspicious simultaneous sessions from different locations.',
  },
  {
    icon: AlertTriangle,
    color: 'var(--accent-amber)',
    tintBg: 'rgba(245,158,11,0.08)',
    tintBorder: 'rgba(245,158,11,0.2)',
    title: 'Rate Limiting',
    desc: 'Login attempts are rate-limited and throttled. Repeated failed attempts trigger a temporary lockout and alert email to the account owner.',
  },
  {
    icon: MessageSquare,
    color: 'var(--loss)',
    tintBg: 'rgba(239,68,68,0.08)',
    tintBorder: 'rgba(239,68,68,0.2)',
    title: 'OTP Integrity',
    desc: 'MFA codes are single-use, expire in 10 minutes, and are stored only as cryptographic hashes. A new code request immediately invalidates all outstanding tokens.',
  },
]

const PHISHING_CHANNELS = [
  {
    icon: Mail,
    label: 'Email Phishing',
    color: 'var(--accent-blue)',
    tintBg: 'rgba(59,130,246,0.08)',
    tintBorder: 'rgba(59,130,246,0.2)',
    desc: 'Fake emails mimicking Armor security alerts or account notifications. Always check the sender domain carefully and hover over links before clicking.',
  },
  {
    icon: Phone,
    label: 'Vishing (Voice)',
    color: 'var(--accent-amber)',
    tintBg: 'rgba(245,158,11,0.08)',
    tintBorder: 'rgba(245,158,11,0.2)',
    desc: 'Fraudsters call posing as Armor support agents, often claiming a suspicious login was detected. Armor does not make unsolicited outbound calls.',
  },
  {
    icon: MousePointer,
    label: 'Fake Websites',
    color: 'var(--loss)',
    tintBg: 'rgba(239,68,68,0.08)',
    tintBorder: 'rgba(239,68,68,0.2)',
    desc: 'Lookalike sites that replicate the Armor login page to capture credentials. Always verify the URL is exactly armor-invest.com with a valid HTTPS padlock.',
  },
]

const LEGITIMATE_VS_FRAUD = [
  { type: 'Armor will…',      items: ['Send emails from @armor-invest.com only', 'Include your username in account emails', 'Never ask for your password in any channel', 'Allow you to verify communications at armor-invest.com/verify', 'Contact you only about your existing account'] },
  { type: 'Fraudsters may…', items: ['Use lookalike domains or display names', 'Create urgency to bypass your judgement', 'Ask you to install remote access software', 'Claim there is a problem with your account requiring immediate payment', 'Offer investment opportunities or prize winnings'] },
]

const REPORT_STEPS = [
  { step: '01', title: 'Stop and do not engage',      desc: 'Do not click links, open attachments, or provide any information. Hang up if it is a phone call.' },
  { step: '02', title: 'Document everything',          desc: 'Take screenshots of suspicious emails, messages, or websites. Note the phone number, email address, or URL involved.' },
  { step: '03', title: 'Report to Armor immediately', desc: 'Email security@armor-invest.com with the subject "Fraud Report". Attach your screenshots and describe the contact.' },
  { step: '04', title: 'Report to authorities',        desc: 'File a report with your national cybercrime authority (e.g. IC3 in the US, Action Fraud in the UK, ACSC in Australia).' },
  { step: '05', title: 'Secure your account',          desc: 'If you believe your credentials may be compromised, change your password immediately and enable MFA if not already active.' },
]

export default function FraudPreventionPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Nav ── */}
      <header role="banner">
        <nav className="sticky top-0 z-40" aria-label="Fraud prevention page navigation"
          style={{ background: 'rgba(13,13,10,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="Back to Armor home">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }} aria-hidden="true">
                <Shield size={16} color="#000" />
              </div>
              <span className="text-lg font-bold gold-text" style={{ fontFamily: 'var(--font-display)' }}>Armor</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/" className="hidden md:flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} aria-hidden="true" /> Back to Home
              </Link>
              <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-sm">
                Dashboard <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.05) 0%, transparent 65%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--loss)' }}>
            <AlertTriangle size={11} aria-hidden="true" /> Fraud Prevention
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Stay Safe, <span className="gold-text">Stay Informed</span>
          </h1>
          <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Financial platforms are high-value targets for fraudsters. This page explains how to identify scams impersonating Armor, what our platform does to protect your account, and exactly what to do if you encounter suspicious activity.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-16 flex flex-col gap-12">

        {/* ── Alert Banner ── */}
        <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--loss)' }} aria-hidden="true" />
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--loss)' }}>Important Reminder</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Armor will <strong style={{ color: 'var(--text-primary)' }}>never</strong> ask for your password, MFA code, or full financial account numbers via email, phone, SMS, or live chat. If anyone claiming to be from Armor asks for these, it is fraud. Hang up or close the tab immediately.
            </p>
          </div>
        </div>

        {/* ── Red Flags ── */}
        <section aria-labelledby="red-flags-heading">
          <h2 id="red-flags-heading" className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Warning Signs of Fraud
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Recognising these patterns is your first line of defence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RED_FLAGS.map(f => (
              <div key={f.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <XCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--loss)' }} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{f.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Armor vs Fraudsters ── */}
        <section aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Legitimate Armor vs Impersonators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LEGITIMATE_VS_FRAUD.map((col, i) => (
              <div key={col.type} className="rounded-2xl p-5" style={{
                background: i === 0 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: i === 0 ? 'var(--profit)' : 'var(--loss)' }}>
                  {col.type}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {i === 0
                        ? <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--profit)' }} aria-hidden="true" />
                        : <XCircle    size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--loss)'   }} aria-hidden="true" />
                      }
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── How Armor Protects You ── */}
        <section aria-labelledby="protections-heading">
          <h2 id="protections-heading" className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            How Armor Protects Your Account
          </h2>
          <div className="flex flex-col gap-4">
            {ARMOR_PROTECTIONS.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: p.tintBg, border: `1px solid ${p.tintBorder}` }}>
                    <Icon size={16} style={{ color: p.color }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Phishing Channels ── */}
        <section aria-labelledby="channels-heading" className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 id="channels-heading" className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Common Attack Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PHISHING_CHANNELS.map(c => {
              const Icon = c.icon
              return (
                <div key={c.label} className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.tintBg, border: `1px solid ${c.tintBorder}` }}>
                    <Icon size={15} style={{ color: c.color }} aria-hidden="true" />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── What to Do ── */}
        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            If You Suspect Fraud — Act Immediately
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Time matters. Follow these steps in order.
          </p>
          <div className="flex flex-col gap-3">
            {REPORT_STEPS.map(s => (
              <div key={s.step} className="flex items-start gap-4 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)', color: '#000' }}
                  aria-hidden="true"
                >
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Report Contact ── */}
        <section aria-labelledby="fraud-contact-heading" className="rounded-2xl p-6 text-center"
          style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={28} className="mx-auto mb-3" style={{ color: 'var(--loss)' }} aria-hidden="true" />
          <h2 id="fraud-contact-heading" className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Report Fraud or Suspicious Activity
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Our security team monitors reports 24/7. If you have experienced or witnessed fraud related to Armor, contact us immediately. Include screenshots and details of the contact in your email.
          </p>
          <a href="mailto:security@armor-invest.com" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Mail size={14} aria-hidden="true" />
            security@armor-invest.com
          </a>
          <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Expected response time: within 4 hours for active fraud reports</p>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer role="contentinfo" aria-label="Page footer" className="py-8 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Armor home">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }} aria-hidden="true">
              <Shield size={14} color="#000" />
            </div>
            <span className="text-base font-bold gold-text" style={{ fontFamily: 'var(--font-display)' }}>Armor</span>
          </Link>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacy"          className="text-xs transition-colors hover:text-yellow-400" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
            <Link href="/fraud-prevention" className="text-xs transition-colors" style={{ color: 'var(--gold)' }}>Fraud Prevention</Link>
            <Link href="/accessibility"    className="text-xs transition-colors hover:text-yellow-400" style={{ color: 'var(--text-muted)' }}>Accessibility</Link>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Armor Investment Management.</p>
        </div>
      </footer>

    </main>
  )
}
