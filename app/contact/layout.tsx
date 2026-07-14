import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Subodh KC | AI Architecture & Advisory',
  description:
    'Get in touch about AI architecture, deployment, governance, or advisory engagements. Text, email, or schedule a consultation.',
  alternates: {
    canonical: 'https://subodhkc.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
