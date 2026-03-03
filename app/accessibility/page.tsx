'use client'

import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, Shield, Eye, Keyboard,
  Monitor, Type, Volume2, MousePointer, CheckCircle,
  AlertCircle, Mail,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const LAST_UPDATED = 'March 2026'

const STANDARDS = [
  {
    icon: Eye,
    title: 'Perceivable',
    color: 'var(--accent-blue)',
    tintBg: 'rgba(59,130,246,0.08)',
    tintBorder: 'rgba(59,130,246,0.2)',
    items: [
      'All non-text content has descriptive alternative text',
      'Color is never the sole means of conveying information',
      'Minimum 4.5:1 contrast ratio for body text; 3:1 for large text',
      'Content remains accessible when text is scaled up to 200%',
    ],
  },
  {
    icon: Keyboard,
    title: 'Operable',
    color: 'var(--accent-green)',
    tintBg: 'rgba(16,185,129,0.08)',
    tintBorder: 'rgba(16,185,129,0.2)',
    items: [
      'All interactive elements are fully keyboard-navigable',
      'Visible focus indicators on every focusable element',
      'No keyboard traps — users can always move focus freely',
      'Skip-to-main-content link available at the top of every page',
    ],
  },
  {
    icon: Monitor,
    title: 'Understandable',
    color: 'var(--accent-purple)',
    tintBg: 'rgba(139,92,246,0.08)',
    tintBorder: 'rgba(139,92,246,0.2)',
    items: [
      'Language of each page is declared in the HTML element',
      'Error messages identify the field and describe the problem',
      'Labels are programmatically associated with all form inputs',
      'Consistent navigation patterns across all pages and views',
    ],
  },
  {
    icon: Volume2,
    title: 'Robust',
    color: 'var(--accent-amber)',
    tintBg: 'rgba(245,158,11,0.08)',
    tintBorder: 'rgba(245,158,11,0.2)',
    items: [
      'Semantic HTML used throughout for screen-reader compatibility',
      'ARIA roles, labels, and live regions applied where appropriate',
      'Compatible with JAWS, NVDA, VoiceOver, and TalkBack',
      'Regularly tested against assistive technology stacks',
    ],
  },
]

const FEATURES = [
  { icon: Keyboard,     title: 'Keyboard Navigation',   desc: 'Every feature — tabs, modals, dropdowns, and data tables — can be operated using only a keyboard. Tab, Enter, Space, and arrow keys follow standard ARIA design patterns.' },
  { icon: Monitor,      title: 'Screen Reader Support',  desc: 'We use semantic HTML5 landmarks, descriptive aria-labels, and aria-live regions to ensure screen readers announce dynamic content changes (P&L updates, chart data, form validation) accurately.' },
  { icon: Type,         title: 'Resizable Text',         desc: 'All text sizes are defined in relative units (rem). The layout reflows gracefully when browser font size is increased to 200%, with no horizontal scrolling required.' },
  { icon: MousePointer, title: 'Touch Targets',          desc: 'All interactive elements meet the 44×44 CSS pixel minimum touch-target size, making the dashboard usable on mobile devices and with switch-access assistive technology.' },
  { icon: Eye,          title: 'Color & Contrast',       desc: 'Text and UI components meet WCAG AA contrast requirements. Dark mode and light mode are both tested. Critical information (gains, losses, alerts) is always conveyed with text labels, not color alone.' },
]

const LIMITATIONS = [
  { area: 'Complex Charts', detail: 'Interactive SVG charts (portfolio performance, sector allocation) expose data through table alternatives and aria-label summaries, but some advanced assistive technology interactions may be limited.' },
  { area: 'Third-Party Content', detail: 'Embedded content from external providers (market data feeds, video tutorials) may not fully conform to our accessibility standards. We work to minimise reliance on inaccessible third-party widgets.' },
  { area: 'PDF Exports', detail: 'Downloadable PDF reports are not yet fully tagged for screen-reader navigation. Tagged PDF generation is on our accessibility roadmap for Q3 2026.' },
]

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Nav ── */}
      <header role="banner">
        <nav
          className="sticky top-0 z-40"
          aria-label="Accessibility page navigation"
          style={{ background: 'rgba(13,13,10,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="Back to Armor home">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }} aria-hidden="true">
                <Shield size={16} color="#000" />
              </div>
              <span className="text-lg font-bold gold-text" style={{ fontFamily: 'var(--font-display)' }}>Armor</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/" className="hidden md:flex items-center gap-1.5 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
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
          style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.05) 0%, transparent 65%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)', color: 'var(--gold)' }}>
            <Eye size={11} aria-hidden="true" /> Accessibility Policy
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Built for <span className="gold-text">Everyone</span>
          </h1>
          <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Armor is committed to ensuring that our investment platform is accessible to all users, including those with disabilities. We target conformance with the <strong style={{ color: 'var(--text-primary)' }}>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-16 flex flex-col gap-12">

        {/* ── WCAG Principles ── */}
        <section aria-labelledby="standards-heading">
          <h2 id="standards-heading" className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Our Standards: WCAG 2.1 AA
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            We follow the four core WCAG principles — Perceivable, Operable, Understandable, and Robust.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STANDARDS.map(s => {
              const Icon = s.icon
              return (
                <Card key={s.title} className="rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.tintBg, border: `1px solid ${s.tintBorder}` }}>
                        <Icon size={16} style={{ color: s.color }} aria-hidden="true" />
                      </div>
                      <CardTitle style={{ color: 'var(--text-primary)' }}>{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-2">
                      {s.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: s.color }} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ── Platform Features ── */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Accessible Features
          </h2>
          <div className="flex flex-col gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <Card key={f.title} className="rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.15)' }}>
                      <Icon size={16} style={{ color: 'var(--gold)' }} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ── Known Limitations ── */}
        <section aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Known Limitations
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            We are transparent about areas where we are still working to improve.
          </p>
          <div className="flex flex-col gap-3">
            {LIMITATIONS.map(l => (
              <Alert key={l.area} variant="destructive" className="rounded-xl">
                <AlertCircle size={15} aria-hidden="true" />
                <AlertTitle>{l.area}</AlertTitle>
                <AlertDescription style={{ color: 'var(--text-secondary)' }}>{l.detail}</AlertDescription>
              </Alert>
            ))}
          </div>
        </section>

        {/* ── Testing ── */}
        <Card className="rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <CardHeader>
            <CardTitle as="h2" id="testing-heading" className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              How We Test
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Accessibility testing at Armor uses a combination of automated scanning (Axe, Lighthouse) and manual testing with screen readers (VoiceOver on macOS/iOS, NVDA on Windows) and keyboard-only navigation. We conduct accessibility audits with every major release cycle.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              User feedback is our most valuable signal. If you encounter a barrier that isn't listed here, please let us know so we can address it in the next release.
            </p>
          </CardContent>
        </Card>

        {/* ── Contact ── */}
        <Card className="rounded-2xl text-center" style={{ background: 'rgba(234,179,8,0.04)', borderColor: 'rgba(234,179,8,0.15)' }}>
          <CardContent className="p-6">
            <Mail size={28} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} aria-hidden="true" />
            <h2 id="contact-heading" className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Report an Accessibility Issue
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              If you experience any difficulty accessing content or functionality on Armor, please contact our accessibility team. We aim to respond within 2 business days.
            </p>
            <a
              href="mailto:accessibility@armor-invest.com"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <Mail size={14} aria-hidden="true" />
              accessibility@armor-invest.com
            </a>
          </CardContent>
        </Card>
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
            <Link href="/fraud-prevention" className="text-xs transition-colors hover:text-yellow-400" style={{ color: 'var(--text-muted)' }}>Fraud Prevention</Link>
            <Link href="/accessibility"    className="text-xs transition-colors" style={{ color: 'var(--gold)' }}>Accessibility</Link>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Armor Investment Management.</p>
        </div>
      </footer>

    </main>
  )
}
