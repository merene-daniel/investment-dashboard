import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fraud Prevention',
  description:
    'Learn how Armor protects you from phishing, social engineering, and account takeover — and how to spot scams that impersonate us.',
  alternates: {
    canonical: '/fraud-prevention',
  },
  openGraph: {
    title: 'Fraud Prevention | Armor',
    description:
      'How Armor protects your account from fraud, phishing, and social engineering attacks.',
    url: '/fraud-prevention',
  },
}

export default function FraudPreventionLayout({ children }: { children: React.ReactNode }) {
  return children
}
