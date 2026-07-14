import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FrontOfAI — Daily AI Intelligence Briefings | Subodh KC',
  description:
    'FrontOfAI: daily AI intelligence for CTOs and technical leaders. Strategic briefings on what shipped, what shifted, and what matters in the AI landscape.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/frontofai',
  },
}

export default function FrontOfAILayout({ children }: { children: React.ReactNode }) {
  return children
}
