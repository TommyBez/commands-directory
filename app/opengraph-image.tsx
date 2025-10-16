import { ImageResponse } from 'next/og'

export const alt =
  'Cursor Commands Explorer - Copy-ready Cursor commands, shared by the community'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#0a0a0a',
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
            color: '#ffffff',
            marginBottom: 24,
          }}
        >
          Cursor Commands Explorer
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#a1a1aa',
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
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div>Search & Discover</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div>One-Click Copy</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div>Community Curated</div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
