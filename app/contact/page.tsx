import { Metadata } from 'next'
import ContactPageClient from './client'

export const metadata: Metadata = {
  title: 'Contact Subodh KC | AI Advisor and Systems Architect',
  description: 'Get in touch with Subodh KC for advisory, consulting, speaking engagements, or collaboration opportunities. Multiple contact methods available.',
  keywords: [
    'contact Subodh KC',
    'AI advisor contact',
    'AI systems architect contact',
    'AI consulting inquiry',
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
    description: 'Get in touch with Subodh KC for advisory, consulting, speaking engagements, or collaboration opportunities.',
    url: 'https://subodhkc.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Subodh KC | AI Advisor and Systems Architect',
    description: 'Get in touch with Subodh KC for advisory, consulting, speaking engagements, or collaboration opportunities.',
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
