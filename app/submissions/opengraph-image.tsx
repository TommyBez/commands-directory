import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'My Submissions - Cursor Commands Explorer'
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
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
              fontSize: 96,
              marginBottom: 40,
            }}
          >
            📝
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 32,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            My Submissions
          </div>
          <div
            style={{
              fontSize: 38,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 60,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Track the status of Cursor commands you've submitted to the community
          </div>
          <div
            style={{
              display: 'flex',
              gap: 32,
              fontSize: 28,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(255,255,255,0.2)',
                padding: '16px 28px',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 36 }}>✅</div>
              <div>Track Status</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(255,255,255,0.2)',
                padding: '16px 28px',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 36 }}>📊</div>
              <div>View Progress</div>
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
