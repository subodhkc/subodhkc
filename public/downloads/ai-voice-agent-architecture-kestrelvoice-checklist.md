# AI Voice Agent Architecture Checklist

Building a production voice agent is not connecting speech-to-text to an LLM. The hard part is deciding what must happen in real time, what can wait, where session state belongs, and what the system does when one dependency stops behaving. This checklist covers the architecture decisions I make when deploying KestrelVoice and similar systems.

## Telephony and Media Path

- [ ] Choose a telephony transport (SIP trunk, WebRTC, or PSTN via Twilio/Vonage). SIP gives you control. WebRTC gives you browser access. PSTN gives you universal reach.
- [ ] Verify that the media path handles interrupted speech (barge-in). If the caller talks while the agent is speaking, the agent must stop and listen. Systems that ignore barge-in feel broken to callers.
- [ ] Configure jitter buffering to handle network variability. Voice is latency-sensitive. 150ms one-way is the perceptibility threshold. 400ms is the frustration threshold.
- [ ] Test call quality on mobile networks, not just broadband. Mobile networks have 2-5% packet loss. Your codec must handle it.

## Orchestration Layer

- [ ] Separate the real-time media path from the reasoning path. The media path must never block on model inference.
- [ ] Implement a fast path for simple intents (greetings, hours, transfers) that does not require an LLM call. Routing "what are your hours" through a 2-second model inference is a waste of compute and caller patience.
- [ ] Configure timeout handling for LLM responses. If the model does not respond in 3 seconds, play a holding phrase. Silence on a call is worse than a delay message.
- [ ] Define escalation rules: what phrases trigger human transfer, what conditions trigger a callback, what constitutes an emergency. Write these as explicit rules, not as model judgment.

## Session State and Context

- [ ] Decide where session state lives: in-memory on the media server, in a Redis cache, or in a persistent database. In-memory is fast but lost on restart. Redis is the right default for active calls. Database is for post-call records.
- [ ] Implement session recovery: if the media server restarts mid-call, can the caller's context be restored from Redis within 2 seconds? If not, the caller hears a restart and hangs up.
- [ ] Configure context window management. A 30-minute call generates more transcript than most models can hold in context. Summarize periodically and carry the summary forward.

## RAG and Knowledge Integration

- [ ] Connect the voice agent to a retrieval system for business-specific knowledge (services, pricing, policies, FAQs). Do not rely on the base model's parametric knowledge for business facts.
- [ ] Set a retrieval timeout of 500ms. If retrieval is slower, the agent should respond with what it knows and offer to follow up, not wait in silence.
- [ ] Verify that retrieved content is spoken naturally. Raw knowledge base text is usually not conversational. Run it through a speech-friendly formatter.
- [ ] Test retrieval accuracy with the actual questions callers will ask, not with developer-written queries. Callers do not say "Please retrieve the cancellation policy." They say "I need to cancel."

## Calendar and CRM Integration

- [ ] Integrate with the calendar system for scheduling. Verify that the agent checks availability before proposing a time, not after.
- [ ] Connect to the CRM for caller identification. If the caller's phone number matches a record, the agent should greet them by name and reference their history.
- [ ] Implement booking confirmation: after scheduling, send a confirmation via SMS or email. Verbal confirmation is not enough. People forget.
- [ ] Test the booking workflow end-to-end: call, schedule, receive confirmation, verify the appointment appears in the calendar.

## Security and Multi-Tenancy

- [ ] Enforce tenant isolation. One tenant's callers must never hear another tenant's data. Verify this with a penetration test, not a code review.
- [ ] Store API keys for integrations (calendar, CRM, telephony) in a secrets manager. Rotate them on a schedule.
- [ ] Log every call with: timestamp, duration, outcome, tenant ID, and agent version. Do not log call audio unless you have explicit consent and a retention policy.
- [ ] Implement per-tenant rate limiting. One tenant's traffic spike must not degrade service for others.

## Degradation and Fallback

- [ ] Define what happens when the LLM provider is down. The agent should handle basic intents (hours, location, transfer) without the model. A voice agent that goes silent when OpenAI has an outage is not production-ready.
- [ ] Define what happens when the telephony provider is down. Calls should failover to a backup number or voicemail with a callback promise.
- [ ] Test degradation modes in staging before production. Simulate provider outages and verify the fallback behavior.

## Deployment Verification

- [ ] Measure end-to-end latency from caller speech to agent response. Target: p95 < 1.5 seconds including STT, orchestration, LLM, and TTS.
- [ ] Run a 100-call pilot with real callers. Track completion rate, escalation rate, and caller satisfaction.
- [ ] Review missed calls and dropped calls. Every dropped call has a cause. Find it.
- [ ] Verify that monitoring covers the full path: telephony, STT, orchestration, LLM, TTS, integrations. A gap in monitoring is a gap in response.

## Evidence to Collect

- Latency measurements (p50, p95, p99) for each pipeline stage
- Call logs with outcome classification
- Tenant isolation test results
- Degradation mode test results
- 100-call pilot summary with completion and satisfaction rates
- Monitoring dashboard covering all pipeline stages
- Incident reports from the pilot period

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
