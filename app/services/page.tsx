import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import CTA from "@/components/CTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Database, GitBranch, Network, ShieldCheck, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Systems Architecture & Implementation | Subodh KC",
  description: "Production architecture and implementation for consequential AI systems, agents, RAG, voice, data, integrations, permissions, controls, and operating handoff.",
  alternates: { canonical: "https://subodhkc.com/services" },
  openGraph: {
    title: "AI Systems Architecture & Implementation | Subodh KC",
    description: "Move qualified AI decisions into inspectable, operable production systems.",
    url: "https://subodhkc.com/services",
    type: "website",
  },
};

const CAPABILITIES = [
  [Bot, "Agents and decision workflows", "Tool boundaries, delegation paths, human intervention, failure states, and consequential actions."],
  [Database, "RAG and knowledge systems", "Retrieval architecture, tenancy, provenance, evaluation, poisoning resistance, and production operations."],
  [Workflow, "Voice and workflow systems", "Real-time orchestration, booking, dispatch, CRM actions, escalation, and degraded-mode design."],
  [Network, "APIs, data, and integrations", "System boundaries, contracts, identity, state transitions, observability, and external effects."],
  [ShieldCheck, "Security and operating controls", "Authority, least privilege, tenant isolation, evidence, rollback, and incident response."],
  [GitBranch, "Delivery and adoption", "Implementation sequence, owners, acceptance gates, operational readiness, and transfer into production."],
] as const;

export default function ServicesPage() {
  return (
    <>
      <Hero
        subtitle="AI Systems Architecture & Implementation"
        title={<>A qualified decision still needs<br /><span className="gradient-text">an operable system.</span></>}
        description="I translate decision intent into architecture, integrations, controls, implementation sequence, and production ownership. The system must work inside the organization that will operate it."
      >
        <Link href="/contact?subject=ai-architecture-implementation" className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">
          Discuss Architecture & Implementation <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Hero>

      <Section subtitle="Production Scope" title="Architecture across the full operating boundary" description="The work connects business consequence, technical capability, authority, evidence, human control, and production reality." sectionNum="01">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(([Icon, title, description]) => (
            <Card key={title} className="h-full">
              <CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle className="pt-3 text-xl">{title}</CardTitle></CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">{description}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Engagement Boundary" title="Implementation begins after the decision earns it" description="Architecture should not harden an untested assumption into technical debt." sectionNum="02">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {[
            ["Inputs", "A defined outcome, material constraints, decision owner, and the evidence already available."],
            ["Work", "Architecture decisions, prototypes where useful, integration design, security boundaries, delivery sequencing, and acceptance criteria."],
            ["Exit", "An inspectable system or implementation package with named ownership, known limitations, and a production decision path."],
          ].map(([title, body]) => <div key={title} className="bg-background p-7"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
      </Section>

      <Section subtitle="Choose the Correct Entry" title="Do not buy architecture to solve a framing problem" sectionNum="03">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["The decision is unclear", "Start with a Strategic Diagnostic Intensive.", "/diagnostics", "Start a Diagnostic"],
            ["Several decisions are connected", "Use Executive AI Advisory to preserve context and pressure-test commitments.", "/advisory", "Explore Advisory"],
            ["Assurance is the unresolved question", "Use HAIEC to establish a bounded claim from system evidence.", "/solutions/haiec", "Explore HAIEC"],
          ].map(([title, body, href, cta]) => <Card key={title}><CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader><CardContent><p className="mb-5 text-sm leading-relaxed text-muted-foreground">{body}</p><Link href={href} className="text-sm font-medium text-primary">{cta} →</Link></CardContent></Card>)}
        </div>
      </Section>

      <CTA title="Translate the decision into an operating system." description="Describe the outcome, environment, consequence, and existing technical boundary. I will identify what must be established before implementation begins." primaryButton={{ text: "Discuss Architecture", href: "/contact?subject=ai-architecture-implementation" }} secondaryButton={{ text: "Inspect Selected Work", href: "/portfolio" }} />
    </>
  );
}
