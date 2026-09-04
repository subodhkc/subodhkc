import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import CTA from "@/components/CTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Compass, Network, Scale, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Strategic Diagnostic Intensives | Subodh KC",
  description: "Bounded executive diagnostics that expose hidden AI opportunity, constraints, operating friction, value leakage, and decision conflict.",
  alternates: { canonical: "https://subodhkc.com/diagnostics" },
  openGraph: {
    title: "Strategic Diagnostic Intensives | Subodh KC",
    description: "Expose what the current framing cannot see before committing capital, people, or architecture.",
    url: "https://subodhkc.com/diagnostics",
    type: "website",
  },
};

const DIAGNOSTICS = [
  {
    icon: Compass,
    name: "Strategic Opportunity & Constraint Diagnostic",
    signal: "The organization sees activity, but not the highest-value move.",
    establishes: "Where value is trapped, which constraints are material, what options exist, and which questions deserve executive attention.",
  },
  {
    icon: Scale,
    name: "AI Investment & Decision Diagnostic",
    signal: "An AI investment, vendor, platform, or build decision is expensive to reverse.",
    establishes: "Decision criteria, competing paths, dependency exposure, evidence gaps, economics, and explicit commit or stop conditions.",
  },
  {
    icon: Network,
    name: "Operating Friction & Scale Diagnostic",
    signal: "AI pilots exist, but ownership, integration, adoption, or production scale remains blocked.",
    establishes: "The operating bottleneck, cross-functional conflict, failure points, hidden work, and the minimum changes required to move.",
  },
  {
    icon: Target,
    name: "Executive Strategy Lab",
    signal: "Leadership needs alignment on a consequential AI direction, not another presentation.",
    establishes: "A shared decision frame, material disagreements, decision rights, evidence requirements, and an executable next move.",
  },
];

const OUTPUTS = [
  "Reframed decision and evaluated boundary",
  "Material opportunities, constraints, and hidden dependencies",
  "Option comparison with trade-offs and second-order effects",
  "Known, assumed, disputed, and not-yet-established states",
  "Priority actions, evidence requirements, owners, and stop conditions",
  "Executive readout and decision-grade written artifact",
];

export default function DiagnosticsPage() {
  return (
    <>
      <Hero
        subtitle="Strategic Diagnostic Intensives"
        title={<>Expose the problem behind<br /><span className="gradient-text">the visible problem.</span></>}
        description="A bounded intervention for leaders who need to surface hidden opportunity, value leakage, operating friction, constraints, and decision conflict before committing capital, people, or architecture."
      >
        <Link href="/contact?subject=strategic-diagnostic" className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">
          Start a Diagnostic <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Hero>

      <Section subtitle="The Entry Point" title="The initial request is rarely the full decision" description="Organizations often arrive asking for a tool, vendor, roadmap, workshop, or automation. The diagnostic tests the framing before the solution begins." sectionNum="01">
        <div className="grid gap-6 md:grid-cols-2">
          {DIAGNOSTICS.map(({ icon: Icon, name, signal, establishes }) => (
            <Card key={name} className="h-full border-l-4 border-l-primary">
              <CardHeader>
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle className="pt-3 text-xl leading-tight">{name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                <div><span className="font-semibold text-foreground">Use when: </span><span className="text-muted-foreground">{signal}</span></div>
                <div><span className="font-semibold text-foreground">Establishes: </span><span className="text-muted-foreground">{establishes}</span></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Decision Output" title="What leadership knows afterward" description="The output is not a downloadable exercise library. I select and facilitate the diagnostic instruments required by the decision." sectionNum="02">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          {OUTPUTS.map((output, index) => (
            <div key={output} className="bg-background p-6">
              <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{output}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section subtitle="Engagement Logic" title="A diagnostic is valuable only if it changes the next decision" description="The work ends with one of four explicit paths: advance, narrow, gather evidence, or stop." sectionNum="03">
        <div className="grid gap-4 md:grid-cols-4">
          {["Advance a qualified opportunity", "Narrow the operating boundary", "Gather material evidence", "Stop an unearned commitment"].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-card p-5 text-sm font-medium">{item}</div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          If the decision is already clear and the need is continuing judgment, move directly to Executive AI Advisory. If the decision has earned implementation, move to systems architecture. If the unresolved question is what a consequential AI system can do and what the evidence supports, initiate a HAIEC assurance POC.
        </p>
      </Section>

      <CTA
        title="Name the decision that is consuming attention without producing clarity."
        description="Provide the decision, the consequence attached to it, and what your current process cannot establish. I will determine whether a diagnostic is the right starting point."
        primaryButton={{ text: "Start a Diagnostic", href: "/contact?subject=strategic-diagnostic" }}
        secondaryButton={{ text: "Explore Executive Advisory", href: "/advisory" }}
      />
    </>
  );
}
