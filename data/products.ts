// data/products.ts
// Single source of truth for the production systems catalog. The homepage Hero
// constellation, systems grid/list, and product cards all read from here.

import type { GlyphKind } from "@/components/Glyph";

export type ProductKind = "platform" | "package" | "enterprise" | "tool" | "oss";
export type ProductStatus = "live" | "stable" | "beta" | "soon";

export interface ProductAction {
  label: string;
  href: string;
  type: "launch" | "install" | "download" | "waitlist" | "github";
  /** Text copied to the clipboard for install commands. */
  copyText?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  kind: ProductKind;
  status: ProductStatus;
  glyph: GlyphKind;
  meta: string;
  primary: ProductAction;
  secondary?: ProductAction;
  /** When true, the primary action opens the RequestAccessModal instead of navigating. */
  gated?: boolean;
}

export const KIND_LABEL: Record<ProductKind, string> = {
  platform: "Platforms",
  package: "Packages",
  enterprise: "Enterprise",
  tool: "Tools",
  oss: "Open source",
};

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: "Live",
  stable: "Stable",
  beta: "Beta",
  soon: "Soon",
};

export const PRODUCTS: Product[] = [
  {
    id: "haiec",
    name: "HAIEC",
    tagline:
      "Holistic AI Ethics & Compliance. Deterministic governance engine for EU AI Act, NIST AI RMF, ISO 42001, NYC LL144.",
    kind: "platform",
    status: "live",
    glyph: "shield",
    meta: "SaaS · Enterprise",
    primary: { label: "Launch", href: "https://haiec.com", type: "launch" },
    secondary: { label: "Repo", href: "https://github.com/subodhkc/haiec", type: "github" },
  },
  {
    id: "kestrel",
    name: "KestrelVoice",
    tagline:
      "AI voice operations. Answer every call, book appointments, run the front desk 24/7.",
    kind: "platform",
    status: "live",
    glyph: "waves",
    meta: "SaaS · Production",
    primary: { label: "Launch", href: "https://kestrelvoice.com", type: "launch" },
  },
  {
    id: "frontofai",
    name: "FrontOfAI Briefing",
    tagline:
      "Daily AI intelligence for CTOs. Strategic briefings on what shipped, what shifted, what matters.",
    kind: "platform",
    status: "live",
    glyph: "frames",
    meta: "SaaS · Live",
    primary: { label: "Launch", href: "https://frontofai.com/briefing", type: "launch" },
  },
  {
    id: "llmverify-npm",
    name: "llmverify",
    tagline:
      "Runtime health monitor for LLM apps. Drift, hallucination risk, latency, JSON quality — drop-in for any client.",
    kind: "package",
    status: "stable",
    glyph: "brackets",
    meta: "npm · MIT",
    primary: {
      label: "npm i llmverify",
      href: "https://github.com/subodhkc/llmverify-npm",
      type: "install",
      copyText: "npm i llmverify",
    },
    secondary: { label: "GitHub", href: "https://github.com/subodhkc/llmverify-npm", type: "github" },
  },
  {
    id: "llmverify-py",
    name: "llmverify-py",
    tagline:
      "Python distribution of llmverify. Audit + compliance checks for LLM outputs, same deterministic core.",
    kind: "package",
    status: "stable",
    glyph: "brackets-py",
    meta: "PyPI · MIT",
    primary: {
      label: "pip install llmverify",
      href: "https://github.com/subodhkc/llmverify",
      type: "install",
      copyText: "pip install llmverify",
    },
    secondary: { label: "GitHub", href: "https://github.com/subodhkc/llmverify", type: "github" },
  },
  {
    id: "doc-timeline",
    name: "Doc Timeline",
    tagline:
      "Thousands of documents → one chronological timeline. AI extraction for legal discovery, claims, audits.",
    kind: "enterprise",
    status: "live",
    glyph: "timeline",
    meta: "Enterprise · SOC 2",
    primary: { label: "Request access", href: "/products/doc-timeline", type: "launch" },
  },
  {
    id: "pdf-redactor",
    name: "PDF Redactor",
    tagline:
      "AI detection + permanent redaction of SSNs, cards, names, 50+ PII types. Local processing only.",
    kind: "tool",
    status: "live",
    glyph: "redact",
    meta: "Desktop · Free",
    primary: { label: "Free download", href: "/products/pdf-redactor", type: "download" },
  },
  {
    id: "courtcase",
    name: "CourtCase",
    tagline:
      "Case files, deadlines, document packets. AI-assisted court evidence builder. Public beta.",
    kind: "tool",
    status: "beta",
    glyph: "scales",
    meta: "Web app · Beta",
    primary: { label: "Launch", href: "https://courtcase.frontofai.com", type: "launch" },
  },
  {
    id: "log-analyser",
    name: "SKC Log Analyser",
    tagline:
      "Find the needle in a billion haystacks. AI pattern detection across terabytes of logs.",
    kind: "enterprise",
    status: "beta",
    glyph: "bars",
    meta: "Enterprise · Early access",
    primary: { label: "Early access", href: "/products/skc-log-analyser", type: "waitlist" },
  },
  {
    id: "print-later",
    name: "Print Later",
    tagline:
      "Queue web pages now, print them later. Free Windows app with browser extension.",
    kind: "oss",
    status: "stable",
    glyph: "stack",
    meta: "OSS · Windows",
    primary: { label: "Download", href: "https://github.com/subodhkc/Print-Later", type: "download" },
    secondary: { label: "GitHub", href: "https://github.com/subodhkc/Print-Later", type: "github" },
  },
  {
    id: "shadow-ai",
    name: "Shadow AI Detector",
    tagline:
      "Find unauthorized AI use across your codebase and stack. Telemetry-free, on-premise.",
    kind: "oss",
    status: "beta",
    glyph: "ring-split",
    meta: "OSS · MIT",
    primary: {
      label: "git clone",
      href: "https://github.com/subodhkc/Shadow-AI-Detector",
      type: "install",
      copyText: "git clone github.com/subodhkc/Shadow-AI-Detector",
    },
    secondary: { label: "GitHub", href: "https://github.com/subodhkc/Shadow-AI-Detector", type: "github" },
  },
  {
    id: "haiec-action",
    name: "HAIEC Action",
    tagline:
      "Static AI/compliance scan in your CI. Drop-in GitHub Action — fails the build on policy drift.",
    kind: "oss",
    status: "stable",
    glyph: "octagon",
    meta: "OSS · GitHub Marketplace",
    primary: {
      label: "uses: subodhkc/haiec",
      href: "https://github.com/subodhkc/haiec-github-action",
      type: "install",
      copyText: "uses: subodhkc/haiec-github-action@v1",
    },
    secondary: { label: "GitHub", href: "https://github.com/subodhkc/haiec-github-action", type: "github" },
  },
  {
    id: "haiec-osint",
    name: "HAIEC OSINT",
    tagline:
      "Open-source intelligence layer for HAIEC. Public-signal AI-risk reconnaissance on any org or repo.",
    kind: "oss",
    status: "beta",
    glyph: "radar",
    meta: "Private beta",
    gated: true,
    primary: { label: "Request access", href: "#contact", type: "waitlist" },
  },
  {
    id: "skc-meeting",
    name: "SKC Meeting Tool",
    tagline:
      "Tactical frameworks for decision-making — ResetFrame™, PM cheat sheet. Built for high-stakes rooms.",
    kind: "oss",
    status: "stable",
    glyph: "frame-anchor",
    meta: "OSS · Apache 2.0",
    primary: { label: "Download PDF", href: "https://github.com/subodhkc/SKC-Meeting-Tool", type: "download" },
    secondary: { label: "GitHub", href: "https://github.com/subodhkc/SKC-Meeting-Tool", type: "github" },
  },
  {
    id: "atomic-patent",
    name: "Atomic Patent Forge",
    tagline:
      "AI-assisted patent drafting. Decompose ideas into atomic claims, forge defensible specifications.",
    kind: "tool",
    status: "beta",
    glyph: "nucleus",
    meta: "Private beta",
    gated: true,
    primary: { label: "Request access", href: "#contact", type: "waitlist" },
  },
];

export const FILTER_ORDER: Array<"all" | ProductKind> = [
  "all",
  "platform",
  "package",
  "enterprise",
  "tool",
  "oss",
];
