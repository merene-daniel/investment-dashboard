import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Armor's privacy policy — how we collect, use, and protect your personal data. GDPR and CCPA compliant. We never sell your data.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Armor',
    description:
      'How Armor handles your personal data — fully GDPR and CCPA compliant with zero data selling.',
    url: '/privacy',
  },
  robots: {
    index: true,
    follow: false,
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
