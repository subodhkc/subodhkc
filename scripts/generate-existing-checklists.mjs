import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const SITE_URL = 'https://subodhkc.com'

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Z_]+)=(.*)$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
      }
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
      const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8')
      return JSON.parse(raw)
    })
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
}

async function generateChecklist(article, slug) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const prompt = `You are an expert AI compliance consultant. Based on the blog post below, generate a practical, downloadable checklist in Markdown format that a reader can use to implement the guidance from the article.

TITLE: ${article.title}
KEYWORDS: ${(article.keywords || []).join(', ')}
EXCERPT: ${article.metaDescription || ''}

CONTENT (first 3000 chars):
${(article.contentHtml || '').replace(/<[^>]+>/g, ' ').slice(0, 3000)}

REQUIREMENTS:
1. Generate a Markdown checklist (100-300 lines) that is actionable and specific
2. Use Markdown checkboxes: - [ ] item
3. Organize into logical sections with ## headers
4. Include specific technical steps, not vague advice
5. Include a "Preparation" section, an "Implementation" section, and a "Verification" section
6. Add a "Evidence to Collect" section listing what audit artifacts to save
7. Do NOT include em-dashes. Use regular hyphens.
8. Do NOT include AI writing tells or fabricated personal claims.
9. Start with a brief 2-3 line description of what this checklist covers
10. End with a "## About" section: "Generated from: ${SITE_URL}/blog/${slug}"

Return ONLY the Markdown content, no code fences, no preamble.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI compliance consultant who creates practical, actionable checklists. You return only valid Markdown. You never use em-dashes.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      console.warn(`  Checklist generation failed (${response.status})`)
      return null
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) return null

    return content.replace(/^```markdown?\s*/i, '').replace(/\s*```$/i, '').trim()
  } catch (err) {
    console.warn(`  Checklist generation error: ${err.message}`)
    return null
  }
}

async function main() {
  const posts = getAllPosts()
  console.log(`Found ${posts.length} posts. Generating downloadable checklists...\n`)

  const downloadsDir = path.join(ROOT, 'public', 'downloads')
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true })
  }

  let generated = 0
  let skipped = 0

  for (const post of posts) {
    if (post.downloadableUrl) {
      console.log(`  ⊘ ${post.slug}: already has downloadable (${post.downloadableUrl})`)
      skipped++
      continue
    }

    console.log(`  Generating checklist for: ${post.slug}`)
    const checklist = await generateChecklist(post, post.slug)

    if (checklist) {
      const checklistPath = path.join(downloadsDir, `${post.slug}-checklist.md`)
      fs.writeFileSync(checklistPath, checklist, 'utf-8')

      post.downloadableUrl = `/downloads/${post.slug}-checklist.md`
      post.downloadableLabel = `Download the ${post.title.split(' ').slice(0, 4).join(' ')} Checklist`

      const postPath = path.join(ROOT, 'data', 'blog', 'posts', `${post.slug}.json`)
      fs.writeFileSync(postPath, JSON.stringify(post, null, 2), 'utf-8')

      console.log(`    ✓ Saved to public/downloads/${post.slug}-checklist.md`)
      generated++
    } else {
      console.log(`    ⚠ Skipped — generation failed`)
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 1000))
  }

  console.log(`\nDone. ${generated} checklists generated, ${skipped} already had downloadables.`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
