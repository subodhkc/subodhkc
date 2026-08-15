// app/page.tsx - AI systems architect homepage
import { AccessProvider } from "@/components/AccessProvider";
import { Hero } from "@/components/hero/Hero";
import { FrontOfAIBanner } from "@/components/home/FrontOfAIBanner";
import { Registry } from "@/components/Registry";
import { WritingSection } from "@/components/writing/WritingSection";
import { ComplianceGuidesSection } from "@/components/home/ComplianceGuidesSection";
import { MagazineBadge } from "@/components/home/MagazineBadge";
import { CSMFrameworkSection } from "@/components/home/CSMFrameworkSection";
import { CommercialDecisionSection } from "@/components/home/CommercialDecisionSection";
import { PossibilitySection } from "@/components/home/PossibilitySection";
import { OperatingMethodSection } from "@/components/home/OperatingMethodSection";
import { NamePronunciationSection } from "@/components/home/NamePronunciationSection";
import { FloatingNav } from "@/components/home/FloatingNav";

export const metadata = {
  title: "AI Advisor & AI Systems Architect | Subodh KC",
  description:
    "Subodh KC turns AI ambiguity into possibilities, evidence-backed decisions, and systems organizations can actually operate. Research, architecture, program leadership, continuous improvement.",
  keywords: [
    'Subodh KC',
    'AI advisor',
    'AI systems architect',
    'enterprise AI',
    'AI strategy',
    'AI opportunity discovery',
    'AI decision support',
    'RAG architecture',
    'voice AI',
    'agentic AI',
    'technical program management',
  ],
  alternates: {
    canonical: 'https://subodhkc.com',
  },
  openGraph: {
    title: 'AI Advisor & AI Systems Architect | Subodh KC',
    description:
      'Subodh KC turns AI ambiguity into possibilities, evidence-backed decisions, and systems organizations can actually operate.',
    url: 'https://subodhkc.com',
    type: 'website',
    images: [
      {
        url: 'https://subodhkc.com/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC - AI Advisor & AI Systems Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Advisor & AI Systems Architect | Subodh KC',
    description:
      'AI ambiguity turned into possibilities, evidence-backed decisions, and systems organizations can actually operate.',
    images: ['https://subodhkc.com/portrait.jpeg'],
  },
};

export default function HomePage() {
  return (
    <AccessProvider>
      <Hero />
      <FrontOfAIBanner />
      <NamePronunciationSection />
      <PossibilitySection />
      <OperatingMethodSection />
      <CommercialDecisionSection />
      <MagazineBadge />
      <CSMFrameworkSection />
      <Registry />
      <ComplianceGuidesSection />
      <WritingSection />
      <FloatingNav />
    </AccessProvider>
  );
}
