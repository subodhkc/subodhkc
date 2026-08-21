import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'AI AppSec + MCP Tenant Isolation Release - Security tools for AI-assisted development'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
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
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            Open Source Release · Powered by HAIEC
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#fff',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div>AI AppSec + MCP Tenant Isolation</div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#3b82f6',
            marginTop: 12,
            fontWeight: 600,
          }}
        >
          Security tools for AI-assisted development
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: '#999',
            marginTop: 10,
            maxWidth: 900,
          }}
        >
          Secure the code. Protect the tenant boundary. Verify the model interaction.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 30,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ fontSize: 16, color: '#666' }}>
            subodhkc.com/insights/ai-appsec-mcp-tenant-isolation-release
          </div>
          <div style={{ fontSize: 16, color: '#666' }}>
            MIT · MCP v2 · HAIEC Developer Security
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
