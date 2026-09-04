import { Metadata } from 'next'
import ContactPageClient from './client'

export const metadata: Metadata = {
  title: 'Contact Subodh KC | AI Advisor and Systems Architect',
  description: 'Submit a consequential AI decision for strategic diagnostics, executive advisory, systems architecture, assurance, or collaboration.',
  keywords: [
    'contact Subodh KC',
    'AI advisor contact',
    'AI systems architect contact',
    'enterprise AI decision inquiry',
    'speaking engagement',
    'advisory services',
    'AI governance consulting',
    'Subodh KC'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/contact',
  },
  openGraph: {
    title: 'Contact Subodh KC | AI Advisor and Systems Architect',
    description: 'Start with the decision, consequence, unresolved boundary, and timing. Then define the right engagement.',
    url: 'https://subodhkc.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Subodh KC | AI Advisor and Systems Architect',
    description: 'Decision-led intake for diagnostics, executive AI advisory, systems architecture, and evidence-bound assurance.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1
  }
}

export default function ContactPage() {
  return <ContactPageClient />
}
