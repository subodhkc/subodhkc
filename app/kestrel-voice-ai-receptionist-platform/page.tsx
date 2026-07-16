import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import Link from 'next/link'
import Grid from '@/components/Grid'
import { KestrelMarketPositionDiagram } from '@/components/diagrams/KestrelMarketPositionDiagram'
import { KestrelKnowledgeStackDiagram } from '@/components/diagrams/KestrelKnowledgeStackDiagram'
import { VerifiedActionFlowDiagram } from '@/components/diagrams/VerifiedActionFlowDiagram'
import { DiagramReveal } from '@/components/DiagramReveal'
import { VoiceControlLadder } from '@/components/interactive/VoiceControlLadder'
import { DeploymentPathSelector } from '@/components/interactive/DeploymentPathSelector'
import {
  Phone, Shield, Zap, Database, Cpu, Webhook, Gauge,
  AlertTriangle, Lock, CheckCircle2,
  Layers, FileText, Ban, Video,
  MessageSquare, MonitorSmartphone, Building2, ArrowRight,
  Settings,
} from 'lucide-react'
import {
  faqs, tocItems, marketApproaches, sixStrengths, setupQuestions,
  orchestrationPaths, orchestrationExamples, adaptiveLayers,
  knowledgeLayers, knowledgeLifecycle, weakBookingSteps, controlledBookingSteps,
  verifiedActionPrinciple, verifiedActionAppliesTo, dashboardDataModel,
  improvementLoop, degradationLevels, fallbackTable, learningSteps,
  learningGuardrails, multiChannelFeatures, securityDomains, tenantConfigItems,
  promptHierarchy, callScenarioSteps, comparisonTable, whoFor, whoForTraits,
  whenNot, haiecAssesses, kestrelImplements, relatedResources,
} from './data'

export const metadata = {
  title: 'Kestrel Voice AI Receptionist: No-Code Business Calls | Subodh KC',
  description: 'Deploy a hosted AI receptionist without coding. Kestrel Voice combines business setup, RAG, appointments, transfers, guardrails, analytics, and custom workflows.',
  alternates: { canonical: 'https://subodhkc.com/kestrel-voice-ai-receptionist-platform' },
  openGraph: {
    title: 'Kestrel Voice AI Receptionist: No-Code Business Calls',
    description: 'Deploy a hosted AI receptionist without coding. Kestrel Voice combines business setup, RAG, appointments, transfers, guardrails, analytics, and custom workflows.',
    url: 'https://subodhkc.com/kestrel-voice-ai-receptionist-platform',
    type: 'article', authors: ['Subodh KC'],
    publishedTime: '2026-07-16', modifiedTime: '2026-07-16',
    tags: ['AI receptionist', 'no-code AI voice', 'Kestrel Voice', 'AI phone answering', 'AI receptionist platform', 'HAIEC', 'voice AI for business'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kestrel Voice AI Receptionist: No-Code Business Calls',
    description: 'Deploy a hosted AI receptionist without coding. Kestrel Voice combines business setup, RAG, appointments, transfers, guardrails, analytics, and custom workflows.',
    images: ['https://subodhkc.com/og-default.png'],
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: [
    'AI receptionist platform', 'no-code AI receptionist',
    'hosted AI receptionist', 'AI receptionist for small business',
    'AI phone answering service', 'AI receptionist with appointment booking',
    'AI receptionist with call transfer', 'custom AI voice agent',
    'AI receptionist with RAG', 'AI voice agent platform',
    'AI phone agent for business', 'Kestrel Voice',
    'AI voice operations', 'AI call handling',
    'deterministic voice AI', 'voice agent guardrails',
    'AI receptionist dashboard', 'voice agent fallback',
    'multi-tenant AI voice', 'AI voice cost per outcome',
    'HAIEC AI compliance', 'AI voice deployment paths',
  ],
  about: ['AI receptionist', 'Kestrel Voice', 'voice AI platform', 'no-code voice AI', 'HAIEC'],
}

const articleSchema = {
  '@context': 'https://schema.org', '@type': 'TechArticle',
  headline: 'Kestrel Voice: A No-Code AI Receptionist Platform Built for Real Business Calls',
  description: 'Deploy a hosted AI receptionist without coding. Kestrel Voice combines business setup, RAG, appointments, transfers, guardrails, analytics, and custom workflows.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-16', dateModified: '2026-07-16',
  url: 'https://subodhkc.com/kestrel-voice-ai-receptionist-platform',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://subodhkc.com/kestrel-voice-ai-receptionist-platform' },
  image: 'https://subodhkc.com/og-default.png', inLanguage: 'en',
  articleSection: 'AI Voice Operations', wordCount: 6500,
  about: { '@type': 'SoftwareApplication', name: 'Kestrel Voice', applicationCategory: 'Voice AI Platform' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://subodhkc.com/writing' },
    { '@type': 'ListItem', position: 3, name: 'Kestrel Voice AI Receptionist Platform', item: 'https://subodhkc.com/kestrel-voice-ai-receptionist-platform' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}

const strengthIcons = [Settings, Cpu, Layers, Database, CheckCircle2, Gauge]
const adaptiveIcons = [Ban, Zap, Cpu]
const multiChannelIcons = [MessageSquare, Video, MonitorSmartphone]
const securityIcons = [Webhook, Lock, Shield, Gauge, FileText, Building2]
const relatedIcons = [Cpu, AlertTriangle, Phone, Database, Shield, Building2]

export default function KestrelVoiceReceptionistPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="AI Voice Operations"
        title={<>Kestrel Voice: A No-Code AI Receptionist Platform<br /><span className="gradient-text">Built for Real Business Calls</span></>}
        description="Deploy a hosted AI receptionist quickly — then add custom workflows, RAG, guardrails, integrations, testing, and managed support as your needs grow."
      />

      {/* Byline + TOC */}
      <Section className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-muted-foreground mb-1">By Subodh KC · July 16, 2026 · 25 min read</p>
          <p className="text-xs text-muted-foreground mb-4">
            Author's disclosure: I am the founder of Kestrel Voice and HAIEC. Kestrel is the product discussed in this article. I built it after working through the difference between an AI voice demonstration and an operational phone system that a business can actually configure, monitor, and improve.
          </p>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Table of Contents</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
              {tocItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 1: Direct Answer */}
      <Section id="direct-answer" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Direct Answer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most business owners are not looking for an AI voice development platform. They are looking for a practical outcome: answer my calls when I cannot, help the caller, book the appointment, transfer important calls, and show me what happened.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            They do not want to assemble speech recognition, language models, text-to-speech, telephony, WebSockets, databases, vector search, call recordings, and analytics before the first customer can call. At the same time, they should not have to surrender control to a black-box receptionist that gives them little visibility into what instructions were active, where an answer came from, whether an appointment was actually created, why a call was transferred, what happened when an integration failed, how much the call cost, or what should be corrected afterward.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Kestrel is intended to be simple enough for a business to launch without coding, while retaining a path to deeper orchestration, custom integrations, managed deployment, and structured governance.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 2: What Is Kestrel Voice */}
      <Section id="what-is-kestrel" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Is Kestrel Voice?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kestrel Voice is a hosted AI receptionist and voice-operations platform for businesses. A business can configure an agent to answer inbound calls, introduce the business correctly, respond to approved questions, capture leads, check appointment availability, create bookings, route or transfer callers, handle after-hours calls, detect configured urgent scenarios, use business knowledge through RAG, retain recordings and transcripts, summarize calls, and track outcomes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The basic setup is handled through a dashboard rather than through source code. The onboarding flow covers business information, industry templates, voice and greeting selection, business hours, forwarding, services, FAQs, phone setup, and test calling. More complicated deployments — multi-location routing, custom CRMs, regulated workflows, complex scheduling, or consequential actions — can move into a supported customization or managed implementation process.
          </p>
        </div>
      </Section>

      {/* Section 3: Market Position */}
      <Section id="market-position" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Where Kestrel Fits in the Voice-AI Market</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Voice-AI products are not all trying to solve the same problem. A buyer will commonly encounter five approaches. This is a category comparison, not a claim that every platform fits one description.
          </p>
          <DiagramReveal>
            <KestrelMarketPositionDiagram />
          </DiagramReveal>
          <div className="space-y-3">
            {marketApproaches.map((approach, i) => (
              <Card key={approach.title}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{approach.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        <strong className="text-foreground">Strength:</strong> {approach.strength} · <strong className="text-foreground">Buyer:</strong> {approach.buyerResponsibility} · <strong className="text-foreground">Examples:</strong> {approach.examples}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kestrel's differentiation is not one isolated feature. It is the combination: fast business setup, hosted voice infrastructure, custom orchestration, deterministic controls, managed knowledge, verified actions, fallback modes, operational evidence, and supported customization.
          </p>
        </div>
      </Section>

      {/* Section 4: Core Position */}
      <Section id="core-position" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Kestrel's Core Position</h2>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              A hosted AI receptionist that businesses can configure without coding, backed by a customizable orchestration and operations platform when the workflow requires greater control.
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">That position rests on six connected strengths:</p>
          <Grid cols={2} gap="md">
            {sixStrengths.map((strength, i) => {
              const Icon = strengthIcons[i]
              return (
                <Card key={strength.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{strength.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{strength.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Section 5: Business Setup */}
      <Section id="business-setup" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Business Setup Without Voice Engineering</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A business should not have to understand the components of a realtime voice pipeline before testing an AI receptionist. The Kestrel setup experience focuses on questions a business owner already understands:
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {setupQuestions.map((q) => (
              <div key={q} className="flex items-start gap-2 text-xs text-muted-foreground rounded-lg border border-border bg-muted/20 p-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </div>
          <Card className="border-l-4 border-l-primary/40">
            <CardHeader>
              <CardTitle className="text-sm">Example: A local HVAC company</CardTitle>
              <CardDescription className="text-xs mt-1">
                The owner can configure business name, normal business hours, emergency service hours, cities served, common problems handled, transfer number, appointment types, frequently asked questions, and after-hours response. The owner does not need to configure speech providers, manage streaming audio, or host a telephony webhook.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Section 6: Orchestration */}
      <Section id="orchestration" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Custom Python Orchestration Beneath the No-Code Layer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Many voice agents are controlled primarily through prompts and visual automations. Kestrel also has a custom Python runtime that coordinates:
          </p>
          <div className="flex flex-wrap gap-2">
            {orchestrationPaths.map((path) => (
              <span key={path} className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground">{path}</span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The platform includes separate runtime paths for Gather, Realtime, Adaptive, IVR, outbound calls, recordings, transcripts, bookings, meetings, fraud controls, and post-call intelligence. Why does this matter? Because some requirements cannot be solved reliably by adding another sentence to the prompt.
          </p>
          <div className="space-y-2">
            {orchestrationExamples.map((ex) => (
              <div key={ex} className="flex items-start gap-2 text-xs text-muted-foreground rounded-lg border border-border bg-muted/20 p-2.5">
                <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>{ex}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">These are application and orchestration decisions — not merely conversational preferences.</p>
        </div>
      </Section>

      {/* Section 7: Deterministic Controls */}
      <Section id="deterministic-controls" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Deterministic Controls Around Generative AI</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The language model is useful for interpreting natural speech and conducting a fluid conversation. It should not independently control every decision. Kestrel's Adaptive architecture separates call handling into three layers:
          </p>
          <div className="space-y-2">
            {adaptiveLayers.map((layer, i) => {
              const Icon = adaptiveIcons[i]
              return (
                <div key={layer.title} className={`rounded-lg border border-border ${layer.bg} p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${layer.color}`} />
                    <p className="text-sm font-semibold text-foreground">{layer.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{layer.desc}</p>
                </div>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The benefit is not that deterministic logic replaces AI. The benefit is that AI is used where it adds value, rather than being asked to improvise every part of the business process.
          </p>
          <VoiceControlLadder />
        </div>
      </Section>

      {/* Section 8: Knowledge */}
      <Section id="knowledge" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Business Knowledge With More Than a Single Prompt</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A receptionist needs to know more than a business name and greeting. Kestrel can combine several types of knowledge:
          </p>
          <DiagramReveal>
            <KestrelKnowledgeStackDiagram />
          </DiagramReveal>
          <div className="space-y-2">
            {knowledgeLayers.map((layer, i) => (
              <Card key={layer.title}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-sm">{layer.title}</CardTitle>
                      <CardDescription className="text-xs mt-1 leading-relaxed">{layer.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Knowledge Lifecycle</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {knowledgeLifecycle.map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 font-medium text-foreground">{step}</span>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/50" />}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The distinction matters because RAG does not automatically make an answer accurate. If a website contains an outdated service area, the AI can accurately retrieve the wrong information. Kestrel's design therefore treats knowledge as something that must be managed, not simply uploaded once and forgotten.
          </p>
        </div>
      </Section>

      {/* Section 9: Verified Actions */}
      <Section id="verified-actions" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Verified Business Actions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A natural-sounding call is not valuable if the agent does not complete the requested task. Consider an appointment request.
          </p>
          <DiagramReveal>
            <VerifiedActionFlowDiagram />
          </DiagramReveal>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm">Weak Workflow</CardTitle>
                <ul className="space-y-1 mt-2">
                  {weakBookingSteps.map((step) => (
                    <li key={step} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-red-500 flex-shrink-0">✗</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Controlled Workflow</CardTitle>
                <ul className="space-y-1 mt-2">
                  {controlledBookingSteps.map((step, i) => (
                    <li key={step} className="text-xs text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">{i + 1}.</strong> {step}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">{verifiedActionPrinciple}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">This principle applies equally to:</p>
          <div className="flex flex-wrap gap-2">
            {verifiedActionAppliesTo.map((item) => (
              <span key={item} className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground">{item}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 10: Operations Dashboard */}
      <Section id="operations-dashboard" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">An Operations Dashboard, Not Merely a Call Counter</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Businesses need to know more than how many calls the AI answered. A useful voice-operations dashboard should help answer: Who called? What did they need? How was the call handled? Was an appointment created? Did the transfer succeed? Was a fallback used? Which model or mode handled the call? What did the call cost? What should be corrected?
          </p>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Operational Data Model</CardTitle>
              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                {dashboardDataModel.map((field) => (
                  <div key={field} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{field}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The review workflow can also turn a real call into a correction by adding a missing FAQ, an operational note, or a new review item.
          </p>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Improvement Loop</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {improvementLoop.map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 font-medium text-foreground">{step}</span>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/50" />}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">The dashboard is therefore part of the operating system, not merely a reporting feature.</p>
        </div>
      </Section>

      {/* Section 11: Degradation */}
      <Section id="degradation" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Failure and Degraded Modes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Realtime AI connections, calendars, transfers, and business APIs can fail. Kestrel's architecture includes a four-level degradation system and circuit-breaking with a Gather fallback when the realtime path cannot continue.
          </p>
          <div className="space-y-2">
            {degradationLevels.map((item) => (
              <div key={item.level} className="flex items-stretch gap-3">
                <div className={`w-2 rounded-full ${item.color}`} />
                <div className="flex-1 rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-sm font-semibold text-foreground">{item.level}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-2 font-semibold text-foreground">Failure</th>
                  <th className="text-left p-2 font-semibold text-foreground">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fallbackTable.map(([failure, response]) => (
                  <tr key={failure}><td className="p-2 text-muted-foreground">{failure}</td><td className="p-2 text-muted-foreground">{response}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">When one AI component fails, the entire customer journey should not disappear with it.</p>
          </div>
        </div>
      </Section>

      {/* Section 12: Learning Pipeline */}
      <Section id="learning-pipeline" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Learning From Calls</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kestrel Voice learns from call patterns. The learning pipeline promotes recurring fast-path patterns into active fast actions — but with guardrails.
          </p>
          <div className="grid sm:grid-cols-4 gap-3">
            {learningSteps.map((s) => (
              <Card key={s.step}>
                <CardHeader>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary mb-2">{s.step}</div>
                  <CardTitle className="text-sm">{s.title}</CardTitle>
                  <CardDescription className="text-xs mt-1 leading-relaxed">{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card className="border-l-4 border-l-primary/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">Learning Guardrails</CardTitle>
              </div>
              <ul className="space-y-1">
                {learningGuardrails.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Section 13: Multi-Channel */}
      <Section id="multi-channel" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Beyond Voice: SMS, Video, and WebRTC</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Voice is the primary channel, but Kestrel Voice also supports SMS, video sessions, and browser-based calling.</p>
          <Grid cols={3} gap="md">
            {multiChannelFeatures.map((feature, i) => {
              const Icon = multiChannelIcons[i]
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Section 14: Security */}
      <Section id="security" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Security Architecture</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Security in a voice agent platform spans telephony, API, data, and compliance. Kestrel implements defense-in-depth across six domains.</p>
          <Grid cols={2} gap="md">
            {securityDomains.map((domain, i) => {
              const Icon = securityIcons[i]
              return (
                <Card key={domain.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{domain.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{domain.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Section 15: Cost Visibility */}
      <Section id="cost-visibility" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Cost Visibility and Guardrails</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Voice costs can grow through long calls, realtime model usage, repeated tools, multiple call legs, recording, transcription, failed retries, and abuse. Kestrel tracks model and telephony activity at the call level, including turns, tool calls, interruptions, and cancelled responses.
          </p>
          <Card className="border-l-4 border-l-primary/40">
            <CardHeader>
              <CardTitle className="text-sm">Cost Per Verified Outcome</CardTitle>
              <CardDescription className="text-xs mt-1">
                This creates the foundation for measuring a more meaningful business metric: total voice and AI cost divided by verified completed outcomes. Examples include cost per appointment booked, cost per qualified lead, cost per successful transfer, and cost per resolved call. That is more valuable than reporting cost per minute alone.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Section 16: Tenant Config */}
      <Section id="tenant-config" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tenant-Specific Runtime Configuration</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Each business can have its own configuration across every dimension:</p>
          <div className="flex flex-wrap gap-2">
            {tenantConfigItems.map((item) => (
              <span key={item} className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground">{item}</span>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prompt Resolution Hierarchy</CardTitle>
              <div className="mt-2 space-y-1.5">
                {promptHierarchy.map((level, i) => (
                  <div key={level} className="flex items-center gap-2 text-xs text-muted-foreground" style={{ paddingLeft: `${i * 16}px` }}>
                    <div className="w-4 h-4 rounded-full border-2 border-primary/30 flex-shrink-0" />
                    <span>{level}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The prompt-resolution hierarchy also records information about the source and version of the prompt used. This helps diagnose questions such as: Did the correct business prompt load? Did the system use a generic fallback? Which instructions handled this call? Was the wrong business identity inserted?
          </p>
        </div>
      </Section>

      {/* Section 17: Comparison Table */}
      <Section id="comparison-table" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Kestrel Compared With Common Voice-AI Approaches</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">This is a category comparison, not a claim that every platform fits one description.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg">
              <thead className="bg-muted/30">
                <tr>
                  {comparisonTable[0].map((header) => (
                    <th key={header} className="text-left p-2 font-semibold text-foreground">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonTable.slice(1).map((row) => (
                  <tr key={row[0]} className={row[0] === 'Kestrel Voice' ? 'bg-primary/5' : ''}>
                    {row.map((cell, i) => (
                      <td key={i} className={`p-2 ${row[0] === 'Kestrel Voice' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Section 18: Call Scenario */}
      <Section id="call-scenario" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">A Practical Kestrel Call Scenario</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Imagine a homeowner calling an HVAC company at 8:15 p.m.: "The furnace is making a strange noise, and I can smell something burning." A generic voice bot may continue through its normal intake script. A Kestrel deployment can be configured to follow a more controlled path.
          </p>
          <div className="space-y-2">
            {callScenarioSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">{s.step}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The important feature is not that the AI had a dramatic conversation. It is that the system followed a business-defined operational response.
          </p>
        </div>
      </Section>

      {/* Section 19: Three Ways */}
      <Section id="three-ways" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Three Ways to Use Kestrel</h2>
          <DeploymentPathSelector />
        </div>
      </Section>

      {/* Section 20: Kestrel and HAIEC */}
      <Section id="kestrel-haiec" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Kestrel and HAIEC</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kestrel operates the voice workflow. HAIEC supports the assessment and assurance-readiness process surrounding more sensitive deployments. For a compliance-scoped implementation, the two work as a coordinated process.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">HAIEC Helps Assess</CardTitle>
                <ul className="space-y-1 mt-2">
                  {haiecAssesses.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-accent/40">
              <CardHeader>
                <CardTitle className="text-sm">Kestrel Implements</CardTitle>
                <ul className="space-y-1 mt-2">
                  {kestrelImplements.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              HAIEC helps determine what the deployment should control and document. Kestrel operates the configured voice workflow and produces operational evidence. The relationship is not an automatic technical certification or a guarantee of compliance.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 21: Who For */}
      <Section id="who-for" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Who Is Kestrel Best For?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Kestrel is a strong fit for businesses that:</p>
          <div className="space-y-1.5">
            {whoForTraits.map((trait) => (
              <div key={trait} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>{trait}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Examples include:</p>
          <div className="flex flex-wrap gap-2">
            {whoFor.map((item) => (
              <span key={item} className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground">{item}</span>
            ))}
          </div>
          <Card className="border-l-4 border-l-amber-500/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-sm">When Kestrel May Not Be the Right Starting Point</CardTitle>
              </div>
              <ul className="space-y-1.5">
                {whenNot.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-600 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardHeader>
          </Card>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Kestrel's strongest position is between these extremes: a business-ready product that can become more customized and controlled without forcing every customer to begin as a software project.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 22: FAQ */}
      <Section id="faq" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-lg border border-border bg-muted/20 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">{item.q}</summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Related Resources */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related Resources</h2>
          <Grid cols={3} gap="md">
            {relatedResources.map((resource, i) => {
              const Icon = relatedIcons[i]
              return (
                <Link key={resource.href} href={resource.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-sm">{resource.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs leading-relaxed">{resource.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">Read article <ArrowRight className="h-3 w-3" /></span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="AI Receptionist Setup Checklist"
            description="Get a practical checklist covering business configuration, knowledge sources, deterministic rules, verified actions, fallback planning, security controls, testing scenarios, and operational review for deploying an AI receptionist."
            resourceName="AI Receptionist Setup Checklist"
          />
        </div>
      </Section>

      {/* Cross-link */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p>For the complete production architecture behind Kestrel Voice, read <Link href="/ai-voice-agent-architecture" className="text-primary font-medium hover:underline">AI Voice Agent Architecture: How Kestrel Voice Works</Link>. For ten failure modes and a six-phase deployment plan, read <Link href="/why-ai-voice-agents-fail-in-production" className="text-primary font-medium hover:underline">Why AI Voice Agents Fail in Production</Link>. To try the product, visit <Link href="/solutions/kestrelvoice" className="text-primary font-medium hover:underline">Kestrel Voice</Link>.</p>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready to Deploy an AI Receptionist?"
        description="Start with a self-service setup or schedule a managed deployment consultation. Kestrel Voice handles the call. HAIEC handles the assurance."
        primaryButton={{ text: 'Try Kestrel Voice', href: 'https://www.kestrelvoice.com' }}
        secondaryButton={{ text: 'Explore HAIEC', href: '/solutions/haiec' }}
      />
    </>
  )
}
