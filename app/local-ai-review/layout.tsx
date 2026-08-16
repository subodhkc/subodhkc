import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dallas / DFW AI Advisor | Local AI Review | Subodh KC',
  description:
    'Dallas-Fort Worth AI advisor for local and founder-led businesses. Complimentary 20-minute AI review to find one practical use case, one measure of success, and the most useful next step.',
  alternates: {
    canonical: 'https://subodhkc.com/local-ai-review',
  },
  openGraph: {
    title: 'Dallas / DFW AI Advisor | Local AI Review | Subodh KC',
    description:
      'Complimentary 20-minute AI review for Dallas-Fort Worth local and founder-led businesses. Find one practical use case, one measure of success, and the most useful next step.',
    url: 'https://subodhkc.com/local-ai-review',
    type: 'website',
    images: [
      {
        url: '/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC - Dallas / DFW AI Advisor | Complimentary AI Review for DFW Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dallas / DFW AI Advisor | Subodh KC',
    description:
      'Complimentary 20-minute AI review for DFW local businesses. Find one practical use case, one measure of success, and the most useful next step.',
  },
  keywords: [
    'Dallas AI advisor',
    'DFW AI advisor',
    'Dallas AI consultant',
    'DFW AI consultant',
    'Texas AI advisor',
    'local business AI Dallas',
    'HEB Chamber AI',
    'small business AI review',
    'Texas AI compliance',
    'AI voice receptionist Dallas',
    'workflow automation Dallas',
    'Fort Worth AI advisor',
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
  name: 'Subodh KC - Dallas / DFW AI Advisor',
  description:
    'Practical AI strategy, deployment, and readiness support for local and founder-led businesses in Dallas-Fort Worth.',
  url: 'https://subodhkc.com/local-ai-review',
  telephone: '+1-682-224-9904',
  areaServed: [
    {
      '@type': 'City',
      name: 'Dallas',
    },
    {
      '@type': 'City',
      name: 'Fort Worth',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Dallas-Fort Worth Metroplex',
    },
    {
      '@type': 'State',
      name: 'Texas',
    },
  ],
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
    jobTitle: 'AI Advisor & AI Systems Architect',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Local Business AI Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Kestrel Voice - AI Call Coverage',
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
