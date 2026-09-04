import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Subodh KC",
  description: "Answers about strategic diagnostics, executive AI advisory, architecture, HAIEC assurance, community access, and engagement fit.",
  alternates: { canonical: "https://subodhkc.com/faq" },
};

const FAQS = [
  ["What does Subodh KC do?", "Subodh is an Enterprise AI Advisor and AI Systems Architect. He helps leaders expose hidden constraints, resolve consequential AI decisions, architect qualified systems, and establish what available evidence supports."],
  ["What is the preferred starting point?", "Use a Strategic Diagnostic Intensive when the problem, opportunity, constraint, or decision is not yet established clearly enough to justify architecture or implementation."],
  ["What is Executive AI Advisory?", "Independent continuing judgment across interconnected AI opportunity, investment, vendor, architecture, roadmap, operating model, security, and governance decisions."],
  ["When should an organization move to architecture and implementation?", "Move after the outcome, owner, constraints, acceptance criteria, and decision basis are sufficiently clear. Architecture should not convert an untested assumption into production debt."],
  ["What does HAIEC stand for?", "HAIEC means High Assurance In Every Consequence. It is positioned as Evidence-Bound Assurance for Consequential AI."],
  ["Does HAIEC certify compliance or prove that AI is safe?", "No. HAIEC is not a certification authority and does not prove universal safety or compliance. It establishes bounded claims from evaluated evidence and preserves explicit unknown or not-assessed states."],
  ["What is an Enterprise Assurance POC?", "A founder-led, scoped engagement for one consequential AI system, one material action boundary, and one decision. Typical engagements range from $25,000 to $75,000. Qualification happens before any commercial agreement; there is no enterprise checkout."],
  ["Is complete source or runtime access required?", "No. Scoping can begin with the evidence available. The evaluation identifies the strongest bounded claim that evidence can support and what additional evidence would materially strengthen it. Missing evidence is not ignored."],
  ["Are lower-friction offers still available?", "Yes. Existing productized advisory and selected service offers remain available through the private community route for nonprofit organizations and active HEB Chamber of Commerce members."],
  ["How do I start?", "Submit the decision, material consequence, unresolved boundary, and desired decision date through the contact page. Sensitive evidence should not be sent through the public form."],
] as const;

const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Hero subtitle="Frequently Asked Questions" title={<>Decisions, systems,<br /><span className="gradient-text">evidence, and fit.</span></>} description="Direct answers about where to begin, what each engagement establishes, and which claims HAIEC does not make." />
      <Section subtitle="Engagement Questions" title="Choose the path that matches the unresolved boundary" sectionNum="01">
        <div className="mx-auto max-w-4xl divide-y divide-border overflow-hidden rounded-xl border border-border">
          {FAQS.map(([question, answer]) => <details key={question} className="group bg-background p-6"><summary className="cursor-pointer list-none font-semibold">{question}<span className="float-right text-primary group-open:rotate-45">+</span></summary><p className="mt-4 pr-8 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}
        </div>
        <p className="mx-auto mt-8 max-w-4xl text-sm text-muted-foreground">For framework-specific information, use the <Link href="/guides" className="text-primary">Governance & Standards guides</Link>. They support interpretation and readiness; they do not replace qualified legal or certification professionals.</p>
      </Section>
      <CTA title="Start with the unresolved decision." description="Provide the decision, consequence, current evidence boundary, and desired decision date." primaryButton={{ text: "Submit a Decision", href: "/contact" }} secondaryButton={{ text: "Start a Diagnostic", href: "/diagnostics" }} />
    </>
  );
}
