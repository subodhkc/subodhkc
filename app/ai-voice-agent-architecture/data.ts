export const faqs = [
  { q: 'What is an AI voice agent architecture?', a: 'An AI voice agent architecture is the complete system design that surrounds a voice AI model — including telephony integration, tenant configuration, deterministic rules, retrieval-augmented generation, tool execution, fallback modes, security, and post-call intelligence. The model handles conversation; the architecture handles the business process.' },
  { q: 'What is custom voice orchestration?', a: 'Custom voice orchestration is the practice of building application logic around the AI model to control business workflows, enforce safety rules, verify tool results, and produce evidence — rather than relying on the model alone to manage the call. Kestrel Voice uses custom Python orchestration via FastAPI.' },
  { q: 'What is adaptive AI voice?', a: 'Adaptive AI voice is a mode where the system runs a realtime AI session but intercepts every user utterance through a three-layer router: hard interrupts (emergencies, transfers), fast paths (hours, pricing, booking), and AI reasoning. Deterministic answers are injected without model involvement; the model handles only what requires reasoning.' },
  { q: 'Does Kestrel Voice use RAG?', a: 'Yes. Kestrel Voice includes a full RAG pipeline: website scraping, FAQ ingestion, and Google Drive integration as source types; chunking with sentence boundary detection; embedding generation; tenant-scoped storage in Postgres with pgvector; cosine similarity retrieval with a minimum threshold; and content refresh tracking with stale detection.' },
  { q: 'What happens when realtime AI fails?', a: 'The system falls back to Gather (turn-based) mode without dropping the caller. If three WebSocket failures occur within five minutes for a tenant, a circuit breaker trips and routes subsequent calls directly to Gather. The system also has a four-level degradation system: full AI, fast AI, rule-based, and human transfer.' },
  { q: 'Can Kestrel Voice make outbound calls?', a: 'Yes. The outbound dialer supports a full call state machine with three AI participation modes: silent (transcribe only), assist (suggestions), and active (speaks on behalf of the user). Credits are only consumed when the AI is actively engaged.' },
  { q: 'Does Kestrel Voice support video?', a: 'Yes. Video consultation sessions are available via Daily.co integration, with session management, recording, and participant tracking.' },
  { q: 'Can Kestrel Voice connect to my calendar or CRM?', a: 'Yes. Google Calendar sync is built in for booking, rescheduling, and cancellation. CRM integration supports lead creation and management in Postgres, with extensibility for Salesforce and HubSpot.' },
  { q: 'Does Kestrel Voice support multiple businesses?', a: 'Yes. The platform is multi-tenant with defense-in-depth isolation: ASGI middleware, parameter-scoped queries, Postgres row-level security, and server-side auth extraction. Each tenant has independent configuration, RAG, prompts, and call data.' },
  { q: 'How does Kestrel Voice handle spam and fraud?', a: 'Multi-layer protection: score-based spam enforcement with reputation memory, tenant-configurable sensitivity levels, whitelisting for false-positive protection, country-specific call rate limiting, and IRSF (International Revenue Share Fraud) prevention.' },
  { q: 'Is call recording compliant?', a: 'The system includes TCPA-compliant recording consent with state-aware prompting. Two-party consent states receive a consent prompt before recording begins. SMS handles STOP, HELP, and START keywords. Compliance depends on the use case and jurisdiction — the platform provides controls but does not make a business compliant by default.' },
  { q: 'Does Kestrel Voice learn from calls?', a: 'Yes. A learning pipeline records fast-path pattern matches, promotes recurring patterns above a threshold to active fast actions, and provides a time-delayed review window where tenants can reject promotions before they activate. Guardrails include intent whitelisting, blocked phrases, and length limits. Industry template FAQs provide a complementary mechanism for pre-written answers.' },
  { q: 'What is the AI copilot?', a: 'The copilot is a live call assistant that provides real-time notes, suggested responses, chat Q&A, and action item extraction to a human operator during an active call. It uses a cost-efficient model and integrates RAG for knowledge lookups. All copilot events are persisted for post-call review.' },
  { q: 'Can I use Kestrel Voice from my browser?', a: 'Yes. WebRTC support enables browser-based calling via Twilio Client, with a prebind session that ensures deterministic tenant resolution before the call connects.' },
  { q: 'What technology stack does Kestrel Voice use?', a: 'FastAPI (async voice runtime), OpenAI (realtime API, embeddings, copilot — all API-based, no local models), Twilio (telephony), Supabase and Postgres with pgvector (data, RAG, auth, RLS), Modal (serverless deployment), and Redis (optional session store with in-memory fallback). Next.js powers the frontend dashboard and RAG management.' },
]

export const tocItems = [
  { id: 'direct-answer', label: 'The Direct Answer' },
  { id: 'architecture-glance', label: 'Architecture at a Glance' },
  { id: 'call-arrival', label: 'What Happens When a Call Arrives' },
  { id: 'four-modes', label: 'Four Ways Kestrel Can Handle Calls' },
  { id: 'adaptive', label: 'Adaptive Orchestration' },
  { id: 'tenant-runtime', label: 'Tenant-Specific Business Runtime' },
  { id: 'deterministic-vs-generative', label: 'Deterministic vs Generative Answers' },
  { id: 'governed-rag', label: 'Governed RAG' },
  { id: 'tools-actions', label: 'Tools and Verified Actions' },
  { id: 'degraded-modes', label: 'Failure and Degraded Modes' },
  { id: 'post-call', label: 'Post-Call Operations' },
  { id: 'learning-pipeline', label: 'Learning Pipeline' },
  { id: 'beyond-inbound', label: 'Beyond Inbound: Outbound, Meetings, and Copilot' },
  { id: 'multi-channel', label: 'Multi-Channel: SMS, Video, and WebRTC' },
  { id: 'security-architecture', label: 'Security Architecture' },
  { id: 'technology-decisions', label: 'Technology Decisions' },
  { id: 'limitations', label: 'What the Architecture Does Not Guarantee' },
  { id: 'faq', label: 'Frequently Asked Questions' },
]

export const callSteps = [
  { step: 1, title: 'Phone rings', desc: 'Twilio receives the inbound call and sends a webhook to the FastAPI voice runtime. The webhook is authenticated via Twilio request signature validation.' },
  { step: 2, title: 'Tenant resolution', desc: 'The called number is mapped to a tenant configuration. This determines which business identity, greeting, hours, services, and emergency rules apply. A call to a plumbing company will never use a veterinary clinic configuration.' },
  { step: 3, title: 'Mode selection', desc: 'The system selects an AI mode based on the tenant plan, available credits, and time of day. Realtime uses WebSocket streaming. Adaptive uses a three-layer intent router. Gather is a turn-based fallback. IVR handles deterministic routing.' },
  { step: 4, title: 'Session initialization', desc: 'A call session is created with a unique ID, tenant context, and conversation state. For realtime and adaptive modes, a WebSocket connection is established between Twilio media stream and the voice runtime.' },
  { step: 5, title: 'System prompt assembly', desc: 'The tenant business configuration is assembled into a system prompt using a three-tier hierarchy: tenant-specific override, industry template default, then safe fallback. Today date is injected to prevent date hallucination. The prompt source and hash are logged for evidence.' },
  { step: 6, title: 'Deterministic intercept', desc: 'Before the AI processes any user speech, the system checks for hard interrupts: emergency phrases, transfer requests, compliance stop phrases. If matched, the model is cancelled and a pre-written response is injected.' },
  { step: 7, title: 'AI conversation', desc: 'The model handles the conversation within the guardrails of the system prompt. For knowledge questions, RAG retrieves tenant-specific chunks and injects them as context. For actions, the model calls tools that execute in application code.' },
  { step: 8, title: 'Tool execution and verification', desc: 'When the caller requests a booking, the model gathers required fields, the caller confirms, and the booking API executes. The model reports success or failure based on the authoritative tool result — not its own assumption.' },
  { step: 9, title: 'Evidence capture', desc: 'The call produces a transcript, recording, tool call logs, prompt evidence, outcome classification, and cost record. Post-call intelligence runs asynchronously to extract summary, key points, decisions, action items, and sentiment.' },
]

export const fourModes = [
  { title: 'Gather — Turn-Based Fallback', desc: 'Turn-based voice agent. The caller speaks, the system transcribes, the AI responds, and the cycle repeats. Lowest cost mode. Used as a fallback when realtime WebSocket connections fail and as the primary mode for tenants on basic plans. No streaming — each turn is a complete request-response cycle.' },
  { title: 'Realtime — WebSocket Streaming', desc: 'Lowest latency mode. Audio streams bidirectionally over WebSocket between Twilio media stream and the voice runtime, which proxies to the realtime API. The model can interrupt itself, handle barge-in, and respond in near-real time. Highest cost per minute. Used for tenants on premium plans or when conversation quality is critical.' },
  { title: 'Adaptive — Three-Layer Intent Router', desc: 'Realtime-first with deterministic intercepts. The model handles the conversation, but every user utterance passes through a three-layer router first: hard interrupts (emergency, transfer), fast paths (hours, pricing, booking), and AI reasoning. When a fast path matches, the model is cancelled and a deterministic response is injected — saving cost and improving consistency. Credit-based pricing.' },
  { title: 'IVR / Forwarding — Deterministic Routing', desc: 'No AI model. The call is routed deterministically based on tenant configuration: sequential ring (ring the business owner phone first, fall back to AI), time-based routing (different destinations for business hours vs after hours), or direct transfer. Used for tenants who want human-first routing with AI as fallback.' },
]

export const adaptiveLayers = [
  { title: 'Layer 1: Hard Interrupts', desc: 'Regex-based, zero-latency. Matches emergency phrases ("gas leak", "fire", "carbon monoxide"), transfer requests ("speak to a human"), compliance stop phrases, and repeat requests. When matched, the model is cancelled mid-response and a pre-written text-to-speech message is injected. This ensures emergency routing happens in milliseconds, not model-response time.' },
  { title: 'Layer 2: Fast Paths', desc: 'Keyword and lookup-based, zero-latency. Matches common business questions: hours, location, service area, pricing, booking intent, availability, greeting. When matched, the model is cancelled and a deterministic response is generated from the tenant canonical configuration — not the model interpretation. This means hours are always correct, pricing always matches the configuration, and the model never hallucinates a business hour.' },
  { title: 'Layer 3: AI Reasoning', desc: 'The model handles everything that does not match L1 or L2: ambiguous questions, multi-part requests, contextual explanations, clarification, and natural conversation. No intercept is needed — the model simply responds naturally within the system prompt guardrails.' },
]

export const fallbackTable: [string, string][] = [
  ['Realtime WebSocket fails', 'Fall back to Gather (turn-based)'],
  ['3 WebSocket failures in 5 min', 'Circuit breaker trips → Gather mode'],
  ['AI API degraded', 'Degrade to Fast AI or Rule-Based'],
  ['All AI unavailable', 'Human transfer or voicemail'],
  ['Tool fails', 'AI reports failure, offers alternative'],
  ['Emergency detected', 'Immediate transfer, no AI deliberation'],
]

export const intelligenceFields = [
  { label: 'Summary', desc: '2-3 sentence narrative' },
  { label: 'Key points', desc: 'Bullets of what was discussed' },
  { label: 'Decisions', desc: 'Commitments and agreements' },
  { label: 'Objections', desc: 'Concerns raised by the caller' },
  { label: 'Action items', desc: 'Follow-ups with priority and owner' },
  { label: 'Recommendations', desc: 'Next best action, risk flags, missed opportunities' },
  { label: 'Sentiment trend', desc: 'Positive, neutral, negative, or mixed' },
  { label: 'Meeting insights', desc: 'Topic segments and sentiment (meeting calls only)' },
]

export const learningSteps = [
  { step: 1, title: 'Record', desc: 'Every L2 fast-path match is recorded with tenant ID, intent, user input, and timestamp. This is the raw signal.' },
  { step: 2, title: 'Promote', desc: 'Patterns that appear above a minimum occurrence threshold are promoted to the fast actions table. Guardrails filter the promotion: only whitelisted intents are eligible, blocked phrases are excluded, and pattern length is limited.' },
  { step: 3, title: 'Review Window', desc: 'Promoted patterns enter a time-delayed review window. Email reminders are sent to the tenant before auto-approval, giving them an opportunity to reject. This is not a human-in-the-loop gate — it is a notification window with opt-out.' },
  { step: 4, title: 'Activate', desc: 'After the review window passes, patterns are auto-approved and become active in future calls. The tenant can deactivate any pattern from the dashboard.' },
]

export const learningGuardrails = [
  'Intent whitelist — Only approved intent types can be promoted',
  'Blocked phrases — Patterns containing blocked phrases are excluded',
  'Length limits — Pattern text must be within configured bounds',
  'Minimum occurrences — Patterns must appear multiple times before promotion',
  'Tenant-scoped — Patterns are never shared across tenants',
]

export const beyondInboundFeatures = [
  { title: 'Outbound Dialer', desc: 'A full call state machine: initiating → dialing → ringing → connected → active → ended. The AI can join in three modes: silent (transcribe only), assist (provide suggestions to the caller), or active (speak on behalf of the user). Credits are only consumed when the AI is actively engaged — not during dialing or ringing. Twilio signature validation protects outbound endpoints.' },
  { title: 'Meeting Bridge', desc: 'Dial into external meetings (Zoom, Teams, Google Meet) via Twilio. DTMF tones handle meeting ID and passcode entry. The AI participates in three modes: silent (transcribe only), assist (real-time suggestions), or active (speaks during the meeting). Reuses the outbound session model with meeting-specific billing.' },
  { title: 'AI Copilot', desc: 'During any live call, a copilot panel provides real-time AI assistance to the human operator: live notes, suggested responses, chat Q&A with context, and action item extraction. Uses a cost-efficient model for low-latency assistance. RAG integration allows the copilot to look up knowledge-base answers during the call. All copilot events are persisted for post-call review.' },
  { title: 'Sequential Ring', desc: 'Ring the business owner phone before the AI answers. Customizable timeout, sequential or simultaneous ring modes, and time-based routing. If the human does not answer within the configured timeout, the call falls back to AI. Only activates if the tenant has enabled it — existing call flow is preserved for tenants who want AI-first.' },
]

export const multiChannelFeatures = [
  { title: 'SMS', desc: 'Outbound SMS via Twilio with two modes: internal (system notifications, no credit deduction) and user (business messaging, credit-based). Inbound SMS handles TCPA-required STOP, HELP, and START keywords through a dedicated webhook. The inbound SMS router has been migrated from the backend to the frontend for simpler maintenance.' },
  { title: 'Video Sessions', desc: 'Video consultation sessions via Daily.co API. Session management includes creation, participant tracking, recording, and status lifecycle. Tenants can create video sessions for remote consultations, and recordings are stored with consent tracking.' },
  { title: 'WebRTC', desc: 'Browser-based calling via Twilio Client. A prebind session binds the tenant ID before the device connects, ensuring deterministic tenant resolution for browser-initiated calls. This enables click-to-call from the dashboard and web-based phone functionality.' },
]

export const securityDomains = [
  { title: 'Telephony Authentication', desc: 'All Twilio webhook endpoints validate request signatures using Twilio request validator. The system is fail-secure in production — validation bypass is blocked outside development environments. Multiple URL candidates are checked to handle proxy and deployment URL variations.' },
  { title: 'API Key Management', desc: 'Three-tier API key system: admin keys for administrative endpoints (validated with constant-time comparison to prevent timing attacks), developer keys for external integrations (SHA-256 hashed storage, never stored plaintext, tenant-scoped), and internal service-to-service keys for platform-internal communication.' },
  { title: 'Spam and Fraud Protection', desc: 'Multi-layer spam enforcement with score-based routing: normal, limited (voicemail only), and blocked. Caller reputation memory tracks repeat callers. Tenant-configurable sensitivity levels (low, medium, high). Four whitelist types for false-positive protection: contacts, recent callers, IVR-passed, and manual.' },
  { title: 'Toll Fraud Prevention', desc: 'Country-specific call rate limiting with daily, hourly, and maximum duration limits. High-risk country detection for IRSF (International Revenue Sharing Fraud) prevention. Call attempts are tracked and blocked when exceeding configured thresholds. Fraud protection endpoints are admin-API-key protected.' },
  { title: 'Recording Consent', desc: 'TCPA-compliant call recording consent. Area code to state mapping automatically detects two-party consent states. Consent prompts are generated as TwiML before recording begins. SMS handles STOP, HELP, and START keywords as required by TCPA.' },
  { title: 'Tenant Isolation', desc: 'Defense-in-depth tenant isolation across five layers: ASGI middleware extracts tenant ID from JWT on every request, all database queries pass tenant ID as a parameter, Postgres row-level security enforces tenant-scoped access at the database level, server-side auth extraction never trusts client-provided tenant IDs, and internal service-to-service calls use a separate authentication path.' },
]

export const techDecisions = [
  { title: 'FastAPI', desc: 'Chosen for async-first design, native WebSocket support for realtime voice streaming, automatic OpenAPI documentation, and Pydantic v2 validation. The voice runtime needs to handle simultaneous WebSocket connections, HTTP webhooks, and background tasks — FastAPI async model handles this naturally.' },
  { title: 'OpenAI (API-based)', desc: 'All inference is API-based — no local models. The realtime API powers voice streaming, the frontier model handles conversation, a cost-efficient model handles copilot and post-call intelligence, and the embedding model powers RAG. API-based inference provides lower latency than self-hosted models on serverless infrastructure.' },
  { title: 'Twilio', desc: 'Pinned SDK version for stability. Twilio handles voice (programmable voice, TwiML, media streams), SMS, phone number provisioning, and request signature validation. The telephony layer is the entry point for every call.' },
  { title: 'Supabase + Postgres + pgvector', desc: 'Postgres with pgvector for RAG vector search, Supabase for auth and row-level security, real-time subscriptions for dashboard updates. Using Postgres for both relational data and vector search avoids a separate vector database while providing RLS for tenant isolation.' },
  { title: 'Modal', desc: 'Serverless deployment with auto-scaling. Minimum container count prevents cold-start errors on the first Twilio webhook. Consolidated deployment serves the voice runtime, analytics, and scrapers from one container for cost efficiency. Secret management via Modal secret store.' },
  { title: 'Redis (optional)', desc: 'Optional session store for turn-based conversations. Provides multi-instance state sharing and persistent session storage across restarts. Graceful fallback to in-memory storage if Redis is unavailable — the system degrades but does not fail.' },
]

export const limitations = [
  { title: 'Zero hallucinations', desc: 'The model may still invent facts, mishear information, or claim actions succeeded when they failed. Deterministic fast paths, RAG grounding, and tool-result verification reduce this risk but cannot eliminate it.' },
  { title: 'Perfect emergency detection', desc: 'Regex-based emergency matching catches known phrases but cannot detect every possible emergency description. The system errs on the side of caution but cannot guarantee zero missed emergencies.' },
  { title: 'Legal compliance in every jurisdiction', desc: 'TCPA, HIPAA, state biometric laws, and international regulations vary by use case and jurisdiction. The platform provides configurable controls but does not make any business compliant by default.' },
  { title: 'Permanent uptime', desc: 'The system degrades gracefully but is not immune to provider outages, network failures, or infrastructure issues.' },
  { title: 'Complete immunity from attacks', desc: 'Twilio signature validation, API key management, spam enforcement, and tenant isolation reduce attack surface but cannot prevent every possible attack vector.' },
  { title: 'Autonomous production improvement', desc: 'The learning pipeline promotes patterns with guardrails and a review window, but it does not autonomously change business logic or override tenant configuration.' },
]

export const relatedResources = [
  { href: '/why-ai-voice-agents-fail-in-production', title: 'Why AI Voice Agents Fail in Production', desc: 'Ten failure modes, a production architecture, security threat model, compliance mapping, and a six-phase deployment plan.' },
  { href: '/solutions/kestrelvoice', title: 'Kestrel Voice Platform', desc: 'AI-powered voice operations for service businesses. Answer every call, book appointments automatically, recover missed revenue.' },
  { href: '/solutions/haiec', title: 'HAIEC Platform', desc: 'AI security, governance, and compliance-readiness platform with exposure assessment and audit-grade evidence.' },
  { href: '/secure-enterprise-rag-architecture', title: 'Secure Enterprise RAG Architecture', desc: 'Enterprise RAG security covering row-level security, tenant isolation, retrieval governance, and the full RAG lifecycle.' },
  { href: '/how-to-secure-and-govern-ai', title: 'How to Secure and Govern AI', desc: 'NIST AI RMF, ISO/IEC 42001, SOC 2, and the seven layers of AI compliance with an interactive framework decision tool.' },
  { href: '/ai-security-tools', title: 'AI Security Tools', desc: 'Interactive blast radius calculator, agent read/write/action matrix, and prompt-injection scenario library.' },
]
