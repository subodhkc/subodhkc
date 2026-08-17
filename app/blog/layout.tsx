import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing | AI Systems, Decisions & Field Notes | Subodh KC',
  description:
    'Articles and field notes on AI systems, governance, decisions, architecture, compliance automation, and production AI. Practical writing from enterprise implementation experience.',
  alternates: {
    canonical: 'https://subodhkc.com/blog',
    types: {
      'application/rss+xml': 'https://subodhkc.com/feed.xml',
    },
  },
  openGraph: {
    title: 'Writing | AI Systems, Decisions & Field Notes | Subodh KC',
    description:
      'Articles and field notes on AI systems, governance, decisions, architecture, and production AI. Practical writing from enterprise implementation experience.',
    url: 'https://subodhkc.com/blog',
    type: 'website',
    images: [{ url: 'https://subodhkc.com/portrait.jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing | AI Systems, Decisions & Field Notes | Subodh KC',
    description:
      'Articles and field notes on AI systems, governance, decisions, architecture, and production AI.',
    images: ['https://subodhkc.com/portrait.jpeg'],
  },
  other: {
    'webmention': 'https://subodhkc.com/api/webmention',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
