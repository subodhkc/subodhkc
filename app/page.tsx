// app/page.tsx — Registry-as-hero homepage
import { AccessProvider } from "@/components/AccessProvider";
import { Hero } from "@/components/hero/Hero";
import { Registry } from "@/components/Registry";
import { WritingSection } from "@/components/writing/WritingSection";

export const metadata = {
  title: "Subodh KC — personal registry",
  description:
    "Former Fortune 50 AI Strategy CTL, founder of HAIEC. 15 shipped products: AI compliance, voice operations, npm + PyPI packages, OSS for AI governance.",
};

export default function HomePage() {
  return (
    <AccessProvider>
      <Hero />
      <Registry />
      <WritingSection />
    </AccessProvider>
  );
}
