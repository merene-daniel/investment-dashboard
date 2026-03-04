import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const BASE_URL = 'https://armorinvest.com'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Armor — Professional Investment Management',
    template: '%s | Armor',
  },
  description:
    'Armor is a professional investment portfolio management platform. Track holdings, analyse performance, manage watchlists, and stay secure — all in one place.',
  keywords: [
    'investment management',
    'portfolio tracker',
    'stock portfolio',
    'investment dashboard',
    'wealth management',
    'holdings tracker',
    'financial analytics',
    'investment platform',
  ],
  authors: [{ name: 'Armor', url: BASE_URL }],
  creator: 'Armor',
  publisher: 'Armor',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Armor',
    title: 'Armor — Professional Investment Management',
    description:
      'Track your portfolio, analyse performance, and manage your investments with confidence.',
    images: [
      {
        url: '/images/armor_logo.png',
        width: 1200,
        height: 630,
        alt: 'Armor — Investment Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Armor — Professional Investment Management',
    description:
      'Track your portfolio, analyse performance, and manage your investments with confidence.',
    images: ['/images/armor_logo.png'],
    creator: '@armorinvest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        {/* Anti-flash: external script covered by script-src 'self' — no nonce/hash needed */}
        <script src="/theme-init.js" />
      </head>
      <body className="grain bg-grid min-h-screen">
        {/* JSON-LD Organisation schema — hash pinned in CSP (proxy.ts) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Armor',
              url: BASE_URL,
              logo: `${BASE_URL}/images/armor_logo.png`,
              description:
                'Professional investment portfolio management platform for tracking holdings, analysing performance, and staying secure.',
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'support@armorinvest.com',
              },
            }),
          }}
        />
        <ThemeProvider>
          {/* Skip navigation — first focusable element on every page */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
