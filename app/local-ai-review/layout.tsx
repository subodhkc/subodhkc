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
  areaServed: 'Dallas-Fort Worth, TX',
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
