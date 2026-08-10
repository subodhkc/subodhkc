export interface CSMComponent {
  name: string
  description: string
}

export interface CSMImplementationExample {
  name: string
  description: string
}

export interface CSMHandoff {
  from: string
  to: string
  description: string
}

export interface CSMDomain {
  id: string
  displayName: string
  shortName: string
  tagline: string
  centralQuestion: string
  problem: string
  value: string
  originalComponents: CSMComponent[]
  currentImplementationExamples: CSMImplementationExample[]
  exampleArtifacts: string[]
  typicalRoles: string[]
  handoffs: CSMHandoff[]
  failureModes: string[]
  reassessmentTriggers: string[]
  limitations: string
}

export const csmProvenance = {
  originalArticleTitle:
    'Cognitive System Management: A Framework for Enterprise AI Project Governance',
  currentFrameworkName: 'Cognitive Systems Management (CSM)',
  author: 'Subodh KC',
  publication: 'AI Governance on Medium',
  publicationDate: '2025-08-29',
  sourceUrl:
    'https://medium.com/ai-governance-playbook/cognitive-system-management-a-framework-for-enterprise-ai-project-governance-ee7fc95a07ff',
  originalAcknowledgment:
    'The original publication described CSM as an evolving framework with limited long-term validation data.',
  currentDisclaimer:
    'CSM is a practitioner-developed governance methodology. The original publication described it as an evolving framework with limited long-term validation data. It should be applied proportionately and alongside applicable organizational, technical, legal and assurance practices.',
}

export const csmFramework = {
  name: 'Cognitive Systems Management (CSM)',
  shortName: 'CSM',
  tagline:
    'Keep governance intact from enterprise intent to project decisions, technical implementation and human use.',
  description:
    'CSM is a four-domain governance methodology designed to connect organizational accountability, AI initiative execution, AI-assisted development and human interaction rather than managing those responsibilities as isolated problems.',
  directDefinition:
    'Cognitive Systems Management (CSM) is a four-domain AI governance methodology spanning Enterprise, Project, Code and UX. It is designed to connect organizational governance, initiative execution, technical development and human interaction so governance decisions remain visible across the lifecycle of an AI-enabled system.',
  problemStatement:
    'Governance can become fragmented at organizational handoffs. Policy exists but project criteria do not reflect it. Project approval exists but implementation differs from the approved assumptions. Technical controls exist but users do not understand appropriate reliance. Operational feedback never returns to policy or project decisions. CSM makes those handoffs visible.',
  valueStatement:
    'The framework\u2019s value is not simply that it has four domains. Its value is maintaining governance context across them.',
  limitationStatement:
    'CSM is a practitioner-developed governance methodology. The original publication described it as an evolving framework with limited long-term validation data. It should be applied proportionately and alongside applicable organizational, technical, legal and assurance practices.',
  whatCSMIsNot: [
    'Certification',
    'Regulation',
    'Legal advice',
    'Compliance guarantee',
    'NIST replacement',
    'ISO replacement',
    'SDLC replacement',
    'Project-management replacement',
    'Software product',
  ],
  whatCSMIs:
    'A governance methodology for connecting enterprise, project, engineering and human-interaction responsibilities around AI-enabled systems.',
}

export const csmDomains: CSMDomain[] = [
  {
    id: 'csm-enterprise',
    displayName: 'CSM-Enterprise',
    shortName: 'Enterprise',
    tagline: 'Establish the decision context before individual projects improvise it.',
    centralQuestion:
      'Who has authority, who owns the outcome and risk, and what organizational boundaries apply?',
    problem:
      'Without an organizational decision context, each AI initiative must reconstruct governance independently. Projects define their own risk tolerance, data expectations and accountability structures, leading to inconsistent oversight and fragmented policy enforcement.',
    value:
      'Provides projects and technical teams with an organizational decision context rather than requiring each initiative to reconstruct governance independently.',
    originalComponents: [
      {
        name: 'Policy Framework',
        description:
          'AI ethics standards and organizational policies that account for system behavior which may differ from conventional software.',
      },
      {
        name: 'Risk Assessment',
        description:
          'Risk evaluation that accounts for system behavior which may change over time, including model updates, provider changes, or data drift.',
      },
      {
        name: 'Data Stewardship',
        description:
          'Governance for datasets that influence ongoing AI behavior, including training data, retrieval sources and operational data.',
      },
      {
        name: 'Strategic Mandate',
        description:
          'Organizational authority and strategic alignment that defines why AI systems are being deployed and what boundaries apply.',
      },
    ],
    currentImplementationExamples: [
      { name: 'AI use policy', description: 'Document defining permitted and prohibited AI uses.' },
      { name: 'System inventory', description: 'Catalog of AI systems, owners and risk classifications.' },
      { name: 'Accountable owner assignment', description: 'Named individual responsible for each AI system\u2019s outcomes.' },
      { name: 'Risk classification', description: 'Tiered risk levels assigned based on use case and impact.' },
      { name: 'Data-owner/steward assignment', description: 'Named owners for data used in AI systems.' },
      { name: 'Prohibited-use boundaries', description: 'Explicit list of uses the organization will not pursue.' },
      { name: 'Risk-acceptance authority', description: 'Defined escalation path for accepting residual risk.' },
      { name: 'Strategic alignment record', description: 'Documentation linking AI initiatives to organizational objectives.' },
    ],
    exampleArtifacts: [
      'AI use policy',
      'AI system inventory',
      'Risk classification matrix',
      'Data stewardship assignment',
      'Prohibited-use list',
      'Risk-acceptance record',
    ],
    typicalRoles: [
      'Executive sponsor',
      'AI governance lead',
      'Risk officer',
      'Data steward',
      'Legal/privacy counsel',
      'Compliance lead',
    ],
    handoffs: [
      {
        from: 'CSM-Enterprise',
        to: 'CSM-Project',
        description: 'Policy and risk boundaries become project requirements.',
      },
    ],
    failureModes: [
      'Policy exists but is not communicated to project teams',
      'Risk classification is assigned but never revisited',
      'Data stewardship is nominal without actual enforcement',
      'Strategic mandate is implicit rather than documented',
    ],
    reassessmentTriggers: [
      'New regulatory or contractual obligations',
      'Organizational restructuring',
      'New AI use cases outside existing policy',
      'Incidents from other AI initiatives',
    ],
    limitations:
      'Enterprise governance is only effective if downstream domains actually receive and apply the decision context. Policy without communication does not create governance.',
  },
  {
    id: 'csm-project',
    displayName: 'CSM-Project',
    shortName: 'Project',
    tagline: 'Make scaling an explicit governance decision.',
    centralQuestion:
      'What evidence should justify continuing, changing, scaling or stopping an AI initiative?',
    problem:
      'AI initiatives may require learning during implementation. Performance, capability or success criteria may not be fully known at the start. Without explicit decision boundaries, experimentation continues indefinitely without governance gates.',
    value:
      'Creates an explicit decision boundary between experimentation and operational commitment.',
    originalComponents: [
      {
        name: 'Business Case Definition',
        description:
          'What problem or value is being tested. The business case defines the hypothesis an AI initiative is evaluating.',
      },
      {
        name: 'Controlled Testing',
        description:
          'What must be learned before scale. Testing designed to answer specific governance and performance questions.',
      },
      {
        name: 'Scale Decision Framework',
        description:
          'What evidence justifies broader commitment. Defined criteria for deciding whether to proceed, change or stop.',
      },
      {
        name: 'Playbook Documentation',
        description:
          'What decisions and learning need to survive beyond the pilot team. Documentation that transfers knowledge to operational owners.',
      },
    ],
    currentImplementationExamples: [
      { name: 'Use-case charter', description: 'Document defining the problem, scope and success criteria.' },
      { name: 'Success/failure criteria', description: 'Explicit thresholds for what constitutes a valid outcome.' },
      { name: 'Pilot evaluation plan', description: 'Structured approach to testing before broader deployment.' },
      { name: 'Acceptance thresholds', description: 'Defined quality, safety and performance criteria for scale.' },
      { name: 'Decision record', description: 'Documented go/no-go decision with rationale.' },
      { name: 'Scale/no-scale decision', description: 'Explicit governance gate before operational commitment.' },
      { name: 'Lessons learned', description: 'Findings from the pilot that inform future initiatives.' },
      { name: 'Deployment playbook', description: 'Operational instructions derived from pilot experience.' },
    ],
    exampleArtifacts: [
      'Use-case charter',
      'Pilot evaluation plan',
      'Acceptance criteria',
      'Scale decision record',
      'Lessons-learned document',
      'Deployment playbook',
    ],
    typicalRoles: [
      'Project sponsor',
      'Product manager',
      'Technical lead',
      'Risk assessor',
      'Business owner',
    ],
    handoffs: [
      {
        from: 'CSM-Enterprise',
        to: 'CSM-Project',
        description: 'Policy and risk boundaries become project requirements.',
      },
      {
        from: 'CSM-Project',
        to: 'CSM-Code',
        description: 'Acceptance criteria and approved assumptions become implementation constraints.',
      },
      {
        from: 'CSM-Project',
        to: 'CSM-Enterprise',
        description: 'Incidents, lessons and newly discovered risks may require policy or risk updates.',
      },
    ],
    failureModes: [
      'Pilot continues indefinitely without a scale decision',
      'Success criteria are defined after results are known',
      'Playbook is never written and knowledge leaves with the pilot team',
      'Scale decision is implicit rather than documented',
    ],
    reassessmentTriggers: [
      'Material change in system behavior or performance',
      'Change in use case or affected population',
      'New regulatory requirements',
      'Incident during pilot',
    ],
    limitations:
      'Project governance does not guarantee that operational teams will follow the playbook. Without handoff to operational owners, pilot learning may not persist.',
  },
  {
    id: 'csm-code',
    displayName: 'CSM-Code',
    shortName: 'Code',
    tagline: 'AI-generated code is still organizationally accountable code.',
    centralQuestion:
      'How should software engineering governance change when AI contributes to implementation?',
    problem:
      'AI coding tools contribute to software development. Traditional code review processes were not designed for AI-assisted code. The question is how to maintain engineering accountability when AI tools participate in implementation.',
    value:
      'Extends normal engineering accountability into AI-assisted development rather than creating an exception to normal review and security practices.',
    originalComponents: [
      {
        name: 'Development Standards',
        description:
          'Engineering standards that account for AI-assisted development, including review requirements and quality expectations.',
      },
      {
        name: 'Security Protocols',
        description:
          'Security practices that address AI-generated code, including vulnerability scanning and dependency verification.',
      },
      {
        name: 'Human Oversight',
        description:
          'Human review of AI-assisted contributions proportionate to risk and consequence.',
      },
      {
        name: 'Traceability Logging',
        description:
          'Records that provide appropriate provenance for AI-assisted changes where risk warrants it.',
      },
    ],
    currentImplementationExamples: [
      { name: 'Approved AI coding-tool policy', description: 'Document defining which AI tools are permitted for which use cases.' },
      { name: 'Code review requirements', description: 'Review standards that apply to AI-assisted contributions.' },
      { name: 'Dependency verification', description: 'Verification of dependencies introduced or suggested by AI tools.' },
      { name: 'SAST/security scanning', description: 'Static analysis security testing applied to AI-assisted code.' },
      { name: 'Secret scanning', description: 'Detection of credentials or secrets in AI-generated code.' },
      { name: 'Testing expectations', description: 'Test coverage requirements for AI-assisted changes.' },
      { name: 'AI-assisted change declarations', description: 'Disclosure of AI assistance where proportionate to risk.' },
      { name: 'Provenance/traceability', description: 'Records linking AI-assisted changes to review and approval where risk warrants.' },
    ],
    exampleArtifacts: [
      'AI coding-tool policy',
      'Code review records',
      'Security scan results',
      'Test coverage report',
      'AI-assisted change log',
      'Exception record',
    ],
    typicalRoles: [
      'Engineering lead',
      'Security engineer',
      'Code reviewer',
      'Developer',
      'DevOps engineer',
    ],
    handoffs: [
      {
        from: 'CSM-Project',
        to: 'CSM-Code',
        description: 'Acceptance criteria and approved assumptions become implementation constraints.',
      },
      {
        from: 'CSM-Code',
        to: 'CSM-UX',
        description: 'Actual system behavior and limitations shape user interaction and oversight.',
      },
    ],
    failureModes: [
      'AI-assisted code bypasses normal review',
      'Security scanning is skipped for AI-generated contributions',
      'No record of which AI tools were used',
      'Provenance tracking is required for every token, creating disproportionate overhead',
    ],
    reassessmentTriggers: [
      'New AI coding tool introduced',
      'Security incident involving AI-assisted code',
      'Change in approved tool list',
      'Change in regulatory or contractual requirements for software provenance',
    ],
    limitations:
      'CSM-Code does not require tracking every AI-generated token. Provenance and traceability should be proportionate to risk. AI-assisted code is not inherently insecure, but it should not bypass normal review and security practices.',
  },
  {
    id: 'csm-ux',
    displayName: 'CSM-UX',
    shortName: 'UX',
    tagline: 'Governance reaches the people relying on the system.',
    centralQuestion:
      'What do humans need to understand, supervise, challenge and appropriately use AI-supported outcomes?',
    problem:
      'Users interact with systems whose outputs may be probabilistic, context-sensitive or otherwise require different expectations and oversight. Without governance reaching the user interface, technical controls exist but users do not understand appropriate reliance.',
    value:
      'Connects governance to actual human behavior and creates feedback that can trigger changes elsewhere in the system.',
    originalComponents: [
      {
        name: 'Impact Analysis',
        description:
          'Assessment of how AI-supported outcomes affect individuals, groups and workflows.',
      },
      {
        name: 'Explainability Design',
        description:
          'Design choices that help users understand system behavior, limitations and appropriate reliance.',
      },
      {
        name: 'Capability Development',
        description:
          'Training and skill development that enables users to effectively supervise and interact with AI systems.',
      },
      {
        name: 'Adoption Measurement',
        description:
          'Monitoring of how AI systems are actually used, including feedback and complaints.',
      },
    ],
    currentImplementationExamples: [
      { name: 'User impact assessment', description: 'Evaluation of how outcomes affect users and affected populations.' },
      { name: 'Appropriate-use guidance', description: 'Clear guidance on what the system should and should not be used for.' },
      { name: 'Explanation/context design', description: 'Interface elements that communicate system behavior and limitations.' },
      { name: 'Confidence/uncertainty presentation', description: 'Communication of uncertainty where appropriate to the use case.' },
      { name: 'Escalation path', description: 'Defined process for users to escalate concerns or disputes.' },
      { name: 'Human review procedure', description: 'Process for human review of AI-supported outcomes where required.' },
      { name: 'Training', description: 'User training on appropriate use, limitations and oversight.' },
      { name: 'Feedback channel', description: 'Mechanism for users to report issues or provide feedback.' },
      { name: 'Adoption/usage review', description: 'Periodic review of how the system is actually being used.' },
      { name: 'Complaint/recourse process', description: 'Process for affected individuals to seek review or remedy where relevant.' },
    ],
    exampleArtifacts: [
      'User impact assessment',
      'Appropriate-use guide',
      'Interface design specification',
      'Training material',
      'Feedback log',
      'Adoption review report',
    ],
    typicalRoles: [
      'UX designer',
      'Product manager',
      'User advocate',
      'Training lead',
      'Support lead',
    ],
    handoffs: [
      {
        from: 'CSM-Code',
        to: 'CSM-UX',
        description: 'Actual system behavior and limitations shape user interaction and oversight.',
      },
      {
        from: 'CSM-UX',
        to: 'CSM-Project',
        description: 'User feedback and operational behavior trigger product/project reassessment.',
      },
    ],
    failureModes: [
      'Explainability is confused with perfect model interpretability',
      'Users are not informed of system limitations',
      'Feedback is collected but never reaches project or enterprise domains',
      'Training is one-time and not updated as the system changes',
    ],
    reassessmentTriggers: [
      'Change in system behavior or output characteristics',
      'User complaints or feedback indicating mismatched expectations',
      'Change in affected population',
      'New regulatory disclosure requirements',
    ],
    limitations:
      'Explainability design does not guarantee perfect model interpretability. The goal is appropriate user understanding, not full transparency into model internals. CSM-UX is only effective if feedback actually returns to project and enterprise domains.',
  },
]

export const csmHandoffs: CSMHandoff[] = [
  {
    from: 'CSM-Enterprise',
    to: 'CSM-Project',
    description: 'Policy and risk boundaries become project requirements.',
  },
  {
    from: 'CSM-Project',
    to: 'CSM-Code',
    description: 'Acceptance criteria and approved assumptions become implementation constraints.',
  },
  {
    from: 'CSM-Code',
    to: 'CSM-UX',
    description: 'Actual system behavior and limitations shape user interaction and oversight.',
  },
  {
    from: 'CSM-UX',
    to: 'CSM-Project',
    description: 'User feedback and operational behavior trigger product/project reassessment.',
  },
  {
    from: 'CSM-Project',
    to: 'CSM-Enterprise',
    description: 'Incidents, lessons and newly discovered risks may require policy or risk updates.',
  },
]

export const csmImplementationGuidance = {
  label: 'Adapted from the original 2025 implementation guidance.',
  phases: [
    {
      name: 'Assessment',
      activities: [
        'Inventory existing AI initiatives',
        'Review governance approaches',
        'Identify gaps',
        'Identify applicable legal/contractual requirements',
        'Assess organizational readiness',
      ],
    },
    {
      name: 'Pilot',
      activities: [
        'Choose an initiative with meaningful governance questions',
        'Apply the relevant CSM domains and components',
        'Document findings and lessons',
        'Refine the approach',
      ],
    },
    {
      name: 'Scale',
      activities: [
        'Integrate useful governance practices into existing operating processes',
        'Develop organizational capability',
        'Establish governance effectiveness measures appropriate to the organization',
      ],
    },
  ],
  note: 'This is not a mandatory waterfall. Organizations may begin with any domain where governance gaps are most consequential.',
}

export const csmProportionality = {
  title: 'Proportionality',
  statement:
    'Not every AI system requires equal CSM depth. Governance intensity should depend on factors such as intended use, consequence of failure, autonomy, reversibility, data sensitivity, affected population, scale, external exposure and regulatory or contractual obligations.',
  factors: [
    'Intended use',
    'Consequence of failure',
    'Autonomy',
    'Reversibility',
    'Data sensitivity',
    'Affected population',
    'Scale',
    'External exposure',
    'Regulatory/contractual obligations',
  ],
  note: 'A low-risk internal productivity tool does not need the same governance as consequential employment, healthcare or financial decisions.',
}

export const csmRelationshipToExecutionFramework = {
  csmRole: 'CSM answers WHERE governance responsibilities operate.',
  csmDomains: ['Enterprise', 'Project', 'Code', 'UX'],
  executionFrameworkRole:
    'The AI Governance Execution Framework answers WHAT operating functions should continuously occur across those domains.',
  executionFrameworkFunctions: [
    'Purpose, Scope & Accountability',
    'System, Data & Dependency Mapping',
    'Risk, Evaluation & Monitoring',
    'Controlled Delivery & Change',
    'Human Oversight, Feedback & Learning',
    'Compliance, Evidence & Assurance',
  ],
  relationship:
    'The AI Governance Execution Framework operationalizes and extends Cognitive Systems Management into six cross-functional governance functions.',
  label: 'Current framework architecture. This relationship was not part of the original 2025 publication.',
}

export const csmToHaiec = {
  layers: [
    {
      name: 'CSM',
      role: 'Conceptual governance domains.',
    },
    {
      name: 'AI Governance Execution Framework',
      role: 'Operational governance functions.',
    },
    {
      name: 'HAIEC',
      role: 'Technology and workflow capabilities supporting selected activities.',
    },
  ],
  note: 'HAIEC does not fully implement every CSM or Execution Framework responsibility. Some responsibilities remain with the organization.',
}

export const csmGuideVersion = {
  originalPublicationDate: 'August 29, 2025',
  currentRevisionDate: 'August 2026',
  version: '1.0',
  note: 'This guide expands the original CSM publication with current implementation examples. Material labeled as implementation guidance should not be interpreted as having appeared verbatim in the original article.',
}
