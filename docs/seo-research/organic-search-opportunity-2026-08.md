# SUBODHKC.COM - ORGANIC SEARCH OPPORTUNITY RESEARCH
## Real Keyword Data + SERP + Conversion Strategy

**Date:** 2026-08-15
**Status:** RESEARCH ONLY - no website changes made
**Data sources used:**
1. Google Autocomplete API (suggestqueries.google.com) - real Google search suggestions, free, unlimited
2. Google Trends API (via pytrends) - real relative search interest, 12-month trends, rising/top queries, US regional breakdown
3. Live SERP analysis via web search - real Google results for 16 key terms
4. Keywords Everywhere MCP - connected but account has 0 credits (see Data Gaps)

**IMPORTANT DATA CAVEATS:**
- Google Trends values are RELATIVE (0-100 scale, normalized within each batch query), NOT absolute monthly search volume
- Google Autocomplete returns real suggestion ordering but NOT volume/CPC/competition metrics
- Keywords Everywhere monthly volume, CPC, advertiser competition, and keyword difficulty are UNAVAILABLE (0 credits)
- All SERP observations are real but were captured via web_search tool, not direct Google SERP scraping
- Trends data covers Aug 2025 - Aug 2026 (12 months, US geography)

---

## 1. RAW KEYWORD DATA TABLE

### 1A. Google Trends Relative Interest (40 keywords, US, 12-month)

Values are relative (0-100) within each 5-keyword batch. Cross-batch comparison is approximate.

| Keyword | Avg Relative Interest | Latest (Aug 2026) | First (Aug 2025) | Trend Direction | Trend % | Notes |
|---|---|---|---|---|---|---|
| ai governance | 63.3 | 18 | 25 | down | -28.0% | Highest relative interest in batch 3 |
| ai transformation | 56.5 | 21 | 28 | down | -25.0% | High but declining |
| ai testing | 54.3 | 15 | 41 | down | -63.4% | Sharp decline |
| ai automation | 53.0 | 16 | 42 | down | -61.9% | High volume, sharp decline |
| ai monitoring | 49.2 | 11 | 41 | down | -73.2% | High volume, steep decline |
| ai evaluation | 47.8 | 13 | 18 | down | -27.8% | Moderate decline |
| ai advisory services | 43.8 | 6 | 20 | down | -70.0% | Steep decline |
| ai procurement | 40.9 | 13 | 26 | down | -50.0% | Moderate decline |
| ai strategy | 37.9 | 11 | 27 | down | -59.3% | High volume, declining |
| ai verification | 31.3 | 8 | 48 | down | -83.3% | Very steep decline |
| ai automation consultant | 28.2 | 14 | 0 | up | NEW | Emerging term - appeared during tracking period |
| ai advisor for business | 27.8 | 3 | 24 | down | -87.5% | Very steep decline |
| ai workflow assessment | 26.5 | 4 | 0 | up | NEW | Emerging term |
| ai consulting | 18.5 | 7 | 16 | down | -56.2% | Moderate decline |
| ai consultant near me | 16.0 | 3 | 0 | up | NEW | Emerging local intent |
| ai strategy advisor | 14.3 | 3 | 0 | up | NEW | Emerging term |
| ai process automation | 11.8 | 2 | 15 | down | -86.7% | Very steep decline |
| ai readiness assessment | 11.2 | 5 | 12 | down | -58.3% | Moderate decline |
| ai agent security | 10.8 | 4 | 5 | down | -20.0% | Mild decline, relatively stable |
| executive ai advisor | 8.8 | 3 | 0 | up | NEW | Emerging term |
| ai vendor evaluation | 8.5 | 2 | 0 | up | NEW | Emerging term |
| mcp security | 7.5 | 2 | 4 | down | -50.0% | Low volume, declining |
| ai drift | 7.4 | 2 | 3 | down | -33.3% | Low volume |
| ai advisor | 6.7 | 2 | 3 | down | -33.3% | Low volume |
| ai consultant | 6.6 | 3 | 3 | flat | 0.0% | Stable, low volume |
| ai operating model | 6.2 | 1 | 2 | down | -50.0% | Low volume |
| ai strategy framework | 3.4 | 0 | 1 | down | -100.0% | Near zero |
| dallas ai consultant | 2.5 | 2 | 0 | up | NEW | Emerging local term |
| production ai architecture | 2.5 | 0 | 2 | down | -100.0% | Near zero |
| rag security | 2.4 | 0 | 2 | down | -100.0% | Near zero |
| ai build vs buy | 1.8 | 0 | 1 | down | -100.0% | Near zero |
| ai consultant for small business | 1.8 | 2 | 0 | up | NEW | Emerging |
| ai opportunity assessment | 1.2 | 0 | 0 | flat | 0.0% | Very low |
| ai proof of concept | 1.1 | 0 | 1 | down | -100.0% | Near zero |
| ai advisor for small business | 0.8 | 0 | 0 | flat | 0.0% | Very low |
| ai implementation roadmap | 0.4 | 0 | 0 | flat | 0.0% | Very low |
| ai maturity assessment | 0.4 | 0 | 0 | flat | 0.0% | Very low |
| fractional ai advisor | 0.3 | 1 | 0 | up | NEW | Emerging but very low |
| ai use case prioritization | 0.0 | 0 | 0 | flat | 0.0% | No Trends signal |
| multi-tenant rag | 0.0 | 0 | 0 | flat | 0.0% | No Trends signal |

### 1B. Keywords Everywhere Metrics (ALL UNAVAILABLE)

| Metric | Status |
|---|---|
| US monthly search volume | UNAVAILABLE (0 credits) |
| CPC | UNAVAILABLE (0 credits) |
| Advertiser competition | UNAVAILABLE (0 credits) |
| Keyword difficulty | UNAVAILABLE (0 credits) |
| KE related keywords | UNAVAILABLE (0 credits) |
| KE PASF keywords | UNAVAILABLE (0 credits) |

### 1C. Google Autocomplete Universe (57 seed terms, ~570 real suggestions)

Full autocomplete data saved in: `docs/seo-research/raw-autocomplete-data.json`

Key seed terms and their top real Google suggestions (commercial intent filtered):

**AI Advisor cluster:**
- "ai advisor" -> ai advisor, ai advisor login, ai advisory, ai advisory council, ai advisory board, ai advisor jobs, ai advisory services
- "ai advisor for business" -> ai advisor for business, ai consultant for business, ai advisor for small business, ai financial advisor for business, ai consultant for small business, ai consultant for my business, ai consultant for small business near me
- "fractional ai advisor" -> fractional ai advisor, fractional ai advisory, fractional ai consultant
- "executive ai advisor" -> executive ai advisor, executive advisor to ceo, what is an executive advisor, executive advisor job description
- "ai strategy advisor" -> ai strategy advisors, ai strategy advisory, ai strategy consultant, ai strategy consultant jobs, ai strategy consultant salary

**AI Strategy / Consulting cluster:**
- "ai strategy" -> ai strategy, ai strategy canada, ai strategy for all, ai strategy course, ai strategy jobs, ai strategy framework
- "ai consulting" -> ai consulting, ai consulting firms, ai consulting jobs, ai consulting for small businesses, ai consulting company, ai consulting agency
- "ai consultant" -> ai consultant, ai consultant jobs, ai consultant certification, ai consultant salary, ai consultant for small business, ai consultant near me
- "ai transformation" -> ai transformation, ai transformation leader, ai transformation jobs, ai transformation leader certification, ai transformation summit

**AI Opportunity / Assessment cluster:**
- "ai opportunity assessment" -> ai opportunity assessment, ai opportunity assessment framework, what is opportunity assessment
- "ai readiness assessment" -> ai readiness assessment, ai readiness assessment framework, ai readiness assessment tool, ai readiness assessment methodology, ai readiness assessment questionnaire
- "ai use case prioritization" -> ai use case prioritization framework, ai use case prioritization matrix, ai use case prioritization
- "ai use case discovery" -> ai use case discovery, ai use case discovery workshop, ai use case discovery framework
- "ai workflow assessment" -> ai workflow assessment, ai workflow analysis, ai workflow evaluation
- "ai maturity assessment" -> ai maturity assessment, ai maturity assessment framework, ai maturity assessment tool, ai maturity assessment gartner

**AI Vendor / Build vs Buy cluster:**
- "ai vendor evaluation" -> ai vendor evaluation, ai vendor evaluation checklist, ai vendor evaluation framework, ai vendor assessment, ai vendor selection
- "ai build vs buy" -> ai build vs buy, ai build vs buy framework, ai build or buy, ai agents build vs buy, build vs buy ai solutions, build vs buy ai tools
- "ai proof of concept" -> ai proof of concept, ai proof of concept failure, ai proof of concept (poc), generative ai proof of concept
- "ai implementation roadmap" -> ai implementation roadmap, ai implementation roadmap pdf, ai implementation plan, ai implementation plan template
- "ai operating model" -> ai operating model, ai operating model mckinsey, ai operating model ibm, ai operating model gartner, ai operating model design

**Technical Authority cluster:**
- "ai agent security" -> ai agent security, ai agent security risks, ai agent security framework, ai agent security best practices
- "rag security" -> rag security, rag security fundamentals, rag security issues, rag security risks, rag security testing
- "mcp security" -> mcp security, mcp security scanner, mcp security best practices, mcp security concerns, mcp security checklist
- "ai drift" -> ai drift, ai drift meaning, ai drift vs hallucination, ai drift detection, ai drift monitoring
- "ai evaluation" -> ai evaluation, ai evaluation framework, ai evaluation metrics, ai evaluation platform
- "ai governance" -> ai governance, ai governance certification, ai governance framework, ai governance committee
- "multi-tenant rag" -> multi-tenant rag, multi tenant rag architecture, multi tenant rag system, multi tenant rag aws

**Local cluster:**
- "dallas ai consultant" -> dallas ai consulting, dallas texas consultants salary, ceos in dallas
- "texas ai consulting" -> texas ai consulting, ai companies in texas

### 1D. Rising Queries from Google Trends (real, breakout signals)

| Seed Keyword | Rising Query | Growth % |
|---|---|---|
| ai strategy | amazon ai strategy shift | +4500% |
| ai strategy | west shore home ai strategy | +2700% |
| ai strategy | jeff bezos amazon ai strategy | +900% |
| ai strategy | microsoft china ai strategy | +250% |
| ai consulting | hostinger ai builder | +2250% |
| ai consulting | runable ai | +2000% |
| ai automation | upskilling 2026 | +2900% |
| ai automation | social commerce trends | +1250% |
| ai automation | ai agents | +110% |
| ai agent security | hermes agent | +226050% |
| ai transformation | microsoft ai transformation leader | +23000% |
| ai transformation | microsoft certified ai transformation leader | +4050% |
| ai testing | owasp ai testing guide | +350% |
| ai maturity assessment | (IBM AI maturity assessment questions) | +282250% / +57150% / +46900% |

### 1E. US Regional Interest Signals (selected, from Google Trends)

| Keyword | Top US DMA Markets |
|---|---|
| dallas ai consultant | Dallas-Ft. Worth TX (44), Los Angeles (10), San Francisco (8), Washington DC (8), New York (6) |
| ai advisor for business | Austin TX (100), Baltimore MD (100), Columbus OH (100), Charlotte NC (100), Memphis TN (100) |
| ai use case prioritization | Cheyenne WY (100), Dallas-Ft. Worth TX (11) |
| ai workflow assessment | Baltimore MD (100), Helena MT (100), Las Vegas NV (100), Orlando FL (63) |
| ai automation consultant | Indianapolis (100), Jacksonville (100), Raleigh-Durham (100), Salt Lake City (100), San Diego (65) |
| ai readiness assessment | Greenville-Spartanburg SC (100), Minneapolis (29), Boston (28), Portland OR (27), Baltimore (26) |
| ai vendor evaluation | St. Louis (45), Memphis (39), Milwaukee (35), Sacramento (25) |
| ai consultant for small business | San Antonio TX (50), Los Angeles (16), Philadelphia (14), Atlanta (13), Chicago (11) |
| fractional ai advisor | Albany GA (100), New York (1) |

---

## 2. TOP 25 ORGANIC OPPORTUNITIES

Ranked by a composite of: real Trends interest, SERP winnability, buyer intent, brand fit, and information gain potential. NOT ranked by absolute volume (unavailable).

| Rank | Keyword | Trends Avg | Trend | SERP Winna- bility | Buyer Intent | Brand Fit | Info Gain | Classification |
|---|---|---|---|---|---|---|---|---|
| 1 | ai readiness assessment | 11.2 | down | HIGH | HIGH | HIGH | HIGH | MONEY PAGE |
| 2 | ai vendor evaluation | 8.5 | up (NEW) | HIGH | HIGH | HIGH | HIGH | AUTHORITY CONTENT |
| 3 | ai build vs buy | 1.8 | down | HIGH | HIGH | HIGH | HIGH | AUTHORITY CONTENT |
| 4 | ai opportunity assessment | 1.2 | flat | HIGH | HIGH | HIGH | HIGH | MONEY PAGE |
| 5 | ai use case prioritization | 0.0 | flat | HIGH | HIGH | HIGH | HIGH | AUTHORITY CONTENT |
| 6 | ai workflow assessment | 26.5 | up (NEW) | HIGH | HIGH | HIGH | HIGH | MONEY PAGE |
| 7 | fractional ai advisor | 0.3 | up (NEW) | MEDIUM | HIGH | HIGH | MEDIUM | MONEY PAGE |
| 8 | ai operating model | 6.2 | down | HIGH | MEDIUM | HIGH | HIGH | AUTHORITY CONTENT |
| 9 | ai implementation roadmap | 0.4 | flat | HIGH | HIGH | HIGH | HIGH | AUTHORITY CONTENT |
| 10 | ai proof of concept | 1.1 | down | HIGH | HIGH | HIGH | HIGH | AUTHORITY CONTENT |
| 11 | ai governance framework | 63.3 (seed) | down | MEDIUM | MEDIUM | HIGH | HIGH | AUTHORITY CONTENT |
| 12 | ai agent security | 10.8 | down | HIGH | MEDIUM | HIGH | HIGH | TECHNICAL AUTHORITY |
| 13 | rag security | 2.4 | down | HIGH | MEDIUM | HIGH | HIGH | TECHNICAL AUTHORITY |
| 14 | mcp security | 7.5 | down | HIGH | MEDIUM | HIGH | HIGH | TECHNICAL AUTHORITY |
| 15 | multi-tenant rag | 0.0 | flat | HIGH | LOW | HIGH | HIGH | TECHNICAL AUTHORITY |
| 16 | ai drift detection | 7.4 (seed) | down | HIGH | MEDIUM | HIGH | HIGH | TECHNICAL AUTHORITY |
| 17 | ai evaluation framework | 47.8 (seed) | down | MEDIUM | MEDIUM | HIGH | HIGH | TECHNICAL AUTHORITY |
| 18 | dallas ai consultant | 2.5 | up (NEW) | MEDIUM | HIGH | HIGH | MEDIUM | LOCAL SEO |
| 19 | ai advisor for business | 27.8 | down | MEDIUM | HIGH | HIGH | MEDIUM | MONEY PAGE |
| 20 | ai strategy advisor | 14.3 | up (NEW) | MEDIUM | HIGH | HIGH | MEDIUM | MONEY PAGE |
| 21 | executive ai advisor | 8.8 | up (NEW) | MEDIUM | HIGH | HIGH | MEDIUM | MONEY PAGE |
| 22 | ai automation consultant | 28.2 | up (NEW) | MEDIUM | HIGH | MEDIUM | MEDIUM | MONEY PAGE |
| 23 | ai maturity assessment | 0.4 | flat | HIGH | MEDIUM | HIGH | HIGH | AUTHORITY CONTENT |
| 24 | ai strategy framework | 3.4 | down | MEDIUM | MEDIUM | HIGH | HIGH | AUTHORITY CONTENT |
| 25 | ai procurement | 40.9 | down | MEDIUM | MEDIUM | MEDIUM | MEDIUM | AUTHORITY CONTENT |

---

## 3. TOP 10 MONEY-PAGE TERMS

These are terms that should directly drive advisory inquiries. They map to existing or needed landing pages.

| Rank | Keyword | Trends Signal | SERP Observation | Recommended URL |
|---|---|---|---|---|
| 1 | ai readiness assessment | 11.2 avg, declining | UNESCO/MITRE/Gartner dominate; no independent specialist with a downloadable tool ranks | /ai-automation (existing) or new /ai-readiness-assessment |
| 2 | ai opportunity assessment | 1.2 avg, flat | Auditic (free tool), thinkCircle, Fraction blog, Metacto, SUPALABS - mix of tools and blogs; no dominant authority | /ai-automation (existing) |
| 3 | ai workflow assessment | 26.5 avg, NEW/emerging | Very few dedicated pages; mostly generic "ai workflow" content | /ai-automation (existing) |
| 4 | fractional ai advisor | 0.3 avg, NEW/emerging | Mack Burnett, AAI Agency, fractionalaiadvisors.com, fractionalconsulting.ai, Durkee.ai, Sophizo - all small specialist sites, no major authority | /advisory (existing) |
| 5 | ai advisor for business | 27.8 avg, declining | explai, BlueVan AI, AI Aspire (Andrew Ng), Abe Nadimi, Brian Gibbs - mix of product and advisor sites | /ai-advisor (existing) |
| 6 | ai strategy advisor | 14.3 avg, NEW/emerging | Liat Ben-Zur, Ronnie Barnard, DrBeza.ai, Paul Shirer, Jennifer Ives - all solo practitioners; no major authority | /advisory (existing) |
| 7 | executive ai advisor | 8.8 avg, NEW/emerging | Same SERP as ai strategy advisor; solo practitioners dominate | /advisory (existing) |
| 8 | ai automation consultant | 28.2 avg, NEW/emerging | Tai Lopez courses, job listings, Reddit threads - weak SERP, no authoritative advisor | /ai-advisor (existing) or /ai-automation |
| 9 | dallas ai consultant | 2.5 avg, NEW/emerging | dallasaiconsultant.com, Direct AI Solutions, Preston McCauley, Erin Moore, JEH Consulting, Dallas AI Company - all local competitors | /local-ai-review (existing) |
| 10 | ai vendor evaluation | 8.5 avg, NEW/emerging | APQC, InitializeAI, VerityAI, Layer3Labs, DSC Institute, Clarity - checklist/scorecard sites; no independent advisor | /ai-vendor-due-diligence-checklist (existing) |

---

## 4. TOP 15 AUTHORITY-CONTENT TERMS

These are terms best served by original, information-dense articles with artifacts.

| Rank | Keyword | Trends Signal | SERP Weakness | Original Artifact Needed |
|---|---|---|---|---|
| 1 | ai build vs buy framework | 1.8 avg | TechTarget, COMPEL Framework, Resourcifi, angirash.in, Multigrid - good content exists but no Six Sigma / DMAIC-based decision framework | Build-vs-buy decision matrix with DMAIC baseline-variation-root cause structure |
| 2 | ai use case prioritization matrix | 0.0 Trends | Cigen, Finantrix, SysArt, Horizon, BrianOnAI - many templates but none with real failure analysis or project leadership evidence | Prioritization scorecard with real project data and failure pattern analysis |
| 3 | ai proof of concept failure | 1.1 avg | CIO.com (88% IDC stat), The Register (Omdia), Computerworld, governanceai.io, Computer Weekly - good data exists but no operational failure framework | POC-to-production failure taxonomy with recovery decision tree |
| 4 | ai implementation roadmap | 0.4 avg | Gartner, Microsoft, HP, Folio3 - all generic; none from a program leader who has shipped | 6-phase roadmap template with real phase-gate criteria and evidence |
| 5 | ai operating model | 6.2 avg | Thoughtworks, AWS, AliceLabs, IBM - good frameworks but none from operator-researcher with CSM alignment | Operating model comparison matrix mapped to CSM domains |
| 6 | ai governance framework | 63.3 avg (high) | IMDA Singapore, NIST, ISO 42001, OECD, EU AI Act - all institutional; no independent practitioner framework | CSM 2.0 governance mapping to NIST/ISO/EU AI Act (already exists - promote harder) |
| 7 | ai maturity assessment | 0.4 avg | Gartner, MIT CISR, MITRE, OWASP, Thoughtworks - all institutional; none with Six Sigma measurement rigor | Maturity scorecard with statistical baseline and variation analysis |
| 8 | ai strategy framework | 3.4 avg | McKinsey, BCG, Gartner references in autocomplete; no independent operator framework | Strategy framework with decision gates and evidence thresholds |
| 9 | ai vendor evaluation checklist | 8.5 avg | APQC, InitializeAI, VerityAI, Layer3Labs - many checklists but none with security/governance depth + CSM mapping | Vendor evaluation scorecard with CSM compliance mapping |
| 10 | ai opportunity assessment framework | 1.2 avg | Auditic (tool), thinkCircle, Fraction, Metacto, SUPALABS - good content but no statistical reasoning approach | Opportunity scoring model with baseline-success threshold-measurement structure |
| 11 | ai readiness assessment framework | 11.2 avg | UNESCO, ScienceDirect, G20, MITRE, UNDP - all national/institutional; no enterprise operator framework | Enterprise readiness assessment with DMAIC measurement structure |
| 12 | ai procurement | 40.9 avg | No dedicated authoritative content found in SERP; mostly job listings and software | AI procurement decision framework with vendor risk taxonomy |
| 13 | ai transformation consulting | N/A (seed) | Mix of job listings and certification programs; no independent operator | Transformation playbook with phase-gate evidence requirements |
| 14 | ai process automation | 11.8 avg | Mostly courses, jobs, tools - no advisory/strategic content | Process automation decision framework with workflow assessment |
| 15 | ai workflow analysis | 26.5 (seed) | Very few dedicated pages; autocomplete shows "4 stages of ai workflow" | Workflow analysis methodology with real process mapping examples |

---

## 5. TOP 10 TECHNICAL AUTHORITY TERMS

| Rank | Keyword | Trends Signal | SERP Observation | Subodh Differentiation |
|---|---|---|---|---|
| 1 | ai agent security | 10.8 avg, -20% | OWASP Cheat Sheet, Springer paper, NZ NCSC, arXiv surveys - strong academic/standards content but no operator-practitioner | HAIEC agent permission model + CSM CODE-SECURITY mapping |
| 2 | rag security | 2.4 avg | OWASP RAG Cheat Sheet, arXiv, AWS, CSO Online, CurrentStack - good technical content but no governance-mapped operational blueprint | Secure RAG architecture with CSM UX-EXPLAIN and tenant isolation |
| 3 | mcp security | 7.5 avg | OWASP MCP Cheat Sheet, WorkOS, Microsoft Security Blog, GitHub - strong content, rapidly evolving | MCP security checklist with CSM CODE-TRACE mapping |
| 4 | multi-tenant rag | 0.0 Trends | AWS, Microsoft Azure, Particula, Multigrid - good architecture content but no governance overlay | Multi-tenant RAG isolation patterns with CSM ENT-DATA mapping |
| 5 | ai drift detection | 7.4 (seed) | Honeycomb, Collibra, W&B, AWS, Omnithium - good monitoring content but no governance accountability model | Drift detection with CSM EF5-OVERSIGHT and measurement thresholds |
| 6 | ai evaluation framework | 47.8 (seed) | Multivon, DeepEval, OpenAI Evals, AWS Bedrock, ASSERT - all tool/framework sites; no independent evaluator | llmverify integration with CSM EF3-RISK evaluation gates |
| 7 | ai monitoring | 49.2 avg | High interest but dominated by employee monitoring and car monitoring; production AI monitoring is underserved | Production AI monitoring with CSM EF5-OVERSIGHT mapping |
| 8 | ai testing | 54.3 avg | High interest but dominated by software testing jobs/courses; AI system testing is underserved | AI system testing with CSM PRJ-TESTING and Six Sigma measurement |
| 9 | ai verification | 31.3 avg | Dominated by character AI verification and photo verification; AI system verification is underserved | llmverify + CSM UX-EXPLAIN verification framework |
| 10 | production ai architecture | 2.5 avg | Low volume but highly specialist; autocomplete shows "9 layer production ai architecture" | Production AI architecture with CSM four-domain mapping |

---

## 6. TOP LOCAL DALLAS/DFW TERMS

| Keyword | Trends Signal | Top DMA | SERP Observation | Recommended URL |
|---|---|---|---|---|
| dallas ai consultant | 2.5 avg, NEW | Dallas-Ft. Worth TX (44) | 6 local competitors: dallasaiconsultant.com, Direct AI Solutions, Preston McCauley, Erin Moore, JEH Consulting, Dallas AI Company | /local-ai-review (existing) |
| dallas ai consulting | (autocomplete) | Dallas-Ft. Worth TX | Same SERP as above | /local-ai-review |
| ai consultant dallas tx | (autocomplete, empty) | N/A | No autocomplete suggestions - very low search volume | /local-ai-review |
| dfw ai consulting | (autocomplete, empty) | N/A | No autocomplete suggestions - very low search volume | /local-ai-review |
| texas ai consulting | (autocomplete) | N/A | Only "ai companies in texas" suggestion | /local-ai-review |
| ai consultant near me | 16.0 avg, NEW | Fresno CA, Cheyenne WY, Tucson AZ, Indianapolis | National local-intent term; job boards and directories | /local-ai-review |
| ai consultant for small business | 1.8 avg, NEW | San Antonio TX (50), LA (16), Philadelphia (14) | Mix of consultants and "near me" variants | /ai-advisor or /local-ai-review |
| ai advisor for business (Austin signal) | 27.8 avg | Austin TX (100) | Strong Austin TX signal in regional data | /ai-advisor |

**Key local finding:** Dallas-Ft. Worth DMA shows 44 for "dallas ai consultant" - the highest regional signal. Austin TX shows 100 for "ai advisor for business." San Antonio TX leads for "ai consultant for small business." Texas is a strong regional market for AI advisory.

---

## 7. EMERGING / RISING TERMS

These terms showed NEW or UP trend signals in Google Trends (appeared or grew during the 12-month tracking period):

| Keyword | Signal | Why It Matters |
|---|---|---|
| ai automation consultant | NEW, avg 28.2 | Highest-volume emerging term; weak SERP (Tai Lopez, jobs, Reddit) |
| ai workflow assessment | NEW, avg 26.5 | Second-highest emerging term; almost no dedicated SERP content |
| ai consultant near me | NEW, avg 16.0 | Local intent emerging; directories and job boards dominate |
| ai strategy advisor | NEW, avg 14.3 | Solo practitioners dominate; no major authority |
| executive ai advisor | NEW, avg 8.8 | Same SERP as strategy advisor; solo practitioners |
| ai vendor evaluation | NEW, avg 8.5 | Checklist sites dominate; no independent advisor |
| fractional ai advisor | NEW, avg 0.3 | Very low but emerging; small specialist sites only |
| dallas ai consultant | NEW, avg 2.5 | Local emerging; 6 competitors in DFW |
| ai consultant for small business | NEW, avg 1.8 | Emerging SMB intent |

**Rising related queries (breakout signals from Google Trends):**
- "microsoft ai transformation leader" (+23000%) - certification-driven interest
- "microsoft certified ai transformation leader" (+4050%) - certification demand
- "amazon ai strategy shift" (+4500%) - news-driven interest in AI strategy
- "owasp ai testing guide" (+350%) - standards-driven interest in AI testing
- "ai agents" as related to "ai automation" (+110%) - agent interest bleeding into automation

**Implication:** The market is shifting from generic AI terms (which are all declining) toward specific role-based and function-based terms (advisor, consultant, assessment, evaluation). This aligns perfectly with Subodh's positioning.

---

## 8. TERMS WE SHOULD NOT TARGET

| Keyword | Reason |
|---|---|
| ai advisor login | Navigational intent for a specific product, not advisory |
| ai advisory council canada | Geographic mismatch (Canada) |
| ai advisory council ireland | Geographic mismatch (Ireland) |
| ai advisory pilot | Ambiguous - could mean MSFS flight simulator or advisory pilot program |
| ai drift car / ai drift assetto corsa | Gaming intent, not AI systems |
| ai monitoring employees / ai monitoring in cars | Employee surveillance and automotive, not production AI |
| ai testing jobs / ai testing certification / ai testing interview questions | Job-seeker intent, not buyer intent |
| ai evaluation jobs / ai evaluation specialist jobs | Job-seeker intent |
| ai verification photo / ai verification video / ai verification app | Identity verification, not AI system verification |
| ai transformation leader certification | Certification-seeking, not advisory (unless Subodh offers certification) |
| ai transformation summit 2026 | Event intent |
| ai consultant salary | Job-seeker intent |
| ai consultant certification | Certification intent |
| ai governance certification / ai governance professional (aigp) | Certification intent (unless Subodh offers training) |
| ai procurement tools / ai procurement software / ai procurement platform | Software buying intent, not advisory |
| ai automation agency / ai automation course / ai automation jobs | Agency building or job seeking, not enterprise advisory |
| ai process automation tools / ai process automation engineer | Tool/engineer intent |
| character ai verification | Consumer product intent |
| sovereign ai proof of concept | Government policy intent |
| real advisors ai for business | Specific brand (Real Advisors AI) |
| ai financial advisor for business | Financial advisory, not AI advisory |
| ai readiness librarian | Library-specific, not enterprise |

---

## 9. KEYWORD-TO-URL OWNERSHIP MAP

Validated against actual site structure (`app/` directory listing).

| Keyword / Cluster | Recommended URL | URL Status | Current Owner | Action |
|---|---|---|---|---|
| ai advisor | /ai-advisor | EXISTS | /ai-advisor | KEEP - primary money page |
| ai advisor for business | /ai-advisor | EXISTS | /ai-advisor | KEEP - consolidate here |
| ai advisor for small business | /ai-advisor | EXISTS | /ai-advisor | KEEP - add SMB section |
| ai advisory services | /ai-advisor | EXISTS | /ai-advisor | KEEP - add services section |
| ai advisory | /ai-advisor | EXISTS | /ai-advisor | KEEP |
| fractional ai advisor | /advisory | EXISTS | /advisory | KEEP - primary fractional page |
| fractional ai consultant | /advisory | EXISTS | /advisory | KEEP |
| executive ai advisor | /advisory | EXISTS | /advisory | KEEP - add executive section |
| ai strategy advisor | /advisory | EXISTS | /advisory | KEEP - add strategy advisor section |
| ai strategy consulting | /advisory | EXISTS | /advisory | KEEP |
| ai opportunity assessment | /ai-automation | EXISTS | /ai-automation | KEEP - primary assessment page |
| ai workflow assessment | /ai-automation | EXISTS | /ai-automation | KEEP - add workflow assessment section |
| ai readiness assessment | /ai-automation | EXISTS | /ai-automation | KEEP - add readiness assessment section OR new /ai-readiness-assessment |
| ai use case prioritization | /ai-automation | EXISTS | /ai-automation | KEEP - add prioritization section |
| ai use case discovery | /ai-automation | EXISTS | /ai-automation | KEEP |
| ai automation consultant | /ai-advisor OR /ai-automation | EXISTS | Split | CLARIFY - currently ambiguous; recommend /ai-advisor for consultant intent, /ai-automation for assessment intent |
| ai automation blueprint | /ai-automation | EXISTS | /ai-automation | KEEP |
| ai vendor evaluation | /ai-vendor-due-diligence-checklist | EXISTS | /ai-vendor-due-diligence-checklist | KEEP - strengthen with evaluation framework |
| ai vendor evaluation checklist | /ai-vendor-due-diligence-checklist | EXISTS | /ai-vendor-due-diligence-checklist | KEEP |
| ai vendor selection | /ai-vendor-due-diligence-checklist | EXISTS | /ai-vendor-due-diligence-checklist | KEEP |
| ai build vs buy | NEW ARTICLE | NEEDED | None | CREATE authority article |
| ai build vs buy framework | NEW ARTICLE | NEEDED | None | CREATE authority article |
| ai proof of concept | NEW ARTICLE | NEEDED | None | CREATE authority article on POC-to-production |
| ai proof of concept failure | NEW ARTICLE | NEEDED | None | CREATE failure analysis article |
| ai implementation roadmap | NEW ARTICLE | NEEDED | None | CREATE roadmap article |
| ai operating model | NEW ARTICLE | NEEDED | None | CREATE operating model article |
| ai maturity assessment | NEW ARTICLE | NEEDED | None | CREATE maturity assessment article |
| ai strategy framework | NEW ARTICLE | NEEDED | None | CREATE strategy framework article |
| ai governance framework | /cognitive-systems-management | EXISTS | /cognitive-systems-management | KEEP - CSM is the governance framework |
| ai governance | /how-to-secure-and-govern-ai | EXISTS | /how-to-secure-and-govern-ai | KEEP |
| ai agent security | /ai-security-tools OR NEW ARTICLE | EXISTS | /ai-security-tools | STRENGTHEN - add agent security section |
| rag security | /secure-enterprise-rag-architecture | EXISTS | /secure-enterprise-rag-architecture | KEEP - strengthen |
| multi-tenant rag | /secure-enterprise-rag-architecture | EXISTS | /secure-enterprise-rag-architecture | KEEP - add multi-tenant section |
| mcp security | /ai-security-tools OR NEW ARTICLE | EXISTS | /ai-security-tools | STRENGTHEN - add MCP security section |
| ai drift detection | NEW ARTICLE | NEEDED | None | CREATE drift detection article |
| ai evaluation framework | /products/llmverify OR NEW ARTICLE | EXISTS | /products/llmverify | STRENGTHEN - add evaluation framework article |
| ai monitoring | NEW ARTICLE | NEEDED | None | CREATE production monitoring article |
| ai testing | NEW ARTICLE | NEEDED | None | CREATE AI system testing article |
| ai verification | /products/llmverify | EXISTS | /products/llmverify | STRENGTHEN |
| production ai architecture | NEW ARTICLE | NEEDED | None | CREATE architecture article |
| dallas ai consultant | /local-ai-review | EXISTS | /local-ai-review | KEEP - strengthen with Dallas-specific content |
| dallas ai consulting | /local-ai-review | EXISTS | /local-ai-review | KEEP |
| ai consultant near me | /local-ai-review | EXISTS | /local-ai-review | KEEP |
| ai consultant for small business | /ai-advisor OR /local-ai-review | EXISTS | Split | CLARIFY - recommend /ai-advisor with local signals |
| ai procurement | NEW ARTICLE | NEEDED | None | CREATE procurement article |
| ai transformation | /advisory OR NEW ARTICLE | EXISTS | /advisory | KEEP - add transformation section |
| ai process automation | /ai-automation | EXISTS | /ai-automation | KEEP |

### Cannibalization Risks Identified

1. **"ai automation consultant" is ambiguous** - could map to /ai-advisor (consultant intent) or /ai-automation (automation intent). Recommend: /ai-advisor owns "consultant" terms, /ai-automation owns "assessment/blueprint" terms.

2. **"ai consultant for small business" splits between /ai-advisor and /local-ai-review** - recommend /ai-advisor owns this with local schema markup, /local-ai-review focuses on "dallas" and "DFW" geo-modified terms only.

3. **"ai governance" has two existing pages** - /cognitive-systems-management (CSM framework) and /how-to-secure-and-govern-ai (governance guide). Recommend: /cognitive-systems-management owns "cognitive systems management" and "CSM", /how-to-secure-and-govern-ai owns "ai governance" and "ai governance framework".

4. **"ai agent security" and "mcp security" both could map to /ai-security-tools** - recommend /ai-security-tools remains the hub, with dedicated articles for each that link back.

---

## 10. CONTENT INDEX

Each proposed piece includes: target keyword, real Trends data, SERP weakness, unique Subodh angle, original artifact needed, money page supported, and conversion CTA.

### 10.1 Executive Decision Briefs

| # | Title | Target Keyword | Trends Avg | SERP Weakness | Subodh Angle | Original Artifact | Money Page | CTA |
|---|---|---|---|---|---|---|---|---|
| 1 | The AI Readiness Assessment That Actually Predicts Production Success | ai readiness assessment | 11.2 | UNESCO/MITRE/Gartner are national/institutional; no enterprise operator framework | Six Sigma DMAIC applied to readiness: baseline, variation, root cause, success threshold | Readiness scorecard with statistical baseline structure (downloadable) | /ai-automation | "If you need an independent readiness assessment before your board approves budget, schedule a strategic evaluation." |
| 2 | The AI Vendor Evaluation Scorecard: 47 Questions That Prevent Procurement Disasters | ai vendor evaluation | 8.5 (NEW) | Checklist sites exist but none with security/governance depth + CSM mapping | CSM CODE-SECURITY and ENT-DATA mapped to vendor evaluation criteria | Vendor evaluation scorecard with CSM compliance mapping (interactive) | /ai-vendor-due-diligence-checklist | "If you are evaluating AI vendors and need an independent technical review before you sign, schedule a vendor evaluation session." |
| 3 | AI Build vs Buy: A Decision Framework That Survives Production | ai build vs buy | 1.8 | Good content exists (TechTarget, COMPEL) but no Six Sigma / DMAIC-based framework | DMAIC applied to build-vs-buy: define (what to build), measure (cost curves), analyze (variation), improve (layer strategy), control (exit cost) | Build-vs-buy decision matrix with layer-by-layer analysis and exit cost scoring | /advisory | "If you are facing a build-vs-buy decision and need an independent architect's review, schedule a strategic evaluation." |
| 4 | The AI Opportunity Assessment: From Idea Inventory to Fundable Workflow | ai opportunity assessment | 1.2 | Auditic (tool), Fraction (blog), Metacto, SUPALABS - good but no statistical reasoning approach | Six Sigma baseline-success threshold-measurement structure applied to opportunity scoring | Opportunity scoring model with baseline, variation, and success threshold (template) | /ai-automation | "If you need a structured opportunity assessment before committing budget, schedule a discovery engagement." |
| 5 | The AI Use Case Prioritization Matrix: Why Most Companies Pick the Wrong First Project | ai use case prioritization | 0.0 | Many templates exist (Cigen, Finantrix, SysArt) but none with real failure analysis | Project/program leadership evidence: what actually happens when you pick the wrong first project | Prioritization matrix with failure pattern analysis from real deployments (scorecard) | /ai-automation | "If you have 20 AI ideas and need help picking the right first project, schedule a prioritization workshop." |

### 10.2 Production Failure Files

| # | Title | Target Keyword | Trends Avg | SERP Weakness | Subodh Angle | Original Artifact | Money Page | CTA |
|---|---|---|---|---|---|---|---|---|
| 6 | Why 88% of AI POCs Never Reach Production (And the 5 Gates That Fix It) | ai proof of concept failure | 1.1 | CIO.com (IDC 88% stat), Omdia, governanceai.io - good data but no operational failure framework | Program leadership evidence: phase-gate criteria that actually predict production success | POC-to-production gate checklist with evidence thresholds (template) | /advisory | "If your POC worked but production feels impossible, schedule a POC-to-production review." |
| 7 | The AI Implementation Roadmap: 6 Phases With Real Gate Criteria | ai implementation roadmap | 0.4 | Gartner, Microsoft, HP, Folio3 - all generic; none from a program leader who has shipped | HP Sr. Program Manager experience translated into phase-gate evidence requirements | 6-phase roadmap template with gate criteria and evidence requirements (downloadable) | /advisory | "If you need a roadmap your board will fund and your team can execute, schedule a roadmap engagement." |

### 10.3 Research Notes

| # | Title | Target Keyword | Trends Avg | SERP Weakness | Subodh Angle | Original Artifact | Money Page | CTA |
|---|---|---|---|---|---|---|---|---|
| 8 | The AI Operating Model: Centralized, Federated, or Hybrid (With Evidence) | ai operating model | 6.2 | Thoughtworks, AWS, AliceLabs, IBM - good frameworks but none with CSM alignment | CSM four-domain mapping applied to operating model selection | Operating model comparison matrix mapped to CSM domains (diagram) | /advisory | "If you are designing your AI operating model and need an independent architect's perspective, schedule a design session." |
| 9 | AI Maturity Assessment: What the Models Miss About Measurement | ai maturity assessment | 0.4 | Gartner, MIT CISR, MITRE, OWASP - all institutional; none with Six Sigma measurement rigor | Six Sigma statistical baseline and variation analysis applied to maturity measurement | Maturity scorecard with statistical measurement structure (template) | /ai-automation | "If you need a maturity assessment that produces measurable evidence, not a score, schedule an assessment." |
| 10 | AI Procurement: The Decision Framework Nobody Published | ai procurement | 40.9 | No dedicated authoritative content; mostly job listings and software | Enterprise operator perspective on AI procurement with risk taxonomy | AI procurement decision framework with vendor risk taxonomy (matrix) | /ai-vendor-due-diligence-checklist | "If you are procuring AI systems and need independent procurement guidance, schedule a procurement review." |

### 10.4 Technical Authority Articles

| # | Title | Target Keyword | Trends Avg | SERP Weakness | Subodh Angle | Original Artifact | Money Page | CTA |
|---|---|---|---|---|---|---|---|---|
| 11 | AI Agent Security: The Permission Model That Prevents Privilege Compromise | ai agent security | 10.8 | OWASP, Springer, NZ NCSC - strong academic but no operator-practitioner | HAIEC agent permission model + CSM CODE-SECURITY mapping | Agent permission matrix with CSM mapping (diagram + checklist) | /solutions/haiec | "If you are deploying AI agents and need a security architecture review, schedule a security assessment." |
| 12 | RAG Security: The Operational Blueprint (Not the Summary) | rag security | 2.4 | OWASP, arXiv, AWS, CSO Online - good technical but no governance-mapped operational blueprint | Secure RAG architecture with CSM UX-EXPLAIN and tenant isolation | RAG security control matrix mapped to CSM domains (checklist) | /secure-enterprise-rag-architecture | "If you are building RAG pipelines and need a security review, schedule a RAG security assessment." |
| 13 | MCP Security: The 2026 Checklist (Spec Version 2025-11-25) | mcp security | 7.5 | OWASP, WorkOS, Microsoft - strong content, rapidly evolving | MCP security checklist with CSM CODE-TRACE mapping | MCP security checklist with spec-version-specific controls (interactive) | /ai-security-tools | "If you are deploying MCP servers and need a security review, schedule an MCP security assessment." |
| 14 | Multi-Tenant RAG: Silo, Pool, or Bridge (With Isolation Proof) | multi-tenant rag | 0.0 | AWS, Azure, Particula, Multigrid - good architecture but no governance overlay | Multi-tenant RAG isolation patterns with CSM ENT-DATA mapping | Isolation pattern decision matrix with cross-tenant probe test suite (code) | /secure-enterprise-rag-architecture | "If you are building multi-tenant RAG and need isolation proof, schedule an architecture review." |
| 15 | AI Drift Detection: The Monitoring Architecture That Catches Silent Failure | ai drift detection | 7.4 | Honeycomb, Collibra, W&B, AWS - good monitoring but no governance accountability | Drift detection with CSM EF5-OVERSIGHT and measurement thresholds | Drift detection threshold matrix with CSM oversight mapping (diagram) | /advisory | "If you have AI in production and no drift detection, schedule a monitoring assessment." |
| 16 | AI Evaluation Frameworks Compared: What Actually Works in Production | ai evaluation framework | 47.8 | Multivon, DeepEval, OpenAI Evals, AWS Bedrock, ASSERT - all tool sites; no independent evaluator | llmverify integration with CSM EF3-RISK evaluation gates | Evaluation framework comparison matrix with CSM mapping (benchmark) | /products/llmverify | "If you need independent AI evaluation, explore llmverify." |
| 17 | Production AI Architecture: The 9-Layer Reference Model | production ai architecture | 2.5 | Low volume but specialist; autocomplete shows "9 layer production ai architecture" | Production AI architecture with CSM four-domain mapping | 9-layer architecture diagram with CSM domain overlay (diagram) | /advisory | "If you are designing production AI architecture, schedule an architecture review." |

### 10.5 Local SEO Content

| # | Title | Target Keyword | Trends Avg | SERP Weakness | Subodh Angle | Original Artifact | Money Page | CTA |
|---|---|---|---|---|---|---|---|---|
| 18 | Dallas AI Advisor: Why DFW Companies Need Independent AI Strategy (Not a Vendor Pitch) | dallas ai consultant | 2.5 (NEW) | 6 local competitors but none with enterprise/operator depth | Fortune 50 AI Strategy CTL + HP Sr. Program Manager + DFW local | DFW AI landscape analysis with enterprise vs. SMB decision framework (matrix) | /local-ai-review | "If you are a DFW company evaluating AI strategy, schedule a local AI review." |

---

## 11. ORIGINAL-ASSET PLAN

Each proposed content piece requires at least one original artifact per the editorial manifesto's originality gate.

| Asset Type | Pieces | Description |
|---|---|---|
| Decision Matrix | 5 | Build-vs-buy, vendor evaluation, use case prioritization, operating model, isolation pattern |
| Scorecard | 4 | Readiness assessment, maturity assessment, vendor evaluation, opportunity scoring |
| Checklist | 3 | POC-to-production gates, MCP security, RAG security controls |
| Framework Diagram | 3 | 9-layer production architecture, drift detection threshold matrix, CSM domain overlay |
| Template | 3 | Implementation roadmap, procurement framework, agent permission matrix |
| Code/Tool | 2 | Cross-tenant probe test suite, llmverify evaluation benchmark |
| Failure Analysis | 1 | POC failure taxonomy with recovery decision tree |
| Benchmark | 1 | AI evaluation framework comparison |

**Total: 22 original artifacts across 18 content pieces.**

---

## 12. CONVERSION COPY THEMES

Derived from real SERP language, autocomplete suggestions, and the language people use when searching for AI advisory.

### 12.1 High-Intent Question Themes (from SERP observation)

| Theme | Real Search Language | Subodh Response |
|---|---|---|
| "What am I missing?" | "what am i missing ai", "ai blind spots" | "The question is not what AI can do. It is what your current process is hiding from you. An independent assessment surfaces what vendors will not tell you." |
| "Where should we use AI?" | "where to use ai", "ai use case discovery", "ai opportunity mapping" | "Stop inventorying 50 use cases. Find the one workflow where AI changes the economics, and prove it before you scale." |
| "Is this worth doing?" | "is ai profitable", "ai roi calculation", "ai proof of concept failure" | "88% of AI POCs never reach production. The question is not whether AI is worth doing. It is whether your organization can survive the path from POC to production." |
| "What should we automate?" | "ai workflow assessment", "ai process automation", "ai automation blueprint" | "Before you automate, assess. A workflow assessment identifies which processes deserve AI and which will fail because the underlying process is broken." |
| "Which AI vendor should we choose?" | "ai vendor evaluation", "ai vendor selection", "ai vendor assessment" | "A vendor demo is not an evaluation. 47 questions across security, governance, data, and exit strategy prevent the procurement decisions that become expensive problems." |
| "Should we build or buy?" | "ai build vs buy", "build vs buy ai solutions", "build vs buy ai tools" | "Build vs buy is not a binary. It is a layering decision. Buy the commodity layer, build the differentiated layer, and model the exit cost before you commit." |
| "How do we move from POC to production?" | "ai poc to production", "ai proof of concept failure", "ai implementation roadmap" | "The POC is the easy part. Production is where 88% of projects die. You need phase gates, evidence thresholds, and an operating model before you commit." |
| "Who should own AI?" | "ai operating model", "ai governance committee", "ai center of excellence" | "AI ownership is an operating model decision, not an org chart decision. Centralized, federated, or hybrid - the model determines whether AI compounds or stalls." |
| "How do we know if it worked?" | "ai evaluation framework", "ai monitoring", "ai drift detection", "ai verification" | "If you cannot measure it, you cannot improve it. An evaluation framework with baseline, variation, and success thresholds turns AI from a bet into evidence." |

### 12.2 Copy Themes for Landing Pages

**For /ai-advisor:**
- "AI advisor for business decisions, not AI demos."
- "From possibility to decision. From decision to production."
- "Independent AI advisory. No vendor relationships. No software to sell."

**For /advisory:**
- "Fractional AI advisory for executives who need senior judgment, not a full-time hire."
- "Ongoing AI counsel embedded in your leadership cadence."
- "The 90/180/365 AI plan, reviewed every cycle."

**For /ai-automation:**
- "AI opportunity assessment before you commit budget."
- "Structured workflow assessment that identifies where AI changes the economics."
- "Vendor-neutral. Evidence-backed. Production-oriented."

**For /local-ai-review:**
- "Dallas/DFW AI advisor with Fortune 50 strategy and enterprise program leadership."
- "Local presence. Enterprise depth. Independent perspective."

---

## 13. BRAND / EXECUTIVE POSITIONING IMPLICATIONS

### 13.1 What the Data Confirms

1. **Generic AI terms are all declining.** Every high-volume term (ai governance, ai transformation, ai automation, ai monitoring, ai testing) shows a downward trend over 12 months. The market is moving past generic AI curiosity.

2. **Role-based and function-based terms are emerging.** "ai automation consultant", "ai workflow assessment", "ai strategy advisor", "executive ai advisor", "ai vendor evaluation", "fractional ai advisor" all appeared as NEW during the tracking period. This is the market asking for specific help, not general information.

3. **The SERP is wide open for independent practitioners.** For "fractional ai advisor", "ai strategy advisor", "executive ai advisor", and "ai advisor for business" - the top results are solo practitioners with small sites (Mack Burnett, Abe Nadimi, Brian Gibbs, Liat Ben-Zur, Ronnie Barnard, Paul Shirer). No major authority dominates. Subodh's Fortune 50 + HP + HAIEC + CSM depth is materially stronger than every current SERP competitor.

4. **Assessment and evaluation terms have weak SERPs.** "ai readiness assessment" is dominated by UNESCO and national frameworks. "ai vendor evaluation" is dominated by checklist sites. "ai opportunity assessment" has a mix of tools and blogs. None have an enterprise operator with a measurement framework (Six Sigma/DMAIC).

5. **Technical authority terms have strong academic content but no operator-practitioner.** OWASP cheat sheets, arXiv papers, and Microsoft/Amazon blogs dominate. The gap is: who translates these into operational blueprints with governance mapping? That is exactly CSM's purpose.

6. **Local DFW is competitive but shallow.** Six competitors exist but none have enterprise depth. Subodh's positioning (Fortune 50 AI Strategy CTL, HP Sr. Program Manager) is materially differentiated from "Chelsea at dallasaiconsultant.com" or "Erin Moore, Fractional CAIO."

7. **Certification interest is rising.** "microsoft ai transformation leader" (+23000%) and "microsoft certified ai transformation leader" (+4050%) are breakout queries. This signals market demand for structured AI leadership credentials. Subodh does not need to offer certifications, but content that helps people evaluate certifications (or explains why an advisor is better than a certification) captures this intent.

### 13.2 Positioning Adjustments Recommended

1. **Lean harder into "assessment" and "evaluation" language.** The market is asking for structured evaluations (readiness, vendor, opportunity, workflow). Subodh's current pages use some of this language but could own it more explicitly.

2. **The "fractional" positioning is validated but underserved.** The SERP for "fractional ai advisor" has 6+ small competitors but no one with Subodh's depth. This is a winnable SERP.

3. **CSM should be positioned as the missing "operating model" framework.** The ai operating model SERP shows Thoughtworks, AWS, and AliceLabs all describing the problem but not providing a methodology. CSM is exactly that methodology.

4. **Technical authority content should explicitly map to CSM.** Every technical article (RAG security, MCP security, agent security, drift detection) should include a CSM domain mapping. This is the original artifact that no competitor can replicate.

5. **Dallas/DFW content should lead with enterprise depth, not local proximity.** The local competitors all lead with "Dallas-based" and "local." Subodh should lead with "Fortune 50 AI Strategy CTL, HP Sr. Program Manager, DFW-based" - depth first, local second.

---

## 14. RECOMMENDED PUBLISHING ORDER

Prioritized by: SERP winnability x buyer intent x brand fit x data signal.

### Phase 1: Money Page Strengthening (Weeks 1-4)

| Priority | Action | Target Keyword | Why First |
|---|---|---|---|
| 1 | Strengthen /ai-automation with readiness assessment section | ai readiness assessment | Existing page, real Trends signal (11.2), weak SERP, high buyer intent |
| 2 | Strengthen /advisory with fractional + executive sections | fractional ai advisor, executive ai advisor | Existing page, NEW/emerging Trends, weak SERP (solo practitioners only), high buyer intent |
| 3 | Strengthen /local-ai-review with Dallas-specific content | dallas ai consultant | Existing page, NEW Trends, Dallas DMA=44, competitive but shallow |
| 4 | Strengthen /ai-vendor-due-diligence-checklist with evaluation framework | ai vendor evaluation | Existing page, NEW Trends, checklist sites dominate but no advisor |

### Phase 2: Authority Content - Highest Winna-bility (Weeks 5-12)

| Priority | Action | Target Keyword | Why |
|---|---|---|---|
| 5 | Article: AI Build vs Buy Decision Framework | ai build vs buy | Near-zero Trends but HIGH buyer intent and HIGH SERP winna-bility; no Six Sigma framework exists |
| 6 | Article: AI Use Case Prioritization Matrix | ai use case prioritization | No Trends signal but HIGH buyer intent; many templates but none with failure analysis |
| 7 | Article: Why 88% of AI POCs Never Reach Production | ai proof of concept failure | Real IDC/Omdia data exists; no operational failure framework; high CTA potential |
| 8 | Article: AI Implementation Roadmap with Gate Criteria | ai implementation roadmap | Gartner/Microsoft are generic; Subodh has HP program leadership evidence |
| 9 | Article: AI Opportunity Assessment Framework | ai opportunity assessment | Existing tools are simplistic; Six Sigma approach is differentiating |
| 10 | Article: AI Operating Model with CSM Mapping | ai operating model | Thoughtworks/AWS describe problem; CSM is the methodology |

### Phase 3: Technical Authority (Weeks 13-20)

| Priority | Action | Target Keyword | Why |
|---|---|---|---|
| 11 | Article: AI Agent Security Permission Model | ai agent security | Trends 10.8, OWASP is academic; HAIEC + CSM is operator-practitioner |
| 12 | Article: RAG Security Operational Blueprint | rag security | Trends 2.4; OWASP is technical; CSM governance overlay is unique |
| 13 | Article: MCP Security 2026 Checklist | mcp security | Trends 7.5; spec is evolving; CSM CODE-TRACE mapping is unique |
| 14 | Article: AI Drift Detection Monitoring Architecture | ai drift detection | Trends 7.4; monitoring sites are tool-focused; CSM EF5-OVERSIGHT is governance-focused |
| 15 | Article: Multi-Tenant RAG Isolation Patterns | multi-tenant rag | No Trends but HIGH specialist intent; CSM ENT-DATA mapping is unique |
| 16 | Article: AI Evaluation Frameworks Compared | ai evaluation framework | Trends 47.8 (high); llmverify is the product; CSM EF3-RISK is the framework |

### Phase 4: Supporting Authority (Weeks 21-28)

| Priority | Action | Target Keyword | Why |
|---|---|---|---|
| 17 | Article: AI Maturity Assessment with Measurement Rigor | ai maturity assessment | Trends 0.4 but HIGH info gain; Six Sigma measurement is differentiating |
| 18 | Article: AI Procurement Decision Framework | ai procurement | Trends 40.9 (high); no authoritative content exists |
| 19 | Article: Production AI Architecture Reference Model | production ai architecture | Trends 2.5; specialist audience; CSM four-domain mapping |
| 20 | Article: AI Strategy Framework for Business Leaders | ai strategy framework | Trends 3.4; McKinsey/BCG references but no independent operator framework |

---

## 15. DATA GAPS / LIMITATIONS

| Gap | Impact | Mitigation |
|---|---|---|
| **Keywords Everywhere: 0 credits** | No absolute US monthly search volume, CPC, advertiser competition, or keyword difficulty for any term | Google Trends relative interest used as proxy for demand; SERP analysis used as proxy for organic difficulty. To get absolute metrics, add KE credits and re-run get_keyword_data for all 40+ terms. |
| **Google Trends is relative, not absolute** | Values are 0-100 within each 5-keyword batch; cross-batch comparison is approximate | Within-batch comparisons are valid. Cross-batch ranking is directional, not precise. KE absolute volume would resolve this. |
| **Google Trends 12-month window shows broad decline** | Most terms show downward trends; this may reflect seasonal patterns or a genuine market shift | The decline is consistent across terms, suggesting a market shift from generic AI curiosity to specific role/function seeking. The NEW/emerging terms support this interpretation. |
| **SERP analysis via web_search, not direct Google scraping** | Results may differ from what a user sees in an actual Google SERP (personalization, geography, time) | web_search provides real Google results but may be generalized. For precise SERP tracking, use a rank tracking tool. |
| **No competitor domain keyword data** | Cannot see exactly which keywords competitors rank for and their estimated traffic | KE get_domain_keywords would provide this (2 credits per keyword returned). With credits, run for: mackburnett.com, fractionalaiadvisors.com, durkee.ai, dallasaiconsultant.com, directaisolutions.com |
| **No backlink analysis** | Cannot assess competitor authority vs. Subodh's site authority | KE get_domain_backlinks would provide this. With credits, run for subodhkc.com and top competitors. |
| **Autocomplete has no volume data** | Suggestions are ordered by relevance but do not include search volume | Autocomplete ordering is a weak proxy for relative popularity. KE volume data would replace this. |
| **"ai use case prioritization" and "multi-tenant rag" show 0.0 Trends** | May indicate very low search volume OR that Trends does not track these terms | These terms appear in autocomplete and SERP, confirming they exist. Trends may not track very low-volume terms. KE would provide exact volume. |
| **No CPC data** | Cannot assess commercial intent via advertiser spending | SERP analysis (commercial vs. informational pages) used as proxy. KE CPC data would quantify this. |

### Remaining Research Required

1. **Add Keywords Everywhere credits** and re-run `get_keyword_data` for all 40 tracked keywords + top 50 autocomplete suggestions to get absolute US monthly volume, CPC, and advertiser competition.

2. **Run KE `get_domain_keywords`** for top competitors (mackburnett.com, fractionalaiadvisors.com, durkee.ai, dallasaiconsultant.com, directaisolutions.com, sophizo.net, aai.agency) to see what they rank for.

3. **Run KE `get_domain_traffic_metrics`** for subodhkc.com and competitors to benchmark relative authority.

4. **Run KE `get_related_keywords`** and `get_pasf_keywords`** for top 10 seed terms to expand the universe further.

5. **Set up rank tracking** for the 25 priority keywords to monitor SERP position changes over time.

6. **Verify SERP observations** with a direct SERP scraping tool (e.g., Semrush SERP Checker, Ahrefs SERP Checker) for the top 10 money-page terms.

---

## RAW DATA ARTIFACTS

The following raw data files have been saved as durable artifacts:

1. `docs/seo-research/raw-autocomplete-data.json` - Google Autocomplete suggestions for 57 seed terms
2. `docs/seo-research/raw-trends-data.json` - Google Trends data for 40 keywords (interest over time, related queries, regional breakdown)
3. `docs/seo-research/organic-search-opportunity-2026-08.md` - This report

---

READY FOR CONTENT/SEO IMPLEMENTATION: **YES (with caveats)**

The research is sufficient to begin Phase 1 (money page strengthening) and Phase 2 (authority content) immediately. The opportunity model, keyword-to-URL ownership map, content index, and publishing order are all actionable now.

**However, the following research should be completed before scaling content production:**
1. Add Keywords Everywhere credits to get absolute volume/CPC/competition data
2. Run competitor domain keyword analysis to validate SERP winnability assumptions
3. Set up rank tracking to measure progress

The qualitative analysis (SERP winnability, buyer intent, brand fit, information gain) is strong enough to proceed. The quantitative analysis (absolute volume, CPC, difficulty) will refine prioritization but is not required to start.
