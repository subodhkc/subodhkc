import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Subodh Kumar Kc - AI Architect | AI Governance Expert | Former Fortune 50 AI Strategy CTL',
    template: '%s | Subodh Kumar Kc - AI Architect',
  },
  description:
    'Subodh Kumar Kc - AI Architect and Governance Expert. Former Fortune 50 AI Strategy CTL with 16+ years full-stack development experience. Specializing in AI governance frameworks, EU AI Act compliance, NIST AI RMF, ISO 42001. Building production AI systems that scale with confidence.',
  keywords: [
    'AI Architect',
    'AI Developer',
    'AI Governance Architect',
    'AI Compliance Architect',
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
    types: {
      'application/rss+xml': 'https://subodhkc.com/rss.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subodhkc.com',
    siteName: 'Subodh Kumar Kc - AI Architect & Governance Expert',
    title: 'Subodh Kumar Kc - AI Architect | Former Fortune 50 AI Strategy CTL',
    description:
      'AI Architect and Governance Expert with 16+ years experience. Former Fortune 50 AI Strategy CTL. Specializing in EU AI Act, NIST AI RMF, ISO 42001 compliance. Building production AI systems at scale.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Subodh Kumar Kc - AI Architect & Governance Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh Kumar Kc - AI Architect & Governance Expert',
    description:
      'Former Fortune 50 AI Strategy CTL | AI Governance Architect | 16+ Years Full-Stack AI Development | EU AI Act, NIST AI RMF, ISO 42001 Expert',
    creator: '@subodhkc',
    images: ['/og-image.png'],
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
  // Check if this is a resume page (standalone, no nav/footer)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isResumePage = pathname.startsWith('/resume')

  // For resume pages, render without nav/footer
  if (isResumePage) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-white`}>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <StructuredData />
        <link rel="canonical" href="https://subodhkc.com" />
        <meta name="author" content="Subodh KC" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="language" content="English" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#10b981" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} page-edge-gradient`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <StructuredData />
      </body>
    </html>
  )
}
