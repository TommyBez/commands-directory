import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type UserProfile, userProfiles } from '@/db/schema/user-profiles'

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
