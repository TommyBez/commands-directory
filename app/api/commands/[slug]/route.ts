import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { commands } from '@/db/schema/commands'
import { getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<'/api/commands/[slug]'>,
) {
  try {
    const { userId: clerkId } = await auth()
    const profile = clerkId ? await getUserProfile(clerkId) : null
    const { slug } = await params

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
      return NextResponse.json({ error: 'Command not found' }, { status: 404 })
    }

    // Check visibility: approved OR (user is owner OR admin)
    const isApproved = command.status === 'approved'

    let canView = isApproved
    if (!canView && profile) {
      const isOwner = command.submittedByUserId === profile.id
      if (isOwner) {
        canView = true
      } else {
        canView = profile.role === 'admin'
      }
    }

    if (!canView) {
      return NextResponse.json({ error: 'Command not found' }, { status: 404 })
    }

    // Find related commands (same category or tags, only approved)
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
    const related = relatedCommands.filter((c) => c.id !== command.id)

    // Get bookmarked command IDs if user is authenticated
    let bookmarkedCommandIds: string[] = []
    if (profile) {
      const userBookmarks = await db
        .select({ commandId: bookmarks.commandId })
        .from(bookmarks)
        .where(eq(bookmarks.userId, profile.id))
      bookmarkedCommandIds = userBookmarks.map((b) => b.commandId)
    }

    // Add isBookmarked flag to command and related commands
    const commandWithBookmark = {
      ...command,
      isBookmarked: bookmarkedCommandIds.includes(command.id),
    }

    const relatedWithBookmarks = related.map((cmd) => ({
      ...cmd,
      isBookmarked: bookmarkedCommandIds.includes(cmd.id),
    }))

    return NextResponse.json({
      data: commandWithBookmark,
      related: relatedWithBookmarks,
    })
  } catch (error) {
    logger.error('Error fetching command:', error)
    return NextResponse.json(
      { error: 'Failed to fetch command' },
      { status: 500 },
    )
  }
}
