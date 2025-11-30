import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doc Timeline Generator - AI-Powered Document Timeline Extraction',
  description: 'Transform thousands of documents into clear, chronological timelines. AI-powered extraction for legal discovery, insurance claims, and compliance audits. Enterprise-grade security.',
  keywords: [
    'document timeline',
    'legal discovery',
    'document analysis',
    'AI document processing',
    'timeline extraction',
    'legal tech',
    'compliance audit',
    'insurance claims',
    'enterprise document management',
    'Subodh KC'
  ],
  openGraph: {
    title: 'Doc Timeline Generator - AI Document Timeline Extraction',
    description: 'Transform thousands of documents into clear timelines. AI-powered extraction for legal, insurance, and compliance.',
    type: 'website',
    url: 'https://subodhkc.com/products/doc-timeline',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doc Timeline Generator - AI Document Timeline Extraction',
    description: 'Transform thousands of documents into clear timelines. Enterprise-grade AI extraction.',
  },
  alternates: {
    canonical: 'https://subodhkc.com/products/doc-timeline',
  },
}

export default function DocTimelineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
