import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Cursor Commands Explorer - Copy-ready Cursor commands, shared by the community'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 24,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Cursor Commands Explorer
          </div>
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 48,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Copy-ready Cursor commands, shared by the community
          </div>
          <div
            style={{
              display: 'flex',
              gap: 40,
              fontSize: 24,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>🔍</div>
              <div>Search & Discover</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>⚡</div>
              <div>One-Click Copy</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>🎯</div>
              <div>Community Curated</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
