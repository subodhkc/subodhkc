'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Activity, 
  FileText, 
  Zap, 
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Mail,
  Search,
  AlertTriangle,
  TrendingUp,
  Clock,
  Terminal,
  Database,
  Cpu,
  BarChart3,
  X,
  Download,
  Eye,
  Filter,
  Layers
} from 'lucide-react'

export default function SKCLogAnalyserPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)
  const [error, setError] = useState('')

  const features = [
    {
      icon: Search,
      title: 'Intelligent Pattern Detection',
      description: 'Our AI doesn\'t just search — it understands. Automatically identifies anomalies, error cascades, and performance degradation patterns across millions of log lines.'
    },
    {
      icon: AlertTriangle,
      title: 'Real-Time Alerting',
      description: 'Get notified before problems become outages. SKC Log Analyser learns your system\'s normal behavior and alerts you when something\'s off.'
    },
    {
      icon: TrendingUp,
      title: 'Root Cause Analysis',
      description: 'Stop guessing. Our correlation engine traces errors back to their source, showing you exactly what went wrong and when.'
    },
    {
      icon: Terminal,
      title: 'Universal Log Support',
      description: 'Apache, Nginx, Docker, Kubernetes, AWS CloudWatch, custom formats — if it generates logs, we can analyze it. No reformatting required.'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Transform walls of text into actionable insights. Interactive dashboards, trend analysis, and exportable reports for stakeholders.'
    },
    {
      icon: Lock,
      title: 'On-Premise & Air-Gapped',
      description: 'Your logs contain sensitive data. Run SKC Log Analyser entirely on your infrastructure. No cloud dependency. No data leaves your network.'
    }
  ]

  const logTypes = [
    { name: 'Application Logs', icon: FileText },
    { name: 'Server Logs', icon: Database },
    { name: 'Security Logs', icon: Shield },
    { name: 'Container Logs', icon: Layers },
    { name: 'Network Logs', icon: Activity },
    { name: 'Custom Formats', icon: Filter }
  ]

  const metrics = [
    { value: '10B+', label: 'Log lines processed daily' },
    { value: '<100ms', label: 'Query response time' },
    { value: '99.9%', label: 'Anomaly detection accuracy' },
    { value: '60%', label: 'Faster incident resolution' }
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
          source: 'skc-log-analyser',
          product: 'SKC LOG Analyser'
        })
      })

      if (res.ok) {
        setAccessGranted(true)
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-emerald-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Activity className="h-4 w-4" />
                <span>Enterprise Log Intelligence</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Find the Needle.
                <span className="text-emerald-500 block">In a Billion Haystacks.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Your logs tell a story. SKC Log Analyser reads it for you. AI-powered analysis that turns 
                terabytes of log data into actionable insights — finding anomalies, tracing errors, and 
                predicting failures before they happen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {accessGranted ? (
                  <>
                    <Button size="lg" className="text-lg px-8 gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <Download className="h-5 w-5" />
                      Download Now
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                      View Documentation
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="text-lg px-8 gap-2 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setShowModal(true)}
                    >
                      Get Early Access
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                      <Eye className="h-5 w-5" />
                      Watch Demo
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>On-Premise Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Air-Gap Compatible</span>
                </div>
              </div>
            </div>

            {/* Terminal Animation */}
            <div className="relative">
              <Card className="p-4 bg-gray-950 border-gray-800 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-500 ml-2">skc-log-analyser</span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-emerald-400">$</span> skc analyze --source /var/log/app/</p>
                  <p className="text-gray-500">Scanning 2,847,392 log entries...</p>
                  <p className="text-gray-500">Detecting patterns...</p>
                  <p className="text-gray-500">Correlating events...</p>
                  <p className="text-emerald-400 mt-4">✓ Analysis complete</p>
                  <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-800">
                    <p className="text-amber-400">⚠ 3 anomalies detected</p>
                    <p className="text-red-400">✗ 1 critical error pattern</p>
                    <p className="text-emerald-400">✓ Root cause identified: DB connection pool exhaustion</p>
                    <p className="text-gray-400 mt-2">→ First occurrence: 2024-01-15 03:42:17</p>
                    <p className="text-gray-400">→ Affected services: api-gateway, user-service</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {metrics.map((metric, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-white/80">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligence That Scales With Your Logs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From startup to enterprise, SKC Log Analyser grows with you. Process millions of events 
              per second without breaking a sweat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:border-emerald-500/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-emerald-500" />
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

      {/* Log Types Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Works With Every Log Format
            </h2>
            <p className="text-lg text-muted-foreground">
              No reformatting. No custom parsers. Just point and analyze.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {logTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Card key={index} className="p-6 text-center hover:border-emerald-500/50 transition-colors">
                  <Icon className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                  <div className="text-sm font-medium">{type.name}</div>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Plus: Apache, Nginx, Docker, Kubernetes, AWS CloudWatch, Azure Monitor, GCP Logging, 
              Syslog, JSON, CSV, and custom formats
            </p>
          </div>
        </div>
      </section>

      {/* Use Case Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From Chaos to Clarity in Seconds
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                When production goes down at 3 AM, you don&apos;t have time to grep through gigabytes of logs. 
                SKC Log Analyser gives you answers, not more questions.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Incident Response</h3>
                    <p className="text-muted-foreground">
                      Reduce MTTR by 60%. Instantly correlate events across services and identify root cause.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Security Monitoring</h3>
                    <p className="text-muted-foreground">
                      Detect intrusion attempts, unusual access patterns, and compliance violations automatically.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Performance Optimization</h3>
                    <p className="text-muted-foreground">
                      Identify bottlenecks, slow queries, and resource contention before users notice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-emerald-500/5 to-background">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <Cpu className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Built by Engineers, for Engineers</h3>
                <p className="text-muted-foreground mb-6">
                  SKC log Analyser is a standalone tool that anyone can use , just upload log and get result . 
                  We built the tool we wished we had.
                </p>
                <div className="text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>CLI-first design</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>API for automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Integrates with PagerDuty, Slack, Teams</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Kubernetes-native deployment</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-500/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Drowning in Logs
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the early access program and be among the first to experience 
            intelligent log analysis. Limited spots available.
          </p>

          {accessGranted ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span>Early access granted!</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Download className="h-5 w-5" />
                  Download SKC Log Analyser
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="text-lg px-8 gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowModal(true)}
            >
              Request Early Access
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>On-premise deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Air-gap compatible</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Free tier available</span>
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
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Early Access</h3>
              <p className="text-sm text-muted-foreground">
                Be among the first to use SKC Log Analyser. Early access members get priority support 
                and influence on the roadmap.
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
                    placeholder="you@company.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Join Early Access'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Limited spots. No spam, ever.
              </p>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
