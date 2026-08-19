# llms.txt Implementation Checklist

llms.txt is a convention for publishing machine-readable content at the root of your domain so that AI agents and search systems can discover and understand your site without crawling HTML. This is the checklist I used when implementing llms.txt and llms-full.txt on subodhkc.com. It covers the file structure, deployment, discovery mechanisms, and effectiveness testing.

## 1. Publish Core Files

- [ ] Create `/llms.txt` at the root of your domain. The file follows a Markdown structure: H1 with the site name, a blockquote with a one-sentence summary, optional context paragraphs, and H2 sections with curated links.
- [ ] Create `/llms-full.txt` if your content set is contained enough to fit in a single file. For large sites, skip this and focus on the per-page Markdown versions described in section 2.
- [ ] Verify both files return HTTP 200 with `Content-Type: text/plain; charset=utf-8`.
- [ ] Validate the llms.txt structure: H1 is required, blockquote summary is required, each H2 section contains links with colon-separated descriptions.

## 2. Publish Markdown Page Versions

- [ ] Identify the 5-20 most important pages on your site. These are the pages an AI agent would need to answer questions about your business, product, or expertise.
- [ ] Create clean Markdown versions of each page (e.g., `/about.md`, `/services.md`, `/security.md`). Strip navigation, footers, cookie banners, ads, and tracking scripts. The Markdown should contain only the content.
- [ ] Link each Markdown page from the corresponding section in `/llms.txt`. The link format is: `[Page Title](/page.md): Brief description of what the page contains`.
- [ ] Test that each `.md` URL returns HTTP 200. Broken links in llms.txt are worse than no llms.txt because they signal poor maintenance to AI crawlers.

## 3. Advertise the Files

- [ ] Add an HTTP `Link` header to your HTML pages: `Link: </llms.txt>; rel="llms-txt"`. This is the discovery mechanism for AI agents that check headers.
- [ ] Add a link to `/llms.txt` in your site footer or documentation. Make it discoverable for humans who want to understand your AI-readable content.
- [ ] Reference `/llms.txt` in your GitHub README and API documentation if applicable.
- [ ] Submit the file to the llms.txt directory if one exists for your industry or community.

## 4. Structure llms.txt Correctly

- [ ] H1: Your site or project name. Keep it concise. "Subodh KC - AI Advisor & AI Systems Architect" not "Welcome to the official website of Subodh KC, AI Advisor and Systems Architect specializing in enterprise AI governance and compliance."
- [ ] Blockquote: One sentence that describes what the site does. "AI advisory and systems architecture for organizations that need decisions, not demos."
- [ ] Optional context: canonical domain, language, last reviewed date. Include these if your content changes frequently.
- [ ] H2 sections: group links by category (Company, Services, Blog, Frameworks, Security). Each section should have 3-10 links. More than 10 is a catalog, not a guide.
- [ ] Optional `## Optional` section: secondary resources (blog index, case studies, changelog). AI agents will read these but they are not critical for understanding your core offering.

## 5. Structure llms-full.txt Correctly

- [ ] H1 with site name and a "Full AI-Readable Reference" label.
- [ ] Blockquote with scope description: what is included, what is excluded, and the generation date.
- [ ] Metadata block: canonical domain, generated date, content version, language, and a source index mapping sections to their original URLs.
- [ ] Table of contents for navigation.
- [ ] Each section: source URL, last updated date, and clean Markdown content.
- [ ] Exclude: cookie banners, navigation, footers, tracking pixels, duplicate pages, private content, and secrets. Run a grep for API keys, passwords, and internal URLs before publishing.

## 6. Integrate with Your AI SEO Stack

- [ ] Ensure important pages return clean HTTP responses with canonical URLs. AI crawlers follow canonicals the same way search engines do.
- [ ] Maintain consistent entity names across the site. If your company is "Acme" in llms.txt, it should be "Acme" in structured data, page titles, and content. Inconsistency confuses retrieval.
- [ ] Include direct definitions and factual statements that AI systems can quote. "Subodh KC is an AI Advisor and AI Systems Architect based in Dallas, Texas." is quotable. "Subodh KC helps organizations navigate the complexities of AI" is not.
- [ ] Publish original research, benchmarks, or case studies. AI systems cite sources that provide information not available elsewhere.
- [ ] Add Schema.org structured data (Organization, Article, FAQPage, BreadcrumbList) alongside llms.txt. They serve different purposes: structured data is for search engines, llms.txt is for AI agents.
- [ ] Maintain XML sitemap and robots.txt alongside llms.txt. They are complementary, not redundant.

## 7. Monitor and Maintain

- [ ] Monitor server logs for AI crawler requests: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Amazonbot. Track request volume and which pages they fetch.
- [ ] Track access to `/llms.txt`, `/llms-full.txt`, and `.md` pages separately from regular page views.
- [ ] Check for broken links in llms.txt monthly. A link that 404s is a signal that your AI-readable content is stale.
- [ ] Update files when product capabilities, pricing, policies, or URLs change. Stale llms.txt is worse than no llms.txt because it misleads AI agents.
- [ ] Watch for unauthorized changes, stale claims, or prompt-injection language in the files. Version-control them in your repository.
- [ ] Review the files quarterly. Content drifts. What was accurate in January may be wrong by July.

## 8. Test Effectiveness

- [ ] Baseline test: ask an AI agent (ChatGPT, Claude, Perplexity) questions about your site without providing llms.txt. Record what it gets right and wrong.
- [ ] Intervention test: give the same agent access to your llms.txt and Markdown pages. Ask the same questions.
- [ ] Measure: failed URLs, pages fetched, retrieval time, input tokens consumed, and answer accuracy. The goal is fewer failed lookups and higher answer accuracy with llms.txt than without.
- [ ] Repeat with multiple models and different question phrasings. A single model is not representative.
- [ ] Compare results and iterate on file structure and descriptions. If the agent still cannot answer basic questions about your business after reading llms.txt, the file structure needs revision.

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
