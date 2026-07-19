import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Print Later – Free Windows App to Save & Print Web Pages Later',
  description: 'Print Later is a free Windows app that lets you save web pages now and print them later. Queue pages with Ctrl+P, select exact pages, batch print. 100% local, no cloud, no tracking. Download free.',
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
    'Subodh KC'
  ],
  openGraph: {
    title: 'Print Later - Save Web Pages, Print When Ready',
    description: 'Free Windows app to save web pages and print them later. No cloud, 100% local, open source.',
    type: 'website',
    url: 'https://subodhkc.com/products/print-later',
    images: [
      {
        url: 'https://subodhkc.com/products/print-later/screenshot.png',
        width: 1467,
        height: 900,
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
