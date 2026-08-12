import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unsubscribe - Subodh KC',
  description: 'Unsubscribe from the Subodh KC newsletter.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://subodhkc.com/unsubscribe',
  },
}

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}
