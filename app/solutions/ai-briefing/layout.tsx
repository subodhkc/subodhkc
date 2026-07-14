import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Briefing — Executive AI Strategy Sessions | Subodh KC',
  description:
    'AI Briefing: executive-level AI strategy sessions. Custom briefings on AI architecture, governance, and deployment for C-suite and technical leaders.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/ai-briefing',
  },
}

export default function AIBriefingLayout({ children }: { children: React.ReactNode }) {
  return children
}
