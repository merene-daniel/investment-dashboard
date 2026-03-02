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
}

module.exports = nextConfig
