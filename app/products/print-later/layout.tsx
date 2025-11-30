import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Print Later - Free Windows App to Save & Print Web Pages',
  description: 'Save web pages now, print them later. Free, open-source Windows desktop app with browser extension. 100% local storage, no cloud, no tracking. Download now!',
  keywords: [
    'Print Later',
    'save web pages',
    'print queue',
    'Windows print app',
    'browser extension',
    'PDF printer',
    'offline printing',
    'document management',
    'Subodh KC',
    'open source'
  ],
  openGraph: {
    title: 'Print Later - Save Web Pages, Print When Ready',
    description: 'Free Windows app to save web pages and print them later. No cloud, 100% local, open source.',
    type: 'website',
    url: 'https://subodhkc.com/products/print-later',
    images: [
      {
        url: 'https://subodhkc.com/products/print-later/screenshot.png',
        width: 1200,
        height: 675,
        alt: 'Print Later App Screenshot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Print Later - Save Web Pages, Print When Ready',
    description: 'Free Windows app to save web pages and print them later. No cloud, 100% local, open source.',
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
