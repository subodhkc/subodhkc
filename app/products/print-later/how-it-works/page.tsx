import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Download,
  ArrowRight,
  Printer,
  FileText,
  Layers,
  MousePointerClick,
  CheckCircle2,
  Clock,
  FileStack,
  ScanLine,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Save Web Pages to Print Later on Windows | Print Later Guide',
  description:
    'Step-by-step guide: how to save web pages now and print them later on Windows 10/11. Queue pages with Ctrl+P, select exact pages, combine into print packets. Free and open source.',
  keywords: [
    'how to save web pages to print later',
    'save webpage for printing later Windows',
    'deferred printing Windows',
    'print queue Windows',
    'batch print web pages',
    'print only selected pages',
    'how to print part of a web page',
    'save pages with Ctrl P',
    'print later Windows guide',
    'Print Later tutorial',
    'combine web pages into one print job',
    'print packet Windows',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/products/print-later/how-it-works',
  },
  openGraph: {
    title: 'How to Save Web Pages to Print Later on Windows',
    description:
      'Step-by-step guide: queue pages with Ctrl+P, select exact pages, combine into print packets. Free and open source.',
    url: 'https://subodhkc.com/products/print-later/how-it-works',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Save Web Pages to Print Later on Windows',
    description:
      'Step-by-step guide: queue pages with Ctrl+P, select exact pages, combine into print packets. Free and open source.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
}

const steps = [
  {
    icon: MousePointerClick,
    title: 'Step 1: Save a web page with Ctrl+P',
    description:
      'Open any web page in Chrome, Edge, or Firefox. Press Ctrl+P to open the print dialog. Select "Print Later" as your printer. The page is captured and saved to your local queue — no print dialog, no paper wasted.',
    detail:
      'Print Later installs as a system printer, so any browser or app that supports printing can save to your queue. You don\'t need to install a browser extension to use the basic save feature — just select Print Later in the print dialog.',
  },
  {
    icon: Clock,
    title: 'Step 2: Organize your print queue',
    description:
      'Open the Print Later app. Your saved pages appear in a queue. Sort by date, search by title, reorder pages, or delete pages you no longer need. Everything is stored locally on your computer — no cloud, no account.',
    detail:
      'The queue shows a thumbnail preview of each saved page. You can drag and drop to reorder, click to preview full size, or select multiple pages to delete or move together.',
  },
  {
    icon: ScanLine,
    title: 'Step 3: Select the exact pages you need',
    description:
      'Open any saved document and pick the specific pages you want to print. If a 50-page PDF only has 3 pages you need, select just those. Stop printing cover pages, tables of contents, and sections you don\'t care about.',
    detail:
      'Page selection works on both web pages (saved as PDF) and PDF files you import. You can select individual pages, a range (e.g. 3-7), or non-contiguous pages (e.g. 1, 5, 12-15).',
  },
  {
    icon: FileStack,
    title: 'Step 4: Combine pages into a print packet',
    description:
      'Select pages from multiple different documents and combine them into one print job. Perfect for meetings — pull the relevant pages from 5 different reports into a single organized packet.',
    detail:
      'The packet builder lets you mix pages from web pages, PDFs, and any other printable document. Reorder the combined pages, then send the entire packet to your printer in one job.',
  },
  {
    icon: Printer,
    title: 'Step 5: Print when you\'re ready',
    description:
      'Hit print and get a clean, organized packet. No wasted paper. No printing one page at a time. Everything you saved throughout the day, printed in one batch when it suits you.',
    detail:
      'Print Later sends the packet to your default Windows printer. You can also choose a different printer, adjust print settings (color, duplex, paper size), and preview the final output before printing.',
  },
]

const useCases = [
  {
    title: 'Print research articles at the office',
    description: 'Save articles throughout the day at home, then batch print them all when you get to the office printer.',
  },
  {
    title: 'Build a meeting packet from multiple sources',
    description: 'Pull the relevant page from each report, combine into one packet, and print a clean handout for your meeting.',
  },
  {
    title: 'Save receipts and confirmations for expense reports',
    description: 'Queue up travel confirmations, hotel receipts, and expense documentation. Print them all at once for your expense filing.',
  },
  {
    title: 'Print only the pages you need from long PDFs',
    description: 'Stop printing 50-page reports when you only need 3 pages. Select exactly what you want and skip the rest.',
  },
  {
    title: 'Batch print for legal case preparation',
    description: 'Save case documents, evidence pages, and reference materials throughout the day. Assemble organized print packets for court filings.',
  },
  {
    title: 'Save now, print at the library or print shop',
    description: 'Don\'t have a printer at home? Save pages to your queue, then print them all at once when you get to a printer.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products/print-later" className="hover:text-foreground">
            Print Later
          </Link>
          <ArrowRight className="h-3 w-3" />
          <span className="text-foreground">How It Works</span>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="h-4 w-4" />
            <span>Step-by-Step Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How to Save Web Pages to Print Later on Windows
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-4">
            Stop printing one page at a time. Queue web pages with Ctrl+P, pick the exact pages you
            need, combine them into print packets, and batch print when you&apos;re ready.
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Works with Chrome, Edge, and Firefox on Windows 10/11. Free and open source. No cloud,
            no account, no tracking.
          </p>
        </div>

        {/* Quick answer for search snippets */}
        <section className="mb-16">
          <Card className="bg-secondary/30">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-3">Quick Answer</h2>
              <p className="text-muted-foreground leading-relaxed">
                To save web pages and print them later on Windows: install{' '}
                <Link href="/products/print-later" className="text-primary underline">
                  Print Later
                </Link>
                , press <strong>Ctrl+P</strong> on any web page, select &quot;Print Later&quot; as
                your printer, and the page is saved to your local queue. When you&apos;re ready to
                print, open the Print Later app, select the exact pages you want from each saved
                document, combine them into a packet, and print in one batch.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Step-by-step */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Step-by-Step Guide</h2>
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <p className="text-sm text-muted-foreground/70 italic">{step.detail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Use cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What You Can Do With This</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {useCases.map((uc, index) => (
              <Card key={index} className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground">{uc.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Tips for Getting the Most Out of Print Later</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Install the browser extension.</strong>{' '}
                  Print Later comes with a Chrome/Edge extension that adds a one-click &quot;Save to
                  Print Later&quot; button — no need to open the print dialog every time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Import existing PDFs.</strong> You can drag
                  and drop PDF files into Print Later to add them to your queue. Mix saved web pages
                  and PDF documents in the same print packet.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Use the system tray.</strong> Print Later runs
                  quietly in your system tray. Right-click the icon to access your queue instantly
                  without opening the full app window.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Print at the office, save at home.</strong>{' '}
                  Build your queue throughout the day on any network. When you&apos;re near a
                  printer, open the app and print everything in one batch.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-br from-green-500/5 to-primary/5">
            <h2 className="text-2xl font-bold mb-4">Ready to Try It?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Print Later is free and open source. Download for Windows 10/11 — no account required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products/print-later">
                <Button size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Get Print Later Free
                </Button>
              </Link>
              <a
                href="https://github.com/subodhkc/Print-Later"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  View Source Code
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </Card>
        </section>
      </div>

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Save Web Pages to Print Later on Windows',
            description:
              'Step-by-step guide to saving web pages now and printing them later on Windows 10/11 using Print Later.',
            totalTime: 'PT15M',
            tool: [
              {
                '@type': 'HowToTool',
                name: 'Print Later app (free download)',
              },
              {
                '@type': 'HowToTool',
                name: 'Chrome, Edge, or Firefox browser',
              },
            ],
            supply: [
              {
                '@type': 'HowToSupply',
                name: 'Windows 10 or 11 (64-bit) computer',
              },
            ],
            step: steps.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: step.title,
              text: step.description,
            })),
          }),
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://subodhkc.com/products' },
              { '@type': 'ListItem', position: 3, name: 'Print Later', item: 'https://subodhkc.com/products/print-later' },
              { '@type': 'ListItem', position: 4, name: 'How It Works', item: 'https://subodhkc.com/products/print-later/how-it-works' },
            ],
          }),
        }}
      />
    </div>
  )
}
