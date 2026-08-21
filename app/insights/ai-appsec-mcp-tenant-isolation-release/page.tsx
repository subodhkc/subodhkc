import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Shield,
  Terminal,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Github,
  AlertTriangle,
  Receipt,
  FileCode,
  Bug,
  Lock,
  KeyRound,
  FolderLock,
  Server,
  Database,
  Copy,
} from 'lucide-react'
import {
  AI_APPSEC,
  MCP_TENANT_ISOLATION,
  LLMVERIFY,
  FAMILY_NAME,
  FAMILY_DESCRIPTOR,
  FAMILY_SENTENCE,
  AI_APPSEC_SIGNAL_CATEGORIES,
  TENANT_RULE_FAMILIES,
} from '@/data/developer-security'

export const metadata: Metadata = {
  title: 'AI AppSec + MCP Tenant Isolation Release | Subodh KC',
  description:
    'Introducing AI AppSec and MCP Tenant Isolation: MIT-licensed security tools for AI applications, coding agents, MCP servers, and multi-tenant SaaS.',
  keywords: [
    'AI AppSec',
    'MCP tenant isolation',
    'AI application security',
    'AI agent security scanner',
    'AI coding agent security',
    'MCP security scanner',
    'tenant isolation scanner',
    'multi-tenant SaaS security',
    'cross-tenant data leakage',
    'Model Context Protocol security',
    'security tools for AI coding agents',
    'AI developer security',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/insights/ai-appsec-mcp-tenant-isolation-release',
  },
  openGraph: {
    title: 'AI AppSec + MCP Tenant Isolation Release | Subodh KC',
    description:
      'Introducing AI AppSec and MCP Tenant Isolation: MIT-licensed security tools for AI applications, coding agents, MCP servers, and multi-tenant SaaS.',
    url: 'https://subodhkc.com/insights/ai-appsec-mcp-tenant-isolation-release',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI AppSec + MCP Tenant Isolation Release | Subodh KC',
    description:
      'MIT-licensed security tools for AI applications, coding agents, MCP servers, and multi-tenant SaaS.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://subodhkc.com/insights' },
    { '@type': 'ListItem', position: 3, name: 'AI AppSec + MCP Tenant Isolation Release', item: 'https://subodhkc.com/insights/ai-appsec-mcp-tenant-isolation-release' },
  ],
}

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'AI AppSec + MCP Tenant Isolation Release',
  description:
    'Introducing AI AppSec and MCP Tenant Isolation: MIT-licensed security tools for AI applications, coding agents, MCP servers, and multi-tenant SaaS.',
  author: {
    '@type': 'Person',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
  },
  datePublished: '2026-08-21',
  dateModified: '2026-08-21',
  mainEntityOfPage: 'https://subodhkc.com/insights/ai-appsec-mcp-tenant-isolation-release',
  url: 'https://subodhkc.com/insights/ai-appsec-mcp-tenant-isolation-release',
  publisher: {
    '@type': 'Organization',
    name: 'SubodhKC.com',
    url: 'https://subodhkc.com',
  },
}

export default function ReleaseArticlePage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-10 md:mb-16">
          {/* Desktop: 12-column grid with left copy + right family panel */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: 7-8 columns */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                <span>OPEN SOURCE RELEASE · POWERED BY HAIEC</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Security checks your coding agent can call -
                without making the agent its own security reviewer.
              </h1>

              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                I released two MIT-licensed developer-security tools for AI-assisted development.
              </p>

              <p className="text-base text-muted-foreground mb-3 leading-relaxed">
                <strong className="text-foreground">AI AppSec</strong> audits AI application and agent source code.
              </p>

              <p className="text-base text-muted-foreground mb-3 leading-relaxed">
                <strong className="text-foreground">MCP Tenant Isolation</strong> checks whether tenant boundaries
                survive across queries, caches, sessions, files, credentials and MCP tools.
              </p>

              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                Both can run locally and expose focused security checks through MCP.
              </p>

              <p className="font-mono text-sm text-primary mb-2">
                Secure the code. Protect the tenant boundary. Verify the model interaction.
              </p>

              <p className="text-sm text-muted-foreground mb-8">
                LLMVerify is the existing runtime sibling in the same HAIEC developer-security
                family, handling verification around model inputs and outputs.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/products/ai-appsec">
                  <Button size="lg" className="gap-2">
                    Explore AI AppSec
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products/mcp-tenant-isolation">
                  <Button size="lg" variant="outline" className="gap-2">
                    Explore Tenant Isolation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  href="#three-layer-model"
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  See the three-layer developer-security model
                </Link>
              </div>
            </div>

            {/* Right: 4-5 columns - Family architecture panel */}
            <div className="lg:col-span-5">
              <Card className="border-border bg-secondary/20">
                <CardContent className="pt-6">
                  <p className="font-mono text-xs text-muted-foreground mb-4">
                    {FAMILY_NAME.toUpperCase()}
                  </p>

                  {/* Three isolated blocks - NOT a top-to-bottom process */}
                  <div className="space-y-4">
                    <FamilyBlock
                      role="SOURCE"
                      name="AI AppSec"
                      tool="scan_ai_security"
                      href="/products/ai-appsec"
                    />
                    <FamilyBlock
                      role="BOUNDARY"
                      name="MCP Tenant Isolation"
                      tool="scan_tenant_isolation"
                      href="/products/mcp-tenant-isolation"
                    />
                    <FamilyBlock
                      role="RUNTIME"
                      name="llmverify"
                      tool="verify · isInputSafe · redactPII"
                      href="/products/llmverify"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                    Independent tools. Different security questions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Section 1: The coding agent can write the change */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">
            The coding agent can write the change. That does not make it the security authority.
          </h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              AI-assisted development changes who can create code and how quickly that code can change.
              A coding agent can add a model call, introduce a tool, change authorization, create a
              retrieval path, add a dependency, or modify how customer data is queried.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              That makes security checks more useful inside the same workflow. But I did not want the
              answer to be another prompt asking a model whether its own change &quot;looks secure.&quot;
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The approach behind these tools is simpler: use the coding agent to invoke the right check,
              return structured evidence, review the result, fix the code, and run the check again.
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
            <p className="text-base font-medium">
              The agent can reason about the finding. The finding does not have to come from the
              agent&apos;s opinion.
            </p>
          </div>
        </section>

        {/* Section 2: Two releases, two different security boundaries */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-8">Two releases. Two different security boundaries.</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI AppSec Release Card */}
            <ReleaseCard
              status="RELEASED · v0.1.0 · MIT"
              title="AI AppSec"
              tagline={AI_APPSEC.tagline}
              questionLabel="SOURCE SECURITY"
              question="Is this AI application code introducing a security risk?"
              description="AI AppSec analyzes AI/LLM application source code before commit, PR, merge or deployment and returns explicit coverage, structured findings and tamper-evident scan evidence."
              proof={[
                '122 Public Core detectors',
                '79 security checks',
                'COMPLETE / PARTIAL / ERROR',
                'Scan Receipts',
                'Evidence Envelopes',
                'Proof-of-fix',
                'MCP v2',
                'Local scanning',
              ]}
              identity={[
                ['Product', 'AI AppSec'],
                ['Version', 'v0.1.0'],
                ['GitHub', 'subodhkc/ai-appsec'],
                ['npm', 'ai-appsec'],
                ['MCP Registry', 'io.github.subodhkc/ai-appsec'],
                ['CLI', 'ai-appsec'],
                ['MCP tool', 'scan_ai_security'],
                ['License', 'MIT'],
                ['Brand', 'Powered by HAIEC'],
              ]}
              primaryHref="/products/ai-appsec"
              primaryLabel="Explore AI AppSec"
              secondaryHref="https://github.com/subodhkc/ai-appsec"
              secondaryLabel="View GitHub"
              installCommand="npm install -g ai-appsec"
            />

            {/* Tenant Release Card */}
            <ReleaseCard
              status="RELEASED · v2.0.0 · MIT"
              title="MCP Tenant Isolation"
              tagline={MCP_TENANT_ISOLATION.tagline}
              questionLabel="BOUNDARY SECURITY"
              question="Can Tenant A ever become Tenant B?"
              description="Purpose-built static analysis for tenant boundaries across multi-tenant SaaS applications and MCP server code."
              proof={[
                '57 deterministic rules',
                '42 multi-tenant rules',
                '15 MCP-specific rules',
                'COMPLETE / PARTIAL / ERROR',
                'Scan Receipts',
                'Evidence Envelopes',
                'Proof-of-fix',
                'MCP v2',
                'read-only MCP by default',
              ]}
              identity={[
                ['Product', 'MCP Tenant Isolation'],
                ['Version', 'v2.0.0'],
                ['GitHub', 'subodhkc/mcp-tenant-isolation'],
                ['npm', 'mcp-tenant-isolation'],
                ['MCP Registry', 'io.github.subodhkc/mcp-tenant-isolation'],
                ['CLI', 'mti'],
                ['MCP tool', 'scan_tenant_isolation'],
                ['License', 'MIT'],
                ['Brand', 'Powered by HAIEC'],
              ]}
              primaryHref="/products/mcp-tenant-isolation"
              primaryLabel="Explore Tenant Isolation"
              secondaryHref="https://github.com/subodhkc/mcp-tenant-isolation"
              secondaryLabel="View GitHub"
              installCommand="npx mcp-tenant-isolation scan ./src"
            />
          </div>
        </section>

        {/* Section 3: Use the check that matches the risk */}
        <section className="mb-10 md:mb-16" id="three-layer-model">
          <h2 className="text-2xl font-bold mb-6">Use the check that matches the risk.</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The tools are intentionally independent.
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">-</span>
              <span>An AI source-code security question should go to <strong className="text-foreground">AI AppSec</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">-</span>
              <span>A cross-tenant boundary question should go to <strong className="text-foreground">MCP Tenant Isolation</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">-</span>
              <span>A model input/output verification problem belongs to <strong className="text-foreground">LLMVerify</strong>.</span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Running every security engine for every request would make the workflow harder to reason
            about, slower to operate and less clear about what was actually evaluated.
          </p>

          {/* Visual: REQUEST -> What is the question? -> three lanes */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3">
                <div className="font-mono text-sm text-green-400">REQUEST / CHANGE</div>
                <div className="text-zinc-600">|</div>
                <div className="font-mono text-sm text-zinc-300 border border-zinc-700 rounded px-4 py-2">
                  What is the question?
                </div>
                <div className="text-zinc-600">|</div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="text-center">
                    <div className="font-mono text-xs text-zinc-500 mb-1">SOURCE</div>
                    <div className="font-mono text-xs text-green-400">AI AppSec</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-xs text-zinc-500 mb-1">BOUNDARY</div>
                    <div className="font-mono text-xs text-green-400">Tenant Iso.</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-xs text-zinc-500 mb-1">RUNTIME</div>
                    <div className="font-mono text-xs text-green-400">llmverify</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: AI AppSec evidence */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">AI AppSec: evidence matters as much as the finding.</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            A list of warnings is useful. It is more useful when you can also answer:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>What was actually in scope?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>Which supported files were analyzed?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>Which files failed to parse?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>Which checks were evaluated?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>Is the scan complete or partial?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>Can this result be reproduced?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>Did a later rescan confirm the issue was fixed?</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            AI AppSec v0.1.0 makes those questions part of the scan result.
          </p>

          <h3 className="text-lg font-semibold mb-4">Coverage semantics</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-green-500 mb-1">COMPLETE</p>
                <p className="text-sm text-muted-foreground">All supported files in the intended scope were analyzed.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-amber-500 mb-1">PARTIAL</p>
                <p className="text-sm text-muted-foreground">Some intended evidence could not be analyzed. Absence of findings is not treated as proof.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-red-500 mb-1">ERROR</p>
                <p className="text-sm text-muted-foreground">The scan itself could not complete.</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Missing evidence is not a pass.
            </p>
          </div>
        </section>

        {/* Section 5: MCP Tenant Isolation */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">
            MCP Tenant Isolation: tenant boundaries extend far beyond the database.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            A multi-tenant application can filter one SQL query correctly and still leak data somewhere else.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Tenant context can be lost or mixed across:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {[
              'authentication',
              'API routes',
              'queries',
              'cache keys',
              'sessions',
              'file storage',
              'vector stores',
              'credentials',
              'MCP tool visibility',
              'artifacts',
              'background execution',
            ].map((item) => (
              <div key={item} className="font-mono text-xs px-3 py-1.5 rounded border border-border bg-secondary/20">
                {item}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Tenant Isolation is built around that boundary itself.
          </p>

          {/* Visual: tenant boundary flow */}
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2">
                <div className="font-mono text-xs text-green-400">AUTHENTICATED TENANT</div>
                <div className="text-zinc-600">|</div>
                <div className="font-mono text-xs text-zinc-300">API ROUTE</div>
                <div className="text-zinc-600">|</div>
                <div className="font-mono text-xs text-zinc-300">DATABASE / RLS</div>
                <div className="text-zinc-600">|</div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                  <div className="font-mono text-xs text-green-400 text-center">CACHE</div>
                  <div className="font-mono text-xs text-green-400 text-center">FILES</div>
                  <div className="font-mono text-xs text-green-400 text-center">VECTOR</div>
                </div>
                <div className="text-zinc-600">|</div>
                <div className="font-mono text-xs text-zinc-300">MCP TOOL</div>
              </div>
              <p className="text-xs text-zinc-500 text-center mt-4">
                Does tenant context still exist at every relevant boundary?
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: One more layer - LLMVerify */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">One more layer: verify the model interaction.</h2>
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="font-mono text-xs text-muted-foreground mb-2">EXISTING OPEN-SOURCE SIBLING</p>
              <h3 className="text-xl font-bold mb-2">llmverify</h3>
              <p className="text-muted-foreground mb-4">{LLMVERIFY.tagline}</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LLMVerify is the runtime/model-interaction layer in this family. It provides local-first
                checks and utilities around prompt-injection risk, PII redaction, hallucination risk
                signals, JSON quality and runtime health.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-mono text-sm mt-4 mb-4">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Product</span>
                  <span>llmverify</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Version</span>
                  <span>v1.6.1</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">GitHub</span>
                  <span>subodhkc/llmverify-npm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">npm</span>
                  <span>llmverify</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">CLI</span>
                  <span>llmverify</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">License</span>
                  <span>MIT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Brand</span>
                  <span>Powered by HAIEC</span>
                </div>
              </div>

              <Link href="/products/llmverify">
                <Button variant="outline" className="gap-2">
                  Explore LLMVerify
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Family summary */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <p className="font-mono text-xs text-muted-foreground">SOURCE</p>
              <p className="font-semibold text-sm mt-1">AI AppSec</p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <p className="font-mono text-xs text-muted-foreground">BOUNDARY</p>
              <p className="font-semibold text-sm mt-1">MCP Tenant Isolation</p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <p className="font-mono text-xs text-muted-foreground">RUNTIME</p>
              <p className="font-semibold text-sm mt-1">LLMVerify</p>
            </div>
          </div>
        </section>

        {/* Section 7: Developer, CI, or coding agent */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">Developer, CI, or coding agent.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Developer</h3>
                <p className="text-sm text-muted-foreground mb-3">Run the tool directly.</p>
                <div className="space-y-2">
                  <code className="block bg-zinc-900 text-green-400 text-xs font-mono p-2 rounded overflow-x-auto">npm install -g ai-appsec</code>
                  <code className="block bg-zinc-900 text-green-400 text-xs font-mono p-2 rounded overflow-x-auto">npx mcp-tenant-isolation scan ./src</code>
                  <code className="block bg-zinc-900 text-green-400 text-xs font-mono p-2 rounded overflow-x-auto">npm install llmverify</code>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">CI</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Use independently executable checks in build and review workflows.
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Tenant Isolation:</strong> SARIF / GitHub Code Scanning,
                    GitHub Action (<code className="bg-zinc-800 px-1 rounded">uses: subodhkc/mcp-tenant-isolation@v2</code>)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">AI AppSec:</strong> CLI-based scanning with
                    evidence receipts for build and review workflows.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Coding Agent</h3>
                <p className="text-sm text-muted-foreground mb-3">Invoke focused security checks through MCP.</p>
                <div className="space-y-2">
                  <p className="text-xs">
                    <span className="text-muted-foreground">AI AppSec:</span>{' '}
                    <code className="bg-zinc-800 px-1 rounded text-xs">scan_ai_security</code>
                  </p>
                  <p className="text-xs">
                    <span className="text-muted-foreground">Tenant Isolation:</span>{' '}
                    <code className="bg-zinc-800 px-1 rounded text-xs">scan_tenant_isolation</code>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    LLMVerify is a runtime library and CLI, not an MCP server.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 8: What these tools do not replace */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">What these tools do not replace.</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Specialized security checks are not a replacement for a broader application security program.
            These tools are intended to complement controls such as:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {[
              'dependency analysis',
              'secret scanning',
              'general-purpose SAST',
              'runtime security',
              'penetration testing',
              'architecture review',
              'identity / access controls',
              'human security review',
            ].map((item) => (
              <div key={item} className="font-mono text-xs px-3 py-1.5 rounded border border-border bg-secondary/20">
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI AppSec uses a pinned Semgrep 1.173.0 execution engine with a bundled Public Core rulepack,
            then adds HAIEC coverage, evidence, completeness and proof-of-fix semantics around the scan.
            Semgrep is not invented by HAIEC. It is an external execution engine installed separately.
          </p>
        </section>

        {/* Section 9: Why I built them this way */}
        <section className="mb-10 md:mb-16">
          <h2 className="text-2xl font-bold mb-6">Why I built them this way.</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            I spend a lot of time on the question between an AI capability and a production decision:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>What actually ran?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>What was checked?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>What was not checked?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>What evidence exists?</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">-</span>What changed after the fix?</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            That is also how I approach AI architecture and assurance work. These packages are a practical
            expression of that philosophy: narrower security questions, explicit scope, inspectable findings
            and evidence that can be reviewed again later.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/work">
              <Button variant="outline" className="gap-2">
                View my work
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="gap-2">
                Discuss an AI architecture decision
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center border-t border-border pt-12">
          <h2 className="text-2xl font-bold mb-8">Inspect the code. Run the check.</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/ai-appsec">
              <Button size="lg" className="gap-2">
                AI AppSec
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products/mcp-tenant-isolation">
              <Button size="lg" variant="outline" className="gap-2">
                MCP Tenant Isolation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products/llmverify">
              <Button size="lg" variant="ghost" className="gap-2">
                LLMVerify
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Three independent MIT-licensed developer tools. Powered by HAIEC.
          </p>
        </section>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
    </div>
  )
}

function FamilyBlock({ role, name, tool, href }: { role: string; name: string; tool: string; href: string }) {
  return (
    <Link href={href} className="block">
      <div className="border border-border rounded-lg p-3 hover:border-primary/40 transition-colors">
        <p className="font-mono text-xs text-muted-foreground">{role}</p>
        <p className="font-semibold text-sm mt-1">{name}</p>
        <p className="font-mono text-xs text-muted-foreground mt-1">{tool}</p>
      </div>
    </Link>
  )
}

function ReleaseCard({
  status,
  title,
  tagline,
  questionLabel,
  question,
  description,
  proof,
  identity,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  installCommand,
}: {
  status: string
  title: string
  tagline: string
  questionLabel: string
  question: string
  description: string
  proof: string[]
  identity: [string, string][]
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  installCommand: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <p className="font-mono text-xs text-green-500 mb-2">{status}</p>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{tagline}</p>

        <div className="bg-secondary/20 rounded-lg p-4 mb-4">
          <p className="font-mono text-xs text-primary mb-1">{questionLabel}</p>
          <p className="font-semibold text-sm">{question}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <p className="font-mono text-xs text-muted-foreground mb-2">PROOF</p>
        <ul className="space-y-1 mb-4">
          {proof.map((p) => (
            <li key={p} className="text-xs text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        <p className="font-mono text-xs text-muted-foreground mb-2">IDENTITY</p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 font-mono text-xs mb-4">
          {identity.map(([label, value]) => (
            <div key={label} className="flex justify-between py-0.5 border-b border-border/30">
              <span className="text-muted-foreground">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <code className="block bg-zinc-900 text-green-400 text-xs font-mono p-2 rounded mb-4 overflow-x-auto">
          {installCommand}
        </code>

        <div className="flex gap-3">
          <Link href={primaryHref}>
            <Button size="sm" className="gap-2">
              {primaryLabel}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <a href={secondaryHref} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-2">
              {secondaryLabel}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
