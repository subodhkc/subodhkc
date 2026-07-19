import type { Metadata } from 'next'

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': ['CreativeWork', 'DigitalDocument'],
  name: 'AI That Works — Executive Portfolio of Subodh KC',
  description: '26-page executive portfolio covering AI strategy, program leadership, platforms (Kestrel Voice, HAIEC, llmverify), governance, research, and advisory method.',
  url: 'https://subodhkc.com/portfolio',
  author: {
    '@type': 'Person',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
  },
  publisher: {
    '@type': 'Person',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
  },
  inLanguage: 'en-US',
  datePublished: '2026-07-18',
  about: [
    'AI Strategy',
    'AI Program Leadership',
    'AI Governance',
    'AI Platforms',
    'AI Risk Management',
  ],
  isPartOf: {
    '@type': 'WebSite',
    name: 'Subodh KC — AI Systems Architect & Governance Expert',
    url: 'https://subodhkc.com',
  },
}

export const metadata: Metadata = {
  title: 'AI That Works — Executive Portfolio of Subodh KC',
  description: 'Executive portfolio for Subodh KC — AI Strategy & Transformation Leader. Strategy, programs, platforms, and governance. 26-page downloadable executive portfolio.',
  keywords: [
    'executive portfolio',
    'AI strategy portfolio',
    'AI program leadership',
    'AI governance portfolio',
    'AI systems architect portfolio',
    'Subodh KC portfolio',
    'AI transformation leader',
    'enterprise AI portfolio',
    'AI platforms showcase',
    'AI governance frameworks',
  ],
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://subodhkc.com/portfolio',
  },
  openGraph: {
    title: 'AI That Works — Executive Portfolio of Subodh KC',
    description: '26-page executive portfolio: AI strategy, program leadership, platforms (Kestrel, HAIEC, llmverify), governance, and research. Downloadable and viewable.',
    url: 'https://subodhkc.com/portfolio',
    siteName: 'Subodh KC — AI Systems Architect & Governance Expert',
    images: [
      {
        url: '/portrait.jpeg',
        width: 1024,
        height: 1024,
        alt: 'AI That Works — Executive Portfolio of Subodh KC',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI That Works — Executive Portfolio of Subodh KC',
    description: '26-page executive portfolio: AI strategy, programs, platforms, governance, and research.',
    creator: '@subodhkc',
    images: ['/portrait.jpeg'],
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      {children}
    </>
  )
}
