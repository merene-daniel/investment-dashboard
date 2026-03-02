'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  TrendingUp, BarChart2, Shield, Activity,
  LayoutDashboard, Clock, Globe, ArrowRight,
  ChevronRight, Zap, Menu, X,
  Lock, RefreshCw, Target, Check, Star,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Portfolio Overview',
    description: 'Real-time portfolio tracking with comprehensive P&L analysis, allocation breakdowns, and performance metrics at a glance.',
    color: '#eab308',
  },
  {
    icon: BarChart2,
    title: 'Advanced Analytics',
    description: 'Deep-dive into performance with historical charts, benchmark comparisons, and sector allocation analysis.',
    color: '#10b981',
  },
  {
    icon: Activity,
    title: 'Holdings Management',
    description: 'Track every position with precision — cost basis, market value, day changes, and weighted portfolio exposure.',
    color: '#3b82f6',
  },
  {
    icon: Clock,
    title: 'Transaction History',
    description: 'Complete audit trail of all trades, dividends, deposits, and withdrawals with detailed reporting.',
    color: '#8b5cf6',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Monitor beta exposure, risk levels, and portfolio volatility to keep your strategy aligned with your goals.',
    color: '#ef4444',
  },
  {
    icon: Globe,
    title: 'Multi-Asset Support',
    description: 'Manage stocks, ETFs, bonds, crypto, and commodities across all your portfolios in one unified view.',
    color: '#f59e0b',
  },
]

const STATS = [
  { value: '$2.4B+', label: 'Assets Tracked' },
  { value: '99.9%',  label: 'Uptime SLA'     },
  { value: '12+',    label: 'Asset Classes'   },
  { value: '365d',   label: 'History'         },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Your Portfolio',
    description: 'Add your holdings and transactions manually or seed sample data to explore the full experience instantly.',
  },
  {
    step: '02',
    title: 'Track Performance',
    description: 'Watch portfolio performance in real-time with interactive area charts and year-long benchmark comparison.',
  },
  {
    step: '03',
    title: 'Make Better Decisions',
    description: 'Use data-driven insights to optimize allocations, manage risk, and maximize risk-adjusted returns.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Portfolio Manager',
    company: 'Meridian Capital',
    initials: 'SC',
    avatarColor: '#eab308',
    quote: 'Aurum has transformed how I manage client portfolios. The analytics depth rivals tools that cost 10× more. The P&L tracking is flawless and the UI is genuinely beautiful.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Private Investor',
    company: 'Independent',
    initials: 'MW',
    avatarColor: '#10b981',
    quote: "I've tried every portfolio tracker on the market. Nothing comes close to Aurum's clean interface and real-time data. It's become my non-negotiable daily driver.",
    stars: 5,
  },
  {
    name: 'Diana Osei',
    role: 'Wealth Advisor',
    company: 'Harrington & Co.',
    initials: 'DO',
    avatarColor: '#3b82f6',
    quote: 'The sector allocation charts and benchmark comparison saved me hours of manual spreadsheet work each week. My clients love how professional it looks.',
    stars: 5,
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for individual investors getting started with portfolio tracking.',
    features: [
      '1 portfolio',
      'Up to 20 holdings',
      'Basic P&L tracking',
      'Transaction history',
      '30-day performance chart',
    ],
    cta: 'Get Started',
    href: '/dashboard',
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For serious investors who need institutional-grade analytics and deep insights.',
    features: [
      'Unlimited portfolios',
      'Unlimited holdings',
      'Advanced analytics dashboard',
      'Benchmark comparison (S&P 500)',
      '365-day performance history',
      'Risk & beta assessment',
      'Sector allocation reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/dashboard',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For wealth management firms and professional investment managers.',
    features: [
      'Everything in Pro',
      'Multi-user access',
      'REST API access',
      'White-label reports',
      'Custom integrations',
      'Dedicated account manager',
      '99.9% uptime SLA',
    ],
    cta: 'Contact Sales',
    href: '#',
    highlight: false,
    badge: null,
  },
]

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'Security', href: '#security' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden">

      {/* ── Navigation ── */}
      <header role="banner">
        <nav
          aria-label="Primary navigation"
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(13, 13, 10, 0.92)' : 'transparent',
            backdropFilter: scrolled ? 'blur(24px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(234, 179, 8, 0.1)' : 'none',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3" aria-label="Aurum home">
              <div className="relative w-9 h-9" aria-hidden="true">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base text-black"
                  style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
                >
                  A
                </div>
                <div className="absolute inset-0 rounded-xl pulse-ring" style={{ color: '#eab308', opacity: 0.35 }} />
              </div>
              <span
                className="text-xl font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Aurum
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-8 list-none" role="list">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm transition-colors duration-200 hover:text-yellow-400"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* Hamburger — mobile only */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-nav"
                aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {mobileNavOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>
              <Link
                href="/dashboard"
                className="hidden md:flex btn-primary items-center gap-2 text-sm"
                aria-label="Open the investment dashboard"
              >
                Open Dashboard
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          {mobileNavOpen && (
            <div
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              className="mobile-nav-open md:hidden px-4 pb-4"
              style={{
                background: 'rgba(13,13,10,0.97)',
                backdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(234,179,8,0.1)',
              }}
            >
              <ul className="flex flex-col gap-1 pt-3 list-none mb-3" role="list">
                {NAV_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMobileNavOpen(false)}
                      onFocus={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onBlur={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="btn-primary flex items-center justify-center gap-2 text-sm w-full"
                onClick={() => setMobileNavOpen(false)}
              >
                Open Dashboard
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ── Hero Section ── */}
      <section aria-labelledby="hero-heading" className="relative pt-36 pb-20 px-6 text-center overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.07) 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.04) 0%, transparent 65%)' }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 fade-in-up"
            style={{
              background: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.22)',
              color: '#eab308',
            }}
          >
            <Zap size={11} />
            Professional Investment Intelligence Platform
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 fade-in-up stagger-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Institutional-Grade
            <br />
            <span className="gold-text">Investment Intelligence</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up stagger-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Track portfolios, analyze performance, and manage holdings with the precision
            of a professional investment manager — all in one elegant dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in-up stagger-3">
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 px-8 py-3">
              Open Dashboard
              <ArrowRight size={15} />
            </Link>
            <a href="#features" className="btn-secondary flex items-center gap-2 px-8 py-3">
              Explore Features
              <ChevronRight size={15} />
            </a>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto fade-in-up stagger-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <div
                  className="text-2xl font-bold mb-1 gold-text"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        aria-labelledby="testimonials-heading"
        className="py-24 px-6"
        style={{ borderTop: '1px solid rgba(234, 179, 8, 0.06)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: '#eab308', fontFamily: 'var(--font-mono)' }}
            >
              Testimonials
            </p>
            <h2
              id="testimonials-heading"
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Trusted by serious
              <br />
              <span className="gold-text">investors</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              From individual traders to wealth management firms — here's what they say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="glass-card p-7 flex flex-col gap-5 group transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="#eab308"
                      style={{ color: '#eab308' }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(234,179,8,0.08)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: `${t.avatarColor}18`,
                      border: `1px solid ${t.avatarColor}35`,
                      color: t.avatarColor,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className="py-24 px-6"
        style={{ borderTop: '1px solid rgba(234, 179, 8, 0.06)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: '#eab308', fontFamily: 'var(--font-mono)' }}
            >
              Pricing
            </p>
            <h2
              id="pricing-heading"
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Simple, transparent
              <br />
              <span className="gold-text">pricing</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              No hidden fees. Cancel anytime. Start free and upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                aria-label={`${plan.name} plan${plan.badge ? ` — ${plan.badge}` : ''}`}
                className="relative rounded-2xl p-7 flex flex-col gap-6 transition-all duration-300"
                style={
                  plan.highlight
                    ? {
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(234, 179, 8, 0.4)',
                        boxShadow: '0 0 40px rgba(234,179,8,0.1), 0 0 80px rgba(234,179,8,0.04)',
                      }
                    : {
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(234, 179, 8, 0.1)',
                      }
                }
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                      color: '#0d0d0a',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div>
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-3"
                    style={{ color: plan.highlight ? '#eab308' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: plan.highlight ? '#eab308' : 'var(--text-primary)',
                      }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {plan.description}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(234,179,8,0.08)' }} />

                {/* Features list */}
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div
                        className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-px"
                        style={{
                          background: plan.highlight ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.05)',
                          border: plan.highlight ? '1px solid rgba(234,179,8,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <Check
                          size={11}
                          style={{ color: plan.highlight ? '#eab308' : 'var(--text-secondary)' }}
                        />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={plan.highlight ? 'btn-primary text-center text-sm py-3' : 'btn-secondary text-center text-sm py-3'}
                  aria-label={`${plan.cta} — ${plan.name} plan`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="py-24 px-6"
        style={{ borderTop: '1px solid rgba(234, 179, 8, 0.06)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: '#eab308', fontFamily: 'var(--font-mono)' }}
            >
              Platform Features
            </p>
            <h2
              id="features-heading"
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Everything you need to
              <br />
              <span className="gold-text">manage wealth</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              A complete suite of investment management tools designed for
              sophisticated investors and professional portfolio managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="glass-card p-6 group transition-all duration-300">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${feature.color}18`,
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    <Icon size={20} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="py-24 px-6"
        style={{ borderTop: '1px solid rgba(234, 179, 8, 0.06)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: '#eab308', fontFamily: 'var(--font-mono)' }}
            >
              How It Works
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Up and running in
              <br />
              <span className="gold-text">minutes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="text-center relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-calc(50%-2.5rem)] h-px"
                    style={{ background: 'linear-gradient(to right, rgba(234,179,8,0.3), rgba(234,179,8,0.05))' }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 relative"
                  style={{
                    background: 'rgba(234, 179, 8, 0.08)',
                    border: '1px solid rgba(234, 179, 8, 0.2)',
                    fontFamily: 'var(--font-mono)',
                    color: '#eab308',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  {step.step}
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Strip ── */}
      <section
        id="security"
        className="py-16 px-6"
        style={{ borderTop: '1px solid rgba(234, 179, 8, 0.06)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: 'Secure by Design',
                description: 'All data is encrypted at rest and in transit. Your portfolio data never leaves your control.',
              },
              {
                icon: RefreshCw,
                title: 'Always Up-to-Date',
                description: 'Real-time portfolio calculations with automatic P&L, weight, and performance updates.',
              },
              {
                icon: Target,
                title: 'Precision Analytics',
                description: 'Institutional-grade metrics including beta, Sharpe ratio, and sector allocation analysis.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex gap-4 p-5 rounded-xl"
                  style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.08)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
                  >
                    <Icon size={18} style={{ color: '#eab308' }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card glow-gold p-12 md:p-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.06) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}
              >
                <TrendingUp size={26} style={{ color: '#eab308' }} />
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Ready to take control of
                <br />
                <span className="gold-text">your investments?</span>
              </h2>
              <p
                className="text-base mb-8 max-w-lg mx-auto leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Join sophisticated investors who trust Aurum for institutional-grade
                portfolio management and performance analytics.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
                  Open Dashboard
                  <ArrowRight size={16} />
                </Link>
                <a href="#pricing" className="btn-secondary inline-flex items-center gap-2 px-10 py-4">
                  View Pricing
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        role="contentinfo"
        aria-label="Site footer"
        className="py-12 px-6"
        style={{ borderTop: '1px solid rgba(234, 179, 8, 0.08)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-black"
                style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
              >
                A
              </div>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Aurum
              </span>
            </div>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Aurum Investment Management. All rights reserved.
            </p>

            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-6 list-none" role="list">
                {[
                  { label: 'Features',  href: '#features'  },
                  { label: 'Pricing',   href: '#pricing'   },
                  { label: 'Dashboard', href: '/dashboard' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs transition-colors duration-200 hover:text-yellow-400"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </footer>

    </main>
  )
}
