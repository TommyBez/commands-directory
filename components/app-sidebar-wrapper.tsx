import { auth } from '@clerk/nextjs/server'
import { AppSidebar } from '@/components/app-sidebar'
import { getUserProfile } from '@/lib/auth'

export async function AppSidebarWrapper() {
  const { userId: clerkId } = await auth()

  let isAdmin = false

  if (clerkId) {
    const profile = await getUserProfile(clerkId)
    isAdmin = profile?.role === 'admin'
  }

  return <AppSidebar isAdmin={isAdmin} />
}
