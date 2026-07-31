import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, ArrowLeft, Eye, Play } from 'lucide-react'
import { HaiecDeckSection } from './haiec-deck-section'

export const metadata: Metadata = {
  title: 'Centaurus AI Advisory Practice | Subodh KC',
  description: 'Centaurus AI Advisory Practice presentation. Strategic AI governance and compliance frameworks.',
  robots: {
    index: false,
    follow: false,
  }
}

export default function CentaurusPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-10 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header — clean, no gradient */}
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Centaurus Practice
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Centaurus AI Advisory Practice
          </h1>
          <div className="h-px bg-slate-900 w-full mb-4" />
          <p className="text-slate-600 text-sm leading-relaxed">
            AI governance, compliance automation, and enterprise AI strategy — built for leaders deploying AI at scale
          </p>
        </div>

        {/* Presentation Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Presentation Overview</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            A structured approach to enterprise AI governance — covering framework selection, compliance automation,
            risk posture management, and AI strategy alignment. Built for C-suite executives and technical leaders
            who need actionable governance, not theory.
          </p>
        </div>

        {/* Key Topics + Document Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 mb-10 border border-slate-200">
          <div className="bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Key Topics</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>AI Governance Framework Selection</li>
              <li>Compliance Automation Architecture</li>
              <li>AI Risk Posture &amp; Mitigation</li>
              <li>Enterprise AI Strategy Alignment</li>
            </ul>
          </div>
          <div className="bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Document Details</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>Format: PowerPoint (.pptx)</li>
              <li>Audience: C-Suite &amp; Technical Leaders</li>
              <li>Status: Client Ready</li>
              <li>Version: Final</li>
            </ul>
          </div>
        </div>

        {/* Section divider */}
        <div className="h-px bg-slate-200 mb-8" />

        {/* Resources — text links, not colorful buttons */}
        <div className="space-y-8">
          {/* Video Overview */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Video Overview</h2>
            <p className="text-sm text-slate-600 mb-3">
              60-second executive overview of the Centaurus practice
            </p>
            <a
              href="https://youtube.com/shorts/kBJyxvGFobQ?feature=share"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                <Play className="h-4 w-4" />
                Watch on YouTube
              </Button>
            </a>
          </div>

          {/* Monetize AI */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Monetize AI</h2>
            <p className="text-sm text-slate-600 mb-3">
              Revenue models, pricing strategy, and go-to-market approaches for AI products
            </p>
            <a
              href="https://docs.google.com/presentation/d/1VKLxITPtv-B5opdCGq0z7JIpdHGO1kcu/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                <Eye className="h-4 w-4" />
                View on Google Slides
              </Button>
            </a>
          </div>

          {/* Centaurus Deck */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Centaurus AI Advisory Practice</h2>
            <p className="text-sm text-slate-600 mb-3">
              Full presentation — download or view in Google Slides
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/Doc/Centaurus_AI_Advisory_Practice_Client_Ready_Final.pptx"
                download="Centaurus_AI_Advisory_Practice_Client_Ready_Final.pptx"
              >
                <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                  <Download className="h-4 w-4" />
                  Download PowerPoint
                </Button>
              </a>
              <a
                href="https://docs.google.com/presentation/d/1roy5Jh3VLVa6UoZ_zHD9wWxoHfdrILkM/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Eye className="h-4 w-4" />
                  View on Google Slides
                </Button>
              </a>
            </div>
          </div>

          {/* HAIEC Technical Deck */}
          <HaiecDeckSection />
        </div>

        {/* Confidentiality note */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            These presentations are confidential and intended for authorized recipients only.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Questions about the Centaurus practice or HAIEC technical deck?{' '}
            <Link href="/contact" className="text-slate-900 font-semibold hover:underline">
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
