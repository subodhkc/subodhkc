import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'How to Save Web Pages to Print Later on Windows — Step-by-Step Guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #0d1520 50%, #0a1a2e 100%)',
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
            gap: 12,
            marginBottom: 40,
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

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            Step-by-Step Guide
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#fff',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div>How to Save Web Pages</div>
          <div>to Print Later on Windows</div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#22c55e',
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          Ctrl+P to save · Pick pages · Batch print
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
            subodhkc.com/products/print-later/how-it-works
          </div>
          <div style={{ fontSize: 18, color: '#666' }}>
            Free · Open Source · Windows 10/11
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
