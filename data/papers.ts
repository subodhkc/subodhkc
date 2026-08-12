// data/papers.ts - published research and writing
export interface Paper {
  title: string;
  subtitle: string;
  venue: string;
  year: string;
  topics: string[];
  summary: string;
  href: string;
}

export const PAPERS: Paper[] = [
  {
    title: "The Instruction Stack Audit Framework (ISAF)",
    subtitle:
      "A Technical Methodology for Tracing AI Accountability Across Nine Abstraction Layers",
    venue: "Zenodo",
    year: "2025",
    topics: [
      "AI Governance",
      "EU AI Act",
      "NIST AI RMF",
      "ISO 42001",
      "Algorithmic Accountability",
    ],
    summary:
      "Nine-layer technical specification for documenting instruction propagation from hardware to outputs. 127-checkpoint audit protocol, cryptographic verification, abstraction-distance risk scoring.",
    href: "https://zenodo.org/records/18080355",
  },
  {
    title: "Deterministic Bias Detection for NYC Local Law 144",
    subtitle: "Why Reproducibility Matters More Than Accuracy: A Technical Framework for Compliance-Grade AI Auditing",
    venue: "SSRN",
    year: "2026",
    topics: [
      "NYC Local Law 144",
      "Bias Detection",
      "Regulatory Compliance",
      "Deterministic Systems",
      "Algorithmic Accountability",
      "Employment Discrimination",
      "Reproducibility",
      "Compliance Architecture",
    ],
    summary:
      "Presents a deterministic architecture for bias detection that prioritizes reproducibility over algorithmic sophistication. Demonstrates why probabilistic AI models cannot satisfy evidentiary requirements of regulatory compliance. Uses rule-based pattern matching, version-controlled lexicons, and cryptographic evidence generation. 35 pages.",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5968116",
  },
  {
    title: "From Industrial Electrification to Artificial Intelligence",
    subtitle:
      "Institutional Lessons from Construction Governance for AI Risk Regulation",
    venue: "Zenodo",
    year: "2025",
    topics: [
      "AI Risk Regulation",
      "Governance Maturation",
      "General Purpose Technology",
      "Institutional Lessons",
      "Regulatory Consolidation",
    ],
    summary:
      "Analyzes institutional evolution of construction governance and applies structural lessons to AI risk regulation. Proposes a phased governance maturation model drawing from mechanization, electrification, occupational safety, professional licensing, and insurance enforcement.",
    href: "https://zenodo.org/records/18664344",
  },
  {
    title: "From AI Pilots to Regulatory Readiness",
    subtitle: "A Framework for Production-Grade, Compliant AI",
    venue: "AI Governance Playbook",
    year: "2025",
    topics: ["Framework Paper", "AI Strategy", "Compliance"],
    summary:
      "Practical framework for transitioning from AI experimentation to production systems that survive regulatory scrutiny.",
    href: "https://medium.com/@subodhkc",
  },
  {
    title: "Why Enterprise AI Integration Strategies Fail",
    subtitle: "A Systematic Analysis",
    venue: "Design Bootcamp",
    year: "2025",
    topics: ["Analysis", "Enterprise Architecture"],
    summary:
      "Common architectural and organizational failure modes in enterprise AI adoption, with patterns and counter-patterns.",
    href: "https://medium.com/@subodhkc",
  },
  {
    title: "Cognitive System Management: A Framework for Enterprise AI Project Governance",
    subtitle: "Four-domain AI governance methodology - now evolved to CSM 2.0",
    venue: "AI Governance on Medium",
    year: "2025",
    topics: ["Methodology", "AI Governance", "AI Strategy"],
    summary:
      "Original publication of the Cognitive Systems Management (CSM) framework: a four-domain governance methodology comprising Enterprise, Project, Code and UX. Current version: CSM 2.0 (spec v2.0.0, 2026-08-10).",
    href: "https://medium.com/ai-governance-playbook/cognitive-system-management-a-framework-for-enterprise-ai-project-governance-ee7fc95a07ff",
  },
];
