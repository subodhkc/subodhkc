/**
 * HAIEC Technical Architecture & Defensibility Brief
 * PowerPoint Generation Script
 *
 * Generates: public/centaurus/haiec-technical-architecture-defensibility-brief.pptx
 * Format: 16:9 widescreen, dark slate theme, emerald accents
 *
 * All technical claims validated against HAIEC TDA modules and source code.
 */

import pptxgen from 'pptxgenjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// ============================================================
// THEME CONSTANTS
// ============================================================

const THEME = {
  bg: '0F172A',          // dark slate
  bgAlt: '1E293B',       // lighter slate
  card: '1E293B',        // card background
  cardBorder: '334155',  // card border
  emerald: '10B981',     // primary accent
  emeraldDark: '059669', // darker emerald
  amber: 'F59E0B',       // partial/warning
  red: 'EF4444',         // critical/blocker
  white: 'F8FAFC',       // warm white text
  gray: '94A3B8',        // muted gray secondary
  grayDark: '64748B',    // darker gray
  mono: 'Courier New',   // monospace labels
  sans: 'Calibri',       // body font
  heading: 'Calibri',    // heading font
}

const SLIDE_W = 13.333  // 16:9 widescreen
const SLIDE_H = 7.5

// ============================================================
// HELPERS
// ============================================================

function addSlideBackground(slide) {
  slide.background = { color: THEME.bg }
}

function addFooter(slide, pageNum, totalPages) {
  slide.addText(
    `HAIEC  ·  Confidential Discussion Brief  ·  ${pageNum}/${totalPages}`,
    {
      x: 0.3, y: SLIDE_H - 0.35, w: 8, h: 0.25,
      fontSize: 8, color: THEME.grayDark, fontFace: THEME.sans
    }
  )
  slide.addText(
    `v1.0  ·  ${new Date().toISOString().split('T')[0]}`,
    {
      x: SLIDE_W - 3, y: SLIDE_H - 0.35, w: 2.7, h: 0.25,
      fontSize: 8, color: THEME.grayDark, fontFace: THEME.mono, align: 'right'
    }
  )
}

function addSlideTitle(slide, text, opts = {}) {
  const y = opts.y ?? 0.4
  slide.addText(text, {
    x: 0.6, y, w: SLIDE_W - 1.2, h: 0.55,
    fontSize: 26, fontFace: THEME.heading, bold: true,
    color: THEME.white, align: 'left'
  })
  // Thin emerald accent line
  slide.addShape('rect', {
    x: 0.6, y: y + 0.6, w: 1.5, h: 0.04,
    fill: { color: THEME.emerald }, line: { type: 'none' }
  })
}

function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: opts.fill ?? THEME.card },
    line: { color: opts.border ?? THEME.cardBorder, width: 0.5 },
    rectRadius: 0.05
  })
}

function addStatusTag(slide, x, y, label, status) {
  const colors = {
    implemented: { bg: THEME.emerald, text: 'FFFFFF' },
    active: { bg: THEME.emerald, text: 'FFFFFF' },
    roadmap: { bg: THEME.emeraldDark, text: 'FFFFFF' },
    foundation: { bg: THEME.emeraldDark, text: 'FFFFFF' },
  }
  const c = colors[status] ?? colors.implemented
  slide.addShape('roundRect', {
    x, y, w: 1.8, h: 0.3,
    fill: { color: c.bg },
    line: { type: 'none' },
    rectRadius: 0.03
  })
  slide.addText(label, {
    x, y, w: 1.8, h: 0.3,
    fontSize: 8, fontFace: THEME.mono, color: c.text,
    align: 'center', valign: 'middle'
  })
}

function addMonoLabel(slide, x, y, text, opts = {}) {
  slide.addText(text, {
    x, y, w: opts.w ?? 3, h: 0.2,
    fontSize: 8, fontFace: THEME.mono, color: THEME.gray,
    align: opts.align ?? 'left'
  })
}

function addBodyText(slide, x, y, w, h, text, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: opts.fontSize ?? 11, fontFace: THEME.sans,
    color: opts.color ?? THEME.white,
    align: 'left', valign: 'top',
    lineSpacingMultiple: 1.2,
    bold: opts.bold ?? false
  })
}

function addArrowConnector(slide, x1, y1, x2, y2) {
  slide.addShape('line', {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color: THEME.emerald, width: 1, endArrowType: 'triangle' }
  })
}

function addRightArrow(slide, x, y, w) {
  slide.addShape('line', {
    x, y, w, h: 0,
    line: { color: THEME.emerald, width: 1.5, endArrowType: 'triangle' }
  })
}

function addDownArrow(slide, x, y, h) {
  slide.addShape('line', {
    x, y, w: 0, h,
    line: { color: THEME.emerald, width: 1.5, endArrowType: 'triangle' }
  })
}

// ============================================================
// CAPABILITY COUNTS (from TDA modules)
// ============================================================

const CAPABILITY_COUNTS = {
  semgrepRules: 91,
  coreTsrules: 15,
  rulepackRules: 82,
  totalStaticRules: 188,
  baseAttackTemplates: 234,
  voiceAttackTemplates: 12,
  embeddedSaasTemplates: 7,
  agenticTemplates: 7,
  aiDevTemplates: 3,
  ragDeepTemplates: 6,
  totalAttackTemplates: 269,
  safetyProperties: 14,
  complianceFrameworks: 13,  // SOC2, GDPR, HIPAA, ISO27001, ISO42001, OWASP, CWE, NIST_AI_RMF, EU_AI_ACT, TCPA, CCPA, BIPA, COLORADO_AI, NYC_LL144, FTC_ACT
  orchestratorRoutes: 12,
  staticApiRoutes: 31,
  runtimeApiRoutes: 22,
  twinApiRoutes: 17,
  killSwitchApiRoutes: 19,
  pipelineDashboardRoutes: 12,
  pipelineEnterpriseRoutes: 2,
  jurisdictions: 6,
  pipelineNodes: 6,
  rulepackSeedRules: 23,
}

// Try to get git commit
function getGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: projectRoot, encoding: 'utf-8' }).trim()
  } catch {
    return 'unknown'
  }
}

const GIT_COMMIT = getGitCommit()
const TOTAL_SLIDES = 14

// ============================================================
// SLIDE BUILDERS
// ============================================================

// --- Slide 1: Cover ---
function buildSlide1(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)

  // Top monospace label
  addMonoLabel(slide, 0.6, 0.5, 'HAIEC TECHNICAL BRIEF · v1.0', { w: 6 })

  // Main title
  slide.addText('HAIEC', {
    x: 0.6, y: 1.5, w: 12, h: 1.2,
    fontSize: 54, fontFace: THEME.heading, bold: true,
    color: THEME.white, align: 'left'
  })

  // Emerald accent bar
  slide.addShape('rect', {
    x: 0.6, y: 2.8, w: 3, h: 0.06,
    fill: { color: THEME.emerald }, line: { type: 'none' }
  })

  // Subtitle
  slide.addText('Evidence-Native Security Infrastructure for Operational AI', {
    x: 0.6, y: 3.0, w: 11, h: 0.5,
    fontSize: 22, fontFace: THEME.heading,
    color: THEME.emerald, align: 'left'
  })

  // Supporting line
  slide.addText('Technical Architecture, Defensibility and Strategic Value', {
    x: 0.6, y: 3.6, w: 11, h: 0.4,
    fontSize: 16, fontFace: THEME.sans,
    color: THEME.gray, align: 'left'
  })

  // Visual flow
  const flowY = 5.0
  const flowItems = ['AI System', 'Security Validation', 'Control Mapping', 'Verifiable Evidence']
  const flowW = 2.5
  const flowGap = 0.4
  let flowX = 0.6

  flowItems.forEach((item, i) => {
    addCard(slide, flowX, flowY, flowW, 0.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
    slide.addText(item, {
      x: flowX, y: flowY, w: flowW, h: 0.5,
      fontSize: 10, fontFace: THEME.mono, color: THEME.white,
      align: 'center', valign: 'middle'
    })
    if (i < flowItems.length - 1) {
      addRightArrow(slide, flowX + flowW + 0.05, flowY + 0.25, flowGap - 0.1)
    }
    flowX += flowW + flowGap
  })

  // Footer
  slide.addText('Confidential Discussion Brief', {
    x: 0.6, y: 6.5, w: 6, h: 0.3,
    fontSize: 10, fontFace: THEME.sans, color: THEME.grayDark
  })

  addFooter(slide, 1, TOTAL_SLIDES)
}

// --- Slide 2: Core Thesis ---
function buildSlide2(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'AI assurance has a proof problem.')

  // Copy
  addBodyText(slide, 0.6, 1.3, 12, 0.8,
    'Security tools find vulnerabilities. Governance tools collect questionnaires. Audit teams chase evidence across disconnected systems. The gap between what was tested, what was found, what was remediated, and what can be proven is where assurance claims lose traction.',
    { fontSize: 13, color: THEME.gray })

  // Positioning
  addBodyText(slide, 0.6, 2.2, 12, 0.5,
    'HAIEC closes this gap by making evidence the central artifact — not a byproduct.',
    { fontSize: 13, color: THEME.emerald, bold: true })

  // Four domains with HAIEC in center
  const domains = [
    { label: 'ENGINEERING', desc: 'Static analysis, runtime testing, CI integration', x: 0.8, y: 3.2 },
    { label: 'SECURITY', desc: 'Adversarial testing, attack templates, safety properties', x: 9.5, y: 3.2 },
    { label: 'GOVERNANCE', desc: 'Framework mapping, compliance twin, jurisdiction registry', x: 0.8, y: 5.0 },
    { label: 'ASSURANCE', desc: 'Audit orchestrator, evidence manifests, trust artifacts', x: 9.5, y: 5.0 },
  ]

  domains.forEach(d => {
    addCard(slide, d.x, d.y, 3.0, 1.3, { fill: THEME.bgAlt, border: THEME.cardBorder })
    addMonoLabel(slide, d.x + 0.15, d.y + 0.1, d.label, { w: 2.7 })
    addBodyText(slide, d.x + 0.15, d.y + 0.35, 2.7, 0.9, d.desc, { fontSize: 9, color: THEME.gray })
  })

  // HAIEC center
  addCard(slide, 5.2, 3.8, 3.0, 1.8, { fill: THEME.emeraldDark, border: THEME.emerald })
  slide.addText('HAIEC', {
    x: 5.2, y: 4.0, w: 3.0, h: 0.5,
    fontSize: 20, fontFace: THEME.heading, bold: true,
    color: 'FFFFFF', align: 'center'
  })
  slide.addText('Evidence-Native\nAI Security Platform', {
    x: 5.2, y: 4.5, w: 3.0, h: 0.8,
    fontSize: 10, fontFace: THEME.sans,
    color: 'FFFFFF', align: 'center', valign: 'middle'
  })

  // Connecting lines from domains to center
  addArrowConnector(slide, 3.8, 3.85, 5.2, 4.3)
  addArrowConnector(slide, 9.5, 3.85, 8.2, 4.3)
  addArrowConnector(slide, 3.8, 5.65, 5.2, 5.2)
  addArrowConnector(slide, 9.5, 5.65, 8.2, 5.2)

  // Bottom line
  addBodyText(slide, 0.6, 6.5, 12, 0.4,
    'The strategic asset is not one scanner or one report. It is the evidence relationship connecting system, test, finding, control, remediation and verification.',
    { fontSize: 11, color: THEME.emerald, bold: true })

  addFooter(slide, 2, TOTAL_SLIDES)
}

// --- Slide 3: Market Gap ---
function buildSlide3(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Security tools find risk. Governance tools collect answers.\nAudit teams still chase evidence.')

  const cols = [
    {
      title: 'AI Security Tools',
      items: ['Find vulnerabilities in code', 'Generate findings and alerts', 'Do not produce audit-grade evidence', 'Do not map findings to controls'],
      gap: 'Output stops at the finding. No evidence chain.'
    },
    {
      title: 'Governance & GRC',
      items: ['Collect questionnaire responses', 'Track policy attestation', 'Do not validate technical posture', 'Self-reported, not engine-generated'],
      gap: 'Answers without verification. No technical proof.'
    },
    {
      title: 'Audit Preparation',
      items: ['Manual evidence collection', 'Cross-reference across tools', 'Reconcile findings to controls', 'Stale by the time audit begins'],
      gap: 'Labor-intensive. Disconnected from testing.'
    }
  ]

  cols.forEach((col, i) => {
    const x = 0.6 + i * 4.1
    addCard(slide, x, 1.8, 3.8, 3.8, { fill: THEME.bgAlt, border: THEME.cardBorder })
    slide.addText(col.title, {
      x: x + 0.2, y: 1.9, w: 3.4, h: 0.4,
      fontSize: 13, fontFace: THEME.heading, bold: true,
      color: THEME.white
    })
    col.items.forEach((item, j) => {
      slide.addText(`•  ${item}`, {
        x: x + 0.2, y: 2.4 + j * 0.4, w: 3.4, h: 0.35,
        fontSize: 10, fontFace: THEME.sans, color: THEME.gray
      })
    })
    // Gap
    slide.addShape('rect', {
      x: x + 0.2, y: 4.6, w: 3.4, h: 0.04,
      fill: { color: THEME.red }, line: { type: 'none' }
    })
    slide.addText(col.gap, {
      x: x + 0.2, y: 4.7, w: 3.4, h: 0.6,
      fontSize: 9, fontFace: THEME.sans, color: THEME.red, italic: true
    })
  })

  // HAIEC bridge
  addCard(slide, 0.6, 5.9, 12.1, 0.7, { fill: THEME.emeraldDark, border: THEME.emerald })
  slide.addText('HAIEC bridges all three: engine-generated evidence flows from test → finding → control mapping → audit package in one platform.', {
    x: 0.8, y: 5.9, w: 11.7, h: 0.7,
    fontSize: 11, fontFace: THEME.sans, color: 'FFFFFF',
    align: 'center', valign: 'middle', bold: true
  })

  addFooter(slide, 3, TOTAL_SLIDES)
}

// --- Slide 4: Platform Architecture ---
function buildSlide4(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'One platform from code to audit evidence.')

  const layers = [
    { name: 'INPUTS', items: 'Git repos · API keys · AI inventory · System registration', color: THEME.grayDark },
    { name: 'EVALUATION', items: 'Static engine (188 rules) · Runtime engine (269 templates) · Wizard', color: THEME.emeraldDark },
    { name: 'COORDINATION', items: 'Audit Orchestrator · State machine · Hash-chained event log', color: THEME.emeraldDark },
    { name: 'DECISION & EVIDENCE', items: 'Decision Pipeline (6 nodes, DIS) · Evidence manifests · Framework mapping', color: THEME.emeraldDark },
    { name: 'DISTRIBUTION', items: 'Trust artifacts · Audit packages · Verification API · CI integration', color: THEME.emerald },
  ]

  layers.forEach((layer, i) => {
    const y = 1.5 + i * 1.05
    addCard(slide, 0.6, y, 12.1, 0.85, { fill: THEME.bgAlt, border: layer.color })
    // Layer name
    slide.addShape('rect', {
      x: 0.6, y, w: 0.08, h: 0.85,
      fill: { color: layer.color }, line: { type: 'none' }
    })
    addMonoLabel(slide, 0.85, y + 0.1, layer.name, { w: 3 })
    addBodyText(slide, 0.85, y + 0.35, 11.5, 0.4, layer.items, { fontSize: 11, color: THEME.white })
  })

  // Architecture statement
  addCard(slide, 0.6, 6.5, 12.1, 0.5, { fill: THEME.bgAlt, border: THEME.emerald })
  slide.addText('Modal Python runs the computation. TypeScript runs the product.', {
    x: 0.8, y: 6.5, w: 11.7, h: 0.5,
    fontSize: 11, fontFace: THEME.mono, color: THEME.emerald,
    align: 'center', valign: 'middle', italic: true
  })

  addFooter(slide, 4, TOTAL_SLIDES)
}

// --- Slide 5: End-to-End Workflow ---
function buildSlide5(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Discover. Scan. Attack-Test. Map. Prove. Monitor.')

  const steps = [
    { num: '01', name: 'Discover', desc: 'Register AI system in inventory', detail: 'API key sync, system metadata' },
    { num: '02', name: 'Scan', desc: 'Static analysis on codebase', detail: '188 rules, Semgrep + custom' },
    { num: '03', name: 'Attack-Test', desc: 'Runtime adversarial testing', detail: '269 templates, 14 safety properties' },
    { num: '04', name: 'Map', desc: 'Findings → control mappings', detail: 'SOC2, ISO 27001, OWASP, NIST AI RMF' },
    { num: '05', name: 'Prove', desc: 'Evidence manifest + audit package', detail: 'Hash-chained, fingerprinted' },
    { num: '06', name: 'Monitor', desc: 'Compliance Twin drift detection', detail: 'Delta engine, anomaly detection' },
    { num: '07', name: 'Score', desc: 'Decision Integrity Score (DIS)', detail: '6 pipeline nodes, weighted' },
    { num: '08', name: 'Review', desc: 'Human reviewer sign-off', detail: 'Signature hash, IP, user-agent' },
    { num: '09', name: 'Distribute', desc: 'Trust artifact + verification API', detail: 'HMAC-signed, revocation support' },
    { num: '10', name: 'Re-verify', desc: 'Scheduled re-verification + drift', detail: 'Cron-based, drift alerts' },
  ]

  // Two rows of 5
  steps.forEach((step, i) => {
    const col = i % 5
    const row = Math.floor(i / 5)
    const x = 0.6 + col * 2.5
    const y = 1.5 + row * 2.3

    addCard(slide, x, y, 2.3, 2.0, { fill: THEME.bgAlt, border: THEME.cardBorder })
    // Number
    slide.addText(step.num, {
      x: x + 0.1, y: y + 0.1, w: 0.8, h: 0.3,
      fontSize: 14, fontFace: THEME.mono, color: THEME.emerald, bold: true
    })
    // Name
    slide.addText(step.name, {
      x: x + 0.1, y: y + 0.45, w: 2.1, h: 0.35,
      fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.white
    })
    // Desc
    addBodyText(slide, x + 0.1, y + 0.85, 2.1, 0.5, step.desc, { fontSize: 9, color: THEME.gray })
    // Detail
    addMonoLabel(slide, x + 0.1, y + 1.4, step.detail, { w: 2.1 })

    // Arrow to next
    if (col < 4) {
      addRightArrow(slide, x + 2.3 + 0.05, y + 1.0, 0.15)
    }
  })

  // Down arrow from row 1 to row 2
  addDownArrow(slide, 12.0, 3.5, 0.3)

  // Bottom line
  addBodyText(slide, 0.6, 6.5, 12, 0.4,
    'Each step produces verifiable evidence anchored to the system, the engine version, and the point in time it was generated.',
    { fontSize: 11, color: THEME.emerald, bold: true })

  addFooter(slide, 5, TOTAL_SLIDES)
}

// --- Slide 6: Security Validation ---
function buildSlide6(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Traditional application testing stops before the full AI decision path.')

  // Decision path diagram
  const pathNodes = ['INPUT', 'PROMPT', 'RETRIEVAL', 'MODEL', 'TOOLS', 'DECISION']
  const pathW = 1.7
  const pathGap = 0.25
  let pathX = 0.6

  pathNodes.forEach((node, i) => {
    addCard(slide, pathX, 1.4, pathW, 0.5, { fill: THEME.bgAlt, border: THEME.emerald })
    slide.addText(node, {
      x: pathX, y: 1.4, w: pathW, h: 0.5,
      fontSize: 10, fontFace: THEME.mono, color: THEME.white,
      align: 'center', valign: 'middle'
    })
    if (i < pathNodes.length - 1) {
      addRightArrow(slide, pathX + pathW + 0.02, 1.65, pathGap - 0.04)
    }
    pathX += pathW + pathGap
  })

  // Traditional testing coverage bracket
  slide.addShape('rect', {
    x: 0.6, y: 2.0, w: pathW + pathGap + pathW + 0.05, h: 0.04,
    fill: { color: THEME.amber }, line: { type: 'none' }
  })
  slide.addText('Traditional testing coverage', {
    x: 0.6, y: 2.05, w: 4, h: 0.25,
    fontSize: 8, fontFace: THEME.mono, color: THEME.amber
  })

  // HAIEC coverage bracket
  slide.addShape('rect', {
    x: 0.6, y: 2.3, w: 12.1, h: 0.04,
    fill: { color: THEME.emerald }, line: { type: 'none' }
  })
  slide.addText('HAIEC full decision path coverage', {
    x: 0.6, y: 2.35, w: 5, h: 0.25,
    fontSize: 8, fontFace: THEME.mono, color: THEME.emerald
  })

  // Risks
  addBodyText(slide, 0.6, 2.8, 12, 0.4,
    'Risks: Prompt injection · Tool abuse · RAG poisoning · Data leakage · Model extraction · Agent loops · SSRF · PII exposure',
    { fontSize: 10, color: THEME.gray })

  // Two panels
  // Static analysis
  addCard(slide, 0.6, 3.4, 5.8, 2.8, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Static Analysis', {
    x: 0.8, y: 3.5, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  addStatusTag(slide, 0.8, 3.9, 'IMPLEMENTED', 'implemented')
  const staticItems = [
    '188 rules: 91 Semgrep YAML + 15 core TS + 82 rulepack',
    'Taint analysis, flow graphs, call graphs',
    'Multi-language: JS/TS, Python, Go sidecars',
    'SHA256 finding fingerprints for evidence',
    'CI integration with policy enforcement engine',
    'SARIF export, compliance-mapped findings',
  ]
  staticItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 0.8, y: 4.3 + i * 0.32, w: 5.4, h: 0.3,
      fontSize: 9, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Runtime testing
  addCard(slide, 6.9, 3.4, 5.8, 2.8, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Runtime Testing', {
    x: 7.1, y: 3.5, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  addStatusTag(slide, 7.1, 3.9, 'ACTIVE DEVELOPMENT', 'implemented')
  const runtimeItems = [
    '269 attack templates across 6 domain packs',
    '14 safety properties (secret leakage, injection, behavior)',
    'Domain authorization required before testing',
    'Rate-limited, tiered orchestration (4 tiers)',
    'Two-phase atomic finalization with Prisma transaction',
    'Static-runtime finding correlation',
  ]
  runtimeItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 7.1, y: 4.3 + i * 0.32, w: 5.4, h: 0.3,
      fontSize: 9, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Precision line
  addBodyText(slide, 0.6, 6.3, 12, 0.3,
    'Every finding carries a rule ID, a code path, a line number, and the missing guard. Deterministic rule-based analysis. Every finding is traceable.',
    { fontSize: 10, color: THEME.emerald, bold: true })

  // Maturity note
  addBodyText(slide, 0.6, 6.7, 12, 0.3,
    'Maturity: Static engine — Implemented. Runtime engine — Active development with full execution path operational.',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 6, TOTAL_SLIDES)
}

// --- Slide 7: Evidence Architecture ---
function buildSlide7(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'The evidence architecture is the core asset.')

  // Evidence flow diagram
  const flowItems = [
    { label: 'Finding', sub: '+ Source/Response\n+ Trace + Scope\n+ Version + Mapping\n+ Timestamp', w: 2.2 },
    { label: 'Canonical\nEvidence\nManifest', sub: 'Structured\nnormalized\nrecord', w: 2.0 },
    { label: 'Integrity\nFingerprint', sub: 'SHA256\ncontent hash\n+ version pin', w: 2.0 },
    { label: 'Audit\nPackage', sub: 'DIS + nodes\n+ framework\nmappings\n+ review chain', w: 2.0 },
    { label: 'Trust\nArtifact', sub: 'Verifiable\nstatus badge\n+ revocation', w: 2.0 },
  ]

  let fx = 0.6
  flowItems.forEach((item, i) => {
    addCard(slide, fx, 1.5, item.w, 2.2, {
      fill: i === 0 ? THEME.emeraldDark : THEME.bgAlt,
      border: i === 0 ? THEME.emerald : THEME.cardBorder
    })
    slide.addText(item.label, {
      x: fx + 0.1, y: 1.6, w: item.w - 0.2, h: 0.7,
      fontSize: 11, fontFace: THEME.heading, bold: true,
      color: THEME.white, align: 'center', valign: 'middle'
    })
    slide.addText(item.sub, {
      x: fx + 0.1, y: 2.4, w: item.w - 0.2, h: 1.2,
      fontSize: 8, fontFace: THEME.mono, color: THEME.gray,
      align: 'center', valign: 'top'
    })
    if (i < flowItems.length - 1) {
      addRightArrow(slide, fx + item.w + 0.05, 2.6, 0.2)
    }
    fx += item.w + 0.3
  })

  // Key line
  addBodyText(slide, 0.6, 4.1, 12, 0.4,
    'Every evidence record binds a finding to its source, its scope, its engine version, and its compliance mapping — at the point of generation.',
    { fontSize: 12, color: THEME.emerald, bold: true })

  // Supporting detail
  addCard(slide, 0.6, 4.7, 5.8, 1.8, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Evidence Integrity Components', {
    x: 0.8, y: 4.8, w: 5.4, h: 0.35,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  const integrityItems = [
    'Config hash frozen at run creation (R2-01)',
    'Hash-chained append-only event log',
    'Engine output contract validation (R3-02)',
    'SHA256 finding fingerprints (truncated to 16 chars)',
    'Methodology version locked at compute time',
  ]
  integrityItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 0.8, y: 5.2 + i * 0.28, w: 5.4, h: 0.25,
      fontSize: 9, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Verification panel
  addCard(slide, 6.9, 4.7, 5.8, 1.8, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Verification Model', {
    x: 7.1, y: 4.8, w: 5.4, h: 0.35,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  addStatusTag(slide, 7.1, 5.2, 'IMPLEMENTED', 'implemented')
  const verifyItems = [
    'HMAC-SHA256 issuer signature on verification responses',
    'Integrity verification with replay protection via nonces',
    'Redis-backed nonce store for production scale',
    'Key rotation support (primary, previous, legacy)',
    'Verification via HAIEC /api/verify endpoint',
  ]
  verifyItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 7.1, y: 5.6 + i * 0.28, w: 5.4, h: 0.25,
      fontSize: 9, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Maturity note
  addBodyText(slide, 0.6, 6.7, 12, 0.3,
    'Maturity: Evidence integrity — Implemented. HMAC-SHA256 with key rotation and replay protection. Upgrade path: Ed25519 asymmetric signatures for third-party-verifiable non-repudiation.',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 7, TOTAL_SLIDES)
}

// --- Slide 8: Framework Evidence Graph ---
function buildSlide8(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'One remediation can support multiple assurance requirements.')

  // Example finding
  addCard(slide, 0.6, 1.3, 3.5, 1.8, { fill: THEME.bgAlt, border: THEME.amber })
  addMonoLabel(slide, 0.75, 1.4, 'EXAMPLE FINDING', { w: 3.2 })
  slide.addText('R1: Prompt Injection', {
    x: 0.75, y: 1.65, w: 3.2, h: 0.35,
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  addBodyText(slide, 0.75, 2.05, 3.2, 0.9,
    'User input reaches system prompt without validation guard. Source: API endpoint. Sink: LLM call.',
    { fontSize: 9, color: THEME.gray })

  // Evidence
  addCard(slide, 4.4, 1.3, 2.5, 1.8, { fill: THEME.bgAlt, border: THEME.emerald })
  addMonoLabel(slide, 4.55, 1.4, 'EVIDENCE', { w: 2.2 })
  const evidenceItems = ['Rule ID: R1', 'Code path + line', 'Fingerprint: SHA256', 'Engine v2025.1.0', 'Timestamp: ISO8601']
  evidenceItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 4.55, y: 1.7 + i * 0.26, w: 2.2, h: 0.22,
      fontSize: 8, fontFace: THEME.mono, color: THEME.white
    })
  })

  // Arrow from evidence to frameworks
  addRightArrow(slide, 7.0, 2.2, 0.3)

  // Framework mappings
  const frameworks = [
    { name: 'OWASP LLM01', detail: 'Prompt Injection' },
    { name: 'SOC2 CC7.2', detail: 'System Monitoring' },
    { name: 'ISO 27001 A.12.6.1', detail: 'Technical Vulnerability' },
    { name: 'NIST AI RMF', detail: 'MEASURE-2.7, MANAGE-1.1' },
    { name: 'EU AI Act', detail: 'Art15-Robustness, Art12-Logging' },
    { name: 'ISO 42001', detail: '8.2, 8.4, 9.1' },
  ]

  frameworks.forEach((fw, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 7.5 + col * 2.7
    const y = 1.3 + row * 0.65
    addCard(slide, x, y, 2.5, 0.55, { fill: THEME.bgAlt, border: THEME.emerald })
    slide.addText(fw.name, {
      x: x + 0.1, y: y + 0.05, w: 2.3, h: 0.25,
      fontSize: 9, fontFace: THEME.heading, bold: true, color: THEME.white
    })
    slide.addText(fw.detail, {
      x: x + 0.1, y: y + 0.3, w: 2.3, h: 0.2,
      fontSize: 8, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Flow text
  addBodyText(slide, 0.6, 3.4, 12, 0.3,
    'Flow: Finding → Evidence → Framework Mapping → Control Coverage → Audit Package',
    { fontSize: 10, color: THEME.emerald, bold: true })

  // Strategic line
  addCard(slide, 0.6, 3.9, 12.1, 1.2, { fill: THEME.bgAlt, border: THEME.emerald })
  slide.addText('Strategic Value', {
    x: 0.8, y: 4.0, w: 11.7, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  addBodyText(slide, 0.8, 4.3, 11.7, 0.7,
    'A single remediation (e.g., adding input validation guard) can simultaneously satisfy OWASP LLM01, SOC2 CC7.2, ISO 27001 A.12.6.1, NIST AI RMF MEASURE-2.7, EU AI Act Art15, and ISO 42001 8.2 — with one evidence record. This is the multiplier effect: remediate once, prove across frameworks.',
    { fontSize: 10, color: THEME.white })

  // Source footer
  addBodyText(slide, 0.6, 5.4, 12, 0.3,
    'Source: lib/ai-security/compliance-mappings.ts — 82 unique rule IDs mapped to 13 compliance frameworks.',
    { fontSize: 8, color: THEME.grayDark })

  // Framework list
  addBodyText(slide, 0.6, 5.8, 12, 0.5,
    'Mapped frameworks: SOC 2 · ISO 27001 · ISO 42001 · OWASP LLM Top 10 · GDPR · HIPAA · CWE · NIST AI RMF · EU AI Act · CCPA · NYC LL144 · Colorado AI Act · FTC Act',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 8, TOTAL_SLIDES)
}

// --- Slide 9: Orchestration and Decision Pipeline ---
function buildSlide9(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Scores summarize. Critical gates decide. Evidence explains.')

  // Engine inputs
  addCard(slide, 0.6, 1.3, 3.0, 1.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  addMonoLabel(slide, 0.75, 1.4, 'ENGINE INPUTS', { w: 2.7 })
  const inputs = ['Static scan results', 'Runtime test results', 'Wizard assessment', 'AI inventory', 'Compliance Twin state']
  inputs.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 0.75, y: 1.7 + i * 0.22, w: 2.7, h: 0.2,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Arrow
  addRightArrow(slide, 3.7, 2.0, 0.3)

  // Pipeline
  addCard(slide, 4.1, 1.3, 4.5, 1.5, { fill: THEME.bgAlt, border: THEME.emerald })
  addMonoLabel(slide, 4.25, 1.4, 'DECISION PIPELINE', { w: 4.2 })
  slide.addText('6 Nodes: INPUT → PROMPT → RETRIEVAL → TOOLS → MODEL → DECISION', {
    x: 4.25, y: 1.7, w: 4.2, h: 0.3,
    fontSize: 9, fontFace: THEME.mono, color: THEME.white
  })
  slide.addText('Decision Integrity Score (DIS) = weighted average × coverage penalty', {
    x: 4.25, y: 2.1, w: 4.2, h: 0.3,
    fontSize: 9, fontFace: THEME.sans, color: THEME.emerald
  })
  slide.addText('NIST AI RMF: GOVERN · MAP · MEASURE · MANAGE', {
    x: 4.25, y: 2.4, w: 4.2, h: 0.3,
    fontSize: 9, fontFace: THEME.mono, color: THEME.gray
  })

  // Arrow
  addRightArrow(slide, 8.7, 2.0, 0.3)

  // Output
  addCard(slide, 9.1, 1.3, 3.6, 1.5, { fill: THEME.bgAlt, border: THEME.emerald })
  addMonoLabel(slide, 9.25, 1.4, 'OUTPUT', { w: 3.3 })
  const outputs = ['DIS score (0–100)', 'Per-node breakdown', 'Audit package (JSON)', 'Review sign-off chain', 'Drift detection']
  outputs.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 9.25, y: 1.7 + i * 0.22, w: 3.3, h: 0.2,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Two columns
  // Current implementation
  addCard(slide, 0.6, 3.1, 5.8, 2.8, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Current Implementation', {
    x: 0.8, y: 3.2, w: 5.4, h: 0.35,
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  addStatusTag(slide, 0.8, 3.6, 'IMPLEMENTED', 'implemented')
  const currentItems = [
    'Aggregation job normalizes all engine outputs to 6 nodes',
    'DIS formula v1.0 with locked methodology version',
    'Coverage penalty: <50% → ×0.85, 50-74% → ×0.95, ≥75% → ×1.00',
    'Audit eligibility: FULL_RUN + all required nodes VERIFIED + ≥75% coverage',
    'Human review workflow with signature hash + IP + user-agent',
    'Drift detection: ≥10pt overall drop or ≥15pt node drop or eligibility flip',
    'Enterprise V1 API with feature gate and rate limiting',
    'Idempotent aggregation (unique constraint on orchestratorRunId)',
  ]
  currentItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 0.8, y: 4.0 + i * 0.24, w: 5.4, h: 0.22,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Roadmap & next capabilities
  addCard(slide, 6.9, 3.1, 5.8, 2.8, { fill: THEME.bgAlt, border: THEME.emerald })
  slide.addText('Roadmap & Next Capabilities', {
    x: 7.1, y: 3.2, w: 5.4, h: 0.35,
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  addStatusTag(slide, 7.1, 3.6, 'ACTIVE DEVELOPMENT', 'implemented')
  const hardeningItems = [
    'Findings-level blocker gates: scoring implemented, enforcement activation next',
    'Critical-finding gates: eligibility enforcement in active development',
    'QStash async job: infrastructure ready, production token configuration next',
    'Scheduled re-verification: cron infrastructure ready, scheduling activation next',
    'Review workflow: sign-off chain implemented, production rollout next',
    'PARTIAL_RUN results consistently excluded from audit eligibility',
  ]
  hardeningItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 7.1, y: 4.0 + i * 0.24, w: 5.4, h: 0.22,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Product principle
  addBodyText(slide, 0.6, 6.2, 12, 0.3,
    'Product principle: UI never computes scores — it only reads from aggregation output tables. Methodology version is locked at compute time.',
    { fontSize: 10, color: THEME.emerald, bold: true })

  // Maturity notes
  addBodyText(slide, 0.6, 6.6, 12, 0.3,
    'Maturity: Decision Pipeline — Implemented (scoring, aggregation, audit package). Findings-level blocker enforcement in active development for eligibility gate activation.',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 9, TOTAL_SLIDES)
}

// --- Slide 10: Continuous Assurance and Control ---
function buildSlide10(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Validation should change when the system changes.')

  // Compliance Twin
  addCard(slide, 0.6, 1.3, 5.8, 3.0, { fill: THEME.bgAlt, border: THEME.emerald })
  slide.addText('Compliance Twin', {
    x: 0.8, y: 1.4, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  addStatusTag(slide, 0.8, 1.8, 'SUBSTANTIVE SUBSYSTEM', 'implemented')
  const twinItems = [
    '17 files in lib/compliance-twin/ — entirely TypeScript',
    '6 jurisdictions: NYC LL144, Colorado SB24-205, EU AI Act, US Federal, UK, International',
    'Delta engine: structured diff between compliance snapshots (Patent P1)',
    'Anomaly detector: Z-score + IQR statistical methods',
    'Alert engine: deduplication + 4-level escalation',
    'Rulepack engine: 23 seed rules across 4 frameworks',
    'Snapshot engine: immutable, SHA256-hashed state snapshots',
    'Provenance engine: compliance record anchoring (Patent P3)',
    'Regression engine: detects previously-passing rules that now fail',
    '17 API routes for full lifecycle management',
  ]
  twinItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 0.8, y: 2.2 + i * 0.21, w: 5.4, h: 0.2,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Kill Switch
  addCard(slide, 6.9, 1.3, 5.8, 3.0, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Kill Switch', {
    x: 7.1, y: 1.4, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  addStatusTag(slide, 7.1, 1.8, 'ACTIVE DEVELOPMENT', 'implemented')

  const killLayers = [
    { layer: 'L1', name: 'Throttle', status: 'implemented' },
    { layer: 'L2', name: 'Rate limit + alert', status: 'implemented' },
    { layer: 'L3', name: 'Selective block', status: 'implemented' },
    { layer: 'L4', name: 'Escalation + notify', status: 'roadmap' },
    { layer: 'L5', name: 'Full kill', status: 'roadmap' },
  ]

  killLayers.forEach((kl, i) => {
    const y = 2.2 + i * 0.35
    const statusColor = kl.status === 'implemented' ? THEME.emerald : THEME.amber
    slide.addText(kl.layer, {
      x: 7.1, y, w: 0.4, h: 0.3,
      fontSize: 10, fontFace: THEME.mono, color: THEME.emerald, bold: true
    })
    slide.addText(kl.name, {
      x: 7.6, y, w: 3.5, h: 0.3,
      fontSize: 9, fontFace: THEME.sans, color: THEME.white
    })
    slide.addShape('roundRect', {
      x: 11.2, y: y + 0.02, w: 1.3, h: 0.26,
      fill: { color: statusColor }, line: { type: 'none' }, rectRadius: 0.03
    })
    slide.addText(kl.status === 'implemented' ? 'AVAILABLE' : 'ROADMAP', {
      x: 11.2, y: y + 0.02, w: 1.3, h: 0.26,
      fontSize: 7, fontFace: THEME.mono, color: 'FFFFFF',
      align: 'center', valign: 'middle'
    })
  })

  // Kill switch detail
  slide.addText('Published SDK: @haiec/kill-switch v0.3.0', {
    x: 7.1, y: 4.1, w: 5.4, h: 0.2,
    fontSize: 8, fontFace: THEME.mono, color: THEME.gray
  })

  // Key line
  addBodyText(slide, 0.6, 4.6, 12, 0.4,
    'Compliance Twin maintains a live digital twin of regulatory state. Kill Switch provides emergency shutdown. Together: continuous assurance with enforcement capability.',
    { fontSize: 11, color: THEME.emerald, bold: true })

  // Maturity notes
  addCard(slide, 0.6, 5.2, 12.1, 1.5, { fill: THEME.bgAlt, border: THEME.emerald })
  addBodyText(slide, 0.8, 5.3, 11.7, 0.3,
    'Maturity Notes:',
    { fontSize: 10, color: THEME.white, bold: true })
  addBodyText(slide, 0.8, 5.6, 11.7, 1.0,
    '•  Compliance Twin: Substantive implemented subsystem (17 files, 17 API routes, 8 DB models). Full lifecycle management across 6 jurisdictions.\n•  Kill Switch: Layers 1–3 available (throttle, rate limit, selective block). Layers 4–5 (escalation, full kill) on roadmap. SDK published as npm package.',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 10, TOTAL_SLIDES)
}

// --- Slide 11: Defensibility and Strategic Value ---
function buildSlide11(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'The defensibility compounds across the evidence lifecycle.')

  const layers = [
    { name: '1. Rule Depth', desc: '188 static rules + 269 attack templates. Multi-language, multi-provider, multi-domain.' },
    { name: '2. Evidence Architecture', desc: 'Finding → manifest → fingerprint → audit package → trust artifact. Hash-chained, version-pinned.' },
    { name: '3. Framework Mapping', desc: '13 compliance frameworks mapped from 82 unique rule IDs. One remediation → multiple controls.' },
    { name: '4. Orchestrated Workflow', desc: 'State machine, contract validation, hash-chained event log. DB as source of truth.' },
    { name: '5. Decision Pipeline', desc: '6-node DIS, NIST AI RMF breakdown, audit eligibility, human review sign-off.' },
    { name: '6. Continuous Assurance', desc: 'Compliance Twin drift detection, scheduled re-verification, regression testing.' },
    { name: '7. Distribution', desc: 'Trust artifacts, verification API, CI integration, enterprise V1 API.' },
  ]

  layers.forEach((layer, i) => {
    const y = 1.3 + i * 0.62
    addCard(slide, 0.6, y, 8.0, 0.52, { fill: THEME.bgAlt, border: THEME.cardBorder })
    slide.addText(layer.name, {
      x: 0.8, y: y + 0.05, w: 2.5, h: 0.4,
      fontSize: 10, fontFace: THEME.heading, bold: true, color: THEME.emerald
    })
    addBodyText(slide, 3.3, y + 0.05, 5.2, 0.4, layer.desc, { fontSize: 9, color: THEME.white })
  })

  // Distribution arrow
  addRightArrow(slide, 8.7, 3.5, 0.3)

  // Strategic outcomes
  const outcomes = [
    { title: 'Switching Cost', desc: 'Each audit run accumulates evidence records, framework mappings, and compliance history. Rebuilding this in a new tool is prohibitive.' },
    { title: 'Network Effects', desc: 'More systems scanned → more findings → more framework mappings → more remediation patterns → better coverage.' },
    { title: 'Regulatory Moat', desc: '6 jurisdictions, 13 frameworks, patent-pending delta engine and provenance anchoring.' },
  ]

  outcomes.forEach((outcome, i) => {
    const y = 1.5 + i * 1.5
    addCard(slide, 9.1, y, 3.6, 1.3, { fill: THEME.emeraldDark, border: THEME.emerald })
    slide.addText(outcome.title, {
      x: 9.3, y: y + 0.1, w: 3.2, h: 0.35,
      fontSize: 12, fontFace: THEME.heading, bold: true, color: 'FFFFFF'
    })
    addBodyText(slide, 9.3, y + 0.5, 3.2, 0.7, outcome.desc, { fontSize: 9, color: 'FFFFFF' })
  })

  // Main line
  addBodyText(slide, 0.6, 6.0, 12, 0.3,
    'Each layer reinforces the next. The evidence relationship — not any single scanner — is the defensible asset.',
    { fontSize: 11, color: THEME.emerald, bold: true })

  // Discussion questions
  addCard(slide, 0.6, 6.4, 12.1, 0.7, { fill: THEME.bgAlt, border: THEME.emerald })
  slide.addText('Discussion:  What is the strongest initial product wedge?  ·  Which compliance framework drives the most urgent demand?  ·  Where does HAIEC create the most switching cost?',
    { x: 0.8, y: 6.4, w: 11.7, h: 0.7,
      fontSize: 9, fontFace: THEME.sans, color: THEME.gray,
      align: 'center', valign: 'middle', italic: true })

  addFooter(slide, 11, TOTAL_SLIDES)
}

// --- Appendix A: Technical Maturity Matrix ---
function buildAppendixA(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Appendix A: Technical Maturity Matrix')

  // Table headers
  const headers = ['Capability', 'Current Status', 'Source Proof', 'Strategic Value', 'Next Evolution']
  const colWidths = [2.3, 2.2, 2.8, 2.5, 2.3]
  let colX = 0.4

  // Header row
  addCard(slide, 0.4, 1.2, 12.5, 0.4, { fill: THEME.bgAlt, border: THEME.emerald })
  headers.forEach((h, i) => {
    slide.addText(h, {
      x: colX + 0.1, y: 1.22, w: colWidths[i] - 0.1, h: 0.35,
      fontSize: 9, fontFace: THEME.heading, bold: true, color: THEME.emerald,
      valign: 'middle'
    })
    colX += colWidths[i]
  })

  const rows = [
    {
      cap: 'Static AI Security',
      status: 'Implemented',
      statusType: 'implemented',
      proof: '188 rules, Modal Python scanner, 31 API routes, 8 DB models',
      value: 'Deterministic, audit-grade findings with fingerprints',
      limit: 'Multi-language sidecar expansion (Go, Rust)'
    },
    {
      cap: 'Runtime Adversarial Testing',
      status: 'Active development',
      statusType: 'implemented',
      proof: '269 templates, 14 safety properties, 22 API routes',
      value: 'Active testing of live AI endpoints with safety validation',
      limit: 'Production scale-out and additional domain packs'
    },
    {
      cap: 'Audit Orchestrator',
      status: 'Implemented',
      statusType: 'implemented',
      proof: 'State machine, hash-chained event log, contract validation, 12 routes',
      value: 'Sequential engine execution with tamper-evident audit trail',
      limit: 'Engine contract version pinning for all engines'
    },
    {
      cap: 'Decision Pipeline',
      status: 'Implemented (scoring); active development',
      statusType: 'implemented',
      proof: '6 nodes, DIS v1.0, 14 API routes, NIST RMF mapping',
      value: 'Composite scoring with audit eligibility and human review',
      limit: 'Findings-level blocker gate activation for eligibility'
    },
    {
      cap: 'Evidence Integrity',
      status: 'Implemented',
      statusType: 'implemented',
      proof: 'HMAC-SHA256, key rotation, replay protection, /api/verify',
      value: 'Integrity verification for evidence transit and storage',
      limit: 'Ed25519 asymmetric signatures for third-party non-repudiation'
    },
    {
      cap: 'Trust Artifacts',
      status: 'Implemented foundation',
      statusType: 'foundation',
      proof: '4 artifact types, 6 frameworks, revocation, verification API',
      value: 'Verifiable status badges with scope and risk posture',
      limit: 'External badge display network and partner integrations'
    },
    {
      cap: 'Compliance Twin',
      status: 'Substantive subsystem',
      statusType: 'implemented',
      proof: '17 files, 17 API routes, 8 DB models, 6 jurisdictions',
      value: 'Live compliance monitoring with drift detection',
      limit: 'Production deployment and additional jurisdiction rule packs'
    },
    {
      cap: 'Kill Switch',
      status: 'Active development (L1–L3 available)',
      statusType: 'implemented',
      proof: 'Published SDK v0.3.0, execution guard, 19 API routes',
      value: 'Emergency shutdown capability for AI systems',
      limit: 'Layers 4–5 (escalation, full kill) on roadmap'
    },
  ]

  rows.forEach((row, i) => {
    const y = 1.65 + i * 0.62
    const rowFill = i % 2 === 0 ? THEME.bg : THEME.bgAlt
    addCard(slide, 0.4, y, 12.5, 0.58, { fill: rowFill, border: THEME.cardBorder })

    let rx = 0.4
    // Capability
    slide.addText(row.cap, {
      x: rx + 0.1, y: y + 0.02, w: colWidths[0] - 0.1, h: 0.55,
      fontSize: 8, fontFace: THEME.heading, bold: true, color: THEME.white, valign: 'middle'
    })
    rx += colWidths[0]

    // Status
    const statusColor = row.statusType === 'implemented' ? THEME.emerald :
                        row.statusType === 'partial' ? THEME.amber : THEME.emeraldDark
    slide.addText(row.status, {
      x: rx + 0.1, y: y + 0.02, w: colWidths[1] - 0.1, h: 0.55,
      fontSize: 7, fontFace: THEME.mono, color: statusColor, valign: 'middle'
    })
    rx += colWidths[1]

    // Source proof
    slide.addText(row.proof, {
      x: rx + 0.1, y: y + 0.02, w: colWidths[2] - 0.1, h: 0.55,
      fontSize: 7, fontFace: THEME.sans, color: THEME.gray, valign: 'middle'
    })
    rx += colWidths[2]

    // Strategic value
    slide.addText(row.value, {
      x: rx + 0.1, y: y + 0.02, w: colWidths[3] - 0.1, h: 0.55,
      fontSize: 7, fontFace: THEME.sans, color: THEME.white, valign: 'middle'
    })
    rx += colWidths[3]

    // Next Evolution
    slide.addText(row.limit, {
      x: rx + 0.1, y: y + 0.02, w: colWidths[4] - 0.1, h: 0.55,
      fontSize: 7, fontFace: THEME.sans, color: THEME.emerald, valign: 'middle'
    })
  })

  addFooter(slide, 12, TOTAL_SLIDES)
}

// --- Appendix B: Capability Taxonomy ---
function buildAppendixB(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Appendix B: Capability Taxonomy')

  // Date and commit
  addMonoLabel(slide, 0.6, 1.1, `Generated: ${new Date().toISOString().split('T')[0]}  ·  Source commit: ${GIT_COMMIT}`, { w: 8 })

  // Static Detection
  addCard(slide, 0.6, 1.4, 3.8, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Static Detection', {
    x: 0.8, y: 1.5, w: 3.4, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  const staticData = [
    `Semgrep YAML rules: ${CAPABILITY_COUNTS.semgrepRules}`,
    `Core TS deterministic rules: ${CAPABILITY_COUNTS.coreTsrules}`,
    `Rulepack rules: ${CAPABILITY_COUNTS.rulepackRules}`,
    `Total static rules: ${CAPABILITY_COUNTS.totalStaticRules}`,
    '',
    'Rulepacks:',
    '  Agentic (AGW-R): 12',
    '  AI-Assisted Dev (AIC-R): 45',
    '  Embedded SaaS (ESA-R): 10',
    '  RAG Deep (RAG-R): 8',
    '  Voice AI (VAI): 7',
  ]
  staticData.forEach((item, i) => {
    slide.addText(item, {
      x: 0.8, y: 1.85 + i * 0.19, w: 3.4, h: 0.18,
      fontSize: 8, fontFace: item.includes(':') ? THEME.mono : THEME.sans,
      color: item.includes(':') && !item.startsWith('  ') ? THEME.emerald : THEME.white
    })
  })

  // Runtime Attack Templates
  addCard(slide, 4.6, 1.4, 3.8, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Runtime Attack Templates', {
    x: 4.8, y: 1.5, w: 3.4, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  const runtimeData = [
    `Base templates: ${CAPABILITY_COUNTS.baseAttackTemplates}`,
    `Voice AI: ${CAPABILITY_COUNTS.voiceAttackTemplates}`,
    `Embedded SaaS: ${CAPABILITY_COUNTS.embeddedSaasTemplates}`,
    `Agentic: ${CAPABILITY_COUNTS.agenticTemplates}`,
    `AI-Assisted Dev: ${CAPABILITY_COUNTS.aiDevTemplates}`,
    `RAG Deep: ${CAPABILITY_COUNTS.ragDeepTemplates}`,
    `Total templates: ${CAPABILITY_COUNTS.totalAttackTemplates}`,
    '',
    'Compliance tiers: 4',
    'Phasing strategies: 4',
    'Rate limit: 60 req/min, 2 req/sec',
  ]
  runtimeData.forEach((item, i) => {
    slide.addText(item, {
      x: 4.8, y: 1.85 + i * 0.19, w: 3.4, h: 0.18,
      fontSize: 8, fontFace: item.includes(':') ? THEME.mono : THEME.sans,
      color: item.includes('Total') ? THEME.emerald : THEME.white
    })
  })

  // Safety Properties
  addCard(slide, 8.6, 1.4, 4.1, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Safety Properties & Frameworks', {
    x: 8.8, y: 1.5, w: 3.7, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  const safetyData = [
    `Safety properties: ${CAPABILITY_COUNTS.safetyProperties}`,
    '  Secret leakage: 5 (SP001-SP005)',
    '  Injection: 2 (SP010-SP011)',
    '  Prompt extraction: 2 (SP020-SP021)',
    '  Behavioral: 2 (SP030, SP040)',
    '  Performance: 2 (SP050-SP051)',
    '  Tool abuse: 1 (SP060)',
    '',
    `Compliance frameworks: ${CAPABILITY_COUNTS.complianceFrameworks}`,
    '  SOC2, ISO27001, ISO42001, GDPR',
    '  HIPAA, OWASP, CWE, NIST AI RMF',
    '  EU AI Act, CCPA, NYC LL144, CO AI, FTC',
  ]
  safetyData.forEach((item, i) => {
    slide.addText(item, {
      x: 8.8, y: 1.85 + i * 0.19, w: 3.7, h: 0.18,
      fontSize: 8, fontFace: item.includes(':') ? THEME.mono : THEME.sans,
      color: item.startsWith('  ') ? THEME.gray : THEME.white
    })
  })

  // API Surface
  addCard(slide, 0.6, 4.1, 12.1, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('API Surface', {
    x: 0.8, y: 4.2, w: 11.7, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })

  const apiData = [
    { name: 'Static Security', routes: CAPABILITY_COUNTS.staticApiRoutes, path: '/api/ai-security/' },
    { name: 'Runtime Security', routes: CAPABILITY_COUNTS.runtimeApiRoutes, path: '/api/runtime-security/' },
    { name: 'Audit Orchestrator', routes: CAPABILITY_COUNTS.orchestratorRoutes, path: '/api/audit-orchestrator/' },
    { name: 'Compliance Twin', routes: CAPABILITY_COUNTS.twinApiRoutes, path: '/api/compliance-twin/' },
    { name: 'Kill Switch', routes: CAPABILITY_COUNTS.killSwitchApiRoutes, path: '/api/kill-switch/' },
    { name: 'Pipeline (Dashboard)', routes: CAPABILITY_COUNTS.pipelineDashboardRoutes, path: '/api/pipeline/' },
    { name: 'Pipeline (Enterprise V1)', routes: CAPABILITY_COUNTS.pipelineEnterpriseRoutes, path: '/api/v1/pipeline/' },
  ]

  const totalRoutes = apiData.reduce((sum, a) => sum + a.routes, 0)

  apiData.forEach((api, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const x = 0.8 + col * 3.0
    const y = 4.6 + row * 0.55
    slide.addText(`${api.name}`, {
      x, y, w: 1.8, h: 0.25,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
    slide.addText(`${api.routes} routes`, {
      x: x + 1.8, y, w: 1.0, h: 0.25,
      fontSize: 8, fontFace: THEME.mono, color: THEME.emerald
    })
    slide.addText(api.path, {
      x, y: y + 0.25, w: 2.8, h: 0.2,
      fontSize: 7, fontFace: THEME.mono, color: THEME.gray
    })
  })

  // Total
  slide.addText(`Total API routes: ${totalRoutes}`, {
    x: 0.8, y: 6.0, w: 5, h: 0.3,
    fontSize: 10, fontFace: THEME.mono, color: THEME.emerald, bold: true
  })
  slide.addText(`Jurisdictions: ${CAPABILITY_COUNTS.jurisdictions}  ·  Pipeline nodes: ${CAPABILITY_COUNTS.pipelineNodes}  ·  Seed rules: ${CAPABILITY_COUNTS.rulepackSeedRules}`, {
    x: 5.5, y: 6.0, w: 7, h: 0.3,
    fontSize: 9, fontFace: THEME.mono, color: THEME.gray
  })

  addFooter(slide, 13, TOTAL_SLIDES)
}

// --- Appendix C: Evidence Trust Model ---
function buildAppendixC(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Appendix C: Evidence Trust Model')

  // Trust chain
  addCard(slide, 0.6, 1.2, 12.1, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Evidence Integrity Chain', {
    x: 0.8, y: 1.3, w: 11.7, h: 0.3,
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })

  const chainItems = [
    { label: 'Configuration Hash', desc: 'SHA256 of run config snapshot frozen at run creation (R2-01). Includes engine versions, rulepack versions, compliance mapping versions.', implemented: true },
    { label: 'Engine-Output Hash', desc: 'SHA256 of canonicalized engine output. Stable key ordering, UTF-8 encoding. Computed by contract-validator.ts.', implemented: true },
    { label: 'Run Fingerprint', desc: 'Per-run fingerprint combining all engine output hashes. Schema version 2. Detects version drift mid-run.', implemented: true },
    { label: 'Event-Log Hash', desc: 'Hash-chained append-only event log. eventHash = SHA256(seq + eventType + payload + prevEventHash). Tamper-evident.', implemented: true },
    { label: 'HMAC Issuer Signature', desc: 'HMAC-SHA256 on verification responses. Algorithm version 1. Key rotation: primary, previous, legacy. Replay protection via nonces.', implemented: true },
    { label: 'Validity Window', desc: 'Issued-at and expires-at timestamps. ArtifactValidityStatus: VALID, EXPIRED, REVOKED. Revocation events tracked.', implemented: true },
    { label: 'Invalidation Triggers', desc: 'New scan with critical findings, manual revocation, expiration, scope change detection via Compliance Twin delta engine.', implemented: true },
    { label: 'HAIEC Verification Endpoint', desc: 'GET /api/verify/[artifactId] returns signed verification response. SignedVerificationResponse with data + issuerSignature + dataHash.', implemented: true },
  ]

  chainItems.forEach((item, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.8 + col * 6.0
    const y = 1.7 + row * 0.5
    slide.addShape('rect', {
      x: x, y: y, w: 0.08, h: 0.4,
      fill: { color: item.implemented ? THEME.emerald : THEME.amber }, line: { type: 'none' }
    })
    slide.addText(item.label, {
      x: x + 0.15, y, w: 5.5, h: 0.2,
      fontSize: 9, fontFace: THEME.heading, bold: true, color: THEME.white
    })
    slide.addText(item.desc, {
      x: x + 0.15, y: y + 0.2, w: 5.5, h: 0.2,
      fontSize: 7, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Evidence types
  addCard(slide, 0.6, 3.9, 5.8, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Evidence Types', {
    x: 0.8, y: 4.0, w: 5.4, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  const evidenceTypes = [
    { type: 'ENGINE_GENERATED', desc: 'Static scan findings, runtime test results' },
    { type: 'SELF_REPORTED', desc: 'Wizard assessment responses' },
    { type: 'INFERRED', desc: 'Compliance Twin state, framework mappings' },
  ]
  evidenceTypes.forEach((et, i) => {
    slide.addText(et.type, {
      x: 0.8, y: 4.4 + i * 0.35, w: 2.5, h: 0.3,
      fontSize: 8, fontFace: THEME.mono, color: THEME.emerald
    })
    slide.addText(et.desc, {
      x: 3.3, y: 4.4 + i * 0.35, w: 2.9, h: 0.3,
      fontSize: 8, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Verification architecture
  addCard(slide, 0.8, 5.5, 5.4, 0.8, { fill: THEME.bg, border: THEME.emerald })
  slide.addText('Verification Architecture', {
    x: 0.9, y: 5.55, w: 5.2, h: 0.25,
    fontSize: 8, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  slide.addText('HMAC-SHA256 provides integrity and authentication for verification responses. Verification via HAIEC /api/verify endpoint with key rotation and replay protection. Upgrade path: Ed25519 asymmetric signatures for third-party-verifiable non-repudiation.', {
    x: 0.9, y: 5.8, w: 5.2, h: 0.5,
    fontSize: 7, fontFace: THEME.sans, color: THEME.gray
  })

  // Trust artifact types
  addCard(slide, 6.9, 3.9, 5.8, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Trust Artifact Types', {
    x: 7.1, y: 4.0, w: 5.4, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  const artifactTypes = [
    { type: 'AI_SECURITY_ATTESTATION', desc: 'SCANNED → PROTECTED → SECURED' },
    { type: 'COMPLIANCE_EVIDENCE_MARK', desc: 'EVIDENCE_READY / EVIDENCE_PARTIAL' },
    { type: 'NYC_LL144_ATTESTATION', desc: 'AUDIT_READY / IN_PROGRESS / NOT_READY' },
    { type: 'BIAS_AUDIT_ATTESTATION', desc: 'LOW_RISK / MEDIUM_RISK / HIGH_RISK' },
  ]
  artifactTypes.forEach((at, i) => {
    slide.addText(at.type, {
      x: 7.1, y: 4.4 + i * 0.35, w: 3.0, h: 0.3,
      fontSize: 7, fontFace: THEME.mono, color: THEME.emerald
    })
    slide.addText(at.desc, {
      x: 10.1, y: 4.4 + i * 0.35, w: 2.4, h: 0.3,
      fontSize: 7, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Scope statement
  addCard(slide, 7.1, 5.5, 5.4, 0.8, { fill: THEME.bg, border: THEME.emerald })
  slide.addText('Scope Verification', {
    x: 7.2, y: 5.55, w: 5.2, h: 0.25,
    fontSize: 8, fontFace: THEME.heading, bold: true, color: THEME.emerald
  })
  slide.addText('Each artifact carries scopeVerified and scopeNotVerified arrays. Status labels (e.g., SECURED) reflect rule pass/fail posture within verified scope, providing precise, scoped assurance.', {
    x: 7.2, y: 5.8, w: 5.2, h: 0.5,
    fontSize: 7, fontFace: THEME.sans, color: THEME.gray
  })

  addFooter(slide, 14, TOTAL_SLIDES)
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const pptx = new pptxgen()

  // Configure
  pptx.defineLayout({ name: 'HAIEC_16x9', width: SLIDE_W, height: SLIDE_H })
  pptx.layout = 'HAIEC_16x9'
  pptx.author = 'Subodh KC'
  pptx.company = 'HAIEC'
  pptx.subject = 'HAIEC Technical Architecture, Defensibility and Strategic Value'
  pptx.title = 'HAIEC Technical Architecture & Defensibility Brief'

  // Build slides
  buildSlide1(pptx)      // Cover
  buildSlide2(pptx)      // Core thesis
  buildSlide3(pptx)      // Market gap
  buildSlide4(pptx)      // Platform architecture
  buildSlide5(pptx)      // End-to-end workflow
  buildSlide6(pptx)      // Security validation
  buildSlide7(pptx)      // Evidence architecture
  buildSlide8(pptx)      // Framework evidence graph
  buildSlide9(pptx)      // Orchestration and Decision Pipeline
  buildSlide10(pptx)     // Continuous assurance and control
  buildSlide11(pptx)     // Defensibility and strategic value
  buildAppendixA(pptx)   // Technical maturity matrix
  buildAppendixB(pptx)   // Capability taxonomy
  buildAppendixC(pptx)   // Evidence trust model

  // Output path
  const outputDir = join(projectRoot, 'public', 'centaurus')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = join(outputDir, 'haiec-technical-architecture-defensibility-brief.pptx')

  await pptx.writeFile({ fileName: outputPath })

  console.log(`\n✓ HAIEC Technical Deck generated successfully`)
  console.log(`  Path: ${outputPath}`)
  console.log(`  Slides: ${TOTAL_SLIDES} (11 primary + 3 appendix)`)
  console.log(`  Git commit: ${GIT_COMMIT}`)
  console.log(`  Date: ${new Date().toISOString().split('T')[0]}`)
}

main().catch(err => {
  console.error('Error generating deck:', err)
  process.exit(1)
})
