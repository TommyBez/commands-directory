import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CommandCard } from '@/components/command-card'
import { Button } from '@/components/ui/button'

export default async function FavoritesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in?redirect_url=/favorites')
  }
  const cookieStore = await cookies()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/bookmarks`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    },
  )

  const { data: bookmarks } = await response.json()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div>
            <h1 className="font-bold text-3xl">My Favorites</h1>
            <p className="mt-2 text-muted-foreground">
              Commands you've bookmarked for quick access
            </p>
          </div>

          {bookmarks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                You haven't bookmarked any commands yet.
              </p>
              <Button asChild>
                <Link href="/commands">Browse Commands</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark: Record<string, never>) => (
                <CommandCard
                  command={
                    bookmark.command as Parameters<
                      typeof CommandCard
                    >[0]['command']
                  }
                  isBookmarked={true}
                  key={(bookmark.command as { id: string }).id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
