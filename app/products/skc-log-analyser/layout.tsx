import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SKC Log Analyser – AI-Powered Log Analysis (Streamlit, Self-Hosted)',
  description: 'Self-hosted Streamlit app for AI-powered log analysis. Upload log files and get instant anomaly detection, root cause analysis, and visual analytics. Runs locally — no cloud, no data leaves your machine.',
  keywords: [
    'log analysis tool',
    'AI log analysis',
    'log anomaly detection',
    'root cause analysis logs',
    'Streamlit log analyzer',
    'self-hosted log analysis',
    'local log analysis tool',
    'DevOps tools',
    'incident response',
    'observability',
    'log management',
    'log pattern detection',
    'offline log analysis',
    'private log analysis',
    'Python log analyzer',
    'ELK alternative',
    'Splunk alternative free',
    'Subodh KC',
  ],
  openGraph: {
    title: 'SKC Log Analyser – AI Log Analysis (Streamlit, Self-Hosted)',
    description: 'Upload log files and get instant AI-powered insights. Runs locally as a Streamlit app — no cloud, no data leaves your machine.',
    type: 'website',
    url: 'https://subodhkc.com/products/skc-log-analyser',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKC Log Analyser – AI Log Analysis (Streamlit)',
    description: 'Self-hosted AI log analysis. Upload logs, get instant insights. No cloud, no data leaves your machine.',
  },
  alternates: {
    canonical: 'https://subodhkc.com/products/skc-log-analyser',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
}

export default function SKCLogAnalyserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
