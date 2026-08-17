import type { Metadata } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { SiteNavigation } from '@/components/SiteNavigation'
import { SiteFooter } from '@/components/SiteFooter'
import { StickyCTA } from '@/components/StickyCTA'
import StructuredData from '@/components/StructuredData'
import { AnalyticsBeacon } from '@/components/AnalyticsBeacon'
import { ScrollProgress } from '@/components/ScrollProgress'
import { headers } from 'next/headers'
import { buildSearchIndex } from '@/lib/search-index'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans', preload: true })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', preload: false })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: 'AI Advisor & AI Systems Architect | Subodh KC',
    template: '%s | Subodh KC',
  },
  description:
    'AI advisor and systems architect helping leaders identify worthwhile AI opportunities, make evidence-backed decisions, and move the right systems from architecture into production.',
  keywords: [
    'AI Advisor',
    'AI Systems Architect',
    'AI Strategy Advisor',
    'Enterprise AI Advisor',
    'AI Decision Support',
    'AI Opportunity Discovery',
    'AI Systems Architecture',
    'AI Architecture',
    'AI Vendor Evaluation',
    'AI Build vs Buy',
    'AI Governance',
    'Production AI',
    'AI Implementation',
    'Subodh KC',
  ],
  authors: [{ name: 'Subodh KC', url: 'https://subodhkc.com' }],
  creator: 'Subodh KC',
  publisher: 'Subodh KC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://subodhkc.com'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': 'https://subodhkc.com/feed.xml',
    },
  },
  other: {
    'webmention': 'https://subodhkc.com/api/webmention',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subodhkc.com',
    siteName: 'Subodh KC | AI Advisor & AI Systems Architect',
    title: 'AI Advisor & AI Systems Architect | Subodh KC',
    description:
      'AI advisor and systems architect helping leaders identify worthwhile AI opportunities, make evidence-backed decisions, and move the right systems from architecture into production.',
    images: [
      {
        url: '/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC | AI Advisor & AI Systems Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Advisor & AI Systems Architect | Subodh KC',
    description:
      'AI advisor and systems architect. From possibility to decision. From decision to production.',
    creator: '@subodhkc',
    images: ['/portrait.jpeg'],
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
  category: 'Technology',
  classification: 'AI Advisory, AI Strategy, AI Systems Architecture, Production AI, AI Governance',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isResumePage = pathname.startsWith('/resume')
  const isSchoolPickup = pathname.startsWith('/school-pickup')
  const isChromeless = isResumePage || isSchoolPickup
  const searchEntries = isChromeless ? [] : buildSearchIndex()

  if (isChromeless) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} bg-white`}>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <StructuredData />
        <link rel="icon" href="/icon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="author" content="Subodh KC" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="language" content="English" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#2b2e33" />
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} />
        )}
        <meta name="person" content="Subodh KC" />
        <meta name="person-type" content="AI Advisor & AI Systems Architect" />
        <meta name="profile:first_name" content="Subodh" />
        <meta name="profile:last_name" content="KC" />
        <meta name="profile:username" content="subodhkc" />
        <link rel="llms-txt" href="https://subodhkc.com/llms.txt" type="text/plain" />
        <link rel="ai-txt" href="https://subodhkc.com/ai.txt" type="application/json" />
        <link rel="llms-full-txt" href="https://subodhkc.com/llms-full.txt" type="text/plain" />
        <link rel="me" href="https://www.linkedin.com/in/subodhkc" />
        <link rel="me" href="https://github.com/subodhkc" />
        <link rel="me" href="https://twitter.com/subodhkc" />
        <link rel="me" href="https://medium.com/@subodhkc" />
        <link rel="alternate" hrefLang="en" href="https://subodhkc.com" />
        <link rel="alternate" hrefLang="x-default" href="https://subodhkc.com" />
      </head>
      <body style={{ background: "var(--bg)", color: "var(--fg)" }}>
        <ScrollProgress />
        <SiteNavigation searchEntries={searchEntries} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <StickyCTA />
        <AnalyticsBeacon />
      </body>
    </html>
  )
}
