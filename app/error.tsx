'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        aria-hidden="true"
      >
        ⚠️
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
        Something went wrong
      </h1>

      <p className="mt-3 text-sm max-w-sm leading-relaxed text-secondary-foreground">
        An unexpected error occurred. You can try again or return home.
      </p>

      {error.digest && (
        <p className="mt-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)', color: '#0d0d0a' }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border bg-card text-secondary-foreground transition-colors hover:border-[var(--border-hover)] hover:text-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
