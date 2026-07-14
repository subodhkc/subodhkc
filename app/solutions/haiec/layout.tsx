import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HAIEC — AI Compliance & Governance Platform | Subodh KC',
  description:
    'HAIEC: enterprise-grade AI governance, compliance, and ethical deployment platform. Precision drift detection, Red Audit Kit, Cognitive Systems Management, and EU AI Act compliance.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/haiec',
  },
}

export default function HAIECSolutionLayout({ children }: { children: React.ReactNode }) {
  return children
}
