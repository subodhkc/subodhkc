import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'MCP Tenant Isolation - 57 deterministic rules for cross-tenant security'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
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
          <div style={{ fontSize: 22, fontWeight: 600, color: '#e0e0e0' }}>Subodh KC</div>
        </div>

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
              color: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            Open Source · MIT · Powered by HAIEC
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#fff',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div>MCP Tenant Isolation</div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#3b82f6',
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          57 deterministic rules for cross-tenant security
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#999',
            marginTop: 12,
            maxWidth: 900,
          }}
        >
          Multi-tenant SaaS · MCP server code · IDOR · RLS · Cache · Storage · CI-ready
        </div>

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
            subodhkc.com/products/mcp-tenant-isolation
          </div>
          <div style={{ fontSize: 18, color: '#666' }}>
            BOUNDARY SECURITY
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
