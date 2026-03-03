'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Shield, Lock, Eye, Server, Key, FileCheck,
  Globe2, UserCheck, Database, RefreshCw,
  AlertTriangle, CheckCircle,
  Mail,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// ── Data ──────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: Lock,
    title: 'AES-256 Encryption',
    description: 'All data is encrypted at rest using AES-256-GCM and in transit via TLS 1.3.',
    color: '#eab308',
  },
  {
    icon: FileCheck,
    title: 'SOC 2 Type II',
    description: 'Annually audited against Trust Service Criteria by an independent third party.',
    color: '#10b981',
  },
  {
    icon: Eye,
    title: 'Zero Data Selling',
    description: 'Your financial data is never sold, shared with advertisers, or monetised.',
    color: '#3b82f6',
  },
  {
    icon: UserCheck,
    title: 'Access Controls',
    description: 'Role-based permissions and MFA enforce least-privilege access to all systems.',
    color: '#8b5cf6',
  },
]

const ENCRYPTION_IN_TRANSIT = [
  { label: 'Protocol',            value: 'TLS 1.3 (with TLS 1.2 fallback)' },
  { label: 'Cipher suites',       value: 'ECDHE-RSA + AES-128-GCM / AES-256-GCM' },
  { label: 'Certificate',         value: 'Extended Validation (EV) SSL' },
  { label: 'HSTS',                value: 'Enabled — max-age 31 536 000 s, includeSubDomains' },
  { label: 'HTTP → HTTPS',        value: 'Permanent redirect enforced on all endpoints' },
]

const ENCRYPTION_AT_REST = [
  { label: 'Database encryption', value: 'AES-256-GCM at the storage layer (MongoDB Atlas)' },
  { label: 'Field-level encryption', value: 'PII fields additionally encrypted at the application layer' },
  { label: 'Key management',      value: 'AWS KMS — HSM-backed, FIPS 140-2 Level 3' },
  { label: 'Key rotation',        value: 'Automated rotation every 90 days' },
  { label: 'Backups',             value: 'Encrypted, geo-redundant daily snapshots — 30-day retention' },
]

const COMPLIANCE = [
  {
    badge: 'SOC 2 TYPE II',
    color: '#10b981',
    title: 'Service Organisation Control 2',
    points: [
      'Annual third-party audit covering all five Trust Service Criteria',
      'Security — CC series: logical & physical access, change management, risk mitigation',
      'Availability — system uptime commitments and incident response SLAs',
      'Processing Integrity — transaction completeness and accuracy controls',
      'Confidentiality & Privacy — data classification, retention, and disposal policies',
    ],
  },
  {
    badge: 'GDPR',
    color: '#3b82f6',
    title: 'General Data Protection Regulation (EU)',
    points: [
      'Lawful basis established for every category of personal data processed',
      'Data subject rights: access, rectification, erasure, portability, restriction',
      'Data Processing Agreements (DPAs) in place with all sub-processors',
      'Privacy by Design — data minimisation applied at the architecture level',
      'DPA-notified Breach notification within 72 hours if required',
    ],
  },
  {
    badge: 'CCPA',
    color: '#f59e0b',
    title: 'California Consumer Privacy Act',
    points: [
      'California residents may request a full copy of data held about them',
      'Right to opt out of any future data sale (we never sell data, by policy)',
      'Right to deletion — fulfilled within 45 days of a verified request',
      'Annual privacy notice updated and clearly accessible from the product',
    ],
  },
  {
    badge: 'ISO 27001',
    color: '#8b5cf6',
    title: 'Information Security Management',
    points: [
      'ISMS controls mapped to ISO/IEC 27001:2022 Annex A',
      'Risk register maintained and reviewed quarterly by the security team',
      'Formal certification audit in progress — expected completion Q3 2025',
      'Penetration testing conducted annually by a CREST-accredited firm',
    ],
  },
]

const PRIVACY_COLLECT = [
  'Account credentials (email address, hashed password)',
  'Portfolio data you manually enter (holdings, transactions, watchlist)',
  'Anonymised, aggregated usage analytics (no PII)',
  'Session metadata required for security monitoring (IP address, user-agent)',
]

const PRIVACY_NEVER = [
  'Sell or rent your personal or financial data to any third party',
  'Share your portfolio data with advertisers or marketing partners',
  'Access your account without your explicit consent or a verified legal obligation',
  'Retain your data beyond 30 days after a deletion request is confirmed',
  'Use your investment decisions for training AI or ML models',
]

const DATA_HANDLING = [
  {
    icon: Globe2,
    title: 'Data Flow',
    description: 'Data travels from your browser over TLS 1.3 to our API servers, where it is validated, encrypted at the application layer, and persisted to encrypted storage. At no point is unencrypted financial data written to disk.',
  },
  {
    icon: Database,
    title: 'Storage Infrastructure',
    description: 'We use MongoDB Atlas (AWS us-east-1) with encryption at rest enabled. Geo-redundant replicas ensure availability. All nodes reside in a private VPC with no public IP exposure.',
  },
  {
    icon: Key,
    title: 'Access Control',
    description: 'Production database access is restricted to authorised engineers via short-lived credentials issued by Vault. Every access event is logged to an immutable audit trail reviewed weekly.',
  },
  {
    icon: RefreshCw,
    title: 'Data Retention',
    description: 'Your data is retained for the lifetime of your account plus 30 days after a verified deletion request, to cover payment disputes or fraud recovery. After that period it is permanently purged.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    description: 'You may request a full JSON export of your data, correct inaccurate records, or permanently delete your account at any time from Settings → Privacy. Requests are fulfilled within 30 days.',
  },
  {
    icon: Server,
    title: 'Third-Party Sub-processors',
    description: 'We use a minimal, audited set of sub-processors (hosting, email, analytics). A full list is available upon request. Each operates under a signed DPA and is reviewed annually.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header role="banner">
        <nav
          aria-label="Primary navigation"
          className="sticky top-0 z-50 backdrop-blur-xl"
          style={{
            background:   scrolled ? 'rgba(13,13,10,0.88)' : 'transparent',
            borderBottom: scrolled ? '1px solid rgba(234,179,8,0.1)' : '1px solid transparent',
            transition:   'background 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
            <Link href="/" className="flex items-center gap-3" aria-label="Back to Armor home">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
                aria-hidden="true"
              >
                <Shield size={16} color="#000" />
              </div>
              <span
                className="text-lg font-bold gold-text"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Armor
              </span>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-6" aria-label="Site navigation">
              <Link href="/education" className="text-sm transition-colors hover:text-yellow-400" style={{ color: scrolled ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>Education</Link>
              <Link href="/security"  className="text-sm font-medium" style={{ color: 'var(--gold)' }}>Security</Link>
              <Link href="/about"     className="text-sm transition-colors hover:text-yellow-400" style={{ color: scrolled ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>About</Link>
            </nav>

            <div className="flex items-center justify-end gap-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild className="hidden md:flex">
                <Link href="/" aria-label="Log in to your Armor account">
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild className="hidden md:flex">
                <Link href="/" aria-label="Open a new Armor account">
                  Open Account
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="security-hero-heading"
        className="relative pt-24 pb-16 px-6 text-center overflow-hidden"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.06) 0%, transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-8 gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(234,179,8,0.08)',
              border:     '1px solid rgba(234,179,8,0.22)',
              color:      '#eab308',
            }}
          >
            <Shield size={12} aria-hidden="true" />
            Security &amp; Trust Centre
          </Badge>

          <h1
            id="security-hero-heading"
            className="text-4xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Your Investments,{' '}
            <span className="gold-text">Secured End-to-End</span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            Armor applies institutional-grade security practices to protect every portfolio,
            transaction, and piece of financial data you entrust to us.
          </p>

          {/* Quick-stats row */}
          <div className="inline-flex flex-wrap justify-center gap-6">
            {[
              { value: 'AES-256', label: 'Encryption at rest'   },
              { value: 'TLS 1.3', label: 'Encryption in transit' },
              { value: 'SOC 2',   label: 'Type II certified'    },
              { value: '0',       label: 'Data sold'            },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-mono text-2xl font-bold" style={{ color: '#eab308' }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Pillars ────────────────────────────────────────── */}
      <section
        aria-labelledby="pillars-heading"
        className="py-14 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="pillars-heading"
            className="text-2xl font-bold text-center mb-10"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Four Pillars of Protection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(p => {
              const Icon = p.icon
              return (
                <Card
                  key={p.title}
                  className="p-6 flex flex-col gap-4 border-0"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                  >
                    <Icon size={20} style={{ color: p.color }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      {p.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {p.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Data Encryption ─────────────────────────────────────────── */}
      <section
        aria-labelledby="encryption-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Lock size={20} style={{ color: '#eab308' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#eab308', letterSpacing: '0.1em' }}>
              DATA ENCRYPTION
            </span>
          </div>
          <h2
            id="encryption-heading"
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            End-to-End Encryption
          </h2>
          <p className="mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Every byte of your financial data is encrypted before it leaves your browser and
            remains encrypted until it is displayed back to you. There is no unencrypted path.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In Transit */}
            <Card className="border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
                  >
                    <Globe2 size={15} style={{ color: '#eab308' }} aria-hidden="true" />
                  </div>
                  <CardTitle className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    In Transit
                  </CardTitle>
                </div>
              </CardHeader>
              <Separator style={{ background: 'rgba(234,179,8,0.1)' }} />
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {ENCRYPTION_IN_TRANSIT.map(row => (
                    <li key={row.label} className="flex flex-col gap-0.5">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                        {row.label}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* At Rest */}
            <Card className="border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
                  >
                    <Database size={15} style={{ color: '#eab308' }} aria-hidden="true" />
                  </div>
                  <CardTitle className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    At Rest
                  </CardTitle>
                </div>
              </CardHeader>
              <Separator style={{ background: 'rgba(234,179,8,0.1)' }} />
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {ENCRYPTION_AT_REST.map(row => (
                    <li key={row.label} className="flex flex-col gap-0.5">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                        {row.label}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Compliance ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="compliance-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <FileCheck size={20} style={{ color: '#10b981' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#10b981', letterSpacing: '0.1em' }}>
              COMPLIANCE &amp; CERTIFICATIONS
            </span>
          </div>
          <h2
            id="compliance-heading"
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Built to Meet the Highest Standards
          </h2>
          <p className="mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Armor is independently audited and designed to meet regulatory requirements across
            the US and EU, so your data is protected by law as well as technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COMPLIANCE.map(item => (
              <Card
                key={item.badge}
                className="border-0"
                aria-label={`${item.badge} compliance details`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${item.color}15`,
                        color:      item.color,
                        border:     `1px solid ${item.color}30`,
                      }}
                    >
                      {item.badge}
                    </Badge>
                    <CardTitle className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <Separator style={{ background: 'rgba(234,179,8,0.08)' }} />
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {item.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle
                          size={13}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: item.color }}
                          aria-hidden="true"
                        />
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {pt}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy Commitment ──────────────────────────────────────── */}
      <section
        aria-labelledby="privacy-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Eye size={20} style={{ color: '#3b82f6' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#3b82f6', letterSpacing: '0.1em' }}>
              PRIVACY COMMITMENT
            </span>
          </div>
          <h2
            id="privacy-heading"
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Your Data. Your Control.
          </h2>
          <p className="mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            We collect only what is essential to deliver the product. We profit from subscriptions,
            never from your data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What we collect */}
            <Card className="border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  What we collect
                </CardTitle>
              </CardHeader>
              <Separator style={{ background: 'rgba(59,130,246,0.15)' }} />
              <CardContent className="pt-4">
                <ul className="space-y-2.5">
                  {PRIVACY_COLLECT.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle
                        size={13}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: '#3b82f6' }}
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What we never do */}
            <Card className="border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  What we will <em>never</em> do
                </CardTitle>
              </CardHeader>
              <Separator style={{ background: 'rgba(239,68,68,0.15)' }} />
              <CardContent className="pt-4">
                <ul className="space-y-2.5">
                  {PRIVACY_NEVER.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div
                        className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                        aria-hidden="true"
                      >
                        <span style={{ color: '#ef4444', fontSize: '9px', fontWeight: 700, lineHeight: 1 }}>✕</span>
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── How Data is Handled ─────────────────────────────────────── */}
      <section
        aria-labelledby="data-handling-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Server size={20} style={{ color: '#8b5cf6' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#8b5cf6', letterSpacing: '0.1em' }}>
              DATA HANDLING
            </span>
          </div>
          <h2
            id="data-handling-heading"
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            How Your Data is Handled
          </h2>
          <p className="mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            From the moment you type a transaction to the day you delete your account,
            here is exactly what happens to your data at every step.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DATA_HANDLING.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="p-5 flex flex-col gap-3 border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                    >
                      <Icon size={16} style={{ color: '#8b5cf6' }} aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Responsible Disclosure ──────────────────────────────────── */}
      <section
        aria-labelledby="disclosure-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <Card className="glow-gold border-0 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(234,179,8,0.05) 0%, transparent 60%)' }}
              aria-hidden="true"
            />
            <CardContent className="relative pt-8 pb-8 px-8 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* Left: disclosure program */}
              <div>
                <Alert variant="gold" className="mb-6 border-0 bg-transparent p-0 [&>svg]:static [&>svg]:translate-y-0 [&>svg~*]:pl-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
                    >
                      <AlertTriangle size={18} style={{ color: '#eab308' }} aria-hidden="true" />
                    </div>
                    <AlertTitle
                      id="disclosure-heading"
                      className="text-xl font-bold m-0"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                      Responsible Disclosure
                    </AlertTitle>
                  </div>
                  <AlertDescription>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Found a vulnerability? We welcome responsible disclosure from the security
                      community and commit to a collaborative, no-legal-action process for
                      good-faith researchers.
                    </p>
                    <ul className="space-y-2">
                      {[
                        '90-day coordinated disclosure window',
                        'Acknowledgement within 48 hours',
                        'No legal action against good-faith researchers',
                        'CVE credit and Hall-of-Fame listing for verified reports',
                      ].map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <CheckCircle
                            size={13}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: '#eab308' }}
                            aria-hidden="true"
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>

              {/* Right: contact */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Security Contact
                  </h3>
                  <a
                    href="mailto:security@aurum.app"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-yellow-400"
                    style={{ color: '#eab308' }}
                  >
                    <Mail size={14} aria-hidden="true" />
                    security@aurum.app
                  </a>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Encrypted reports accepted via PGP — public key available on request.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl text-xs leading-relaxed"
                  style={{
                    background: 'rgba(234,179,8,0.05)',
                    border:     '1px solid rgba(234,179,8,0.12)',
                    color:      'var(--text-muted)',
                  }}
                >
                  <strong style={{ color: 'var(--text-secondary)' }}>Out-of-scope:</strong>{' '}
                  denial-of-service attacks, social engineering of Armor staff, vulnerabilities
                  in third-party services we do not control, and reports generated by automated
                  scanners without a meaningful proof-of-concept.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer
        role="contentinfo"
        className="py-10 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Armor home">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
              aria-hidden="true"
            >
              <Shield size={14} color="#000" />
            </div>
            <span className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Armor
            </span>
          </Link>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Armor Investment Management. All rights reserved.
          </p>

        </div>
      </footer>

    </main>
  )
}
