import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CourtCase - Legal Document Organization Tool (Coming Soon)',
  description: 'Organize your legal documents with ease. CourtCase helps you manage case files, track deadlines, and prepare document packets — all locally on your computer. Join the waitlist!',
  keywords: [
    'CourtCase',
    'legal document management',
    'case file organization',
    'court documents',
    'deadline tracking',
    'document packets',
    'legal software',
    'Subodh KC',
    'privacy first'
  ],
  openGraph: {
    title: 'CourtCase - Legal Document Organization (Coming Soon)',
    description: 'Organize case files, track deadlines, prepare document packets. 100% local, privacy-first. Join the waitlist!',
    type: 'website',
    url: 'https://subodhkc.com/products/courtcase',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CourtCase - Legal Document Organization (Coming Soon)',
    description: 'Organize case files, track deadlines, prepare document packets. 100% local, privacy-first.',
  },
  alternates: {
    canonical: 'https://subodhkc.com/products/courtcase',
  },
}

export default function CourtCaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
