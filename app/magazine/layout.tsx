import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI That Works — Issue 01 | Magazine by Subodh KC',
  description: 'AI That Works, Issue 01: From Demo to Operating System. A 36-page independent field magazine on AI strategy, systems, governance, and field practice. By Subodh KC.',
  keywords: ['AI magazine', 'AI strategy', 'AI governance', 'AI systems', 'AI operating system', 'Subodh KC', 'enterprise AI', 'AI compliance', 'AI field practice'],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://subodhkc.com/magazine',
  },
  openGraph: {
    title: 'AI That Works — Issue 01 | Magazine by Subodh KC',
    description: 'A 36-page independent field magazine on AI strategy, systems, governance, and field practice. From demo to operating system.',
    type: 'article',
    url: 'https://subodhkc.com/magazine',
    publishedTime: '2026-07-18',
    authors: ['Subodh KC'],
    images: [
      {
        url: 'https://subodhkc.com/magazine/img-1.png',
        width: 760,
        height: 594,
        alt: 'AI That Works — Issue 01 Magazine Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI That Works — Issue 01 | Magazine by Subodh KC',
    description: 'A 36-page independent field magazine on AI strategy, systems, governance, and field practice.',
    images: ['https://subodhkc.com/magazine/img-1.png'],
  },
}

const magazineSchema = {
  '@context': 'https://schema.org',
  '@type': ['PublicationIssue', 'CreativeWork'],
  name: 'AI That Works — Issue 01',
  issueNumber: 1,
  datePublished: '2026-07-18T00:00:00Z',
  description: 'From demo to operating system. A 36-page independent field magazine on AI strategy, systems, governance, and field practice.',
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
  about: ['AI strategy', 'AI systems', 'AI governance', 'AI field practice'],
  numberOfPages: 36,
  url: 'https://subodhkc.com/magazine',
  isAccessibleForFree: true,
  inLanguage: 'en',
}

export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(magazineSchema) }}
      />
      {children}
    </>
  )
}
