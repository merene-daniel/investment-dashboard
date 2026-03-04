import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investment Education',
  description:
    'Free investment education resources — from beginner basics like compound interest and ETFs to advanced topics like derivatives, portfolio theory, and tax optimisation.',
  alternates: {
    canonical: '/education',
  },
  openGraph: {
    title: 'Investment Education | Armor',
    description:
      'Build your investment knowledge with beginner to advanced lessons on stocks, ETFs, derivatives, and portfolio management.',
    url: '/education',
  },
}

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children
}
