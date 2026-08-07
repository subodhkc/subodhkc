import { ImageResponse } from 'next/og'
import { getPostBySlug, getAllSlugs } from '@/lib/blog'

export const runtime = 'nodejs'
export const alt = 'Blog post by Subodh Kc Blogger'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#2b2e33',
            color: '#ebe6d8',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700 }}>Subodh Kc Blogger</div>
          <div style={{ fontSize: 24, color: '#9a9a96', marginTop: 16 }}>Article Not Found</div>
        </div>
      ),
      { ...size }
    )
  }

  const title = post.title.length > 80 ? post.title.slice(0, 77) + '...' : post.title
  const authorName = post.author || 'Subodh Kc Blogger'
  const keywords = post.keywords.slice(0, 4)
  const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#2b2e33',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 6,
            height: '100%',
            backgroundColor: '#16d088',
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: '#16d088',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#2b2e33',
              }}
            >
              SK
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#ebe6d8' }}>
              {authorName}
            </div>
          </div>
          <div style={{ fontSize: 18, color: '#9a9a96' }}>{dateStr}</div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#ebe6d8',
            maxWidth: 1000,
            flex: 1,
            alignItems: 'center',
          }}
        >
          {title}
        </div>

        {/* Keywords */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 30,
          }}
        >
          {keywords.map((kw) => (
            <div
              key={kw}
              style={{
                display: 'flex',
                fontSize: 16,
                color: '#16d088',
                backgroundColor: 'rgba(22, 208, 136, 0.12)',
                padding: '6px 16px',
                borderRadius: 999,
                border: '1px solid rgba(22, 208, 136, 0.3)',
              }}
            >
              {kw}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 40,
            paddingTop: 30,
            borderTop: '1px solid #404349',
          }}
        >
          <div style={{ fontSize: 18, color: '#9a9a96' }}>
            subodhkc.com/blog
          </div>
          <div style={{ fontSize: 18, color: '#9a9a96' }}>
            AI Advisor and Systems Architect
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
