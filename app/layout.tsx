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
    default: 'KC (Subodh KC) - AI Compliance Architect | Technical Program Manager | HAIEC Founder',
    template: '%s | KC - AI Compliance Expert',
  },
  description:
    'KC (Subodh KC): Leading AI Compliance Architect at Fortune 50 company, HAIEC founder, and Enterprise Technical Program Manager. Turning AI pilots into production systems without regulatory risk. Expert in AI governance, regulatory compliance, and cognitive systems management. 12+ years driving enterprise-scale AI programs globally.',
  keywords: [
    'Subodh KC',
    'Subodh KC AI',
    'Subodh KC professional',
    'Subodh KC technical',
    'Subodh KC compliance',
    'AI Compliance Architect',
    'Technical Program Manager',
    'Enterprise AI Governance',
    'AI Regulatory Compliance',
    'HAIEC founder',
    'Human AI Ethics Council',
    'Cognitive Systems Management',
    'AI Strategy Consultant',
    'Fortune 50 AI Leader',
    'Enterprise AI Compliance',
    'AI Governance Framework',
    'AI Risk Management',
    'AI Ethics Expert',
    'Enterprise Technical Program Manager',
    'AI Implementation Strategy',
    'AI Compliance Consulting',
  ],
  authors: [{ name: 'Subodh KC' }],
  creator: 'Subodh KC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subodhkc.com',
    title: 'Subodh KC - AI Compliance Architect | Technical Program Manager | HAIEC Founder',
    description:
      'Leading AI Compliance Architect at Fortune 50. Expert in AI governance, regulatory compliance, and enterprise AI strategy. Founder of HAIEC (Human AI Ethics Council).',
    siteName: 'Subodh KC - Professional Portfolio',
    images: [
      {
        url: 'https://subodhkc.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC - AI Compliance Architect and Technical Program Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh KC - AI Compliance Architect | HAIEC Founder',
    description: 'Leading AI Compliance Architect at Fortune 50. Expert in AI governance, regulatory compliance, and enterprise AI strategy.',
    creator: '@subodhkc',
    images: ['https://subodhkc.com/og-image.jpg'],
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
  alternates: {
    canonical: 'https://subodhkc.com',
  },
  verification: {
    google: 'your-google-verification-code',
    // Add after setting up Google Search Console
  },
  category: 'technology',
  classification: 'Professional Services',
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
    <html lang="en" className="dark">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
