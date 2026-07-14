import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Solutions & Platforms | Subodh KC',
  description:
    'Production-ready AI solutions: HAIEC compliance platform, KestrelVoice AI receptionist, FrontOfAI intelligence briefings, CourtCase legal automation, and AI Briefing.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions',
  },
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
