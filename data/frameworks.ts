// data/frameworks.ts — methodologies and frameworks (active + published)
export interface Framework {
  name: string;
  status: string;
  years: string;
  summary: string;
  points: string[];
}

export const FRAMEWORKS: Framework[] = [
  {
    name: "Precision Drift Detector",
    status: "Active Research",
    years: "2024 – 2025",
    summary:
      "Advanced methodology for detecting subtle degradation patterns in production AI. Goes beyond statistical drift to identify concept drift, performance degradation, and silent failures before they impact users.",
    points: [
      "Multi-dimensional drift analysis framework",
      "Early-warning signal detection",
      "Context-aware threshold adaptation",
      "Production incident correlation",
    ],
  },
  {
    name: "Cognitive Systems Management 2.0 (CSM)",
    status: "Published Framework · Current Version: CSM 2.0",
    years: "2025–2026",
    summary:
      "A deterministic-by-design governance operating model for AI systems. Preserves the original four governance domains (Enterprise, Project, Code, UX) and adds six cross-functional execution functions plus versioned governance contracts for decisions, evidence, handoffs and reassessment. First published August 29, 2025. Current spec version 2.0.0.",
    points: [
      "Four governance domains: Enterprise, Project, Code, UX",
      "Six execution functions: cross-domain governance operations",
      "Versioned governance contracts for all 16 components",
      "Deterministic reference evaluator for objective rules",
      "Explicit human review boundary for interpretive decisions",
      "Practitioner-developed, versioned for public scrutiny",
    ],
  },
  {
    name: "Red Audit Kit",
    status: "Active Framework",
    years: "2024 – 2025",
    summary:
      "Systematic assessment framework covering models, data pipelines, infrastructure, and governance. Identifies compliance gaps and produces a defensible remediation roadmap.",
    points: [
      "Multi-layer audit methodology",
      "Risk scoring and prioritization",
      "Regulatory mapping automation",
      "Remediation roadmap generation",
    ],
  },
  {
    name: "LegacyShift Methodology",
    status: "Active Framework",
    years: "2024 – 2025",
    summary:
      "Structured approach to modernizing legacy AI systems. Addresses technical debt, compliance gaps, and operational drag while minimizing risk and preserving continuity.",
    points: [
      "Zero-downtime migration patterns",
      "Incremental modernization strategy",
      "Risk-managed transitions",
      "Compliance preservation frameworks",
    ],
  },
];
