import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Subodh KC | Enterprise AI Advisor & AI Systems Architect',
  description: 'Executive resume for Subodh KC, Enterprise AI Advisor and AI Systems Architect, former Sr. Program Manager at HP Inc., and founder of KestrelVoice and HAIEC.',
  keywords: [
    'AI program manager resume',
    'AI advisor CV',
    'technical program manager resume',
    'AI systems architect resume',
    'Subodh KC resume',
    'Fortune 100 AI strategy',
    'AI compliance resume',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://subodhkc.com/resume',
  },
  openGraph: {
    title: 'Resume - Subodh KC | Enterprise AI Advisor & AI Systems Architect',
    description: 'Executive resume for Subodh KC - AI Systems Architect, former Sr. Program Manager at HP Inc., founder of KestrelVoice, founder of HAIEC.',
    url: 'https://subodhkc.com/resume',
    type: 'profile',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
