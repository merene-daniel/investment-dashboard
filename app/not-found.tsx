import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

const links = [
  { href: '/',          label: 'Home'      },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/education', label: 'Education' },
  { href: '/about',     label: 'About'     },
  { href: '/security',  label: 'Security'  },
]

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      {/* Large 404 */}
      <p
        className="gold-text select-none font-display font-bold leading-none"
        style={{ fontSize: 'clamp(7rem, 20vw, 14rem)' }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-2 text-foreground">
        Page not found
      </h1>

      <p className="mt-3 text-sm max-w-sm leading-relaxed text-secondary-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Suggested pages */}
      <nav aria-label="Suggested pages" className="mt-10 flex flex-wrap justify-center gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card text-secondary-foreground transition-colors hover:border-[var(--border-hover)] hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Primary CTA */}
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          background: 'linear-gradient(135deg, #eab308, #ca8a04)',
          color: '#0d0d0a',
        }}
      >
        Go home
      </Link>
    </div>
  )
}
