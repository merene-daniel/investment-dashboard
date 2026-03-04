import { NextResponse, type NextRequest } from 'next/server'

/**
 * Build a Content-Security-Policy string with a per-request nonce.
 *
 * Rules:
 *  - script-src: only same-origin + the nonce (no unsafe-inline, no unsafe-eval)
 *  - style-src:  same-origin + unsafe-inline (React inline styles are pervasive)
 *  - font-src:   same-origin + data: (next/font self-hosts Google Fonts at build time)
 *  - img-src:    same-origin + data: + blob: (SVG data URIs, blob object URLs)
 *  - connect-src: same-origin only (API calls, HMR websocket in dev)
 *  - frame-ancestors / frame-src: none (prevents clickjacking)
 *  - upgrade-insecure-requests: production only (HTTP→HTTPS coercion)
 */
function buildCSP(nonce: string): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ]

  if (process.env.NODE_ENV === 'production') {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}

export function middleware(request: NextRequest) {
  // Cryptographically random nonce — unique per request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp   = buildCSP(nonce)

  // Forward nonce to the layout (server component reads via next/headers)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // ── Security headers ────────────────────────────────────────────────────────
  response.headers.set('Content-Security-Policy', csp)

  // HSTS: 2 years, include subdomains, eligible for preload list
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    )
  }

  // Isolates the browsing context — prevents cross-origin window.opener exploits
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')

  // Prevents other origins from reading our resources (fetch, XHR, etc.)
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  return response
}

/**
 * Run middleware on every route except:
 * - Next.js static assets  (_next/static, _next/image)
 * - favicon
 * - public image files
 *
 * Also skip Next.js prefetch requests — they don't render HTML so CSP is
 * unnecessary overhead.
 */
export const config = {
  matcher: [
    {
      source:
        '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
