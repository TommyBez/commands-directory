import { auth } from '@clerk/nextjs/server'
import { AppSidebar } from '@/components/app-sidebar'
import { db } from '@/db'
import { getUserProfile } from '@/lib/auth'

export async function AppSidebarWrapper() {
  const { userId: clerkId } = await auth()

  let isAdmin = false

  if (clerkId) {
    const profile = await getUserProfile(clerkId)
    isAdmin = profile?.role === 'admin'
  }

  // Fetch all categories
  const allCategories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  })

  return <AppSidebar categories={allCategories} isAdmin={isAdmin} />
}
