'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  EyeOff, 
  FileText, 
  Zap, 
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Mail,
  Cpu,
  Fingerprint,
  AlertTriangle,
  FileSearch,
  Layers,
  Download,
  Clock,
  X,
  Server
} from 'lucide-react'

export default function PDFRedactorPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [downloadUnlocked, setDownloadUnlocked] = useState(false)
  const [error, setError] = useState('')

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Detection',
      description: 'Automatically identifies SSNs, credit cards, phone numbers, emails, names, addresses, and 50+ PII patterns. No manual searching required.'
    },
    {
      icon: EyeOff,
      title: 'True Redaction',
      description: 'Not just black boxes over text. Our redaction permanently removes data from the PDF — no hidden layers, no metadata leaks, no recovery possible.'
    },
    {
      icon: Fingerprint,
      title: 'Pattern Recognition',
      description: 'Create custom patterns for industry-specific data. Medical record numbers, case IDs, internal codes — if it has a pattern, we can find it.'
    },
    {
      icon: Layers,
      title: 'Batch Processing',
      description: 'Redact hundreds of documents at once. Apply the same rules across your entire document set with one click.'
    },
    {
      icon: FileSearch,
      title: 'Audit Trail',
      description: 'Complete logging of every redaction. Know exactly what was removed, when, and by whom. Perfect for compliance requirements.'
    },
    {
      icon: Lock,
      title: '100% Local Processing',
      description: 'Your documents never leave your computer. All AI processing happens locally. Zero cloud uploads. Zero data exposure risk.'
    }
  ]

  const piiTypes = [
    'Social Security Numbers',
    'Credit Card Numbers',
    'Bank Account Numbers',
    'Phone Numbers',
    'Email Addresses',
    'Physical Addresses',
    'Names & Signatures',
    'Dates of Birth',
    'Driver\'s License Numbers',
    'Passport Numbers',
    'Medical Record Numbers',
    'IP Addresses',
    'Custom Patterns'
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
          source: 'pdf-redactor',
          product: 'PDF Redactor'
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-red-500/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Privacy-First Document Security</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Redact Sensitive Data.
            <br />
            <span className="text-red-500">Permanently.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            One data breach costs an average of $4.45 million. PDF Redactor uses AI to automatically detect and 
            permanently remove sensitive information from your documents — all processed locally on your machine. 
            No cloud. No risk. No trace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {downloadUnlocked ? (
              <>
                <a href="#download" className="inline-flex">
                  <Button size="lg" className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700">
                    <Download className="h-5 w-5" />
                    Download Free Version
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                  View Pro Features
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => setShowModal(true)}
                >
                  <Download className="h-5 w-5" />
                  Get Free Download
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                  See How It Works
                </Button>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Windows & Mac • Free tier available • No account required
          </p>

          {/* Visual Demo */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-to-br from-background to-red-500/5 border-red-500/20">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <div className="text-sm font-medium text-muted-foreground mb-2">BEFORE</div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border font-mono text-sm space-y-2">
                    <p>Name: <span className="bg-yellow-200 dark:bg-yellow-900 px-1">John Smith</span></p>
                    <p>SSN: <span className="bg-yellow-200 dark:bg-yellow-900 px-1">123-45-6789</span></p>
                    <p>Email: <span className="bg-yellow-200 dark:bg-yellow-900 px-1">john@email.com</span></p>
                    <p>Card: <span className="bg-yellow-200 dark:bg-yellow-900 px-1">4532-1234-5678-9012</span></p>
                    <p>Phone: <span className="bg-yellow-200 dark:bg-yellow-900 px-1">(555) 123-4567</span></p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>5 PII instances detected</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-muted-foreground mb-2">AFTER</div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border font-mono text-sm space-y-2">
                    <p>Name: <span className="bg-black text-black px-1 rounded">████████</span></p>
                    <p>SSN: <span className="bg-black text-black px-1 rounded">███████████</span></p>
                    <p>Email: <span className="bg-black text-black px-1 rounded">██████████████</span></p>
                    <p>Card: <span className="bg-black text-black px-1 rounded">███████████████████</span></p>
                    <p>Phone: <span className="bg-black text-black px-1 rounded">██████████████</span></p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>All PII permanently removed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 px-4 bg-red-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$4.45M</div>
              <div className="text-white/80">Average cost of a data breach</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">277 days</div>
              <div className="text-white/80">Average time to identify a breach</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">83%</div>
              <div className="text-white/80">Of breaches involve human error</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Redaction. Zero Complexity.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drag. Drop. Redact. It&apos;s that simple. But under the hood, you get the same 
              technology used by Fortune 500 legal teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:border-red-500/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-red-500" />
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

      {/* PII Types Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Detects 50+ Types of Sensitive Data
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI is trained on millions of document patterns. It finds what humans miss — 
                and does it in seconds, not hours.
              </p>
              <div className="flex flex-wrap gap-2">
                {piiTypes.map((type, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-background border border-border rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-red-500/5 to-background">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                  <EyeOff className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">True Permanent Redaction</h3>
                <p className="text-muted-foreground mb-6">
                  Unlike simple black boxes, our redaction removes data at the byte level. 
                  No hidden layers. No metadata traces. No recovery possible — ever.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Removes from all PDF layers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Clears document metadata</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Flattens all annotations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Court-admissible output</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-green-500/5 to-primary/5 border-green-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Server className="h-4 w-4" />
                  100% Local Processing
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Your Documents Never Leave Your Machine
                </h3>
                <p className="text-muted-foreground mb-6">
                  In a world of cloud breaches, we took a different approach. PDF Redactor runs 
                  entirely on your computer. No uploads. No cloud processing. No third-party access.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>All AI models run locally</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>No internet required after install</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Zero telemetry or tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Open source core available</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="w-40 h-40 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Lock className="h-20 w-20 text-green-500" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-500/10 to-background" id="download">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Risking Data Exposure
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Download PDF Redactor free. Protect your documents. Sleep better at night.
          </p>

          {downloadUnlocked ? (
            <div className="space-y-4">
              <Button size="lg" className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700">
                <Download className="h-5 w-5" />
                Download for Windows
              </Button>
              <p className="text-sm text-muted-foreground">
                Mac version coming soon. Join waitlist for early access.
              </p>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700"
              onClick={() => setShowModal(true)}
            >
              <Download className="h-5 w-5" />
              Get Free Download
            </Button>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>2-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Free tier: 50 pages/month</span>
            </div>
          </div>
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
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <EyeOff className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get PDF Redactor Free</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email to unlock the download. We&apos;ll also notify you about updates and the Pro version.
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
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
