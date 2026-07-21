import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'
export const revalidate = 3600

const SITE_URL = 'https://subodhkc.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      const description = escapeXml(post.excerpt || post.metaDescription)
      const title = escapeXml(post.title)
      const date = new Date(post.createdAt).toUTCString()
      const categories = post.keywords
        .slice(0, 5)
        .map((kw) => `      <category>${escapeXml(kw)}</category>`)
        .join('\n')

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${date}</pubDate>
${categories}
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Subodh KC — AI Governance & Architecture Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Practical articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems. No fluff — frameworks, patterns, and steps you can apply.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
