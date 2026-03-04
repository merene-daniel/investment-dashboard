/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],

  // Gzip/Brotli compress responses
  compress: true,

  // Remove X-Powered-By header (minor security + byte saving)
  poweredByHeader: false,

  // Tree-shake named imports from large icon / chart packages at build time
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  async headers() {
    return [
      // Security + performance headers on every response
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',          value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Immutable cache for Next.js static chunks (content-hashed filenames)
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Long-lived cache for public images
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // No caching for API routes
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Auth-related URLs — login/register are modals on the landing page
      { source: '/login',    destination: '/', permanent: false },
      { source: '/signin',   destination: '/', permanent: false },
      { source: '/register', destination: '/', permanent: false },
      { source: '/signup',   destination: '/', permanent: false },
      { source: '/logout',   destination: '/', permanent: false },

      // Dashboard aliases
      { source: '/home',        destination: '/dashboard', permanent: true },
      { source: '/portfolio',   destination: '/dashboard', permanent: true },
      { source: '/investments', destination: '/dashboard', permanent: true },
      { source: '/account',     destination: '/dashboard', permanent: true },

      // Common misspellings / alternative slugs
      { source: '/fraud',         destination: '/fraud-prevention', permanent: true },
      { source: '/privacy-policy',destination: '/privacy',          permanent: true },
      { source: '/learn',         destination: '/education',         permanent: true },
      { source: '/courses',       destination: '/education',         permanent: true },
      { source: '/a11y',          destination: '/accessibility',     permanent: true },
    ]
  },
}

module.exports = nextConfig
