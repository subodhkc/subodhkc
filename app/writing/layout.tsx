import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Systems, Governance & Compliance Insights | Subodh KC',
  description:
    'Writing on AI architecture, governance, compliance automation, and enterprise AI strategy. Practical insights from building production AI systems at Fortune 50 scale.',
  alternates: {
    canonical: 'https://subodhkc.com/writing',
  },
}

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children
}
