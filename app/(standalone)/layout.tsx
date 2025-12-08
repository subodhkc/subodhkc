import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subodh KC - Resume',
  description: 'Resume for Subodh KC - Product Manager specializing in AI Compliance & Automation',
}

// Standalone layout - NO navigation or footer
export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
