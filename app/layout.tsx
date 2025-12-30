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
    default: 'Subodh KC - AI Compliance Architect | Turn AI Pilots Into Production Systems',
    template: '%s | Subodh KC - AI Compliance Expert',
  },
  description:
    'Subodh KC - AI Compliance Architect helping Fortune 50 companies turn AI pilots into production systems without regulatory risk. Expert in AI governance, NYC Local Law 144, EU AI Act, NIST AI RMF, ISO 42001. 12+ years enterprise AI experience. Available for consulting.',
  keywords: [
    'AI Compliance Consultant',
    'AI Governance Expert',
    'Enterprise AI Consultant',
    'AI Regulatory Compliance',
    'NYC Local Law 144',
    'EU AI Act Compliance',
    'NIST AI RMF',
    'ISO 42001',
    'AI Risk Management',
    'Bias Detection',
    'AI Audit Framework',
    'Technical Program Manager',
    'Fortune 50 AI',
    'AI Production Systems',
    'Responsible AI',
    'AI Ethics Consultant',
    'Model Governance',
    'Cognitive Systems Management',
    'HAIEC',
    'Subodh KC',
    'KC AI Consultant',
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
    siteName: 'Subodh KC - AI Compliance Architect',
    title: 'Subodh KC - Turn AI Pilots Into Production Systems Without Regulatory Risk',
    description:
      'Subodh KC - AI Compliance Architect with 12+ years Fortune 50 experience. Expert in EU AI Act, NYC Local Law 144, NIST AI RMF. Available for consulting on enterprise AI governance and regulatory compliance.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KC - AI Compliance Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh KC - Turn AI Pilots Into Production Systems',
    description:
      'Subodh KC - AI Compliance Architect | Fortune 50 Experience | EU AI Act, NYC LL144, NIST AI RMF Expert | Available for Consulting',
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
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
