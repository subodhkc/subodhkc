// app/page.tsx — AI systems architect homepage
import { AccessProvider } from "@/components/AccessProvider";
import { Hero } from "@/components/hero/Hero";
import { Registry } from "@/components/Registry";
import { WritingSection } from "@/components/writing/WritingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ComplianceGuidesSection } from "@/components/home/ComplianceGuidesSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { MagazineBadge } from "@/components/home/MagazineBadge";

export const metadata = {
  title: "Subodh KC | AI Systems Architect & Governance Expert",
  description:
    "Subodh KC architects, deploys and governs production AI systems — including agentic workflows, RAG, voice AI, compliance automation and enterprise-scale delivery.",
};

export default function HomePage() {
  return (
    <AccessProvider>
      <Hero />
      <Registry />
      <MagazineBadge />
      <TestimonialsSection />
      <ComplianceGuidesSection />
      <WritingSection />
      <NewsletterSection />
    </AccessProvider>
  );
}
