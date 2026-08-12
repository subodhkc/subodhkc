/**
 * HAIEC Technical Architecture & Defensibility Brief
 * PowerPoint Generation Script
 *
 * Generates: public/centaurus/haiec-technical-architecture-defensibility-brief.pptx
 * Format: 16:9 widescreen, light theme, emerald accents
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
  bg: 'FFFFFF',          // pure white background
  bgAlt: 'F5F5F5',       // light gray panel
  bgDeep: 'EBEBEB',      // medium gray for contrast
  card: 'FFFFFF',        // white card
  cardBorder: 'D0D0D0',  // subtle gray border
  navy: '1A2B4A',        // primary - deep navy
  navyDark: '0F1D33',    // darker navy for emphasis
  navyLight: '2E4470',   // lighter navy
  white: '1A1A1A',       // primary text - near-black charcoal
  gray: '4A4A4A',        // body text - dark gray
  grayMid: '6B6B6B',     // secondary text - medium gray
  grayLight: '999999',   // tertiary text - light gray
  grayFaint: 'CCCCCC',   // borders, dividers
  sans: 'Arial',         // body font
  heading: 'Arial',      // heading font
  mono: 'Arial',         // label font
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
  slide.addShape('line', {
    x: 0.5, y: SLIDE_H - 0.42, w: SLIDE_W - 1.0, h: 0,
    line: { color: THEME.grayFaint, width: 0.5 }
  })
  slide.addText(
    `HAIEC  ·  Confidential Discussion Brief  ·  ${pageNum}/${totalPages}`,
    {
      x: 0.5, y: SLIDE_H - 0.35, w: 8, h: 0.25,
      fontSize: 8, color: THEME.grayMid, fontFace: THEME.sans
    }
  )
  slide.addText(
    `v1.0  ·  ${new Date().toISOString().split('T')[0]}`,
    {
      x: SLIDE_W - 3.5, y: SLIDE_H - 0.35, w: 3.0, h: 0.25,
      fontSize: 8, color: THEME.grayMid, fontFace: THEME.sans, align: 'right'
    }
  )
}

function addSlideTitle(slide, text, opts = {}) {
  const y = opts.y ?? 0.5
  slide.addText(text, {
    x: 0.5, y, w: SLIDE_W - 1.0, h: 0.6,
    fontSize: 22, fontFace: THEME.heading, bold: true,
    color: THEME.navy, align: 'left'
  })
  slide.addShape('line', {
    x: 0.5, y: y + 0.65, w: SLIDE_W - 1.0, h: 0,
    line: { color: THEME.navy, width: 1 }
  })
}

function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: opts.fill ?? THEME.card },
    line: { color: opts.border ?? THEME.cardBorder, width: 0.5 },
  })
}

function addStatusTag(slide, x, y, label, status) {
  const statusColor = status === 'roadmap' ? THEME.grayMid : THEME.navy
  slide.addText(label, {
    x, y, w: 1.8, h: 0.25,
    fontSize: 8, fontFace: THEME.sans, color: statusColor,
    align: 'left', valign: 'middle', bold: true
  })
}

function addMonoLabel(slide, x, y, text, opts = {}) {
  slide.addText(text, {
    x, y, w: opts.w ?? 3, h: 0.2,
    fontSize: 8, fontFace: THEME.sans, color: THEME.grayMid,
    align: opts.align ?? 'left', bold: true
  })
}

function addBodyText(slide, x, y, w, h, text, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: opts.fontSize ?? 11, fontFace: THEME.sans,
    color: opts.color ?? THEME.gray,
    align: 'left', valign: 'top',
    lineSpacingMultiple: 1.15,
    bold: opts.bold ?? false
  })
}

function addArrowConnector(slide, x1, y1, x2, y2) {
  slide.addShape('line', {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color: THEME.grayLight, width: 1, endArrowType: 'triangle' }
  })
}

function addRightArrow(slide, x, y, w) {
  slide.addShape('line', {
    x, y, w, h: 0,
    line: { color: THEME.grayLight, width: 1, endArrowType: 'triangle' }
  })
}

function addDownArrow(slide, x, y, h) {
  slide.addShape('line', {
    x, y, w: 0, h,
    line: { color: THEME.grayLight, width: 1, endArrowType: 'triangle' }
  })
}

// ============================================================
// CAPABILITY COUNTS (from TDA modules)
// ============================================================

const CAPABILITY_COUNTS = {
  semgrepRules: 91,
  coreTsrules: 15,
  rulepackRules: 82,
  // Do not publish a combined total - these are different representations
  // (detector definitions, display IDs, mapping records) that may overlap
  baseAttackTemplates: 234,
  voiceAttackTemplates: 12,
  embeddedSaasTemplates: 7,
  agenticTemplates: 7,
  aiDevTemplates: 3,
  ragDeepTemplates: 6,
  totalAttackTemplates: 269,
  safetyProperties: 14,
  complianceFrameworks: 13,
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
const TOTAL_SLIDES = 15

// ============================================================
// SLIDE BUILDERS
// ============================================================

// --- Slide 1: Cover ---
function buildSlide1(pptx) {
  const slide = pptx.addSlide()
  slide.background = { color: THEME.bg }

  // Top label
  addMonoLabel(slide, 0.5, 0.5, 'HAIEC TECHNICAL BRIEF  |  v1.0  |  CONFIDENTIAL', { w: 8 })

  // Thin divider
  slide.addShape('line', {
    x: 0.5, y: 0.8, w: SLIDE_W - 1.0, h: 0,
    line: { color: THEME.navy, width: 1 }
  })

  // Main title
  slide.addText('HAIEC', {
    x: 0.5, y: 1.5, w: 12, h: 1.0,
    fontSize: 48, fontFace: THEME.heading, bold: true,
    color: THEME.navy, align: 'left'
  })

  // Subtitle
  slide.addText('Evidence-Native Validation Infrastructure for AI Applications', {
    x: 0.5, y: 2.6, w: 11, h: 0.5,
    fontSize: 20, fontFace: THEME.heading,
    color: THEME.gray, align: 'left'
  })

  // Supporting line
  slide.addText('How HAIEC connects code security, runtime testing, control mapping and audit evidence', {
    x: 0.5, y: 3.2, w: 11, h: 0.4,
    fontSize: 14, fontFace: THEME.sans,
    color: THEME.grayMid, align: 'left'
  })

  // Visual flow
  const flowY = 4.8
  const flowItems = ['AI System', 'Security Validation', 'Control Mapping', 'Verifiable Evidence']
  const flowW = 2.5
  const flowGap = 0.4
  let flowX = 0.5

  flowItems.forEach((item, i) => {
    addCard(slide, flowX, flowY, flowW, 0.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
    slide.addText(item, {
      x: flowX, y: flowY, w: flowW, h: 0.5,
      fontSize: 10, fontFace: THEME.sans, color: THEME.gray,
      align: 'center', valign: 'middle'
    })
    if (i < flowItems.length - 1) {
      addRightArrow(slide, flowX + flowW + 0.05, flowY + 0.25, flowGap - 0.1)
    }
    flowX += flowW + flowGap
  })

  // Footer
  slide.addText('Confidential Discussion Brief', {
    x: 0.5, y: 6.5, w: 6, h: 0.3,
    fontSize: 10, fontFace: THEME.sans, color: THEME.grayMid
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
    'HAIEC closes this gap by making evidence the central artifact - not a byproduct.',
    { fontSize: 13, color: THEME.navy, bold: true })

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
  addCard(slide, 5.2, 3.8, 3.0, 1.8, { fill: THEME.bgAlt, border: THEME.navy })
  slide.addText('HAIEC', {
    x: 5.2, y: 3.9, w: 3.0, h: 0.5,
    fontSize: 22, fontFace: THEME.heading, bold: true,
    color: THEME.navy, align: 'center'
  })
  slide.addText('Evidence-Native\nAI Security Platform', {
    x: 5.2, y: 4.4, w: 3.0, h: 0.8,
    fontSize: 10, fontFace: THEME.sans,
    color: THEME.gray, align: 'center', valign: 'middle'
  })
  // Thin divider line
  slide.addShape('line', {
    x: 6.2, y: 4.35, w: 1.0, h: 0,
    line: { color: THEME.navy, width: 0.5 }
  })

  // Connecting lines from domains to center
  addArrowConnector(slide, 3.8, 3.85, 5.2, 4.3)
  addArrowConnector(slide, 9.5, 3.85, 8.2, 4.3)
  addArrowConnector(slide, 3.8, 5.65, 5.2, 5.2)
  addArrowConnector(slide, 9.5, 5.65, 8.2, 5.2)

  // Bottom line
  addBodyText(slide, 0.6, 6.5, 12, 0.4,
    'The strategic asset is not one scanner or one report. It is the evidence relationship connecting system, test, finding, control, remediation and verification.',
    { fontSize: 11, color: THEME.navy, bold: true })

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
      items: ['Find vulnerabilities in code', 'Generate findings and alerts', 'Security findings often require separate evidence assembly and control mapping', 'Evidence is typically assembled downstream'],
      gap: 'Output stops at the finding. Evidence chain requires manual assembly.'
    },
    {
      title: 'Governance & GRC',
      items: ['Collect questionnaire responses', 'Track policy attestation', 'Governance platforms frequently depend on questionnaires, integrations or imported evidence rather than generating the technical observation themselves', 'Self-reported, not engine-generated'],
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
      fill: { color: THEME.navy }, line: { type: 'none' }
    })
    slide.addText(col.gap, {
      x: x + 0.2, y: 4.7, w: 3.4, h: 0.6,
      fontSize: 9, fontFace: THEME.sans, color: THEME.navy, italic: true
    })
  })

  // HAIEC bridge
  addCard(slide, 0.6, 5.9, 12.1, 0.7, { fill: THEME.bgAlt, border: THEME.navy })
  slide.addText('HAIEC bridges all three: engine-generated evidence flows from test → finding → control mapping → audit package in one platform.', {
    x: 0.8, y: 5.9, w: 11.7, h: 0.7,
    fontSize: 11, fontFace: THEME.sans, color: THEME.navy,
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
    { name: 'INPUTS', items: 'Git repos · API keys · AI inventory · System registration' },
    { name: 'EVALUATION', items: 'Static engine (91 Semgrep + 15 TS + 82 rulepack) · Runtime engine (269 templates) · Wizard' },
    { name: 'COORDINATION', items: 'Audit Orchestrator · State machine · Hash-chained event log' },
    { name: 'DECISION & EVIDENCE', items: 'Decision Pipeline (6 nodes, DIS) · Evidence manifests · Framework mapping' },
    { name: 'DISTRIBUTION', items: 'Trust artifacts · Audit packages · Verification API · CI integration' },
  ]

  layers.forEach((layer, i) => {
    const y = 1.5 + i * 1.05
    addCard(slide, 0.6, y, 12.1, 0.85, { fill: THEME.bgAlt, border: THEME.cardBorder })
    // Layer name - flat text label
    slide.addText(layer.name, {
      x: 0.8, y: y + 0.15, w: 2.8, h: 0.3,
      fontSize: 9, fontFace: THEME.sans, color: THEME.navy, bold: true,
      align: 'left', valign: 'middle'
    })
    addBodyText(slide, 3.8, y + 0.15, 8.7, 0.55, layer.items, { fontSize: 11, color: THEME.gray })
  })

  // Architecture statement
  addCard(slide, 0.6, 6.5, 12.1, 0.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Modal Python runs the computation. TypeScript runs the product.', {
    x: 0.8, y: 6.5, w: 11.7, h: 0.5,
    fontSize: 11, fontFace: THEME.sans, color: THEME.navy,
    align: 'center', valign: 'middle', italic: true
  })

  addFooter(slide, 4, TOTAL_SLIDES)
}

// --- Slide 5: End-to-End Workflow ---
function buildSlide5(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Discover. Scan. Attack-Test. Map. Prove. Monitor.')

  // Six main stages - top row
  const mainSteps = [
    { num: '01', name: 'Discover', desc: 'Register AI system in inventory', detail: 'API key sync, system metadata' },
    { num: '02', name: 'Scan', desc: 'Static analysis on codebase', detail: '91 Semgrep + 15 TS + 82 rulepack' },
    { num: '03', name: 'Attack-Test', desc: 'Runtime adversarial testing', detail: '269 templates, 14 safety properties' },
    { num: '04', name: 'Map', desc: 'Findings → control mappings', detail: 'SOC2, ISO 27001:2022, OWASP, NIST AI RMF 1.0' },
    { num: '05', name: 'Prove', desc: 'Evidence manifest + audit package', detail: 'Hash-chained, fingerprinted' },
    { num: '06', name: 'Monitor', desc: 'Compliance Twin drift detection', detail: 'Delta engine, anomaly detection' },
  ]

  // Supporting lifecycle - bottom row
  const lifecycleSteps = [
    { name: 'Score', desc: 'Decision Integrity Score (DIS) · 6 pipeline nodes, weighted' },
    { name: 'Review', desc: 'Human reviewer sign-off · signature hash, IP, user-agent' },
    { name: 'Distribute', desc: 'Trust artifact + verification API · HMAC-signed, revocation' },
    { name: 'Revalidate', desc: 'Scheduled re-verification + drift · cron-based, drift alerts' },
  ]

  // Main stages - 6 cards in a row
  const mainW = 1.85
  const mainGap = 0.22
  let mainX = 0.6

  mainSteps.forEach((step, i) => {
    addCard(slide, mainX, 1.5, mainW, 2.5, { fill: THEME.card, border: THEME.cardBorder })
    slide.addText(step.num, {
      x: mainX + 0.1, y: 1.6, w: 0.8, h: 0.3,
      fontSize: 14, fontFace: THEME.mono, color: THEME.navy, bold: true
    })
    slide.addText(step.name, {
      x: mainX + 0.1, y: 1.95, w: mainW - 0.2, h: 0.35,
      fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.white
    })
    addBodyText(slide, mainX + 0.1, 2.35, mainW - 0.2, 0.6, step.desc, { fontSize: 9, color: THEME.gray })
    addMonoLabel(slide, mainX + 0.1, 3.0, step.detail, { w: mainW - 0.2 })

    if (i < mainSteps.length - 1) {
      addRightArrow(slide, mainX + mainW + 0.03, 2.75, mainGap - 0.06)
    }
    mainX += mainW + mainGap
  })

  // Down arrow
  addDownArrow(slide, 6.5, 4.1, 0.3)

  // Supporting lifecycle - 4 cards in a row
  const suppY = 4.6
  const suppW = 2.85
  const suppGap = 0.3
  let suppX = 0.6

  // Label for supporting actions
  addMonoLabel(slide, 0.6, 4.35, 'SUPPORTING LIFECYCLE ACTIONS', { w: 6 })

  lifecycleSteps.forEach((step, i) => {
    addCard(slide, suppX, suppY, suppW, 1.4, { fill: THEME.bgAlt, border: THEME.navy })
    slide.addText(step.name, {
      x: suppX + 0.15, y: suppY + 0.1, w: suppW - 0.3, h: 0.35,
      fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.navy
    })
    addBodyText(slide, suppX + 0.15, suppY + 0.5, suppW - 0.3, 0.8, step.desc, { fontSize: 9, color: THEME.gray })

    if (i < lifecycleSteps.length - 1) {
      addRightArrow(slide, suppX + suppW + 0.05, suppY + 0.7, suppGap - 0.1)
    }
    suppX += suppW + suppGap
  })

  // Bottom line
  addBodyText(slide, 0.6, 6.5, 12, 0.4,
    'Each step produces verifiable evidence anchored to the system, the engine version, and the point in time it was generated.',
    { fontSize: 11, color: THEME.navy, bold: true })

  addFooter(slide, 5, TOTAL_SLIDES)
}

// --- Slide 6: Security Validation ---
function buildSlide6(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Traditional application testing stops before the full AI decision path.')

  // Decision path diagram
  const pathNodes = ['INPUT', 'PROMPT', 'RETRIEVAL', 'TOOLS', 'MODEL', 'DECISION']
  const pathW = 1.7
  const pathGap = 0.25
  let pathX = 0.6

  pathNodes.forEach((node, i) => {
    addCard(slide, pathX, 1.4, pathW, 0.5, { fill: THEME.bgAlt, border: THEME.navy })
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
    fill: { color: THEME.grayMid }, line: { type: 'none' }
  })
  slide.addText('Traditional testing coverage', {
    x: 0.6, y: 2.05, w: 4, h: 0.25,
    fontSize: 8, fontFace: THEME.mono, color: THEME.grayMid
  })

  // HAIEC coverage bracket
  slide.addShape('rect', {
    x: 0.6, y: 2.3, w: 12.1, h: 0.04,
    fill: { color: THEME.navy }, line: { type: 'none' }
  })
  slide.addText('HAIEC full decision path coverage', {
    x: 0.6, y: 2.35, w: 5, h: 0.25,
    fontSize: 8, fontFace: THEME.mono, color: THEME.navy
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
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  addStatusTag(slide, 0.8, 3.9, 'IMPLEMENTED', 'implemented')
  const staticItems = [
    '91 Semgrep YAML detector definitions',
    '15 core TypeScript deterministic rules',
    '82 rule-to-framework mapping records',
    'Additional profile-specific TypeScript checks',
    'Taint analysis, flow graphs, call graphs',
    'Multi-language: JS/TS, Python, Go sidecars',
    'SHA256 finding fingerprints for evidence',
    'CI integration with policy enforcement engine',
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
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.navy
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
    { fontSize: 10, color: THEME.navy, bold: true })

  // Maturity note
  addBodyText(slide, 0.6, 6.7, 12, 0.3,
    'Maturity: Static engine - Implemented. Runtime engine - Active development with full execution path operational.',
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
      fill: THEME.bgAlt,
      border: i === 0 ? THEME.navy : THEME.cardBorder
    })
    slide.addText(item.label, {
      x: fx + 0.1, y: 1.6, w: item.w - 0.2, h: 0.7,
      fontSize: 11, fontFace: THEME.heading, bold: true,
      color: THEME.navy, align: 'center', valign: 'middle'
    })
    slide.addText(item.sub, {
      x: fx + 0.1, y: 2.4, w: item.w - 0.2, h: 1.2,
      fontSize: 8, fontFace: THEME.sans, color: THEME.grayMid,
      align: 'center', valign: 'top'
    })
    if (i < flowItems.length - 1) {
      addRightArrow(slide, fx + item.w + 0.05, 2.6, 0.2)
    }
    fx += item.w + 0.3
  })

  // Key line
  addBodyText(slide, 0.6, 4.1, 12, 0.4,
    'Every evidence record binds a finding to its source, its scope, its engine version, and its compliance mapping - at the point of generation.',
    { fontSize: 12, color: THEME.navy, bold: true })

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

  // Maturity note - moved up to avoid overflow
  addBodyText(slide, 0.6, 6.5, 12, 0.3,
    'Maturity: Evidence integrity - Implemented. HMAC-SHA256 with key rotation and replay protection. Upgrade path: Ed25519 public-key signatures for independent verification.',
    { fontSize: 8, color: THEME.grayMid })

  addFooter(slide, 7, TOTAL_SLIDES)
}

// --- Slide 8: Framework Evidence Graph ---
function buildSlide8(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'One remediation can support multiple assurance requirements.')

  // Example finding
  addCard(slide, 0.6, 1.3, 3.5, 1.8, { fill: THEME.bgAlt, border: THEME.grayMid })
  addMonoLabel(slide, 0.75, 1.4, 'EXAMPLE FINDING', { w: 3.2 })
  slide.addText('R1: Prompt Injection', {
    x: 0.75, y: 1.65, w: 3.2, h: 0.35,
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.white
  })
  addBodyText(slide, 0.75, 2.05, 3.2, 0.9,
    'User input reaches system prompt without validation guard. Source: API endpoint. Sink: LLM call.',
    { fontSize: 9, color: THEME.gray })

  // Evidence
  addCard(slide, 4.4, 1.3, 2.5, 1.8, { fill: THEME.bgAlt, border: THEME.navy })
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
    { name: 'OWASP LLM01:2025', detail: 'Prompt Injection' },
    { name: 'SOC2 CC7.2', detail: 'System Monitoring' },
    { name: 'ISO 27001:2022 A.8.8', detail: 'Technical Vulnerability Mgmt' },
    { name: 'NIST AI RMF 1.0', detail: 'MEASURE-2.7, MANAGE-1.1' },
    { name: 'EU AI Act', detail: 'Art15-Robustness, Art12-Logging' },
    { name: 'ISO 42001:2023', detail: '8.2, 8.4, 9.1' },
  ]

  frameworks.forEach((fw, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 7.5 + col * 2.7
    const y = 1.3 + row * 0.65
    addCard(slide, x, y, 2.5, 0.55, { fill: THEME.bgAlt, border: THEME.navy })
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
    { fontSize: 10, color: THEME.navy, bold: true })

  // Strategic line
  addCard(slide, 0.6, 3.9, 12.1, 1.2, { fill: THEME.bgAlt, border: THEME.navy })
  slide.addText('Strategic Value', {
    x: 0.8, y: 4.0, w: 11.7, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  addBodyText(slide, 0.8, 4.3, 11.7, 0.7,
    'A single remediation can generate reusable technical evidence across multiple assurance reviews. The same source change, retest and evidence record can support related OWASP, NIST, SOC 2, ISO and EU AI Act control evaluations - without recollecting the technical evidence separately for each framework.',
    { fontSize: 10, color: THEME.white })

  // Tagline
  addBodyText(slide, 0.6, 5.3, 12, 0.3,
    'Remediate once. Reuse the evidence across frameworks.',
    { fontSize: 12, color: THEME.navy, bold: true })

  // Source footer
  addBodyText(slide, 0.6, 5.7, 12, 0.3,
    'Source: lib/ai-security/compliance-mappings.ts - 82 unique rule IDs mapped to 13 compliance frameworks.',
    { fontSize: 8, color: THEME.grayMid })

  // Framework list
  addBodyText(slide, 0.6, 6.1, 12, 0.5,
    'Mapped frameworks: SOC 2 · ISO 27001:2022 · ISO 42001:2023 · OWASP LLM Top 10:2025 · GDPR · HIPAA · CWE · NIST AI RMF 1.0 · EU AI Act · CCPA · NYC LL144 · Colorado AI Act · FTC Act',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 8, TOTAL_SLIDES)
}

// --- Slide 9: Orchestration and Decision Pipeline ---
function buildSlide9(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Verified coverage determines current eligibility.\nCritical findings will become explicit release gates.')

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
  addCard(slide, 4.1, 1.3, 4.5, 1.5, { fill: THEME.bgAlt, border: THEME.navy })
  addMonoLabel(slide, 4.25, 1.4, 'DECISION PIPELINE', { w: 4.2 })
  slide.addText('6 Nodes: INPUT → PROMPT → RETRIEVAL → TOOLS → MODEL → DECISION', {
    x: 4.25, y: 1.7, w: 4.2, h: 0.3,
    fontSize: 9, fontFace: THEME.mono, color: THEME.white
  })
  slide.addText('Decision Integrity Score (DIS) = weighted average �- coverage penalty', {
    x: 4.25, y: 2.1, w: 4.2, h: 0.3,
    fontSize: 9, fontFace: THEME.sans, color: THEME.navy
  })
  slide.addText('NIST AI RMF: GOVERN · MAP · MEASURE · MANAGE', {
    x: 4.25, y: 2.4, w: 4.2, h: 0.3,
    fontSize: 9, fontFace: THEME.mono, color: THEME.gray
  })

  // Arrow
  addRightArrow(slide, 8.7, 2.0, 0.3)

  // Output
  addCard(slide, 9.1, 1.3, 3.6, 1.5, { fill: THEME.bgAlt, border: THEME.navy })
  addMonoLabel(slide, 9.25, 1.4, 'OUTPUT', { w: 3.3 })
  const outputs = ['DIS score (0-100)', 'Per-node breakdown', 'Audit package (JSON)', 'Review sign-off chain', 'Drift detection']
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
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  addStatusTag(slide, 0.8, 3.6, 'IMPLEMENTED', 'implemented')
  const currentItems = [
    'Aggregation job normalizes all engine outputs to 6 nodes',
    'DIS formula v1.0 with locked methodology version',
    'Coverage penalty: <50% → �-0.85, 50-74% → �-0.95, ≥75% → �-1.00',
    'Audit eligibility: FULL_RUN with every required architecture node VERIFIED',
    'PARTIAL_RUN results consistently excluded from audit eligibility',
    'Human review workflow with signature hash + IP + user-agent',
    'Drift detection: ≥10pt overall drop or ≥15pt node drop or eligibility flip',
    'Enterprise V1 API with feature gate and rate limiting',
  ]
  currentItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 0.8, y: 4.0 + i * 0.24, w: 5.4, h: 0.22,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Roadmap & next capabilities
  addCard(slide, 6.9, 3.1, 5.8, 2.8, { fill: THEME.bgAlt, border: THEME.navy })
  slide.addText('Roadmap & Next Capabilities', {
    x: 7.1, y: 3.2, w: 5.4, h: 0.35,
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  addStatusTag(slide, 7.1, 3.6, 'ACTIVE DEVELOPMENT', 'implemented')
  const hardeningItems = [
    'Findings-level blocker gates: scoring implemented, enforcement activation next',
    'Critical-finding gates: eligibility enforcement in active development',
    'Minimum coverage thresholds as explicit eligibility conditions',
    'QStash async job: infrastructure ready, production token configuration next',
    'Scheduled re-verification: cron infrastructure ready, scheduling activation next',
    'Review workflow: sign-off chain implemented, production rollout next',
  ]
  hardeningItems.forEach((item, i) => {
    slide.addText(`•  ${item}`, {
      x: 7.1, y: 4.0 + i * 0.24, w: 5.4, h: 0.22,
      fontSize: 8, fontFace: THEME.sans, color: THEME.white
    })
  })

  // Product principle
  addBodyText(slide, 0.6, 6.2, 12, 0.3,
    'Product principle: UI never computes scores - it only reads from aggregation output tables. Methodology version is locked at compute time.',
    { fontSize: 10, color: THEME.navy, bold: true })

  // Maturity notes
  addBodyText(slide, 0.6, 6.6, 12, 0.3,
    'Maturity: Decision Pipeline - Implemented (scoring, aggregation, audit package, PARTIAL_RUN exclusion). Findings-level blocker enforcement in active development for eligibility gate activation.',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 9, TOTAL_SLIDES)
}

// --- Slide 10: Continuous Assurance and Control ---
function buildSlide10(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'Validation should change when the system changes.')

  // Compliance Twin
  addCard(slide, 0.6, 1.3, 5.8, 3.0, { fill: THEME.bgAlt, border: THEME.navy })
  slide.addText('Compliance Twin', {
    x: 0.8, y: 1.4, w: 5.4, h: 0.35,
    fontSize: 13, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  addStatusTag(slide, 0.8, 1.8, 'SUBSTANTIVE SUBSYSTEM', 'implemented')
  const twinItems = [
    '17 files in lib/compliance-twin/ - entirely TypeScript',
    '6 jurisdictions: NYC LL144, Colorado SB24-205, EU AI Act, US Federal, UK, International',
    'Delta engine: structured diff between compliance snapshots (Patent P1)',
    'Anomaly detector: Z-score + IQR statistical methods',
    'Alert engine: deduplication + 4-level escalation',
    'Rulepack engine: 23 seed rules across 4 frameworks',
    'Snapshot engine: SHA-256-addressed, tamper-evident state snapshots',
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
    { layer: 'L1', name: 'Rate Limiting', status: 'implemented' },
    { layer: 'L2', name: 'Circuit Breaker', status: 'implemented' },
    { layer: 'L3', name: 'AI Execution Stop', status: 'implemented' },
    { layer: 'L4', name: 'Network Block', status: 'roadmap' },
    { layer: 'L5', name: 'Database Revoke', status: 'roadmap' },
  ]

  killLayers.forEach((kl, i) => {
    const y = 2.2 + i * 0.35
    slide.addText(kl.layer, {
      x: 7.1, y, w: 0.4, h: 0.3,
      fontSize: 10, fontFace: THEME.sans, color: THEME.navy, bold: true
    })
    slide.addText(kl.name, {
      x: 7.6, y, w: 3.5, h: 0.3,
      fontSize: 9, fontFace: THEME.sans, color: THEME.gray
    })
    slide.addText(kl.status === 'implemented' ? 'AVAILABLE' : 'ROADMAP', {
      x: 11.2, y, w: 1.3, h: 0.3,
      fontSize: 8, fontFace: THEME.sans,
      color: kl.status === 'implemented' ? THEME.navy : THEME.grayMid,
      bold: true, align: 'right', valign: 'middle'
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
    { fontSize: 11, color: THEME.navy, bold: true })

  // Maturity notes
  addCard(slide, 0.6, 5.2, 12.1, 1.5, { fill: THEME.bgAlt, border: THEME.navy })
  addBodyText(slide, 0.8, 5.3, 11.7, 0.3,
    'Maturity Notes:',
    { fontSize: 10, color: THEME.white, bold: true })
  addBodyText(slide, 0.8, 5.6, 11.7, 1.0,
    '•  Compliance Twin: Substantive implemented subsystem (17 files, 17 API routes, 8 DB models). Full lifecycle management across 6 jurisdictions.\n•  Kill Switch: Layers 1-3 available (rate limiting, circuit breaker, AI execution stop). Layers 4-5 (network block, database revoke) in development. SDK published as npm package.',
    { fontSize: 9, color: THEME.gray })

  addFooter(slide, 10, TOTAL_SLIDES)
}

// --- Slide 11: Defensibility and Strategic Value ---
function buildSlide11(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'The defensibility compounds across the evidence lifecycle.')

  const layers = [
    { name: '1. Rule Depth', desc: '91 Semgrep + 15 TS + 82 rulepack records. 269 attack templates. Multi-language, multi-provider, multi-domain.' },
    { name: '2. Evidence Architecture', desc: 'Finding → manifest → fingerprint → audit package → trust artifact. Hash-chained, version-pinned.' },
    { name: '3. Framework Mapping', desc: '13 compliance frameworks mapped from 82 unique rule IDs. One remediation → reusable evidence across frameworks.' },
    { name: '4. Orchestrated Workflow', desc: 'State machine, contract validation, hash-chained event log. DB as source of truth.' },
    { name: '5. Decision Pipeline', desc: '6-node DIS, NIST AI RMF 1.0 breakdown, audit eligibility, human review sign-off.' },
    { name: '6. Continuous Assurance', desc: 'Compliance Twin drift detection, scheduled re-verification, regression testing.' },
    { name: '7. Distribution', desc: 'Trust artifacts, verification API, CI integration, enterprise V1 API.' },
  ]

  layers.forEach((layer, i) => {
    const y = 1.3 + i * 0.62
    addCard(slide, 0.6, y, 8.0, 0.52, { fill: THEME.bgAlt, border: THEME.cardBorder })
    slide.addText(layer.name, {
      x: 0.8, y: y + 0.05, w: 2.5, h: 0.4,
      fontSize: 10, fontFace: THEME.heading, bold: true, color: THEME.navy
    })
    addBodyText(slide, 3.3, y + 0.05, 5.2, 0.4, layer.desc, { fontSize: 9, color: THEME.white })
  })

  // Distribution arrow
  addRightArrow(slide, 8.7, 3.5, 0.3)

  // Strategic outcomes
  const outcomes = [
    { title: 'Switching Costs', desc: 'Switching costs increase as CI integrations, historical evidence, framework mappings and revalidation records accumulate.' },
    { title: 'Coverage & Learning Effects', desc: 'More systems tested can improve attack coverage, remediation patterns and framework mappings - subject to privacy, tenancy and data-use constraints.' },
    { title: 'Evidence-Graph Advantage', desc: 'The defensibility grows from versioned relationships among systems, tests, findings, remediations, controls and historical outcomes.' },
  ]

  outcomes.forEach((outcome, i) => {
    const y = 1.5 + i * 1.5
    addCard(slide, 9.1, y, 3.6, 1.3, { fill: THEME.bgAlt, border: THEME.navy })
    // Left accent strip
    slide.addShape('rect', {
      x: 9.1, y, w: 0.06, h: 1.3,
      fill: { color: THEME.navy }, line: { type: 'none' }
    })
    slide.addText(outcome.title, {
      x: 9.3, y: y + 0.1, w: 3.2, h: 0.35,
      fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.navyDark
    })
    addBodyText(slide, 9.3, y + 0.5, 3.2, 0.7, outcome.desc, { fontSize: 9, color: THEME.gray })
  })

  // Main line
  addBodyText(slide, 0.6, 6.0, 12, 0.3,
    'Each layer reinforces the next. The evidence relationship - not any single scanner - is the defensible asset.',
    { fontSize: 11, color: THEME.navy, bold: true })

  // Discussion questions
  addCard(slide, 0.6, 6.4, 12.1, 0.7, { fill: THEME.bgAlt, border: THEME.navy })
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
  addCard(slide, 0.4, 1.2, 12.5, 0.4, { fill: THEME.bgAlt, border: THEME.navy })
  headers.forEach((h, i) => {
    slide.addText(h, {
      x: colX + 0.1, y: 1.22, w: colWidths[i] - 0.1, h: 0.35,
      fontSize: 9, fontFace: THEME.heading, bold: true, color: THEME.navy,
      valign: 'middle'
    })
    colX += colWidths[i]
  })

  const rows = [
    {
      cap: 'Static AI Security',
      status: 'Implemented',
      statusType: 'implemented',
      proof: '91 Semgrep + 15 TS + 82 rulepack, Modal Python scanner, 31 API routes, 8 DB models',
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
      limit: 'Ed25519 public-key signatures for independent verification'
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
      status: 'Active development (L1-L3 available)',
      statusType: 'implemented',
      proof: 'Published SDK v0.3.0, execution guard, 19 API routes',
      value: 'Emergency shutdown capability for AI systems',
      limit: 'Layers 4-5 (network block, database revoke) in development'
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
    const statusColor = row.statusType === 'implemented' ? THEME.navy :
                        row.statusType === 'partial' ? THEME.grayMid : THEME.navyDark
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
      fontSize: 7, fontFace: THEME.sans, color: THEME.navy, valign: 'middle'
    })
  })

  addFooter(slide, 13, TOTAL_SLIDES)
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
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  const staticData = [
    `Semgrep YAML rules: ${CAPABILITY_COUNTS.semgrepRules}`,
    `Core TS deterministic rules: ${CAPABILITY_COUNTS.coreTsrules}`,
    `Rulepack mapping records: ${CAPABILITY_COUNTS.rulepackRules}`,
    'Note: These are different representations',
    '(detectors, display IDs, mappings)',
    'Do not add to a combined total',
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
      color: item.includes(':') && !item.startsWith('  ') ? THEME.navy : THEME.white
    })
  })

  // Runtime Attack Templates
  addCard(slide, 4.6, 1.4, 3.8, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Runtime Attack Templates', {
    x: 4.8, y: 1.5, w: 3.4, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.navy
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
      color: item.includes('Total') ? THEME.navy : THEME.white
    })
  })

  // Safety Properties
  addCard(slide, 8.6, 1.4, 4.1, 2.5, { fill: THEME.bgAlt, border: THEME.cardBorder })
  slide.addText('Safety Properties & Frameworks', {
    x: 8.8, y: 1.5, w: 3.7, h: 0.3,
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.navy
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
    fontSize: 11, fontFace: THEME.heading, bold: true, color: THEME.navy
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
      fontSize: 8, fontFace: THEME.mono, color: THEME.navy
    })
    slide.addText(api.path, {
      x, y: y + 0.25, w: 2.8, h: 0.2,
      fontSize: 7, fontFace: THEME.mono, color: THEME.gray
    })
  })

  // Total
  slide.addText(`Total API routes: ${totalRoutes}`, {
    x: 0.8, y: 6.0, w: 5, h: 0.3,
    fontSize: 10, fontFace: THEME.mono, color: THEME.navy, bold: true
  })
  slide.addText(`Jurisdictions: ${CAPABILITY_COUNTS.jurisdictions}  ·  Pipeline nodes: ${CAPABILITY_COUNTS.pipelineNodes}  ·  Seed rules: ${CAPABILITY_COUNTS.rulepackSeedRules}`, {
    x: 5.5, y: 6.0, w: 7, h: 0.3,
    fontSize: 9, fontFace: THEME.mono, color: THEME.gray
  })

  addFooter(slide, 14, TOTAL_SLIDES)
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
    fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.navy
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
      fill: { color: item.implemented ? THEME.navy : THEME.grayMid }, line: { type: 'none' }
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
      fontSize: 8, fontFace: THEME.mono, color: THEME.navy
    })
    slide.addText(et.desc, {
      x: 3.3, y: 4.4 + i * 0.35, w: 2.9, h: 0.3,
      fontSize: 8, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Verification architecture
  addCard(slide, 0.8, 5.5, 5.4, 0.8, { fill: THEME.bg, border: THEME.navy })
  slide.addText('Verification Architecture', {
    x: 0.9, y: 5.55, w: 5.2, h: 0.25,
    fontSize: 8, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  slide.addText('HMAC-SHA256 provides integrity and authentication for verification responses. Verification via HAIEC /api/verify endpoint with key rotation and replay protection. Upgrade path: Ed25519 public-key signatures for independent verification. Stronger non-repudiation would additionally require identity-bound key custody and trusted timestamping.', {
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
      fontSize: 7, fontFace: THEME.mono, color: THEME.navy
    })
    slide.addText(at.desc, {
      x: 10.1, y: 4.4 + i * 0.35, w: 2.4, h: 0.3,
      fontSize: 7, fontFace: THEME.sans, color: THEME.gray
    })
  })

  // Scope statement
  addCard(slide, 7.1, 5.5, 5.4, 0.8, { fill: THEME.bg, border: THEME.navy })
  slide.addText('Scope Verification', {
    x: 7.2, y: 5.55, w: 5.2, h: 0.25,
    fontSize: 8, fontFace: THEME.heading, bold: true, color: THEME.navy
  })
  slide.addText('Each artifact carries scopeVerified and scopeNotVerified arrays. Status labels (e.g., SECURED) reflect rule pass/fail posture within verified scope, providing precise, scoped assurance.', {
    x: 7.2, y: 5.8, w: 5.2, h: 0.5,
    fontSize: 7, fontFace: THEME.sans, color: THEME.gray
  })

  addFooter(slide, 15, TOTAL_SLIDES)
}

// --- Slide 12: What Can Be Demonstrated Today ---
function buildSlide12(pptx) {
  const slide = pptx.addSlide()
  addSlideBackground(slide)
  addSlideTitle(slide, 'What can be demonstrated today.')

  addBodyText(slide, 0.6, 1.2, 12, 0.4,
    'The following capabilities are operational and can be shown live in a working session.',
    { fontSize: 12, color: THEME.gray })

  const demos = [
    { num: '1', title: 'Repository Connected', desc: 'AI system registered in inventory with API key sync and system metadata. Git integration active.' },
    { num: '2', title: 'AI-Specific Finding with File and Line', desc: 'Static scan produces findings with rule ID, code path, line number, and the missing guard. SHA256 fingerprint attached.' },
    { num: '3', title: 'Runtime Attack and Captured Response', desc: 'Adversarial template executed against live endpoint. Response captured, safety property evaluated, result recorded.' },
    { num: '4', title: 'Framework-Control Mapping', desc: 'Finding automatically mapped to OWASP LLM01:2025, SOC 2 CC7.2, ISO 27001:2022 A.8.8, NIST AI RMF 1.0, EU AI Act, ISO 42001:2023.' },
    { num: '5', title: 'Audit Evidence Package', desc: 'Canonical evidence manifest with DIS score, per-node breakdown, framework mappings, and review sign-off chain. Exported as JSON.' },
    { num: '6', title: 'Public Trust Artifact Verification', desc: 'GET /api/verify/[artifactId] returns HMAC-SHA256 signed response with artifact status, scope, and validity window.' },
  ]

  // Two columns of 3
  demos.forEach((demo, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.6 + col * 6.2
    const y = 1.8 + row * 1.6

    addCard(slide, x, y, 5.9, 1.4, { fill: THEME.bgAlt, border: THEME.cardBorder })
    // Number - flat text
    slide.addText(demo.num, {
      x: x + 0.15, y: y + 0.15, w: 0.4, h: 0.4,
      fontSize: 18, fontFace: THEME.heading, bold: true, color: THEME.navy,
      align: 'left', valign: 'middle'
    })
    // Title
    slide.addText(demo.title, {
      x: x + 0.7, y: y + 0.15, w: 5.0, h: 0.35,
      fontSize: 12, fontFace: THEME.heading, bold: true, color: THEME.navy
    })
    // Description
    addBodyText(slide, x + 0.7, y + 0.55, 5.0, 0.8, demo.desc, { fontSize: 9, color: THEME.gray })
  })

  // Bottom line
  addBodyText(slide, 0.6, 6.7, 12, 0.3,
    'These demonstrations are more persuasive than counts or API-route tables. Available for live walkthrough on request.',
    { fontSize: 10, color: THEME.navy, bold: true })

  addFooter(slide, 12, TOTAL_SLIDES)
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
  pptx.title = 'Evidence-Native Validation Infrastructure for AI Applications'

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
  buildSlide12(pptx)     // What can be demonstrated today
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
  console.log(`  Slides: ${TOTAL_SLIDES} (12 primary + 3 appendix)`)
  console.log(`  Git commit: ${GIT_COMMIT}`)
  console.log(`  Date: ${new Date().toISOString().split('T')[0]}`)
}

main().catch(err => {
  console.error('Error generating deck:', err)
  process.exit(1)
})
