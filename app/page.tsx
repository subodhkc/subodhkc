// app/page.tsx - AI Advisor + AI Systems Architect homepage
import { AccessProvider } from "@/components/AccessProvider";
import { Hero } from "@/components/hero/Hero";
import { LeverageSection } from "@/components/home/LeverageSection";
import { WaysToWork } from "@/components/home/WaysToWork";
import { SystemsSection } from "@/components/home/SystemsSection";
import { HowIWork } from "@/components/home/HowIWork";
import { WritingResearchSection } from "@/components/home/WritingResearchSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = {
  title: "AI Advisor & AI Systems Architect | Subodh KC",
  description:
    "AI advisor and systems architect helping leaders identify worthwhile AI opportunities, make evidence-backed decisions, and move the right systems from architecture into production.",
  keywords: [
    "Subodh KC",
    "AI advisor",
    "AI systems architect",
    "AI strategy advisor",
    "enterprise AI advisor",
    "AI decision support",
    "AI opportunity discovery",
    "AI systems architecture",
    "AI architecture",
    "AI vendor evaluation",
    "AI build vs buy",
    "AI governance",
    "production AI",
    "AI implementation",
  ],
  alternates: {
    canonical: "https://subodhkc.com",
  },
  openGraph: {
    title: "AI Advisor & AI Systems Architect | Subodh KC",
    description:
      "AI advisor and systems architect helping leaders identify worthwhile AI opportunities, make evidence-backed decisions, and move the right systems from architecture into production.",
    url: "https://subodhkc.com",
    type: "website",
    images: [
      {
        url: "https://subodhkc.com/portrait.jpeg",
        width: 1200,
        height: 630,
        alt: "Subodh KC - AI Advisor & AI Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Advisor & AI Systems Architect | Subodh KC",
    description:
      "AI advisor and systems architect. From possibility to decision. From decision to production.",
    images: ["https://subodhkc.com/portrait.jpeg"],
  },
};

export default function HomePage() {
  return (
    <AccessProvider>
      {/* 01 - HERO */}
      <Hero />
      {/* 02 - PROOF RAIL (integrated into hero) */}
      {/* 03 - WHERE I CREATE LEVERAGE */}
      <LeverageSection />
      {/* 04 - WAYS TO WORK WITH ME */}
      <WaysToWork />
      {/* 05 - SELECTED SYSTEMS + OPEN SOURCE */}
      <SystemsSection />
      {/* 06 - HOW I WORK */}
      <HowIWork />
      {/* 07 - WRITING + RESEARCH */}
      <WritingResearchSection />
      {/* 08 - ABOUT */}
      <AboutSection />
      {/* 09 - FINAL CTA */}
      <FinalCTA />
    </AccessProvider>
  );
}
