import { auth } from '@clerk/nextjs/server'
import { and, eq, ilike, inArray, or, type SQL, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { categories } from '@/db/schema/categories'
import { commandTagMap, commandTags } from '@/db/schema/command-tags'
import { commands } from '@/db/schema/commands'
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
  userId: string | null,
): Promise<string[]> {
  if (!userId) {
    return []
  }

  const userBookmarks = await db
    .select({ commandId: bookmarks.commandId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))

  return userBookmarks.map((b) => b.commandId)
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function generateUniqueSlug(baseTitle: string): Promise<string> {
  let slug = generateSlug(baseTitle)
  let counter = 2

  // Check if slug exists
  while (true) {
    const existing = await db.query.commands.findFirst({
      where: eq(commands.slug, slug),
    })
    if (!existing) {
      return slug
    }
    slug = `${generateSlug(baseTitle)}-${counter}`
    counter++
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
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
    const bookmarkedCommandIds = await getBookmarkedCommandIds(userId)

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

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 500
const MAX_CONTENT_LENGTH = 10_000

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, categoryId } = body

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (
      !content ||
      typeof content !== 'string' ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 },
      )
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `Title must be ${MAX_TITLE_LENGTH} characters or less` },
        { status: 400 },
      )
    }

    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`,
        },
        { status: 400 },
      )
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content must be ${MAX_CONTENT_LENGTH} characters or less` },
        { status: 400 },
      )
    }

    // Validate category if provided
    if (categoryId) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId),
      })
      if (!category) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title)

    // Insert command with pending status
    const [newCommand] = await db
      .insert(commands)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
        content: content.trim(),
        categoryId: categoryId || null,
        slug,
        status: 'pending',
        submittedByUserId: userId,
      })
      .returning()

    return NextResponse.json(
      { data: newCommand, message: 'Command submitted successfully' },
      { status: 201 },
    )
  } catch (error) {
    logger.error('Error creating command:', error)
    return NextResponse.json(
      { error: 'Failed to create command' },
      { status: 500 },
    )
  }
}
