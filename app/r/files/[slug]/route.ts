import { cacheLife, cacheTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { logger } from '@/lib/logger'

/**
 * GET /api/registry/files/[slug]
 * Returns the actual file content for a command
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext<'/r/files/[slug]'>,
) {
  'use cache'
  cacheLife('hours')
  cacheTag('registry')
  try {
    const { slug } = await context.params

    cacheTag(`registry:item:${slug}`)

    // Fetch the command from the database
    const command = await db.query.commands.findFirst({
      where: eq(commands.slug, slug),
    })

    // Only return approved commands in the registry
    if (!command || command.status !== 'approved') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Return the command content as markdown
    return new NextResponse(command.content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `inline; filename="${command.slug}.md"`,
      },
    })
  } catch (error) {
    logger.error('Error fetching registry file:', error)
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}
