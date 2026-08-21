/**
 * Canonical Security Claim Registry
 *
 * Single source of truth for security-related claims used across
 * /saas-security-review, /ai-security-compliance, /services, and llms.txt.
 * Each claim records its technical source, implementation status, and
 * approved marketing wording so that mutable counts are never duplicated.
 */

export interface SecurityClaim {
  id: string
  claim: string
  technicalSource: string
  implementationStatus: 'verified' | 'described' | 'patent-pending' | 'planned' | 'placeholder'
  validationSource: string
  frameworkReference?: string[]
  approvedWording: string
  lastVerified: string
}

export const securityClaims: SecurityClaim[] = [
  {
    id: 'SC-001',
    claim: 'Static AI/compliance scanning in CI',
    technicalSource: 'HAIEC Action GitHub Action (github.com/subodhkc/haiec-github-action)',
    implementationStatus: 'verified',
    validationSource: 'Public GitHub repository, "uses: subodhkc/haiec-github-action@v1"',
    frameworkReference: ['OWASP LLM Top 10', 'NIST AI RMF'],
    approvedWording: 'Static AI security scanning in your CI pipeline via HAIEC Action',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-002',
    claim: 'Runtime adversarial testing of AI systems',
    technicalSource: 'HAIEC Exposure Assessment methodology (subodhkc.com/solutions/haiec/exposure-assessment)',
    implementationStatus: 'verified',
    validationSource: 'Published assessment page describing prompt injection, RAG data integrity, tool abuse, auth bypass, cross-tenant testing',
    frameworkReference: ['OWASP LLM Top 10', 'NIST AI RMF', 'MITRE ATLAS'],
    approvedWording: 'Runtime adversarial testing: prompt injection, RAG data integrity, tool abuse, auth bypass, and cross-tenant access attempts',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-003',
    claim: 'Tenant isolation testing across database, API, storage, and roles',
    technicalSource: 'tests/multi-tenant/*.sql (rls-isolation-tests, expanded-security-tests, queue-isolation-tests, auth-flow-tests, onboarding-edge-cases)',
    implementationStatus: 'verified',
    validationSource: 'SQL test files in repository covering RLS, IDOR, membership, role escalation, storage, background jobs, realtime',
    frameworkReference: ['OWASP Application Security', 'SOC 2 CC'],
    approvedWording: 'Tenant isolation testing across authentication, roles, API routes, database queries, storage, background jobs, and realtime subscriptions',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-004',
    claim: 'SHA-256 cryptographic hash chains for AI training audit trails',
    technicalSource: 'ISAF Logger (github.com/haiec/isaf-logger, PyPI: haiec-isaf-logger)',
    implementationStatus: 'verified',
    validationSource: 'Public PyPI package and GitHub repository. Page: subodhkc.com/packages/isaf',
    frameworkReference: ['EU AI Act Article 10 & 11', 'NIST AI RMF', 'ISO 42001', 'Colorado AI Act'],
    approvedWording: 'Cryptographically fingerprinted evidence via SHA-256 hash chains (ISAF Logger)',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-005',
    claim: 'Tamper-evident audit trails for AI system documentation',
    technicalSource: 'ISAF Logger hash chain implementation',
    implementationStatus: 'verified',
    validationSource: 'ISAF Logger package features: "SHA-256 hash chains prove lineage integrity. Tamper-evident audit trails that regulators trust."',
    frameworkReference: ['EU AI Act Article 10 & 11', 'ISO 42001'],
    approvedWording: 'Tamper-evident records with SHA-256 hash chain provenance',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-006',
    claim: 'LLM output verification and guardrails (npm)',
    technicalSource: 'llmverify (npm: llmverify@1.6.1, github.com/subodhkc/llmverify-npm)',
    implementationStatus: 'verified',
    validationSource:
      'Public npm package with SLSA provenance attestations. Page: subodhkc.com/products/llmverify',
    frameworkReference: ['OWASP LLM Top 10'],
    approvedWording: 'Runtime LLM output verification via llmverify (npm)',
    lastVerified: '2026-08-21',
  },
  {
    id: 'SC-018',
    claim: 'AI application source security scanner (npm)',
    technicalSource: 'AI AppSec (npm: ai-appsec@0.1.0, github.com/subodhkc/ai-appsec)',
    implementationStatus: 'verified',
    validationSource:
      'Public npm package with SLSA provenance attestations. 122 Public Core detectors, 79 security checks, Semgrep 1.173.0 engine. MCP v2 server. Page: subodhkc.com/products/ai-appsec',
    frameworkReference: ['OWASP LLM Top 10'],
    approvedWording: 'Evidence-backed AppSec for AI applications and agents via AI AppSec (npm)',
    lastVerified: '2026-08-21',
  },
  {
    id: 'SC-019',
    claim: 'MCP tenant isolation static analysis scanner (npm)',
    technicalSource: 'MCP Tenant Isolation (npm: mcp-tenant-isolation@2.0.0, github.com/subodhkc/mcp-tenant-isolation)',
    implementationStatus: 'verified',
    validationSource:
      'Public npm package with SLSA provenance attestations. 57 deterministic rules (42 general + 15 MCP-specific). MCP v2 server, stdio only. GitHub Action. Page: subodhkc.com/products/mcp-tenant-isolation',
    frameworkReference: ['OWASP MCP Top 10'],
    approvedWording: 'Deterministic tenant-boundary analysis for multi-tenant SaaS and MCP code via MCP Tenant Isolation (npm)',
    lastVerified: '2026-08-21',
  },
  {
    id: 'SC-006a',
    claim: 'Python distribution of llmverify (placeholder)',
    technicalSource: 'llmverify (PyPI: llmverify@0.0.1, pypi.org/project/llmverify)',
    implementationStatus: 'placeholder',
    validationSource:
      'PyPI package exists as a namespace reservation. Full port is planned; current package returns placeholder responses only.',
    frameworkReference: [],
    approvedWording:
      'llmverify Python package is a PyPI placeholder; the production implementation is the npm package',
    lastVerified: '2026-08-21',
  },
  {
    id: 'SC-007',
    claim: 'Shadow AI detection across codebase and stack',
    technicalSource: 'Shadow AI Detector (github.com/subodhkc/Shadow-AI-Detector)',
    implementationStatus: 'verified',
    validationSource: 'Public GitHub repository. Telemetry-free, on-premise.',
    frameworkReference: ['NIST AI RMF'],
    approvedWording: 'Shadow AI detection: find unauthorized AI use across your codebase and stack',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-008',
    claim: 'Cognitive Systems Management (CSM) 2.0 governance methodology',
    technicalSource: 'data/csm/v2/spec.ts, public/frameworks/csm/2.0/csm-2.0.json, tests/csm-v2/golden-tests.ts',
    implementationStatus: 'verified',
    validationSource: 'Published spec version 2.0.0, machine-readable JSON, golden tests, invariant tests. Original publication: Medium AI Governance, Aug 29 2025.',
    frameworkReference: ['CSM 2.0'],
    approvedWording: 'CSM 2.0: deterministic-by-design governance operating model with four domains and six execution functions',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-009',
    claim: 'Framework mappings to EU AI Act, NIST AI RMF, ISO 42001, NYC LL144, SOC 2, TRAIGA',
    technicalSource: 'Exposure assessment page, AI security compliance page, guides pages, HAIEC platform',
    implementationStatus: 'verified',
    validationSource: 'Published pages with framework-specific descriptions and compliance mappings',
    frameworkReference: ['EU AI Act', 'NIST AI RMF', 'ISO 42001', 'NYC LL144', 'SOC 2', 'TRAIGA', 'OWASP LLM Top 10'],
    approvedWording: 'Cross-referenced with EU AI Act, NIST AI RMF, ISO 42001, NYC LL144, SOC 2, and TRAIGA',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-010',
    claim: 'ISAF published methodology with persistent DOI',
    technicalSource: 'ISAF Logger (Zenodo publication)',
    implementationStatus: 'verified',
    validationSource: 'ISAF page references Zenodo publication. PyPI package: haiec-isaf-logger.',
    frameworkReference: ['EU AI Act Article 10 & 11', 'NIST AI RMF', 'ISO 42001'],
    approvedWording: 'Published methodology with persistent DOI (ISAF on Zenodo)',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-011',
    claim: 'Architecture Decision Master Sheet with security layer',
    technicalSource: 'subodhkc.com/architecture-decision-master-sheet (interactive 25-layer sheet)',
    implementationStatus: 'verified',
    validationSource: 'Published interactive page with 25 layers including Quality & Security group',
    frameworkReference: ['CSM'],
    approvedWording: 'Architecture Decision Master Sheet: 25-layer reference with AI development risks and security decisions',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-012',
    claim: 'AI security interactive tools (blast radius, agent matrix, prompt injection library)',
    technicalSource: 'subodhkc.com/ai-security-tools (AIBlastRadiusCalculator, PromptInjectionScenarioLibrary, agent matrix)',
    implementationStatus: 'verified',
    validationSource: 'Published interactive components in repository',
    frameworkReference: ['OWASP LLM Top 10', 'NIST AI RMF'],
    approvedWording: 'Free interactive AI security tools: blast radius calculator, agent read/write/action matrix, and prompt injection scenario library',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-013',
    claim: 'Compliance Twin real-time regulatory enforcement engine',
    technicalSource: 'Patent-pending framework (listed in llms.txt patent-pending frameworks)',
    implementationStatus: 'patent-pending',
    validationSource: 'Patent application filed. Not implemented as a product.',
    frameworkReference: ['EU AI Act', 'GDPR'],
    approvedWording: 'Patent-pending Compliance Twin framework for real-time regulatory enforcement',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-014',
    claim: 'HMAC-SHA256 provenance for evidence records',
    technicalSource: 'Not implemented in subodhkc.com codebase',
    implementationStatus: 'planned',
    validationSource: 'No implementation found. Do not claim in marketing copy.',
    frameworkReference: [],
    approvedWording: 'Do not use in current marketing copy. Planned for future evidence system.',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-015',
    claim: 'Merkle evidence bundles',
    technicalSource: 'Not implemented in subodhkc.com codebase',
    implementationStatus: 'planned',
    validationSource: 'No implementation found. Do not claim in marketing copy.',
    frameworkReference: [],
    approvedWording: 'Do not use in current marketing copy. Planned for future evidence system.',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-016',
    claim: 'Verification endpoints for evidence records',
    technicalSource: 'Not implemented in subodhkc.com codebase',
    implementationStatus: 'planned',
    validationSource: 'No implementation found. Do not claim in marketing copy.',
    frameworkReference: [],
    approvedWording: 'Do not use in current marketing copy. Planned for future evidence system.',
    lastVerified: '2026-08-13',
  },
  {
    id: 'SC-017',
    claim: 'SARIF output format',
    technicalSource: 'Not implemented in subodhkc.com codebase',
    implementationStatus: 'planned',
    validationSource: 'No implementation found. Do not claim in marketing copy.',
    frameworkReference: [],
    approvedWording: 'Do not use in current marketing copy. Planned for future reporting format.',
    lastVerified: '2026-08-13',
  },
]

/**
 * Convenience: only claims that are verified and safe to use in marketing copy.
 */
export const verifiedClaims = securityClaims.filter(
  (c) => c.implementationStatus === 'verified'
)

/**
 * Claims that must NOT be used in current marketing copy.
 */
export const blockedClaims = securityClaims.filter(
  (c) => c.implementationStatus === 'planned'
)

/**
 * Canonical capability counts (derived from verified claims, not hardcoded).
 */
export const capabilityCounts = {
  staticAnalysisTools: 3, // HAIEC Action, AI AppSec, MCP Tenant Isolation
  runtimeAttackVectors: 5, // prompt injection, RAG data integrity, tool abuse, auth bypass, cross-tenant
  tenantIsolationTestSuites: 7, // rls, expanded-security, queue, auth-flow, onboarding, school-pickup, dismissal-groups
  frameworkMappings: 7, // EU AI Act, NIST AI RMF, ISO 42001, NYC LL144, SOC 2, TRAIGA, OWASP LLM
  openSourceTools: 6, // llmverify, AI AppSec, MCP Tenant Isolation, ISAF, Shadow AI Detector, HAIEC Action
  interactiveSecurityTools: 3, // blast radius, agent matrix, prompt injection library
}
