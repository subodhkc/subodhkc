import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import Link from 'next/link'
import Grid from '@/components/Grid'
import { AIFrameworkDecisionTool } from '@/components/interactive/AIFrameworkDecisionTool'
import {
  Shield, AlertTriangle, Building2, HeartPulse,
  CheckCircle2, FileText, Users, ArrowRight, Lock,
  ClipboardCheck, RefreshCw, Layers, Gavel, Award, Microscope,
  Database, Cpu, Webhook,
} from 'lucide-react'

export const metadata = {
  title: 'How to Secure and Govern AI: NIST, ISO and SOC 2 | Subodh KC',
  description: 'Learn how AI laws, NIST AI RMF, ISO 42001, SOC 2, security testing, and continuous evidence work together to secure and govern AI across seven layers of compliance.',
  alternates: { canonical: 'https://subodhkc.com/how-to-secure-and-govern-ai' },
  openGraph: {
    title: 'How to Secure and Govern AI: NIST, ISO and SOC 2',
    description: 'Learn how AI laws, NIST AI RMF, ISO 42001, SOC 2, security testing, and continuous evidence work together to secure and govern AI across seven layers of compliance.',
    url: 'https://subodhkc.com/how-to-secure-and-govern-ai',
    type: 'article', authors: ['Subodh KC'],
    publishedTime: '2026-07-15', modifiedTime: '2026-07-15',
    tags: ['AI security', 'AI governance', 'NIST AI RMF', 'ISO 42001', 'SOC 2', 'AI compliance'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Secure and Govern AI: NIST, ISO and SOC 2',
    description: 'Learn how AI laws, NIST AI RMF, ISO 42001, SOC 2, security testing, and continuous evidence work together to secure and govern AI.',
    images: ['https://subodhkc.com/og-default.png'],
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: [
    'how to secure and govern AI', 'AI security and compliance framework',
    'NIST AI RMF versus ISO 42001', 'does SOC 2 cover AI',
    'AI governance framework for businesses', 'ISO 42001 versus SOC 2',
    'AI compliance checklist', 'enterprise AI assurance',
    'AI security assessment', 'AI governance for small businesses',
    'how to prove AI compliance', 'seven layers of AI compliance',
    'AI assurance maturity model', 'NIST AI RMF certification',
    'ISO 42001 certification requirements', 'SOC 2 AI controls',
    'OWASP GenAI security risks', 'MITRE ATLAS adversarial testing',
    'CSA AI Controls Matrix', 'AI impact assessment', 'AI red teaming',
    'AI evidence retention', 'AI vendor due diligence',
    'AI incident response evidence', 'AI compliance roadmap',
    'AI blast radius assessment', 'AI prompt injection testing',
    'RAG poisoning security', 'AI agent security controls',
    'MCP server security assessment', 'AI model drift monitoring',
    'EU AI Act compliance framework', 'Texas TRAIGA compliance',
  ],
  about: ['AI security', 'AI governance', 'AI compliance', 'NIST AI RMF', 'ISO/IEC 42001', 'SOC 2', 'AI assurance'],
}

const articleSchema = {
  '@context': 'https://schema.org', '@type': 'TechArticle',
  headline: 'How to Secure and Govern AI: NIST AI RMF, ISO/IEC 42001, SOC 2, and the Seven Layers of AI Compliance',
  description: 'Learn how AI laws, NIST AI RMF, ISO 42001, SOC 2, security testing, and continuous evidence work together to secure and govern AI.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-15', dateModified: '2026-07-15',
  url: 'https://subodhkc.com/how-to-secure-and-govern-ai',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://subodhkc.com/how-to-secure-and-govern-ai' },
  image: 'https://subodhkc.com/og-default.png', inLanguage: 'en',
  articleSection: 'AI Security & Governance', wordCount: 8500,
}

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://subodhkc.com/writing' },
    { '@type': 'ListItem', position: 3, name: 'How to Secure and Govern AI', item: 'https://subodhkc.com/how-to-secure-and-govern-ai' },
  ],
}

const faqs = [
  { q: 'How do I secure an AI system?', a: 'Secure the full application, not only the model. Protect identities, data, infrastructure, retrieval, tools, APIs, outputs, vendors, and logs. Then test for AI-specific risks such as prompt injection, RAG poisoning, sensitive-data disclosure, excessive agency, and unauthorized actions.' },
  { q: 'How do I make sure my AI is compliant?', a: 'Identify the laws and contracts that apply to the specific use case, implement the required controls, test those controls, retain evidence, and reassess when its model, data, purpose, tools, users, or jurisdiction changes.' },
  { q: 'Is there one AI compliance certification?', a: 'No single certification establishes compliance with every AI, privacy, employment, healthcare, biometric, or consumer-protection law. ISO/IEC 42001 certification can provide assurance over an AI management system within a defined scope. SOC 2 can provide assurance over defined service-organization controls. Neither establishes universal legal compliance.' },
  { q: 'Is NIST AI RMF mandatory?', a: 'NIST AI RMF is voluntary unless incorporated into a contract, organizational policy, regulatory expectation, or another binding requirement.' },
  { q: 'Can a company become NIST AI certified?', a: 'NIST AI RMF is not a NIST certification program. Organizations may state that their controls are mapped or aligned to the framework when supported by evidence.' },
  { q: 'What is ISO/IEC 42001?', a: 'ISO/IEC 42001 is an international management-system standard specifying requirements for establishing, implementing, maintaining, and continually improving an AI management system.' },
  { q: 'Is ISO/IEC 42001 certification mandatory?', a: 'Generally voluntary unless required by a customer, contract, regulator, procurement process, or organizational policy.' },
  { q: 'What is the difference between NIST AI RMF and ISO/IEC 42001?', a: 'NIST AI RMF is a voluntary, flexible risk-management framework. ISO/IEC 42001 is a formal AI management-system requirements standard that supports third-party certification.' },
  { q: 'Can an organization use NIST AI RMF and ISO/IEC 42001 together?', a: 'Yes. NIST AI RMF can inform practical risk-management activities, while ISO/IEC 42001 can formalize those activities within an auditable management system.' },
  { q: 'Does ISO/IEC 42001 replace ISO/IEC 27001?', a: 'No. ISO/IEC 42001 addresses AI management. ISO/IEC 27001 addresses information-security management. An AI organization may benefit from both.' },
  { q: 'What is ISO/IEC 23894?', a: 'ISO/IEC 23894 provides guidance for managing AI-specific risk and integrating it into organizational risk-management activities. It is not a standalone certification standard.' },
  { q: 'What is ISO/IEC 42005?', a: 'ISO/IEC 42005 provides guidance for assessing how an AI system and its foreseeable uses may affect individuals, groups, or society throughout its lifecycle.' },
  { q: 'What is SOC 2?', a: 'SOC 2 is an independent CPA examination and report concerning controls at a service organization relevant to security, availability, processing integrity, confidentiality, or privacy.' },
  { q: 'Is SOC 2 an AI certification?', a: 'No. SOC 2 is a control examination and report. It can include controls relevant to an AI service, but does not automatically certify the AI as accurate, unbiased, safe, or legally compliant.' },
  { q: 'Does every company using AI need SOC 2?', a: 'No. SOC 2 is most relevant to service organizations whose customers require independent control assurance. A company using an internal AI tool may not need SOC 2 solely because it uses AI.' },
  { q: 'What is the difference between SOC 2 Type I and Type II?', a: 'Type I evaluates control design as of a specified date. Type II also evaluates operating effectiveness over a defined period.' },
  { q: 'Does ISO certification prove that an AI system is safe?', a: 'No. Certification demonstrates that a defined management system meets a standard\u2019s requirements. Individual AI systems still require use-case-specific evaluation and technical testing.' },
  { q: 'What is AI assurance?', a: 'AI assurance is the process of building confidence that an AI system is governed, controlled, tested, monitored, and supported by sufficient evidence for its intended use.' },
  { q: 'What is the difference between AI governance and AI security?', a: 'AI governance establishes ownership, policies, risk decisions, oversight, and lifecycle processes. AI security protects the model, application, data, tools, identities, infrastructure, and integrations from unauthorized access, misuse, attack, and disruption.' },
  { q: 'What is an AI impact assessment?', a: 'An AI impact assessment examines how an AI system may affect individuals, groups, the organization, and society. It may consider rights, safety, privacy, discrimination, accessibility, economic effects, and foreseeable misuse.' },
  { q: 'What is AI red teaming?', a: 'AI red teaming uses adversarial scenarios to test how a system behaves when users, documents, tools, or integrations attempt to manipulate it or cause harmful outcomes.' },
  { q: 'Is a penetration test enough for an AI system?', a: 'Usually not. A traditional penetration test may evaluate infrastructure, APIs, and application vulnerabilities. AI-specific testing should also evaluate prompt injection, retrieval poisoning, hallucination, agent authority, tool calls, model outputs, and human oversight.' },
  { q: 'Do small businesses need AI governance?', a: 'Yes, but proportionate. A small business may begin with an AI inventory, named owner, approved-use policy, data restrictions, vendor review, basic testing, and incident process rather than pursuing formal certification immediately.' },
  { q: 'What evidence should an organization retain?', a: 'Relevant evidence may include AI inventory, purpose and ownership, model and prompt versions, data sources, access controls, risk and impact assessments, tests and results, tool calls, human approvals, incidents, complaints, remediation, vendor changes, and risk acceptance.' },
  { q: 'How often should AI compliance be reviewed?', a: 'Review whenever the system\u2019s model, prompt, data, purpose, users, permissions, tools, vendors, or applicable laws change. Higher-impact systems should also undergo regular scheduled reassessment.' },
  { q: 'Can an AI system ever be fully risk-free?', a: 'No. AI risk can be identified, reduced, monitored, transferred, accepted, or avoided. It cannot be permanently eliminated.' },
  { q: 'Who should own AI governance?', a: 'The business owner should own the outcome and accept residual business risk. Technical, data, security, legal, privacy, compliance, and operations teams should own the controls within their areas.' },
]

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}

const tocItems = [
  { id: 'direct-answer', label: 'The Direct Answer' },
  { id: 'commonly-confused', label: 'Why AI Security and Compliance Are Commonly Confused' },
  { id: 'seven-layers', label: 'The Seven Layers of AI Compliance' },
  { id: 'layer-1', label: 'Layer 1: Legal and Contractual Applicability' },
  { id: 'layer-2', label: 'Layer 2: Governance and Accountable Ownership' },
  { id: 'layer-3', label: 'Layer 3: AI Risk and Impact Assessment' },
  { id: 'layer-4', label: 'Layer 4: Cybersecurity, Privacy, and Data Controls' },
  { id: 'layer-5', label: 'Layer 5: AI-Specific Application and Model Security' },
  { id: 'layer-6', label: 'Layer 6: Validation and Independent Assurance' },
  { id: 'layer-7', label: 'Layer 7: Continuous Evidence, Monitoring, and Improvement' },
  { id: 'frameworks-comparison', label: 'How the Major Frameworks Fit Together' },
  { id: 'which-framework', label: 'Which Framework Should a Business Use?' },
  { id: 'maturity-ladder', label: 'The AI Assurance Maturity Ladder' },
  { id: 'truthful-claims', label: 'What Claims Can a Business Truthfully Make?' },
  { id: 'roadmap', label: 'A Practical Implementation Roadmap' },
  { id: 'csm6', label: 'Where CSM6 Fits' },
  { id: 'haiec', label: 'How HAIEC Fits Into the Stack' },
  { id: 'faq', label: 'FAQ' },
  { id: 'final-perspective', label: 'Final Perspective' },
  { id: 'related-resources', label: 'Related Resources' },
]

const layerColors = ['border-blue-500/30 bg-blue-500/5','border-indigo-500/30 bg-indigo-500/5','border-purple-500/30 bg-purple-500/5','border-pink-500/30 bg-pink-500/5','border-rose-500/30 bg-rose-500/5','border-amber-500/30 bg-amber-500/5','border-emerald-500/30 bg-emerald-500/5']
const layerData = [
  { n: 1, name: 'Legal and contractual applicability', q: 'What are we required to do?', icon: Gavel },
  { n: 2, name: 'Governance and accountable ownership', q: 'Who owns the system and its risks?', icon: Users },
  { n: 3, name: 'AI risk and impact assessment', q: 'What could happen if it fails or is misused?', icon: AlertTriangle },
  { n: 4, name: 'Cybersecurity, privacy, and data controls', q: 'Are the data, identities, and infrastructure protected?', icon: Shield },
  { n: 5, name: 'AI-specific application and model security', q: 'Is the AI application resistant to AI-specific failures and attacks?', icon: Cpu },
  { n: 6, name: 'Validation and independent assurance', q: 'Do the controls work, and has anyone independently examined them?', icon: ClipboardCheck },
  { n: 7, name: 'Continuous evidence, monitoring, and improvement', q: 'Can we prove the system remains controlled after launch?', icon: RefreshCw },
]
const fw = [
  { s: 'Applicable AI and sector laws', p: 'Establish obligations, prohibitions, rights, and enforcement', m: 'Yes, when in scope', c: 'Regulator or court enforcement', np: 'Complete technical security' },
  { s: 'NIST AI RMF', p: 'Organize AI risk governance and management', m: 'Voluntary unless adopted elsewhere', c: 'No NIST certification', np: 'Legal compliance or technical effectiveness' },
  { s: 'ISO/IEC 42001', p: 'Establish an AI management system', m: 'Usually voluntary unless contractually required', c: 'Third-party certification available', np: 'Accuracy of every AI output' },
  { s: 'ISO/IEC 23894', p: 'Guide AI risk management', m: 'Voluntary', c: 'Not a management-system certification', np: 'Organization-wide assurance' },
  { s: 'ISO/IEC 42005', p: 'Guide AI system impact assessments', m: 'Voluntary unless adopted elsewhere', c: 'Guidance, not standalone certification', np: 'Complete cybersecurity' },
  { s: 'NIST CSF 2.0', p: 'Organize cybersecurity outcomes', m: 'Voluntary unless adopted elsewhere', c: 'No NIST certification', np: 'AI-specific model behavior' },
  { s: 'ISO/IEC 27001', p: 'Establish an information-security management system', m: 'Usually voluntary', c: 'Third-party certification available', np: 'AI accuracy or legal compliance' },
  { s: 'ISO/IEC 27701', p: 'Establish a privacy information management system', m: 'Usually voluntary', c: 'Third-party certification available', np: 'Every privacy-law obligation' },
  { s: 'SOC 2', p: 'Independent CPA examination of defined controls', m: 'Usually customer or contract driven', c: 'Independent CPA report', np: 'Complete AI safety or compliance' },
  { s: 'OWASP GenAI', p: 'Identify AI-application security risks and mitigations', m: 'Voluntary', c: 'No certification', np: 'Complete governance or legal analysis' },
  { s: 'MITRE ATLAS', p: 'Describe adversarial AI tactics and techniques', m: 'Voluntary', c: 'No certification', np: 'Complete compliance' },
  { s: 'CSA AI Controls Matrix', p: 'Detailed controls for cloud-based AI systems', m: 'Voluntary', c: 'Supports CSA assurance approaches', np: 'Automatic compliance' },
  { s: 'Technical testing', p: 'Validate implementation against defined scenarios', m: 'Depends on risk and obligation', c: 'May be independently performed', np: 'Permanent security' },
  { s: 'Continuous evidence', p: 'Demonstrate ongoing control operation', m: 'Frequently required by policy, contract, or law', c: 'May support audits and investigations', np: 'Elimination of all risk' },
]
const claims = [
  ['"Mapped to NIST AI RMF"', 'Controls and evidence have been mapped to relevant AI RMF outcomes'],
  ['"Aligned with NIST AI RMF"', 'A documented, risk-based subset has been implemented'],
  ['"NIST AI certified"', 'Avoid; AI RMF is not a NIST certification program'],
  ['"Certified to ISO/IEC 42001"', 'An external certification body has certified the defined AIMS scope'],
  ['"ISO certified our company"', 'Avoid; ISO does not perform certification'],
  ['"SOC 2 Type II report available"', 'An independent CPA has issued a report covering a defined period'],
  ['"SOC 2 certified"', 'Avoid; SOC 2 is an examination and report, not certification'],
  ['"Tested against OWASP GenAI risks"', 'Defined tests were performed and documented'],
  ['"Compliant with Texas TRAIGA"', 'A scoped legal and control assessment supports the statement'],
  ['"AI secure"', 'Avoid as an absolute claim'],
  ['"Fully AI compliant"', 'Avoid unless the claim identifies exact laws, systems, scope, and date'],
  ['"No AI risk"', 'Avoid; risk can be reduced and managed, not eliminated'],
]
const maturity = [
  { l: 'Level 1: Documented', d: 'The organization knows what the system is, what it does, who owns it, what data it uses, and which vendors support it.', e: ['AI inventory', 'Owner', 'Purpose', 'Data map', 'Basic legal screening'] },
  { l: 'Level 2: Controlled', d: 'The organization has implemented policies, access restrictions, vendor review, human oversight, change controls, and incident ownership.', e: ['Approved policies', 'Access design', 'Tool permissions', 'Vendor assessment', 'Approval matrix'] },
  { l: 'Level 3: Tested', d: 'The organization verifies model quality, retrieval quality, access controls, prompt-injection resistance, tool restrictions, recovery, and applicable impact considerations.', e: ['Test cases', 'Results', 'Findings', 'Remediation', 'Retesting'] },
  { l: 'Level 4: Independently assessed', d: 'An independent party reviews security, AI risk, legal applicability, control design, and technical operation.', e: ['Independent security assessment', 'AI red-team report', 'Legal memorandum', 'External gap assessment'] },
  { l: 'Level 5: Formally assured', d: 'The organization maintains applicable formal assurance such as SOC 2, ISO/IEC 42001, ISO/IEC 27001, ISO/IEC 27701, or sector-specific assurance.', e: ['SOC 2 report', 'ISO/IEC 42001 certification', 'ISO/IEC 27001 certification', 'ISO/IEC 27701 certification', 'Sector-specific assurance'] },
]
const phases = [
  { p: 'Phase 1: Discover and scope', o: 'Understand the systems, business context, and obligations.', t: ['Inventory AI systems', 'Identify developers, deployers, and vendors', 'Assign business and technical owners', 'Map data, models, retrieval, tools, and integrations', 'Identify jurisdictions and affected users', 'Calculate the AI Blast Radius', 'Determine initial assurance requirements'], d: ['AI inventory', 'Stakeholder map', 'System and data-flow diagrams', 'Applicable-law register', 'Initial risk register', 'Blast-radius heat map'] },
  { p: 'Phase 2: Design governance and controls', o: 'Define how the organization will manage and control AI.', t: ['Select relevant NIST and ISO outcomes', 'Define policies and accountability', 'Establish approval and risk-acceptance processes', 'Define human-oversight requirements', 'Design access, RLS, and tenant isolation', 'Establish vendor controls', 'Define evidence and retention requirements', 'Build the test strategy'], d: ['AI governance policy', 'Control matrix', 'Approval matrix', 'Security architecture', 'Impact-assessment template', 'Testing plan', 'Evidence plan'] },
  { p: 'Phase 3: Implement', o: 'Put the controls into the application and operating environment.', t: ['Implement authentication and authorization', 'Restrict tools and agent actions', 'Add RAG-source governance', 'Implement input and output validation', 'Add monitoring, logging, and cost limits', 'Add human confirmation and escalation', 'Configure incident response', 'Train affected users'], d: ['Implemented technical controls', 'Tool registry', 'Monitoring configuration', 'Incident process', 'Training records', 'Updated architecture'] },
  { p: 'Phase 4: Validate', o: 'Verify that the implemented system and controls work.', t: ['Conduct functional testing', 'Evaluate model and retrieval quality', 'Test direct and indirect prompt injection', 'Test RAG poisoning', 'Test unauthorized and cross-tenant access', 'Test tool and MCP permissions', 'Test bias, accessibility, or safety where relevant', 'Test failure, recovery, and rollback', 'Remediate and retest findings'], d: ['Validation report', 'Findings register', 'Remediation evidence', 'Retest results', 'Residual-risk assessment'] },
  { p: 'Phase 5: Assure and approve', o: 'Obtain the appropriate level of independent confidence.', t: ['Obtain independent security testing', 'Complete legal review', 'Pursue SOC 2 where customers require it', 'Pursue applicable ISO certification when justified', 'Complete executive risk acceptance', 'Document deployment approval'], d: ['Independent reports', 'Certification or SOC evidence', 'Legal assessment', 'Executive approval', 'Production readiness package'] },
  { p: 'Phase 6: Operate and improve', o: 'Keep the system controlled as it changes.', t: ['Monitor quality, access, incidents, and cost', 'Review model and prompt changes', 'Monitor vendors and subprocessors', 'Repeat evaluations after material changes', 'Review user feedback and complaints', 'Conduct periodic access reviews', 'Update the legal map', 'Retire obsolete systems'], d: ['Operational scorecard', 'Change history', 'Continuous evidence', 'Periodic risk review', 'Incident reports', 'Improvement backlog', 'Retirement records'] },
]
const csm6 = [
  ['Scope', 'Intended use, affected users, jurisdictions, laws, and risk tolerance'],
  ['System', 'Models, data, RAG, agents, tools, MCP servers, vendors, and dependencies'],
  ['Signal', 'Quality, drift, attacks, access failures, incidents, complaints, and costs'],
  ['Structure', 'Lifecycle gates, ownership, testing, approvals, change control, and retirement'],
  ['Strategy', 'Control depth, assurance investment, adoption plan, and risk acceptance'],
  ['Compliance', 'Legal mapping, framework alignment, testing evidence, and independent assurance'],
]

const howToSchema = {
  '@context': 'https://schema.org', '@type': 'HowTo',
  name: 'Six-Phase AI Secure and Govern Implementation Roadmap',
  description: 'A practical six-phase roadmap to move from AI discovery through continuous evidence and improvement.',
  step: phases.map((ph, i) => ({
    '@type': 'HowToStep', position: i + 1, name: ph.p, text: ph.o,
  })),
}

const scenarios = [
  { t: 'Small business using an AI receptionist', icon: Building2, n: ['AI inventory', 'Basic applicable-law review', 'NIST AI RMF-inspired ownership', 'Data and access controls', 'Prompt and tool testing', 'Human escalation', 'Incident handling'], nn: 'Probably does not need ISO/IEC 42001 certification or SOC 2 solely because it uses an AI receptionist.' },
  { t: 'Internal enterprise RAG assistant', icon: Database, n: ['NIST AI RMF profile', 'AI impact assessment', 'ISO/IEC 27001-aligned security', 'Privacy controls', 'Row-level security', 'Approved RAG sources', 'Retrieval evaluation', 'Prompt-injection testing', 'Continuous access review'], nn: 'External certification may not be necessary if the application is internal.' },
  { t: 'AI SaaS provider selling to enterprise customers', icon: Webhook, n: ['Multi-jurisdiction legal analysis', 'Formal AI governance', 'NIST AI RMF alignment', 'ISO/IEC 42001 management system', 'ISO/IEC 27001 security foundation', 'SOC 2 report', 'OWASP and MITRE-based testing', 'Vendor supply-chain controls', 'Continuous customer evidence', 'Incident and model-change notices'], nn: 'No single item replaces the others.' },
  { t: 'Healthcare AI assistant', icon: HeartPulse, n: ['Healthcare and AI-law analysis', 'Formal AI impact assessment', 'Security and privacy management', 'Clinical validation', 'Licensed practitioner review', 'Patient disclosure', 'Bias and accessibility evaluation', 'Strong change management', 'Independent technical assurance', 'Detailed incident evidence'], nn: 'Assurance depth should reflect the potential clinical consequence, not merely the size of the organization.' },
]

export default function HowToSecureAndGovernAIPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <Hero subtitle="AI Security & Governance" title={<>How to Secure and Govern AI:<br /><span className="gradient-text">NIST, ISO and SOC 2</span></>} description="AI laws, NIST AI RMF, ISO/IEC 42001, SOC 2, security testing, and continuous evidence work together — not as alternatives. Learn the seven layers of AI compliance, risk management, security, and assurance." />

      <Section className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-muted-foreground mb-1">By Subodh KC · July 15, 2026 · 35 min read</p>
          <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong className="text-foreground">Last reviewed:</strong> July 15, 2026</p>
            <p><strong className="text-foreground">Scope:</strong> AI security, governance, compliance frameworks, and assurance for organizations of all sizes</p>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200"><strong>Educational notice:</strong> This article provides general information about AI governance, security, and assurance. Legal and regulatory applicability depends on the system, data, jurisdiction, industry, and intended use.</p>
          </div>
          <details className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Table of Contents</summary>
            <nav className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">{tocItems.map((i) => (<a key={i.id} href={`#${i.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{i.label}</a>))}</nav>
          </details>
        </div>
      </Section>

      {/* Synopsis */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">No single law, framework, audit, or certification proves that an AI system is secure and compliant. Organizations need a layered approach that connects legal obligations, AI governance, cybersecurity, impact assessment, technical testing, independent assurance, and continuous evidence. This article explains how NIST AI RMF, ISO/IEC 42001, SOC 2, OWASP GenAI, MITRE ATLAS, and applicable AI laws fit together — and how to build a defensible chain from requirement to evidence.</p>
            <div className="mt-4 flex flex-wrap gap-2">{['Business leaders', 'AI developers and deployers', 'Security teams', 'Compliance officers', 'Procurement teams', 'Healthcare organizations', 'AI SaaS providers', 'Small businesses using AI'].map((a) => (<span key={a} className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">{a}</span>))}</div>
          </div>
        </div>
      </Section>

      {/* Opening */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <p>A business leader asks a reasonable question:</p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">"How do we make sure our AI is secure and compliant?"</blockquote>
          <p>The tempting answer is: "Follow NIST, obtain SOC 2, and comply with applicable AI laws." That answer is directionally helpful but incomplete.</p>
          <ul className="space-y-2 ml-4">
            <li className="list-disc">A company may have a SOC 2 report and still operate a chatbot vulnerable to prompt injection.</li>
            <li className="list-disc">It may align with NIST AI RMF and still violate a healthcare disclosure requirement.</li>
            <li className="list-disc">It may receive ISO/IEC 42001 certification and still have an individual model produce inaccurate or discriminatory outcomes.</li>
            <li className="list-disc">It may pass a technical penetration test while lacking clear ownership, legal review, or incident-response procedures.</li>
          </ul>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">To secure and govern AI, identify the obligations that apply, establish accountable governance, assess the system's impact, protect its data and infrastructure, implement AI-specific controls, validate those controls, and continuously retain evidence that they still work.</blockquote>
          <p>No single badge completes that process.</p>
        </div>
      </Section>

      {/* Direct Answer */}
      <Section className="pt-4" id="direct-answer">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Direct Answer</h2>
          <ol className="space-y-3 ml-4">
            <li className="list-decimal"><strong>Identify applicable laws and contractual obligations.</strong></li>
            <li className="list-decimal"><strong>Assign ownership and establish an AI governance process.</strong></li>
            <li className="list-decimal"><strong>Assess the system's potential impact and blast radius.</strong></li>
            <li className="list-decimal"><strong>Protect the data, identities, infrastructure, and vendors around it.</strong></li>
            <li className="list-decimal"><strong>Implement controls for AI-specific risks</strong> — prompt injection, RAG poisoning, excessive agency, hallucination.</li>
            <li className="list-decimal"><strong>Test the implemented system</strong> and obtain independent assurance where justified.</li>
            <li className="list-decimal"><strong>Monitor changes, incidents, and evidence</strong> throughout the system's lifecycle.</li>
          </ol>
          <p>NIST AI RMF can help organize AI risk management. ISO/IEC 42001 can formalize an organizational AI management system. SOC 2 can provide independent assurance over relevant controls at a service organization. None of them independently proves that every AI system is legal, accurate, secure, or safe.</p>
        </div>
      </Section>

      {/* Commonly Confused */}
      <Section className="pt-8" id="commonly-confused">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why AI Security and Compliance Are Commonly Confused</h2>
          <Grid cols={2} className="gap-4">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Gavel className="h-4 w-4 text-primary" /> Law</CardTitle><CardDescription className="text-sm">Establishes legally enforceable obligations, restrictions, rights, disclosures, or penalties.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>Examples: Texas TRAIGA, EU AI Act, privacy laws, biometric laws, employment discrimination laws, healthcare regulations, consumer-protection law.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Framework</CardTitle><CardDescription className="text-sm">Provides a structure for organizing risk-management activities.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>NIST AI RMF organizes AI risk management around: Govern, Map, Measure, Manage. Voluntary and adaptable.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Standard</CardTitle><CardDescription className="text-sm">Defines requirements through a formal standards process.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>ISO/IEC 42001 specifies requirements for an AI Management System.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Certification</CardTitle><CardDescription className="text-sm">Written assurance from an independent certification body.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>ISO develops standards but does not certify. External certification bodies perform certification.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /> Attestation</CardTitle><CardDescription className="text-sm">SOC 2 is an independent CPA examination and report.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>Not an ISO certification and should not be described as one.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Microscope className="h-4 w-4 text-primary" /> Technical Validation</CardTitle><CardDescription className="text-sm">Tests whether the AI system behaves as expected and resists realistic failures.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>Prompt-injection testing, RAG-poisoning testing, access-control testing, hallucination evaluation, bias testing, agent-permission testing.</p></CardContent></Card>
          </Grid>
          <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Evidence</CardTitle><CardDescription className="text-sm">Proves that a control, test, approval, or review actually occurred.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground"><p>A policy is not the same as evidence that the policy is operating.</p></CardContent></Card>
        </div>
      </Section>

      {/* Seven Layers Overview */}
      <Section className="pt-8" id="seven-layers">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Seven Layers of AI Compliance</h2>
          <p className="text-base text-muted-foreground">The AI Secure &amp; Govern Assurance Stack organizes AI governance into seven connected layers. Each layer answers a different question.</p>
          <div className="space-y-2">{layerData.map((layer, i) => { const Icon = layer.icon; return (
            <div key={layer.n} className={`rounded-lg border p-4 ${layerColors[i]} transition-all`}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-sm font-bold text-foreground">{layer.n}</div>
                <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1"><p className="text-sm font-semibold text-foreground">{layer.name}</p><p className="text-xs text-muted-foreground">{layer.q}</p></div>
                {i < 6 && <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 flex-shrink-0" />}
              </div>
            </div>
          )})}</div>
        </div>
      </Section>

      {/* Layer 1 */}
      <Section className="pt-8" id="layer-1">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center"><Gavel className="h-5 w-5 text-blue-500" /></div><div><p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Layer 1</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Legal and Contractual Applicability</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">What laws, regulations, contractual obligations, and professional duties apply to this specific AI system?</p></div>
          <p className="text-base text-foreground/90">There is no universal state called "AI compliant." An AI system may be compliant with one law while violating another. A company may also be outside a dedicated AI law but remain subject to privacy, consumer-protection, employment, healthcare, intellectual-property, or contract requirements.</p>
          <p className="text-base text-muted-foreground">U.S. regulators have stated that existing civil-rights, consumer-protection, competition, and employment laws continue to apply when organizations use automated systems and AI. There is no general exemption because a decision was produced by software.</p>
          <div><h3 className="text-lg font-semibold mb-3">What determines applicability?</h3><ul className="space-y-1.5 text-sm text-muted-foreground ml-4">{['Where the business operates', 'Where affected users reside', 'Whether the organization develops or deploys the system', 'The data being processed', 'Whether the system affects employees, patients, consumers, or children', 'Whether it influences consequential decisions', 'Whether it uses biometric identifiers', 'Whether it takes external action', 'Whether it is part of a regulated product', 'What customer and vendor contracts require'].map((item) => (<li key={item} className="list-disc">{item}</li>))}</ul></div>
          <Card className="border-l-4 border-l-blue-500/40"><CardHeader><CardTitle className="text-base">Scenario: The same AI model, different laws</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-muted-foreground"><div><p className="font-semibold text-foreground mb-1">Local service company</p><p>An HVAC business uses an AI receptionist. Its concerns may include: consumer protection, call recording, privacy, accurate representation, emergency escalation, and Texas TRAIGA's targeted prohibitions.</p></div><div className="border-t border-border pt-3"><p className="font-semibold text-foreground mb-1">Medical practice</p><p>The same underlying model summarizes patient records and recommends diagnoses. The legal profile changes substantially: PHI, professional licensing, patient disclosure, clinical review, medical records, healthcare nondiscrimination, and medical-device regulation.</p><p className="mt-1 font-medium text-foreground">The model did not change. The use case did.</p></div></CardContent></Card>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 1</h3><div className="grid gap-2 sm:grid-cols-2">{['Applicable-law register', 'Developer-vs-deployer classification', 'Jurisdiction map', 'Required disclosures', 'Prohibited-use analysis', 'Contractual requirements', 'Records and retention obligations', 'Legal-review triggers'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">AI law tells an organization what must be achieved. It rarely provides the complete technical design for achieving it.</blockquote>
        </div>
      </Section>

      {/* Layer 2 */}
      <Section className="pt-8" id="layer-2">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-indigo-500" /></div><div><p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Layer 2</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Governance and Accountable Ownership</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">Who owns the AI system, its purpose, its risks, and its consequences?</p></div>
          <p className="text-base text-foreground/90">Technology does not govern itself. A production AI system needs identifiable accountability for business purpose, technical architecture, data quality, security, privacy, legal compliance, model performance, vendor management, operations, incident response, and residual-risk acceptance.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">NIST AI RMF</CardTitle><CardDescription className="text-sm">A flexible, voluntary framework. Its Core contains four functions:</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground space-y-3"><div><strong className="text-foreground">Govern:</strong> Policies, accountability, roles, risk tolerance.</div><div><strong className="text-foreground">Map:</strong> Context, users, data, intended purpose, impacts.</div><div><strong className="text-foreground">Measure:</strong> Performance, reliability, security, fairness, transparency.</div><div><strong className="text-foreground">Manage:</strong> Prioritize risks, implement responses, monitor residual risk.</div><p className="pt-2 border-t border-border">Not a certification scheme. A structured way to organize AI risk-management outcomes.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">ISO/IEC 42001</CardTitle><CardDescription className="text-sm">AI management-system requirements standard.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>Establishes a systematic approach to policies, objectives, responsibilities, risk treatment, monitoring, and continual improvement.</p><p>Organizations may seek certification of their defined AI management-system scope through an external certification body.</p></CardContent></Card>
          </div>
          <div><h3 className="text-lg font-semibold mb-3">NIST AI RMF versus ISO/IEC 42001</h3><div className="overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg"><thead className="bg-muted/50"><tr><th className="text-left p-3 border-b border-border font-semibold">NIST AI RMF</th><th className="text-left p-3 border-b border-border font-semibold">ISO/IEC 42001</th></tr></thead><tbody className="divide-y divide-border">{[['Voluntary risk-management framework', 'AI management-system requirements standard'],['Flexible and outcome-oriented', 'Formal management-system structure'],['No NIST AI RMF certification', 'Supports third-party certification'],['Useful for building an AI-risk program', 'Useful for formalizing repeatable governance'],['Can be applied selectively by use case', 'Usually implemented within a defined scope'],['Strong public resource and Playbook', 'Formal standard with auditable requirements']].map((row, i) => (<tr key={i}><td className="p-3 text-muted-foreground">{row[0]}</td><td className="p-3 text-muted-foreground">{row[1]}</td></tr>))}</tbody></table></div></div>
          <Card className="border-l-4 border-l-indigo-500/40"><CardHeader><CardTitle className="text-base">Do organizations need both?</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>Not always. A smaller organization may use NIST AI RMF without immediately pursuing certification. An enterprise AI provider may use NIST AI RMF to shape risk methods, ISO/IEC 42001 to formalize its management system, ISO/IEC 27001 for security, and SOC 2 for customer-facing assurance.</p></CardContent></Card>
          <div><h3 className="text-lg font-semibold mb-3">Minimum governance structure</h3><div className="overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg"><thead className="bg-muted/50"><tr><th className="text-left p-3 border-b border-border font-semibold">Role</th><th className="text-left p-3 border-b border-border font-semibold">Primary accountability</th></tr></thead><tbody className="divide-y divide-border">{[['Business owner', 'Intended outcome and business-risk acceptance'],['Product owner', 'Requirements, users, and roadmap'],['Technical owner', 'Architecture, integration, reliability, and change'],['Data owner', 'Data quality, classification, and permitted use'],['AI/model owner', 'Model selection, evaluation, and behavior'],['Security', 'Threats, access, testing, and incident response'],['Privacy/legal/compliance', 'Legal, contractual, and regulatory analysis'],['Operations', 'Monitoring, recovery, and user support']].map((row, i) => (<tr key={i}><td className="p-3 font-medium text-foreground">{row[0]}</td><td className="p-3 text-muted-foreground">{row[1]}</td></tr>))}</tbody></table></div></div>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 2</h3><div className="grid gap-2 sm:grid-cols-2">{['AI policy', 'AI system inventory', 'Defined owners', 'Risk-acceptance authority', 'Approved-use process', 'Vendor-governance process', 'Model and system change control', 'Incident ownership', 'Training requirements', 'Retirement process'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">NIST AI RMF helps organize AI risk. ISO/IEC 42001 helps turn that governance into a formal management system. Neither replaces the controls inside the application.</blockquote>
        </div>
      </Section>

      {/* Layer 3 */}
      <Section className="pt-8" id="layer-3">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-purple-500" /></div><div><p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Layer 3</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">AI Risk and Impact Assessment</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">What could this system do to people, the organization, or society if it is wrong, manipulated, misused, or unavailable?</p></div>
          <p className="text-base text-foreground/90">A general-purpose chatbot that drafts marketing copy should not receive the same assessment as an AI system influencing hiring, credit, insurance, medical treatment, or physical safety. Risk assessment determines how much control and assurance the system requires.</p>
          <div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle className="text-base">ISO/IEC 23894</CardTitle><CardDescription className="text-sm">Provides guidance for managing AI-specific risk. Guidance rather than an independently certifiable standard.</CardDescription></CardHeader></Card><Card><CardHeader><CardTitle className="text-base">ISO/IEC 42005</CardTitle><CardDescription className="text-sm">Provides guidance for AI system impact assessments — how AI systems may affect individuals, groups, and society.</CardDescription></CardHeader></Card></div>
          <div><h3 className="text-lg font-semibold mb-3">The AI Blast Radius Model</h3><p className="text-sm text-muted-foreground mb-3">Six dimensions for prioritizing systems:</p><div className="grid gap-2 sm:grid-cols-2">{[{d:'Data sensitivity',q:'What can the AI read?'},{d:'Decision consequence',q:'What decisions can it influence?'},{d:'Action authority',q:'What can it create, change, send, or delete?'},{d:'Reach',q:'How many people, records, or systems can one failure affect?'},{d:'Irreversibility',q:'How difficult is it to undo the damage?'},{d:'Detection delay',q:'How long could the failure continue unnoticed?'}].map((item) => (<div key={item.d} className="rounded-lg border border-border p-3 text-sm"><p className="font-medium text-foreground">{item.d}</p><p className="text-muted-foreground text-xs">{item.q}</p></div>))}</div><p className="mt-3 text-sm text-muted-foreground">Try the interactive <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI Blast Radius Calculator</Link> to score your system.</p></div>
          <div><h3 className="text-lg font-semibold mb-3">Example</h3><div className="overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg"><thead className="bg-muted/50"><tr><th className="text-left p-3 border-b border-border font-semibold">System</th><th className="text-left p-3 border-b border-border font-semibold">Likely blast radius</th></tr></thead><tbody className="divide-y divide-border">{[['Marketing drafting tool','Limited'],['Internal policy RAG assistant','Guarded'],['Employee-ranking system','High'],['Customer refund agent','High'],['Clinical treatment assistant','Critical']].map((row, i) => (<tr key={i}><td className="p-3 text-muted-foreground">{row[0]}</td><td className="p-3 font-medium text-foreground">{row[1]}</td></tr>))}</tbody></table></div></div>
          <Card className="border-l-4 border-l-purple-500/40"><CardHeader><CardTitle className="text-base">Why "high risk" is not only a legal classification</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>Some laws use a formal legal definition of high-risk AI. An organization should also perform its own operational risk classification even when no applicable law labels the system "high risk."</p></CardContent></Card>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 3</h3><div className="grid gap-2 sm:grid-cols-2">{['Intended-use statement', 'Foreseeable misuse scenarios', 'Affected-person analysis', 'AI Blast Radius score', 'Data and system dependencies', 'Potential harms', 'Required human oversight', 'Control requirements', 'Residual-risk decision'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">The sophistication of the model does not determine the risk. The system's access, authority, reach, and consequences do.</blockquote>
        </div>
      </Section>

      {/* Layer 4 */}
      <Section className="pt-8" id="layer-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-pink-500/30 bg-pink-500/10 flex items-center justify-center"><Shield className="h-5 w-5 text-pink-500" /></div><div><p className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Layer 4</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Cybersecurity, Privacy, and Data Controls</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">Are the data, identities, infrastructure, and operating environment around the AI properly protected?</p></div>
          <p className="text-base text-foreground/90">AI security cannot compensate for weak enterprise security. A carefully tested model connected through an administrator account to an unrestricted database remains dangerous.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">NIST CSF 2.0</CardTitle><CardDescription className="text-sm">Organizes cybersecurity outcomes: Govern, Identify, Protect, Detect, Respond, Recover.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">ISO/IEC 27001</CardTitle><CardDescription className="text-sm">Defines requirements for an Information Security Management System.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">ISO/IEC 27002</CardTitle><CardDescription className="text-sm">Implementation guidance and controls for access control, cryptography, secure operations, incident management.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">ISO/IEC 27701</CardTitle><CardDescription className="text-sm">Privacy Information Management System for controllers and processors of PII.</CardDescription></CardHeader></Card>
          </div>
          <div><h3 className="text-lg font-semibold mb-3">Security controls relevant to AI</h3><div className="grid gap-2 sm:grid-cols-2">{['Authentication','Authorization','Row-level security','Tenant isolation','Least-privileged service accounts','Encryption','Secret management','Secure development','Vulnerability management','Network restrictions','Logging','Backup and recovery','Data retention','Data deletion','Vendor access','Incident response','Business continuity'].map((item) => (<div key={item} className="rounded-lg border border-border p-2.5 text-sm text-muted-foreground flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" /> {item}</div>))}</div></div>
          <Card className="border-l-4 border-l-pink-500/40"><CardHeader><CardTitle className="text-base">Scenario: Internal RAG assistant</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>A company builds a RAG assistant that searches contracts and customer records. The model may be well configured, but exposure remains if:</p><ul className="ml-4 space-y-1">{['Every document shares one vector index without tenant filtering','The retriever uses an administrator credential','Cached results are shared across users','Deleted documents remain searchable','Logs contain complete customer contracts','Employees can upload unapproved documents'].map((item) => (<li key={item} className="list-disc">{item}</li>))}</ul><p className="pt-2 font-medium text-foreground">The security foundation must restrict which information enters the model context.</p></CardContent></Card>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">The model should not decide what the user is allowed to see. The model should receive only information the user is already authorized to access.</blockquote>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 4</h3><div className="grid gap-2 sm:grid-cols-2">{['Identity and access design','Data-classification map','RLS and tenant-isolation design','Retention schedule','Vendor-access controls','Security architecture','Incident-response plan','Privacy impact records','Recovery procedures'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <p className="text-sm text-muted-foreground">For a deep dive, see the <Link href="/secure-enterprise-rag-architecture" className="text-primary font-medium hover:underline">Secure Enterprise RAG Architecture Guide</Link>.</p>
        </div>
      </Section>

      {/* Layer 5 */}
      <Section className="pt-8" id="layer-5">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-rose-500/30 bg-rose-500/10 flex items-center justify-center"><Cpu className="h-5 w-5 text-rose-500" /></div><div><p className="text-xs font-semibold text-rose-500 uppercase tracking-wide">Layer 5</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">AI-Specific Application and Model Security</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">Is the complete AI application resistant to the failures and attacks that are specific to generative and agentic systems?</p></div>
          <p className="text-base text-foreground/90">Traditional security controls remain necessary, but they do not cover every AI-specific risk.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle className="text-base">OWASP GenAI</CardTitle><CardDescription className="text-sm">Addresses prompt injection, sensitive-information disclosure, supply-chain vulnerabilities, data and model poisoning, improper output handling, excessive agency, system-prompt leakage, vector and embedding weaknesses, misinformation, and unbounded consumption.</CardDescription></CardHeader><CardContent className="text-xs text-muted-foreground"><p>OWASP also published a Top 10 for Agentic Applications in late 2025.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">MITRE ATLAS</CardTitle><CardDescription className="text-sm">A living knowledge base of adversary tactics and techniques against AI-enabled systems. Helps with threat modeling, red teaming, and threat-informed defense.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">CSA AI Controls Matrix</CardTitle><CardDescription className="text-sm">Vendor-neutral control framework for cloud-based AI systems. v1.1 contains 247 control objectives across 18 domains with mappings to ISO/IEC 42001 and EU AI Act.</CardDescription></CardHeader></Card>
          </div>
          <div><h3 className="text-lg font-semibold mb-3">AI-specific risks to test</h3><div className="grid gap-3 sm:grid-cols-2">{[{r:'Prompt injection',q:'Can a user or external document override intended instructions?'},{r:'RAG poisoning',q:'Can false or malicious content influence retrieval?'},{r:'Excessive agency',q:'Can the AI execute more powerful actions than required?'},{r:'Cross-tenant retrieval',q:'Can one user retrieve another customer\'s information?'},{r:'Improper output handling',q:'Can AI-generated SQL, code, URLs, or HTML compromise downstream systems?'},{r:'Tool and MCP abuse',q:'Can a tool call bypass permissions or send data to an unauthorized destination?'},{r:'Hallucination',q:'Can the system produce unsupported but convincing conclusions?'},{r:'Unbounded consumption',q:'Can an agent enter a loop or create uncontrolled expense?'}].map((item) => (<div key={item.r} className="rounded-lg border border-border p-3"><p className="text-sm font-medium text-foreground">{item.r}</p><p className="text-xs text-muted-foreground mt-1">{item.q}</p></div>))}</div></div>
          <Card className="border-l-4 border-l-rose-500/40"><CardHeader><CardTitle className="text-base">Scenario: AI accounts-payable agent</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>An AI accounts-payable system can read invoices, create vendors, change banking information, approve payments, and send confirmations. A traditional cybersecurity review may confirm the API is encrypted and authenticated. An AI-specific review asks:</p><ul className="ml-4 space-y-1">{['Can a malicious invoice contain indirect instructions?','Can the model change the payment destination?','Does it use the employee\'s permissions or a broad service account?','Are new vendors independently verified?','Is approval required above a threshold?','Can one prompt create several payments?','Can the action be reversed?','Is every tool call retained?'].map((item) => (<li key={item} className="list-disc">{item}</li>))}</ul></CardContent></Card>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 5</h3><div className="grid gap-2 sm:grid-cols-2">{['AI threat model','Prompt-injection controls','RAG source-governance process','Agent action matrix','Tool allow-list','MCP server assessment','Model-security controls','Input and output validation','Cost and step limits','Human-approval requirements'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">Governance without AI-specific technical controls can produce a well-documented but insecure system.</blockquote>
          <p className="text-sm text-muted-foreground">Explore the <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">Agent Read/Write/Action Matrix</Link> and <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">Prompt Injection Scenario Library</Link>.</p>
        </div>
      </Section>

      {/* Layer 6 */}
      <Section className="pt-8" id="layer-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center"><ClipboardCheck className="h-5 w-5 text-amber-500" /></div><div><p className="text-xs font-semibold text-amber-500 uppercase tracking-wide">Layer 6</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Validation and Independent Assurance</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">Do the controls actually work, and has an appropriate independent party reviewed them?</p></div>
          <p className="text-base text-foreground/90">A control may exist in one of four states: Described, Implemented, Tested, Independently assured. These states should not be confused.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Functional validation</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['Does the workflow complete its intended task?','Are tool arguments valid?','Do approvals stop unauthorized execution?','Are errors handled?','Can failed work be recovered?','Are duplicate actions prevented?'].map((q) => (<p key={q} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {q}</p>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Model-quality validation</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['Accuracy','Groundedness','Citation correctness','Hallucination rate','Refusal behavior','Structured-output validity','Retrieval quality','Tool-selection accuracy'].map((q) => (<p key={q} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {q}</p>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Security validation</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['Direct prompt injection','Indirect prompt injection','RAG poisoning','Cross-tenant access','Service-account abuse','Tool manipulation','MCP server misuse','Improper output handling','Agent loops','Unauthorized external communication'].map((q) => (<p key={q} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {q}</p>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Impact validation</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['Bias testing','Accessibility testing','Group-level performance analysis','Human-factors testing','Safety evaluation','Clinical or professional validation','Appeal and override testing'].map((q) => (<p key={q} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {q}</p>))}</CardContent></Card>
          </div>
          <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-base">What SOC 2 does</CardTitle><CardDescription className="text-sm">SOC 2 is commonly used by service organizations whose customers need information about controls relevant to security, availability, processing integrity, confidentiality, or privacy.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground space-y-3"><div><strong className="text-foreground">SOC 2 Type I:</strong> Evaluates control design as of a specified date.</div><div><strong className="text-foreground">SOC 2 Type II:</strong> Also evaluates operating effectiveness over a defined period.</div></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-base">Does SOC 2 cover AI?</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>It can cover relevant controls around an AI service — access control, change management, availability, logging, incident response, confidentiality, privacy, vendor management. But SOC 2 does not automatically prove that an AI system is accurate, unbiased, resists prompt injection, prevents RAG poisoning, uses appropriate agent permissions, complies with every AI law, or is safe for every intended use.</p><p className="pt-2">An organization may incorporate AI-related controls into a SOC 2 engagement, but this must be deliberately scoped rather than assumed.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-base">When SOC 2 is relevant</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>SOC 2 is most useful when: the company is a service organization, enterprise customers request assurance, the system processes customer data, security questionnaires repeatedly ask for a report, or the company needs to demonstrate control operation over time.</p><p className="pt-2">A local business using an internal AI drafting assistant usually does not need SOC 2 merely because it uses AI. An AI SaaS provider selling to large enterprises may find SOC 2 commercially necessary.</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">What ISO certification does</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>Certification against ISO/IEC 42001 demonstrates an AI management system within a defined scope. ISO/IEC 27001 demonstrates an information-security management system. ISO/IEC 27701 demonstrates a privacy information management system.</p><p className="pt-2 font-medium text-foreground">Certification does not guarantee that every AI-generated answer will be correct or that every individual system is immune to attack.</p></CardContent></Card>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 6</h3><div className="grid gap-2 sm:grid-cols-2">{['Functional test evidence','Model evaluation report','AI red-team results','Impact-assessment tests','Penetration test','Independent technical assessment','SOC 2 report where appropriate','ISO certification where appropriate','Legal review','Residual-risk approval'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">A framework describes desired outcomes. Testing shows whether the implementation achieves them. Independent assurance increases confidence within a defined scope.</blockquote>
        </div>
      </Section>

      {/* Layer 7 */}
      <Section className="pt-8" id="layer-7">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center"><RefreshCw className="h-5 w-5 text-emerald-500" /></div><div><p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Layer 7</p><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Continuous Evidence, Monitoring, and Improvement</h2></div></div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-sm font-medium text-foreground">Can the organization prove that the AI remains governed after it enters production?</p></div>
          <p className="text-base text-foreground/90">AI systems can change without a traditional software release. Changes may include: new model versions, prompt revisions, updated documents, new embeddings, new data sources, new tools, new MCP servers, changed permissions, vendor subprocessors, model-provider policies, regulatory updates, user behavior, and model or data drift.</p>
          <p className="text-base text-muted-foreground">A one-time assessment is not enough for a material AI system.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">System evidence</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['System name','Purpose','Business owner','Technical owner','Model and version','Prompt version','Tools','Data sources','Vendor dependencies'].map((item) => (<p key={item} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {item}</p>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Risk evidence</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['Blast-radius classification','Impact assessment','Threat model','Applicable-law mapping','Approved limitations','Risk acceptance'].map((item) => (<p key={item} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {item}</p>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Test evidence</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['Functional tests','Model evaluations','Retrieval evaluations','Prompt-injection tests','Access tests','Bias or impact tests','Recovery tests','Retest results'].map((item) => (<p key={item} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {item}</p>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Operational evidence</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1">{['User identity','Relevant prompt or request','Retrieved records','Applied access filters','Tool calls','Approvals','Output','Resulting business actions','Errors and exceptions','Incidents and complaints'].map((item) => (<p key={item} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">•</span> {item}</p>))}</CardContent></Card>
          </div>
          <p className="text-sm text-muted-foreground">Retention should be proportionate and should comply with privacy, confidentiality, and records requirements.</p>
          <div><h3 className="text-lg font-semibold mb-3">Continuous operating cycle</h3><div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs text-muted-foreground overflow-x-auto"><p className="whitespace-pre">{`Inventory → Classify → Assess → Implement → Test → Approve → Monitor → Detect change → Reassess`}</p></div></div>
          <div><h3 className="text-lg font-semibold mb-3">Outputs from Layer 7</h3><div className="grid gap-2 sm:grid-cols-2">{['Continuous control evidence','Monitoring dashboards','Model and prompt change history','Access reviews','Incident records','Complaint records','Remediation tracking','Updated risk assessments','Vendor-change records','Retirement decisions'].map((o) => (<div key={o} className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {o}</div>))}</div></div>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">Compliance is not proven by what the organization intended to implement. It is supported by evidence of what the organization implemented, tested, monitored, and corrected.</blockquote>
          <p className="text-sm text-muted-foreground">For evidence preservation, see the <Link href="/ai-incident-evidence-checklist" className="text-primary font-medium hover:underline">AI Incident Evidence Checklist</Link>. For vendor change monitoring, see the <Link href="/ai-vendor-due-diligence-checklist" className="text-primary font-medium hover:underline">AI Vendor Due Diligence Checklist</Link>.</p>
        </div>
      </Section>

      {/* Frameworks Comparison */}
      <Section className="pt-8" id="frameworks-comparison">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How the Major Frameworks Fit Together</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg"><thead className="bg-muted/50"><tr><th className="text-left p-3 border-b border-border font-semibold">Source</th><th className="text-left p-3 border-b border-border font-semibold">Purpose</th><th className="text-left p-3 border-b border-border font-semibold">Mandatory?</th><th className="text-left p-3 border-b border-border font-semibold">Certification?</th><th className="text-left p-3 border-b border-border font-semibold">Does not prove</th></tr></thead><tbody className="divide-y divide-border">{fw.map((r) => (<tr key={r.s}><td className="p-3 font-medium text-foreground">{r.s}</td><td className="p-3 text-muted-foreground">{r.p}</td><td className="p-3 text-muted-foreground">{r.m}</td><td className="p-3 text-muted-foreground">{r.c}</td><td className="p-3 text-muted-foreground">{r.np}</td></tr>))}</tbody></table></div>
        </div>
      </Section>

      {/* Which Framework */}
      <Section className="pt-8" id="which-framework">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Which Framework Should a Business Use?</h2>
          <Grid cols={2} className="gap-4">{scenarios.map((sc) => { const SIcon = sc.icon; return (
            <Card key={sc.t}><CardHeader><CardTitle className="text-base flex items-center gap-2"><SIcon className="h-5 w-5 text-primary" /> {sc.t}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><div><p className="font-medium text-foreground mb-1">May need:</p><ul className="ml-4 space-y-0.5">{sc.n.map((n) => (<li key={n} className="list-disc">{n}</li>))}</ul></div><p className="text-xs italic">{sc.nn}</p></CardContent></Card>
          )})}</Grid>
          <p className="text-sm text-muted-foreground">The correct level of governance should be proportionate to data handled, advice provided, actions taken, customer impact, and regulatory context.</p>
          <AIFrameworkDecisionTool />
        </div>
      </Section>

      {/* Maturity Ladder */}
      <Section className="pt-8" id="maturity-ladder">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The AI Assurance Maturity Ladder</h2>
          <p className="text-base text-muted-foreground">Not every organization or AI system needs the highest assurance level.</p>
          <div className="space-y-3">{maturity.map((m, i) => (
            <div key={m.l} className={`rounded-lg border p-4 ${layerColors[Math.min(i, 6)]}`}>
              <div className="flex items-start gap-3"><div className="flex-shrink-0 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-sm font-bold text-foreground">{i + 1}</div><div className="flex-1"><h3 className="text-sm font-semibold text-foreground">{m.l}</h3><p className="text-sm text-muted-foreground mt-1">{m.d}</p><div className="mt-2 flex flex-wrap gap-1.5">{m.e.map((e) => (<span key={e} className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">{e}</span>))}</div></div></div>
            </div>
          ))}</div>
          <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-base">Important limitation</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground"><p>A Level 5 organization can still operate a poorly controlled individual AI system. Formal assurance must be connected to the correct organizational scope, the actual AI product, current controls, current vendors, and current deployment configuration.</p></CardContent></Card>
        </div>
      </Section>

      {/* Truthful Claims */}
      <Section className="pt-8" id="truthful-claims">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Claims Can a Business Truthfully Make?</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg"><thead className="bg-muted/50"><tr><th className="text-left p-3 border-b border-border font-semibold">Claim</th><th className="text-left p-3 border-b border-border font-semibold">Appropriate use</th></tr></thead><tbody className="divide-y divide-border">{claims.map((row) => (<tr key={row[0]}><td className="p-3 font-medium text-foreground whitespace-nowrap">{row[0]}</td><td className="p-3 text-muted-foreground">{row[1]}</td></tr>))}</tbody></table></div>
        </div>
      </Section>

      {/* Roadmap */}
      <Section className="pt-8" id="roadmap">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">A Practical Implementation Roadmap</h2>
          <div className="space-y-4">{phases.map((ph, i) => (
            <Card key={ph.p}><CardHeader><CardTitle className="text-base flex items-center gap-2"><span className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>{ph.p}</CardTitle><CardDescription className="text-sm">{ph.o}</CardDescription></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><div><p className="font-medium text-foreground mb-1">Tasks:</p><ul className="ml-4 space-y-0.5">{ph.t.map((task) => (<li key={task} className="list-disc">{task}</li>))}</ul></div><div><p className="font-medium text-foreground mb-1">Deliverables:</p><div className="flex flex-wrap gap-1.5">{ph.d.map((d) => (<span key={d} className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs">{d}</span>))}</div></div></CardContent></Card>
          ))}</div>
        </div>
      </Section>

      {/* CSM6 */}
      <Section className="pt-8" id="csm6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Where CSM6 Fits</h2>
          <p className="text-base text-foreground/90">CSM6 can serve as the execution bridge between the assurance stack and project delivery.</p>
          <div className="overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg"><thead className="bg-muted/50"><tr><th className="text-left p-3 border-b border-border font-semibold">CSM6 element</th><th className="text-left p-3 border-b border-border font-semibold">AI Secure &amp; Govern application</th></tr></thead><tbody className="divide-y divide-border">{csm6.map((row) => (<tr key={row[0]}><td className="p-3 font-medium text-foreground">{row[0]}</td><td className="p-3 text-muted-foreground">{row[1]}</td></tr>))}</tbody></table></div>
          <p className="text-sm text-muted-foreground">CSM6 is not another certification standard. It is the practical operating framework that helps an organization move from requirement to ownership to implementation to validation to evidence to operation.</p>
        </div>
      </Section>

      {/* HAIEC */}
      <Section className="pt-8" id="haiec">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How HAIEC Fits Into the Stack</h2>
          <p className="text-base text-foreground/90">HAIEC is positioned as an integration, assessment, and evidence layer — not as a replacement for the laws, standards, auditors, or certification bodies.</p>
          <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-base">The HAIEC AI Secure &amp; Govern Assessment can help an organization:</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground"><div className="grid gap-1 sm:grid-cols-2">{['Inventory AI systems','Calculate the AI Blast Radius','Identify relevant legal requirements','Map controls to NIST AI RMF','Assess ISO/IEC 42001 readiness','Map relevant SOC 2 control areas','Evaluate privacy and security gaps','Test prompt injection and RAG poisoning','Review agent, tool, and MCP permissions','Identify evidence gaps','Prioritize remediation','Prepare an executive assurance roadmap'].map((item) => (<p key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {item}</p>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">HAIEC does not:</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground"><ul className="ml-4 space-y-1">{['Provide legal advice','Issue ISO certification','Issue a SOC 2 report','Guarantee that an AI system is safe','Eliminate the need for independent technical testing'].map((item) => (<li key={item} className="list-disc">{item}</li>))}</ul></CardContent></Card>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">HAIEC connects legal applicability, AI governance, security controls, technical validation, and evidence into one scoped readiness program.</blockquote>
          <p className="text-sm text-muted-foreground">Or more simply: <strong className="text-foreground">Secure the system. Govern the use case. Validate the controls. Prove the evidence.</strong></p>
          <p className="text-sm text-muted-foreground">Learn more about the <Link href="/solutions/haiec" className="text-primary font-medium hover:underline">HAIEC AI Compliance &amp; Governance platform</Link> or the <Link href="/solutions/haiec/exposure-assessment" className="text-primary font-medium hover:underline">HAIEC AI Exposure Assessment</Link>.</p>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-8" id="faq">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-2">{faqs.map((item) => (
            <details key={item.q} className="rounded-lg border border-border p-3 group">
              <summary className="cursor-pointer text-sm font-medium text-foreground flex items-center justify-between">{item.q}<span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span></summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}</div>
        </div>
      </Section>

      {/* Final Perspective */}
      <Section className="pt-8" id="final-perspective">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Final Perspective</h2>
          <p>The question is not: "Should we use NIST, ISO, or SOC 2?"</p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">What kind of assurance does this AI system require, and which combination of law, governance, controls, testing, and independent evidence will provide it?</blockquote>
          <ul className="space-y-2 ml-4">
            <li className="list-disc">AI laws establish obligations.</li>
            <li className="list-disc">NIST AI RMF helps organize risk.</li>
            <li className="list-disc">ISO/IEC 42001 formalizes AI management.</li>
            <li className="list-disc">ISO/IEC 27001 and 27701 strengthen security and privacy management.</li>
            <li className="list-disc">SOC 2 can provide customer-facing assurance over defined controls.</li>
            <li className="list-disc">OWASP, MITRE ATLAS, and technical testing help expose application-level weaknesses.</li>
            <li className="list-disc">Continuous evidence shows whether the controls remain effective after the system changes.</li>
          </ul>
          <p>The result is not a single certificate. It is a defensible chain:</p>
          <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs text-muted-foreground overflow-x-auto"><p className="whitespace-pre">{`Applicable requirement → accountable owner → implemented control → test evidence → independent assurance → continuous monitoring`}</p></div>
          <p>That is how organizations move from saying their AI is secure and governed to demonstrating what they have actually done.</p>
        </div>
      </Section>

      {/* Related Resources */}
      <Section className="pt-8" id="related-resources">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related Resources</h2>
          <Grid cols={2} className="gap-4">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> AI Security Tools &amp; Calculators</CardTitle><CardDescription className="text-sm">Interactive blast radius calculator, agent read/write/action matrix, and prompt-injection scenario library.</CardDescription></CardHeader><CardContent><Link href="/ai-security-tools" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">Explore tools <ArrowRight className="h-3 w-3" /></Link></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> AI Risk Register Template</CardTitle><CardDescription className="text-sm">34 risk categories with NIST AI RMF mapping, likelihood, impact, controls, and status tracking.</CardDescription></CardHeader><CardContent><Link href="/ai-risk-register" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">View template <ArrowRight className="h-3 w-3" /></Link></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /> AI Vendor Due Diligence Checklist</CardTitle><CardDescription className="text-sm">Comprehensive vendor evaluation with industry-tiered approach and continuous monitoring.</CardDescription></CardHeader><CardContent><Link href="/ai-vendor-due-diligence-checklist" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">View checklist <ArrowRight className="h-3 w-3" /></Link></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> AI Incident Evidence Checklist</CardTitle><CardDescription className="text-sm">Evidence preservation, regulatory notification timelines, chain of custody, and post-incident report template.</CardDescription></CardHeader><CardContent><Link href="/ai-incident-evidence-checklist" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">View checklist <ArrowRight className="h-3 w-3" /></Link></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Gavel className="h-4 w-4 text-primary" /> Does the Texas AI Law Apply to My Business?</CardTitle><CardDescription className="text-sm">Plain-English TRAIGA guide with interactive applicability checker, disclosure rules, and penalties.</CardDescription></CardHeader><CardContent><Link href="/does-texas-ai-law-apply-to-my-business" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">Read guide <ArrowRight className="h-3 w-3" /></Link></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Secure Enterprise RAG Architecture</CardTitle><CardDescription className="text-sm">RAG security architecture covering RLS, tenant isolation, retrieval governance, and prompt-injection defense.</CardDescription></CardHeader><CardContent><Link href="/secure-enterprise-rag-architecture" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">Read guide <ArrowRight className="h-3 w-3" /></Link></CardContent></Card>
          </Grid>
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="AI Secure & Govern Framework Checklist"
            description="Get a practical checklist covering AI inventory, legal applicability, governance, risk assessment, AI-specific security controls, validation, and continuous evidence — aligned with NIST AI RMF, ISO/IEC 42001, SOC 2, OWASP GenAI, and MITRE ATLAS."
            resourceName="AI Secure & Govern Framework Checklist"
          />
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <CTA
            title="Ready to secure and govern your AI?"
            description="The HAIEC AI Secure & Govern Assessment connects legal applicability, AI governance, security controls, technical validation, and evidence into one scoped readiness program."
            primaryButton={{ text: 'Explore HAIEC', href: '/solutions/haiec' }}
            secondaryButton={{ text: 'AI Exposure Assessment', href: '/solutions/haiec/exposure-assessment' }}
          />
        </div>
      </Section>
    </>
  )
}
