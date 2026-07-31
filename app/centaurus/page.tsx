import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { FileText, Download, ArrowLeft, Eye, Play } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl text-white">Centaurus AI Advisory Practice</CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  AI governance, compliance automation, and enterprise AI strategy — built for leaders deploying AI at scale
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Presentation Overview</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  A structured approach to enterprise AI governance — covering framework selection, compliance automation,
                  risk posture management, and AI strategy alignment. Built for C-suite executives and technical leaders
                  who need actionable governance, not theory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Key Topics</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• AI Governance Framework Selection</li>
                    <li>• Compliance Automation Architecture</li>
                    <li>• AI Risk Posture &amp; Mitigation</li>
                    <li>• Enterprise AI Strategy Alignment</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Document Details</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Format: PowerPoint (.pptx)</li>
                    <li>• Audience: C-Suite &amp; Technical Leaders</li>
                    <li>• Status: Client Ready</li>
                    <li>• Version: Final</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Video Overview</h3>
                <div className="space-y-4">
                  <a 
                    href="https://youtube.com/shorts/kBJyxvGFobQ?feature=share" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button size="lg" className="w-full gap-2 bg-red-600 hover:bg-red-700">
                      <Play className="h-5 w-5" />
                      Watch on YouTube
                    </Button>
                  </a>
                  <p className="text-xs text-slate-500">
                    60-second executive overview of the Centaurus practice
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Monetize AI</h3>
                <div className="space-y-4">
                  <a 
                    href="https://docs.google.com/presentation/d/1VKLxITPtv-B5opdCGq0z7JIpdHGO1kcu/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button size="lg" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <Eye className="h-5 w-5" />
                      View Monetize AI on Google Slides
                    </Button>
                  </a>
                  <p className="text-xs text-slate-500">
                    Revenue models, pricing strategy, and go-to-market approaches for AI products
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-900 mb-1">Centaurus AI Advisory Practice</h3>
                <p className="text-xs text-slate-500 mb-4">Full presentation — download or view in Google Slides</p>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="/Doc/Centaurus_AI_Advisory_Practice_Client_Ready_Final.pptx" 
                      download="Centaurus_AI_Advisory_Practice_Client_Ready_Final.pptx"
                      className="flex-1"
                    >
                      <Button size="lg" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-5 w-5" />
                        Download PowerPoint
                      </Button>
                    </a>
                    <a 
                      href="https://docs.google.com/presentation/d/1roy5Jh3VLVa6UoZ_zHD9wWxoHfdrILkM/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="lg" variant="outline" className="w-full gap-2">
                        <Eye className="h-5 w-5" />
                        View on Google Slides
                      </Button>
                    </a>
                  </div>
                  <p className="text-xs text-slate-500">
                    Format: PowerPoint (.pptx) | View in Google Slides or download for offline use
                  </p>
                </div>
              </div>

              <HaiecDeckSection />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> These presentations are confidential and intended for authorized recipients only. 
                  Please handle accordingly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">
            Questions about the Centaurus practice or HAIEC technical deck? <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">Get in touch</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
