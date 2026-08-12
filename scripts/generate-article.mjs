#!/usr/bin/env node

/**
 * Daily AI Article Generator
 *
 * Uses OpenAI to generate SEO-optimized blog posts that build authority for
 * Subodh KC as an AI systems architect and operator.
 *
 * Usage:
 *   node scripts/generate-article.mjs                    # Auto-pick next topic from calendar
 *   node scripts/generate-article.mjs --topic="EU AI Act risk classification"
 *   node scripts/generate-article.mjs --dry-run           # Generate but don't save
 *
 * Requires: OPENAI_API_KEY environment variable
 * Outputs:  data/blog/posts/<slug>.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const SITE_URL = 'https://subodhkc.com'

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

loadEnvLocal()

function getAllPosts() {
  const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const content = fs.readFileSync(path.join(postsDir, f), 'utf-8')
      return JSON.parse(content)
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function getNextId(posts) {
  const maxId = posts.reduce((max, p) => Math.max(max, p.id || 0), 1000)
  return maxId + 1
}

function getExistingSlugs(posts) {
  return new Set(posts.map((p) => p.slug))
}

function getExistingTitles(posts) {
  return posts.map((p) => p.title.toLowerCase())
}

function stripHtmlForCount(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// ---------------------------------------------------------------------------
// Editorial pillars (aligned with docs/content/pillar-cluster-map.md)
// ---------------------------------------------------------------------------

const PILLARS = {
  'production-ai-architecture': {
    name: 'Production AI Architecture',
    canonical: '/architecture-decision-master-sheet',
    commercial: '/services',
  },
  'ai-operations-and-deployment': {
    name: 'AI Operations and Deployment',
    canonical: '/why-ai-voice-agents-fail-in-production',
    commercial: '/solutions/kestrelvoice',
  },
  'ai-governance-and-evidence': {
    name: 'AI Governance and Evidence',
    canonical: '/how-to-secure-and-govern-ai',
    commercial: '/solutions/haiec',
  },
  'ai-program-execution': {
    name: 'AI Program Execution',
    canonical: '/advisory',
    commercial: '/advisory',
  },
  'builder-research-and-field-lessons': {
    name: 'Builder Research and Field Lessons',
    canonical: '/research',
    commercial: '/research',
  },
}

// ---------------------------------------------------------------------------
// Content calendar - Batch 1 (30 articles across 10 days)
// Strategy: 1 authority article per day (1500-2500 words, depth-first, SEO-cluster-aligned)
// Implementation and operator-brief entries are retained as fallback topics
// ---------------------------------------------------------------------------

const CONTENT_CALENDAR_BATCH_1 = [
  // Day 1 - AI pilot recovery
  { title: 'Why AI Pilots Die After the Demo and What Production Readiness Actually Requires', pillar: 'ai-operations-and-deployment', type: 'authority', day: 1, cta: '/advisory', internalLinks: ['/why-ai-voice-agents-fail-in-production', '/advisory'] },
  { title: '12 Production Readiness Checks Before an AI Pilot Goes Live', pillar: 'ai-operations-and-deployment', type: 'implementation', day: 1, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'How to Recover a Stalled AI Pilot in 30 Days', pillar: 'ai-operations-and-deployment', type: 'operator-brief', day: 1, cta: '/advisory', internalLinks: ['/advisory', '/centaurus'] },
  // Day 2 - Agentic architecture
  { title: 'Production Agentic AI Architecture: Control Plane, Tools, Memory, Identity and Policy', pillar: 'production-ai-architecture', type: 'authority', day: 2, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'AI Agent Tool Permissions: Least Privilege Without Killing Utility', pillar: 'production-ai-architecture', type: 'implementation', day: 2, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/how-to-secure-and-govern-ai'] },
  { title: 'Human-in-the-Loop Is Not a Control Until These Five Decisions Are Defined', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 2, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 3 - RAG reliability
  { title: 'RAG Failure Taxonomy: Retrieval, Authorization, Context and Generation', pillar: 'production-ai-architecture', type: 'authority', day: 3, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/architecture-decision-master-sheet'] },
  { title: 'How to Evaluate RAG Retrieval Before Blaming the LLM', pillar: 'production-ai-architecture', type: 'implementation', day: 3, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/blog/implementing-rag-row-level-security-for-multi-tenant-ai'] },
  { title: 'When Not to Use RAG: Seven Better Architecture Patterns', pillar: 'production-ai-architecture', type: 'operator-brief', day: 3, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/build-internal-ai-applications-streamlit-rag-mcp'] },
  // Day 4 - Voice AI
  { title: 'AI Voice-Agent Production Readiness: Telephony, Latency, Transfers, Booking and Recovery', pillar: 'ai-operations-and-deployment', type: 'authority', day: 4, cta: '/solutions/kestrelvoice', internalLinks: ['/why-ai-voice-agents-fail-in-production', '/ai-voice-agent-architecture'] },
  { title: 'AI Receptionist Cost Model: Telephony, Models, Concurrency and Escalation', pillar: 'ai-operations-and-deployment', type: 'implementation', day: 4, cta: '/solutions/kestrelvoice', internalLinks: ['/kestrel-voice-ai-receptionist-platform', '/solutions/kestrelvoice'] },
  { title: 'Why Voice Agents Break During Transfers and Silent Call States', pillar: 'ai-operations-and-deployment', type: 'operator-brief', day: 4, cta: '/solutions/kestrelvoice', internalLinks: ['/why-ai-voice-agents-fail-in-production', '/ai-voice-agent-architecture'] },
  // Day 5 - Evidence architecture
  { title: 'AI Audit Evidence Architecture: What to Capture Before Deployment', pillar: 'ai-governance-and-evidence', type: 'authority', day: 5, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  { title: 'Static Testing vs Runtime Testing vs Deterministic Rules', pillar: 'ai-governance-and-evidence', type: 'implementation', day: 5, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify'] },
  { title: 'Why an AI Governance Dashboard Is Not Audit Evidence', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 5, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 6 - Operational compliance
  { title: 'AI System Inventory Template: Fields Legal, Security and Engineering Need', pillar: 'ai-governance-and-evidence', type: 'authority', day: 6, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  { title: 'AI Vendor Intake Questionnaire: 40 Evidence Questions Before Approval', pillar: 'ai-governance-and-evidence', type: 'implementation', day: 6, cta: '/solutions/haiec', internalLinks: ['/ai-vendor-due-diligence-checklist', '/solutions/haiec'] },
  { title: 'AI Incident Cure Workflow: Detect, Contain, Document and Remediate', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 6, cta: '/solutions/haiec', internalLinks: ['/ai-incident-evidence-checklist', '/how-to-secure-and-govern-ai'] },
  // Day 7 - AI-built websites
  { title: 'How AI Coding Assistants Accidentally Break SEO', pillar: 'builder-research-and-field-lessons', type: 'authority', day: 7, cta: '/research', internalLinks: ['/blog/hidden-seo-risk-ai-assisted-frontend-development', '/research'] },
  { title: 'How to Test What Google Actually Sees on a JavaScript Website', pillar: 'builder-research-and-field-lessons', type: 'implementation', day: 7, cta: '/research', internalLinks: ['/blog/hidden-seo-risk-ai-assisted-frontend-development', '/blog/what-is-llms-txt'] },
  { title: 'AI-Built Website Launch Checklist: Rendering, Schema, Links, Sitemap and llms.txt', pillar: 'builder-research-and-field-lessons', type: 'operator-brief', day: 7, cta: '/research', internalLinks: ['/blog/what-is-llms-txt', '/blog/hidden-seo-risk-ai-assisted-frontend-development'] },
  // Day 8 - AI program leadership
  { title: 'AI Program Operating Model: Roles, Gates, Evidence and Escalations', pillar: 'ai-program-execution', type: 'authority', day: 8, cta: '/advisory', internalLinks: ['/advisory', '/centaurus'] },
  { title: 'How to Prioritize 50+ AI Initiatives Without Creating a Governance Bottleneck', pillar: 'ai-program-execution', type: 'implementation', day: 8, cta: '/advisory', internalLinks: ['/advisory', '/architecture-decision-master-sheet'] },
  { title: 'The AI Architecture Decision Log Every TPM Should Maintain', pillar: 'ai-program-execution', type: 'operator-brief', day: 8, cta: '/architecture-decision-master-sheet', internalLinks: ['/architecture-decision-master-sheet', '/advisory'] },
  // Day 9 - Economics and vendors
  { title: 'Build vs Buy AI Agents: A Decision Model for Mid-Market and Enterprise Teams', pillar: 'ai-program-execution', type: 'authority', day: 9, cta: '/advisory', internalLinks: ['/advisory', '/services'] },
  { title: 'How to Calculate AI Automation ROI Without Fake Productivity Claims', pillar: 'ai-program-execution', type: 'implementation', day: 9, cta: '/advisory', internalLinks: ['/advisory', '/services'] },
  { title: 'AI Vendor Lock-In: Model, Data, Orchestration, Telephony and Compliance', pillar: 'ai-program-execution', type: 'operator-brief', day: 9, cta: '/advisory', internalLinks: ['/ai-vendor-due-diligence-checklist', '/advisory'] },
  // Day 10 - Differentiated thesis
  { title: 'Why Deterministic Controls Still Matter in Probabilistic AI Systems', pillar: 'ai-governance-and-evidence', type: 'authority', day: 10, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify'] },
  { title: 'The AI System Quietly Became Different: Detecting Behavioral Drift', pillar: 'ai-governance-and-evidence', type: 'implementation', day: 10, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify'] },
  { title: 'What I Would Audit Before Buying Any AI Application', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 10, cta: '/local-ai-review', internalLinks: ['/ai-vendor-due-diligence-checklist', '/solutions/haiec'] },
]

// ---------------------------------------------------------------------------
// Content calendar - Batch 2 (30 articles across days 11-20)
// ---------------------------------------------------------------------------

const CONTENT_CALENDAR_BATCH_2 = [
  // Day 11 - Multi-agent orchestration
  { title: 'Multi-Agent Orchestration Patterns: Router, Sequential, Parallel and Supervisor Models', pillar: 'production-ai-architecture', type: 'authority', day: 11, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'How to Implement Agent Handoff Without Losing Context or Audit Trail', pillar: 'production-ai-architecture', type: 'implementation', day: 11, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/how-to-secure-and-govern-ai'] },
  { title: 'When One Agent Is Enough: Avoiding Over-Orchestration in Production AI', pillar: 'production-ai-architecture', type: 'operator-brief', day: 11, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 12 - AI cost engineering
  { title: 'AI Cost Engineering: Token Budgets, Model Routing and Cache Strategies for Production', pillar: 'ai-operations-and-deployment', type: 'authority', day: 12, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'How to Build a Model Router That Cuts LLM Costs Without Regressing Quality', pillar: 'ai-operations-and-deployment', type: 'implementation', day: 12, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'The Three Cache Layers Every Production RAG System Needs', pillar: 'ai-operations-and-deployment', type: 'operator-brief', day: 12, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/architecture-decision-master-sheet'] },
  // Day 13 - Compliance automation
  { title: 'AI Compliance Automation: Mapping Controls to NIST AI RMF, ISO 42001 and SOC 2 Evidence', pillar: 'ai-governance-and-evidence', type: 'authority', day: 13, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  { title: 'How to Automate AI Risk Register Updates From Runtime Telemetry', pillar: 'ai-governance-and-evidence', type: 'implementation', day: 13, cta: '/solutions/haiec', internalLinks: ['/ai-risk-register', '/how-to-secure-and-govern-ai'] },
  { title: 'Why Spreadsheet Compliance Fails at 50+ AI Use Cases', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 13, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 14 - Voice AI production hardening
  { title: 'Voice AI in Production: Handling Accents, Interruptions, Barge-In and Noisy Channels', pillar: 'ai-operations-and-deployment', type: 'authority', day: 14, cta: '/solutions/kestrelvoice', internalLinks: ['/why-ai-voice-agents-fail-in-production', '/ai-voice-agent-architecture'] },
  { title: 'How to Implement Voice Agent Fallback: IVR, SMS and Human Escalation Patterns', pillar: 'ai-operations-and-deployment', type: 'implementation', day: 14, cta: '/solutions/kestrelvoice', internalLinks: ['/why-ai-voice-agents-fail-in-production', '/solutions/kestrelvoice'] },
  { title: 'Voice Agent Latency Budgets: What 200ms vs 800ms Actually Means for Caller Experience', pillar: 'ai-operations-and-deployment', type: 'operator-brief', day: 14, cta: '/solutions/kestrelvoice', internalLinks: ['/ai-voice-agent-architecture', '/solutions/kestrelvoice'] },
  // Day 15 - RAG evaluation and observability
  { title: 'RAG Evaluation Framework: Retrieval Quality, Groundedness and Answer Relevance Metrics', pillar: 'production-ai-architecture', type: 'authority', day: 15, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/architecture-decision-master-sheet'] },
  { title: 'How to Build a RAG Observability Dashboard Without a Data Engineering Team', pillar: 'production-ai-architecture', type: 'implementation', day: 15, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/services'] },
  { title: 'The Five RAG Failure Modes You Will Only Catch in Production', pillar: 'production-ai-architecture', type: 'operator-brief', day: 15, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/architecture-decision-master-sheet'] },
  // Day 16 - AI security and adversarial
  { title: 'AI Security Threat Model: Prompt Injection, Data Exfiltration and Model Extraction Attacks', pillar: 'ai-governance-and-evidence', type: 'authority', day: 16, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  { title: 'How to Implement Prompt Injection Defenses Without Breaking Agent Utility', pillar: 'ai-governance-and-evidence', type: 'implementation', day: 16, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify'] },
  { title: 'The Three AI Security Tests Every Deployment Gate Should Require', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 16, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify'] },
  // Day 17 - AI program scaling
  { title: 'Scaling an AI Program From 5 to 50 Use Cases: Governance, Infrastructure and Talent', pillar: 'ai-program-execution', type: 'authority', day: 17, cta: '/advisory', internalLinks: ['/advisory', '/architecture-decision-master-sheet'] },
  { title: 'How to Build an AI Center of Excellence Without Creating a Bureaucracy', pillar: 'ai-program-execution', type: 'implementation', day: 17, cta: '/advisory', internalLinks: ['/advisory', '/services'] },
  { title: 'The AI Program Review Template Every Steering Committee Should Use', pillar: 'ai-program-execution', type: 'operator-brief', day: 17, cta: '/advisory', internalLinks: ['/advisory', '/architecture-decision-master-sheet'] },
  // Day 18 - Builder lessons and field research
  { title: 'What I Learned Building 13 Production AI Systems: Architecture Anti-Patterns and Fixes', pillar: 'builder-research-and-field-lessons', type: 'authority', day: 18, cta: '/research', internalLinks: ['/architecture-decision-master-sheet', '/research'] },
  { title: 'How to Debug an AI System That Works in Staging But Fails in Production', pillar: 'builder-research-and-field-lessons', type: 'implementation', day: 18, cta: '/research', internalLinks: ['/research', '/architecture-decision-master-sheet'] },
  { title: 'The Production AI Checklist I Wish I Had on Day One', pillar: 'builder-research-and-field-lessons', type: 'operator-brief', day: 18, cta: '/research', internalLinks: ['/architecture-decision-master-sheet', '/research'] },
  // Day 19 - Model lifecycle and MLOps
  { title: 'AI Model Lifecycle Management: Versioning, Deployment, Rollback and Deprecation Policy', pillar: 'ai-operations-and-deployment', type: 'authority', day: 19, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'How to Implement Model A/B Testing for LLM Applications Without User Impact', pillar: 'ai-operations-and-deployment', type: 'implementation', day: 19, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  { title: 'Why Your Model Retraining Schedule Is Probably Wrong', pillar: 'ai-operations-and-deployment', type: 'operator-brief', day: 19, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 20 - AI governance maturity
  { title: 'AI Governance Maturity Model: From Ad Hoc to Automated Evidence Collection', pillar: 'ai-governance-and-evidence', type: 'authority', day: 20, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  { title: 'How to Map Your AI Controls to Multiple Frameworks Without Duplicating Work', pillar: 'ai-governance-and-evidence', type: 'implementation', day: 20, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  { title: 'The AI Governance Gap Analysis Template for Board-Level Reporting', pillar: 'ai-governance-and-evidence', type: 'operator-brief', day: 20, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
]

// ---------------------------------------------------------------------------
// Content calendar - Batch 3 (20 articles across days 21-40)
// SEO-cluster-aligned: Defensive AI Architecture theme
// 1 authority article per day, depth-first, targeting high-intent search patterns
// ---------------------------------------------------------------------------

const CONTENT_CALENDAR_BATCH_3 = [
  // Day 21 - Cluster 1: TRAIGA safe harbor
  { title: 'TRAIGA Safe Harbor Audit Trails: Mapping NIST AI RMF to Texas Compliance Evidence', pillar: 'ai-governance-and-evidence', type: 'authority', day: 21, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec', '/blog/seven-layers-ai-compliance-nist-iso-soc2'] },
  // Day 22 - Cluster 2: RAG poisoning
  { title: 'How to Prevent RAG Poisoning in Multi-Tenant Enterprise Deployments', pillar: 'production-ai-architecture', type: 'authority', day: 22, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/architecture-decision-master-sheet', '/blog/implementing-rag-row-level-security-for-multi-tenant-ai'] },
  // Day 23 - Cluster 1: NYC LL 144
  { title: 'NYC Local Law 144 Bias Audit: Technical Evidence Requirements and Common Failure Modes', pillar: 'ai-governance-and-evidence', type: 'authority', day: 23, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 24 - Cluster 3: Sovereign AI
  { title: 'Sovereign AI Inference Stack: On-Premises Architecture for Data Residency Compliance', pillar: 'ai-operations-and-deployment', type: 'authority', day: 24, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 25 - Cluster 2: Runtime adversarial gaps
  { title: 'Runtime Adversarial Gaps in LLM Architecture: Detection, Containment and Recovery', pillar: 'production-ai-architecture', type: 'authority', day: 25, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/how-to-secure-and-govern-ai', '/products/llmverify'] },
  // Day 26 - Cluster 1: EU AI Act conformity
  { title: 'EU AI Act Conformity Assessment: Building the Technical Evidence File for High-Risk Systems', pillar: 'ai-governance-and-evidence', type: 'authority', day: 26, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec', '/blog/seven-layers-ai-compliance-nist-iso-soc2'] },
  // Day 27 - Cluster 2: Agent tool permissions
  { title: 'AI Agent Tool Permissions: A Least-Privilege Security Model for Production Deployments', pillar: 'production-ai-architecture', type: 'authority', day: 27, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/how-to-secure-and-govern-ai'] },
  // Day 28 - Cluster 3: Open-weight deployment
  { title: 'Local Open-Weight Model Deployment: Enterprise Governance and ISO 42001 Compliance Checklist', pillar: 'ai-operations-and-deployment', type: 'authority', day: 28, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 29 - Cluster 1: ISO 42001 implementation
  { title: 'ISO 42001 AI Management System Implementation: From Gap Analysis to Certification Audit', pillar: 'ai-governance-and-evidence', type: 'authority', day: 29, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 30 - Cluster 2: Prompt injection defenses
  { title: 'Prompt Injection Defenses That Do Not Break Agent Utility: A Production Architecture', pillar: 'production-ai-architecture', type: 'authority', day: 30, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify', '/architecture-decision-master-sheet'] },
  // Day 31 - Cluster 3: Data residency
  { title: 'AI Data Residency Architecture Patterns for Multi-Jurisdiction Enterprise Deployments', pillar: 'ai-operations-and-deployment', type: 'authority', day: 31, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 32 - Cluster 1: TRAIGA intent test
  { title: 'The TRAIGA Intent Test: Why Automated AI Audits Will Fail Without Runtime Evidence', pillar: 'ai-governance-and-evidence', type: 'authority', day: 32, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 33 - Cluster 2: Model extraction attacks
  { title: 'Model Extraction Attacks on Enterprise LLM APIs: Threat Model and Mitigation Architecture', pillar: 'production-ai-architecture', type: 'authority', day: 33, cta: '/services', internalLinks: ['/how-to-secure-and-govern-ai', '/architecture-decision-master-sheet'] },
  // Day 34 - Cluster 3: Self-hosted LLM
  { title: 'Self-Hosted LLM Production Deployment: Cost, Latency and Governance Tradeoffs vs Cloud APIs', pillar: 'ai-operations-and-deployment', type: 'authority', day: 34, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 35 - Cluster 1: SOC 2 AI evidence
  { title: 'SOC 2 AI Compliance: Mapping Runtime Controls to SOC 2 Trust Services Criteria', pillar: 'ai-governance-and-evidence', type: 'authority', day: 35, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec', '/blog/implementing-immutable-audit-trails-for-soc-2-ai-compliance'] },
  // Day 36 - Cluster 2: Multi-tenant isolation
  { title: 'Multi-Tenant AI Isolation: Architecture Patterns That Prevent Cross-Tenant Data Leakage', pillar: 'production-ai-architecture', type: 'authority', day: 36, cta: '/services', internalLinks: ['/secure-enterprise-rag-architecture', '/architecture-decision-master-sheet', '/blog/implementing-rag-row-level-security-for-multi-tenant-ai'] },
  // Day 37 - Cluster 3: Hybrid inference
  { title: 'Hybrid AI Inference Architecture: Routing Sensitive Workloads Between Cloud and On-Premises', pillar: 'ai-operations-and-deployment', type: 'authority', day: 37, cta: '/services', internalLinks: ['/architecture-decision-master-sheet', '/services'] },
  // Day 38 - Cluster 1: AI incident evidence
  { title: 'AI Incident Evidence Chain: What Regulators Expect After a Production AI Failure', pillar: 'ai-governance-and-evidence', type: 'authority', day: 38, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/solutions/haiec'] },
  // Day 39 - Cluster 2: Behavioral drift
  { title: 'Detecting AI Behavioral Drift in Production: Monitoring Architecture and Alert Thresholds', pillar: 'production-ai-architecture', type: 'authority', day: 39, cta: '/solutions/haiec', internalLinks: ['/how-to-secure-and-govern-ai', '/products/llmverify', '/architecture-decision-master-sheet'] },
  // Day 40 - Cluster 3: Compliance boundary
  { title: 'The Compliance Boundary: When Moving AI Workloads On-Premises Actually Increases Risk', pillar: 'ai-operations-and-deployment', type: 'authority', day: 40, cta: '/advisory', internalLinks: ['/architecture-decision-master-sheet', '/advisory'] },
]

function titleSimilarity(a, b) {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3))
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 3))
  let common = 0
  for (const w of wordsA) {
    if (wordsB.has(w)) common++
  }
  const maxLen = Math.max(wordsA.size, wordsB.size)
  return maxLen > 0 ? common / maxLen : 0
}

function scoreTopic(item, posts) {
  const existingTitles = getExistingTitles(posts)
  const existingSlugs = getExistingSlugs(posts)
  const topicLower = item.title.toLowerCase()
  const potentialSlug = slugify(item.title)

  let score = 0

  // Commercial alignment: 0-20
  const pillar = PILLARS[item.pillar]
  if (pillar) score += 15
  if (item.cta && item.cta !== '/research') score += 5

  // Relevance to Subodh KC's actual experience: 0-20
  const experienceKeywords = [
    'architecture', 'governance', 'evidence', 'rag', 'voice ai', 'agent',
    'pilot', 'production', 'compliance', 'audit', 'testing', 'drift',
    'inventory', 'vendor', 'incident', 'seo', 'llms.txt', 'operating model',
    'decision log', 'deterministic', 'telephony',
  ]
  const topicText = topicLower
  const experienceMatches = experienceKeywords.filter((kw) => topicText.includes(kw)).length
  score += Math.min(experienceMatches * 4, 20)

  // Long-tail search opportunity: 0-15
  const wordCount = item.title.split(/\s+/).length
  if (wordCount >= 8) score += 15
  else if (wordCount >= 6) score += 12
  else if (wordCount >= 4) score += 8
  else score += 4

  // Original evidence available: 0-15
  const evidenceKeywords = [
    'architecture', 'checklist', 'template', 'framework', 'taxonomy',
    'matrix', 'model', 'workflow', 'log', 'inventory', 'evidence',
  ]
  const evidenceMatches = evidenceKeywords.filter((kw) => topicText.includes(kw)).length
  score += Math.min(evidenceMatches * 5, 15)

  // Ability to create a useful artifact: 0-10
  const artifactKeywords = ['checklist', 'template', 'matrix', 'model', 'taxonomy', 'framework', 'workflow']
  const artifactMatches = artifactKeywords.filter((kw) => topicText.includes(kw)).length
  score += Math.min(artifactMatches * 5, 10)

  // Internal-linking value: 0-10
  if (item.internalLinks && item.internalLinks.length >= 2) score += 10
  else if (item.internalLinks && item.internalLinks.length >= 1) score += 5

  // Timeliness: 0-5
  score += 3

  // Backlink or citation potential: 0-5
  const citationKeywords = ['taxonomy', 'framework', 'model', 'checklist', 'architecture']
  const citationMatches = citationKeywords.filter((kw) => topicText.includes(kw)).length
  score += Math.min(citationMatches * 2, 5)

  // --- Penalties ---
  const isDuplicate = existingTitles.some((t) => titleSimilarity(t, topicLower) > 0.6)
  if (isDuplicate) score -= 10

  if (existingSlugs.has(potentialSlug)) score -= 10

  const genericKeywords = ['what is', 'introduction to', 'beginners guide', 'overview of']
  if (genericKeywords.some((kw) => topicText.includes(kw))) score -= 10

  return Math.max(0, Math.min(100, score))
}

function classifyTopic(item, posts) {
  const existingTitles = getExistingTitles(posts)
  const topicLower = item.title.toLowerCase()
  const potentialSlug = slugify(item.title)

  if (existingTitles.some((t) => titleSimilarity(t, topicLower) > 0.7)) {
    return 'cannibalization-risk'
  }
  if (getExistingSlugs(posts).has(potentialSlug)) {
    return 'existing-article-update'
  }
  return 'new-intent'
}

function pickNextTopics(posts) {
  const existingSlugs = getExistingSlugs(posts)
  const existingTitles = getExistingTitles(posts)

  const ALL_TOPICS = [...CONTENT_CALENDAR_BATCH_1, ...CONTENT_CALENDAR_BATCH_2, ...CONTENT_CALENDAR_BATCH_3]

  const scored = ALL_TOPICS.map((item) => {
    const score = scoreTopic(item, posts)
    const classification = classifyTopic(item, posts)
    return { ...item, score, classification }
  })

  const viable = scored.filter((item) => {
    if (item.score < 50) return false
    if (item.classification === 'cannibalization-risk') return false
    const potentialSlug = slugify(item.title)
    if (existingSlugs.has(potentialSlug)) return false
    const topicLower = item.title.toLowerCase()
    if (existingTitles.some((t) => titleSimilarity(t, topicLower) > 0.6)) return false
    return true
  })

  if (viable.length === 0) {
    console.error('ERROR: All 80 calendar topics are exhausted or rejected.')
    console.error('Action required: Add CONTENT_CALENDAR_BATCH_4 to this script or supply --topic flag.')
    console.error('Existing posts: ' + posts.length)
    process.exit(1)
  }

  if (viable.length <= 10) {
    console.warn(`WARNING: Only ${viable.length} calendar topics remaining. Prepare CONTENT_CALENDAR_BATCH_3 soon.`)
  }

  // Group viable topics by day, find the lowest day with viable topics
  const byDay = {}
  for (const item of viable) {
    const day = item.day || 1
    if (!byDay[day]) byDay[day] = []
    byDay[day].push(item)
  }

  const days = Object.keys(byDay).map(Number).sort((a, b) => a - b)
  const lowestDay = days[0]
  const dayTopics = byDay[lowestDay]

  // Sort within the day: authority first, then implementation, then operator-brief
  const typeOrder = { authority: 0, implementation: 1, 'operator-brief': 2 }
  dayTopics.sort((a, b) => (typeOrder[a.type] ?? 3) - (typeOrder[b.type] ?? 3))

  // Only generate the authority article each day - focus on depth over volume
  const authorityOnly = dayTopics.filter((t) => t.type === 'authority')
  if (authorityOnly.length > 0) {
    console.log(`Selected day ${lowestDay}: 1 authority article (depth-first mode)`)
    return [authorityOnly[0]]
  }

  console.log(`Selected day ${lowestDay} with ${dayTopics.length} topic(s)`)
  return dayTopics
}

// ---------------------------------------------------------------------------
// Article type configuration
// ---------------------------------------------------------------------------

const ARTICLE_TYPES = {
  'authority': {
    minWords: 1500,
    maxWords: 2500,
    label: 'Authority Article',
    artifactCount: 2,
  },
  'implementation': {
    minWords: 900,
    maxWords: 1500,
    label: 'Implementation Guide',
    artifactCount: 1,
  },
  'operator-brief': {
    minWords: 600,
    maxWords: 1000,
    label: 'Operator Brief',
    artifactCount: 0,
  },
}

// ---------------------------------------------------------------------------
// Copywriting guardrails (shared across all prompts)
// ---------------------------------------------------------------------------

const COPYWRITING_GUARDRAILS = `COPYWRITING GUARDRAILS (NON-NEGOTIABLE):
- DO NOT use em-dashes or en-dashes anywhere. Use regular hyphens (-), periods, commas, or colons instead.
- DO NOT use any emojis anywhere in the article body.
- DO NOT use any of these AI writing tells: "Here's what I've learned", "After working across", "In my experience", "I've seen firsthand", "Let me share", "Here's the thing", "It's worth noting", "Needless to say", "At the end of the day", "The reality is", "Let's dive in", "Let's explore", "Let's break this down", "Here's a breakdown", "Here's why", "Here's how", "The bottom line is", "It comes down to", "That's where", "This is where", "This isn't just about", "Let's be clear", "One thing is clear", "A key takeaway is", "Picture this", "Imagine", "Fast forward", "Spoiler alert", "Plot twist", "Here's the deal", "But here's the catch", "Which brings us to", "Delve into", "Navigate the complexities", "In the realm of", "A testament to", "Paving the way", "Revolutionize", "Game-changer", "Paradigm shift", "Cutting-edge", "Harness the power", "Unlock the potential", "Empower", "Seamless", "Robust" (as filler adjective), "Leverage" (as verb for "use"), "Streamline", "Foster", "Facilitate", "Underscore", "Underpin", "Bolster", "Dive deep" or "Deep dive" (as verb), "In the ever-evolving landscape of", "In the world of", "It's important to note that", "It's crucial to understand", "When it comes to", "At its core", "The key lies in", "A comprehensive guide", "Everything you need to know", "The ultimate guide"
- DO NOT use AI-style structures: no "hook-question-answer" pattern, no TL;DR sections, no conclusion that merely summarizes the article, no question marks as section headers, no formulaic "three-pillar" or "five-step" structures unless the content genuinely has that structure.
- "Additionally", "Moreover", and "Furthermore" are acceptable English transition words in moderation. No more than 2 paragraphs may start with the same transition word. Vary paragraph openings.
- Vary sentence length significantly. Mix short punchy sentences with longer complex ones.
- Use active voice predominantly. Passive voice only when the actor is genuinely unknown.
- Include at least one genuine "line in the sand" opinion that you actually hold and can defend with evidence. Not manufactured controversy.
- Voice: The expert who has nothing to prove, not the expert who is proving it. Confidence without combativeness.
- DO NOT fabricate personal claims: no "signed a client", "we deployed", "a company I worked with", "in a recent engagement"
- DO NOT invent statistics, numbers, or events
- Write about the topic, the how-to, the analysis. Not about fabricated personal experience.
- Content must be factual and based on real technical and regulatory knowledge.
- Every external URL must be real and must point to the claimed source. Do not fabricate URLs.
- Every regulatory reference must be real: verify bill numbers, regulation numbers, and dates.
- When uncertain about a specific fact, date, or requirement, use temporal or conditional language. Do not state uncertain information as definitive.
- End with a forward-looking statement or specific recommendation, not a recap of the article.`

const FORBIDDEN_CLAIMS = `FORBIDDEN CLAIMS (do not use without verified evidence):
- "Peer-reviewed"
- "Industry standard"
- "Legally defensible"
- "Guaranteed compliance"
- "Audit proof"
- "Eliminates AI risk"
- "100% accurate"
- "Proven at Fortune 50 scale"
- "Adopted across the industry"

CSM TERMINOLOGY GUARDRAILS (mandatory when referencing Cognitive Systems Management):
- CSM has four DOMAINS: CSM-Enterprise, CSM-Project, CSM-Code, CSM-UX. Never use "four-pillar," "four pillars," "pillar model," or any pillar-based terminology.
- The term "CSM6" is stale and must not be used. The six-function operating model is called the "AI Governance Execution Framework."
- Do not rename or rebrand the four CSM domains. The original names are: Enterprise, Project, Code, UX.
- Do not invent CSM components, sub-domains, or extensions not present in the canonical data.
- CSM is a practitioner-developed governance methodology, not a certification, regulation, standard, or peer-reviewed framework. Do not present it as such.
- CSM defines WHERE governance responsibilities operate (four domains). The AI Governance Execution Framework defines WHAT operating functions should continuously occur (six functions). Do not conflate them.
- CSM is a governance methodology. HAIEC is a technology platform. HAIEC supports selected CSM activities but does not fully implement every CSM responsibility.
- When mentioning CSM's origin, cite: "First published August 29, 2025 in 'Cognitive System Management: A Framework for Enterprise AI Project Governance' on AI Governance on Medium."
- Link to /cognitive-systems-management for CSM references, not /solutions/haiec or /research.

CSM 2.0 VERSIONING GUARDRAILS (mandatory when referencing CSM 2.0 specifically):
- CSM 2.0 has spec version 2.0.0 and spec date 2026-08-10. Always cite the version when making V2-specific claims.
- CSM 2.0 is a formalization and extension of the original CSM publication. It does NOT claim the 2025 article contained V2 features. Never state or imply that governance contracts, execution functions, state models, or the determinism boundary were in the original article.
- The six execution functions have canonical IDs: EF1-PURPOSE, EF2-MAPPING, EF3-RISK, EF4-DELIVERY, EF5-OVERSIGHT, EF6-COMPLIANCE. Do not rename or reorder them.
- The 16 governance components have canonical IDs: ENT-POLICY, ENT-RISK, ENT-DATA, ENT-MANDATE, PRJ-BUSINESS, PRJ-TESTING, PRJ-SCALE, PRJ-PLAYBOOK, CODE-STANDARDS, CODE-SECURITY, CODE-HUMAN, CODE-TRACE, UX-IMPACT, UX-EXPLAIN, UX-CAPABILITY, UX-ADOPTION. Do not invent additional components.
- CSM 2.0 is deterministic-by-design for objective rules and makes human judgment explicit where interpretation is required. Never claim CSM 2.0 "automates" governance decisions or "replaces" human judgment.
- CSM 2.0 does NOT produce legal compliance verdicts. Never claim it produces "LEGAL_COMPLIANT," "COMPLIANT," "SAFE," "TRUSTWORTHY," "CERTIFIED," or "AUDIT_PROOF" verdicts.
- CSM 2.0 does NOT produce aggregate scores. Never claim it produces "compliance_score," "safety_score," "trust_score," or "risk_score."
- The machine-readable spec is at /frameworks/csm/2.0/csm-2.0.json with schema at /frameworks/csm/2.0/csm-2.0.schema.json.
- Link to /cognitive-systems-management/v2 for V2 specification, /cognitive-systems-management/contracts for governance contracts, /cognitive-systems-management/assessment for the interactive evaluator.`

const CITATION_SOURCES = [
  // Official / government
  'nist.gov', 'owasp.org', 'europa.eu', 'eur-lex.europa.eu', 'iso.org',
  'ftc.gov', 'eeoc.gov', 'gdpr.eu', 'whitehouse.gov', 'congress.gov',
  'europarl.europa.eu', 'coe.int', 'oecd.org', 'un.org',
  // Industry / analyst
  'a16z.com', 'gartner.com', 'mckinsey.com', 'deloitte.com', 'pwc.com',
  'accenture.com', 'kpmg.com', 'bcg.com', 'forrester.com', 'idc.com',
  // Academic / research
  'arxiv.org', 'ieee.org', 'acm.org', 'harvard.edu', 'mit.edu',
  'stanford.edu', 'berkeley.edu', 'cmu.edu',
  // Tech / vendor documentation
  'github.com', 'microsoft.com', 'google.com', 'openai.com', 'anthropic.com',
  'huggingface.co', 'nvidia.com', 'cloud.google.com', 'aws.amazon.com',
  'learn.microsoft.com', 'developer.mozilla.org',
  // Product sites (Subodh KC products)
  'haiec.com', 'kestrelvoice.com',
]

const ARTICLE_STRUCTURE = `ARTICLE STRUCTURE (use where appropriate):
1. Direct answer or operating conclusion
2. The actual problem
3. Why common approaches fail
4. Architecture or operating model
5. Implementation steps
6. Failure modes and tradeoffs
7. Evidence or documentation required
8. Decision checklist
9. Final recommendation
10. One contextual CTA

DO NOT open with generic language such as:
- "Artificial intelligence is rapidly transforming..."
- "In today's fast-paced digital landscape..."
- "As AI continues to evolve..."
- "Ensuring compliance is essential..."
Begin with a concrete decision, failure, conflict, incident pattern, or operational observation.`

// ---------------------------------------------------------------------------
// Article generation
// ---------------------------------------------------------------------------

async function generateArticle(item, posts, retryHint) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set')
  }

  const pillar = PILLARS[item.pillar]
  const articleType = ARTICLE_TYPES[item.type] || ARTICLE_TYPES['authority']

  const existingPostsContext = posts
    .slice(0, 30)
    .filter((p) => {
      const pKeywords = (p.keywords || []).join(' ').toLowerCase()
      const pillarKeywords = pillar.name.toLowerCase().split(/[\s-]+/)
      return pillarKeywords.some((kw) => pKeywords.includes(kw) || (p.title || '').toLowerCase().includes(kw))
    })
    .slice(0, 5)
    .map((p) => `- ${p.title} (slug: ${p.slug})`)
    .join('\n')

  const internalLinkTargets = (item.internalLinks || [])
    .map((link) => `<a href="${link}">descriptive anchor text</a>`)
    .join(', ')

  const prompt = `You are an expert AI systems architect and operator who writes practical, authoritative content for subodhkc.com. You design, deploy, and govern production AI systems.

POSITIONING: Yeti AI Writer is an AI systems architect and operator who designs, deploys and governs production AI systems.

CONTENT NICHE: Production AI architecture, agentic AI and orchestration, RAG and enterprise knowledge systems, voice-AI operations, AI governance and evidence architecture, static testing, runtime testing and deterministic controls, AI program leadership and pilot recovery, AI-assisted software development and technical SEO.

TARGET AUDIENCE: CTOs, CISOs, AI program leaders, enterprise architects, compliance officers, AI engineers, TPMs

AUTHOR: Yeti AI Writer
TONE: Practical, no fluff, frameworks and steps you can apply. Not "what is X" but "how to do X." Written by someone who builds production systems.

BANNED WORDS (do NOT use any of these anywhere in the article):
Seamless, Leverage, Facilitate, Streamline, Foster, Underscore, Underpin, Bolster, Empower, "Robust" (as filler adjective), "Dive deep", "Deep dive", "Cutting-edge", "Game-changer", "Paradigm shift", "Harness the power", "Unlock the potential", "Paving the way", "A testament to", "Revolutionize", "Delve into", "Navigate the complexities", "In the realm of"
If you find yourself writing any of these, STOP and rewrite the sentence with direct, concrete language.

ARTICLE TYPE: ${articleType.label}
TARGET WORD COUNT: ${articleType.minWords}-${articleType.maxWords} words. This is a HARD REQUIREMENT, not a suggestion. Articles under ${articleType.minWords} words will be rejected. Write comprehensive, detailed content for each section. Each H2 section should be 150-300 words. Do not summarize or abbreviate - fully develop each section with specific examples, steps, and technical detail.

SECTION BLUEPRINT (follow this to hit the word count - these are MINIMUMS, not targets):
${item.type === 'authority' ? `
- <h2>Direct Answer / Operating Conclusion</h2> (MINIMUM 300 words) - State the core finding upfront with technical specificity and concrete examples
- <h2>The Actual Problem</h2> (MINIMUM 350 words) - Describe the failure pattern in detail with concrete scenarios, timelines, and root causes
- <h2>Why Common Approaches Fail</h2> (MINIMUM 350 words) - Analyze 3-4 specific failure modes with technical explanations
- <h2>Architecture or Operating Model</h2> (MINIMUM 400 words) - Present the solution architecture with components, interactions, data flows, and decision points
- <h2>Implementation Steps</h2> (MINIMUM 400 words) - Numbered steps with specific actions, tools, thresholds, and code examples
- <h2>Failure Modes and Tradeoffs</h2> (MINIMUM 350 words) - What can go wrong, how to detect it, how to mitigate, with specific signals and responses
- <h2>Evidence and Documentation</h2> (MINIMUM 250 words) - What artifacts to produce, what metrics to track, what to review
- <h2>FAQ</h2> (MINIMUM 250 words) - 3-5 questions with substantive, detailed answers
Total target: 2650+ words (aim for this to guarantee you hit the 1500 minimum)` : item.type === 'implementation' ? `
- <h2>Direct Answer</h2> (MINIMUM 200 words) - State the implementation approach upfront with context
- <h2>Prerequisites and Context</h2> (MINIMUM 250 words) - What you need before starting, with specifics
- <h2>Step-by-Step Implementation</h2> (MINIMUM 450 words) - Detailed numbered steps with code examples or config snippets
- <h2>Verification and Testing</h2> (MINIMUM 250 words) - How to verify the implementation works, specific test cases
- <h2>Common Pitfalls and Fixes</h2> (MINIMUM 250 words) - Specific errors and their solutions with code
- <h2>FAQ</h2> (MINIMUM 200 words) - 3-5 questions with detailed answers
Total target: 1600+ words (aim for this to guarantee you hit the 900 minimum)` : `
- <h2>Direct Answer</h2> (MINIMUM 200 words) - State the recovery action upfront with context
- <h2>Diagnosis and Assessment</h2> (MINIMUM 350 words) - How to assess the stalled pilot, specific signals to look for, decision criteria
- <h2>Recovery Steps</h2> (MINIMUM 350 words) - Numbered actions with specific timeframes, owners, and success criteria
- <h2>FAQ</h2> (MINIMUM 200 words) - 2-3 questions with detailed answers
Total target: 1100+ words (aim for this to guarantee you hit the 600 minimum)`}

${ARTICLE_STRUCTURE}

ORIGINALITY REQUIREMENTS:
- This ${articleType.label.toLowerCase()} must contain at least ${articleType.artifactCount} of the following: original architecture diagram (described as a text-based diagram), decision matrix, failure taxonomy, control mapping, data schema, event schema, code example, evaluation framework, cost model, checklist, evidence template, original operating lesson, original framework, or product-derived implementation evidence.
${articleType.artifactCount === 0 ? '- Express a defensible point of view rather than summarize other sources.' : ''}

${COPYWRITING_GUARDRAILS}

${FORBIDDEN_CLAIMS}

RESEARCH AND CLAIM CONTROLS:
- Use primary sources wherever possible: statutory or regulatory text, official government guidance, standards organizations, official technical documentation, original research papers
- Do not cite low-quality SEO summaries as authority for legal or technical claims
- Separate known facts from interpretation
- Do not infer a breach, violation, or legal requirement from an ambiguous report

TOPIC: ${item.title}
CONTENT PILLAR: ${pillar.name}
PILLAR CANONICAL PAGE: ${pillar.canonical}
COMMERCIAL DESTINATION: ${pillar.commercial}

INTERNAL LINKING (MANDATORY - include at least 3 internal links):
Place these links naturally in the sections indicated:
${(item.internalLinks || []).map((link, i) => `- In ${i === 0 ? 'the first H2 section' : i === 1 ? 'the second or third H2 section' : 'a later section'}: <a href="${link}">descriptive anchor text related to ${link.replace(/\//g, ' ').trim()}</a>`).join('\n')}
- Link to pillar canonical: <a href="${pillar.canonical}">${pillar.name}</a>
- Use descriptive anchors, never "click here" or "learn more"
- You MUST include at least 3 internal links. Count them before submitting.

EXTERNAL CITATIONS (MANDATORY - include at least 2):
For this topic, consider citing these specific sources:
- NIST AI Risk Management Framework: <a href="https://nist.gov/itl/ai-risk-management-framework">NIST AI RMF</a>
- OWASP: <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/">OWASP Top 10 for LLMs</a>
- EU AI Act: <a href="https://eur-lex.europa.eu/">EU AI Act text</a>
- ISO/IEC 42001: <a href="https://iso.org/standard/81230.html">ISO 42001 AI Management</a>
Full approved source list: ${CITATION_SOURCES.join(', ')}
- Format: <a href="https://domain.com/path">Source Name</a>
- Use primary sources (statutory text, official guidance, standards docs, vendor docs, research papers)
- Do NOT cite low-quality SEO summaries as authority for legal or technical claims
- You MUST include at least 2 external citations. Count them before submitting.

H2 STRUCTURE (mandatory):
- Authority articles: at least 4 H2 sections with substantive content under each
- Implementation guides: at least 3 H2 sections
- Operator briefs: at least 2 H2 sections
- Each H2 section should be 150-300 words

EXISTING POSTS (for additional internal linking context):
${existingPostsContext}

CTA: Include one contextual CTA at the end of the article pointing to: ${item.cta}
${item.cta === '/local-ai-review' ? 'Use exactly: https://subodhkc.com/local-ai-review (no tracking parameters)' : ''}

FINAL WORD COUNT CHECK: Before you generate the JSON, mentally count the words in your contentHtml. If it is under ${articleType.minWords} words, go back and expand EVERY section. Each section must have full paragraphs with specific examples, not summaries. This is your LAST instruction and the MOST IMPORTANT one.

SEO REQUIREMENTS:
1. Title must be under 60 characters and include the primary keyword naturally
2. Title should be compelling and specific (not generic)
3. Meta description must be under 160 characters, include the primary keyword, and accurately describe the content
4. Generate 6-10 relevant keywords/tags (no keyword stuffing)
5. Write a 1-2 sentence excerpt
6. Structure with clear H2 and H3 headings (start with H2, not H1)
7. Include a concise answer near the beginning
8. Include a FAQ section at the end with 3-5 questions and answers (only if questions are genuinely answered)
9. Use HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>, <a>, <table>, <tr>, <th>, <td>
10. No class attributes. No script tags. No em-dashes.

OUTPUT FORMAT - return a JSON object with these exact fields:
{
  "title": "SEO-optimized title (under 60 chars)",
  "metaDescription": "Compelling meta description under 160 chars",
  "contentHtml": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>, <a>, <table> tags. No class attributes. No script tags. Start with an <h2> not an <h1>. Include internal links as <a href=\"/path\">descriptive text</a>. End with a FAQ section.",
  "keywords": ["keyword1", "keyword2", ...],
  "seedKeyword": "primary target keyword",
  "excerpt": "1-2 sentence article excerpt",
  "faqJsonLd": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Question text here",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Answer text here"
        }
      }
    ]
  }
}

Do NOT include id, slug, createdAt, or any other fields - only the fields listed above.
Return ONLY the JSON object, no markdown code fences, no preamble.${retryHint ? `\n\nPREVIOUS ATTEMPT FAILED VALIDATION. You MUST fix these issues:\n${retryHint}` : ''}`

  console.log(`Generating ${articleType.label}: ${item.title}`)
  console.log(`Pillar: ${pillar.name}`)
  console.log(`Target: ${articleType.minWords}-${articleType.maxWords} words`)
  console.log(`Score: ${item.score || 'N/A'} | Classification: ${item.classification || 'N/A'}`)

  let response
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-2024-11-20',
          messages: [
            {
              role: 'system',
              content: `You are the SubodhKC.com editorial engine, writing as "Yeti AI Writer" for the Subodh KC blog. You write practical, authoritative content about production AI architecture, governance, and operations for technical leaders who need implementation guidance, not theory.

EDITORIAL PERSONA:
- Voice: Authoritative, uncompromising, deeply technical, and sharp. No fluffy corporate platitudes or generic tech trends. Speak in metrics, architecture decision records, risk thresholds, and deployment reality.
- Audience: Production Realists. Enterprise architects, Senior PMs, Tech Leads, and Compliance Officers who actually deploy code and protect their companies from regulatory ruin.
- You are NOT writing for the generic middle ground. Every article draws a hard line between "them" (AI hype-men, slide-deck consultants) and "us" (production realists who ship and govern).

SEO THEME: DEFENSIVE AI ARCHITECTURE
- Core theme: Defensive AI Architecture and Production Governance
- Target high-value, low-competition search patterns (semantic problem vectors)
- AI search engines cite definitive, specialized technical frameworks, not generic overviews
- Article structure: Authority Hook (first 200 words) then Citable Blueprint (body) then Advisory CTA (footer)
- Make every paragraph self-contained and quotable. AI search engines extract paragraphs, not full articles.
- Include structured comparison tables and numbered lists where relevant. AI search engines extract these.

HUMANIZATION RULES (MANDATORY):
- No em-dashes or en-dashes. Use regular hyphens, periods, commas, or colons.
- No emojis anywhere in the article body.
- No AI cliches: "Here's what I've learned", "Let's dive in", "At the end of the day", "The reality is", "Navigate the complexities", "In the realm of", "Revolutionize", "Game-changer", "Paradigm shift", "Cutting-edge", "Harness the power", "Seamless", "Leverage", "Streamline", "Foster", "Facilitate", "Underscore", "Deep dive", "In the ever-evolving landscape of", "Everything you need to know", "The ultimate guide"
- No AI structures: no hook-question-answer pattern, no TL;DR, no summarizing conclusion, no question-mark section headers, no formulaic N-step structures
- No starting paragraphs with "Additionally", "Moreover", "Furthermore"
- Vary sentence length significantly. Mix short punchy sentences with longer complex ones.
- Use active voice predominantly.
- Include at least one debatable "line in the sand" opinion.
- End with a forward-looking statement or specific recommendation, not a recap.

HALLUCINATION PREVENTION (MANDATORY):
- Every external URL must be real and point to the claimed source. Do not fabricate URLs.
- Every regulatory reference must be real: verify bill numbers, regulation numbers, and dates.
- Do not fabricate statistics, personal claims, or events.
- Do not invent client names, deployment metrics, or team sizes.
- When you are not certain of a specific fact, date, or requirement, use temporal or conditional language. Do not state uncertain information as definitive. Use "As of [date], [regulation] requires..." instead of "[Regulation] requires..." when requirements may change.

You return only valid JSON.

CRITICAL LENGTH REQUIREMENT: The contentHtml field MUST contain at least ${articleType.minWords} words. This is non-negotiable. Articles under ${articleType.minWords} words will be REJECTED and regenerated.

To hit the word count, you MUST write detailed, substantive paragraphs under every H2 heading. Write ${Math.ceil(articleType.minWords / (item.type === 'authority' ? 6 : item.type === 'implementation' ? 4 : 3))} words per H2 section minimum. Do NOT summarize. Do NOT use bullet points where paragraphs are needed. Fully develop each section with:
- Specific technical examples (code snippets, config samples, architecture descriptions)
- Step-by-step procedures with numbered steps
- Decision matrices or comparison tables
- Real-world failure scenarios and how to handle them
- Concrete metrics, thresholds, and benchmarks

DO NOT be concise. Be thorough and exhaustive. Every section must read like a deep technical guide, not a summary.`,
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: item.type === 'operator-brief' ? 8000 : item.type === 'implementation' ? 12000 : 16384,
          response_format: { type: 'json_object' },
        }),
      })

      if (response.ok) break

      if (response.status === 429 || response.status >= 500) {
        const errorText = await response.text()
        console.warn(`OpenAI API error ${response.status} (attempt ${attempt}/${maxRetries}): ${errorText.slice(0, 200)}`)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 5000
          console.log(`Retrying in ${delay / 1000} seconds...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
      }

      const error = await response.text()
      throw new Error(`OpenAI API error (${response.status}): ${error.slice(0, 200)}`)
    } catch (err) {
      console.warn(`Network error (attempt ${attempt}/${maxRetries}): ${err.message}`)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 5000
        console.log(`Retrying in ${delay / 1000} seconds...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw new Error(`Network error after ${maxRetries} attempts: ${err.message}`)
    }
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  const finishReason = data.choices[0]?.finish_reason

  if (!content) {
    throw new Error(`OpenAI returned empty response. Finish reason: ${finishReason}`)
  }

  if (finishReason === 'length') {
    console.warn('OpenAI response was truncated (finish_reason: length). Attempting continuation...')
    // Try to continue the response by sending the partial content back
    try {
      const continuationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-2024-11-20',
          messages: [
            {
              role: 'system',
              content: 'You are continuing a JSON response that was truncated. Output ONLY the remaining JSON to complete the object. Do not repeat any content. Start exactly where the previous response ended.',
            },
            { role: 'user', content: `Continue this JSON response from where it was cut off. The last characters were:\n\n${content.slice(-500)}\n\nOutput the remaining JSON to complete the object. Close all open strings, arrays, and objects properly.` },
          ],
          temperature: 0.5,
          max_tokens: 8000,
          response_format: { type: 'json_object' },
        }),
      })

      if (continuationResponse.ok) {
        const contData = await continuationResponse.json()
        const contContent = contData.choices[0]?.message?.content
        if (contContent) {
          // Try to merge: find where the continuation overlaps and stitch
          // Simple approach: if continuation starts with a complete JSON, extract its fields and merge
          try {
            const contJson = JSON.parse(contContent.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim())
            // If continuation is a complete JSON object, merge its contentHtml
            if (contJson.contentHtml && article?.contentHtml) {
              article.contentHtml = article.contentHtml + contJson.contentHtml
              console.log('Continuation merged successfully. Extended contentHtml.')
            } else if (contJson.contentHtml) {
              // Original parse failed, use continuation directly
              article = contJson
              console.log('Using continuation response as primary article.')
            }
          } catch {
            // Continuation isn't valid JSON on its own, try raw concatenation
            console.warn('Continuation was not valid JSON. Using repaired original.')
          }
        }
      }
    } catch (contErr) {
      console.warn(`Continuation failed: ${contErr.message}. Using repaired original.`)
    }
  }

  const jsonStr = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()

  let article
  try {
    article = JSON.parse(jsonStr)
  } catch (e) {
    // Attempt to repair truncated JSON by closing open strings and objects
    console.warn('Initial JSON parse failed. Attempting repair of truncated response...')
    let repaired = jsonStr

    // If truncated mid-string, close the string and object braces
    const lastQuote = repaired.lastIndexOf('"')
    const lastBrace = repaired.lastIndexOf('}')
    if (lastQuote > lastBrace) {
      // Truncated inside a string value - close it
      repaired = repaired.slice(0, lastQuote + 1) + '}]}}'
    }

    // Count open vs close braces to balance them
    const openBraces = (repaired.match(/{/g) || []).length
    const closeBraces = (repaired.match(/}/g) || []).length
    const openBrackets = (repaired.match(/\[/g) || []).length
    const closeBrackets = (repaired.match(/\]/g) || []).length
    repaired += '}'.repeat(Math.max(0, openBraces - closeBraces))
    repaired += ']'.repeat(Math.max(0, openBrackets - closeBrackets))

    try {
      article = JSON.parse(repaired)
      console.warn('JSON repair succeeded - article may have truncated content')
    } catch (e2) {
      console.error('Failed to parse OpenAI response as JSON')
      console.error('Finish reason:', finishReason)
      console.error('Response:', content.slice(0, 500))
      throw new Error('Failed to parse OpenAI response as JSON')
    }
  }

  return article
}

// ---------------------------------------------------------------------------
// URL validation - checks that external citation URLs actually resolve
// ---------------------------------------------------------------------------

async function validateUrls(contentHtml) {
  const urlMatches = contentHtml.match(/href="(https?:\/\/(?!subodhkc\.com)[^"]+)"/g) || []
  const urls = urlMatches.map(m => m.match(/href="([^"]+)"/)[1])
  const results = { valid: [], invalid: [], errors: [] }

  // Check up to 10 URLs to avoid timeout
  const urlsToCheck = urls.slice(0, 10)
  for (const url of urlsToCheck) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        results.valid.push(url)
      } else if (response.status === 404) {
        results.invalid.push(url)
        results.errors.push(`URL returns 404: ${url}`)
      } else if (response.status === 403 || response.status === 401) {
        // 403/401 may be behind auth but still real - don't fail
        results.valid.push(url)
      } else {
        results.invalid.push(url)
        results.errors.push(`URL returns ${response.status}: ${url}`)
      }
    } catch (err) {
      // Network errors might be temporary or due to bot protection - don't fail hard
      results.valid.push(url)
    }
  }

  return results
}

// ---------------------------------------------------------------------------
// Post-generation validation
// ---------------------------------------------------------------------------

function validateArticle(article, item) {
  const warnings = []
  const errors = []

  if (!article.title || article.title.length === 0) {
    errors.push('No title generated')
  } else if (article.title.length > 60) {
    warnings.push(`Title is ${article.title.length} chars (recommended: under 60)`)
  }

  if (!article.metaDescription) {
    warnings.push('No meta description generated')
  } else if (article.metaDescription.length > 160) {
    warnings.push(`Meta description is ${article.metaDescription.length} chars (recommended: under 160)`)
  }

  const wordCount = stripHtmlForCount(article.contentHtml || '').split(/\s+/).filter(Boolean).length
  const articleType = ARTICLE_TYPES[item.type] || ARTICLE_TYPES['authority']
  if (wordCount < articleType.minWords) {
    warnings.push(`Content is ${wordCount} words (target: ${articleType.minWords}-${articleType.maxWords}). Content may be too thin.`)
  }

  if (!article.keywords || article.keywords.length < 3) {
    warnings.push(`Only ${article.keywords?.length || 0} keywords (recommended: 6-10)`)
  } else if (article.keywords.length > 12) {
    warnings.push(`${article.keywords.length} keywords (recommended: 6-10, risk of keyword stuffing)`)
  }

  if (!article.excerpt) {
    warnings.push('No excerpt generated')
  }

  if (article.contentHtml && (article.contentHtml.includes('\u2014') || article.contentHtml.includes('\u2013'))) {
    errors.push('Content contains em-dashes or en-dashes. These must be removed.')
  }

  const aiTells = [
    "Here's what I've learned", "After working across", "In my experience",
    "I've seen firsthand", "Let me share", "Here's the thing",
    "It's worth noting", "Needless to say", "At the end of the day",
    "The reality is", "Let's dive in", "Let's explore",
    "Let's break this down", "Here's a breakdown", "Here's why",
    "Here's how", "The bottom line is", "It comes down to",
    "That's where", "This is where", "This isn't just about",
    "Let's be clear", "One thing is clear", "A key takeaway is",
    "Picture this", "Imagine", "Fast forward", "Spoiler alert",
    "Plot twist", "Here's the deal", "But here's the catch",
    "Which brings us to", "Delve into", "Navigate the complexities",
    "In the realm of", "A testament to", "Paving the way",
    "Revolutionize", "Game-changer", "Paradigm shift",
    "Cutting-edge", "Harness the power", "Unlock the potential",
    "Empower", "Seamless", "Streamline", "Foster", "Facilitate",
    "Underscore", "Underpin", "Bolster", "Leverage",
    "Dive deep", "Deep dive",
    "In the ever-evolving landscape", "In the world of",
    "It's important to note that", "It's crucial to understand",
    "When it comes to", "At its core", "The key lies in",
    "A comprehensive guide", "Everything you need to know",
    "The ultimate guide", "A step-by-step guide",
    "TL;DR", "tl;dr",
  ]
  const contentLower = (article.contentHtml || '').toLowerCase()
  const foundTells = aiTells.filter((tell) => contentLower.includes(tell.toLowerCase()))
  if (foundTells.length > 0) {
    warnings.push(`AI writing tells detected: ${foundTells.join(', ')}`)
  }

  const internalLinkCount = (article.contentHtml || '').match(/href="\/[^"]+"/g)
  if (!internalLinkCount || internalLinkCount.length < 3) {
    warnings.push(`Only ${internalLinkCount?.length || 0} internal links (required: at least 3)`)
  }

  // External citation check
  const externalLinks = (article.contentHtml || '').match(/href="https?:\/\/(?!subodhkc\.com)[^"]+"/g) || []
  const citationDomains = CITATION_SOURCES.map(s => s.replace('.', '\\.'))
  const citationRegex = new RegExp(`https?:\/\/([^"\/]*?(?:${citationDomains.join('|')}))`, 'i')
  const citationLinks = externalLinks.filter(l => citationRegex.test(l))
  if (citationLinks.length < 2) {
    warnings.push(`Only ${citationLinks.length} external citations from approved sources (required: at least 2). Found ${externalLinks.length} total external links.`)
  }

  // Check for AI-style structural patterns
  const contentHtml = article.contentHtml || ''
  if (/<h[23][^>]*>\s*[^<]*\?\s*<\/h[23]>/i.test(contentHtml)) {
    warnings.push('Question-mark section headers detected. Use declarative headers instead.')
  }
  if (/TL;DR|tl;dr/i.test(contentHtml)) {
    errors.push('TL;DR section detected. Professional publications do not use TL;DR.')
  }
  // Check for emoji in content
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2700}-\u{27BF}]/u
  if (emojiRegex.test(contentHtml)) {
    errors.push('Emoji detected in article content. Remove all emojis.')
  }

  // H2 section count check
  const h2Count = ((article.contentHtml || '').match(/<h2[\s>]/gi) || []).length
  const minH2 = { authority: 4, implementation: 3, 'operator-brief': 2 }
  const requiredH2 = minH2[item.type] || 4
  if (h2Count < requiredH2) {
    warnings.push(`Only ${h2Count} H2 sections (required: at least ${requiredH2} for ${item.type || 'authority'})`)
  }

  const forbiddenClaims = [
    'peer-reviewed', 'industry standard', 'legally defensible',
    'guaranteed compliance', 'audit proof', 'eliminates ai risk',
    '100% accurate', 'proven at fortune 50 scale', 'adopted across the industry',
  ]
  const foundForbidden = forbiddenClaims.filter((claim) => contentLower.includes(claim))
  if (foundForbidden.length > 0) {
    errors.push(`Forbidden claims detected: ${foundForbidden.join(', ')}`)
  }

  // --- CSM stale terminology check ---
  const csmStaleTerms = [
    'four-pillar', 'four pillar', 'csm6', 'csm pillar',
    'strategic alignment', 'technical implementation',
    'governance and risk', 'operational excellence',
  ]
  const foundCsmStale = csmStaleTerms.filter((term) => contentLower.includes(term))
  if (foundCsmStale.length > 0) {
    errors.push(`Stale CSM terminology detected: ${foundCsmStale.join(', ')}. Use canonical four-domain model (Enterprise, Project, Code, UX) and "AI Governance Execution Framework" instead of CSM6.`)
  }

  // --- CSM 2.0 forbidden output states check ---
  const csmForbiddenOutputs = [
    'legal_compliant', 'eu_ai_act_compliant', 'audit_proof',
    'compliance_score', 'safety_score', 'trust_score', 'risk_score',
  ]
  const foundCsmForbidden = csmForbiddenOutputs.filter((term) => contentLower.includes(term))
  if (foundCsmForbidden.length > 0) {
    errors.push(`Forbidden CSM 2.0 output states detected: ${foundCsmForbidden.join(', ')}. CSM 2.0 does not produce legal compliance verdicts or aggregate scores.`)
  }

  // --- Citation density check ---
  // Target: at least 1 external citation per 500 words
  const citationCount = citationLinks.length
  const requiredCitations = Math.max(2, Math.ceil(wordCount / 500))
  if (citationCount < requiredCitations) {
    warnings.push(`Citation density: ${citationCount} citations for ${wordCount} words (target: ${requiredCitations} citations, 1 per 500 words)`)
  }

  // --- Title specificity score ---
  // Title must contain at least one specific noun (law name, tech name, framework, metric)
  if (article.title) {
    const specificNouns = [
      'traiga', 'eu ai act', 'nyc', 'll 144', 'll144', 'iso 42001', 'iso/iec 42001',
      'nist', 'ai rmf', 'soc 2', 'soc2', 'gdpr', 'ccpa', 'hipaa',
      'rag', 'llm', 'llms', 'vector database', 'embedding', 'retrieval',
      'prompt injection', 'data exfiltration', 'model extraction',
      'multi-tenant', 'row-level security', 'rls',
      'agent', 'agentic', 'orchestration', 'middleware',
      'voice agent', 'telephony', 'ivr', 'barge-in',
      'audit trail', 'evidence', 'compliance', 'governance',
      'drift', 'adversarial', 'poisoning', 'isolation',
      'sovereign', 'on-premises', 'on-prem', 'open-weight', 'inference',
      'token', 'latency', 'throughput', 'concurrency',
      'haiec', 'kestrelvoice', 'devin', 'openai', 'anthropic',
      'cognitive systems management', 'csm', 'csm-enterprise', 'csm-project', 'csm-code', 'csm-ux',
      'ai governance execution framework',
      'csm 2.0', 'governance contract', 'determinism boundary', 'reassessment trigger',
      'governance depth', 'baseline governance', 'enhanced governance', 'intensive governance',
      'python', 'typescript', 'nextjs', 'react',
      'api', 'rest', 'graphql', 'grpc',
      'kubernetes', 'docker', 'aws', 'azure', 'gcp',
    ]
    const titleLower = article.title.toLowerCase()
    const hasSpecificNoun = specificNouns.some((noun) => titleLower.includes(noun))
    if (!hasSpecificNoun) {
      warnings.push(`Title specificity: "${article.title}" lacks a specific noun (law name, technology, framework, or metric). Add specificity for AI search citation.`)
    }
  }

  // --- Paragraph independence check ---
  // Flag paragraphs that start with "This" or "These" (depend on previous paragraph)
  const paragraphMatches = (article.contentHtml || '').match(/<p[^>]*>\s*(This|These)\s/gi) || []
  const totalParagraphs = ((article.contentHtml || '').match(/<p[\s>]/gi) || []).length
  if (totalParagraphs > 0) {
    const dependentRatio = paragraphMatches.length / totalParagraphs
    if (dependentRatio > 0.20) {
      warnings.push(`Paragraph independence: ${paragraphMatches.length} of ${totalParagraphs} paragraphs start with "This" or "These" (${Math.round(dependentRatio * 100)}%). Restructure for AI search citation.`)
    }
  }

  // --- Transition word frequency check ---
  // No more than 2 paragraphs may start with the same transition word
  const transitionStarts = {}
  const transitionWords = ['Additionally,', 'Moreover,', 'Furthermore,', 'However,', 'Therefore,', 'Consequently,', 'Nevertheless,', 'Nonetheless,']
  for (const word of transitionWords) {
    const regex = new RegExp(`<p[^>]*>\\s*${word.replace(',', ',?')}\\s`, 'gi')
    const matches = (article.contentHtml || '').match(regex) || []
    if (matches.length > 2) {
      warnings.push(`Transition word frequency: "${word}" starts ${matches.length} paragraphs (max 2 allowed). Vary paragraph openings.`)
    }
  }

  return { warnings, errors, wordCount }
}

// ---------------------------------------------------------------------------
// Checklist generation
// ---------------------------------------------------------------------------

async function generateChecklist(article, slug) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const prompt = `You are an expert AI systems architect. Based on the article below, generate a practical, downloadable checklist in Markdown format that a reader can use to implement the guidance.

TITLE: ${article.title}
KEYWORDS: ${(article.keywords || []).join(', ')}
EXCERPT: ${article.excerpt || ''}

CONTENT (first 3000 chars):
${(article.contentHtml || '').replace(/<[^>]+>/g, ' ').slice(0, 3000)}

REQUIREMENTS:
1. Generate a Markdown checklist (100-300 lines) that is actionable and specific
2. Use Markdown checkboxes: - [ ] item
3. Organize into logical sections with ## headers
4. Include specific technical steps, not vague advice
5. Include a "Preparation" section, an "Implementation" section, and a "Verification" section
6. Add an "Evidence to Collect" section listing what audit artifacts to save
7. DO NOT use em-dashes or en-dashes. Use regular hyphens.
8. DO NOT use AI writing tells or fabricated personal claims.
9. Start with a brief 2-3 line description of what this checklist covers
10. End with a "## About" section: "Generated from: ${SITE_URL}/blog/${slug}"

Return ONLY the Markdown content, no code fences, no preamble.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-11-20',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI systems architect who creates practical, actionable checklists. You return only valid Markdown. You never use em-dashes, en-dashes, emojis, or AI writing patterns.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      console.warn(`Checklist generation failed (${response.status}) - skipping`)
      return null
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) return null

    return content.replace(/^```markdown?\s*/i, '').replace(/\s*```$/i, '').trim()
  } catch (err) {
    console.warn(`Checklist generation error: ${err.message} - skipping`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Retry hint builder - creates actionable feedback for the model
// ---------------------------------------------------------------------------

function buildRetryHint(errors, wordCount, articleType, item) {
  const hints = []
  const minH2 = { authority: 4, implementation: 3, 'operator-brief': 2 }
  const requiredH2 = minH2[item.type] || 4

  for (const err of errors) {
    if (err.includes('words (target:')) {
      const deficit = articleType.minWords - wordCount
      hints.push(`LENGTH FAILURE: Your previous attempt was only ${wordCount} words. The minimum is ${articleType.minWords}. You need ${deficit} MORE words. To fix this: expand EVERY H2 section to at least ${Math.ceil(articleType.minWords / requiredH2)} words. Add specific code examples, step-by-step procedures, decision matrices, and concrete scenarios. Do NOT summarize - write full paragraphs with technical detail.`)
    } else if (err.includes('AI writing tells')) {
      const tells = err.replace('AI writing tells detected: ', '')
      hints.push(`AI TELLS FAILURE: Remove these phrases entirely: ${tells}. Replace with direct, technical language. Instead of "Leverage" use "use". Instead of "Seamless" use "integrated" or describe the specific integration. Instead of "Facilitate" use "enable" or describe the specific mechanism.`)
    } else if (err.includes('internal links')) {
      hints.push(`INTERNAL LINKS FAILURE: You need at least 3 internal links. Add links to: ${item.internalLinks?.join(', ') || '/services'}. Also link to related articles. Format: <a href="/path">descriptive anchor text</a>. Do NOT use "click here" or "learn more".`)
    } else if (err.includes('external citations')) {
      hints.push(`EXTERNAL CITATIONS FAILURE: You need at least 2 external links to authoritative sources from this list: ${CITATION_SOURCES.slice(0, 15).join(', ')}. Add links like: <a href="https://nist.gov/...">NIST guidance</a> or <a href="https://owasp.org/...">OWASP standard</a>. These must be real, relevant sources for the topic.`)
    } else if (err.includes('H2 sections')) {
      hints.push(`H2 STRUCTURE FAILURE: You need at least ${requiredH2} H2 sections. Follow the SECTION BLUEPRINT in the prompt. Each H2 must have substantial content (150-300 words). Use <h2> tags, not <h3> or <strong>.`)
    } else if (err.includes('HALLUCINATION CHECK')) {
      hints.push(`HALLUCINATION FAILURE: ${err}. The URL you cited does not resolve or returns a 404. You MUST only use real, verified URLs. If you are not certain a URL exists, do not include it. Use only URLs from the approved citation sources list.`)
    } else if (err.includes('Emoji detected')) {
      hints.push(`EMOJI FAILURE: Remove all emojis from the article content. Professional publications do not use emojis.`)
    } else if (err.includes('TL;DR')) {
      hints.push(`TL;DR FAILURE: Remove the TL;DR section. Professional publications do not use TL;DR. End with a forward-looking statement or specific recommendation instead.`)
    } else if (err.includes('Question-mark section headers')) {
      hints.push(`QUESTION HEADER FAILURE: Replace all question-mark section headers with declarative statements. Instead of "Why Does RAG Fail?" use "RAG Failure Modes" or "Where RAG Breaks".`)
    } else if (err.includes('Citation density')) {
      hints.push(`CITATION DENSITY FAILURE: You need more external citations. Target is 1 citation per 500 words. Add more links to authoritative sources from the approved list: ${CITATION_SOURCES.slice(0, 10).join(', ')}. Each citation must be a real, relevant source.`)
    } else if (err.includes('Title specificity')) {
      hints.push(`TITLE SPECIFICITY FAILURE: The title lacks a specific noun. Add a law name (TRAIGA, EU AI Act, NYC LL 144), technology name (RAG, LLM, vector database), framework name (NIST AI RMF, ISO 42001), or concrete metric. Make the title citable by AI search engines.`)
    } else if (err.includes('Paragraph independence')) {
      hints.push(`PARAGRAPH INDEPENDENCE FAILURE: Too many paragraphs start with "This" or "These", which depend on the previous paragraph. Restructure paragraphs to be self-contained. Each paragraph should make sense if cited in isolation by an AI search engine.`)
    } else if (err.includes('Transition word frequency')) {
      hints.push(`TRANSITION FREQUENCY FAILURE: Too many paragraphs start with the same transition word (Additionally, Moreover, Furthermore, etc.). Vary paragraph openings. Start with the new point directly, use the subject as the opener, or use varied transitions.`)
    } else {
      hints.push(err)
    }
  }

  return hints.join('\n\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  const topicArg = args.find((a) => a.startsWith('--topic='))?.split('=')[1]
  const dryRun = args.includes('--dry-run')
  const reviewOnly = args.includes('--review-only')

  let posts = getAllPosts()
  console.log(`Found ${posts.length} existing posts`)

  // Determine topics to generate
  let topics
  if (topicArg) {
    console.log(`\nCustom topic: ${topicArg}`)
    topics = [{
      title: topicArg,
      pillar: 'production-ai-architecture',
      type: 'authority',
      cta: '/services',
      internalLinks: ['/architecture-decision-master-sheet', '/services'],
      score: 70,
      classification: 'new-intent',
    }]
  } else {
    topics = pickNextTopics(posts)
    console.log(`\nSelected ${topics.length} topic(s) for generation:`)
    for (const t of topics) {
      console.log(`  - [${t.type}] ${t.title} (score: ${t.score})`)
    }
  }

  const generatedSlugs = []
  const manifestEntries = []
  let hadErrors = false

  for (let topicIdx = 0; topicIdx < topics.length; topicIdx++) {
    const item = topics[topicIdx]
    console.log(`\n${'='.repeat(70)}`)
    console.log(`Article ${topicIdx + 1}/${topics.length}: ${item.title}`)
    console.log(`Type: ${item.type} | Pillar: ${item.pillar}`)
    console.log(`${'='.repeat(70)}`)

    let article
    const maxGenAttempts = 3
    let validationErrors = []
    let validationWarnings = []
    let wordCount = 0

    for (let genAttempt = 1; genAttempt <= maxGenAttempts; genAttempt++) {
      const currentArticleType = ARTICLE_TYPES[item.type] || ARTICLE_TYPES['authority']
      const retryHint = genAttempt > 1 ? buildRetryHint(validationErrors, wordCount, currentArticleType, item) : null
      if (retryHint) {
        console.log(`\n  Retry attempt ${genAttempt}/${maxGenAttempts} - fixing validation issues...`)
      }

      try {
        article = await generateArticle(item, posts, retryHint)
      } catch (genErr) {
        console.error(`\n  Generation error on attempt ${genAttempt}: ${genErr.message}`)
        if (genAttempt < maxGenAttempts) {
          console.log('  Retrying...')
          continue
        }
        console.error(`  Skipping article "${item.title}" after ${maxGenAttempts} generation failures.`)
        hadErrors = true
        break
      }

      // Post-generation dedup check
      const existingTitlesForCheck = getExistingTitles(posts)
      const generatedTitleLower = (article.title || '').toLowerCase()
      const similarityHit = existingTitlesForCheck.find(
        (t) => titleSimilarity(t, generatedTitleLower) > 0.7
      )
      if (similarityHit) {
        console.error(`\n  DUPLICATE DETECTED: Generated title "${article.title}" is too similar to existing post "${similarityHit}"`)
        console.error('  Skipping this topic to prevent duplicate content.')
        hadErrors = true
        break
      }

      // Validate generated article
      const result = validateArticle(article, item)
      validationWarnings = result.warnings
      validationErrors = result.errors
      wordCount = result.wordCount

      // URL validation - check that external citations resolve
      if (!reviewOnly && !dryRun) {
        console.log('\n  Validating external URLs...')
        const urlResults = await validateUrls(article.contentHtml || '')
        if (urlResults.valid.length > 0) {
          console.log(`  URL check: ${urlResults.valid.length} valid, ${urlResults.invalid.length} invalid`)
        }
        for (const urlErr of urlResults.errors) {
          errors.push(`HALLUCINATION CHECK: ${urlErr}`)
          validationErrors.push(`HALLUCINATION CHECK: ${urlErr}`)
        }
      }

      // Auto-publish mode: upgrade critical warnings to errors
      const criticalWarnings = validationWarnings.filter((w) =>
        w.includes('AI writing tells detected') ||
        w.includes('internal links') ||
        w.includes('words (target:') ||
        w.includes('external citations') ||
        w.includes('H2 sections') ||
        w.includes('Question-mark section headers') ||
      w.includes('Citation density') ||
      w.includes('Title specificity') ||
      w.includes('Paragraph independence') ||
      w.includes('Transition word frequency') ||
        w.includes('Citation density') ||
        w.includes('Title specificity') ||
        w.includes('Paragraph independence') ||
        w.includes('Transition word frequency')
      )
      if (!reviewOnly && !dryRun) {
        for (const cw of criticalWarnings) {
          validationErrors.push(cw)
        }
      }

      if (validationErrors.length === 0) {
        break
      }

      if (genAttempt < maxGenAttempts) {
        console.log(`\n  Attempt ${genAttempt} validation errors (will retry):`)
        for (const e of validationErrors) {
          console.log(`    - ${e}`)
        }
        // Reset errors for next attempt - only carry forward the fixable ones
        validationErrors = validationErrors.filter((e) =>
          e.includes('words (target:') ||
          e.includes('internal links') ||
          e.includes('AI writing tells') ||
          e.includes('external citations') ||
          e.includes('H2 sections') ||
          e.includes('HALLUCINATION CHECK') ||
          e.includes('Emoji detected') ||
          e.includes('TL;DR') ||
          e.includes('Question-mark') ||
          e.includes('Citation density') ||
          e.includes('Title specificity') ||
          e.includes('Paragraph independence') ||
          e.includes('Transition word frequency')
        )
      }
    }

    if (validationErrors.length > 0) {
      // After all retries, check if the only remaining errors are word count
      // If word count is at least 90% of minimum, accept it rather than discarding
      const currentType = ARTICLE_TYPES[item.type] || ARTICLE_TYPES['authority']
      const wordCount90 = Math.round(currentType.minWords * 0.90)
      const nonWordCountErrors = validationErrors.filter(e => !e.includes('words (target:'))
      const wordCountErrors = validationErrors.filter(e => e.includes('words (target:'))

      if (nonWordCountErrors.length > 0) {
        console.log('\n  ERRORS (must fix before publishing):')
        for (const e of validationErrors) {
          console.log(`    - ${e}`)
        }
        console.error(`  Skipping article "${item.title}" due to validation errors after all retry attempts.`)
        hadErrors = true
        continue
      } else if (wordCountErrors.length > 0 && wordCount >= wordCount90) {
        // Word count is close enough (90%+), accept with warning
        console.log(`\n  Word count ${wordCount} is below target ${currentType.minWords} but above 90% threshold (${wordCount90}). Accepting.`)
        validationErrors = []
      } else {
        console.log('\n  ERRORS (must fix before publishing):')
        for (const e of validationErrors) {
          console.log(`    - ${e}`)
        }
        console.error(`  Skipping article "${item.title}" due to validation errors after all retry attempts.`)
        hadErrors = true
        continue
      }
    }

    const criticalWarnings = validationWarnings.filter((w) =>
      w.includes('AI writing tells detected') ||
      w.includes('internal links') ||
      w.includes('words (target:') ||
      w.includes('external citations') ||
      w.includes('H2 sections') ||
      w.includes('Question-mark section headers') ||
      w.includes('Citation density') ||
      w.includes('Title specificity') ||
      w.includes('Paragraph independence') ||
      w.includes('Transition word frequency')
    )
    const remainingWarnings = validationWarnings.filter((w) => !criticalWarnings.includes(w))
    if (remainingWarnings.length > 0) {
      console.log('\n  Warnings (non-blocking):')
      for (const w of remainingWarnings) {
        console.log(`    - ${w}`)
      }
    }

    console.log('\n  All quality gate checks passed')
    console.log(`  Word count: ~${wordCount}`)

    // Build full post object
    const id = getNextId(posts)
    const slug = slugify(article.title)

    const existingSlugs = getExistingSlugs(posts)
    let uniqueSlug = slug
    let counter = 2
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const post = {
      id,
      title: article.title,
      slug: uniqueSlug,
      metaDescription: article.metaDescription,
      contentHtml: article.contentHtml,
      contentMarkdown: '',
      heroImageUrl: null,
      jsonLd: null,
      faqJsonLd: article.faqJsonLd || null,
      languageCode: 'en',
      createdAt: new Date().toISOString(),
      keywords: article.keywords || [],
      seedKeyword: article.seedKeyword || null,
      excerpt: article.excerpt || null,
      author: 'Yeti AI Writer',
      downloadableUrl: null,
      downloadableLabel: null,
      type: item.type || 'authority',
      pillar: item.pillar || null,
    }

    console.log(`\nGenerated post:`)
    console.log(`  ID: ${post.id}`)
    console.log(`  Title: ${post.title}`)
    console.log(`  Slug: ${post.slug}`)
    console.log(`  Type: ${post.type}`)
    console.log(`  Keywords: ${post.keywords.join(', ')}`)
    console.log(`  Content length: ${post.contentHtml.length} chars`)

    if (dryRun) {
      console.log('\n--dry-run: not saving file')
      console.log('\nContent preview (first 500 chars):')
      console.log(post.contentHtml.slice(0, 500))
      generatedSlugs.push(post.slug)
      manifestEntries.push({ slug: post.slug, type: post.type, title: post.title, wordCount })
      continue
    }

    if (reviewOnly) {
      console.log('\n--review-only: file not saved. Review the output above.')
      generatedSlugs.push(post.slug)
      manifestEntries.push({ slug: post.slug, type: post.type, title: post.title, wordCount })
      continue
    }

    // Save post
    const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true })
    }

    const outputPath = path.join(postsDir, `${post.slug}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), 'utf-8')
    console.log(`\nSaved to: data/blog/posts/${post.slug}.json`)

    // Add to posts array so next article can see it for dedup
    posts.push(post)

    // Generate downloadable checklist (skip for operator-briefs - too short for useful checklist)
    if (item.type !== 'operator-brief') {
      console.log('\nGenerating downloadable checklist...')
      const checklist = await generateChecklist(article, post.slug)
      if (checklist) {
        const downloadsDir = path.join(ROOT, 'public', 'downloads')
        if (!fs.existsSync(downloadsDir)) {
          fs.mkdirSync(downloadsDir, { recursive: true })
        }
        const checklistPath = path.join(downloadsDir, `${post.slug}-checklist.md`)
        fs.writeFileSync(checklistPath, checklist, 'utf-8')
        console.log(`  Checklist saved to public/downloads/${post.slug}-checklist.md`)

        post.downloadableUrl = `/downloads/${post.slug}-checklist.md`
        post.downloadableLabel = `Download the ${article.title.split(' ').slice(0, 4).join(' ')} Checklist`
        fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), 'utf-8')
        console.log(`  Post updated with downloadable URL`)
      } else {
        console.log('  Checklist generation skipped - post saved without downloadable')
      }
    }

    // Generate hero image with DALL-E 3
    if (process.env.OPENAI_API_KEY) {
      console.log('\nGenerating hero image with DALL-E 3...')
      try {
        const { execSync } = await import('child_process')
        execSync(`node scripts/generate-hero-image.mjs --slug=${post.slug}`, {
          cwd: ROOT,
          stdio: 'inherit',
        })
      } catch (err) {
        console.warn(`Hero image generation failed: ${err.message}`)
        console.warn('Post saved successfully. Image can be generated later with: node scripts/generate-hero-image.mjs --slug=' + post.slug)
      }
    }

    generatedSlugs.push(post.slug)
    manifestEntries.push({ slug: post.slug, type: post.type, title: post.title, wordCount })
  }

  // Write daily manifest for workflow consumption
  if (!dryRun && !reviewOnly && manifestEntries.length > 0) {
    const manifest = {
      date: new Date().toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      articles: manifestEntries,
    }
    const manifestDir = path.join(ROOT, 'data', 'blog')
    const manifestPath = path.join(manifestDir, 'daily-manifest.json')
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
    console.log(`\nDaily manifest written to: data/blog/daily-manifest.json`)
    console.log(`  Articles: ${manifestEntries.map(a => a.slug).join(', ')}`)
  }

  console.log(`\n${'='.repeat(70)}`)
  console.log(`Generation complete: ${generatedSlugs.length}/${topics.length} articles generated`)
  if (hadErrors) {
    console.log('Some articles had errors and were skipped.')
  }
  console.log(`  Slugs: ${generatedSlugs.join(', ')}`)
  if (generatedSlugs.length > 0) {
    console.log(`\nArticle auto-published:`)
    console.log(`  1. Article(s) saved and ready for commit`)
    console.log(`  2. GitHub Action will auto-generate social content`)
    console.log(`  3. IndexNow + Google Indexing API will auto-ping on push`)
    console.log(`  4. LinkedIn + Dev.to cross-post will trigger on commit`)
  } else {
    console.log(`\nNo articles were successfully generated. Check errors above.`)
  }

  if (hadErrors && generatedSlugs.length === 0 && !dryRun && !reviewOnly) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
