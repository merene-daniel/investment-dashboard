import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Armor uses AES-256 encryption, TLS 1.3, SOC 2 Type II compliance, and zero data-selling practices to keep your investments and personal data safe.',
  alternates: {
    canonical: '/security',
  },
  openGraph: {
    title: 'Security at Armor | Investment Management',
    description:
      'Bank-grade security including AES-256 encryption, MFA, SOC 2 Type II, and ISO 27001 compliance.',
    url: '/security',
  },
}

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children
}
