import { ImageResponse } from 'next/og'

export const alt = 'Submit a Command - Cursor Commands Explorer'
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
            Submit a Command
          </div>
          <div
            style={{
              fontSize: 38,
              color: '#a1a1aa',
              marginBottom: 48,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Share a useful Cursor command with the community. Your submission will be reviewed before being published.
          </div>
          <div
            style={{
              display: 'flex',
              gap: 32,
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
                padding: '16px 32px',
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
              <div>Share Your Knowledge</div>
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
