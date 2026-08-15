import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Subodh KC | AI Advisor & AI Systems Architect',
  description:
    'Contact Subodh KC for AI advisory, architecture, deployment, governance, or local business AI reviews. Text, email, or schedule a consultation. Response within 24-48 hours.',
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
    title: 'Contact Subodh KC | AI Advisor & AI Systems Architect',
    description:
      'Get in touch about AI advisory, architecture, deployment, governance, or local business AI reviews. Text, email, or schedule a consultation.',
    url: 'https://subodhkc.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Subodh KC | AI Advisor',
    description: 'AI advisory, architecture, deployment, governance consulting. Response within 24-48 hours.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
