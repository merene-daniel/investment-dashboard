import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Armor',
  description:
    'Learn about Armor — our mission to make professional-grade investment management accessible to everyone, our team, and the milestones that shaped us.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Armor | Investment Management',
    description:
      'Meet the team behind Armor and discover our mission to democratise professional investment management.',
    url: '/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
