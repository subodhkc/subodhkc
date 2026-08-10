import { Metadata } from 'next'
import ContractsClient from './contracts-client'

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'CSM 2.0 Governance Contracts',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2025-08-29',
  dateModified: '2026-08-10',
  publisher: { '@type': 'Organization', name: 'Subodh KC', url: 'https://subodhkc.com' },
  mainEntityOfPage: 'https://subodhkc.com/cognitive-systems-management/contracts',
  description:
    'Browsable reference for all 16 CSM 2.0 governance contracts. Filter by domain, execution function or component.',
  about: {
    '@type': 'DefinedTerm',
    name: 'CSM 2.0 Governance Contracts',
    description: 'Versioned governance contracts specifying objective rules, human judgment points, evidence requirements, handoffs and reassessment triggers.',
  },
  version: '2.0.0',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Research', item: 'https://subodhkc.com/research' },
    { '@type': 'ListItem', position: 3, name: 'Cognitive Systems Management', item: 'https://subodhkc.com/cognitive-systems-management' },
    { '@type': 'ListItem', position: 4, name: 'Governance Contracts', item: 'https://subodhkc.com/cognitive-systems-management/contracts' },
  ],
}

export const metadata: Metadata = {
  title: 'CSM 2.0 Governance Contracts | Subodh KC',
  description:
    'Browsable reference for all 16 CSM 2.0 governance contracts. Filter by domain, execution function or component.',
  alternates: {
    canonical: 'https://subodhkc.com/cognitive-systems-management/contracts',
  },
  openGraph: {
    title: 'CSM 2.0 Governance Contracts | Subodh KC',
    description:
      'Browsable reference for all 16 CSM 2.0 governance contracts. Filter by domain, execution function or component.',
    url: 'https://subodhkc.com/cognitive-systems-management/contracts',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2025-08-29',
    modifiedTime: '2026-08-10',
    tags: ['CSM 2.0', 'governance contracts', 'AI governance', 'deterministic governance'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSM 2.0 Governance Contracts | Subodh KC',
    description:
      'Browsable reference for all 16 CSM 2.0 governance contracts. Filter by domain, execution function or component.',
  },
  keywords: [
    'CSM 2.0',
    'governance contracts',
    'AI governance',
    'deterministic governance',
    'evidence requirements',
    'handoff contracts',
    'reassessment triggers',
    'governance components',
  ],
}

export default function ContractsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContractsClient />
    </>
  )
}
