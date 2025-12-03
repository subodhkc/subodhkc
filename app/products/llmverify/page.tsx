import { Metadata } from 'next'
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
  Code2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'llmverify - Open Source LLM Output Verification for Node.js',
  description: 'Local-first LLM output monitoring, risk scoring, and classification. Prompt injection detection, PII redaction, hallucination scoring. Zero telemetry, 100% local processing.',
  keywords: ['llmverify', 'LLM guardrails', 'AI safety', 'prompt injection detection', 'PII redaction', 'hallucination detection', 'Node.js', 'npm package'],
}

export default function LLMVerifyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero - Executive Language First */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            <span>Open Source NPM Package</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            llmverify
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Local-first LLM output monitoring, risk scoring, and classification for Node.js.
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for teams shipping AI features who need guardrails that work without sending data to third parties.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-500" />
            <span>100% Local Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Zero Telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>360 Tests Passing</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-green-500" />
            <span>TypeScript Ready</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <a href="https://www.npmjs.com/package/llmverify" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              <Package className="h-5 w-5" />
              npm install llmverify
            </Button>
          </a>
          <a href="https://github.com/subodhkc/llmverify-npm" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              <Github className="h-5 w-5" />
              View on GitHub
            </Button>
          </a>
        </div>

        {/* The Problem - SPIN: Situation */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">The Problem</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              You're shipping AI features. Your LLM outputs need validation before they reach users—prompt injection detection, 
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
              Most teams end up with a patchwork of solutions—or skip validation entirely and hope for the best.
            </p>
          </div>
        </section>

        {/* The Solution - SPIN: Implication + Need-Payoff */}
        <section className="mb-20">
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
                  JWT tokens, and private keys. Regex-based, ~90% accuracy.
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
                  unquoted keys, truncated responses—handled automatically.
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
        <section className="mb-20">
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

        {/* Honest Limitations - Reddit-Proof */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Limitations</h2>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">llmverify uses heuristics, not AI.</strong> It provides risk indicators, not ground truth.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">70-85%</span>
                  <span>Prompt injection detection accuracy (pattern matching)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">~90%</span>
                  <span>PII detection accuracy (regex patterns)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">~60%</span>
                  <span>Harmful content detection accuracy (keyword matching)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                All results include confidence intervals, methodology explanations, and explicit limitations. 
                This is a guardrail layer, not a replacement for human review on high-stakes decisions.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Compliance Alignment */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Compliance Alignment</h2>
          <p className="text-muted-foreground mb-6">
            Built on the CSM6 framework implementing baseline checks for:
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
        <section className="mb-20">
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
                    <li>• Open source—verify yourself</li>
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
                Run <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">tcpdump</code> while using it—you'll see zero network traffic.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why I Built This */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Why I Built This</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I've spent years building AI governance frameworks for large-scale enterprise deployments. I've seen what happens 
              when teams ship AI features without proper guardrails—and I've seen the compliance overhead that comes with 
              enterprise-grade solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Most teams don't need a full ML pipeline for basic safety checks. They need something that works out of the box, 
              runs locally, and doesn't require a PhD to configure.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              llmverify is that tool. It's not perfect—the limitations section is honest about that—but it covers 
              the 80% case for teams who need to ship safely without overengineering.
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
    </div>
  )
}
