import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Redactor – Free AI-Powered PDF Redaction Tool | Download',
  description: 'PDF Redactor is a free desktop tool that uses AI to permanently redact SSNs, credit cards, names, and 50+ PII types from PDFs. 100% local processing — your documents never leave your computer. Download free.',
  keywords: [
    'PDF redactor',
    'PDF redaction',
    'redact PDF free',
    'document redaction',
    'PII removal tool',
    'sensitive data protection',
    'GDPR redaction tool',
    'HIPAA redaction',
    'document sanitization',
    'AI redaction',
    'local processing',
    'free PDF redaction software',
    'Subodh KC'
  ],
  openGraph: {
    title: 'PDF Redactor – Free AI-Powered PDF Redaction Tool',
    description: 'Permanently redact sensitive data from PDFs. AI-powered detection, 100% local processing. Free download.',
    type: 'website',
    url: 'https://subodhkc.com/products/pdf-redactor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Redactor – Free AI-Powered PDF Redaction',
    description: 'Permanently redact sensitive data from PDFs. 100% local, AI-powered, free download.',
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
