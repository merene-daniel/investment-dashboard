'use client'

import {
  Shield, Lock, Eye, Server, Key, FileCheck,
  Globe2, UserCheck, Database, RefreshCw,
  AlertTriangle, CheckCircle, Mail, ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ── Static data ───────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: Lock,
    title: 'AES-256 Encryption',
    description: 'All data encrypted at rest (AES-256-GCM) and in transit via TLS 1.3.',
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
  { label: 'Protocol',     value: 'TLS 1.3 (with TLS 1.2 fallback)'              },
  { label: 'Cipher',       value: 'ECDHE-RSA + AES-128-GCM / AES-256-GCM'       },
  { label: 'Certificate',  value: 'Extended Validation (EV) SSL'                 },
  { label: 'HSTS',         value: 'max-age 31 536 000 s, includeSubDomains'      },
  { label: 'HTTP redirect',value: 'Permanent 301 enforced on all endpoints'      },
]

const ENCRYPTION_AT_REST = [
  { label: 'Database',        value: 'AES-256-GCM at storage layer (MongoDB Atlas)'     },
  { label: 'Field-level',     value: 'PII fields encrypted at the application layer'    },
  { label: 'Key management',  value: 'AWS KMS — HSM-backed, FIPS 140-2 Level 3'       },
  { label: 'Key rotation',    value: 'Automated every 90 days'                          },
  { label: 'Backups',         value: 'Encrypted, geo-redundant — 30-day retention'     },
]

const COMPLIANCE = [
  {
    badge: 'SOC 2 TYPE II',
    color: '#10b981',
    title: 'Service Organisation Control 2',
    points: [
      'Annual third-party audit covering all five Trust Service Criteria',
      'Security controls: logical & physical access, change management, risk mitigation',
      'Availability commitments and incident response SLAs',
      'Processing integrity, confidentiality, and privacy controls',
    ],
  },
  {
    badge: 'GDPR',
    color: '#3b82f6',
    title: 'General Data Protection Regulation (EU)',
    points: [
      'Lawful basis established for every category of personal data processed',
      'Data subject rights: access, rectification, erasure, portability',
      'Data Processing Agreements in place with all sub-processors',
      'Breach notification within 72 hours if required',
    ],
  },
  {
    badge: 'CCPA',
    color: '#f59e0b',
    title: 'California Consumer Privacy Act',
    points: [
      'California residents may request a full copy of data held about them',
      'Right to opt out of data sale (we never sell data, by policy)',
      'Right to deletion fulfilled within 45 days of a verified request',
    ],
  },
  {
    badge: 'ISO 27001',
    color: '#8b5cf6',
    title: 'Information Security Management',
    points: [
      'ISMS controls mapped to ISO/IEC 27001:2022 Annex A',
      'Risk register reviewed quarterly by the security team',
      'Formal certification audit in progress — expected Q3 2025',
    ],
  },
]

const PRIVACY_COLLECT = [
  'Account credentials (email address, hashed password)',
  'Portfolio data you manually enter (holdings, transactions, watchlist)',
  'Anonymised, aggregated usage analytics (no PII)',
  'Session metadata for security monitoring (IP, user-agent)',
]

const PRIVACY_NEVER = [
  'Sell or rent your personal or financial data to any third party',
  'Share your portfolio data with advertisers or marketing partners',
  'Access your account without your explicit consent',
  'Retain your data beyond 30 days after a deletion request',
  'Use your investment decisions for AI/ML training',
]

const DATA_HANDLING = [
  {
    icon: Globe2,
    title: 'Data Flow',
    description: 'Data travels over TLS 1.3 to our API, is encrypted at the application layer, and persisted to encrypted storage. No unencrypted financial data is ever written to disk.',
  },
  {
    icon: Database,
    title: 'Storage',
    description: 'MongoDB Atlas (AWS us-east-1) with encryption at rest. Geo-redundant replicas in a private VPC with no public IP exposure.',
  },
  {
    icon: Key,
    title: 'Access Control',
    description: 'Production access requires short-lived credentials via Vault. Every access event is logged to an immutable audit trail reviewed weekly.',
  },
  {
    icon: RefreshCw,
    title: 'Retention',
    description: 'Data retained for the lifetime of your account plus 30 days after a verified deletion request, then permanently purged.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    description: 'Request a full JSON export, correct inaccurate records, or permanently delete your account from Settings → Privacy within 30 days.',
  },
  {
    icon: Server,
    title: 'Sub-processors',
    description: 'A minimal, audited set of sub-processors (hosting, email, analytics). Full list available on request. Each operates under a signed DPA.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function SecurityTab() {
  return (
    <div className="space-y-6 pb-6 fade-in-up">

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} style={{ color: '#eab308' }} aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#eab308', letterSpacing: '0.1em' }}>
              SECURITY &amp; TRUST
            </span>
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Security Centre
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Institutional-grade protection for every portfolio and transaction.
          </p>
        </div>
        <Link
          href="/security"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <ExternalLink size={12} aria-hidden="true" />
          Full Security Page
        </Link>
      </div>

      {/* ── Quick-stat strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: 'AES-256', label: 'Encryption at rest'   },
          { value: 'TLS 1.3', label: 'Encryption in transit' },
          { value: 'SOC 2',   label: 'Type II certified'    },
          { value: '0',       label: 'Data sold'            },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="font-mono text-xl font-bold mb-0.5" style={{ color: '#eab308' }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Four pillars ─────────────────────────────────────────────── */}
      <section aria-labelledby="pillars-heading">
        <h2
          id="pillars-heading"
          className="text-sm font-mono mb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          SECURITY PILLARS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map(p => {
            const Icon = p.icon
            return (
              <Card key={p.title} className="flex flex-col gap-3 p-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                >
                  <Icon size={18} style={{ color: p.color }} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
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
      </section>

      {/* ── Encryption ───────────────────────────────────────────────── */}
      <section aria-labelledby="enc-heading">
        <h2
          id="enc-heading"
          className="text-sm font-mono mb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          DATA ENCRYPTION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* In Transit */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe2 size={15} style={{ color: '#eab308' }} aria-hidden="true" />
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ENCRYPTION_IN_TRANSIT.map(row => (
                  <li key={row.label}>
                    <span className="block text-xs font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Database size={15} style={{ color: '#eab308' }} aria-hidden="true" />
                At Rest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ENCRYPTION_AT_REST.map(row => (
                  <li key={row.label}>
                    <span className="block text-xs font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
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
      </section>

      {/* ── Compliance ───────────────────────────────────────────────── */}
      <section aria-labelledby="comp-heading">
        <h2
          id="comp-heading"
          className="text-sm font-mono mb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          COMPLIANCE &amp; CERTIFICATIONS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPLIANCE.map(item => (
            <Card
              key={item.badge}
              className="p-5"
              aria-label={`${item.badge} compliance`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  className="text-xs font-mono font-bold"
                  style={{
                    background: `${item.color}15`,
                    color:      item.color,
                    border:     `1px solid ${item.color}30`,
                  }}
                >
                  {item.badge}
                </Badge>
                <h3 className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {item.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {item.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle
                      size={12}
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
            </Card>
          ))}
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────────────── */}
      <section aria-labelledby="priv-heading">
        <h2
          id="priv-heading"
          className="text-sm font-mono mb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          PRIVACY COMMITMENT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What we collect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {PRIVACY_COLLECT.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#3b82f6' }} aria-hidden="true" />
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What we will <em>never</em> do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {PRIVACY_NEVER.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div
                      className="mt-0.5 flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                      aria-hidden="true"
                    >
                      <span style={{ color: '#ef4444', fontSize: '8px', fontWeight: 700, lineHeight: 1 }}>✕</span>
                    </div>
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Data Handling ────────────────────────────────────────────── */}
      <section aria-labelledby="dh-heading">
        <h2
          id="dh-heading"
          className="text-sm font-mono mb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          HOW YOUR DATA IS HANDLED
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATA_HANDLING.map(item => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <Icon size={14} style={{ color: '#8b5cf6' }} aria-hidden="true" />
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
      </section>

      {/* ── Responsible Disclosure ───────────────────────────────────── */}
      <section aria-labelledby="disc-heading">
        <h2
          id="disc-heading"
          className="text-sm font-mono mb-3"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          RESPONSIBLE DISCLOSURE
        </h2>
        <Alert variant="gold" className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top left, rgba(234,179,8,0.04) 0%, transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} style={{ color: '#eab308' }} aria-hidden="true" />
                <AlertTitle className="mb-0 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Report a Vulnerability
                </AlertTitle>
              </div>
              <AlertDescription>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Found a security issue? We welcome responsible disclosure and commit to a
                  collaborative, no-legal-action process for good-faith researchers.
                </p>
                <ul className="space-y-1.5">
                  {[
                    '90-day coordinated disclosure window',
                    'Acknowledgement within 48 hours',
                    'No legal action against good-faith researchers',
                    'CVE credit and Hall-of-Fame listing for valid reports',
                  ].map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#eab308' }} aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  SECURITY CONTACT
                </p>
                <a
                  href="mailto:security@aurum.app"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-yellow-400"
                  style={{ color: '#eab308' }}
                >
                  <Mail size={13} aria-hidden="true" />
                  security@aurum.app
                </a>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  PGP-encrypted reports accepted — public key on request.
                </p>
              </div>
              <div
                className="p-3 rounded-xl text-xs leading-relaxed"
                style={{
                  background: 'rgba(234,179,8,0.05)',
                  border:     '1px solid rgba(234,179,8,0.12)',
                  color:      'var(--text-muted)',
                }}
              >
                <strong style={{ color: 'var(--text-secondary)' }}>Out of scope:</strong>{' '}
                DoS attacks, social engineering of staff, third-party service vulnerabilities,
                and scanner-generated reports without proof-of-concept.
              </div>
            </div>
          </div>
        </Alert>
      </section>

    </div>
  )
}
