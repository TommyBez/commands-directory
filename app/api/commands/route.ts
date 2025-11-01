import { auth } from '@clerk/nextjs/server'
import { and, eq, ilike, inArray, or, type SQL, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { categories } from '@/db/schema/categories'
import { commandTagMap, commandTags } from '@/db/schema/command-tags'
import { commands } from '@/db/schema/commands'
import { getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

function parseQueryParams(searchParams: URLSearchParams) {
  const q = searchParams.get('q')
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const page = Number.parseInt(searchParams.get('page') || '1', 10)
  const limit = Number.parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  return { q, category, tag, page, limit, offset }
}

async function buildWhereConditions(
  q: string | null,
  category: string | null,
  tag: string | null,
): Promise<SQL<unknown>[]> {
  const conditions: SQL<unknown>[] = []

  // Only show approved commands in public listing
  conditions.push(eq(commands.status, 'approved'))

  // Text search across title, description, and content
  if (q) {
    const searchCondition = or(
      ilike(commands.title, `%${q}%`),
      ilike(commands.description, `%${q}%`),
      ilike(commands.content, `%${q}%`),
    )
    if (searchCondition) {
      conditions.push(searchCondition)
    }
  }

  // Category filter
  if (category) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, category),
    })
    if (cat) {
      conditions.push(eq(commands.categoryId, cat.id))
    }
  }

  // Tag filter
  if (tag) {
    const tagRecord = await db.query.commandTags.findFirst({
      where: eq(commandTags.slug, tag),
    })
    if (tagRecord) {
      const commandIds = await db
        .select({ commandId: commandTagMap.commandId })
        .from(commandTagMap)
        .where(eq(commandTagMap.tagId, tagRecord.id))

      if (commandIds.length > 0) {
        conditions.push(
          inArray(
            commands.id,
            commandIds.map((c) => c.commandId),
          ),
        )
      }
    }
  }

  return conditions
}

async function executeCommandsQuery(
  whereClause: SQL | undefined,
  limit: number,
  offset: number,
) {
  const [results, totalCount] = await Promise.all([
    db.query.commands.findMany({
      where: whereClause,
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
      .where(whereClause)
      .then((res) => Number(res[0]?.count || 0)),
  ])

  return { results, totalCount }
}

async function getBookmarkedCommandIds(
  profileId: string | null,
): Promise<string[]> {
  if (!profileId) {
    return []
  }

  const userBookmarks = await db
    .select({ commandId: bookmarks.commandId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, profileId))

  return userBookmarks.map((b) => b.commandId)
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    const profile = clerkId ? await getUserProfile(clerkId) : null
    const { q, category, tag, page, limit, offset } = parseQueryParams(
      request.nextUrl.searchParams,
    )

    const conditions = await buildWhereConditions(q, category, tag)
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const { results, totalCount } = await executeCommandsQuery(
      whereClause,
      limit,
      offset,
    )
    const bookmarkedCommandIds = await getBookmarkedCommandIds(
      profile?.id ?? null,
    )

    // Add isBookmarked flag to each command
    const commandsWithBookmarks = results.map((command) => ({
      ...command,
      isBookmarked: bookmarkedCommandIds.includes(command.id),
    }))

    return NextResponse.json({
      data: commandsWithBookmarks,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    logger.error('Error fetching commands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commands' },
      { status: 500 },
    )
  }
}
