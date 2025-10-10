import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { bookmarks, commands } from '@/db/schema'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { userId } = await auth()
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

    // Find related commands (same category or tags)
    const relatedCommands = command.categoryId
      ? await db.query.commands.findMany({
          where: eq(commands.categoryId, command.categoryId),
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

    const relatedWithBookmarks = related.map((cmd) => ({
      ...cmd,
      isBookmarked: bookmarkedCommandIds.includes(cmd.id),
    }))

    return NextResponse.json({
      data: commandWithBookmark,
      related: relatedWithBookmarks,
    })
  } catch (error) {
    console.error('Error fetching command:', error)
    return NextResponse.json(
      { error: 'Failed to fetch command' },
      { status: 500 },
    )
  }
}
