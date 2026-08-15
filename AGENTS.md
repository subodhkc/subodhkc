# SubodhKC.com Project Rules

## Build & Development
- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- Blog posts are JSON files in `data/blog/posts/`
- Blog rendering: `app/blog/[slug]/page.tsx`
- Blog utilities: `lib/blog.ts`, `lib/blog-utils.ts`

## Brand Canon
- **Canonical identity:** Subodh KC — AI Advisor & AI Systems Architect
- **Primary:** AI Advisor
- **Secondary differentiator:** AI Systems Architect
- **Supporting:** enterprise operator, program leader, builder, researcher
- **Positioning:** "From possibility to decision. From decision to production."
- **SEO theme:** "AI THAT WORKS" — Decisions. Systems. Evidence.
- **Full canon:** `docs/BRAND_CANON.md`
- **Positioning rules:** `.windsurf/rules/brand-positioning.md`

### Prohibited Legacy Positioning
Future agents must NOT reintroduce:
- "Sovereign AI Pragmatist"
- "Defensive AI Architecture" as umbrella brand
- governance-first positioning
- generic AI consultant positioning

"Defensive AI Architecture" may remain as a specialist subtopic only.

## SEO URL Ownership
- `/` — AI Advisor, AI Systems Architect
- `/ai-advisor` — AI Advisor for Business, ongoing human AI advisory (NOT: monthly/fractional/local/AI opportunity assessment)
- `/advisory` — Fractional AI Advisor, Executive AI Advisory, AI Strategy Advisor
- `/ai-automation` — AI Opportunity Assessment, AI Automation Blueprint (focused, not org-wide)
- `/local-ai-review` — Dallas / DFW AI Advisor
- `/about` + `/executive-bio` — Entity corroboration (AI systems, enterprise AI, program leadership, research)
- `/portfolio` — Selected Work / execution proof
- `/solutions/haiec` — HAIEC-specific entity/product proof

## Email Address Roles
- **Public executive contact:** `subodhkc@subodhkc.com`
- **Sales/contact lead destination:** `subodhkc@subodhkc.com`
- **System/automation admin:** `admin@subodhkc.com` (where technically appropriate)
- **Transactional From:** `noreply@subodhkc.com` (authenticated sender)
- Do NOT globally replace one address with another. Audit each usage by PURPOSE.

## Editorial Rules
- See `.devin/skills/subodhkc-editorial-manifesto/SKILL.md` for the full editorial persona and rules
- See `.devin/skills/subodhkc-seo-theme/SKILL.md` for the SEO content strategy and topic clusters
- CI-generated articles use author "Yeti AI Writer"
- Hand-written articles by Subodh KC use author "Subodh KC"
- All articles must pass hallucination validation (URL checks) before publishing
- All articles must pass AI tell-tale detection (no em-dashes, emojis, AI phrases)
- SEO theme: "AI THAT WORKS" with 4 topic clusters
- Article length: 1500-2500 words (information density over length)
- Content authority model: EARNED TOPICAL AUTHORITY — every page must add information the current SERP does not already have

## CI Article Generation
- Script: `scripts/generate-article.mjs`
- Workflow: `.github/workflows/daily-article.yml`
- Schedule: 1 article every other day at 14:00 UTC (09:00 CST) — **NOW IN DRAFT/MANUAL APPROVAL MODE**
- Model: `gpt-4o-2024-11-20`
- Authority articles: 1500-2500 words
- Max output tokens: 16384 for authority articles
- Continuation mechanism handles truncated responses
- Validation: hallucination URL checks, AI tell-tale detection, citation density, title specificity, paragraph independence, transition word frequency, CSM stale terminology detection
- **Publish gate (NEW):** clear target audience, unique search intent, information gain, original artifact, factual verification, primary-source citations, no keyword cannibalization, internal link plan, clear conversion path, human/editorial approval

## CSM Canonical Terminology
- **Canonical name:** Cognitive Systems Management (CSM)
- **Current version:** CSM 2.0 (spec version 2.0.0, spec date 2026-08-10)
- **Four domains:** CSM-Enterprise, CSM-Project, CSM-Code, CSM-UX (never "four-pillar" or pillar model)
- **Six execution functions:** EF1-PURPOSE, EF2-MAPPING, EF3-RISK, EF4-DELIVERY, EF5-OVERSIGHT, EF6-COMPLIANCE (never "CSM6")
- **16 governance components:** ENT-POLICY, ENT-RISK, ENT-DATA, ENT-MANDATE, PRJ-BUSINESS, PRJ-TESTING, PRJ-SCALE, PRJ-PLAYBOOK, CODE-STANDARDS, CODE-SECURITY, CODE-HUMAN, CODE-TRACE, UX-IMPACT, UX-EXPLAIN, UX-CAPABILITY, UX-ADOPTION
- **Canonical data:** `data/csm/v2/spec.ts` (V2 spec), `data/csm/v2/contracts.ts` (governance contracts), `data/csm/v1.ts` (V1 preserved)
- **Machine-readable spec:** `public/frameworks/csm/2.0/csm-2.0.json` with schema at `public/frameworks/csm/2.0/csm-2.0.schema.json`
- **Canonical pages:** `/cognitive-systems-management` (main), `/cognitive-systems-management/v2` (V2 spec), `/cognitive-systems-management/contracts` (contracts), `/cognitive-systems-management/assessment` (evaluator)
- **Original publication:** August 29, 2025, AI Governance on Medium
- **Provenance separation:** CSM 2.0 does NOT claim the 2025 article contained V2 features
- **CSM = WHERE (domains), Execution Framework = WHAT (functions)** — do not conflate
- **CSM is a methodology, not a certification/standard/regulation**
- **CSM 2.0 does not produce legal compliance verdicts or aggregate scores**
- **HAIEC supports selected CSM activities but does not fully implement every CSM responsibility**
- **Tests:** `npx tsx tests/csm-v2/golden-tests.ts` and `npx tsx tests/csm-v2/invariant-tests.ts`
- See `.devin/skills/subodhkc-editorial-manifesto/SKILL.md` Section 10 for full CSM terminology and V2 versioning guardrails

## Architecture
- Next.js 16 App Router with Turbopack
- Blog posts stored as JSON, rendered with sanitized HTML
- Per-post author profiles in `components/blog/BlogAuthorCard.tsx`
- OG images generated dynamically per blog post
- Sanitizer allows data-* attributes on pre tags (used for diagram centering)

## Git Rules
- Always pull before pushing
- Never bypass errors
- Always check existing code before building from scratch
