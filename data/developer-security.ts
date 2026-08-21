// data/developer-security.ts
// HAIEC Developer Security family registry.
// Single source of truth for the three-product developer-security family
// displayed on the homepage, product pages, release article, and AI/LLM files.
//
// Family model:
//   SOURCE    -> AI AppSec
//   BOUNDARY  -> MCP Tenant Isolation
//   RUNTIME   -> LLMVerify
//
// Versions are verified against live npm registry at implementation time.
// Do NOT regress a newer version to values in any planning document.

export type FamilyRole = 'source' | 'boundary' | 'runtime'

export interface DeveloperSecurityProduct {
  id: string
  name: string
  displayName: string
  familyRole: FamilyRole
  familyRoleLabel: string
  version: string
  status: 'released' | 'stable'
  description: string
  tagline: string
  githubRepo: string
  githubUrl: string
  npmPackage: string
  npmUrl: string
  mcpRegistryId: string | null
  cli: string
  mcpTool: string | null
  license: string
  brand: string
  productPage: string
  releasePage: string
  haiecUrl: string
  interfaces: string[]
  proofFacts: string[]
  limitations: string[]
  installCommand: string
  releaseDate: string
  nodeRequirement: string
  mcpVersion: string | null
}

export const DEVELOPER_SECURITY_PRODUCTS: DeveloperSecurityProduct[] = [
  {
    id: 'ai-appsec',
    name: 'AI AppSec',
    displayName: 'AI AppSec',
    familyRole: 'source',
    familyRoleLabel: 'SOURCE SECURITY',
    version: '0.1.0',
    status: 'released',
    description:
      'Evidence-backed AppSec for AI applications and agents. Audit AI/LLM application source code before commit, PR, merge or deployment with explicit coverage, reproducible findings and tamper-evident scan evidence.',
    tagline: 'Evidence-backed AppSec for AI applications and agents.',
    githubRepo: 'subodhkc/ai-appsec',
    githubUrl: 'https://github.com/subodhkc/ai-appsec',
    npmPackage: 'ai-appsec',
    npmUrl: 'https://www.npmjs.com/package/ai-appsec',
    mcpRegistryId: 'io.github.subodhkc/ai-appsec',
    cli: 'ai-appsec',
    mcpTool: 'scan_ai_security',
    license: 'MIT',
    brand: 'Powered by HAIEC',
    productPage: '/products/ai-appsec',
    releasePage: '/insights/ai-appsec-mcp-tenant-isolation-release',
    haiecUrl: 'https://www.haiec.com',
    interfaces: ['CLI', 'MCP v2 server (stdio)', 'npm package'],
    proofFacts: [
      '122 Public Core detectors',
      '79 semantic security checks',
      'Semgrep 1.173.0 execution engine',
      'COMPLETE / PARTIAL / ERROR coverage semantics',
      'Scan Receipts with SHA-256 evidence digests',
      'Evidence Envelopes',
      'Proof-of-fix comparison',
      'rulepack / manifest runtime verification',
      'Local scanning after Semgrep setup',
      'No HAIEC account or API key required',
      'Semgrep telemetry disabled during scans (--metrics off)',
    ],
    limitations: [
      'Static analysis only - does not execute target code',
      'No runtime behavioral assurance',
      'No compliance certification',
      'No full-system AI assurance',
      'Semgrep must be installed separately (ai-appsec setup)',
      'Setup may require network access',
      'Tenant isolation is a separate product (MCP Tenant Isolation)',
      'Runtime LLM verification is a separate product (LLMVerify)',
    ],
    installCommand: 'npm install -g ai-appsec',
    releaseDate: '2026-08-21',
    nodeRequirement: '>=22',
    mcpVersion: 'v2',
  },
  {
    id: 'mcp-tenant-isolation',
    name: 'MCP Tenant Isolation',
    displayName: 'MCP Tenant Isolation',
    familyRole: 'boundary',
    familyRoleLabel: 'BOUNDARY SECURITY',
    version: '2.0.0',
    status: 'released',
    description:
      'Catch cross-tenant leaks before production. Purpose-built static analysis for tenant boundaries across multi-tenant SaaS and MCP server code.',
    tagline: 'Catch cross-tenant leaks before production.',
    githubRepo: 'subodhkc/mcp-tenant-isolation',
    githubUrl: 'https://github.com/subodhkc/mcp-tenant-isolation',
    npmPackage: 'mcp-tenant-isolation',
    npmUrl: 'https://www.npmjs.com/package/mcp-tenant-isolation',
    mcpRegistryId: 'io.github.subodhkc/mcp-tenant-isolation',
    cli: 'mti',
    mcpTool: 'scan_tenant_isolation',
    license: 'MIT',
    brand: 'Powered by HAIEC',
    productPage: '/products/mcp-tenant-isolation',
    releasePage: '/insights/ai-appsec-mcp-tenant-isolation-release',
    haiecUrl: 'https://www.haiec.com',
    interfaces: ['CLI', 'MCP v2 server (stdio only)', 'npm package', 'GitHub Action', 'Docker'],
    proofFacts: [
      '57 deterministic rules',
      '42 general multi-tenant rules',
      '15 MCP-specific rules',
      'TypeScript / JavaScript / Prisma / Drizzle / raw SQL',
      'Next.js / Express / Fastify support',
      'AST parsing with Intermediate Representation',
      'Flow-aware analysis with guard detection',
      'Structured findings with concern families',
      'COMPLETE / PARTIAL / ERROR coverage accounting',
      '8 concern-family groupings',
      'Semantic fingerprints stable across line movement',
      'Scan Receipts with SHA-256 digests',
      'Evidence Envelopes',
      'Proof-of-fix: STILL_PRESENT / NEW / NOT_VERIFIABLE',
      'Baseline support for tracking',
      'Custom rule packs',
      'SARIF 2.1.0 / JSON / AI-oriented JSON / Markdown / terminal output',
      'GitHub Action for CI',
      'MCP v2: stdio-only, read-only by default',
      'Project-root filesystem confinement',
      'Traversal prevention, UNC path protection, symlink escape protection',
      'Write operations disabled by default (--allow-write-tools opt-in)',
      'OWASP MCP Top 10 advisory mapping',
    ],
    limitations: [
      'Static analysis has inherent limitations',
      'Cannot prove runtime behavior',
      'Cannot prove database enforcement occurring outside analyzed artifacts',
      'Dynamic or generated code may not be visible',
      'Unsupported languages are reported',
      'Partial scans do not prove absence of findings',
      'OWASP mapping is advisory, not compliance certification',
      'No compliance certification',
    ],
    installCommand: 'npx mcp-tenant-isolation scan ./src',
    releaseDate: '2026-08-21',
    nodeRequirement: '>=22',
    mcpVersion: 'v2',
  },
  {
    id: 'llmverify',
    name: 'llmverify',
    displayName: 'llmverify',
    familyRole: 'runtime',
    familyRoleLabel: 'RUNTIME VERIFICATION',
    version: '1.6.1',
    status: 'stable',
    description:
      'Verify model interactions before they reach users. Local-first LLM verification and guardrails for prompt-injection risk, PII redaction, hallucination risk signals, JSON quality and runtime health.',
    tagline: 'Verify model interactions before they reach users.',
    githubRepo: 'subodhkc/llmverify-npm',
    githubUrl: 'https://github.com/subodhkc/llmverify-npm',
    npmPackage: 'llmverify',
    npmUrl: 'https://www.npmjs.com/package/llmverify',
    mcpRegistryId: null,
    cli: 'llmverify',
    mcpTool: null,
    license: 'MIT',
    brand: 'Powered by HAIEC',
    productPage: '/products/llmverify',
    releasePage: '/insights/ai-appsec-mcp-tenant-isolation-release',
    haiecUrl: 'https://www.haiec.com',
    interfaces: ['CLI', 'npm package', 'llmverify-serve local HTTP API'],
    proofFacts: [
      'Local-first verification - zero telemetry on free tier',
      'Prompt-injection checks (pattern-based, 9 attack categories)',
      'PII redaction (25+ patterns: emails, SSNs, credit cards, API keys)',
      'Hallucination risk signals (heuristic-based)',
      'JSON repair and validation',
      'Runtime health monitoring (latency, token drift, behavioral changes)',
      'Model-agnostic adapters (OpenAI, Anthropic, Groq, Google AI, DeepSeek, Mistral, Cohere, local models)',
      'Sentinel regression testing',
      'Audit log with hash-only entries',
      'Preset pipelines: run, prodVerify, ciVerify',
      'Deterministic, pattern-based engines - no model calls required',
      'Every result carries an explicit limitations array',
    ],
    limitations: [
      'Provides guardrails and risk indicators, not ground truth',
      'Cannot definitively prove hallucinations',
      'Does not replace human review for high-stakes decisions',
      'PII detection is regex-based - misses obfuscated or encoded PII',
      'Prompt-injection detection is pattern-based - novel attacks may evade detection',
      'No MCP server interface (CLI and local HTTP API only)',
    ],
    installCommand: 'npm install llmverify',
    releaseDate: '2026-08-21',
    nodeRequirement: '>=18',
    mcpVersion: null,
  },
]

// Convenience lookups
export const AI_APPSEC = DEVELOPER_SECURITY_PRODUCTS.find((p) => p.id === 'ai-appsec')!
export const MCP_TENANT_ISOLATION = DEVELOPER_SECURITY_PRODUCTS.find((p) => p.id === 'mcp-tenant-isolation')!
export const LLMVERIFY = DEVELOPER_SECURITY_PRODUCTS.find((p) => p.id === 'llmverify')!

export const FAMILY_SENTENCE = 'Secure the code. Protect the tenant boundary. Verify the model interaction.'

export const FAMILY_DESCRIPTOR = 'Security and verification tools for AI-assisted development.'

export const FAMILY_NAME = 'HAIEC Developer Security'

// Rule family counts for MCP Tenant Isolation (verified from README)
export const TENANT_RULE_FAMILIES = [
  { prefix: 'TCM', category: 'Tenant Context Management', count: 6, severity: 'Critical' },
  { prefix: 'DBQ', category: 'Database Query Isolation', count: 10, severity: 'Critical' },
  { prefix: 'IDOR', category: 'IDOR Prevention', count: 5, severity: 'Critical' },
  { prefix: 'CSI', category: 'Cache & Session Isolation', count: 4, severity: 'High' },
  { prefix: 'API', category: 'API Security', count: 3, severity: 'High' },
  { prefix: 'FSI', category: 'File Storage Isolation', count: 4, severity: 'High' },
  { prefix: 'LOG', category: 'Logging & Audit', count: 4, severity: 'Medium' },
  { prefix: 'SCH', category: 'Schema & Migration', count: 6, severity: 'High' },
] as const

export const TENANT_MCP_RULES_COUNT = 15
export const TENANT_GENERAL_RULES_COUNT = 42
export const TENANT_TOTAL_RULES = 57

// AI AppSec security signal categories (verified from README)
export const AI_APPSEC_SIGNAL_CATEGORIES = [
  'Unsafe AI-output execution',
  'Secrets exposure',
  'RAG and model-integration risk',
  'Insecure AI API usage',
  'Security control gaps',
  'Prompt/input-related risk signals',
] as const

// AI AppSec coverage semantics (verified from README)
export const AI_APPSEC_COVERAGE_SEMANTICS = [
  'DISCOVERED',
  'INTENTIONALLY_EXCLUDED',
  'UNSUPPORTED',
  'TARGETED',
  'ENGINE_REPORTED_SCANNED',
  'PARSE_FAILED',
  'SUCCESSFULLY_ANALYZED',
] as const

// AI AppSec finding semantics (verified from README)
export const AI_APPSEC_FINDING_KINDS = ['PRESENCE', 'RISK_SIGNAL', 'CONTROL_GAP', 'VULNERABILITY'] as const
export const AI_APPSEC_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const
export const AI_APPSEC_DISPOSITIONS = ['INFORMATIONAL', 'REVIEW', 'BLOCK'] as const

// MCP Tenant Isolation MCP tools (verified from README)
export const TENANT_MCP_TOOLS = [
  { name: 'scan_tenant_isolation', description: 'Scan a project path. Returns structured findings with completeness, coverage, concern families, and receipt.', write: false },
  { name: 'list_tenant_isolation_rules', description: 'Returns all 57 rules with metadata. Filterable by category.', write: false },
  { name: 'explain_tenant_isolation_rule', description: 'Returns rule details, OWASP mapping, CWE IDs, fix suggestions.', write: false },
  { name: 'suppress_tenant_isolation_finding', description: 'Add a suppression with reason, approver, controls, and expiry. Write-gated.', write: true },
] as const

// Prohibited claims that must never appear on developer-security surfaces
export const PROHIBITED_CLAIMS = [
  "world's first",
  'only security scanner',
  'best',
  'complete security',
  'production secure',
  'zero false positives',
  'guarantees safety',
  'guarantees tenant isolation',
  'fully compliant',
  'SOC 2 compliant',
  'HIPAA compliant',
  'GDPR compliant',
  'OWASP compliant',
  'AI cannot hallucinate',
  'formal proof',
  'formal verification',
  'complete taint analysis',
  'fully autonomous security',
] as const
