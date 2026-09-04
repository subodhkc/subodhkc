import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Subodh KC | Enterprise AI Advisor & AI Systems Architect',
  description:
    'Contact Subodh KC about a consequential AI decision, strategic diagnostic, executive advisory engagement, systems architecture, or assurance POC.',
  keywords: [
    'contact Subodh KC',
    'AI advisor',
    'AI systems advisor',
    'AI governance consulting',
    'AI compliance consulting',
    'AI architecture consulting',
    ' fractional AI executive',
    'DFW AI advisor',
    'HEB Chamber AI advisor',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/contact',
  },
  openGraph: {
    title: 'Contact Subodh KC | Enterprise AI Advisor & AI Systems Architect',
    description:
      'Start with the decision, consequence, unresolved boundary, and timing. Then define the right engagement.',
    url: 'https://subodhkc.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Subodh KC | AI Advisor',
    description: 'Decision-led intake for diagnostics, executive AI advisory, systems architecture, and evidence-bound assurance.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
