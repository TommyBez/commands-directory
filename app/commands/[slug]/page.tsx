import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import { FlagIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookmarkButton } from '@/components/bookmark-button'
import { CommandCard } from '@/components/command-card'
import { CopyCommandButton } from '@/components/copy-command-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { commands } from '@/db/schema/commands'
import { userProfiles } from '@/db/schema/user-profiles'

const MAX_RELATED_COMMANDS = 4

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function CommandDetailPage({ params }: PageProps) {
  const { slug } = await params
  const { userId } = await auth()

  // Fetch main command
  const command = await db.query.commands.findFirst({
    where: eq(commands.slug, slug),
    with: {
      category: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
  })

  if (!command) {
    notFound()
  }

  // Check visibility: approved OR (user is owner OR admin)
  const isApproved = command.status === 'approved'

  let canView = isApproved
  if (!canView && userId) {
    const isOwner = command.submittedByUserId === userId
    if (isOwner) {
      canView = true
    } else {
      const profile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId),
      })
      canView = profile?.role === 'admin'
    }
  }

  if (!canView) {
    notFound()
  }

  // Find related commands (same category, only approved)
  const relatedCommands = command.categoryId
    ? await db.query.commands.findMany({
        where: and(
          eq(commands.categoryId, command.categoryId),
          eq(commands.status, 'approved'),
        ),
        limit: 5,
        with: {
          category: true,
          tags: {
            with: {
              tag: true,
            },
          },
        },
      })
    : []

  // Filter out the current command
  const relatedFiltered = relatedCommands.filter((c) => c.id !== command.id)

  // Get bookmarked command IDs if user is authenticated
  let bookmarkedCommandIds: string[] = []
  if (userId) {
    const userBookmarks = await db
      .select({ commandId: bookmarks.commandId })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
    bookmarkedCommandIds = userBookmarks.map((b) => b.commandId)
  }

  // Add isBookmarked flag to command and related commands
  const commandWithBookmark = {
    ...command,
    isBookmarked: bookmarkedCommandIds.includes(command.id),
  }

  const related = relatedFiltered.map((cmd) => ({
    ...cmd,
    isBookmarked: bookmarkedCommandIds.includes(cmd.id),
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
          {/* Breadcrumb */}
          <div className="text-muted-foreground text-xs sm:text-sm">
            <Link className="hover:text-foreground" href="/commands">
              Commands
            </Link>
            {' / '}
            <span className="truncate text-foreground">{commandWithBookmark.title}</span>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="mb-3 font-bold text-2xl leading-tight sm:mb-4 sm:text-3xl md:text-4xl">
                  {commandWithBookmark.title}
                </h1>
                {commandWithBookmark.description && (
                  <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
                    {commandWithBookmark.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                <BookmarkButton
                  commandId={commandWithBookmark.id}
                  initialBookmarked={commandWithBookmark.isBookmarked}
                  showText={true}
                  size="default"
                  variant="outline"
                />
                <CopyCommandButton content={commandWithBookmark.content} />
              </div>
            </div>

            {/* Command Content */}
            <Card>
              <CardHeader>
                <CardTitle>Command Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4">
                    {commandWithBookmark.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {commandWithBookmark.category && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs sm:text-sm">Category:</span>
                  <Badge variant="secondary">{commandWithBookmark.category.name}</Badge>
                </div>
              )}
              {commandWithBookmark.tags && commandWithBookmark.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-xs sm:text-sm">Tags:</span>
                  {commandWithBookmark.tags.map(
                    (tagRel: { tag: { name: string; slug: string } }) => (
                      <Badge key={tagRel.tag.slug} variant="outline">
                        {tagRel.tag.name}
                      </Badge>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1" size="sm" variant="outline">
                <FlagIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Report Issue</span>
                <span className="sm:hidden">Report</span>
              </Button>
            </div>

            {/* Related Commands */}
            {related && related.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="font-bold text-xl sm:text-2xl">Related Commands</h2>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    {related
                      .slice(0, MAX_RELATED_COMMANDS)
                      .map((cmd) => (
                        <CommandCard
                          command={cmd}
                          isBookmarked={cmd.isBookmarked}
                          key={cmd.id}
                        />
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
