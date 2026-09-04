import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import CTA from "@/components/CTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Eye, Gauge, MessageSquareText, Radar, Scale, Waypoints } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Advisor for Business | Decisions, Systems & Evidence | Subodh KC",
  description: "Human AI advisory that connects emerging capability, organizational context, decision pressure, technical reality, and evidence.",
  alternates: { canonical: "https://subodhkc.com/ai-advisor" },
  openGraph: { title: "AI Advisor for Business | Subodh KC", description: "Human judgment for leaders deciding where AI belongs, what deserves action, and what evidence should govern the commitment.", url: "https://subodhkc.com/ai-advisor", type: "website" },
};

const LENSES = [
  [Radar, "Possibility", "Track material capability shifts, operating patterns, vendor moves, and new strategic options."],
  [Eye, "Organizational fit", "Reconcile external possibility with your workflows, economics, systems, people, constraints, and timing."],
  [Scale, "Decision quality", "Compare value, feasibility, options, dependencies, control, risk, and the evidence required to proceed."],
  [Waypoints, "Architecture", "Connect the executive decision to data, integrations, identity, authority, failure handling, and production operations."],
  [Gauge, "Operating consequence", "Identify who owns the outcome, what can change materially, and when leadership should narrow, pause, or stop."],
  [MessageSquareText, "Human judgment", "Bring live questions into a continuing context rather than restarting the analysis with every decision."],
] as const;

export default function AIAdvisorPage() {
  return (
    <>
      <Hero subtitle="AI Advisor for Business" title={<>See what changed.<br /><span className="gradient-text">Decide what it changes for you.</span></>} description="I maintain the connection between emerging AI capability and the decisions inside your organization. The objective is not more information. It is better judgment about what deserves action.">
        <Link href="/contact?subject=ai-advisor" className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">Discuss Advisory Fit <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Hero>
      <Section subtitle="Advisory Lens" title="Signal becomes useful only after it meets organizational context" sectionNum="01">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{LENSES.map(([Icon, title, body]) => <Card key={title}><CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle className="pt-3 text-xl">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{body}</CardContent></Card>)}</div>
      </Section>
      <Section subtitle="Decision Standard" title="Possibility is cheap. Commitment is not." description="A serious advisory relationship makes the conditions for action explicit." sectionNum="02">
        <div className="grid gap-4 md:grid-cols-4">{[["Value", "What materially improves?"], ["Fit", "Is this the right problem?"], ["Control", "What stays human?"], ["Evidence", "What would change the decision?"]].map(([title, body]) => <div key={title} className="rounded-lg border border-border bg-card p-6"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{body}</p></div>)}</div>
      </Section>
      <Section subtitle="Engagement Routes" title="Match the relationship to the consequence" sectionNum="03">
        <div className="grid gap-5 md:grid-cols-3">
          {[["Diagnostic Intensive", "For one obscured problem or decision that needs a bounded intervention.", "/diagnostics", "Start a Diagnostic"], ["Executive AI Advisory", "For interconnected decisions where context and consequence compound.", "/advisory", "Explore Executive Advisory"], ["Community Access", "Productized offers for eligible nonprofits and active HEB Chamber members.", "/heb-chamber", "Access Member Offers"]].map(([title, body, href, cta]) => <Card key={title}><CardHeader><CardTitle className="text-xl">{title}</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-relaxed text-muted-foreground">{body}</p><Link href={href} className="text-sm font-medium text-primary">{cta} →</Link></CardContent></Card>)}
        </div>
      </Section>
      <CTA title="Bring the decision that does not fit neatly inside one function." description="Describe what is changing, what commitment is being considered, and which consequence leadership owns." primaryButton={{ text: "Discuss Advisory Fit", href: "/contact?subject=ai-advisor" }} secondaryButton={{ text: "Start a Diagnostic", href: "/diagnostics" }} />
    </>
  );
}
