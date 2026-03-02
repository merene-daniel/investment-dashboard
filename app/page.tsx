'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, BarChart2, Shield, Activity,
  LayoutDashboard, Clock, Globe, ArrowRight,
  ChevronRight, Zap, Menu, X,
  Lock, RefreshCw, Target, Check, Star,
  UserPlus, LogIn, Mail, Smartphone,
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
    quote: 'Armor has transformed how I manage client portfolios. The analytics depth rivals tools that cost 10× more. The P&L tracking is flawless and the UI is genuinely beautiful.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Private Investor',
    company: 'Independent',
    initials: 'MW',
    avatarColor: '#10b981',
    quote: "I've tried every portfolio tracker on the market. Nothing comes close to Armor's clean interface and real-time data. It's become my non-negotiable daily driver.",
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
  { label: 'Features', href: '#features'  },
  { label: 'Pricing',  href: '#pricing'   },
  { label: 'Security', href: '/security'  },
  { label: 'About',    href: '/about'     },
]

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
  'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
  'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon',
  'Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo (Democratic Republic)','Congo (Republic)','Costa Rica','Croatia','Cuba','Cyprus',
  'Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland',
  'France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala',
  'Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya',
  'Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia',
  'Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives',
  'Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova',
  'Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal',
  'Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
  'Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis',
  'Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe',
  'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka',
  'Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand',
  'Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

const EMPTY_FORM = { email: '', username: '', password: '', confirmPassword: '', country: '' }
type LoginStep = 'credentials' | 'mfa-method' | 'mfa-code' | 'success'

export default function LandingPage() {
  const router = useRouter()

  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Register modal
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registerForm, setRegisterForm] = useState(EMPTY_FORM)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  // Login modal
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials')
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [mfaMethod, setMfaMethod] = useState<'email' | 'phone'>('email')
  const [mfaTarget, setMfaTarget] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [mfaDemoCode, setMfaDemoCode] = useState('')
  const [mfaUserId, setMfaUserId] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav / modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileNavOpen(false)
        setRegisterOpen(false)
        setLoginOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegisterError('')
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match.')
      return
    }
    setRegisterLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      })
      const data = await res.json()
      if (!data.success) {
        setRegisterError(data.error ?? 'Something went wrong.')
      } else {
        setRegisterSuccess(true)
        setRegisterForm(EMPTY_FORM)
      }
    } catch {
      setRegisterError('Network error. Please try again.')
    } finally {
      setRegisterLoading(false)
    }
  }

  function openRegister() {
    setRegisterSuccess(false)
    setRegisterError('')
    setRegisterForm(EMPTY_FORM)
    setRegisterOpen(true)
  }

  function openLogin() {
    setLoginStep('credentials')
    setLoginForm({ identifier: '', password: '' })
    setLoginError('')
    setMfaMethod('email')
    setMfaTarget('')
    setMfaCode('')
    setMfaDemoCode('')
    setMfaUserId('')
    setLoginOpen(true)
  }

  async function handleLoginCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    // Demo bypass — empty credentials go straight to dashboard
    if (!loginForm.identifier.trim() && !loginForm.password.trim()) {
      router.push('/dashboard')
      return
    }
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!data.success) {
        setLoginError(data.error ?? 'Login failed.')
      } else {
        setMfaUserId(data.userId)
        setMfaTarget(data.email) // pre-fill with account email
        setLoginStep('mfa-method')
      }
    } catch {
      setLoginError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleMfaSend(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/mfa/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: mfaUserId, type: mfaMethod, target: mfaTarget }),
      })
      const data = await res.json()
      if (!data.success) {
        setLoginError(data.error ?? 'Failed to send code.')
      } else {
        setMfaDemoCode(data.demoCode ?? '')
        setMfaCode('')
        setLoginStep('mfa-code')
      }
    } catch {
      setLoginError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleMfaVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: mfaTarget, code: mfaCode }),
      })
      const data = await res.json()
      if (!data.success) {
        setLoginError(data.error ?? 'Verification failed.')
      } else {
        setLoginStep('success')
      }
    } catch {
      setLoginError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

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
            <Link href="/" className="flex items-center gap-3" aria-label="Armor home">
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
                className="text-xl font-bold tracking-wide gold-text"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Armor
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
                Dashboard
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={openLogin}
                className="hidden md:flex btn-secondary items-center gap-2 text-sm"
                aria-label="Log in to your Armor account"
              >
                <LogIn size={14} aria-hidden="true" />
                Login
              </button>
              <button
                type="button"
                onClick={openRegister}
                className="hidden md:flex btn-secondary items-center gap-2 text-sm"
                aria-label="Create a new Armor account"
              >
                <UserPlus size={14} aria-hidden="true" />
                Open Account
              </button>
              
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
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2 text-sm w-full"
                  onClick={() => { setMobileNavOpen(false); openLogin() }}
                >
                  <LogIn size={14} aria-hidden="true" />
                  Login
                </button>
                <button
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2 text-sm w-full"
                  onClick={() => { setMobileNavOpen(false); openRegister() }}
                >
                  <UserPlus size={14} aria-hidden="true" />
                  Open Account
                </button>
                <Link
                  href="/dashboard"
                  className="btn-primary flex items-center justify-center gap-2 text-sm w-full"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Dashboard
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
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
              Dashboard
              <ArrowRight size={15} />
            </Link>
            <a href="#pricing" className="btn-secondary flex items-center gap-2 px-8 py-3">
              View Pricing
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
                Join sophisticated investors who trust Armor for institutional-grade
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
                className="text-lg font-bold gold-text"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Armor
              </span>
            </div>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Armor Investment Management. All rights reserved.
            </p>

          </div>
        </div>
      </footer>

      {/* ── Login Modal ── */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setLoginOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          <div
            className="w-full max-w-md rounded-2xl p-7 relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setLoginOpen(false)}
              aria-label="Close login form"
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', background: 'transparent' }}
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* ── Step: credentials ── */}
            {loginStep === 'credentials' && (
              <>
                <div className="mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
                  >
                    <LogIn size={18} className="text-black" aria-hidden="true" />
                  </div>
                  <h2 id="login-title" className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Welcome back
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Sign in to your Armor account.
                  </p>
                </div>

                {/* Security trust strip */}
                <div className="flex items-center gap-4 mb-5 px-3 py-2 rounded-xl" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.1)' }}>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Lock size={11} style={{ color: '#eab308' }} aria-hidden="true" />
                    256-bit SSL
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Shield size={11} style={{ color: '#10b981' }} aria-hidden="true" />
                    2FA Protected
                  </div>
                </div>

                <form onSubmit={handleLoginCredentials} noValidate className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="login-id" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Email or Username
                    </label>
                    <input
                      id="login-id"
                      type="text"
                      autoComplete="username"
                      placeholder="you@example.com or username"
                      value={loginForm.identifier}
                      onChange={e => setLoginForm(f => ({ ...f, identifier: e.target.value }))}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="login-pw" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Password
                    </label>
                    <input
                      id="login-pw"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
                    style={{ opacity: loginLoading ? 0.7 : 1 }}
                  >
                    {loginLoading
                      ? <RefreshCw size={14} className="animate-spin" aria-hidden="true" />
                      : <LogIn size={14} aria-hidden="true" />}
                    {loginLoading ? 'Verifying…' : 'Login'}
                  </button>

                  <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    Leave both fields empty to enter as guest
                  </p>
                </form>
              </>
            )}

            {/* ── Step: mfa-method ── */}
            {loginStep === 'mfa-method' && (
              <>
                <div className="mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
                  >
                    <Shield size={18} style={{ color: '#10b981' }} aria-hidden="true" />
                  </div>
                  <h2 id="login-title" className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Two-Factor Authentication
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Choose how to receive your verification code.
                  </p>
                </div>

                <form onSubmit={handleMfaSend} noValidate className="flex flex-col gap-4">
                  {/* Method selector */}
                  <div className="grid grid-cols-2 gap-3">
                    {(['email', 'phone'] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setMfaMethod(m); setMfaTarget(m === 'email' ? mfaTarget : '') }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                        style={{
                          background: mfaMethod === m ? 'rgba(234,179,8,0.1)' : 'var(--bg-secondary)',
                          border: mfaMethod === m ? '1px solid rgba(234,179,8,0.35)' : '1px solid var(--border)',
                          color: mfaMethod === m ? '#eab308' : 'var(--text-secondary)',
                        }}
                      >
                        {m === 'email'
                          ? <Mail size={20} aria-hidden="true" />
                          : <Smartphone size={20} aria-hidden="true" />}
                        <span className="text-xs font-medium capitalize">{m}</span>
                      </button>
                    ))}
                  </div>

                  {/* Target input */}
                  <div>
                    <label htmlFor="mfa-target" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      {mfaMethod === 'email' ? 'Email address' : 'Phone number'}
                    </label>
                    <input
                      id="mfa-target"
                      type={mfaMethod === 'email' ? 'email' : 'tel'}
                      autoComplete={mfaMethod === 'email' ? 'email' : 'tel'}
                      placeholder={mfaMethod === 'email' ? 'you@example.com' : '+1 555 000 1234'}
                      value={mfaTarget}
                      onChange={e => setMfaTarget(e.target.value)}
                      required
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    style={{ opacity: loginLoading ? 0.7 : 1 }}
                  >
                    {loginLoading
                      ? <RefreshCw size={14} className="animate-spin" aria-hidden="true" />
                      : <Shield size={14} aria-hidden="true" />}
                    {loginLoading ? 'Sending code…' : 'Send Verification Code'}
                  </button>

                  <button type="button" onClick={() => { setLoginStep('credentials'); setLoginError('') }} className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    ← Back
                  </button>
                </form>
              </>
            )}

            {/* ── Step: mfa-code ── */}
            {loginStep === 'mfa-code' && (
              <>
                <div className="mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}
                  >
                    <Shield size={18} style={{ color: '#eab308' }} aria-hidden="true" />
                  </div>
                  <h2 id="login-title" className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Enter your code
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    A 6-digit code was sent to <strong style={{ color: 'var(--text-secondary)' }}>{mfaTarget}</strong>.
                  </p>
                </div>

                {/* Demo mode banner */}
                {mfaDemoCode && (
                  <div className="mb-4 px-3 py-2.5 rounded-xl flex items-start gap-2" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)' }}>
                    <span style={{ color: '#eab308', fontSize: 13 }}>⚠</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#eab308' }}>Demo mode</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Your code is <strong style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em' }}>{mfaDemoCode}</strong>
                        <br />Remove <code style={{ fontSize: 11 }}>demoCode</code> from the API before going to production.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleMfaVerify} noValidate className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="mfa-code-input" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Verification Code
                    </label>
                    <input
                      id="mfa-code-input"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      placeholder="000000"
                      value={mfaCode}
                      onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      className="w-full rounded-xl px-4 py-3 text-xl font-mono text-center outline-none tracking-widest transition-colors"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading || mfaCode.length !== 6}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    style={{ opacity: (loginLoading || mfaCode.length !== 6) ? 0.6 : 1 }}
                  >
                    {loginLoading
                      ? <RefreshCw size={14} className="animate-spin" aria-hidden="true" />
                      : <Check size={14} aria-hidden="true" />}
                    {loginLoading ? 'Verifying…' : 'Verify Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginStep('mfa-method'); setLoginError(''); setMfaDemoCode('') }}
                    className="text-xs text-center"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ← Resend or change method
                  </button>
                </form>
              </>
            )}

            {/* ── Step: success ── */}
            {loginStep === 'success' && (
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <Check size={28} style={{ color: '#10b981' }} aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Authenticated!
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  Identity verified. Opening your dashboard…
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Open Dashboard
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Registration Modal ── */}
      {registerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setRegisterOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-title"
        >
          <div
            className="w-full max-w-md rounded-2xl p-7 relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setRegisterOpen(false)}
              aria-label="Close registration form"
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', background: 'transparent' }}
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
              >
                <UserPlus size={18} className="text-black" aria-hidden="true" />
              </div>
              <h2 id="register-title" className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Open Account
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Create your Armor investment account.
              </p>
            </div>

            {registerSuccess ? (
              <div className="text-center py-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                >
                  <Check size={24} style={{ color: '#10b981' }} aria-hidden="true" />
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Account created!</p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                  Welcome to Armor. You can now open the dashboard.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(false)}
                    className="flex-1 btn-secondary text-sm py-2.5"
                  >
                    Close
                  </button>
                  <Link href="/dashboard" className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5">
                    Open Dashboard <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="reg-username" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Username
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="e.g. john_doe"
                    value={registerForm.username}
                    onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Minimum 8 characters"
                    value={registerForm.password}
                    onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirm" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Confirm Password
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Repeat your password"
                    value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="reg-country" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Country
                  </label>
                  <select
                    id="reg-country"
                    required
                    value={registerForm.country}
                    onChange={e => setRegisterForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: registerForm.country ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    <option value="" disabled>Select your country</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c} style={{ color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {registerError && (
                  <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    {registerError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
                  style={{ opacity: registerLoading ? 0.7 : 1 }}
                >
                  {registerLoading ? (
                    <RefreshCw size={14} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <UserPlus size={14} aria-hidden="true" />
                  )}
                  {registerLoading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  )
}
