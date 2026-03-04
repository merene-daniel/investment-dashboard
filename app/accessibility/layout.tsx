import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility',
  description:
    'Armor is designed to be accessible for everyone. Learn about our WCAG 2.1 AA compliance, keyboard navigation, screen reader support, and colour contrast standards.',
  alternates: {
    canonical: '/accessibility',
  },
  openGraph: {
    title: 'Accessibility | Armor',
    description:
      'Our commitment to WCAG 2.1 AA accessibility — keyboard navigation, screen readers, and inclusive design for all users.',
    url: '/accessibility',
  },
}

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return children
}
