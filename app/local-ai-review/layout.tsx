import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Local AI Review | Subodh KC — Practical AI for Local Businesses',
  description:
    'Complimentary 20-minute AI review for Dallas-Fort Worth local and founder-led businesses. Find one practical use case, one measure of success, and the most useful next step.',
  alternates: {
    canonical: 'https://subodhkc.com/local-ai-review',
  },
  openGraph: {
    title: 'Local AI Review | Subodh KC — Practical AI for Local Businesses',
    description:
      'Complimentary 20-minute AI review for Dallas-Fort Worth local and founder-led businesses. Find one practical use case, one measure of success, and the most useful next step.',
    url: 'https://subodhkc.com/local-ai-review',
    type: 'website',
    images: [
      {
        url: '/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC — Local AI Advisor | Complimentary AI Review for DFW Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local AI Review | Subodh KC',
    description:
      'Complimentary 20-minute AI review for DFW local businesses. Find one practical use case, one measure of success, and the most useful next step.',
  },
  keywords: [
    'DFW AI consultant',
    'local business AI',
    'Dallas AI advisor',
    'HEB Chamber',
    'small business AI review',
    'Texas AI compliance',
    'AI voice receptionist',
    'workflow automation Dallas',
    'Fort Worth AI consultant',
    'Arlington Texas AI',
    'Bedford Texas AI',
    'Euless Texas AI',
    'Hurst Texas AI',
    'small business AI Dallas',
    'AI for local businesses',
    'complimentary AI review Dallas',
    'AI call answering service DFW',
    'AI readiness assessment Texas',
  ],
  robots: {
    index: true,
    follow: true,
  },
}

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Subodh KC — Local AI Advisor',
  description:
    'Practical AI strategy, deployment, and readiness support for local and founder-led businesses in Dallas-Fort Worth.',
  url: 'https://subodhkc.com/local-ai-review',
  telephone: '+1-682-224-9904',
  areaServed: {
    '@type': 'City',
    name: 'Dallas-Fort Worth',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dallas',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '32.7767',
    longitude: '-96.7970',
  },
  priceRange: 'Complimentary initial review',
  knowsAbout: [
    'AI Strategy',
    'Voice AI',
    'AI Compliance',
    'Workflow Automation',
    'Texas AI Regulations',
  ],
  founder: {
    '@type': 'Person',
    name: 'Subodh KC',
    jobTitle: 'Local AI Advisor',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Local Business AI Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Kestrel Voice — AI Call Coverage',
          description: 'After-hours and peak-hour AI call coverage for service businesses.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Advisory & Custom Development',
          description: 'Workflow automation, intake, document search, and custom AI tools.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'HAIEC Readiness & Texas AI Check',
          description: 'AI-use inventory, Texas AI applicability review, and compliance readiness.',
        },
      },
    ],
  },
}

export default function LocalAIReviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
      {children}
    </>
  )
}
