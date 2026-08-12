import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Subodh KC | AI Systems Architect & Governance Expert',
  description: 'Executive resume for Subodh KC - AI Systems Architect, former Fortune 50 AI Strategy CTL, founder of KestrelVoice, founder of HAIEC. 16+ years building production AI systems.',
  keywords: [
    'AI program manager resume',
    'AI governance expert CV',
    'technical program manager resume',
    'AI systems architect resume',
    'Subodh KC resume',
    'Fortune 50 AI strategy',
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
    title: 'Resume - Subodh KC | AI Systems Architect & Governance Expert',
    description: 'Executive resume for Subodh KC - AI Systems Architect, former Fortune 50 AI Strategy CTL, founder of KestrelVoice, founder of HAIEC.',
    url: 'https://subodhkc.com/resume',
    type: 'profile',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
