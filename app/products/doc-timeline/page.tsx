'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Clock, 
  FileText, 
  GitBranch, 
  Calendar,
  Search,
  Download,
  Zap,
  Shield,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Mail,
  Briefcase,
  BarChart3,
  Eye,
  Lock,
  X
} from 'lucide-react'

export default function DocTimelinePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
    volume: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const features = [
    {
      icon: GitBranch,
      title: 'Automatic Timeline Extraction',
      description: 'Upload any document — contracts, case files, medical records — and watch as our AI extracts every date, event, and milestone into a chronological timeline.'
    },
    {
      icon: Search,
      title: 'Cross-Document Analysis',
      description: 'Analyze hundreds of documents simultaneously. Identify patterns, contradictions, and gaps across your entire document set in seconds.'
    },
    {
      icon: Calendar,
      title: 'Interactive Timeline View',
      description: 'Navigate complex histories with our intuitive timeline interface. Zoom, filter, and drill down into any event for full context.'
    },
    {
      icon: BarChart3,
      title: 'Gap & Conflict Detection',
      description: 'Automatically flag missing periods, overlapping claims, and contradictory statements. Never miss a critical inconsistency again.'
    },
    {
      icon: Download,
      title: 'Export Anywhere',
      description: 'Generate court-ready timeline reports, Excel spreadsheets, or integrate directly with your case management system via API.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant infrastructure. Your documents are encrypted at rest and in transit. Optional on-premise deployment available.'
    }
  ]

  const useCases = [
    {
      icon: Briefcase,
      title: 'Legal Discovery',
      description: 'Reduce document review time by 80%. Extract timelines from depositions, contracts, and correspondence to build your case narrative faster.',
      stat: '80%',
      statLabel: 'Faster Review'
    },
    {
      icon: Building2,
      title: 'Insurance Claims',
      description: 'Process claims faster with automated timeline generation. Identify fraud patterns and validate claim sequences instantly.',
      stat: '3x',
      statLabel: 'Faster Processing'
    },
    {
      icon: Users,
      title: 'Compliance Audits',
      description: 'Build audit trails automatically. Track regulatory submissions, policy changes, and compliance events across years of documentation.',
      stat: '100%',
      statLabel: 'Audit Coverage'
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
          email: formData.email,
          name: formData.name,
          company: formData.company,
          useCase: formData.useCase,
          volume: formData.volume,
          source: 'doc-timeline-pricing',
          product: 'Doc Timeline Generator',
          requestType: 'pricing'
        })
      })

      if (res.ok) {
        setIsSubmitted(true)
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                <span>Enterprise Document Intelligence</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Turn Thousands of Documents Into
                <span className="gradient-text block">One Clear Timeline</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Stop spending weeks manually reviewing documents. Doc Timeline Generator uses advanced AI to extract, 
                organize, and visualize every date and event from your document set — in minutes, not months.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 gap-2"
                  onClick={() => setShowModal(true)}
                >
                  Request Pricing
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                  <Eye className="h-5 w-5" />
                  See Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>On-Premise Available</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Contract_2019.pdf</div>
                      <div className="text-xs text-muted-foreground">47 events extracted</div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Deposition_Smith.pdf</div>
                      <div className="text-xs text-muted-foreground">123 events extracted</div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Email_Chain_Q4.pdf</div>
                      <div className="text-xs text-muted-foreground">89 events extracted</div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Events</span>
                      <span className="text-2xl font-bold text-primary">259</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Conflicts Detected</span>
                      <span className="text-lg font-semibold text-amber-500">3</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-primary-foreground/80">Documents Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.7%</div>
              <div className="text-primary-foreground/80">Extraction Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">80%</div>
              <div className="text-primary-foreground/80">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Complex Documents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for legal teams, compliance officers, and anyone who needs to make sense of massive document sets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:border-primary/50 transition-colors">
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

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Your Industry
            </h2>
            <p className="text-lg text-muted-foreground">
              Trusted by leading organizations across legal, insurance, and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <Card key={index} className="text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-1">{useCase.stat}</div>
                  <div className="text-sm text-muted-foreground mb-4">{useCase.statLabel}</div>
                  <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            <Card className="p-8 text-center bg-green-500/5 border-green-500/20">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-4">
                We&apos;ve received your pricing request. Our team will reach out within 24 hours 
                with a custom quote tailored to your needs.
              </p>
              <Link href="/products">
                <Button variant="outline">Explore Other Products</Button>
              </Link>
            </Card>
          ) : (
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Document Review?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get a custom quote based on your document volume and use case. 
                  Enterprise pricing includes dedicated support and custom integrations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 gap-2"
                  onClick={() => setShowModal(true)}
                >
                  Request Custom Pricing
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Schedule a Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>On-Premise Deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Pricing Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <Card className="relative z-10 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Request Custom Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your needs and we&apos;ll prepare a tailored quote within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Work Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Primary Use Case</label>
                <select
                  value={formData.useCase}
                  onChange={(e) => setFormData({...formData, useCase: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                >
                  <option value="">Select use case...</option>
                  <option value="legal-discovery">Legal Discovery</option>
                  <option value="insurance-claims">Insurance Claims</option>
                  <option value="compliance-audit">Compliance Audit</option>
                  <option value="contract-analysis">Contract Analysis</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Monthly Document Volume</label>
                <select
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                >
                  <option value="">Select volume...</option>
                  <option value="under-1000">Under 1,000 documents</option>
                  <option value="1000-10000">1,000 - 10,000 documents</option>
                  <option value="10000-100000">10,000 - 100,000 documents</option>
                  <option value="over-100000">Over 100,000 documents</option>
                </select>
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
                {isSubmitting ? 'Submitting...' : 'Get Custom Quote'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
