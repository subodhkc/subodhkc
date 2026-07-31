'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  question: string
  answer: React.ReactNode
}

const faqItems: FaqItem[] = [
  {
    question: 'Where does HAIEC fit within the existing AI governance market?',
    answer: (
      <div className="space-y-3">
        <p>
          Established AI governance companies have built strong platforms for global enterprises, Fortune 500
          organizations, financial institutions, and companies managing large portfolios of AI systems.
        </p>
        <p>HAIEC creates a complementary market position for:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Software companies</li>
          <li>SaaS providers</li>
          <li>AI startups</li>
          <li>HR technology companies</li>
          <li>Staffing and recruiting platforms</li>
          <li>Business automation companies</li>
          <li>Mid-sized organizations adopting AI</li>
          <li>Technology vendors preparing for enterprise customers</li>
        </ul>
        <p>
          These organizations increasingly need credible AI security, governance, and compliance evidence,
          while often preferring a focused engagement that produces an immediate outcome. HAIEC provides that
          entry point through productized assessments, technical findings, and evidence-backed remediation plans.
        </p>
      </div>
    ),
  },
  {
    question: 'What market opportunity does this create for Centaurus?',
    answer: (
      <div className="space-y-3">
        <p>
          Centaurus can establish a specialized AI assurance and consulting practice focused on companies that
          want a practical path into AI governance.
        </p>
        <p>The market opportunity sits between two traditional choices:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Large enterprise governance programs</li>
          <li>General consulting engagements built primarily around workshops and documentation</li>
        </ul>
        <p>The HAIEC and Centaurus model introduces a third option:</p>
        <blockquote className="border-l-2 border-slate-300 pl-4 italic text-slate-700">
          A focused technical assessment that identifies issues, produces traceable evidence, and creates a
          prioritized implementation roadmap.
        </blockquote>
        <p>
          This approach gives Centaurus a clear reason to begin a conversation with technology leaders, founders,
          engineering teams, compliance teams, and enterprise software vendors.
        </p>
      </div>
    ),
  },
  {
    question: 'How does HAIEC become the entry point for consulting revenue?',
    answer: (
      <div className="space-y-3">
        <p>HAIEC provides an objective starting point. The initial assessment identifies specific technical,
        operational, and governance improvements. Each finding can then become a clearly scoped consulting engagement.</p>
        <p className="font-semibold text-slate-900">
          Assessment - Findings - Remediation Plan - Implementation - Validation - Ongoing Governance
        </p>
        <p>Examples of follow-on consulting work include:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Securing AI and agent architectures</li>
          <li>Strengthening authentication and authorization</li>
          <li>Improving tenant isolation</li>
          <li>Hardening RAG pipelines</li>
          <li>Protecting sensitive data</li>
          <li>Implementing human oversight</li>
          <li>Adding AI inventory and approval workflows</li>
          <li>Improving logging and traceability</li>
          <li>Establishing vendor-review processes</li>
          <li>Creating policies and operating procedures</li>
          <li>Preparing regulatory documentation</li>
          <li>Supporting procurement and customer-security reviews</li>
          <li>Conducting recurring validation</li>
        </ul>
        <p>The assessment opens the relationship. Consulting and implementation create the larger revenue opportunity.</p>
      </div>
    ),
  },
  {
    question: 'What is the potential revenue ladder?',
    answer: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-slate-900 mb-1">Stage 1: Assessment</p>
          <p className="mb-2">A defined review of an AI application, repository, vendor, or regulatory requirement.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>AI Repository Assurance Review</li>
            <li>AI Vendor Trust Review</li>
            <li>Texas AI Readiness Assessment</li>
            <li>Colorado AI Readiness Assessment</li>
            <li>NYC Local Law 144 Readiness Review</li>
            <li>Procurement Evidence Package</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">Stage 2: Remediation Consulting</p>
          <p className="mb-2">Centaurus consultants help the customer resolve the issues identified during the assessment.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Security architecture improvements</li>
            <li>Governance workflow implementation</li>
            <li>Data-handling improvements</li>
            <li>RAG and agent security</li>
            <li>Model and vendor evaluation</li>
            <li>Policy and control implementation</li>
            <li>Documentation and evidence preparation</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">Stage 3: Validation</p>
          <p>HAIEC evaluates the updated system and records the evidence supporting the completed improvements.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">Stage 4: Recurring Advisory</p>
          <p className="mb-2">Customers can continue through:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Fractional AI governance services</li>
            <li>Quarterly AI reviews</li>
            <li>Continuous repository scanning</li>
            <li>Vendor monitoring</li>
            <li>Regulatory updates</li>
            <li>Evidence maintenance</li>
            <li>Executive and board reporting</li>
          </ul>
        </div>
        <p className="pt-2 border-t border-slate-200">
          This creates a blended business model combining software, projects, and recurring advisory revenue.
        </p>
      </div>
    ),
  },
  {
    question: 'What makes HAIEC technically differentiated?',
    answer: (
      <div className="space-y-3">
        <p>HAIEC connects technical analysis with governance and evidence through a unified workflow:</p>
        <p className="font-semibold text-slate-900">
          Source Code - Security Finding - Technical Rule - Regulatory Control - Remediation - Versioned Evidence
        </p>
        <p>This connection helps multiple teams work from the same record:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Engineering sees the affected code</li>
          <li>Security sees the technical weakness</li>
          <li>Compliance sees the relevant control</li>
          <li>Management sees the business exposure</li>
          <li>Consultants see the remediation opportunity</li>
          <li>Reviewers see the supporting evidence</li>
        </ul>
        <p>
          The value comes from converting technical findings into an actionable business and consulting workflow.
        </p>
      </div>
    ),
  },
  {
    question: 'What does code-to-control-to-evidence mean?',
    answer: (
      <div className="space-y-3">
        <p>A HAIEC finding can include:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>The affected source code or configuration</li>
          <li>The relevant AI security concern</li>
          <li>The technical rule that produced the finding</li>
          <li>The related framework or regulatory control</li>
          <li>Recommended remediation</li>
          <li>Assigned ownership</li>
          <li>Remediation status</li>
          <li>Supporting evidence</li>
          <li>Application version</li>
          <li>Assessment methodology version</li>
        </ul>
        <p>This creates continuity from discovery through resolution.</p>
      </div>
    ),
  },
  {
    question: 'How does HAIEC evaluate source code?',
    answer: (
      <div className="space-y-3">
        <p>
          HAIEC uses defined AI-specific static-analysis rules to review source code and configuration.
          The analysis can identify patterns associated with areas such as:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Prompt injection exposure</li>
          <li>Sensitive-data handling</li>
          <li>Tool and agent permissions</li>
          <li>Authentication</li>
          <li>Authorization</li>
          <li>Tenant isolation</li>
          <li>RAG security</li>
          <li>Logging</li>
          <li>Human oversight</li>
          <li>Model and API usage</li>
          <li>Third-party dependencies</li>
        </ul>
        <p>
          Because the static rules are defined and versioned, the same application version and assessment version
          can be evaluated consistently. Runtime behavioral testing is maintained as a complementary evidence layer
          for evaluating how an active AI system responds under selected test conditions.
        </p>
      </div>
    ),
  },
  {
    question: 'How does HAIEC make results easier to trust?',
    answer: (
      <div className="space-y-3">
        <p>HAIEC is designed to support trust through traceability. Rather than presenting only a score or summary,
        the platform can connect a conclusion to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>The technical source</li>
          <li>The assessment rule</li>
          <li>The regulatory mapping</li>
          <li>The remediation</li>
          <li>The supporting artifact</li>
          <li>The assessed system version</li>
          <li>The assessment version</li>
        </ul>
        <p>
          HAIEC also supports integrity checks, versioned evidence, and preservation of earlier evidence when an
          artifact is superseded. This creates a stronger review process for customers, consultants, auditors,
          and procurement teams.
        </p>
      </div>
    ),
  },
  {
    question: 'What is tamper-evident evidence?',
    answer: (
      <div className="space-y-3">
        <p>
          HAIEC uses cryptographic integrity checks to help identify whether an evidence artifact changes after
          it is generated. The platform can also preserve historical evidence and create a new version when an
          artifact is replaced or updated.
        </p>
        <p>This supports:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Evidence integrity</li>
          <li>Historical traceability</li>
          <li>Change verification</li>
          <li>Remediation validation</li>
          <li>Procurement reviews</li>
          <li>Compliance readiness</li>
          <li>Independent review</li>
        </ul>
        <p>
          The result is a more transparent evidence record than a standalone report containing only conclusions.
        </p>
      </div>
    ),
  },
  {
    question: 'How is HAIEC different from a traditional consulting assessment?',
    answer: (
      <div className="space-y-3">
        <p>
          A traditional assessment may depend heavily on interviews, questionnaires, spreadsheets, and manually
          prepared reports. HAIEC adds a technical and repeatable foundation through:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Repository analysis</li>
          <li>AI-specific technical rules</li>
          <li>Runtime testing</li>
          <li>Control mapping</li>
          <li>Structured findings</li>
          <li>Evidence integrity</li>
          <li>Remediation tracking</li>
          <li>Versioned reporting</li>
        </ul>
        <p>
          Centaurus consultants can then apply experience, architecture knowledge, and implementation expertise
          to the findings. The platform strengthens consulting rather than replacing it.
        </p>
      </div>
    ),
  },
  {
    question: 'How is this different from a large enterprise governance platform?',
    answer: (
      <div className="space-y-3">
        <p>
          Large platforms serve organizations managing broad AI portfolios across departments, business units,
          and jurisdictions. HAIEC and Centaurus can lead with a focused business outcome:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-3 font-semibold text-slate-900">Enterprise platform model</th>
                <th className="text-left p-3 font-semibold text-slate-900">HAIEC and Centaurus model</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-600">Enterprise-wide AI portfolio</td>
                <td className="p-3 text-slate-600">Selected application, vendor, or requirement</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-600">Central governance transformation</td>
                <td className="p-3 text-slate-600">Focused assessment and remediation</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-600">Internal governance organization</td>
                <td className="p-3 text-slate-600">Service-supported delivery</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-600">Broad platform implementation</td>
                <td className="p-3 text-slate-600">Productized starting engagement</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-600">Portfolio-level workflows</td>
                <td className="p-3 text-slate-600">Code, application, and evidence-level findings</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-600">Enterprise-scale operating model</td>
                <td className="p-3 text-slate-600">Software-company and mid-market operating model</td>
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Platform subscription first</td>
                <td className="p-3 text-slate-600">Assessment and consulting relationship first</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          This positioning allows Centaurus to enter through a defined need and expand through measurable
          customer value.
        </p>
      </div>
    ),
  },
  {
    question: 'Why are software companies and AI startups attractive customers?',
    answer: (
      <div className="space-y-3">
        <p>Software companies increasingly sell into customers that request information about:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>AI security</li>
          <li>Data usage</li>
          <li>Model training</li>
          <li>Human oversight</li>
          <li>Bias testing</li>
          <li>Access controls</li>
          <li>Vendor dependencies</li>
          <li>AI governance</li>
          <li>Regulatory readiness</li>
          <li>Incident management</li>
        </ul>
        <p>
          A company may have a strong product while still needing help translating its technical controls into
          evidence that customers, investors, and procurement teams can review. HAIEC can help create that
          evidence while Centaurus helps resolve the underlying technical and operational findings.
        </p>
      </div>
    ),
  },
  {
    question: 'Which regulatory services create immediate opportunities?',
    answer: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-slate-900 mb-1">Texas AI Readiness</p>
          <p className="mb-2">
            The Texas Responsible Artificial Intelligence Governance Act became effective January 1, 2026.
            A Texas readiness engagement can support:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Applicability review</li>
            <li>AI-system inventory</li>
            <li>Prohibited-use review</li>
            <li>Disclosure readiness</li>
            <li>Governance controls</li>
            <li>Supporting evidence</li>
            <li>Remediation planning</li>
            <li>Executive reporting</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">Colorado AI Readiness</p>
          <p className="mb-2">
            Colorado&apos;s revised Automated Decision-Making Technology Act takes effect January 1, 2027.
            The preparation period creates an opportunity to help developers and deployers establish:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>AI inventories</li>
            <li>Impact documentation</li>
            <li>Consumer processes</li>
            <li>Governance responsibilities</li>
            <li>Technical evidence</li>
            <li>Risk-management workflows</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">NYC Local Law 144 Readiness</p>
          <p className="mb-2">
            NYC Local Law 144 applies to qualifying automated employment decision tools used in hiring or
            promotion. Covered employers and employment agencies must support a bias audit, publish specified
            information, and provide required notices. HAIEC and Centaurus can support:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Applicability review</li>
            <li>Data preparation</li>
            <li>Testing workflows</li>
            <li>Evidence organization</li>
            <li>Documentation</li>
            <li>Public-summary preparation</li>
            <li>Notice-process readiness</li>
            <li>Remediation</li>
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            Formal independent audit work can be delivered with a qualified independent audit partner.
          </p>
        </div>
      </div>
    ),
  },
  {
    question: 'Why is NYC Local Law 144 especially relevant to Centaurus?',
    answer: (
      <div className="space-y-3">
        <p>
          Centaurus already operates within staffing, recruiting, workforce development, and technology placement.
          This creates a natural connection to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Staffing companies</li>
          <li>Recruiting platforms</li>
          <li>HR technology providers</li>
          <li>Employers using automated candidate screening</li>
          <li>AI vendors supporting employment decisions</li>
        </ul>
        <p>
          The readiness assessment can open conversations with both existing relationships and new customers
          operating within the employment-technology ecosystem.
        </p>
      </div>
    ),
  },
  {
    question: 'What are the strongest initial commercial offers?',
    answer: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-slate-900 mb-1">AI Repository Assurance Review</p>
          <p>
            Designed for software companies and AI startups that want a technical review of their AI application.
            The review creates opportunities for secure architecture, code remediation, governance implementation,
            and continuing validation.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">AI Vendor Trust Review</p>
          <p>
            Designed for companies evaluating third-party AI products. The review can lead to vendor remediation,
            procurement support, implementation consulting, and ongoing vendor monitoring.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">Regulatory Readiness Package</p>
          <p>
            Designed for organizations preparing for Texas, Colorado, or New York City AI requirements. The
            package can lead to documentation, governance, testing, process design, and recurring advisory work.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-1">Procurement Evidence Package</p>
          <p>
            Designed for software vendors responding to enterprise customer reviews. The package can lead to
            security improvements, compliance mapping, evidence preparation, and customer-assurance support.
          </p>
        </div>
      </div>
    ),
  },
  {
    question: 'Can other companies build similar capabilities?',
    answer: (
      <div className="space-y-3">
        <p>AI governance is an active and growing technology category. HAIEC&apos;s commercial strength comes
        from the combined system:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>AI-specific technical rules</li>
          <li>Code-to-control mappings</li>
          <li>Regulatory implementation logic</li>
          <li>Versioned evidence</li>
          <li>Remediation history</li>
          <li>Customer implementation knowledge</li>
          <li>Productized service packages</li>
          <li>Centaurus consulting capacity</li>
          <li>Centaurus customer relationships</li>
          <li>Advisory and audit partnerships</li>
        </ul>
        <p>
          Each engagement strengthens the platform, delivery methodology, and customer evidence base. The
          combination becomes increasingly valuable as customer results, regulatory content, and implementation
          experience accumulate.
        </p>
      </div>
    ),
  },
  {
    question: 'What role does consulting play in the overall business model?',
    answer: (
      <div className="space-y-3">
        <p>Consulting is the primary expansion engine. HAIEC identifies and organizes the work. Centaurus
        delivers the transformation.</p>
        <p>The combined model creates several revenue streams:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Fixed-fee assessments</li>
          <li>Technical remediation projects</li>
          <li>Governance implementation</li>
          <li>Regulatory preparation</li>
          <li>Fractional AI advisory retainers</li>
          <li>Recurring platform subscriptions</li>
          <li>Continuous monitoring</li>
          <li>Workforce training</li>
          <li>Independent review coordination</li>
          <li>Customer procurement support</li>
        </ul>
        <p>
          This allows Centaurus to build a higher-value consulting practice around an owned and repeatable
          technical methodology.
        </p>
      </div>
    ),
  },
  {
    question: 'What does the customer ultimately receive?',
    answer: (
      <div className="space-y-3">
        <p>The customer receives more than an assessment score. The complete engagement can produce:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>A prioritized technical findings report</li>
          <li>Regulatory and framework mappings</li>
          <li>A remediation roadmap</li>
          <li>Assigned implementation actions</li>
          <li>Consulting support</li>
          <li>Updated validation results</li>
          <li>Versioned evidence</li>
          <li>Executive-level reporting</li>
          <li>Ongoing governance support</li>
        </ul>
        <p>The outcome is a clearer path from AI adoption to trusted and well-governed implementation.</p>
      </div>
    ),
  },
  {
    question: 'What is the strategic opportunity?',
    answer: (
      <div className="space-y-3">
        <p>
          Centaurus can use HAIEC to create a differentiated AI consulting entry point while building longer-term
          customer relationships through implementation and advisory services.
        </p>
        <p>The opportunity combines:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>A growing regulatory and customer-assurance need</li>
          <li>A software and mid-market focus</li>
          <li>Productized initial engagements</li>
          <li>Technical remediation revenue</li>
          <li>Recurring advisory services</li>
          <li>Centaurus&apos; staffing and consulting network</li>
          <li>HAIEC&apos;s technical and evidence platform</li>
        </ul>
        <p className="font-semibold text-slate-900 pt-2 border-t border-slate-200">
          The assessment begins the relationship. The consulting practice captures the broader value.
        </p>
      </div>
    ),
  },
]

function FaqAccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
      >
        <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
          {item.question}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-5 text-sm text-slate-600 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mt-10">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        FAQ
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Frequently Asked Questions
      </h2>
      <div className="h-px bg-slate-200 mb-6" />

      <div className="border-t border-slate-200">
        {faqItems.map((item, index) => (
          <FaqAccordionItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  )
}
