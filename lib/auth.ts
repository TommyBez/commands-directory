import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { userProfiles } from '@/db/schema/user-profiles'

export async function checkAdminAccess(
  userId: string | null,
): Promise<boolean> {
  if (!userId) {
    return false
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  })

  return profile?.role === 'admin'
}
