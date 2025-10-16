import { ImageResponse } from 'next/og'

export const alt = 'Browse Commands - Cursor Commands Explorer'
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
          Browse Commands
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#a1a1aa',
            marginBottom: 60,
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Search and discover Cursor commands. Filter by category and tags to
          find the perfect command for your workflow.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 28,
            color: '#71717a',
            flexWrap: 'wrap',
            justifyContent: 'center',
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
            <div>Search</div>
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
            <div>Filter by Tags</div>
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
            <div>Categories</div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
