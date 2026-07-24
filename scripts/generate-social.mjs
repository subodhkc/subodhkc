#!/usr/bin/env node

/**
 * Generate platform-specific social media content from blog posts using OpenAI.
 * No Twitter/LinkedIn API needed — outputs markdown files for copy-paste posting.
 *
 * Usage:
 *   node scripts/generate-social.mjs                    # Generate for all posts
 *   node scripts/generate-social.mjs --slug=hipaa-compliant-ai  # Specific post
 *   node scripts/generate-social.mjs --latest            # Latest post only
 *
 * Outputs to: data/social/<slug>.md
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const SITE_URL = 'https://subodhkc.com'

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

loadEnvLocal()

function getAllPosts() {
  const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const content = fs.readFileSync(path.join(postsDir, f), 'utf-8')
      return JSON.parse(content)
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function generateSocialContent(post) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY not set in .env.local or environment')
    process.exit(1)
  }

  const plainText = stripHtml(post.contentHtml).slice(0, 4000)
  const url = `${SITE_URL}/blog/${post.slug}`
  const keywords = post.keywords?.join(', ') || ''

  const prompt = `You are a social media content expert. Generate platform-specific social media posts for the following blog article.

Article Title: ${post.title}
URL: ${url}
Description: ${post.metaDescription}
Keywords: ${keywords}

Article Content (first 4000 chars):
${plainText}

Generate the following in a single markdown document:

## Twitter/X Thread (5-7 tweets)
- Hook tweet that stops the scroll
- Each tweet standalone-readable
- Last tweet is CTA with URL
- Use line breaks between tweets (---)

## LinkedIn Post
- Professional, insight-driven tone (not promotional, not engagement-bait)
- 900-1500 characters — brief and insightful, not a wall of text
- Start with a strong hook that states a counterintuitive insight or key finding (not a question)
- 3-5 key insights as bullet points, each with a specific takeaway
- No CTA at the end — no "visit my blog", "follow me", "check out", "read more", or any link reference
- DO NOT include any URL, link, or link placeholder in the post body — no [link here], no [link], no raw URL
- DO NOT use phrases like "Full article linked below", "Link in comments", "Visit my blog at", "Follow me for more"
- DO NOT use em-dashes (—) anywhere — use regular hyphens (-) or restructure the sentence
- DO NOT use AI writing tells: "Here's what I've learned", "After working across", "In my experience", "I've seen firsthand", "Let me share", "Here's the thing", "It's worth noting", "Needless to say", "At the end of the day", "The reality is", "Let's dive in", "Let's explore", "Let's break this down", "Here's a breakdown", "Here's why", "Here's how", "The bottom line is", "It comes down to", "That's where", "This is where", "This isn't just about", "Let's be clear", "One thing is clear", "A key takeaway is", "Picture this", "Imagine", "Fast forward", "Spoiler alert", "Plot twist", "Here's the deal", "But here's the catch", "Which brings us to"
- DO NOT fabricate personal claims — no "signed a client", "we deployed", "a company I worked with", "in a recent engagement"
- DO NOT use engagement bait ("Agree?", "Comment below", "Who else thinks...")
- DO NOT tag people (@mentions) unless they are directly quoted
- Content must be factual and based on the article — no hallucinated facts, numbers, or events
- Write about the topic, the news, the how-to — not about yourself or your experience
- Include 3-5 relevant hashtags at the very end, each on its own line
- Hashtags should be specific to AI governance/enterprise AI (e.g., #AIGovernance, not #AI)

## Reddit Post (r/MachineLearning or r/EnterpriseAI)
- Title under 300 chars
- Body: brief context + key takeaway + link
- Tone: technical, peer-to-peer, no marketing language

## Hacker News Submission
- Title: exact article title (no clickbait)
- Text: 1-2 sentence summary for self-post style

## Dev.to Article Summary
- Catchy title variation
- 2-3 paragraph summary that teases the full article
- "Read the full article at [URL]" CTA

## Newsletter Teaser
- 2-3 sentence email preview text
- Compelling enough to open

Format each section with markdown headers. Do not add any preamble or conclusion outside the sections.`

  console.log(`Generating social content for: ${post.title}`)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert social media strategist who creates high-engagement content for B2B tech audiences. You understand AI governance, enterprise architecture, and compliance niches. You write in a natural, human voice. You never use em-dashes. You never use AI writing patterns like "Here\'s what I\'ve learned" or "After working across". You never fabricate personal experiences or claims. You stick to facts from the article.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`OpenAI API error (${response.status}): ${error}`)
    return null
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    console.error('OpenAI returned empty response (possibly truncated by max_tokens)')
    console.error('Finish reason:', data.choices[0]?.finish_reason)
    return null
  }

  return content
}

async function reviewSocialContent(post, socialContent) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const url = `${SITE_URL}/blog/${post.slug}`
  const plainText = stripHtml(post.contentHtml).slice(0, 2000)

  const prompt = `You are a social media editor. Review the following social media content for a blog post and provide a quality assessment.

BLOG POST:
Title: ${post.title}
URL: ${url}
Excerpt: ${post.excerpt || post.metaDescription}
Content (first 2000 chars): ${plainText}

SOCIAL CONTENT TO REVIEW:
${socialContent}

Review each section and provide:
1. **Overall Score** (1-10)
2. **Accuracy**: Does the social content accurately reflect the article? (yes/no + notes)
3. **Hallucinations**: Any claims not supported by the article? (list them or "none")
4. **Tone Consistency**: Is the tone appropriate for each platform? (notes)
5. **LinkedIn Guardrails Check**: 
   - Any em-dashes present? (should be none)
   - Any AI writing tells? (e.g., "Here's what I've learned", "Let's dive in", "The bottom line is")
   - Any link placeholders or link references? (should be none)
   - Any CTA phrases like "visit my blog", "follow me", "check out"? (should be none)
   - Any fabricated personal claims? (should be none)
   - Is the content factual and based on the article? (yes/no)
6. **Platform-Specific Issues**: Any formatting problems for specific platforms? (list or "none")
7. **Suggested Fixes**: Specific improvements (bullet points, or "none needed")

Format as markdown. Be concise but specific.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a strict social media editor who reviews content for accuracy, tone, and platform-appropriateness. You flag hallucinations, AI writing tells, em-dashes, link references, and fabricated claims. For LinkedIn posts, you verify no CTAs, no link placeholders, no em-dashes, and no AI writing patterns are present.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) return null
  const data = await response.json()
  return data.choices[0]?.message?.content
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const latestOnly = args.includes('--latest')
  const skipReview = args.includes('--no-review')

  let posts = getAllPosts()
  if (posts.length === 0) {
    console.error('No blog posts found in data/blog/posts/')
    process.exit(1)
  }

  if (slugArg) {
    posts = posts.filter((p) => p.slug === slugArg)
    if (posts.length === 0) {
      console.error(`No post found with slug: ${slugArg}`)
      process.exit(1)
    }
  } else if (latestOnly) {
    posts = [posts[0]]
  }

  const outputDir = path.join(ROOT, 'data', 'social')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  let success = 0
  let fail = 0

  for (const post of posts) {
    const outputPath = path.join(outputDir, `${post.slug}.md`)

    if (fs.existsSync(outputPath) && !args.includes('--force')) {
      console.log(`SKIP: ${post.slug} (already exists, use --force to regenerate)`)
      continue
    }

    try {
      const content = await generateSocialContent(post)
      if (content) {
        let fullOutput = `# Social Media Content — ${post.title}

> Auto-generated on ${new Date().toISOString().split('T')[0]}
> Article: ${SITE_URL}/blog/${post.slug}
> Review and customize before posting.

`

        fullOutput += content

        // AI review
        if (!skipReview) {
          console.log(`  Reviewing social content...`)
          const review = await reviewSocialContent(post, content)
          if (review) {
            fullOutput += `\n\n---\n\n## AI Review\n\n${review}\n`
            console.log(`  ✓ AI review appended`)
          }
        }

        fs.writeFileSync(outputPath, fullOutput, 'utf-8')
        console.log(`  ✓ Saved to data/social/${post.slug}.md`)
        success++
      } else {
        console.log(`  ✗ Failed to generate content`)
        fail++
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`)
      fail++
    }

    if (posts.length > 1) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  console.log(`\nDone: ${success} generated, ${fail} failed`)
  console.log(`Output: data/social/*.md`)
  console.log(`\nNext steps:`)
  console.log(`  1. Review each file in data/social/ — check AI Review section`)
  console.log(`  2. Post to LinkedIn automatically:`)
  console.log(`     node scripts/post-linkedin.mjs --slug=<slug>`)
  console.log(`  3. Copy-paste remaining platforms: Twitter/X, Reddit, HN, Dev.to`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
