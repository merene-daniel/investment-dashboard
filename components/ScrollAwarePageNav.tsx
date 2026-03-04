'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'

export interface NavItem {
  href: string
  label: string
  /** Renders the item as plain gold text (no link) — marks the current page */
  active?: boolean
}

interface Props {
  items: NavItem[]
}

/**
 * Scroll-aware sticky nav shared by the About and Security pages.
 * The surrounding page can be a server component; only this bar is hydrated.
 */
export function ScrollAwarePageNav({ items }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header role="banner">
      <nav
        aria-label="Primary navigation"
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background:   scrolled ? 'rgba(13,13,10,0.88)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(234,179,8,0.1)' : '1px solid transparent',
          transition:   'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Back to Armor home">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
              aria-hidden="true"
            >
              <Shield size={16} color="#000" />
            </div>
            <span
              className="text-lg font-bold gold-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Armor
            </span>
          </Link>

          {/* Centre nav links */}
          <nav className="hidden md:flex items-center justify-center gap-6" aria-label="Site navigation">
            {items.map(item =>
              item.active ? (
                <span
                  key={item.href}
                  className="text-sm font-medium"
                  style={{ color: 'var(--gold)' }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm transition-colors hover:text-yellow-400"
                  style={{ color: scrolled ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right-hand actions */}
          <div className="flex items-center justify-end gap-3">
            <ThemeToggle />
            <Button
              variant={scrolled ? 'default' : 'outline'}
              size="sm"
              asChild
              className="hidden md:flex"
            >
              <Link href="/" aria-label="Log in to your Armor account">Login</Link>
            </Button>
            <Button size="sm" asChild className="hidden md:flex">
              <Link href="/" aria-label="Open a new Armor account">Open Account</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
