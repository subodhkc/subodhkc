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
  keywords: [
    'Subodh KC',
    'AI systems architect',
    'AI governance',
    'AI compliance',
    'enterprise AI',
    'RAG architecture',
    'voice AI',
    'agentic AI',
    'AI strategy',
    'technical program management',
  ],
  alternates: {
    canonical: 'https://subodhkc.com',
  },
  openGraph: {
    title: 'Subodh KC | AI Systems Architect & Governance Expert',
    description:
      'Subodh KC architects, deploys and governs production AI systems — including agentic workflows, RAG, voice AI, compliance automation and enterprise-scale delivery.',
    url: 'https://subodhkc.com',
    type: 'website',
    images: [
      {
        url: 'https://subodhkc.com/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC — AI Systems Architect & Governance Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh KC | AI Systems Architect & Governance Expert',
    description:
      'Architects, deploys and governs production AI systems — agentic workflows, RAG, voice AI, compliance automation.',
    images: ['https://subodhkc.com/portrait.jpeg'],
  },
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
