# llms.txt Implementation Checklist

A practical checklist for publishing llms.txt, llms-full.txt, and the supporting machine-readable content layer on your website.

## 1. Publish Core Files

- [ ] Create `/llms.txt` following the official structure (H1, blockquote summary, context, H2 sections with links)
- [ ] Create `/llms-full.txt` with consolidated authoritative content (if content set is contained)
- [ ] Ensure both files are accessible at the root domain (e.g., `https://example.com/llms.txt`)
- [ ] Verify files return HTTP 200 with `text/plain` content type
- [ ] Validate llms.txt structure: H1 required, blockquote summary, curated link sections

## 2. Provide Markdown Page Versions

- [ ] Identify the 5–20 most important pages on your site
- [ ] Create clean Markdown versions of each (e.g., `/about.md`, `/product.md`, `/security.md`)
- [ ] Strip navigation, footers, cookie banners, ads, and tracking from Markdown versions
- [ ] Ensure Markdown pages are linked from the corresponding llms.txt sections
- [ ] Test that each `.md` URL returns HTTP 200

## 3. Advertise the Files

- [ ] Add HTTP `Link` headers to relevant pages: `Link: </llms.txt>; rel="llms-txt"`
- [ ] Add an "AI and Agent Resources" section to documentation footers
- [ ] Link to `/llms.txt` from your GitHub README
- [ ] Reference the file in API documentation and integration guides
- [ ] Add `X-Llms-Txt: /llms.txt` header (optional but improves discovery)

## 4. Configure Your Own Applications

- [ ] Update custom retrieval workflows to check `/llms.txt` first
- [ ] Parse sections and descriptions from the file
- [ ] Fall back to sitemap or conventional crawl when llms.txt is absent
- [ ] Log successful and failed retrieval paths for monitoring

## 5. Structure llms.txt Correctly

- [ ] H1: Site or project name
- [ ] Blockquote: One-sentence summary of what the site does
- [ ] Optional context paragraphs (canonical domain, language, last reviewed date)
- [ ] H2 sections with curated links (Company, Product, Methodology, Security, Docs, etc.)
- [ ] Optional `## Optional` section for secondary resources (blog, news, case studies)
- [ ] Each link includes a colon-separated description of what the page contains

## 6. Structure llms-full.txt Correctly

- [ ] H1 with site name and "Full AI-Readable Reference" label
- [ ] Blockquote with scope description
- [ ] Metadata: canonical domain, generated date, content version, language, source index
- [ ] Table of contents
- [ ] Each section includes: source URL, last updated date, clean Markdown content
- [ ] Exclude: cookie banners, navigation, footers, tracking, duplicate pages, private content, secrets

## 7. Integrate with Broader AI SEO Stack

- [ ] Ensure important pages return clean HTTP responses with canonical URLs
- [ ] Maintain consistent entity names (company, product, founder) across the site
- [ ] Include direct definitions and factual statements that can be quoted by AI systems
- [ ] Publish original research, benchmarks, or case studies as evidence sources
- [ ] Add Schema.org structured data (Article, FAQPage, Organization, BreadcrumbList)
- [ ] Maintain XML sitemap and robots.txt alongside llms.txt
- [ ] Consider MCP server for dynamic agent access if applicable

## 8. Monitor and Maintain

- [ ] Monitor server logs for AI crawler requests (GPTBot, OAI-SearchBot, ClaudeBot, etc.)
- [ ] Track access to `/llms.txt`, `/llms-full.txt`, and `.md` pages
- [ ] Check for broken links in llms.txt monthly
- [ ] Update files when product capabilities, policies, pricing, or URLs change
- [ ] Watch for unauthorized changes, stale claims, or prompt-injection language
- [ ] Version-control the files in your repository

## 9. Test Effectiveness

- [ ] Baseline test: Ask an AI agent questions about your site without providing llms.txt
- [ ] Intervention test: Give the same agent access to llms.txt
- [ ] Measure: failed URLs, pages fetched, retrieval time, input tokens, answer accuracy
- [ ] Repeat with multiple models and question phrasings
- [ ] Compare results and iterate on file structure and descriptions

## About

Generated from: https://subodhkc.com/blog/what-is-llms-txt
