import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, ArrowLeft, Eye, Play } from 'lucide-react'
import { HaiecDeckSection } from './haiec-deck-section'
import { FaqSection } from './faq-section'

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

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Centaurus Practice
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Centaurus AI Advisory Practice
          </h1>
          <div className="h-px bg-slate-900 w-full mb-4" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Strategic AI governance, compliance automation, and enterprise AI strategy for organizations deploying AI in regulated environments.
          </p>
        </div>

        {/* Presentation Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Presentation Overview</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            A structured approach to enterprise AI governance covering framework selection, compliance automation,
            risk posture management, and AI strategy alignment. Practical guidance for leaders who need
            actionable governance, not theory.
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
              <li>Status: Client Ready</li>
              <li>Version: Final</li>
            </ul>
          </div>
        </div>

        {/* Section divider */}
        <div className="h-px bg-slate-200 mb-8" />

        {/* Resources */}
        <div className="space-y-8">
          {/* Video Overview */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Video Overview</h2>
            <p className="text-sm text-slate-600 mb-3">
              60-second executive overview of the Centaurus practice and its approach to AI governance.
            </p>
            <a
              href="https://youtube.com/shorts/kBJyxvGFobQ?feature=share"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-700 border border-slate-900">
                <Play className="h-4 w-4" />
                Watch on YouTube
              </Button>
            </a>
          </div>

          {/* Monetize AI */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Monetize AI</h2>
            <p className="text-sm text-slate-600 mb-3">
              Revenue models, pricing strategy, and go-to-market approaches for AI products and services.
            </p>
            <a
              href="https://docs.google.com/presentation/d/1VKLxITPtv-B5opdCGq0z7JIpdHGO1kcu/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-700 border border-slate-900">
                <Eye className="h-4 w-4" />
                View on Google Slides
              </Button>
            </a>
          </div>

          {/* Centaurus Deck */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Centaurus AI Advisory Practice</h2>
            <p className="text-sm text-slate-600 mb-3">
              Full presentation. Download the PowerPoint or view in Google Slides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/Doc/Centaurus_AI_Advisory_Practice_Client_Ready_Final.pptx"
                download="Centaurus_AI_Advisory_Practice_Client_Ready_Final.pptx"
              >
                <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-700 border border-slate-900">
                  <Download className="h-4 w-4" />
                  Download PowerPoint
                </Button>
              </a>
              <a
                href="https://docs.google.com/presentation/d/1roy5Jh3VLVa6UoZ_zHD9wWxoHfdrILkM/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-700 border border-slate-900">
                  <Eye className="h-4 w-4" />
                  View on Google Slides
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* HAIEC Technical Deck */}
        <div className="mt-10">
          <HaiecDeckSection />
        </div>

        {/* HAIEC Brief: The Engine Behind the Practice */}
        <div className="mt-10 border border-slate-200 p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            The Engine
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            HAIEC
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Holistic AI Integrity &amp; Evidence Compliance Platform
            <span className="ml-2 text-xs text-slate-400">(Patent Pending)</span>
          </p>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            HAIEC is the deterministic engine that powers the Centaurus practice. It solves a fundamental
            problem in AI assurance: relying on AI to evaluate another AI system is circular. Instead, HAIEC
            uses deterministic, Python-based testing with predefined rules, measurable checks, and reproducible
            results. The same evidence produces the same verdict every time.
          </p>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 mb-6">
            <div className="bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">Scan</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic static analysis of AI applications, agents, RAG pipelines, and integrations.
                Identifies prompt injection paths, unsafe tool access, RAG poisoning, missing authentication,
                tenant isolation failures, and data leakage.
              </p>
            </div>
            <div className="bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">Attack</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorized adversarial testing against live AI endpoints. Tests for jailbreaks, system prompt
                extraction, instruction override, data exfiltration, tool forcing, goal hijacking, and
                multi-turn attack sequences.
              </p>
            </div>
            <div className="bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">Prove</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every finding connects to reproducible test evidence. Tamper-evident audit trails, signed
                evidence packages, and traceable results showing what was tested, what passed, what failed,
                and what must be fixed.
              </p>
            </div>
          </div>

          {/* Key differentiators */}
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Core Differentiators
            </div>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li>No AI testing AI. Deterministic, reproducible assessments.</li>
              <li>Evidence tied to specific technical findings, not subjective judgment.</li>
              <li>Static source-code analysis and runtime adversarial testing in one platform.</li>
              <li>Signed, timestamped evidence artifacts with regulatory and control-framework mapping.</li>
              <li>Compliance built into the evidence layer, not bolted on after the fact.</li>
            </ul>
          </div>

          {/* Framework coverage */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Supported Frameworks
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              OWASP LLM Top 10 · NIST AI RMF 1.0 · SOC 2 · ISO 27001:2022 · ISO 42001:2023 ·
              EU AI Act · GDPR · HIPAA · NYC Local Law 144 · Colorado AI Act
            </p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection />

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
