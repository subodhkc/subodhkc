import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume — Subodh KC | Director of AI Programs',
  description: 'Executive resume for Subodh KC — AI Systems Architect, former Fortune 50 AI Strategy CTL.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://subodhkc.com/resume/coinbase',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
