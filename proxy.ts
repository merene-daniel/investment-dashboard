import { NextResponse, type NextRequest } from 'next/server'

/**
 * Build a Content-Security-Policy string using hash-based allowlisting.
 *
 * Why hashes instead of nonces:
 *   Nonces require the proxy to forward a per-request header (x-nonce) to
 *   the layout server component. On Netlify, the edge→serverless hop can strip
 *   custom request headers, causing the layout to render scripts without a
 *   nonce attribute while the CSP still demands one → every inline script blocked.
 *
 *   Hashes are static and embedded directly in the CSP header — no header
 *   forwarding needed, works on any deployment platform.
 *
 * Inline scripts:
 *   - /public/theme-init.js  → external, covered by 'self' (no hash needed)
 *   - JSON-LD <script>       → hash pinned below (content is static)
 *
 * To regenerate the JSON-LD hash after changing its content:
 *   node -e "const c=require('crypto');const s=JSON.stringify({...});console.log(c.createHash('sha256').update(s).digest('base64'))"
 */

function buildCSP(): string {
  const directives = [
    "default-src 'self'",
    // 'self'          — Next.js static chunks (/_next/static/...)
    // 'unsafe-inline' — REQUIRED for Next.js App Router RSC payload scripts
    //                   (self.__next_f.push(...) inline scripts that carry component
    //                   props/data to the client). These change on every request so
    //                   static hashes are impossible; nonces require header forwarding
    //                   which Netlify's edge→serverless hop strips. This is a known
    //                   Next.js App Router limitation — see nextjs.org/docs/app/building-your-application/configuring/content-security-policy
    "script-src 'self' 'unsafe-inline'",
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

export function proxy(_request: NextRequest) {
  const response = NextResponse.next()

  // ── Security headers ────────────────────────────────────────────────────────
  response.headers.set('Content-Security-Policy', buildCSP())

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
