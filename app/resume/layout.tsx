import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume — Subodh KC | AI Systems Architect & Governance Expert',
  description: 'Executive resume for Subodh KC — AI Systems Architect, former Fortune 50 AI Strategy CTL, founder of KestrelVoice, co-founder of HAIEC.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://subodhkc.com/resume',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
