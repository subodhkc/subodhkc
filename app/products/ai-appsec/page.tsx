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
  FileCode,
  ScanLine,
  Receipt,
  Lock,
  Bug,
} from 'lucide-react'
import { CopyCommandButton } from '@/components/CopyCommandButton'
import { AI_APPSEC, AI_APPSEC_SIGNAL_CATEGORIES, AI_APPSEC_COVERAGE_SEMANTICS } from '@/data/developer-security'

export const metadata: Metadata = {
  title: 'AI AppSec Scanner for AI Applications & Agents | Subodh KC',
  description:
    'AI AppSec is an MIT-licensed security scanner for AI/LLM application code with 122 detectors, 79 security checks, coverage receipts, proof-of-fix, and MCP integration.',
  keywords: [
    'AI AppSec',
    'AI application security scanner',
    'AI agent security scanner',
    'AI code security',
    'LLM application security',
    'AI coding agent security',
    'MCP security tool',
    'AI security static analysis',
    'evidence-backed AppSec',
    'scan receipts',
    'proof-of-fix',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/products/ai-appsec',
  },
  openGraph: {
    title: 'AI AppSec Scanner for AI Applications & Agents | Subodh KC',
    description:
      'AI AppSec is an MIT-licensed security scanner for AI/LLM application code with 122 detectors, 79 security checks, coverage receipts, proof-of-fix, and MCP integration.',
    url: 'https://subodhkc.com/products/ai-appsec',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI AppSec Scanner for AI Applications & Agents',
    description:
      'MIT-licensed security scanner for AI/LLM application code. 122 detectors, 79 security checks, coverage receipts, proof-of-fix.',
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
    { '@type': 'ListItem', position: 3, name: 'AI AppSec', item: 'https://subodhkc.com/products/ai-appsec' },
  ],
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI AppSec',
  description:
    'Evidence-backed AppSec for AI applications and agents. MIT-licensed security scanner for AI/LLM application code with 122 detectors, 79 security checks, coverage receipts, proof-of-fix, and MCP integration.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  softwareVersion: '0.1.0',
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/subodhkc/ai-appsec',
  downloadUrl: 'https://www.npmjs.com/package/ai-appsec',
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
  url: 'https://subodhkc.com/products/ai-appsec',
}

const scanArchitecture = [
  'TARGET',
  'SCOPE + FILE DISCOVERY',
  'SUPPORTED FILE ACCOUNTING',
  'SEMGREP 1.173.0 + BUNDLED PUBLIC CORE',
  '122 DETECTORS',
  '79 SECURITY CHECKS',
  'FINDING INSTANCES',
  'CONCERN FAMILIES',
  'COMPLETE / PARTIAL / ERROR',
  'SCAN RECEIPT + EVIDENCE ENVELOPE',
  'PROOF-OF-FIX RESCAN',
]

export default function AIAppSecPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>AI APPSEC · OPEN SOURCE · POWERED BY HAIEC</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Evidence-backed AppSec for AI applications and agents.
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mb-4">
            Audit AI/LLM application code before commit, PR, merge or deployment.
          </p>

          <p className="text-lg text-muted-foreground max-w-3xl">
            AI AppSec combines a pinned static-analysis engine with explicit coverage, structured findings,
            scan receipts and proof-of-fix so the result says both what was found and what was actually checked.
          </p>

          {/* Proof bar */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['v0.1.0', 'MIT', '122 detectors', '79 security checks', 'MCP v2', 'Local scanning'].map((item) => (
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
            <CopyCommandButton command="npm install -g ai-appsec" npmUrl="https://www.npmjs.com/package/ai-appsec" />
            <a href="https://github.com/subodhkc/ai-appsec" target="_blank" rel="noopener noreferrer">
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

        {/* Section 1: The question it answers */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">The question it answers</h2>
          <div className="bg-secondary/20 rounded-xl p-6 md:p-8 border border-border">
            <p className="text-2xl font-semibold mb-4">
              Is this AI application code introducing a security risk?
            </p>
            <p className="text-muted-foreground leading-relaxed">
              AI AppSec is intentionally focused on AI/LLM application source security. It checks for security
              signals across the code developers are shipping, rather than attempting to provide complete
              assurance for the entire AI system.
            </p>
          </div>
        </section>

        {/* Section 2: What v0.1.0 checks */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">What v0.1.0 checks</h2>
          <p className="text-muted-foreground mb-6">
            AI AppSec checks for security risks and signals including:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_APPSEC_SIGNAL_CATEGORIES.map((category) => (
              <Card key={category}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-sm">{category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            These are security signals, not guarantees of detection. Finding kinds include PRESENCE,
            RISK_SIGNAL, CONTROL_GAP, and VULNERABILITY with severities from CRITICAL to INFO.
          </p>
        </section>

        {/* Section 3: How the scan works */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">How the scan works</h2>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                <ScanLine className="h-4 w-4" />
                <span>Scan pipeline</span>
              </div>
              <div className="space-y-1">
                {scanArchitecture.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-zinc-600 font-mono text-xs w-6">{i + 1}</span>
                    <span className="text-green-400 font-mono text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            AI AppSec uses a pinned Semgrep 1.173.0 execution engine with a bundled Public Core rulepack.
            The package adds AI-focused security checks, explicit coverage accounting, evidence semantics,
            scan receipts, proof-of-fix and the MCP interface around that execution. Semgrep is an external
            engine installed separately. AI AppSec does not claim to have invented Semgrep.
          </p>
        </section>

        {/* Section 4: The scan reports what it did not prove */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">The scan reports what it did not prove.</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle className="text-lg">COMPLETE</CardTitle>
                <CardDescription>
                  All supported files in the intended scope were analyzed.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-lg">PARTIAL</CardTitle>
                <CardDescription>
                  Some intended evidence could not be analyzed. Absence of findings is not treated as proof.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle className="text-lg">ERROR</CardTitle>
                <CardDescription>
                  The scan itself could not complete.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Missing evidence is not a pass. A PARTIAL scan cannot establish absence of findings.
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Coverage accounting includes:</p>
            <div className="flex flex-wrap gap-2">
              {AI_APPSEC_COVERAGE_SEMANTICS.map((sem) => (
                <span key={sem} className="font-mono text-xs px-2.5 py-1 rounded border border-border bg-secondary/30">
                  {sem}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Evidence, not just output */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Evidence, not just output.</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Scan Receipt</CardTitle>
                <CardDescription>
                  Tamper-evident digest tying together the finding and coverage result. SHA-256 digests
                  for finding set, concern family set, coverage file sets, and evaluated checks.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileCode className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Evidence Envelope</CardTitle>
                <CardDescription>
                  Binds receipt information to execution and target context, including producer identity,
                  target identity, execution status, and envelope digest.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Bug className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Semantic Security Checks</CardTitle>
                <CardDescription>
                  Higher-level grouping of findings into concern families without pretending every group
                  is one root cause. Underlying finding instances remain auditable.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Proof-of-Fix</CardTitle>
                <CardDescription>
                  Compare a rescan against prior evidence without requiring unrelated code to remain
                  identical. Verifies that a specific security check's findings were resolved.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Section 6: Use it with an AI coding agent */}
        <section className="mb-12 md:mb-20" id="mcp-setup">
          <h2 className="text-2xl font-bold mb-6">Use it with an AI coding agent.</h2>
          <p className="text-muted-foreground mb-6">
            AI AppSec exposes a focused security check through MCP. The coding agent can request a scan,
            inspect findings, explain findings, help change code, and rescan. The independently executable
            scanner determines the structured findings.
          </p>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                <Terminal className="h-4 w-4" />
                <span>MCP configuration</span>
              </div>
              <pre className="text-zinc-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
{`{
  "mcpServers": {
    "ai-appsec": {
      "command": "npx",
      "args": ["ai-appsec"]
    }
  }
}`}
              </pre>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-medium text-foreground">Primary MCP tool:</span>{' '}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">scan_ai_security</code>
            </p>
            <p className="text-sm text-muted-foreground">Natural language examples your agent can handle:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>&quot;Audit this AI agent before I push.&quot;</li>
              <li>&quot;Review this change for security problems.&quot;</li>
              <li>&quot;Check this AI application before merge.&quot;</li>
              <li>&quot;Run a security scan on this code.&quot;</li>
            </ul>
          </div>
        </section>

        {/* Section 7: Install and setup */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Install and setup</h2>
          <div className="space-y-4">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                  <Package className="h-4 w-4" />
                  <span>Install globally</span>
                </div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>npm install -g ai-appsec</code>
                </pre>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                  <Terminal className="h-4 w-4" />
                  <span>Check prerequisites</span>
                </div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>ai-appsec doctor</code>
                </pre>
                <p className="text-zinc-500 text-xs mt-2">Checks prerequisite status (Semgrep availability).</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                  <Terminal className="h-4 w-4" />
                  <span>Install Semgrep engine</span>
                </div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>ai-appsec setup</code>
                </pre>
                <p className="text-zinc-500 text-xs mt-2">
                  Installs and configures the required Semgrep engine. May require network access.
                  Normal scans operate locally after prerequisites are installed.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Semgrep is NOT bundled with this package. It is an external engine installed separately.
            See THIRD_PARTY_NOTICES.md in the repository for details.
          </p>
        </section>

        {/* Section 8: Limitations */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl font-bold mb-6">Limitations</h2>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {AI_APPSEC.limitations.map((limitation) => (
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
            <Link href="/products/mcp-tenant-isolation" className="block">
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Need tenant boundaries?</p>
                  <p className="font-medium flex items-center gap-2">
                    MCP Tenant Isolation <ArrowRight className="h-4 w-4" />
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
                <IdentityRow label="Product" value="AI AppSec" />
                <IdentityRow label="Version" value="v0.1.0" />
                <IdentityRow label="GitHub" value="subodhkc/ai-appsec" link="https://github.com/subodhkc/ai-appsec" />
                <IdentityRow label="npm" value="ai-appsec" link="https://www.npmjs.com/package/ai-appsec" />
                <IdentityRow label="MCP Registry" value="io.github.subodhkc/ai-appsec" />
                <IdentityRow label="CLI" value="ai-appsec" />
                <IdentityRow label="MCP tool" value="scan_ai_security" />
                <IdentityRow label="License" value="MIT" />
                <IdentityRow label="Node" value=">=22" />
                <IdentityRow label="MCP" value="v2 server (stdio)" />
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
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="font-mono text-xs text-primary mb-1">SOURCE SECURITY</p>
                  <p className="font-semibold">AI AppSec</p>
                  <p className="text-xs text-muted-foreground mt-1">Current page</p>
                </CardContent>
              </Card>
              <Link href="/products/mcp-tenant-isolation" className="block">
                <Card className="hover:border-primary/40 transition-colors h-full">
                  <CardContent className="pt-6">
                    <p className="font-mono text-xs text-muted-foreground mb-1">BOUNDARY SECURITY</p>
                    <p className="font-semibold">MCP Tenant Isolation</p>
                    <p className="text-xs text-muted-foreground mt-1">Explore -&gt;</p>
                  </CardContent>
                </Card>
              </Link>
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
            <CopyCommandButton command="npm install -g ai-appsec" npmUrl="https://www.npmjs.com/package/ai-appsec" />
            <a href="https://github.com/subodhkc/ai-appsec" target="_blank" rel="noopener noreferrer">
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
            MIT licensed. Powered by HAIEC. No HAIEC account or API key required.
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
