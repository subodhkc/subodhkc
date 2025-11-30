'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Scale, 
  FileText, 
  FolderOpen, 
  Calendar, 
  Shield, 
  Lock,
  CheckCircle2,
  Bell,
  Layers,
  Search,
  Clock,
  ArrowRight,
  Mail,
  Printer
} from 'lucide-react'

export default function CourtCasePage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const plannedFeatures = [
    {
      icon: FolderOpen,
      title: 'Case Organization',
      description: 'Organize all your case documents in one place. Create folders, add tags, and find anything instantly.'
    },
    {
      icon: Calendar,
      title: 'Deadline Tracking',
      description: 'Never miss a filing deadline. Set reminders and get notifications for important dates.'
    },
    {
      icon: Layers,
      title: 'Document Packets',
      description: 'Build complete document packets for court submissions. Combine, reorder, and export as PDF.'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find any document across all your cases with powerful full-text search.'
    },
    {
      icon: Clock,
      title: 'Timeline View',
      description: 'See your case history at a glance. Track every document, event, and milestone.'
    },
    {
      icon: Lock,
      title: '100% Local',
      description: 'Like Print Later, all your data stays on your computer. No cloud, no tracking, no risk.'
    }
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
          source: 'courtcase-waitlist',
          product: 'CourtCase',
          waitlist: true
        })
      })

      if (res.ok) {
        setIsSubmitted(true)
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Clock className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Legal Documents.
            <br />
            <span className="gradient-text">Organized. Secure. Local.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            CourtCase helps you organize case files, track deadlines, and prepare document packets — 
            all stored locally on your computer. No cloud. No subscriptions. No data risk.
          </p>

          {/* Waitlist Form */}
          {isSubmitted ? (
            <Card className="max-w-md mx-auto p-6 bg-green-500/5 border-green-500/20">
              <div className="flex items-center gap-3 text-green-500">
                <CheckCircle2 className="h-6 w-6" />
                <div className="text-left">
                  <p className="font-semibold">You&apos;re on the list!</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll email you at <strong className="text-foreground">{email}</strong> when CourtCase launches.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Get Priority Access</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to know when CourtCase launches. Early supporters get exclusive benefits.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
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
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We&apos;re Building
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed for legal professionals and self-represented individuals alike.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plannedFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-background/50 hover:bg-background transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-amber-500" />
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

      {/* Privacy Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-green-500/5 to-primary/5">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Shield className="h-4 w-4" />
                  Privacy First
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Your Data Stays Yours
                </h3>
                <p className="text-muted-foreground mb-6">
                  Legal documents are sensitive. That&apos;s why CourtCase, like Print Later, 
                  stores everything locally on your computer. We have zero access to your files.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>No cloud storage — everything local</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>No account required</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>No tracking or telemetry</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Open source for transparency</span>
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

      {/* Print Later CTA */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Printer className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Available Now
                </div>
                <h3 className="text-2xl font-bold mb-2">Try Print Later Today</h3>
                <p className="text-muted-foreground mb-4">
                  While you wait for CourtCase, check out Print Later — our free tool for saving 
                  web pages and printing them when you&apos;re ready.
                </p>
                <Link href="/products/print-later">
                  <Button className="gap-2">
                    Get Print Later Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Scale className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Don&apos;t Miss the Launch
          </h2>
          <p className="text-muted-foreground mb-8">
            CourtCase will be available at <strong className="text-foreground">courtcase.frontofai.com</strong>. 
            Join the waitlist to get notified and receive priority access.
          </p>
          
          {!isSubmitted && (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
