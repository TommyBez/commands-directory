import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CommandCard } from '@/components/command-card'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'

export const metadata: Metadata = {
  title: 'My Favorites',
  description:
    'View and manage your bookmarked Cursor commands for quick access.',
  openGraph: {
    title: 'My Favorites - Cursor Commands Explorer',
    description:
      'View and manage your bookmarked Cursor commands for quick access.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function FavoritesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in?redirect_url=/favorites')
  }

  const userBookmarks = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, userId),
    with: {
      command: {
        with: {
          category: true,
          tags: {
            with: {
              tag: true,
            },
          },
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  })

  return (
    <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl">My Favorites</h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            Commands you've bookmarked for quick access
          </p>
        </div>

        {userBookmarks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-muted-foreground text-sm sm:text-base">
              You haven't bookmarked any commands yet.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/commands">Browse Commands</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {userBookmarks.map((bookmark) => (
              <CommandCard
                command={bookmark.command}
                isBookmarked={true}
                key={bookmark.command.id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
