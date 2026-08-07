# SubodhKC.com Project Rules

## Build & Development
- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- Blog posts are JSON files in `data/blog/posts/`
- Blog rendering: `app/blog/[slug]/page.tsx`
- Blog utilities: `lib/blog.ts`, `lib/blog-utils.ts`

## Editorial Rules
- See `.devin/skills/subodhkc-editorial-manifesto/SKILL.md` for the full editorial persona and rules
- See `.devin/skills/subodhkc-seo-theme/SKILL.md` for the SEO content strategy and topic clusters
- CI-generated articles use author "Yeti AI Writer"
- Hand-written articles by Subodh KC use author "Subodh KC"
- All articles must pass hallucination validation (URL checks) before publishing
- All articles must pass AI tell-tale detection (no em-dashes, emojis, AI phrases)
- SEO theme: "Defensive AI Architecture" with 3 topic clusters
- Article length: 1500-2500 words (information density over length)

## CI Article Generation
- Script: `scripts/generate-article.mjs`
- Workflow: `.github/workflows/daily-article.yml`
- Schedule: 1 article per day at 14:00 UTC (09:00 CST)
- Model: `gpt-4o-2024-11-20`
- Authority articles: 2000-3500 words
- Max output tokens: 16384 for authority articles
- Continuation mechanism handles truncated responses

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
