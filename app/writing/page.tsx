'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, BookOpen, TrendingUp, Users, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function WritingPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeError, setSubscribeError] = useState<string | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscribeError(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSubscribed(true)
      setEmail('')
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  const articles = [
    {
      title: 'AI Security Tools & Calculators',
      description:
        'Interactive AI security tools — blast radius calculator, agent read/write/action matrix, prompt-injection scenario library, plus downloadable risk register, vendor due-diligence checklist, and incident evidence checklist.',
      publication: 'subodhkc.com',
      date: 'July 2026',
      url: '/ai-security-tools',
      topics: ['AI Security', 'Prompt Injection', 'AI Risk', 'MCP Security', 'RAG Security'],
    },
    {
      title: 'Does the Texas AI Law Apply to My Business?',
      description:
        'A plain-English TRAIGA guide for small and midsize businesses — interactive applicability checker, disclosure rules, penalties, healthcare AI, biometrics, final-law-vs-draft matrix, and a 10-step readiness plan.',
      publication: 'subodhkc.com',
      date: 'July 2026',
      url: '/does-texas-ai-law-apply-to-my-business',
      topics: ['Texas AI Law', 'TRAIGA', 'HB 149', 'AI Compliance', 'Small Business'],
    },
    {
      title: 'How to Build Internal AI Applications with Streamlit',
      description:
        'A practical architecture guide for building internal AI applications with Streamlit, OpenAI, RAG, custom tools and MCP — plus security, framework comparisons and a delivery roadmap.',
      publication: 'subodhkc.com',
      date: 'July 2026',
      url: '/build-internal-ai-applications-streamlit-rag-mcp',
      topics: ['Streamlit', 'MCP', 'RAG', 'OpenAI', 'Internal AI', 'Python'],
    },
    {
      title: 'AI Voice Agent Architecture: How Kestrel Voice Works',
      description:
        'Production architecture for AI voice agent platforms — telephony, custom Python orchestration, realtime AI, adaptive three-layer intent routing, RAG pipeline, tool execution with verification, four-level degradation, post-call intelligence, learning pipeline, outbound dialer, meeting bridge, AI copilot, sequential ring, SMS, video, WebRTC, security architecture, technology decisions, and limitations.',
      publication: 'subodhkc.com',
      date: 'July 2026',
      url: '/ai-voice-agent-architecture',
      topics: ['AI Voice Agents', 'Voice Orchestration', 'RAG', 'Telephony', 'Kestrel Voice', 'Security'],
    },
    {
      title: 'Why AI Voice Agents Fail in Production — and How to Deploy One Safely',
      description:
        'Ten failure modes, a production architecture, AI voice control ladder, security threat model, TCPA and TRAIGA compliance for voice, and a six-phase deployment plan.',
      publication: 'subodhkc.com',
      date: 'July 2026',
      url: '/why-ai-voice-agents-fail-in-production',
      topics: ['AI Voice Agents', 'Failure Modes', 'Voice AI Safety', 'TCPA', 'Deployment'],
    },
    {
      title: 'How to Build a Secure Enterprise RAG System',
      description:
        'A comprehensive guide to building production enterprise RAG systems — embedding models, vector databases (PostgreSQL pgvector, MongoDB, Databricks), hybrid search, row-level security, RAG poisoning prevention, agentic RAG, and evaluation metrics.',
      publication: 'subodhkc.com',
      date: 'July 2026',
      url: '/secure-enterprise-rag-architecture',
      topics: ['RAG', 'Vector Database', 'Row-Level Security', 'Agentic AI'],
    },
    {
      title: 'From AI Pilots to Regulatory Readiness',
      description:
        'The governance framework enterprise leaders are adopting to transition from AI experimentation to production-grade, compliant systems. Practical insights on navigating regulatory requirements while maintaining innovation velocity.',
      publication: 'AI Governance Playbook (Medium)',
      date: 'August 2025',
      url: 'https://medium.com/ai-governance-playbook/from-ai-pilots-to-regulatory-readiness-the-governance-framework-enterprise-leaders-are-adopting-83b5203b6c4b',
      topics: ['AI Governance', 'Compliance', 'Regulatory Readiness', 'CSM'],
    },
    {
      title: 'Why Enterprise AI Integration Strategies Fail',
      description:
        'Analyzing the common architectural and organizational pitfalls that separate successful AI adoption from expensive experiments. What actually works when implementing AI at enterprise scale.',
      publication: 'Bootcamp (Medium)',
      date: 'August 2025',
      url: 'https://medium.com/design-bootcamp/why-enterprise-ai-integration-strategies-fail-and-what-actually-works-11fe2d748eab',
      topics: ['Enterprise AI', 'Architecture', 'Implementation', 'Strategy'],
    },
    {
      title: "Nepal's Digital Power War",
      description:
        'A deep dive into the digital governance crisis that changed everything in Nepal. Examining the intersection of technology, governance, and citizen power in the digital age.',
      publication: 'Medium',
      date: 'September 2025',
      url: 'https://subodh-kc.medium.com/nepals-digital-power-war-everything-you-need-to-know-about-the-crisis-that-changed-digital-e64d4750a9ee',
      topics: ['Digital Governance', 'Policy', 'Nepal', 'Technology'],
    },
  ]

  const upcomingTopics = [
    {
      icon: BookOpen,
      title: 'Precision Drift Detection',
      description:
        'Going beyond basic monitoring: How to detect subtle degradation patterns in production AI systems before they impact users.',
    },
    {
      icon: TrendingUp,
      title: 'LegacyShift Methodology',
      description:
        'Systematic approach to modernizing legacy AI systems without introducing new compliance risks or operational disruption.',
    },
    {
      icon: Users,
      title: 'AI Governance at Scale',
      description:
        'What changes when you need to govern not one AI system, but fifty. Lessons from enterprise implementation.',
    },
  ]

  const publications = [
    {
      name: 'AI Governance Playbook',
      description: 'Practical frameworks for AI compliance and governance',
      url: 'https://medium.com/ai-governance-playbook',
    },
    {
      name: 'Design Bootcamp',
      description: 'Enterprise architecture and system design',
      url: 'https://medium.com/design-bootcamp',
    },
    {
      name: 'Personal Blog',
      description: 'Technology, governance, and strategic thinking',
      url: 'https://subodh-kc.medium.com',
    },
  ]

  return (
    <>
      <Hero
        subtitle="Writing"
        title={
          <>
            Thought Leadership on
            <br />
            <span className="gradient-text">AI Governance & Strategy</span>
          </>
        }
        description="No buzzwords. No fluff. Just practical insights from real-world AI implementation at enterprise scale."
      />

      <Section
        subtitle="Recent Articles"
        title="Published Insights"
        description="Writing that bridges the gap between AI theory and production reality. Based on years of building compliant systems at Fortune 50 scale."
      >
        <div className="space-y-6">
          {articles.map((article, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.topics.map((topic, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1"
                        >
                          <span className="text-xs font-medium text-primary">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {article.publication} • {article.date}
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="group">
                      Read article
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        subtitle="Where I Publish"
        title="Publication Channels"
        className="bg-secondary/20"
      >
        <Grid cols={3}>
          {publications.map((pub, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{pub.name}</CardTitle>
                <CardDescription>{pub.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={pub.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="group -ml-3">
                    Visit publication
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section subtitle="Coming Soon" title="Upcoming Topics">
        <Grid cols={3}>
          {upcomingTopics.map((topic, index) => {
            const Icon = topic.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section subtitle="Newsletter" title="Stay Updated">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8">
            {subscribed ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">You're subscribed!</h3>
                <p className="text-muted-foreground">
                  Check your inbox for a welcome email with AI insights and compliance updates.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-4">
                  Get insights delivered to your inbox
                </h3>
                <p className="text-muted-foreground mb-6">
                  Irregular updates on AI governance, compliance, and what's actually working in enterprise AI implementation. No spam. No fluff.
                </p>
                {subscribeError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500 text-sm">{subscribeError}</p>
                  </div>
                )}
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button type="submit" disabled={isSubscribing}>
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4">
                  Join 500+ practitioners navigating AI compliance at scale
                </p>
              </>
            )}
          </Card>
        </div>
      </Section>
    </>
  )
}
