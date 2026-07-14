import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CourtCase — AI Legal Document Organization | Subodh KC',
  description:
    'CourtCase: AI-assisted legal document organization. Manage case files, track deadlines, and prepare document packets — all locally on your computer.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/courtcase',
  },
}

export default function CourtCaseLayout({ children }: { children: React.ReactNode }) {
  return children
}
