/**
 * lib/site-url.ts — Canonical base URL helper
 *
 * Safe to import in both server and client components (no 'server-only').
 *
 * Priority order:
 *   1. NEXT_PUBLIC_SITE_URL  — your custom domain, set explicitly
 *   2. http://localhost:3000 — local dev fallback
 *
 * On Netlify, set NEXT_PUBLIC_SITE_URL in:
 *   Site configuration → Environment variables → NEXT_PUBLIC_SITE_URL
 */

/** Returns the canonical origin (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

/**
 * Builds an absolute URL from a relative path.
 * Required for fetch() calls inside server components, og:url, canonical, etc.
 *
 * @example absUrl('/api/portfolio') → 'https://armorinvest.com/api/portfolio'
 */
export function absUrl(path: string): string {
  const base = getSiteUrl()
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalised}`
}
