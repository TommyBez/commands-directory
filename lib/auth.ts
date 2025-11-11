import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type UserProfile, userProfiles } from '@/db/schema/user-profiles'
import { logger } from '@/lib/logger'

function isAuthUnavailableError(error: unknown): error is Error {
  if (error instanceof Error) {
    const message = error.message || ''
    return (
      message.includes('Clerk: auth()') ||
      message.includes('Clerk: currentUser()') ||
      message.includes('During prerendering')
    )
  }

  return false
}

let hasLoggedAuthWarning = false

export async function getOptionalClerkId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId ?? null
  } catch (error) {
    if (isAuthUnavailableError(error)) {
      if (!hasLoggedAuthWarning) {
        logger.debug(
          'Clerk auth unavailable in this render context, defaulting to anonymous user.',
        )
        hasLoggedAuthWarning = true
      }
      return null
    }

    logger.error('Unexpected Clerk auth error', error)
    throw error
  }
}

export async function checkAdminAccess(
  clerkId: string | null,
): Promise<boolean> {
  if (!clerkId) {
    return false
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.clerkId, clerkId),
  })

  return profile?.role === 'admin'
}

export async function getUserProfile(
  clerkId: string | null,
): Promise<UserProfile | null> {
  if (!clerkId) {
    return null
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.clerkId, clerkId),
  })

  return profile ?? null
}
