import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Subodh KC | AI Advisor',
  description:
    'Get in touch about AI advisory, architecture, deployment, governance, or local business AI reviews. Text, email, or schedule a consultation.',
  alternates: {
    canonical: 'https://subodhkc.com/contact',
  },
  openGraph: {
    title: 'Contact Subodh KC | AI Advisor',
    description:
      'Get in touch about AI advisory, architecture, deployment, governance, or local business AI reviews. Text, email, or schedule a consultation.',
    url: 'https://subodhkc.com/contact',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
