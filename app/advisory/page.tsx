import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import CTA from "@/components/CTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Compass, FileCheck2, Layers3, Scale, ShieldCheck, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Executive AI Advisory | Strategy, Architecture & Decisions | Subodh KC",
  description: "Independent executive AI advisory for consequential investment, vendor, architecture, roadmap, operating model, security, and governance decisions.",
  alternates: { canonical: "https://subodhkc.com/advisory" },
  openGraph: { title: "Executive AI Advisory | Subodh KC", description: "Senior independent judgment for interconnected AI decisions where context and consequence matter.", url: "https://subodhkc.com/advisory", type: "website" },
};

const DECISIONS = [
  [Target, "Opportunity and investment", "Which opportunities deserve capital, people, executive attention, or a deliberate stop."],
  [Scale, "Build, buy, configure, connect, wait", "Compare the full option set, dependencies, economics, reversibility, and exit path."],
  [Layers3, "Architecture and roadmap", "Pressure-test system boundaries, sequence, integration choices, evidence gates, and production assumptions."],
  [ShieldCheck, "Authority, security, and governance", "Connect policy, identity, permissions, controls, evidence, and human accountability to the decision."],
  [Compass, "Operating model", "Clarify who decides, owns, approves, monitors, escalates, and can revoke or stop the system."],
  [FileCheck2, "Decision record", "Preserve the rationale, evidence, dissent, assumptions, owner, and conditions that would change the decision."],
] as const;

export default function AdvisoryPage() {
  return (
    <>
      <Hero subtitle="Executive AI Advisory" title={<>Independent judgment for<br /><span className="gradient-text">consequential AI decisions.</span></>} description="For leaders managing interconnected AI choices where fragmented advice, vendor pressure, or missing evidence can create expensive commitments.">
        <Link href="/contact?subject=executive-decision" className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">Discuss an Executive Decision <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Hero>

      <Section subtitle="Decision Territory" title="Preserve context across the choices that compound" description="AI strategy, architecture, security, governance, economics, and operations are often treated as separate workstreams. Their consequences are not separate." sectionNum="01">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DECISIONS.map(([Icon, title, body]) => <Card key={title}><CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle className="pt-3 text-xl">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{body}</CardContent></Card>)}
        </div>
      </Section>

      <Section subtitle="Advisory Output" title="Recommendations leadership can interrogate" description="The objective is not agreement. It is a decision whose basis, trade-offs, confidence boundary, and next action are explicit." sectionNum="02">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          {[
            "Decision and opportunity briefs",
            "Vendor and option comparisons",
            "Architecture and roadmap reviews",
            "Risk, assumption, and dependency registers",
            "Operating model and decision-right recommendations",
            "Implementation sequence, evidence gates, and stop conditions",
          ].map((item, index) => <div key={item} className="bg-background p-6"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span><p className="mt-3 text-sm">{item}</p></div>)}
        </div>
      </Section>

      <Section subtitle="Fit" title="Use advisory when the decisions remain connected" sectionNum="03">
        <div className="grid gap-5 md:grid-cols-2">
          <Card><CardHeader><CardTitle className="text-xl">Advisory earns its place when</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground"><li>Several initiatives compete for attention.</li><li>A vendor or architecture choice creates durable dependency.</li><li>Leadership needs an independent view before approving spend.</li><li>Governance and execution must remain connected.</li><li>The organization has crossed from experimentation into operation.</li></ul></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-xl">Choose a different path when</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground"><li>The real problem is still obscured: start a diagnostic.</li><li>The decision is made and implementation is the constraint: move to architecture.</li><li>The question is what a system can do and what evidence supports: initiate HAIEC assurance.</li><li>You need legal advice or a certification authority: engage the appropriate qualified professional.</li></ul></CardContent></Card>
        </div>
      </Section>

      <CTA title="Make the next commitment more difficult to regret." description="Name the decision, the material consequence, the parties who own it, and what remains disputed or unknown." primaryButton={{ text: "Discuss an Executive Decision", href: "/contact?subject=executive-decision" }} secondaryButton={{ text: "Start a Diagnostic", href: "/diagnostics" }} />
    </>
  );
}
