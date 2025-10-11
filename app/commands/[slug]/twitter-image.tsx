import { ImageResponse } from 'next/og'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'

export const alt = 'Command Detail - Cursor Commands Explorer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  // Fetch command details
  const command = await db.query.commands.findFirst({
    where: eq(commands.slug, slug),
    with: {
      category: true,
    },
  })

  const title = command?.title || 'Command Not Found'
  const description = command?.description || 'Discover Cursor commands'
  const categoryName = command?.category?.name || ''

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {categoryName && (
            <div
              style={{
                fontSize: 28,
                color: '#71717a',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  background: '#18181b',
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: '1px solid #27272a',
                }}
              >
                {categoryName}
              </div>
            </div>
          )}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: 24,
              lineHeight: 1.2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 32,
                color: '#a1a1aa',
                lineHeight: 1.4,
                maxWidth: 900,
              }}
            >
              {description.length > 150
                ? `${description.slice(0, 150)}...`
                : description}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            color: '#71717a',
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
          <div>Cursor Commands Explorer</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
