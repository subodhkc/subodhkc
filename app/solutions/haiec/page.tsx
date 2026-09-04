import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import CTA from "@/components/CTA";
import { ActionConsequenceAtlas } from "@/components/enterprise/ActionConsequenceAtlas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Braces, Building2, FileCheck2, GitBranch, Network, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "HAIEC | Evidence-Bound Assurance for Consequential AI",
  description: "HAIEC binds evaluated scope, technical evidence, capability, authority, and explicit unknowns into bounded assurance decisions for consequential AI systems.",
  alternates: { canonical: "https://subodhkc.com/solutions/haiec" },
  openGraph: { title: "HAIEC | High Assurance In Every Consequence", description: "See what your AI can do. Establish what it is allowed to do. Trace the evidence behind the decision.", url: "https://subodhkc.com/solutions/haiec", type: "website" },
};

const QUESTIONS = [
  "What do we intend this AI to do?",
  "What operating authority has the organization approved?",
  "What can its credentials and connected systems permit?",
  "What can the application technically do?",
  "What has actually been observed?",
  "Where do those boundaries disagree?",
] as const;

const OUTPUTS = [
  [Network, "Evaluated Scope", "The artifact, version, system boundary, evidence sources, and exclusions attached to the evaluation."],
  [GitBranch, "Action & Access Analysis", "The code-capable action surface and qualified authorization evidence, kept distinct from intent and observation."],
  [FileCheck2, "Evidence Coverage", "What was established, inferred, unavailable, not provided, not assessed, or requires deeper verification."],
  [ShieldCheck, "Material Divergence", "Mismatches among intended, approved, effectively granted, code-capable, and observed boundaries where supported."],
  [Braces, "Evidence-Gap Plan", "The smallest additional evidence or remediation that would materially strengthen the claim."],
  [Building2, "Decision Receipt", "A bounded assurance decision, its evidence lineage, confidence boundary, and the next executive choice."],
] as const;

export default function HAIECPage() {
  return (
    <>
      <Hero subtitle="High Assurance In Every Consequence" title={<>Evidence-bound assurance<br /><span className="gradient-text">for consequential AI.</span></>} description="See what your AI can do. Establish what it is allowed to do. Trace the evidence behind the decision.">
        <Link href="/contact?subject=haiec-enterprise-poc" className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">Initiate an Assurance POC <ArrowRight className="ml-2 h-4 w-4" /></Link>
        <a href="https://www.haiec.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium">Visit HAIEC Platform</a>
      </Hero>

      <Section subtitle="The Assurance Problem" title="A passing scan or valid permission is not the final decision" description="AI can act across applications, APIs, data, infrastructure, customer state, and regulated workflows. Leadership needs to know which boundary each piece of evidence actually establishes." sectionNum="01">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">{QUESTIONS.map((question, index) => <div key={question} className="bg-background p-6"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span><p className="mt-3 text-sm font-medium leading-relaxed">{question}</p></div>)}</div>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground">Serious assurance does not turn missing evidence into a green check. Unknown is a boundary on the claim, not something to hide.</p>
      </Section>

      <Section subtitle="Action-to-Consequence" title="Make the operating boundaries visible" description="The Atlas traces a consequential path and keeps intended, approved, effectively granted, code-capable, and observed evidence distinct." sectionNum="02">
        <ActionConsequenceAtlas />
      </Section>

      <Section subtitle="Customer Outcome" title="What the organization may know afterward" description="Outputs depend on the evaluated scope and evidence actually available. Nothing below converts an unavailable source into an established claim." sectionNum="03">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{OUTPUTS.map(([Icon, title, body]) => <Card key={title}><CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle className="pt-3 text-xl">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{body}</CardContent></Card>)}</div>
      </Section>

      <Section subtitle="Commercial Paths" title="Productized platform access and bespoke assurance solve different problems" sectionNum="04">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="bg-card"><th className="p-4">Dimension</th><th className="p-4">HAIEC Platform</th><th className="p-4">Enterprise Assurance POC</th></tr></thead>
            <tbody className="divide-y divide-border">
              {[
                ["Starting motion", "Self-service", "Founder-led scoping"],
                ["System boundary", "Supported product workflow", "Explicit enterprise boundary"],
                ["Evidence path", "Standard integrations and rule packs", "Minimum Sufficient Access plan"],
                ["Operating policy", "Standard workflow", "Organization-specific operating boundary"],
                ["Acceptance criteria", "Productized", "Agreed POC decision criteria"],
                ["Output", "Standard platform results", "Executive and technical decision readout"],
                ["Commercial model", "Subscription", "$25,000 to $75,000 scoped engagement"],
                ["Checkout", "Available on HAIEC.com", "No checkout. Qualification first."],
              ].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={`p-4 align-top ${index === 0 ? "font-medium" : "text-muted-foreground"}`}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </Section>

      <Section subtitle="Evidence Access" title="Begin with the strongest bounded claim the available evidence can support" description="Complete source and runtime access is not required to begin scoping. Missing evidence is identified, not ignored." sectionNum="05">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Repository and artifacts", "Public or private GitHub, GitLab, Bitbucket, source archive, package, schemas, architecture documentation."],
            ["Authority and environment", "Policy, identity, authorization, cloud configuration, API endpoint, sandbox, test credentials."],
            ["Behavioral evidence", "Logs, traces, test execution, production-relevant read-only evidence, or a representative synthetic system."],
          ].map(([title, body]) => <Card key={title}><CardHeader><CardTitle className="text-xl">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{body}</CardContent></Card>)}
        </div>
      </Section>

      <Section subtitle="Other Entry Routes" title="Enterprise POC is not the only path" sectionNum="06">
        <div className="grid gap-5 md:grid-cols-3">
          <Card><CardHeader><CardTitle className="text-xl">Design Partner</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-relaxed text-muted-foreground">For selected organizations helping qualify assurance workflows against representative enterprise systems. Not a free beta.</p><Link href="/contact?subject=design-partner" className="text-sm font-medium text-primary">Explore Design Partnership →</Link></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-xl">Partner & Agency</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-relaxed text-muted-foreground">For security firms, consultancies, MSPs, integrators, and technology partners evaluating repeat delivery or evidence integration.</p><Link href="/contact?subject=partner-agency" className="text-sm font-medium text-primary">Discuss Partner Access →</Link></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-xl">Developer & Open Source</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-relaxed text-muted-foreground">Independent developers and maintainers can begin with a repository, package, schema, test environment, or representative artifact.</p><Link href="/contact?subject=developer-evaluation" className="text-sm font-medium text-primary">Submit a Project or Repository →</Link></CardContent></Card>
        </div>
      </Section>

      <Section subtitle="Research Boundary" title="Permission is not delegation" description="HAIEC research examines whether an authorized system action was actually delegated, which effects are possible, and what evidence is required to support that claim. Research direction is not presented as current universal proof capability." sectionNum="07"><Link href="/research" className="text-sm font-medium text-primary">Inspect the research program →</Link></Section>

      <CTA title="What consequential AI decision can your current controls not defend confidently?" description="Start with one AI system, one material action boundary, and one decision. HAIEC will identify the strongest bounded claim the available evidence can support and what would materially strengthen it." primaryButton={{ text: "Initiate an Assurance POC", href: "/contact?subject=haiec-enterprise-poc" }} secondaryButton={{ text: "Visit HAIEC.com", href: "https://www.haiec.com" }} />
    </>
  );
}
