# Risk Analysis and Remediation Plan

**Created**: July 31, 2026
**Status**: Active - reviewed after each content batch

---

## Risk 1: Existing Thin Content Still Live

**Risk Level**: HIGH
**Description**: 9 of 13 existing blog posts are under 700 words. These thin pages can drag down domain authority and signal low-quality content to search engines.

**Impact**: 
- Search engines may throttle crawl budget for thin pages
- Users bouncing from thin pages increases bounce rate metric
- Pillar pages that should receive link equity from supporting articles get nothing

**Remediation Plan**:
1. **Week 1**: Add internal links and CTAs to all 13 existing blog posts (script can be written to batch-update)
2. **Week 2-3**: Expand the 2 Priority 1 articles (under 500 words) - these are the most damaging
3. **Week 3-4**: Expand the 7 Priority 2 articles (500-700 words)
4. **Week 4**: Refresh the 2 Priority 3 articles (keyword stuffing)
5. If any article cannot be expanded to meet quality standards, add `noindex` meta tag and redirect consideration

**Owner**: Manual review and expansion required. The generate-article.mjs script can be extended with a `--expand` mode in a future iteration.

---

## Risk 2: Zero Internal Links on Existing Posts

**Risk Level**: HIGH
**Description**: All 13 existing blog posts have 0 internal links. This means no link equity flows between pages, and pillar pages receive no support from cluster articles.

**Impact**:
- Pillar canonical pages are orphaned from their supporting articles
- No topical authority signals through internal linking
- Users cannot discover related content

**Remediation Plan**:
1. Use `docs/content/internal-link-map.json` as the source of truth for link targets
2. Write a batch script (`scripts/backfill-internal-links.mjs`) that reads each blog post JSON, injects the specified internal links at the end of the content (before FAQ section), and saves
3. Run the script once to backfill all 13 posts
4. Future articles get internal links automatically from the generation prompt

**Timeline**: 1 day of development + 1 run

---

## Risk 3: Zero CTAs on Existing Posts

**Risk Level**: MEDIUM
**Description**: All 13 existing blog posts have 0 CTAs. No conversion path exists from blog content to services, products, or advisory.

**Impact**:
- Blog traffic does not convert to business outcomes
- No funnel from content to commercial pages

**Remediation Plan**:
1. Map each blog post to its appropriate CTA destination (documented in `thin-content-remediation.md`)
2. Add CTA as part of the backfill script (same script as internal links)
3. CTA format: `<p><a href="/destination" style="...">Contextual CTA text</a></p>` placed before the FAQ section

**Timeline**: Same as Risk 2 (combined in one script)

---

## Risk 4: Content Calendar Only Covers Batch 1

**Risk Level**: MEDIUM
**Description**: The content calendar in `generate-article.mjs` contains 30 articles for Batch 1 (10 days). After Batch 1 is exhausted, the script falls back to a generic topic.

**Impact**:
- After 10 days of generation, article quality may drop
- Fallback topic may not align with pillar strategy

**Remediation Plan**:
1. After Batch 1 is published (10 articles, 1 per day), evaluate performance
2. Create Batch 2 calendar (another 30 articles) based on:
   - Topics that performed well in Batch 1
   - Gaps identified in pillar coverage
   - New developments in AI governance and architecture
3. Add `CONTENT_CALENDAR_BATCH_2` to `generate-article.mjs`
4. Update `pickNextTopic()` to merge Batch 1 and Batch 2 topics

**Timeline**: Before Day 10 of Batch 1 generation

---

## Risk 5: OpenAI API Rate Limits and Token Costs

**Risk Level**: LOW
**Description**: Daily generation uses gpt-4o-mini with max_tokens=8000. If the model produces long content, costs accumulate. Rate limits could cause failures.

**Impact**:
- API failure stops article generation for the day
- Cost per article is approximately $0.02-0.05 with gpt-4o-mini

**Remediation Plan**:
1. The workflow already handles API failures with `process.exit(1)` which stops the job
2. Add retry logic to the `generateArticle()` function (2 retries with exponential backoff)
3. Monitor OpenAI usage dashboard for cost tracking
4. If costs become a concern, reduce frequency from daily to every 2-3 days

**Timeline**: Add retry logic in next iteration

---

## Risk 6: Cannibalization Not Detected for New Articles

**Risk Level**: MEDIUM
**Description**: The topic-selection engine checks title similarity at 0.6 threshold and slug collision. But semantic similarity (different words, same intent) is not detected.

**Impact**:
- Two articles could target the same search intent with different titles
- Search engines may choose the wrong page to rank

**Remediation Plan**:
1. The `keyword-map.csv` provides a manual reference for keyword-to-URL mapping
2. Before each batch, review the calendar topics against `keyword-map.csv`
3. Future enhancement: add embedding-based semantic similarity check using OpenAI embeddings API
4. For now, the title similarity check at 0.6 + slug collision check provides reasonable protection

**Timeline**: Manual review per batch. Embedding check in future iteration.

---

## Risk 7: AI-Generated Content Quality Variance

**Risk Level**: MEDIUM
**Description**: gpt-4o-mini may produce variable quality. Some articles may pass all automated checks but still read as generic or lack depth.

**Impact**:
- Article reads as surface-level despite passing word count and structure checks
- Original artifacts may be generic templates rather than genuinely useful

**Remediation Plan**:
1. The quality gate checks for AI tells, em-dashes, forbidden claims, word count, internal links, and keyword density
2. Critical warnings (AI tells, insufficient internal links, insufficient word count) are upgraded to errors in auto-publish mode - the article will NOT publish if these fail
3. For the first 5 articles, run in `--review-only` mode to validate quality before enabling auto-publish
4. After 5 successful auto-publishes, switch to full auto-publish
5. Review published articles weekly for quality drift

**Timeline**: First 5 articles in review-only mode, then auto-publish

---

## Risk 8: Existing Cannibalization (RAG Architecture, Voice AI)

**Risk Level**: MEDIUM
**Description**: Three existing cannibalization risks documented in `thin-content-remediation.md`:
- RAG architecture: blog post vs root page
- Voice AI: 3 pages targeting same intent
- Audit logging: 2 posts with overlapping topics

**Impact**:
- Search engines may rank the wrong page
- Link equity is split across competing pages

**Remediation Plan**:
1. **RAG**: Differentiate the blog post to focus exclusively on hybrid search (BM25 + vector). If that fails, 301 redirect to `/secure-enterprise-rag-architecture`
2. **Voice AI**: Expand the KestrelVoice blog post to focus on product-specific implementation. The root page stays as the canonical architecture guide
3. **Audit logging**: Already differentiated by framework (SOC 2 vs EU AI Act). Add cross-links between them
4. Add `rel="canonical"` or `noindex` if differentiation fails

**Timeline**: During the thin content expansion phase (Week 2-4)

---

## Risk 9: Workflow Failure on Push Conflict

**Risk Level**: LOW
**Description**: The GitHub Actions workflow commits and pushes to main. If another push happens simultaneously, the push fails.

**Impact**:
- Article is generated but not committed
- Next run may generate a different article, losing this one

**Remediation Plan**:
1. The workflow already includes `git pull --rebase origin main || true` before push
2. The `|| true` means rebase failure is silently ignored - this should be changed to retry
3. Add retry logic: if push fails, pull rebase and retry up to 3 times

**Timeline**: Fix in next workflow update

---

## Risk 10: Social Cross-Posting Failure Cascades

**Risk Level**: LOW
**Description**: If LinkedIn posting fails, the workflow continues to Dev.to and indexing. But if the article URL is not yet live (deployment hasn't happened), indexing notifications point to a 404.

**Impact**:
- Search engines notified of a URL that returns 404
- Cross-posted social content links to a non-existent page

**Remediation Plan**:
1. The workflow commits to main, which triggers Vercel deployment
2. Vercel deployment takes 1-3 minutes
3. The social posting job runs after commit-and-push, so there is a small window where the URL is not live
4. Add a 60-second sleep after commit-and-push before social posting
5. For indexing, add a URL availability check before pinging Google/IndexNow

**Timeline**: Add sleep and availability check in next workflow update

---

## Summary: Priority Actions

| Priority | Risk | Action | Timeline |
|----------|------|--------|----------|
| 1 | Thin content | Expand 9 thin posts | Week 2-4 |
| 1 | Internal links | Write backfill script, run once | Week 1 |
| 1 | CTAs | Add in backfill script | Week 1 |
| 2 | Cannibalization | Differentiate or redirect 3 page pairs | Week 2-4 |
| 2 | Batch 2 calendar | Create after Batch 1 evaluation | Before Day 10 |
| 2 | Quality variance | First 5 articles in review-only mode | Immediate |
| 3 | Push conflicts | Add retry logic | Next update |
| 3 | Social timing | Add sleep before cross-posting | Next update |
| 3 | Rate limits | Add retry with backoff | Next update |
| 3 | Semantic cannibalization | Add embedding check | Future iteration |
