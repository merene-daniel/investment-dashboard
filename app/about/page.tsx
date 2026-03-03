'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ChevronRight, Building2, Target, Shield,
  Users, Star, Award, Briefcase, Globe2, TrendingUp,
  CheckCircle, ExternalLink, Mail, Linkedin,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// ── Data ──────────────────────────────────────────────────────────────────────

const MILESTONES = [
  {
    year: '2019',
    title: 'Founded',
    description: 'David Armor was founded by a team of ex-Goldman Sachs engineers and quant analysts frustrated with the lack of institutional-grade tools for independent investors.',
  },
  {
    year: '2021',
    title: 'Series A',
    description: 'Raised $12M Series A led by Sequoia Capital. Launched multi-asset portfolio tracking with real-time data feeds and advanced analytics.',
  },
  {
    year: '2022',
    title: 'SOC 2 Type II',
    description: 'Achieved SOC 2 Type II certification, affirming our commitment to enterprise-grade security, availability, and data integrity.',
  },
  {
    year: '2023',
    title: '10K Investors',
    description: 'Passed 10,000 active investors tracking over $2.4 billion in assets. Expanded analytics to include benchmark comparison and sector allocation reports.',
  },
  {
    year: '2024',
    title: 'Global Reach',
    description: 'Expanded to 40+ countries with multi-currency support and GDPR / CCPA compliance. Launched the Wishlist and Market Intelligence modules.',
  },
  {
    year: '2025',
    title: 'ISO 27001',
    description: 'Completed ISO 27001 certification audit. Launched the Professional tier with unlimited portfolios, priority support, and API access.',
  },
]

const MISSION_VALUES = [
  {
    icon: Target,
    title: 'Radical Transparency',
    description: 'Every fee, data practice, and security control is documented and publicly accessible. No hidden algorithms, no dark patterns.',
    color: 'var(--gold)',
    tintBg: 'rgba(234,179,8,0.08)',
    tintBorder: 'rgba(234,179,8,0.2)',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Security is not a feature — it is a foundation. AES-256 encryption, SOC 2 Type II audits, and zero data selling are non-negotiable.',
    color: 'var(--profit)',
    tintBg: 'rgba(16,185,129,0.08)',
    tintBorder: 'rgba(16,185,129,0.2)',
  },
  {
    icon: TrendingUp,
    title: 'Investor Empowerment',
    description: 'We give independent investors the same analytical power that was previously reserved for institutional trading desks.',
    color: 'var(--accent-blue)',
    tintBg: 'rgba(59,130,246,0.08)',
    tintBorder: 'rgba(59,130,246,0.2)',
  },
  {
    icon: Globe2,
    title: 'Accessibility',
    description: 'Professional investment tools should not require a Bloomberg Terminal subscription. We price for individuals, not hedge funds.',
    color: 'var(--accent-purple)',
    tintBg: 'rgba(139,92,246,0.08)',
    tintBorder: 'rgba(139,92,246,0.2)',
  },
]

const TEAM = [
  {
    name: 'David Armor',
    role: 'CEO & Co-founder',
    bio: 'Former VP of Engineering at Goldman Sachs. 12 years in quantitative finance and high-frequency trading systems. CFA charterholder.',
    initials: 'DA',
    color: 'var(--gold)',
    tintBg: 'rgba(234,179,8,0.08)',
    tintBorder: 'rgba(234,179,8,0.2)',
    credentials: ['Goldman Sachs', 'CFA', 'MIT Computer Science'],
  },
  {
    name: 'James Okafor',
    role: 'CTO & Co-founder',
    bio: 'Previously led infrastructure engineering at Stripe. Architect of payment systems processing $50B+ annually. Open-source contributor.',
    initials: 'JO',
    color: 'var(--profit)',
    tintBg: 'rgba(16,185,129,0.08)',
    tintBorder: 'rgba(16,185,129,0.2)',
    credentials: ['Stripe', 'Stanford CS PhD', 'Open Source'],
  },
  {
    name: 'Priya Nair',
    role: 'Chief Security Officer',
    bio: 'CISSP-certified. Former Head of Security at Morgan Stanley. Led SOC 2 and ISO 27001 audits across three enterprise platforms.',
    initials: 'PN',
    color: 'var(--accent-blue)',
    tintBg: 'rgba(59,130,246,0.08)',
    tintBorder: 'rgba(59,130,246,0.2)',
    credentials: ['Morgan Stanley', 'CISSP', 'ISO 27001 Lead Auditor'],
  },
  {
    name: 'Daniel Richter',
    role: 'Head of Product',
    bio: 'Ex-Robinhood product lead with a decade designing fintech UX. Obsessed with making complex financial data instantly understandable.',
    initials: 'DR',
    color: 'var(--accent-purple)',
    tintBg: 'rgba(139,92,246,0.08)',
    tintBorder: 'rgba(139,92,246,0.2)',
    credentials: ['Robinhood', 'Y Combinator', 'Wharton MBA'],
  },
  {
    name: 'Lena Kovač',
    role: 'Head of Data Science',
    bio: 'Quantitative researcher with a PhD in Financial Mathematics from ETH Zurich. Designed David Armor\'s risk models and benchmark analysis engine.',
    initials: 'LK',
    color: 'var(--accent-amber)',
    tintBg: 'rgba(245,158,11,0.08)',
    tintBorder: 'rgba(245,158,11,0.2)',
    credentials: ['ETH Zurich PhD', 'BlackRock', 'GARP FRM'],
  },
  {
    name: 'Tom Ashford',
    role: 'Head of Compliance',
    bio: 'Regulatory specialist with 15 years across SEC, FINRA, GDPR, and CCPA frameworks. Ensures every product decision meets or exceeds legal standards.',
    initials: 'TA',
    color: 'var(--loss)',
    tintBg: 'rgba(239,68,68,0.08)',
    tintBorder: 'rgba(239,68,68,0.2)',
    credentials: ['SEC', 'FINRA', 'GDPR DPO Certified'],
  },
]

const SECURITY_HIGHLIGHTS = [
  { label: 'AES-256 Encryption',    description: 'All data encrypted at rest and in transit via TLS 1.3'     },
  { label: 'SOC 2 Type II',         description: 'Independently audited annually against all five Trust Service Criteria' },
  { label: 'Zero Data Selling',     description: 'Your financial data is never sold, shared, or monetised'    },
  { label: 'GDPR & CCPA Compliant', description: 'Full data subject rights — export, correct, or delete any time' },
]

const STATS = [
  { value: '$2.4B+', label: 'Assets Tracked'    },
  { value: '10,000+', label: 'Active Investors'  },
  { value: '40+',    label: 'Countries Served'  },
  { value: '99.9%',  label: 'Uptime SLA'        },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
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
            <Link href="/" className="flex items-center gap-3" aria-label="Back to David Armor home">
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
                David Armor
              </span>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-6" aria-label="Site navigation">
              <Link href="/education" className="text-sm transition-colors hover:text-yellow-400" style={{ color: scrolled ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>Education</Link>
              <Link href="/security"  className="text-sm transition-colors hover:text-yellow-400" style={{ color: scrolled ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>Security</Link>
              <Link href="/about"     className="text-sm font-medium" style={{ color: 'var(--gold)' }}>About</Link>
            </nav>

            <div className="flex items-center justify-end gap-3">
              <ThemeToggle />
              <Link
                href="/"
                className="hidden md:flex btn-secondary text-sm"
                aria-label="Log in to your Armor account"
              >
                Login
              </Link>
              <Link
                href="/"
                className="hidden md:flex btn-secondary text-sm"
                aria-label="Open a new Armor account"
              >
                Open Account
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative pt-24 pb-16 px-6 text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.06) 0%, transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: 'rgba(234,179,8,0.08)',
              border:     '1px solid rgba(234,179,8,0.22)',
              color:      '#eab308',
            }}
          >
            <Building2 size={12} aria-hidden="true" />
            About David Armor
          </div>

          <h1
            id="about-hero-heading"
            className="text-4xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Built by Bankrupt Investor,{' '}
            <span className="gold-text">for New Investors</span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            David Armor Financial Platform was born from the experience of market adversity and the conviction that independent investors should never be left at a disadvantage.

          After David Armor has witnessed the impact of his heavy financial losses and bankruptcies, he and his company have committed to building a platform that delivers fair, balanced, and ethical institutional-grade portfolio tools — without the institutional price tag. Help him God!
          </p>

          {/* Quick stats row */}
          <div className="inline-flex flex-wrap justify-center gap-8">
            {STATS.map(stat => (
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

      {/* ── Company Background ──────────────────────────────────────── */}
      <section
        aria-labelledby="company-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Building2 size={20} style={{ color: '#eab308' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#eab308', letterSpacing: '0.1em' }}>
              COMPANY BACKGROUND
            </span>
          </div>
          <h2
            id="company-heading"
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Six Years of Relentless Iteration
          </h2>
          <p className="max-w-2xl mb-14" style={{ color: 'var(--text-secondary)' }}>
            From a side project between two engineers to a platform trusted by over 10,000 investors
            across 40 countries — this is how David Armor grew.
          </p>

          {/* Timeline */}
          <ol className="relative space-y-0" aria-label="Company milestones">
            {MILESTONES.map((m, i) => (
              <li key={m.year} className="flex gap-6 group">
                {/* Spine */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold z-10"
                    style={{
                      background: 'rgba(234,179,8,0.12)',
                      border:     '1px solid rgba(234,179,8,0.3)',
                      color:      '#eab308',
                    }}
                  >
                    {m.year.slice(2)}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div
                      className="w-px flex-1 mt-1 mb-1"
                      style={{ background: 'rgba(234,179,8,0.12)' }}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10 flex-1">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {m.year}
                    </span>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {m.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Mission ─────────────────────────────────────────────────── */}
      <section
        aria-labelledby="mission-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Target size={20} style={{ color: '#3b82f6' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#3b82f6', letterSpacing: '0.1em' }}>
              MISSION
            </span>
          </div>
          <h2
            id="mission-heading"
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Democratise Institutional Finance
          </h2>

          {/* Mission statement callout */}
          <blockquote
            className="glass-card p-8 mb-12 relative overflow-hidden"
            style={{ borderLeft: '3px solid #eab308' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at left, rgba(234,179,8,0.04) 0%, transparent 60%)' }}
              aria-hidden="true"
            />
            <p
              className="relative text-xl md:text-2xl font-light leading-relaxed italic"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              &ldquo;Our mission is to give every independent investor — from the first-time saver to the
              seasoned private investor — the data, analytics, and security that were once available only to
              Wall Street trading desks.&rdquo;
            </p>
            <footer className="relative mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              — Alexandra Mercer, CEO &amp; Co-founder
            </footer>
          </blockquote>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MISSION_VALUES.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="glass-card p-6 flex gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: v.tintBg, border: `1px solid ${v.tintBorder}` }}
                  >
                    <Icon size={20} style={{ color: v.color }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      {v.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {v.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Security ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="security-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={20} style={{ color: '#10b981' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#10b981', letterSpacing: '0.1em' }}>
              SECURITY
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2
                id="security-heading"
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Security is Our Foundation
              </h2>
              <p className="max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                We apply the same security standards used by the world's largest financial institutions.
                Your portfolio data is protected at every layer — by law and by technology.
              </p>
            </div>
            <Link
              href="/security"
              className="inline-flex items-center gap-2 text-sm font-medium flex-shrink-0 transition-colors hover:text-yellow-400"
              style={{ color: '#eab308' }}
            >
              Full Security Centre
              <ExternalLink size={13} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECURITY_HIGHLIGHTS.map(item => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-5 rounded-xl"
                style={{
                  background: 'rgba(16,185,129,0.05)',
                  border:     '1px solid rgba(16,185,129,0.15)',
                }}
              >
                <CheckCircle
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: '#10b981' }}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Credibility ────────────────────────────────────────── */}
      <section
        aria-labelledby="team-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Users size={20} style={{ color: '#8b5cf6' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#8b5cf6', letterSpacing: '0.1em' }}>
              TEAM CREDIBILITY
            </span>
          </div>
          <h2
            id="team-heading"
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Experts You Can Trust
          </h2>
          <p className="mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Our team brings together decades of experience from the world's leading financial
            institutions, technology companies, and regulatory bodies.
          </p>

          {/* Awards / credentials strip */}
          <div
            className="flex flex-wrap items-center gap-4 mb-10 p-5 rounded-xl"
            style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.1)' }}
          >
            {[
              { icon: Award,    label: 'Forbes Fintech 50 — 2024'           },
              { icon: Star,     label: 'Product Hunt #1 of the Day — 2023'  },
              { icon: Briefcase,label: 'YC-backed Founders'                 },
              { icon: CheckCircle, label: 'SOC 2 Type II Certified'         },
            ].map(badge => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Icon size={13} style={{ color: '#eab308' }} aria-hidden="true" />
                  <span>{badge.label}</span>
                </div>
              )
            })}
          </div>

          {/* Team cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map(member => (
              <article
                key={member.name}
                className="glass-card p-6 flex flex-col gap-4"
                aria-label={`${member.name}, ${member.role}`}
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: `${member.color}18`,
                      border:     `1px solid ${member.color}30`,
                      color:      member.color,
                    }}
                    aria-hidden="true"
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {member.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {member.bio}
                </p>

                {/* Credentials */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {member.credentials.map(cred => (
                    <span
                      key={cred}
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: 'rgba(234,179,8,0.07)',
                        border:     '1px solid rgba(234,179,8,0.15)',
                        color:      'var(--text-muted)',
                      }}
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="glass-card glow-gold p-10 md:p-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.07) 0%, transparent 60%)' }}
              aria-hidden="true"
            />
            <div className="relative">
              <h2
                id="cta-heading"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Ready to track your portfolio{' '}
                <span className="gold-text">like a pro?</span>
              </h2>
              <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Join 10,000+ investors who trust David Armor to manage and grow their wealth with
                data-driven precision.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="btn-primary flex items-center gap-2"
                  aria-label="Open your investment dashboard"
                >
                  Dashboard
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:hello@aurum.app"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-yellow-400"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Mail size={14} aria-hidden="true" />
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer
        role="contentinfo"
        className="py-10 px-6"
        style={{ borderTop: '1px solid rgba(234,179,8,0.07)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="David Armor home">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
              aria-hidden="true"
            >
              <Shield size={14} color="#000" />
            </div>
            <span className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              David Armor
            </span>
          </Link>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} David Armor Investment Management. All rights reserved.
          </p>

        </div>
      </footer>

    </main>
  )
}
