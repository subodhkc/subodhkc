import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SKC LOG Analyser - AI-Powered Log Analysis & Anomaly Detection',
  description: 'Transform terabytes of logs into actionable insights. AI-powered pattern detection, real-time alerting, and root cause analysis. On-premise deployment available.',
  keywords: [
    'log analysis',
    'log monitoring',
    'anomaly detection',
    'root cause analysis',
    'DevOps tools',
    'incident response',
    'observability',
    'log management',
    'AI log analysis',
    'Subodh KC'
  ],
  openGraph: {
    title: 'SKC LOG Analyser - AI Log Analysis & Anomaly Detection',
    description: 'Transform terabytes of logs into insights. AI-powered analysis, on-premise deployment.',
    type: 'website',
    url: 'https://subodhkc.com/products/skc-log-analyser',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKC LOG Analyser - AI Log Analysis',
    description: 'AI-powered log analysis and anomaly detection. On-premise available.',
  },
  alternates: {
    canonical: 'https://subodhkc.com/products/skc-log-analyser',
  },
}

export default function SKCLogAnalyserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
