import { Suspense } from 'react'
import {
  AdminSidebarGroup,
  AdminSidebarGroupSkeleton,
} from '@/components/admin-sidebar-group'
import { SidebarMenuItemLink } from '@/components/sidebar-menu-item'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSkeleton,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  UserSidebarGroup,
  UserSidebarGroupSkeleton,
} from '@/components/user-sidebar-group'
import { db } from '@/db'

async function getCategories() {
  'use cache'
  return await db.query.categories.findMany({
    orderBy: (categoryTable, { asc }) => [asc(categoryTable.name)],
  })
}

export async function AppSidebar() {
  const categories = await getCategories()

  const mainNavItems = [
    {
      title: 'Home',
      url: '/',
      icon: 'home' as const,
    },
    {
      title: 'Browse Commands',
      url: '/commands',
      icon: 'search' as const,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <Suspense
                  fallback={<SidebarMenuSkeleton showIcon />}
                  key={item.title}
                >
                  <SidebarMenuItemLink
                    icon={item.icon}
                    key={item.title}
                    title={item.title}
                    url={item.url}
                  />
                </Suspense>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories Navigation */}
        {categories.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => {
                  const categoryUrl = `/commands?category=${category.slug}`
                  return (
                    <Suspense
                      fallback={<SidebarMenuSkeleton showIcon />}
                      key={category.id}
                    >
                      <SidebarMenuItemLink
                        icon="folder"
                        key={category.id}
                        title={category.name}
                        tooltip={category.description ?? category.name}
                        url={categoryUrl}
                      />
                    </Suspense>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Navigation - Only show when signed in */}
        <Suspense fallback={<UserSidebarGroupSkeleton />}>
          <UserSidebarGroup />
        </Suspense>

        {/* Admin Navigation - Only show for admins */}
        <Suspense fallback={<AdminSidebarGroupSkeleton />}>
          <AdminSidebarGroup />
        </Suspense>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
