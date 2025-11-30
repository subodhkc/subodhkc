import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Redactor - AI-Powered Document Redaction Tool',
  description: 'Permanently redact sensitive data from PDFs using AI. Automatically detect SSNs, credit cards, names, and 50+ PII types. 100% local processing - your documents never leave your computer.',
  keywords: [
    'PDF redaction',
    'document redaction',
    'PII removal',
    'sensitive data protection',
    'GDPR compliance',
    'HIPAA compliance',
    'data privacy',
    'AI redaction',
    'local processing',
    'Subodh KC'
  ],
  openGraph: {
    title: 'PDF Redactor - AI-Powered Document Redaction',
    description: 'Permanently redact sensitive data from PDFs. AI-powered detection, 100% local processing.',
    type: 'website',
    url: 'https://subodhkc.com/products/pdf-redactor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Redactor - AI Document Redaction',
    description: 'Permanently redact sensitive data from PDFs. 100% local, AI-powered.',
  },
  alternates: {
    canonical: 'https://subodhkc.com/products/pdf-redactor',
  },
}

export default function PDFRedactorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
