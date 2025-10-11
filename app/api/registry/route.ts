import { eq, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { commands } from '@/db/schema/commands'
import { logger } from '@/lib/logger'

/**
 * GET /api/registry
 * Returns a list of all available registry items (approved commands)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(searchParams.get('limit') || '100', 10)
    const offset = (page - 1) * limit

    // Fetch approved commands with their relationships
    const [approvedCommands, totalCount] = await Promise.all([
      db.query.commands.findMany({
        where: eq(commands.status, 'approved'),
        limit,
        offset,
        with: {
          category: true,
          tags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(commands)
        .where(eq(commands.status, 'approved'))
        .then((res) => Number(res[0]?.count || 0)),
    ])

    // Transform commands into registry items
    const registryItems = approvedCommands.map((command) => ({
      name: command.slug,
      type: 'registry:file' as const,
      title: command.title,
      description: command.description || undefined,
      categories: command.category
        ? [command.category.slug]
        : command.tags.length > 0
          ? command.tags.map((t) => t.tag.slug)
          : undefined,
      meta: {
        commandId: command.id,
        categoryName: command.category?.name,
        tags: command.tags.map((t) => ({
          name: t.tag.name,
          slug: t.tag.slug,
        })),
        createdAt: command.createdAt.toISOString(),
        updatedAt: command.updatedAt.toISOString(),
      },
    }))

    return NextResponse.json(
      {
        items: registryItems,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch (error) {
    logger.error('Error fetching registry items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registry items' },
      { status: 500 },
    )
  }
}
