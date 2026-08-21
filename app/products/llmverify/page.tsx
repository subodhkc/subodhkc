import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Shield, 
  Zap, 
  Lock, 
  Terminal,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Github,
  Package,
  AlertTriangle,
  Eye,
  FileJson,
  Activity,
  Server,
  Code2,
  Bot
} from 'lucide-react'
import { CopyCommandButton } from '@/components/CopyCommandButton'

export const metadata: Metadata = {
  title: 'LLMVerify: Local LLM Output Verification & Guardrails | Subodh KC',
  description:
    'MIT-licensed local-first LLM verification for prompt injection, PII redaction, hallucination risk signals, JSON repair, and runtime monitoring.',
  keywords: [
    'llmverify',
    'LLM verification',
    'LLM guardrails',
    'prompt injection detection',
    'PII redaction',
    'hallucination risk',
    'LLM output verification',
    'local AI safety',
    'LLM runtime monitoring',
    'open source',
    'Node.js',
    'Subodh KC'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/products/llmverify',
  },
  openGraph: {
    title: 'LLMVerify: Local LLM Output Verification & Guardrails',
    description:
      'MIT-licensed local-first LLM verification for prompt injection, PII redaction, hallucination risk signals, JSON repair, and runtime monitoring.',
    url: 'https://subodhkc.com/products/llmverify',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLMVerify: Local LLM Output Verification & Guardrails',
    description:
      'MIT-licensed local-first LLM verification for prompt injection, PII redaction, hallucination risk signals, JSON repair, and runtime monitoring.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1
  }
}

export default function LLMVerifyPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero - Executive Language First */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            <span>LLMVERIFY · OPEN SOURCE · POWERED BY HAIEC</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Verify model interactions before they reach users.
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Local-first verification and guardrails for LLM inputs and outputs,
            including prompt-injection risk, PII redaction, hallucination risk signals,
            JSON quality and runtime health.
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for teams shipping AI features who need guardrails that work without sending data to third parties.
          </p>

          {/* Proof bar */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            {['v1.6.1', 'MIT', 'Local-first', 'Zero telemetry'].map((item) => (
              <span
                key={item}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/30"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-12 md:mb-20">
          <CopyCommandButton command="npm install llmverify" npmUrl="https://www.npmjs.com/package/llmverify" />
          <a href="https://github.com/subodhkc/llmverify-npm" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              <Github className="h-5 w-5" />
              View on GitHub
            </Button>
          </a>
        </div>

        {/* The Problem - SPIN: Situation */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">The Problem</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              You're shipping AI features. Your LLM outputs need validation before they reach users-prompt injection detection, 
              PII redaction, hallucination risk scoring. The standard options are:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Cloud APIs</strong> that require sending your data to third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Complex ML pipelines</strong> that add latency and infrastructure overhead</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Manual regex</strong> that's brittle and doesn't scale</span>
              </li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most teams end up with a patchwork of solutions-or skip validation entirely and hope nothing goes wrong.
            </p>
          </div>
        </section>

        {/* The Solution - SPIN: Implication + Need-Payoff */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">What llmverify Does</h2>
          <p className="text-lg text-muted-foreground mb-8">
            A single npm package that handles the common LLM safety checks. No cloud dependencies. No ML infrastructure. 
            Just import and use.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Prompt Injection Detection</CardTitle>
                <CardDescription>
                  Pattern-based detection for 9 attack categories including jailbreaks, system prompt exfiltration, 
                  and tool abuse. OWASP LLM Top 10 aligned.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>PII Redaction</CardTitle>
                <CardDescription>
                  25+ patterns including emails, SSNs, credit cards, API keys (AWS, GitHub, Stripe),
                  JWT tokens, and private keys. Regex-based pattern matching with explicit limitations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Hallucination Risk Scoring</CardTitle>
                <CardDescription>
                  Heuristic-based risk indicators that flag overconfident language, fabricated entities, 
                  and contradictions. Returns confidence intervals, not false certainties.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Runtime Health Monitoring</CardTitle>
                <CardDescription>
                  Wrap any LLM client to track latency, token rate, and behavioral drift. 
                  Get alerts when your model degrades before users notice.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileJson className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>JSON Repair & Validation</CardTitle>
                <CardDescription>
                  Auto-fix common JSON formatting errors from LLM outputs. Trailing commas, 
                  unquoted keys, truncated responses-handled automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Model-Agnostic Adapters</CardTitle>
                <CardDescription>
                  Unified interface for OpenAI, Anthropic, Groq, Google AI, DeepSeek, Mistral, Cohere, 
                  and local models. Switch providers without changing application code.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Quick Start - Technical Credibility */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          
          <div className="space-y-6">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                  <Terminal className="h-4 w-4" />
                  <span>Install</span>
                </div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>npm install llmverify</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                  <Code2 className="h-4 w-4" />
                  <span>Basic Usage</span>
                </div>
                <pre className="text-zinc-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
{`import { verify, isInputSafe, redactPII } from 'llmverify';

// Verify AI output safety
const result = await verify({ content: aiOutput });
if (result.risk.level === 'critical') {
  console.log('Block this content');
}

// Check user input for prompt injection
if (!isInputSafe(userInput)) {
  throw new Error('Potential attack detected');
}

// Redact PII before displaying
const { redacted } = redactPII(aiOutput);
console.log(redacted); // "Contact [REDACTED] at [REDACTED]"`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Honest Limitations */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Limitations</h2>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">llmverify uses heuristics, not AI.</strong> It provides guardrails and risk indicators.
                It does not establish ground truth, guarantee the absence of hallucinations, or replace human review
                for high-stakes decisions.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">-</span>
                  <span>Prompt-injection detection is pattern-based. Novel or obfuscated injections can evade detection.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">-</span>
                  <span>PII detection is regex-based. It catches standard formats but misses obfuscated, image-embedded, or encoded PII.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">-</span>
                  <span>Hallucination risk signals are heuristic. They cannot definitively prove hallucinations. Ground-truth verification requires a source document you provide.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">-</span>
                  <span>Every result carries an explicit limitations array stating what was and was not checked.</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This is a guardrail layer, not a replacement for human review on high-stakes decisions.
                If a claim matters, verify it yourself. llmverify narrows the risk surface; it does not eliminate it.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Framework Alignment */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Framework Alignment</h2>
          <p className="text-muted-foreground mb-6">
            llmverify provides technical evaluation and monitoring checks aligned with selected frameworks.
            This is baseline mapping, not certification:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="font-semibold">OWASP LLM Top 10</p>
                <p className="text-sm text-muted-foreground">Security</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="font-semibold">NIST AI RMF</p>
                <p className="text-sm text-muted-foreground">Risk Management</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="font-semibold">EU AI Act</p>
                <p className="text-sm text-muted-foreground">Compliance</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="font-semibold">ISO 42001</p>
                <p className="text-sm text-muted-foreground">AI Management</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Guarantee */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Privacy Guarantee</h2>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    What We Do
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Zero network requests</li>
                    <li>• Zero telemetry</li>
                    <li>• Zero data collection</li>
                    <li>• Open source-verify yourself</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-500" />
                    What We Never Do
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Train on your data</li>
                    <li>• Share with third parties</li>
                    <li>• Track without consent</li>
                    <li>• Phone home for any reason</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6 pt-4 border-t border-green-500/20">
                Run <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">tcpdump</code> while using it-you'll see zero network traffic.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why I Built This */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Why I Built This</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I built AI governance frameworks for large-scale enterprise deployments. I saw what happens
              when teams ship AI features without proper guardrails, and I saw the compliance overhead that comes with
              enterprise-grade solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Most teams do not need a full ML pipeline for basic safety checks. They need something that works out of the box,
              runs locally, and does not require a PhD to configure.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              llmverify is that tool. The limitations section is honest about what it can and cannot do. It covers
              the common case for teams who need to ship safely without overengineering.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Install the Package</h3>
              <p className="text-sm text-muted-foreground">
                Run <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">npm i llmverify</code> in your project. Zero dependencies, zero config required.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Import & Wrap</h3>
              <p className="text-sm text-muted-foreground">
                Import llmverify and pass your LLM output through the verify function. Works with OpenAI, Anthropic, or any LLM provider.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Configure Checks</h3>
              <p className="text-sm text-muted-foreground">
                Enable the checks you need: prompt injection detection, PII redaction, hallucination risk scoring, JSON validation. All run locally.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold mb-2">Monitor Results</h3>
              <p className="text-sm text-muted-foreground">
                Get structured risk scores and flags for every LLM response. Block, log, or alert based on your own thresholds.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Chatbot Safety</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Detect prompt injection attacks in user messages before they reach your LLM. Block jailbreak attempts and keep your chatbot within its intended behavior.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileJson className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">RAG Pipeline Validation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Validate LLM outputs in retrieval-augmented generation pipelines. Check for hallucination risk when the LLM generates answers from your knowledge base.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">AI Agent Guardrails</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add safety checks to autonomous AI agents before they take actions. Verify outputs for PII leaks, prompt injection, and hallucination before executing tool calls.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Customer Support AI Monitoring</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor LLM-powered customer support responses for PII leaks and hallucination risk. Ensure your AI assistant never exposes sensitive customer data or fabricates answers.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Is llmverify an AI model?</h3>
              <p className="text-sm text-muted-foreground">
                No. llmverify is a deterministic rule-based library. It uses pattern matching, regex, and heuristic scoring - not a neural network. This means results are reproducible, fast, and require no GPU or model inference.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Does it send data anywhere?</h3>
              <p className="text-sm text-muted-foreground">
                No. llmverify makes zero network requests. All processing happens in your Node.js process. You can verify this with <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">tcpdump</code> or any network monitor - there is zero telemetry, zero data collection, zero phone-home behavior.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">What LLM providers are supported?</h3>
              <p className="text-sm text-muted-foreground">
                llmverify is provider-agnostic. It works with any LLM output - OpenAI, Anthropic, Google, Mistral, local models via Ollama, or any custom LLM. You pass the output text to llmverify, and it returns structured verification results.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">How accurate is prompt injection detection?</h3>
              <p className="text-sm text-muted-foreground">
                llmverify uses pattern-based detection which catches common injection patterns (ignore previous instructions, role-play attacks, encoding tricks). It is not 100% - novel or sophisticated attacks may evade detection. It covers common attack patterns for teams who need basic guardrails without deploying a separate ML model.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Can I use it in production?</h3>
              <p className="text-sm text-muted-foreground">
                Yes. llmverify is MIT licensed and production-ready. It is used in production by teams shipping AI features. The API is stable and backward-compatible. However, it should be used as one layer in a defense-in-depth strategy, not your only safety measure.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">How does it compare to Langfuse or guardrails AI?</h3>
              <p className="text-sm text-muted-foreground">
                Langfuse is an observability platform that requires a server and database. guardrails AI is a Python library with ML-based validation. llmverify is a zero-dependency npm package that runs locally with deterministic checks. Choose llmverify for lightweight, local-first guardrails. Choose Langfuse for full observability. Choose guardrails AI for ML-based validation in Python.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is llmverify an AI model?',
                  acceptedAnswer: { '@type': 'Answer', text: 'No. llmverify is a deterministic rule-based library. It uses pattern matching, regex, and heuristic scoring - not a neural network. This means results are reproducible, fast, and require no GPU or model inference.' },
                },
                {
                  '@type': 'Question',
                  name: 'Does it send data anywhere?',
                  acceptedAnswer: { '@type': 'Answer', text: 'No. llmverify makes zero network requests. All processing happens in your Node.js process. There is zero telemetry, zero data collection, zero phone-home behavior.' },
                },
                {
                  '@type': 'Question',
                  name: 'What LLM providers are supported?',
                  acceptedAnswer: { '@type': 'Answer', text: 'llmverify is provider-agnostic. It works with any LLM output - OpenAI, Anthropic, Google, Mistral, local models via Ollama, or any custom LLM. You pass the output text to llmverify, and it returns structured verification results.' },
                },
                {
                  '@type': 'Question',
                  name: 'How accurate is prompt injection detection?',
                  acceptedAnswer: { '@type': 'Answer', text: 'llmverify uses pattern-based detection which catches common injection patterns. It is not 100% - novel or sophisticated attacks may evade detection. It covers common attack patterns for teams who need basic guardrails without deploying a separate ML model.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can I use it in production?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. llmverify is MIT licensed and production-ready. It is used in production by teams shipping AI features. The API is stable and backward-compatible. However, it should be used as one layer in a defense-in-depth strategy, not your only safety measure.' },
                },
                {
                  '@type': 'Question',
                  name: 'How does it compare to Langfuse or guardrails AI?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Langfuse is an observability platform that requires a server and database. guardrails AI is a Python library with ML-based validation. llmverify is a zero-dependency npm package that runs locally with deterministic checks. Choose llmverify for lightweight, local-first guardrails.' },
                },
              ],
            }),
          }}
        />

        {/* Family Links */}
        <section className="mb-12 md:mb-20">
          <div className="border-t border-border pt-8">
            <p className="font-mono text-xs text-muted-foreground mb-4">HAIEC DEVELOPER SECURITY</p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/products/ai-appsec" className="block">
                <Card className="hover:border-primary/40 transition-colors h-full">
                  <CardContent className="pt-6">
                    <p className="font-mono text-xs text-muted-foreground mb-1">SOURCE SECURITY</p>
                    <p className="font-semibold">AI AppSec</p>
                    <p className="text-xs text-muted-foreground mt-1">Explore -&gt;</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/products/mcp-tenant-isolation" className="block">
                <Card className="hover:border-primary/40 transition-colors h-full">
                  <CardContent className="pt-6">
                    <p className="font-mono text-xs text-muted-foreground mb-1">BOUNDARY SECURITY</p>
                    <p className="font-semibold">MCP Tenant Isolation</p>
                    <p className="text-xs text-muted-foreground mt-1">Explore -&gt;</p>
                  </CardContent>
                </Card>
              </Link>
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="font-mono text-xs text-primary mb-1">RUNTIME</p>
                  <p className="font-semibold">LLMVerify</p>
                  <p className="text-xs text-muted-foreground mt-1">Current page</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Secure the code. Protect the tenant boundary. Verify the model interaction.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              MIT licensed. Zero config. Works with any LLM provider.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://www.npmjs.com/package/llmverify" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <Package className="h-5 w-5" />
                  Install from npm
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://github.com/subodhkc/llmverify-npm" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <Github className="h-5 w-5" />
                  Read the Docs
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </Card>
        </section>

      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'llmverify',
            description: 'MIT-licensed local-first LLM verification for prompt injection, PII redaction, hallucination risk signals, JSON repair, and runtime monitoring.',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Cross-platform',
            softwareVersion: '1.6.1',
            license: 'https://opensource.org/licenses/MIT',
            codeRepository: 'https://github.com/subodhkc/llmverify-npm',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free and open source (MIT)',
            },
            author: {
              '@type': 'Person',
              name: 'Subodh KC',
              url: 'https://subodhkc.com',
            },
            url: 'https://subodhkc.com/products/llmverify',
            downloadUrl: 'https://www.npmjs.com/package/llmverify',
          }),
        }}
      />
    </div>
  )
}
