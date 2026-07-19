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

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: 'Subodh KC — AI Systems Architect | AI Governance Expert | Former Fortune 50 AI Strategy CTL',
    template: '%s | Subodh KC',
  },
  description:
    'Subodh KC — AI Systems Architect and Governance Expert. Former Fortune 50 AI Strategy CTL with 16+ years full-stack development experience. Specializing in AI governance frameworks, EU AI Act compliance, NIST AI RMF, ISO 42001. Building production AI systems that scale with confidence.',
  keywords: [
    'AI Systems Architect',
    'AI Developer',
    'AI Governance Architect',
    'AI Strategy Consultant',
    'Enterprise AI Architect',
    'Full-Stack AI Developer',
    'AI Platform Engineer',
    'AI Governance Expert',
    'AI Regulatory Compliance',
    'EU AI Act Compliance',
    'NIST AI RMF',
    'ISO 42001',
    'NYC Local Law 144',
    'AI Risk Management',
    'AI Governance Frameworks',
    'Fortune 50 AI Leadership',
    'AI Production Systems',
    'Responsible AI Development',
    'AI Ethics and Compliance',
    'HAIEC Platform',
    'AI Technical Leadership',
    'AI System Architecture',
    'Bias Detection',
    'AI Audit Framework',
    'Model Governance',
    'Cognitive Systems Management',
    'Subodh Kumar Kc',
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
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subodhkc.com',
    siteName: 'Subodh KC — AI Systems Architect & Governance Expert',
    title: 'Subodh KC | AI Systems Architect & Governance Expert',
    description:
      'AI Systems Architect and Governance Expert. Former Fortune 50 AI Strategy CTL, founder of KestrelVoice, co-founder of HAIEC. Production AI systems — architecture, deployment, and governance at enterprise scale.',
    images: [
      {
        url: '/portrait.jpeg',
        width: 1024,
        height: 1024,
        alt: 'Subodh KC — AI Systems Architect & Governance Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh KC — AI Systems Architect & Governance Expert',
    description:
      'Former Fortune 50 AI Strategy CTL | Founder of KestrelVoice | Co-founder of HAIEC | 16+ Years Production AI Systems | EU AI Act, NIST AI RMF, ISO 42001 Expert',
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
  classification: 'AI Consulting, AI Governance, Regulatory Compliance',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isResumePage = pathname.startsWith('/resume')

  if (isResumePage) {
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
        <meta name="person-type" content="AI Systems Architect & Governance Expert" />
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
        <SiteNavigation />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <StickyCTA />
        <AnalyticsBeacon />
      </body>
    </html>
  )
}
