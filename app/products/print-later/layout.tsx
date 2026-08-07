import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Print Later - Free App to Save Web Pages & Print Them Later',
  description: 'Stop wasting paper. Save web pages with one click, pick only the pages you need, and batch print when ready. 100% free, private, and works offline.',
  keywords: [
    'Print Later',
    'save web pages for printing',
    'print queue app',
    'Windows print app',
    'batch printing software',
    'delayed printing Windows',
    'print web pages later',
    'browser extension',
    'offline printing',
    'Windows print manager',
    'document management',
    'open source',
    'Subodh KC',
    'save webpage as PDF Windows',
    'deferred printing Windows',
    'batch print web pages',
    'print queue Windows',
    'Pocket alternative',
    'save pages to print later',
    'print only selected pages',
    'combine web pages into one print job',
    'print packet builder',
    'free print queue software',
    'Ctrl P save for later',
    'free print manager Windows',
    'save webpage to print later',
    'print specific pages from website',
    'organize web pages for printing',
    'import PDF print queue',
    'better than screenshots for printing',
    'combine PDF and web pages print',
    'print to PDF from web pages',
    'open source print productivity tool',
    'auto import PDF print queue',
    'Ctrl P save PDF print later',
    'watch folder PDF auto import',
    'print web pages any browser',
  ],
  openGraph: {
    title: 'Print Later - Save Web Pages Now, Print Them When Ready',
    description: 'Free Windows app. Save pages with one click, pick only the pages you need, and batch print when ready. No cloud, no tracking, no account.',
    type: 'website',
    url: 'https://subodhkc.com/products/print-later',
    images: [
      {
        url: 'https://subodhkc.com/products/print-later/screenshot.png',
        width: 1467,
        height: 900,
        alt: 'Print Later App - Save web pages and print them later',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Print Later - Save Web Pages Now, Print Them When Ready',
    description: 'Free Windows app. Save pages with one click, pick only the pages you need, and batch print when ready. No cloud, no tracking, no account.',
    images: ['https://subodhkc.com/products/print-later/screenshot.png'],
  },
  alternates: {
    canonical: 'https://subodhkc.com/products/print-later',
  },
}

export default function PrintLaterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
