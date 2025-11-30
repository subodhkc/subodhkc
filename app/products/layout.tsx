import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products - Privacy-First Productivity Tools | Subodh KC',
  description: 'Explore our suite of privacy-first productivity tools. Print Later, PDF Redactor, Doc Timeline Generator, SKC Log Analyser, and CourtCase. All tools process data locally - no cloud uploads.',
  keywords: [
    'privacy tools',
    'productivity software',
    'local processing',
    'document tools',
    'PDF tools',
    'log analysis',
    'legal software',
    'Subodh KC'
  ],
  openGraph: {
    title: 'Products - Privacy-First Tools by Subodh KC',
    description: 'Productivity tools that respect your data. 100% local processing, no cloud uploads.',
    type: 'website',
    url: 'https://subodhkc.com/products',
  },
  alternates: {
    canonical: 'https://subodhkc.com/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
