#!/usr/bin/env node

/**
 * Backfill Internal Links and CTAs for Existing Blog Posts
 *
 * Reads the internal-link-map.json and adds internal links + CTAs
 * to all existing blog post JSON files that are missing them.
 *
 * Usage:
 *   node scripts/backfill-internal-links.mjs           # Run on all posts
 *   node scripts/backfill-internal-links.mjs --slug=specific-slug  # Run on one post
 *   node scripts/backfill-internal-links.mjs --dry-run  # Preview without saving
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const linkMapPath = path.join(ROOT, 'docs', 'content', 'internal-link-map.json')
const postsDir = path.join(ROOT, 'data', 'blog', 'posts')

// CTA text mapping per URL
const CTA_TEXTS = {
  '/services': 'Explore AI Architecture and Integration Services',
  '/advisory': 'Get Advisory for Your AI Program',
  '/solutions/haiec': 'Assess Your AI Governance with HAIEC',
  '/solutions/kestrelvoice': 'Deploy Kestrel Voice AI for Your Business',
  '/local-ai-review': 'Get a Local AI Review',
  '/research': 'Explore AI Systems Research',
  '/architecture-decision-master-sheet': 'Use the Architecture Decision Master Sheet',
  '/how-to-secure-and-govern-ai': 'Learn How to Secure and Govern AI',
  '/products/llmverify': 'Verify AI Outputs with LLMVerify',
  '/products/courtcase': 'Explore CourtCase for Legal Document Automation',
  '/solutions/courtcase': 'Explore CourtCase for Legal Document Automation',
  '/speaking': 'Book Subodh KC to Speak at Your Event',
}

// Anchor text mapping per URL for internal links
const ANCHOR_TEXTS = {
  '/architecture-decision-master-sheet': 'Architecture Decision Master Sheet',
  '/services': 'AI architecture and integration services',
  '/secure-enterprise-rag-architecture': 'secure enterprise RAG architecture',
  '/why-ai-voice-agents-fail-in-production': 'why AI voice agents fail in production',
  '/ai-voice-agent-architecture': 'AI voice agent architecture',
  '/kestrel-voice-ai-receptionist-platform': 'Kestrel Voice AI receptionist platform',
  '/solutions/kestrelvoice': 'Kestrel Voice AI solution',
  '/how-to-secure-and-govern-ai': 'how to secure and govern AI',
  '/haiec': 'HAIEC governance framework',
  '/solutions/haiec': 'HAIEC governance solution',
  '/ai-security-tools': 'AI security tools',
  '/ai-risk-register': 'AI risk register',
  '/ai-vendor-due-diligence-checklist': 'AI vendor due diligence checklist',
  '/ai-incident-evidence-checklist': 'AI incident evidence checklist',
  '/guides/eu-ai-act': 'EU AI Act guide',
  '/guides/texas-ai-law': 'Texas AI law guide',
  '/guides/nyc-local-law-144': 'NYC Local Law 144 guide',
  '/local-ai-review': 'local AI review',
  '/advisory': 'AI advisory services',
  '/centaurus': 'Centaurus AI advisory practice',
  '/research': 'AI systems research',
  '/speaking': 'speaking engagements',
  '/products/llmverify': 'LLMVerify',
  '/products/courtcase': 'CourtCase',
  '/solutions/courtcase': 'CourtCase solution',
  '/build-internal-ai-applications-streamlit-rag-mcp': 'building internal AI applications with Streamlit, RAG and MCP',
  '/blog/hidden-seo-risk-ai-assisted-frontend-development': 'hidden SEO risk in AI-assisted frontend development',
  '/blog/what-is-llms-txt': 'what llms.txt is and why AI-ready websites publish it',
  '/blog/legal-document-automation': 'legal document automation for law firms',
  '/blog/haiec-modular-ai-governance-framework': 'HAIEC modular AI governance framework',
  '/blog/seven-layers-ai-compliance-nist-iso-soc2': '7 layers of AI compliance across NIST, ISO and SOC 2',
  '/blog/build-a-logging-pipeline-for-eu-ai-act-compliance': 'logging pipeline for EU AI Act compliance',
  '/blog/implementing-immutable-audit-trails-for-soc-2-ai-compliance': 'immutable audit trails for SOC 2 AI compliance',
  '/blog/implementing-rag-row-level-security-for-multi-tenant-ai': 'RAG row-level security for multi-tenant AI',
  '/blog/production-rag-architecture-patterns-for-hybrid-search': 'production RAG architecture patterns for hybrid search',
  '/blog/ai-voice-agent-architecture-kestrelvoice': 'KestrelVoice architecture deep dive',
  '/blog/ai-compliance-guide-addressing-hugging-face-risks': 'AI compliance guide for Hugging Face risks',
  '/blog/securing-ai-systems-after-openai-containment-breach': 'securing AI systems after containment breaches',
  '/blog/hipaa-compliant-ai': 'HIPAA compliant AI guide',
  '/does-texas-ai-law-apply-to-my-business': 'whether Texas AI law applies to your business',
}

function loadLinkMap() {
  if (!fs.existsSync(linkMapPath)) {
    console.error('internal-link-map.json not found at', linkMapPath)
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(linkMapPath, 'utf-8'))
}

function getAllPosts() {
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const content = fs.readFileSync(path.join(postsDir, f), 'utf-8')
      return JSON.parse(content)
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function findLinkTargetsForSlug(slug, linkMap) {
  const blogPath = `/blog/${slug}`
  for (const pillarKey of Object.keys(linkMap.pillars)) {
    const pillar = linkMap.pillars[pillarKey]
    for (const articlePath of Object.keys(pillar.articles)) {
      if (articlePath === blogPath) {
        return pillar.articles[articlePath].linksTo || []
      }
    }
  }
  return null
}

function findCTAForSlug(slug, linkMap) {
  const blogPath = `/blog/${slug}`
  for (const pillarKey of Object.keys(linkMap.pillars)) {
    const pillar = linkMap.pillars[pillarKey]
    for (const articlePath of Object.keys(pillar.articles)) {
      if (articlePath === blogPath) {
        const links = pillar.articles[articlePath].linksTo || []
        // Find the commercial link (not a blog post, not a guide)
        const commercial = links.find(
          (l) => !l.startsWith('/blog/') &&
                 !l.startsWith('/guides/') &&
                 CTA_TEXTS[l]
        )
        return commercial || pillar.commercial[0] || '/services'
      }
    }
  }
  return null
}

function hasInternalLinks(contentHtml) {
  const matches = contentHtml.match(/href="\/[^"]+"/g)
  return matches && matches.length >= 2
}

function hasCTA(contentHtml) {
  return contentHtml.includes('data-cta') ||
         /<p><a href="\/(services|advisory|solutions|local-ai-review|research|architecture-decision-master-sheet|how-to-secure-and-govern-ai|products)/.test(contentHtml)
}

function buildInternalLinksHtml(links) {
  const items = links.map((url) => {
    const anchor = ANCHOR_TEXTS[url] || url
    return `<li><a href="${url}">${anchor}</a></li>`
  })
  return `<h2>Related Resources</h2><ul>${items.join('')}</ul>`
}

function buildCTAHtml(ctaUrl) {
  const text = CTA_TEXTS[ctaUrl] || 'Learn More'
  const fullUrl = ctaUrl === '/local-ai-review'
    ? 'https://subodhkc.com/local-ai-review'
    : ctaUrl
  return `<p><a href="${fullUrl}">${text}</a></p>`
}

function injectBeforeFAQ(contentHtml, injection) {
  // Try to find FAQ section
  const faqMatch = contentHtml.match(/<h2>.*?(FAQ|Frequently Asked Questions).*?<\/h2>/i)
  if (faqMatch) {
    const faqIndex = contentHtml.indexOf(faqMatch[0])
    return contentHtml.slice(0, faqIndex) + injection + '\n' + contentHtml.slice(faqIndex)
  }
  // No FAQ section found, append at end
  return contentHtml + '\n' + injection
}

function backfillPost(post, linkMap, dryRun) {
  const slug = post.slug
  const linkTargets = findLinkTargetsForSlug(slug, linkMap)
  const ctaUrl = findCTAForSlug(slug, linkMap)

  if (!linkTargets) {
    console.log(`  SKIP: ${slug} - not found in internal-link-map.json`)
    return false
  }

  let modified = false
  let contentHtml = post.contentHtml

  // Add internal links if missing
  if (!hasInternalLinks(contentHtml)) {
    const linksHtml = buildInternalLinksHtml(linkTargets)
    contentHtml = injectBeforeFAQ(contentHtml, linksHtml)
    modified = true
    console.log(`  ADDED: ${linkTargets.length} internal links`)
  } else {
    console.log(`  OK: already has internal links`)
  }

  // Add CTA if missing
  if (!hasCTA(contentHtml) && ctaUrl) {
    const ctaHtml = buildCTAHtml(ctaUrl)
    contentHtml = injectBeforeFAQ(contentHtml, ctaHtml)
    modified = true
    console.log(`  ADDED: CTA -> ${ctaUrl}`)
  } else if (hasCTA(contentHtml)) {
    console.log(`  OK: already has CTA`)
  }

  if (modified && !dryRun) {
    post.contentHtml = contentHtml
    const outputPath = path.join(postsDir, `${slug}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), 'utf-8')
    console.log(`  SAVED: data/blog/posts/${slug}.json`)
  } else if (modified && dryRun) {
    console.log(`  DRY RUN: would save changes`)
  }

  return modified
}

function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]

  console.log('Backfill Internal Links and CTAs')
  console.log('================================')
  if (dryRun) console.log('Mode: DRY RUN (no files will be saved)\n')

  const linkMap = loadLinkMap()
  const posts = getAllPosts()
  console.log(`Found ${posts.length} blog posts\n`)

  const targetPosts = slugArg
    ? posts.filter((p) => p.slug === slugArg)
    : posts

  if (targetPosts.length === 0) {
    console.log('No matching posts found.')
    process.exit(1)
  }

  let modifiedCount = 0
  for (const post of targetPosts) {
    console.log(`\nProcessing: ${post.slug}`)
    const modified = backfillPost(post, linkMap, dryRun)
    if (modified) modifiedCount++
  }

  console.log(`\nDone. ${modifiedCount} of ${targetPosts.length} posts modified.`)
}

main()
