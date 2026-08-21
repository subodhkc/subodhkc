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
  Package,
  AlertTriangle,
  Lock,
  Database,
  KeyRound,
  FolderLock,
  Server,
} from 'lucide-react'
import { CopyCommandButton } from '@/components/CopyCommandButton'
import {
  MCP_TENANT_ISOLATION,
  TENANT_RULE_FAMILIES,
  TENANT_MCP_TOOLS,
  TENANT_MCP_RULES_COUNT,
} from '@/data/developer-security'

export const metadata: Metadata = {
  title: 'MCP Tenant Isolation Scanner for Multi-Tenant SaaS | Subodh KC',
  description:
    '57 deterministic rules for tenant isolation, IDOR, RLS, caches, storage, and MCP boundaries. MIT licensed, local, CI-ready, and MCP v2 compatible.',
  keywords: [
    'MCP tenant isolation',
    'tenant isolation scanner',
    'multi-tenant SaaS security',
    'cross-tenant data leakage',
    'MCP server security',
    'MCP security scanner',
    'IDOR multi-tenant',
    'RLS security',
    'tenant data isolation',
    'Model Context Protocol security',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/products/mcp-tenant-isolation',
  },
  openGraph: {
    title: 'MCP Tenant Isolation Scanner for Multi-Tenant SaaS | Subodh KC',
    description:
      '57 deterministic rules for tenant isolation, IDOR, RLS, caches, storage, and MCP boundaries. MIT licensed, local, CI-ready, and MCP v2 compatible.',
    url: 'https://subodhkc.com/products/mcp-tenant-isolation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Tenant Isolation Scanner for Multi-Tenant SaaS',
    description:
      '57 deterministic rules for tenant isolation, IDOR, RLS, caches, storage, and MCP boundaries. MIT licensed, CI-ready.',
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
    { '@type': 'ListItem', position: 2, name: 'Open Source & Systems', item: 'https://subodhkc.com/products' },
    { '@type': 'ListItem', position: 3, name: 'MCP Tenant Isolation', item: 'https://subodhkc.com/products/mcp-tenant-isolation' },
  ],
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MCP Tenant Isolation',
  description:
    'Static analysis scanner for multi-tenant SaaS and MCP server code. 57 deterministic rules for tenant isolation, IDOR, RLS, caches, storage, and MCP boundaries. MIT licensed, local, CI-ready, and MCP v2 compatible.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  softwareVersion: '2.0.0',
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/subodhkc/mcp-tenant-isolation',
  downloadUrl: 'https://www.npmjs.com/package/mcp-tenant-isolation',
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
  url: 'https://subodhkc.com/products/mcp-tenant-isolation',
}

const scanPipeline = [
  'SOURCE',
  'TS / JS / PRISMA / SQL PARSERS',
  'INTERMEDIATE REPRESENTATION',
  'SOURCES · SINKS · GUARDS · ROUTES · MCP TOOLS',
  'FLOW-AWARE ANALYSIS',
  '57 DETERMINISTIC RULES',
  'FALSE-POSITIVE FILTERING',
  'SUPPRESSION / BASELINE',
  'FINDINGS + COVERAGE + RECEIPT',
]

const tenantBoundaryFlow = [
  'AUTHENTICATED TENANT',
  'API ROUTE',
  'DATABASE / RLS',
  'CACHE · FILES · VECTOR',
  'MCP TOOL',
]

export default function MCPTenantIsolationPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>MCP TENANT ISOLATION · OPEN SOURCE · POWERED BY HAIEC</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Catch cross-tenant leaks before production.
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mb-4">
            57 deterministic rules for tenant boundaries across multi-tenant SaaS and MCP server code.
          </p>

          {/* Proof bar */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['v2.0.0', '57 rules', '15 MCP-specific', 'MIT', 'MCP v2', 'Local / stdio', 'CI-ready'].map((item) => (
              <span
                key={item}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/30"
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-8">
            <CopyCommandButton command="npx mcp-tenant-isolation scan ./src" npmUrl="https://www.npmjs.com/package/mcp-tenant-isolation" />
            <a href="https://github.com/subodhkc/mcp-tenant-isolation" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-5 w-5" />
                View GitHub
              </Button>
            </a>
            <a href="#mcp-setup">
              <Button size="lg" variant="ghost" className="gap-2">
                MCP setup
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Section 1: One security invariant */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">One security invariant</h2>
          <div className="bg-secondary/20 rounded-xl p-6 md:p-8 border border-border">
            <p className="text-2xl font-semibold mb-4">
              Tenant A should not become Tenant B.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A tenant boundary can fail even when authentication itself succeeds. The application still
              needs to preserve tenant context through data access, cache state, storage, sessions and
              every tool that can act on tenant data.
            </p>
          </div>
        </section>

        {/* Section 2: What the 57 rules cover */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">What the 57 rules cover</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TENANT_RULE_FAMILIES.map((family) => (
              <Card key={family.prefix}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{family.prefix}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded border border-border">
                      {family.count}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{family.category}</p>
                  <p className="text-xs text-muted-foreground mt-1">{family.severity}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* MCP-specific highlighted card */}
          <Card className="mt-4 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <span className="font-semibold">MCP Security</span>
                </div>
                <span className="font-mono text-sm px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">
                  {TENANT_MCP_RULES_COUNT} specialized MCP rules
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Tool visibility scoping, tenant-prefixed cache keys, session binding to user + tenant,
                token exchange, per-tenant rate limiting, vector-store namespaces, credential vault
                scoping, shared service accounts, session cleanup, telemetry tenant identity, local
                binding, filesystem tenant roots, artifact isolation, dynamic tool namespace checks.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: MCP introduced more tenant boundaries */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">MCP introduced more tenant boundaries.</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {[
              'Tool visibility',
              'Cache keys',
              'Session identity',
              'Credentials',
              'Rate limits',
              'Vector stores',
              'Filesystem roots',
              'Artifact storage',
              'Tool namespaces',
            ].map((item) => (
              <div key={item} className="font-mono text-sm px-4 py-2 rounded border border-border bg-secondary/20">
                {item}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The tenant boundary now extends into the tools an agent can discover and invoke, the
            credentials those tools use, and the shared infrastructure behind them.
          </p>
        </section>

        {/* Section 4: How the scanner works */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">How the scanner works</h2>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                <Terminal className="h-4 w-4" />
                <span>Scan pipeline</span>
              </div>
              <div className="space-y-1">
                {scanPipeline.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-zinc-600 font-mono text-xs w-6">{i + 1}</span>
                    <span className="text-green-400 font-mono text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            This is static analysis with flow-aware guard detection, not formal verification or
            complete taint proof. The scanner produces deterministic findings: given the same source
            code, it produces the same results.
          </p>
        </section>

        {/* Section 5: The v2 evidence contract */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">The v2 evidence contract</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">COMPLETENESS</p>
                <p className="text-sm text-muted-foreground">COMPLETE / PARTIAL / ERROR</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">COVERAGE</p>
                <p className="text-sm text-muted-foreground">Files and rules analyzed, failures accounted for</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">CONCERN FAMILIES</p>
                <p className="text-sm text-muted-foreground">8 higher-level triage groups</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">LIMITATIONS</p>
                <p className="text-sm text-muted-foreground">Explicit scope of what static analysis could not verify</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">SCAN RECEIPT</p>
                <p className="text-sm text-muted-foreground">Engine, rulepack, and provenance digest</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">EVIDENCE ENVELOPE</p>
                <p className="text-sm text-muted-foreground">Tamper-evident execution context</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">SEMANTIC FINGERPRINT</p>
                <p className="text-sm text-muted-foreground">Stable across line movement and format changes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">PROOF-OF-FIX</p>
                <p className="text-sm text-muted-foreground">STILL_PRESENT / NEW / NOT_VERIFIABLE</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: Safer MCP defaults in v2 */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Safer MCP defaults in v2</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle className="text-lg">Read Only by Default</CardTitle>
                <CardDescription>
                  Scan, list, and explain are available without write capability.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <KeyRound className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-lg">Write Tool Opt-In</CardTitle>
                <CardDescription>
                  Suppression tool appears only when explicitly enabled with --allow-write-tools.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FolderLock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Project-Root Confinement</CardTitle>
                <CardDescription>
                  MCP filesystem operations remain within the configured project root. Traversal
                  prevention, absolute-path outside-root prevention, UNC path protection, and symlink
                  escape protection.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Stdio Only</CardTitle>
                <CardDescription>
                  No hosted or network MCP server required. Legacy SSE transport removed in v2.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This keeps the MCP interface local and narrows the agent&apos;s filesystem authority.
          </p>
        </section>

        {/* Section 7: Use it in CI */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Use it in CI</h2>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                <Terminal className="h-4 w-4" />
                <span>GitHub Action</span>
              </div>
              <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
{`uses: subodhkc/mcp-tenant-isolation@v2`}
              </pre>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">SARIF</p>
                <p className="text-sm text-muted-foreground">SARIF 2.1.0 output for GitHub Code Scanning integration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-primary mb-1">OUTPUT FORMATS</p>
                <p className="text-sm text-muted-foreground">Terminal, JSON, SARIF, AI-oriented JSON, Markdown</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 8: Use it through MCP */}
        <section className="mb-12 md:mb-20" id="mcp-setup">
          <h2 className="text-2xl font-bold mb-6">Use it through MCP</h2>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                <Terminal className="h-4 w-4" />
                <span>MCP configuration</span>
              </div>
              <pre className="text-zinc-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
{`{
  "mcpServers": {
    "tenant-isolation": {
      "command": "npx",
      "args": ["-y", "mcp-tenant-isolation", "mcp"]
    }
  }
}`}
              </pre>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-mono text-xs text-muted-foreground">Tool</th>
                  <th className="text-left py-2 font-mono text-xs text-muted-foreground">Description</th>
                  <th className="text-left py-2 font-mono text-xs text-muted-foreground">Write</th>
                </tr>
              </thead>
              <tbody>
                {TENANT_MCP_TOOLS.map((tool) => (
                  <tr key={tool.name} className="border-b border-border/50">
                    <td className="py-2 font-mono text-xs whitespace-nowrap">{tool.name}</td>
                    <td className="py-2 text-muted-foreground text-xs">{tool.description}</td>
                    <td className="py-2">
                      {tool.write ? (
                        <span className="font-mono text-xs text-amber-500">opt-in</span>
                      ) : (
                        <span className="font-mono text-xs text-green-500">no</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 9: Limitations */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Limitations</h2>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {MCP_TENANT_ISOLATION.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-3">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">-</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Cross links */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <Link href="/products/ai-appsec" className="block">
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Need AI application code security?</p>
                  <p className="font-medium flex items-center gap-2">
                    AI AppSec <ArrowRight className="h-4 w-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products/llmverify" className="block">
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Need runtime/model interaction guardrails?</p>
                  <p className="font-medium flex items-center gap-2">
                    LLMVerify <ArrowRight className="h-4 w-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Technical Identity Panel */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Technical identity</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-sm">
                <IdentityRow label="Product" value="MCP Tenant Isolation" />
                <IdentityRow label="Version" value="v2.0.0" />
                <IdentityRow label="GitHub" value="subodhkc/mcp-tenant-isolation" link="https://github.com/subodhkc/mcp-tenant-isolation" />
                <IdentityRow label="npm" value="mcp-tenant-isolation" link="https://www.npmjs.com/package/mcp-tenant-isolation" />
                <IdentityRow label="MCP Registry" value="io.github.subodhkc/mcp-tenant-isolation" />
                <IdentityRow label="CLI" value="mti" />
                <IdentityRow label="MCP tool" value="scan_tenant_isolation" />
                <IdentityRow label="License" value="MIT" />
                <IdentityRow label="Node" value=">=22" />
                <IdentityRow label="MCP" value="v2 (stdio only)" />
                <IdentityRow label="Brand" value="Powered by HAIEC" link="https://www.haiec.com" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Family links */}
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
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="font-mono text-xs text-primary mb-1">BOUNDARY SECURITY</p>
                  <p className="font-semibold">MCP Tenant Isolation</p>
                  <p className="text-xs text-muted-foreground mt-1">Current page</p>
                </CardContent>
              </Card>
              <Link href="/products/llmverify" className="block">
                <Card className="hover:border-primary/40 transition-colors h-full">
                  <CardContent className="pt-6">
                    <p className="font-mono text-xs text-muted-foreground mb-1">RUNTIME</p>
                    <p className="font-semibold">LLMVerify</p>
                    <p className="text-xs text-muted-foreground mt-1">Explore -&gt;</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Secure the code. Protect the tenant boundary. Verify the model interaction.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <CopyCommandButton command="npx mcp-tenant-isolation scan ./src" npmUrl="https://www.npmjs.com/package/mcp-tenant-isolation" />
            <a href="https://github.com/subodhkc/mcp-tenant-isolation" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-5 w-5" />
                View on GitHub
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/insights/ai-appsec-mcp-tenant-isolation-release">
              <Button size="lg" variant="ghost" className="gap-2">
                Read the release article
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            MIT licensed. Powered by HAIEC. Free package, no HAIEC account required.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </div>
  )
}

function IdentityRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
          {value}
        </a>
      ) : (
        <span className="text-foreground">{value}</span>
      )}
    </div>
  )
}
