import { ImageResponse } from 'next/og'
import { getPostBySlug, getAllSlugs } from '@/lib/blog'

export const runtime = 'nodejs'
export const alt = 'Blog post by Subodh KC'
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
            backgroundColor: '#0a0a0a',
            color: '#fff',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700 }}>Subodh KC</div>
          <div style={{ fontSize: 24, color: '#888', marginTop: 16 }}>Article Not Found</div>
        </div>
      ),
      { ...size }
    )
  }

  const title = post.title.length > 80 ? post.title.slice(0, 77) + '...' : post.title
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
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
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
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              SK
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#e0e0e0' }}>
              Subodh KC
            </div>
          </div>
          <div style={{ fontSize: 18, color: '#666' }}>{dateStr}</div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#fff',
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
                color: '#93c5fd',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                padding: '6px 16px',
                borderRadius: 999,
                border: '1px solid rgba(59, 130, 246, 0.3)',
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
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ fontSize: 18, color: '#666' }}>
            subodhkc.com/blog
          </div>
          <div style={{ fontSize: 18, color: '#666' }}>
            AI Advisor and Systems Architect
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
