'use server'

import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarks } from '@/db/schema/bookmarks'
import { getOptionalClerkId, getUserProfile } from '@/lib/auth'
import { logger } from '@/lib/logger'

type BookmarkRecord = typeof bookmarks.$inferSelect

type BookmarkResult =
  | { ok: true; data: BookmarkRecord }
  | { ok: false; error: string; status?: number }

type DeleteBookmarkResult =
  | { ok: true }
  | { ok: false; error: string; status?: number }

export async function addBookmark(commandId: string): Promise<BookmarkResult> {
  try {
    const clerkId = await getOptionalClerkId()

    if (!clerkId) {
      return { ok: false, error: 'Unauthorized', status: 401 }
    }

    const profile = await getUserProfile(clerkId)
    if (!profile) {
      return { ok: false, error: 'Profile not found', status: 404 }
    }

    if (!commandId) {
      return { ok: false, error: 'commandId is required', status: 400 }
    }

    // Check if bookmark already exists
    const existing = await db.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.userId, profile.id),
        eq(bookmarks.commandId, commandId),
      ),
    })

    if (existing) {
      return { ok: false, error: 'Bookmark already exists', status: 409 }
    }

    const [bookmark] = await db
      .insert(bookmarks)
      .values({ userId: profile.id, commandId })
      .returning()

    return { ok: true, data: bookmark }
  } catch (error) {
    logger.error('Error creating bookmark:', error)
    return { ok: false, error: 'Failed to create bookmark', status: 500 }
  }
}

export async function deleteBookmark(
  commandId: string,
): Promise<DeleteBookmarkResult> {
  try {
    const clerkId = await getOptionalClerkId()

    if (!clerkId) {
      return { ok: false, error: 'Unauthorized', status: 401 }
    }

    const profile = await getUserProfile(clerkId)
    if (!profile) {
      return { ok: false, error: 'Profile not found', status: 404 }
    }

    if (!commandId) {
      return { ok: false, error: 'commandId is required', status: 400 }
    }

    await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, profile.id),
          eq(bookmarks.commandId, commandId),
        ),
      )

    return { ok: true }
  } catch (error) {
    logger.error('Error deleting bookmark:', error)
    return { ok: false, error: 'Failed to delete bookmark', status: 500 }
  }
}
