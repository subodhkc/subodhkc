import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — AI Governance, Security & Architecture Insights',
  description:
    'Articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems. Practical insights from building AI at Fortune 50 scale.',
  alternates: {
    canonical: 'https://subodhkc.com/blog',
  },
  openGraph: {
    title: 'Blog — AI Governance, Security & Architecture Insights',
    description:
      'Articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    url: 'https://subodhkc.com/blog',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
