export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Subodh KC',
    alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri'],
    jobTitle: 'AI Systems Architect & AI Advisor',
    description:
      'AI Systems Architect and AI Advisor. Former Sr. Program Manager, HP Inc., founder of KestrelVoice, founder of HAIEC. Architecting, deploying, and governing production AI systems - including agentic workflows, RAG, voice AI, and compliance automation.',
    url: 'https://subodhkc.com',
    email: 'admin@subodhkc.com',
    image: 'https://subodhkc.com/portrait.jpeg',
    sameAs: [
      'https://www.wikidata.org/wiki/Q140546484',
      'https://www.linkedin.com/in/subodhkc',
      'https://twitter.com/subodhkc',
      'https://github.com/subodhkc',
      'https://medium.com/@subodhkc',
      'https://kestrelvoice.com',
      'https://frontofai.com',
    ],
    knowsAbout: [
      'AI Architecture',
      'Agentic AI Systems',
      'RAG & Enterprise Knowledge Systems',
      'MCP & API Integrations',
      'Voice AI Operations',
      'AI Governance',
      'AI Policy',
      'AI Regulatory Advisory',
      'AI Risk Assessment',
      'AI Compliance Consulting',
      'AI Audit',
      'CISO-Adjacent Security',
      'AI Security Architecture',
      'Technical Program Management',
      'Enterprise AI Strategy',
      'Cognitive Systems Management (CSM)',
      'CSM-Enterprise',
      'CSM-Project',
      'CSM-Code',
      'CSM-UX',
      'AI Governance Execution Framework',
      'AI Regulatory Compliance',
      'Compliance Architecture',
      'AI Risk Management',
      'AI Ethics',
      'AI Governance Policy',
      'Enterprise AI Implementation',
      'AI Governance Frameworks',
      'AI Vendor Risk Management',
      'AI Incident Response',
      'AI Drift Detection',
      'AI Bias Detection',
      'AI Evidence Architecture',
    ],
    hasCredential: [],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'AI Systems Architect',
      occupationLocation: {
        '@type': 'Country',
        name: 'United States',
      },
      estimatedSalary: {
        '@type': 'MonetaryAmountDistribution',
        name: 'AI Systems Architect',
        currency: 'USD',
        percentile10: '120000',
        percentile25: '150000',
        percentile50: '180000',
        percentile75: '220000',
        percentile90: '280000',
      },
      description: 'Expert in AI architecture, governance, compliance automation, and enterprise AI deployment',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Louisiana Tech University',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'HP Inc.',
    },
    founder: {
      '@type': 'Organization',
      name: 'KestrelVoice',
      description: 'AI voice operations platform',
      url: 'https://kestrelvoice.com',
    },
    award: [
      'Dean\'s Honor List',
      'President\'s Honor List',
    ],
    knowsLanguage: ['English', 'Nepali'],
    birthPlace: {
      '@type': 'Place',
      name: 'Kathmandu',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Nepal',
      },
    },
  }

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
      jobTitle: 'AI Systems Architect & AI Advisor',
      description:
        'AI Systems Architect and AI Advisor. Former Sr. Program Manager, HP Inc., founder of KestrelVoice, founder of HAIEC.',
    },
    dateCreated: '2024-01-01',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Subodh KC - AI Systems Architect & AI Advisor',
    url: 'https://subodhkc.com',
    description:
      'AI Systems Architect and AI Advisor. Production AI systems - architecture, deployment, and governance.',
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HAIEC',
    description:
      'integrated AI Ethics & Compliance - Enterprise-grade AI compliance and governance platform',
    url: 'https://subodhkc.com/solutions/haiec',
    founder: {
      '@type': 'Person',
      name: 'Subodh KC',
      description: 'Founder of HAIEC',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@subodhkc.com',
      contactType: 'Customer Service',
    },
  }

  // Publishing organization schema for SubodhKC.com (E-E-A-T: Authoritativeness + Trustworthiness)
  const publisherSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SubodhKC.com',
    description:
      'Defensive AI Architecture and Production Governance content platform by Subodh KC. Practical, authoritative content about production AI architecture, governance, and operations for technical leaders.',
    url: 'https://subodhkc.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://subodhkc.com/portrait.jpeg',
    },
    founder: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com/about',
    },
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com/about',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@subodhkc.com',
      contactType: 'Editorial',
      url: 'https://subodhkc.com/contact',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'Texas',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.linkedin.com/in/subodhkc',
      'https://github.com/subodhkc',
      'https://twitter.com/subodhkc',
      'https://medium.com/@subodhkc',
      'https://www.wikidata.org/wiki/Q140546484',
    ],
  }

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Subodh KC - AI Governance & Architecture Advisory',
    description:
      'AI governance consulting, compliance architecture, and enterprise AI strategy advisory. Specializing in EU AI Act, NIST AI RMF, ISO 42001, and NYC LL 144 compliance implementation. Former Sr. Program Manager, HP Inc. with production AI systems experience.',
    url: 'https://subodhkc.com/services',
    provider: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
      jobTitle: 'AI Systems Architect & AI Advisor',
      sameAs: [
        'https://www.linkedin.com/in/subodhkc',
        'https://www.wikidata.org/wiki/Q140546484',
      ],
    },
    serviceType: [
      'AI Governance Consulting',
      'AI Compliance Advisory',
      'AI Architecture Consulting',
      'AI Risk Assessment',
      'AI Regulatory Compliance',
      'Enterprise AI Strategy',
    ],
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'AdministrativeArea', name: 'Texas' },
      { '@type': 'City', name: 'Dallas-Fort Worth' },
    ],
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Enterprise Organizations, Series B+ Startups, Government Contractors',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      description: 'Custom pricing based on scope and engagement model. Contact for consultation.',
      availability: 'https://schema.org/InStock',
    },
    knowsAbout: [
      'EU AI Act Compliance',
      'NIST AI RMF',
      'ISO 42001',
      'NYC Local Law 144',
      'AI Governance Frameworks',
      'AI Risk Management',
      'AI Audit and Evidence Architecture',
      'Cognitive Systems Management (CSM)',
      'AI Governance Execution Framework',
      'CSM-Enterprise',
      'CSM-Project',
      'CSM-Code',
      'CSM-UX',
    ],
  }

  const serviceSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Architecture & Integration',
      name: 'AI Architecture & Integration',
      description:
        'Agentic AI systems, RAG pipelines, MCP integrations, workflow architecture, and AI pilot recovery for enterprise-scale production systems.',
      provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      url: 'https://subodhkc.com/services',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Operations & Deployment',
      name: 'AI Operations & Deployment',
      description:
        'Voice and chat agents, customer intake automation, human escalation architecture, monitoring, observability, and production hardening for AI systems.',
      provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      url: 'https://subodhkc.com/services',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Governance & Assurance',
      name: 'AI Governance & Assurance',
      description:
        'AI readiness assessments, EU AI Act / NIST AI RMF / ISO 42001 / NYC LL 144 compliance implementation, evidence architecture, drift controls, and governance operating models.',
      provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      url: 'https://subodhkc.com/services',
    },
  ]

  const softwareApplicationSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'HAIEC',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Enterprise AI governance and compliance platform for EU AI Act, NIST AI RMF, ISO 42001, and NYC LL 144.',
      url: 'https://subodhkc.com/solutions/haiec',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Enterprise pricing' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'KestrelVoice',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI voice operations platform - answers every call, books appointments, runs the front desk 24/7.',
      url: 'https://subodhkc.com/solutions/kestrelvoice',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Subscription pricing' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'llmverify',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      description: 'Open-source npm package for LLM output verification - prompt injection detection, PII redaction, hallucination risk scoring, and runtime health monitoring. 100% local processing, zero telemetry.',
      url: 'https://subodhkc.com/products/llmverify',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free and open source (MIT)' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Doc Timeline',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered document timeline extraction - converts thousands of documents into one chronological timeline.',
      url: 'https://subodhkc.com/products/doc-timeline',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Enterprise (SOC 2)' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDF Redactor',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Cross-platform',
      description: 'AI detection and permanent redaction of SSNs, cards, names, and 50+ PII types with local processing.',
      url: 'https://subodhkc.com/products/pdf-redactor',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SKC Log Analyser',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      description: 'AI pattern detection across terabytes of logs - finds anomalies in massive log datasets.',
      url: 'https://subodhkc.com/products/skc-log-analyser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Beta (Early Access)' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'CourtCase',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-assisted court evidence builder - case files, deadlines, document packets management.',
      url: 'https://subodhkc.com/products/courtcase',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Public beta' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Print Later',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows 10/11',
      description: 'Free Windows app to save web pages now and print them later. Queue pages with Ctrl+P, select exact pages, batch print. 100% local storage, no cloud, no tracking.',
      url: 'https://subodhkc.com/products/print-later',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free and open source' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'FrontOfAI Briefing',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Daily AI intelligence platform for CTOs - strategic briefings on what shipped, what shifted, what matters.',
      url: 'https://subodhkc.com/solutions/frontofai',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Subscription' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
  ]

  const reviewSchemas: Record<string, unknown>[] = []

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Production Systems by Subodh KC',
    description: 'AI platforms, tools, and open-source packages built by Subodh KC.',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'HAIEC', url: 'https://subodhkc.com/solutions/haiec' },
      { '@type': 'ListItem', position: 2, name: 'KestrelVoice', url: 'https://subodhkc.com/solutions/kestrelvoice' },
      { '@type': 'ListItem', position: 3, name: 'llmverify', url: 'https://subodhkc.com/products/llmverify' },
      { '@type': 'ListItem', position: 4, name: 'Doc Timeline', url: 'https://subodhkc.com/products/doc-timeline' },
      { '@type': 'ListItem', position: 5, name: 'PDF Redactor', url: 'https://subodhkc.com/products/pdf-redactor' },
      { '@type': 'ListItem', position: 6, name: 'SKC Log Analyser', url: 'https://subodhkc.com/products/skc-log-analyser' },
      { '@type': 'ListItem', position: 7, name: 'CourtCase', url: 'https://subodhkc.com/products/courtcase' },
      { '@type': 'ListItem', position: 8, name: 'FrontOfAI Briefing', url: 'https://subodhkc.com/solutions/frontofai' },
      { '@type': 'ListItem', position: 9, name: 'Print Later', url: 'https://subodhkc.com/products/print-later' },
    ],
  }

  const patentFrameworkSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Cognitive Systems Management (CSM)',
      description: 'A four-domain AI governance methodology spanning Enterprise, Project, Code and UX. First published August 29, 2025 in "Cognitive System Management: A Framework for Enterprise AI Project Governance" on AI Governance on Medium.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/cognitive-systems-management',
      keywords: 'AI governance, CSM, Cognitive Systems Management, CSM-Enterprise, CSM-Project, CSM-Code, CSM-UX, governance methodology',
      datePublished: '2025-08-29',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Adversarial Project Twin',
      description: 'Drift and sabotage simulation framework that proactively identifies AI system vulnerabilities before production impact.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI drift detection, adversarial testing, AI vulnerability simulation',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'AI Compliance Twin',
      description: 'Real-time regulatory enforcement engine that continuously validates AI systems against EU AI Act, GDPR, and sector-specific compliance requirements.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI compliance, regulatory enforcement, EU AI Act, GDPR compliance',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Modular Audit Engine',
      description: 'AI fairness and transparency scoring system with modular architecture for documentation suitable for audits and compliance reporting.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI audit, fairness scoring, transparency, compliance reporting',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Precision Drift Detector',
      description: 'Numerical anomaly detection system for AI model performance monitoring that identifies drift patterns before they impact business outcomes.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI drift detection, anomaly detection, model monitoring',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Compliance Fingerprint Layer',
      description: 'Tamper-evident traceability system for AI decision-making that creates immutable audit trails for regulatory compliance and forensic analysis.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI traceability, audit trail, compliance, forensic analysis',
    },
  ]

  const definedTermSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'Cognitive Systems Management (CSM)',
      description:
        'A four-domain AI governance methodology spanning Enterprise, Project, Code and UX. Designed to connect organizational governance, initiative execution, technical development and human interaction so governance decisions remain visible across the lifecycle of an AI-enabled system. First published August 29, 2025.',
      url: 'https://subodhkc.com/cognitive-systems-management',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Subodh KC AI Governance Frameworks',
        url: 'https://subodhkc.com/research',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'AI Governance Execution Framework',
      description:
        'A six-function operating model that operationalizes and extends Cognitive Systems Management (CSM). Functions: Purpose/Scope/Accountability, System/Data/Dependency Mapping, Risk/Evaluation/Monitoring, Controlled Delivery/Change, Human Oversight/Feedback/Learning, Compliance/Evidence/Assurance.',
      url: 'https://subodhkc.com/cognitive-systems-management',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Subodh KC AI Governance Frameworks',
        url: 'https://subodhkc.com/research',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'CSM-Enterprise',
      description:
        'Who has authority, who owns the outcome and risk, and what organizational boundaries apply. One of four CSM domains.',
      url: 'https://subodhkc.com/cognitive-systems-management',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Cognitive Systems Management Domains',
        url: 'https://subodhkc.com/cognitive-systems-management',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'CSM-Project',
      description:
        'What evidence should justify continuing, changing, scaling or stopping an AI initiative. One of four CSM domains.',
      url: 'https://subodhkc.com/cognitive-systems-management',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Cognitive Systems Management Domains',
        url: 'https://subodhkc.com/cognitive-systems-management',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'CSM-Code',
      description:
        'How should software engineering governance change when AI contributes to implementation. One of four CSM domains.',
      url: 'https://subodhkc.com/cognitive-systems-management',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Cognitive Systems Management Domains',
        url: 'https://subodhkc.com/cognitive-systems-management',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'CSM-UX',
      description:
        'What do humans need to understand, supervise, challenge and appropriately use AI-supported outcomes. One of four CSM domains.',
      url: 'https://subodhkc.com/cognitive-systems-management',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Cognitive Systems Management Domains',
        url: 'https://subodhkc.com/cognitive-systems-management',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'Instruction Stack Audit Framework (ISAF)',
      description:
        'A technical methodology for tracing AI accountability across nine abstraction layers. Published in Zenodo with reproducible methodology.',
      url: 'https://zenodo.org/records/18080355',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Subodh KC AI Governance Frameworks',
        url: 'https://subodhkc.com/research',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'Red Audit',
      description:
        'Adversarial testing methodology for AI systems that combines static analysis, runtime testing, and evidence generation for regulatory compliance.',
      url: 'https://subodhkc.com/research',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Subodh KC AI Governance Frameworks',
        url: 'https://subodhkc.com/research',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'Precision Drift Detector',
      description:
        'Advanced methodology for detecting subtle degradation patterns in production AI systems. Goes beyond basic statistical drift to identify concept drift and silent failures.',
      url: 'https://subodhkc.com/research',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Subodh KC AI Governance Frameworks',
        url: 'https://subodhkc.com/research',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: 'HAIEC Modular AI Governance Framework',
      description:
        'A modular framework for enterprise AI governance that separates compliance law guides, technical security tools, and authority research into independently verifiable components.',
      url: 'https://subodhkc.com/guides',
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Subodh KC AI Governance Frameworks',
        url: 'https://subodhkc.com/research',
      },
    },
  ]

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Architect, Deploy, and Govern AI Systems',
    description:
      'A three-pillar approach to building production AI systems: architecture, operations, and governance.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'AI Architecture & Integration',
        text: 'Design the AI system architecture including agentic workflows, RAG pipelines, MCP integrations, and data architecture. Define the system boundaries, data flows, and integration points.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'AI Operations & Deployment',
        text: 'Deploy the AI system to production with monitoring, observability, drift detection, and human escalation. Harden the system with load testing, failure mode analysis, and operational readiness reviews.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'AI Governance & Assurance',
        text: 'Implement governance frameworks (EU AI Act, NIST AI RMF, ISO 42001), build evidence architecture for audit readiness, and establish governance operating models with policies and committees.',
      },
    ],
    totalTime: 'P3M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '25000' },
    provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(publisherSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      {definedTermSchemas.map((schema, i) => (
        <script
          key={`definedterm-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {serviceSchemas.map((schema, i) => (
        <script
          key={`service-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {softwareApplicationSchemas.map((schema, i) => (
        <script
          key={`app-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {reviewSchemas.map((review, i) => (
        <script
          key={`review-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Review', ...review }) }}
        />
      ))}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {patentFrameworkSchemas.map((schema, i) => (
        <script
          key={`patent-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  )
}
