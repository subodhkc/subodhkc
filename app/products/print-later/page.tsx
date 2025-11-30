'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download, 
  Github, 
  Shield, 
  Zap, 
  Printer, 
  FileText, 
  Layers, 
  Monitor,
  CheckCircle2,
  Lock,
  Eye,
  Server,
  Code,
  UserX,
  ArrowRight,
  Mail,
  X
} from 'lucide-react'

export default function PrintLaterPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [downloadUnlocked, setDownloadUnlocked] = useState(false)
  const [error, setError] = useState('')

  const features = [
    {
      icon: Zap,
      title: 'One-Click Capture',
      description: 'See something worth printing? Click once. Done. The page is saved to your queue, ready when you are.'
    },
    {
      icon: FileText,
      title: 'Your Print Queue',
      description: 'Everything in one place. Sort by date, search by title, print when your schedule allows.'
    },
    {
      icon: Layers,
      title: 'Pick Your Pages',
      description: 'Only need pages 3-5 from a 50-page PDF? Select exactly what you want. Stop printing cover pages.'
    },
    {
      icon: Printer,
      title: 'Packet Builder',
      description: 'Combine pages from multiple documents into one print job. Perfect for meetings and research.'
    },
    {
      icon: Monitor,
      title: 'System Tray App',
      description: 'Runs quietly in your system tray. Right-click to access your queue instantly.'
    },
    {
      icon: Lock,
      title: '100% Local Storage',
      description: 'Your documents never leave your computer. No cloud, no uploads, no tracking.'
    }
  ]

  const securityFeatures = [
    { icon: Server, text: 'No cloud uploads — Your documents stay on YOUR PC' },
    { icon: Eye, text: 'No telemetry — Zero tracking or analytics' },
    { icon: UserX, text: 'No account required — Works completely offline' },
    { icon: Code, text: 'Open source — Full source code available for audit' },
    { icon: Lock, text: 'No admin rights — Installs in user space only' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'print-later',
          product: 'Print Later'
        })
      })

      if (res.ok) {
        setDownloadUnlocked(true)
        setShowModal(false)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>Version 1.0.0</span>
            <span className="w-1 h-1 rounded-full bg-green-500" />
            <span>Free & Open Source</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Stop Wasting Paper.
            <br />
            <span className="gradient-text">Print Smarter.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Ever printed a 47-page article when you only needed page 3? Print Later lets you save web pages, 
            pick exactly what you need, and print when YOU&apos;RE ready. 100% local, zero cloud nonsense.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {downloadUnlocked ? (
              <>
                <a 
                  href="https://github.com/subodhkc/Print-Later/releases/download/v1.0.0/Print.Later.Setup.1.0.0.exe"
                  className="inline-flex"
                >
                  <Button size="lg" className="text-lg px-8 gap-2">
                    <Download className="h-5 w-5" />
                    Download for Windows
                  </Button>
                </a>
                <a 
                  href="https://github.com/subodhkc/Print-Later"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                    <Github className="h-5 w-5" />
                    View on GitHub
                  </Button>
                </a>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="text-lg px-8 gap-2"
                  onClick={() => setShowModal(true)}
                >
                  <Download className="h-5 w-5" />
                  Get Free Download
                </Button>
                <a 
                  href="https://github.com/subodhkc/Print-Later"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                    <Github className="h-5 w-5" />
                    View Source Code
                  </Button>
                </a>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Windows 10/11 • 93 MB • No account required
          </p>

          {/* Screenshot */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-border shadow-2xl">
            <Image
              src="/products/print-later/screenshot.png"
              alt="Print Later App Screenshot"
              width={1200}
              height={675}
              className="w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for How You Actually Work
            </h2>
            <p className="text-lg text-muted-foreground">
              No more printing entire websites. No more wasted paper. No more &quot;where did I save that?&quot;
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-background/50 hover:bg-background transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                Privacy First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                We Don&apos;t Want Your Data
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Seriously. We built Print Later because we were tired of apps that spy on you. 
                Your documents are YOUR business. You host it, you own it — 100% safe.
              </p>

              <div className="space-y-4">
                {securityFeatures.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-green-500/5 to-primary/5">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Your Data Promise</h3>
                <p className="text-muted-foreground mb-6">
                  Print Later is designed with a simple philosophy: your documents belong to you. 
                  We have zero access to your files, zero telemetry, and zero interest in your data.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified Open Source</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Stop Wasting Paper?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Download Print Later for free. No signup required for the app itself — 
            just enter your email once to get the download link.
          </p>

          {downloadUnlocked ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/subodhkc/Print-Later/releases/download/v1.0.0/Print.Later.Setup.1.0.0.exe"
                className="inline-flex"
              >
                <Button size="lg" className="text-lg px-8 gap-2">
                  <Download className="h-5 w-5" />
                  Download for Windows (93 MB)
                </Button>
              </a>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="text-lg px-8 gap-2"
              onClick={() => setShowModal(true)}
            >
              <Download className="h-5 w-5" />
              Get Free Download
            </Button>
          )}

          <div className="mt-8 p-4 bg-background/50 rounded-xl inline-block">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>System Requirements</strong>
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              <span>Windows 10/11 (64-bit)</span>
              <span>•</span>
              <span>4 GB RAM</span>
              <span>•</span>
              <span>200 MB disk space</span>
              <span>•</span>
              <span>Chrome or Edge</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            <strong>Note:</strong> Windows SmartScreen may show a warning because the app is not code-signed. 
            Click &quot;More info&quot; → &quot;Run anyway&quot; to install.
          </p>
        </div>
      </section>

      {/* Coming Soon - CourtCase */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Coming Soon
                </div>
                <h3 className="text-2xl font-bold mb-2">CourtCase</h3>
                <p className="text-muted-foreground mb-4">
                  Organize your legal documents with ease. CourtCase helps you manage case files, 
                  track deadlines, and prepare document packets — all locally on your computer.
                </p>
                <Link href="/products/courtcase">
                  <Button variant="outline" className="gap-2">
                    Get Priority Access
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="w-32 h-32 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-16 w-16 text-amber-500" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Email Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <Card className="relative z-10 w-full max-w-md p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Print Later Free</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email to unlock the download. We&apos;ll also notify you about updates and new tools.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Unlock Download'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
