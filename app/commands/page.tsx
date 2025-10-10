import { auth } from '@clerk/nextjs/server'
import { and, eq, ilike, inArray, or, sql, type SQL } from 'drizzle-orm'
import Link from 'next/link'
import { CommandCard } from '@/components/command-card'
import { CommandFilters } from '@/components/command-filters'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { categories } from '@/db/schema/categories'
import { commandTagMap, commandTags } from '@/db/schema/command-tags'
import { commands } from '@/db/schema/commands'
import type { Command } from '@/db/schema/commands'

type PageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
    page?: string
  }>
}

type CommandWithRelations = Command & {
  category?: { name: string; slug: string } | null
  tags?: Array<{ tag: { name: string; slug: string } }>
  isBookmarked?: boolean
}

export default async function CommandsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { userId } = await auth()

  // Parse query params
  const q = params.q
  const category = params.category
  const tag = params.tag
  const page = Number.parseInt(params.page || '1', 10)
  const limit = 20
  const offset = (page - 1) * limit

  // Build where conditions
  const conditions: SQL<unknown>[] = []
  conditions.push(eq(commands.status, 'approved'))

  // Text search
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

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute queries
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

  // Get bookmarks
  let bookmarkedCommandIds: string[] = []
  if (userId) {
    const userBookmarks = await db
      .select({ commandId: bookmarks.commandId })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
    bookmarkedCommandIds = userBookmarks.map((b) => b.commandId)
  }

  // Add isBookmarked flag
  const commandsWithBookmarks = results.map((command) => ({
    ...command,
    isBookmarked: bookmarkedCommandIds.includes(command.id),
  }))

  // Build pagination
  const pagination = {
    page,
    total: totalCount,
    totalPages: Math.ceil(totalCount / limit),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-bold text-3xl">Search Commands</h2>
            <SearchBar />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <CommandFilters />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Found {pagination.total} command
                {pagination.total !== 1 ? 's' : ''}
              </p>
              <p className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>

            {commandsWithBookmarks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No commands found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {commandsWithBookmarks.map((command) => (
                  <CommandCard
                    command={command}
                    isBookmarked={command.isBookmarked}
                    key={command.id}
                  />
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                {pagination.page > 1 && (
                  <Button asChild variant="outline">
                    <Link
                      href={`/commands?${new URLSearchParams({ ...params, page: String(pagination.page - 1) }).toString()}`}
                    >
                      Previous
                    </Link>
                  </Button>
                )}
                {pagination.page < pagination.totalPages && (
                  <Button asChild variant="outline">
                    <Link
                      href={`/commands?${new URLSearchParams({ ...params, page: String(pagination.page + 1) }).toString()}`}
                    >
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
