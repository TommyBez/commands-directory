import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { AppSidebar } from '@/components/app-sidebar'
import { db } from '@/db'
import { userProfiles } from '@/db/schema/user-profiles'

export async function AppSidebarWrapper() {
  const { userId } = await auth()

  let isAdmin = false

  if (userId) {
    const profile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    })
    isAdmin = profile?.role === 'admin'
  }

  return <AppSidebar isAdmin={isAdmin} />
}
