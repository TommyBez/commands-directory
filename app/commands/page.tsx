import Link from 'next/link'
import { CommandCard } from '@/components/command-card'
import { CommandFilters } from '@/components/command-filters'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
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
  const queryString = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string>,
    ),
  ).toString()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/commands?${queryString}`,
    { cache: 'no-store' },
  )

  const { data: commands, pagination } = (await response.json()) as {
    data: CommandWithRelations[]
    pagination: { total: number; page: number; totalPages: number }
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

            {commands.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No commands found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {commands.map((command) => (
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
