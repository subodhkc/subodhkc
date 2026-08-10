import { Metadata } from 'next'
import AssessmentClient from './assessment-client'

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'CSM 2.0 Reference Assessment',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2025-08-29',
  dateModified: '2026-08-10',
  publisher: { '@type': 'Organization', name: 'Subodh KC', url: 'https://subodhkc.com' },
  mainEntityOfPage: 'https://subodhkc.com/cognitive-systems-management/assessment',
  description:
    'Interactive reference evaluator for CSM 2.0. Provide structured system facts and receive applicable requirements, evidence gaps and human review items.',
  about: {
    '@type': 'DefinedTerm',
    name: 'CSM 2.0 Reference Assessment',
    description: 'A deterministic reference evaluator that produces applicable requirements, evidence gaps and human review items from structured system facts.',
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
    { '@type': 'ListItem', position: 4, name: 'Reference Assessment', item: 'https://subodhkc.com/cognitive-systems-management/assessment' },
  ],
}

export const metadata: Metadata = {
  title: 'CSM 2.0 Reference Assessment | Subodh KC',
  description:
    'Interactive reference evaluator for CSM 2.0. Provide structured system facts and receive applicable requirements, evidence gaps and human review items.',
  alternates: {
    canonical: 'https://subodhkc.com/cognitive-systems-management/assessment',
  },
  openGraph: {
    title: 'CSM 2.0 Reference Assessment | Subodh KC',
    description:
      'Interactive reference evaluator for CSM 2.0. Provide structured system facts and receive applicable requirements, evidence gaps and human review items.',
    url: 'https://subodhkc.com/cognitive-systems-management/assessment',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2025-08-29',
    modifiedTime: '2026-08-10',
    tags: ['CSM 2.0', 'reference assessment', 'AI governance', 'deterministic governance', 'evidence gaps'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSM 2.0 Reference Assessment | Subodh KC',
    description:
      'Interactive reference evaluator for CSM 2.0. Provide structured system facts and receive applicable requirements, evidence gaps and human review items.',
  },
  keywords: [
    'CSM 2.0',
    'reference assessment',
    'AI governance assessment',
    'deterministic governance',
    'evidence gaps',
    'human review items',
    'governance requirements',
    'compliance evaluation',
  ],
}

export default function AssessmentPage() {
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
      <AssessmentClient />
    </>
  )
}
