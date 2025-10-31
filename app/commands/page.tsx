import { auth } from '@clerk/nextjs/server'
import { and, eq, ilike, inArray, or, type SQL, sql } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CommandCard } from '@/components/command-card'
import { CommandFilters } from '@/components/command-filters'
import { CommandsSearchInput } from '@/components/commands-search-input'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { categories } from '@/db/schema/categories'
import { commandTagMap, commandTags } from '@/db/schema/command-tags'
import { commands } from '@/db/schema/commands'
import { getUserProfile } from '@/lib/auth'
import { loadCommandsSearchParams } from '@/lib/search-params'

export const metadata: Metadata = {
  title: 'Browse Commands',
  description:
    'Search and discover Cursor commands. Filter by category and tags to find the perfect command for your workflow.',
  openGraph: {
    title: 'Browse Commands - Cursor Commands Explorer',
    description:
      'Search and discover Cursor commands. Filter by category and tags to find the perfect command for your workflow.',
  },
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function buildWhereConditions(params: {
  q: string
  category: string
  tag: string
}): Promise<SQL<unknown> | undefined> {
  const conditions: SQL<unknown>[] = [eq(commands.status, 'approved')]

  if (params.q.trim()) {
    const searchCondition = or(
      ilike(commands.title, `%${params.q}%`),
      ilike(commands.description, `%${params.q}%`),
      ilike(commands.content, `%${params.q}%`),
    )
    if (searchCondition) {
      conditions.push(searchCondition)
    }
  }

  if (params.category.trim()) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, params.category),
    })
    if (cat) {
      conditions.push(eq(commands.categoryId, cat.id))
    }
  }

  if (params.tag.trim()) {
    const tagRecord = await db.query.commandTags.findFirst({
      where: eq(commandTags.slug, params.tag),
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

  return conditions.length > 0 ? and(...conditions) : undefined
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

export default async function CommandsPage({ searchParams }: PageProps) {
  const { userId: clerkId } = await auth()
  const profile = clerkId ? await getUserProfile(clerkId) : null

  // Load and parse search params using nuqs loader
  const { q, category, tag, page } =
    await loadCommandsSearchParams(searchParams)
  const limit = 20
  const offset = (page - 1) * limit

  const whereClause = await buildWhereConditions({ q, category, tag })

  const [results, totalCount, bookmarkedCommandIds] = await Promise.all([
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
        submittedBy: true,
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(commands)
      .where(whereClause)
      .then((res) => Number(res[0]?.count || 0)),
    getBookmarkedCommandIds(profile?.id ?? null),
  ])

  const commandsWithBookmarks = results.map((command) => ({
    ...command,
    isBookmarked: bookmarkedCommandIds.includes(command.id),
  }))

  const pagination = {
    page,
    total: totalCount,
    totalPages: Math.ceil(totalCount / limit),
  }

  return (
    <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="font-bold text-2xl sm:text-3xl">Search Commands</h2>
          <CommandsSearchInput />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-base sm:text-lg">Filters</h3>
          <CommandFilters />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
            <div className="flex flex-col gap-2 pt-6 sm:flex-row sm:justify-center sm:gap-2 sm:pt-8">
              {pagination.page > 1 && (
                <Button asChild className="w-full sm:w-auto" variant="outline">
                  <Link
                    href={`/commands?${new URLSearchParams(
                      Object.entries({
                        q,
                        category,
                        tag,
                        page: String(pagination.page - 1),
                      }).filter(([, value]) => value),
                    ).toString()}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              {pagination.page < pagination.totalPages && (
                <Button asChild className="w-full sm:w-auto" variant="outline">
                  <Link
                    href={`/commands?${new URLSearchParams(
                      Object.entries({
                        q,
                        category,
                        tag,
                        page: String(pagination.page + 1),
                      }).filter(([, value]) => value),
                    ).toString()}`}
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
  )
}
