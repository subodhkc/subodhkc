// data/provenance/projects.ts
// INTERNAL CLAIM-INTEGRITY RECORD - NOT FOR PUBLIC DISPLAY
//
// Purpose: Allow the 83+ project aggregate to be reconstructed from evidence
// rather than memory. Future homepage numbers should be calculated from this.
//
// Do NOT expose confidential client details.
// Do NOT publish the full inventory on the homepage.

export interface ProjectRecord {
  id: string;
  category: "enterprise" | "employment" | "freelance" | "independent" | "founder" | "open-source";
  approximateYear: string;
  status: "delivered" | "ongoing" | "archived";
  role: string;
  aiRelated: boolean;
  // Optional: high-level description without client names
  description?: string;
}

// Aggregate categories (not a full inventory - reconstructed from career history)
// The total across these categories supports the "83+ projects delivered" claim.
export const PROJECT_CATEGORIES = {
  enterprise: {
    description: "Enterprise employment and project work (HP, ACTIVE Network, Cummins/TCS, Centaurus)",
    approximateCount: 35,
    notes: "Includes 53-application portfolio leadership at HP, MES deployment at Cummins, enterprise systems at ACTIVE Network and Centaurus.",
  },
  freelance: {
    description: "Freelance and client work (2018-2022 business process automation period)",
    approximateCount: 25,
    notes: "Business process automation, software development, and client integrations.",
  },
  independent: {
    description: "Independent work and research projects",
    approximateCount: 8,
    notes: "Independent research, tools, and experiments.",
  },
  founder: {
    description: "Founder-led products (HAIEC, KestrelVoice, FrontOfAI, and related)",
    approximateCount: 10,
    notes: "Products and platforms built under SubodhKC.com, HAIEC, and KestrelVoice.",
  },
  "open-source": {
    description: "Open-source packages and tools published publicly",
    approximateCount: 5,
    notes: "llmverify, llmverify-py, MCP Tenant Isolation, AI Article Generator, Print Later, and others.",
  },
} as const;

// Total: 35 + 25 + 8 + 10 + 5 = 83+ (rounded down from category estimates)
export const TOTAL_PROJECTS_DELIVERED = 83;

// Verification metadata
export const PROVENANCE_META = {
  totalProjectsDelivered: 83,
  lastVerified: "2026-08",
  verificationMethod: "Career history reconstruction from employment, freelance, founder, and open-source records",
  publicWording: "83+ projects delivered",
  publicQualifier: "Across enterprise, client and founder-led work spanning software, systems, automation and AI.",
  prohibitions: [
    "Do NOT write: 83 AI projects",
    "Do NOT write: 83 enterprise AI programs",
    "Do NOT write: 83 AI transformations",
    "Do NOT make the metric narrower or stronger than reality",
  ],
};

// 53 enterprise applications (separate metric)
export const ENTERPRISE_APPLICATIONS = {
  count: 53,
  context: "Portfolio leadership across 53 enterprise applications at HP Inc.",
  roleContext: "Core Team Lead / Senior Technical Program Manager with portfolio responsibility",
  deliveryNote: "Coordination through multiple program managers and cross-functional organizations",
  doNotImply: "Do not imply Subodh personally developed all 53 applications",
  publicWording: "53 enterprise applications",
};

// 400+ MES stations (supporting metric for deeper proof)
export const MES_STATIONS = {
  count: 400,
  context: "MES deployment at Cummins Inc. via TCS",
  projectValue: "$10M+ MES project",
  publicWording: "400+ MES stations",
  usage: "Use deeper in proof/About rather than as one of the four hero metrics",
};
