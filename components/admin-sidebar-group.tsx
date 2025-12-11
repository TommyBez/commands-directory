import { auth } from '@clerk/nextjs/server'
import { SidebarMenuItemLink } from '@/components/sidebar-menu-item'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserProfile } from '@/lib/auth'

const adminNavItems = [
  {
    title: 'Admin Panel',
    url: '/admin/commands',
    icon: 'shield' as const,
  },
]

export function AdminSidebarGroupSkeleton() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Skeleton className="h-4 w-12" />
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuSkeleton key={item.title} showIcon />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export async function AdminSidebarGroup() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return null
  }
  const profile = await getUserProfile(clerkId)
  const isAdmin = profile?.role === 'admin'
  if (!isAdmin) {
    return null
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItemLink
              icon={item.icon}
              key={item.title}
              title={item.title}
              url={item.url}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
