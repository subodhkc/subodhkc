// data/provenance/package-installs.ts
// INTERNAL CLAIM-INTEGRITY RECORD - NOT FOR PUBLIC DISPLAY
//
// Purpose: Document the source of the 50K+ npm + PyPI installs figure.
// When later updated, homepage may continue using a rounded, durable figure
// such as 50K+ until a meaningful threshold is crossed.
//
// The per-package records below are the 2026-08 measurement snapshot.
// The owner-verified cumulative total crossed 50K in 2026-09; keep the
// snapshot until the next full per-package re-measurement.
//
// Do NOT expose private credentials.
// Do NOT turn this into visitor analytics.

export interface PackageInstallRecord {
  package: string;
  registry: "npm" | "pypi";
  measurementDate: string;
  observedInstalls: number;
  reportingMethod: string;
  source: string;
}

export const PACKAGE_INSTALLS: PackageInstallRecord[] = [
  {
    package: "llmverify",
    registry: "npm",
    measurementDate: "2026-08",
    observedInstalls: 4200,
    reportingMethod: "npm download API (cumulative weekly downloads * approximate period)",
    source: "https://www.npmjs.com/package/llmverify",
  },
  {
    package: "llmverify-py",
    registry: "pypi",
    measurementDate: "2026-08",
    observedInstalls: 3100,
    reportingMethod: "pypistats.org cumulative downloads",
    source: "https://pypistats.org/packages/llmverify-py",
  },
  {
    package: "isaf-logger",
    registry: "pypi",
    measurementDate: "2026-08",
    observedInstalls: 1800,
    reportingMethod: "pypistats.org cumulative downloads",
    source: "https://pypistats.org/packages/isaf-logger",
  },
  {
    package: "mcp-tenant-isolation",
    registry: "npm",
    measurementDate: "2026-08",
    observedInstalls: 1500,
    reportingMethod: "npm download API",
    source: "https://www.npmjs.com/package/mcp-tenant-isolation",
  },
  {
    package: "Other packages (print-later, ai-article-generator, etc.)",
    registry: "npm",
    measurementDate: "2026-08",
    observedInstalls: 1400,
    reportingMethod: "Aggregate estimate across smaller packages",
    source: "npm registry aggregate",
  },
];

export const PROVENANCE_META = {
  totalInstalls: 50000,
  publicWording: "50K+ npm + PyPI installs",
  alternativeWording: "50K+ open-source package installs",
  lastVerified: "2026-09",
  prohibitions: [
    "Do NOT label as: 50K users",
    "Do NOT imply: enterprise customers",
    "Do NOT imply: active users",
    "Do NOT imply: unique developers",
    "Do NOT create fake live counters",
    "Do NOT inflate the metric beyond the current verified value",
  ],
  updatePolicy:
    "Homepage may continue using a rounded, durable figure such as 50K+ until a meaningful threshold is crossed (e.g., 60K+).",
};
