// data/papers.ts — peer-reviewed and published writing
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
    href: "https://zenodo.org",
  },
  {
    title: "Deterministic Bias Detection for NYC Local Law 144",
    subtitle: "Why Reproducibility Matters More Than Accuracy",
    venue: "Zenodo",
    year: "2024",
    topics: [
      "NYC Local Law 144",
      "Bias Detection",
      "Regulatory Compliance",
      "Deterministic Systems",
    ],
    summary:
      "Reproducibility-first architecture for detecting linguistic bias in job descriptions. Rule-based pattern matching, version-controlled lexicons, cryptographic evidence generation for legally defensible documentation.",
    href: "https://zenodo.org",
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
    title: "Cognitive Systems Management: A Unified Approach",
    subtitle: "Bridging AI strategy, implementation, and governance",
    venue: "HAIEC Research",
    year: "2024",
    topics: ["Methodology", "AI Strategy", "Governance"],
    summary:
      "Comprehensive methodology bridging strategy, execution, and governance for enterprise-scale AI deployment.",
    href: "https://www.haiec.com/resources/whitepapers",
  },
];
