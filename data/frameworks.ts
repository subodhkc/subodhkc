// data/frameworks.ts — methodologies and frameworks (active + published)
export interface Framework {
  name: string;
  status: "Active Research" | "Published Framework" | "Active Framework";
  years: string;
  summary: string;
  points: string[];
}

export const FRAMEWORKS: Framework[] = [
  {
    name: "Precision Drift Detection",
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
    name: "Cognitive Systems Management (CSM)",
    status: "Published Framework",
    years: "2023 – 2025",
    summary:
      "Foundational framework underlying the HAIEC platform — bridges AI strategy, technical execution, and governance into a single operating model.",
    points: [
      "Four-pillar implementation model",
      "Strategic-to-operational alignment",
      "Risk-integrated decision frameworks",
      "Continuous governance methodology",
    ],
  },
  {
    name: "Red Audit Kit™",
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
    name: "LegacyShift™ Methodology",
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
