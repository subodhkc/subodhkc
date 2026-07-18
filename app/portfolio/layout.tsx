import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI That Works — Executive Portfolio of Subodh KC',
  description: 'Executive portfolio for Subodh KC — AI Strategy & Transformation Leader. Strategy, programs, platforms, and governance. 26-page downloadable executive portfolio.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://subodhkc.com/portfolio',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}
