import { ImageResponse } from 'next/og'

export const alt = 'My Favorites - Cursor Commands Explorer'
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
        padding: '80px',
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
            fontSize: 80,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 32,
          }}
        >
          My Favorites
        </div>
        <div
          style={{
            fontSize: 38,
            color: '#a1a1aa',
            marginBottom: 60,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          View and manage your bookmarked Cursor commands for quick access
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            fontSize: 28,
            color: '#71717a',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#18181b',
              padding: '16px 28px',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div>Saved Commands</div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#18181b',
              padding: '16px 28px',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div>Quick Access</div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
