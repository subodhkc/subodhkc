export const faqs = [
  { q: 'Is Kestrel Voice an AI receptionist?', a: 'Yes. Kestrel can answer business calls, respond to approved questions, capture caller information, support appointments, transfer calls, use business knowledge through RAG, and retain operational call records including transcripts, recordings, summaries, and outcomes.' },
  { q: 'Can Kestrel answer calls after hours?', a: 'Yes. Businesses can configure business hours, after-hours responses, callback behavior, voicemail, transfer paths, and other fallback options. After-hours handling is part of the standard configuration — no code required.' },
  { q: 'Can Kestrel book appointments?', a: 'Kestrel supports appointment workflows and calendar-related configuration. A properly configured workflow checks availability, confirms caller details, executes the booking action, and reports success only after the authoritative system confirms the result — not when the AI attempts the booking.' },
  { q: 'Can Kestrel use information from my website?', a: 'Kestrel supports business descriptions, FAQs, website sources, and RAG-based retrieval with tenant-scoped storage, content hashing, and refresh tracking. Website information should still be reviewed and refreshed because retrieval does not guarantee that the underlying content is current.' },
  { q: 'Can Kestrel transfer calls to a person?', a: 'Yes. Transfer destinations and transfer triggers can be configured through the dashboard. A custom deployment can also define what happens when the destination does not answer — including voicemail, callback, or a secondary contact.' },
  { q: 'Can I use my existing business number?', a: 'Depending on the phone arrangement, the business may use forwarding, conditional forwarding, a new Kestrel number, or a supported porting process. The setup wizard guides you through the appropriate option for your situation.' },
  { q: 'How is Kestrel different from a fixed AI answering service?', a: 'A fixed answering service may be faster to configure but offers limited control. Kestrel is designed to support deeper business instructions, RAG with refresh tracking, verified tool execution, operational evidence, customized routing, emergency rules, and a supported path to custom integrations — without requiring the business to start as a development project.' },
  { q: 'How long does it take to set up a basic AI receptionist?', a: 'A basic answering, lead-capture, or FAQ agent can be configured within minutes when phone provisioning and account setup complete normally. The onboarding wizard covers business information, industry templates, voice and greeting, business hours, forwarding, services, FAQs, phone setup, and test calling.' },
  { q: 'Can Kestrel handle multiple locations?', a: 'Yes. Multi-location routing is available through supported customization. Each location can have its own configuration, services, hours, and transfer destinations, with routing rules that direct callers to the correct location.' },
  { q: 'What happens if the AI cannot answer a question?', a: 'If the AI cannot answer from its configured knowledge, it can take a message, offer a callback, transfer to a human, or provide a deterministic fallback response — depending on the tenant configuration. The call review workflow also allows the business to identify gaps and add missing FAQs or knowledge sources afterward.' },
  { q: 'Does Kestrel work with my existing phone system?', a: 'Kestrel can work alongside an existing phone system through forwarding, conditional forwarding, or a dedicated Kestrel number. The platform also supports sequential ring — ringing the business phone first and falling back to AI only if no one answers within a configured timeout.' },
  { q: 'Is Kestrel fully production-ready for every business?', a: 'Readiness depends on the configured workflow. A basic FAQ agent is materially different from an agent handling healthcare information, outbound marketing, payments, or account changes. Each deployment should be tested according to its actual risk. HAIEC can support a structured assessment for compliance-sensitive use cases.' },
]

export const tocItems = [
  { id: 'direct-answer', label: 'The Direct Answer' },
  { id: 'what-is-kestrel', label: 'What Is Kestrel Voice?' },
  { id: 'market-position', label: 'Where Kestrel Fits in the Market' },
  { id: 'core-position', label: "Kestrel's Core Position" },
  { id: 'business-setup', label: 'Business Setup Without Voice Engineering' },
  { id: 'orchestration', label: 'Custom Python Orchestration' },
  { id: 'deterministic-controls', label: 'Deterministic Controls' },
  { id: 'knowledge', label: 'Business Knowledge Stack' },
  { id: 'verified-actions', label: 'Verified Business Actions' },
  { id: 'operations-dashboard', label: 'Operations Dashboard' },
  { id: 'degradation', label: 'Failure and Degraded Modes' },
  { id: 'learning-pipeline', label: 'Learning From Calls' },
  { id: 'multi-channel', label: 'Beyond Voice: SMS, Video, WebRTC' },
  { id: 'security', label: 'Security Architecture' },
  { id: 'cost-visibility', label: 'Cost Visibility and Guardrails' },
  { id: 'tenant-config', label: 'Tenant-Specific Configuration' },
  { id: 'comparison-table', label: 'Kestrel Compared' },
  { id: 'call-scenario', label: 'A Practical Call Scenario' },
  { id: 'three-ways', label: 'Three Ways to Use Kestrel' },
  { id: 'kestrel-haiec', label: 'Kestrel and HAIEC' },
  { id: 'who-for', label: 'Who Is Kestrel Best For?' },
  { id: 'faq', label: 'Frequently Asked Questions' },
]

export const marketApproaches = [
  { title: 'Developer Voice API', strength: 'Maximum technical flexibility', buyerResponsibility: 'Architecture, workflow, UI, operations and support', examples: 'Vapi, Retell SDK' },
  { title: 'Visual No-Code Builder', strength: 'Fast workflow creation', buyerResponsibility: 'Designing and maintaining flows', examples: 'Synthflow' },
  { title: 'Fixed AI Receptionist', strength: 'Simple, packaged experience', buyerResponsibility: 'Limited configuration', examples: 'Answering services' },
  { title: 'Contact-Center Voice Platform', strength: 'Scale, QA and enterprise integrations', buyerResponsibility: 'Larger implementation and operating program', examples: 'Retell, others' },
  { title: 'Managed Enterprise Service', strength: 'End-to-end delivery', buyerResponsibility: 'Larger budget and deployment cycle', examples: 'Bland, FDEs' },
]

export const sixStrengths = [
  { title: 'Business Setup Without Voice Engineering', desc: 'Configure through dashboard questions a business owner already understands — no speech providers, streaming audio, or telephony webhooks to manage.' },
  { title: 'Custom Python Orchestration Beneath the No-Code Layer', desc: 'A custom runtime coordinates telephony, tenant config, conversation state, AI modes, deterministic rules, tools, transfers, recording, fallbacks, and post-call processing.' },
  { title: 'Deterministic Controls Around Generative AI', desc: 'Three-layer adaptive architecture: hard interrupts, controlled fast paths, and AI reasoning — so AI is used where it adds value, not asked to improvise every business decision.' },
  { title: 'Business Knowledge With More Than a Single Prompt', desc: 'Four knowledge layers: direct configuration, approved FAQs, RAG with refresh tracking, and live business tools — with a managed knowledge lifecycle.' },
  { title: 'Verified Business Actions', desc: 'The AI reports success only after the business system confirms the result — not when it tries. Applies to bookings, transfers, CRM updates, and all consequential actions.' },
  { title: 'An Operations Dashboard, Not Merely a Call Counter', desc: 'Call-level data including transcripts, recordings, outcomes, tool results, fallback status, cost, and a review workflow that turns real calls into corrections.' },
]

export const setupQuestions = [
  'What is the business called?',
  'What services does it provide?',
  'When is it open?',
  'Which areas does it serve?',
  'What should the agent say when answering?',
  'Which questions should it answer?',
  'Where should calls be transferred?',
  'Should it book appointments or take a message?',
  'What happens after hours?',
  'Which phone number should customers call?',
]

export const orchestrationPaths = [
  'Telephony events',
  'Tenant configuration',
  'Conversation state',
  'AI modes (Gather, Realtime, Adaptive, IVR)',
  'Deterministic rules',
  'Business tools',
  'Transfers',
  'Recording and transcript events',
  'Fallback behavior',
  'Post-call processing',
]

export const orchestrationExamples = [
  'Never confirm an appointment until the calendar succeeds',
  'Stop the normal workflow when an urgent condition is detected',
  'Change to a less expensive call mode after a usage limit is reached',
  'Use a deterministic answer for business hours',
  'Fall back when a realtime connection fails',
  "Prevent one tenant's configuration from being used for another business",
]

export const adaptiveLayers = [
  { title: 'Layer 1: Hard Interrupts', desc: 'Emergency language, human-transfer requests, stop or opt-out requests, compliance phrases, critical account or security issues. Zero-latency, regex-based. The model is cancelled and a pre-written response is injected.', color: 'text-red-600', bg: 'bg-red-500/10' },
  { title: 'Layer 2: Controlled Fast Paths', desc: 'Business hours, service area, common FAQs, basic routing, known business information. Keyword and lookup-based. The model is cancelled and a deterministic response is generated from tenant configuration.', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { title: 'Layer 3: AI Reasoning', desc: 'Ambiguous caller language, multi-part questions, clarification, contextual follow-up, natural conversational responses. The model handles what benefits from interpretation.', color: 'text-blue-600', bg: 'bg-blue-500/10' },
]

export const knowledgeLayers = [
  { title: 'Direct Configuration', desc: 'Hours, service areas, transfer numbers, business identity, appointment settings. Best for stable facts the business owner already knows.' },
  { title: 'Approved FAQs', desc: 'Common questions with stable, pre-written answers. Best for predictable Q&A the business has already answered many times.' },
  { title: 'RAG & Website Knowledge', desc: 'Tenant-scoped sources, chunks, vector retrieval, refresh tracking, content hashes. Best for broader information from websites and documents — must be managed, not uploaded once.' },
  { title: 'Live Business Tools', desc: 'Appointment availability, customer status, booking results, current business records. Best for changing information that must be checked at call time.' },
]

export const knowledgeLifecycle = [
  'Approved Source',
  'Ingestion',
  'Retrieval',
  'Review',
  'Refresh',
  'Replace / Delete',
]

export const weakBookingSteps = [
  'Hear "Tuesday afternoon"',
  'Assume 2:00 p.m.',
  'Attempt calendar call',
  'Say "confirmed" — even if tool fails',
]

export const controlledBookingSteps = [
  "Capture the caller's name",
  'Confirm the phone number',
  'Identify the service and location',
  'Check actual availability',
  'Offer valid options',
  'Repeat the selected date and time',
  'Obtain confirmation',
  'Execute the booking',
  'Inspect the authoritative result',
  'Report success only when the booking system confirms it',
]

export const verifiedActionPrinciple = 'The AI should not claim that an action succeeded because it tried. It should claim success only after the business system confirms the result.'

export const verifiedActionAppliesTo = [
  'Transfers',
  'Messages',
  'CRM updates',
  'Appointment changes',
  'Refunds',
  'Payments',
  'Account modifications',
]

export const dashboardDataModel = [
  'Calls and call status',
  'Transcripts',
  'Recordings',
  'Outcomes',
  'Interaction mode',
  'Appointment results',
  'Summaries',
  'Tags',
  'Fallback status',
  'Model metadata',
  'Latency information',
  'Lead scoring',
]

export const improvementLoop = [
  'Call',
  'Review',
  'Identify failure',
  'Correct knowledge or rule',
  'Retest',
  'Improve',
]

export const degradationLevels = [
  { level: 'Level 0: Full AI', color: 'bg-green-500/80', desc: 'Frontier model with realtime voice synthesis. Full conversation quality. The default mode when all services are healthy.' },
  { level: 'Level 1: Fast AI', color: 'bg-amber-500/80', desc: 'Cost-efficient model with standard voice synthesis. Reduced latency and cost. Used when the frontier model API is degraded or rate-limited.' },
  { level: 'Level 2: Rule-Based', color: 'bg-orange-500/80', desc: 'State machine only. No language model. Handles greetings, basic intent routing, and voicemail capture. Used when AI APIs are unavailable.' },
  { level: 'Level 3: Human Transfer', color: 'bg-red-500/80', desc: 'Transfer to a human or voicemail. Last resort. Used when all automated modes have failed.' },
]

export const fallbackTable: [string, string][] = [
  ['Realtime WebSocket fails', 'Fall back to Gather (turn-based)'],
  ['3 WebSocket failures in 5 min', 'Circuit breaker trips → Gather mode'],
  ['AI API degraded', 'Degrade to Fast AI or Rule-Based'],
  ['All AI unavailable', 'Human transfer or voicemail'],
  ['Tool fails', 'AI reports failure, offers alternative'],
  ['Emergency detected', 'Immediate transfer, no AI deliberation'],
]

export const learningSteps = [
  { step: 1, title: 'Record', desc: 'Every fast-path match is recorded with tenant ID, intent, user input, and timestamp. This is the raw signal for pattern detection.' },
  { step: 2, title: 'Promote', desc: 'Patterns that appear above a minimum occurrence threshold are promoted to active fast actions. Guardrails filter the promotion: only whitelisted intents, blocked phrases excluded, length limits enforced.' },
  { step: 3, title: 'Review Window', desc: 'Promoted patterns enter a time-delayed review window. Email reminders are sent to the tenant before auto-approval, giving them an opportunity to reject. This is a notification window with opt-out.' },
  { step: 4, title: 'Activate', desc: 'After the review window passes, patterns become active in future calls. The tenant can deactivate any pattern from the dashboard at any time.' },
]

export const learningGuardrails = [
  'Intent whitelist — Only approved intent types can be promoted',
  'Blocked phrases — Patterns containing blocked phrases are excluded',
  'Length limits — Pattern text must be within configured bounds',
  'Minimum occurrences — Patterns must appear multiple times before promotion',
  'Tenant-scoped — Patterns are never shared across tenants',
]

export const multiChannelFeatures = [
  { title: 'SMS', desc: 'Outbound SMS via Twilio with internal (system notifications) and user (business messaging) modes. Inbound SMS handles TCPA-required STOP, HELP, and START keywords through a dedicated webhook.' },
  { title: 'Video Sessions', desc: 'Video consultation sessions via Daily.co API. Session management includes creation, participant tracking, recording, and status lifecycle. Tenants can create video sessions for remote consultations.' },
  { title: 'WebRTC', desc: 'Browser-based calling via Twilio Client. A prebind session binds the tenant ID before the device connects, ensuring deterministic tenant resolution for browser-initiated calls. Enables click-to-call from the dashboard.' },
]

export const securityDomains = [
  { title: 'Telephony Authentication', desc: 'All Twilio webhook endpoints validate request signatures. Fail-secure in production — validation bypass is blocked outside development environments.' },
  { title: 'API Key Management', desc: 'Three-tier system: admin keys (constant-time comparison), developer keys (SHA-256 hashed, tenant-scoped), and internal service keys for platform-internal communication.' },
  { title: 'Spam and Fraud Protection', desc: 'Score-based spam enforcement with reputation memory. Tenant-configurable sensitivity levels. Four whitelist types for false-positive protection.' },
  { title: 'Toll Fraud Prevention', desc: 'Country-specific call rate limiting with daily, hourly, and maximum duration limits. High-risk country detection for IRSF prevention.' },
  { title: 'Recording Consent', desc: 'TCPA-compliant call recording consent. Area code to state mapping detects two-party consent states. Consent prompts generated as TwiML before recording begins.' },
  { title: 'Tenant Isolation', desc: 'Five concentric layers: ASGI middleware, parameter-scoped queries, Postgres row-level security, server-side auth extraction, and internal API authentication.' },
]

export const tenantConfigItems = [
  'Identity',
  'Prompt',
  'Greeting',
  'Voice',
  'Services',
  'Hours',
  'Knowledge',
  'Transfer destination',
  'Emergency behavior',
  'Appointment configuration',
]

export const promptHierarchy = [
  'Tenant-specific override',
  'Industry template default',
  'Safe fallback',
]

export const callScenarioSteps = [
  { step: 1, title: 'Resolve the correct business', desc: 'The called number is associated with the correct tenant and its name, greeting, instructions, emergency contacts, services, and business hours.' },
  { step: 2, title: 'Evaluate priority conditions', desc: 'The phrase involving a burning smell triggers a configured urgent scenario before normal appointment reasoning continues.' },
  { step: 3, title: 'Deliver the approved response', desc: 'The agent provides the business-approved safety wording rather than inventing technical advice.' },
  { step: 4, title: 'Transfer or alert', desc: 'The call moves toward the configured emergency contact or human fallback.' },
  { step: 5, title: 'Preserve evidence', desc: 'The business can later review the recording, transcript, trigger, transfer result, call outcome, and any follow-up action.' },
]

export const comparisonTable: [string, string, string, string][] = [
  ['Approach', 'Main Strength', 'Buyer Responsibility', "Kestrel's Position"],
  ['Developer voice API', 'Maximum technical flexibility', 'Architecture, workflow, UI, operations and support', 'Business product first, with customization underneath'],
  ['Visual no-code builder', 'Fast workflow creation', 'Designing and maintaining flows', 'Adds owned Python orchestration and supported deployment'],
  ['Fixed AI receptionist', 'Simple, packaged experience', 'Limited configuration', 'Deeper business configuration and integration paths'],
  ['Contact-center platform', 'Scale, QA and enterprise integrations', 'Larger implementation and operating program', 'More accessible starting point'],
  ['Managed enterprise service', 'End-to-end delivery', 'Larger budget and deployment cycle', 'Supports both self-service entry and managed customization'],
  ['Kestrel Voice', 'No-code launch plus controlled expansion', 'Business configuration and ongoing review', 'Hosted runtime, custom orchestration, RAG, guardrails, dashboards and support'],
]

export const whoFor = [
  'Home-service businesses',
  'Professional services',
  'Consultants',
  'Property managers',
  'Medical or dental practices (with reviewed deployment)',
  'Local and regional service providers',
  'Multi-location businesses',
  'Small SaaS or support teams',
]

export const whoForTraits = [
  'Miss calls during work or after hours',
  'Depend on phone-based leads',
  'Need appointments or callbacks',
  'Want a hosted solution rather than a development project',
  'Need more control than a generic answering bot provides',
  'Want to review recordings, transcripts, and outcomes',
  'Expect their workflow to become more customized over time',
]

export const whenNot = [
  'A large global contact center with numerous geographic regions, existing CCaaS systems, formal procurement certifications, and contractual SLA guarantees',
  'A company that wants to build its entire product and interface from voice APIs',
  'A business that needs only simple voicemail replacement without custom orchestration',
]

export const haiecAssesses = [
  'Intended use',
  'Affected users',
  'Data',
  'Jurisdictions',
  'Applicable requirements',
  'AI risk',
  'Security exposure',
  'Testing requirements',
  'Evidence gaps',
  'Known limitations',
]

export const kestrelImplements = [
  'The call workflow',
  'Business identity',
  'Instructions',
  'Knowledge',
  'Tools',
  'Transfers',
  'Emergency behavior',
  'Recording configuration',
  'Fallbacks',
  'Monitoring',
  'Call evidence',
]

export const relatedResources = [
  { href: '/ai-voice-agent-architecture', title: 'AI Voice Agent Architecture', desc: 'The complete production architecture — telephony, adaptive orchestration, RAG, tools, degradation, security, and evidence pipeline.' },
  { href: '/why-ai-voice-agents-fail-in-production', title: 'Why AI Voice Agents Fail in Production', desc: 'Ten failure modes, the AI voice control ladder, security threat model, TCPA and TRAIGA compliance, and a six-phase deployment plan.' },
  { href: '/solutions/kestrelvoice', title: 'Kestrel Voice Platform', desc: 'AI-powered voice operations for service businesses. Answer every call, book appointments automatically, recover missed revenue.' },
  { href: '/secure-enterprise-rag-architecture', title: 'Secure Enterprise RAG Architecture', desc: 'Enterprise RAG security covering row-level security, tenant isolation, retrieval governance, and the full RAG lifecycle.' },
  { href: '/how-to-secure-and-govern-ai', title: 'How to Secure and Govern AI', desc: 'NIST AI RMF, ISO/IEC 42001, SOC 2, and the seven layers of AI compliance with an interactive framework decision tool.' },
  { href: '/solutions/haiec', title: 'HAIEC Platform', desc: 'AI security, governance, and compliance-readiness platform with exposure assessment and audit-grade evidence.' },
]
